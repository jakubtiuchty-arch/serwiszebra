# Audyt drukarek kart i materiałów Zebra — 8 października 2026

## Zakres i status

Audyt obejmuje kategorię ZC100/ZC300, karty obu modeli, 17 materiałów, nawigację, multimedia, routing zakupu oraz ceny i dostępność w renderowaniu serwerowym. Przegląd wykonano na bieżących plikach roboczych projektu `serwiszebra`. Dane TAKMA z `src/data/products.ts` były materiałem roboczym, nie autorytatywnym źródłem zgodności.

**Status: końcowy build, kontrola HTTP 17 produktów i odbiór kategorii desktop/mobile zakończone bez nowego błędu blokującego.** Prowadzący zadanie potwierdził 17 rekordów staged w DB i 17 cen w cache. Potwierdzono dodanie jednego opakowania kart do koszyka; końcowe sprawdzenie linku z koszyka i miniatury na stronie zamówienia pozostaje do dopisania po odbiorze prowadzącego zadanie. Wyniki dotyczą lokalnego podglądu po buildzie, nie wdrożenia produkcyjnego. Nie wykonano testowego zamówienia, płatności ani wysyłki wiadomości do klienta. Autor audytu nie zmieniał kodu ani bazy danych; poprawki wdrażali autorzy odpowiednich modułów.

## Źródła i granice potwierdzenia

### Dokumentacja producenta

- **Z1 — specyfikacja Zebra ZC100:** https://www.zebra.com/gb/en/products/spec-sheets/printers/card/zc100.html . Potwierdza YMCKO 200, półpanelową YMCKO 400, czerń monochromatyczną 2000, pozostałe wymienione kolory monochromatyczne 1500, rolkę czyszczącą w kasecie oraz zestawy 2/5 kart czyszczących. Zakres grubości kart: 10–40 mil. Tabela nie przypisuje pełnych PN EMEA i nie wymienia YMCKO 300.
- **Z2 — specyfikacja Zebra ZC300:** https://www.zebra.com/gb/en/products/spec-sheets/printers/card/zc300.html . Potwierdza YMCKO 200/300, YMCKOK 200, półpanelową YMCKO 400, KdO/KrO 700 oraz mono 2000/1500. Tabela nie przypisuje pełnych PN EMEA.
- **Z3 — firmware ZC100/300, release notes V201.01.19:** https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/release-notes/Firmware_Release_Notes_12012024.pdf . Strona 2: V201.01.17 dodał obsługę kaset z wieloma rolkami; V201.01.18 dodał obsługę 800300-255EM. Przy tym PN dokument nie ogranicza wpisu do ZC300, choć jest wspólny dla rodziny ZC100/300. Zgodność 255EM z ZC100 w katalogu zachowano z wymogiem firmware V201.01.18 lub nowszego; nie przedstawiamy tego jako osobnego, jednoznacznego wpisu w tabeli zgodności PN producenta.
- **Z4 — zestawy czyszczące:** https://support.zebra.com/article/000018863 . Artykuł Zebra „Cleaning card kit for ZC Series Card Printer” podaje 105999-310: 2 karty i 105999-311: 5 kart. Pełne numery z końcówką `-01` potwierdzają katalogi dystrybucyjne, nie ten artykuł.
- **Z5 — instrukcja sterownika Linux ZC100/300:** https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/software/zc100-zc300-series-linux-driver-ug-en.pdf . Sekcja Cleaning, strona drukowana 9: zalecany i domyślny interwał czyszczenia wynosi 1000 kart. Maksymalna nastawa 5000 nie jest zalecanym interwałem. Nie należy mylić karty czyszczącej z rolką wymienianą wraz z kasetą taśmy.
- **Z6 — instrukcja użytkownika ZC100/300:** https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/zc100-zc300-ug-en.pdf . Dokument P1094920-001 opisuje ładowanie kasety, rolkę czyszczącą, obsługę kart i czyszczenie.
- **Z7 — materiały Zebra dla Walmart:** https://mktg.zebra.com/Walmart_SupplyChain_Experience . Potwierdzenie pełnego PN 104523-111: białe karty PVC, 30 mil, 500 kart w pudełku.
- **Z8 — instrukcja P310i, pomocniczo jednostki i pakowanie 104523-111:** https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/p310i-ug-en.pdf . Strona drukowana 34: 104523-111 to 5 pakietów po 100 kart; 10 mil = 0,254 mm, 30 mil = 0,762 mm. To starsza instrukcja innej drukarki, więc nie stanowi dowodu zgodności konkretnego materiału z ZC100/ZC300.

