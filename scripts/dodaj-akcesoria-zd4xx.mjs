/**
 * Faza 1 katalogu akcesoriów: rodzina biurkowa ZD411 / ZD421 / ZD621.
 *
 * Dokładamy to, czego do tej pory nie mieliśmy w ogóle — gilotyny, dyspensery,
 * moduły łączności i zasilanie bateryjne. Głowice, wałki i zasilacze do tej
 * serii już są, więc ich tu nie ma.
 *
 * Ceny startowe policzone z ofert BlueStara/Jarltecha po kursie NBP; na karcie
 * i tak nadpisuje je cena live z /api/shop/product-stock.
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-akcesoria-zd4xx.mjs
 */

const URL_BAZY = process.env.NEXT_PUBLIC_SUPABASE_URL
const KLUCZ = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!URL_BAZY || !KLUCZ) {
  console.error('Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const naglowki = {
  apikey: KLUCZ,
  Authorization: `Bearer ${KLUCZ}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const montazPokrywy = `
<h3>Montaż</h3>
<p>Moduł zastępuje przednią pokrywę drukarki — zdejmujesz fabryczną, wpinasz nową. Kilka minut, bez narzędzi i bez otwierania obudowy. Po montażu trzeba jeszcze przestawić drukarkę na odpowiedni tryb pracy (w panelu drukarki albo w sterowniku) i skalibrować materiał, inaczej wydruk będzie się zatrzymywał w złym miejscu.</p>`

const wsparcie = `
<h3>Nie masz pewności, czy to ta wersja?</h3>
<p>Moduły do drukarek biurkowych Zebry nie są uniwersalne — wersja termiczna i termotransferowa mają inne numery katalogowe, tak samo ZD421 i ZD621. Podaj nam numer seryjny drukarki, sprawdzimy jej fabryczną konfigurację i potwierdzimy, co pasuje.</p>`

const PRODUKTY = [
  {
    sku: 'P1112640-230',
    slug: 'gilotyna-zebra-zd421t',
    name: 'Gilotyna do drukarki Zebra ZD421t - P1112640-230',
    product_type: 'gilotyna',
    device_model: 'ZD421t',
    compatible_models: ['ZD421t', 'ZD421'],
    price: 599.55,
    price_brutto: 737.45,
    description:
      'Moduł gilotyny do Zebra ZD421t. Odcina etykietę zaraz po wydruku, więc operator nie musi jej odrywać. Montaż w miejsce przedniej pokrywy, bez narzędzi.',
    description_long: `<p>Gilotyna P1112640-230 to moduł przedniej pokrywy do termotransferowej drukarki Zebra ZD421t. Odcina wydruk automatycznie, dzięki czemu z drukarki wychodzą gotowe, równo przycięte etykiety.</p>

<h3>Kiedy gilotyna się opłaca</h3>
<ul>
<li>Drukujesz etykiety o różnej długości — nie ma stałego miejsca do oderwania</li>
<li>Pracujesz na materiale ciągłym, a nie na gotowych etykietach z odstępami</li>
<li>Operator ma zajęte ręce i każde oderwanie kosztuje sekundy</li>
<li>Wydruki idą prosto do dokumentów i muszą mieć czystą krawędź</li>
</ul>
<p>Przy zwykłych rolkach z etykietami tej samej wielkości fabryczna listwa do odrywania w zupełności wystarcza — wtedy gilotyna to zbędny wydatek i jeden element więcej do czyszczenia.</p>
${montazPokrywy}

<h3>Z serwisu: co się w gilotynach psuje</h3>
<p>Praktycznie zawsze to samo — klej z etykiet samoprzylepnych osadza się na ostrzu, nóż przestaje ciąć czysto i zaczyna szarpać materiał. Wystarczy przetrzeć ostrze alkoholem izopropylowym. Jeśli gilotyna zacina się mimo czystego noża, zwykle okazuje się, że materiał jest grubszy, niż moduł przewiduje.</p>
${wsparcie}`,
    meta_title: 'Gilotyna Zebra ZD421t (P1112640-230) — cena, dostępność | TAKMA',
    meta_description:
      'Oryginalna gilotyna do drukarki Zebra ZD421t, numer katalogowy P1112640-230. Montaż bez narzędzi w miejsce przedniej pokrywy. Cena netto, stan magazynowy i termin dostawy sprawdzane na żywo.',
  },
  {
    sku: 'P1112640-232',
    slug: 'gilotyna-zebra-zd621t',
    name: 'Gilotyna do drukarki Zebra ZD621t - P1112640-232',
    product_type: 'gilotyna',
    device_model: 'ZD621t',
    compatible_models: ['ZD621t', 'ZD621'],
    price: 599.55,
    price_brutto: 737.45,
    description:
      'Moduł gilotyny do Zebra ZD621t. Automatycznie odcina wydruk, montowany w miejsce przedniej pokrywy drukarki.',
    description_long: `<p>Gilotyna P1112640-232 to moduł do termotransferowej drukarki Zebra ZD621t. Odcina etykietę po wydrukowaniu — operator dostaje gotowy, przycięty wydruk zamiast odrywać go z rolki.</p>

<h3>Kiedy gilotyna się opłaca</h3>
<ul>
<li>Etykiety mają różną długość i nie da się ich równo odrywać</li>
<li>Drukujesz na materiale ciągłym, bez odstępów między etykietami</li>
<li>Liczy się czas na stanowisku — każde oderwanie to sekundy</li>
</ul>
<p>ZD621 ma inny moduł niż ZD421, mimo bardzo podobnej obudowy. Gilotyna z jednej serii nie wejdzie do drugiej.</p>
${montazPokrywy}

<h3>Z serwisu: co się w gilotynach psuje</h3>
<p>Nóż tępi się od kleju z etykiet — objawia się to poszarpaną krawędzią cięcia i zacinaniem. Regularne przetarcie ostrza alkoholem izopropylowym rozwiązuje problem w większości przypadków.</p>
${wsparcie}`,
    meta_title: 'Gilotyna Zebra ZD621t (P1112640-232) — cena, dostępność | TAKMA',
    meta_description:
      'Oryginalna gilotyna do drukarki Zebra ZD621t, numer katalogowy P1112640-232. Montaż w miejsce przedniej pokrywy, bez narzędzi. Sprawdź cenę netto i stan magazynowy.',
  },
  {
    sku: 'P1112640-231',
    slug: 'dyspenser-odklejak-zebra-zd421t',
    name: 'Dyspenser (odklejak) do drukarki Zebra ZD421t - P1112640-231',
    product_type: 'dyspenser',
    device_model: 'ZD421t',
    compatible_models: ['ZD421t', 'ZD421'],
    price: 124.39,
    price_brutto: 153.0,
    description:
      'Odklejak do Zebra ZD421t. Podaje etykietę już oddzieloną od podkładu i czeka, aż ją zdejmiesz, zanim wydrukuje kolejną.',
    description_long: `<p>Dyspenser P1112640-231, nazywany też odklejakiem, to moduł przedniej pokrywy do drukarki Zebra ZD421t. Oddziela wydrukowaną etykietę od podkładu i podaje ją gotową do naklejenia. Czujnik wykrywa, że etykieta wisi na wyjściu, i wstrzymuje druk kolejnej, dopóki jej nie zdejmiesz — nie ma więc ryzyka, że etykiety spadną na podłogę.</p>

<h3>Kiedy odklejak realnie przyspiesza pracę</h3>
<p>Wtedy, gdy ktoś nakleja etykiety ręcznie: pakowanie zamówień, oznaczanie towaru na przyjęciu, znakowanie próbek. Odpada dłubanie paznokciem w rogu etykiety, a przy kilkuset sztukach dziennie robi to wymierną różnicę. Jeśli etykiety trafiają prosto do teczki albo są naklejane maszynowo — odklejak nic nie zmieni.</p>

<h3>Czego odklejak nie obsłuży</h3>
<ul>
<li>Materiałów bezpodkładowych (linerless) — nie ma czego odkleić</li>
<li>Bardzo małych i wąskich etykiet, które zawijają się zamiast odchodzić płasko</li>
<li>Etykiet o wyjątkowo mocnym kleju, przy których podkład rwie się zamiast odchodzić</li>
</ul>
${montazPokrywy}
${wsparcie}`,
    meta_title: 'Dyspenser (odklejak) Zebra ZD421t P1112640-231 — cena | TAKMA',
    meta_description:
      'Oryginalny dyspenser etykiet do drukarki Zebra ZD421t, numer katalogowy P1112640-231. Odkleja etykietę od podkładu i czeka na jej pobranie. Cena netto i stan magazynowy na żywo.',
  },
  {
    sku: 'P1112640-031',
    slug: 'dyspenser-odklejak-zebra-zd421d-zd621d',
    name: 'Dyspenser (odklejak) do drukarek Zebra ZD421d, ZD621d - P1112640-031',
    product_type: 'dyspenser',
    device_model: 'ZD421d/ZD621d',
    compatible_models: ['ZD421d', 'ZD621d', 'ZD421', 'ZD621'],
    price: 124.39,
    price_brutto: 153.0,
    description:
      'Odklejak do termicznych ZD421d i ZD621d. Oddziela etykietę od podkładu i wstrzymuje druk, dopóki jej nie zdejmiesz.',
    description_long: `<p>Dyspenser P1112640-031 pasuje do termicznych drukarek Zebra ZD421d i ZD621d — tych, które drukują bez taśmy barwiącej. Oddziela wydrukowaną etykietę od podkładu i podaje ją gotową do naklejenia, a czujnik wstrzymuje kolejny wydruk do czasu jej pobrania.</p>

<h3>Dla kogo</h3>
<p>Dla stanowisk, gdzie etykiety nakleja się ręcznie zaraz po wydruku — pakowanie wysyłek, oznaczanie towaru, kompletacja. W wersjach termicznych to najczęściej etykiety kurierskie i magazynowe, więc odklejak trafia zwykle na stanowisko pakowania.</p>

<h3>Czego odklejak nie obsłuży</h3>
<ul>
<li>Materiałów bezpodkładowych (linerless)</li>
<li>Bardzo małych i wąskich etykiet, które zawijają się przy odklejaniu</li>
</ul>
${montazPokrywy}
${wsparcie}`,
    meta_title: 'Dyspenser Zebra ZD421d / ZD621d P1112640-031 — cena | TAKMA',
    meta_description:
      'Oryginalny odklejak etykiet do termicznych drukarek Zebra ZD421d i ZD621d, numer katalogowy P1112640-031. Montaż bez narzędzi. Cena netto i dostępność sprawdzane na żywo.',
  },
  {
    sku: 'P1112640-233',
    slug: 'dyspenser-odklejak-zebra-zd621t',
    name: 'Dyspenser (odklejak) do drukarki Zebra ZD621t - P1112640-233',
    product_type: 'dyspenser',
    device_model: 'ZD621t',
    compatible_models: ['ZD621t', 'ZD621', 'ZD421c'],
    price: 124.39,
    price_brutto: 153.0,
    description:
      'Odklejak do Zebra ZD621t. Podaje etykietę oddzieloną od podkładu i czeka z kolejnym wydrukiem, aż ją zdejmiesz.',
    description_long: `<p>Dyspenser P1112640-233 to moduł odklejaka do termotransferowej drukarki Zebra ZD621t. Oddziela etykietę od podkładu zaraz po wydruku i podaje ją gotową do naklejenia; czujnik wstrzymuje druk następnej, dopóki poprzednia nie zostanie pobrana.</p>

<h3>Dla kogo</h3>
<p>Dla stanowisk z ręcznym naklejaniem — pakowania, oznaczania towaru, znakowania próbek. Przy kilkuset etykietach dziennie oszczędza operatorowi najbardziej irytującą czynność: odrywanie etykiety od podkładu.</p>

<h3>Czego odklejak nie obsłuży</h3>
<ul>
<li>Materiałów bezpodkładowych (linerless)</li>
<li>Bardzo wąskich etykiet, które zawijają się zamiast odchodzić płasko</li>
</ul>
${montazPokrywy}
${wsparcie}`,
    meta_title: 'Dyspenser (odklejak) Zebra ZD621t P1112640-233 — cena | TAKMA',
    meta_description:
      'Oryginalny dyspenser etykiet do drukarki Zebra ZD621t, numer katalogowy P1112640-233. Odkleja etykietę i czeka na pobranie. Sprawdź cenę netto oraz stan magazynowy.',
  },
  {
    sku: 'P1112640-015',
    slug: 'modul-ethernet-zebra-zd411-zd421-zd621',
    name: 'Moduł Ethernet do drukarek Zebra ZD411, ZD421, ZD621 - P1112640-015',
    product_type: 'modul',
    device_model: 'ZD411/ZD421/ZD621',
    compatible_models: ['ZD411d', 'ZD411t', 'ZD421d', 'ZD421t', 'ZD621d', 'ZD621t'],
    price: 321.98,
    price_brutto: 396.04,
    description:
      'Moduł sieciowy do ZD411, ZD421 i ZD621. Dokładasz Ethernet do drukarki kupionej z samym USB — wsuwa się w gniazdo z tyłu, bez narzędzi.',
    description_long: `<p>Moduł P1112640-015 dodaje port Ethernet do drukarek biurkowych Zebra serii ZD411, ZD421 i ZD621. Drukarki te mają z tyłu gniazdo na moduł łączności — wystarczy go w nie wsunąć, a drukarka wykryje go przy najbliższym włączeniu.</p>

<h3>Kiedy warto</h3>
<p>Najczęstszy powód zakupu to drukarka kupiona w wersji z samym USB, która po jakimś czasie ma obsługiwać kilka stanowisk albo pracować w sieci firmowej. Dołożenie modułu jest wielokrotnie tańsze niż wymiana drukarki, a konfiguracja sprowadza się do nadania adresu IP.</p>

<h3>Ethernet czy Wi-Fi?</h3>
<p>Ethernet, jeśli drukarka stoi w jednym miejscu i masz gniazdo sieciowe w zasięgu — połączenie jest stabilniejsze, nie gubi się i nie zależy od hasła do sieci bezprzewodowej. Wi-Fi ma sens tam, gdzie drukarka zmienia miejsce albo doprowadzenie kabla wymagałoby kucia ścian. W magazynach z gęsto ustawionymi regałami sieć bezprzewodowa bywa kapryśna, więc na stanowisko stałe zwykle radzimy kabel.</p>

<h3>Montaż</h3>
<p>Bez narzędzi i bez otwierania obudowy. Moduł jest przewidziany do montażu przez użytkownika, więc samodzielna instalacja nie wpływa na gwarancję drukarki. Jeśli kupujesz u nas drukarkę, możemy zamontować i skonfigurować moduł przed wysyłką.</p>`,
    meta_title: 'Moduł Ethernet Zebra ZD411 / ZD421 / ZD621 P1112640-015 | TAKMA',
    meta_description:
      'Oryginalny moduł Ethernet do drukarek Zebra ZD411, ZD421 i ZD621, numer katalogowy P1112640-015. Dokładasz sieć do drukarki z USB, montaż bez narzędzi. Cena netto i dostępność na żywo.',
  },
  {
    sku: 'P1112640-016',
    slug: 'modul-rs232-zebra-zd411-zd421-zd621',
    name: 'Moduł RS-232 do drukarek Zebra ZD411, ZD421, ZD621 - P1112640-016',
    product_type: 'modul',
    device_model: 'ZD411/ZD421/ZD621',
    compatible_models: ['ZD411d', 'ZD411t', 'ZD421d', 'ZD421t', 'ZD621d', 'ZD621t'],
    price: 77.75,
    price_brutto: 95.63,
    description:
      'Moduł portu szeregowego do ZD411, ZD421 i ZD621. Potrzebny, gdy drukarka ma współpracować ze starszym systemem albo wagą po RS-232.',
    description_long: `<p>Moduł P1112640-016 dodaje port szeregowy RS-232 do drukarek biurkowych Zebra ZD411, ZD421 i ZD621. Wsuwa się w gniazdo z tyłu drukarki, bez narzędzi.</p>

<h3>Kto tego szuka</h3>
<p>Zwykle firmy, które mają sprawny, działający od lat system i nie zamierzają go przepisywać: sterowniki maszyn, wagi etykietujące, starsze systemy magazynowe i produkcyjne wysyłające dane po porcie szeregowym. Drukarka jest nowa, protokół zostaje ten sam.</p>

<h3>Zanim zamówisz</h3>
<p>Sprawdź, czego wymaga urządzenie po drugiej stronie — prędkość transmisji, parzystość i sterowanie przepływem trzeba ustawić po obu stronach tak samo, inaczej drukarka będzie milczeć albo wypluwać znaki krzaczkowe. Jeśli nie masz pod ręką dokumentacji systemu, napisz do nas — pomożemy dobrać ustawienia.</p>

<h3>Montaż</h3>
<p>Bez narzędzi i bez otwierania obudowy drukarki. Moduł jest przewidziany do montażu przez użytkownika i nie wpływa na gwarancję.</p>`,
    meta_title: 'Moduł RS-232 Zebra ZD411 / ZD421 / ZD621 P1112640-016 | TAKMA',
    meta_description:
      'Oryginalny moduł portu szeregowego RS-232 do drukarek Zebra ZD411, ZD421 i ZD621, numer katalogowy P1112640-016. Do współpracy ze starszymi systemami i wagami. Cena netto na żywo.',
  },
  {
    sku: 'P1112640-017C',
    slug: 'modul-wifi-bluetooth-zebra-zd411-zd421-zd621',
    name: 'Moduł Wi-Fi i Bluetooth do drukarek Zebra ZD411, ZD421, ZD621 - P1112640-017C',
    product_type: 'modul',
    device_model: 'ZD411/ZD421/ZD621',
    compatible_models: ['ZD411d', 'ZD411t', 'ZD421d', 'ZD421t', 'ZD621d', 'ZD621t'],
    price: 549.6,
    price_brutto: 676.01,
    description:
      'Moduł bezprzewodowy do ZD411, ZD421 i ZD621 — Wi-Fi i Bluetooth w jednej karcie. Dla drukarek, które zmieniają miejsce albo drukują z aplikacji mobilnej.',
    description_long: `<p>Moduł P1112640-017C dodaje łączność bezprzewodową do drukarek biurkowych Zebra ZD411, ZD421 i ZD621. Wi-Fi i Bluetooth siedzą w jednej karcie, więc nie trzeba kupować dwóch modułów.</p>

<h3>Kiedy warto</h3>
<ul>
<li>Drukarka zmienia stanowisko — na inwentaryzację, do innego działu, na produkcję</li>
<li>Doprowadzenie kabla sieciowego oznaczałoby kucie ścian albo ciągnięcie listwy przez pół hali</li>
<li>Drukujesz z telefonu lub tabletu — do tego służy Bluetooth</li>
</ul>

<h3>Kiedy lepiej kabel</h3>
<p>Jeśli drukarka stoi w jednym miejscu i ma gniazdo sieciowe w zasięgu, tańszy i stabilniejszy będzie <a href="/sklep/moduly-lacznosci/drukarki-biurkowe/zebra-zd411-zd421-zd621/modul-ethernet-zebra-zd411-zd421-zd621">moduł Ethernet</a>. W magazynach z gęsto ustawionymi regałami metalowymi sieć bezprzewodowa potrafi się gubić — to najczęstsza przyczyna zgłoszeń „drukarka znika z sieci”, z jakimi do nas trafiają.</p>

<h3>Montaż</h3>
<p>Bez narzędzi, moduł wsuwa się w gniazdo z tyłu drukarki. Zostaje wskazać sieć i podać hasło. Przy zakupie drukarki u nas możemy zamontować i skonfigurować moduł przed wysyłką.</p>`,
    meta_title: 'Moduł Wi-Fi Bluetooth Zebra ZD411 / ZD421 / ZD621 P1112640-017C | TAKMA',
    meta_description:
      'Oryginalny moduł Wi-Fi i Bluetooth do drukarek Zebra ZD411, ZD421 i ZD621, numer katalogowy P1112640-017C. Jedna karta zamiast dwóch modułów, montaż bez narzędzi. Cena netto na żywo.',
  },
  {
    sku: 'P1080383-600',
    slug: 'modul-baterii-zebra-zd421t-zd621t',
    name: 'Moduł baterii do drukarek Zebra ZD421t, ZD621t - P1080383-600',
    product_type: 'akumulator',
    device_model: 'ZD421t/ZD621t',
    compatible_models: ['ZD421t', 'ZD621t'],
    price: 200.1,
    price_brutto: 246.12,
    description:
      'Podstawa bateryjna do termotransferowych ZD421t i ZD621t. Sama nie zawiera ogniwa — baterię P1080383-603 dokupujesz osobno.',
    description_long: `<p>Moduł P1080383-600 to podstawa montowana pod termotransferową drukarką Zebra ZD421t lub ZD621t, dzięki której może pracować bez podłączenia do gniazdka. Sam moduł nie zawiera ogniwa — trzeba do niego dokupić <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/bateria-zebra-zd421-zd621">baterię P1080383-603</a>.</p>

<h3>Do czego to służy</h3>
<p>Do przeniesienia drukarki tam, gdzie akurat jest potrzebna: inwentaryzacja w hali bez gniazdek, znakowanie towaru na rampie, stanowisko tymczasowe. Drukarka zostaje ta sama, po prostu na chwilę uwalnia się od kabla.</p>

<h3>Zanim zamówisz</h3>
<p>Wersje termiczna i termotransferowa mają różne moduły — do ZD421d i ZD621d służy <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/modul-baterii-zebra-zd421d-zd621d">moduł P1080383-601</a>. Jeśli nie wiesz, którą wersję masz, podaj nam numer seryjny drukarki.</p>`,
    meta_title: 'Moduł baterii Zebra ZD421t / ZD621t P1080383-600 — cena | TAKMA',
    meta_description:
      'Oryginalna podstawa bateryjna do drukarek Zebra ZD421t i ZD621t, numer katalogowy P1080383-600. Praca bez gniazdka po dołożeniu baterii P1080383-603. Cena netto i dostępność na żywo.',
  },
  {
    sku: 'P1080383-601',
    slug: 'modul-baterii-zebra-zd421d-zd621d',
    name: 'Moduł baterii do drukarek Zebra ZD421d, ZD621d - P1080383-601',
    product_type: 'akumulator',
    device_model: 'ZD421d/ZD621d',
    compatible_models: ['ZD421d', 'ZD621d'],
    price: 200.1,
    price_brutto: 246.12,
    description:
      'Podstawa bateryjna do termicznych ZD421d i ZD621d. Ogniwo (P1080383-603) kupuje się osobno.',
    description_long: `<p>Moduł P1080383-601 to podstawa montowana pod termiczną drukarką Zebra ZD421d lub ZD621d, pozwalająca jej pracować bez zasilania z gniazdka. Ogniwa nie zawiera — potrzebna jest jeszcze <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/bateria-zebra-zd421-zd621">bateria P1080383-603</a>.</p>

<h3>Do czego to służy</h3>
<p>Do pracy tam, gdzie nie ma gniazdka albo ciągnięcie przedłużacza mija się z celem: rampa, inwentaryzacja w hali, stanowisko rozstawiane na kilka dni. Najczęściej trafia na stanowiska pakowania przesyłek, które zmieniają miejsce w sezonie.</p>

<h3>Zanim zamówisz</h3>
<p>Do wersji termotransferowych ZD421t i ZD621t służy inny moduł — <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/modul-baterii-zebra-zd421t-zd621t">P1080383-600</a>. Jeśli nie masz pewności, którą wersję masz, wystarczy numer seryjny drukarki.</p>`,
    meta_title: 'Moduł baterii Zebra ZD421d / ZD621d P1080383-601 — cena | TAKMA',
    meta_description:
      'Oryginalna podstawa bateryjna do termicznych drukarek Zebra ZD421d i ZD621d, numer katalogowy P1080383-601. Praca bez gniazdka po dołożeniu baterii. Cena netto i stan magazynowy.',
  },
  {
    sku: 'P1080383-603',
    slug: 'bateria-zebra-zd421-zd621',
    name: 'Bateria do drukarek Zebra ZD421, ZD621 - P1080383-603',
    product_type: 'akumulator',
    device_model: 'ZD421/ZD621',
    compatible_models: ['ZD421d', 'ZD421t', 'ZD621d', 'ZD621t'],
    price: 1427.38,
    price_brutto: 1755.68,
    description:
      'Oryginalne ogniwo do modułu bateryjnego drukarek ZD421 i ZD621. Wkłada się w podstawę P1080383-600 lub P1080383-601.',
    description_long: `<p>Bateria P1080383-603 zasila biurkowe drukarki Zebra ZD421 i ZD621 pracujące bez podłączenia do gniazdka. Sama do drukarki nie pasuje — wkłada się ją w podstawę bateryjną: <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/modul-baterii-zebra-zd421t-zd621t">P1080383-600</a> dla wersji termotransferowych albo <a href="/sklep/akumulatory/drukarki-biurkowe/zebra-zd421-zd621/modul-baterii-zebra-zd421d-zd621d">P1080383-601</a> dla termicznych.</p>

<h3>Z serwisu: kiedy wymieniać</h3>
<p>Ogniwa litowo-jonowe zużywają się z liczbą cykli ładowania, nie z wiekiem na półce. Sygnał, że czas na nową baterię, jest zwykle prosty: drukarka przestaje wytrzymywać zmianę na jednym ładowaniu, choć wcześniej wytrzymywała. Spuchnięta obudowa ogniwa to powód do natychmiastowej wymiany — takiej baterii nie wolno dalej ładować.</p>

<h3>Jak przedłużyć jej życie</h3>
<ul>
<li>Nie rozładowuj do zera — podłącz, gdy zostaje 20-30%</li>
<li>Baterię odłożoną na zapas trzymaj naładowaną w okolicach połowy, w temperaturze pokojowej</li>
<li>Nie zostawiaj jej w gorącym aucie ani przy nagrzewnicy</li>
</ul>

<h3>Zamiennik czy oryginał</h3>
<p>W drukarkach trzymamy się oryginałów. Ogniwo pracuje wciśnięte pod drukarkę, blisko elektroniki i zasilacza — tanie zamienniki bez porządnego układu zabezpieczającego to ryzyko, którego przy sprzęcie za kilka tysięcy nie warto podejmować.</p>`,
    meta_title: 'Bateria Zebra ZD421 / ZD621 P1080383-603 — cena, dostępność | TAKMA',
    meta_description:
      'Oryginalna bateria do drukarek Zebra ZD421 i ZD621, numer katalogowy P1080383-603. Pasuje do podstaw bateryjnych P1080383-600 i P1080383-601. Cena netto i stan magazynowy na żywo.',
  },
]

