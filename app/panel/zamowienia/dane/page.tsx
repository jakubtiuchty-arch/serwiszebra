'use client'

import { useEffect, useState } from 'react'
import { 
  Building2,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  ChevronLeft,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Package
} from 'lucide-react'
import Link from 'next/link'

interface CompanyData {
  name: string
  nip: string
  street: string
  building: string
  apartment?: string
  postal_code: string
  city: string
  country: string
  phone: string
  email: string
}

interface ShippingAddress {
  id: string
  full_name: string
  name: string
  street: string
  building: string
  apartment?: string
  postal_code: string
  city: string
  country: string
  phone: string
  is_default: boolean
}

export default function DanePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  // Company data
  const [companyData, setCompanyData] = useState<CompanyData>({
    name: '',
    nip: '',
    street: '',
    building: '',
    apartment: '',
    postal_code: '',
    city: '',
    country: 'Polska',
    phone: '',
    email: ''
  })
  const [editingCompany, setEditingCompany] = useState(false)
  const [companyFormData, setCompanyFormData] = useState<CompanyData>(companyData)
  
  // Shipping addresses
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([])
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addingNewAddress, setAddingNewAddress] = useState(false)
  const [deleteModalAddress, setDeleteModalAddress] = useState<ShippingAddress | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newAddressData, setNewAddressData] = useState<Omit<ShippingAddress, 'id'>>({
    full_name: '',
    name: '',
    street: '',
    building: '',
    apartment: '',
    postal_code: '',
    city: '',
    country: 'Polska',
    phone: '',
    is_default: false
  })

  useEffect(() => {
    loadData()
  }, [])

async function loadData() {
  try {
    setLoading(true)
    
    // Pobierz dane firmy z API
    const companyResponse = await fetch('/api/company-data')
    if (companyResponse.ok) {
      const { companyData: apiCompanyData } = await companyResponse.json()
      
      // Rozdziel street na komponenty jeśli zawiera numer
      const streetParts = apiCompanyData.street?.match(/^(.+?)\s+(\d+[a-zA-Z]?)(?:\/(\d+[a-zA-Z]?))?$/)
      
      setCompanyData({
        name: apiCompanyData.name || '',
        nip: apiCompanyData.nip || '',
        street: streetParts ? streetParts[1] : apiCompanyData.street || '',
        building: streetParts ? streetParts[2] : '',
        apartment: streetParts ? streetParts[3] || '' : '',
        postal_code: apiCompanyData.postal_code || '',
        city: apiCompanyData.city || '',
        country: 'Polska',
        phone: apiCompanyData.phone || '',
        email: apiCompanyData.email || ''
      })
    }
    
    // Pobierz adresy wysyłki z API
    const addressResponse = await fetch('/api/shipping-addresses')
    if (addressResponse.ok) {
      const data = await addressResponse.json()
      setShippingAddresses(data.addresses || [])
    } else if (addressResponse.status === 401) {
      setError('Musisz być zalogowany')
    } else {
      setError('Nie udało się pobrać adresów')
    }
    
  } catch (err: any) {
    console.error('Error loading data:', err)
    setError(err.message || 'Nie udało się pobrać danych')
  } finally {
    setLoading(false)
  }
}

