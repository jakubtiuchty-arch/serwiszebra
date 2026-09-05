'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { COOKIE_CONSENT_CHANGED, syncOpenAIPixelConsent, trackOpenAIPageView } from '@/lib/openai-pixel'

export default function OpenAIPixel() {
  const pathname = usePathname()

  useEffect(() => {
    const update = () => {
      // Customer/admin pages can contain identifiers and aren't ad landing pages.
      if (/^\/(admin|panel)(\/|$)/.test(pathname)) {
        syncOpenAIPixelConsent()
        return
      }
      trackOpenAIPageView(pathname)
    }
    update()
    window.addEventListener(COOKIE_CONSENT_CHANGED, update)
    window.addEventListener('storage', update)
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGED, update)
      window.removeEventListener('storage', update)
    }
  }, [pathname])

  return null
}
