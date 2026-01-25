/**
 * Dane głowic drukujących Zebra
 * Unikalne opisy, specyfikacje i słowa kluczowe dla SEO
 */

export interface PrintheadSpec {
  // Identyfikatory
  model: string           // np. "ZD421t"
  modelFamily: string     // np. "ZD421" (bez t/d)
  resolution: number      // DPI
  partNumbers: string[]   // np. ["P1112640-218"]
  
  // Specyfikacja techniczna
  printWidth: string      // np. "104 mm (4\")"
  technology: 'thermal' | 'thermotransfer' | 'both'
  lifespan: string        // np. "~1 000 000 cali (25 km)"
  compatibleModels: string[]
  
  // SEO content
  shortDescription: string
  longDescription: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  
  // FAQ specyficzne dla modelu
  faq: Array<{
    question: string
    answer: string
  }>
  
  // Dodatkowe cechy (Schema.org additionalProperty)
  additionalProperties: Array<{
    name: string
    value: string
  }>
}

export interface PrinterModelData {
  id: string
  name: string
  category: 'desktop' | 'industrial' | 'mobile'
  printWidthMm: number
  availableResolutions: number[]
  technology: 'thermal' | 'thermotransfer' | 'both'
  lifespanInches: number
  compatibleWith: string[]  // inne modele z tą samą głowicą
}

// === DANE DRUKAREK ===

export const PRINTER_MODELS: Record<string, PrinterModelData> = {
  // DRUKARKI BIURKOWE
  'ZD220t': {
    id: 'ZD220t',
    name: 'Zebra ZD220t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['ZD230t']
  },
  'ZD230t': {
    id: 'ZD230t',
    name: 'Zebra ZD230t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['ZD220t']
  },
  'ZD411t': {
    id: 'ZD411t',
    name: 'Zebra ZD411t',
    category: 'desktop',
    printWidthMm: 56,
    availableResolutions: [203, 300],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['ZD411d']
  },
  'ZD421t': {
    id: 'ZD421t',
    name: 'Zebra ZD421t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203, 300],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['ZD421d', 'ZD421c']
  },
  'ZD611t': {
    id: 'ZD611t',
    name: 'Zebra ZD611t',
    category: 'desktop',
    printWidthMm: 56,
    availableResolutions: [203, 300],
    technology: 'thermotransfer',
    lifespanInches: 1500000,
    compatibleWith: ['ZD611d']
  },
  'ZD621t': {
    id: 'ZD621t',
    name: 'Zebra ZD621t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203, 300],
    technology: 'thermotransfer',
    lifespanInches: 1500000,
    compatibleWith: ['ZD621d']
  },
  'GK420t': {
    id: 'GK420t',
    name: 'Zebra GK420t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['GK420d', 'GX420t', 'GX420d']
  },
  'GK420d': {
    id: 'GK420d',
    name: 'Zebra GK420d',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203],
    technology: 'thermal',
    lifespanInches: 1000000,
    compatibleWith: ['GK420t', 'GX420t', 'GX420d']
  },
  'GX420t': {
    id: 'GX420t',
    name: 'Zebra GX420t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [203],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: ['GK420t', 'GK420d', 'GX420d']
  },
  'GX430t': {
    id: 'GX430t',
    name: 'Zebra GX430t',
    category: 'desktop',
    printWidthMm: 104,
    availableResolutions: [300],
    technology: 'thermotransfer',
    lifespanInches: 1000000,
    compatibleWith: []
  },
  
  // DRUKARKI PRZEMYSŁOWE
  'ZT410': {
    id: 'ZT410',
    name: 'Zebra ZT410',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300, 600],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: ['ZT411']
  },
  'ZT411': {
    id: 'ZT411',
    name: 'Zebra ZT411',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300, 600],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: ['ZT410']
  },
  'ZT420': {
    id: 'ZT420',
    name: 'Zebra ZT420',
    category: 'industrial',
    printWidthMm: 168,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: ['ZT421']
  },
  'ZT421': {
    id: 'ZT421',
    name: 'Zebra ZT421',
    category: 'industrial',
    printWidthMm: 168,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: ['ZT420']
  },
  'ZT510': {
    id: 'ZT510',
    name: 'Zebra ZT510',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: []
  },
  'ZT610': {
    id: 'ZT610',
    name: 'Zebra ZT610',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300, 600],
    technology: 'both',
    lifespanInches: 3000000,
    compatibleWith: []
  },
  'ZT620': {
    id: 'ZT620',
    name: 'Zebra ZT620',
    category: 'industrial',
    printWidthMm: 168,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 3000000,
    compatibleWith: []
  },
  '105SLPlus': {
    id: '105SLPlus',
    name: 'Zebra 105SL Plus',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: []
  },
  'ZM400': {
    id: 'ZM400',
    name: 'Zebra ZM400',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300, 600],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: []
  },
  'ZM600': {
    id: 'ZM600',
    name: 'Zebra ZM600',
    category: 'industrial',
    printWidthMm: 168,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 2000000,
    compatibleWith: []
  },
  '110Xi4': {
    id: '110Xi4',
    name: 'Zebra 110Xi4',
    category: 'industrial',
    printWidthMm: 104,
    availableResolutions: [203, 300, 600],
    technology: 'both',
    lifespanInches: 3000000,
    compatibleWith: []
  },
  '220Xi4': {
    id: '220Xi4',
    name: 'Zebra 220Xi4',
    category: 'industrial',
    printWidthMm: 168,
    availableResolutions: [203, 300],
    technology: 'both',
    lifespanInches: 3000000,
    compatibleWith: []
  }
}

