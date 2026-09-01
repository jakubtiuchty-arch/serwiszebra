'use client'

import type { ReactNode } from 'react'

/**
 * Przewija do panelu zakupu i ustawia kursor w polu modelu. Samo przewinięcie
 * kotwicą zostawiało klienta przed pustym formularzem — kliknięcie w „Kup
 * kontrakt" ma od razu zaczynać wpisywanie.
 */
export function przewinDoFormularza() {
  document.getElementById('panel-zakupu')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => document.getElementById('contract-model')?.focus({ preventScroll: true }), 400)
}

export default function KontraktCtaLink({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href="#panel-zakupu"
      className={className}
      onClick={(e) => {
        e.preventDefault()
        przewinDoFormularza()
      }}
    >
      {children}
    </a>
  )
}
