// Hierarchia kategorii sklepu
// URL: /sklep/{productType}/{printerCategory}/{model}/{product-slug}

export interface PrinterModel {
  id: string
  name: string
  slug: string
  resolutions: number[]
}

export interface PrinterCategory {
  id: string
  name: string
  slug: string
  models: PrinterModel[]
}

export interface ProductTypeCategory {
  id: string
  name: string
  slug: string
  namePlural: string
  printerCategories: PrinterCategory[]
}

// Główna struktura kategorii
export const SHOP_CATEGORIES: ProductTypeCategory[] = [
  {
    id: 'glowica',
    name: 'Głowica',
    namePlural: 'Głowice drukujące',
    slug: 'glowice',
    printerCategories: [
      {
        id: 'desktop',
        name: 'Drukarki biurkowe',
        slug: 'drukarki-biurkowe',
        models: [
          { id: 'zd220', name: 'ZD220', slug: 'zd220', resolutions: [203] },
          { id: 'zd230', name: 'ZD230', slug: 'zd230', resolutions: [203] },
          { id: 'zd421', name: 'ZD421', slug: 'zd421', resolutions: [203, 300] },
          { id: 'zd621', name: 'ZD621', slug: 'zd621', resolutions: [203, 300] },
          { id: 'gk420d', name: 'GK420d', slug: 'gk420d', resolutions: [203] },
          { id: 'gk420t', name: 'GK420t', slug: 'gk420t', resolutions: [203] },
          { id: 'gx420d', name: 'GX420d', slug: 'gx420d', resolutions: [203] },
          { id: 'gx420t', name: 'GX420t', slug: 'gx420t', resolutions: [203] },
          { id: 'gx430t', name: 'GX430t', slug: 'gx430t', resolutions: [300] },
        ]
      },
      {
        id: 'industrial',
        name: 'Drukarki przemysłowe',
        slug: 'drukarki-przemyslowe',
        models: [
          { id: 'zt230', name: 'ZT230', slug: 'zt230', resolutions: [203, 300] },
          { id: 'zt411', name: 'ZT411', slug: 'zt411', resolutions: [203, 300, 600] },
          { id: 'zt421', name: 'ZT421', slug: 'zt421', resolutions: [203, 300] },
          { id: 'zt510', name: 'ZT510', slug: 'zt510', resolutions: [203, 300] },
          { id: 'zt610', name: 'ZT610', slug: 'zt610', resolutions: [203, 300, 600] },
          { id: 'zt620', name: 'ZT620', slug: 'zt620', resolutions: [203, 300] },
          { id: 'zm400', name: 'ZM400', slug: 'zm400', resolutions: [203, 300, 600] },
          { id: 'zm600', name: 'ZM600', slug: 'zm600', resolutions: [203, 300] },
          { id: '105sl', name: '105SL Plus', slug: '105sl', resolutions: [203, 300] },
          { id: '110xi4', name: '110Xi4', slug: '110xi4', resolutions: [203, 300, 600] },
        ]
      },
      {
        id: 'mobile',
        name: 'Drukarki mobilne',
        slug: 'drukarki-mobilne',
        models: [
          { id: 'zq520', name: 'ZQ520', slug: 'zq520', resolutions: [203] },
          { id: 'zq630', name: 'ZQ630', slug: 'zq630', resolutions: [203] },
          { id: 'zq320', name: 'ZQ320', slug: 'zq320', resolutions: [203] },
        ]
      }
    ]
  },
  {
    id: 'walek',
    name: 'Wałek',
    namePlural: 'Wałki dociskowe',
    slug: 'walki',
    printerCategories: [
      {
        id: 'desktop',
        name: 'Drukarki biurkowe',
        slug: 'drukarki-biurkowe',
        models: [
          { id: 'zd421', name: 'ZD421', slug: 'zd421', resolutions: [] },
          { id: 'zd621', name: 'ZD621', slug: 'zd621', resolutions: [] },
          { id: 'gk420', name: 'GK420', slug: 'gk420', resolutions: [] },
        ]
      },
      {
        id: 'industrial',
        name: 'Drukarki przemysłowe',
        slug: 'drukarki-przemyslowe',
        models: [
          { id: 'zt230', name: 'ZT230', slug: 'zt230', resolutions: [] },
          { id: 'zt411', name: 'ZT411', slug: 'zt411', resolutions: [] },
        ]
      }
    ]
  },
  {
    id: 'akumulator',
    name: 'Akumulator',
    namePlural: 'Akumulatory',
    slug: 'akumulatory',
    printerCategories: [
      {
        id: 'mobile',
        name: 'Drukarki mobilne',
        slug: 'drukarki-mobilne',
        models: [
          { id: 'zq520', name: 'ZQ520', slug: 'zq520', resolutions: [] },
          { id: 'zq630', name: 'ZQ630', slug: 'zq630', resolutions: [] },
        ]
      },
      {
        id: 'terminals',
        name: 'Terminale',
        slug: 'terminale',
        models: [
          { id: 'tc21', name: 'TC21/TC26', slug: 'tc21', resolutions: [] },
          { id: 'tc52', name: 'TC52/TC57', slug: 'tc52', resolutions: [] },
          { id: 'mc3300', name: 'MC3300', slug: 'mc3300', resolutions: [] },
        ]
      }
    ]
  }
]

