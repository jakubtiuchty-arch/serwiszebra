// Google Tag Manager - helper do śledzenia zdarzeń

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

type GTMEventParams = Record<string, string | number | boolean | undefined>

/**
 * Wysyła zdarzenie do Google Tag Manager
 */
export function trackEvent(eventName: string, params?: GTMEventParams) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    })
    console.log(`[GTM] Event: ${eventName}`, params)
  }
}

// ========== ZDARZENIA FORMULARZY ==========

/**
 * Śledzenie wysłania formularza zgłoszenia serwisowego
 */
export function trackRepairFormSubmit(data: {
  deviceType: string
  deviceModel: string
  isWarranty: boolean
  urgency: string
}) {
  trackEvent('repair_form_submit', {
    device_type: data.deviceType,
    device_model: data.deviceModel,
    is_warranty: data.isWarranty,
    urgency: data.urgency,
  })
}

/**
 * Śledzenie rozpoczęcia wypełniania formularza
 */
export function trackRepairFormStart() {
  trackEvent('repair_form_start')
}

// ========== ZDARZENIA CZATU AI ==========

/**
 * Śledzenie otwarcia czatu AI
 */
export function trackChatOpen() {
  trackEvent('chat_open')
}

/**
 * Śledzenie wysłania wiadomości w czacie
 */
export function trackChatMessage(messageLength: number) {
  trackEvent('chat_message_sent', {
    message_length: messageLength,
  })
}

/**
 * Śledzenie otrzymania odpowiedzi AI
 */
export function trackChatResponse(responseTime: number) {
  trackEvent('chat_response_received', {
    response_time_ms: responseTime,
  })
}

// ========== ZDARZENIA KONTAKTOWE ==========

/**
 * Śledzenie kliknięcia w numer telefonu
 */
export function trackPhoneClick(phoneNumber: string, location: string) {
  trackEvent('phone_click', {
    phone_number: phoneNumber,
    click_location: location,
  })
}

/**
 * Śledzenie kliknięcia w email
 */
export function trackEmailClick(email: string, location: string) {
  trackEvent('email_click', {
    email_address: email,
    click_location: location,
  })
}

// ========== ZDARZENIA SKLEPU ==========

/**
 * Śledzenie wyświetlenia produktu
 */
export function trackProductView(data: {
  productId: string
  productName: string
  price: number
  category: string
}) {
  trackEvent('view_item', {
    item_id: data.productId,
    item_name: data.productName,
    price: data.price,
    item_category: data.category,
  })
}

/**
 * Śledzenie dodania do koszyka
 */
export function trackAddToCart(data: {
  productId: string
  productName: string
  price: number
  quantity: number
}) {
  trackEvent('add_to_cart', {
    item_id: data.productId,
    item_name: data.productName,
    price: data.price,
    quantity: data.quantity,
  })
}

/**
 * Śledzenie rozpoczęcia checkout
 */
export function trackBeginCheckout(data: {
  totalValue: number
  itemCount: number
}) {
  trackEvent('begin_checkout', {
    value: data.totalValue,
    item_count: data.itemCount,
  })
}

/**
 * Śledzenie zakupu
 */
export function trackPurchase(data: {
  transactionId: string
  totalValue: number
  itemCount: number
}) {
  trackEvent('purchase', {
    transaction_id: data.transactionId,
    value: data.totalValue,
    item_count: data.itemCount,
  })
}

// ========== ZDARZENIA INSTRUKCJI ==========

/**
 * Śledzenie pobrania instrukcji PDF
 */
export function trackPdfDownload(data: {
  model: string
  documentType: string
  fileName: string
}) {
  trackEvent('pdf_download', {
    model: data.model,
    document_type: data.documentType,
    file_name: data.fileName,
  })
}

/**
 * Śledzenie wyświetlenia strony instrukcji
 */
export function trackInstructionView(model: string) {
  trackEvent('instruction_view', {
    model: model,
  })
}

// ========== ZDARZENIA BLOGA ==========

/**
 * Śledzenie wyświetlenia artykułu
 */
export function trackArticleView(data: {
  slug: string
  title: string
  category: string
}) {
  trackEvent('article_view', {
    article_slug: data.slug,
    article_title: data.title,
    article_category: data.category,
  })
}

/**
 * Śledzenie udostępnienia artykułu
 */
export function trackArticleShare(platform: string, articleSlug: string) {
  trackEvent('article_share', {
    platform: platform,
    article_slug: articleSlug,
  })
}

// ========== ZDARZENIA WIDEO ==========

/**
 * Śledzenie odtworzenia wideo
 */
export function trackVideoPlay(data: {
  videoId: string
  videoTitle: string
  category: string
}) {
  trackEvent('video_play', {
    video_id: data.videoId,
    video_title: data.videoTitle,
    video_category: data.category,
  })
}

// ========== ZDARZENIA NAWIGACJI ==========

/**
 * Śledzenie kliknięcia w CTA
 */
export function trackCtaClick(ctaName: string, location: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    click_location: location,
  })
}

/**
 * Śledzenie scrollowania strony (milestones)
 */
export function trackScrollDepth(depth: number, page: string) {
  trackEvent('scroll_depth', {
    depth_percent: depth,
    page_path: page,
  })
}

