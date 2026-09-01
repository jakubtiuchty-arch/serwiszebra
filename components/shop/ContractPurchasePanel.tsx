'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShoppingCart, Trash2, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { przewinDoFormularza } from './KontraktCtaLink'

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

  /**
   * Cena ma być w JEDNYM miejscu w polu widzenia. Dopóki widać hero z dużą ceną,
   * panel jej nie powtarza; pasek na telefonie pojawia się dopiero, gdy klient
   * minął hero i nie widzi jeszcze formularza.
   */
  const [heroWidoczny, setHeroWidoczny] = useState(true)
  const [panelWidoczny, setPanelWidoczny] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero-kontrakt')
    const panel = document.getElementById('panel-zakupu')
    if (!hero || !panel) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === hero) setHeroWidoczny(e.isIntersecting)
          if (e.target === panel) setPanelWidoczny(e.isIntersecting)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(hero)
    obs.observe(panel)
    return () => obs.disconnect()
  }, [])

  const inCart = useMemo(() => items.filter((i) => i.productId === productId), [items, productId])
  const suma = inCart.length * priceNetto
  const miesiecznie = priceNetto / 36
  const pokazPasek = !heroWidoczny && !panelWidoczny

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
    <>
      <div
        id="panel-zakupu"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
      >
        {/* Cena stoi w hero i przy przycisku — na górze panelu byłaby trzecim powtórzeniem */}
        <h2 className="text-lg font-bold text-slate-900">Kup kontrakt na swoją drukarkę</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Kontrakt obejmuje jedno urządzenie. Masz kilka drukarek — dodaj tyle kontraktów, ile
          sztuk chcesz objąć.
        </p>

        <div className="mt-5 space-y-4">
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
              Jest na naklejce na spodzie drukarki. Kontrakt przypisujemy do tego jednego
              urządzenia.
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
                Dodano: <strong className="text-slate-900">{justAdded}</strong>. Masz więcej
                drukarek? Wpisz kolejny numer seryjny.
              </span>
            </div>
          )}

          {/* Cena tuż nad przyciskiem — ale tylko, gdy duża cena z hero zniknęła z ekranu */}
          <div
            className="flex items-baseline justify-between border-t border-slate-200 pt-4"
            hidden={heroWidoczny}
          >
            <span className="text-sm text-slate-600">
              Za trzy lata opieki
              <span className="block text-xs text-slate-500">
                {formatPrice(miesiecznie)} zł miesięcznie
              </span>
            </span>
            <span className="text-right">
              <strong className="text-2xl font-bold text-slate-900">
                {formatPrice(priceNetto)} zł
              </strong>
              <span className="ml-1 text-sm font-semibold text-slate-500">netto</span>
              <span className="block text-xs text-slate-500">
                {formatPrice(priceBrutto)} zł brutto
              </span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
          >
            <ShoppingCart className="h-5 w-5" />
            Dodaj do koszyka
          </button>

          {/* Jedyne, co warto powiedzieć pod przyciskiem: kto naprawia i od kiedy działa ochrona */}
          <div className="flex items-start gap-2 pt-1 text-xs leading-relaxed text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
            <span>
              Naprawia autoryzowany serwis Zebry. Ochrona zaczyna się w dniu zaksięgowania wpłaty i
              trwa trzy lata.
            </span>
          </div>
        </div>

        {inCart.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                W koszyku: {inCart.length}{' '}
                {inCart.length === 1 ? 'drukarka' : inCart.length < 5 ? 'drukarki' : 'drukarek'}
              </p>
              <p className="text-sm font-bold text-slate-900">{formatPrice(suma)} zł netto</p>
            </div>
            <ul className="mt-3 space-y-2">
              {inCart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2.5"
                >
                  <span className="text-sm text-slate-700">
                    <strong className="text-slate-900">{item.contract_device_model}</strong>
                    <span className="ml-2 font-mono text-xs text-slate-500">
                      {item.serial_number}
                    </span>
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

      {/* Pasek zakupu na telefonie — między hero a formularzem, gdy żadnego nie widać */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-200 lg:hidden ${
          pokazPasek ? 'translate-y-0' : 'translate-y-full'
        }`}
        aria-hidden={!pokazPasek}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold leading-none text-slate-900">
              {formatPrice(priceNetto)} zł <span className="text-xs font-semibold text-slate-500">netto</span>
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {formatPrice(miesiecznie)} zł miesięcznie przez trzy lata
            </p>
          </div>
          <button
            type="button"
            onClick={przewinDoFormularza}
            tabIndex={pokazPasek ? 0 : -1}
            className="flex-shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Kup kontrakt
          </button>
        </div>
      </div>
    </>
  )
}