// === PART NUMBERS ===

export const PART_NUMBERS: Record<string, { model: string, resolution: number }> = {
  // ZD220/ZD230
  'P1115690': { model: 'ZD220t', resolution: 203 },
  
  // ZD411
  'P1112640-200': { model: 'ZD411t', resolution: 203 },
  'P1112640-201': { model: 'ZD411t', resolution: 300 },
  
  // ZD421
  'P1112640-218': { model: 'ZD421t', resolution: 203 },
  'P1112640-219': { model: 'ZD421t', resolution: 300 },
  
  // ZD611
  'P1112640-214': { model: 'ZD611t', resolution: 203 },
  'P1112640-215': { model: 'ZD611t', resolution: 300 },
  
  // ZD621
  'P1112640-220': { model: 'ZD621t', resolution: 203 },
  'P1112640-221': { model: 'ZD621t', resolution: 300 },
  
  // GK420/GX420
  '105934-037': { model: 'GK420t', resolution: 203 },
  '105934-038': { model: 'GX430t', resolution: 300 },
  
  // ZT410/ZT411
  'P1058930-009': { model: 'ZT410', resolution: 203 },
  'P1058930-010': { model: 'ZT410', resolution: 300 },
  'P1058930-011': { model: 'ZT410', resolution: 600 },
  
  // ZT420/ZT421
  'P1058930-012': { model: 'ZT420', resolution: 203 },
  'P1058930-013': { model: 'ZT420', resolution: 300 },
  
  // ZT510
  'P1083320-015': { model: 'ZT510', resolution: 203 },
  'P1083320-016': { model: 'ZT510', resolution: 300 },
  
  // ZT610
  'P1083320-010': { model: 'ZT610', resolution: 203 },
  'P1083320-011': { model: 'ZT610', resolution: 300 },
  'P1083320-012': { model: 'ZT610', resolution: 600 },
  
  // ZT620
  'P1083320-017': { model: 'ZT620', resolution: 203 },
  'P1083320-018': { model: 'ZT620', resolution: 300 },
  
  // 105SL Plus
  'P1053360-018': { model: '105SLPlus', resolution: 203 },
  'P1053360-019': { model: '105SLPlus', resolution: 300 },
  
  // ZM400
  '79800M': { model: 'ZM400', resolution: 203 },
  '79801M': { model: 'ZM400', resolution: 300 },
  '79802M': { model: 'ZM400', resolution: 600 },
  
  // ZM600
  '79803M': { model: 'ZM600', resolution: 203 },
  '79804M': { model: 'ZM600', resolution: 300 },
  
  // 110Xi4
  'P1004230': { model: '110Xi4', resolution: 203 },
  'P1004231': { model: '110Xi4', resolution: 300 },
  'P1004232': { model: '110Xi4', resolution: 600 },
  
  // 220Xi4
  'P1004237': { model: '220Xi4', resolution: 203 },
  'P1004238': { model: '220Xi4', resolution: 300 },
}

// === FUNKCJE GENERUJĄCE UNIKALNE OPISY ===

/**
 * Formatuje żywotność w czytelny sposób
 */
function formatLifespan(inches: number): string {
  const km = Math.round(inches * 0.0000254)
  if (inches >= 1000000) {
    return `~${(inches / 1000000).toFixed(0)} mln cali (${km} km)`
  }
  return `~${inches.toLocaleString('pl-PL')} cali`
}

