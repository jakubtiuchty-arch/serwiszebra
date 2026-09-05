import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import RepairForm from '@/components/RepairForm'

export const metadata: Metadata = {
  title: 'Zgłoś naprawę urządzenia Zebra | TAKMA',
  description:
    'Zgłoś do naprawy drukarkę etykiet lub kart, terminal, skaner albo tablet Zebra. Formularz zgłoszenia do autoryzowanego serwisu TAKMA dla firm w Polsce.',
  alternates: { canonical: 'https://www.serwis-zebry.pl/formularz' },
  openGraph: {
    title: 'Zgłoś naprawę urządzenia Zebra | TAKMA',
    description: 'Formularz zgłoszenia naprawy urządzeń Zebra dla firm w Polsce.',
    url: 'https://www.serwis-zebry.pl/formularz',
  },
}

export default function RepairRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="other" />
      <main id="main-content">
        <div className="mx-auto max-w-3xl px-4 pt-8 text-center sm:pt-10">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Zgłoś naprawę urządzenia Zebra
          </h1>
          <p className="mt-3 text-gray-600">
            Autoryzowany serwis drukarek etykiet i kart, terminali, skanerów oraz
            tabletów Zebra dla firm w całej Polsce.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Podaj dane urządzenia, opisz usterkę i wskaż adres odbioru.
          </p>
        </div>
        <RepairForm />
      </main>
      <footer className="border-t border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
        <p>
          TAKMA — Autoryzowany Serwis Zebra ·{' '}
          <a href="tel:+48601619898" className="text-blue-700 hover:underline">
            601 619 898
          </a>
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href="/jak-to-dziala" className="hover:underline">Jak działa serwis</Link>
          <Link href="/regulamin" className="hover:underline">Regulamin</Link>
          <Link href="/polityka-prywatnosci" className="hover:underline">Polityka prywatności</Link>
        </div>
      </footer>
    </div>
  )
}
