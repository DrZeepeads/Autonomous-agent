import { supabase } from '@/lib/supabase'

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY as string
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'

export interface RAGContext {
  content: string
  chapter: string
  page_number: number
  similarity: number
}

export interface StreamResponse {
  content: string
  done: boolean
}

class AIService {
  private async createEmbedding(text: string): Promise<number[]> {
    // For now, we'll use a simple text-to-vector conversion
    // In production, you'd use a proper embedding service
    const words = text.toLowerCase().split(/\s+/)
    const embedding = new Array(1536).fill(0)
    
    // Simple hash-based embedding (replace with actual embedding service)
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j)
        embedding[i % 1536] += charCode
      }
    }
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map(val => val / magnitude)
  }

  async searchRelevantContent(query: string, limit = 5): Promise<RAGContext[]> {
    try {
      // Create embedding for the query
      const queryEmbedding = await this.createEmbedding(query)
      
      // Search for similar content in the database
      const { data, error } = await supabase.rpc('search_textbook_content', {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: limit
      })

      if (error) {
        console.error('Error searching content:', error)
        return []
      }

      return data.map((item: any) => ({
        content: item.content,
        chapter: item.chapter,
        page_number: item.page_number,
        similarity: item.similarity
      }))
    } catch (error) {
      console.error('Error in searchRelevantContent:', error)
      return []
    }
  }

  private buildRAGPrompt(userQuery: string, contexts: RAGContext[]): string {
    const contextText = contexts
      .map(ctx => `[${ctx.chapter}, Page ${ctx.page_number}]: ${ctx.content}`)
      .join('\n\n')

    return `You are Nelson-GPT, a specialized AI assistant for pediatric healthcare professionals. You provide evidence-based answers sourced exclusively from the Nelson Textbook of Pediatrics.

CONTEXT FROM NELSON TEXTBOOK:
${contextText}

USER QUESTION: ${userQuery}

INSTRUCTIONS:
- Provide accurate, evidence-based medical information
- Reference specific chapters and page numbers when possible
- Use professional medical terminology appropriate for healthcare providers
- If the context doesn't contain sufficient information, clearly state this
- Always emphasize that this is for educational purposes and not a substitute for clinical judgment
- Format your response in clear, readable markdown

RESPONSE:`
  }

  async *streamChatResponse(
    userMessage: string,
    onContext?: (contexts: RAGContext[]) => void
  ): AsyncGenerator<StreamResponse, void, unknown> {
    try {
      // Step 1: Search for relevant content
      const contexts = await this.searchRelevantContent(userMessage)
      onContext?.(contexts)

      // Step 2: Build the prompt with RAG context
      const prompt = this.buildRAGPrompt(userMessage, contexts)

      // Step 3: Stream response from Mistral API
      const response = await fetch(MISTRAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          stream: true,
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          yield { content: '', done: true }
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              yield { content: '', done: true }
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ''
              
              if (content) {
                yield { content, done: false }
              }
            } catch (e) {
              // Skip invalid JSON
              continue
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streamChatResponse:', error)
      yield { 
        content: 'I apologize, but I encountered an error while processing your request. Please try again.', 
        done: true 
      }
    }
  }

  async addTextbookContent(
    chapter: string,
    pageNumber: number,
    content: string,
    metadata: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const embedding = await this.createEmbedding(content)
      
      const { error } = await supabase
        .from('textbook_content')
        .insert({
          chapter,
          page_number: pageNumber,
          content,
          embedding,
          metadata
        })

      if (error) {
        console.error('Error adding textbook content:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in addTextbookContent:', error)
      return false
    }
  }

  async getTextbookChapters(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('textbook_content')
        .select('chapter')
        .order('chapter')

      if (error) {
        console.error('Error getting chapters:', error)
        return []
      }

      const uniqueChapters = [...new Set(data.map(item => item.chapter))]
      return uniqueChapters
    } catch (error) {
      console.error('Error in getTextbookChapters:', error)
      return []
    }
  }
}

export const aiService = new AIService()
