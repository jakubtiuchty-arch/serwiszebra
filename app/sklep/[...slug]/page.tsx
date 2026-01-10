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
  Award,
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
    const faqItems = PRODUCT_TYPE_FAQ[product.product_type] || []

    // Dodaj produkt do breadcrumbs
    const productBreadcrumbs = [
      ...breadcrumbs,
      { label: product.name, href: '' }
    ]

    // Generuj rozszerzony Schema JSON-LD
    const productSchema = {
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

    return (
      <>
        <Header currentPage="other" />
        <ShopSubheader breadcrumbs={productBreadcrumbs} />
        
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
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
                {/* Kompatybilność - GŁÓWNA INFORMACJA */}
                {product.device_model && (
                  <div className="mb-3 sm:mb-4 -mt-1">
                    <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm sm:text-base font-semibold">
                      <Printer className="w-4 h-4" />
                      Do drukarki {product.device_model}
                      {product.resolution_dpi && (
                        <span className="bg-blue-500 px-2 py-0.5 rounded text-xs font-medium">{product.resolution_dpi} DPI</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Nazwa */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">
                  {product.name}
                </h1>

                {/* PN (Part Number) */}
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  PN: <span className="font-mono font-medium text-gray-700">{product.sku}</span>
                </p>

                {/* Cena */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    {product.price.toFixed(0)} zł <span className="text-sm sm:text-base font-normal text-gray-500">netto</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                    {product.price_brutto.toFixed(2)} zł brutto
                  </div>
                </div>

                {/* Dostępność */}
                <div className="mb-3 sm:mb-4">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Dostępny</span>
                      <span className="text-xs sm:text-sm text-gray-500">({product.stock} szt.)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Na zamówienie</span>
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

                {/* Benefits - 2x2 grid on mobile */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                    <span>Wysyłka 24h</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span>Gwarancja 12m</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                    <span>Oryginał</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                    <span>Montaż</span>
                  </div>
                </div>
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
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Opis produktu</h2>
              <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2 sm:space-y-3">
                {product.description && <p>{product.description}</p>}
                {product.description_long && (
                  <p className="whitespace-pre-line">{product.description_long}</p>
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

            {/* Usługa montażu - WYRÓŻNIONY BOX */}
            <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-xl border-2 border-amber-300 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-amber-400 rounded-xl p-2.5 sm:p-3 flex-shrink-0 shadow-md">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                    Potrzebujesz wymiany głowicy?
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3">
                    <strong>Odbierzemy drukarkę kurierem</strong>, wymienimy część i odeślesz sprawne urządzenie. 
                    Szybko, wygodnie i z gwarancją.
                  </p>
                  <Link 
                    href="/#formularz" 
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                  >
                    <Truck className="w-4 h-4" />
                    Zamów odbiór kurierem
                    <ChevronRight className="w-4 h-4" />
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

  // Dostępne rozdzielczości
  const availableResolutions = model?.resolutions || []

  return (
    <>
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
      </div>

      <Footer />
    </>
  )
}