// Helper functions

export function getProductTypeBySlug(slug: string): ProductTypeCategory | undefined {
  return SHOP_CATEGORIES.find(cat => cat.slug === slug)
}

export function getPrinterCategoryBySlug(
  productTypeSlug: string, 
  printerCategorySlug: string
): PrinterCategory | undefined {
  const productType = getProductTypeBySlug(productTypeSlug)
  if (!productType) return undefined
  return productType.printerCategories.find(cat => cat.slug === printerCategorySlug)
}

export function getModelBySlug(
  productTypeSlug: string,
  printerCategorySlug: string,
  modelSlug: string
): PrinterModel | undefined {
  const printerCategory = getPrinterCategoryBySlug(productTypeSlug, printerCategorySlug)
  if (!printerCategory) return undefined
  return printerCategory.models.find(m => m.slug === modelSlug)
}

// Znajdź kategorię dla produktu na podstawie jego danych
export function getCategoryPathForProduct(product: {
  product_type: string
  device_model: string
}): { productType: ProductTypeCategory; printerCategory: PrinterCategory; model: PrinterModel } | null {
  const productType = SHOP_CATEGORIES.find(cat => cat.id === product.product_type)
  if (!productType) return null

  for (const printerCategory of productType.printerCategories) {
    const model = printerCategory.models.find(
      m => product.device_model.toLowerCase().includes(m.id.toLowerCase())
    )
    if (model) {
      return { productType, printerCategory, model }
    }
  }
  
  return null
}

// Generuj pełny URL dla produktu
export function getProductUrl(product: {
  slug: string
  product_type: string
  device_model: string
}): string {
  const categoryPath = getCategoryPathForProduct(product)
  
  if (categoryPath) {
    return `/sklep/${categoryPath.productType.slug}/${categoryPath.printerCategory.slug}/${categoryPath.model.slug}/${product.slug}`
  }
  
  // Fallback - stary URL
  return `/sklep/${product.slug}`
}

// Generuj breadcrumbs dla kategorii
export interface BreadcrumbItem {
  label: string
  href: string
}

export function getBreadcrumbs(slugPath: string[]): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Sklep', href: '/sklep' }
  ]

  if (slugPath.length === 0) return breadcrumbs

  // Poziom 1: Typ produktu (glowice, walki, akumulatory)
  const productType = getProductTypeBySlug(slugPath[0])
  if (productType) {
    breadcrumbs.push({
      label: productType.namePlural,
      href: `/sklep/${productType.slug}`
    })
  }

  if (slugPath.length < 2) return breadcrumbs

  // Poziom 2: Kategoria drukarki (drukarki-biurkowe, drukarki-przemyslowe)
  if (productType) {
    const printerCategory = getPrinterCategoryBySlug(slugPath[0], slugPath[1])
    if (printerCategory) {
      breadcrumbs.push({
        label: printerCategory.name,
        href: `/sklep/${productType.slug}/${printerCategory.slug}`
      })
    }
  }

  if (slugPath.length < 3) return breadcrumbs

  // Poziom 3: Model drukarki (zd421, zt411, etc)
  if (productType) {
    const model = getModelBySlug(slugPath[0], slugPath[1], slugPath[2])
    if (model) {
      breadcrumbs.push({
        label: model.name,
        href: `/sklep/${productType.slug}/${slugPath[1]}/${model.slug}`
      })
    }
  }

  return breadcrumbs
}

// Sprawdź czy ścieżka to kategoria czy produkt
export function isProductPath(slugPath: string[]): boolean {
  // Produkt ma 4 segmenty: typ/kategoria/model/slug-produktu
  return slugPath.length === 4
}

export function isCategoryPath(slugPath: string[]): boolean {
  return slugPath.length >= 1 && slugPath.length <= 3
}

