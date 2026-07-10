# A-DIFF: Content Expansion `/serwis-drukarek-zebra`

**Cel**: zwiększyć word count z **825 → ~2400 słów** (idealny zakres dla competitive service hub).

**Synergiczny efekt z budowanymi backlinkami** (pramed.pl + automatyka.pl) — content depth + linki = pchnięcie z pozycji 8.69 → TOP 3-5 w 4-8 tyg.

**5 zmian + opcjonalna 6**:

| # | Zmiana | Słowa | Lokalizacja | Czas |
|---|---|---|---|---|
| 1 | Rozbudowany cennik wg modelu (zastąpienie obecnego) | +400 | linie 581-609 | ~30 min |
| 2 | Najczęstsze awarie wg typu (NOWA) | +350 | po linii 541 (po Kategoriach) | ~30 min |
| 3 | Proces serwisowy krok po kroku (NOWA) | +250 | po Cenniku (po linii 609) | ~25 min |
| 4 | Czas realizacji (NOWA, mała) | +200 | po Procesie | ~15 min |
| 5 | Dlaczego nasz serwis (NOWA) | +250 | przed FAQ (po linii 610) | ~20 min |
| 6 (opcj.) | Pytania przed wyborem serwisu | +200 | po FAQ | ~15 min |

**Razem ~2 godziny pracy, +1450 słów.**

---

## Krok 0 — Importy ikon (lucide-react)

**Zmień obecny import** (linie 4-20):

```tsx
import {
  Printer,
  Truck,
  Clock,
  Shield,
  Phone,
  CheckCircle2,
  ChevronRight,
  Star,
  Monitor,
  Factory,
  Smartphone,
  CreditCard,
  BookOpen,
  Award,
  Wrench
} from 'lucide-react'
```

**Na**:

```tsx
import {
  Printer,
  Truck,
  Clock,
  Shield,
  Phone,
  CheckCircle2,
  ChevronRight,
  Star,
  Monitor,
  Factory,
  Smartphone,
  CreditCard,
  BookOpen,
  Award,
  Wrench,
  ClipboardList,
  Zap,
  Users,
  MapPin,
  AlertCircle,
  Package,
  Search
} from 'lucide-react'
```

(Dodano 7 nowych ikon: ClipboardList, Zap, Users, MapPin, AlertCircle, Package, Search)

---

## Zmiana 1 — Rozbudowany cennik wg modelu

**Lokalizacja**: ZASTĄP całą sekcję Cennik (linie 580-609)

**Obecny kod do zastąpienia** (linie 580-609):

```tsx
{/* Cennik - spójny z miastami */}
<section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
  <div className="max-w-5xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Cennik orientacyjny
    </h2>
    {/* ... 4 kafelki ... */}
  </div>
</section>
```

**Wstaw zamiast**:

