import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

/**
 * Materiały eksploatacyjne do kupionej drukarki.
 *
 * Sprzedajemy je na takma.com.pl, nie tutaj — a klient kupujący drukarkę
 * pyta o etykiety w tej samej rozmowie, więc miejsce na tę informację jest
 * na karcie, zaraz po częściach zamiennych. Wersja termiczna („d") potrzebuje
 * wyłącznie etykiet; termotransferowa („t") dwóch materiałów naraz — taśmy
 * i etykiet — dlatego dostaje dwa kafle zamiast jednego.
 *
 * Linki wychodzą na inną domenę i otwierają się w nowej karcie: klient jest
 * w trakcie wyboru numeru katalogowego i nie ma go z niego wyrzucać.
 */

interface Kafel {
  href: string
  obraz: string
  alt: string
  tytul: string
  opis: string
  cta: string
}

const ETYKIETY_TERMICZNE: Kafel = {
  href: 'https://www.takma.com.pl/etykiety-termiczne-zebra',
  obraz: '/materialy/etykiety-termiczne.webp',
  alt: 'Rolki białych etykiet termicznych na blacie stanowiska pakowania',
  tytul: 'Etykiety termiczne',
  opis: 'Jedyny materiał, jakiego potrzebuje ta drukarka — bez taśmy. Rolki w formatach kurierskich i magazynowych, na wałku 25 i 40 mm.',
  cta: 'Zobacz etykiety termiczne',
}

const TASMY: Kafel = {
  href: 'https://www.takma.com.pl/tasmy-termotransferowe',
  obraz: '/materialy/tasmy-termotransferowe.webp',
  alt: 'Rolki czarnych taśm termotransferowych na drewnianym blacie',
  tytul: 'Taśmy termotransferowe',
  opis: 'Woskowe, woskowo-żywiczne i żywiczne — dobór decyduje o tym, czy nadruk przetrwa tarcie, wilgoć i rozpuszczalniki.',
  cta: 'Zobacz taśmy',
}

const ETYKIETY_TT: Kafel = {
  href: 'https://www.takma.com.pl/etykiety-termotransferowe-zebra',
  obraz: '/materialy/etykiety-termotransferowe.webp',
  alt: 'Kartony i pojemniki magazynowe z naklejonymi etykietami, obok rolki etykiet',
  tytul: 'Etykiety termotransferowe',
  opis: 'Papierowe do magazynu, foliowe tam, gdzie etykieta moknie albo się ociera. Muszą pasować do taśmy, nie tylko do drukarki.',
  cta: 'Zobacz etykiety',
}

function KafelMaterialu({ k, szeroki }: { k: Kafel; szeroki?: boolean }) {
  return (
    <a
      href={k.href}
      target="_blank"
      rel="noopener"
      className={`group flex overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400 ${
        szeroki ? 'flex-col sm:flex-row' : 'flex-col'
      }`}
    >
      <span
        className={`relative block shrink-0 overflow-hidden bg-gray-100 ${
          szeroki ? 'aspect-[16/9] sm:aspect-auto sm:w-64' : 'aspect-[16/9]'
        }`}
      >
        <Image
          src={k.obraz}
          alt={k.alt}
          fill
          sizes={szeroki ? '(max-width: 640px) 100vw, 256px' : '(max-width: 640px) 100vw, 50vw'}
          className="object-cover"
        />
      </span>
      <span className="flex flex-1 flex-col p-4">
        <span className="text-sm font-semibold text-gray-900">{k.tytul}</span>
        <span className="mt-1.5 text-sm leading-relaxed text-gray-600">{k.opis}</span>
        <span className="mt-auto flex items-center gap-1.5 pt-3 text-sm font-semibold text-gray-900">
          {k.cta}
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </span>
    </a>
  )
}

export default function BanerMaterialow({ termotransfer }: { termotransfer: boolean }) {
  return (
    <section className="mb-4 rounded-xl border border-gray-200 bg-white p-4 sm:mb-6 sm:p-6">
      <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
        Materiały eksploatacyjne
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        {termotransfer
          ? 'Druk termotransferowy zużywa dwa materiały naraz: taśmę i etykiety. Kupisz je w naszym sklepie z materiałami.'
          : 'Druk termiczny nie wymaga taśmy — kupujesz wyłącznie etykiety. Znajdziesz je w naszym sklepie z materiałami.'}
      </p>
      <div className={`mt-4 grid gap-3 ${termotransfer ? 'sm:grid-cols-2' : ''}`}>
        {termotransfer ? (
          <>
            <KafelMaterialu k={TASMY} />
            <KafelMaterialu k={ETYKIETY_TT} />
          </>
        ) : (
          <KafelMaterialu k={ETYKIETY_TERMICZNE} szeroki />
        )}
      </div>
    </section>
  )
}
