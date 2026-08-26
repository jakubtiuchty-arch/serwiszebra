'use client'

import { useCallback, useState } from 'react'
import DevicePurchasePanel, {
  type DeviceVariant,
  type StanWariantu,
} from './DevicePurchasePanel'
import DeviceVariantsTable from './DeviceVariantsTable'

interface Props {
  productId: string
  name: string
  slug: string
  images: string[]
  fallbackNetto: number
  fallbackBrutto: number
  variants: DeviceVariant[]
  stanyPoczatkowe: Record<string, StanWariantu>
  /** Wariant z adresu (`?pn=`) — stan początkowy wyboru */
  wybranyPnStart?: string
  rekomendowanyPn?: string
}

/**
 * Spina panel zakupu z tabelą wariantów wokół jednego wyboru.
 *
 * Wcześniej wariant dało się wskazać wyłącznie parametrem `?pn=` wpisanym
 * ręcznie w pasku adresu — stan był adresowalny dla Google, ale człowiek nie
 * miał czym go wywołać. Teraz wybór robi się kliknięciem w wiersz, a adres
 * dopisuje się sam, więc link do konkretnej konfiguracji da się skopiować
 * i wysłać.
 *
 * Adres zmieniamy przez `history.replaceState`, nie przez router: karta jest
 * renderowana serwerowo, a nawigacja Next.js przeładowałaby ją niepotrzebnie —
 * dane wszystkich wariantów są już na stronie.
 */
export default function DeviceBuyBlock({
  productId,
  name,
  slug,
  images,
  fallbackNetto,
  fallbackBrutto,
  variants,
  stanyPoczatkowe,
  wybranyPnStart,
  rekomendowanyPn,
}: Props) {
  const [wybranyPn, setWybranyPn] = useState<string | undefined>(wybranyPnStart)

  const wybierz = useCallback(
    (pn: string) => {
      // Ponowne kliknięcie w wybrany wiersz zdejmuje wybór — inaczej nie dało by
      // się wrócić do widoku „od X zł" bez przeładowania strony
      const nowy = pn === wybranyPn ? undefined : pn
      setWybranyPn(nowy)

      const url = new URL(window.location.href)
      if (nowy) url.searchParams.set('pn', nowy)
      else url.searchParams.delete('pn')
      window.history.replaceState(null, '', url)
    },
    [wybranyPn]
  )

  return (
    <>
      <DevicePurchasePanel
        productId={productId}
        name={name}
        slug={slug}
        images={images}
        fallbackNetto={fallbackNetto}
        fallbackBrutto={fallbackBrutto}
        variants={variants}
        stanyPoczatkowe={stanyPoczatkowe}
        wybranyPn={wybranyPn}
        rekomendowanyPn={rekomendowanyPn}
      />

      <DeviceVariantsTable
        productId={productId}
        name={name}
        slug={slug}
        variants={variants}
        fallbackNetto={fallbackNetto}
        fallbackBrutto={fallbackBrutto}
        stanyPoczatkowe={stanyPoczatkowe}
        wybranyPn={wybranyPn}
        przewinDoWybranego={!!wybranyPnStart}
        onWybierz={wybierz}
      />
    </>
  )
}