async function main() {
  for (const p of PRODUKTY) {
    const istnieje = await fetch(
      `${URL_BAZY}/rest/v1/products?sku=eq.${encodeURIComponent(p.sku)}&select=id`,
      { headers: naglowki }
    ).then((r) => r.json())

    const wiersz = {
      ...p,
      image_url: `/sklep_photo/${p.sku}.png`,
      manufacturer: 'Zebra',
      vat_rate: 23,
      is_active: true,
      stock: 0,
      lead_time_days: '3',
      resolution_dpi: null,
    }

    if (Array.isArray(istnieje) && istnieje.length > 0) {
      const res = await fetch(`${URL_BAZY}/rest/v1/products?id=eq.${istnieje[0].id}`, {
        method: 'PATCH',
        headers: naglowki,
        body: JSON.stringify(wiersz),
      })
      console.log(res.ok ? `~ zaktualizowano ${p.sku}` : `! błąd ${p.sku}: ${await res.text()}`)
    } else {
      const res = await fetch(`${URL_BAZY}/rest/v1/products`, {
        method: 'POST',
        headers: naglowki,
        body: JSON.stringify(wiersz),
      })
      console.log(res.ok ? `+ dodano ${p.sku}` : `! błąd ${p.sku}: ${await res.text()}`)
    }
  }
}

main()
