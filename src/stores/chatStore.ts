import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, Chat, ChatMessage } from '@/lib/supabase'

interface ChatState {
  // Current chat state
  currentChat: Chat | null
  messages: ChatMessage[]
  isLoading: boolean
  isStreaming: boolean
  
  // Chat history
  chats: Chat[]
  
  // Actions
  setCurrentChat: (chat: Chat | null) => void
  addMessage: (message: ChatMessage) => void
  updateLastMessage: (content: string) => void
  setIsLoading: (loading: boolean) => void
  setIsStreaming: (streaming: boolean) => void
  
  // Chat management
  createNewChat: (title?: string) => Promise<Chat | null>
  saveChat: () => Promise<void>
  loadChats: () => Promise<void>
  deleteChat: (chatId: string) => Promise<void>
  
  // Clear state
  clearCurrentChat: () => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentChat: null,
      messages: [],
      isLoading: false,
      isStreaming: false,
      chats: [],

      // Basic setters
      setCurrentChat: (chat) => {
        set({ 
          currentChat: chat, 
          messages: chat?.messages || [] 
        })
      },

      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message]
        }))
      },

      updateLastMessage: (content) => {
        set((state) => {
          const messages = [...state.messages]
          if (messages.length > 0) {
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content
            }
          }
          return { messages }
        })
      },

      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsStreaming: (streaming) => set({ isStreaming: streaming }),

      // Chat management
      createNewChat: async (title = 'New Chat') => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return null

          const newChat: Omit<Chat, 'id' | 'created_at' | 'updated_at'> = {
            user_id: user.id,
            title,
            messages: []
          }

          const { data, error } = await supabase
            .from('chats')
            .insert(newChat)
            .select()
            .single()

          if (error) {
            console.error('Error creating chat:', error)
            return null
          }

          const chat = data as Chat
          set((state) => ({
            currentChat: chat,
            messages: [],
            chats: [chat, ...state.chats]
          }))

          return chat
        } catch (error) {
          console.error('Error creating chat:', error)
          return null
        }
      },

      saveChat: async () => {
        const { currentChat, messages } = get()
        if (!currentChat) return

        try {
          const { error } = await supabase
            .from('chats')
            .update({
              messages,
              title: messages.length > 0 
                ? messages[0].content.slice(0, 50) + '...'
                : currentChat.title
            })
            .eq('id', currentChat.id)

          if (error) {
            console.error('Error saving chat:', error)
          }
        } catch (error) {
          console.error('Error saving chat:', error)
        }
      },

      loadChats: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          const { data, error } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })

          if (error) {
            console.error('Error loading chats:', error)
            return
          }

          set({ chats: data as Chat[] })
        } catch (error) {
          console.error('Error loading chats:', error)
        }
      },

      deleteChat: async (chatId: string) => {
        try {
          const { error } = await supabase
            .from('chats')
            .delete()
            .eq('id', chatId)

          if (error) {
            console.error('Error deleting chat:', error)
            return
          }

          set((state) => ({
            chats: state.chats.filter(chat => chat.id !== chatId),
            currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
            messages: state.currentChat?.id === chatId ? [] : state.messages
          }))
        } catch (error) {
          console.error('Error deleting chat:', error)
        }
      },

      clearCurrentChat: () => {
        set({
          currentChat: null,
          messages: [],
          isLoading: false,
          isStreaming: false
        })
      },

      reset: () => {
        set({
          currentChat: null,
          messages: [],
          isLoading: false,
          isStreaming: false,
          chats: []
        })
      }
    }),
    {
      name: 'nelson-gpt-chat-store',
      partialize: (state) => ({
        chats: state.chats,
        currentChat: state.currentChat,
        messages: state.messages
      })
    }
  )
)

