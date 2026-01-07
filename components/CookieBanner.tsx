'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Settings, Shield } from 'lucide-react'
import { trackCookieConsent } from '@/lib/analytics'

type CookieConsent = {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Zawsze wymagane
    analytics: false,
    marketing: false,
    timestamp: 0
  })

  useEffect(() => {
    // Sprawdź czy użytkownik już wyraził zgodę
    const savedConsent = localStorage.getItem('cookie-consent')
    if (savedConsent) {
      const parsed = JSON.parse(savedConsent) as CookieConsent
      setConsent(parsed)
      // Jeśli zgoda była dawniej niż 365 dni, pokaż banner ponownie
      const daysSinceConsent = (Date.now() - parsed.timestamp) / (1000 * 60 * 60 * 24)
      if (daysSinceConsent > 365) {
        setShowBanner(true)
      }
    } else {
      // Pokaż banner po krótkim opóźnieniu
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() }
    localStorage.setItem('cookie-consent', JSON.stringify(consentWithTimestamp))
    setConsent(consentWithTimestamp)
    setShowBanner(false)
    setShowSettings(false)

    // Aktualizuj GTM consent mode
    if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      const gtag = (window as unknown as { gtag: (...args: unknown[]) => void }).gtag
      gtag('consent', 'update', {
        'analytics_storage': newConsent.analytics ? 'granted' : 'denied',
        'ad_storage': newConsent.marketing ? 'granted' : 'denied',
      })
    }
  }

  const acceptAll = () => {
    trackCookieConsent(true)
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    })
  }

  const acceptNecessary = () => {
    trackCookieConsent(false)
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    })
  }

  const saveCustom = () => {
    saveConsent(consent)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Główny banner */}
          {!showSettings ? (
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-xl items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🍪 Ta strona używa plików cookies
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Używamy plików cookies, aby zapewnić najlepsze doświadczenia na naszej stronie. 
                    Cookies niezbędne są wymagane do działania strony. Cookies analityczne pomagają 
                    nam zrozumieć, jak korzystasz ze strony. Cookies marketingowe pozwalają na 
                    wyświetlanie spersonalizowanych reklam.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={acceptAll}
                      className="flex-1 sm:flex-none bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Akceptuj wszystkie
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="flex-1 sm:flex-none bg-gray-100 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      Tylko niezbędne
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium px-4 py-2.5 text-sm transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Ustawienia
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Więcej informacji w naszej{' '}
                    <Link href="/polityka-prywatnosci" className="text-blue-600 hover:underline">
                      Polityce prywatności
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Panel ustawień */
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ustawienia cookies</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Niezbędne */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Niezbędne</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Wymagane do działania strony. Nie można ich wyłączyć.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow" />
                    </div>
                  </div>
                </div>

                {/* Analityczne */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Analityczne</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Pomagają zrozumieć, jak odwiedzający korzystają ze strony (Google Analytics).
                    </p>
                  </div>
                  <button
                    onClick={() => setConsent({ ...consent, analytics: !consent.analytics })}
                    className={`flex-shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      consent.analytics ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>

                {/* Marketingowe */}
                <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-gray-900">Marketingowe</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Używane do personalizacji reklam (Google Ads, Facebook Pixel).
                    </p>
                  </div>
                  <button
                    onClick={() => setConsent({ ...consent, marketing: !consent.marketing })}
                    className={`flex-shrink-0 w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      consent.marketing ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveCustom}
                  className="flex-1 sm:flex-none bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Zapisz ustawienia
                </button>
                <button
                  onClick={acceptAll}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Akceptuj wszystkie
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