Nie znaleziono publicznej tabeli producenta łączącej wszystkie 17 pełnych PN EMEA ze zgodnością, pakowaniem i jednostką handlową. Nie należy nazywać wszystkich 17 pozycji indywidualnie potwierdzonymi przez producenta. Regionalne końcówki PN mają znaczenie; danych wariantów USA nie można automatycznie przenosić na EMEA.

### Źródła dystrybucyjne — uzupełnienie, nie dokumentacja producenta

- **D1 — EET, 800300-254EM:** https://www.eetgroup.com/en-eu/800300-254em-zebra-ribbon-multipack-color-ymcko-58mmx99m228inx324ft-800-images-zc100zc300-emea-wid-w127146823 . Zawartość: jedna pusta kaseta do ponownego załadowania, cztery rolki po 200 wydruków, cztery rolki czyszczące. Chip obsługuje łącznie 800 wydruków. Nie jest to opakowanie czterech kompletnych kaset ani kaseta do nieograniczonego uzupełniania.
- **D2 — Plastic-ID, to samo opakowanie:** https://www.plastic-id.com/zebra-ymcko-multipack-ribbons-and-refillable-cartridge-pid . Niezależne potwierdzenie zawartości 254EM i sprzedaży całego zestawu.
- **D3 — SDL System, akcesoria ZC100:** https://www.sdlsystem.se/sv-se/product/zebra-zc100-single-sided-12-dots-mm-%28300-dpi%29-usb-zc11-0000000em00 . Pełne numery 105999-310-01/311-01 oraz 800300-370EM z opisem ZC100/ZC300. Także mono 301/302/304/306/307/309EM. To katalog dystrybutora, mimo marki Zebra w treści.
- **D4 — katalog Zebrasupplies.nl:** https://www.zebrasupplies.nl/artikel/178/ribbons_voor_zc100_150_300_350_card_printers . Mapowanie 320EM → KdO, 321EM → KrO, po 700 wydruków, ZC300; 360EM → YMCKOK 200, ZC300. Serwis ten nie jest witryną producenta. Jego wpis 255EM ogranicza zgodność do ZC300; rozbieżność ze wspólnymi release notes Z3 zachowujemy w dokumentacji audytu.
- **D5 — 104523-210:** https://www.a3multimedia.com/reference/zebra/104523-210/ . Katalog dystrybucyjny podaje 10 mil/0,254 mm i opakowanie 500 kart. Nie znaleziono primary dokumentu z dokładnie tym PN i pakowaniem. Zgodność zakresu grubości potwierdzają Z1/Z2; nie jest to osobna certyfikacja konkretnego PN.

## Katalog 17 materiałów i jednostki

Cena i ilość zamawiana odnoszą się do jednostki handlowej w tabeli. Nie dzielić ceny kompletu przez liczbę kart ani rolek przy dodawaniu do koszyka. Przeliczenie kosztu jednego wydruku może być wyłącznie dodatkową informacją.

