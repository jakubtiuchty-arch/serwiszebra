import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Poradniki Video Zebra - Kalibracja, Konfiguracja, Naprawy | Serwis Zebra',
  description: 'Darmowe poradniki video od autoryzowanego serwisu Zebra. Naucz się kalibrować drukarki, konfigurować terminale i rozwiązywać problemy ze skanerami. Krok po kroku, po polsku.',
  keywords: [
    'poradniki zebra',
    'video zebra',
    'kalibracja drukarki zebra',
    'konfiguracja terminala zebra',
    'jak skalibrować zd420',
    'reset fabryczny tc52',
    'datawedge konfiguracja',
    'naprawa drukarki zebra',
    'tutorial zebra',
    'instrukcja zebra po polsku'
  ],
  openGraph: {
    title: 'Poradniki Video Zebra - Kalibracja, Konfiguracja, Naprawy',
    description: 'Darmowe poradniki video od autoryzowanego serwisu Zebra. Krok po kroku, po polsku.',
    type: 'website',
    locale: 'pl_PL',
  },
  alternates: {
    canonical: 'https://serwiszebra.pl/poradniki-wideo'
  }
}

export default function VideoTutorialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

