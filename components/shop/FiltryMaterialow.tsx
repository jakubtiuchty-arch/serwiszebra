'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export interface OpcjaFiltra {
  etykieta: string
  /** Adres po przełączeniu opcji; null — opcja bez produktów przy obecnym wyborze */
  href: string | null
  zaznaczony: boolean
  ile: number
}

export interface GrupaFiltra {
  klucz: string
  etykieta: string
  opcje: OpcjaFiltra[]
}

/**
 * Kolumna filtrów listy materiałów — ten sam wygląd co filtry drukarek
 * (KatalogDrukarek): grupy z nagłówkiem kapitalikami, pola wyboru, liczba
 * produktów przy opcji. Opcje są linkami, więc filtr działa po stronie serwera
 * i każdy wybór ma własny adres. Na telefonie panel startuje zwinięty.
 */
export default function FiltryMaterialow({
  grupy,
  aktywne,
  wyczyscHref,
}: {
  grupy: GrupaFiltra[]
  aktywne: number
  wyczyscHref: string
}) {
  const [rozwiniety, setRozwiniety] = useState(false)

  return (
    <aside className="lg:sticky lg:top-6 lg:w-60 lg:shrink-0">
      <div className="rounded-xl border border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setRozwiniety((x) => !x)}
          aria-expanded={rozwiniety}
          aria-label="Filtry"
          className="flex w-full items-center gap-2 border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          Filtry
          {aktywne > 0 && (
            <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {aktywne}
            </span>
          )}
          <ChevronDown className={`ml-auto h-4 w-4 text-gray-400 transition ${rozwiniety ? 'rotate-180' : ''}`} />
        </button>

        <div className={rozwiniety ? 'block' : 'hidden lg:block'}>
          {grupy.map((g) => (
            <div
              key={g.klucz}
              role="group"
              aria-labelledby={`filtr-materialow-${g.klucz}`}
              className="border-b border-gray-100 px-4 pb-3 pt-4 last:border-0"
            >
              <p
                id={`filtr-materialow-${g.klucz}`}
                className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400"
              >
                {g.etykieta}
              </p>
              <div className="space-y-1">
                {g.opcje.map((o) => {
                  const pole = (
                    <>
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          o.zaznaczony ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 bg-white'
                        }`}
                      >
                        {o.zaznaczony && <Check className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className={o.zaznaczony ? 'font-medium text-gray-900' : ''}>{o.etykieta}</span>
                      <span className="ml-auto text-xs text-gray-400">{o.ile}</span>
                    </>
                  )
                  return o.href ? (
                    <Link
                      key={o.etykieta}
                      href={o.href}
                      scroll={false}
                      aria-current={o.zaznaczony ? 'true' : undefined}
                      className="flex min-h-[32px] items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      {pole}
                    </Link>
                  ) : (
                    <span
                      key={o.etykieta}
                      aria-disabled="true"
                      className="flex min-h-[32px] cursor-not-allowed items-center gap-2 text-sm text-gray-300"
                    >
                      {pole}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}

          {aktywne > 0 && (
            <div className="px-4 py-3">
              <Link
                href={wyczyscHref}
                scroll={false}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 underline hover:text-gray-900"
              >
                <X className="h-3.5 w-3.5" />
                Wyczyść filtry
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
