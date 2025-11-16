'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ArrowRight,
  MessageSquare,
  User,
  Sparkles,
  Loader2,
  Send
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const placeholders = [
    "Opisz problem z drukarką...",
    "Opisz problem z terminalem...",
    "Opisz problem ze skanerem..."
  ]

  // Show button logic:
  // 1. Minimum 6 messages (3 exchanges)
  // 2. Last message is from AI
  // 3. Last AI message is NOT a question (no "?")
  // 4. NOT currently loading (prevents button disappearing during streaming)
  const messageCount = messages.length
  const lastMessage = messages[messages.length - 1]
  const isLastMessageAI = lastMessage?.role === 'assistant'
  const lastMessageIsQuestion = lastMessage?.content?.includes('?') || false
  
  const shouldShowFormButton = 
    messageCount >= 6 && 
    isLastMessageAI && 
    !lastMessageIsQuestion &&
    !loading  // Don't show during streaming

  // Auto-scroll ONLY the chat container, NOT the whole page
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages, loading])

  const scrollToForm = () => {
    const formElement = document.getElementById('repair-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    let charIndex = 0
    const currentText = placeholders[placeholderIndex]
    
    const typingInterval = setInterval(() => {
      if (charIndex <= currentText.length) {
        setCurrentPlaceholder(currentText.slice(0, charIndex))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [placeholderIndex])

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || loading) return

    setInput('')
    
    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      if (!response.ok) throw new Error('API error')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      if (reader) {
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          assistantMessage += decoder.decode(value)
          
          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content: assistantMessage }
          ])
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'Przepraszam, wystąpił błąd. Spróbuj ponownie lub wypełnij formularz zgłoszeniowy.' 
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {messages.length > 0 && (
          <div 
            ref={messagesContainerRef}
            className="max-h-96 overflow-y-auto p-8 space-y-4"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-3xl px-5 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>

                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-3xl px-5 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* BUTTON "Wyślij do serwisu" - pokazuje się po konkluzji AI (nie po pytaniu) */}
            {shouldShowFormButton && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={scrollToForm}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  <Send className="w-5 h-5" />
                  Wyślij do serwisu
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="p-8 border-t border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPlaceholder}
              className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-3"
              disabled={loading}
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-gray-600 font-medium pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Wstępna diagnoza w 2 min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
              <span>24/7 dostępny</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}