```tsx
{/* Cennik - rozbudowany wg modelu */}
<section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
  <div className="max-w-6xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Cennik napraw drukarek Zebra wg modelu
    </h2>
    <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
      Ceny orientacyjne na podstawie typowych zleceń. Każda naprawa zaczyna się od <strong>bezpłatnej diagnostyki</strong> — dokładną wycenę otrzymujesz przed rozpoczęciem prac. Wszystkie ceny netto.
    </p>

    {/* Tabela cen wg typu drukarki */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Typ / model drukarki</th>
              <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Wymiana głowicy</th>
              <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Naprawa mechanizmu</th>
              <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Konserwacja</th>
              <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Diagnostyka</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Desktop ZD421/ZD420/ZD220</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">250-380 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">150-280 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">149 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Desktop GK420/GC420/GX420</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">250-400 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">150-300 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">149 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe ZT411/ZT421</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">580-980 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">350-650 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">250 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe ZT610/ZT620</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">1200-2499 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">580-1200 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">350 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe 105SL / S4M / Xi4</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">850-1800 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">450-900 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">250 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Mobilne ZQ520/ZQ630/ZQ521</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">380-650 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">250-450 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">199 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="p-3 sm:p-4 font-medium text-gray-900">Kart plastikowych ZC300/ZXP7</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">580-1500 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">350-850 zł</td>
              <td className="text-center p-3 sm:p-4 text-gray-700">199 zł</td>
              <td className="text-center p-3 sm:p-4 text-green-600 font-medium">bezpłatna</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Dodatkowe usługi */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
        <p className="text-xs text-gray-500 mb-1">Wałek dociskowy</p>
        <p className="text-base font-semibold text-gray-900">od 150 zł</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
        <p className="text-xs text-gray-500 mb-1">Wymiana ribbonu</p>
        <p className="text-base font-semibold text-gray-900">od 80 zł</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
        <p className="text-xs text-gray-500 mb-1">Naprawa płyty głównej</p>
        <p className="text-base font-semibold text-gray-900">od 350 zł</p>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md">
        <p className="text-xs text-gray-500 mb-1">Ekspres (24-48h)</p>
        <p className="text-base font-semibold text-gray-900">+50 zł</p>
      </div>
    </div>

    {/* Notatki cenowe */}
    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5">
      <p className="text-sm text-gray-700 leading-relaxed">
        <strong>Pamiętaj:</strong> ceny dotyczą napraw <strong>pogwarancyjnych</strong>. Naprawy <strong>gwarancyjne</strong> w ramach gwarancji producenta lub kontraktu Zebra OneCare są <strong>bezpłatne</strong>. Wszystkie naprawy obejmują 12-miesięczną gwarancję na nasze prace oraz oryginalne części Zebra.
      </p>
    </div>
  </div>
</section>
```

**Co to daje**:
- ranguje na: `cennik serwis drukarek zebra`, `ile kosztuje naprawa zd421`, `cennik napraw zt411`
- każdy wiersz tabeli to long-tail keyword opportunity
- "bezpłatna diagnostyka" + "12 mies gwarancji" — trust signals dla Google AI Overview

---

## Zmiana 2 — Najczęstsze awarie drukarek Zebra wg typu

**Lokalizacja**: WSTAW NOWĄ SEKCJĘ po Kategoriach drukarek (po linii 541, czyli po `</section>` zamykającym sekcję "Jakie drukarki serwisujemy?")

**Wstaw**:

```tsx
{/* Najczęstsze awarie wg typu */}
<section className="py-10 sm:py-12 md:py-14 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
  <div className="max-w-6xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Najczęstsze awarie drukarek Zebra wg typu
    </h2>
    <p className="text-sm text-gray-600 text-center mb-8 max-w-3xl mx-auto">
      25 lat doświadczenia w naprawach pozwala nam szybko zdiagnozować typową awarię — zwykle już na podstawie modelu i objawów.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {/* Desktop awarie */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
            <Monitor className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Drukarki desktop (ZD/GK)</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Zużyta głowica drukująca</strong> — najczęstsza naprawa po 2-3 latach intensywnej pracy. Objawy: białe pasy na wydruku, słaby kontrast.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Czerwona dioda</strong> (GK420, ZD420) — uszkodzony czujnik etykiet lub zacięty mechanizm.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Błąd kalibracji</strong> po wymianie etykiet — wymaga rekalibracji sensora taśmy.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Zacinanie się ribbonu</strong> — najczęściej zużyte rolki lub zła grubość taśmy.</span>
          </li>
        </ul>
      </div>

      {/* Przemysłowe awarie */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
            <Factory className="w-6 h-6 text-orange-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Drukarki przemysłowe (ZT/Xi4)</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Błąd ribbon</strong> (ZT410, ZT411) — uszkodzony czujnik taśmy lub błędna konfiguracja.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Awaria silnika krokowego</strong> — drukarka się nie rusza lub porusza nierówno.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Uszkodzona płyta główna</strong> — zwykle skutek przepięć lub upływu rocznego.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Problem z odklejaczem</strong> (peeler) — brak odklejania etykiet lub błąd sensora.</span>
          </li>
        </ul>
      </div>

      {/* Mobilne awarie */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
            <Smartphone className="w-6 h-6 text-green-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Drukarki mobilne (ZQ/QL)</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Zużyta bateria</strong> — najczęstsza wymiana po 18-24 miesiącach pracy.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Problem Bluetooth/WiFi</strong> — moduł komunikacyjny do wymiany.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Uszkodzony wyświetlacz LCD</strong> — typowa naprawa po upadku.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Zacięty mechanizm</strong> — kurz, zabrudzenia lub uszkodzenie wałków.</span>
          </li>
        </ul>
      </div>

      {/* Karty awarie */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
            <CreditCard className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Drukarki kart (ZC/ZXP)</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Awaria modułu kodowania</strong> magnetycznego/chipowego — najczęściej w ZC300/ZXP7.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Uszkodzony moduł laminacji</strong> (ZXP9) — wymiana folii i kalibracja.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Czyszczenie sensorów kart</strong> — kurz blokuje detekcję karty.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span><strong>Wymiana wałków transportowych</strong> — zużyte powodują zacinanie kart.</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="text-center mt-6 sm:mt-8">
      <p className="text-sm text-gray-600 mb-3">
        Nie widzisz swojej awarii? Zgłoś ją do nas — bezpłatna diagnostyka, dokładna wycena.
      </p>
      <Link
        href="/#formularz"
        className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        Zgłoś naprawę
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>
```