| PN | Materiał / wydajność | Jednostka handlowa | Modele w katalogu | Uwagi |
| --- | --- | --- | --- | --- |
| 800300-250EM | YMCKO, 200 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Z1/Z2 potwierdzają typ i wydajność |
| 800300-255EM | YMCKO, 300 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Firmware V201.01.18+; granica potwierdzenia ZC100 opisana przy Z3 |
| 800300-254EM | YMCKO, 800 łącznie | 1 zestaw: kaseta + 4 rolki po 200 + 4 rolki czyszczące | ZC100, ZC300 | Firmware V201.01.17+; 800 wydruków na chip zestawu; D1/D2 |
| 800300-370EM | Półpanelowa YMCKO, 400 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Kolor na połowie długości, pełne K/O; half-panel dla ZC100 potwierdza Z1 |
| 800300-301 | Czarna mono, 2000 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Modele ograniczone do zakresu obecnej kategorii |
| 800300-309EM | Biała mono, 1500 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Nie mieszać z regionalnymi/innymi seriami PN |
| 800300-302 | Czerwona mono, 1500 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Stan w sprawdzonej migawce: niedostępna |
| 800300-304 | Niebieska mono, 1500 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Stan w sprawdzonej migawce: niedostępna |
| 800300-306 | Złota metaliczna mono, 1500 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Z1/Z2: mono gold 1500 |
| 800300-307 | Srebrna metaliczna mono, 1500 wydruków | 1 taśma w kasecie | ZC100, ZC300 | Z1/Z2: mono silver 1500 |
| 800300-360EM | YMCKOK, 200 kart dwustronnych | 1 taśma w kasecie | ZC300 z drukiem dwustronnym | Kolor z przodu, czerń z tyłu. Usunięto błędną rekomendację ZC100 i ręcznego odwracania z materiału roboczego |
| 800300-320EM | KdO, 700 wydruków | 1 taśma w kasecie | ZC300 | Czerń sublimacyjna do odcieni szarości + overlay |
| 800300-321EM | KrO, 700 wydruków | 1 taśma w kasecie | ZC300 | Czerń żywiczna do tekstu/kodów + overlay |
| 105999-310-01 | Karty czyszczące | 1 opakowanie: 2 karty | ZC100, ZC300 | Czyszczenie co 1000 kart lub po komunikacie |
| 105999-311-01 | Karty czyszczące | 1 opakowanie: 5 kart | ZC100, ZC300 | Czyszczenie co 1000 kart lub po komunikacie |
| 104523-210 | Białe PVC Premier, CR-80, 10 mil | 1 opakowanie: 500 kart | ZC100, ZC300 | 0,254 mm, w sklepie zaokrąglone do 0,25 mm; dokładny PN/pakiet: D5 |
| 104523-111 | Białe PVC Premier, CR-80, 30 mil | 1 opakowanie: 500 kart | ZC100, ZC300 | 0,762 mm, w sklepie zaokrąglone do 0,76 mm; Z7/Z8 |

Migawka `/tmp/card-material-stock.json` zawierała `found: true` i dodatnie ceny netto/brutto dla wszystkich 17 PN. Ta migawka jest wynikiem API dystrybucyjnego, nie dokumentem producenta. Jej ceny nie są gwarantowane na przyszłość. Nie pobierano zamówienia próbnego ani faktury potwierdzającej handlową jednostkę dostawcy. Jednostki ustalono z opisów opakowań; muszą pozostać zgodne z mapowaniem PN w integracjach.

## Wykryte problemy i poprawki

### P1 — stan magazynowy po odświeżeniu klienta

`RealTimeStock` odczytywał `total_stock`; cache potrafił zawierać sumę magazynów oraz dostaw przychodzących. Produkt bez fizycznego stanu mógł więc uzyskać aktywny przycisk zakupu po hydration, mimo poprawnego SSR materiałów.

Poprawiono `components/shop/RealTimeStock.tsx` oraz `app/api/shop/product-stock/route.ts`: dostępny stan wyliczany z `stock_pl + stock_de` (w cache `stock_pl + stock_eu`), dostawa pozostaje osobno. Odczyt ignoruje stare zawyżone `total_stock`, a nowy zapis nie dodaje dostaw. Etykieta „W dostawie” nie obiecuje wysyłki w 3–5 dni.

