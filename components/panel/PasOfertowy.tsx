'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { OFERTY_PANELU, type OfertaPanelu } from '@/lib/panel-offers'

/**
 * „×" ukrywa ofertę na 30 dni, nie na zawsze — kontrakt jest ofertą stałą, a klient
 * zamyka pasek najczęściej dlatego, że akurat przyszedł zgłosić naprawę, a nie dlatego,
 * że temat go nie interesuje. Klucz jest per oferta, więc nowa kampania pokaże się od razu.
 */
const DNI_UKRYCIA = 30
const kluczUkrycia = (id: string) => `panel-oferta-ukryta:${id}`

function ukryta(id: string): boolean {
  try {
    const zapis = localStorage.getItem(kluczUkrycia(id))
    if (!zapis) return false
    const ukrytaDo = Number(zapis)
    // Zapis w starym formacie (data ISO) traktujemy jak brak — oferta wraca
    if (!Number.isFinite(ukrytaDo)) return false
    return Date.now() < ukrytaDo
  } catch {
    return false
  }
}

export default function PasOfertowy() {
  const [oferta, setOferta] = useState<OfertaPanelu | null>(null)

  useEffect(() => {
    let anulowane = false

    async function wybierzOferte() {
      const widoczne = OFERTY_PANELU.filter((o) => !ukryta(o.id))
      if (widoczne.length === 0) return

      // Klientowi, który kontrakt już ma, nie sprzedajemy go drugi raz
      let maKontrakt = false
      if (widoczne.some((o) => o.ukryjGdyMaKontrakt)) {
        try {
          const res = await fetch('/api/service-contracts')
          if (res.ok) {
            const dane = await res.json()
            maKontrakt = (dane.contracts?.length || 0) > 0
          }
        } catch {
          // Brak odpowiedzi nie może zablokować panelu — oferta się wtedy pokazuje
        }
      }

      const wybrana = widoczne.find((o) => !(o.ukryjGdyMaKontrakt && maKontrakt))
      if (!anulowane && wybrana) setOferta(wybrana)
    }

    wybierzOferte()
    return () => {
      anulowane = true
    }
  }, [])

  if (!oferta) return null

  const ukryj = () => {
    try {
      const ukrytaDo = Date.now() + DNI_UKRYCIA * 24 * 60 * 60 * 1000
      localStorage.setItem(kluczUkrycia(oferta.id), String(ukrytaDo))
    } catch {
      // Tryb prywatny bez localStorage — oferta wróci przy następnym wejściu
    }
    setOferta(null)
  }

  return (
    <section className="relative">
      <Link
        href={oferta.ctaHref}
        className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm"
      >
        {/* Grafika idzie przez CAŁY pas i jest przycięta u góry i u dołu — artefakty mają
            być duże. Wideo leży na plakacie, więc podmiana jest niewidoczna. */}
        <Image
          src={oferta.obrazMobile}
          alt={oferta.obrazAlt}
          fill
          sizes="100vw"
          className="object-cover object-right sm:hidden"
        />
        {/* Artefakty są tłem, nie bohaterem — stąd wygaszenie do 35%. Bez niego
            konkurowały z nagłówkiem i z przyciskiem. */}
        <Image
          src={oferta.obraz}
          alt={oferta.obrazAlt}
          fill
          sizes="1200px"
          className="hidden object-cover sm:block"
          style={{ opacity: 0.35 }}
        />
        {oferta.wideo && (
          <video
            src={oferta.wideo}
            className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:hidden sm:block"
            style={{ opacity: 0.35 }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
        )}

        {/* Nagłówek musi być czytelny na grafice, a biały przycisk ma zostać jedynym
            jasnym elementem — stąd woal również po prawej stronie */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              'linear-gradient(to right, #000 0%, #000 29%, rgba(0,0,0,0.35) 38%, rgba(0,0,0,0.08) 48%, rgba(0,0,0,0.04) 100%)',
          }}
        />
        {/* Na telefonie tekst zajmuje ponad połowę szerokości, więc woal musi sięgać dalej */}
        <div
          className="absolute inset-0 sm:hidden"
          style={{
            background:
              'linear-gradient(to right, #000 0%, #000 52%, rgba(0,0,0,0.6) 78%, rgba(0,0,0,0.2) 100%)',
          }}
        />

        {/* Wyciemnienie pod przyciskiem — bez niego artefakty przechodzą pod CTA
            i limonkowa poświata ikon zjada krawędź przycisku */}
        <div
          className="absolute inset-y-0 right-0 hidden w-52 sm:block"
          style={{
            background:
              'radial-gradient(120% 140% at 85% 50%, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 45%, rgba(0,0,0,0) 100%)',
          }}
        />

        <div className="relative flex flex-col gap-3 py-4 pl-4 pr-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5 sm:pl-6 sm:pr-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8F000]">
              {oferta.eyebrow}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug text-white sm:text-lg">
              {oferta.naglowek}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-slate-300 sm:text-xs">
              {oferta.podpis}
            </p>
          </div>

          {/* Płaska limonkowa pigułka — bez gradientu, poświaty i cienia. Artefakty
              są przygaszone do 35%, więc przycisk nie potrzebuje już materiału 3D,
              żeby się wybić; płaska plama koloru jest czytelniejsza. */}
          <span className="inline-flex flex-shrink-0 items-center gap-2 self-start rounded-full bg-[#A8F000] px-4 py-2 text-xs font-bold text-black transition-colors group-hover:bg-[#CDFF4D] sm:self-auto sm:px-5 sm:py-2.5 sm:text-sm">
            {oferta.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      {/* Krzyżyk stoi NAD przyciskiem, nie obok — w pasie o wysokości 109 px pionowo się mijają */}
      <button
        onClick={ukryj}
        aria-label="Ukryj tę ofertę na miesiąc"
        title="Ukryj na miesiąc"
        className="absolute right-1.5 top-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </section>
  )
}
