'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackUrl?: string
  label?: string
  className?: string
}

export default function BackButton({ 
  fallbackUrl = '/blog', 
  label = 'Wróć',
  className = 'inline-flex items-center gap-2 text-gray-600 hover:text-gray-900'
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Sprawdź czy jest historia do cofnięcia
    if (window.history.length > 1) {
      router.back()
    } else {
      // Jeśli nie ma historii, idź do fallback URL
      router.push(fallbackUrl)
    }
  }

  return (
    <button 
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}

