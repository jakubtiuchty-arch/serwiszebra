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
  enabled?: boolean // false = ukryta kategoria
}

// Główna struktura kategorii
export const SHOP_CATEGORIES: ProductTypeCategory[] = [
  {
    id: 'glowica',
    name: 'Głowica',
    namePlural: 'Głowice drukujące',
    slug: 'glowice',
    enabled: true,
    printerCategories: [
      {
        id: 'desktop',
        name: 'Drukarki biurkowe',
        slug: 'drukarki-biurkowe',
        models: [
          { id: 'zd220t', name: 'Zebra ZD220t', slug: 'zebra-zd220t', resolutions: [203] },
          { id: 'zd220d', name: 'Zebra ZD220d', slug: 'zebra-zd220d', resolutions: [203] },
          { id: 'zd230t', name: 'Zebra ZD230t', slug: 'zebra-zd230t', resolutions: [203] },
          { id: 'zd411t', name: 'Zebra ZD411t', slug: 'zebra-zd411t', resolutions: [203, 300] },
          { id: 'zd421t', name: 'Zebra ZD421t', slug: 'zebra-zd421t', resolutions: [203, 300] },
          { id: 'zd421d', name: 'Zebra ZD421d', slug: 'zebra-zd421d', resolutions: [203, 300] },
          { id: 'zd611t', name: 'Zebra ZD611t', slug: 'zebra-zd611t', resolutions: [203, 300] },
          { id: 'zd620t', name: 'Zebra ZD620t', slug: 'zebra-zd620t', resolutions: [203, 300] },
          { id: 'zd620d', name: 'Zebra ZD620d', slug: 'zebra-zd620d', resolutions: [203, 300] },
          { id: 'zd621t', name: 'Zebra ZD621t', slug: 'zebra-zd621t', resolutions: [203, 300] },
          { id: 'zd621d', name: 'Zebra ZD621d', slug: 'zebra-zd621d', resolutions: [203, 300] },
          { id: 'gk420d', name: 'Zebra GK420d', slug: 'zebra-gk420d', resolutions: [203] },
          { id: 'gk420t', name: 'Zebra GK420t', slug: 'zebra-gk420t', resolutions: [203] },
          { id: 'gx420d', name: 'Zebra GX420d', slug: 'zebra-gx420d', resolutions: [203] },
          { id: 'gx420t', name: 'Zebra GX420t', slug: 'zebra-gx420t', resolutions: [203] },
          { id: 'gx430t', name: 'Zebra GX430t', slug: 'zebra-gx430t', resolutions: [300] },
        ]
      },
      {
        id: 'industrial',
        name: 'Drukarki przemysłowe',
        slug: 'drukarki-przemyslowe',
        models: [
          { id: 'zt111', name: 'Zebra ZT111', slug: 'zebra-zt111', resolutions: [203, 300] },
          { id: 'zt210', name: 'Zebra ZT210', slug: 'zebra-zt210', resolutions: [203, 300] },
          { id: 'zt220', name: 'Zebra ZT220', slug: 'zebra-zt220', resolutions: [203, 300] },
          { id: 'zt230', name: 'Zebra ZT230', slug: 'zebra-zt230', resolutions: [203, 300] },
          { id: 'zt410', name: 'Zebra ZT410', slug: 'zebra-zt410', resolutions: [203, 300, 600] },
          { id: 'zt411', name: 'Zebra ZT411', slug: 'zebra-zt411', resolutions: [203, 300, 600] },
          { id: 'zt420', name: 'Zebra ZT420', slug: 'zebra-zt420', resolutions: [203, 300] },
          { id: 'zt421', name: 'Zebra ZT421', slug: 'zebra-zt421', resolutions: [203, 300] },
          { id: 'zt510', name: 'Zebra ZT510', slug: 'zebra-zt510', resolutions: [203, 300] },
          { id: 'zt610', name: 'Zebra ZT610', slug: 'zebra-zt610', resolutions: [203, 300, 600] },
          { id: 'zt610r', name: 'Zebra ZT610R (RFID)', slug: 'zebra-zt610r', resolutions: [203, 300, 600] },
          { id: 'zt620', name: 'Zebra ZT620', slug: 'zebra-zt620', resolutions: [203, 300] },
          { id: 'zt620r', name: 'Zebra ZT620R (RFID)', slug: 'zebra-zt620r', resolutions: [203, 300] },
          { id: '220xi4', name: 'Zebra 220Xi4', slug: 'zebra-220xi4', resolutions: [203, 300] },
          { id: 'zm400', name: 'Zebra ZM400', slug: 'zebra-zm400', resolutions: [203, 300, 600] },
          { id: 'zm600', name: 'Zebra ZM600', slug: 'zebra-zm600', resolutions: [203, 300] },
          { id: '105sl', name: 'Zebra 105SL Plus', slug: 'zebra-105sl-plus', resolutions: [203, 300] },
          { id: '110xi4', name: 'Zebra 110Xi4', slug: 'zebra-110xi4', resolutions: [203, 300, 600] },
          { id: '140xi4', name: 'Zebra 140Xi4', slug: 'zebra-140xi4', resolutions: [203] },
          { id: '170xi4', name: 'Zebra 170Xi4', slug: 'zebra-170xi4', resolutions: [203] },
        ]
      },
    ]
  },
  {
    id: 'walek',
    name: 'Wałek',
    namePlural: 'Wałki dociskowe',
    slug: 'walki-dociskowe',
    enabled: true,
    printerCategories: [
      {
        id: 'desktop',
        name: 'Drukarki biurkowe',
        slug: 'drukarki-biurkowe',
        models: [
          { id: 'zd220', name: 'Zebra ZD220', slug: 'zebra-zd220', resolutions: [] },
          { id: 'zd421', name: 'Zebra ZD421', slug: 'zebra-zd421', resolutions: [] },
          { id: 'zd510-hc', name: 'Zebra ZD510-HC', slug: 'zebra-zd510-hc', resolutions: [] },
          { id: 'zd621', name: 'Zebra ZD621', slug: 'zebra-zd621', resolutions: [] },
        ]
      },
      {
        id: 'industrial',
        name: 'Drukarki przemysłowe',
        slug: 'drukarki-przemyslowe',
        models: [
          { id: 'zt230', name: 'Zebra ZT230', slug: 'zebra-zt230', resolutions: [] },
          { id: 'zt411', name: 'Zebra ZT411', slug: 'zebra-zt411', resolutions: [] },
          { id: 'zt421', name: 'Zebra ZT421', slug: 'zebra-zt421', resolutions: [] },
          { id: 'zt510', name: 'Zebra ZT510', slug: 'zebra-zt510', resolutions: [] },
          { id: 'zt610', name: 'Zebra ZT610', slug: 'zebra-zt610', resolutions: [] },
          { id: 'zt620', name: 'Zebra ZT620', slug: 'zebra-zt620', resolutions: [] },
        ]
      }
    ]
  },
  {
    id: 'akumulator',
    name: 'Akumulator',
    namePlural: 'Akumulatory',
    slug: 'akumulatory',
    enabled: true,
    printerCategories: [
      {
        id: 'terminals',
        name: 'Terminale',
        slug: 'terminale',
        models: [
          { id: 'tc21-tc26', name: 'Zebra TC21/TC26', slug: 'zebra-tc21-tc26', resolutions: [] },
          { id: 'tc22-tc27', name: 'Zebra TC22/TC27', slug: 'zebra-tc22-tc27', resolutions: [] },
          { id: 'tc53-tc58', name: 'Zebra TC53/TC58', slug: 'zebra-tc53-tc58', resolutions: [] },
          { id: 'tc501-tc701', name: 'Zebra TC501/TC701', slug: 'zebra-tc501-tc701', resolutions: [] },
          { id: 'mc22-mc27', name: 'Zebra MC22/MC27', slug: 'zebra-mc22-mc27', resolutions: [] },
          { id: 'mc3300x', name: 'Zebra MC3300x', slug: 'zebra-mc3300x', resolutions: [] },
          { id: 'mc9400', name: 'Zebra MC9400/MC9450', slug: 'zebra-mc9400-mc9450', resolutions: [] },
        ]
      },
      {
        id: 'mobile',
        name: 'Drukarki mobilne',
        slug: 'drukarki-mobilne',
        models: [
          { id: 'zq220', name: 'Zebra ZQ220 Plus', slug: 'zebra-zq220-plus', resolutions: [] },
          { id: 'zq310', name: 'Zebra ZQ310 Plus', slug: 'zebra-zq310-plus', resolutions: [] },
          { id: 'zq511', name: 'Zebra ZQ511/ZQ511 Plus', slug: 'zebra-zq511', resolutions: [] },
          { id: 'zq520', name: 'Zebra ZQ520/ZQ521', slug: 'zebra-zq520-zq521', resolutions: [] },
          { id: 'zq610', name: 'Zebra ZQ610', slug: 'zebra-zq610', resolutions: [] },
          { id: 'zq630', name: 'Zebra ZQ630/ZQ630 Plus', slug: 'zebra-zq630', resolutions: [] },
        ]
      },
      // {
      //   id: 'scanners',
      //   name: 'Skanery',
      //   slug: 'skanery',
      //   models: [
      //     { id: 'ds8178', name: 'Zebra DS8178', slug: 'zebra-ds8178', resolutions: [] },
      //     { id: 'li3678', name: 'Zebra LI3678', slug: 'zebra-li3678', resolutions: [] },
      //   ]
      // },
      {
        id: 'tablets',
        name: 'Tablety',
        slug: 'tablety',
        models: [
          { id: 'et60-et65', name: 'Zebra ET60/ET65', slug: 'zebra-et60-et65', resolutions: [] },
        ]
      },
    ]
  }
]

// Helper functions

// Zwraca tylko włączone kategorie (do wyświetlania w UI)
export function getEnabledCategories(): ProductTypeCategory[] {
  return SHOP_CATEGORIES.filter(cat => cat.enabled !== false)
}

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

  // Normalize: replace / with - for matching (e.g. "MC22/MC27" matches id "mc22-mc27")
  const normalizedDeviceModel = product.device_model.toLowerCase().replace(/\//g, '-')

  for (const printerCategory of productType.printerCategories) {
    const model = printerCategory.models.find(
      m => normalizedDeviceModel.includes(m.id.toLowerCase()) ||
           product.device_model.toLowerCase().includes(m.id.toLowerCase())
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

