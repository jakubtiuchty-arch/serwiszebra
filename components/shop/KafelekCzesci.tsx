'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCartStore, type CartItem } from '@/lib/cart-store'

/**
 * Kafelek produktu na listach części i materiałów: zdjęcie, nazwa, dostępność,
 * cena netto i przycisk koszyka. Wspólny dla kategorii części (ShopCategoryClient)
 * i materiałów do drukarek kart, żeby obie listy wyglądały tak samo.
 */
export default function KafelekCzesci({
  href,
  nazwa,
  pn,
  dopisek,
  obraz,
  alt,
  wyblakly = false,
  cenaNetto,
  dostepny,
  doKoszyka,
}: {
  href: string
  nazwa: string
  /** Numer katalogowy pod nazwą — gdy nazwa go nie zawiera */
  pn?: string
  /** Krótka linia pod PN, np. zgodność „Do ZC350" */
  dopisek?: string
  obraz: string
  alt: string
  /** Zdjęcie zastępcze (brak własnego) — przygaszone */
  wyblakly?: boolean
  cenaNetto: number
  dostepny: boolean
  doKoszyka: Omit<CartItem, 'quantity'>
}) {
  const addToCart = useCartStore((state) => state.addItem)

  return (
    <Link
      href={href}
      className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md active:bg-gray-50 transition-all group"
    >
      {/* Image - większe i wycentrowane */}
      <div className="relative h-36 sm:h-44 bg-white flex items-center justify-center p-4">
        <Image
          src={obraz}
          alt={alt}
          width={140}
          height={140}
          className={`object-contain max-h-full${wyblakly ? ' opacity-60' : ''}`}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 border-t border-gray-100">
        <h3 className={`text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight ${pn ? 'mb-1' : 'mb-2'}`}>
          {nazwa}
        </h3>
        {pn && <p className={`${dopisek ? '' : 'mb-2 '}font-mono text-[10px] sm:text-xs text-gray-500`}>{pn}</p>}
        {dopisek && <p className="mb-2 text-[10px] sm:text-xs text-gray-500">{dopisek}</p>}

        {/* Dostępność */}
        <div className="mb-2">
          {dostepny ? (
            <span className="text-[10px] sm:text-xs text-green-600 font-medium">
              ✓ Dostępny
            </span>
          ) : (
            <span className="text-[10px] sm:text-xs text-red-500 font-medium">
              Chwilowo niedostępny
            </span>
          )}
        </div>

        {/* Price - netto główna. mt-auto: cena i koszyk w jednej linii w całym rzędzie,
            także gdy nazwa sąsiada zajmuje jedną linię, a ta dwie */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="text-base sm:text-lg font-bold text-gray-900">
              {cenaNetto.toFixed(2).replace('.', ',')} zł
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500">netto</div>
          </div>

          <button
            type="button"
            aria-label={`Dodaj do koszyka: ${nazwa}`}
            onClick={(e) => {
              e.preventDefault()
              addToCart(doKoszyka)
            }}
            className={`p-2 sm:p-2.5 rounded-lg text-white transition-colors ${
              dostepny
                ? 'bg-[#A8F000] hover:bg-[#96D800] text-gray-900'
                : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  )
}
