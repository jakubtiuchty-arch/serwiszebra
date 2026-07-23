'use client'

import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import {
  PackageOpen,
  Plus,
  Search,
  CheckCircle2,
  Undo2,
  Trash2,
  X,
  Phone,
  Mail,
  AlertTriangle,
  Printer,
  Paperclip,
  FileCheck2,
} from 'lucide-react'

interface Rental {
  id: string
  rental_number: string
  customer_name: string
  company: string | null
  email: string | null
  phone: string | null
  device_model: string
  serial_number: string
  repair_number: string | null
  rented_at: string
  return_requested_at: string | null
  last_reminder_at: string | null
  returned_at: string | null
  status: 'active' | 'return_requested' | 'returned'
  notes: string | null
  signed_document_path: string | null
}

const RETURN_AFTER_DAYS = 14

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
}

function dueDate(rentedAt: string): Date {
  const d = new Date(rentedAt)
  d.setDate(d.getDate() + RETURN_AFTER_DAYS)
  return d
}

function statusBadge(rental: Rental) {
  if (rental.status === 'returned') {
    return <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">Zwrócone</span>
  }
  if (rental.status === 'return_requested') {
    return <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">Wezwano do zwrotu</span>
  }
  if (daysSince(rental.rented_at) >= RETURN_AFTER_DAYS) {
    return <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-800">Po terminie</span>
  }
  return <span className="px-2 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">Wypożyczone</span>
}

const emptyForm = {
  customerName: '',
  company: '',
  email: '',
  phone: '',
  deviceModel: '',
  serialNumber: '',
  rentedAt: '',
  notes: '',
}

