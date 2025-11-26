'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  Package,
  CheckCircle,
  Search,
  FileText,
  Wrench,
  PartyPopper,
  Truck,
  Sparkles,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface JourneyMapTimelineProps {
  currentStatus: string
  statusHistory: Array<{
    old_status: string | null
    new_status: string
    changed_at: string
  }>
}

const STATUS_CONFIG = {
  nowe: { 
    label: 'Zgłoszone', 
    shortLabel: 'Zgłoszone',
    icon: Package, 
    color: '#3B82F6',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-600'
  },
  odebrane: { 
    label: 'Odebrane', 
    shortLabel: 'Odebrane',
    icon: CheckCircle, 
    color: '#8B5CF6',
    bgColor: 'bg-violet-100',
    textColor: 'text-violet-600'
  },
  diagnoza: { 
    label: 'Diagnostyka', 
    shortLabel: 'Diagnostyka',
    icon: Search, 
    color: '#6366F1',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-600'
  },
  wycena: { 
    label: 'Wycena', 
    shortLabel: 'Wycena',
    icon: FileText, 
    color: '#0EA5E9',
    bgColor: 'bg-sky-100',
    textColor: 'text-sky-600'
  },
  w_naprawie: { 
    label: 'Naprawa', 
    shortLabel: 'Naprawa',
    icon: Wrench, 
    color: '#8B5CF6',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600'
  },
  zakonczone: { 
    label: 'Zakończone', 
    shortLabel: 'Zakończone',
    icon: PartyPopper, 
    color: '#10B981',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-600'
  },
  wyslane: { 
    label: 'Wysłane', 
    shortLabel: 'Wysłane',
    icon: Truck, 
    color: '#059669',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600'
  }
}

const STATUS_ORDER = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'w_naprawie', 'zakonczone', 'wyslane']

export default function JourneyMapTimeline({ currentStatus, statusHistory }: JourneyMapTimelineProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  const progressPercentage = ((currentIndex + 1) / STATUS_ORDER.length) * 100

  // Build timeline steps
  const timelineSteps = STATUS_ORDER.map((status, index) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    const historyItem = statusHistory.find(h => h.new_status === status)
    
    return {
      status,
      label: config.label,
      shortLabel: config.shortLabel,
      icon: config.icon,
      color: config.color,
      bgColor: config.bgColor,
      textColor: config.textColor,
      date: historyItem?.changed_at,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex
    }
  })

  // Show celebration modal when completed
  useEffect(() => {
    if (currentStatus === 'zakonczone' && !showCelebration) {
      setTimeout(() => setShowCelebration(true), 500)
    }
  }, [currentStatus])

  return (
    <div className="relative">
      {/* Timeline Container - z nagłówkiem w środku */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-2 shadow-sm">
        {/* Straight Path - Simple Line - TYLKO DESKTOP */}
        <svg 
          className="hidden sm:block absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 pointer-events-none"
          viewBox="0 0 1000 10"
          preserveAspectRatio="none"
        >
          {/* Background path (gray) */}
          <line
            x1="0"
            y1="5"
            x2="1000"
            y2="5"
            stroke="#E5E7EB"
            strokeWidth="3"
          />
          
          {/* Progress path (gradient) */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="5"
            x2={`${progressPercentage * 10}`}
            y2="5"
            stroke="url(#progressGradient)"
            strokeWidth="3"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Status Bubbles - TYLKO DESKTOP */}
        <div className="hidden sm:flex relative items-center justify-between py-2 px-4">
          {timelineSteps.map((step, index) => {
            const Icon = step.icon
            const position = (index / (STATUS_ORDER.length - 1)) * 100
            const isLastStep = index === STATUS_ORDER.length - 1

            return (
              <motion.div
                key={step.status}
                className="flex flex-col items-center relative z-10"
                style={{ width: `${100 / STATUS_ORDER.length}%` }}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
                whileHover={{ scale: 1.1 }}
              >
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {hoveredStep === index && step.date && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-xl whitespace-nowrap z-30 shadow-xl"
                    >
                      {format(new Date(step.date), "d MMM yyyy, HH:mm", { locale: pl })}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                        <div className="border-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bubble with 3D flip effect */}
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ rotateY: 180 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front face */}
                  <div 
                    className={`
                      w-14 h-14 rounded-full
                      flex items-center justify-center
                      border-2 transition-all duration-300
                      ${step.isActive 
                        ? `${step.bgColor} border-transparent shadow-lg` 
                        : 'bg-gray-100 border-gray-300'
                      }
                      ${step.isCurrent ? 'ring-3 ring-offset-1' : ''}
                    `}
                    style={{
  '--tw-ring-color': step.isCurrent ? step.color : undefined,
  backfaceVisibility: 'hidden'
} as React.CSSProperties}
                  >
                    {/* Pulsing glow for current */}
                    {step.isCurrent && (
                      <>
                        <span 
                          className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                          style={{ backgroundColor: step.color }}
                        />
                        <span 
                          className="absolute inline-flex h-full w-full rounded-full opacity-50"
                          style={{ backgroundColor: step.color }}
                        />
                      </>
                    )}
                    
                    <Icon 
                      className={`w-6 h-6 relative z-10 ${
                        step.isActive ? step.textColor : 'text-gray-400'
                      } ${step.isCurrent ? 'animate-pulse' : ''}`}
                    />
                  </div>

                  {/* Back face - shows checkmark for completed */}
                  {step.isActive && !step.isCurrent && (
                    <div 
                      className="absolute inset-0 w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: step.color
                      }}
                    >
                      <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* Label */}
                <p 
                  className={`
                    text-xs mt-2 font-medium text-center max-w-[80px]
                    transition-colors duration-200
                    ${step.isCurrent 
                      ? step.textColor + ' font-bold' 
                      : step.isActive 
                      ? 'text-gray-700' 
                      : 'text-gray-400'
                    }
                  `}
                >
                  {step.shortLabel}
                </p>

                {/* Current indicator */}
                {step.isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 mt-1"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: step.color }}
                    />
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: step.color }}>
                      Teraz
                    </span>
                  </motion.div>
                )}


              </motion.div>
            )
          })}
        </div>

        {/* MOBILE - Tylko aktualny status */}
        <div className="sm:hidden py-2">
          {timelineSteps.map((step) => {
            if (!step.isCurrent) return null
            const Icon = step.icon
            
            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                {/* Ikona - MNIEJSZA */}
                <div 
                  className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-1.5 ${step.bgColor}`}
                  style={{
                    boxShadow: `0 0 0 2px ${step.color}20`
                  }}
                >
                  <Icon 
                    className="w-6 h-6"
                    style={{ color: step.color }}
                  />
                </div>

                {/* Status label - MNIEJSZY */}
                <p 
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ color: step.color }}
                >
                  {step.label}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Progress Bar below */}
        <div className="mt-2 sm:mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] sm:text-xs text-gray-500">Postęp</span>
            <span className="text-xs sm:text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
              onClick={() => setShowCelebration(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90%] max-w-md"
            >
              <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 opacity-50"></div>
                
                {/* Close button */}
                <button
                  onClick={() => setShowCelebration(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon with animation */}
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.6, repeat: 3 }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center"
                  >
                    <PartyPopper className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Text */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    🎉 Naprawa zakończona!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Twoje urządzenie jest gotowe i zostanie wkrótce wysłane.
                  </p>

                  {/* Button */}
                  <button
                    onClick={() => setShowCelebration(false)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Super! Zamknij
                  </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}