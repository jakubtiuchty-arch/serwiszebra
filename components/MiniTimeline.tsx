'use client'

import { motion } from 'framer-motion'
import {
  Package,
  CheckCircle,
  Search,
  FileText,
  Wrench,
  Truck,
  PartyPopper,
  X
} from 'lucide-react'

interface MiniTimelineProps {
  currentStatus: string
  repairType?: 'paid' | 'warranty' | 'warranty_rejected'
}

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  nowe: { label: 'Zgłoszone', icon: Package, color: '#3B82F6' },
  odebrane: { label: 'Odebrane', icon: CheckCircle, color: '#8B5CF6' },
  diagnoza: { label: 'Diagnostyka', icon: Search, color: '#6366F1' },
  wycena: { label: 'Wycena', icon: FileText, color: '#0EA5E9' },
  proforma: { label: 'Pro Forma', icon: FileText, color: '#F97316' },
  w_naprawie: { label: 'Naprawa', icon: Wrench, color: '#8B5CF6' },
  zakonczone: { label: 'Zakończone', icon: PartyPopper, color: '#10B981' },
  wyslane: { label: 'Wysłane', icon: Truck, color: '#059669' },
  weryfikacja_gwarancji: { label: 'Weryfikacja', icon: Search, color: '#06B6D4' },
  gwarancja_potwierdzona: { label: 'Potwierdzona', icon: CheckCircle, color: '#10B981' },
  gwarancja_odrzucona: { label: 'Odrzucona', icon: X, color: '#EF4444' },
  anulowane: { label: 'Anulowane', icon: X, color: '#6B7280' }
}

const PAID_STATUS_ORDER = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'w_naprawie', 'zakonczone', 'wyslane']
const WARRANTY_STATUS_ORDER = ['nowe', 'odebrane', 'weryfikacja_gwarancji', 'gwarancja_potwierdzona', 'w_naprawie', 'zakonczone', 'wyslane']

export default function MiniTimeline({ currentStatus, repairType = 'paid' }: MiniTimelineProps) {
  const statusOrder = repairType === 'warranty' ? WARRANTY_STATUS_ORDER : PAID_STATUS_ORDER
  const currentIndex = statusOrder.indexOf(currentStatus)
  const progressPercentage = currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0
  
  const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.nowe
  const CurrentIcon = currentConfig.icon

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 px-3 py-2 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Current status icon & label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${currentConfig.color}15` }}
          >
            <CurrentIcon 
              className="w-4 h-4" 
              style={{ color: currentConfig.color }}
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs text-gray-500">Status</p>
            <p 
              className="text-sm font-semibold"
              style={{ color: currentConfig.color }}
            >
              {currentConfig.label}
            </p>
          </div>
        </div>

        {/* Progress bar with dots */}
        <div className="flex-1 flex items-center gap-1">
          {statusOrder.map((status, index) => {
            const isActive = index <= currentIndex
            const isCurrent = index === currentIndex
            const config = STATUS_CONFIG[status]
            
            return (
              <div key={status} className="flex-1 flex items-center">
                {/* Dot */}
                <div className="relative group">
                  <motion.div
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isCurrent ? 'ring-2 ring-offset-1' : ''
                    }`}
                    style={{ 
                      backgroundColor: isActive ? config.color : '#E5E7EB',
                      ringColor: isCurrent ? config.color : undefined
                    }}
                    initial={false}
                    animate={isCurrent ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {config.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
                
                {/* Line between dots */}
                {index < statusOrder.length - 1 && (
                  <div className="flex-1 h-0.5 mx-0.5">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        backgroundColor: index < currentIndex ? STATUS_CONFIG[statusOrder[index + 1]].color : '#E5E7EB'
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Percentage */}
        <div className="flex-shrink-0 text-right">
          <p className="text-lg font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
        </div>
      </div>
    </div>
  )
}

