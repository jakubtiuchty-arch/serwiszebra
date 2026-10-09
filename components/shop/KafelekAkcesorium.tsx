'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Package, ShoppingCart } from 'lucide-react'
import PowiadomODostepnosci from './PowiadomODostepnosci'
import { useCartStore, type CartItem } from '@/lib/cart-store'

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Poziomy kafelek części lub materiału na karcie urządzenia: zdjęcie z lewej,
 * rodzaj kapitalikami, nazwa, PN, cena netto i brutto, „Do koszyka". Wspólny
 * dla akcesoriów drukarek etykiet (DeviceAccessories) i materiałów do drukarek
 * kart (CardMaterials), żeby obie sekcje wyglądały tak samo.
 */
export default function KafelekAkcesorium({
  href,
  nazwa,
  nazwaPelna,
  etykieta,
  pn,
  obraz,
  netto,
  brutto,
  brakNaMagazynie,
  doKoszyka,
}: {
  href: string
  /** Nazwa na kafelku — bez powtórzonego PN */
  nazwa: string
  /** Pełna nazwa do alt i etykiety linku ze zdjęciem */
  nazwaPelna?: string
  /** Rodzaj nad nazwą, np. „Głowica drukująca · 203 dpi" */
  etykieta: string
  pn: string
  obraz: string | null
  /** null — cena jeszcze się ładuje */
  netto: number | null
  brutto: number | null
  /** Brak na magazynach — zamiast martwego koszyka droga „Powiadom" */
  brakNaMagazynie: boolean
  /** null — nie da się jeszcze dodać (cena się ładuje) */
  doKoszyka: Omit<CartItem, 'quantity'> | null
}) {
  const addItem = useCartStore((s) => s.addItem)
  const [dodano, setDodano] = useState(false)
  const pelna = nazwaPelna || nazwa

  const dodaj = () => {
    if (!doKoszyka) return
    addItem(doKoszyka)
    setDodano(true)
    setTimeout(() => setDodano(false), 2000)
  }

  return (
    <li className="flex gap-3 rounded-lg border border-gray-200 p-3">
      <Link
        href={href}
        // Bez zdjęcia link miałby pustą nazwę dostępną (ikona jest dekoracyjna)
        aria-label={pelna}
        className="relative h-24 w-24 flex-shrink-0 self-center overflow-hidden rounded-md bg-white sm:h-28 sm:w-28"
      >
        {obraz ? (
          <Image src={obraz} alt={pelna} fill sizes="112px" className="object-contain p-1" />
        ) : (
          /* Pusta ramka wygląda jak błąd ładowania — lepiej pokazać, czym to jest */
          <span className="flex h-full w-full items-center justify-center rounded-md bg-gray-50 text-gray-300">
            <Package className="h-8 w-8" />
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] uppercase tracking-wide text-gray-500">{etykieta}</p>
        <Link href={href} className="block text-sm font-medium leading-snug text-gray-900 hover:underline">
          {nazwa}
        </Link>
        <p className="mt-0.5 font-mono text-[11px] text-gray-500">{pn}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-gray-900">
              {netto !== null ? `${zl(netto)} zł` : '…'}
              <span className="ml-1 text-xs font-normal text-gray-500">netto</span>
            </span>
            {brutto !== null && brutto > 0 && (
              <span className="block text-xs text-gray-500">{zl(brutto)} zł brutto</span>
            )}
          </span>
          {brakNaMagazynie ? (
            <PowiadomODostepnosci sku={pn} nazwa={pelna} url={href} />
          ) : (
            <button
              type="button"
              onClick={dodaj}
              disabled={!doKoszyka}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#A8F000] px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-[#96D800] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {dodano ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Dodano
                </>
              ) : (
                <>
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Do koszyka
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <span aria-live="polite" className="sr-only">
        {dodano ? `Dodano ${pn} do koszyka` : ''}
      </span>
    </li>
  )
}
