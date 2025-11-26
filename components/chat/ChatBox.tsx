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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <div>
            <h3 className="text-sm font-semibold">Czat z serwisem</h3>
            <p className="text-[10px] text-blue-100">
              {messages.length} {messages.length === 1 ? 'wiadomość' : 'wiadomości'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-8 h-8 mb-1 text-gray-400" />
            <p className="text-xs">Brak wiadomości</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Rozpocznij rozmowę poniżej</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isOwnMessage = msg.sender_type === currentUserType
              
              let bgColor: string
              let textColor: string
              
              if (msg.sender_type === 'admin') {
                bgColor = 'bg-blue-600'
                textColor = 'text-white'
              } else {
                bgColor = 'bg-orange-600'
                textColor = 'text-white'
              }

              const alignment = msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'

              return (
                <div key={msg.id} className={`flex ${alignment}`}>
                  <div className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 ${bgColor} ${textColor} ${msg.sender_type === 'admin' ? 'rounded-bl-sm' : 'rounded-br-sm'}`}>
                    <p className="text-xs whitespace-pre-wrap break-words">{msg.message}</p>
                    
                    <div className="flex items-center gap-1 mt-0.5">
                      <p className={`text-[9px] ${textColor === 'text-white' ? 'text-white/70' : 'text-gray-500'}`}>
                        {format(new Date(msg.created_at), 'dd MMM yyyy, HH:mm', { locale: pl })}
                      </p>
                      
                      {isOwnMessage && (
                        <span className={msg.is_read ? 'text-blue-200' : 'text-white/50'}>
                          {msg.is_read ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
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

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2 bg-white flex-shrink-0">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            disabled={sending}
            className="flex-1 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="text-xs">Wyślij</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}