**Co to daje**:
- ranguje na long-tail: `naprawa zd421 czerwona dioda`, `błąd ribbon zt411`, `zebra zq520 bateria`
- 16 konkretnych objawów = 16 long-tail queries
- bardzo silny trust signal (specjalistyczna wiedza)

---

## Zmiana 3 — Proces serwisowy krok po kroku

**Lokalizacja**: WSTAW NOWĄ SEKCJĘ po Cenniku (po `</section>` zamykającym Cennik — po linii 609 jeśli nie wstawiałeś jeszcze nic powyżej)

**Wstaw**:

```tsx
{/* Proces serwisowy krok po kroku */}
<section className="py-10 sm:py-12 md:py-14 bg-white">
  <div className="max-w-6xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Jak wygląda naprawa drukarki Zebra — krok po kroku
    </h2>
    <p className="text-sm text-gray-600 text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
      Cały proces od zgłoszenia do zwrotu naprawionej drukarki zajmuje średnio 5-7 dni roboczych. Działamy na terenie całej Polski — kurier odbierze drukarkę bezpłatnie.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
      {/* Krok 1 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 relative">
        <div className="absolute -top-3 left-5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 1</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <ClipboardList className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Zgłoszenie online</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Wypełniasz formularz na stronie (model drukarki, opis problemu) lub dzwonisz na +48 601 619 898. Otrzymujesz numer zlecenia i zamawiamy kuriera.
        </p>
      </div>

      {/* Krok 2 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 relative">
        <div className="absolute -top-3 left-5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 2</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <Truck className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bezpłatny odbiór 24h</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Kurier DPD odbierze drukarkę z Twojej firmy w ciągu 24h od zgłoszenia. Pakujesz w oryginalne lub zastępcze opakowanie (możemy doradzić).
        </p>
      </div>

      {/* Krok 3 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 relative">
        <div className="absolute -top-3 left-5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 3</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <Search className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bezpłatna diagnostyka</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          W ciągu 1-2 dni roboczych nasi technicy diagnozują usterkę i przesyłają Ci dokładną wycenę naprawy do akceptacji.
        </p>
      </div>

      {/* Krok 4 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 relative">
        <div className="absolute -top-3 left-5 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 4</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <Wrench className="w-6 h-6 text-green-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Naprawa</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Po akceptacji wyceny rozpoczynamy naprawę. Używamy <strong>oryginalnych części Zebra</strong>. Standardowy czas: 2-5 dni roboczych.
        </p>
      </div>

      {/* Krok 5 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 relative">
        <div className="absolute -top-3 left-5 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 5</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-green-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Test jakości</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Po naprawie drukarka przechodzi pełny test jakości druku, kalibrację oraz weryfikację wszystkich funkcji. Tylko sprawne urządzenia opuszczają nasz serwis.
        </p>
      </div>

      {/* Krok 6 */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 relative">
        <div className="absolute -top-3 left-5 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">KROK 6</div>
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 mt-2 shadow-sm">
          <Package className="w-6 h-6 text-green-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Wysyłka + 12 mies. gwarancji</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Odsyłamy drukarkę kurierem na nasz koszt. Otrzymujesz raport serwisowy oraz <strong>12-miesięczną gwarancję</strong> na wykonaną naprawę.
        </p>
      </div>
    </div>
  </div>
</section>
```

