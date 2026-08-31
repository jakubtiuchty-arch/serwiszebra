'use client'

import { useEffect, useId, useRef, useState } from 'react'

/**
 * Dymek z wyjaśnieniem terminu — używany w tabeli wariantów na karcie produktu
 * i przy nagłówkach filtra na stronach kategorii. Wspólny, bo obie listy mówią
 * o tych samych cechach („Nośnik", „Łączność", „Akumulator") i klient ma prawo
 * dostać w obu miejscach tę samą odpowiedź.
 */

export interface Wyjasnienie {
  /** Zdanie wprowadzające — mówi, CZEGO dotyczy kolumna */
  wstep: string
  /** Wartości, które klient widzi w tabeli, z jednolinijkowym znaczeniem */
  pozycje: [string, string][]
}

/**
 * Dymek pokazuje TYLKO te wartości, które faktycznie występują w tym miejscu.
 * Bez tego karta drukarki mobilnej tłumaczyła Ethernet i USB, których ta
 * drukarka nie ma — słownik jest wspólny dla całego sklepu, a kontekst nie.
 * Gdy żadna wartość nie pasuje (nietypowa cecha), zostaje pełna lista.
 */
export const zawezWyjasnienie = (w: Wyjasnienie, obecne: string[]): Wyjasnienie => {
  const zbior = new Set(obecne.filter(Boolean))
  const pozycje = w.pozycje.filter(([termin]) => zbior.has(termin))
  return pozycje.length > 0 ? { ...w, pozycje } : w
}

/**
 * Treść dymka: zdanie wprowadzające i wiersz na każdą wartość. Elementy
 * blokowe zrobione spanami, bo dymek renderuje się wewnątrz `span`
 * i `div` łamałby poprawność HTML.
 */
export const TrescPodpowiedzi = ({ w }: { w: Wyjasnienie }) => (
  <>
    <span className="block font-medium">{w.wstep}</span>
    <span className="mt-1.5 block space-y-1">
      {w.pozycje.map(([termin, opis]) => (
        <span key={termin} className="block">
          <span className="font-semibold">{termin}</span> — {opis}
        </span>
      ))}
    </span>
  </>
)

/**
 * Znak zapytania z dymkiem — dostępny popover, nie czysty CSS-owy tooltip.
 *
 * Wymogi z audytu (WCAG 1.4.13): dymek da się zamknąć Escape, można najechać
 * na jego treść (zamknięcie z małym opóźnieniem, żeby przejść nad przerwą),
 * jest powiązany z przyciskiem przez aria-describedby i renderuje się
 * warunkowo (ukryty nie zaśmieca drzewa dostępności). Pozycja liczona
 * z geometrii przycisku i DOCIĘTA do viewportu — na telefonie treść nie
 * wystaje poza ekran ani nie zasłania stałych elementów po przewinięciu
 * (scroll zamyka). `stopPropagation`, bo przodkowie wybierają wariant.
 */
export const Podpowiedz = ({ label, wyjasnienie }: { label: string; wyjasnienie: Wyjasnienie }) => {
  const [otwarty, setOtwarty] = useState(false)
  const [pozycja, setPozycja] = useState<{ top: number; left: number; szer: number } | null>(null)
  const przycisk = useRef<HTMLButtonElement>(null)
  const korzen = useRef<HTMLSpanElement>(null)
  const zamykacz = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()

  const pokaz = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    const r = przycisk.current?.getBoundingClientRect()
    if (!r) return
    const szer = Math.min(300, window.innerWidth - 24)
    const left = Math.min(
      Math.max(r.left + r.width / 2 - szer / 2, 12),
      window.innerWidth - szer - 12
    )
    setPozycja({ top: r.bottom + 6, left, szer })
    setOtwarty(true)
  }
  const ukryj = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    setOtwarty(false)
  }
  /** Opóźnienie pozwala przejechać kursorem z przycisku na treść dymka */
  const ukryjZwloka = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    zamykacz.current = setTimeout(() => setOtwarty(false), 150)
  }

  useEffect(() => {
    if (!otwarty) return
    const naKlawisz = (e: KeyboardEvent) => e.key === 'Escape' && ukryj()
    const naScroll = () => ukryj()
    // Tapnięcie/klik poza dymkiem zamyka — na dotyku nie ma mouseleave
    const pozaObszarem = (e: PointerEvent) => {
      if (!korzen.current?.contains(e.target as Node)) ukryj()
    }
    document.addEventListener('keydown', naKlawisz)
    document.addEventListener('pointerdown', pozaObszarem)
    // Nasłuch scrolla dopiero po chwili — samo kliknięcie potrafi wywołać
    // mikro-przewinięcie (fokus dociąga element) i zamykało dymek od razu
    const opoznienie = setTimeout(() => window.addEventListener('scroll', naScroll, true), 250)
    return () => {
      clearTimeout(opoznienie)
      document.removeEventListener('keydown', naKlawisz)
      document.removeEventListener('pointerdown', pozaObszarem)
      window.removeEventListener('scroll', naScroll, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otwarty])

  return (
    <span ref={korzen} className="inline-flex align-middle" onMouseEnter={pokaz} onMouseLeave={ukryjZwloka}>
      {/* Cel dotykowy 24×24 px (WCAG 2.2 target size), kółko wizualnie zostaje 16 px */}
      <button
        ref={przycisk}
        type="button"
        aria-label={label}
        aria-expanded={otwarty}
        aria-describedby={otwarty ? id : undefined}
        onClick={(e) => {
          e.stopPropagation()
          pokaz()
        }}
        onFocus={pokaz}
        onBlur={ukryjZwloka}
        className="group/przycisk -m-1 flex h-6 w-6 items-center justify-center"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-[10px] font-semibold leading-none text-gray-500 transition group-hover/przycisk:border-gray-600 group-hover/przycisk:text-gray-700">
          ?
        </span>
      </button>
      {otwarty && pozycja && (
        <span
          id={id}
          role="tooltip"
          onMouseEnter={pokaz}
          onMouseLeave={ukryjZwloka}
          onClick={(e) => e.stopPropagation()}
          style={{ top: pozycja.top, left: pozycja.left, width: pozycja.szer }}
          className="fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-white shadow-lg"
        >
          <TrescPodpowiedzi w={wyjasnienie} />
        </span>
      )}
    </span>
  )
}

