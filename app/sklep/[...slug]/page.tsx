import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ChevronRight, 
  ChevronDown,
  Package, 
  Printer,
  Battery,
  Cable,
  Check,
  X,
  Truck,
  Shield,
  Phone,
  ShoppingCart,
  Clock,
  HelpCircle,
  Wrench,
  Info
} from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import ShopSidebar from '@/components/shop/ShopSidebar'
import ShopCategoryClient from '@/components/shop/ShopCategoryClient'
import {
  SHOP_CATEGORIES,
  getProductTypeBySlug,
  getPrinterCategoryBySlug,
  getModelBySlug,
  getBreadcrumbs,
  getProductUrl,
  type ProductTypeCategory,
  type PrinterCategory,
  type PrinterModel
} from '@/lib/shop-categories'
import {
  generateProductFAQ,
  generateAdditionalProperties,
  PRINTER_MODELS,
  identifyFromPartNumber
} from '@/lib/printhead-data'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

// Domyślne zdjęcie dla głowic (używane gdy brak image_url w bazie)
const DEFAULT_PRINTHEAD_IMAGE = '/sklep_photo/głowica-203dpi-do-drukarki-zebra-zd421t-P1112640-218.png'

// Helper: Pobierz URL zdjęcia dla produktu
function getLocalProductImage(productType: string): string | null {
  if (productType === 'glowica') {
    return DEFAULT_PRINTHEAD_IMAGE
  }
  return null
}

// FAQ dla typów produktów
const PRODUCT_TYPE_FAQ: Record<string, Array<{ question: string; answer: string }>> = {
  glowica: [
    {
      question: 'Jak często należy wymieniać głowicę drukującą?',
      answer: 'Głowica drukująca wymaga wymiany po około 1-2 milionach cali druku (25-50 km). Żywotność zależy od jakości materiałów, częstotliwości czyszczenia i warunków pracy. Objawy zużycia to blady wydruk, białe linie na etykietach lub nierówna jakość druku.'
    },
    {
      question: 'Jak rozpoznać uszkodzoną głowicę?',
      answer: 'Typowe objawy uszkodzonej głowicy to: pionowe białe linie na wydruku (uszkodzone elementy grzewcze), nierównomierna jakość druku, blady wydruk mimo prawidłowych ustawień ciemności, oraz brak druku w niektórych miejscach etykiety.'
    },
    {
      question: 'Czy mogę samodzielnie wymienić głowicę?',
      answer: 'Tak, wymiana głowicy to prosta czynność serwisowa. Wystarczy odłączyć taśmę flat cable, odkręcić 2-4 śruby mocujące starą głowicę i zamontować nową. Cała operacja zajmuje około 5-10 minut. Oferujemy też profesjonalną wymianę w serwisie.'
    },
    {
      question: 'Jaka jest różnica między głowicą 203 DPI a 300 DPI?',
      answer: '203 DPI (8 punktów/mm) to standardowa rozdzielczość wystarczająca dla większości etykiet logistycznych i kodów kreskowych. 300 DPI (12 punktów/mm) zapewnia wyższą jakość druku, idealną dla małych kodów 2D, drobnego tekstu i etykiet farmaceutycznych. Głowice nie są wymienne między rozdzielczościami.'
    }
  ],
  walek: [
    {
      question: 'Jak często wymieniać wałek dociskowy?',
      answer: 'Wałek dociskowy (platen roller) wymaga wymiany co 2-3 lata lub gdy zauważysz nierówny docisk, problemy z prowadzeniem materiału, lub widoczne uszkodzenia gumy.'
    },
    {
      question: 'Jakie są objawy zużytego wałka?',
      answer: 'Zużyty wałek objawia się: nierównym drukiem (ciemniejszy/jaśniejszy w różnych miejscach), problemami z prowadzeniem etykiet, poślizgiem materiału, lub widocznym zużyciem/stwardnieniem gumy.'
    }
  ],
  akumulator: [
    {
      question: 'Jak długo działa bateria w drukarce mobilnej?',
      answer: 'Typowa bateria Li-Ion w drukarkach mobilnych Zebra zapewnia 4-8 godzin pracy (300-500 etykiet). Żywotność baterii to około 300-500 pełnych cykli ładowania, co przekłada się na 2-3 lata użytkowania.'
    },
    {
      question: 'Czy mogę używać baterii zamiennych?',
      answer: 'Zalecamy oryginalne baterie Zebra, które gwarantują pełną kompatybilność, bezpieczeństwo i optymalną wydajność. Baterie zamienne mogą mieć krótszą żywotność lub powodować problemy z ładowaniem.'
    }
  ]
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  product_type: string
  device_model: string
  resolution_dpi: number | null
  price: number
  price_brutto: number
  description: string
  description_long: string
  stock: number
  sku: string
  compatible_models: string[]
  manufacturer: string
  image_url: string | null
  lead_time_days: string | null
  attributes: {
    stock_pl?: number
    stock_de?: number
    in_delivery?: number
    ingram_price?: number
    last_sync?: string
  } | null
}

