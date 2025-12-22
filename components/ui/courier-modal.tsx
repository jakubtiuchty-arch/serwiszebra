'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Truck, Printer, Loader2, Download } from 'lucide-react'
import { 
  checkZebraBrowserPrint, 
  getDefaultZebraPrinter, 
  printZPL, 
  generateShippingLabelZPL,
  printZPLviaDialog 
} from '@/lib/zebra-print'

interface CourierModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error'
  title: string
  message: string
  details?: {
    direction?: string
    trackingNumber?: string
    courierName?: string
    waybillLink?: string
  }
  // Dane do etykiety (opcjonalne - jeśli chcemy drukować)
  labelData?: {
    recipientName: string
    recipientStreet: string
    recipientCity: string
    recipientPostal: string
    recipientPhone: string
    packageContent?: string
    repairNumber?: string
  }
}

export function CourierModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  details,
  labelData
}: CourierModalProps) {
  const [printing, setPrinting] = useState(false)
  const [printStatus, setPrintStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [printMessage, setPrintMessage] = useState('')

  const handlePrintZebra = async () => {
    if (!details?.trackingNumber || !details?.courierName || !labelData) {
      setPrintStatus('error')
      setPrintMessage('Brak danych do wydruku etykiety')
      return
    }

    setPrinting(true)
    setPrintStatus('idle')
    setPrintMessage('')

    try {
      // Sprawdź czy Zebra Browser Print jest dostępny
      const isAvailable = await checkZebraBrowserPrint()
      
      if (!isAvailable) {
        // Fallback - pobierz plik ZPL
        const zpl = generateShippingLabelZPL({
          trackingNumber: details.trackingNumber,
          courierName: details.courierName,
          senderName: 'TAKMA TADEUSZ TIUCHTY',
          senderStreet: 'ul. Poświęcka 1a',
          senderCity: 'Wrocław',
          senderPostal: '51-128',
          senderPhone: '726151515',
          recipientName: labelData.recipientName,
          recipientStreet: labelData.recipientStreet,
          recipientCity: labelData.recipientCity,
          recipientPostal: labelData.recipientPostal,
          recipientPhone: labelData.recipientPhone,
          packageContent: labelData.packageContent,
          repairNumber: labelData.repairNumber
        })
        
        printZPLviaDialog(zpl, `etykieta_${details.trackingNumber}.zpl`)
        setPrintStatus('success')
        setPrintMessage('Plik ZPL pobrany. Wyślij go do drukarki Zebra.')
        return
      }

      // Pobierz domyślną drukarkę
      const printer = await getDefaultZebraPrinter()
      
      if (!printer) {
        setPrintStatus('error')
        setPrintMessage('Nie znaleziono drukarki Zebra. Sprawdź połączenie.')
        return
      }

      // Generuj etykietę ZPL
      const zpl = generateShippingLabelZPL({
        trackingNumber: details.trackingNumber,
        courierName: details.courierName,
        senderName: 'TAKMA TADEUSZ TIUCHTY',
        senderStreet: 'ul. Poświęcka 1a',
        senderCity: 'Wrocław',
        senderPostal: '51-128',
        senderPhone: '726151515',
        recipientName: labelData.recipientName,
        recipientStreet: labelData.recipientStreet,
        recipientCity: labelData.recipientCity,
        recipientPostal: labelData.recipientPostal,
        recipientPhone: labelData.recipientPhone,
        packageContent: labelData.packageContent,
        repairNumber: labelData.repairNumber
      })

      // Wydrukuj
      const success = await printZPL(printer.uid, zpl)
      
      if (success) {
        setPrintStatus('success')
        setPrintMessage(`Wydrukowano na: ${printer.name}`)
      } else {
        setPrintStatus('error')
        setPrintMessage('Błąd drukowania. Spróbuj ponownie.')
      }
    } catch (error) {
      console.error('Print error:', error)
      setPrintStatus('error')
      setPrintMessage('Wystąpił błąd podczas drukowania')
    } finally {
      setPrinting(false)
    }
  }

  const handleDownloadZPL = () => {
    if (!details?.trackingNumber || !details?.courierName || !labelData) {
      return
    }

    const zpl = generateShippingLabelZPL({
      trackingNumber: details.trackingNumber,
      courierName: details.courierName,
      senderName: 'TAKMA TADEUSZ TIUCHTY',
      senderStreet: 'ul. Poświęcka 1a',
      senderCity: 'Wrocław',
      senderPostal: '51-128',
      senderPhone: '726151515',
      recipientName: labelData.recipientName,
      recipientStreet: labelData.recipientStreet,
      recipientCity: labelData.recipientCity,
      recipientPostal: labelData.recipientPostal,
      recipientPhone: labelData.recipientPhone,
      packageContent: labelData.packageContent,
      repairNumber: labelData.repairNumber
    })
    
    printZPLviaDialog(zpl, `etykieta_${details.trackingNumber}.zpl`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {type === 'success' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            )}
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">{message}</p>
          
          {details && type === 'success' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
              {details.direction && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kierunek:</span>
                  <span className="font-medium">{details.direction}</span>
                </div>
              )}
              {details.courierName && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Kurier:</span>
                  <span className="font-medium">{details.courierName}</span>
                </div>
              )}
              {details.trackingNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tracking:</span>
                  <span className="font-mono font-medium">{details.trackingNumber}</span>
                </div>
              )}
              
              {/* Przyciski etykiet */}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
                {/* Pobierz PDF z BL Paczka */}
                {details.waybillLink && (
                  <button
                    onClick={() => window.open(details.waybillLink, '_blank')}
                    className="w-full px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    Pobierz etykietę kuriera (PDF)
                  </button>
                )}
                
                {/* Drukuj na Zebra */}
                {labelData && (
                  <>
                    <button
                      onClick={handlePrintZebra}
                      disabled={printing}
                      className="w-full px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {printing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Printer className="h-4 w-4" />
                      )}
                      {printing ? 'Drukowanie...' : 'Drukuj etykietę na Zebra'}
                    </button>
                    
                    <button
                      onClick={handleDownloadZPL}
                      className="w-full px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Pobierz plik ZPL
                    </button>
                  </>
                )}
                
                {/* Status drukowania */}
                {printStatus !== 'idle' && (
                  <div className={`text-xs text-center py-1 rounded ${
                    printStatus === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                  }`}>
                    {printMessage}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium text-white ${
              type === 'success' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            OK
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}