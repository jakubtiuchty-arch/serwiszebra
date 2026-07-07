'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/gtm'

/** Globalny nasłuch kliknięć tel:/mailto: → kluczowe zdarzenia GA4 (phone_click/email_click). */
export default function GaClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      if (!a) return
      const href = a.getAttribute('href') || ''
      trackEvent(href.startsWith('tel:') ? 'phone_click' : 'email_click', { link_url: href })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
  return null
}
