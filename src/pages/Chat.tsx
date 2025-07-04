import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, Paperclip, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessage('')
    
    // TODO: Implement AI response
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
                <div className="bg-user-bubble p-3 rounded-lg">
                  "What are the signs of dehydration in infants?"
                </div>
                <div className="bg-user-bubble p-3 rounded-lg">
                  "Explain the vaccination schedule for a 2-month-old"
                </div>
                <div className="bg-user-bubble p-3 rounded-lg">
                  "What's the normal heart rate range for toddlers?"
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={msg.id}
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
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Message Input Bar */}
      <div className="border-t border-border p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about pediatric medicine..."
              className="bg-input border-border pr-12"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mic className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

