-- =====================================================
-- MASOWA AKTUALIZACJA OPISÓW GŁOWIC DRUKUJĄCYCH
-- Wykonaj w Supabase SQL Editor
-- Format: HTML (renderowany na stronie produktu)
-- =====================================================

-- 1. Zebra 220Xi4 203 DPI (P1004238)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do przemysłowej drukarki Zebra 220Xi4. Szerokość druku 168 mm (6.6") – idealna do dużych etykiet paletowych i opakowań zbiorczych. Żywotność ~3 mln cali druku.',
  description_long = '<p>Głowica drukująca P1004238 to oryginalna część zamienna do drukarki przemysłowej Zebra 220Xi4 w rozdzielczości 203 DPI (8 punktów/mm). Seria Xi4 to flagowe drukarki Zebra przeznaczone do najtrudniejszych środowisk produkcyjnych i logistycznych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6") – największa w ofercie Zebra</li>
<li>Żywotność: ~3 000 000 cali (75 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość druku: do 254 mm/s</li>
</ul>

<h3>Zastosowania</h3>
<p>Głowica 203 DPI jest optymalna do etykiet paletowych GS1-128, dużych etykiet wysyłkowych, oznaczeń opakowań zbiorczych i etykiet produkcyjnych w formatach A5/A6.</p>

<h3>Kiedy wymienić głowicę?</h3>
<p>Typowe objawy zużycia: pionowe białe linie na wydruku, blady druk mimo wysokich ustawień ciemności, nieczytelne kody kreskowe na szerokości całej etykiety.</p>

<h3>Serwis TAKMA</h3>
<p>Jako autoryzowany serwis Zebra oferujemy profesjonalną wymianę głowicy – odbieramy drukarkę kurierem, wymieniamy, kalibrujemy i odsyłamy w 3-5 dni roboczych.</p>',
  meta_title = 'Głowica Zebra 220Xi4 203 DPI (P1004238) – Kup | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra 220Xi4. Szerokość 168mm, żywotność 3 mln cali. Cena 3227 zł netto. Wysyłka 24-72h. Autoryzowany serwis Zebra.'
WHERE sku = 'P1004238';

-- 2. Zebra 220Xi4 300 DPI (P1004239)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki przemysłowej Zebra 220Xi4. Wysoka rozdzielczość dla kodów 2D i drobnego tekstu na etykietach 168 mm. Żywotność ~2.5 mln cali.',
  description_long = '<p>Głowica drukująca P1004239 to oryginalna część zamienna do drukarki Zebra 220Xi4 w rozdzielczości 300 DPI (12 punktów/mm). Wyższa rozdzielczość zapewnia lepszą jakość druku kodów 2D i drobnych elementów graficznych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6")</li>
<li>Żywotność: ~2 500 000 cali (63 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Maksymalna prędkość: do 203 mm/s</li>
</ul>

<h3>Dlaczego 300 DPI?</h3>
<p>Rozdzielczość 300 DPI jest zalecana gdy drukujesz: kody DataMatrix i QR na małych etykietach, etykiety z drobnym tekstem (poniżej 6pt), etykiety farmaceutyczne z UDI, etykiety elektroniczne z numerami seryjnymi.</p>

<h3>Ważne informacje</h3>
<p><strong>Uwaga:</strong> Głowice 203 DPI i 300 DPI NIE są wymienne – mają różną konstrukcję. Sprawdź rozdzielczość w raporcie konfiguracji drukarki przed zamówieniem.</p>

<h3>Wymiana głowicy</h3>
<p>Wymiana w 220Xi4 wymaga demontażu mechanizmu drukującego. Zalecamy wymianę w autoryzowanym serwisie – oferujemy tę usługę z odbiorem kurierem.</p>',
  meta_title = 'Głowica Zebra 220Xi4 300 DPI (P1004239) – Sklep | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra 220Xi4. Idealna do kodów 2D i drobnego tekstu. Cena 3393 zł netto. Gwarancja 12 mies. Serwis Zebra.'
WHERE sku = 'P1004239';

-- 3. Zebra GK420d/GX420d 203 DPI (105934-037)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarek biurkowych Zebra GK420d i GX420d. Kompaktowa drukarka termiczna – głowica pasuje do obu modeli. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca 105934-037 to oryginalna część do popularnych drukarek biurkowych Zebra GK420d i GX420d. Te kompaktowe drukarki termiczne (Direct Thermal) są jednymi z najczęściej używanych w Polsce do etykiet wysyłkowych i paragonów.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: tylko druk termiczny (Direct Thermal)</li>
<li>Kompatybilność: GK420d, GX420d</li>
</ul>

<h3>Wersja "d" vs "t"</h3>
<p><strong>Uwaga:</strong> Głowica 105934-037 jest przeznaczona do modeli z literą "d" (Direct Thermal). Modele GK420t i GX420t (Thermal Transfer) używają innej głowicy: 105934-038.</p>

<h3>Objawy zużytej głowicy</h3>
<ul>
<li>Białe pionowe linie na etykietach</li>
<li>Blady wydruk mimo czarnego papieru termicznego</li>
<li>Nieczytelne kody kreskowe przy kasach</li>
</ul>

<h3>Wymiana</h3>
<p>Wymiana głowicy w GK420d/GX420d to prosta czynność – otwórz pokrywę, odłącz kabel flat, odkręć 2 śruby i zamontuj nową. Zajmuje 5-10 minut.</p>',
  meta_title = 'Głowica GK420d GX420d 203 DPI (105934-037) | TAKMA',
  meta_description = 'Oryginalna głowica do Zebra GK420d i GX420d. Druk termiczny 203 DPI. Cena 461 zł netto. Pasuje do obu modeli. Wysyłka 24h.'
WHERE sku = '105934-037';

-- 4. Zebra GK420t/GX420t 203 DPI (105934-038)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarek Zebra GK420t i GX420t z drukiem termotransferowym. Trwałe etykiety z taśmą ribbon. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca 105934-038 to oryginalna część do drukarek biurkowych Zebra GK420t i GX420t z funkcją druku termotransferowego. Druk z taśmą barwiącą (ribbon) zapewnia trwałe etykiety odporne na ścieranie i UV.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: GK420t, GX420t (wersje z literą "t")</li>
</ul>

<h3>Różnica "t" vs "d"</h3>
<p>Modele z literą "t" (Transfer) obsługują zarówno druk termiczny jak i termotransferowy z taśmą. Głowica 105934-038 ma inną konstrukcję niż 105934-037 do modeli "d".</p>

<h3>Typowe zastosowania GK420t/GX420t</h3>
<ul>
<li>Etykiety produktowe (trwałe oznaczenia)</li>
<li>Etykiety na zewnątrz (odporne na UV)</li>
<li>Oznaczenia środków trwałych</li>
<li>Etykiety z kodami kreskowymi do inwentaryzacji</li>
</ul>

<h3>Jak przedłużyć żywotność</h3>
<p>Czyść głowicę alkoholem izopropylowym (IPA) przy każdej wymianie taśmy ribbon. Używaj oryginalnych materiałów Zebra.</p>',
  meta_title = 'Głowica GK420t GX420t 203 DPI (105934-038) | TAKMA',
  meta_description = 'Oryginalna głowica do Zebra GK420t/GX420t. Druk termotransferowy 203 DPI. Cena 461 zł netto. Wysyłka 24h. Gwarancja producenta.'
WHERE sku = '105934-038';

-- 5. Zebra GX430t 300 DPI (105934-039)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki Zebra GX430t. Wysoka rozdzielczość dla etykiet z kodami 2D, drobnym tekstem i grafiką. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca 105934-039 to oryginalna część do drukarki biurkowej Zebra GX430t w rozdzielczości 300 DPI. Model GX430t to wersja premium z wyższą rozdzielczością niż standardowe GK/GX420.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 102 mm/s</li>
</ul>

<h3>Dlaczego GX430t z 300 DPI?</h3>
<p>Wyższa rozdzielczość jest niezbędna gdy drukujesz:</p>
<ul>
<li>Kody DataMatrix i QR o małych rozmiarach</li>
<li>Etykiety elektroniczne z mikro-tekstem</li>
<li>Etykiety farmaceutyczne (UDI, numery seryjne)</li>
<li>Etykiety jubilerskie z drobnym opisem</li>
<li>Grafiki i loga wymagające wysokiej jakości</li>
</ul>

<h3>Unikalny model</h3>
<p><strong>Uwaga:</strong> GX430t to jedyna drukarka biurkowa Zebra serii GK/GX z rozdzielczością 300 DPI. Głowica 105934-039 NIE pasuje do żadnego innego modelu tej serii.</p>

<h3>Serwis</h3>
<p>Oferujemy wymianę głowicy w serwisie TAKMA – odbiór kurierem, wymiana, kalibracja i zwrot w 3-5 dni.</p>',
  meta_title = 'Głowica Zebra GX430t 300 DPI (105934-039) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra GX430t. Wysoka jakość dla kodów 2D. Cena 940 zł netto. Wysyłka 24h. Autoryzowany serwis.'
WHERE sku = '105934-039';

-- 6. Zebra ZD220t/ZD230t 203 DPI (P1115690)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarek Zebra ZD220t i ZD230t. Ekonomiczne drukarki biurkowe – jedna głowica pasuje do obu modeli. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca P1115690 to oryginalna część do ekonomicznych drukarek biurkowych Zebra ZD220t i ZD230t. Te drukarki są następcami popularnych modeli GK420 i oferują świetny stosunek ceny do wydajności.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD220t, ZD230t</li>
</ul>

<h3>ZD220 vs ZD230 – różnice</h3>
<ul>
<li><strong>ZD220t</strong> – model podstawowy, USB</li>
<li><strong>ZD230t</strong> – dodatkowe złącza (Ethernet opcjonalnie)</li>
</ul>
<p>Głowica P1115690 pasuje do OBU modeli.</p>

<h3>Typowe zastosowania</h3>
<ul>
<li>Małe firmy kurierskie</li>
<li>Sklepy internetowe (etykiety wysyłkowe)</li>
<li>Apteki (etykiety na leki)</li>
<li>Biura (etykiety adresowe)</li>
</ul>

<h3>Wymiana głowicy ZD220/ZD230</h3>
<p>1. Otwórz górną pokrywę drukarki<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby mocujące<br>
4. Zamontuj nową głowicę i podłącz kabel<br>
5. Po wymianie wykonaj kalibrację czujników</p>
<p>Cała operacja zajmuje około 10 minut.</p>',
  meta_title = 'Głowica Zebra ZD220t ZD230t 203 DPI (P1115690) | TAKMA',
  meta_description = 'Oryginalna głowica do Zebra ZD220t i ZD230t. 203 DPI, pasuje do obu modeli. Cena 459 zł netto. Wysyłka 24h z magazynu.'
WHERE sku = 'P1115690';

-- 7. Zebra ZD411t/ZD611t 203 DPI (P1117258-232)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do kompaktowych drukarek Zebra ZD411t i ZD611t. Szerokość druku 56 mm – idealna do etykiet na produkty i wristbandów. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca P1117258-232 to oryginalna część do kompaktowych drukarek Zebra ZD411t i ZD611t z wąskim torem druku 56 mm (2"). Te drukarki są idealne do etykiet na produkty spożywcze, wristbandów medycznych i małych etykiet cenowych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 56 mm (2.2")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD411t, ZD611t (wersje 2-calowe)</li>
</ul>

<h3>ZD411 vs ZD611 – różnice</h3>
<ul>
<li><strong>ZD411t</strong> – model podstawowy, kompaktowy</li>
<li><strong>ZD611t</strong> – wersja premium z wyświetlaczem LCD i większą pamięcią</li>
</ul>
<p>Głowica P1117258-232 pasuje do OBU modeli.</p>

<h3>Typowe zastosowania 2-calowych drukarek</h3>
<ul>
<li>Wristbandy szpitalne (identyfikacja pacjentów)</li>
<li>Etykiety na produkty spożywcze (daty ważności)</li>
<li>Etykiety cenowe w sklepach</li>
<li>Etykiety na próbki laboratoryjne</li>
<li>Małe etykiety na elektronikę</li>
</ul>

<h3>Uwaga – szerokość drukarki</h3>
<p><strong>Ważne:</strong> ZD411/ZD611 występują w wersjach 2" (56mm) i 4" (104mm). Ta głowica jest TYLKO do wersji 2-calowej. Wersje 4-calowe używają głowic P1112640-218/219.</p>',
  meta_title = 'Głowica Zebra ZD411t ZD611t 203 DPI 2" (P1117258-232) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZD411t i ZD611t (wersja 2"). Cena 371 zł netto. Do wristbandów i małych etykiet. Wysyłka 24h.'
WHERE sku = 'P1117258-232';

-- 8. Zebra ZD411t/ZD611t 300 DPI (P1117258-233)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarek Zebra ZD411t i ZD611t. Wysoka rozdzielczość dla precyzyjnych etykiet 2-calowych z kodami 2D. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca P1117258-233 to oryginalna część do drukarek Zebra ZD411t i ZD611t w rozdzielczości 300 DPI. Wyższa rozdzielczość zapewnia lepszą jakość druku na wąskich etykietach 56 mm.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 56 mm (2.2")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD411t, ZD611t (wersje 2-calowe)</li>
</ul>

<h3>Kiedy wybrać 300 DPI zamiast 203 DPI?</h3>
<p>Rozdzielczość 300 DPI jest zalecana gdy drukujesz:</p>
<ul>
<li>Kody DataMatrix na małych etykietach laboratoryjnych</li>
<li>Wristbandy z kodami 2D do skanowania</li>
<li>Etykiety z bardzo drobnym tekstem (poniżej 5pt)</li>
<li>Etykiety farmaceutyczne z UDI</li>
</ul>

<h3>Kompatybilność</h3>
<ul>
<li>Ta głowica pasuje TYLKO do wersji 2-calowych (56mm)</li>
<li>Wersje 4-calowe ZD411/ZD611 używają innych głowic</li>
<li>Głowice 203 DPI i 300 DPI NIE są wymienne</li>
</ul>

<h3>Wymiana głowicy</h3>
<p>Wymiana w ZD411/ZD611 jest prosta – otwórz pokrywę, odłącz kabel, odkręć 2 śruby. Po wymianie wykonaj kalibrację w menu drukarki.</p>',
  meta_title = 'Głowica Zebra ZD411t ZD611t 300 DPI 2" (P1117258-233) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZD411t/ZD611t 2". Wysoka jakość dla kodów 2D. Cena 421 zł netto. Gwarancja 12 miesięcy.'
WHERE sku = 'P1117258-233';

-- 9. Zebra ZD421t 203 DPI (P1112640-218)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do popularnej drukarki biurkowej Zebra ZD421t. Najczęściej wybierana drukarka etykiet w Polsce. Żywotność ~1 mln cali druku.',
  description_long = '<p>Głowica drukująca P1112640-218 to oryginalna część do najpopularniejszej drukarki biurkowej Zebra ZD421t. Model ZD421 to następca legendarnych GK420 i jest obecnie najczęściej kupowaną drukarką etykiet w Polsce.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZD421t, ZD421d, ZD421c (karty)</li>
</ul>

<h3>Dlaczego ZD421 jest tak popularna?</h3>
<ul>
<li><strong>Niezawodność</strong> – sprawdzona konstrukcja Zebra</li>
<li><strong>Wszechstronność</strong> – druk termiczny i termotransferowy</li>
<li><strong>Łatwość obsługi</strong> – wymiana materiałów bez narzędzi</li>
<li><strong>Kompaktowe wymiary</strong> – idealna na biurko</li>
<li><strong>Dobra cena</strong> – najlepszy stosunek jakości do ceny</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>E-commerce (etykiety wysyłkowe InPost, DPD, DHL)</li>
<li>Magazyny (etykiety lokalizacyjne)</li>
<li>Produkcja (etykiety produktowe)</li>
<li>Apteki (etykiety na leki)</li>
</ul>

<h3>Objawy zużytej głowicy w ZD421</h3>
<ul>
<li>Pionowe białe linie na etykietach</li>
<li>Blady wydruk (zwiększanie ciemności nie pomaga)</li>
<li>Kody kreskowe nie skanują się poprawnie</li>
</ul>

<h3>Wymiana – krok po kroku</h3>
<p>1. Wyłącz drukarkę i otwórz pokrywę<br>
2. Odłącz taśmę flat cable od głowicy<br>
3. Odkręć 2 śruby imbusowe<br>
4. Wyjmij starą głowicę, włóż nową<br>
5. Dokręć śruby i podłącz kabel<br>
6. Wykonaj kalibrację z menu drukarki</p>',
  meta_title = 'Głowica Zebra ZD421t 203 DPI (P1112640-218) – Cena | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZD421t – najpopularniejszej drukarki w Polsce. Cena 475 zł netto. Wysyłka 24h. Gwarancja 12 mies.'
WHERE sku = 'P1112640-218';

-- 10. Zebra ZD421t 300 DPI (P1112640-219)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki Zebra ZD421t. Wysoka rozdzielczość dla kodów 2D, drobnego tekstu i etykiet farmaceutycznych. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca P1112640-219 to oryginalna część do drukarki Zebra ZD421t w rozdzielczości 300 DPI. Wyższa rozdzielczość zapewnia lepszą jakość druku kodów 2D i drobnych elementów.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 102 mm/s (wolniejsza niż 203 DPI)</li>
</ul>

<h3>Kiedy wybrać 300 DPI?</h3>
<p>Rozdzielczość 300 DPI jest zalecana dla:</p>
<ul>
<li>Etykiet z kodami DataMatrix i QR (mniejsze rozmiary)</li>
<li>Etykiet farmaceutycznych z UDI i numerami seryjnymi</li>
<li>Etykiet elektronicznych z mikro-tekstem</li>
<li>Etykiet jubilerskich z drobnym opisem</li>
<li>Wydruków z grafiką wymagającą wyższej jakości</li>
</ul>

<h3>Zmiana rozdzielczości</h3>
<p><strong>Uwaga:</strong> Głowice 203 DPI i 300 DPI NIE są wymienne. Mają różną konstrukcję i inne ustawienia w sterowniku. Zmiana rozdzielczości wymaga:</p>
<ul>
<li>Zakupu nowej głowicy (inny Part Number)</li>
<li>Zmiany ustawień w sterowniku drukarki</li>
<li>Przeprojektowania szablonów etykiet</li>
</ul>

<h3>Czy warto?</h3>
<p>Jeśli drukujesz głównie etykiety wysyłkowe i kody kreskowe 1D – zostań przy 203 DPI. Jest tańsza, szybsza i wystarczająca.</p>',
  meta_title = 'Głowica Zebra ZD421t 300 DPI (P1112640-219) – Sklep | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZD421t. Dla kodów 2D i drobnego tekstu. Cena 968 zł netto. Gwarancja producenta. Serwis Zebra.'
WHERE sku = 'P1112640-219';

-- 11. Zebra ZD621t 300 DPI (P1112640-241)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki premium Zebra ZD621t. Najwyższa jakość druku w klasie biurkowej. Kolorowy wyświetlacz i zaawansowane funkcje. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1112640-241 to oryginalna część do drukarki premium Zebra ZD621t w rozdzielczości 300 DPI. Model ZD621 to flagowa drukarka biurkowa Zebra z kolorowym wyświetlaczem dotykowym i zaawansowanymi funkcjami.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 152 mm/s</li>
</ul>

<h3>Co wyróżnia ZD621?</h3>
<ul>
<li>Kolorowy wyświetlacz dotykowy 2.7"</li>
<li>Zaawansowana diagnostyka i alerty</li>
<li>Najwyższa jakość druku w klasie biurkowej</li>
<li>Dłuższa żywotność głowicy niż ZD421</li>
<li>Obsługa Link-OS (zarządzanie zdalne)</li>
</ul>

<h3>Dlaczego 300 DPI w ZD621?</h3>
<p>ZD621 z głowicą 300 DPI to wybór dla firm wymagających:</p>
<ul>
<li>Najwyższej jakości etykiet produktowych</li>
<li>Druku kodów 2D na małych etykietach</li>
<li>Profesjonalnych etykiet z grafiką i logotypami</li>
<li>Etykiet farmaceutycznych zgodnych z UDI</li>
</ul>

<h3>Różnica P1112640-241 vs P1112640-219 (ZD421)</h3>
<p>Choć obie głowice mają 300 DPI, są to różne części. Głowica do ZD621 ma dłuższą żywotność i jest zoptymalizowana pod wyższą prędkość druku.</p>',
  meta_title = 'Głowica Zebra ZD621t 300 DPI (P1112640-241) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZD621t premium. Najwyższa jakość w klasie biurkowej. Cena 968 zł netto. Wysyłka 24h.'
WHERE sku = 'P1112640-241';

-- 12. Zebra ZD621t 203 DPI (P1112640-240)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarki premium Zebra ZD621t. Standardowa rozdzielczość dla etykiet logistycznych i kodów 1D. Żywotność ~1.5 mln cali druku.',
  description_long = '<p>Głowica drukująca P1112640-240 to oryginalna część do drukarki premium Zebra ZD621t w standardowej rozdzielczości 203 DPI. Idealna do etykiet wysyłkowych, logistycznych i magazynowych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 203 mm/s</li>
</ul>

<h3>ZD621 vs ZD421 – którą wybrać?</h3>
<p>ZD621 to wersja premium z:</p>
<ul>
<li>Kolorowym wyświetlaczem dotykowym</li>
<li>Dłuższą żywotnością głowicy (1.5 mln vs 1 mln cali)</li>
<li>Wyższą prędkością druku (203 mm/s vs 152 mm/s)</li>
<li>Lepszą diagnostyką i zarządzaniem zdalnym</li>
</ul>

<h3>Kiedy wystarczy 203 DPI?</h3>
<p>Rozdzielczość 203 DPI jest optymalna dla:</p>
<ul>
<li>Etykiet wysyłkowych (InPost, DPD, DHL, UPS)</li>
<li>Kodów kreskowych 1D (EAN, Code 128)</li>
<li>Etykiet magazynowych i lokalizacyjnych</li>
<li>Standardowych etykiet produktowych</li>
</ul>

<h3>Oszczędność</h3>
<p>Głowica 203 DPI (P1112640-240) jest o ~50% tańsza niż 300 DPI (P1112640-241). Jeśli nie drukujesz kodów 2D ani drobnego tekstu – 203 DPI wystarczy.</p>',
  meta_title = 'Głowica Zebra ZD621t 203 DPI (P1112640-240) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZD621t. Drukarka premium z dłuższą żywotnością głowicy. Cena 475 zł netto. Wysyłka 24h.'
WHERE sku = 'P1112640-240';

-- 13. Zebra ZT210/ZT220/ZT230 203 DPI (P1037974-010)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarek przemysłowych Zebra ZT210, ZT220 i ZT230. Popularna seria średniej klasy. Jedna głowica pasuje do wszystkich trzech modeli.',
  description_long = '<p>Głowica drukująca P1037974-010 to oryginalna część do drukarek przemysłowych Zebra serii ZT2xx: ZT210, ZT220 i ZT230. Ta seria to świetny wybór dla firm szukających niezawodnej drukarki przemysłowej w przystępnej cenie.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZT210, ZT220, ZT230</li>
</ul>

<h3>Różnice między modelami ZT2xx</h3>
<ul>
<li><strong>ZT210</strong> – model podstawowy, mniejsza pamięć</li>
<li><strong>ZT220</strong> – wersja standardowa, więcej interfejsów</li>
<li><strong>ZT230</strong> – wersja premium z wyświetlaczem LCD</li>
</ul>
<p>Głowica P1037974-010 pasuje do WSZYSTKICH trzech modeli.</p>

<h3>Typowe zastosowania</h3>
<ul>
<li>Produkcja (etykiety na produkty)</li>
<li>Magazyny średniej wielkości</li>
<li>Logistyka (etykiety paletowe)</li>
<li>Handel (etykiety cenowe masowe)</li>
</ul>

<h3>Dlaczego seria ZT2xx?</h3>
<ul>
<li>Metalowa konstrukcja (trwałość przemysłowa)</li>
<li>Prędkość do 152 mm/s</li>
<li>Łatwa wymiana materiałów</li>
<li>Przystępna cena jak na klasę przemysłową</li>
</ul>

<h3>Wymiana głowicy w ZT2xx</h3>
<p>Wymiana wymaga demontażu pokrywy i mechanizmu taśmy. Zalecamy serwis autoryzowany – oferujemy wymianę z odbiorem kurierem.</p>',
  meta_title = 'Głowica Zebra ZT210 ZT220 ZT230 203 DPI (P1037974-010) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT210/ZT220/ZT230. Pasuje do wszystkich modeli serii ZT2xx. Cena 1400 zł netto. Serwis Zebra.'
WHERE sku = 'P1037974-010';

-- 14. Zebra ZT210/ZT220/ZT230 300 DPI (P1037974-011)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarek Zebra ZT210, ZT220 i ZT230. Wysoka rozdzielczość dla kodów 2D i precyzyjnych etykiet przemysłowych. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1037974-011 to oryginalna część do drukarek przemysłowych Zebra ZT210, ZT220 i ZT230 w rozdzielczości 300 DPI. Wyższa rozdzielczość dla zastosowań wymagających precyzji.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZT210, ZT220, ZT230</li>
</ul>

<h3>Kiedy wybrać 300 DPI w drukarce przemysłowej?</h3>
<p>Rozdzielczość 300 DPI jest zalecana gdy:</p>
<ul>
<li>Drukujesz kody DataMatrix do śledzenia produkcji</li>
<li>Etykiety zawierają drobny tekst (poniżej 6pt)</li>
<li>Wymagana jest wysoka jakość grafiki/logotypów</li>
<li>Drukujesz etykiety farmaceutyczne z UDI</li>
</ul>

<h3>Prędkość druku</h3>
<p><strong>Uwaga:</strong> Głowica 300 DPI drukuje wolniej niż 203 DPI:</p>
<ul>
<li>203 DPI: do 152 mm/s</li>
<li>300 DPI: do 102 mm/s</li>
</ul>
<p>Przy dużych wolumenach różnica jest odczuwalna.</p>

<h3>Wymienność głowic</h3>
<p>Głowice 203 DPI i 300 DPI NIE są wymienne. Zmiana rozdzielczości wymaga:</p>
<ul>
<li>Wymiany głowicy na odpowiedni model</li>
<li>Aktualizacji ustawień w sterowniku</li>
<li>Przeprojektowania szablonów etykiet</li>
</ul>',
  meta_title = 'Głowica Zebra ZT210 ZT220 ZT230 300 DPI (P1037974-011) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT210/ZT220/ZT230. Wysoka rozdzielczość dla kodów 2D. Cena 1874 zł netto. Gwarancja 12 mies.'
WHERE sku = 'P1037974-011';

-- 15. Zebra ZT410/ZT411 203 DPI (P1058930-009)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarek przemysłowych Zebra ZT410 i ZT411. Najpopularniejsze drukarki przemysłowe Zebra. Żywotność ~2 mln cali druku.',
  description_long = '<p>Głowica drukująca P1058930-009 to oryginalna część do najpopularniejszych drukarek przemysłowych Zebra: ZT410 i ZT411. Te drukarki są standardem w produkcji i logistyce na całym świecie.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 356 mm/s (14"/s)</li>
<li>Kompatybilność: ZT410, ZT411</li>
</ul>

<h3>ZT410 vs ZT411 – czym się różnią?</h3>
<p>ZT411 to nowsza wersja z:</p>
<ul>
<li>Większym kolorowym wyświetlaczem dotykowym</li>
<li>Lepszą łącznością (Wi-Fi, Bluetooth opcjonalnie)</li>
<li>Obsługą Link-OS Cloud Connect</li>
</ul>
<p>Głowica P1058930-009 pasuje do OBU modeli!</p>

<h3>Dlaczego ZT410/ZT411 jest tak popularna?</h3>
<ul>
<li>Najwyższa niezawodność w klasie</li>
<li>Prędkość druku do 356 mm/s</li>
<li>Metalowa konstrukcja na lata</li>
<li>Łatwa obsługa i konserwacja</li>
<li>Szeroka baza akcesoriów</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Produkcja (etykiety na produkty, WIP)</li>
<li>Centra dystrybucji (etykiety wysyłkowe)</li>
<li>Magazyny (etykiety paletowe)</li>
<li>Automotive (etykiety na części)</li>
</ul>

<h3>Wymiana głowicy</h3>
<p>1. Wyłącz drukarkę, otwórz pokrywę<br>
2. Zwolnij mechanizm głowicy (dźwignia)<br>
3. Odłącz kabel flat i odkręć śruby<br>
4. Zamontuj nową głowicę<br>
5. Wykonaj kalibrację z panelu drukarki</p>',
  meta_title = 'Głowica Zebra ZT410 ZT411 203 DPI (P1058930-009) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT410/ZT411 – najpopularniejszych drukarek przemysłowych. Cena 1765 zł netto. Wysyłka 24-72h.'
WHERE sku = 'P1058930-009';

-- 16. Zebra ZT410/ZT411 600 DPI (P1058930-011)
UPDATE products SET
  description = 'Oryginalna głowica 600 DPI do drukarek Zebra ZT410 i ZT411. Najwyższa rozdzielczość dla mikro-kodów i etykiet precyzyjnych. Żywotność ~1 mln cali.',
  description_long = '<p>Głowica drukująca P1058930-011 to oryginalna część do drukarek Zebra ZT410 i ZT411 w najwyższej dostępnej rozdzielczości 600 DPI. Przeznaczona do specjalistycznych zastosowań wymagających ekstremalnej precyzji.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 600 DPI (24 punkty/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 000 000 cali (25 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 152 mm/s (wolniejsza niż 203/300 DPI)</li>
</ul>

<h3>Kiedy potrzebujesz 600 DPI?</h3>
<p>Rozdzielczość 600 DPI jest niezbędna dla:</p>
<ul>
<li>Etykiet jubilerskich z mikro-tekstem</li>
<li>Etykiet na elektronikę (numery seryjne, kody na małej powierzchni)</li>
<li>Mikro-kodów DataMatrix (poniżej 3mm)</li>
<li>Etykiet farmaceutycznych z bardzo drobnym drukiem</li>
<li>Zastosowań wymagających najwyższej jakości grafiki</li>
</ul>

<h3>Uwagi dotyczące 600 DPI</h3>
<ul>
<li>Głowica jest ~3x droższa niż 203 DPI</li>
<li>Żywotność jest krótsza (gęstsze elementy grzewcze)</li>
<li>Prędkość druku znacząco niższa</li>
<li>Wymaga specjalnych materiałów (gładsze etykiety)</li>
</ul>

<h3>Czy na pewno potrzebujesz 600 DPI?</h3>
<p>Dla większości zastosowań przemysłowych 203 DPI lub 300 DPI jest wystarczające. 600 DPI to wybór dla wąskiej grupy specjalistycznych aplikacji.</p>',
  meta_title = 'Głowica Zebra ZT410 ZT411 600 DPI (P1058930-011) | TAKMA',
  meta_description = 'Oryginalna głowica 600 DPI do Zebra ZT410/ZT411. Najwyższa rozdzielczość dla mikro-kodów. Cena 5431 zł netto. Specjalistyczne zastosowania.'
WHERE sku = 'P1058930-011';

-- 17. Zebra ZT410/ZT411 300 DPI (P1058930-010)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarek Zebra ZT410 i ZT411. Optymalny wybór dla kodów 2D i etykiet farmaceutycznych. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1058930-010 to oryginalna część do drukarek Zebra ZT410 i ZT411 w rozdzielczości 300 DPI. Najczęściej wybierana rozdzielczość dla zastosowań wymagających wyższej jakości niż standardowe 203 DPI.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 305 mm/s</li>
</ul>

<h3>300 DPI – złoty środek</h3>
<p>Rozdzielczość 300 DPI oferuje dobry kompromis między:</p>
<ul>
<li>Jakością druku (wystarczająca dla kodów 2D)</li>
<li>Prędkością (305 mm/s vs 152 mm/s przy 600 DPI)</li>
<li>Ceną (2059 zł vs 5431 zł za 600 DPI)</li>
<li>Żywotnością (1.5 mln vs 1 mln cali przy 600 DPI)</li>
</ul>

<h3>Typowe zastosowania 300 DPI</h3>
<ul>
<li>Etykiety farmaceutyczne z UDI (DataMatrix)</li>
<li>Etykiety elektroniczne z QR kodami</li>
<li>Produkty FMCG z drobnym tekstem</li>
<li>Etykiety na komponenty automotive</li>
<li>Wszystko gdzie 203 DPI nie wystarcza</li>
</ul>

<h3>Porównanie głowic ZT410/ZT411</h3>
<table>
<tr><th>Cecha</th><th>203 DPI</th><th>300 DPI</th><th>600 DPI</th></tr>
<tr><td>Part Number</td><td>P1058930-009</td><td>P1058930-010</td><td>P1058930-011</td></tr>
<tr><td>Cena</td><td>1765 zł</td><td>2059 zł</td><td>5431 zł</td></tr>
<tr><td>Prędkość</td><td>356 mm/s</td><td>305 mm/s</td><td>152 mm/s</td></tr>
<tr><td>Żywotność</td><td>2 mln cali</td><td>1.5 mln</td><td>1 mln</td></tr>
</table>',
  meta_title = 'Głowica Zebra ZT410 ZT411 300 DPI (P1058930-010) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT410/ZT411. Idealna dla kodów 2D i farmacji. Cena 2059 zł netto. Gwarancja 12 miesięcy.'
WHERE sku = 'P1058930-010';

-- 18. Zebra ZT411 RFID 300 DPI (P1105147-301)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki Zebra ZT411 z modułem RFID. Specjalna konstrukcja kompatybilna z enkoderem RFID. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1105147-301 to oryginalna część do drukarki Zebra ZT411 wyposażonej w moduł RFID (ZT411R). Ta specjalna głowica jest zoptymalizowana do pracy z enkoderem RFID.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: TYLKO ZT411 z modułem RFID (ZT411R)</li>
</ul>

<h3>Specjalna głowica RFID</h3>
<p><strong>UWAGA:</strong> Ta głowica jest przeznaczona WYŁĄCZNIE do drukarek ZT411 z modułem RFID. NIE pasuje do standardowych ZT410/ZT411 bez RFID. Standardowe drukarki używają głowicy P1058930-010.</p>

<h3>Dlaczego inna głowica dla RFID?</h3>
<p>Drukarki RFID mają zmodyfikowaną ścieżkę prowadzenia etykiet i pozycję enkodera. Głowica RFID ma dostosowaną konstrukcję zapewniającą prawidłowe pozycjonowanie druku względem chipa RFID.</p>

<h3>Typowe zastosowania ZT411 RFID</h3>
<ul>
<li>Etykiety RFID do śledzenia towarów</li>
<li>Oznaczenia palet z tagami UHF</li>
<li>Etykiety na odzież (fashion retail)</li>
<li>Zarządzanie aktywami (asset tracking)</li>
<li>Logistyka z automatyczną identyfikacją</li>
</ul>

<h3>Ważne przy zamawianiu</h3>
<p>Przed zamówieniem upewnij się, że Twoja drukarka to model ZT411R (z RFID), a nie standardowy ZT411.</p>',
  meta_title = 'Głowica Zebra ZT411 RFID 300 DPI (P1105147-301) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT411 RFID. Specjalna wersja dla drukarek z enkoderem RFID. Cena 2586 zł netto. Serwis Zebra.'
WHERE sku = 'P1105147-301';

-- 19. Zebra ZT411 RFID 203 DPI (P1105147-300)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarki Zebra ZT411 z modułem RFID. Standardowa rozdzielczość dla etykiet RFID logistycznych. Żywotność ~2 mln cali.',
  description_long = '<p>Głowica drukująca P1105147-300 to oryginalna część do drukarki Zebra ZT411 z modułem RFID (ZT411R) w standardowej rozdzielczości 203 DPI. Idealna do etykiet RFID logistycznych i paletowych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: TYLKO ZT411 z modułem RFID (ZT411R)</li>
</ul>

<h3>Specjalna głowica RFID</h3>
<p><strong>UWAGA:</strong> Ta głowica pasuje WYŁĄCZNIE do drukarek ZT411 z modułem RFID. Standardowe ZT410/ZT411 bez RFID używają głowicy P1058930-009.</p>

<h3>203 DPI vs 300 DPI dla RFID</h3>
<p>Rozdzielczość 203 DPI jest wystarczająca dla większości etykiet RFID:</p>
<ul>
<li>Etykiety paletowe z kodem kreskowym GS1-128</li>
<li>Etykiety logistyczne ze standardowym tekstem</li>
<li>Tagi RFID na kartony i opakowania</li>
</ul>
<p>300 DPI (P1105147-301) wybierz gdy drukujesz małe kody 2D na etykietach RFID lub wymagasz wyższej jakości grafiki.</p>

<h3>Zalety 203 DPI</h3>
<ul>
<li>Niższa cena głowicy (2283 zł vs 2586 zł)</li>
<li>Dłuższa żywotność (2 mln vs 1.5 mln cali)</li>
<li>Wyższa prędkość druku</li>
</ul>',
  meta_title = 'Głowica Zebra ZT411 RFID 203 DPI (P1105147-300) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT411 RFID. Dla etykiet RFID logistycznych. Cena 2283 zł netto. Gwarancja 12 miesięcy.'
WHERE sku = 'P1105147-300';

-- 20. Zebra ZT420/ZT421 300 DPI (P1058930-013)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do szerokotorowych drukarek Zebra ZT420 i ZT421. Szerokość druku 168 mm (6.6") dla dużych etykiet. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1058930-013 to oryginalna część do szerokotorowych drukarek przemysłowych Zebra ZT420 i ZT421 w rozdzielczości 300 DPI. Idealna dla dużych etykiet z kodami 2D.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6") – szersza niż ZT410!</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Kompatybilność: ZT420, ZT421 (wersje 6-calowe)</li>
</ul>

<h3>ZT420 vs ZT421 – różnice</h3>
<ul>
<li><strong>ZT420</strong> – poprzednia generacja</li>
<li><strong>ZT421</strong> – nowsza wersja z dotykowym wyświetlaczem i Link-OS</li>
</ul>
<p>Głowica P1058930-013 pasuje do OBU modeli.</p>

<h3>Kiedy potrzebujesz drukarki 6-calowej?</h3>
<ul>
<li>Etykiety paletowe formatu A5/A6</li>
<li>Duże etykiety wysyłkowe</li>
<li>Etykiety z wieloma kodami kreskowymi</li>
<li>Oznaczenia na duże opakowania zbiorcze</li>
</ul>

<h3>300 DPI dla szerokiego toru</h3>
<p>Rozdzielczość 300 DPI na szerokości 168 mm zapewnia wysoką jakość:</p>
<ul>
<li>Kodów 2D na całej szerokości etykiety</li>
<li>Grafiki i logotypów w dużym formacie</li>
<li>Drobnego tekstu na etykietach specyfikacyjnych</li>
</ul>

<h3>Porównanie z ZT410/ZT411</h3>
<table>
<tr><th>Cecha</th><th>ZT410/411</th><th>ZT420/421</th></tr>
<tr><td>Szerokość</td><td>104 mm</td><td>168 mm</td></tr>
<tr><td>Part Number 300 DPI</td><td>P1058930-010</td><td>P1058930-013</td></tr>
<tr><td>Cena</td><td>2059 zł</td><td>3032 zł</td></tr>
</table>',
  meta_title = 'Głowica Zebra ZT420 ZT421 300 DPI 6" (P1058930-013) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT420/ZT421 (6 cali). Szerokość 168mm dla dużych etykiet. Cena 3032 zł netto. Wysyłka 24-72h.'
WHERE sku = 'P1058930-013';

-- 21. Zebra ZT420/ZT421 203 DPI (P1058930-012)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do szerokotorowych drukarek Zebra ZT420 i ZT421. Szerokość druku 168 mm dla etykiet paletowych i opakowań zbiorczych. Żywotność ~2 mln cali.',
  description_long = '<p>Głowica drukująca P1058930-012 to oryginalna część do szerokotorowych drukarek przemysłowych Zebra ZT420 i ZT421 w standardowej rozdzielczości 203 DPI. Optymalna dla dużych etykiet logistycznych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 305 mm/s</li>
<li>Kompatybilność: ZT420, ZT421</li>
</ul>

<h3>Typowe zastosowania drukarki 6-calowej</h3>
<ul>
<li>Etykiety paletowe GS1-128 (duży format)</li>
<li>Etykiety wysyłkowe formatu A5</li>
<li>Oznaczenia opakowań zbiorczych</li>
<li>Etykiety na duże produkty (AGD, meble)</li>
<li>Dokumenty przewozowe</li>
</ul>

<h3>Dlaczego 203 DPI wystarczy?</h3>
<p>Dla etykiet paletowych i logistycznych 203 DPI jest optymalną rozdzielczością:</p>
<ul>
<li>Kody kreskowe 1D są czytelne</li>
<li>Tekst standardowej wielkości jest ostry</li>
<li>Wyższa prędkość druku (305 mm/s vs 203 mm/s)</li>
<li>Dłuższa żywotność głowicy</li>
<li>Niższa cena (1946 zł vs 3032 zł)</li>
</ul>

<h3>Kiedy wybrać 300 DPI?</h3>
<p>Tylko jeśli drukujesz kody 2D na dużych etykietach lub wymagasz wyższej jakości grafiki.</p>',
  meta_title = 'Głowica Zebra ZT420 ZT421 203 DPI 6" (P1058930-012) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT420/ZT421 6-calowych. Dla etykiet paletowych. Cena 1946 zł netto. Gwarancja producenta.'
WHERE sku = 'P1058930-012';

-- 22. Zebra ZT510 300 DPI (P1083347-006)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do drukarki przemysłowej Zebra ZT510. Ekonomiczna drukarka z metalową konstrukcją. Wysoka jakość dla kodów 2D. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1083347-006 to oryginalna część do drukarki przemysłowej Zebra ZT510 w rozdzielczości 300 DPI. ZT510 to ekonomiczna alternatywa dla ZT410 z zachowaniem metalowej konstrukcji.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 203 mm/s</li>
</ul>

<h3>ZT510 vs ZT410/ZT411</h3>
<p>ZT510 to ekonomiczna wersja z:</p>
<ul>
<li>Tą samą metalową konstrukcją</li>
<li>Niższą ceną drukarki</li>
<li>Prostszym interfejsem (bez dotykowego wyświetlacza)</li>
<li>Mniejszą ilością interfejsów w standardzie</li>
</ul>

<h3>Kiedy wybrać ZT510 zamiast ZT410?</h3>
<ul>
<li>Budżet jest ograniczony</li>
<li>Nie potrzebujesz dotykowego wyświetlacza</li>
<li>Wystarczy podstawowa konfiguracja sieciowa</li>
<li>Szukasz niezawodności przemysłowej w niższej cenie</li>
</ul>

<h3>300 DPI w ZT510</h3>
<p>Rozdzielczość 300 DPI zapewnia wysoką jakość druku kodów 2D i drobnego tekstu przy zachowaniu przystępnej ceny głowicy.</p>',
  meta_title = 'Głowica Zebra ZT510 300 DPI (P1083347-006) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT510. Ekonomiczna drukarka przemysłowa. Cena 2061 zł netto. Wysyłka 24-72h. Serwis Zebra.'
WHERE sku = 'P1083347-006';

-- 23. Zebra ZT510 203 DPI (P1083347-005)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do drukarki przemysłowej Zebra ZT510. Standardowa rozdzielczość dla etykiet logistycznych. Ekonomiczna drukarka przemysłowa. Żywotność ~2 mln cali.',
  description_long = '<p>Głowica drukująca P1083347-005 to oryginalna część do ekonomicznej drukarki przemysłowej Zebra ZT510 w standardowej rozdzielczości 203 DPI. Optymalna dla etykiet logistycznych i magazynowych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 000 000 cali (50 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 305 mm/s</li>
</ul>

<h3>ZT510 – dla kogo?</h3>
<p>Zebra ZT510 to świetny wybór dla firm, które:</p>
<ul>
<li>Potrzebują niezawodności przemysłowej</li>
<li>Mają ograniczony budżet</li>
<li>Nie wymagają zaawansowanych funkcji</li>
<li>Cenią prostotę obsługi</li>
</ul>

<h3>Zalety 203 DPI w ZT510</h3>
<ul>
<li>Niższa cena głowicy (1858 zł vs 2061 zł za 300 DPI)</li>
<li>Dłuższa żywotność (2 mln vs 1.5 mln cali)</li>
<li>Wyższa prędkość druku (305 mm/s vs 203 mm/s)</li>
<li>Wystarczająca jakość dla kodów 1D i standardowego tekstu</li>
</ul>

<h3>Typowe zastosowania</h3>
<ul>
<li>Etykiety wysyłkowe i logistyczne</li>
<li>Etykiety magazynowe (lokalizacje, palety)</li>
<li>Etykiety produktowe (ceny, opisy)</li>
<li>Oznaczenia w produkcji</li>
</ul>',
  meta_title = 'Głowica Zebra ZT510 203 DPI (P1083347-005) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT510. Ekonomiczna drukarka przemysłowa. Cena 1858 zł netto. Gwarancja 12 miesięcy.'
WHERE sku = 'P1083347-005';

-- 24. Zebra ZT610/ZT610R 203 DPI (P1083320-010)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do flagowych drukarek przemysłowych Zebra ZT610 i ZT610R (RFID). Najwyższa wydajność i niezawodność. Żywotność ~3 mln cali.',
  description_long = '<p>Głowica drukująca P1083320-010 to oryginalna część do flagowych drukarek przemysłowych Zebra ZT610 i ZT610R w rozdzielczości 203 DPI. Seria ZT600 to szczyt oferty Zebra dla wymagających środowisk produkcyjnych.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~3 000 000 cali (75 km etykiet) – najdłuższa w ofercie!</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 356 mm/s (14"/s)</li>
<li>Kompatybilność: ZT610, ZT610R (wersja RFID)</li>
</ul>

<h3>Dlaczego ZT610 jest najlepsza?</h3>
<ul>
<li>Najdłuższa żywotność głowicy (3 mln cali)</li>
<li>Najwyższa prędkość druku (356 mm/s)</li>
<li>Duży kolorowy wyświetlacz dotykowy 4.3"</li>
<li>Zaawansowana diagnostyka i zarządzanie</li>
<li>Metalowa konstrukcja na lata intensywnej pracy</li>
</ul>

<h3>Dla kogo ZT610?</h3>
<ul>
<li>Centra dystrybucji drukujące &gt;10 000 etykiet/dzień</li>
<li>Linie produkcyjne wymagające ciągłej pracy 24/7</li>
<li>Firmy z zaawansowanymi wymaganiami zarządzania drukiem</li>
<li>Aplikacje wymagające najwyższej niezawodności</li>
</ul>

<h3>ZT610 vs ZT610R</h3>
<p>Model ZT610R ma wbudowany moduł RFID do etykiet z chipami. Głowica P1083320-010 pasuje do OBU wersji.</p>',
  meta_title = 'Głowica Zebra ZT610 ZT610R 203 DPI (P1083320-010) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT610/ZT610R – flagowej drukarki przemysłowej. Żywotność 3 mln cali. Cena 2101 zł netto.'
WHERE sku = 'P1083320-010';

-- 25. Zebra ZT610/ZT610R 600 DPI (P1083320-012)
UPDATE products SET
  description = 'Oryginalna głowica 600 DPI do drukarek Zebra ZT610 i ZT610R. Najwyższa rozdzielczość dla mikro-kodów i etykiet precyzyjnych. Żywotność ~1.5 mln cali.',
  description_long = '<p>Głowica drukująca P1083320-012 to oryginalna część do drukarek Zebra ZT610 i ZT610R w najwyższej rozdzielczości 600 DPI. Przeznaczona do specjalistycznych zastosowań wymagających ekstremalnej precyzji druku.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 600 DPI (24 punkty/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~1 500 000 cali (37 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 152 mm/s</li>
</ul>

<h3>Kiedy potrzebujesz 600 DPI w ZT610?</h3>
<ul>
<li>Etykiety jubilerskie z mikro-tekstem</li>
<li>Etykiety elektroniczne z bardzo małymi kodami</li>
<li>Mikro-kody DataMatrix (poniżej 3mm)</li>
<li>Zastosowania farmaceutyczne wymagające najwyższej precyzji</li>
<li>Druk grafiki o najwyższej jakości</li>
</ul>

<h3>Porównanie głowic ZT610</h3>
<table>
<tr><th>Rozdzielczość</th><th>Part Number</th><th>Cena</th><th>Żywotność</th><th>Prędkość</th></tr>
<tr><td>203 DPI</td><td>P1083320-010</td><td>2101 zł</td><td>3 mln cali</td><td>356 mm/s</td></tr>
<tr><td>300 DPI</td><td>P1083320-011</td><td>2343 zł</td><td>2.5 mln</td><td>305 mm/s</td></tr>
<tr><td>600 DPI</td><td>P1083320-012</td><td>2990 zł</td><td>1.5 mln</td><td>152 mm/s</td></tr>
</table>

<h3>Uwaga</h3>
<p>600 DPI wymaga gładkich materiałów i wolniejszej prędkości druku. Dla większości zastosowań 300 DPI oferuje lepszy kompromis.</p>',
  meta_title = 'Głowica Zebra ZT610 ZT610R 600 DPI (P1083320-012) | TAKMA',
  meta_description = 'Oryginalna głowica 600 DPI do Zebra ZT610/ZT610R. Najwyższa rozdzielczość dla mikro-kodów. Cena 2990 zł netto. Specjalistyczne zastosowania.'
WHERE sku = 'P1083320-012';

-- 26. Zebra ZT610/ZT610R 300 DPI (P1083320-011)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do flagowych drukarek Zebra ZT610 i ZT610R. Optymalny wybór dla kodów 2D i wysokiej jakości druku. Żywotność ~2.5 mln cali.',
  description_long = '<p>Głowica drukująca P1083320-011 to oryginalna część do flagowych drukarek przemysłowych Zebra ZT610 i ZT610R w rozdzielczości 300 DPI. Najczęściej wybierana rozdzielczość dla zastosowań wymagających wysokiej jakości.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 104 mm (4")</li>
<li>Żywotność: ~2 500 000 cali (62 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 305 mm/s</li>
</ul>

<h3>Dlaczego 300 DPI w ZT610?</h3>
<p>Rozdzielczość 300 DPI to złoty środek oferujący:</p>
<ul>
<li>Wysoką jakość dla kodów 2D (DataMatrix, QR)</li>
<li>Dobrą prędkość druku (305 mm/s)</li>
<li>Długą żywotność (2.5 mln cali)</li>
<li>Rozsądną cenę (między 203 a 600 DPI)</li>
</ul>

<h3>Typowe zastosowania 300 DPI w ZT610</h3>
<ul>
<li>Etykiety farmaceutyczne z UDI</li>
<li>Etykiety automotive z kodami 2D</li>
<li>Etykiety elektroniczne z numerami seryjnymi</li>
<li>Produkty FMCG z drobnym tekstem</li>
<li>Wszystko gdzie 203 DPI nie wystarcza</li>
</ul>

<h3>ZT610 z 300 DPI vs ZT410 z 300 DPI</h3>
<table>
<tr><th>Cecha</th><th>ZT410</th><th>ZT610</th></tr>
<tr><td>Żywotność 300 DPI</td><td>1.5 mln cali</td><td>2.5 mln cali</td></tr>
<tr><td>Prędkość</td><td>305 mm/s</td><td>305 mm/s</td></tr>
<tr><td>Wyświetlacz</td><td>4.3" mono</td><td>4.3" kolor</td></tr>
<tr><td>Cena głowicy</td><td>2059 zł</td><td>2343 zł</td></tr>
</table>',
  meta_title = 'Głowica Zebra ZT610 ZT610R 300 DPI (P1083320-011) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT610/ZT610R. Optymalna dla kodów 2D. Żywotność 2.5 mln cali. Cena 2343 zł netto.'
WHERE sku = 'P1083320-011';

-- 27. Zebra ZT620/ZT620R 203 DPI (P1083320-015)
UPDATE products SET
  description = 'Oryginalna głowica 203 DPI do szerokotorowych drukarek Zebra ZT620 i ZT620R (RFID). Szerokość 168 mm dla dużych etykiet. Flagowa wydajność. Żywotność ~3 mln cali.',
  description_long = '<p>Głowica drukująca P1083320-015 to oryginalna część do flagowych szerokotorowych drukarek Zebra ZT620 i ZT620R w rozdzielczości 203 DPI. Seria ZT600 w wersji 6-calowej dla największych etykiet.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 203 DPI (8 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6") – największa w serii ZT</li>
<li>Żywotność: ~3 000 000 cali (75 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 305 mm/s</li>
<li>Kompatybilność: ZT620, ZT620R (RFID)</li>
</ul>

<h3>Kiedy potrzebujesz ZT620?</h3>
<ul>
<li>Etykiety paletowe dużego formatu (A5, A6)</li>
<li>Dokumenty przewozowe wielokodowe</li>
<li>Etykiety na duże opakowania zbiorcze</li>
<li>Oznaczenia na palety EUR/przemysłowe</li>
<li>Duże etykiety RFID (model ZT620R)</li>
</ul>

<h3>ZT620 vs ZT420</h3>
<table>
<tr><th>Cecha</th><th>ZT420/421</th><th>ZT620</th></tr>
<tr><td>Żywotność 203 DPI</td><td>2 mln cali</td><td>3 mln cali</td></tr>
<tr><td>Wyświetlacz</td><td>4.3"</td><td>4.3" kolor</td></tr>
<tr><td>Zarządzanie</td><td>Link-OS</td><td>Link-OS + zaawansowane</td></tr>
<tr><td>Cena głowicy</td><td>1946 zł</td><td>2606 zł</td></tr>
</table>

<h3>Flagowa niezawodność</h3>
<p>ZT620 to najbardziej zaawansowana drukarka 6-calowa Zebra. Głowica o żywotności 3 mln cali minimalizuje przestoje i koszty eksploatacji.</p>',
  meta_title = 'Głowica Zebra ZT620 ZT620R 203 DPI 6" (P1083320-015) | TAKMA',
  meta_description = 'Oryginalna głowica 203 DPI do Zebra ZT620/ZT620R 6". Flagowa drukarka, żywotność 3 mln cali. Cena 2606 zł netto. Serwis Zebra.'
WHERE sku = 'P1083320-015';

-- 28. Zebra ZT620/ZT620R 300 DPI (P1083320-016)
UPDATE products SET
  description = 'Oryginalna głowica 300 DPI do szerokotorowych drukarek Zebra ZT620 i ZT620R. Wysoka rozdzielczość na szerokości 168 mm dla precyzyjnych dużych etykiet. Żywotność ~2.5 mln cali.',
  description_long = '<p>Głowica drukująca P1083320-016 to oryginalna część do flagowych szerokotorowych drukarek Zebra ZT620 i ZT620R w rozdzielczości 300 DPI. Najwyższa jakość druku na dużych etykietach.</p>

<h3>Specyfikacja techniczna</h3>
<ul>
<li>Rozdzielczość: 300 DPI (12 punktów/mm)</li>
<li>Szerokość druku: 168 mm (6.6")</li>
<li>Żywotność: ~2 500 000 cali (62 km etykiet)</li>
<li>Technologia: druk termiczny i termotransferowy</li>
<li>Prędkość: do 203 mm/s</li>
<li>Kompatybilność: ZT620, ZT620R (RFID)</li>
</ul>

<h3>300 DPI na szerokości 168 mm</h3>
<p>Kombinacja wysokiej rozdzielczości i szerokiego toru druku to:</p>
<ul>
<li>Precyzyjne kody 2D na całej szerokości etykiety</li>
<li>Ostra grafika i logotypy w dużym formacie</li>
<li>Drobny tekst na etykietach specyfikacyjnych</li>
<li>Profesjonalne dokumenty przewozowe</li>
</ul>

<h3>Typowe zastosowania ZT620 z 300 DPI</h3>
<ul>
<li>Etykiety paletowe z kodami DataMatrix</li>
<li>Duże etykiety produktowe z grafiką</li>
<li>Dokumenty jakościowe (CoA, certyfikaty)</li>
<li>Etykiety na produkty premium</li>
</ul>

<h3>Porównanie głowic ZT620</h3>
<table>
<tr><th>Rozdzielczość</th><th>Part Number</th><th>Cena</th><th>Żywotność</th></tr>
<tr><td>203 DPI</td><td>P1083320-015</td><td>2606 zł</td><td>3 mln cali</td></tr>
<tr><td>300 DPI</td><td>P1083320-016</td><td>2970 zł</td><td>2.5 mln cali</td></tr>
</table>

<h3>Kiedy 203 DPI wystarczy?</h3>
<p>Dla standardowych etykiet paletowych z kodami 1D i typowym tekstem – 203 DPI jest tańsza i ma dłuższą żywotność.</p>',
  meta_title = 'Głowica Zebra ZT620 ZT620R 300 DPI 6" (P1083320-016) | TAKMA',
  meta_description = 'Oryginalna głowica 300 DPI do Zebra ZT620/ZT620R 6". Wysoka jakość na dużych etykietach. Cena 2970 zł netto. Gwarancja 12 mies.'
WHERE sku = 'P1083320-016';

-- =====================================================
-- KONIEC AKTUALIZACJI
-- Po wykonaniu sprawdź kilka produktów w panelu admina
-- =====================================================