export default function WypozyczeniaPage() {
  const [rentals, setRentals] = useState<Rental[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('open')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [serialUnreadable, setSerialUnreadable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ type: 'return' | 'delete'; rental: Rental } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const fetchRentals = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/rentals')
      const data = await res.json()
      if (res.ok) setRentals(data.rentals || [])
    } catch (err) {
      console.error('Error fetching rentals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRentals()
  }, [fetchRentals])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError(null)
    try {
      const res = await fetch('/api/admin/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rentedAt: form.rentedAt ? new Date(form.rentedAt).toISOString() : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Błąd zapisu')
      setShowAddModal(false)
      setForm(emptyForm)
      setSerialUnreadable(false)
      fetchRentals()
      // Otwórz protokół wypożyczenia do wydruku (2 egz. do przesyłki)
      if (data.rental?.id) {
        window.open(`/api/admin/rentals/${data.rental.id}/print`, '_blank')
      }
    } catch (err: any) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleAction = async (id: string, action: 'return' | 'reopen') => {
    try {
      const res = await fetch(`/api/admin/rentals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) fetchRentals()
    } catch (err) {
      console.error('Error updating rental:', err)
    }
  }

  const handleUploadDocument = async (rentalId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch(`/api/admin/rentals/${rentalId}/document`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Błąd uploadu')
        return
      }
      fetchRentals()
    } catch (err) {
      console.error('Error uploading document:', err)
      alert('Błąd uploadu pliku')
    }
  }

  const handleDelete = async (rental: Rental) => {
    try {
      const res = await fetch(`/api/admin/rentals/${rental.id}`, { method: 'DELETE' })
      if (res.ok) fetchRentals()
    } catch (err) {
      console.error('Error deleting rental:', err)
    }
  }

  const filtered = rentals.filter((r) => {
    if (statusFilter === 'open' && r.status === 'returned') return false
    if (statusFilter === 'returned' && r.status !== 'returned') return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      const fields = [r.rental_number, r.customer_name, r.company, r.email, r.phone, r.device_model, r.serial_number, r.repair_number]
      if (!fields.some((f) => f && f.toLowerCase().includes(q))) return false
    }
    return true
  })

  const openCount = rentals.filter((r) => r.status !== 'returned').length
  const overdueCount = rentals.filter((r) => r.status !== 'returned' && daysSince(r.rented_at) >= RETURN_AFTER_DAYS).length

  return (
    <div className="p-3 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-blue-600" />
            Wypożyczenia
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Aktywne: <strong>{openCount}</strong>
            {overdueCount > 0 && (
              <span className="text-red-600 ml-2 inline-flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> po terminie: <strong>{overdueCount}</strong>
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nowe wypożyczenie
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'open', label: 'Aktywne' },
            { key: 'returned', label: 'Zwrócone' },
            { key: 'all', label: 'Wszystkie' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                statusFilter === f.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj: klient, sprzęt, S/N, nr..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Ładowanie...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            {rentals.length === 0 ? 'Brak wypożyczeń. Dodaj pierwsze przyciskiem powyżej.' : 'Brak wyników dla wybranych filtrów.'}
          </div>
        ) : (
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 text-left text-[11px] uppercase tracking-wide text-gray-500">
                <th className="px-4 py-3">Nr / Data</th>
                <th className="px-4 py-3">Klient</th>
                <th className="px-4 py-3">Sprzęt</th>
                <th className="px-4 py-3">Nr seryjny</th>
                <th className="px-4 py-3">Termin zwrotu</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rental) => {
                const due = dueDate(rental.rented_at)
                const overdue = rental.status !== 'returned' && due.getTime() < Date.now()
                return (
                  <tr key={rental.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900 font-mono text-xs">{rental.rental_number}</div>
                      <div className="text-xs text-gray-500">{format(new Date(rental.rented_at), 'dd.MM.yyyy', { locale: pl })}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{rental.customer_name}</div>
                      {rental.company && <div className="text-xs text-gray-500">{rental.company}</div>}
                      <div className="flex gap-2 mt-0.5">
                        {rental.phone && (
                          <a href={`tel:${rental.phone}`} className="text-[11px] text-blue-600 inline-flex items-center gap-0.5">
                            <Phone className="w-3 h-3" />{rental.phone}
                          </a>
                        )}
                        {rental.email && (
                          <a href={`mailto:${rental.email}`} className="text-[11px] text-blue-600 inline-flex items-center gap-0.5">
                            <Mail className="w-3 h-3" />{rental.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{rental.device_model}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{rental.serial_number}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
                        {format(due, 'dd.MM.yyyy', { locale: pl })}
                      </span>
                      {rental.status !== 'returned' && (
                        <div className="text-[10px] text-gray-400">{daysSince(rental.rented_at)} dni temu</div>
                      )}
                      {rental.returned_at && (
                        <div className="text-[10px] text-green-600">
                          zwrócono {format(new Date(rental.returned_at), 'dd.MM.yyyy', { locale: pl })}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{statusBadge(rental)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/api/admin/rentals/${rental.id}/print`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Drukuj protokół wypożyczenia"
                          className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Printer className="w-4 h-4" />
                        </a>
                        {rental.signed_document_path && (
                          <a
                            href={`/api/admin/rentals/${rental.id}/document`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Zobacz podpisany protokół"
                            className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
                          >
                            <FileCheck2 className="w-4 h-4" />
                          </a>
                        )}
                        <label
                          title={rental.signed_document_path ? 'Podmień podpisany protokół' : 'Załącz podpisany protokół (PDF/skan)'}
                          className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-4 h-4" />
                          <input
                            type="file"
                            accept=".pdf,image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleUploadDocument(rental.id, file)
                              e.target.value = ''
                            }}
                          />
                        </label>
                        {rental.status !== 'returned' ? (
                          <button
                            onClick={() => setConfirmModal({ type: 'return', rental })}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Zwrócono
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(rental.id, 'reopen')}
                            title="Cofnij odznaczenie zwrotu"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            Cofnij
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmModal({ type: 'delete', rental })}
                          title="Usuń wypożyczenie"
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal potwierdzenia (odbiór / usunięcie) */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                confirmModal.type === 'return' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {confirmModal.type === 'return' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Trash2 className="w-5 h-5 text-red-600" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {confirmModal.type === 'return' ? 'Potwierdź zwrot sprzętu' : 'Usunąć wypożyczenie?'}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-semibold text-gray-900">{confirmModal.rental.device_model}</p>
              <p className="text-gray-600 text-xs mt-0.5">
                S/N: <span className="font-mono">{confirmModal.rental.serial_number}</span> · {confirmModal.rental.customer_name}
                {confirmModal.rental.company ? ` (${confirmModal.rental.company})` : ''}
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {confirmModal.type === 'return'
                ? 'Wypożyczenie zostanie oznaczone jako zwrócone.'
                : 'Tej operacji nie można cofnąć.'}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={confirmLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={async () => {
                  setConfirmLoading(true)
                  if (confirmModal.type === 'return') {
                    await handleAction(confirmModal.rental.id, 'return')
                  } else {
                    await handleDelete(confirmModal.rental)
                  }
                  setConfirmLoading(false)
                  setConfirmModal(null)
                }}
                disabled={confirmLoading}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                  confirmModal.type === 'return' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirmLoading
                  ? 'Chwila...'
                  : confirmModal.type === 'return' ? 'Tak, zwrócono' : 'Tak, usuń'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: nowe wypożyczenie */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-xl my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Nowe wypożyczenie</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{formError}</div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Klient (imię i nazwisko) *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Firma</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(na niego pójdzie prośba o zwrot)</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sprzęt (model) *</label>
                  <input
                    type="text"
                    required
                    placeholder="np. ZD421t, TC52"
                    value={form.deviceModel}
                    onChange={(e) => setForm({ ...form, deviceModel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Numer seryjny *</label>
                  <input
                    type="text"
                    required
                    disabled={serialUnreadable}
                    value={form.serialNumber}
                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <label className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={serialUnreadable}
                      onChange={(e) => {
                        setSerialUnreadable(e.target.checked)
                        setForm({ ...form, serialNumber: e.target.checked ? 'NIECZYTELNY' : '' })
                      }}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600"
                    />
                    Nieczytelny
                  </label>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Data wypożyczenia</label>
                  <input
                    type="date"
                    value={form.rentedAt}
                    onChange={(e) => setForm({ ...form, rentedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-[10px] text-gray-400 mt-0.5">Puste = dzisiaj</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notatki</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="np. wypożyczono z zasilaczem i baterią zapasową"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Zapisywanie...' : 'Dodaj wypożyczenie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
