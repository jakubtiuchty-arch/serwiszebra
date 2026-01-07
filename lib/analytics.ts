import { track } from '@vercel/analytics';

// ============================================
// CENTRALNE FUNKCJE ŚLEDZENIA VERCEL ANALYTICS
// ============================================

// --- TELEFON I KONTAKT ---
export const trackPhoneClick = (location: string) => {
  track('Phone_Click', { location });
};

export const trackEmailClick = (location: string) => {
  track('Email_Click', { location });
};

export const trackWhatsAppClick = (location: string) => {
  track('WhatsApp_Click', { location });
};

// --- CTA I PRZYCISKI ---
export const trackCTAClick = (buttonName: string, location: string) => {
  track('CTA_Click', { button: buttonName, location });
};

export const trackButtonClick = (buttonName: string, location: string) => {
  track('Button_Click', { button: buttonName, location });
};

// --- FORMULARZE ---
export const trackFormStart = (formName: string) => {
  track('Form_Start', { form: formName });
};

export const trackFormSubmit = (formName: string, details?: Record<string, string | number>) => {
  track('Form_Submit', { form: formName, ...details });
};

export const trackFormError = (formName: string, error: string) => {
  track('Form_Error', { form: formName, error });
};

// --- NAPRAWA ---
export const trackRepairRequest = (deviceType: string, brand: string) => {
  track('Repair_Request', { device_type: deviceType, brand });
};

export const trackRepairPayment = (repairId: string, amount: number) => {
  track('Repair_Payment', { repair_id: repairId, amount });
};

// --- AI CHAT ---
export const trackAIChatOpen = (location: string) => {
  track('AI_Chat_Open', { location });
};

export const trackAIChatMessage = (messageType: 'user' | 'ai') => {
  track('AI_Chat_Message', { type: messageType });
};

export const trackAIChatClose = () => {
  track('AI_Chat_Close', {});
};

// --- INSTRUKCJE ---
export const trackManualView = (model: string, language: string) => {
  track('Manual_View', { model, language });
};

export const trackManualPDFDownload = (model: string, language: string) => {
  track('Manual_PDF_Download', { model, language });
};

export const trackManualSectionView = (model: string, section: string) => {
  track('Manual_Section_View', { model, section });
};

// --- STEROWNIKI ---
export const trackDriverDownload = (model: string, driverType: string) => {
  track('Driver_Download', { model, driver_type: driverType });
};

export const trackDriverPageView = (category: string) => {
  track('Driver_Page_View', { category });
};

// --- SKLEP ---
export const trackProductView = (productName: string, productId: string, price: number) => {
  track('Product_View', { product_name: productName, product_id: productId, price });
};

export const trackAddToCart = (productName: string, productId: string, quantity: number, price: number) => {
  track('Add_To_Cart', { product_name: productName, product_id: productId, quantity, price });
};

export const trackRemoveFromCart = (productName: string, productId: string) => {
  track('Remove_From_Cart', { product_name: productName, product_id: productId });
};

export const trackCheckoutStart = (cartValue: number, itemCount: number) => {
  track('Checkout_Start', { cart_value: cartValue, item_count: itemCount });
};

export const trackPurchase = (orderId: string, totalValue: number, itemCount: number) => {
  track('Purchase', { order_id: orderId, total_value: totalValue, item_count: itemCount });
};

// --- BLOG ---
export const trackBlogPostView = (slug: string, category: string) => {
  track('Blog_Post_View', { slug, category });
};

export const trackBlogSearch = (query: string) => {
  track('Blog_Search', { query });
};

// --- NAWIGACJA ---
export const trackPageSection = (pageName: string, section: string) => {
  track('Page_Section_View', { page: pageName, section });
};

export const trackExternalLink = (url: string, linkName: string) => {
  track('External_Link_Click', { url, link_name: linkName });
};

export const trackInternalLink = (destination: string, source: string) => {
  track('Internal_Link_Click', { destination, source });
};

// --- SOCIAL MEDIA ---
export const trackSocialClick = (platform: string, location: string) => {
  track('Social_Click', { platform, location });
};

// --- WIDEO ---
export const trackVideoPlay = (videoTitle: string, videoId: string) => {
  track('Video_Play', { video_title: videoTitle, video_id: videoId });
};

export const trackVideoComplete = (videoTitle: string, videoId: string) => {
  track('Video_Complete', { video_title: videoTitle, video_id: videoId });
};

// --- FAQ ---
export const trackFAQExpand = (question: string) => {
  track('FAQ_Expand', { question: question.substring(0, 100) });
};

// --- SCROLL DEPTH ---
export const trackScrollDepth = (pageName: string, depth: number) => {
  track('Scroll_Depth', { page: pageName, depth_percent: depth });
};

// --- COOKIES ---
export const trackCookieConsent = (accepted: boolean) => {
  track('Cookie_Consent', { accepted: accepted ? 'yes' : 'no' });
};

// --- REJESTRACJA / LOGOWANIE ---
export const trackSignUp = (method: string) => {
  track('Sign_Up', { method });
};

export const trackLogin = (method: string) => {
  track('Login', { method });
};

export const trackLogout = () => {
  track('Logout', {});
};

// --- PANEL KLIENTA ---
export const trackPanelView = (section: string) => {
  track('Panel_View', { section });
};

// --- SEARCH ---
export const trackSearch = (query: string, resultCount: number, location: string) => {
  track('Search', { query, result_count: resultCount, location });
};

// --- ERRORS ---
export const trackError = (errorType: string, errorMessage: string, location: string) => {
  track('Error', { error_type: errorType, error_message: errorMessage.substring(0, 100), location });
};

// --- KURIER ---
export const trackCourierOrder = (repairId: string, courierType: string) => {
  track('Courier_Order', { repair_id: repairId, courier_type: courierType });
};

// --- MIASTA (SEO) ---
export const trackCityPageView = (city: string) => {
  track('City_Page_View', { city });
};

