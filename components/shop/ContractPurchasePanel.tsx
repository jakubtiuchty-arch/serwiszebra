'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShoppingCart, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface ContractPurchasePanelProps {
  productId: string
  name: string
  slug: string
  sku: string
  priceNetto: number
  priceBrutto: number
}

const formatPrice = (value: number) =>
  value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Zakup kontraktu serwisowego. Kontrakt obejmuje JEDNO urządzenie, więc każda
 * sztuka to osobna pozycja z własnym numerem seryjnym — bez niego nie wiemy,
 * co obejmuje ochrona, gdy sprzęt wraca na warsztat.
 */
export default function ContractPurchasePanel({
  productId,
  name,
  slug,
  sku,
  priceNetto,
  priceBrutto,
}: ContractPurchasePanelProps) {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)

  const [model, setModel] = useState('')
  const [serial, setSerial] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const inCart = useMemo(() => items.filter((i) => i.productId === productId), [items, productId])

  const handleAdd = () => {
    const cleanModel = model.trim()
    const cleanSerial = serial.trim().toUpperCase()

    if (cleanModel.length < 2) {
      setError('Podaj model drukarki, np. ZD421t.')
      return
    }
    if (cleanSerial.length < 5) {
      setError('Numer seryjny ma zwykle kilkanaście znaków — sprawdź naklejkę na spodzie drukarki.')
      return
    }
    if (inCart.some((i) => i.serial_number === cleanSerial)) {
      setError('Ta drukarka jest już w koszyku.')
      return
    }

    addItem({
      id: `${productId}:${cleanSerial}`,
      productId,
      name: `${name} — ${cleanModel} (S/N ${cleanSerial})`,
      slug,
      sku,
      price: priceNetto,
      price_brutto: priceBrutto,
      product_type: 'kontrakt',
      stock: 1,
      is_service: true,
      fixed_quantity: true,
      serial_number: cleanSerial,
      contract_device_model: cleanModel,
    })

    setJustAdded(`${cleanModel} · ${cleanSerial}`)
    setError(null)
    setModel('')
    setSerial('')
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-bold text-slate-900">{formatPrice(priceNetto)} zł</span>
        <span className="text-sm font-semibold text-slate-500">netto</span>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        {formatPrice(priceBrutto)} zł brutto za trzy lata opieki nad jedną drukarką.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="contract-model" className="block text-sm font-semibold text-slate-900">
            Model drukarki
          </label>
          <input
            id="contract-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="np. ZD421t"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
          />
        </div>

        <div>
          <label htmlFor="contract-serial" className="block text-sm font-semibold text-slate-900">
            Numer seryjny
          </label>
          <input
            id="contract-serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="np. D8J221200145"
            className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono uppercase text-slate-900 outline-none transition placeholder:normal-case focus:border-slate-400"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Znajdziesz go na naklejce znamionowej na spodzie drukarki albo na wydruku konfiguracyjnym.
            Kontrakt przypisujemy do tego konkretnego urządzenia.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {error}
          </div>
        )}

        {justAdded && !error && (
          <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>
              Dodano do koszyka: <strong className="text-slate-900">{justAdded}</strong>. Masz więcej
              drukarek? Wpisz kolejny numer seryjny.
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
        >
          <ShoppingCart className="h-5 w-5" />
          Dodaj do koszyka
        </button>
      </div>

      {inCart.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            W koszyku ({inCart.length} {inCart.length === 1 ? 'urządzenie' : 'urządzenia'})
          </p>
          <ul className="mt-3 space-y-2">
            {inCart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5"
              >
                <span className="text-sm text-slate-700">
                  <strong className="text-slate-900">{item.contract_device_model}</strong>
                  <span className="ml-2 font-mono text-xs text-slate-500">{item.serial_number}</span>
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Usuń z koszyka"
                  className="text-slate-400 transition hover:text-slate-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push('/sklep/zamowienie')}
              className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-center font-bold text-white transition hover:bg-slate-800"
            >
              Przejdź do zamówienia
            </button>
            <Link
              href="/sklep/koszyk"
              className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-center font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Zobacz koszyk
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
