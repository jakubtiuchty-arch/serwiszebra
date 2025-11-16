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
  Zap
} from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import Header from '@/components/Header'

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
    title: `${product.name} | TAKMA Serwis Zebra`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: ['/placeholder-product.jpg']
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
    <div className="min-h-screen relative">
      {/* BACKGROUND WITH LINES */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
        </div>
      </div>
      
      {/* HEADER */}
      <Header />

      {/* CONTENT */}
      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          
          {/* BREADCRUMBS */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Start
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/sklep" className="hover:text-gray-900 transition-colors">
              Sklep
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          {/* MAIN PRODUCT SECTION */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
           {/* LEFT: GALLERY */}
<div className="space-y-4">
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative group">
    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      {product.image_url ? (
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-contain p-8"
          priority
        />
      ) : (
        <Icon className="w-32 h-32 text-gray-400 group-hover:text-gray-600 transition-all duration-500 group-hover:scale-110" />
      )}
      
      {product.stock <= 3 && product.stock > 0 && (
        <div className="absolute top-6 right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
          <Zap className="w-4 h-4 inline mr-1" />
          Ostatnie {product.stock} szt.
        </div>
      )}
      {product.stock === 0 && (
        <div className="absolute top-6 right-6 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
          Brak w magazynie
        </div>
      )}
    </div>
  </div>
</div>

            {/* RIGHT: DETAILS */}
            <div className="space-y-6">
              {/* MAIN CARD */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                  <span className="text-xs text-gray-600">
                    PN: <span className="font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                  </span>
                </div>

                <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* STOCK INFO */}
                {product.stock > 0 && (
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2.5 rounded-xl border border-green-200 mb-4">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">
                      W magazynie ({product.stock} szt.)
                    </span>
                  </div>
                )}

                {/* PRICE BOX */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-4 border border-gray-200">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-600 font-medium mb-1">Cena netto</div>
                      <div className="text-3xl font-black text-gray-900">
                        {product.price.toFixed(2)} zł
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 font-medium mb-1">Cena brutto</div>
                      <div className="text-2xl font-bold text-gray-700">
                        {product.price_brutto.toFixed(2)} zł
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 text-right font-medium">
                    w tym VAT 23%
                  </div>
                </div>

                {/* ADD TO CART BUTTON */}
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
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-3">
              <div className="w-1 h-8 bg-gray-900 rounded-full" />
              Szczegółowy opis
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description_long}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>

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
              "name": product.manufacturer
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
    </div>
  )
}