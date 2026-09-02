import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { metadata as seoMetadata, viewport as seoViewport } from './metadata'
import { Analytics } from '@vercel/analytics/next'
import CookieBanner from '@/components/CookieBanner'
import CzyszczenieAdresu from '@/components/CzyszczenieAdresu'
import GaClickTracker from '@/components/GaClickTracker'

const GA_MEASUREMENT_ID = 'G-JVWERC1N4J'
const GTM_ID = 'GTM-55KB354V'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = seoMetadata
export const viewport = seoViewport

// Organization JSON-LD (site-wide)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TAKMA",
  "legalName": "TAKMA - Autoryzowany Serwis Zebra",
  "url": "https://www.serwis-zebry.pl",
  "logo": "https://www.serwis-zebry.pl/takma_logo_1.png",
  "telephone": "+48601619898",
  "email": "serwis@takma.com.pl",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Poświęcka 1a",
    "addressLocality": "Wrocław",
    "postalCode": "51-128",
    "addressCountry": "PL"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+48601619898",
    "contactType": "customer service",
    "availableLanguage": "Polish"
  },
  "hasCredential": {
    "@type": "EducationalOccupationalCredential",
    "credentialCategory": "Zebra Premier Partner"
  },
  "knowsAbout": [
    "Zebra Technologies",
    "Drukarki etykiet Zebra",
    "Terminale mobilne Zebra",
    "Skanery kodów kreskowych Zebra",
    "Głowice drukujące Zebra",
    "Serwis drukarek przemysłowych"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={inter.className}>
      <head>
        {/* Google Consent Mode — MUSI wykonać się przed gtag.js.
            Zwykły <script> w <head> Next.js przenosi za loader tagu (sprawdzone:
            loader na pozycji 938, zgody dopiero na 10664), przez co tryb zgody
            potrafi nie zadziałać. strategy="beforeInteractive" wymusza właściwą kolejność. */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'functionality_storage': 'granted',
              'personalization_storage': 'denied',
              'security_storage': 'granted',
              'wait_for_update': 500
            });

            // Przy 'ad_storage: denied' identyfikator kliknięcia reklamy (gclid) nie trafia
            // do cookie, więc Ads nie wiąże zgłoszenia z reklamą. Sprawdzone 20.08.2026:
            // akcje repair_form_submit / phone_click / email_click miały przez 12 miesięcy
            // ZERO konwersji, mimo że GA4 rejestrował zdarzenia (takma.com.pl, bez trybu
            // zgody, liczy je normalnie). url_passthrough przenosi gclid w adresie URL
            // zamiast w cookie — atrybucja częściowo wraca, zgoda pozostaje uszanowana.
            gtag('set', 'url_passthrough', true);
          `}
        </Script>
        
        {/* GA4 ładowany JEDEN raz, niżej przez <Script strategy="afterInteractive">.
            Był tu drugi, zwykły <script async> z tym samym identyfikatorem — Next wypychał
            go na początek <head> (pozycja 972), czyli PRZED zgodami, przez co tryb zgody
            nie obejmował pierwszego wywołania tagu. Usunięty 20.08.2026. */}
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window,document,"clarity","script","ven6eu21m2");
            `
          }}
        />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Bez preloadu logo (3 kB): z fetchPriority=high wyprzedzało zdjęcie
            produktu, czyli element LCP na kartach urządzeń (Lighthouse: Load Delay 1,7 s) */}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-55KB354V" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }}
        />
        
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Ahrefs Analytics */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="5AYD3aK+2pPtyY/MWPW4BQ"
          strategy="beforeInteractive"
        />

        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Przejdź do treści
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <CookieBanner />
        <CzyszczenieAdresu />
        <GaClickTracker />
        <Analytics />
      </body>
    </html>
  )
}