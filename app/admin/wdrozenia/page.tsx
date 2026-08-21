'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Rocket, Loader2, Plus, X, CheckCircle2, RotateCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isSuperAdmin } from '@/lib/admin-config'

interface DeploymentRequest {
  id: string
  title: string
  description: string | null
  page_url: string | null
  author_name: string | null
  status: 'open' | 'done'
  created_at: string
  done_at: string | null
  done_by_name: string | null
  done_note: string | null
}

export default function DeploymentChannelPage() {
  const supabase = createClient()
  const [tab, setTab] = useState<'open' | 'done'>('open')
  const [items, setItems] = useState<DeploymentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [canClose, setCanClose] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCanClose(isSuperAdmin(session?.user?.email))
    })
  }, [supabase])

  const fetchItems = async (which: 'open' | 'done') => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/wdrozenia?status=${which}`)
      const data = await res.json()
      setItems(res.ok ? data.requests || [] : [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems(tab)
  }, [tab])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/wdrozenia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Nie udało się zapisać zgłoszenia')

      setText('')
      setShowForm(false)
      if (tab === 'open') fetchItems('open')
      else setTab('open')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const setStatus = async (id: string, status: 'open' | 'done') => {
    setBusyId(id)
    try {
      const res = await fetch(`/api/admin/wdrozenia/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Nie udało się zapisać zmiany')
        return
      }
      // Zgłoszenie przechodzi między zakładkami, więc lista musi się przeładować
      setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setBusyId(null)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  return (
    <div className="space-y-4 p-3 sm:p-4 lg:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
            <Rocket className="w-5 h-5 text-blue-600" />
            Kanał wdrożeniowy
          </h1>
          <p className="text-xs text-gray-500">
            Zmiany, które mają się pojawić na serwis-zebry.pl. Zgłoszenie trafia od razu do osoby
            wdrażającej, a po wykonaniu wraca potwierdzenie na serwis@takma.com.pl.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Zgłoś zmianę
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {(
          [
            ['open', 'Do zrobienia'],
            ['done', 'Archiwum'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === value
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-500">
            {tab === 'open'
              ? 'Nic nie czeka na wdrożenie.'
              : 'Archiwum jest puste — nic jeszcze nie zostało zamknięte.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-4 ${
                item.status === 'done' ? 'border-gray-200' : 'border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {tab === 'open' && (
                  <input
                    type="checkbox"
                    checked={false}
                    disabled={!canClose || busyId === item.id}
                    onChange={() => setStatus(item.id, 'done')}
                    title={
                      canClose
                        ? 'Oznacz jako wdrożone'
                        : 'Zgłoszenie zamyka osoba, która wdraża zmiany'
                    }
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                  />
                )}
                {tab === 'done' && (
                  <CheckCircle2 className="mt-0.5 w-5 h-5 flex-shrink-0 text-green-600" />
                )}

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm whitespace-pre-line ${
                      item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-900 font-medium'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="mt-2 text-[11px] text-gray-400">
                    {item.author_name || 'Zespół serwisu'} ·{' '}
                    {format(new Date(item.created_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                    {item.done_at && (
                      <>
                        {' · wdrożone '}
                        {format(new Date(item.done_at), 'd MMM yyyy, HH:mm', { locale: pl })}
                        {item.done_by_name ? ` przez ${item.done_by_name}` : ''}
                      </>
                    )}
                  </p>
                </div>

                {tab === 'done' && canClose && (
                  <button
                    onClick={() => setStatus(item.id, 'open')}
                    disabled={busyId === item.id}
                    title="Przywróć na listę"
                    className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-40"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Zgłoś zmianę na stronie</h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Co ma się zmienić? *</label>
                <textarea
                  required
                  autoFocus
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="np. Dodać cennik wymiany głowic ZD421 — 597 zł brutto za 203 dpi, 1269 zł za 300 dpi"
                  className={inputClass}
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Wysyłam...' : 'Wyślij zgłoszenie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
