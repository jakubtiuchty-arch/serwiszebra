'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Sprząta z paska adresu parametry Google Analytics: `_gl`, `_ga`, `_ga_*`, `_up`.
 *
 * Skąd się tam biorą: przy odmowie zgody na cookies analityczne identyfikatory
 * nie mogą trafić do cookie, więc `url_passthrough` (włączony 20.08.2026, żeby
 * odzyskać atrybucję konwersji w Ads) przenosi je w adresie. Efekt uboczny to
 * link postaci `/sklep?_gl=1*1tw249p*_up*MQ..*_ga*NDgz…` — nie do pokazania
 * klientowi i nie do skopiowania.
 *
 * Czyścimy DOPIERO po chwili od wejścia: gtag odczytuje te parametry przy
 * starcie strony i musi zdążyć przed nami, inaczej zabralibyśmy mu to, po co
 * je tam wstawiono. Sam ruch nadal jest mierzony — kasujemy tylko zapis
 * w pasku adresu, nie samo przekazanie.
 */

const CZY_PARAMETR_GA = (klucz: string) =>
  klucz === '_gl' || klucz === '_up' || klucz === '_ga' || klucz.startsWith('_ga_')

export default function CzyszczenieAdresu() {
  const pathname = usePathname()

  useEffect(() => {
    const adres = new URL(window.location.href)
    // Array.from zamiast spreadu: tsconfig celuje w ES5, gdzie iterator
    // URLSearchParams nie jest rozwijalny
    const doUsuniecia = Array.from(adres.searchParams.keys()).filter(CZY_PARAMETR_GA)
    if (doUsuniecia.length === 0) return

    const czasomierz = setTimeout(() => {
      const teraz = new URL(window.location.href)
      Array.from(teraz.searchParams.keys())
        .filter(CZY_PARAMETR_GA)
        .forEach((klucz) => teraz.searchParams.delete(klucz))
      window.history.replaceState(null, '', `${teraz.pathname}${teraz.search}${teraz.hash}`)
    }, 2000)

    return () => clearTimeout(czasomierz)
  }, [pathname])

  return null
}
