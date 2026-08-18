'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { trackFormSubmit } from '@/lib/analytics'

const LIME = '#A8F000'

interface PrintheadProgramCtaProps {
  productName?: string | null
  deviceModel?: string | null
  priceBrutto: number
}

/**
 * Przycisk „Sprawdź kwalifikację" wraz z modalem. Formularz otwiera się na karcie
 * produktu — klient widzi cenę głowicy, o której właśnie czyta, i nie musi
 * przechodzić na inną stronę, żeby się zgłosić.
 */
export default function PrintheadProgramCta({ productName, deviceModel, priceBrutto }: PrintheadProgramCtaProps) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', printers: '', usage: '' })
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // Escape zamyka, tło nie scrolluje pod modalem
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstFieldRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/program-glowice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productName: productName || undefined,
          deviceModel: deviceModel || undefined,
          priceBrutto,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(result.error || 'Nie udało się wysłać zgłoszenia')
      trackFormSubmit('printhead_program', { deviceModel: deviceModel || '' })
      setDone(true)
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd. Spróbuj ponownie lub zadzwoń.')
    } finally {
      setSending(false)
    }
  }

  const field = 'w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900'
  const label = 'block text-xs font-medium text-gray-700 mb-1'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-950 transition-all duration-200 hover:brightness-95 active:scale-[0.98]"
        style={{ background: LIME }}
      >
        Sprawdź kwalifikację
        <ArrowRight className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="program-glowic-tytul"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zamknij"
                className="absolute right-3 top-3 rounded-lg p-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="bg-gray-950 px-5 sm:px-6 py-5 rounded-t-2xl">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-950"
                  style={{ background: LIME }}
                >
                  Program Zebry
                </span>
                <h2 id="program-glowic-tytul" className="mt-3 text-lg font-bold text-white leading-snug">
                  Sprawdzimy, czy Twoja firma się kwalifikuje
                </h2>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
                  Zgłoszenie nie jest zobowiązaniem. Sprawdzamy, czy Twoje zużycie materiałów sięga progu wymaganego przez Zebrę, i wracamy z odpowiedzią.
                </p>
              </div>

              {done ? (
                <div className="px-5 sm:px-6 py-8 text-center">
                  <CheckCircle2 className="mx-auto w-11 h-11 text-green-600" />
                  <h3 className="mt-3 text-base font-bold text-gray-900">Zgłoszenie wysłane</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    Odezwiemy się zwykle tego samego dnia roboczego. Jeśli sprawa jest pilna, zadzwoń:{' '}
                    <a href="tel:+48601619898" className="font-semibold text-gray-900 underline underline-offset-4">
                      +48 601 619 898
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-5 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors"
                  >
                    Zamknij
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className={label} htmlFor="pg-company">Firma *</label>
                      <input
                        id="pg-company" ref={firstFieldRef} required className={field} placeholder="Nazwa firmy"
                        value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={label} htmlFor="pg-name">Imię i nazwisko *</label>
                      <input
                        id="pg-name" required className={field} placeholder="Jan Kowalski"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={label} htmlFor="pg-email">E-mail *</label>
                      <input
                        id="pg-email" type="email" required className={field} placeholder="jan@firma.pl"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={label} htmlFor="pg-phone">Telefon</label>
                      <input
                        id="pg-phone" type="tel" className={field} placeholder="+48 600 100 200"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={label} htmlFor="pg-printers">Modele drukarek i numery seryjne *</label>
                    <textarea
                      id="pg-printers" required rows={3} className={field}
                      placeholder={`np. ZT411 — 18J1234567\n${deviceModel ? deviceModel + ' — ' : ''}`}
                      value={form.printers} onChange={(e) => setForm({ ...form, printers: e.target.value })}
                    />
                    <p className="mt-1 text-[11px] text-gray-500">Numery seryjne możesz uzupełnić później — na start wystarczą modele.</p>
                  </div>

                  <div>
                    <label className={label} htmlFor="pg-usage">Roczne zużycie etykiet i taśm</label>
                    <input
                      id="pg-usage" className={field} placeholder="np. 200 rolek etykiet i 60 taśm rocznie"
                      value={form.usage} onChange={(e) => setForm({ ...form, usage: e.target.value })}
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-gray-950 transition-all duration-200 hover:brightness-95 active:scale-[0.98] disabled:opacity-60"
                    style={{ background: LIME }}
                  >
                    {sending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Wysyłanie…</>) : (<>Wyślij zgłoszenie <ArrowRight className="w-4 h-4" /></>)}
                  </button>

                  <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                    Dane wykorzystujemy wyłącznie do sprawdzenia kwalifikacji i kontaktu w tej sprawie.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
