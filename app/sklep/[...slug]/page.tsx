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
import StickyAddToCart from '@/components/shop/StickyAddToCart'
import ProductPurchasePanel from '@/components/shop/ProductPurchasePanel'
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
  getCategoryPathForProduct,
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
import { getProductFallbackImage } from '@/lib/product-images'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

// Helper: Pobierz URL zdjęcia dla produktu (z unikalną nazwą per model/DPI)
function getLocalProductImage(product: { product_type: string; device_model: string; resolution_dpi: number | null }): string | null {
  return getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi)
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
      answer: 'Tak, wymiana głowicy to prosta czynność serwisowa. Wystarczy odłączyć taśmę flat cable, odkręcić 2-4 śruby mocujące starą głowicę i zamontować nową. Cała operacja zajmuje około 5-10 minut. Oferujemy też profesjonalną wymianę w serwisie z kalibracją i gwarancją.'
    },
    {
      question: 'Jaka jest różnica między głowicą 203 DPI a 300 DPI?',
      answer: '203 DPI (8 punktów/mm) to standardowa rozdzielczość wystarczająca dla większości etykiet logistycznych i kodów kreskowych. 300 DPI (12 punktów/mm) zapewnia wyższą jakość druku, idealną dla małych kodów 2D, drobnego tekstu i etykiet farmaceutycznych. Głowice nie są wymienne między rozdzielczościami.'
    },
    {
      question: 'Jak przedłużyć żywotność głowicy drukującej?',
      answer: 'Aby przedłużyć żywotność głowicy: 1) Czyść głowicę alkoholem IPA 99% co każdą rolkę materiału lub minimum raz w tygodniu. 2) Używaj wysokiej jakości etykiet i ribbonów. 3) Unikaj zbyt wysokich ustawień ciemności (Darkness). 4) Chroń głowicę przed kurzem i zanieczyszczeniami. Regularna konserwacja wydłuża żywotność nawet 2-3 krotnie.'
    },
    {
      question: 'Naprawić czy wymienić głowicę?',
      answer: 'Głowicy drukującej nie da się naprawić — uszkodzone elementy grzejne są trwałe. Jeśli białe linie na wydruku nie znikają po 2-3 czyszczeniach alkoholem IPA, głowica wymaga wymiany. Przy bladym wydruku najpierw spróbuj: zwiększyć Darkness, wyczyścić głowicę, sprawdzić ribbon.'
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

// Pobierz powiązane produkty — cross-type: głowica↔wałek do tego samego modelu drukarki
async function getRelatedProducts(currentProduct: Product): Promise<Product[]> {
  try {
    // Szukaj produktów INNEGO typu (głowica→wałek, wałek→głowica) do tego samego modelu
    const deviceModel = currentProduct.device_model
    if (!deviceModel) return []

    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?is_active=eq.true&product_type=neq.${currentProduct.product_type}&id=neq.${currentProduct.id}&select=*&order=name.asc&limit=10`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      }
    )
    const allProducts: Product[] = await res.json()

    // Filtruj: ten sam model drukarki lub kompatybilny
    const modelLower = deviceModel.toLowerCase()
    const related = allProducts.filter(p =>
      p.device_model?.toLowerCase().includes(modelLower) ||
      modelLower.includes(p.device_model?.toLowerCase() || '')
    )

    return related.slice(0, 4)
  } catch {
    return []
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
  return getLocalProductImage(product)
}

// Helper: Czy produkt ma własne zdjęcie (nie fallback)?
function hasOwnImage(product: Product): boolean {
  return !!product.image_url
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
    const ownImage = hasOwnImage(product)
    const seoDescription = generateSeoDescription(product)
    const seoTitle = generateSeoTitle(product)

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: (product.product_type === 'walek' ? [
        product.name,
        product.sku,
        `platen roller ${product.sku}`,
        product.device_model,
        `wałek dociskowy ${product.device_model}`,
        `wałek do drukarki ${product.device_model}`,
        `platen roller zebra ${product.device_model}`,
        'wałek dociskowy zebra',
        'wałek do drukarki etykiet',
        'platen roller zebra',
        'wymiana wałka zebra',
        'części zamienne zebra',
        'serwis zebra',
        'TAKMA'
      ] : [
        product.name,
        product.sku,
        `printhead ${product.sku}`,
        product.device_model,
        `głowica ${product.device_model}`,
        `głowica termiczna ${product.device_model}`,
        `oryginalna głowica ${product.device_model}`,
        'głowica zebra',
        'głowica drukująca zebra',
        'głowica termiczna do drukarki etykiet',
        'printhead zebra',
        'części zamienne zebra',
        'oryginalna głowica zebra',
        'wymiana głowicy zebra',
        'serwis zebra',
        'TAKMA'
      ]).filter(Boolean).join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        siteName: 'TAKMA - Autoryzowany Serwis Zebra',
        locale: 'pl_PL',
        url: `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`,
        // Tylko własne zdjęcie produktu w OG (unikaj fallbacku w meta tagach)
        images: ownImage && imageUrl ? [{
          url: `https://www.serwis-zebry.pl${imageUrl}`,
          width: 800,
          height: 800,
          alt: `${product.name} ${product.sku} - oryginalna część zamienna Zebra`
        }] : []
      },
      other: {
        'og:type': 'product', // og:type = product dla stron produktowych
        'product:price:amount': product.price_brutto.toString(),
        'product:price:currency': 'PLN',
        'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
        'product:brand': 'Zebra',
        'product:condition': 'new'
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: ownImage && imageUrl ? [`https://www.serwis-zebry.pl${imageUrl}`] : []
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
      description: `${productType.namePlural} do drukarek Zebra. Oryginalne części zamienne z gwarancją. Szybka wysyłka.`,
      openGraph: {
        title: `${productType.namePlural} do drukarek Zebra | TAKMA`,
        description: `Oryginalne ${productType.namePlural.toLowerCase()} do drukarek Zebra. Wysyłka 24h, gwarancja producenta.`,
        url: `https://www.serwis-zebry.pl/sklep/${productType.slug}`,
        type: 'website',
        siteName: 'TAKMA - Autoryzowany Serwis Zebra',
        locale: 'pl_PL'
      },
      alternates: {
        canonical: `https://www.serwis-zebry.pl/sklep/${productType.slug}`
      }
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
          url: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-przemyslowe',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL',
          images: [{
            url: 'https://www.serwis-zebry.pl/sklep_photo/glowica-203dpi-do-drukarki-zebra-zt411.png',
            width: 800,
            height: 800,
            alt: 'Głowica drukująca do drukarki przemysłowej Zebra ZT411'
          }]
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
          url: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-biurkowe',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL',
          images: [{
            url: 'https://www.serwis-zebry.pl/sklep_photo/glowica-203dpi-do-drukarki-zebra-zd421t.png',
            width: 800,
            height: 800,
            alt: 'Głowica drukująca do drukarki biurkowej Zebra ZD421'
          }]
        },
        alternates: {
          canonical: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-biurkowe'
        }
      }
    }
    // SEO dla wałków do drukarek przemysłowych
    if (productType.id === 'walek' && printerCategory.id === 'industrial') {
      return {
        title: 'Wałki dociskowe do drukarek przemysłowych Zebra ZT411, ZT610, ZT620 | TAKMA',
        description: 'Oryginalne wałki dociskowe (platen roller) do drukarek przemysłowych Zebra: ZT230, ZT411, ZT421, ZT510, ZT610, ZT620. Wysyłka 24-72h. Gwarancja producenta.',
        keywords: 'wałek zt411, wałek zt610, wałek zt620, platen roller zebra, wałek dociskowy zebra przemysłowa, wymiana wałka zebra',
        openGraph: {
          title: 'Wałki dociskowe do drukarek przemysłowych Zebra | TAKMA',
          description: 'Oryginalne wałki dociskowe do ZT230, ZT411, ZT421, ZT510, ZT610, ZT620. Gwarancja producenta.',
          url: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-przemyslowe',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL',
          images: [{
            url: 'https://www.serwis-zebry.pl/sklep_photo/P1058930-080.png',
            width: 800,
            height: 800,
            alt: 'Wałek dociskowy do drukarki przemysłowej Zebra ZT411'
          }]
        },
        alternates: {
          canonical: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-przemyslowe'
        }
      }
    }
    // SEO dla wałków do drukarek biurkowych
    if (productType.id === 'walek' && printerCategory.id === 'desktop') {
      return {
        title: 'Wałki dociskowe do drukarek biurkowych Zebra ZD220, ZD421, ZD621 | TAKMA',
        description: 'Oryginalne wałki dociskowe (platen roller) do drukarek biurkowych Zebra: ZD220, ZD421, ZD510-HC, ZD621. Rozdzielczości 203/300 DPI. Wysyłka 24-72h.',
        keywords: 'wałek zd421, wałek zd621, wałek zd220, platen roller zebra biurkowa, wałek dociskowy 203 dpi, wymiana wałka zebra',
        openGraph: {
          title: 'Wałki dociskowe do drukarek biurkowych Zebra | TAKMA',
          description: 'Oryginalne wałki dociskowe do ZD220, ZD421, ZD510-HC, ZD621. Szybka wysyłka, gwarancja.',
          url: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-biurkowe',
          type: 'website',
          siteName: 'TAKMA - Autoryzowany Serwis Zebra',
          locale: 'pl_PL',
          images: [{
            url: 'https://www.serwis-zebry.pl/sklep_photo/P1112640-061.png',
            width: 800,
            height: 800,
            alt: 'Wałek dociskowy do drukarki biurkowej Zebra ZD421'
          }]
        },
        alternates: {
          canonical: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-biurkowe'
        }
      }
    }
    return {
      title: `${productType.namePlural} - ${printerCategory.name} | Sklep TAKMA`,
      description: `${productType.namePlural} do ${printerCategory.name.toLowerCase()} Zebra. Oryginalne części z gwarancją.`,
      alternates: {
        canonical: `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`
      }
    }
  }

  if (slugPath.length === 3 && printerCategory) {
    const model = getModelBySlug(slugPath[0], slugPath[1], slugPath[2])
    if (model) {
      return {
        title: `${productType.namePlural} do ${model.name} | Sklep TAKMA`,
        description: `${productType.namePlural} do drukarki ${model.name}. Oryginalne części z gwarancją. Wysyłka 24h.`,
        alternates: {
          canonical: `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`
        }
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
    const ownImage = hasOwnImage(product)
    // URL obrazka do Schema.org — własne zdjęcie lub fallback (Google wymaga image dla Product rich results)
    const fallbackImageUrl = getLocalProductImage(product)
    const schemaImageUrl = ownImage && imageUrl
      ? `https://www.serwis-zebry.pl${imageUrl}`
      : fallbackImageUrl
        ? `https://www.serwis-zebry.pl${fallbackImageUrl}`
        : 'https://www.serwis-zebry.pl/takma_logo_1.png'

    // Powiązane produkty — wyłączone do czasu włączenia wałków w sklepie
    const relatedProducts: Product[] = []

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
        product.sku,
        product.price
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
      "image": schemaImageUrl,
      "category": product.product_type === 'glowica' ? 'Głowice drukujące > Drukarki Zebra' : 'Części zamienne Zebra',
      "model": product.device_model || undefined,
      "countryOfOrigin": {
        "@type": "Country",
        "name": "Chiny"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.serwis-zebry.pl/sklep/${slugPath.join('/')}`,
        "price": product.price_brutto,
        "priceCurrency": "PLN",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock > 0 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "TAKMA - Autoryzowany Serwis Zebra"
        },
        "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": {
            "@type": "MonetaryAmount",
            "value": "0",
            "currency": "PLN"
          },
          "shippingDestination": {
            "@type": "DefinedRegion",
            "addressCountry": "PL"
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
        },
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "PL",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 14,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        }
      },
      // UWAGA: Usunięto aggregateRating i review - Google wymaga prawdziwych recenzji widocznych na stronie
      // Dodaj recenzje gdy będą realne opinie klientów
    }
    
    // Dodaj additionalProperty jeśli dostępne
    if (additionalProperties.length > 0) {
      productSchema.additionalProperty = additionalProperties.map(prop => ({
        "@type": "PropertyValue",
        "name": prop.name,
        "value": prop.value
      }))
    }

    // Dodatkowe FAQ widoczne na stronie (sekcja "Naprawić czy wymienić" + dodatkowe)
    if (product.product_type === 'glowica') {
      faqItems.push(
        {
          question: 'Jak przedłużyć żywotność głowicy drukującej?',
          answer: 'Regularne czyszczenie głowicy alkoholem izopropylowym (IPA 99%) co każdą rolkę materiału lub minimum raz w tygodniu znacząco wydłuża żywotność. Unikaj niskiej jakości etykiet i ribbonów, które mogą rysować powierzchnię głowicy. Nie ustawiaj zbyt wysokiego parametru Darkness.'
        },
        {
          question: 'Jak rozpoznać zużytą głowicę drukującą?',
          answer: 'Zużyta głowica objawia się pionowymi białymi liniami na wydruku, bladym lub nierównomiernym drukiem, oraz nieczytelnymi kodami kreskowymi. Jeśli czyszczenie alkoholem IPA nie pomaga po 2-3 próbach, głowica wymaga wymiany.'
        },
        {
          question: 'Naprawić czy wymienić głowicę?',
          answer: 'Głowicy drukującej nie da się naprawić — uszkodzone elementy grzejne są trwałe. Wymień głowicę gdy: białe pionowe linie nie znikają po czyszczeniu, widoczne rysy na powierzchni, przekroczono resurs (~1 mln cali). Wyczyść głowicę gdy: wydruk jest blady, pojedyncze linie znikają po czyszczeniu, problem pojawił się niedawno.'
        }
      )
    }

    // BreadcrumbList Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Start",
          "item": "https://www.serwis-zebry.pl"
        },
        ...productBreadcrumbs.map((crumb, index) => {
          const entry: Record<string, unknown> = {
            "@type": "ListItem",
            "position": index + 2,
            "name": crumb.label
          }
          if (crumb.href) {
            entry.item = `https://www.serwis-zebry.pl${crumb.href}`
          }
          return entry
        })
      ]
    }

    // Generuj "Szybka odpowiedź" dla głowic
    const quickAnswer = product.product_type === 'glowica' && product.resolution_dpi 
      ? `Głowica ${product.sku} to oryginalna część ${product.resolution_dpi} DPI do ${product.device_model || 'drukarki Zebra'}. Cena: ${product.price_brutto.toFixed(2).replace('.', ',')} zł brutto. Wysyłka ${product.stock > 0 ? '24h z magazynu w Polsce' : '3-7 dni'}. Gwarancja producenta 12 miesięcy.`
      : null

    return (
      <>
        <Header currentPage="other" />
        <ShopSubheader breadcrumbs={productBreadcrumbs} />
        
        <main id="main-content" className="min-h-screen bg-gray-50">
          <article className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
            
            {/* Szybka odpowiedź (Paragraph 0 dla AEO + Speakable) */}
            {quickAnswer && (
              <div className="quick-answer bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-4 sm:mb-6">
                <p className="text-sm text-gray-800 leading-relaxed">
                  <strong className="text-blue-700">W skrócie:</strong> {quickAnswer}
                </p>
              </div>
            )}

            {/* Main content - Mobile First */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 md:items-start">
              {/* Image - wrapped in <figure> for semantic SEO */}
              <figure className="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-80 lg:w-96 flex-shrink-0 m-0">
                <div className="relative aspect-square bg-white flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${product.name} ${product.resolution_dpi || ''} dpi ${product.sku} - oryginalna głowica drukująca Zebra`}
                      fill
                      className="object-contain p-3 sm:p-4"
                      priority
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300" />
                  )}
                </div>
                <figcaption className="sr-only">
                  {product.name} {product.sku} - oryginalna część zamienna Zebra
                </figcaption>
              </figure>

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
                <div className="product-price flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {product.price.toFixed(2).replace('.', ',')} zł
                  </span>
                  <span className="text-sm text-gray-500">netto</span>
                </div>
                <div className="text-base text-gray-500 mb-4">
                  {product.price_brutto.toFixed(2).replace('.', ',')} zł brutto
                </div>

                {/* Dostępność + Dodaj do koszyka (live stock z API Ingram) */}
                <ProductPurchasePanel
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
                  fallbackStockPL={product.attributes?.stock_pl ?? 0}
                  fallbackStockDE={product.attributes?.stock_de ?? 0}
                  fallbackInDelivery={product.attributes?.in_delivery ?? 0}
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

            {/* Sekcja: Naprawić czy wymienić głowicę? */}
            {product.product_type === 'glowica' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                  Naprawić czy wymienić głowicę?
                </h2>
                <div className="text-xs sm:text-sm text-gray-700 space-y-2">
                  <p><strong>Wymień głowicę gdy:</strong> białe pionowe linie na wydruku nie znikają po czyszczeniu, widoczne są rysy na powierzchni głowicy, przekroczono resurs (~1 mln cali).</p>
                  <p><strong>Wyczyść głowicę gdy:</strong> wydruk jest blady (zwiększ też Darkness), pojedyncze linie znikają po czyszczeniu, problem pojawił się niedawno.</p>
                  <p className="text-amber-700 font-medium">💡 Regularne <Link href="/blog/jak-wyczyscic-glowice-drukarki-zebra" className="underline hover:text-amber-800">czyszczenie głowicy</Link> alkoholem IPA 99% wydłuża żywotność 2-3x!</p>
                </div>
              </div>
            )}

            {/* Powiązane treści - Linkowanie wewnętrzne */}
            {product.product_type === 'glowica' && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Powiązane treści
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Poradniki blogowe */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">📖 Poradniki</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm">
                      <li>
                        <Link href="/blog/jak-wyczyscic-glowice-drukarki-zebra" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Jak wyczyścić głowicę drukarki Zebra
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Wymiana głowicy – kiedy i ile kosztuje?
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog/najczestsze-awarie-drukarek-zebra-top10" className="text-blue-600 hover:text-blue-800 hover:underline">
                          TOP 10 awarii drukarek Zebra
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog/cennik-naprawy-drukarki-zebra-koszty-serwisu" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Cennik napraw drukarek Zebra
                        </Link>
                      </li>
                      {product.device_model?.toLowerCase().includes('zd42') && (
                        <li>
                          <Link href="/blog/serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa" className="text-blue-600 hover:text-blue-800 hover:underline">
                            Serwis drukarki Zebra ZD420/ZD421
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                  {/* Poradniki wideo */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">📹 Poradniki wideo</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm">
                      <li>
                        <Link href="/poradniki-wideo" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Wymiana głowicy krok po kroku
                        </Link>
                      </li>
                      <li>
                        <Link href="/poradniki-wideo" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Blady wydruk – rozwiązanie problemu
                        </Link>
                      </li>
                      <li>
                        <Link href="/poradniki-wideo" className="text-blue-600 hover:text-blue-800 hover:underline">
                          Self-test i kalibracja drukarki
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Link do oficjalnej specyfikacji Zebra - konkretny model */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    📎 Oficjalna dokumentacja: {' '}
                    {product.device_model ? (
                      <a 
                        href={`https://www.zebra.com/us/en/support-downloads/printers/${product.device_model.toLowerCase().replace(/\s+/g, '-').replace('zebra-', '')}.html`}
                        target="_blank" 
                        rel="nofollow noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 underline"
                      >
                        Zebra {product.device_model} – Support & Downloads
                      </a>
                    ) : (
                      <a 
                        href="https://www.zebra.com/us/en/support-downloads.html" 
                        target="_blank" 
                        rel="nofollow noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800 underline"
                      >
                        Zebra Support & Downloads
                      </a>
                    )}
                    {' | '}
                    <a 
                      href="https://www.zebra.com/us/en/support-downloads.html" 
                      target="_blank" 
                      rel="nofollow noopener noreferrer"
                      className="text-gray-600 hover:text-gray-800 underline"
                    >
                      Centrum wsparcia Zebra
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Powiązane produkty */}
            {relatedProducts.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  Powiązane produkty
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedProducts.map((rp) => {
                    const rpUrl = getProductUrl(rp)
                    const rpImage = getProductImageUrl(rp)
                    return (
                      <Link key={rp.id} href={rpUrl} className="group border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all">
                        <div className="relative aspect-square bg-gray-50 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                          {rpImage ? (
                            <Image
                              src={rpImage}
                              alt={rp.name}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 40vw, 120px"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight">{rp.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{rp.price.toFixed(2).replace('.', ',')} zł netto</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Usługa montażu */}
            <div className="rounded-xl bg-gray-50 p-5 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                  <Wrench className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Potrzebujesz wymiany części?
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Odbierzemy drukarkę kurierem, wymienimy część w naszym serwisie 
                    i odeślemy sprawne urządzenie. Szybko i z gwarancją.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link 
                      href="/#formularz" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Truck className="w-4 h-4" />
                      Zamów odbiór kurierem
                    </Link>
                    <Link 
                      href="/blog/cennik-naprawy-drukarki-zebra-koszty-serwisu" 
                      className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                      Zobacz cennik napraw
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-medium text-gray-900">Pomoc w doborze części?</p>
                <p className="text-xs sm:text-sm text-gray-500">Zadzwoń – doradzimy bezpłatnie</p>
              </div>
              <a
                href="tel:+48601619898"
                className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                601 619 898
              </a>
            </div>
          </article>
        </main>

        {/* Sticky CTA na mobile — widoczny po scrollu */}
        <StickyAddToCart
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

        <Footer />

        {/* JSON-LD Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema)
          }}
        />

        {/* JSON-LD BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />

        {/* JSON-LD FAQPage Schema — generowane z faqItems */}
        {faqItems.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
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
              })
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
  let products = await getProductsForCategory({
    productType: filters.productType,
    deviceModel: filters.model || undefined
  })

  // Filtruj po kategorii drukarki (biurkowe/przemysłowe) gdy jesteśmy na Level 2
  if (filters.printerCategory && !filters.model) {
    products = products.filter(p => {
      const path = getCategoryPathForProduct(p)
      return path?.printerCategory.id === filters.printerCategory
    })
  }

  // Dostępne rozdzielczości - agreguj z produktów w tej kategorii
  // (pokazuj filtr DPI gdy są produkty z różnymi rozdzielczościami)
  const availableResolutions = productType.id === 'glowica' 
    ? Array.from(new Set(products.map(p => p.resolution_dpi).filter((r): r is number => r !== null))).sort((a, b) => a - b)
    : []

  // ItemList Schema — lista produktów w kategorii
  const itemListSchema = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "numberOfItems": products.length,
    "itemListElement": products.map((p, index) => {
      const categoryPath = getCategoryPathForProduct(p)
      const productUrl = categoryPath
        ? `https://www.serwis-zebry.pl/sklep/${categoryPath.productType.slug}/${categoryPath.printerCategory.slug}/${categoryPath.model.slug}/${p.slug}`
        : `https://www.serwis-zebry.pl/sklep/${p.slug}`
      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": p.name,
        "url": productUrl
      }
    })
  } : null

  // BreadcrumbList Schema dla kategorii
  const categoryBreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Start",
        "item": "https://www.serwis-zebry.pl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sklep",
        "item": "https://www.serwis-zebry.pl/sklep"
      },
      ...breadcrumbs.slice(1).map((crumb, index) => {
        const entry: Record<string, unknown> = {
          "@type": "ListItem",
          "position": index + 3,
          "name": crumb.label
        }
        if (crumb.href) {
          entry.item = `https://www.serwis-zebry.pl${crumb.href}`
        }
        return entry
      })
    ]
  }

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryBreadcrumbSchema) }}
      />
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
          <>
          <section className="py-6 sm:py-8 bg-blue-50 border-t border-blue-100">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-xl border border-blue-200 p-5 sm:p-6 shadow-sm">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                  Głowice drukujące Zebra — oryginalne części z gwarancją
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Oferujemy <strong>oryginalne głowice drukujące Zebra</strong> w rozdzielczościach 203, 300 i 600 DPI
                  do drukarek biurkowych (ZD421, ZD621, GK420) i przemysłowych (ZT411, ZT610, ZT620).
                  Żywotność oryginalnej głowicy: <strong>1-2 mln cali druku</strong> (25-50 km).
                  Gwarancja producenta 12 miesięcy. Wysyłka 24h z magazynu w Polsce.
                  Ceny od ~400 zł netto (203 DPI) do ~3500 zł (600 DPI).
                </p>
              </div>
            </div>
          </section>

          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Głowice drukujące do drukarek Zebra — kompletny przewodnik
              </h2>

              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Głowica drukująca (printhead)</strong> to najważniejszy komponent każdej drukarki etykiet.
                  Odpowiada za przenoszenie obrazu na materiał — w przypadku drukarek termicznych poprzez kontrolowane
                  nagrzewanie mikro-elementów grzejnych, które aktywują papier termiczny lub topią taśmę barwiącą (ribbon).
                  Od stanu głowicy zależy jakość wydruku, czytelność kodów kreskowych i niezawodność etykietowania.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Tabela Part Numbers — głowice Zebra
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Rozdzielczość</th>
                        <th className="px-3 py-2 text-left font-semibold">Part Number</th>
                        <th className="px-3 py-2 text-left font-semibold">Cena od (netto)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2 font-medium">ZT411 / ZT410</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1058930-009</td><td className="px-3 py-2">~1 000 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT411 / ZT410</td><td className="px-3 py-2">300 DPI</td><td className="px-3 py-2 font-mono text-xs">P1058930-010</td><td className="px-3 py-2">~1 500 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT411 / ZT410</td><td className="px-3 py-2">600 DPI</td><td className="px-3 py-2 font-mono text-xs">P1058930-011</td><td className="px-3 py-2">~3 000 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT610</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1083320-010</td><td className="px-3 py-2">~1 000 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT610</td><td className="px-3 py-2">300 DPI</td><td className="px-3 py-2 font-mono text-xs">P1083320-011</td><td className="px-3 py-2">~1 500 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT610</td><td className="px-3 py-2">600 DPI</td><td className="px-3 py-2 font-mono text-xs">P1083320-012</td><td className="px-3 py-2">~3 500 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT620</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1083320-015</td><td className="px-3 py-2">~1 200 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT421 / ZT420</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1058930-012</td><td className="px-3 py-2">~1 200 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT230</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1037974-010</td><td className="px-3 py-2">~800 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD421 / ZD411</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1112640-019</td><td className="px-3 py-2">~500 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD421 / ZD411</td><td className="px-3 py-2">300 DPI</td><td className="px-3 py-2 font-mono text-xs">P1112640-020</td><td className="px-3 py-2">~800 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD621 / ZD611</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1112640-019</td><td className="px-3 py-2">~500 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">GK420 / GX420</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">105934-037</td><td className="px-3 py-2">~400 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">105SL Plus</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">P1053360-018</td><td className="px-3 py-2">~1 000 zł</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZM400</td><td className="px-3 py-2">203 DPI</td><td className="px-3 py-2 font-mono text-xs">79800M</td><td className="px-3 py-2">~900 zł</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić głowicę w drukarce Zebra?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Typowe objawy zużytej głowicy to: <strong>pionowe białe linie</strong> na wydruku (uszkodzone elementy grzewcze),
                  <strong>blady lub nierównomierny wydruk</strong>, oraz <strong>nieczytelne kody kreskowe</strong> mimo prawidłowych
                  ustawień ciemności. Żywotność głowicy zależy od jakości materiałów — średnio wynosi 1-2 miliony cali druku
                  (25-50 km etykiet). Głowica 600 DPI zużywa się szybciej niż 203 DPI ze względu na gęstsze elementy grzewcze.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Rozdzielczość głowicy: 203 DPI vs 300 DPI vs 600 DPI
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>203 DPI (8 punktów/mm)</strong> — standard dla etykiet logistycznych, kodów kreskowych 1D,
                  etykiet wysyłkowych. Najczęściej wybierana, najdłuższa żywotność, najniższa cena.</li>
                  <li><strong>300 DPI (12 punktów/mm)</strong> — idealna dla małych kodów 2D (QR, DataMatrix), drobnego tekstu,
                  etykiet farmaceutycznych i elektronicznych. Dobry kompromis cena/jakość.</li>
                  <li><strong>600 DPI (24 punkty/mm)</strong> — najwyższa jakość do etykiet jubilerskich, elektroniki,
                  mikro-kodów. Najwyższa cena, najkrótsza żywotność.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Oryginalna głowica vs zamiennik — czy warto oszczędzać?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Oryginalne głowice Zebra gwarantują <strong>pełną kompatybilność</strong> z drukarką,
                  <strong>optymalną jakość wydruku</strong> i <strong>maksymalną żywotność</strong>.
                  Zamienniki często mają niższą gęstość elementów grzewczych, co skutkuje gorszą jakością i krótszą żywotnością
                  (nawet 50% krócej). Dodatkowo, użycie nieoryginalnych części może unieważnić gwarancję drukarki.
                  Przy cenie głowicy od ~400 zł i żywotności 25-50 km etykiet — koszt na etykietę jest minimalny.
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

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Najczęściej zadawane pytania
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak dobrać głowicę do mojej drukarki?</p>
                    <p className="text-gray-600 text-sm mt-1">Sprawdź model drukarki na tabliczce znamionowej i rozdzielczość w raporcie konfiguracji (Configuration Report). Part Number obecnej głowicy jest wygrawerowany na jej boku. Na tej podstawie dobierz nową głowicę w sklepie lub podaj dane — pomożemy.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak samodzielnie wymienić głowicę drukującą?</p>
                    <p className="text-gray-600 text-sm mt-1">Wyłącz drukarkę, otwórz obudowę, odłącz flat cable, odkręć 2-4 śruby starej głowicy, zamontuj nową i podłącz kabel. Cała operacja zajmuje 5-10 minut. Po wymianie wykonaj kalibrację czujników (Media Calibration).</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jaka jest żywotność głowicy drukującej?</p>
                    <p className="text-gray-600 text-sm mt-1">Oryginalna głowica Zebra ma żywotność 1-2 miliony cali druku (25-50 km etykiet). 203 DPI wytrzymuje dłużej niż 600 DPI. Regularne czyszczenie alkoholem IPA 99% wydłuża żywotność nawet 2-3 krotnie.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jaka jest różnica między 203, 300 i 600 DPI?</p>
                    <p className="text-gray-600 text-sm mt-1">203 DPI (8 pkt/mm) — logistyka, kody 1D, etykiety wysyłkowe. 300 DPI (12 pkt/mm) — kody 2D, farmacja, drobny tekst. 600 DPI (24 pkt/mm) — jubilerstwo, mikro-kody, precyzja. Głowice nie są wymienne między rozdzielczościami.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Ile kosztuje głowica do drukarki Zebra?</p>
                    <p className="text-gray-600 text-sm mt-1">Oryginalne głowice Zebra kosztują od ~400 zł netto (biurkowe 203 DPI) do ~3 500 zł (przemysłowe 600 DPI). Cena zależy od modelu drukarki i rozdzielczości. 300 DPI jest zwykle o 50-100% droższa od 203 DPI.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak czyścić głowicę drukującą?</p>
                    <p className="text-gray-600 text-sm mt-1">Używaj alkoholu izopropylowego (IPA) 99% i wacika lub dedykowanej karty czyszczącej Zebra. Czyść elementy grzewcze co każdą rolkę materiału lub minimum raz w tygodniu. Nigdy nie używaj wody, acetonu ani ostrych narzędzi.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy głowica jest objęta gwarancją?</p>
                    <p className="text-gray-600 text-sm mt-1">Tak, wszystkie oryginalne głowice Zebra w naszym sklepie objęte są 12-miesięczną gwarancją producenta. Gwarancja obejmuje wady materiałowe i produkcyjne. Nie obejmuje uszkodzeń mechanicznych i zużycia eksploatacyjnego.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Oryginalna głowica czy zamiennik — co wybrać?</p>
                    <p className="text-gray-600 text-sm mt-1">Zdecydowanie oryginalna. Zamienniki mają niższą gęstość elementów grzewczych, krótszą żywotność (nawet o 50%) i mogą unieważnić gwarancję drukarki. Przy kosztach rzędu groszy na etykietę — oszczędność na zamienniku nie jest warta ryzyka.</p>
                  </div>
                </div>

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

          {/* FAQPage Schema — /sklep/glowice */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Jak dobrać głowicę do mojej drukarki?", "acceptedAnswer": { "@type": "Answer", "text": "Sprawdź model drukarki na tabliczce znamionowej i rozdzielczość w raporcie konfiguracji (Configuration Report). Part Number obecnej głowicy jest wygrawerowany na jej boku." }},
                { "@type": "Question", "name": "Jak samodzielnie wymienić głowicę drukującą?", "acceptedAnswer": { "@type": "Answer", "text": "Wyłącz drukarkę, otwórz obudowę, odłącz flat cable, odkręć 2-4 śruby starej głowicy, zamontuj nową i podłącz kabel. Cała operacja zajmuje 5-10 minut. Po wymianie wykonaj kalibrację czujników." }},
                { "@type": "Question", "name": "Jaka jest żywotność głowicy drukującej?", "acceptedAnswer": { "@type": "Answer", "text": "Oryginalna głowica Zebra ma żywotność 1-2 miliony cali druku (25-50 km etykiet). 203 DPI wytrzymuje dłużej niż 600 DPI. Regularne czyszczenie alkoholem IPA 99% wydłuża żywotność nawet 2-3 krotnie." }},
                { "@type": "Question", "name": "Jaka jest różnica między 203, 300 i 600 DPI?", "acceptedAnswer": { "@type": "Answer", "text": "203 DPI (8 pkt/mm) — logistyka, kody 1D. 300 DPI (12 pkt/mm) — kody 2D, farmacja. 600 DPI (24 pkt/mm) — jubilerstwo, mikro-kody. Głowice nie są wymienne między rozdzielczościami." }},
                { "@type": "Question", "name": "Ile kosztuje głowica do drukarki Zebra?", "acceptedAnswer": { "@type": "Answer", "text": "Oryginalne głowice Zebra kosztują od ~400 zł netto (biurkowe 203 DPI) do ~3 500 zł (przemysłowe 600 DPI)." }},
                { "@type": "Question", "name": "Jak czyścić głowicę drukującą?", "acceptedAnswer": { "@type": "Answer", "text": "Używaj alkoholu izopropylowego (IPA) 99% i wacika lub dedykowanej karty czyszczącej Zebra. Czyść co każdą rolkę materiału lub minimum raz w tygodniu." }},
                { "@type": "Question", "name": "Czy głowica jest objęta gwarancją?", "acceptedAnswer": { "@type": "Answer", "text": "Tak, wszystkie oryginalne głowice Zebra w naszym sklepie objęte są 12-miesięczną gwarancją producenta." }},
                { "@type": "Question", "name": "Oryginalna głowica czy zamiennik — co wybrać?", "acceptedAnswer": { "@type": "Answer", "text": "Zdecydowanie oryginalna. Zamienniki mają niższą gęstość elementów grzewczych, krótszą żywotność i mogą unieważnić gwarancję drukarki." }}
              ]
            }) }}
          />
          </>
        )}

        {/* SEO Content Section - Wałki dociskowe */}
        {productType.id === 'walek' && slugPath.length === 1 && (
          <>
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
                  Tabela Part Numbers — wałki Zebra
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Part Number wałka</th>
                        <th className="px-3 py-2 text-left font-semibold">Szerokość</th>
                        <th className="px-3 py-2 text-left font-semibold">Kompatybilność</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2 font-medium">ZT411 / ZT410</td><td className="px-3 py-2 font-mono text-xs">P1058930-080</td><td className="px-3 py-2">104 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT410, ZT411</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT421 / ZT420</td><td className="px-3 py-2 font-mono text-xs">P1058930-081</td><td className="px-3 py-2">168 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT420, ZT421</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT610</td><td className="px-3 py-2 font-mono text-xs">P1083347-005</td><td className="px-3 py-2">104 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT610</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT620</td><td className="px-3 py-2 font-mono text-xs">P1083347-006</td><td className="px-3 py-2">168 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT620</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT230</td><td className="px-3 py-2 font-mono text-xs">P1037974-003</td><td className="px-3 py-2">104 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT230</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZT510</td><td className="px-3 py-2 font-mono text-xs">P1083347-018</td><td className="px-3 py-2">104 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZT510</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD421 / ZD411 / ZD621</td><td className="px-3 py-2 font-mono text-xs">P1112640-016</td><td className="px-3 py-2">56 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZD411, ZD421, ZD611, ZD621</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD220 / ZD230</td><td className="px-3 py-2 font-mono text-xs">P1080383-417</td><td className="px-3 py-2">56 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZD220, ZD230</td></tr>
                      <tr><td className="px-3 py-2 font-medium">ZD510-HC</td><td className="px-3 py-2 font-mono text-xs">P1112640-017</td><td className="px-3 py-2">56 mm</td><td className="px-3 py-2 text-xs text-gray-500">ZD510-HC (medyczny)</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić wałek dociskowy?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Wałek wymaga wymiany gdy zauważysz: <strong>nierównomierny wydruk</strong> (jaśniejszy/ciemniejszy w różnych
                  miejscach), <strong>problemy z prowadzeniem etykiet</strong> (zacięcia, krzywy podawanie),
                  <strong>poślizg materiału</strong>, lub <strong>widoczne zużycie gumy</strong> (stwardnienie, pęknięcia,
                  wgłębienia). Typowa żywotność to 500 000 - 1 000 000 etykiet (2-3 lata).
                  <strong> Zebra zaleca wymianę wałka razem z głowicą</strong> — stary wałek skraca żywotność nowej głowicy.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Najczęściej zadawane pytania
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak dobrać wałek do drukarki?</p>
                    <p className="text-gray-600 text-sm mt-1">Sprawdź model drukarki na tabliczce znamionowej i znajdź odpowiedni Part Number w tabeli powyżej. Wałki nie zależą od rozdzielczości — jeden wałek pasuje do wszystkich wariantów DPI danego modelu.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy wymienić wałek razem z głowicą?</p>
                    <p className="text-gray-600 text-sm mt-1">Tak — Zebra zaleca wymianę wałka przy każdej wymianie głowicy. Stary, nierówny wałek skraca żywotność nowej głowicy i pogarsza jakość druku od pierwszego dnia. Koszt wałka jest niewielki w porównaniu z głowicą.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jakie są objawy zużytego wałka?</p>
                    <p className="text-gray-600 text-sm mt-1">Nierówny docisk (jasne/ciemne paski), poślizg etykiet, zacięcia papieru, zwiększony hałas podczas druku, błędy kalibracji czujników. Widoczne uszkodzenia gumy (pęknięcia, wgniecenia) wymagają natychmiastowej wymiany.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak czyścić wałek dociskowy?</p>
                    <p className="text-gray-600 text-sm mt-1">Czyść wałek alkoholem izopropylowym (IPA 99%) co 5 000-10 000 etykiet lub przy wymianie rolki materiału. Obracaj wałek i przecieraj całą powierzchnię. Nigdy nie używaj rozpuszczalników ani ostrych narzędzi.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jaka jest żywotność wałka dociskowego?</p>
                    <p className="text-gray-600 text-sm mt-1">Oryginalny wałek Zebra wytrzymuje 500 000 - 1 000 000 etykiet (ok. 150-300 km wydruku), co przekłada się na 2-3 lata przy normalnym użytkowaniu. Regularne czyszczenie wydłuża żywotność nawet dwukrotnie.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak wymienić wałek — krok po kroku?</p>
                    <p className="text-gray-600 text-sm mt-1">Wyłącz drukarkę, otwórz pokrywę, zwolnij mechanizm blokujący (dźwignia/zatrzask), wyjmij stary wałek, włóż nowy i zablokuj. Po wymianie wykonaj kalibrację czujników. Cała operacja zajmuje 2-5 minut.</p>
                  </div>
                </div>

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

          {/* FAQPage Schema — /sklep/walki-dociskowe */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Jak dobrać wałek do drukarki?", "acceptedAnswer": { "@type": "Answer", "text": "Sprawdź model drukarki na tabliczce znamionowej. Wałki nie zależą od rozdzielczości — jeden wałek pasuje do wszystkich wariantów DPI danego modelu." }},
                { "@type": "Question", "name": "Czy wymienić wałek razem z głowicą?", "acceptedAnswer": { "@type": "Answer", "text": "Tak — Zebra zaleca wymianę wałka przy każdej wymianie głowicy. Stary wałek skraca żywotność nowej głowicy." }},
                { "@type": "Question", "name": "Jakie są objawy zużytego wałka?", "acceptedAnswer": { "@type": "Answer", "text": "Nierówny docisk, poślizg etykiet, zacięcia papieru, zwiększony hałas, błędy kalibracji czujników." }},
                { "@type": "Question", "name": "Jak czyścić wałek dociskowy?", "acceptedAnswer": { "@type": "Answer", "text": "Czyść alkoholem izopropylowym (IPA 99%) co 5 000-10 000 etykiet. Nigdy nie używaj rozpuszczalników." }},
                { "@type": "Question", "name": "Jaka jest żywotność wałka dociskowego?", "acceptedAnswer": { "@type": "Answer", "text": "500 000 - 1 000 000 etykiet (150-300 km), ok. 2-3 lata przy normalnym użytkowaniu." }},
                { "@type": "Question", "name": "Jak wymienić wałek — krok po kroku?", "acceptedAnswer": { "@type": "Answer", "text": "Wyłącz drukarkę, otwórz pokrywę, zwolnij mechanizm blokujący, wyjmij stary wałek, włóż nowy i zablokuj. 2-5 minut." }}
              ]
            }) }}
          />
          </>
        )}

        {/* SEO Content Section - Akumulatory */}
        {productType.id === 'akumulator' && slugPath.length === 1 && (
          <>
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
                  Tabela modeli — akumulatory Zebra
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Typ urządzenia</th>
                        <th className="px-3 py-2 text-left font-semibold">Modele</th>
                        <th className="px-3 py-2 text-left font-semibold">Pojemność</th>
                        <th className="px-3 py-2 text-left font-semibold">Czas pracy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2 font-medium">Drukarki mobilne</td><td className="px-3 py-2">ZQ520, ZQ630</td><td className="px-3 py-2">2500-4400 mAh</td><td className="px-3 py-2">4-8 godz.</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Terminale</td><td className="px-3 py-2">TC21, TC52, TC72</td><td className="px-3 py-2">3100-6400 mAh</td><td className="px-3 py-2">8-14 godz.</td></tr>
                      <tr><td className="px-3 py-2 font-medium">Skanery</td><td className="px-3 py-2">DS8178, LI3678</td><td className="px-3 py-2">2200-3100 mAh</td><td className="px-3 py-2">50 000+ skanów</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić akumulator?
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Baterie Li-Ion tracą pojemność z czasem — po <strong>300-500 pełnych cyklach</strong> ładowania
                  pojemność spada do ok. 80% początkowej. Wymień akumulator gdy: czas pracy znacząco się skrócił,
                  bateria szybko się rozładowuje, urządzenie niespodziewanie się wyłącza, lub bateria jest <strong>spuchnięta</strong> (natychmiast wycofaj z użytku!).
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Najczęściej zadawane pytania
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jaka jest żywotność baterii w urządzeniach Zebra?</p>
                    <p className="text-gray-600 text-sm mt-1">Oryginalne akumulatory Zebra wytrzymują 300-500 pełnych cykli ładowania, co przekłada się na 2-3 lata użytkowania. Po tym czasie pojemność spada do ~80% początkowej wartości.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Ile cykli ładowania wytrzyma bateria?</p>
                    <p className="text-gray-600 text-sm mt-1">Standardowo 300-500 pełnych cykli (0-100%). Ładowanie częściowe (np. od 20% do 80%) jest korzystniejsze i może wydłużyć żywotność do 800-1000 cykli.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak prawidłowo ładować akumulator Zebra?</p>
                    <p className="text-gray-600 text-sm mt-1">Używaj wyłącznie oryginalnych ładowarek Zebra. Unikaj głębokiego rozładowania (poniżej 20%) i przegrzewania podczas ładowania. Optymalna temperatura ładowania: 10-35°C. Nie zostawiaj urządzenia w ładowarce na dłużej niż potrzeba.</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <p className="font-semibold text-gray-900">Co zrobić ze spuchniętą baterią?</p>
                    <p className="text-gray-600 text-sm mt-1">Natychmiast wycofaj z użytku! Spuchnięta bateria to sygnał uszkodzenia ogniw — grozi przegrzaniem lub pożarem. Nie próbuj ładować ani używać. Oddaj do punktu zbiórki baterii lub prześlij do nas — utylizujemy bezpiecznie.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy zamienniki baterii są bezpieczne?</p>
                    <p className="text-gray-600 text-sm mt-1">Zamienniki mogą nie mieć certyfikowanych zabezpieczeń przed przegrzaniem, przeładowaniem i zwarciem. Oryginalne baterie Zebra mają chip komunikujący się z elektroniką urządzenia — zamienniki mogą powodować problemy z ładowaniem i unieważnić gwarancję.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak wymienić baterię w urządzeniu Zebra?</p>
                    <p className="text-gray-600 text-sm mt-1">W większości urządzeń Zebra bateria jest wymienna bez narzędzi — wystarczy zwolnić zatrzask i wyjąć starą baterię. W niektórych modelach (np. drukarki mobilne) bateria jest zabezpieczona śrubą. Przed wymianą wyłącz urządzenie.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czym jest Zebra Battery Manager?</p>
                    <p className="text-gray-600 text-sm mt-1">Battery Manager to narzędzie Zebra do monitorowania stanu baterii w terminalach (TC21, TC52, TC72). Pokazuje aktualną pojemność, liczbę cykli, temperaturę i stan zdrowia. Pomaga planować wymiany przed awarią.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Jak przechowywać zapasowe baterie?</p>
                    <p className="text-gray-600 text-sm mt-1">Przechowuj naładowane w 40-60% w temperaturze 15-25°C, z dala od źródeł ciepła. Co 3-6 miesięcy sprawdź poziom naładowania i doładuj do 50% jeśli spadł poniżej 20%. Nie przechowuj w pełni rozładowanych.</p>
                  </div>
                </div>

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

          {/* FAQPage Schema — /sklep/akumulatory */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Jaka jest żywotność baterii w urządzeniach Zebra?", "acceptedAnswer": { "@type": "Answer", "text": "Oryginalne akumulatory Zebra wytrzymują 300-500 pełnych cykli ładowania, co przekłada się na 2-3 lata użytkowania." }},
                { "@type": "Question", "name": "Ile cykli ładowania wytrzyma bateria?", "acceptedAnswer": { "@type": "Answer", "text": "Standardowo 300-500 pełnych cykli (0-100%). Ładowanie częściowe (20-80%) może wydłużyć żywotność do 800-1000 cykli." }},
                { "@type": "Question", "name": "Jak prawidłowo ładować akumulator Zebra?", "acceptedAnswer": { "@type": "Answer", "text": "Używaj wyłącznie oryginalnych ładowarek Zebra. Unikaj głębokiego rozładowania poniżej 20%. Optymalna temperatura: 10-35°C." }},
                { "@type": "Question", "name": "Co zrobić ze spuchniętą baterią?", "acceptedAnswer": { "@type": "Answer", "text": "Natychmiast wycofaj z użytku! Spuchnięta bateria grozi przegrzaniem lub pożarem. Oddaj do punktu zbiórki lub prześlij do nas." }},
                { "@type": "Question", "name": "Czy zamienniki baterii są bezpieczne?", "acceptedAnswer": { "@type": "Answer", "text": "Zamienniki mogą nie mieć certyfikowanych zabezpieczeń. Oryginalne baterie Zebra mają chip komunikujący się z urządzeniem — zamienniki mogą unieważnić gwarancję." }},
                { "@type": "Question", "name": "Jak wymienić baterię w urządzeniu Zebra?", "acceptedAnswer": { "@type": "Answer", "text": "W większości urządzeń bateria jest wymienna bez narzędzi — zwolnij zatrzask i wyjmij starą baterię. Przed wymianą wyłącz urządzenie." }},
                { "@type": "Question", "name": "Czym jest Zebra Battery Manager?", "acceptedAnswer": { "@type": "Answer", "text": "Narzędzie do monitorowania stanu baterii w terminalach Zebra. Pokazuje pojemność, cykle, temperaturę i stan zdrowia." }},
                { "@type": "Question", "name": "Jak przechowywać zapasowe baterie?", "acceptedAnswer": { "@type": "Answer", "text": "Przechowuj naładowane w 40-60% w temperaturze 15-25°C. Co 3-6 miesięcy sprawdź poziom i doładuj do 50%." }}
              ]
            }) }}
          />
          </>
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

        {/* FAQPage Schema — /sklep/glowice/drukarki-przemyslowe */}
        {productType.id === 'glowica' && slugPath.length === 2 && printerCategory?.id === 'industrial' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Czy głowica ZT410 pasuje do ZT411?", "acceptedAnswer": { "@type": "Answer", "text": "Tak! Głowice do ZT410 są w pełni kompatybilne z ZT411. Zebra zachowała tę samą konstrukcję głowicy w obu modelach. Part Number dla 203 DPI: P1058930-009, dla 300 DPI: P1058930-010, dla 600 DPI: P1058930-011." }},
                { "@type": "Question", "name": "Jak sprawdzić aktualną rozdzielczość drukarki?", "acceptedAnswer": { "@type": "Answer", "text": "Wydrukuj raport konfiguracji (Configuration Report) — znajdziesz tam RESOLUTION lub DPI. Alternatywnie, sprawdź etykietę na głowicy." }},
                { "@type": "Question", "name": "Ile kosztuje głowica do drukarki przemysłowej?", "acceptedAnswer": { "@type": "Answer", "text": "Ceny oryginalnych głowic Zebra to ok. 1000-3500 zł netto w zależności od modelu i rozdzielczości. Głowice 600 DPI są najdroższe." }}
              ]
            }) }}
          />
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

        {/* FAQPage Schema — /sklep/glowice/drukarki-biurkowe */}
        {productType.id === 'glowica' && slugPath.length === 2 && printerCategory?.id === 'desktop' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Czy głowica GK420 pasuje do ZD421?", "acceptedAnswer": { "@type": "Answer", "text": "Nie. ZD421 to nowsza generacja z inną konstrukcją. Głowice GK420 pasują tylko do GK420d/t i GX420d/t." }},
                { "@type": "Question", "name": "Jaka jest cena głowicy do drukarki biurkowej?", "acceptedAnswer": { "@type": "Answer", "text": "Oryginalne głowice Zebra do drukarek biurkowych kosztują ok. 400-1200 zł netto. Głowice 300 DPI są droższe od 203 DPI." }}
              ]
            }) }}
          />
        )}

        {/* SEO Content Section - Wałki do drukarek PRZEMYSŁOWYCH */}
        {productType.id === 'walek' && slugPath.length === 2 && printerCategory?.id === 'industrial' && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Wałki dociskowe do drukarek przemysłowych Zebra — przewodnik
              </h2>

              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Wałek dociskowy (platen roller)</strong> to gumowy walec dociskający etykietę do głowicy
                  drukującej. W drukarkach przemysłowych Zebra serii ZT wałek pracuje pod dużym obciążeniem —
                  przetwarza tysiące etykiet dziennie, narażony na ścieranie, chemikalia i wysokie temperatury.
                  Zużyty wałek powoduje <strong>jasne paski na wydruku</strong>, nierówne podawanie materiału
                  i błędy kalibracji.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Wałki do popularnych modeli przemysłowych
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Part Number wałka</th>
                        <th className="px-3 py-2 text-left font-semibold">Szerokość</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2">ZT230</td><td className="px-3 py-2">P1037974-003</td><td className="px-3 py-2">104 mm (4")</td></tr>
                      <tr><td className="px-3 py-2">ZT411</td><td className="px-3 py-2">P1058930-080</td><td className="px-3 py-2">104 mm (4")</td></tr>
                      <tr><td className="px-3 py-2">ZT421</td><td className="px-3 py-2">P1058930-081</td><td className="px-3 py-2">168 mm (6.6")</td></tr>
                      <tr><td className="px-3 py-2">ZT510</td><td className="px-3 py-2">P1083347-018</td><td className="px-3 py-2">104 mm (4")</td></tr>
                      <tr><td className="px-3 py-2">ZT610</td><td className="px-3 py-2">P1083347-005</td><td className="px-3 py-2">104 mm (4")</td></tr>
                      <tr><td className="px-3 py-2">ZT620</td><td className="px-3 py-2">P1083347-006</td><td className="px-3 py-2">168 mm (6.6")</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Kiedy wymienić wałek dociskowy?
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Jasne paski na wydruku</strong> — nierówna powierzchnia wałka nie dociska etykiety
                  równomiernie do głowicy, co skutkuje bladymi lub białymi pasami.</li>
                  <li><strong>Nierówne podawanie etykiet</strong> — zużyta guma traci przyczepność, etykiety
                  ślizgają się lub są podawane ukośnie.</li>
                  <li><strong>Widoczne uszkodzenia powierzchni</strong> — rysy, wgniecenia, stwardniała lub
                  popękana guma wymagają natychmiastowej wymiany.</li>
                  <li><strong>Po wymianie głowicy</strong> — zalecana wymiana wałka razem z głowicą, aby
                  nowa głowica miała równomierny docisk od pierwszego dnia.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Żywotność i konserwacja
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Wałek dociskowy w drukarce przemysłowej wytrzymuje przeciętnie <strong>500 000 — 1 000 000 etykiet</strong>.
                  Regularne czyszczenie alkoholem izopropylowym (IPA 99%) co 5 000 — 10 000 etykiet wydłuża żywotność
                  wałka nawet dwukrotnie. Nigdy nie czyść wałka ostrymi przedmiotami ani rozpuszczalnikami
                  — mogą uszkodzić powłokę gumową.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  FAQ — Wałki przemysłowe
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy wałek ZT410 pasuje do ZT411?</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Tak!</strong> Wałki do ZT410 i ZT411 są wymienne.
                    Zebra zachowała identyczną konstrukcję mechaniczną wałka w obu generacjach.
                    Part Number: <strong>P1058930-080</strong>.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy wałek wpływa na jakość druku?</p>
                    <p className="text-gray-600 text-sm mt-1">Tak, bezpośrednio. Wałek odpowiada za równomierny
                    docisk etykiety do głowicy na całej szerokości druku. Zużyty wałek to najczęstsza przyczyna
                    pasków i nierównego wydruku — nawet z nową głowicą.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Wałek i głowica — wymienić razem?</p>
                    <p className="text-gray-600 text-sm mt-1">Zebra zaleca wymianę wałka przy każdej wymianie głowicy.
                    Stary, nierówny wałek skraca żywotność nowej głowicy i pogarsza jakość druku od pierwszego dnia.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Problemy z jakością druku?</strong> Wyślij zdjęcie wydruku —
                    pomożemy zdiagnozować, czy to kwestia głowicy, wałka, czy ustawień.
                    <a href="/#formularz" className="underline ml-1">Zgłoś do serwisu →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQPage Schema — /sklep/walki-dociskowe/drukarki-przemyslowe */}
        {productType.id === 'walek' && slugPath.length === 2 && printerCategory?.id === 'industrial' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Czy wałek ZT410 pasuje do ZT411?", "acceptedAnswer": { "@type": "Answer", "text": "Tak! Wałki do ZT410 i ZT411 są wymienne. Zebra zachowała identyczną konstrukcję mechaniczną. Part Number: P1058930-080." }},
                { "@type": "Question", "name": "Czy wałek wpływa na jakość druku?", "acceptedAnswer": { "@type": "Answer", "text": "Tak, bezpośrednio. Wałek odpowiada za równomierny docisk etykiety do głowicy na całej szerokości druku. Zużyty wałek to najczęstsza przyczyna pasków i nierównego wydruku." }},
                { "@type": "Question", "name": "Wałek i głowica — wymienić razem?", "acceptedAnswer": { "@type": "Answer", "text": "Zebra zaleca wymianę wałka przy każdej wymianie głowicy. Stary, nierówny wałek skraca żywotność nowej głowicy i pogarsza jakość druku od pierwszego dnia." }}
              ]
            }) }}
          />
        )}

        {/* SEO Content Section - Wałki do drukarek BIURKOWYCH */}
        {productType.id === 'walek' && slugPath.length === 2 && printerCategory?.id === 'desktop' && (
          <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Wałki dociskowe do drukarek biurkowych Zebra — poradnik
              </h2>

              <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed mb-4">
                  <strong>Wałek dociskowy (platen roller)</strong> w drukarkach biurkowych Zebra serii ZD
                  pełni tę samą funkcję co w modelach przemysłowych — dociska etykietę do głowicy
                  drukującej, zapewniając równomierny transfer ciepła. W drukarkach kompaktowych
                  wałek jest mniejszy, ale równie ważny dla jakości wydruku.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Wałki do popularnych modeli biurkowych
                </h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Model drukarki</th>
                        <th className="px-3 py-2 text-left font-semibold">Part Number wałka</th>
                        <th className="px-3 py-2 text-left font-semibold">Zastosowanie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr><td className="px-3 py-2">ZD220 / ZD230</td><td className="px-3 py-2">P1080383-417</td><td className="px-3 py-2">Etykiety wysyłkowe, cenówki</td></tr>
                      <tr><td className="px-3 py-2">ZD411 / ZD421</td><td className="px-3 py-2">P1112640-016</td><td className="px-3 py-2">Magazyn, apteki, laboratoria</td></tr>
                      <tr><td className="px-3 py-2">ZD510-HC</td><td className="px-3 py-2">P1112640-017</td><td className="px-3 py-2">Szpitale, opaska na rękę</td></tr>
                      <tr><td className="px-3 py-2">ZD611 / ZD621</td><td className="px-3 py-2">P1112640-016</td><td className="px-3 py-2">Logistyka, etykiety produktowe</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  Objawy zużytego wałka w drukarce biurkowej
                </h3>
                <ul className="text-gray-600 space-y-2 mb-4">
                  <li><strong>Blade lub nierówne wydruki</strong> — głowica nie dociska równomiernie
                  przez zużytą powierzchnię wałka. Efekt szczególnie widoczny na krawędziach etykiety.</li>
                  <li><strong>Etykiety nie podają się prawidłowo</strong> — poślizg, zacięcia
                  lub ukośne podawanie przy małych etykietach (np. do opakowań).</li>
                  <li><strong>Zwiększona głośność pracy</strong> — stwardniała guma powoduje
                  wyraźny hałas podczas drukowania.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  ZD510-HC — wałek do zastosowań medycznych
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Drukarka <strong>ZD510-HC (Healthcare)</strong> jest przeznaczona do szpitali i klinik —
                  drukuje opaski na rękę pacjentów. Wałek P1112640-017 w tym modelu jest odporny na
                  środki dezynfekujące stosowane w placówkach medycznych. Stosowanie nieoryginalnych
                  zamienników może prowadzić do degradacji gumy pod wpływem chemikaliów.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                  FAQ — Wałki biurkowe
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy wałek ZD411 pasuje do ZD421?</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Tak!</strong> Oba modele używają tego samego wałka
                    P1112640-016. ZD421 to szersza wersja ZD411 z tą samą mechaniką wałka.</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-gray-900">Czy mogę używać zamiennika wałka?</p>
                    <p className="text-gray-600 text-sm mt-1">Nieoryginalne wałki mają inną twardość gumy (Shore A)
                    i mogą powodować nierówny docisk, przyspieszając zużycie głowicy. Przy stosunkowo niskiej cenie
                    wałka oryginalnego — to ryzyko nie jest warte oszczędności.</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Nie wiesz jaki wałek do Twojej drukarki?</strong> Podaj model drukarki —
                    dobierzemy właściwy wałek i sprawdzimy dostępność.
                    <a href="/kontakt" className="underline ml-1">Napisz do nas →</a>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQPage Schema — /sklep/walki-dociskowe/drukarki-biurkowe */}
        {productType.id === 'walek' && slugPath.length === 2 && printerCategory?.id === 'desktop' && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                { "@type": "Question", "name": "Czy wałek ZD411 pasuje do ZD421?", "acceptedAnswer": { "@type": "Answer", "text": "Tak! Oba modele używają tego samego wałka P1112640-016. ZD421 to szersza wersja ZD411 z tą samą mechaniką wałka." }},
                { "@type": "Question", "name": "Czy mogę używać zamiennika wałka?", "acceptedAnswer": { "@type": "Answer", "text": "Nieoryginalne wałki mają inną twardość gumy (Shore A) i mogą powodować nierówny docisk, przyspieszając zużycie głowicy. Przy niskiej cenie wałka oryginalnego — to ryzyko nie jest warte oszczędności." }}
              ]
            }) }}
          />
        )}
      </div>

      <Footer />
    </>
  )
}