// Pobierz produkt po slug
async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?slug=eq.${slug}&is_active=eq.true&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      }
    )
    const data = await res.json()
    return data[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Pobierz produkty dla kategorii
async function getProductsForCategory(filters: {
  productType?: string
  printerCategory?: string
  deviceModel?: string
}): Promise<Product[]> {
  try {
    let query = `${supabaseUrl}/rest/v1/products?is_active=eq.true&select=*`
    
    if (filters.productType) {
      query += `&product_type=eq.${filters.productType}`
    }
    if (filters.deviceModel) {
      query += `&device_model=ilike.*${filters.deviceModel}*`
    }
    
    query += '&order=name.asc'

    const res = await fetch(query, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      cache: 'no-store'
    })
    const data = await res.json()
    return data || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Helper: Pobierz URL zdjęcia (z bazy lub lokalny fallback)
function getProductImageUrl(product: Product): string | null {
  if (product.image_url) return product.image_url
  return getLocalProductImage(product.product_type)
}

// Helper: Generuj opis SEO
function generateSeoDescription(product: Product): string {
  const parts = [
    `Oryginalna ${product.name}.`,
    '✓ Gwarancja producenta',
    '✓ Wysyłka 24h',
    `✓ Cena ${product.price_brutto.toFixed(2)} zł brutto.`,
    'Autoryzowany dystrybutor Zebra – TAKMA.'
  ]
  return parts.join(' ')
}

// Helper: Generuj tytuł SEO
function generateSeoTitle(product: Product): string {
  const typeNames: Record<string, string> = {
    glowica: 'Głowica drukująca',
    walek: 'Wałek dociskowy',
    akumulator: 'Akumulator'
  }
  const typeName = typeNames[product.product_type] || 'Część'
  return `${product.name} – Oryginalna ${typeName} | Kup w TAKMA`
}

// Generuj metadane
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slugPath = params.slug

  // Strona produktu (4 segmenty)
  if (slugPath.length === 4) {
    const productSlug = slugPath[3]
    const product = await getProduct(productSlug)
    
    if (!product) {
      return { title: 'Produkt nie znaleziony | Sklep TAKMA' }
    }

    const imageUrl = getProductImageUrl(product)
    const seoDescription = generateSeoDescription(product)
    const seoTitle = generateSeoTitle(product)

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [
        product.name,
        product.sku,
        product.device_model,
        'głowica zebra',
        'części zamienne zebra',
        'oryginalna głowica',
        'serwis zebra',
        'TAKMA'
      ].filter(Boolean).join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: 'website',
        siteName: 'TAKMA - Autoryzowany Serwis Zebra',
        locale: 'pl_PL',
        images: imageUrl ? [{
          url: `https://www.serwis-zebry.pl${imageUrl}`,
          width: 800,
          height: 800,
          alt: `${product.name} - zdjęcie produktu`
        }] : []
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: imageUrl ? [`https://www.serwis-zebry.pl${imageUrl}`] : []
      },
      alternates: {
        canonical: `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`
      }
    }
  }

  // Strona kategorii
  const productType = getProductTypeBySlug(slugPath[0])
  if (!productType) {
    return { title: 'Kategoria nie znaleziona | Sklep TAKMA' }
  }

  if (slugPath.length === 1) {
    return {
      title: `${productType.namePlural} do drukarek Zebra | Sklep TAKMA`,
      description: `${productType.namePlural} do drukarek Zebra. Oryginalne części zamienne z gwarancją. Szybka wysyłka.`
    }
  }

  const printerCategory = getPrinterCategoryBySlug(slugPath[0], slugPath[1])
  if (slugPath.length === 2 && printerCategory) {
    // SEO dla głowic do drukarek przemysłowych
    if (productType.id === 'glowica' && printerCategory.id === 'industrial') {
      return {
        title: 'Głowice do drukarek przemysłowych Zebra ZT411, ZT421, ZT610 | TAKMA',
        description: 'Oryginalne głowice drukujące do drukarek przemysłowych Zebra: ZT411, ZT421, ZT510, ZT610, ZT620, 105SL Plus, ZM400. Rozdzielczości 203/300/600 DPI. Wysyłka 24-72h. Gwarancja producenta.',
        keywords: 'głowica zt411, głowica zt421, głowica zt610, głowica zebra przemysłowa, głowica 300 dpi, głowica 600 dpi, printhead zebra industrial',
        openGraph: {
          title: 'Głowice do drukarek przemysłowych Zebra | TAKMA',
          description: 'Oryginalne głowice 203/300/600 DPI do ZT411, ZT421, ZT610, ZT620. Szybka wysyłka, gwarancja producenta.',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL'
        },
        alternates: {
          canonical: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-przemyslowe'
        }
      }
    }
    // SEO dla głowic do drukarek biurkowych
    if (productType.id === 'glowica' && printerCategory.id === 'desktop') {
      return {
        title: 'Głowice do drukarek biurkowych Zebra ZD421, ZD621, GK420 | TAKMA',
        description: 'Oryginalne głowice drukujące do drukarek biurkowych Zebra: ZD220, ZD421, ZD611, ZD621, GK420, GX420. Rozdzielczości 203/300 DPI. Wysyłka 24-72h.',
        keywords: 'głowica zd421, głowica zd621, głowica gk420, głowica zebra biurkowa, głowica 203 dpi, printhead zebra desktop',
        openGraph: {
          title: 'Głowice do drukarek biurkowych Zebra | TAKMA',
          description: 'Oryginalne głowice 203/300 DPI do ZD421, ZD621, GK420. Szybka wysyłka, gwarancja.',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL'
        },
        alternates: {
          canonical: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-biurkowe'
        }
      }
    }
    return {
      title: `${productType.namePlural} - ${printerCategory.name} | Sklep TAKMA`,
      description: `${productType.namePlural} do ${printerCategory.name.toLowerCase()} Zebra. Oryginalne części z gwarancją.`
    }
  }

  if (slugPath.length === 3 && printerCategory) {
    const model = getModelBySlug(slugPath[0], slugPath[1], slugPath[2])
    if (model) {
      return {
        title: `${productType.namePlural} do ${model.name} | Sklep TAKMA`,
        description: `${productType.namePlural} do drukarki ${model.name}. Oryginalne części z gwarancją. Wysyłka 24h.`
      }
    }
  }

  return { title: 'Sklep TAKMA - Części do drukarek Zebra' }
}

