/**
 * Fix new printheads — full SEO descriptions
 * Matching ZD421t quality: 5-6 sections, unique content per model
 */

import { createClient } from '@supabase/supabase-js'

import { config } from 'dotenv'
import { fileURLToPath } from 'url'

config({ path: fileURLToPath(new URL('.env.local', import.meta.url)), quiet: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const PRODUCTS = {

  'P1112640-019': {
    short: 'Oryginalna głowica 203 DPI do drukarki biurkowej Zebra ZD421d. Wersja Direct Thermal — drukuje bez taśmy barwiącej. Żywotność ~1 mln cali.',

    long: `<p>ZD421d to wersja Direct Thermal popularnej drukarki Zebra ZD421 — jednej z najczęściej kupowanych drukarek etykiet w Polsce. Ta głowica pasuje też do modeli ZD421t i ZD421c.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD421d, ZD421t, ZD421c</li>
</ul>

<h3>Dlaczego ZD421d?</h3>
<ul>
<li><strong>Niższe koszty eksploatacji</strong> — druk termiczny nie wymaga taśmy barwiącej (ribbon)</li>
<li><strong>Prostsza obsługa</strong> — wystarczy włożyć rolkę etykiet i drukować</li>
<li><strong>Kompaktowe wymiary</strong> — zajmuje minimum miejsca na biurku</li>
<li><strong>Następca GK420d</strong> — ulepszona wersja najpopularniejszej drukarki Zebra</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Etykiety wysyłkowe (InPost, DPD, DHL, Poczta Polska)</li>
<li>Etykiety magazynowe i produktowe</li>
<li>Kody kreskowe 1D (EAN, Code 128)</li>
<li>E-commerce — etykiety na paczki</li>
</ul>

<h3>Objawy zużytej głowicy w ZD421</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby imbusowe<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1112640-020': {
    short: 'Oryginalna głowica 300 DPI do drukarki Zebra ZD421d. Wyższa rozdzielczość — idealna do małych kodów QR i drobnego tekstu. Żywotność ~1 mln cali.',

    long: `<p>Głowica 300 DPI zapewnia ostrzejszy druk niż standardowa 203 DPI. Wybierz ją, jeśli drukujesz małe kody QR, etykiety farmaceutyczne lub tekst poniżej 6 punktów. Pasuje do ZD421d, ZD421t i ZD421c.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD421d, ZD421t, ZD421c</li>
</ul>

<h3>Kiedy wybrać 300 DPI zamiast 203 DPI?</h3>
<ul>
<li><strong>Małe kody QR i DataMatrix</strong> — lepiej czytelne przy skanowaniu</li>
<li><strong>Etykiety farmaceutyczne</strong> — drobny tekst, numery serii, daty ważności</li>
<li><strong>Etykiety elektroniczne</strong> — małe elementy, numery seryjne</li>
<li><strong>Tekst poniżej 6 punktów</strong> — przy 203 DPI bywa nieczytelny</li>
</ul>

<h3>203 DPI vs 300 DPI — co wybrać?</h3>
<p>Głowica 203 DPI wystarczy do standardowych etykiet wysyłkowych i kodów kreskowych 1D. Głowica 300 DPI jest potrzebna, gdy drukujesz małe kody 2D (QR, DataMatrix), drobny tekst lub etykiety, które muszą być czytelne przy małych rozmiarach. Prędkość druku przy 300 DPI jest nieco niższa.</p>

<h3>Objawy zużytej głowicy w ZD421</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby imbusowe<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1112640-050': {
    short: 'Oryginalna głowica 203 DPI do drukarki Zebra ZD621d. Topowy model biurkowy Zebra z kolorowym LCD. Żywotność ~1 mln cali.',

    long: `<p>ZD621d to najnowsza generacja topowej drukarki biurkowej Zebra w wersji Direct Thermal. Wyposażona w kolorowy wyświetlacz LCD i szybszy procesor niż ZD620d. Ta głowica pasuje też do modelu ZD621t.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD621d, ZD621t</li>
</ul>

<h3>Dlaczego ZD621d?</h3>
<ul>
<li><strong>Kolorowy wyświetlacz LCD</strong> — łatwiejsza konfiguracja i diagnostyka</li>
<li><strong>Szybszy druk</strong> — do 203 mm/s, idealny dla dużych wolumenów</li>
<li><strong>Direct Thermal</strong> — bez taśmy barwiącej, niższe koszty druku</li>
<li><strong>Następca ZD620d</strong> — nowszy procesor, lepsze oprogramowanie</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Duże wolumeny etykiet wysyłkowych</li>
<li>Centra logistyczne i dystrybucyjne</li>
<li>Etykiety magazynowe i produktowe</li>
<li>Handel — etykiety cenowe i produktowe</li>
</ul>

<h3>Objawy zużytej głowicy w ZD621</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki (LCD)</p>`
  },

  'P1112640-051': {
    short: 'Oryginalna głowica 300 DPI do drukarki Zebra ZD621d. Premium jakość druku na topowej drukarce biurkowej. Żywotność ~1 mln cali.',

    long: `<p>Głowica 300 DPI do ZD621d — wyższa rozdzielczość na najlepszej drukarce biurkowej Zebra. Wybierz ją do małych kodów 2D, drobnego tekstu i zastosowań medycznych. Pasuje też do ZD621t.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD621d, ZD621t</li>
</ul>

<h3>Kiedy wybrać 300 DPI?</h3>
<ul>
<li><strong>Małe kody QR i DataMatrix</strong> — lepiej czytelne przy skanowaniu</li>
<li><strong>Etykiety farmaceutyczne</strong> — drobny tekst, daty ważności, numery serii</li>
<li><strong>Etykiety jubilerskie</strong> — precyzyjne oznaczenia na małej powierzchni</li>
<li><strong>Identyfikacja próbek</strong> — laboratoria, szpitale, badania</li>
</ul>

<h3>ZD621d vs ZD421d — różnice</h3>
<p>ZD621d to wyższa półka niż ZD421d. Oferuje kolorowy wyświetlacz LCD, szybszy procesor, prędkość druku do 203 mm/s i lepszą jakość wykonania. ZD421d to solidny wybór budżetowy, ZD621d — gdy potrzebujesz wydajności i łatwej obsługi.</p>

<h3>Objawy zużytej głowicy w ZD621</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki (LCD)</p>`
  },

  'P1080383-226': {
    short: 'Oryginalna głowica 203 DPI do drukarki Zebra ZD620t. Niezawodna drukarka biurkowa z drukiem termotransferowym. Żywotność ~1 mln cali.',

    long: `<p>ZD620t to poprzednia generacja topowej drukarki biurkowej Zebra (przed ZD621t). Obsługuje druk termiczny i termotransferowy — bardziej wszechstronna niż wersja "d". Ta głowica pasuje też do modelu ZD620d.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD620t, ZD620d</li>
</ul>

<h3>Dlaczego ZD620t?</h3>
<ul>
<li><strong>Termotransfer</strong> — trwałe etykiety odporne na wodę, temperaturę i ścieranie</li>
<li><strong>Niezawodność</strong> — sprawdzona konstrukcja, tysiące drukarek w użyciu w Polsce</li>
<li><strong>Wszechstronność</strong> — druk termiczny i termotransferowy w jednym urządzeniu</li>
<li><strong>Dobra cena</strong> — tańsza niż nowy ZD621t przy porównywalnej jakości</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Etykiety termotransferowe (trwałe, odporne na wodę i ścieranie)</li>
<li>Etykiety wysyłkowe i logistyczne</li>
<li>Etykiety produktowe w produkcji</li>
<li>Magazyny i handel</li>
</ul>

<h3>Objawy zużytej głowicy w ZD620</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1080383-227': {
    short: 'Oryginalna głowica 300 DPI do drukarki Zebra ZD620t. Wyższa rozdzielczość do drobnego tekstu i małych kodów 2D. Żywotność ~1 mln cali.',

    long: `<p>Głowica 300 DPI do ZD620t zapewnia wyższą rozdzielczość — idealna do etykiet farmaceutycznych, małych kodów 2D i wszędzie tam, gdzie standardowe 203 DPI nie wystarcza. Pasuje też do ZD620d.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD620t, ZD620d</li>
</ul>

<h3>Kiedy wybrać 300 DPI?</h3>
<ul>
<li><strong>Etykiety farmaceutyczne</strong> — drobny tekst, numery serii, daty ważności</li>
<li><strong>Kody QR i DataMatrix</strong> — lepiej czytelne w małym rozmiarze</li>
<li><strong>Etykiety elektroniczne</strong> — numery seryjne, małe oznaczenia</li>
<li><strong>Drobne etykiety</strong> — tekst poniżej 6 punktów</li>
</ul>

<h3>203 DPI vs 300 DPI — co wybrać?</h3>
<p>203 DPI to standard do etykiet wysyłkowych, kodów EAN i standardowego tekstu. 300 DPI przydaje się do małych kodów 2D, etykiet farmaceutycznych i drobnego tekstu. Cena głowicy 300 DPI jest wyższa, ale jeśli Twoje etykiety tego wymagają — różnica w jakości jest wyraźna.</p>

<h3>Objawy zużytej głowicy w ZD620</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1080383-415': {
    short: 'Oryginalna głowica 203 DPI do drukarki Zebra ZD620d. Wersja Direct Thermal — tańsza w eksploatacji. Żywotność ~1 mln cali.',

    long: `<p>ZD620d to wersja Direct Thermal drukarki ZD620 — tańsza w eksploatacji, bo nie wymaga taśmy barwiącej. Idealna do etykiet termicznych (wysyłkowe, magazynowe). Ta głowica pasuje też do modelu ZD620t.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD620d, ZD620t</li>
</ul>

<h3>ZD620d vs ZD620t — różnice</h3>
<ul>
<li><strong>ZD620d (Direct Thermal)</strong> — tylko etykiety termiczne, bez taśmy, niższe koszty</li>
<li><strong>ZD620t (Thermal Transfer)</strong> — obsługuje też taśmę barwiącą, trwalsze etykiety</li>
</ul>
<p>Jeśli drukujesz głównie etykiety wysyłkowe lub magazynowe — ZD620d w zupełności wystarczy. Taśma barwiąca potrzebna jest do etykiet odpornych na wodę i ścieranie.</p>

<h3>Typowe zastosowania</h3>
<ul>
<li>Etykiety wysyłkowe (InPost, DPD, DHL)</li>
<li>Etykiety cenowe w sklepach</li>
<li>Etykiety magazynowe</li>
<li>E-commerce — etykiety na paczki</li>
</ul>

<h3>Objawy zużytej głowicy w ZD620</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1080383-416': {
    short: 'Oryginalna głowica 300 DPI do drukarki Zebra ZD620d. Ostrzejszy druk do małych kodów i drobnego tekstu. Żywotność ~1 mln cali.',

    long: `<p>Głowica 300 DPI do ZD620d — wyższa rozdzielczość dla etykiet z drobnymi kodami i tekstem. Pasuje też do modelu ZD620t.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD620d, ZD620t</li>
</ul>

<h3>Kiedy wybrać 300 DPI?</h3>
<ul>
<li><strong>Małe kody QR i DataMatrix</strong> — lepiej czytelne przy skanowaniu</li>
<li><strong>Etykiety farmaceutyczne</strong> — numery serii, daty ważności</li>
<li><strong>Etykiety laboratoryjne</strong> — opisy próbek, identyfikatory</li>
<li><strong>Drobny tekst</strong> — poniżej 6 punktów</li>
</ul>

<h3>203 DPI vs 300 DPI — co wybrać?</h3>
<p>Większość firm używa głowic 203 DPI — wystarczają do standardowych etykiet wysyłkowych i kodów kreskowych EAN/Code 128. Głowica 300 DPI potrzebna jest do małych kodów 2D, etykiet farmaceutycznych i aplikacji wymagających drobnego tekstu. Cena głowicy 300 DPI jest wyższa, ale różnica w jakości druku małych elementów jest wyraźna.</p>

<h3>Objawy zużytej głowicy w ZD620</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>`
  },

  'P1115689': {
    short: 'Oryginalna głowica 203 DPI do drukarki Zebra ZD220d. Najtańsza drukarka biurkowa Zebra — idealna na start. Żywotność ~1 mln cali.',

    long: `<p>ZD220d to najprostsza i najtańsza drukarka biurkowa Zebra. Wersja Direct Thermal, idealna dla małych firm i początkujących sprzedawców e-commerce. Głowica pasuje też do modelu ZD230d.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: Direct Thermal</li>
<li>Kompatybilność: ZD220d, ZD230d</li>
</ul>

<h3>Dlaczego ZD220d?</h3>
<ul>
<li><strong>Najniższa cena</strong> — najtańsza drukarka Zebra na rynku</li>
<li><strong>Prostota</strong> — plug & play, minimalna konfiguracja</li>
<li><strong>Kompaktowa</strong> — idealna do małego biura lub punktu nadawczego</li>
<li><strong>Niezawodność Zebra</strong> — nawet budżetowy model zachowuje jakość Zebra</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Małe firmy kurierskie i punkty nadawcze</li>
<li>Początkujący sprzedawcy e-commerce</li>
<li>Etykiety adresowe i wysyłkowe</li>
<li>Podstawowe etykiety magazynowe</li>
</ul>

<h3>Objawy zużytej głowicy w ZD220</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację (drukarka wykona ją automatycznie po włączeniu)</p>`
  },

  // ===== INDUSTRIAL =====

  'P1123335-012': {
    short: 'Oryginalna głowica 203 DPI do drukarki przemysłowej Zebra ZT111. Kompaktowa drukarka przemysłowa w najlepszej cenie. Żywotność ~2 mln cali.',

    long: `<p>ZT111 to ekonomiczna drukarka przemysłowa Zebra — kompaktowa obudowa klasy przemysłowej w najniższej cenie w ofercie. Idealny wybór dla firm przechodzących z drukarek biurkowych na przemysłowe. Głowica pasuje też do modeli ZT211 i ZT231.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZT111, ZT211, ZT231</li>
</ul>

<h3>Dlaczego ZT111?</h3>
<ul>
<li><strong>Cena drukarki biurkowej, wydajność przemysłowej</strong> — najlepsza propozycja na rynku</li>
<li><strong>Metalowa obudowa</strong> — wytrzyma w warunkach magazynowych i produkcyjnych</li>
<li><strong>Duże rolki etykiet</strong> — rzadsze wymiany, mniej przestojów</li>
<li><strong>Szybszy druk</strong> — do 254 mm/s, znacznie więcej niż drukarki biurkowe</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Produkcja — etykiety produktowe na linii</li>
<li>Magazyny — etykiety lokalizacyjne i paletowe</li>
<li>Logistyka — duże wolumeny etykiet wysyłkowych</li>
<li>Kody kreskowe GS1 na linii produkcyjnej</li>
</ul>

<h3>Objawy zużytej głowicy w ZT111</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
<li>Nierówne zaciemnienie na szerokości etykiety</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz boczną pokrywę<br>
2. Odłącz kabel taśmowy od głowicy<br>
3. Odkręć śruby mocujące (2-4 szt.)<br>
4. Wyjmij starą głowicę, zamontuj nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację czujników z panelu drukarki</p>`
  },

  'P1123335-057': {
    short: 'Oryginalna głowica 300 DPI do drukarki przemysłowej Zebra ZT111. Wyższa rozdzielczość w kompaktowej obudowie przemysłowej. Żywotność ~2 mln cali.',

    long: `<p>Głowica 300 DPI do ZT111 — wyższa rozdzielczość w ekonomicznej drukarce przemysłowej Zebra. Idealna do małych kodów 2D i etykiet z drobnym tekstem. Pasuje też do modeli ZT211 i ZT231.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZT111, ZT211, ZT231</li>
</ul>

<h3>Kiedy wybrać 300 DPI w drukarce przemysłowej?</h3>
<ul>
<li><strong>Kody QR i DataMatrix</strong> — lepsza czytelność przy skanowaniu automatycznym</li>
<li><strong>Etykiety farmaceutyczne</strong> — drobny tekst, numery serii, daty ważności</li>
<li><strong>Etykiety elektroniczne</strong> — numery seryjne, małe oznaczenia na płytkach</li>
<li><strong>Etykiety laboratoryjne</strong> — identyfikacja próbek, kody na probówkach</li>
</ul>

<h3>ZT111 vs drukarki biurkowe</h3>
<p>ZT111 to przemysłowa drukarka w cenie zbliżonej do biurkowej ZD621t. Różnica? Metalowa obudowa, większe rolki etykiet (mniej wymian), szybszy druk i dłuższa żywotność głowicy (2 mln vs 1 mln cali). Jeśli drukujesz ponad 500 etykiet dziennie — ZT111 szybko się zwróci.</p>

<h3>Objawy zużytej głowicy w ZT111</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz boczną pokrywę<br>
2. Odłącz kabel taśmowy od głowicy<br>
3. Odkręć śruby mocujące (2-4 szt.)<br>
4. Wyjmij starą głowicę, zamontuj nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację czujników z panelu drukarki</p>`
  },

  'P1004234': {
    short: 'Oryginalna głowica 203 DPI do drukarki przemysłowej Zebra 140Xi4. Szerokoformatowa drukarka — druk do 128 mm. Żywotność ~3 mln cali.',

    long: `<p>140Xi4 to szerokoformatowa drukarka przemysłowa Zebra z szerokim drukiem 128 mm (5"). Legendarna seria Xi4 znana z ekstremalnej trwałości — pracuje non-stop na liniach produkcyjnych na całym świecie.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 128 mm (5")</li>
<li>Żywotność: ~3 000 000 cali (76 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
</ul>

<h3>Dlaczego seria Xi4?</h3>
<ul>
<li><strong>Legendarna trwałość</strong> — metalowa obudowa klasy przemysłowej, lata pracy bez awarii</li>
<li><strong>Szeroki druk 128 mm</strong> — szerokie etykiety bez konieczności stosowania drukarek A4</li>
<li><strong>Praca non-stop</strong> — zaprojektowana do ciągłej pracy 24/7</li>
<li><strong>Długa żywotność głowicy</strong> — 3 mln cali, to 50% więcej niż w nowszych modelach</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Szerokie etykiety paletowe i na kartony zbiorcze</li>
<li>Etykiety logistyczne na duże przesyłki</li>
<li>Oznaczenia przemysłowe (rury, kable, regały)</li>
<li>Etykiety na pojemniki i kontenery</li>
</ul>

<h3>Objawy zużytej głowicy w 140Xi4</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
<li>Nierówne zaciemnienie na szerokości 128 mm</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz przednią pokrywę<br>
2. Odłącz kabel taśmowy od głowicy<br>
3. Odkręć śruby mocujące (4 szt.)<br>
4. Wyjmij starą głowicę, zamontuj nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z panelu drukarki<br>
7. Wydrukuj etykietę testową i sprawdź jakość</p>`
  },

  'P1004236': {
    short: 'Oryginalna głowica 203 DPI do drukarki przemysłowej Zebra 170Xi4. Najszersza drukarka Zebra — druk do 168 mm. Żywotność ~3 mln cali.',

    long: `<p>170Xi4 to najszersza drukarka w serii Xi4 z szerokim drukiem 168 mm (6.6"). Zaprojektowana do etykiet na palety, duże kartony i wszędzie tam, gdzie standardowa szerokość 104 mm nie wystarcza.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6")</li>
<li>Żywotność: ~3 000 000 cali (76 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
</ul>

<h3>Dlaczego 170Xi4?</h3>
<ul>
<li><strong>Najszersza drukarka Zebra</strong> — 168 mm druku, idealna do etykiet paletowych GS1</li>
<li><strong>Praca non-stop 24/7</strong> — metalowa obudowa wytrzymuje lata intensywnego użytkowania</li>
<li><strong>3 mln cali żywotności</strong> — najdłuższa żywotność głowicy w ofercie Zebra</li>
<li><strong>Standard w logistyce</strong> — używana w centrach dystrybucyjnych na całym świecie</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Etykiety paletowe GS1-128</li>
<li>Szerokie etykiety na kartony zbiorcze</li>
<li>Etykiety logistyczne formatu A5/A6</li>
<li>Etykiety na pojemniki i kontenery przemysłowe</li>
</ul>

<h3>Objawy zużytej głowicy w 170Xi4</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
<li>Nierówne zaciemnienie na szerokości 168 mm</li>
</ul>

<h3>Wymiana — krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz przednią pokrywę<br>
2. Odłącz kabel taśmowy od głowicy<br>
3. Odkręć śruby mocujące (4 szt.)<br>
4. Wyjmij starą głowicę, zamontuj nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z panelu drukarki<br>
7. Wydrukuj etykietę testową i sprawdź jakość</p>`
  },
}

async function main() {
  console.log('🔧 Aktualizacja opisów SEO (pełne)...\n')

  let updated = 0

  for (const [sku, p] of Object.entries(PRODUCTS)) {
    const { data, error } = await supabase
      .from('products')
      .update({
        description: p.short,
        description_long: p.long,
      })
      .eq('sku', sku)
      .select('sku, name')

    if (error) {
      console.error(`❌ ${sku}: ${error.message}`)
    } else if (data && data.length > 0) {
      console.log(`✅ ${sku} → ${data[0].name}`)
      updated++
    } else {
      console.log(`⏭️  ${sku} — nie znaleziono`)
    }
  }

  console.log(`\n📊 Zaktualizowano: ${updated} produktów`)
}

main().catch(console.error)
