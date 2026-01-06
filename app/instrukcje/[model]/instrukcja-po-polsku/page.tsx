import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ChevronRight, 
  ArrowLeft,
  BookOpen,
  Clock,
} from 'lucide-react'
import { getPolishManual } from '@/lib/polish-manuals'
import PolishManualContent from '@/components/PolishManualContent'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Pobierz dane modelu
async function getManual(model: string) {
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .ilike('model', model)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

// Metadata
export async function generateMetadata({ params }: { params: { model: string } }): Promise<Metadata> {
  const modelName = params.model.replace(/^zebra-/i, '')
  const manual = await getManual(modelName)
  const polishManual = getPolishManual(modelName)
  
  if (!manual || !polishManual) {
    return {
      title: 'Instrukcja nie znaleziona',
      description: 'Nie znaleziono polskiej instrukcji dla tego modelu.'
    }
  }

  // Połącz słowa kluczowe z polishManual z dodatkowymi
  const allKeywords = [
    ...(polishManual.keywords || []),
    `${manual.model} instrukcja po polsku`,
    `${manual.model} instrukcja polska`,
    `${manual.model} instrukcja pdf`,
    `zebra ${manual.model} manual pl`,
    `instrukcja obsługi ${manual.model} po polsku`,
    `${manual.model} instrukcja pdf pobierz`,
  ]

  return {
    title: `${polishManual.title} | Serwis Zebra`,
    description: `Polska skrócona instrukcja obsługi ${manual.model}. Kalibracja, zakładanie etykiet, błędy LED, czyszczenie głowicy, reset fabryczny. Najważniejsze informacje po polsku. Pobierz PDF.`,
    keywords: allKeywords,
    openGraph: {
      title: polishManual.title,
      description: `Polska skrócona instrukcja obsługi ${manual.model}. Kalibracja, błędy, konserwacja. Pobierz PDF.`,
      url: `https://www.serwis-zebry.pl/instrukcje/zebra-${manual.model.toLowerCase()}/instrukcja-po-polsku`,
    },
    alternates: {
      canonical: `https://www.serwis-zebry.pl/instrukcje/zebra-${manual.model.toLowerCase()}/instrukcja-po-polsku`,
    },
  }
}

export default async function PolishManualPage({ params }: { params: { model: string } }) {
  const modelName = params.model.replace(/^zebra-/i, '')
  const manual = await getManual(modelName)
  const polishManual = getPolishManual(modelName)
  
  if (!manual || !polishManual) {
    notFound()
  }

  const modelSlug = `zebra-${manual.model.toLowerCase()}`

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-blue-600">
                Strona główna
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href="/instrukcje" className="text-gray-500 hover:text-blue-600">
                Instrukcje
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link href={`/instrukcje/${modelSlug}`} className="text-gray-500 hover:text-blue-600">
                {manual.model}
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Instrukcja po polsku</span>
            </nav>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Back link */}
          <Link 
            href={`/instrukcje/${modelSlug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Powrót do dokumentacji {manual.model}
          </Link>

          {/* Header */}
          <div className="rounded-2xl p-8 mb-8 relative overflow-hidden border border-gray-200 shadow-lg bg-white">
            {/* Czerwona dolna połowa z gradientem opacity od prawej do lewej */}
            <div className="absolute inset-0 top-1/2 bg-gradient-to-l from-red-500 via-red-500 via-5% to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-red-700 mb-2">
                <span className="text-sm font-bold drop-shadow-sm">INSTRUKCJA PO POLSKU</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 drop-shadow-sm">
                {polishManual.title}
              </h1>
              <p className="text-gray-800 max-w-2xl font-medium drop-shadow-sm">
                Skrócona instrukcja z najważniejszymi informacjami po polsku. 
                Kalibracja, zakładanie mediów, rozwiązywanie problemów i konserwacja.
              </p>
              <div className="flex items-center gap-4 mt-4 text-gray-800 text-sm font-medium drop-shadow-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Aktualizacja: {polishManual.lastUpdated}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {polishManual.sections.length} rozdziałów
                </span>
              </div>
            </div>
          </div>

          {/* Kliencki komponent z treścią i przyciskiem PDF */}
          <PolishManualContent 
            polishManual={polishManual}
            modelSlug={modelSlug}
            modelName={manual.model}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}
