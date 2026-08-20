import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContractPurchasePanel from '@/components/shop/ContractPurchasePanel'

export const dynamic = 'force-dynamic'

const SLUG = 'kontrakt-serwisowy-3-lata'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface ContractProduct {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  price_brutto: number
}

async function getContractProduct(): Promise<ContractProduct | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?slug=eq.${SLUG}&is_active=eq.true&select=id,name,slug,sku,price,price_brutto`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0] || null
  } catch {
    return null
  }
}

const scope = [
  {
    title: 'Odbiór kurierem i odesłanie w cenie',
    desc: 'Zamawiasz kuriera jednym zgłoszeniem. Transport w obie strony jest po naszej stronie.',
  },
  {
    title: 'Diagnostyka i robocizna bez dopłat',
    desc: 'Nie dostajesz rachunku za każdą godzinę pracy technika ani za samo ustalenie usterki.',
  },
  {
    title: 'Naprawa w 48 godzin roboczych',
    desc: 'Liczymy od dostarczenia sprzętu do naszego serwisu, a nie od momentu nadania.',
  },
  {
    title: 'Urządzenie zastępcze na czas naprawy',
    desc: 'Udostępniamy je w miarę dostępności sprzętu w naszej wypożyczalni — nie zostajesz bez druku.',
  },
  {
    title: 'Przegląd z czyszczeniem raz w roku',
    desc: 'Wyczyszczona ścieżka nośnika i głowica to mniej zacięć i dłuższe życie części zużywalnych.',
  },
  {
    title: 'Głowica i pozostałe części 40% taniej',
    desc: 'Głowica jest częścią zużywalną, więc nie wchodzi w ryczałt — ale kupujesz ją ze stałym rabatem.',
  },
]

const steps = [
  {
    title: 'Podaj model i numer seryjny',
    desc: 'Kontrakt przypisujemy do konkretnego urządzenia, dlatego numer seryjny jest obowiązkowy.',
  },
  {
    title: 'Zapłać online',
    desc: 'Przelewy24, BLIK albo karta. Fakturę VAT wystawiamy od razu po zaksięgowaniu wpłaty.',
  },
  {
    title: 'Ochrona rusza tego samego dnia',
    desc: 'Dostajesz potwierdzenie z numerem kontraktu. Przy każdym zgłoszeniu wystarczy numer seryjny.',
  },
]

export default async function ContractPage() {
  const product = await getContractProduct()
  if (!product) notFound()

  return (
    <>
      <Header currentPage="other" />

      <main className="bg-slate-50">
        {/* Hero */}
        <section className="bg-slate-900">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Trzy lata bez rachunków za robociznę
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-300">
                Jedna opłata z góry zamiast faktury po każdej awarii. Kontrakt obejmuje transport,
                diagnostykę, robociznę i coroczny przegląd jednej drukarki Zebra.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                Zebra sprzedaje swój pakiet opieki tylko w pierwszych 30 dniach od zakupu urządzenia.
                Nasz wykupisz w dowolnym momencie — także do drukarki, która pracuje u Ciebie od lat.
              </p>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black lg:max-w-md lg:justify-self-end">
              <Image
                src="/newsletter/kontrakt-serwisowy.jpeg"
                alt="Drukarka Zebra ZD421 objęta kontraktem serwisowym TAKMA"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start lg:py-16">
          {/* Zakres */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Co obejmuje kontrakt</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {scope.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-bold text-slate-900">Jak to działa</h2>
            <ol className="mt-6 space-y-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-2xl font-bold text-slate-900">Czy to się opłaca</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Połowa napraw drukarek biurkowych kończy się u nas rachunkiem powyżej 455 zł netto.
              Dwie takie naprawy w ciągu trzech lat to już ponad 900 zł — i za każdym razem
              transport, przestój oraz oczekiwanie na wycenę. Kontrakt kosztuje 599 zł netto,
              czyli 16,64 zł miesięcznie, i zdejmuje z Ciebie zarówno rachunek, jak i całą procedurę.
            </p>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900">Zastrzeżenia, o których warto wiedzieć</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                <li>
                  Kontrakt obejmuje jedno urządzenie o podanym numerze seryjnym. Przy kilku drukarkach
                  dodaj do koszyka tyle kontraktów, ile urządzeń chcesz objąć.
                </li>
                <li>
                  Urządzenie zastępcze udostępniamy w miarę dostępności sprzętu w naszej wypożyczalni.
                </li>
                <li>
                  Kontrakt nie obejmuje materiałów eksploatacyjnych ani uszkodzeń powstałych z winy
                  użytkownika — te wyceniamy osobno, ze stałym rabatem 40% na części.
                </li>
              </ul>
            </div>
          </div>

          {/* Panel zakupu */}
          <div className="lg:sticky lg:top-24">
            <ContractPurchasePanel
              productId={product.id}
              name="Kontrakt serwisowy na 3 lata"
              slug={product.slug}
              sku={product.sku}
              priceNetto={Number(product.price)}
              priceBrutto={Number(product.price_brutto)}
            />
            <p className="mt-4 px-1 text-xs leading-relaxed text-slate-500">
              Masz więcej niż pięć drukarek albo urządzenia przemysłowe? Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold text-slate-700 underline">
                serwis@takma.com.pl
              </a>{' '}
              — przygotujemy wycenę dla całej floty.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
