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
  Zap,
  Truck,
  Shield,
  Phone
} from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  if (!product) {
    return {
      title: 'Produkt nie znaleziony'
    }
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

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package

  return (
    <>
      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - mini wersja */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-5">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Start
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/sklep" className="hover:text-gray-900 transition-colors">
                Sklep
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              
              {/* LEFT: Gallery */}
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-contain p-6"
                        priority
                      />
                    ) : (
                      <Icon className="w-24 h-24 text-gray-400 group-hover:text-gray-500 transition-all duration-500 group-hover:scale-110" />
                    )}

                    {product.stock <= 3 && product.stock > 0 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Ostatnie {product.stock} szt.
                      </div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        Brak w magazynie
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Details */}
              <div className="space-y-4">
                {/* Main Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <span className="text-sm text-gray-600">
                      PN:{' '}
                      <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded text-sm">
                        {product.sku}
                      </span>
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.device_model && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        Model: {product.device_model}
                      </span>
                    )}
                    {product.resolution_dpi && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                        {product.resolution_dpi} DPI
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  {product.stock > 0 && (
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-3 rounded-lg border border-green-200 mb-4">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">
                        W magazynie ({product.stock} szt.)
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">{product.price.toFixed(2)} zł</span>
                      <span className="text-sm text-gray-500">(netto)</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Cena brutto: <strong>{product.price_brutto.toFixed(2)} zł</strong> (VAT 23%)
                    </div>
                  </div>

                  {/* Add to Cart Button */}
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

                {/* Benefits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Check className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Oryginalna część</p>
                    </div>
                    <div>
                      <Truck className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Wysyłka 24h</p>
                    </div>
                    <div>
                      <Shield className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Gwarancja</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description_long && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded-full" />
                  Szczegółowy opis
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description_long}
                  </p>
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Potrzebujesz pomocy?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Zadzwoń do nas – pomożemy dobrać odpowiednią część
              </p>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>
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
