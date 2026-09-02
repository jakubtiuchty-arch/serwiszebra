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
  opis: 'Jedyny materiał, jakiego potrzebuje ta drukarka — bez taśmy. Rolki w formatach kurierskich i magazynowych, na gilzie 12,7 i 25,4 mm.',
  cta: 'Zobacz etykiety termiczne',
}

/* Komora drukarki mobilnej mieści wyłącznie małą rolkę na gilzie 19 mm
   albo rolkę bezgilzową — stąd osobna treść kafla dla klasy mobilnej. */
const ETYKIETY_MOBILNE: Kafel = {
  href: 'https://www.takma.com.pl/etykiety-termiczne-zebra',
  obraz: '/materialy/etykiety-termiczne.webp',
  alt: 'Rolki białych etykiet termicznych na blacie stanowiska pakowania',
  tytul: 'Etykiety termiczne',
  opis: 'Jedyny materiał, jakiego potrzebuje ta drukarka — bez taśmy. Rolki mobilne na gilzie 19 mm oraz bezgilzowe, w formatach paragonowych i wysyłkowych.',
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
  alt: 'Rolki etykiet termotransferowych na warsztatowym blacie, jedna rozwinięta w pas etykiet',
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
          // Bez jednostki vw: gdy `sizes` zawiera vw, next/image buduje srcset tylko
          // z deviceSizes (od 640 px) i kafel 256 px dostawał obraz 640 px (audyt ZT421)
          sizes={szeroki ? '(max-width: 640px) 640px, 256px' : '(max-width: 640px) 640px, 384px'}
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

export default function BanerMaterialow({
  termotransfer,
  mobilna = false,
}: {
  termotransfer: boolean
  mobilna?: boolean
}) {
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
      {/* Oba materiały w tym samym, niskim układzie co baner etykiet termicznych:
          obraz z boku, tekst obok. Kafle jeden pod drugim, nie obok siebie —
          w dwóch kolumnach obraz rósł do proporcji 16:9 i sekcja puchła
          dwukrotnie względem wersji „d". */}
      <div className="mt-4 grid gap-3">
        {termotransfer ? (
          <>
            <KafelMaterialu k={TASMY} szeroki />
            <KafelMaterialu k={ETYKIETY_TT} szeroki />
          </>
        ) : (
          <KafelMaterialu k={mobilna ? ETYKIETY_MOBILNE : ETYKIETY_TERMICZNE} szeroki />
        )}
      </div>
    </section>
  )
}
