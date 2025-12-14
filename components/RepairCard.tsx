import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { pl } from 'date-fns/locale'
import { Package, Calendar } from 'lucide-react'

interface RepairCardProps {
  repair: {
    id: string
    device_model: string
    serial_number: string | null
    issue_description: string
    status: 'nowe' | 'odebrane' | 'diagnoza' | 'wycena' | 'proforma' | 'w_naprawie' | 'zakonczone' | 'wyslane' | 'anulowane'
    created_at: string
    urgency: 'standard' | 'express' | 'niska' | 'srednia' | 'wysoka' | 'krytyczna' | null
  }
}

const STATUS_CONFIG = {
  nowe: { 
    label: 'Nowe', 
    sublabel: '',
    progress: 14,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    barColor: 'bg-blue-500'
  },
  odebrane: { 
    label: 'Odebrane', 
    sublabel: '',
    progress: 28,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    dotColor: 'bg-purple-500',
    barColor: 'bg-purple-500'
  },
  diagnoza: { 
    label: 'Diagnostyka', 
    sublabel: '',
    progress: 42,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    dotColor: 'bg-orange-500',
    barColor: 'bg-orange-500'
  },
  wycena: { 
    label: 'Wycena', 
    sublabel: 'DO AKCEPTACJI',
    progress: 57,
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    barColor: 'bg-yellow-500'
  },
  proforma: { 
    label: 'Pro Forma', 
    sublabel: 'OCZEKUJE NA PRZELEW',
    progress: 60,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    dotColor: 'bg-orange-500',
    barColor: 'bg-orange-500'
  },
  w_naprawie: { 
    label: 'Naprawa', 
    sublabel: '',
    progress: 71,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    barColor: 'bg-indigo-500'
  },
  zakonczone: { 
    label: 'Zakończone', 
    sublabel: 'DO ODBIORU',
    progress: 85,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
    barColor: 'bg-green-500'
  },
  wyslane: { 
    label: 'Wysłane', 
    sublabel: '',
    progress: 100,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    dotColor: 'bg-green-600',
    barColor: 'bg-green-600'
  },
  anulowane: { 
    label: 'Anulowane', 
    sublabel: '',
    progress: 0,
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-600',
    dotColor: 'bg-gray-400',
    barColor: 'bg-gray-400'
  },
} as const

export default function RepairCard({ repair }: RepairCardProps) {
  const timeAgo = formatDistanceToNow(new Date(repair.created_at), {
    addSuffix: true,
    locale: pl,
  })

  const shortId = repair.id.substring(0, 8).toUpperCase()

  const shortSerialNumber = repair.serial_number 
    ? repair.serial_number.length > 12
      ? `${repair.serial_number.substring(0, 5)}...${repair.serial_number.substring(repair.serial_number.length - 3)}`
      : repair.serial_number
    : null

  const statusConfig = STATUS_CONFIG[repair.status]

  return (
    <Link href={`/panel/naprawa/${repair.id}`}>
      <div className="bg-white rounded-lg border-2 border-gray-200 p-3 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group">
        {/* Header: Model + ID */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {repair.device_model}
              </h3>
            </div>
            <p className="text-[10px] text-gray-500 font-medium">
              ID: #{shortId}
            </p>
          </div>
        </div>

        {/* Status Progress Box */}
        <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-2 mb-2`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
            <span className={`text-[10px] font-bold ${statusConfig.textColor} uppercase tracking-wide`}>
              {statusConfig.label} {statusConfig.sublabel && <span className="ml-1">{statusConfig.sublabel}</span>}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-600 font-medium">Postęp:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`${statusConfig.barColor} h-full rounded-full transition-all duration-500`}
                style={{ width: `${statusConfig.progress}%` }}
              />
            </div>
            <span className={`text-[10px] font-bold ${statusConfig.textColor}`}>
              {statusConfig.progress}%
            </span>
          </div>
        </div>

        {/* Date + S/N */}
        <div className="space-y-1 text-xs text-gray-600 mb-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[10px]">{timeAgo}</span>
          </div>
          {shortSerialNumber && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">S/N:</span>
              <span className="text-[10px] font-mono">{shortSerialNumber}</span>
            </div>
          )}
        </div>

        {/* CTA - Zobacz szczegóły jako przycisk */}
        <div className="pt-1.5 border-t border-gray-100">
          <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700 font-semibold text-xs py-0.5">
            <span>Zobacz szczegóły</span>
            <svg className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}