export default async function ShopCategoryPage({ params }: { params: { slug: string[] } }) {
  const slugPath = params.slug
  const breadcrumbs = getBreadcrumbs(slugPath)

  // === STRONA PRODUKTU (4 segmenty: typ/kategoria/model/produkt) ===
  if (slugPath.length === 4) {
    const productSlug = slugPath[3]
    const product = await getProduct(productSlug)

    if (!product) {
      notFound()
    }

    const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package
    const imageUrl = getProductImageUrl(product)
    
    // Dynamiczne FAQ - dla głowic generuj na podstawie modelu, dla innych użyj generycznego
    let faqItems: Array<{ question: string; answer: string }> = []
    let additionalProperties: Array<{ name: string; value: string }> = []
    let printerModelData = null
    
    if (product.product_type === 'glowica' && product.device_model && product.resolution_dpi) {
      // Normalizuj model
      const normalizedModel = product.device_model.replace(/^Zebra\s+/i, '').trim()
      
      // Znajdź w bazie danych modeli
      for (const key of Object.keys(PRINTER_MODELS)) {
        if (key.toLowerCase().replace(/[^a-z0-9]/gi, '') === normalizedModel.toLowerCase().replace(/[^a-z0-9]/gi, '')) {
          printerModelData = PRINTER_MODELS[key]
          break
        }
      }
      
      // Generuj dynamiczne FAQ i additionalProperties
      faqItems = generateProductFAQ(
        printerModelData?.id || normalizedModel,
        product.resolution_dpi,
        product.sku
      )
      
      additionalProperties = generateAdditionalProperties(
        printerModelData?.id || normalizedModel,
        product.resolution_dpi,
        product.sku
      )
    } else {
      // Fallback do generycznego FAQ per typ produktu
      faqItems = PRODUCT_TYPE_FAQ[product.product_type] || []
    }

    // Dodaj produkt do breadcrumbs
    const productBreadcrumbs = [
      ...breadcrumbs,
      { label: product.name, href: '' }
    ]

    // Generuj rozszerzony Schema JSON-LD z additionalProperty
    const productSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description || generateSeoDescription(product),
      "sku": product.sku,
      "mpn": product.sku,
      "brand": {
        "@type": "Brand",
        "name": product.manufacturer || "Zebra"
      },
      "image": imageUrl ? `https://www.serwis-zebry.pl${imageUrl}` : undefined,
      "offers": {
        "@type": "Offer",
        "url": `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`,
        "price": product.price_brutto,
        "priceCurrency": "PLN",
        "availability": product.stock > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "TAKMA - Autoryzowany Serwis Zebra"
        },
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "PLN"
          },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": {
              "@type": "QuantitativeValue",
              "minValue": 0,
              "maxValue": 1,
              "unitCode": "DAY"
            },
            "transitTime": {
              "@type": "QuantitativeValue",
              "minValue": 1,
              "maxValue": 2,
              "unitCode": "DAY"
            }
          }
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "47",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
    
    // Dodaj additionalProperty jeśli dostępne
    if (additionalProperties.length > 0) {
      productSchema.additionalProperty = additionalProperties.map(prop => ({
        "@type": "PropertyValue",
        "name": prop.name,
        "value": prop.value
      }))
    }

    // FAQ Schema
    const faqSchema = faqItems.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    } : null

    // Generuj "Szybka odpowiedź" dla głowic
    const quickAnswer = product.product_type === 'glowica' && product.resolution_dpi 
      ? `Głowica ${product.sku} to oryginalna część ${product.resolution_dpi} DPI do ${product.device_model || 'drukarki Zebra'}. Cena: ${product.price_brutto.toFixed(2).replace('.', ',')} zł brutto. Wysyłka ${product.stock > 0 ? '24h z magazynu w Polsce' : '3-7 dni'}. Gwarancja producenta 12 miesięcy.`
      : null

    return (
      <>
        <Header currentPage="other" />
        <ShopSubheader breadcrumbs={productBreadcrumbs} />
        
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            
            {/* Szybka odpowiedź (Paragraph 0 dla AEO) */}
            {quickAnswer && (
              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-4 sm:mb-6">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong className="text-blue-700">W skrócie:</strong> {quickAnswer}
                </p>
              </div>
            )}

            {/* Main content - Mobile First */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 md:items-start">
              {/* Image */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-80 lg:w-96 flex-shrink-0">
                <div className="relative aspect-square bg-white flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - oryginalna część zamienna Zebra`}
                      fill
                      className="object-contain p-3 sm:p-4"
                      priority
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 flex-1">
                {/* Nazwa */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-1.5">
                  {product.name}
                </h1>

                {/* PN (Part Number) */}
                <p className="text-xs text-gray-500 mb-3">
                  PN: <span className="font-mono font-medium text-gray-600">{product.sku}</span>
                </p>

                {/* Cena */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {product.price.toFixed(2).replace('.', ',')} zł
                  </span>
                  <span className="text-sm text-gray-500">netto</span>
                </div>
                <div className="text-base text-gray-500 mb-4">
                  {product.price_brutto.toFixed(2).replace('.', ',')} zł brutto
                </div>

                {/* Dostępność z informacją o czasie dostawy */}
                <div className="mb-4 space-y-1">
                  {product.stock > 0 ? (
                    <>
                      {(product.attributes?.stock_pl ?? 0) > 0 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm font-medium">Dostawa 24h:</span>
                          <span className="text-sm">{product.attributes?.stock_pl} szt.</span>
                        </div>
                      )}
                      {(product.attributes?.stock_de ?? 0) > 0 && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <Truck className="w-4 h-4" />
                          <span className="text-sm font-medium">Dostawa 72h:</span>
                          <span className="text-sm">{product.attributes?.stock_de} szt.</span>
                        </div>
                      )}
                      {(product.attributes?.stock_pl ?? 0) === 0 && 
                       (product.attributes?.stock_de ?? 0) === 0 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Dostępny</span>
                          <span className="text-xs text-gray-500">({product.stock} szt.)</span>
                        </div>
                      )}
                    </>
                  ) : (product.attributes?.in_delivery ?? 0) > 0 ? (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Wysyłka 3-5 dni</span>
                      <span className="text-xs text-amber-500">({product.attributes?.in_delivery} szt. w drodze)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Wysyłka 5-7 dni</span>
                      <span className="text-xs text-amber-500">(na zamówienie)</span>
                    </div>
                  )}
                </div>

                {/* Add to Cart */}
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    sku: product.sku,
                    price: product.price,
                    price_brutto: product.price_brutto,
                    product_type: product.product_type,
                    stock: product.stock,
                  }}
                />
              </div>
            </div>

            {/* Specyfikacja techniczna */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Specyfikacja
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                <div className="flex justify-between py-2 border-b border-gray-100 text-xs sm:text-sm">
                  <span className="text-gray-500">Producent</span>
                  <span className="font-medium text-gray-900">{product.manufacturer || 'Zebra'}</span>
                </div>
                {product.resolution_dpi && (
                  <div className="flex justify-between py-2 border-b border-gray-100 text-xs sm:text-sm">
                    <span className="text-gray-500">Rozdzielczość</span>
                    <span className="font-medium text-gray-900">{product.resolution_dpi} DPI</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-gray-100 text-xs sm:text-sm">
                  <span className="text-gray-500">Stan</span>
                  <span className="font-medium text-green-600">Nowy, oryginalny</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 text-xs sm:text-sm">
                  <span className="text-gray-500">Gwarancja</span>
                  <span className="font-medium text-gray-900">12 miesięcy</span>
                </div>
              </div>
            </div>

            {/* Opis produktu */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Opis produktu</h2>
              <div className="prose prose-sm max-w-none text-gray-600 
                prose-headings:text-gray-900 prose-headings:font-semibold prose-headings:text-sm prose-headings:mt-4 prose-headings:mb-2
                prose-p:text-xs prose-p:sm:text-sm prose-p:leading-relaxed prose-p:mb-3
                prose-ul:my-2 prose-ul:pl-4 prose-li:text-xs prose-li:sm:text-sm prose-li:mb-1
                prose-strong:text-gray-800 prose-strong:font-semibold">
                {product.description && (
                  <p className="text-sm sm:text-base text-gray-700 font-medium mb-4 pb-3 border-b border-gray-100">
                    {product.description}
                  </p>
                )}
                {product.description_long && (
                  <div 
                    className="product-description"
                    dangerouslySetInnerHTML={{ __html: product.description_long }} 
                  />
                )}
                {!product.description && !product.description_long && (
                  <p>
                    Oryginalna {product.name} do drukarki {product.device_model || 'Zebra'}. 
                    Część zamienna produkowana przez Zebra Technologies, gwarantująca pełną 
                    kompatybilność i niezawodność działania.
                  </p>
                )}
              </div>
            </div>

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  FAQ
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {faqItems.map((item, index) => (
                    <details key={index} className="group border-b border-gray-100 pb-3 sm:pb-4 last:border-0 last:pb-0">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 pr-3 sm:pr-4">{item.question}</h3>
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Usługa montażu */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-5 sm:p-6 mb-4 sm:mb-6 shadow-lg">
              {/* Dekoracyjne koła */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl" />
              
              <div className="relative flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex-shrink-0">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    Potrzebujesz wymiany części?
                  </h3>
                  <p className="text-sm text-indigo-100 mb-4 leading-relaxed">
                    Odbierzemy drukarkę kurierem, wymienimy część w naszym serwisie 
                    i odeślemy sprawne urządzenie. Szybko i z gwarancją.
                  </p>
                  <Link 
                    href="/#formularz" 
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-md"
                  >
                    <Truck className="w-4 h-4" />
                    Zamów odbiór kurierem
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact - Mobile First */}
            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-900">Pomoc w doborze części?</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Zadzwoń – doradzimy</p>
              </div>
              <a
                href="tel:+48601619898"
                className="flex items-center gap-2 bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                601 619 898
              </a>
            </div>
          </div>
        </div>

        <Footer />

        {/* JSON-LD Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />

        {/* JSON-LD FAQ Schema */}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqSchema)
            }}
          />
        )}
      </>
    )
  }

  // === STRONA KATEGORII (1-3 segmenty) ===
  const productType = getProductTypeBySlug(slugPath[0])
  if (!productType) {
    notFound()
  }

  let printerCategory: PrinterCategory | undefined
  let model: PrinterModel | undefined
  let pageTitle = productType.namePlural
  let pageSubtitle = `Oryginalne ${productType.namePlural.toLowerCase()} do drukarek Zebra`

  // Filtry
  const filters = {
    productType: productType.id,
    printerCategory: '',
    model: ''
  }

  // Poziom 2: Kategoria drukarki
  if (slugPath.length >= 2) {
    printerCategory = getPrinterCategoryBySlug(slugPath[0], slugPath[1])
    if (!printerCategory) {
      notFound()
    }
    pageTitle = `${productType.namePlural} - ${printerCategory.name}`
    pageSubtitle = `${productType.namePlural} do ${printerCategory.name.toLowerCase()} Zebra`
    filters.printerCategory = printerCategory.id
  }

  // Poziom 3: Model drukarki
  if (slugPath.length >= 3 && printerCategory) {
    model = getModelBySlug(slugPath[0], slugPath[1], slugPath[2])
    if (!model) {
      notFound()
    }
    pageTitle = `${productType.namePlural} do ${model.name}`
    pageSubtitle = `Oryginalne ${productType.namePlural.toLowerCase()} do drukarki ${model.name}`
    filters.model = model.id
  }

  // Pobierz produkty
  const products = await getProductsForCategory({
    productType: filters.productType,
    deviceModel: filters.model || undefined
  })

  // Dostępne rozdzielczości - agreguj z produktów w tej kategorii
  // (pokazuj filtr DPI gdy są produkty z różnymi rozdzielczościami)
  const availableResolutions = productType.id === 'glowica' 
    ? Array.from(new Set(products.map(p => p.resolution_dpi).filter((r): r is number => r !== null))).sort((a, b) => a - b)
    : []

  // FAQ Schema dla kategorii głowic przemysłowych
  const industrialFaqSchema = productType.id === 'glowica' && printerCategory?.id === 'industrial' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Czy głowica ZT410 pasuje do ZT411?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tak! Głowice do ZT410 są w pełni kompatybilne z ZT411. Zebra zachowała tę samą konstrukcję głowicy w obu modelach. Part Number dla 203 DPI: P1058930-009, dla 300 DPI: P1058930-010, dla 600 DPI: P1058930-011."
        }
      },
      {
        "@type": "Question",
        "name": "Jak sprawdzić aktualną rozdzielczość drukarki Zebra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Wydrukuj raport konfiguracji (Configuration Report) — znajdziesz tam RESOLUTION lub DPI. Alternatywnie, sprawdź etykietę na głowicy."
        }
      },
      {
        "@type": "Question",
        "name": "Ile kosztuje głowica do drukarki przemysłowej Zebra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ceny oryginalnych głowic Zebra do drukarek przemysłowych to ok. 1000-3500 zł netto w zależności od modelu i rozdzielczości. Głowice 600 DPI są najdroższe."
        }
      },
      {
        "@type": "Question",
        "name": "Jaką rozdzielczość głowicy wybrać: 203 DPI, 300 DPI czy 600 DPI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "203 DPI to standard dla etykiet logistycznych i kodów 1D. 300 DPI jest idealna dla kodów 2D (QR, DataMatrix) i etykiet farmaceutycznych. 600 DPI to najwyższa jakość do mikro-kodów i etykiet jubilerskich."
        }
      },
      {
        "@type": "Question",
        "name": "Jaka jest żywotność głowicy w drukarce przemysłowej Zebra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Głowice przemysłowe Zebra mają żywotność 1-3 miliony cali druku (25-75 km etykiet) w zależności od rozdzielczości i materiałów. Regularne czyszczenie alkoholem IPA wydłuża żywotność nawet o 50%."
        }
      }
    ]
  } : null

  // FAQ Schema dla kategorii głowic biurkowych
  const desktopFaqSchema = productType.id === 'glowica' && printerCategory?.id === 'desktop' ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Czy głowica GK420 pasuje do ZD421?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nie. ZD421 to nowsza generacja z inną konstrukcją. Głowice GK420 pasują tylko do GK420d/t i GX420d/t."
        }
      },
      {
        "@type": "Question",
        "name": "Jaka jest cena głowicy do drukarki biurkowej Zebra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oryginalne głowice Zebra do drukarek biurkowych kosztują ok. 400-1200 zł netto. Głowice 300 DPI są droższe od 203 DPI."
        }
      },
      {
        "@type": "Question",
        "name": "Jaka jest różnica między drukiem termicznym a termotransferowym?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Druk termiczny (Direct Thermal) drukuje bezpośrednio na papierze termicznym bez taśmy, ale wydruk blaknie w czasie. Druk termotransferowy (Thermal Transfer) używa taśmy barwiącej (ribbon) i daje trwały wydruk odporny na ścieranie i UV."
        }
      }
    ]
  } : null

  return (
    <>
      {industrialFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(industrialFaqSchema) }}
        />
      )}
      {desktopFaqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(desktopFaqSchema) }}
        />
      )}
      <Header currentPage="other" />
      <ShopSubheader breadcrumbs={breadcrumbs} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - spójne z /sklep */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Sklep z częściami</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4 text-center md:text-left">
              {pageTitle}
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl text-center md:text-left md:mx-0">
              {pageSubtitle}. Wysyłka 24h, gwarancja producenta.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Oryginalne części</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Truck className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">Wysyłka 24h</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Gwarancja</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="pt-4 pb-8 sm:pt-5 sm:pb-10 md:pt-6 md:pb-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* SIDEBAR */}
              <ShopSidebar 
                currentProductType={productType.id}
                currentPrinterCategory={printerCategory?.id}
                currentModel={model?.id}
              />

              {/* PRODUCTS */}
              <div className="flex-1">
                <ShopCategoryClient 
                  initialProducts={products}
                  productTypeSlug={productType.slug}
                  printerCategorySlug={printerCategory?.slug}
                  modelSlug={model?.slug}
                  availableResolutions={availableResolutions}
                />
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section - Głowice */}
        {productType.id === 'glowica' && slugPath.length === 1 && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Głowice drukujące do drukarek Zebra — wszystko co musisz wiedzieć
              </h2>
              
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Głowica drukująca (printhead)</strong> to najważniejszy komponent każdej drukarki etykiet. 
                  Odpowiada za przenoszenie obrazu na materiał — w przypadku drukarek termicznych poprzez kontrolowane 
                  nagrzewanie mikro-elementów grzejnych, które aktywują papier termiczny lub topią taśmę barwiącą (ribbon).
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić głowicę w drukarce Zebra?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Typowe objawy zużytej głowicy to: <strong>pionowe białe linie</strong> na wydruku (uszkodzone elementy grzewcze), 
                  <strong>blady lub nierównomierny wydruk</strong>, oraz <strong>nieczytelne kody kreskowe</strong> mimo prawidłowych 
                  ustawień ciemności. Żywotność głowicy zależy od jakości materiałów — średnio wynosi 1-2 miliony cali druku 
                  (25-50 km etykiet).
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Rozdzielczość głowicy: 203 DPI vs 300 DPI vs 600 DPI
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>203 DPI (8 punktów/mm)</strong> — standard dla etykiet logistycznych, kodów kreskowych 1D, 
                  etykiet wysyłkowych. Najczęściej wybierana rozdzielczość.</li>
                  <li><strong>300 DPI (12 punktów/mm)</strong> — idealna dla małych kodów 2D (QR, DataMatrix), drobnego tekstu, 
                  etykiet farmaceutycznych i elektronicznych.</li>
                  <li><strong>600 DPI (24 punkty/mm)</strong> — najwyższa jakość do etykiet jubilerskich, elektroniki, 
                  mikro-kodów i aplikacji wymagających precyzji.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Dlaczego warto kupić oryginalną głowicę Zebra?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Oryginalne głowice Zebra gwarantują <strong>pełną kompatybilność</strong> z drukarką, 
                  <strong>optymalną jakość wydruku</strong> i <strong>maksymalną żywotność</strong>. 
                  Zamienniki często mają niższą gęstość elementów grzewczych, co skutkuje gorszą jakością i krótszą żywotnością. 
                  Dodatkowo, użycie nieoryginalnych części może unieważnić gwarancję drukarki.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Jak samodzielnie wymienić głowicę?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Wymiana głowicy to prosta czynność serwisowa zajmująca 5-10 minut. Wystarczy: odłączyć drukarkę od zasilania, 
                  otworzyć obudowę, odłączyć taśmę flat cable ze starej głowicy, odkręcić śruby mocujące (2-4 szt.), 
                  zamontować nową głowicę i podłączyć kabel. Po wymianie zalecamy <strong>kalibrację czujników</strong> 
                  i wydruk raportu konfiguracji.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Potrzebujesz pomocy?</strong> Oferujemy profesjonalną wymianę głowicy w serwisie — 
                    odbieramy drukarkę kurierem, wymieniamy głowicę, kalibrujemy i odsyłamy. 
                    <a href="/#formularz" className="underline ml-1">Zgłoś naprawę →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section - Wałki dociskowe */}
        {productType.id === 'walek' && slugPath.length === 1 && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Wałki dociskowe do drukarek Zebra — kompletny przewodnik
              </h2>
              
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Wałek dociskowy (platen roller)</strong> to gumowy cylinder odpowiedzialny za równomierny 
                  transport materiału pod głowicą drukującą. Współpracuje z głowicą, zapewniając stały docisk etykiety 
                  podczas druku — od jego stanu zależy jakość wydruku i prawidłowe prowadzenie materiału.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić wałek dociskowy?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Wałek wymaga wymiany gdy zauważysz: <strong>nierównomierny wydruk</strong> (jaśniejszy/ciemniejszy w różnych 
                  miejscach), <strong>problemy z prowadzeniem etykiet</strong> (zacięcia, krzywy podawanie), 
                  <strong>poślizg materiału</strong>, lub <strong>widoczne zużycie gumy</strong> (stwardnienie, pęknięcia, 
                  wgłębienia). Typowa żywotność to 2-3 lata przy normalnym użytkowaniu.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Objawy zużytego wałka dociskowego
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Nierówny docisk</strong> — wydruk ciemniejszy z jednej strony, jaśniejszy z drugiej</li>
                  <li><strong>Poślizg etykiet</strong> — materiał nie jest podawany równomiernie</li>
                  <li><strong>Zacięcia papieru</strong> — etykiety zawijają się lub blokują</li>
                  <li><strong>Hałas podczas druku</strong> — skrzypienie lub stukanie</li>
                  <li><strong>Błędy czujników</strong> — drukarka nie wykrywa etykiet prawidłowo</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Jak dbać o wałek dociskowy?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Regularne czyszczenie wałka <strong>alkoholem izopropylowym (IPA)</strong> wydłuża jego żywotność. 
                  Czyść wałek co najmniej raz w miesiącu lub przy każdej wymianie rolki etykiet. Unikaj używania 
                  rozpuszczalników i ostrych narzędzi. Przechowuj zapasowe wałki w chłodnym, suchym miejscu.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Wymiana wałka — krok po kroku
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Wymiana wałka dociskowego to prosta czynność: wyłącz drukarkę, otwórz pokrywę, zwolnij mechanizm 
                  blokujący wałek (zazwyczaj dźwignia lub zatrzask), wyjmij stary wałek, włóż nowy i zablokuj. 
                  Po wymianie wykonaj <strong>kalibrację czujników</strong> dla optymalnego działania.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Potrzebujesz pomocy?</strong> Wymieniamy wałki dociskowe w ramach serwisu — 
                    odbieramy drukarkę kurierem, wymieniamy części, kalibrujemy i odsyłamy. 
                    <a href="/#formularz" className="underline ml-1">Zgłoś naprawę →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section - Akumulatory */}
        {productType.id === 'akumulator' && slugPath.length === 1 && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Akumulatory do urządzeń Zebra — przewodnik kupującego
              </h2>
              
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Akumulatory litowo-jonowe (Li-Ion)</strong> to serce urządzeń mobilnych Zebra — drukarek 
                  przenośnych, terminali i skanerów. Od ich pojemności i stanu zależy czas pracy bez ładowania. 
                  Oryginalne baterie Zebra zapewniają optymalną wydajność i bezpieczeństwo użytkowania.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Jak długo działa bateria w urządzeniach Zebra?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Czas pracy zależy od modelu i intensywności użytkowania. Typowe wartości:
                </p>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Drukarki mobilne (ZQ520, ZQ630)</strong> — 4-8 godzin pracy, 300-500 etykiet na ładowanie</li>
                  <li><strong>Terminale (TC21, TC52)</strong> — 8-14 godzin przy typowym użyciu</li>
                  <li><strong>Skanery (DS8178)</strong> — 50 000+ skanów na ładowanie</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić akumulator?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Baterie Li-Ion tracą pojemność z czasem — po <strong>300-500 pełnych cyklach</strong> ładowania 
                  pojemność spada do ok. 80% początkowej. Wymień akumulator gdy: czas pracy znacząco się skrócił, 
                  bateria szybko się rozładowuje, urządzenie niespodziewanie się wyłącza, lub bateria jest <strong>spuchnięta</strong> (natychmiast wycofaj z użytku!).
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Dlaczego oryginalne akumulatory Zebra?
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Bezpieczeństwo</strong> — certyfikowane ogniwa z zabezpieczeniami przed przegrzaniem, 
                  przeładowaniem i zwarciem</li>
                  <li><strong>Kompatybilność</strong> — pełna współpraca z elektroniką urządzenia i ładowarkami</li>
                  <li><strong>Żywotność</strong> — wyższa liczba cykli ładowania niż zamienniki</li>
                  <li><strong>Gwarancja</strong> — objęte gwarancją producenta, zamienniki mogą ją unieważnić</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Jak przedłużyć żywotność baterii?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Unikaj <strong>głębokiego rozładowania</strong> (poniżej 20%) i <strong>przegrzewania</strong>. 
                  Przechowuj zapasowe baterie naładowane w 40-60% w temperaturze pokojowej. Używaj tylko 
                  oryginalnych ładowarek Zebra. Regularnie aktualizuj firmware urządzenia — często zawiera 
                  optymalizacje zarządzania energią.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Potrzebujesz pomocy?</strong> Diagnozujemy problemy z baterią i zasilaniem. 
                    Jeśli urządzenie nie ładuje się prawidłowo, może to być usterka ładowarki lub elektroniki. 
                    <a href="/#formularz" className="underline ml-1">Zgłoś do serwisu →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section - Głowice do drukarek PRZEMYSŁOWYCH */}
        {productType.id === 'glowica' && slugPath.length === 2 && printerCategory?.id === 'industrial' && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Głowice do drukarek przemysłowych Zebra — kompletny przewodnik
              </h2>
              
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Drukarki przemysłowe Zebra</strong> (seria ZT, Xi, ZM) to urządzenia zaprojektowane do 
                  intensywnej pracy w środowiskach produkcyjnych i logistycznych. Głowice w tych drukarkach 
                  muszą sprostać wysokim wymaganiom — prędkościom do <strong>356 mm/s</strong>, pracy 24/7, 
                  i drukowaniu milionów etykiet rocznie.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Popularne modele głowic przemysłowych
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Rozdzielczości</th>
                        <th className="px-3 py-2 text-left font-semibold">Szerokość druku</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2">ZT411</td><td className="px-3 py-2">203, 300, 600 DPI</td><td className="px-3 py-2">104 mm</td></tr>
                      <tr><td className="px-3 py-2">ZT421</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">168 mm (6.6")</td></tr>
                      <tr><td className="px-3 py-2">ZT510</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">104 mm</td></tr>
                      <tr><td className="px-3 py-2">ZT610</td><td className="px-3 py-2">203, 300, 600 DPI</td><td className="px-3 py-2">104 mm</td></tr>
                      <tr><td className="px-3 py-2">ZT620</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">168 mm (6.6")</td></tr>
                      <tr><td className="px-3 py-2">105SL Plus</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">104 mm</td></tr>
                      <tr><td className="px-3 py-2">ZM400</td><td className="px-3 py-2">203, 300, 600 DPI</td><td className="px-3 py-2">104 mm</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Którą rozdzielczość wybrać?
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>203 DPI</strong> — standard dla etykiet logistycznych, kodów kreskowych 1D, etykiet wysyłkowych GS1. 
                  Najniższy koszt głowicy, najdłuższa żywotność.</li>
                  <li><strong>300 DPI</strong> — idealna dla kodów 2D (DataMatrix, QR), etykiet farmaceutycznych, 
                  elektronicznych i produktowych. Dobry kompromis cena/jakość.</li>
                  <li><strong>600 DPI</strong> — najwyższa jakość do mikro-kodów, etykiet jubilerskich, 
                  elektroniki. Wyższa cena, krótsza żywotność.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Żywotność głowic przemysłowych
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Głowice przemysłowe Zebra mają żywotność <strong>1-3 miliony cali druku</strong> (25-75 km etykiet) 
                  w zależności od rozdzielczości i materiałów. Głowica 600 DPI ma gęstsze elementy grzewcze, 
                  więc zużywa się szybciej niż 203 DPI. Regularne czyszczenie alkoholem IPA 
                  wydłuża żywotność nawet o 50%.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  FAQ — Głowice przemysłowe
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy głowica ZT410 pasuje do ZT411?</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Tak!</strong> Głowice do ZT410 są w pełni kompatybilne z ZT411. 
                    Zebra zachowała tę samą konstrukcję głowicy w obu modelach. 
                    Part Number dla 203 DPI: <strong>P1058930-009</strong>, dla 300 DPI: <strong>P1058930-010</strong>, dla 600 DPI: <strong>P1058930-011</strong>.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak sprawdzić aktualną rozdzielczość drukarki?</p>
                    <p className="text-gray-600 text-sm mt-1">Wydrukuj raport konfiguracji (Configuration Report) — 
                    znajdziesz tam "RESOLUTION" lub "DPI". Alternatywnie, sprawdź etykietę na głowicy.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Ile kosztuje głowica do drukarki przemysłowej?</p>
                    <p className="text-gray-600 text-sm mt-1">Ceny oryginalnych głowic Zebra to ok. 1000-3500 zł netto 
                    w zależności od modelu i rozdzielczości. Głowice 600 DPI są najdroższe.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Nie wiesz którą głowicę wybrać?</strong> Podaj model drukarki i rozdzielczość — 
                    pomożemy dobrać właściwą część. 
                    <a href="/kontakt" className="underline ml-1">Skontaktuj się →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section - Głowice do drukarek BIURKOWYCH */}
        {productType.id === 'glowica' && slugPath.length === 2 && printerCategory?.id === 'desktop' && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Głowice do drukarek biurkowych Zebra — poradnik wyboru
              </h2>
              
              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Drukarki biurkowe Zebra</strong> (seria ZD, GK, GX) to kompaktowe urządzenia idealne do 
                  małych i średnich wolumenów druku — biur, sklepów, aptek i niewielkich magazynów. 
                  Głowice w tych drukarkach są mniejsze i tańsze niż w modelach przemysłowych, ale wymagają 
                  równie starannego doboru.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Popularne modele głowic biurkowych
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Rozdzielczości</th>
                        <th className="px-3 py-2 text-left font-semibold">Typ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2">ZD220t / ZD230t</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                      <tr><td className="px-3 py-2">ZD411t</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                      <tr><td className="px-3 py-2">ZD421t</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                      <tr><td className="px-3 py-2">ZD611t / ZD621t</td><td className="px-3 py-2">203, 300 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                      <tr><td className="px-3 py-2">GK420d / GX420d</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2">Termiczny</td></tr>
                      <tr><td className="px-3 py-2">GK420t / GX420t</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                      <tr><td className="px-3 py-2">GX430t</td><td className="px-3 py-2">300 DPI</td><td className="px-3 py-2">Termotransfer</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Druk termiczny vs termotransferowy
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Druk termiczny (Direct Thermal)</strong> — druk bezpośrednio na papierze termicznym. 
                  Tańsze materiały, ale wydruk blaknie w czasie. Idealny do etykiet wysyłkowych, paragonów.</li>
                  <li><strong>Druk termotransferowy (Thermal Transfer)</strong> — druk z użyciem taśmy barwiącej (ribbon). 
                  Trwały wydruk odporny na ścieranie i UV. Do etykiet produktowych, oznaczeń trwałych.</li>
                </ul>
                <p className="text-gray-600 text-sm mb-4">
                  <strong>Uwaga:</strong> Głowice do drukarek termicznych i termotransferowych są takie same — 
                  różnica polega na sposobie instalacji materiału (z taśmą lub bez).
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  FAQ — Głowice biurkowe
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy głowica GK420 pasuje do ZD421?</p>
                    <p className="text-gray-600 text-sm mt-1">Nie. ZD421 to nowsza generacja z inną konstrukcją. 
                    Głowice GK420 pasują tylko do GK420d/t i GX420d/t.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jaka jest cena głowicy do drukarki biurkowej?</p>
                    <p className="text-gray-600 text-sm mt-1">Oryginalne głowice Zebra do drukarek biurkowych kosztują 
                    ok. 400-1200 zł netto. Głowice 300 DPI są droższe od 203 DPI.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Nie masz pewności jaki model głowicy?</strong> Sprawdź etykietę na drukarce lub 
                    prześlij zdjęcie — pomożemy dobrać właściwą część. 
                    <a href="/kontakt" className="underline ml-1">Napisz do nas →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  )
}
