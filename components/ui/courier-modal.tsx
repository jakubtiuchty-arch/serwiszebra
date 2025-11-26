'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CheckCircle2, XCircle, Truck } from 'lucide-react'

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
}

export function CourierModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  details
}: CourierModalProps) {
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
              {details.waybillLink && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => window.open(details.waybillLink, '_blank')}
                    className="w-full px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-2"
                  >
                    <Truck className="h-4 w-4" />
                    Pobierz etykietę (PDF)
                  </button>
                </div>
              )}
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