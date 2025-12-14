'use client'

import { useState, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from 'react-joyride'
import { createClient } from '@/lib/supabase/client'

interface OnboardingTourProps {
  userId: string
  hasRepairs: boolean
}

export default function OnboardingTour({ userId, hasRepairs }: OnboardingTourProps) {
  const [run, setRun] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  // Kroki touru
  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Witaj w Panelu Klienta!</h2>
          <p className="text-gray-600">
            Pokażemy Ci najważniejsze funkcje panelu, abyś mógł w pełni korzystać z naszego serwisu.
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="dashboard"]',
      content: (
        <div>
          <h3 className="font-bold text-gray-900 mb-2">📊 Dashboard</h3>
          <p className="text-gray-600 text-sm">
            Tu widzisz wszystkie swoje naprawy. Każda karta pokazuje status, model urządzenia i postęp naprawy.
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="new-repair"]',
      content: (
        <div>
          <h3 className="font-bold text-gray-900 mb-2">➕ Nowe zgłoszenie</h3>
          <p className="text-gray-600 text-sm">
            Kliknij tutaj, aby zgłosić nowe urządzenie do naprawy. Wypełnij formularz i zamów kuriera - odbierzemy sprzęt od Ciebie!
          </p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="repair-card"]',
      content: (
        <div>
          <h3 className="font-bold text-gray-900 mb-2">📋 Karta naprawy</h3>
          <p className="text-gray-600 text-sm">
            Kliknij w kartę, aby zobaczyć szczegóły: timeline postępu, chat z serwisantem, wycenę i opcje płatności.
          </p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      disableOverlayClose: true,
    },
    {
      target: '[data-tour="sidebar-profile"]',
      content: (
        <div>
          <h3 className="font-bold text-gray-900 mb-2">👤 Twój profil</h3>
          <p className="text-gray-600 text-sm">
            Tutaj możesz edytować swoje dane kontaktowe i zarządzać kontem.
          </p>
        </div>
      ),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: 'body',
      content: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Gotowe!</h2>
          <p className="text-gray-600 mb-3">
            Teraz znasz już podstawy panelu. W razie pytań - pisz na czacie w szczegółach naprawy!
          </p>
          <div className="bg-blue-50 rounded-lg p-3 text-left">
            <p className="text-xs text-blue-800">
              <strong>💡 Pro tip:</strong> Po otrzymaniu wyceny możesz zapłacić online kartą, BLIK-iem lub przelewem (Pro Forma).
            </p>
          </div>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
  ]

  // Filtruj kroki jeśli nie ma napraw
  const filteredSteps = hasRepairs 
    ? steps 
    : steps.filter(step => step.target !== '[data-tour="repair-card"]')

  useEffect(() => {
    // Sprawdź czy użytkownik już widział tour
    const checkTourStatus = async () => {
      // Najpierw sprawdź localStorage (szybsze)
      const localTourSeen = localStorage.getItem(`tour_seen_${userId}`)
      if (localTourSeen) {
        return
      }

      // Sprawdź w Supabase (dla synchronizacji między urządzeniami)
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('profiles')
          .select('tour_completed')
          .eq('id', userId)
          .single()

        if (data?.tour_completed) {
          localStorage.setItem(`tour_seen_${userId}`, 'true')
          return
        }

        // Tour nie był widziany - uruchom po krótkim opóźnieniu
        setTimeout(() => {
          setRun(true)
        }, 1000)
      } catch (error) {
        // Jeśli błąd - uruchom tour (lepsze UX)
        setTimeout(() => {
          setRun(true)
        }, 1000)
      }
    }

    checkTourStatus()
  }, [userId])

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action, index, type } = data

    // Aktualizuj indeks kroku
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1))
    }

    // Tour zakończony lub pominięty
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false)
      
      // Zapisz w localStorage
      localStorage.setItem(`tour_seen_${userId}`, 'true')

      // Zapisz w Supabase (opcjonalnie - może nie przejść przez RLS)
      try {
        const supabase = createClient()
        await supabase
          .from('profiles')
          .update({ tour_completed: true })
          .eq('id', userId)
      } catch (error) {
        console.warn('Could not save tour status to database:', error)
      }
    }
  }

  return (
    <Joyride
      steps={filteredSteps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      hideCloseButton={false}
      disableOverlayClose
      spotlightClicks
      callback={handleJoyrideCallback}
      locale={{
        back: 'Wstecz',
        close: 'Zamknij',
        last: 'Zakończ',
        next: 'Dalej',
        skip: 'Pomiń',
      }}
      styles={{
        options: {
          primaryColor: '#2563eb',
          zIndex: 10000,
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          textColor: '#374151',
        },
        tooltip: {
          borderRadius: 16,
          padding: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '8px 0',
        },
        buttonNext: {
          backgroundColor: '#2563eb',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
          fontSize: 14,
        },
        buttonSkip: {
          color: '#9ca3af',
          fontSize: 13,
        },
        spotlight: {
          borderRadius: 12,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      floaterProps={{
        styles: {
          floater: {
            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))',
          },
        },
      }}
    />
  )
}

