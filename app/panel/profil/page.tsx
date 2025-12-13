'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Building2, MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface ProfileData {
  first_name: string
  last_name: string
  phone: string
  email: string
  company_name: string
  nip: string
  street: string
  city: string
  postal_code: string
}

export default function ProfilPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    company_name: '',
    nip: '',
    street: '',
    city: '',
    postal_code: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Musisz być zalogowany')
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (profile) {
        setFormData({
          first_name: profile.first_name || '',
          last_name: profile.last_name || '',
          phone: profile.phone || '',
          email: profile.email || user.email || '',
          company_name: profile.company_name || '',
          nip: profile.nip || '',
          street: profile.street || '',
          city: profile.city || '',
          postal_code: profile.postal_code || '',
        })
      }
    } catch (error) {
      console.error('Błąd ładowania profilu:', error)
      toast.error('Nie udało się załadować danych profilu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Musisz być zalogowany')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          company_name: formData.company_name,
          nip: formData.nip,
          street: formData.street,
          city: formData.city,
          postal_code: formData.postal_code,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profil został zaktualizowany')
    } catch (error) {
      console.error('Błąd zapisu profilu:', error)
      toast.error('Nie udało się zapisać zmian')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Ładowanie profilu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="ml-10 lg:ml-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Mój profil</h1>
        <p className="text-xs text-gray-500">
          Zarządzaj swoimi danymi osobowymi i firmowymi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Dane osobowe */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">Dane osobowe</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Imię *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Jan"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Nazwisko *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Kowalski"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Telefon *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+48 123 456 789"
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">
                Email nie może być zmieniony
              </p>
            </div>
          </div>
        </div>

        {/* Dane firmy */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Dane firmy</h2>
              <p className="text-[10px] text-gray-600">(opcjonalnie)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Nazwa firmy
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Przykładowa Firma Sp. z o.o."
              />
            </div>

            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                NIP
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234567890"
                maxLength={10}
              />
            </div>
          </div>
        </div>

        {/* Adres dostawy */}
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Adres dostawy</h2>
              <p className="text-[10px] text-gray-600">(opcjonalnie)</p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                Ulica i numer
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ul. Przykładowa 123/45"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                  Kod pocztowy
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="00-000"
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium text-gray-700 mb-0.5">
                  Miasto
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Wrocław"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Przyciski */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Zapisz zmiany
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}