'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Wand2, Plus, X, Eye, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DodajProduktPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generatingDescriptions, setGeneratingDescriptions] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  // Podstawowe dane
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [productType, setProductType] = useState('glowica')
  const [manufacturer, setManufacturer] = useState('Zebra')
  const [isActive, setIsActive] = useState(true)

  // Parametry techniczne
  const [deviceModel, setDeviceModel] = useState('')
  const [compatibleModels, setCompatibleModels] = useState<string[]>([])
  const [resolutionDpi, setResolutionDpi] = useState<number | null>(null)
  const [capacity, setCapacity] = useState('')
  const [additionalParams, setAdditionalParams] = useState<Array<{key: string, value: string}>>([])

  // Ceny
  const [purchasePriceNetto, setPurchasePriceNetto] = useState<number>(0)
  const [marginPercent, setMarginPercent] = useState<number>(25)
  const [priceNetto, setPriceNetto] = useState<number>(0)
  const [vatRate, setVatRate] = useState<number>(23)
  const [priceBrutto, setPriceBrutto] = useState<number>(0)

  // Magazyn
  const [stock, setStock] = useState<number>(0)
  const [leadTimeDays, setLeadTimeDays] = useState<string>('1-3')

  // Opisy
  const [description, setDescription] = useState('')
  const [descriptionLong, setDescriptionLong] = useState('')

  // SEO
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState<string[]>([])

  // Media
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Auto-generowanie slug
  const generateSlug = () => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
      .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
      .replace(/ś/g, 's').replace(/ź|ż/g, 'z')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    setSlug(generatedSlug)
  }

  // Wyliczanie cen z marży
  const calculatePrices = () => {
    const calculatedNetto = purchasePriceNetto * (1 + marginPercent / 100)
    const calculatedBrutto = calculatedNetto * (1 + vatRate / 100)
    setPriceNetto(Math.round(calculatedNetto * 100) / 100)
    setPriceBrutto(Math.round(calculatedBrutto * 100) / 100)
  }

  // Generowanie SEO (prosty fallback)
  const generateSEO = () => {
    const dpiText = resolutionDpi ? ` ${resolutionDpi}dpi` : ''
    const modelText = deviceModel ? ` ${deviceModel}` : ''
    
    const generatedTitle = `${productType.charAt(0).toUpperCase() + productType.slice(1)} ${manufacturer}${modelText}${dpiText} – oryginalna część zamienna`
    const generatedDescription = `Oryginalna ${productType} ${manufacturer}${modelText}${dpiText}. ${compatibleModels.length > 0 ? `Kompatybilna z: ${compatibleModels.slice(0, 3).join(', ')}. ` : ''}Gwarancja 12 miesięcy, szybka dostawa, autoryzowany serwis Zebra.`
    
    setMetaTitle(generatedTitle.substring(0, 60))
    setMetaDescription(generatedDescription.substring(0, 160))
  }

  // Auto-generowanie unikalnych opisów SEO dla głowic
  const generateDescriptions = async () => {
    if (productType !== 'glowica') {
      alert('Auto-generowanie opisów jest dostępne tylko dla głowic drukujących.')
      return
    }

    if (!sku) {
      alert('Wprowadź Part Number (SKU) aby wygenerować opisy.')
      return
    }

    setGeneratingDescriptions(true)

    try {
      const response = await fetch('/api/admin/products/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceModel,
          resolutionDpi,
          sku,
          priceNetto: priceNetto || undefined,
          productType
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Błąd generowania opisów')
      }

      // Uzupełnij pola
      if (result.data) {
        setDescription(result.data.description)
        setDescriptionLong(result.data.descriptionLong)
        setMetaTitle(result.data.metaTitle.substring(0, 60))
        setMetaDescription(result.data.metaDescription.substring(0, 160))
        setSeoKeywords(result.data.keywords || [])

        // Jeśli rozpoznano model, zaktualizuj
        if (result.data.identifiedModel && !deviceModel) {
          setDeviceModel(result.data.identifiedModel)
        }
        if (result.data.identifiedResolution && !resolutionDpi) {
          setResolutionDpi(result.data.identifiedResolution)
        }

        // Dodaj kompatybilne modele z FAQ jeśli są
        if (result.data.additionalProperties) {
          const compatProp = result.data.additionalProperties.find(
            (p: { name: string; value: string }) => p.name === 'Kompatybilność'
          )
          if (compatProp) {
            const models = compatProp.value.split(', ').filter((m: string) => m !== deviceModel)
            models.forEach((m: string) => {
              if (!compatibleModels.includes(m)) {
                setCompatibleModels(prev => [...prev, m])
              }
            })
          }
        }
      }

    } catch (error: any) {
      console.error('Error generating descriptions:', error)
      alert(error.message || 'Błąd generowania opisów')
    } finally {
      setGeneratingDescriptions(false)
    }
  }

  // Dodawanie parametru
  const addParameter = () => {
    setAdditionalParams([...additionalParams, { key: '', value: '' }])
  }

  // Usuwanie parametru
  const removeParameter = (index: number) => {
    setAdditionalParams(additionalParams.filter((_, i) => i !== index))
  }

  // Aktualizacja parametru
  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...additionalParams]
    updated[index][field] = value
    setAdditionalParams(updated)
  }

  // Dodawanie modelu kompatybilnego
  const addCompatibleModel = (model: string) => {
    if (model && !compatibleModels.includes(model)) {
      setCompatibleModels([...compatibleModels, model])
    }
  }

  // Usuwanie modelu kompatybilnego
  const removeCompatibleModel = (model: string) => {
    setCompatibleModels(compatibleModels.filter(m => m !== model))
  }

  // Upload zdjęcia
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Zapis produktu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Przygotuj FormData
      const formData = new FormData()
      
      formData.append('name', name)
      formData.append('slug', slug)
      formData.append('sku', sku)
      formData.append('product_type', productType)
      formData.append('manufacturer', manufacturer)
      formData.append('is_active', isActive.toString())
      
      formData.append('device_model', deviceModel)
      formData.append('compatible_models', JSON.stringify(compatibleModels))
      if (resolutionDpi) formData.append('resolution_dpi', resolutionDpi.toString())
      formData.append('capacity', capacity)
      formData.append('additional_params', JSON.stringify(additionalParams))
      
      formData.append('purchase_price_netto', purchasePriceNetto.toString())
      formData.append('margin_percent', marginPercent.toString())
      formData.append('price', priceNetto.toString())
      formData.append('vat_rate', vatRate.toString())
      formData.append('price_brutto', priceBrutto.toString())
      
      formData.append('stock', stock.toString())
      formData.append('lead_time_days', leadTimeDays)
      
      formData.append('description', description)
      formData.append('description_long', descriptionLong)
      
      formData.append('meta_title', metaTitle)
      formData.append('meta_description', metaDescription)
      
      if (imageFile) {
        formData.append('image', imageFile)
      }

      // Wyślij do API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd zapisu produktu')
      }

      // Sukces - przekieruj do listy
      router.push('/admin/produkty')
      
    } catch (error: any) {
      console.error('Error saving product:', error)
      alert(error.message || 'Błąd podczas zapisywania produktu')
    } finally {
      setLoading(false)
    }
  }

  const availableModels = [
    // Biurkowe
    'ZD220t', 'ZD230t', 'ZD411t', 'ZD421t', 'ZD611t', 'ZD621t',
    'GK420t', 'GK420d', 'GX420t', 'GX420d', 'GX430t',
    // Przemysłowe
    'ZT210', 'ZT220', 'ZT230', 'ZT410', 'ZT411', 'ZT420', 'ZT421',
    'ZT510', 'ZT610', 'ZT620', '105SLPlus', 'ZM400', 'ZM600', '110Xi4', '220Xi4',
    // Terminale
    'TC21', 'TC26', 'TC52', 'TC57', 'MC3300'
  ]
  const dpiOptions = [203, 300, 600]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/produkty"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do listy produktów
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Dodaj nowy produkt</h1>
        <p className="text-gray-600 mt-2">Wypełnij formularz aby dodać produkt do katalogu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEKCJA 1: PODSTAWOWE DANE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Podstawowe dane</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nazwa produktu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={generateSlug}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="np. Głowica drukująca Zebra ZD420 203dpi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (adres URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  placeholder="glowica-zebra-zd420-203dpi"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Wygeneruj
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">URL: /sklep/{slug || '...'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Part Number (SKU) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="np. P1058930-009"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typ produktu <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="glowica">głowica</option>
                  <option value="walek">wałek</option>
                  <option value="akumulator">akumulator</option>
                  <option value="kabel">kabel</option>
                  <option value="zasilacz">zasilacz</option>
                  <option value="etykiety">etykiety</option>
                  <option value="inne">inne</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producent
                </label>
                <input
                  type="text"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Produkt aktywny (widoczny w sklepie)
              </label>
            </div>
          </div>
        </div>

        {/* SEKCJA 2: PARAMETRY TECHNICZNE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Parametry techniczne</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model podstawowy urządzenia
              </label>
              <select
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Wybierz model --</option>
                {availableModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modele kompatybilne
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    addCompatibleModel(e.target.value)
                    e.target.value = ''
                  }}
                >
                  <option value="">-- Dodaj model --</option>
                  {availableModels.filter(m => !compatibleModels.includes(m)).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                {compatibleModels.map(model => (
                  <span
                    key={model}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {model}
                    <button
                      type="button"
                      onClick={() => removeCompatibleModel(model)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rozdzielczość DPI
                </label>
                <select
                  value={resolutionDpi || ''}
                  onChange={(e) => setResolutionDpi(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Brak / nie dotyczy --</option>
                  {dpiOptions.map(dpi => (
                    <option key={dpi} value={dpi}>{dpi} dpi</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pojemność
                </label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="np. 3200 mAh, 5000 stron"
                />
              </div>
            </div>

            {/* Dodatkowe parametry */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Dodatkowe parametry
                </label>
                <button
                  type="button"
                  onClick={addParameter}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Dodaj parametr
                </button>
              </div>
              
              <div className="space-y-2">
                {additionalParams.map((param, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={param.key}
                      onChange={(e) => updateParameter(index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Nazwa (np. Interfejs)"
                    />
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => updateParameter(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Wartość (np. USB-C)"
                    />
                    <button
                      type="button"
                      onClick={() => removeParameter(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SEKCJA 3: CENY I MARŻE */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ceny i marże</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena zakupu netto (zł)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={purchasePriceNetto}
                  onChange={(e) => setPurchasePriceNetto(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marża (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stawka VAT (%)
                </label>
                <select
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={23}>23%</option>
                  <option value={8}>8%</option>
                  <option value={5}>5%</option>
                  <option value={0}>0%</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={calculatePrices}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Wylicz cenę sprzedaży z marży
            </button>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena sprzedaży netto (zł)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceNetto}
                  onChange={(e) => setPriceNetto(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena brutto (zł)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={priceBrutto}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEKCJA 4: MAGAZYN */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Magazyn i dostępność</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stan magazynowy (szt.)
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Czas realizacji (dni)
              </label>
              <input
                type="text"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="np. 1-3, 3-5"
              />
            </div>
          </div>
        </div>

        {/* SEKCJA 5: OPISY */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Opisy produktu</h2>
            {productType === 'glowica' && (
              <button
                type="button"
                onClick={generateDescriptions}
                disabled={generatingDescriptions || !sku}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                {generatingDescriptions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generowanie...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generuj unikalne opisy SEO
                  </>
                )}
              </button>
            )}
          </div>

          {productType === 'glowica' && !description && !descriptionLong && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800">
                <strong>💡 Wskazówka:</strong> Wprowadź Part Number (SKU) i kliknij "Generuj unikalne opisy SEO" 
                aby automatycznie wypełnić opisy, meta title, meta description i słowa kluczowe 
                na podstawie specyfikacji głowicy.
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Krótki opis <span className="text-xs text-gray-500">(widoczny w liście produktów)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Krótki opis produktu (1-2 zdania)"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length} znaków</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Szczegółowy opis <span className="text-xs text-gray-500">(na stronie produktu)</span>
              </label>
              <textarea
                value={descriptionLong}
                onChange={(e) => setDescriptionLong(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Pełny opis produktu ze szczegółami technicznymi... (obsługuje markdown)"
              />
              <p className="text-xs text-gray-500 mt-1">{descriptionLong.length} znaków • Obsługuje formatowanie Markdown</p>
            </div>

            {/* Słowa kluczowe SEO */}
            {seoKeywords.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Słowa kluczowe SEO <span className="text-xs text-green-600">({seoKeywords.length} wygenerowanych)</span>
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                  {seoKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-white text-gray-700 px-2 py-0.5 rounded text-xs border border-gray-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEKCJA 6: SEO - IS KING! 👑 */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-300 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">SEO - Optymalizacja</h2>
                <p className="text-sm text-gray-600">Kluczowe dla widoczności w Google!</p>
              </div>
            </div>
            {productType === 'glowica' && (
              <button
                type="button"
                onClick={generateDescriptions}
                disabled={generatingDescriptions || !sku}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md"
              >
                {generatingDescriptions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generowanie...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Auto-generuj z PN
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={generateSEO}
                  className="flex items-center gap-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 rounded-lg font-medium transition-colors"
                >
                  <Wand2 className="w-4 h-4" />
                  Prosty szablon
                </button>
              </div>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Maksymalnie 60 znaków"
              />
              <p className={`text-xs mt-1 ${metaTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                {metaTitle.length}/60 znaków {metaTitle.length > 60 && '(Za długi!)'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                placeholder="Maksymalnie 160 znaków - opisz produkt atrakcyjnie!"
              />
              <p className={`text-xs mt-1 ${metaDescription.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                {metaDescription.length}/160 znaków {metaDescription.length > 160 && '(Za długi!)'}
              </p>
            </div>

            {/* Google Snippet Preview */}
            {metaTitle && metaDescription && (
              <div className="bg-white rounded-lg border border-gray-300 p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Podgląd w Google</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">serwis-zebry.pl › sklep › {slug || '...'}</p>
                  <p className="text-blue-800 text-lg font-medium hover:underline cursor-pointer">
                    {metaTitle || 'Tytuł produktu...'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {metaDescription || 'Opis produktu...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEKCJA 7: MEDIA */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Zdjęcie główne</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload zdjęcia produktu
            </label>
            
            {imagePreview ? (
              <div className="relative w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Plus className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Kliknij aby dodać zdjęcie</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* PRZYCISKI AKCJI */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <Link
            href="/admin/produkty"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz produkt
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}