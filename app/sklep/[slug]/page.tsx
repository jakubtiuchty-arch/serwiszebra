import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ChevronLeft, 
  Package, 
  Printer,
  Battery,
  Cable,
  Check,
  Truck,
  Shield,
  Phone
} from 'lucide-react'
import AddToCartButton from '@/components/AddToCartButton'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'

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
      <ShopSubheader />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Back link */}
          <Link 
            href="/sklep" 
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Wróć do sklepu
          </Link>

          {/* Main content - 2 kolumny */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:items-start">
            {/* Image */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden md:w-80 flex-shrink-0">
              <div className="relative aspect-square bg-gray-50 flex items-center justify-center">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <Icon className="w-16 h-16 text-gray-300" />
                )}
                {product.stock === 0 && (
                  <div className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded">
                    Brak w magazynie
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex-1">
              <h1 className="text-lg font-semibold text-gray-900 mb-1">
                {product.name}
              </h1>

              <p className="text-xs text-gray-400 mb-3">
                SKU: {product.sku}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {product.device_model && (
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {product.device_model}
                  </span>
                )}
                {product.resolution_dpi && (
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                    {product.resolution_dpi} DPI
                  </span>
                )}
              </div>

              {/* Stock */}
              {product.stock > 0 && (
                <div className="flex items-center gap-1 text-xs text-green-600 mb-3">
                  <Check className="w-3.5 h-3.5" />
                  <span>W magazynie ({product.stock} szt.)</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-4">
                <div className="text-xl font-bold text-gray-900">
                  {product.price_brutto.toFixed(2)} zł
                </div>
                <div className="text-xs text-gray-400">
                  {product.price.toFixed(2)} zł netto
                </div>
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

              {/* Benefits */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  <span>Wysyłka 24h</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>Gwarancja</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description - pod spodem */}
          {(product.description || product.description_long) && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-sm font-medium text-gray-900 mb-2">Opis produktu</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
              {product.description_long && (
                <p className="text-sm text-gray-600 leading-relaxed mt-3 whitespace-pre-line">
                  {product.description_long}
                </p>
              )}
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
