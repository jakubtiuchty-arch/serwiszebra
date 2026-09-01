import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import ShopMainPage from '@/components/shop/ShopMainPage'
import {
  ShoppingCart,
  Truck,
  Shield,
  Check,
  Phone
} from 'lucide-react'

const faqItems = [
  {
    question: 'Jak zamówić głowicę do mojej drukarki Zebra?',
    answer: 'Znajdź model swojej drukarki na tabliczce znamionowej, sprawdź rozdzielczość (203/300/600 DPI) w raporcie konfiguracji, a następnie wybierz właściwą głowicę w naszym sklepie. Jeśli nie jesteś pewien — zadzwoń pod 601 619 898 lub napisz na stronie kontaktowej, a pomożemy dobrać właściwą część.'
  },
  {
    question: 'Jaki jest czas dostawy?',
    answer: 'Produkty dostępne na magazynie wysyłamy w ciągu 24 godzin od złożenia zamówienia. Części sprowadzane z magazynu centralnego Zebra dostarczamy w ciągu 3-7 dni roboczych. Aktualny status dostępności widoczny jest przy każdym produkcie.'
  },
  {
    question: 'Czy oferujecie wymianę głowicy w serwisie?',
    answer: 'Tak. Oferujemy profesjonalną wymianę głowicy i wałka w naszym serwisie. Odbieramy drukarkę kurierem, wymieniamy części, kalibrujemy i odsyłamy.'
  },
  {
    question: 'Czy sprzedajecie oryginalne części Zebra?',
    answer: 'Tak, 100% naszego asortymentu to oryginalne części Zebra Technologies. Jako autoryzowany partner serwisowy mamy bezpośredni dostęp do oryginalnych komponentów z gwarancją producenta. Nie oferujemy zamienników ani części refabrykowanych.'
  },
  {
    question: 'Jak sprawdzić jaki model głowicy potrzebuję?',
    answer: 'Najłatwiej sprawdzić Part Number na obecnej głowicy — jest wygrawerowany lub wydrukowany na jej boku. Alternatywnie, podaj nam model drukarki i rozdzielczość (DPI), a dobierzemy właściwą głowicę. Model drukarki znajdziesz na tabliczce znamionowej, a rozdzielczość w raporcie konfiguracji drukarki.'
  },
  {
    question: 'Czy mogę zwrócić zamówiony produkt?',
    answer: 'Tak, przyjmujemy zwroty w ciągu 14 dni od otrzymania przesyłki — produkt musi być nieużywany, w oryginalnym opakowaniu. W przypadku zamówienia błędnej części skontaktuj się z nami, a pomożemy wymienić na właściwą.'
  },
  {
    question: 'Jak samodzielnie wymienić głowicę drukującą?',
    answer: 'Wymiana głowicy to prosta czynność serwisowa zajmująca 5-10 minut. Wyłącz drukarkę, otwórz obudowę, odłącz taśmę flat cable ze starej głowicy, odkręć 2-4 śruby mocujące, zamontuj nową głowicę i podłącz kabel. Po wymianie wykonaj kalibrację czujników (Media Calibration) i wydrukuj raport konfiguracji. Jeśli wolisz — oferujemy profesjonalną wymianę w serwisie z kalibracją i gwarancją.'
  },
  {
    question: 'Jak czyścić głowicę drukarki Zebra?',
    answer: 'Do czyszczenia głowicy używaj wyłącznie alkoholu izopropylowego (IPA) o stężeniu 99%. Przetrzyj elementy grzewcze wacikiem lub dedykowaną kartą czyszczącą Zebra. Czyść głowicę co każdą rolkę materiału lub minimum raz w tygodniu. Regularne czyszczenie wydłuża żywotność głowicy nawet 2-3 krotnie. Nigdy nie używaj wody, acetonu ani ostrych narzędzi.'
  },
  {
    question: 'Jaka jest żywotność głowicy drukującej Zebra?',
    answer: 'Oryginalna głowica Zebra ma żywotność 1-2 miliony cali druku (25-50 km etykiet), co przy typowym użyciu przekłada się na 1-3 lata. Żywotność zależy od rozdzielczości (203 DPI wytrzymuje dłużej niż 600 DPI), jakości materiałów, częstotliwości czyszczenia i ustawień ciemności (Darkness). Głowice do drukarek przemysłowych pracujących 24/7 mogą wymagać wymiany częściej.'
  },
  {
    question: 'Jaka jest różnica między głowicą 203 DPI a 300 DPI?',
    answer: '203 DPI (8 punktów/mm) to standardowa rozdzielczość wystarczająca dla etykiet logistycznych, kodów kreskowych 1D i etykiet wysyłkowych. 300 DPI (12 punktów/mm) oferuje wyższą jakość — idealna dla małych kodów 2D (QR, DataMatrix), drobnego tekstu i etykiet farmaceutycznych. Głowica 300 dpi kosztuje więcej i ma krótszą żywotność niż 203 dpi. Głowice nie są zamienne między rozdzielczościami — drukarka rozpoznaje zainstalowaną rozdzielczość automatycznie.'
  }
]