/**
 * Zwraca opis zastosowania dla danej rozdzielczości
 */
function getResolutionUseCase(dpi: number): string {
  switch (dpi) {
    case 203:
      return 'etykiet logistycznych, kodów kreskowych 1D (EAN, UPC, Code 128) i standardowych etykiet produktowych'
    case 300:
      return 'etykiet z kodami 2D (QR, DataMatrix), drobnego tekstu, etykiet farmaceutycznych i elektronicznych'
    case 600:
      return 'mikro-kodów, etykiet jubilerskich, elektroniki i aplikacji wymagających najwyższej precyzji'
    default:
      return 'różnorodnych zastosowań druku etykiet'
  }
}

/**
 * Zwraca nazwę kategorii drukarki
 */
function getCategoryName(category: string): string {
  switch (category) {
    case 'desktop': return 'biurkowej'
    case 'industrial': return 'przemysłowej'
    case 'mobile': return 'mobilnej'
    default: return ''
  }
}

/**
 * Generuje unikalny krótki opis produktu
 */
export function generateShortDescription(
  model: string,
  resolution: number,
  partNumber: string
): string {
  const printer = PRINTER_MODELS[model]
  if (!printer) {
    return `Oryginalna głowica drukująca ${resolution} DPI. Part Number: ${partNumber}. Gwarancja producenta.`
  }
  
  const compatibleText = printer.compatibleWith.length > 0 
    ? ` Pasuje również do: ${printer.compatibleWith.join(', ')}.`
    : ''
  
  return `Oryginalna głowica ${resolution} DPI (${resolution / 25.4} punktów/mm) do drukarki ${printer.name}. Part Number: ${partNumber}. Żywotność ${formatLifespan(printer.lifespanInches)}. Idealna do ${getResolutionUseCase(resolution)}.${compatibleText}`
}

/**
 * Generuje unikalny szczegółowy opis produktu
 */
export function generateLongDescription(
  model: string,
  resolution: number,
  partNumber: string
): string {
  const printer = PRINTER_MODELS[model]
  if (!printer) {
    return `Głowica drukująca ${resolution} DPI (Part Number: ${partNumber}) to oryginalna część zamienna produkowana przez Zebra Technologies. Zapewnia pełną kompatybilność i niezawodność działania.\n\nWymiana głowicy to prosta czynność serwisowa zajmująca 5-10 minut.`
  }
  
  const technologyText = printer.technology === 'both' 
    ? 'termicznego i termotransferowego'
    : printer.technology === 'thermal'
      ? 'termicznego (Direct Thermal)'
      : 'termotransferowego (Thermal Transfer)'
  
  const compatibleText = printer.compatibleWith.length > 0
    ? `\n• Kompatybilność: ${printer.name}, ${printer.compatibleWith.join(', ')}`
    : `\n• Kompatybilność: ${printer.name}`
  
  const categoryText = getCategoryName(printer.category)
  
  let description = `Głowica drukująca ${partNumber} to oryginalna część zamienna do drukarki ${categoryText} ${printer.name} w rozdzielczości ${resolution} DPI. Zapewnia ostrą jakość druku ${getResolutionUseCase(resolution)}.

**Specyfikacja techniczna:**
• Rozdzielczość: ${resolution} DPI (${(resolution / 25.4).toFixed(1)} punktów/mm)
• Szerokość druku: ${printer.printWidthMm} mm (${(printer.printWidthMm / 25.4).toFixed(1)}")
• Żywotność: ${formatLifespan(printer.lifespanInches)}
• Technologia: druk ${technologyText}${compatibleText}

**Kiedy wymienić głowicę?**
Typowe objawy zużycia to: pionowe białe linie na wydruku (uszkodzone elementy grzewcze), blady lub nierównomierny druk, nieczytelne kody kreskowe mimo prawidłowych ustawień ciemności.

**Wymiana głowicy:**
Wymiana to prosta czynność serwisowa — zajmuje 5-10 minut. Wyłącz drukarkę, otwórz pokrywę, odłącz taśmę flat cable, odkręć śruby mocujące (2-4 szt.), zamontuj nową głowicę i podłącz kabel. Po wymianie zalecamy kalibrację czujników.

**Serwis TAKMA:**
Oferujemy profesjonalną wymianę głowicy w serwisie — odbieramy drukarkę kurierem z całej Polski, wymieniamy głowicę, kalibrujemy i odsyłamy. Czas realizacji: 2-5 dni roboczych.`

  return description
}