Autor poprawki wykonał kontrolę wyrażeń: PL0/EU0/dostawa10 → stan0/on-order; PL1/EU0/dostawa10 → stan1/available; PL0/EU2/dostawa10 → stan2/available. Audytor potwierdził finalny diff. Odbiór zachowania w przeglądarce pozostaje zadaniem po buildzie.

### P1 — puste materiały na kategorii

`CardMaterials` porównywał wspólny tekst `ZC100 i ZC300` z pojedynczymi modelami. Wynik wynosił zero produktów, mimo 17 rekordów katalogu. Poprawiono obsługę widoku zbiorczego oraz URL filtra. Widok zbiorczy obejmuje 17, ZC100 obejmuje 14, ZC300 obejmuje 17.

### Treść: multipack, firmware i czyszczenie

- Zamiast niepełnej informacji „800 wydruków” wpisano rzeczywistą zawartość 254EM: jedna pusta kaseta, cztery rolki po 200 wydruków i cztery rolki czyszczące. Dodano też jawne doprecyzowanie limitu chipu do czterech rolek/800 wydruków i wymiany całego zestawu po ich zużyciu, aby „wielokrotny użytek” nie sugerował nieograniczonego napełniania.
- Dodano V201.01.17+ dla multipacku i V201.01.18+ dla 255EM.
- Zmieniono zalecenie czyszczenia kartą przy każdej wymianie taśmy na interwał 1000 wydrukowanych kart lub komunikat drukarki.
- YMCKOK/KdO/KrO nie pojawiają się w filtrze materiałów ZC100. 360EM wyraźnie wymaga ZC300 z drukiem dwustronnym.

## Kontrola implementacji

- [x] 17 unikalnych PN w `lib/card-materials.json`.
- [x] Wszystkie 17 plików obrazów wskazanych w katalogu istnieje.
- [x] Filtr ZC100: 14 materiałów; ZC300 i widok wspólny: 17.
- [x] Karty modeli używają 8 pozycji `FILMY_ZC_DIAGNOSTYKA`.
- [x] Film o LCD jest opisany jako dotyczący ZC300; przy filmach widoczna informacja, że ZC100 nie ma wyświetlacza.
- [x] Wszystkie 7 slugów `PORADNIKI_KART` istnieje w `lib/blog.ts`; komponent karuzeli prowadzi bezpośrednio do `/blog/<slug>`.
- [x] Kategoria używa `ShopSidebar` i `KafelekProduktu`; mobile ma zwinięte „Kategorie sklepu”. Linki kategorii są w sidebarze; usunięto dodatkowe kafle kategorii spod hero sklepu.
- [x] Kategoria zawiera wybór modelu, porównanie, koszt druku, kodowanie, materiał karty, materiały, FAQ i poradniki.
- [x] Usunięto FAQPage z nowych kart/kategorii; widoczne FAQ zachowano.
- [x] `getProductUrl` kieruje `material_kart` do `/sklep/materialy-do-drukarek-kart/<slug>`, drukarki przez `deviceUrl`.
- [x] Koszyk, autocomplete i główna lista sklepu korzystają ze wspólnego routingu; `?pn=` zachowany dla wariantu drukarki.
- [x] SSR materiałów używa ceny z `stock_cache`, z ceną z DB jako fallback. Fizyczny stan SSR to PL+EU.
- [x] Product/Offer materiału zawiera cenę brutto PLN oraz absolutne URL oferty i obrazu. Dostępność: InStock dla fizycznego stanu, BackOrder dla samej dostawy, OutOfStock przy braku obu.
- [x] Tryb zwykły filtruje materiały przez `is_active=true`; preview pozwala sprawdzić rekordy przed aktywacją.
- [x] `ProductPurchasePanel` przekazuje `image` do koszyka; `zdjecieWKoszyku` używa tego obrazu w koszyku i na stronie zamówienia.
- [x] Sitemap materiałów uwzględnia aktywne produkty i właściwy lokalny URL.
- [x] `git diff --check` przeszedł podczas audytu.
- [x] Końcowy `npm run build`: exit 0, potwierdzenie prowadzącego zadanie.
- [x] HTTP: 17 kart produktu oraz 17 obrazów zwraca 200; szczegóły poniżej.
- [x] Wizualny odbiór kategorii desktop/mobile po buildzie, przekazany przez prowadzącego zadanie.
- [x] Kontrola SSR ceny, dostępności i JSON-LD na działającym lokalnym podglądzie.
- [x] Dodanie materiału do koszyka: 104523-111, ilość 1 oznacza opakowanie 500 kart, 148,05 zł netto / 182,10 zł brutto.
- [x] Koszyk zawiera właściwy lokalny URL materiału 104523-111; miniatura na stronie zamówienia załadowana (naturalWidth > 0). Testową pozycję usunięto, pozostawiając wcześniejszy produkt. Zamówienia nie złożono.
- [x] Regresja kategorii biurkowej: filtr 300 dpi zmienia listę z 52 wersji/10 modeli na 18 wersji/6 modeli.

