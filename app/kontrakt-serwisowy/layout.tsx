import { Metadata } from 'next'

const URL = 'https://www.serwis-zebry.pl/kontrakt-serwisowy'

export const metadata: Metadata = {
  title: 'Kontrakt serwisowy Zebra na 3 lata — 599 zł netto',
  description:
    'Trzy lata opieki nad drukarką Zebra bez rachunków za robociznę. Odbiór kurierem, naprawa w 48 godzin roboczych, części 40% taniej. Kupujesz online, podajesz numer seryjny.',
  alternates: {
    canonical: URL,
    languages: { pl: URL, 'x-default': URL },
  },
  openGraph: {
    title: 'Kontrakt serwisowy Zebra na 3 lata | TAKMA',
    description:
      'Jedna opłata z góry zamiast rachunków za każdą naprawę. Odbiór kurierem, naprawa w 48 godzin roboczych, części 40% taniej.',
    url: URL,
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [
      {
        url: 'https://www.serwis-zebry.pl/newsletter/kontrakt-serwisowy.jpeg',
        width: 652,
        height: 652,
        alt: 'Kontrakt serwisowy Zebra — TAKMA',
      },
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
