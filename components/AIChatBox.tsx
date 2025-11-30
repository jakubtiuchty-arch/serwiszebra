'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight,
  MessageSquare,
  User,
  Sparkles,
  Loader2,
  Send,
  Mic,
  MicOff,
  Video,
  Image as ImageIcon,
  Paperclip
} from 'lucide-react'

interface Citation {
  title: string
  uri: string
  pageNumber?: number
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
}

const placeholders = [
  "Opisz problem z drukarką...",
  "Opisz problem z terminalem...",
  "Opisz problem ze skanerem..."
]

export default function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPlaceholder, setCurrentPlaceholder] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`)
  const [detectedDevice, setDetectedDevice] = useState<string>('urządzenie')
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Show button logic:
  // 1. POWAŻNA USTERKA → button po pierwszej konkluzji (AI oznaczy jako "[SERIOUS_ISSUE]")
  // 2. AI sugeruje wysłanie do serwisu → button od razu
  // 3. Normalnie → minimum 6 messages (3 exchanges)
  // 4. Last message is from AI
  // 5. Last AI message is NOT a question (no "?")
  // 6. NOT currently loading (prevents button disappearing during streaming)
  const messageCount = messages.length
  const lastMessage = messages[messages.length - 1]
  const isLastMessageAI = lastMessage?.role === 'assistant'
  const lastMessageIsQuestion = lastMessage?.content?.includes('?') || false
  const isSeriousIssue = lastMessage?.content?.includes('[SERIOUS_ISSUE]') || false
  const suggestsRepair =
    lastMessage?.content?.toLowerCase().includes('wysłać do serwisu') ||
    lastMessage?.content?.toLowerCase().includes('wysłanie do serwisu') ||
    lastMessage?.content?.toLowerCase().includes('wysłać drukarkę') ||
    lastMessage?.content?.toLowerCase().includes('wysłać urządzenie') ||
    false

  const shouldShowFormButton =
    isLastMessageAI &&
    !lastMessageIsQuestion &&
    !loading &&
    (isSeriousIssue || suggestsRepair || messageCount >= 6)  // ✨ Pokaż wcześniej dla poważnych usterek lub sugestii naprawy

  // Scroll do dołu - płynnie
  const scrollToBottom = (smooth = true) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      })
    }
  }
  
  // Scroll gdy AI zakończy odpowiedź (loading zmienia się z true na false)
  const prevLoadingRef = useRef(loading)
  useEffect(() => {
    // Scroll gdy: użytkownik wysłał wiadomość (loading: false→true) LUB AI skończył (loading: true→false)
    if (prevLoadingRef.current !== loading) {
      setTimeout(() => scrollToBottom(true), 100)
    }
    prevLoadingRef.current = loading
  }, [loading])

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

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.lang = 'pl-PL'
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInput(transcript)
          setIsRecording(false)
        }

        recognition.onerror = () => {
          setIsRecording(false)
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Rozpoznawanie mowy nie jest dostępne w Twojej przeglądarce')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      recognitionRef.current.start()
      setIsRecording(true)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)])
    }
  }

  const handleVideoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setAttachedFiles(prev => [...prev, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Detect device type from user input
  const detectDeviceType = (text: string): string => {
    const textLower = text.toLowerCase()

    // Printer models - if detected, it's a printer
    const printerModels = [
      'zt411', 'zt421', 'zt410', 'zt420',
      'zd421', 'zd621', 'zd420', 'zd620',
      'zd888', 'zd500', 'zd510',
      'zt510', 'zt610',
      'gc420d', 'gc420t',
      'tlp2844', 'lp2844'
    ]

    // Check if any printer model is mentioned
    for (const model of printerModels) {
      if (textLower.includes(model)) {
        return 'drukarkę'
      }
    }

    // Check for generic device type keywords
    if (textLower.includes('drukark') || textLower.includes('print')) {
      return 'drukarkę'
    }
    if (textLower.includes('terminal')) {
      return 'terminal'
    }
    if (textLower.includes('skaner') || textLower.includes('scan')) {
      return 'skaner'
    }
    if (textLower.includes('tablet')) {
      return 'tablet'
    }

    return 'urządzenie'
  }

  const handleSend = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim() || loading) return

    setInput('')

    // Detect device type from first user message
    if (messages.length === 0) {
      const device = detectDeviceType(messageText)
      setDetectedDevice(device)
    }

    const userMessage: Message = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId
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

          // Sprawdź czy są citations na końcu
          const citationsMatch = assistantMessage.match(/__CITATIONS__(.+)$/)
          let content = assistantMessage
          let citations: Citation[] | undefined = undefined

          if (citationsMatch) {
            // Oddziel treść od citations
            content = assistantMessage.substring(0, citationsMatch.index)
            try {
              const citationsData = JSON.parse(citationsMatch[1])
              citations = citationsData.citations
            } catch (e) {
              console.error('Błąd parsowania citations:', e)
            }
          }

          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'assistant', content, citations }
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
        
        {/* Kontener wiadomości */}
        <div
          ref={messagesContainerRef}
          className={`overflow-y-auto transition-all duration-300 ease-out ${
            messages.length > 0 ? 'max-h-80 p-4 sm:p-6' : 'h-0 p-0'
          }`}
        >
          <div className="space-y-4">
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
                  className={`max-w-[80%] ${
                    msg.role === 'user'
                      ? ''
                      : 'space-y-2'
                  }`}
                >
                  <div
                    className={`rounded-3xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {/* Ukryj znacznik [SERIOUS_ISSUE] przed użytkownikiem */}
                      {msg.content.replace('[SERIOUS_ISSUE]', '').trim()}
                    </p>
                  </div>

                  {/* Citations - tylko dla odpowiedzi AI */}
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="px-3 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Źródła:</p>
                      {msg.citations.map((citation, citIdx) => (
                        <div key={citIdx} className="text-xs text-blue-600 flex items-start gap-1">
                          <span>📄</span>
                          <span>{citation.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-gray-100 rounded-3xl px-5 py-3">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    Diagnosuję Twoją {detectedDevice}... zaraz wracam! ☕
                  </p>
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
        </div>

        <div className={`p-4 sm:p-6 md:p-8 ${messages.length > 0 ? 'border-t border-gray-100' : ''}`}>
          {/* Attached Files Preview */}
          {attachedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="relative bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2 group">
                  <div className="flex items-center gap-2">
                    {file.type.startsWith('video/') ? (
                      <Video className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-xs text-blue-900 font-medium max-w-[150px] truncate">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-blue-600 hover:text-red-600 transition-colors"
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-center gap-3">
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              capture="environment"
              onChange={handleVideoCapture}
              className="hidden"
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPlaceholder}
              className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent py-3"
              disabled={loading}
            />

            {/* Mic button - DESKTOP ONLY (mobile has it in bottom bar) */}
            <button
              onClick={toggleRecording}
              disabled={loading}
              className={`hidden md:flex flex-shrink-0 p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
              aria-label={isRecording ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie'}
            >
              {isRecording ? (
                <MicOff className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && attachedFiles.length === 0) || loading}
              className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <ArrowRight className="w-6 h-6" />
              )}
            </button>
          </div>

          <div className="pt-4 mt-4">
            {/* MOBILE - features left, media buttons right */}
            <div className="md:hidden flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Wstępna diagnoza w 2 min</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => videoInputRef.current?.click()}
                  disabled={loading}
                  className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
                  aria-label="Nagraj wideo"
                >
                  <Video className="w-5 h-5" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50"
                  aria-label="Dodaj załącznik"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleRecording}
                  disabled={loading}
                  className={`flex-shrink-0 p-2 rounded-full transition-all disabled:opacity-50 ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label={isRecording ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie'}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* DESKTOP - features centered */}
            <div className="hidden md:flex items-center justify-center gap-8 text-sm text-gray-600 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Wstępna diagnoza w 2 min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>24/7 dostępny</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Gemini - OUTSIDE chatbox */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200">
          <span className="text-[10px] text-gray-500">Powered by</span>
          <span className="text-xs font-medium tracking-tight" style={{ fontFamily: '"Google Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            Gemini
          </span>
        </div>
      </div>
    </div>
  )
}