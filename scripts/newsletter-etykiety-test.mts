/**
 * Podgląd mailingu 1/3 (oferta etykiet dobrana do modelu) — wysyłka TESTOWA
 * trzech wariantów na skrzynkę właściciela. Lokalny klucz Resend jest
 * piaskownicą: nadawca onboarding@resend.dev, odbiorca tylko właściciel konta.
 *
 *   set -a; source .env.local; set +a; node scripts/newsletter-etykiety-test.mts
 */
import { Resend } from 'resend'
import {
  generateLabelOfferEmail,
  labelOfferSubject,
  promoBlockFor,
} from '../lib/email/newsletter-etykiety.ts'

const DO = process.env.TEST_TO || 'jakub.tiuchty@gmail.com'
const SITE = 'https://www.serwis-zebry.pl'

const config = (model: string) => ({
  validUntil: '31 grudnia 2026',
  offerUrl: `${SITE}/kontakt?temat=etykiety`,
  shopUrl: 'https://www.takma.com.pl/etykiety-termiczne-zebra',
  unsubscribeUrl: `${SITE}/wypisz`,
  heroImageUrl: `${SITE}/newsletter/hero-etykiety.jpeg`,
  promo: promoBlockFor(model, {
    successorThermal: `${SITE}/newsletter/zd421d-nastepca.jpeg`,
    successorTransfer: `${SITE}/newsletter/zd421t-nastepca.jpeg`,
    contract: `${SITE}/newsletter/kontrakt-serwisowy.jpeg`,
  }),
})

// Trzy ścieżki szablonu: termiczna starsza seria → ZD421d, termotransferowa
// starsza seria → ZD421t, nowsza drukarka → kontrakt serwisowy
const WARIANTY = [
  { printerModel: 'GK420d', firstName: 'Jakub', company: 'TAKMA', repairWhen: 'W maju' },
  { printerModel: 'GX430t', firstName: 'Jakub', company: 'TAKMA', repairWhen: 'W czerwcu' },
  { printerModel: 'ZD421t', firstName: 'Jakub', company: 'TAKMA', repairWhen: null },
]

const resend = new Resend(process.env.RESEND_API_KEY)

for (const w of WARIANTY) {
  const html = generateLabelOfferEmail(w, config(w.printerModel))
  const { data, error } = await resend.emails.send({
    from: 'Serwis Zebra <onboarding@resend.dev>',
    to: DO,
    subject: `[TEST ${w.printerModel}] ${labelOfferSubject(w.printerModel)}`,
    html,
  })
  console.log(w.printerModel, error ? `BŁĄD: ${JSON.stringify(error)}` : `wysłany, id ${data?.id}, ${Math.round(html.length / 1024)} kB`)
}
