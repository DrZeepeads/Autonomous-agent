import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, Paperclip, Settings, ThumbsUp, ThumbsDown, Copy, Volume2, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { useChatStore } from '@/stores/chatStore'
import { aiService, RAGContext } from '@/services/aiService'
import { renderMarkdown } from '@/lib/markdown'
import { useToast } from '@/hooks/use-toast'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [ragContexts, setRagContexts] = useState<RAGContext[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  
  const {
    messages,
    isLoading,
    isStreaming,
    currentChat,
    addMessage,
    updateLastMessage,
    setIsLoading,
    setIsStreaming,
    createNewChat,
    saveChat
  } = useChatStore()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Create a new chat if none exists
    if (!currentChat && user) {
      createNewChat('New Medical Consultation')
    }
  }, [user, currentChat, createNewChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || isStreaming) return

    const userMessage = {
      role: 'user' as const,
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    // Add user message
    addMessage(userMessage)
    setMessage('')
    setIsLoading(true)

    try {
      // Add empty assistant message that will be updated with streaming content
      const assistantMessage = {
        role: 'assistant' as const,
        content: '',
        timestamp: new Date().toISOString()
      }
      addMessage(assistantMessage)
      
      setIsStreaming(true)
      let fullResponse = ''

      // Stream the AI response
      for await (const chunk of aiService.streamChatResponse(
        userMessage.content,
        (contexts) => setRagContexts(contexts)
      )) {
        if (chunk.done) {
          setIsStreaming(false)
          break
        }

        fullResponse += chunk.content
        updateLastMessage(fullResponse)
      }

      // Save the chat after the conversation
      await saveChat()

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      })
      
      // Add error message
      addMessage({
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: 'Copied',
      description: 'Message copied to clipboard'
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome to Nelson-GPT
              </h2>
              <p className="text-muted-foreground mb-6">
                Your AI-powered pediatric assistant. Ask me anything about pediatric medicine, 
                and I'll provide evidence-based answers from the Nelson Textbook of Pediatrics.
              </p>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="bg-user-bubble p-3 rounded-lg cursor-pointer hover:bg-user-bubble/80 transition-colors"
                     onClick={() => setMessage("What are the signs of dehydration in infants?")}>
                  "What are the signs of dehydration in infants?"
                </div>
                <div className="bg-user-bubble p-3 rounded-lg cursor-pointer hover:bg-user-bubble/80 transition-colors"
                     onClick={() => setMessage("Explain the vaccination schedule for a 2-month-old")}>
                  "Explain the vaccination schedule for a 2-month-old"
                </div>
                <div className="bg-user-bubble p-3 rounded-lg cursor-pointer hover:bg-user-bubble/80 transition-colors"
                     onClick={() => setMessage("What's the normal heart rate range for toddlers?")}>
                  "What's the normal heart rate range for toddlers?"
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-user-bubble text-foreground'
                      : 'bg-ai-bubble text-foreground'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div 
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    
                    {msg.role === 'assistant' && msg.content && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(msg.content)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-ai-bubble p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input Bar */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading || isStreaming}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isStreaming}
              placeholder={
                isLoading || isStreaming 
                  ? "Nelson-GPT is thinking..." 
                  : "Ask me about pediatric medicine..."
              }
              className="bg-input border-border pr-12 disabled:opacity-50"
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoading || isStreaming}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={isLoading || isStreaming}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading || isStreaming}
            size="icon"
            className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        
        {/* RAG Context Display */}
        {ragContexts.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">Sources:</span> {ragContexts.map(ctx => ctx.chapter).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}
