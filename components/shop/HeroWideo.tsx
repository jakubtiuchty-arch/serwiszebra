'use client'

import { useState } from 'react'

/**
 * Animacja hero: film gra RAZ po wejściu i po zakończeniu wygasza się,
 * odsłaniając statyczną grafikę pod spodem.
 *
 * Powód: najazd kamery kończy się na zbliżeniu jednej części, a hero ma
 * docelowo pokazywać całą kompozycję — zostawienie ostatniej klatki gubiło
 * połowę asortymentu. Zapętlenie odpada, bo skok z ostatniej klatki na
 * pierwszą widać jak cięcie.
 *
 * Pierwsza klatka filmu to dokładnie ta sama grafika (start frame generacji),
 * więc start jest niewidoczny. Gdy system prosi o ograniczenie animacji,
 * film w ogóle się nie pokazuje.
 */
export default function HeroWideo({ src, poster }: { src: string; poster: string }) {
  const [skonczone, setSkonczone] = useState(false)

  return (
    <video
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster={poster}
      src={src}
      aria-hidden
      onEnded={() => setSkonczone(true)}
      className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-700 motion-reduce:hidden ${
        skonczone ? 'opacity-0' : 'opacity-100'
      }`}
    />
  )
}
