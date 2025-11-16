'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import confetti from 'canvas-confetti'
import {
  Package,
  CheckCircle,
  Search,
  FileText,
  Wrench,
  PartyPopper,
  Truck,
  Clock,
  Calendar,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react'
import { format, differenceInHours, differenceInDays, addDays } from 'date-fns'
import { pl } from 'date-fns/locale'

interface TimelineStep {
  status: string
  label: string
  icon: any
  color: string
  gradientFrom: string
  gradientTo: string
  bgColor: string
  date?: string
  isActive: boolean
  isCurrent: boolean
  description?: string
}

interface PremiumTimelineProps {
  currentStatus: string
  statusHistory: Array<{
    old_status: string | null
    new_status: string
    changed_at: string
  }>
  createdAt: string
}

const STATUS_CONFIG = {
  nowe: { 
    label: 'Zgłoszenie otrzymane', 
    icon: Package, 
    color: '#3B82F6',
    gradientFrom: '#3B82F6',
    gradientTo: '#60A5FA',
    bgColor: 'from-blue-500/10 to-blue-600/10',
    phase: 'initial',
    description: 'Otrzymaliśmy Twoje zgłoszenie'
  },
  odebrane: { 
    label: 'Kurier odebrał', 
    icon: CheckCircle, 
    color: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#A78BFA',
    bgColor: 'from-violet-500/10 to-violet-600/10',
    phase: 'transit',
    description: 'Urządzenie w drodze do serwisu'
  },
  diagnoza: { 
    label: 'Diagnostyka', 
    icon: Search, 
    color: '#6366F1',
    gradientFrom: '#6366F1',
    gradientTo: '#818CF8',
    bgColor: 'from-indigo-500/10 to-indigo-600/10',
    phase: 'service',
    description: 'Sprawdzamy usterkę'
  },
  wycena: { 
    label: 'Wycena gotowa', 
    icon: FileText, 
    color: '#0EA5E9',
    gradientFrom: '#0EA5E9',
    gradientTo: '#38BDF8',
    bgColor: 'from-sky-500/10 to-sky-600/10',
    phase: 'service',
    description: 'Czeka na akceptację'
  },
  w_naprawie: { 
    label: 'Naprawa', 
    icon: Wrench, 
    color: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#A78BFA',
    bgColor: 'from-purple-500/10 to-purple-600/10',
    phase: 'service',
    description: 'Naprawiamy urządzenie'
  },
  zakonczone: { 
    label: 'Naprawa zakończona', 
    icon: PartyPopper, 
    color: '#10B981',
    gradientFrom: '#10B981',
    gradientTo: '#34D399',
    bgColor: 'from-emerald-500/10 to-emerald-600/10',
    phase: 'complete',
    description: 'Gotowe do wysyłki!'
  },
  wyslane: { 
    label: 'W drodze do Ciebie', 
    icon: Truck, 
    color: '#059669',
    gradientFrom: '#059669',
    gradientTo: '#10B981',
    bgColor: 'from-green-600/10 to-green-500/10',
    phase: 'complete',
    description: 'Paczka już jedzie'
  }
}

const STATUS_ORDER = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'w_naprawie', 'zakonczone', 'wyslane']