/**
 * Generuje meta title dla produktu
 */
export function generateMetaTitle(
  model: string,
  resolution: number,
  partNumber: string
): string {
  const printer = PRINTER_MODELS[model]
  const modelName = printer?.name || model
  
  return `Głowica ${modelName} ${resolution} DPI (${partNumber}) – Cena, Sklep | TAKMA`
}

/**
 * Generuje meta description dla produktu
 */
export function generateMetaDescription(
  model: string,
  resolution: number,
  partNumber: string,
  priceNetto?: number
): string {
  const printer = PRINTER_MODELS[model]
  const modelName = printer?.name || model
  const priceText = priceNetto ? ` Cena: od ${priceNetto} zł netto.` : ''
  
  return `Oryginalna głowica ${resolution} DPI do ${modelName} (PN: ${partNumber}).${priceText} Wysyłka 24h z magazynu w Polsce. Gwarancja producenta. Autoryzowany dystrybutor Zebra – TAKMA.`
}

/**
 * Generuje słowa kluczowe dla produktu
 */
export function generateKeywords(
  model: string,
  resolution: number,
  partNumber: string
): string[] {
  const printer = PRINTER_MODELS[model]
  const modelName = printer?.name.replace('Zebra ', '') || model
  const modelLower = modelName.toLowerCase()
  
  const keywords = [
    // Model + głowica
    `głowica ${modelLower}`,
    `głowica ${modelLower} ${resolution} dpi`,
    `głowica do ${modelLower}`,
    `głowica drukująca ${modelLower}`,
    
    // Part Number
    partNumber,
    partNumber.toLowerCase(),
    `głowica ${partNumber}`,
    
    // Angielskie warianty
    `printhead ${modelLower}`,
    `${modelLower} printhead`,
    `printhead ${partNumber}`,
    `thermal printhead ${modelLower}`,
    
    // Buying intent
    `głowica ${modelLower} cena`,
    `głowica ${modelLower} sklep`,
    `głowica ${modelLower} kupić`,
    `głowica ${modelLower} gdzie kupić`,
    `głowica ${modelLower} oryginalna`,
    
    // Rozdzielczość
    `głowica ${resolution} dpi`,
    `głowica zebra ${resolution} dpi`,
    
    // Serwis
    `wymiana głowicy ${modelLower}`,
    `głowica ${modelLower} wymiana`,
    
    // Marka
    `głowica zebra ${modelLower}`,
    'głowica zebra',
    'głowica drukująca zebra',
    'oryginalna głowica zebra',
    
    // Kategoria
    'części zamienne zebra',
    'części do drukarki zebra'
  ]
  
  // Dodaj kompatybilne modele
  if (printer?.compatibleWith) {
    printer.compatibleWith.forEach(compat => {
      const compatLower = compat.toLowerCase()
      keywords.push(`głowica ${compatLower}`)
      keywords.push(`głowica do ${compatLower}`)
    })
  }
  
  // Usuń duplikaty i zwróć
  return Array.from(new Set(keywords))
}

/**
 * Generuje FAQ specyficzne dla produktu
 */
