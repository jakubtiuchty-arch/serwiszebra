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
  ShoppingBag,
  CreditCard,
  FileText
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
  // Płatność
  paymentMethod: 'stripe' | 'bankTransfer'
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
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null)
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null)
  
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
    paymentMethod: 'stripe',
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
      // 1. Utwórz zamówienie w bazie
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

      const orderData = await response.json()

      // 2. Jeśli płatność online - przekieruj do Stripe
      if (formData.paymentMethod === 'stripe') {
        const checkoutResponse = await fetch('/api/shop/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: orderData.orderId })
        })

        if (!checkoutResponse.ok) {
          const checkoutError = await checkoutResponse.json()
          console.error('Checkout error:', checkoutError)
          throw new Error(checkoutError.details || checkoutError.error || 'Błąd tworzenia sesji płatności')
        }

        const { url } = await checkoutResponse.json()
        
        // Wyczyść koszyk przed przekierowaniem
        clearCart()
        
        // Przekieruj do Stripe Checkout
        window.location.href = url
        return
      }

      // 3. Przelew bankowy - zapisz dane zamówienia i pokaż sukces
      setCompletedOrderId(orderData.orderId)
      setCompletedOrderNumber(orderData.orderNumber)
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Koszyk jest pusty
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              Dodaj produkty, aby złożyć zamówienie
            </p>
            <Link
              href="/sklep"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Przejdź do sklepu
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  // Funkcja otwierania pro formy (HTML do druku/PDF)
  const handleOpenProforma = () => {
    if (!completedOrderId) return
    window.open(`/api/shop/orders/${completedOrderId}/proforma`, '_blank')
  }

  // Sukces
  if (isSuccess) {
    return (
      <>
        <Header currentPage="other" />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md px-2">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Zamówienie przyjęte!
            </h1>
            
            {completedOrderNumber && (
              <p className="text-lg font-mono font-bold text-gray-900 mb-2">
                {completedOrderNumber}
              </p>
            )}
            
            <p className="text-sm sm:text-base text-gray-600 mb-2">
              Dziękujemy za złożenie zamówienia.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">
              Potwierdzenie zostało wysłane na podany adres e-mail.
            </p>

            {/* Pro Forma sekcja - tylko dla przelewu */}
            {completedOrderId && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 justify-center mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Faktura Pro Forma</h3>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  Pobierz pro formę i opłać zamówienie przelewem. Realizacja po zaksięgowaniu wpłaty.
                </p>
                <button
                  onClick={handleOpenProforma}
                  className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Otwórz Pro Formę
                </button>
              </div>
            )}

            {/* Dane do przelewu */}
            {completedOrderId && (
              <div className="bg-gray-100 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">Dane do przelewu:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">Odbiorca:</span> TAKMA Tadeusz Tiuchty</p>
                  <p><span className="font-medium">Nr konta:</span> 39 1020 5297 0000 1902 0283 3069</p>
                  <p><span className="font-medium">Bank:</span> PKO Bank Polski</p>
                  <p><span className="font-medium">Tytuł:</span> Zamówienie {completedOrderNumber}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link
                href="/sklep"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Kontynuuj zakupy
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
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
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-base sm:text-xl font-bold text-gray-900">
                Dane do zamówienia
              </h1>
              <Link
                href="/sklep/koszyk"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Wróć do koszyka</span>
                <span className="sm:hidden">Koszyk</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-6">
              
              {/* Podsumowanie - na mobile na górze */}
              <div className="lg:col-span-2 order-first lg:order-last">
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm lg:sticky lg:top-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Twoje zamówienie
                  </h2>

                  {/* Lista produktów */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5 max-h-48 sm:max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product_type === 'glowica' ? (
                            <Image
                              src={DEFAULT_PRINTHEAD_IMAGE}
                              alt={item.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            {item.quantity} × {item.price.toFixed(2).replace('.', ',')} zł
                          </p>
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900">
                          {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sumy */}
                  <div className="border-t border-gray-100 pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">Suma netto</span>
                      <span className="font-medium">{subtotalNetto.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-500">VAT 23%</span>
                      <span>{vatAmount.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold pt-2 border-t border-gray-100">
                      <span>Razem brutto</span>
                      <span>{subtotalBrutto.toFixed(2).replace('.', ',')} zł</span>
                    </div>
                  </div>

                  {/* Dostawa */}
                  <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-green-50 rounded-lg flex items-center gap-2 text-xs sm:text-sm text-green-700">
                    <Truck className="w-4 h-4 flex-shrink-0" />
                    <span>Darmowa dostawa kurierem</span>
                  </div>

                  {/* Tylko na desktop: checkbox i submit */}
                  <div className="hidden lg:block">
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
                          i wyrażam zgodę na przetwarzanie danych osobowych. *
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
                      ) : formData.paymentMethod === 'stripe' ? (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Przejdź do płatności
                        </>
                      ) : (
                        'Złóż zamówienie'
                      )}
                    </button>

                    <p className="mt-3 text-xs text-gray-500 text-center">
                      {formData.paymentMethod === 'stripe' 
                        ? 'Zostaniesz przekierowany do bezpiecznej strony płatności'
                        : 'Po złożeniu zamówienia pobierzesz fakturę pro forma (PDF)'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Formularz */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-last lg:order-first">
                
                {/* Dane firmy */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Dane do faktury
                  </h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Nazwa firmy *
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="np. ABC Sp. z o.o."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        NIP *
                      </label>
                      <input
                        type="text"
                        name="nip"
                        value={formData.nip}
                        onChange={handleChange}
                        required
                        inputMode="numeric"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="np. 1234567890"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Osoba kontaktowa *
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          required
                          autoComplete="name"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Imię i nazwisko"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Telefon *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="np. 601 619 898"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        inputMode="email"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@firma.pl"
                      />
                    </div>
                  </div>
                </div>

                {/* Adres dostawy */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Adres dostawy
                  </h2>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Ulica i numer */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Ulica *
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          required
                          autoComplete="street-address"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="np. Główna"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Nr bud. *
                        </label>
                        <input
                          type="text"
                          name="houseNumber"
                          value={formData.houseNumber}
                          onChange={handleChange}
                          required
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="12A"
                        />
                      </div>
                    </div>
                    
                    {/* Lokal, kod, miasto */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Nr lokalu
                        </label>
                        <input
                          type="text"
                          name="apartmentNumber"
                          value={formData.apartmentNumber}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Kod poczt. *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          required
                          autoComplete="postal-code"
                          inputMode="numeric"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="00-000"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Miasto *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          autoComplete="address-level2"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Warszawa"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metoda płatności */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Metoda płatności
                  </h2>
                  
                  <div className="space-y-3">
                    {/* Płatność online */}
                    <label 
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'stripe' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={formData.paymentMethod === 'stripe'}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-green-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-900">Płatność online</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Zalecane
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Karta płatnicza, BLIK, przelewy24. Szybka i bezpieczna płatność przez Stripe.
                        </p>
                      </div>
                    </label>

                    {/* Przelew bankowy */}
                    <label 
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'bankTransfer' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bankTransfer"
                        checked={formData.paymentMethod === 'bankTransfer'}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900">Pro forma</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Pobierz fakturę pro forma i opłać przelewem. Realizacja po zaksięgowaniu.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Uwagi */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Uwagi do zamówienia
                  </h2>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Opcjonalne uwagi..."
                  />
                </div>

                {/* Na mobile: checkbox i submit */}
                <div className="lg:hidden bg-white rounded-xl p-4 shadow-sm">
                  {/* Akceptacja regulaminu */}
                  <label className="flex items-start gap-3 cursor-pointer mb-4">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      required
                      className="mt-0.5 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      Akceptuję{' '}
                      <Link href="/regulamin" className="text-blue-600 hover:underline">
                        regulamin sklepu
                      </Link>{' '}
                      i wyrażam zgodę na przetwarzanie danych osobowych. *
                    </span>
                  </label>

                  {/* Błąd */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.acceptTerms}
                    className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Przetwarzanie...
                      </>
                    ) : formData.paymentMethod === 'stripe' ? (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Zapłać {subtotalBrutto.toFixed(2).replace('.', ',')} zł
                      </>
                    ) : (
                      <>
                        Złóż zamówienie
                        <span className="font-bold">({subtotalBrutto.toFixed(2).replace('.', ',')} zł)</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-xs text-gray-500 text-center">
                    {formData.paymentMethod === 'stripe' 
                      ? 'Bezpieczna płatność przez Stripe'
                      : 'Pobierzesz fakturę pro forma (PDF)'
                    }
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