export default function PremiumTimeline({ currentStatus, statusHistory, createdAt }: PremiumTimelineProps) {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [scrubberPosition, setScrubberPosition] = useState<number>(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [estimatedCompletion, setEstimatedCompletion] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrubberRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.95])

  // Build timeline data
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)
  const timelineSteps: TimelineStep[] = STATUS_ORDER.map((status, index) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]
    const historyItem = statusHistory.find(h => h.new_status === status)
    
    return {
      status,
      label: config.label,
      icon: config.icon,
      color: config.color,
      gradientFrom: config.gradientFrom,
      gradientTo: config.gradientTo,
      bgColor: config.bgColor,
      date: historyItem?.changed_at,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex,
      description: config.description
    }
  })

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / STATUS_ORDER.length) * 100

  // AI-powered time estimation
  useEffect(() => {
    if (currentStatus === 'zakonczone' || currentStatus === 'wyslane') {
      setEstimatedCompletion('Gotowe!')
      return
    }

    // Calculate average time based on history
    const daysSinceCreated = differenceInDays(new Date(), new Date(createdAt))
    let estimatedDaysRemaining = 0

    switch (currentStatus) {
      case 'nowe':
        estimatedDaysRemaining = 3
        break
      case 'odebrane':
        estimatedDaysRemaining = 2
        break
      case 'diagnoza':
        estimatedDaysRemaining = 2
        break
      case 'wycena':
        estimatedDaysRemaining = 1
        break
      case 'w_naprawie':
        estimatedDaysRemaining = 1
        break
      default:
        estimatedDaysRemaining = 0
    }

    const estimatedDate = addDays(new Date(), estimatedDaysRemaining)
    setEstimatedCompletion(format(estimatedDate, "d MMMM yyyy", { locale: pl }))
  }, [currentStatus, createdAt])

  // Confetti effect for completion
  useEffect(() => {
    if (currentStatus === 'zakonczone' && !showConfetti) {
      setShowConfetti(true)
      
      // Multiple confetti bursts
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 }

const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)

      return () => clearInterval(interval)
    }
  }, [currentStatus, showConfetti])

  // Scrubber interaction
  useEffect(() => {
    setActiveStep(currentIndex)
    setScrubberPosition(progressPercentage)
  }, [currentIndex, progressPercentage])

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubberRef.current) return
    
    const rect = scrubberRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    const stepIndex = Math.floor((percentage / 100) * STATUS_ORDER.length)
    
    if (stepIndex <= currentIndex) {
      setActiveStep(stepIndex)
      setScrubberPosition(percentage)
    }
  }

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity, scale }}
      className="relative"
    >
      {/* Header with AI prediction */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Status naprawy</h2>
          <p className="text-sm text-gray-600">Śledź postęp w czasie rzeczywistym</p>
        </div>
        
        {estimatedCompletion && currentStatus !== 'zakonczone' && currentStatus !== 'wyslane' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-200/50"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Szacowany czas zakończenia</p>
              <p className="text-sm font-bold text-gray-900">{estimatedCompletion}</p>
            </div>
          </motion.div>
        )}

        {(currentStatus === 'zakonczone' || currentStatus === 'wyslane') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl border border-emerald-200/50"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <PartyPopper className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">🎉 Naprawa zakończona!</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Interactive Timeline Scrubber */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Postęp</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div 
          ref={scrubberRef}
          onClick={handleScrubberClick}
          className="relative h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer group"
        >
          {/* Animated gradient progress */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${scrubberPosition}%`,
              background: `linear-gradient(90deg, 
                ${timelineSteps[0]?.gradientFrom || '#3B82F6'} 0%, 
                ${timelineSteps[Math.min(activeStep, timelineSteps.length - 1)]?.gradientTo || '#6366F1'} 100%)`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${scrubberPosition}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          </motion.div>

          {/* Step markers */}
          {timelineSteps.map((step, index) => {
            const position = ((index + 1) / STATUS_ORDER.length) * 100
            return (
              <div
                key={step.status}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${position}%` }}
              >
                <div 
                  className={`w-2 h-2 rounded-full transition-all ${
                    step.isActive 
                      ? 'bg-white ring-2 ring-offset-1' 
                      : 'bg-gray-300'
                  }`}
                  style={{
                    ringColor: step.isActive ? step.color : undefined
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Premium Timeline Cards */}
      <div className="space-y-8">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon
          const { ref, inView } = useInView({
            threshold: 0.3,
            triggerOnce: false
          })

          return (
            <motion.div
              key={step.status}
              ref={ref}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ 
                opacity: inView ? 1 : 0.3,
                x: inView ? 0 : (index % 2 === 0 ? -50 : 50),
                scale: step.isCurrent ? 1.02 : 1
              }}
              transition={{ 
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="relative"
            >
              {/* Connecting line */}
              {index < timelineSteps.length - 1 && (
                <div 
                  className="absolute left-[52px] top-[80px] w-0.5 h-16 -z-10"
                  style={{
                    background: step.isActive 
                      ? `linear-gradient(180deg, ${step.color} 0%, ${timelineSteps[index + 1]?.color || step.color} 100%)`
                      : '#E5E7EB'
                  }}
                />
              )}

              {/* Card */}
              <div className={`
                relative group
                ${step.isCurrent ? 'ring-2 ring-offset-2' : ''}
              `}
              style={{
                ringColor: step.isCurrent ? step.color : undefined
              }}
              >
                <div className={`
                  relative overflow-hidden rounded-3xl
                  bg-gradient-to-br ${step.bgColor}
                  backdrop-blur-xl
                  border border-white/20
                  p-6
                  transition-all duration-500
                  ${step.isCurrent ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}
                  ${!step.isActive ? 'opacity-50' : ''}
                `}>
                  {/* Background glow */}
                  {step.isCurrent && (
                    <div 
                      className="absolute -inset-1 opacity-20 blur-2xl rounded-3xl -z-10"
                      style={{
                        background: `radial-gradient(circle, ${step.color} 0%, transparent 70%)`
                      }}
                    />
                  )}

                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 group-hover:animate-shimmer" />

                  <div className="flex items-start gap-6">
                    {/* Icon with 3D effect */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotateY: 10 }}
                      className="relative flex-shrink-0"
                    >
                      <div 
                        className={`
                          w-24 h-24 rounded-2xl
                          flex items-center justify-center
                          relative overflow-hidden
                          ${step.isCurrent ? 'animate-pulse' : ''}
                        `}
                        style={{
                          background: `linear-gradient(135deg, ${step.gradientFrom} 0%, ${step.gradientTo} 100%)`
                        }}
                      >
                        {/* Pulsing rings for current step */}
                        {step.isCurrent && (
                          <>
                            <span className="absolute inline-flex h-full w-full rounded-2xl opacity-75 animate-ping"
                              style={{ backgroundColor: step.color }}
                            />
                            <span className="absolute inline-flex h-full w-full rounded-2xl opacity-50"
                              style={{ backgroundColor: step.color }}
                            />
                          </>
                        )}
                        
                        <Icon className="w-12 h-12 text-white relative z-10" />
                      </div>

                      {/* Step number badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <span className="text-sm font-bold" style={{ color: step.color }}>
                          {index + 1}
                        </span>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {step.label}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>

                        {step.date && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-xl backdrop-blur-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-700">
                              {format(new Date(step.date), "d MMM, HH:mm", { locale: pl })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Time elapsed indicator */}
                      {step.date && index > 0 && timelineSteps[index - 1]?.date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>
                            {differenceInHours(
                              new Date(step.date),
                              new Date(timelineSteps[index - 1].date!)
                            )} godz. od poprzedniego kroku
                          </span>
                        </div>
                      )}

                      {/* Current step indicator with live pulse */}
                      {step.isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 flex items-center gap-2 text-sm font-medium"
                          style={{ color: step.color }}
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: step.color }}
                          />
                          Aktualny status
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Completion checkmark overlay */}
                  {step.isActive && !step.isCurrent && (
                    <div className="absolute top-4 right-4">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: step.color }}
                      >
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Phase indicators */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        <PhaseCard 
          title="Odbior"
          icon={Truck}
          color="#3B82F6"
          isActive={currentIndex >= 0}
          isComplete={currentIndex > 1}
        />
        <PhaseCard 
          title="Serwis"
          icon={Wrench}
          color="#8B5CF6"
          isActive={currentIndex >= 2}
          isComplete={currentIndex > 4}
        />
        <PhaseCard 
          title="Zakończone"
          icon={PartyPopper}
          color="#10B981"
          isActive={currentIndex >= 5}
          isComplete={currentIndex >= 6}
        />
      </div>

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
    </motion.div>
  )
}

// Phase Card Component
function PhaseCard({ 
  title, 
  icon: Icon, 
  color, 
  isActive, 
  isComplete 
}: { 
  title: string
  icon: any
  color: string
  isActive: boolean
  isComplete: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative p-4 rounded-2xl border
        transition-all duration-500
        ${isActive ? 'border-transparent' : 'border-gray-200'}
        ${isComplete ? 'bg-gradient-to-br from-emerald-50 to-green-50' : isActive ? 'bg-white shadow-lg' : 'bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            transition-all duration-500
            ${isComplete ? 'bg-gradient-to-br from-emerald-500 to-green-600' : isActive ? 'bg-gradient-to-br' : 'bg-gray-200'}
          `}
          style={{
            backgroundImage: isActive && !isComplete ? `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)` : undefined
          }}
        >
          {isComplete ? (
            <CheckCircle className="w-6 h-6 text-white" />
          ) : (
            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
          )}
        </div>
        
        <div>
          <p className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
            {title}
          </p>
          {isComplete && (
            <p className="text-xs text-emerald-600 font-medium">Ukończone</p>
          )}
          {isActive && !isComplete && (
            <p className="text-xs font-medium" style={{ color }}>W trakcie</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}