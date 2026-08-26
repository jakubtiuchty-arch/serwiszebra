'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Loader2, CheckCircle2, AlertCircle, MessageSquare, Phone } from 'lucide-react'
import { trackFormSubmit, trackPhoneClick } from '@/lib/analytics'

const TELEFON = '+48601619898'

interface Props {
  productName: string
  /** Wybrany numer katalogowy — trafia do maila, żeby nie dopytywać o wersję */
  variantPn: string
  priceNetto: number
}

/**
 * Pytanie o urządzenie w modalu na karcie, zamiast przenoszenia na `/kontakt`.
 *
 * Klient pyta w chwili wahania — patrząc na cenę i wybrany wariant. Przerzucenie
 * go na osobną stronę kosztuje ten kontekst i część ludzi po prostu nie wraca.
 *
 * Na telefonie modal jest arkuszem wysuwanym od dołu (`items-end`), bo tam
 * kciuk sięga dołu ekranu, a nie środka. Pola mają 16 px czcionki — przy
 * mniejszej iOS sam przybliża stronę przy wejściu w input i układ się rozjeżdża.
 */
export default function DeviceEnquiryModal({ productName, variantPn, priceNetto }: Props) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const pierwszePole = useRef<HTMLInputElement>(null)
  const przyciskOtwierajacy = useRef<HTMLButtonElement>(null)
  const okno = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      // Fokus wraca tam, skąd przyszedł — inaczej po zamknięciu ląduje na <body>
      przyciskOtwierajacy.current?.focus()
      return
    }

    const naKlawisz = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        return
      }
      // Pułapka fokusu: Tab nie może wyprowadzić czytnika ekranu poza modal
      if (e.key !== 'Tab' || !okno.current) return

      // Tylko elementy WIDOCZNE — link „zadzwoń" jest na desktopie ukryty przez
      // `sm:hidden`, ale querySelectorAll go zwraca. Brany za ostatni w kolejce
      // sprawiał, że warunek zawinięcia nigdy nie zachodził i fokus uciekał
      // poza modal (zmierzone: 8 ucieczek na 12 Tabów).
      const elementy = Array.from(
        okno.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea, select'
        )
      ).filter((el) => el.offsetParent !== null && el.tabIndex !== -1)

      if (elementy.length === 0) return
      const pierwszy = elementy[0]
      const ostatni = elementy[elementy.length - 1]
      if (!e.shiftKey && document.activeElement === ostatni) {
        e.preventDefault()
        pierwszy.focus()
      } else if (e.shiftKey && document.activeElement === pierwszy) {
        e.preventDefault()
        ostatni.focus()
      }
    }

    document.addEventListener('keydown', naKlawisz)
    const poprzedni = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pierwszePole.current?.focus()

    return () => {
      document.removeEventListener('keydown', naKlawisz)
      document.body.style.overflow = poprzedni
    }
  }, [open])

  const wyslij = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/device-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productName,
          variantPn,
          priceNetto,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const wynik = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(wynik.error || 'Nie udało się wysłać pytania')
      trackFormSubmit('device_enquiry', { variantPn })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd. Spróbuj ponownie lub zadzwoń.')
    } finally {
      setSending(false)
    }
  }

  const pole =
    'w-full rounded-lg border border-gray-300 px-3 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900'
  const etykieta = 'block text-xs font-medium text-gray-700 mb-1'

  return (
    <>
      <button
        ref={przyciskOtwierajacy}
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
      >
        <MessageSquare className="h-4 w-4 text-gray-500" />
        Zapytaj o produkt
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pytanie-o-urzadzenie-tytul"
          >
            <motion.div
              ref={okno}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              /* max-h-[92dvh], nie vh: na telefonie klawiatura zjada część ekranu,
                 a przy `vh` dół formularza chowa się pod nią bez możliwości dojścia */
              className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zamknij"
                className="absolute right-3 top-3 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="rounded-t-2xl bg-gray-950 px-5 py-5 sm:px-6">
                {/* Uchwyt arkusza — na telefonie sygnalizuje, że to panel do zamknięcia */}
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20 sm:hidden" />
                <h2 id="pytanie-o-urzadzenie-tytul" className="text-lg font-semibold text-white">
                  Zapytaj o {productName.replace(/^Drukarka etykiet\s+/i, '')}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Odpowiadamy w godzinach pracy serwisu, zwykle tego samego dnia.
                </p>
                {variantPn && (
                  <p className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px] text-gray-200">
                    {variantPn}
                  </p>
                )}
              </div>

              {done ? (
                <div className="px-5 py-8 text-center sm:px-6">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
                  <p className="text-base font-semibold text-gray-900">Pytanie wysłane</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Odezwiemy się na {form.email}. Jeśli sprawa jest pilna, zadzwoń — 601 619 898.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="mt-5 min-h-[48px] w-full rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Zamknij
                  </button>
                </div>
              ) : (
                <form onSubmit={wyslij} className="space-y-3 px-5 py-5 sm:px-6">
                  <div>
                    <label htmlFor="pyt-imie" className={etykieta}>
                      Imię i nazwisko *
                    </label>
                    <input
                      ref={pierwszePole}
                      id="pyt-imie"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={pole}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="pyt-email" className={etykieta}>
                        E-mail *
                      </label>
                      <input
                        id="pyt-email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={pole}
                      />
                    </div>
                    <div>
                      <label htmlFor="pyt-tel" className={etykieta}>
                        Telefon
                      </label>
                      <input
                        id="pyt-tel"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={pole}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pyt-tresc" className={etykieta}>
                      Pytanie:
                    </label>
                    <textarea
                      id="pyt-tresc"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={pole}
                    />
                  </div>

                  {error && (
                    <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      {error}
                    </p>
                  )}

                  {/* Na telefonie formularz jest wyższy niż ekran (747 px treści
                      przy 611 px okna na iPhonie 13), więc bez przyklejenia
                      przycisk wysyłki wypada poniżej krawędzi i trzeba go
                      doszukać. Na desktopie modal mieści się w całości i sticky
                      jest zbędne. */}
                  <div className="sticky bottom-0 -mx-5 border-t border-gray-100 bg-white px-5 pb-4 pt-3 sm:static sm:mx-0 sm:border-0 sm:px-0 sm:pb-0 sm:pt-0">
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#A8F000] px-4 text-sm font-bold text-gray-950 transition hover:brightness-95 disabled:opacity-60"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Wysyłam…
                        </>
                      ) : (
                        'Wyślij pytanie'
                      )}
                    </button>

                    {/* Część ludzi woli zadzwonić niż pisać — na telefonie ta droga
                        musi być na wyciągnięcie kciuka, a nie schowana w stopce */}
                    <a
                      href={`tel:${TELEFON}`}
                      onClick={() => trackPhoneClick('modal_pytanie_o_urzadzenie')}
                      className="mt-2 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 sm:hidden"
                    >
                      <Phone className="h-4 w-4 text-gray-500" />
                      Wolisz zadzwonić? 601 619 898
                    </a>

                    <p className="mt-2 text-center text-xs text-gray-500">
                      Dane wykorzystamy wyłącznie do odpowiedzi na to pytanie.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
