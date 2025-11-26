'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import Header from '@/components/Header'
import ProformaConfirmationModal from '@/components/ProformaConfirmationModal'
import { CreateOrderRequest } from '@/lib/order-types'
import { createClient } from '@/lib/supabase/client'
import StripePaymentModal from '@/components/StripePaymentModal'
import {
  ShoppingCart,
  ChevronLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Package,
  Printer,
  Battery,
  Cable,
  Truck,
  CreditCard,
  Banknote,
  Download,
  Loader2,
  Check,
  Circle,
  User,
  ShieldCheck
} from 'lucide-react'

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

export default function CheckoutPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice())
  const getTotalPriceBrutto = useCartStore((state) => state.getTotalPriceBrutto())

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<{
    invoiceNumber: string
    totalBrutto: number
    paymentDue: string
    pdfBlob?: Blob
  } | null>(null)

  const [formData, setFormData] = useState({
    guestEmail: '',
    contactPerson: '',
    companyName: '',
    nip: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    notes: ''
  })

  const [deliveryMethod, setDeliveryMethod] = useState<'courier' | 'osobisty'>('courier')
  const [paymentMethod, setPaymentMethod] = useState<'bankTransfer' | 'proforma' | 'stripe'>('bankTransfer')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null)
  const [paymentOrderNumber, setPaymentOrderNumber] = useState<string>('')
  const [paymentTotalAmount, setPaymentTotalAmount] = useState<number>(0)

  const [completedSections, setCompletedSections] = useState({
    account: false,
    contact: false,
    company: false,
    address: false,
    delivery: false,
    payment: false
  })

  const [hasInteractedWith, setHasInteractedWith] = useState({
    delivery: false,
    payment: false
  })
