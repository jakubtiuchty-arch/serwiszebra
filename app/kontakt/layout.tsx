import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt – Zadzwoń, napisz lub odwiedź nas',
  description: 'Skontaktuj się z autoryzowanym serwisem Zebra. Telefon: +48 690 034 733, email: serwis@takma.com.pl. Szybka odpowiedź i profesjonalna obsługa.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/kontakt',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/kontakt',
      'x-default': 'https://www.serwis-zebry.pl/kontakt',
    },
  },
  openGraph: {
    title: 'Kontakt - Serwis Zebra',
    description: 'Skontaktuj się z autoryzowanym serwisem Zebra. Szybka odpowiedź i profesjonalna obsługa.',
    url: 'https://www.serwis-zebry.pl/kontakt',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Kontakt - Serwis Zebra' }],
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://www.serwis-zebry.pl/#business',
      name: 'TAKMA - Autoryzowany Serwis Zebra',
      url: 'https://www.serwis-zebry.pl',
      telephone: '+48601619898',
      email: 'serwis@takma.com.pl',
      image: 'https://www.serwis-zebry.pl/takma_logo_1.png',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Poświęcka 1a',
        addressLocality: 'Wrocław',
        postalCode: '51-128',
        addressRegion: 'dolnośląskie',
        addressCountry: 'PL',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:30',
        closes: '15:30',
      },
      priceRange: '$$',
      areaServed: {
        '@type': 'Country',
        name: 'Polska',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Naprawa drukarek etykiet Zebra',
            brand: { '@type': 'Brand', name: 'Zebra Technologies' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Naprawa terminali mobilnych Zebra',
            brand: { '@type': 'Brand', name: 'Zebra Technologies' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Naprawa skanerów kodów kreskowych Zebra',
            brand: { '@type': 'Brand', name: 'Zebra Technologies' },
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Naprawa tabletów przemysłowych Zebra',
            brand: { '@type': 'Brand', name: 'Zebra Technologies' },
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.serwis-zebry.pl' },
        { '@type': 'ListItem', position: 2, name: 'Kontakt', item: 'https://www.serwis-zebry.pl/kontakt' },
      ],
    },
  ],
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {children}
    </>
  )
}