**Co to daje**:
- ranguje na: `jak wygląda serwis drukarek zebra`, `proces naprawy drukarki`
- mocny trust signal — pokazuje profesjonalizm
- GEO/AEO friendly (Google AI Overview lubi step-by-step content)

---

## Zmiana 4 — Czas realizacji naprawy

**Lokalizacja**: WSTAW po Procesie serwisowym (Zmiana 3)

**Wstaw**:

```tsx
{/* Czas realizacji */}
<section className="py-8 sm:py-10 bg-gradient-to-br from-amber-50 to-orange-50">
  <div className="max-w-5xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Czas realizacji naprawy — od zgłoszenia do zwrotu
    </h2>
    <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
      Czas zależy od typu naprawy i dostępności części. Większość zleceń realizujemy w 5-7 dni roboczych.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <Clock className="w-8 h-8 text-blue-600 mb-3" strokeWidth={1.5} />
        <h3 className="font-semibold text-gray-900 mb-1">Standardowa</h3>
        <p className="text-2xl font-bold text-blue-600 mb-1">5-7 dni</p>
        <p className="text-xs text-gray-500">Większość napraw drukarek desktop i mobilnych.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <Zap className="w-8 h-8 text-amber-500 mb-3" strokeWidth={1.5} />
        <h3 className="font-semibold text-gray-900 mb-1">Ekspresowa</h3>
        <p className="text-2xl font-bold text-amber-600 mb-1">24-48h</p>
        <p className="text-xs text-gray-500">Dopłata 50 zł. Wymagane wcześniejsze ustalenie.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <Award className="w-8 h-8 text-green-600 mb-3" strokeWidth={1.5} />
        <h3 className="font-semibold text-gray-900 mb-1">Gwarancyjna</h3>
        <p className="text-2xl font-bold text-green-600 mb-1">3-5 dni</p>
        <p className="text-xs text-gray-500">Naprawy w ramach Zebra OneCare lub gwarancji producenta.</p>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
        <Factory className="w-8 h-8 text-red-600 mb-3" strokeWidth={1.5} />
        <h3 className="font-semibold text-gray-900 mb-1">Krytyczna</h3>
        <p className="text-2xl font-bold text-red-600 mb-1">indywidualnie</p>
        <p className="text-xs text-gray-500">Przestój linii produkcyjnej — zadzwoń, ustalimy priorytet.</p>
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 sm:p-5 mt-6 border border-gray-100 shadow-sm">
      <p className="text-sm text-gray-700 leading-relaxed">
        <strong>Co wpływa na czas naprawy?</strong> Najczęściej dostępność części zamiennych. Mamy magazyn części dla wszystkich popularnych modeli — w tym starszych jak <strong>105SL, GK420, LP2844</strong> — więc 90% napraw realizujemy bez czekania na sprowadzenie. Dla rzadkich części (np. moduły Xi4) czas może wynosić 7-14 dni.
      </p>
    </div>
  </div>
</section>
```