async function saveCompanyData() {
  try {
    setSaving(true)
    
    // Połącz street + building + apartment w jedno pole
    const fullStreet = `${companyFormData.street} ${companyFormData.building}${companyFormData.apartment ? '/' + companyFormData.apartment : ''}`.trim()
    
    const response = await fetch('/api/company-data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: companyFormData.name,
        nip: companyFormData.nip,
        street: fullStreet,
        city: companyFormData.city,
        postal_code: companyFormData.postal_code,
        phone: companyFormData.phone
      })
    })

    if (response.ok) {
      const { companyData: savedData } = await response.json()
      
      // Rozdziel z powrotem dla formularza
      const streetParts = savedData.street?.match(/^(.+?)\s+(\d+[a-zA-Z]?)(?:\/(\d+[a-zA-Z]?))?$/)
      
      setCompanyData({
        name: savedData.name,
        nip: savedData.nip,
        street: streetParts ? streetParts[1] : savedData.street,
        building: streetParts ? streetParts[2] : '',
        apartment: streetParts ? streetParts[3] || '' : '',
        postal_code: savedData.postal_code,
        city: savedData.city,
        country: 'Polska',
        phone: savedData.phone,
        email: savedData.email
      })
      
      setEditingCompany(false)
    } else {
      const error = await response.json()
      alert('Błąd: ' + (error.error || 'Nie udało się zapisać danych'))
    }
  } catch (err) {
    console.error('Error saving company data:', err)
    alert('Wystąpił błąd podczas zapisywania danych')
  } finally {
    setSaving(false)
  }
}

  async function saveShippingAddress(addressId: string, data: ShippingAddress) {
    try {
      setSaving(true)
      
      const response = await fetch('/api/shipping-addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: addressId,
          full_name: data.full_name,
          name: data.name,
          street: data.street,
          building: data.building,
          apartment: data.apartment,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country || 'Polska',
          phone: data.phone,
          is_default: data.is_default
        })
      })

      if (response.ok) {
        const result = await response.json()
        setShippingAddresses(prev => prev.map(addr => 
          addr.id === addressId ? result.address : addr
        ))
        setEditingAddressId(null)
      } else {
        const error = await response.json()
        alert('Błąd: ' + (error.error || 'Nie udało się zapisać adresu'))
      }
    } catch (err) {
      console.error('Error saving address:', err)
      alert('Wystąpił błąd podczas zapisywania adresu')
    } finally {
      setSaving(false)
    }
  }

  async function addShippingAddress() {
    try {
      setSaving(true)
      
      const response = await fetch('/api/shipping-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAddressData,
          is_default: shippingAddresses.length === 0 || newAddressData.is_default
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShippingAddresses(prev => [...prev, data.address])
        setAddingNewAddress(false)
        setNewAddressData({
          full_name: '',
          name: '',
          street: '',
          building: '',
          apartment: '',
          postal_code: '',
          city: '',
          country: 'Polska',
          phone: '',
          is_default: false
        })
      } else {
        const error = await response.json()
        alert('Błąd: ' + (error.error || 'Nie udało się dodać adresu'))
      }
    } catch (err) {
      console.error('Error adding address:', err)
      alert('Wystąpił błąd podczas dodawania adresu')
    } finally {
      setSaving(false)
    }
  }

  async function deleteShippingAddress(addressId: string) {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/shipping-addresses?id=${addressId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShippingAddresses(prev => {
          const filtered = prev.filter(addr => addr.id !== addressId)
          // Jeśli usuwamy domyślny adres, ustaw pierwszy jako domyślny
          if (filtered.length > 0 && !filtered.some(addr => addr.is_default)) {
            filtered[0].is_default = true
            // Zaktualizuj w bazie
            fetch('/api/shipping-addresses', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...filtered[0],
                is_default: true
              })
            })
          }
          return filtered
        })
        setDeleteModalAddress(null)
      } else {
        const error = await response.json()
        alert('Błąd: ' + (error.error || 'Nie udało się usunąć adresu'))
      }
    } catch (err) {
      console.error('Error deleting address:', err)
      alert('Wystąpił błąd podczas usuwania adresu')
    } finally {
      setIsDeleting(false)
    }
  }

  async function setDefaultAddress(addressId: string) {
    try {
      setSaving(true)
      
      // Znajdź adres który ma być domyślny
      const addressToUpdate = shippingAddresses.find(addr => addr.id === addressId)
      if (!addressToUpdate) return
      
      const response = await fetch('/api/shipping-addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addressToUpdate,
          is_default: true
        })
      })

      if (response.ok) {
        setShippingAddresses(prev => prev.map(addr => ({
          ...addr,
          is_default: addr.id === addressId
        })))
      } else {
        const error = await response.json()
        alert('Błąd: ' + (error.error || 'Nie udało się ustawić adresu domyślnego'))
      }
    } catch (err) {
      console.error('Error setting default address:', err)
      alert('Wystąpił błąd podczas ustawiania adresu domyślnego')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Ładowanie danych...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-sm text-red-800 font-medium mb-2">Błąd ładowania</p>
        <p className="text-xs text-red-600 mb-3">{error}</p>
        <button
          onClick={loadData}
          className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* BREADCRUMBS */}
      <Link
        href="/panel/zamowienia"
        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Powrót do zamówień
      </Link>

      {/* PAGE TITLE */}
      <div className="ml-10 lg:ml-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
          Dane do zamówień
        </h1>
        <p className="text-xs text-gray-500">
          Zarządzaj danymi do faktury i adresami wysyłki
        </p>
      </div>

      <div className="space-y-3">
        
        {/* COMPANY DATA */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Dane firmy</h2>
                  <p className="text-[10px] text-gray-600">Dane do wystawiania faktur</p>
                </div>
              </div>

              {!editingCompany && (
                <button
                  onClick={() => {
                    setCompanyFormData(companyData)
                    setEditingCompany(true)
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-medium transition-all"
                >
                  <Edit2 className="w-3 h-3" />
                  Edytuj
                </button>
              )}
            </div>

            {editingCompany ? (
              <form onSubmit={(e) => { e.preventDefault(); saveCompanyData() }} className="space-y-2">
                <div className="grid md:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nazwa firmy</label>
                    <input
                      type="text"
                      value={companyFormData.name}
                      onChange={(e) => setCompanyFormData({...companyFormData, name: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">NIP</label>
                    <input
                      type="text"
                      value={companyFormData.nip}
                      onChange={(e) => setCompanyFormData({...companyFormData, nip: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 grid md:grid-cols-3 gap-2">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Ulica</label>
                      <input
                        type="text"
                        value={companyFormData.street}
                        onChange={(e) => setCompanyFormData({...companyFormData, street: e.target.value})}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nr</label>
                        <input
                          type="text"
                          value={companyFormData.building}
                          onChange={(e) => setCompanyFormData({...companyFormData, building: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Lok.</label>
                        <input
                          type="text"
                          value={companyFormData.apartment || ''}
                          onChange={(e) => setCompanyFormData({...companyFormData, apartment: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Kod pocztowy</label>
                    <input
                      type="text"
                      value={companyFormData.postal_code}
                      onChange={(e) => setCompanyFormData({...companyFormData, postal_code: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Miasto</label>
                    <input
                      type="text"
                      value={companyFormData.city}
                      onChange={(e) => setCompanyFormData({...companyFormData, city: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Telefon</label>
                    <input
                      type="tel"
                      value={companyFormData.phone}
                      onChange={(e) => setCompanyFormData({...companyFormData, phone: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Email</label>
                    <input
                      type="email"
                      value={companyFormData.email}
                      onChange={(e) => setCompanyFormData({...companyFormData, email: e.target.value})}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCompany(false)}
                    className="px-2 py-1 text-gray-700 hover:text-gray-900 text-xs font-medium transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    Zapisz
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">Nazwa firmy</p>
                  <p className="text-xs font-semibold text-gray-900">{companyData.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">NIP</p>
                  <p className="text-xs font-semibold text-gray-900">{companyData.nip}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">Adres</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {companyData.street} {companyData.building}{companyData.apartment && `/${companyData.apartment}`}
                    <br />
                    {companyData.postal_code} {companyData.city}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 mb-0.5">Kontakt</p>
                  <p className="text-xs font-semibold text-gray-900 flex items-center gap-1 mb-0.5">
                    <Phone className="w-3 h-3 text-gray-500" />
                    {companyData.phone}
                  </p>
                  <p className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-500" />
                    {companyData.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SHIPPING ADDRESSES */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Adresy wysyłki</h2>
                  <p className="text-[10px] text-gray-600">Zarządzaj adresami dostawy</p>
                </div>
              </div>

              {!addingNewAddress && (
                <button
                  onClick={() => setAddingNewAddress(true)}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[10px] font-semibold transition-all"
                >
                  <Plus className="w-3 h-3" />
                  Dodaj
                </button>
              )}
            </div>

            <div className="space-y-2">
              {/* NEW ADDRESS FORM */}
              {addingNewAddress && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                  <h3 className="text-xs font-semibold text-gray-900 mb-2">Nowy adres wysyłki</h3>
                  <form onSubmit={(e) => { e.preventDefault(); addShippingAddress() }} className="space-y-2">
                    <div className="grid md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Imię i nazwisko</label>
                        <input
                          type="text"
                          value={newAddressData.full_name}
                          onChange={(e) => setNewAddressData({...newAddressData, full_name: e.target.value})}
                          placeholder="np. Jan Kowalski"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nazwa adresu</label>
                        <input
                          type="text"
                          value={newAddressData.name}
                          onChange={(e) => setNewAddressData({...newAddressData, name: e.target.value})}
                          placeholder="np. Magazyn główny"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-2">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Ulica</label>
                        <input
                          type="text"
                          value={newAddressData.street}
                          onChange={(e) => setNewAddressData({...newAddressData, street: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nr</label>
                          <input
                            type="text"
                            value={newAddressData.building}
                            onChange={(e) => setNewAddressData({...newAddressData, building: e.target.value})}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Lok.</label>
                          <input
                            type="text"
                            value={newAddressData.apartment || ''}
                            onChange={(e) => setNewAddressData({...newAddressData, apartment: e.target.value})}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Kod pocztowy</label>
                        <input
                          type="text"
                          value={newAddressData.postal_code}
                          onChange={(e) => setNewAddressData({...newAddressData, postal_code: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Miasto</label>
                        <input
                          type="text"
                          value={newAddressData.city}
                          onChange={(e) => setNewAddressData({...newAddressData, city: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Telefon</label>
                        <input
                          type="tel"
                          value={newAddressData.phone}
                          onChange={(e) => setNewAddressData({...newAddressData, phone: e.target.value})}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    {/* CHECKBOX DOMYŚLNY - DODANE */}
                    {shippingAddresses.length > 0 && (
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddressData.is_default}
                          onChange={(e) => setNewAddressData({...newAddressData, is_default: e.target.checked})}
                          className="w-3 h-3 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-[10px] text-gray-700">Ustaw jako adres domyślny</span>
                      </label>
                    )}
                    
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setAddingNewAddress(false)}
                        className="px-3 py-1 text-[10px] text-gray-700 hover:text-gray-900 font-medium transition-colors"
                      >
                        Anuluj
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-[10px] font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        Dodaj adres
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* EXISTING ADDRESSES */}
              {shippingAddresses.map((address) => (
                <div
                  key={address.id}
                  className={`border-2 ${address.is_default ? 'border-green-300 bg-green-50/50' : 'border-gray-200'} rounded-xl p-3 relative`}
                >
                  {address.is_default && editingAddressId !== address.id && (
  <div className="absolute bottom-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white rounded-md text-[10px] font-bold">
    <Check className="w-2.5 h-2.5" />
    Domyślny
  </div>
)}

                  {editingAddressId === address.id ? (
                    <form onSubmit={(e) => { 
                      e.preventDefault(); 
                      const formData = new FormData(e.currentTarget)
                      const updatedAddress: ShippingAddress = {
                        ...address,
                        full_name: formData.get('full_name') as string,
                        name: formData.get('name') as string,
                        street: formData.get('street') as string,
                        building: formData.get('building') as string,
                        apartment: formData.get('apartment') as string || '',
                        postal_code: formData.get('postal_code') as string,
                        city: formData.get('city') as string,
                        phone: formData.get('phone') as string,
                      }
                      saveShippingAddress(address.id, updatedAddress)
                    }} className="space-y-2">
                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Imię i nazwisko</label>
                          <input
                            type="text"
                            name="full_name"
                            defaultValue={address.full_name || ''}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nazwa adresu</label>
                          <input
                            type="text"
                            name="name"
                            defaultValue={address.name}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-2">
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Ulica</label>
                          <input
                            type="text"
                            name="street"
                            defaultValue={address.street}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Nr</label>
                            <input
                              type="text"
                              name="building"
                              defaultValue={address.building}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Lok.</label>
                            <input
                              type="text"
                              name="apartment"
                              defaultValue={address.apartment || ''}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Kod pocztowy</label>
                          <input
                            type="text"
                            name="postal_code"
                            defaultValue={address.postal_code}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Miasto</label>
                          <input
                            type="text"
                            name="city"
                            defaultValue={address.city}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-0.5">Telefon</label>
                          <input
                            type="tel"
                            name="phone"
                            defaultValue={address.phone}
                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingAddressId(null)}
                          className="px-3 py-1 text-[10px] text-gray-700 hover:text-gray-900 font-medium transition-colors"
                        >
                          Anuluj
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-[10px] font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                        >
                          {saving ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                          Zapisz
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xs font-semibold text-gray-900">{address.name}</h3>
                          {address.full_name && (
                            <p className="text-[10px] text-gray-600 mt-0.5">{address.full_name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!address.is_default && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              disabled={saving}
                              className="text-[10px] text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50"
                            >
                              Ustaw jako domyślny
                            </button>
                          )}
                          <button
                            onClick={() => setEditingAddressId(address.id)}
                            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          {shippingAddresses.length > 1 && (
                            <button
                              onClick={() => setDeleteModalAddress(address)}
                              disabled={saving}
                              className="p-1 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-600 mb-0.5">Adres</p>
                          <p className="text-xs font-medium text-gray-900">
                            {address.street} {address.building}{address.apartment && `/${address.apartment}`}
                            <br />
                            {address.postal_code} {address.city}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-600 mb-0.5">Telefon</p>
                          <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-500" />
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {shippingAddresses.length === 0 && !addingNewAddress && (
                <div className="text-center py-6 text-gray-500">
                  <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs">Nie masz jeszcze żadnych adresów wysyłki</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INFO BOX */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <div className="flex gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-[10px] text-blue-900">
              <p className="font-semibold mb-0.5">Informacja</p>
              <p>Dane firmy są wykorzystywane do wystawiania faktur VAT. Adresy wysyłki możesz wybierać podczas składania zamówienia. Domyślny adres będzie automatycznie wybierany przy nowych zamówieniach.</p>
            </div>
          </div>
        </div>

      </div>

      {/* DELETE ADDRESS MODAL */}
      {deleteModalAddress && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-4 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Usuń adres?</h3>
            </div>

            <p className="text-xs text-gray-600 mb-4">
              Czy na pewno chcesz usunąć adres <span className="font-semibold text-gray-900">{deleteModalAddress.name}</span>?
              <br />
              <span className="text-[10px] text-red-600 font-medium">Ta operacja jest nieodwracalna.</span>
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteModalAddress(null)}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={() => deleteShippingAddress(deleteModalAddress.id)}
                disabled={isDeleting}
                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Usuwanie...
                  </>
                ) : (
                  'Usuń'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}