const [profileAddress, setProfileAddress] = useState({
    street: '',
    city: '',
    postalCode: ''
  })
  const [useProfileAddress, setUseProfileAddress] = useState(true)
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      setIsAuthenticated(!!user)
      if (user) {
        setUserEmail(user.email || '')
        setCompletedSections(prev => ({ ...prev, account: true }))
        setFormData(prev => ({ ...prev, email: user.email || '' }))
      }
    }

    // Sprawdź przy pierwszym załadowaniu
    checkAuth()

    // Nasłuchuj na zmiany w sesji (np. po powrocie z rejestracji/logowania)
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setIsAuthenticated(true)
        setUserEmail(session.user.email || '')
        setCompletedSections(prev => ({ ...prev, account: true }))
        setFormData(prev => ({ ...prev, email: session.user.email || '' }))
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])
useEffect(() => {
    const loadProfileData = async () => {
      if (!isAuthenticated) return

      try {
        console.log('🔵 Loading profile data for autofill...')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          console.log('⚠️ No user found')
          return
        }

        console.log('✅ User found, fetching company data...')
        const response = await fetch('/api/company-data')

        if (!response.ok) {
          console.log('⚠️ Failed to fetch company data:', response.status)
          return
        }

        const { companyData } = await response.json()
        console.log('📦 Company data received:', companyData)

        if (companyData) {
          // Zapisz adres z profilu osobno
          const savedAddress = {
            street: companyData.street || '',
            city: companyData.city || '',
            postalCode: companyData.postal_code || ''
          }
          setProfileAddress(savedAddress)

          // Autofill formularza
          setFormData(prev => ({
            ...prev,
            contactPerson: companyData.first_name && companyData.last_name
              ? `${companyData.first_name} ${companyData.last_name}`
              : prev.contactPerson,
            companyName: companyData.name || prev.companyName,
            nip: companyData.nip || prev.nip,
            phone: companyData.phone || prev.phone,
            // Adres - tylko jeśli jest w profilu
            street: savedAddress.street || prev.street,
            city: savedAddress.city || prev.city,
            postalCode: savedAddress.postalCode || prev.postalCode,
          }))

          console.log('✅ Form autofilled with company data')
        }
      } catch (error) {
        console.error('❌ Błąd autofill:', error)
      }
    }

    // Dodaj małe opóźnienie dla pewności, że sesja jest zapisana
    const timer = setTimeout(() => {
      loadProfileData()
    }, 300)

    return () => clearTimeout(timer)
  }, [isAuthenticated])
  useEffect(() => {
    if (!mounted) return

    const checkAutofill = () => {
      const isCompanyComplete = 
        formData.companyName.trim() !== '' &&
        formData.nip.trim() !== '' &&
        formData.email.trim() !== '' &&
        formData.phone.trim() !== ''
      
      setCompletedSections(prev => ({ ...prev, company: isCompanyComplete }))

      const isAddressComplete = 
        formData.street.trim() !== '' &&
        formData.city.trim() !== '' &&
        formData.postalCode.trim() !== ''
      
      setCompletedSections(prev => ({ ...prev, address: isAddressComplete }))
    }

    const timer1 = setTimeout(checkAutofill, 100)
    const timer2 = setTimeout(checkAutofill, 500)
    const timer3 = setTimeout(checkAutofill, 1000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [mounted])

  useEffect(() => {
    const isCompanyComplete = 
      formData.companyName.trim() !== '' &&
      formData.nip.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phone.trim() !== ''
    
    setCompletedSections(prev => ({ ...prev, company: isCompanyComplete }))
  }, [formData.companyName, formData.nip, formData.email, formData.phone])

  useEffect(() => {
    const isContactComplete = formData.contactPerson.trim() !== ''
    setCompletedSections(prev => ({ ...prev, contact: isContactComplete }))
  }, [formData.contactPerson])

  useEffect(() => {
    const isAddressComplete = 
      formData.street.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.postalCode.trim() !== ''
      
    setCompletedSections(prev => ({ ...prev, address: isAddressComplete }))
  }, [formData.street, formData.city, formData.postalCode])

  useEffect(() => {
    if (!isAuthenticated && checkoutAsGuest && formData.guestEmail.trim()) {
      setCompletedSections(prev => ({ ...prev, account: true }))
    }
  }, [isAuthenticated, checkoutAsGuest, formData.guestEmail])

  useEffect(() => {
    if (hasInteractedWith.delivery) {
      setCompletedSections(prev => ({ ...prev, delivery: true }))
    }
  }, [hasInteractedWith.delivery])

  useEffect(() => {
    if (hasInteractedWith.payment) {
      setCompletedSections(prev => ({ ...prev, payment: true }))
    }
  }, [hasInteractedWith.payment])

  const progressPercentage = 
    (Object.values(completedSections).filter(Boolean).length / 6) * 100

  if (!mounted) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <Header />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-400">Ładowanie...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }


  const vatAmount = getTotalPriceBrutto - getTotalPrice

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!isAuthenticated && checkoutAsGuest) {
      if (!formData.guestEmail.trim()) {
        newErrors.guestEmail = 'Email jest wymagany'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
        newErrors.guestEmail = 'Nieprawidłowy format email'
      }
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Imię i nazwisko są wymagane'
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nazwa firmy jest wymagana'
    }

    if (!formData.nip.trim()) {
      newErrors.nip = 'NIP jest wymagany'
    } else if (!/^\d{10}$/.test(formData.nip.replace(/[^0-9]/g, ''))) {
      newErrors.nip = 'NIP musi zawierać 10 cyfr'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon jest wymagany'
    } else if (!/^\d{9,}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Telefon musi zawierać co najmniej 9 cyfr'
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Ulica i numer są wymagane'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Miasto jest wymagane'
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Kod pocztowy jest wymagany'
    } else if (!/^\d{2}-?\d{3}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Nieprawidłowy format kodu pocztowego (XX-XXX)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    console.log('💳 Payment method:', paymentMethod)

    setIsSubmitting(true)

    try {
      if (paymentMethod === 'proforma') {
        const response = await fetch('/api/generate-proforma', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: formData,
            items: items,
            deliveryMethod: deliveryMethod
          })
        })

        if (!response.ok) {
          throw new Error('Failed to generate proforma')
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('Content-Disposition')
        const filenameMatch = contentDisposition?.match(/filename="(.+)"/)
        const filename = filenameMatch ? filenameMatch[1] : 'faktura-proforma.pdf'
        
        const invoiceNumberMatch = filename.match(/PF-(\d+)-(\d+)/)
        const invoiceNumber = invoiceNumberMatch 
          ? `PF/${invoiceNumberMatch[1]}/${invoiceNumberMatch[2]}` 
          : 'PF/2025/000000'

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        const subtotalBrutto = items.reduce((sum, item) => 
          sum + (item.price_brutto * item.quantity), 0
        )
        const deliveryCostBrutto = deliveryMethod === 'courier' ? 24.60 : 0.00
        const totalBrutto = subtotalBrutto + deliveryCostBrutto

        const orderRequest: CreateOrderRequest = {
          customer: {
            contactPerson: formData.contactPerson,
            companyName: formData.companyName,
            nip: formData.nip,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            notes: formData.notes || ''
          },
          guestEmail: !isAuthenticated ? formData.guestEmail : null,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku || `${item.product_type}-${item.id.slice(0, 8)}`,
            price: item.price,
            price_brutto: item.price_brutto,
            quantity: item.quantity,
            product_type: item.product_type
          })),
          deliveryMethod: deliveryMethod,
          paymentMethod: paymentMethod,
          subtotalNetto: getTotalPrice,
          deliveryCostNetto: deliveryMethod === 'courier' ? 20.00 : 0.00,
          deliveryCostBrutto: deliveryMethod === 'courier' ? 24.60 : 0.00,
          vatAmount: vatAmount + (deliveryMethod === 'courier' ? 4.60 : 0),
          totalNetto: getTotalPrice + (deliveryMethod === 'courier' ? 20.00 : 0.00),
          totalBrutto: totalBrutto,
          orderNumber: invoiceNumber
        }

        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderRequest)
        })

        if (orderResponse.ok) {
          const orderData = await orderResponse.json()
          const clearCart = useCartStore.getState().clearCart
          clearCart()
          
          localStorage.setItem('lastOrderId', orderData.orderId)
          localStorage.setItem('lastOrderNumber', invoiceNumber)
          if (!isAuthenticated && formData.guestEmail) {
            localStorage.setItem('lastGuestEmail', formData.guestEmail)
          }
          
          setTimeout(() => {
            router.push(`/zamowienie/${orderData.orderId}/potwierdzenie`)
          }, 100)
        }
        
      } else if (paymentMethod === 'stripe') {
        const subtotalBrutto = items.reduce((sum, item) => 
          sum + (item.price_brutto * item.quantity), 0
        )
        const deliveryCostBrutto = deliveryMethod === 'courier' ? 24.60 : 0.00
        const deliveryCostNetto = deliveryMethod === 'courier' ? 20.00 : 0.00
        const totalBrutto = subtotalBrutto + deliveryCostBrutto
        const totalNetto = getTotalPrice + deliveryCostNetto
        const totalVat = vatAmount + (deliveryMethod === 'courier' ? 4.60 : 0)

        const orderRequest: CreateOrderRequest = {
          customer: {
            contactPerson: formData.contactPerson,
            companyName: formData.companyName,
            nip: formData.nip,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            notes: formData.notes || ''
          },
          guestEmail: !isAuthenticated ? formData.guestEmail : null,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            sku: item.sku || `${item.product_type}-${item.id.slice(0, 8)}`,
            price: item.price,
            price_brutto: item.price_brutto,
            quantity: item.quantity,
            product_type: item.product_type
          })),
          deliveryMethod: deliveryMethod,
          paymentMethod: paymentMethod,
          subtotalNetto: getTotalPrice,
          deliveryCostNetto: deliveryCostNetto,
          deliveryCostBrutto: deliveryCostBrutto,
          vatAmount: totalVat,
          totalNetto: totalNetto,
          totalBrutto: totalBrutto,
          orderNumber: undefined
        }

        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderRequest)
        })

        if (!orderResponse.ok) {
          throw new Error('Failed to create order')
        }