**Co to daje**:
- ranguje na: `ile trwa naprawa drukarki zebra`, `czas naprawy zebra`, `serwis ekspresowy zebra`
- 4 typy SLA — pokazuje profesjonalizm
- "magazyn części dla starszych modeli" = differentiation vs konkurencja

---

## Zmiana 5 — Dlaczego nasz serwis drukarek Zebra

**Lokalizacja**: WSTAW przed FAQ (po Czasie realizacji, czyli po Zmianie 4)

**Wstaw**:

```tsx
{/* Dlaczego nasz serwis */}
<section className="py-10 sm:py-12 md:py-14 bg-white">
  <div className="max-w-6xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Dlaczego nasz serwis drukarek Zebra jest najlepszy w Polsce?
    </h2>
    <p className="text-sm text-gray-600 text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
      Specjalizujemy się wyłącznie w urządzeniach Zebra Technologies — to nasza jedyna domena, a nie poboczne zlecenia. Oto co nas wyróżnia.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Award className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">25 lat doświadczenia z Zebra</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Od 2000 roku naprawiamy wyłącznie drukarki Zebra. Ponad <strong>5000 wykonanych napraw</strong> daje nam ekspercką wiedzę — diagnozę często stawiamy już po opisie problemu.
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Shield className="w-6 h-6 text-green-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Autoryzacja Zebra Technologies</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Posiadamy oficjalne uprawnienia producenta. Naprawiamy w standardzie Zebra, używamy <strong>wyłącznie oryginalnych części</strong> i mamy dostęp do bazy wiedzy serwisowej.
        </p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Package className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Magazyn części do starszych modeli</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Naprawiamy też modele EOL (LP2844, 105SL, GK420, Xi4). Mamy <strong>części do drukarek sprzed 20+ lat</strong> nadal pracujących w polskich fabrykach i magazynach.
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <MapPin className="w-6 h-6 text-purple-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Cała Polska — kurier 24h</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Kurier DPD odbierze drukarkę z dowolnego miejsca w Polsce w ciągu 24h. Po naprawie odsyłamy na nasz koszt — bez fizycznej wizyty u nas.
        </p>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Users className="w-6 h-6 text-cyan-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Polskojęzyczna obsługa techniczna</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Inżynierowie po polsku, którzy rozumieją kontekst Twojej firmy. Pomożemy też po naprawie — telefoniczne wsparcie obejmuje 12 miesięcy gwarancyjne.
        </p>
      </div>

      <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-5 border border-rose-100">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
          <Factory className="w-6 h-6 text-rose-600" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Współpraca z fabrykami i logistyką</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Obsługujemy zakłady produkcyjne, magazyny, apteki, szpitale i sklepy. Rozumiemy <strong>krytyczność czasu przestoju</strong> — dlatego oferujemy ekspres 24-48h.
        </p>
      </div>
    </div>
  </div>
</section>
```

**Co to daje**:
- ranguje na: `najlepszy serwis drukarek zebra`, `autoryzowany serwis zebra polska`, `serwis drukarek zebra opinie`
- E-E-A-T signal (Experience, Expertise, Authoritativeness, Trustworthiness)
- keyword density boost dla "serwis drukarek zebra" (3x w jednej sekcji)

---

## Zmiana 6 (OPCJONALNA) — Pytania przed wyborem serwisu

**Lokalizacja**: WSTAW po FAQ (przed sekcją Resources)

**Wstaw**:

```tsx
{/* Co warto zapytać przed wyborem serwisu */}
<section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
  <div className="max-w-4xl mx-auto px-3 sm:px-4">
    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
      Co zapytać przed wyborem serwisu drukarek Zebra
    </h2>
    <p className="text-sm text-gray-600 text-center mb-8">
      6 pytań, które pomogą Ci ocenić każdego serwisanta — także konkurencję.
    </p>

    <div className="space-y-3">
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">1. Czy serwis ma autoryzację Zebra Technologies?</h3>
        <p className="text-sm text-gray-600">Bez autoryzacji nie mają dostępu do oryginalnych części, dokumentacji ani narzędzi diagnostycznych. Naprawa może spowodować utratę gwarancji producenta.</p>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">2. Czy używają oryginalnych części, czy zamienników?</h3>
        <p className="text-sm text-gray-600">Oryginalne części Zebra są droższe, ale zapewniają standard fabryczny. Tańsze zamienniki mogą skutkować szybszą ponowną awarią.</p>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">3. Jaką gwarancję dają na naprawy?</h3>
        <p className="text-sm text-gray-600">Standard rynkowy to 3-6 miesięcy. <strong>Nasza gwarancja to 12 miesięcy</strong> — co oznacza, że jesteśmy pewni jakości naszych prac.</p>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">4. Czy podają wycenę przed naprawą?</h3>
        <p className="text-sm text-gray-600">Profesjonalny serwis robi <strong>bezpłatną diagnostykę</strong> i przesyła wycenę do akceptacji. Bez zaskoczenia kosztami na końcu.</p>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">5. Jaki mają czas reakcji?</h3>
        <p className="text-sm text-gray-600">Standard: 5-7 dni. Ekspres: 24-48h (z dopłatą). Dla firm z linii produkcyjnych krytyczny jest gwarantowany czas — pytaj o SLA.</p>
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-2">6. Czy obsługują Twój model — także starsze EOL?</h3>
        <p className="text-sm text-gray-600">Wiele serwisów odmawia napraw drukarek 10+ letnich (LP2844, 105SL, GK420). My naprawiamy wszystkie modele Zebra — także te z 1990s.</p>
      </div>
    </div>
  </div>
</section>
```

**Co to daje**:
- E-E-A-T signal (educational content)
- ranguje na long-tail: `jak wybrać serwis drukarek`, `co sprawdzić przed naprawą`
- pozytywne pozycjonowanie vs konkurencja (autoryzacja, oryginalne części, 12 mies gwarancji)

---

## Po wdrożeniu — co dalej

### 1. Lokalizacja zmian w finalnym układzie strony

Po wszystkich zmianach optymalna kolejność sekcji:

1. Hero
2. Kategorie drukarek (jakie naprawiamy)
3. **Zmiana 2**: Najczęstsze awarie wg typu (NEW)
4. Kluczowe poradniki
5. **Zmiana 1**: Cennik wg modelu (rozszerzony)
6. **Zmiana 3**: Proces krok po kroku (NEW)
7. **Zmiana 4**: Czas realizacji (NEW)
8. **Zmiana 5**: Dlaczego nasz serwis (NEW)
9. FAQ
10. **Zmiana 6** (opcjonalna): Pytania przed wyborem
11. Przydatne zasoby
12. CTA

### 2. Sanity check po deploy

```bash
# Sprawdź word count po zmianach
cd /Users/jakubtiuchty/Desktop/serwiszebra
python3 -c "
import re
with open('app/serwis-drukarek-zebra/page.tsx', 'r') as f:
    content = f.read()
# ... (kod z poprzedniego pomiaru)
"
```

Cel: **>2200 słów** widocznego tekstu.

### 3. Request Indexing w GSC

Po deploy: GSC → URL Inspection → `https://www.serwis-zebry.pl/serwis-drukarek-zebra` → Request Indexing.

### 4. Monitoring (po 7-14 dniach)

GSC Performance dla query:
- `serwis drukarek zebra` (główny)
- `cennik serwis drukarek zebra` (NEW po Zmianie 1)
- `ile trwa naprawa drukarki zebra` (NEW po Zmianie 4)
- `najlepszy serwis drukarek zebra` (NEW po Zmianie 5)

Oczekiwany efekt: pozycja huba 8.69 → 5-7 (sam content boost), później → 3-5 (content + backlinki z pramed/automatyka).
