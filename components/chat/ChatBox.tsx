'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Check, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface Message {
  id: string
  repair_request_id: string
  sender_id: string
  sender_type: 'admin' | 'user'
  message: string
  is_read: boolean
  created_at: string
}

interface ChatBoxProps {
  repairId: string
  currentUserType: 'admin' | 'user'
}

export default function ChatBox({ repairId, currentUserType }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)
  const previousMessageCount = useRef(0)
  
  const supabase = createClient()

  // Pobieranie wiadomości
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/repairs/${repairId}/messages`)
      if (!response.ok) throw new Error('Błąd pobierania wiadomości')

      const data = await response.json()
      setMessages(data.messages || [])
      previousMessageCount.current = data.messages?.length || 0
    } catch (error) {
      console.error('Błąd:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [repairId])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`repair_messages:${repairId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'repair_messages',
          filter: `repair_request_id=eq.${repairId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message
            setMessages((prev) => [...prev, newMsg])
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Message
            setMessages((prev) =>
              prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [repairId])

  // Auto-scroll TYLKO gdy przychodzi NOWA wiadomość
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    if (messages.length > previousMessageCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      previousMessageCount.current = messages.length
    }
  }, [messages])

  // Oznaczanie wiadomości jako przeczytane
  useEffect(() => {
    const markAsRead = async () => {
      try {
        await fetch(`/api/repairs/${repairId}/messages/read`, {
          method: 'PATCH',
        })
      } catch (error) {
        console.error('Błąd oznaczania jako przeczytane:', error)
      }
    }

    if (messages.length > 0) {
      markAsRead()
    }
  }, [messages, repairId])

  // Wysyłanie wiadomości
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch(`/api/repairs/${repairId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() }),
      })

      if (!response.ok) throw new Error('Błąd wysyłania wiadomości')

      setNewMessage('')
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się wysłać wiadomości')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header - KOMPAKTOWY */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 sm:px-6 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6" />
          <div>
            <h3 className="text-sm sm:text-lg font-semibold">Czat z serwisem</h3>
            <p className="text-[10px] sm:text-sm text-blue-100">
              {messages.length} {messages.length === 1 ? 'wiadomość' : 'wiadomości'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages - LEWO/PRAWO */}
      <div className="h-[200px] sm:h-[500px] overflow-y-auto p-3 sm:p-6 space-y-2 sm:space-y-4 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2 text-gray-400" />
            <p className="text-xs sm:text-sm">Brak wiadomości</p>
            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">Rozpocznij rozmowę poniżej</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              // Czy to wiadomość wysłana przez current user?
              const isOwnMessage = msg.sender_type === currentUserType
              
              // Kolory:
              // - Admin (zawsze niebieski) po lewej
              // - User (zawsze pomarańczowy) po prawej
              let bgColor: string
              let textColor: string
              
              if (msg.sender_type === 'admin') {
                bgColor = 'bg-blue-600'
                textColor = 'text-white'
              } else {
                bgColor = 'bg-orange-600'
                textColor = 'text-white'
              }

              // Alignment:
              // - Admin po lewej (justify-start)
              // - User po prawej (justify-end)
              const alignment = msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'

              return (
                <div key={msg.id} className={`flex ${alignment}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 ${bgColor} ${textColor} ${msg.sender_type === 'admin' ? 'rounded-bl-sm' : 'rounded-br-sm'}`}>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                    
                    {/* Czas + Status odczytano */}
                    <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                      <p className={`text-[9px] sm:text-xs ${textColor === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>
                        {format(new Date(msg.created_at), 'dd MMM yyyy, HH:mm', { locale: pl })}
                      </p>
                      
                      {/* Status odczytano - TYLKO dla wiadomości wysłanych przez current user */}
                      {isOwnMessage && (
                        <span className={msg.is_read ? 'text-blue-200' : 'text-white/50'}>
                          {msg.is_read ? (
                            <CheckCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          ) : (
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input - KOMPAKTOWY */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2 sm:p-4 bg-white">
        <div className="flex gap-1.5 sm:gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            disabled={sending}
            className="flex-1 px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-3 py-1.5 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 sm:gap-2"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Wyślij</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}