const orderData = await orderResponse.json()

console.log('🎯 Order data:', orderData)
console.log('🎯 Setting modal state:', {
  orderId: orderData.orderId,
  orderNumber: orderData.orderNumber,
  totalBrutto: totalBrutto
})

setPaymentOrderId(orderData.orderId)
setPaymentOrderNumber(orderData.orderNumber)
setPaymentTotalAmount(totalBrutto)
setShowPaymentModal(true)

console.log('🎯 Modal should be visible now')
        
      } else {
        alert('Zamówienie zostanie złożone (TODO: integracja z API)')
      }
    } catch (error) {
      console.error('❌ Error submitting order:', error)
      alert('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
        </div>
      </div>

      <Header />

      <div className="pt-32 pb-12 px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">

          <Link
            href="/koszyk"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Powrót do koszyka
          </Link>

          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Finalizacja zamówienia
            </h1>
            <p className="text-sm text-gray-600">
              Uzupełnij dane do faktury i dostawy
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              {[
                { key: 'account', label: 'Konto', icon: ShieldCheck },
                { key: 'contact', label: 'Osoba', icon: User },
                { key: 'company', label: 'Dane firmy', icon: Building2 },
                { key: 'address', label: 'Adres', icon: MapPin },
                { key: 'delivery', label: 'Dostawa', icon: Truck },
                { key: 'payment', label: 'Płatność', icon: CreditCard }
              ].filter(step => isAuthenticated ? step.key !== 'account' : true).map((step, index) => {
                const Icon = step.icon
                const isComplete = completedSections[step.key as keyof typeof completedSections]

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition-all duration-300 ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isComplete ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className={`text-[10px] font-medium transition-colors ${
                        isComplete ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < (isAuthenticated ? 4 : 5) && (
                      <div className="flex-1 h-0.5 mx-1 bg-gray-200 relative overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-green-500 transition-transform duration-500 ${
                            completedSections[
                              (isAuthenticated
                                ? ['contact', 'company', 'address', 'delivery'][index]
                                : ['account', 'contact', 'company', 'address', 'delivery'][index]) as keyof typeof completedSections
                            ] ? 'translate-x-0' : '-translate-x-full'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-600 text-center mt-1.5">
              Wypełniono {Math.round(progressPercentage)}% formularza
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">

            <div className="lg:col-span-2 space-y-3">

              {!isAuthenticated && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      Jak chcesz złożyć zamówienie?
                    </h2>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        checkoutAsGuest
                          ? 'border-gray-900 bg-gray-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        checked={checkoutAsGuest}
                        onChange={() => setCheckoutAsGuest(true)}
                        className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">Kupuję jako gość</div>
                        <p className="text-xs text-gray-600 mb-2">
                          Złóż zamówienie bez zakładania konta
                        </p>

                        {checkoutAsGuest && (
                          <div>
                            <label htmlFor="guestEmail" className="block text-xs font-medium text-gray-700 mb-1.5">
                              Email *
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                id="guestEmail"
                                name="guestEmail"
                                value={formData.guestEmail}
                                onChange={handleChange}
                                className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                                  errors.guestEmail ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                                } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                                placeholder="twoj@email.pl"
                              />
                            </div>
                            {errors.guestEmail && (
                              <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.guestEmail}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        !checkoutAsGuest
                          ? 'border-gray-900 bg-gray-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        checked={!checkoutAsGuest}
                        onChange={() => setCheckoutAsGuest(false)}
                        className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">Utwórz konto</div>
                        <p className="text-xs text-gray-600 mb-2">
                          Załóż konto i korzystaj z dodatkowych korzyści
                        </p>

                        {!checkoutAsGuest && (
                          <div className="space-y-1.5">
                            <Link
                              href="/rejestracja?redirect=/checkout"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                            >
                              <User className="w-3.5 h-3.5" />
                              Załóż konto
                            </Link>
                            <div className="text-xs text-gray-600">
                              Mam już konto?{' '}
                              <Link
                                href="/logowanie?redirect=/checkout"
                                className="text-blue-600 hover:underline font-semibold"
                              >
                                Zaloguj się
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs font-semibold text-green-900">
                      Zalogowany jako: {userEmail}
                    </p>
                    <p className="text-[10px] text-green-700">
                      Twoje zamówienie zostanie przypisane do konta
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {isAuthenticated ? '1' : '2'}
                    </div>
                    Osoba zamawiająca
                  </h2>
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-xs font-medium text-gray-700 mb-1.5">
                    Imię i nazwisko *
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      id="contactPerson"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                        errors.contactPerson ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                      } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                      placeholder="Jan Kowalski"
                    />
                  </div>
                  {errors.contactPerson && (
                    <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.contactPerson}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {isAuthenticated ? '2' : '3'}
                    </div>
                    Dane firmy
                  </h2>
                  {completedSections.company && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Wypełnione
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Nazwa firmy *
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                          errors.companyName ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                        placeholder="Nazwa firmy"
                      />
                    </div>
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="nip" className="block text-xs font-medium text-gray-700 mb-1.5">
                      NIP *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="nip"
                        name="nip"
                        value={formData.nip}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                          errors.nip ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                        placeholder="NIP"
                      />
                    </div>
                    {errors.nip && (
                      <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.nip}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                            errors.email ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                          placeholder="Email"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Telefon *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                            errors.phone ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                          } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                          placeholder="Telefon"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {isAuthenticated ? '3' : '4'}
                    </div>
                    Adres dostawy
                  </h2>
                  {completedSections.address && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Wypełnione
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                                      {/* CHECKBOX - WKLEJ TUTAJ */}
                  {isAuthenticated && profileAddress.street && (
                    <label className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition-all">
                      <input
                        type="checkbox"
                        checked={!useProfileAddress}
                        onChange={(e) => {
                          setUseProfileAddress(!e.target.checked)
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              street: '',
                              city: '',
                              postalCode: ''
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              street: profileAddress.street,
                              city: profileAddress.city,
                              postalCode: profileAddress.postalCode
                            }))
                          }
                        }}
                        className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-blue-900">
                        Wyślij na inny adres niż zapisany w profilu
                      </span>
                    </label>
                  )}
                  <div>
                    <label htmlFor="street" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Ulica i numer *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border ${
                          errors.street ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                        placeholder="Ulica i numer"
                      />
                    </div>
                    {errors.street && (
                      <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.street}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Kod pocztowy *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm rounded-lg border ${
                          errors.postalCode ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                        placeholder="Kod pocztowy"
                      />
                      {errors.postalCode && (
                        <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.postalCode}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1.5">
                        Miasto *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 text-sm rounded-lg border ${
                          errors.city ? 'border-red-300 bg-red-50 animate-shake' : 'border-gray-200 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all`}
                        placeholder="Miasto"
                      />
                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600 animate-fadeIn">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1.5">
                      Uwagi do zamówienia (opcjonalnie)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
                      placeholder="Uwagi do zamówienia..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {isAuthenticated ? '4' : '5'}
                    </div>
                    Sposób dostawy
                  </h2>
                  {completedSections.delivery && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Wypełnione
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'courier'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="courier"
                      checked={deliveryMethod === 'courier'}
                      onChange={() => {
                        setDeliveryMethod('courier')
                        setHasInteractedWith(prev => ({ ...prev, delivery: true }))
                      }}
                      className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Truck className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">Kurier DPD/InPost</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Dostawa na adres w ciągu 1-2 dni roboczych
                      </p>
                      <p className="text-xs font-semibold text-gray-900 mt-1">
                        Koszt: 20.00 zł netto (24.60 zł brutto)
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      deliveryMethod === 'osobisty'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value="osobisty"
                      checked={deliveryMethod === 'osobisty'}
                      onChange={() => {
                        setDeliveryMethod('osobisty')
                        setHasInteractedWith(prev => ({ ...prev, delivery: true }))
                      }}
                      className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">Odbiór osobisty</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Odbiór w naszym serwisie: ul. Poświęcka 1a, Wrocław
                      </p>
                      <p className="text-xs font-semibold text-green-600 mt-1">
                        Koszt: 0.00 zł (Darmowy odbiór)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      {isAuthenticated ? '5' : '6'}
                    </div>
                    Metoda płatności
                  </h2>
                  {completedSections.payment && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Wypełnione
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'bankTransfer'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="bankTransfer"
                      checked={paymentMethod === 'bankTransfer'}
                      onChange={() => {
                        setPaymentMethod('bankTransfer')
                        setHasInteractedWith(prev => ({ ...prev, payment: true }))
                      }}
                      className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Banknote className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">Przelew bankowy</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Dane do przelewu otrzymasz na email po złożeniu zamówienia
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'proforma'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="proforma"
                      checked={paymentMethod === 'proforma'}
                      onChange={() => {
                        setPaymentMethod('proforma')
                        setHasInteractedWith(prev => ({ ...prev, payment: true }))
                      }}
                      className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Download className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">Faktura pro forma</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Pobierz fakturę pro forma i opłać ją w dogodnym terminie
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-gray-900 bg-gray-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={() => {
                        setPaymentMethod('stripe')
                        setHasInteractedWith(prev => ({ ...prev, payment: true }))
                      }}
                      className="mt-0.5 w-4 h-4 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <CreditCard className="w-4 h-4 text-gray-700" />
                        <span className="text-sm font-semibold text-gray-900">Płatność online</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Przelewy bankowe przez Przelewy24, BLIK, karty płatnicze
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 sticky top-32 transition-all duration-300">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gray-900 rounded-full" />
                  Podsumowanie
                </h2>

                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => {
                    const Icon = PRODUCT_TYPE_ICONS[item.product_type] || Package

                    return (
                      <div key={item.id} className="flex gap-2 pb-2 border-b border-gray-200 last:border-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-gray-600 mt-0.5">
                            {item.quantity} × {item.price.toFixed(2)} zł
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2)} zł
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>Suma netto</span>
                    <span className="font-semibold text-gray-900">
                      {getTotalPrice.toFixed(2)} zł
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-700 transition-all duration-300">
                    <span>Dostawa {deliveryMethod === 'courier' ? '(Kurier)' : '(Odbiór osobisty)'}</span>
                    <span className={`font-semibold transition-colors ${
                      deliveryMethod === 'osobisty' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {deliveryMethod === 'courier' ? '20.00' : '0.00'} zł
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-700 transition-all duration-300">
                    <span>VAT (23%)</span>
                    <span className="font-semibold text-gray-900">
                      {(vatAmount + (deliveryMethod === 'courier' ? 20 * 0.23 : 0)).toFixed(2)} zł
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-gray-200 transition-all duration-300">
                    <span className="text-sm font-semibold text-gray-700">Suma brutto</span>
                    <span className="text-lg font-black text-gray-900">
                      {(getTotalPriceBrutto + (deliveryMethod === 'courier' ? 24.60 : 0.00)).toFixed(2)} zł
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!isAuthenticated && !checkoutAsGuest)}
                  className="w-full mt-4 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Przetwarzanie...
                    </>
                  ) : paymentMethod === 'proforma' ? (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Złóż zamówienie
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Złóż zamówienie
                    </>
                  )}
                </button>

                {!isAuthenticated && !checkoutAsGuest && (
                  <p className="text-[10px] text-red-600 text-center mt-2">
                    Wybierz opcję konta, aby kontynuować
                  </p>
                )}

                <p className="text-[10px] text-gray-500 text-center mt-3">
                  Składając zamówienie akceptujesz regulamin sklepu
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>

      {modalData && (
        <ProformaConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setModalData(null)
          }}
          invoiceData={modalData}
        />
      )}

      {showPaymentModal && paymentOrderId && (
        <StripePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderId={paymentOrderId}
          orderNumber={paymentOrderNumber}
          totalAmount={paymentTotalAmount}
        />
      )}

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

    </div>
  )
}