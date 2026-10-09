'use client'

import { Phone } from 'lucide-react'
import { trackPhoneClick } from '@/lib/analytics'
import DeviceEnquiryModal from './DeviceEnquiryModal'

const TELEFON = '+48601619898'

/**
 * „Zapytaj o produkt" pod ramką zakupu — ten sam układ co na kartach drukarek
 * (DevicePurchasePanel): modal z pytaniem, a na telefonie dodatkowo przycisk
 * „Zadzwoń", bo na desktopie `tel:` przeważnie nic nie robi.
 */
export default function ZapytajOProdukt({
  productName,
  pn,
  priceNetto,
  miejsce,
}: {
  productName: string
  pn: string
  priceNetto: number
  /** Etykieta źródła kliknięcia w telefon w analityce */
  miejsce: string
}) {
  return (
    <div className="mt-3 space-y-2">
      <DeviceEnquiryModal productName={productName} variantPn={pn} priceNetto={priceNetto} />
      <a
        href={`tel:${TELEFON}`}
        onClick={() => trackPhoneClick(miejsce)}
        className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 sm:hidden"
      >
        <Phone className="h-4 w-4" />
        Zadzwoń: 601 619 898
      </a>
    </div>
  )
}