## Końcowa weryfikacja po buildzie

Przejrzano końcowy diff oraz plik `/tmp/card-material-http-check.json` z testu `next start` na porcie 3003. Audytor porównał wyniki z katalogiem i migawką cen `/tmp/card-material-stock.json`:

- Dokładnie 17 oczekiwanych PN, każdy z HTTP 200 i dodatnią ceną Offer.
- Wszystkie 17 cen brutto w JSON-LD zgadza się z potwierdzoną migawką ceny API; zero rozbieżności.
- 800300-302 i 800300-304 mają `OutOfStock`; pozostałych 15 materiałów ma `InStock`. Wyniki zgadzają się z fizycznym stanem w migawce; zero rozbieżności.
- Prowadzący zadanie potwierdził osobno odpowiedzi HTTP 200 wszystkich 17 obrazów i obecność właściwego SKU w JSON-LD. Sam plik wynikowy zawiera PN, status, cenę i dostępność; nie zawiera osobnej listy wyników obrazów.
- Prowadzący zadanie potwierdził po 8 identyfikatorów YouTube w HTML ZC100 i ZC300.
- Desktop: wspólne kafle produktów, sidebar oraz załadowane zdjęcia i ceny.
- Mobile przez CUA/CDP, szerokość 390 px: `documentElement.clientWidth` i `scrollWidth` wynoszą 390 na kategorii drukarek i kategorii materiałów. Brak poziomego przepełnienia. „Kategorie sklepu” są domyślnie zwinięte.
- Filtr ZC100 pokazuje 14 materiałów; kliknięcie „Do ZC300” zmienia adres i pokazuje 17.
- Przycisk zakupu 104523-111 dodaje jedną jednostkę handlową: całe opakowanie 500 kart, za 148,05 zł netto / 182,10 zł brutto.

Końcowe zmiany `force-dynamic` dla listy i kart materiałów pozwalają odczytać stan aktywności z DB przy żądaniu. Produkcja nadal wymaga `is_active=true`; odstępstwo obejmuje wyłącznie jawny tryb podglądu. Audyt końcowego diffu i wyników nie wykazał nowego błędu blokującego w tym zakresie. Nie wykonano nowego testu zamówienia ani płatności.

## Osobny backlog: istniejąca walidacja zamówienia

W `app/api/orders/route.ts` serwer przyjmuje ceny, ilości i sumy przesłane z koszyka, zapisując je w `shop_orders`. Nie wykonuje ponownego odczytu aktywności produktu, aktualnej ceny i dostępności na serwerze. To problem istniejącego mechanizmu zamówień, odziedziczony także przez nowy asortyment; nie powstał w obecnym diffie i nie blokuje odbioru opisanego zakresu.

Osobne zadanie powinno wprowadzić walidację identyfikatora produktu/PN, `is_active`, dodatniej całkowitej ilości, ceny i sum po stronie serwera oraz obsługę zmiany oferty od chwili dodania do koszyka. W tym audycie nie zmieniano endpointu i nie wysyłano żądania tworzącego zamówienie.