export default function SklepPage() {
  return (
    <>
      <Header currentPage="other" />
      <ShopSubheader breadcrumbs={[{ label: 'Sklep', href: '/sklep' }]} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero - SSR; pełnowymiarowa grafika (full-bleed) jak w kategoriach */}
        <section className="relative overflow-hidden bg-slate-900">
          <Image
            src="/sklep_photo/hero/sklep-v8.jpeg"
            alt="Stanowisko wysyłkowe sklepu: drukarka etykiet Zebra w otwartym kartonie, zapakowana paczka, rolki etykiet i części zamienne"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] sm:object-right"
          />
          {/* Na telefonie tekst zajmuje całą szerokość, więc pas gradientu po lewej
              nie wystarcza — tam przyciemniamy równomiernie. Krycie tylko ze skali
              Tailwinda (co 5%), bo wartości spoza niej nie generują klasy. */}
          <div className="absolute inset-0 bg-slate-950/75 sm:bg-transparent sm:bg-gradient-to-r sm:from-slate-950 sm:from-22% sm:via-slate-950/70 sm:via-52% sm:to-transparent sm:to-80%" />
          <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-10 md:py-12 min-h-[200px] md:min-h-[240px] flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-2">
              Urządzenia i części zamienne Zebra
            </h1>

            <p className="text-sm text-gray-200 mb-4 max-w-xl">
              Drukarki etykiet, terminale, skanery i tablety Zebra oraz części zamienne:
              głowice 203, 300 i 600 dpi, wałki dociskowe, akumulatory i moduły łączności.
              Ceny i stany magazynowe pobieramy na żywo od dystrybutorów, a naprawy
              gwarancyjne prowadzimy we własnym autoryzowanym serwisie Zebry.
            </p>

          </div>
        </section>

        {/* Interactive Shop - Client Component */}
        <ShopMainPage />

        {/* === SEKCJA SEO 1: Rozszerzony przewodnik kupującego (~800 słów) === */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Jak dobrać część zamienną do drukarki Zebra
            </h2>
            <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Części zamienne dobiera się do konkretnego modelu drukarki i jego rozdzielczości — ten sam
                element w wersji 203 i 300 dpi ma inny numer katalogowy i nie jest zamienny. Poniżej zebraliśmy
                dane, które rozstrzygają wybór: co robi każdy z podzespołów, ile realnie wytrzymuje i po czym
                poznać, że nadchodzi wymiana.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Głowica drukująca</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Głowica zawiera rząd mikroskopijnych elementów grzewczych: nagrzewają one papier termoczuły albo
                topią taśmę barwiącą. Zużyta głowica daje białe pasy wzdłuż wydruku i kody kreskowe, których czytnik
                nie odczyta — pojedynczy przepalony element grzewczy widać jako cienką, niezadrukowaną linię biegnącą
                przez całą etykietę.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Oferujemy głowice w rozdzielczościach <strong>203, 300 i 600 DPI</strong> do drukarek biurkowych
                (ZD220, ZD421, ZD621, GK420, GX420) oraz przemysłowych (ZT230, ZT411, ZT421, ZT510, ZT610, ZT620,
                105SL Plus, ZM400). Najpopularniejsze Part Numbers w naszym sklepie to:{' '}
                <strong>P1058930-009</strong> (ZT411 203 DPI),{' '}
                <strong>P1058930-010</strong> (ZT411 300 DPI),{' '}
                <strong>P1112640-019</strong> (ZD421 203 DPI) oraz{' '}
                <strong>P1083320-010</strong> (ZT610 203 DPI).
                Żywotność oryginalnej głowicy Zebra to <strong>1-2 miliony cali druku</strong> (25-50 km etykiet)
                w zależności od rozdzielczości i stosowanych materiałów.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sprawdź naszą pełną ofertę w kategorii{' '}
                <Link href="/sklep/glowice" className="text-blue-600 hover:text-blue-800 font-medium">
                  głowice drukujące Zebra →
                </Link>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                Porównanie rozdzielczości: 203 DPI vs 300 DPI vs 600 DPI
              </h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                Rozdzielczości nie da się zmienić w tej samej drukarce — głowica 203 dpi i 300 dpi to dwa
                różne numery katalogowe. Poniżej różnice, które rozstrzygają wybór:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Parametr</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">203 DPI</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">300 DPI</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">600 DPI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">Punkty na mm</td>
                      <td className="px-4 py-2 text-gray-600">8</td>
                      <td className="px-4 py-2 text-gray-600">12</td>
                      <td className="px-4 py-2 text-gray-600">24</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">Zastosowania</td>
                      <td className="px-4 py-2 text-gray-600">Logistyka, kody 1D, etykiety wysyłkowe</td>
                      <td className="px-4 py-2 text-gray-600">Kody 2D, farmacja, elektronika, drobny tekst</td>
                      <td className="px-4 py-2 text-gray-600">Jubilerstwo, mikro-kody, etykiety precyzyjne</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">Żywotność</td>
                      <td className="px-4 py-2 text-gray-600">50-150 km</td>
                      <td className="px-4 py-2 text-gray-600">30-100 km</td>
                      <td className="px-4 py-2 text-gray-600">20-50 km</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">Min. kod kreskowy</td>
                      <td className="px-4 py-2 text-gray-600">X-dim 0.25 mm</td>
                      <td className="px-4 py-2 text-gray-600">X-dim 0.17 mm</td>
                      <td className="px-4 py-2 text-gray-600">X-dim 0.08 mm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Wałki dociskowe (platen roller)</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Gumowy wałek przesuwa etykietę pod głowicą i dociska ją na całej szerokości. Zużyty — spłaszczony
                w miejscach największego nacisku albo pokryty klejem — przesuwa materiał nierówno i zwiększa tarcie,
                przez co głowica zużywa się szybciej. Z tego powodu producent zaleca wymianę wałka przy każdej
                wymianie głowicy. Typowa żywotność to <strong>150–300 km wydruku</strong>. Najczęściej zamawiane
                numery katalogowe:{' '}
                <strong>P1058930-080</strong> (ZT411), <strong>P1083347-005</strong> (ZT610),{' '}
                <strong>P1112640-016</strong> (ZD421/ZD621).{' '}
                <Link href="/sklep/walki-dociskowe" className="text-blue-600 hover:text-blue-800 font-medium">
                  Zobacz wałki dociskowe →
                </Link>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Akumulatory do urządzeń mobilnych Zebra</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Akumulatory do drukarek mobilnych, terminali i skanerów. Pojemności od 2500 do 6400 mAh, co przy
                typowym obciążeniu daje od czterech do czternastu godzin pracy. Ogniwo wytrzymuje 300–500 pełnych
                cykli ładowania, czyli zwykle dwa do trzech lat codziennej pracy — po tym czasie czas pracy skraca
                się na tyle, że urządzenie nie dociąga do końca zmiany.{' '}
                <Link href="/sklep/akumulatory" className="text-blue-600 hover:text-blue-800 font-medium">
                  Zobacz akumulatory Zebra →
                </Link>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Jak dobrać odpowiednią część?</h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                Dobór właściwego komponentu wymaga znajomości modelu drukarki i rozdzielczości. Oto 3 proste kroki:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                <li>
                  <strong>Znajdź model drukarki</strong> — sprawdź tabliczkę znamionową na spodzie lub z tyłu urządzenia
                  (np. ZD421t, ZT610). Part Number głowicy znajdziesz też wygrawerowany na obecnej głowicy.
                </li>
                <li>
                  <strong>Sprawdź rozdzielczość</strong> — wydrukuj raport konfiguracji (Configuration Report) z menu
                  drukarki. Znajdziesz tam wartość &quot;RESOLUTION&quot; podaną w DPI (203, 300 lub 600).
                </li>
                <li>
                  <strong>Zamów online lub zadzwoń</strong> — wybierz właściwą część w sklepie lub skontaktuj się
                  z nami pod numerem{' '}
                  <a href="tel:+48601619898" className="text-blue-600 hover:text-blue-800 font-medium">
                    601 619 898
                  </a>{' '}
                  — pomożemy dobrać komponent i potwierdzimy kompatybilność.
                </li>
              </ol>

            </div>
          </div>
        </section>

        {/* === SEKCJA SEO 2: Rozbudowana tabela modeli (20+) === */}
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Popularne modele drukarek Zebra i dostępne części zamienne
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Poniższa tabela zawiera najczęściej zamawiane modele drukarek Zebra wraz z Part Numbers głowic.
              Jeśli nie widzisz swojego modelu — <a href="tel:+48601619898" className="text-blue-600 hover:text-blue-800">zadzwoń</a>,
              sprowadzamy części do wszystkich modeli Zebra.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-200">Model drukarki</th>
                    <th className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-200">Rozdzielczości</th>
                    <th className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-200">Typ</th>
                    <th className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-200">Part Number głowicy</th>
                    <th className="px-3 py-3 font-semibold text-gray-700 border-b border-gray-200">Części</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Drukarki biurkowe */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={5} className="px-3 py-2 font-semibold text-blue-800 text-xs uppercase tracking-wide">Drukarki biurkowe</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZD220t / ZD230t</td>
                    <td className="px-3 py-2.5 text-gray-600">203 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1115690-007</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-biurkowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZD411t</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1112640-019 / -020</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-biurkowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZD421t</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1112640-019 / -020</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/biurkowe/zd421" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZD611t / ZD621t</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1112640-019 / -020</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/biurkowe/zd621" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">GK420t / GK420d</td>
                    <td className="px-3 py-2.5 text-gray-600">203 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">105934-037</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/biurkowe/gk420" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">GX420t / GX420d</td>
                    <td className="px-3 py-2.5 text-gray-600">203 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">105934-037</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-biurkowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">GX430t</td>
                    <td className="px-3 py-2.5 text-gray-600">300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Biurkowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">105934-038</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-biurkowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  {/* Drukarki przemysłowe */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={5} className="px-3 py-2 font-semibold text-blue-800 text-xs uppercase tracking-wide">Drukarki przemysłowe</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT230</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1037974-010 / -011</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/przemyslowe/zt230" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT410 / ZT411</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300, 600 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1058930-009 / -010 / -011</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/przemyslowe/zt411" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT420 / ZT421</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1058930-012 / -013</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/przemyslowe/zt421" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT510</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1083347-005 / -006</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-przemyslowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT610</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300, 600 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1083320-010 / -011 / -012</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/przemyslowe/zt610" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZT620</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1083320-015 / -016</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/przemyslowe/zt620" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">105SL Plus</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">P1053360-018 / -019</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-przemyslowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">ZM400</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300, 600 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">79800M / 79801M / 79802M</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-przemyslowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">S4M</td>
                    <td className="px-3 py-2.5 text-gray-600">203, 300 DPI</td>
                    <td className="px-3 py-2.5 text-gray-600">Przemysłowa</td>
                    <td className="px-3 py-2.5 text-gray-600 font-mono text-xs">G41400M / G41401M</td>
                    <td className="px-3 py-2.5">
                      <Link href="/sklep/glowice/drukarki-przemyslowe" className="text-blue-600 hover:text-blue-800 text-xs font-medium">Głowice →</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* === SEKCJA SEO 3: FAQ (10 pytań) === */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Najczęściej zadawane pytania
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                  <p className="font-semibold text-gray-900">{item.question}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SEKCJA SEO 4: CTA Box === */}
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8">
              <h2 className="mb-3 text-lg font-bold text-gray-900 sm:text-xl">
                Nie masz pewności, która część pasuje?
              </h2>
              <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
                Podaj model drukarki z tabliczki znamionowej albo numer katalogowy ze starej części —
                sprawdzimy zgodność i odpiszemy z konkretnym numerem do zamówienia.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="tel:+48601619898"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  601 619 898
                </a>
                <Link
                  href="/kontakt"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                >
                  Napisz do nas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Start", "item": "https://www.serwis-zebry.pl" },
            { "@type": "ListItem", "position": 2, "name": "Sklep" }
          ]
        }) }}
      />

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }) }}
      />
    </>
  )
}
