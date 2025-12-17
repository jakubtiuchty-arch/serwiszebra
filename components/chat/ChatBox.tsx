'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Check, CheckCheck, Paperclip, X, FileText, Image as ImageIcon, Download } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import Image from 'next/image'

interface Attachment {
  url: string
  name: string
  type: string
  size: number
}

interface Message {
  id: string
  repair_request_id: string
  sender_id: string
  sender_type: 'admin' | 'user'
  message: string
  attachments?: Attachment[]
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isFirstLoad = useRef(true)
  const previousMessageCount = useRef(0)
  
  const supabase = createClient()
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles: File[] = []
    
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Plik "${file.name}" jest za duży (max 10MB)`)
        continue
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Plik "${file.name}" ma nieobsługiwany format`)
        continue
      }
      validFiles.push(file)
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 plików
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }
  
  const uploadFiles = async (): Promise<Attachment[]> => {
    const attachments: Attachment[] = []
    
    for (const file of selectedFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${repairId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('chat-attachments')
        .upload(fileName, file)
      
      if (error) {
        console.error('Upload error:', error)
        continue
      }
      
      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(fileName)
      
      attachments.push({
        url: urlData.publicUrl,
        name: file.name,
        type: file.type,
        size: file.size
      })
    }
    
    return attachments
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && selectedFiles.length === 0) || sending) return

    setSending(true)
    setUploading(selectedFiles.length > 0)
    
    try {
      let attachments: Attachment[] = []
      
      // Upload plików jeśli są
      if (selectedFiles.length > 0) {
        attachments = await uploadFiles()
      }
      
      const response = await fetch(`/api/repairs/${repairId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage.trim() || (attachments.length > 0 ? '📎 Załącznik' : ''),
          attachments: attachments.length > 0 ? attachments : undefined
        }),
      })

      if (!response.ok) throw new Error('Błąd wysyłania wiadomości')

      setNewMessage('')
      setSelectedFiles([])
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się wysłać wiadomości')
    } finally {
      setSending(false)
      setUploading(false)
    }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  const isImageFile = (type: string) => type.startsWith('image/')

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <div>
            <h3 className="text-sm font-bold">Czat z serwisem</h3>
            <p className="text-xs text-blue-100">
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
            <p className="text-xs font-medium">Brak wiadomości</p>
            <p className="text-xs text-gray-400 mt-0.5">Rozpocznij rozmowę poniżej</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isOwnMessage = msg.sender_type === currentUserType

              // Klient po LEWEJ (szary), Serwisant po PRAWEJ (niebieski)
              const isFromClient = msg.sender_type === 'user'
              const bgColor = isFromClient ? 'bg-gray-200' : 'bg-blue-600'
              const textColor = isFromClient ? 'text-gray-900' : 'text-white'
              const alignment = isFromClient ? 'justify-start' : 'justify-end'
              const borderRadius = isFromClient ? 'rounded-bl-sm' : 'rounded-br-sm'

              return (
                <div key={msg.id} className={`flex ${alignment}`}>
                  <div className={`max-w-[85%] rounded-2xl px-2.5 py-1.5 ${bgColor} ${textColor} ${borderRadius} shadow-sm`}>
                    {/* Nadawca (opcjonalnie) */}
                    <p className={`text-[10px] font-bold mb-0.5 uppercase tracking-wide ${isFromClient ? 'text-gray-600' : 'text-blue-100'}`}>
                      {isFromClient ? 'Klient' : 'Serwis'}
                    </p>

                    {msg.message && msg.message !== '📎 Załącznik' && (
                      <p className="text-xs whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                    )}
                    
                    {/* Załączniki */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {msg.attachments.map((att, idx) => (
                          <div key={idx}>
                            {isImageFile(att.type) ? (
                              <a href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                                <img 
                                  src={att.url} 
                                  alt={att.name}
                                  className="max-w-[200px] max-h-[150px] rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                />
                              </a>
                            ) : (
                              <a 
                                href={att.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs ${
                                  isFromClient ? 'bg-gray-300 hover:bg-gray-400' : 'bg-blue-500 hover:bg-blue-400'
                                } transition-colors`}
                              >
                                <FileText className="w-3 h-3" />
                                <span className="truncate max-w-[120px]">{att.name}</span>
                                <Download className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <p className={`text-[10px] font-medium ${isFromClient ? 'text-gray-500' : 'text-white/70'}`}>
                        {format(new Date(msg.created_at), 'HH:mm', { locale: pl })}
                      </p>

                      {/* Pokaż status odczytu ZAWSZE (nie tylko dla własnych wiadomości) */}
                      {isOwnMessage && (
                        <span className={msg.is_read ? (isFromClient ? 'text-blue-500' : 'text-white') : (isFromClient ? 'text-gray-400' : 'text-white/50')}>
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
        {/* Podgląd wybranych plików */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative group">
                {file.type.startsWith('image/') ? (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs">
                    <FileText className="w-3 h-3 text-gray-500" />
                    <span className="max-w-[80px] truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Input z przyciskami wewnątrz */}
        <div className="flex items-center border border-gray-300 rounded-full bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
          {/* Przycisk załącznika - WEWNĄTRZ po lewej */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || selectedFiles.length >= 5}
            className="flex-shrink-0 p-2 ml-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Dodaj załącznik (max 5 plików)"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          {/* Input - ŚRODEK */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Wpisz wiadomość..."
            disabled={sending}
            className="flex-1 min-w-0 px-2 py-2 text-sm bg-transparent border-none focus:outline-none focus:ring-0 disabled:bg-transparent"
          />
          
          {/* Przycisk wyślij - WEWNĄTRZ po prawej */}
          <button
            type="submit"
            disabled={(!newMessage.trim() && selectedFiles.length === 0) || sending}
            className="flex-shrink-0 p-2 mr-1 text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Wyślij wiadomość"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}