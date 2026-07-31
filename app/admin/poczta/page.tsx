'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mail,
  RefreshCw,
  Send,
  Sparkles,
  Archive,
  ShieldOff,
  Save,
  Loader2,
  Inbox,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react'

/**
 * Moduł POCZTA — skrzynka serwis@takma.com.pl w panelu admina.
 * Lista wątków + podgląd korespondencji + szkic odpowiedzi AI do edycji
 * i zatwierdzenia. AI nigdy nie wysyła samo — człowiek klika „Wyślij".
 */

interface Thread {
  id: string
  subject: string | null
  customer_email: string
  customer_name: string | null
  last_message_at: string | null
  status: string
  preview: string
}

interface Message {
  id: string
  direction: string
  from_email: string | null
  from_name: string | null
  subject: string | null
  body_text: string | null
  sent_at: string | null
  is_automated: boolean
}

interface Draft {
  id: string
  ai_draft: string | null
  edited_draft: string | null
  status: string
}

const VIEWS = [
  { key: 'inbox', label: 'Do odpowiedzi', icon: Inbox },
  { key: 'replied', label: 'Odpowiedziane', icon: CheckCircle2 },
  { key: 'archived', label: 'Archiwum', icon: Archive },
  { key: 'spam', label: 'Spam/automaty', icon: ShieldOff },
] as const

