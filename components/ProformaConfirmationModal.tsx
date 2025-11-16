'use client'

import { useState } from 'react'
import { 
  CheckCircle2, 
  Download, 
  X, 
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react'

interface ProformaConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceData: {
    invoiceNumber: string
    totalBrutto: number
    paymentDue: string
    pdfBlob?: Blob
  }
}

export default function ProformaConfirmationModal({
  isOpen,
  onClose,
  invoiceData
}: ProformaConfirmationModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  const handleDownloadAgain = () => {
    if (!invoiceData.pdfBlob) return
    
    setIsDownloading(true)
    
    const url = window.URL.createObjectURL(invoiceData.pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `faktura-proforma-${invoiceData.invoiceNumber.replace(/\//g, '-')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    setTimeout(() => setIsDownloading(false), 1000)
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="relative p-6 pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75" />
                <div className="relative bg-green-100 rounded-full p-4">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Faktura została wygenerowana!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Plik PDF został pobrany na Twoje urządzenie
            </p>

            {/* Invoice Details */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
              {/* Invoice Number */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 font-medium">Numer faktury</div>
                  <div className="text-sm font-bold text-gray-900 font-mono">
                    {invoiceData.invoiceNumber}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                <div className="p-2 bg-white rounded-lg">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 font-medium">Kwota do zapłaty</div>
                  <div className="text-2xl font-black text-green-600">
                    {invoiceData.totalBrutto.toFixed(2)} zł
                  </div>
                </div>
              </div>

              {/* Payment Due */}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-600 font-medium">Termin płatności</div>
                  <div className="text-sm font-bold text-orange-600">
                    {invoiceData.paymentDue}
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 leading-relaxed">
                <strong>Kolejne kroki:</strong> Po zaksięgowaniu płatności na naszym koncie, 
                skontaktujemy się z Tobą w celu potwierdzenia i wysyłki zamówienia.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Download Again Button */}
              {invoiceData.pdfBlob && (
                <button
                  onClick={handleDownloadAgain}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                  {isDownloading ? 'Pobieranie...' : 'Pobierz ponownie'}
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}