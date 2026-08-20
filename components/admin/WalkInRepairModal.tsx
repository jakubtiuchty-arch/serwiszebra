'use client'

import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'

const DEVICE_TYPES = [
  { value: 'drukarka', label: 'Drukarka' },
  { value: 'terminal', label: 'Terminal' },
  { value: 'skaner', label: 'Skaner' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'akcesoria', label: 'Akcesoria' },
  { value: 'inne', label: 'Inne' },
]

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  nip: '',
  street: '',
  zipCode: '',
  city: '',
  deviceType: 'drukarka',
  deviceModel: '',
  serialNumber: '',
  purchaseDate: '',
  isWarranty: 'nie_wiem',
  issueDescription: '',
  urgency: 'standard',
  notes: '',
}

interface WalkInRepairModalProps {
  onClose: () => void
  /** Wywoływane po zapisaniu — lista zgłoszeń ma się odświeżyć */
  onCreated: (repairId: string) => void
}

/**
 * Przyjęcie zgłoszenia w biurze. Klient stoi przy ladzie, więc formularz jest
 * jednym ekranem, a nie kreatorem jak wersja dla klienta — serwisant przepisuje
 * dane z dowodu i z naklejki urządzenia.
 */
export default function WalkInRepairModal({ onClose, onCreated }: WalkInRepairModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [serialUnreadable, setSerialUnreadable] = useState(false)
  const [consents, setConsents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const labelClass = 'block text-xs font-medium text-gray-700 mb-1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const res = await fetch('/api/admin/repairs/nowe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consentsTaken: consents }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Nie udało się zapisać zgłoszenia')

      const repairId: string = data.repair.id

      // Sprzęt już u nas — status „odebrane" przez istniejący endpoint, żeby
      // klient dostał potwierdzenie przyjęcia z PDF-em, a historia miała wpis.
      try {
        await fetch(`/api/admin/repairs/${repairId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'odebrane', notes: 'Urządzenie przyjęte w biurze' }),
        })
      } catch (statusError) {
        console.error('Nie udało się ustawić statusu „odebrane":', statusError)
      }

      onCreated(repairId)
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-xl my-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Przyjęcie w biurze</h3>
            <p className="text-xs text-gray-500">
              Zgłoszenie od razu dostanie status „Odebrane" — urządzenie jest już u nas.
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          {/* Klient */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Klient</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Imię *</label>
                <input required value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Nazwisko *</label>
                <input required value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefon *</label>
                <input required type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  E-mail <span className="text-gray-400">(bez niego brak potwierdzenia i wyceny online)</span>
                </label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Firma</label>
                <input value={form.company} onChange={(e) => set('company', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>NIP</label>
                <input value={form.nip} onChange={(e) => set('nip', e.target.value)} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Ulica i numer</label>
                <input value={form.street} onChange={(e) => set('street', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Kod pocztowy</label>
                <input placeholder="00-000" value={form.zipCode} onChange={(e) => set('zipCode', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Miasto</label>
                <input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Urządzenie */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Urządzenie</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Rodzaj *</label>
                <select value={form.deviceType} onChange={(e) => set('deviceType', e.target.value)} className={inputClass}>
                  {DEVICE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Model *</label>
                <input required placeholder="np. ZD421t, TC52" value={form.deviceModel} onChange={(e) => set('deviceModel', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Numer seryjny *</label>
                <input
                  required
                  disabled={serialUnreadable}
                  value={form.serialNumber}
                  onChange={(e) => set('serialNumber', e.target.value)}
                  className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-500`}
                />
                <label className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serialUnreadable}
                    onChange={(e) => {
                      setSerialUnreadable(e.target.checked)
                      set('serialNumber', e.target.checked ? 'NIECZYTELNY' : '')
                    }}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600"
                  />
                  Nieczytelny
                </label>
              </div>
              <div>
                <label className={labelClass}>Data zakupu</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => set('purchaseDate', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gwarancja</label>
                <select value={form.isWarranty} onChange={(e) => set('isWarranty', e.target.value)} className={inputClass}>
                  <option value="nie_wiem">Nie wiadomo</option>
                  <option value="tak">Na gwarancji</option>
                  <option value="nie">Po gwarancji</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Tryb</label>
                <select value={form.urgency} onChange={(e) => set('urgency', e.target.value)} className={inputClass}>
                  <option value="standard">Standardowy</option>
                  <option value="express">Ekspres</option>
                </select>
              </div>
            </div>
          </div>

          {/* Usterka */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Usterka</p>
            <textarea
              required
              rows={3}
              placeholder="Co zgłasza klient, co widać na urządzeniu, co jest w komplecie"
              value={form.issueDescription}
              onChange={(e) => set('issueDescription', e.target.value)}
              className={inputClass}
            />
            <label className={`${labelClass} mt-3`}>Notatka wewnętrzna</label>
            <textarea
              rows={2}
              placeholder="np. bez zasilacza, obudowa pęknięta przy przyjęciu"
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={consents}
              onChange={(e) => setConsents(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600"
            />
            <span>
              Klient zapoznał się z regulaminem serwisu i polityką prywatności, i wyraził zgodę na
              przetwarzanie danych. *
            </span>
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={saving || !consents}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Zapisuję...' : 'Przyjmij urządzenie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