export function generateProductFAQ(
  model: string,
  resolution: number,
  partNumber: string
): Array<{ question: string; answer: string }> {
  const printer = PRINTER_MODELS[model]
  const modelName = printer?.name || model
  
  const faq: Array<{ question: string; answer: string }> = []
  
  // Pytanie o cenę
  faq.push({
    question: `Jaka jest cena głowicy do ${modelName}?`,
    answer: `Ceny oryginalnych głowic ${resolution} DPI do ${modelName} zaczynają się od około ${printer?.category === 'industrial' ? '1000-1500' : '400-600'} zł netto. Aktualna cena widoczna jest na stronie produktu.`
  })
  
  // Pytanie o kompatybilność
  if (printer?.compatibleWith && printer.compatibleWith.length > 0) {
    faq.push({
      question: `Czy głowica ${partNumber} pasuje do ${printer.compatibleWith[0]}?`,
      answer: `Tak! Głowica ${partNumber} jest kompatybilna zarówno z ${modelName}, jak i ${printer.compatibleWith.join(', ')}. Zebra zachowała tę samą konstrukcję głowicy w tych modelach.`
    })
  }
  
  // Pytanie o wymianę
  faq.push({
    question: `Jak wymienić głowicę w ${modelName}?`,
    answer: `Wymiana głowicy w ${modelName} to prosta czynność: 1) Wyłącz drukarkę i odłącz od zasilania. 2) Otwórz pokrywę drukarki. 3) Odłącz taśmę flat cable. 4) Odkręć śruby mocujące (2-4 szt.). 5) Wyjmij starą głowicę i włóż nową. 6) Podłącz kabel i zamknij pokrywę. Cała operacja zajmuje 5-10 minut.`
  })
  
  // Pytanie o żywotność
  faq.push({
    question: `Jaka jest żywotność głowicy ${resolution} DPI w ${modelName}?`,
    answer: `Głowica ${resolution} DPI w ${modelName} ma żywotność około ${formatLifespan(printer?.lifespanInches || 1000000)}. Żywotność zależy od jakości materiałów i częstotliwości czyszczenia — regularne czyszczenie alkoholem IPA wydłuża ją nawet o 50%.`
  })
  
  // Pytanie o rozdzielczość (jeśli dostępne są różne)
  if (printer?.availableResolutions && printer.availableResolutions.length > 1) {
    const otherRes = printer.availableResolutions.filter(r => r !== resolution)
    faq.push({
      question: `Czy mogę wymienić głowicę ${resolution} DPI na ${otherRes[0]} DPI w ${modelName}?`,
      answer: `Nie. Głowice ${resolution} DPI i ${otherRes[0]} DPI do ${modelName} mają różną konstrukcję i nie są wymienne. Musisz użyć głowicy o tej samej rozdzielczości co oryginalna. Sprawdź rozdzielczość w raporcie konfiguracji drukarki.`
    })
  }
  
  // Pytanie o gwarancję
  faq.push({
    question: `Czy głowica ${partNumber} jest objęta gwarancją?`,
    answer: `Tak. Oryginalne głowice Zebra (Part Number: ${partNumber}) są objęte 12-miesięczną gwarancją producenta. Oferujemy również rozszerzoną gwarancję na usługę wymiany głowicy w naszym serwisie.`
  })
  
  return faq
}

/**
 * Generuje additionalProperty dla Schema.org
 */
export function generateAdditionalProperties(
  model: string,
  resolution: number,
  partNumber: string
): Array<{ name: string; value: string }> {
  const printer = PRINTER_MODELS[model]
  
  const properties = [
    { name: 'Rozdzielczość', value: `${resolution} DPI` },
    { name: 'Part Number', value: partNumber },
    { name: 'Producent', value: 'Zebra Technologies' },
    { name: 'Stan', value: 'Nowy, oryginalny' },
    { name: 'Gwarancja', value: '12 miesięcy' }
  ]
  
  if (printer) {
    properties.push({ name: 'Szerokość druku', value: `${printer.printWidthMm} mm` })
    properties.push({ name: 'Żywotność', value: formatLifespan(printer.lifespanInches) })
    
    if (printer.compatibleWith.length > 0) {
      properties.push({ 
        name: 'Kompatybilność', 
        value: [printer.name, ...printer.compatibleWith].join(', ') 
      })
    }
  }
  
  return properties
}

/**
 * Główna funkcja generująca wszystkie dane dla produktu
 */
export function generatePrintheadData(
  model: string,
  resolution: number,
  partNumber: string,
  priceNetto?: number
): {
  shortDescription: string
  longDescription: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  faq: Array<{ question: string; answer: string }>
  additionalProperties: Array<{ name: string; value: string }>
} {
  return {
    shortDescription: generateShortDescription(model, resolution, partNumber),
    longDescription: generateLongDescription(model, resolution, partNumber),
    metaTitle: generateMetaTitle(model, resolution, partNumber),
    metaDescription: generateMetaDescription(model, resolution, partNumber, priceNetto),
    keywords: generateKeywords(model, resolution, partNumber),
    faq: generateProductFAQ(model, resolution, partNumber),
    additionalProperties: generateAdditionalProperties(model, resolution, partNumber)
  }
}

/**
 * Próbuje rozpoznać model i rozdzielczość na podstawie Part Number
 */
export function identifyFromPartNumber(partNumber: string): { model: string; resolution: number } | null {
  const normalized = partNumber.toUpperCase().trim()
  
  // Sprawdź w mapie Part Numbers
  if (PART_NUMBERS[normalized]) {
    return PART_NUMBERS[normalized]
  }
  
  // Sprawdź warianty (bez myślników)
  const withoutDash = normalized.replace(/-/g, '')
  for (const [pn, data] of Object.entries(PART_NUMBERS)) {
    if (pn.replace(/-/g, '') === withoutDash) {
      return data
    }
  }
  
  return null
}
