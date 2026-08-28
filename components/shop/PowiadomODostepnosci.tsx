'use client'

import { useState } from 'react'
import { Bell, Check, X } from 'lucide-react'

/**
 * Zapis na powiadomienie o dostępności — zamiennik „Do koszyka" przy zerowym
 * stanie. Po kliknięciu rozwija się pole na adres; wpis trafia do
 * `stock_alerts`, a maila „znowu dostępny" wysyła cron stock-sync. Wzorzec
 * z takma.com.pl.
 *
 * Komponent na poziomie modułu, nie wewnątrz DeviceAccessories — komponent
 * definiowany w środku rodzica dostaje nową tożsamość przy każdym renderze
 * i traci stan, więc wpisywany adres znikałby np. przy „Dodano" na innym kafelku.
 */
export default function PowiadomODostepnosci({ sku, nazwa, url }: { sku: string; nazwa: string; url: string }) {
  const [otwarte, setOtwarte] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'puste' | 'wysylanie' | 'zapisano' | 'blad'>('puste')

  const zapisz = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('wysylanie')
    try {
      const res = await fetch('/api/stock-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sku, productName: nazwa, productUrl: url }),
      })
      if (!res.ok) throw new Error()
      setStatus('zapisano')
    } catch {
      setStatus('blad')
    }
  }

  if (status === 'zapisano') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
        <Check className="h-3.5 w-3.5" />
        Zapisano — damy znać mailem
      </span>
    )
  }

  if (!otwarte) {
    return (
      <button
        type="button"
        onClick={() => setOtwarte(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100"
      >
        <Bell className="h-3.5 w-3.5" />
        Powiadom
      </button>
    )
  }

  return (
    <form onSubmit={zapisz} className="flex w-full items-center gap-1.5">
      <input
        type="email"
        required
        autoFocus
        placeholder="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label={`Adres e-mail do powiadomienia o dostępności ${sku}`}
        className="w-full min-w-0 flex-1 rounded-lg border border-amber-300 px-2.5 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      <button
        type="submit"
        disabled={status === 'wysylanie'}
        className="rounded-lg bg-amber-500 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
      >
        OK
      </button>
      <button
        type="button"
        onClick={() => {
          setOtwarte(false)
          setStatus('puste')
        }}
        aria-label="Zamknij zapis na powiadomienie"
        className="p-1 text-gray-400 transition hover:text-gray-600"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {status === 'blad' && (
        <span className="w-full text-[11px] text-red-600">Nie udało się zapisać — spróbuj ponownie</span>
      )}
    </form>
  )
}
