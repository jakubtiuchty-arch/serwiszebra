// Official SDK: https://developers.openai.com/ads/measurement-pixel
export const OPENAI_PIXEL_ID = 'GvsvuB7RDLHWsETaF7VJT8'
export const COOKIE_CONSENT_CHANGED = 'cookie-consent-changed'

type PixelQueue = ((...args: unknown[]) => void) & { q?: unknown[][] }

declare global {
  interface Window {
    oaiq?: PixelQueue
  }
}

let initialized = false
let lastPage: string | null = null

export function hasMarketingConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const saved = JSON.parse(localStorage.getItem('cookie-consent') || 'null')
    const age = Date.now() - saved?.timestamp
    return saved?.marketing === true && Number.isFinite(age) && age >= 0 && age <= 365 * 86400000
  } catch {
    return false
  }
}

export function syncOpenAIPixelConsent(): boolean {
  if (typeof window === 'undefined') return false
  const allowed = hasMarketingConsent()
  if (!allowed) {
    window.oaiq?.('consent', false)
    lastPage = null
    return false
  }

  if (!initialized) {
    if (!window.oaiq) {
      const queue: PixelQueue = (...args) => { queue.q!.push(args) }
      queue.q = []
      window.oaiq = queue
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js'
      document.head.appendChild(script)
    }
    window.oaiq('consent', false)
    window.oaiq('init', { pixelId: OPENAI_PIXEL_ID })
    initialized = true
  }
  window.oaiq?.('consent', true)
  return true
}

export function trackOpenAIPageView(pathname: string) {
  if (!syncOpenAIPixelConsent() || lastPage === pathname) return
  window.oaiq?.('measure', 'page_viewed', {
    type: 'contents',
    contents: [{ id: pathname, content_type: 'page' }],
  })
  lastPage = pathname
}

export function trackOpenAIRepairLead(requestId: string) {
  if (!syncOpenAIPixelConsent()) return
  window.oaiq?.('measure', 'lead_created', { type: 'customer_action' }, {
    event_id: `repair_${requestId}`,
  })
}
