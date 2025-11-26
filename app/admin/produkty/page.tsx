'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Plus, Search, Filter, Edit, Trash2, Eye, Loader2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  product_type: string
  price: number
  price_brutto: number
  stock: number
  is_active: boolean
  device_model: string | null
  resolution_dpi: number | null
  image_url: string | null
  created_at: string
}

export default function ProduktyPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products')
      
      if (!response.ok) {
        throw new Error('Błąd pobierania produktów')
      }

      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.product_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.device_model?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-600">Ładowanie produktów...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
      {/* Header - KOMPAKTOWY */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Produkty</h1>
          <p className="text-xs text-gray-500">Zarządzaj katalogiem produktów w sklepie</p>
        </div>
        <Link
          href="/admin/produkty/dodaj"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Dodaj produkt</span>
          <span className="sm:hidden">Dodaj</span>
        </Link>
      </div>

      {/* Stats - KOMPAKTOWE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-900" />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Wszystkie</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{products.length}</p>
          <p className="text-[10px] text-gray-600">Produktów w katalogu</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-[10px] font-medium text-green-600">Aktywne</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {products.filter(p => p.is_active).length}
          </p>
          <p className="text-[10px] text-gray-600">Widoczne w sklepie</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Nieaktywne</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {products.filter(p => !p.is_active).length}
          </p>
          <p className="text-[10px] text-gray-600">Ukryte produkty</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-[10px] font-medium text-orange-600">Niski stan</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {products.filter(p => p.stock < 5).length}
          </p>
          <p className="text-[10px] text-gray-600">Produktów &lt;5 szt.</p>
        </div>
      </div>

      {/* Search - KOMPAKTOWE */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj produktów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {searchQuery ? 'Brak wyników wyszukiwania' : 'Brak produktów'}
          </h3>
          <p className="text-xs text-gray-600 mb-4">
            {searchQuery ? 'Spróbuj zmienić kryteria wyszukiwania' : 'Dodaj pierwszy produkt do katalogu'}
          </p>
          {!searchQuery && (
            <Link
              href="/admin/produkty/dodaj"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Dodaj produkt
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Typ
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Model
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Stan
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 hidden md:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800">
                        {product.product_type}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 hidden lg:table-cell">
                      <div className="text-xs text-gray-900">{product.device_model || '-'}</div>
                      {product.resolution_dpi && (
                        <span className="text-[10px] text-gray-500">{product.resolution_dpi}dpi</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-2.5">
                      <div className="text-xs font-semibold text-gray-900">{product.price_brutto.toFixed(2)} zł</div>
                      <div className="text-[10px] text-gray-500">netto: {product.price.toFixed(2)} zł</div>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 5
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} szt.
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Aktywny' : 'Nieaktywny'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/sklep/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Podgląd"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/produkty/edytuj/${product.id}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edytuj"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Usuń"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}