'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/cart-store'
import { 
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Loader2,
  ShoppingBag
} from 'lucide-react'

const DEFAULT_PRINTHEAD_IMAGE = '/sklep_photo/głowica-203dpi-do-drukarki-zebra-zd421t-P1112640-218.png'

interface OrderFormData {
  // Dane kontaktowe
  companyName: string
  nip: string
  contactName: string
  email: string
  phone: string
  // Adres dostawy
  street: string
  houseNumber: string
  apartmentNumber: string
  postalCode: string
  city: string
  // Dodatkowe
  notes: string
  acceptTerms: boolean
}

export default function ZamowieniePage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<OrderFormData>({
    companyName: '',
    nip: '',
    contactName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    apartmentNumber: '',
    postalCode: '',
    city: '',
    notes: '',
    acceptTerms: false
  })

  const subtotalNetto = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const subtotalBrutto = items.reduce((sum, item) => sum + item.price_brutto * item.quantity, 0)
  const vatAmount = subtotalBrutto - subtotalNetto

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            priceNetto: item.price,
            priceBrutto: item.price_brutto
          })),
          totalNetto: subtotalNetto,
          totalBrutto: subtotalBrutto
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Błąd składania zamówienia')
      }

      setIsSuccess(true)
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Pusty koszyk
  if (items.length === 0 && !isSuccess) {
    return (
      <>
        <Header currentPage="other" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Koszyk jest pusty
            </h1>
            <p className="text-gray-500 mb-8">
              Dodaj produkty, aby złożyć zamówienie
            </p>
            <Link
              href="/sklep"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Przejdź do sklepu
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Sukces
  if (isSuccess) {
    return (
      <>
        <Header currentPage="other" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Zamówienie przyjęte!
            </h1>
            <p className="text-gray-600 mb-2">
              Dziękujemy za złożenie zamówienia.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Potwierdzenie zostało wysłane na podany adres e-mail. 
              Skontaktujemy się wkrótce w celu potwierdzenia szczegółów i płatności.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/sklep"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Kontynuuj zakupy
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Strona główna
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">
                Dane do zamówienia
              </h1>
              <Link
                href="/sklep/koszyk"
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do koszyka
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-5 gap-6">
              
              {/* Formularz */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Dane firmy */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Dane do faktury
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nazwa firmy *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="np. ABC Sp. z o.o."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIP *
                      </label>
                      <input
                        type="text"
                        name="nip"
                        value={formData.nip}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="np. 1234567890"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Osoba kontaktowa *
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Imię i nazwisko"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="np. 601 619 898"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@firma.pl"
                      />
                    </div>
                  </div>
                </div>

                {/* Adres dostawy */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Adres dostawy
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ulica *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="np. Główna"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nr budynku *
                        </label>
                        <input
                          type="text"
                          name="houseNumber"
                          value={formData.houseNumber}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="12A"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nr lokalu
                        </label>
                        <input
                          type="text"
                          name="apartmentNumber"
                          value={formData.apartmentNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kod pocztowy *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="00-000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Miasto *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Warszawa"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Uwagi */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Uwagi do zamówienia
                  </h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Opcjonalne uwagi..."
                  />
                </div>

              </div>

              {/* Podsumowanie */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Twoje zamówienie
                  </h2>

                  {/* Lista produktów */}
                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product_type === 'glowica' ? (
                            <Image
                              src={DEFAULT_PRINTHEAD_IMAGE}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} × {item.price.toFixed(2).replace('.', ',')} zł
                          </p>
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sumy */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Suma netto</span>
                      <span className="font-medium">{subtotalNetto.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">VAT 23%</span>
                      <span>{vatAmount.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                      <span>Razem brutto</span>
                      <span>{subtotalBrutto.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                  </div>

                  {/* Dostawa */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-700">
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    <span>Darmowa dostawa kurierem</span>
                  </div>

                  {/* Akceptacja regulaminu */}
                  <div className="mt-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        required
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">
                        Akceptuję{' '}
                        <Link href="/regulamin" className="text-blue-600 hover:underline">
                          regulamin sklepu
                        </Link>{' '}
                        i wyrażam zgodę na przetwarzanie danych osobowych w celu realizacji zamówienia. *
                      </span>
                    </label>
                  </div>

                  {/* Błąd */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full mt-5 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Przetwarzanie...
                      </>
                    ) : (
                      'Złóż zamówienie'
                    )}
                  </button>

                  <p className="mt-3 text-xs text-gray-500 text-center">
                    Po złożeniu zamówienia skontaktujemy się w celu potwierdzenia płatności
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}