const STATUS_LABEL: Record<string, string> = {
  new: 'Nowy',
  drafted: 'Szkic gotowy',
  replied: 'Odpowiedziano',
  archived: 'Archiwum',
  spam: 'Spam',
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PocztaPage() {
  const [view, setView] = useState<string>('inbox')
  const [threads, setThreads] = useState<Thread[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [thread, setThread] = useState<Thread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [draftText, setDraftText] = useState('')
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const loadThreads = useCallback(async (v: string) => {
    setLoadingList(true)
    try {
      const res = await fetch(`/api/admin/poczta?view=${v}`)
      const data = await res.json()
      setThreads(data.threads || [])
    } catch {
      setThreads([])
    } finally {
      setLoadingList(false)
    }
  }, [])

  useEffect(() => {
    loadThreads(view)
  }, [view, loadThreads])

  const openThread = async (id: string) => {
    setSelectedId(id)
    setLoadingThread(true)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/poczta/${id}`)
      const data = await res.json()
      setThread(data.thread)
      setMessages(data.messages || [])
      setDraft(data.draft)
      setDraftText(data.draft?.edited_draft || data.draft?.ai_draft || '')
    } finally {
      setLoadingThread(false)
    }
  }

  const closeThread = () => {
    setSelectedId(null)
    setThread(null)
    setMessages([])
    setDraft(null)
    setDraftText('')
    setNotice(null)
  }

  const handleSend = async () => {
    if (!selectedId || !draftText.trim() || sending) return
    if (!confirm(`Wysłać odpowiedź do ${thread?.customer_email}?`)) return
    setSending(true)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/poczta/${selectedId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: draftText }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Wysyłka nieudana')
      setNotice('Odpowiedź wysłana ✓')
      closeThread()
      loadThreads(view)
    } catch (err: any) {
      setNotice(`Błąd: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!selectedId || saving) return
    setSaving(true)
    try {
      await fetch(`/api/admin/poczta/${selectedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editedDraft: draftText }),
      })
      setNotice('Szkic zapisany ✓')
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerate = async () => {
    if (!selectedId || regenerating) return
    setRegenerating(true)
    setNotice(null)
    try {
      const res = await fetch(`/api/admin/poczta/${selectedId}/draft`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generowanie nieudane')
      setDraft(data.draft)
      setDraftText(data.draft?.ai_draft || '')
      setNotice('Nowy szkic AI wygenerowany ✓')
    } catch (err: any) {
      setNotice(`Błąd: ${err.message}`)
    } finally {
      setRegenerating(false)
    }
  }

  const handleThreadStatus = async (status: string) => {
    if (!selectedId) return
    await fetch(`/api/admin/poczta/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    closeThread()
    loadThreads(view)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Poczta
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            serwis@takma.com.pl — nowe maile co 5 minut, AI proponuje odpowiedź, Ty zatwierdzasz
          </p>
        </div>
        <button
          onClick={() => loadThreads(view)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm text-gray-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loadingList ? 'animate-spin' : ''}`} />
          Odśwież
        </button>
      </div>

      {/* Zakładki */}
      <div className="flex flex-wrap gap-2 mb-6">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => {
              setView(v.key)
              closeThread()
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === v.key
                ? 'bg-gray-900 text-white'
                : 'border border-slate-200 text-gray-600 hover:bg-slate-50'
            }`}
          >
            <v.icon className="w-4 h-4" />
            {v.label}
          </button>
        ))}
      </div>

      {notice && !selectedId && (
        <div className="mb-4 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-gray-700">
          {notice}
        </div>
      )}

      {!selectedId ? (
        /* ===== LISTA WĄTKÓW ===== */
        <div className="border border-slate-200 rounded-xl bg-white divide-y divide-slate-100">
          {loadingList ? (
            <div className="p-10 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Wczytywanie…
            </div>
          ) : threads.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              Brak wiadomości w tym widoku
            </div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => openThread(t.id)}
                className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 truncate">
                        {t.customer_name || t.customer_email}
                      </span>
                      <span
                        className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${
                          t.status === 'drafted'
                            ? 'bg-gray-900 text-white'
                            : t.status === 'new'
                              ? 'bg-slate-100 text-gray-700'
                              : 'bg-slate-100 text-gray-500'
                        }`}
                      >
                        {t.status === 'drafted' && <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />}
                        {STATUS_LABEL[t.status] || t.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 truncate mt-0.5">{t.subject || '(bez tematu)'}</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">{t.preview}</div>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">{formatDate(t.last_message_at)}</div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        /* ===== WIDOK WĄTKU ===== */
        <div>
          <button
            onClick={closeThread}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Wróć do listy
          </button>

          {loadingThread ? (
            <div className="p-10 text-center text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Wczytywanie wątku…
            </div>
          ) : thread ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Korespondencja */}
              <div className="border border-slate-200 rounded-xl bg-white">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="font-semibold text-gray-900">{thread.subject || '(bez tematu)'}</div>
                  <div className="text-sm text-gray-500">
                    {thread.customer_name ? `${thread.customer_name} · ` : ''}
                    {thread.customer_email}
                  </div>
                </div>
                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-xl border p-3.5 ${
                        m.direction === 'outbound'
                          ? 'border-slate-200 bg-slate-50 ml-6'
                          : 'border-slate-200 bg-white mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-gray-700">
                          {m.direction === 'outbound'
                            ? 'Serwis (my)'
                            : m.from_name || m.from_email || 'Klient'}
                        </span>
                        <span className="text-xs text-gray-400">{formatDate(m.sent_at)}</span>
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {(m.body_text || '').trim() || '(pusta treść)'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Szkic odpowiedzi */}
              <div className="border border-slate-200 rounded-xl bg-white flex flex-col">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Odpowiedź {draft?.ai_draft ? '(szkic AI)' : ''}
                  </div>
                  <button
                    onClick={handleRegenerate}
                    disabled={regenerating}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                  >
                    {regenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Wygeneruj ponownie
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    rows={16}
                    placeholder={
                      draft
                        ? ''
                        : 'Brak szkicu AI — napisz odpowiedź albo kliknij „Wygeneruj ponownie".'
                    }
                    className="w-full flex-1 border border-slate-200 rounded-xl p-3.5 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-y"
                  />
                  {notice && (
                    <div className="mt-3 text-sm text-gray-600">{notice}</div>
                  )}
                  <div className="flex flex-wrap items-center gap-2.5 mt-4">
                    <button
                      onClick={handleSend}
                      disabled={sending || !draftText.trim()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Wyślij odpowiedź
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-gray-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Zapisz szkic
                    </button>
                    <div className="flex-1" />
                    <button
                      onClick={() => handleThreadStatus('archived')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-slate-50 transition-colors"
                    >
                      <Archive className="w-4 h-4" />
                      Archiwizuj
                    </button>
                    <button
                      onClick={() => handleThreadStatus('spam')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-slate-50 transition-colors"
                    >
                      <ShieldOff className="w-4 h-4" />
                      Spam
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-400">Nie znaleziono wątku</div>
          )}
        </div>
      )}
    </div>
  )
}
