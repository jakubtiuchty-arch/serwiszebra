import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ChevronRight, 
  Package, 
  Printer,
  Battery,
  Cable,
  Check,
  X,
  Truck,
  Shield,
  Phone,
  ShoppingCart
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

    return {
      title: `${product.name} | Sklep TAKMA`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
        images: product.image_url ? [product.image_url] : ['/placeholder-product.jpg']
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
        title: `${productType.namePlural} do Zebra ${model.name} | Sklep TAKMA`,
        description: `${productType.namePlural} do drukarki Zebra ${model.name}. Oryginalne części z gwarancją. Wysyłka 24h.`
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

    // Dodaj produkt do breadcrumbs
    const productBreadcrumbs = [
      ...breadcrumbs,
      { label: product.name, href: '' }
    ]

    return (
      <>
        <Header currentPage="other" />
        <ShopSubheader />
        
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm mb-6 flex-wrap">
              {productBreadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-gray-500 hover:text-blue-600 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            {/* Main content - 2 kolumny */}
            <div className="flex flex-col md:flex-row gap-6 mb-6 md:items-start">
              {/* Image */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-96 flex-shrink-0">
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      priority
                    />
                  ) : (
                    <Icon className="w-20 h-20 text-gray-300" />
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 flex-1">
                {/* Nazwa */}
                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h1>

                {/* PN (Part Number) */}
                <p className="text-sm text-gray-500 mb-4">
                  PN: <span className="font-medium text-gray-700">{product.sku}</span>
                </p>

                {/* Cena - netto większe */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {product.price.toFixed(2)} zł <span className="text-base font-normal text-gray-500">netto</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {product.price_brutto.toFixed(2)} zł brutto
                  </div>
                </div>

                {/* Dostępność */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Dostępny</span>
                      <span className="text-sm text-gray-500">({product.stock} szt. w magazynie)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <X className="w-5 h-5" />
                      <span className="font-medium">Niedostępny</span>
                    </div>
                  )}
                </div>

                {/* Pasuje do modelu */}
                {product.device_model && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-gray-700">Pasuje do:</span>{' '}
                      <span className="text-blue-700 font-medium">{product.device_model}</span>
                      {product.resolution_dpi && (
                        <span className="text-gray-500"> ({product.resolution_dpi} DPI)</span>
                      )}
                    </p>
                  </div>
                )}

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

                {/* Benefits */}
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span>Wysyłka 24h</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>Gwarancja</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opis */}
            {(product.description || product.description_long) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Opis produktu</h2>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                  {product.description && <p>{product.description}</p>}
                  {product.description_long && (
                    <p className="whitespace-pre-line">{product.description_long}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Potrzebujesz pomocy?</p>
                <p className="text-xs text-gray-500">Zadzwoń – pomożemy dobrać część</p>
              </div>
              <a
                href="tel:+48601619898"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <Phone className="w-4 h-4" />
                601 619 898
              </a>
            </div>
          </div>
        </div>

        <Footer />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": product.name,
              "description": product.description,
              "sku": product.sku,
              "brand": {
                "@type": "Brand",
                "name": product.manufacturer || "Zebra"
              },
              "offers": {
                "@type": "Offer",
                "price": product.price_brutto,
                "priceCurrency": "PLN",
                "availability": product.stock > 0 
                  ? "https://schema.org/InStock" 
                  : "https://schema.org/OutOfStock"
              }
            })
          }}
        />
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
    pageTitle = `${productType.namePlural} do Zebra ${model.name}`
    pageSubtitle = `Oryginalne ${productType.namePlural.toLowerCase()} do drukarki Zebra ${model.name}`
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
      <ShopSubheader />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - spójne z /sklep */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm mb-4 flex-wrap">
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-gray-700 font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-500 hover:text-blue-600 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

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
        <section className="py-8 sm:py-10 md:py-12">
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
