'use client'

import { useCallback, useEffect, useState } from 'react'
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

  // JEDEN fetch na stronę. Wcześniej panel i tabela pytały o te same numery
  // osobno — dwa równoległe zapytania potrafiły zwrócić dwie różne migawki
  // (np. przy czkawce jednego z dystrybutorów w ścieżce awaryjnej) i klient
  // widział u góry „EU: 1338", a w tabeli „PL: 12" dla tej samej wersji.
  // Teraz oba komponenty dostają dokładnie ten sam snapshot.
  const [stany, setStany] = useState<Record<string, StanWariantu>>(stanyPoczatkowe)
  const [zaladowane, setZaladowane] = useState(false)

  useEffect(() => {
    let anulowane = false
    Promise.all(
      variants.map((v) =>
        fetch(`/api/shop/product-stock?sku=${encodeURIComponent(v.pn)}`)
          .then((r) => r.json())
          .then((d) => ({
            pn: v.pn,
            stan: {
              netto: d.live_price > 0 ? d.live_price : fallbackNetto,
              brutto: d.live_price_brutto > 0 ? d.live_price_brutto : fallbackBrutto,
              stockPL: d.stock_pl ?? 0,
              stockEU: d.stock_de ?? 0,
              total: d.total_stock ?? 0,
              deliveryText: d.delivery_text ?? null,
            } as StanWariantu,
          }))
          .catch(() => null)
      )
    ).then((wyniki) => {
      if (anulowane) return
      setStany((poprzednie) => {
        const mapa = { ...poprzednie }
        wyniki.forEach((w) => {
          if (w) mapa[w.pn] = w.stan
        })
        return mapa
      })
      setZaladowane(true)
    })
    return () => {
      anulowane = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wybierz = useCallback(
    (pn: string) => {
      // Ponowne kliknięcie NIE zdejmuje wyboru — radio zmienia się przez wybór
      // innej opcji, nie przez odznaczenie tej samej (model mentalny radia;
      // audyt 2026-08-26). Powrót do ceny „od" daje przeładowanie bez ?pn.
      setWybranyPn(pn)

      const url = new URL(window.location.href)
      url.searchParams.set('pn', pn)
      window.history.replaceState(null, '', url)
    },
    []
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
        stany={stany}
        zaladowane={zaladowane}
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
        stany={stany}
        zaladowane={zaladowane}
        wybranyPn={wybranyPn}
        najczesciejWybierany={rekomendowanyPn}
        przewinDoWybranego={!!wybranyPnStart}
        onWybierz={wybierz}
      />
    </>
  )
}
