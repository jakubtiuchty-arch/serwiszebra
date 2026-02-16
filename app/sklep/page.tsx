import Link from 'next/link'
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
    answer: '203 DPI (8 punktów/mm) to standardowa rozdzielczość wystarczająca dla etykiet logistycznych, kodów kreskowych 1D i etykiet wysyłkowych. 300 DPI (12 punktów/mm) oferuje wyższą jakość — idealna dla małych kodów 2D (QR, DataMatrix), drobnego tekstu i etykiet farmaceutycznych. Głowica 300 DPI jest droższa (zwykle o 50-100%) i ma krótszą żywotność niż 203 DPI. Głowice nie są zamienne między rozdzielczościami — drukarka rozpoznaje zainstalowaną rozdzielczość automatycznie.'
  }
]

export default function SklepPage() {
  return (
    <>
      <Header currentPage="other" />
      <ShopSubheader breadcrumbs={[{ label: 'Sklep', href: '/sklep' }]} />

      <div className="min-h-screen bg-gray-50">
        {/* Hero - SSR */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8 md:py-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-xs sm:text-sm">Sklep z częściami</span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Części Zamienne Zebra
            </h1>

            <p className="text-sm text-gray-600 mb-4 max-w-xl">
              Oryginalne głowice drukujące 203/300/600 DPI, wałki dociskowe i akumulatory.
              Wysyłka 24h, gwarancja producenta.
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible">
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-2.5 py-1 rounded-full text-xs whitespace-nowrap">
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-gray-700">Oryginalne</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-2.5 py-1 rounded-full text-xs whitespace-nowrap">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-gray-700">24h</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-2.5 py-1 rounded-full text-xs whitespace-nowrap">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-gray-700">Gwarancja</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Shop - Client Component */}
        <ShopMainPage />

        {/* === SEKCJA SEO 0: Key Facts Box === */}
        <section className="py-6 sm:py-8 bg-blue-50 border-t border-blue-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl border border-blue-200 p-5 sm:p-6 shadow-sm">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                Sklep TAKMA — oryginalne części zamienne Zebra
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>TAKMA</strong> to autoryzowany partner serwisowy <strong>Zebra Technologies</strong> w Polsce.
                Oferujemy wyłącznie <strong>100% oryginalne części zamienne</strong> do drukarek etykiet Zebra:
                głowice drukujące w rozdzielczościach <strong>203, 300 i 600 DPI</strong>, wałki dociskowe (platen roller)
                oraz akumulatory do urządzeń mobilnych. Wszystkie komponenty pochodzą z oficjalnego kanału dystrybucji
                i objęte są <strong>12-miesięczną gwarancją producenta</strong>. Wysyłka z magazynu w Polsce
                w ciągu <strong>24 godzin</strong>. Obsługujemy klientów biznesowych (B2B) na fakturę z odroczonym terminem płatności.
                Oprócz sprzedaży części oferujemy <strong>profesjonalną wymianę w serwisie</strong> — z odbiorem kurierskim
                i kalibracją po montażu.
              </p>
            </div>
          </div>
        </section>

        {/* === SEKCJA SEO 1: Rozszerzony przewodnik kupującego (~800 słów) === */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Części zamienne Zebra — kompletny przewodnik kupującego
            </h2>
            <div className="prose prose-sm sm:prose-base prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                W naszym sklepie znajdziesz <strong>oryginalne części zamienne do drukarek etykiet Zebra</strong> —
                głowice drukujące, wałki dociskowe, akumulatory i akcesoria. Jako autoryzowany partner serwisowy Zebra
                Technologies oferujemy wyłącznie komponenty z gwarancją producenta, zapewniające pełną kompatybilność
                i niezawodność. Każda część w naszym sklepie jest fabrycznie nowa i pochodzi z oficjalnego kanału
                dystrybucji Zebra Technologies. Dostarczamy do firm w całej Polsce — od małych biur po duże centra
                logistyczne i zakłady produkcyjne.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Głowice drukujące Zebra — serce drukarki etykiet</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Głowica drukująca (printhead)</strong> to kluczowy element drukarki etykiet — odpowiada za
                przenoszenie obrazu na materiał metodą termiczną. Zawiera setki mikro-elementów grzewczych, które
                kontrolowanym nagrzewaniem aktywują papier termiczny lub topią taśmę barwiącą (ribbon). Od stanu głowicy
                zależy jakość wydruku, czytelność kodów kreskowych i ogólna niezawodność procesu etykietowania.
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
                Wybór rozdzielczości głowicy zależy od wymagań aplikacji. Poniższa tabela pomoże dobrać
                optymalną rozdzielczość do Twoich potrzeb:
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
                      <td className="px-4 py-2 font-medium text-gray-900">Cena głowicy (od)</td>
                      <td className="px-4 py-2 text-gray-600">~400 zł netto</td>
                      <td className="px-4 py-2 text-gray-600">~800 zł netto</td>
                      <td className="px-4 py-2 text-gray-600">~2 000 zł netto</td>
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
                <strong>Wałek dociskowy (platen roller)</strong> to gumowy cylinder zapewniający równomierny transport
                etykiety pod głowicą drukującą. Współpracuje z głowicą, zapewniając stały docisk materiału na całej
                szerokości druku. Zużyty wałek powoduje paski, nierówny wydruk i przyspieszony wear głowicy —
                Zebra zaleca wymianę wałka przy każdej wymianie głowicy. Średnia żywotność to <strong>150-300 km
                wydruku</strong> (500 000 - 1 000 000 etykiet). Popularne Part Numbers:{' '}
                <strong>P1058930-080</strong> (ZT411), <strong>P1083347-005</strong> (ZT610),{' '}
                <strong>P1112640-016</strong> (ZD421/ZD621).{' '}
                <Link href="/sklep/walki" className="text-blue-600 hover:text-blue-800 font-medium">
                  Zobacz wałki dociskowe →
                </Link>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Akumulatory do urządzeń mobilnych Zebra</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Oryginalne <strong>akumulatory litowo-jonowe (Li-Ion)</strong> do drukarek mobilnych (ZQ520, ZQ630),
                terminali (TC21, TC52, TC72) i skanerów Zebra. Pojemności od 2500 mAh do 6400 mAh, zapewniające
                4-14 godzin pracy na jednym ładowaniu. Żywotność: 300-500 pełnych cykli ładowania (2-3 lata).
                Certyfikowane ogniwa z zabezpieczeniami przed przegrzaniem, przeładowaniem i zwarciem.{' '}
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

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Dlaczego kupować u nas?</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
                <li><strong>Autoryzowany partner serwisowy Zebra</strong> — certyfikowane kompetencje i bezpośredni dostęp do oryginalnych części</li>
                <li><strong>100% oryginalne części</strong> z gwarancją producenta 12 miesięcy — żadnych zamienników ani refabrykowanych komponentów</li>
                <li><strong>Magazyn w Polsce</strong> — wysyłka w 24h dla produktów na stanie, 3-7 dni dla części z magazynu centralnego Zebra</li>
                <li><strong>Profesjonalny serwis wymiany</strong> — jeśli nie chcesz wymieniać samodzielnie, zrobimy to za Ciebie z odbiorem kurierskim</li>
                <li><strong>Wsparcie techniczne</strong> — pomoc w doborze części, diagnostyce problemów i kalibracji po wymianie</li>
                <li><strong>Faktury VAT z odroczonym terminem</strong> — obsługujemy klientów biznesowych (B2B) z elastycznymi warunkami płatności</li>
              </ul>
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
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-gray-900">{item.question}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === SEKCJA SEO 4: CTA Box === */}
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 sm:p-8 text-center">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                Nie wiesz jaką część wybrać?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-5 max-w-xl mx-auto">
                Zadzwoń lub napisz — pomożemy dobrać odpowiedni komponent do Twojej drukarki Zebra.
                Nasi technicy znają każdy model i doradzą najlepsze rozwiązanie.
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
