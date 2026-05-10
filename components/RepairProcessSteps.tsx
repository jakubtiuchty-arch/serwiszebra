'use client'

import { useState, useEffect, useRef } from 'react'
import { ClipboardList, Truck, Search, Wrench } from 'lucide-react'

const steps = [
  {
    name: 'Krok 1: Zgłoszenie',
    description: 'Wypełnij formularz na stronie lub zadzwoń na +48 601 619 898. Podaj model drukarki i opis usterki. Otrzymasz numer zlecenia.',
    icon: ClipboardList,
  },
  {
    name: 'Krok 2: Odbiór kurierem',
    description: 'Zamawiamy kuriera DPD pod odbiór drukarki ze wskazanego adresu. Odbiór zazwyczaj w ciągu 24h.',
    icon: Truck,
  },
  {
    name: 'Krok 3: Diagnostyka i wycena',
    description: 'Drukarka jest diagnozowana przez naszych techników. Wycenę otrzymujesz w panelu klienta do akceptacji.',
    icon: Search,
  },
  {
    name: 'Krok 4: Naprawa i odesłanie',
    description: 'Po akceptacji wyceny naprawiamy oryginalnymi częściami Zebra i odsyłamy kurierem na nasz koszt.',
    icon: Wrench,
  },
]

export default function RepairProcessSteps() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current)
          }
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-gray-50 py-10 sm:py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Jak wygląda naprawa drukarki Zebra — krok po kroku
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Cały proces zajmuje średnio 5-7 dni roboczych. Kurier odbierze drukarkę z dowolnego miejsca w Polsce.
          </p>
        </div>

        <div className="relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, stepIdx) => (
              <div
                key={step.name}
                className={`relative flex flex-col items-center text-center transition-all duration-[1200ms] transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                style={{ transitionDelay: `${isVisible ? stepIdx * 600 : 0}ms` }}
              >
                <div className={`h-16 w-16 rounded-full bg-white border-4 shadow-md flex items-center justify-center mb-6 relative z-10 transition-all duration-[1000ms] ${isVisible ? 'border-blue-500 scale-100' : 'border-gray-200 scale-90'}`}>
                  <step.icon className={`h-7 w-7 transition-colors duration-[1000ms] ${isVisible ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed px-2">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
