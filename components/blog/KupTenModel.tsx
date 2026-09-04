import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/blog'
import { modeleWTekscie, urlKarty, URL_KART, type ModelSklepu } from '@/lib/modele-sklepu'
import { TRESC_KART } from '@/lib/device-content'

/**
 * Ramka „ten model w sklepie" pod nagłówkiem wpisu o drukarce. Wpisy blogowe
 * rankują na frazy modelowe, a do 4.09.2026 nie linkowały do kart produktów
 * w ogóle — karty miały po 0–1 linków wewnętrznych i nie wchodziły do indeksu.
 *
 * Model bierzemy z tytułu, w drugiej kolejności z tagów. Wpis ogólny o drukarkach
 * etykiet dostaje link do huba kategorii. Wpisy o drukarkach kart i opasek — nic.
 */
export default function KupTenModel({ post }: { post: BlogPost }) {
  if (post.deviceType !== 'drukarki') return null
  if (post.subDeviceType && !['etykiet', 'mobilne'].includes(post.subDeviceType)) return null

  // Tytuł jest wiążący (wpis porównawczy może wymienić pięć modeli). Tagi tylko
  // wtedy, gdy wskazują najwyżej trzy modele — wpis ogólny („Ribbon Out",
  // „kalibracja") ma w tagach całą półkę i dostaje link do huba, nie losowe karty.
  const zTytulu = modeleWTekscie(post.title).slice(0, 5)
  const zTagow = modeleWTekscie(post.tags.join(' '))
  const modele: ModelSklepu[] = zTytulu.length ? zTytulu : zTagow.length <= 3 ? zTagow : []

  if (modele.length === 0) {
    return (
      <aside className="mb-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="text-sm text-gray-700">
          Szukasz drukarki? Sprzedajemy sprzęt, który sami naprawiamy:{' '}
          <Link href={URL_KART} className="font-semibold text-gray-900 underline underline-offset-2">
            drukarki etykiet Zebra — ceny i dostępność na żywo
          </Link>
          .
        </p>
      </aside>
    )
  }

  return (
    <aside className="mb-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5" aria-label="Ten model w sklepie">
      <p className="text-sm font-semibold text-gray-900">
        {modele.length === 1 ? 'Ten model w naszym sklepie' : 'Te modele w naszym sklepie'}
      </p>
      <ul className="mt-2 divide-y divide-gray-100">
        {modele.map((m) => {
          const zdjecie = TRESC_KART[m.slug]?.zdjecieGlowne
          return (
            <li key={m.slug} className="flex items-center gap-4 py-3 last:pb-0">
              {zdjecie && (
                <Image
                  src={zdjecie}
                  alt={`Drukarka etykiet Zebra ${m.model}`}
                  width={56}
                  height={56}
                  className="h-14 w-14 flex-shrink-0 object-contain"
                />
              )}
              <div className="min-w-0 flex-1">
                <Link href={urlKarty(m)} className="font-semibold text-gray-900 hover:underline">
                  Drukarka etykiet Zebra {m.model}
                </Link>
                <p className="text-xs text-gray-600">
                  Cena i dostępność na żywo, gwarancja realizowana w naszym serwisie
                </p>
              </div>
              <Link
                href={urlKarty(m)}
                className="hidden whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 sm:inline"
                aria-label={`Karta produktu Zebra ${m.model}`}
              >
                Zobacz kartę &rarr;
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
