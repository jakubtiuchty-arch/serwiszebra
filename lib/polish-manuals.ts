// Polskie instrukcje skrócone dla urządzeń Zebra
// Każda instrukcja zawiera najważniejsze informacje po polsku
// ŹRÓDŁO: Oficjalny Service Manual Zebra (P213529-02EN, March 2025)

export interface PolishManualSection {
  title: string
  content: string
}

export interface PolishManual {
  model: string
  title: string
  lastUpdated: string
  sourceDocument: string
  keywords: string[]
  sections: PolishManualSection[]
}

// Baza polskich instrukcji - DANE ZWERYFIKOWANE Z OFICJALNEJ DOKUMENTACJI ZEBRA
export const polishManuals: Record<string, PolishManual> = {
  'zd421t': {
    model: 'ZD421t',
    title: 'Zebra ZD421t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-06',
    sourceDocument: 'ZD621 and ZD421 Service Manual (P213529-02EN)',
    keywords: [
      'zebra zd421t instrukcja',
      'zd421t instrukcja po polsku',
      'zebra zd421t manual',
      'drukarka zebra zd421t',
      'zebra zd421t kalibracja',
      'zd421t kalibracja smartcal',
      'zebra zd421t reset',
      'zd421t reset fabryczny',
      'zebra zd421t ribbon',
      'zd421t zakładanie taśmy',
      'zebra zd421t etykiety',
      'zd421t ładowanie etykiet',
      'zebra zd421t sterowniki',
      'zd421t instalacja',
      'zebra zd421t specyfikacja',
      'zd421t parametry techniczne',
      'zebra zd421t błędy',
      'zd421t ribbon out',
      'zd421t media out',
      'zebra zd421t czyszczenie',
      'zd421t czyszczenie głowicy',
      'zebra zd421t ethernet',
      'zd421t wifi',
      'zd421t bluetooth',
      'zebra zd421t thermal transfer',
      'zd421t termotransferowa',
      'drukarka etykiet zebra zd421t',
      'zebra zd421t 203 dpi',
      'zebra zd421t 300 dpi',
      'zd421t prędkość druku',
      'zebra zd421t serwis',
      'zd421t naprawa',
      'instrukcja obsługi zebra zd421t',
      'zebra zd421t po polsku',
      'zd421t user guide polski'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD421t

Zebra ZD421t to kompaktowa drukarka etykiet wykorzystująca technologię **druku termotransferowego** (Thermal Transfer). Drukarka **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy (Thermal Transfer)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **152 mm/s** (6 cali/s) |
| Prędkość druku (300 dpi) | do **102 mm/s** (4 cale/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m i 300 m |

### Złącza standardowe

- USB 2.0
- Gniazdo na moduł łączności (opcjonalny Ethernet lub RS-232)

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD421t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m (jeśli używasz ribbonów innych niż Zebra)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wymianę materiałów
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 40°C**

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały i ribbon
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety papierowe, foliowe i syntetyczne**

### Procedura ładowania etykiet

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod obiema prowadnicami materiału
5. **Ustaw czujnik** (w zależności od typu materiału):
   - Dla etykiet z przerwą: czujnik w pozycji domyślnej (środkowej)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie |
|-------------|--------------|
| **Performance Wax** | Etykiety papierowe |
| **Premium Wax/Resin** | Etykiety papierowe powlekane |
| **Performance Resin** | Etykiety syntetyczne |
| **Premium Resin** | Etykiety foliowe i syntetyczne |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

3. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

4. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej (użyj taśmy klejącej lub samoprzylepnego paska na ribbonie)

5. **Usuń luz**
   - Obróć górną gilzę zgodnie z kierunkiem nawijania aż ribbon będzie napięty

6. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

7. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon
`
      },
      {
        title: '5. Panel sterowania i LED',
        content: `
Drukarka posiada **3 przyciski** i **5 wskaźników LED**:

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Wysuw jednej etykiety |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **CANCEL** | Anulowanie zadań (gdy drukarka jest wstrzymana) |

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| **STATUS** | Zielony | Drukarka gotowa |
| **STATUS** | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| **PAUSE** | Pomarańczowy | Drukarka wstrzymana |
| **DATA** | Zielony mrugający | Transmisja danych |
| **SUPPLIES** | Czerwony | Brak materiału |
| **SUPPLIES** | Czerwony mrugający | **Brak ribbonu** |

### Ustawienie trybu druku

Drukarka ZD421t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (domyślny)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Sprawdź ustawienie na raporcie konfiguracji. Zmiana trybu wymaga zmiany parametru **PRINT METHOD**.
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału lub ribbonu **zawsze wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i w stanie gotowości (**STATUS = zielony**)
2. Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski
4. Drukarka automatycznie wysunie kilka etykiet i wykona kalibrację
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
3. Drukarka wydrukuje raport konfiguracji
4. Sprawdź czy **PRINT METHOD = THERMAL-TRANS**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę
5. Uruchom Zebra Setup Utilities i dokończ konfigurację

### Połączenie Ethernet (opcja)

Wymaga instalacji modułu Ethernet (opcja dodatkowa):

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Drukarka automatycznie pobierze adres IP z **DHCP**
4. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

### Połączenie Wi-Fi/Bluetooth (opcja)

Wymaga fabrycznie zainstalowanego modułu bezprzewodowego:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Użyj funkcji **NFC (Print Touch)** lub wyszukaj drukarkę w aplikacji
4. Postępuj zgodnie z instrukcjami w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon (jeśli jest załadowany)
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie czujników

1. Wyłącz drukarkę i otwórz pokrywę
2. Zlokalizuj czujniki (ruchomy czujnik pod materiałem i górny czujnik)
3. Delikatnie przedmuchaj sprężonym powietrzem
4. Przetrzyj patyczkiem nasączonym alkoholem
5. Poczekaj aż wyschnie
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS świeci na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Wykonaj kalibrację SmartCal |

### Wskaźnik SUPPLIES mruga na czerwono (RIBBON OUT)

- Sprawdź czy ribbon jest prawidłowo załadowany
- Sprawdź czy ribbon nie jest zużyty (widoczna **srebrna folia odbijająca** = koniec ribbonu)
- Wymień ribbon na nowy

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku jest ustawiony na **THERMAL-TRANS**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu (smugi na wydruku)

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu
- Sprawdź czy ribbon jest odpowiedni dla danego materiału
- Zmniejsz ciemność druku lub prędkość

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Zacięcie materiału lub ribbonu

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał/ribbon
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał i ribbon ponownie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD421t 203 dpi | ZD421t 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** | **102 mm/s (4 IPS)** |
| Typ druku | **Thermal Transfer** | **Thermal Transfer** |
| Szerokość druku | do 104 mm (4") | do 104 mm (4") |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **118 mm (4.65")** |
| Min szerokość | 15 mm (0.585") |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **110 mm (4.33")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | 74 m i 300 m |

### Łączność

- USB 2.0 (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac (opcja)
- Bluetooth 4.1 (opcja)
- RS-232 Serial (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 40°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Service Manual ZD621/ZD421 (P213529-02EN)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD421t?

**Odpowiedź:** Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez 2 sekundy. Drukarka automatycznie wykona kalibrację SmartCal, wysuwając kilka etykiet. Po zakończeniu wskaźnik STATUS zaświeci na zielono. Kalibrację należy wykonać po każdej wymianie materiału.

### Jak załadować ribbon do drukarki Zebra ZD421t?

**Odpowiedź:** Załóż pustą gilzę na górny trzpień (odbiorczy), rolkę ribbonu na dolny trzpień (podający) – ribbon odwija się od spodu. Przeprowadź ribbon pod głowicą i przymocuj do gilzy odbiorczej. Obróć górną gilzę, aby napiąć ribbon, następnie zamknij pokrywę.

### Co oznacza mrugająca dioda SUPPLIES na drukarce Zebra ZD421t?

**Odpowiedź:** Mrugająca na czerwono dioda SUPPLIES oznacza **brak ribbonu (RIBBON OUT)**. Sprawdź czy ribbon jest prawidłowo załadowany i napięty. Jeśli widzisz srebrną folię odbijającą na rolce – ribbon jest zużyty i wymaga wymiany.

### Jak wyczyścić głowicę drukarki Zebra ZD421t?

**Odpowiedź:** Wyłącz drukarkę i poczekaj aż głowica ostygnie. Otwórz pokrywę, wyjmij ribbon. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym Zebra lub wacikiem nasączonym alkoholem izopropylowym (99,7%). Czyść od środka ku krawędziom. Poczekaj 1 minutę przed zamknięciem.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD421t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD421t wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi oraz **102 mm/s (4 cale/s)** dla wersji 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZD421t?

**Odpowiedź:** Zebra ZD421t obsługuje etykiety o szerokości od 15 mm do 118 mm, maksymalnej długości 990 mm i średnicy rolki do 127 mm (5 cali). Obsługuje etykiety z przerwą (gap), z czarnym znacznikiem (black mark) oraz materiał ciągły. Jako drukarka termotransferowa **wymaga ribbonu**.

### Dlaczego drukarka Zebra ZD421t nie drukuje?

**Odpowiedź:** Najczęstsze przyczyny: 1) Brak lub źle załadowany ribbon – sprawdź czy jest napięty i prawidłowo przeprowadzony. 2) Tryb druku ustawiony na Direct Thermal zamiast Thermal Transfer – wydrukuj raport konfiguracji. 3) Zbyt niska ciemność druku – zwiększ parametr DARKNESS. 4) Brudna głowica – wyczyść alkoholem.

### Jak wykonać reset fabryczny drukarki Zebra ZD421t?

**Odpowiedź:** Przytrzymaj jednocześnie **FEED + CANCEL** podczas włączania drukarki. Trzymaj przyciski aż wskaźnik STATUS zacznie mrugać. Drukarka przywróci ustawienia fabryczne i wydrukuje raport konfiguracji.
`
      }
    ]
  },

  'zd421d': {
    model: 'ZD421d',
    title: 'Zebra ZD421d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-06',
    sourceDocument: 'ZD621 and ZD421 Service Manual (P213529-02EN)',
    keywords: [
      'zebra zd421d instrukcja',
      'zd421d instrukcja po polsku',
      'zebra zd421d manual',
      'drukarka zebra zd421d',
      'zebra zd421d kalibracja',
      'zd421d kalibracja smartcal',
      'zebra zd421d reset',
      'zd421d reset fabryczny',
      'zebra zd421d etykiety',
      'zd421d ładowanie etykiet',
      'zebra zd421d sterowniki',
      'zd421d instalacja',
      'zebra zd421d specyfikacja',
      'zd421d parametry techniczne',
      'zebra zd421d błędy',
      'zd421d media out',
      'zebra zd421d czyszczenie',
      'zd421d czyszczenie głowicy',
      'zebra zd421d ethernet',
      'zd421d wifi',
      'zd421d bluetooth',
      'zebra zd421d direct thermal',
      'zd421d termiczna bezpośrednia',
      'drukarka etykiet zebra zd421d',
      'zebra zd421d 203 dpi',
      'zebra zd421d 300 dpi',
      'zd421d prędkość druku',
      'zebra zd421d serwis',
      'zd421d naprawa',
      'instrukcja obsługi zebra zd421d',
      'zebra zd421d po polsku',
      'zd421d user guide polski',
      'zd421d bez ribbonu',
      'zd421d etykiety termiczne',
      'drukarka termiczna zebra zd421d'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD421d

Zebra ZD421d to kompaktowa drukarka etykiet wykorzystująca technologię **druku termicznego bezpośredniego** (Direct Thermal). Drukarka **nie wymaga taśmy barwiącej (ribbonu)** – drukuje bezpośrednio na papierze termoczułym.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **152 mm/s** (6 cali/s) |
| Prędkość druku (300 dpi) | do **102 mm/s** (4 cale/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |

### Złącza standardowe

- USB 2.0
- Gniazdo na moduł łączności (opcjonalny Ethernet lub RS-232)

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD421d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wymianę materiałów
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 40°C**

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków

> **WAŻNE:** Drukarka ZD421d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod obiema prowadnicami materiału
5. **Ustaw czujnik** (w zależności od typu materiału):
   - Dla etykiet z przerwą: czujnik w pozycji domyślnej (środkowej)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Zamknij pokrywę** – dociśnij pokrywę aż do usłyszenia kliknięcia zatrzasków

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania i LED',
        content: `
Drukarka posiada **3 przyciski** i **5 wskaźników LED**:

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Wysuw jednej etykiety |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **CANCEL** | Anulowanie zadań (gdy drukarka jest wstrzymana) |

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| **STATUS** | Zielony | Drukarka gotowa |
| **STATUS** | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| **PAUSE** | Pomarańczowy | Drukarka wstrzymana |
| **DATA** | Zielony mrugający | Transmisja danych |
| **SUPPLIES** | Czerwony | Brak materiału |

### Włączanie drukarki

1. Upewnij się, że materiał jest załadowany
2. Naciśnij przycisk **POWER**
3. Poczekaj aż wskaźnik STATUS zaświeci na zielono
4. Drukarka jest gotowa do pracy
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **zawsze wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i w stanie gotowości (**STATUS = zielony**)
2. Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski
4. Drukarka automatycznie wysunie kilka etykiet i wykona kalibrację
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
3. Drukarka wydrukuje raport konfiguracji

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę
5. Uruchom Zebra Setup Utilities i dokończ konfigurację

### Połączenie Ethernet (opcja)

Wymaga instalacji modułu Ethernet (opcja dodatkowa):

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Drukarka automatycznie pobierze adres IP z **DHCP**
4. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

### Połączenie Wi-Fi/Bluetooth (opcja)

Wymaga fabrycznie zainstalowanego modułu bezprzewodowego:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Użyj funkcji **NFC (Print Touch)** lub wyszukaj drukarkę w aplikacji
4. Postępuj zgodnie z instrukcjami w aplikacji
`
      },
      {
        title: '7. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie czujników

1. Wyłącz drukarkę i otwórz pokrywę
2. Zlokalizuj czujniki (ruchomy czujnik pod materiałem i górny czujnik)
3. Delikatnie przedmuchaj sprężonym powietrzem
4. Przetrzyj patyczkiem nasączonym alkoholem
5. Poczekaj aż wyschnie
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS świeci na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Wykonaj kalibrację SmartCal |

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Drukarka nie reaguje na polecenia

1. Sprawdź połączenie kablowe
2. Sprawdź czy wskaźnik STATUS jest zielony
3. Zrestartuj drukarkę (wyłącz na 10 sekund i włącz ponownie)
4. Sprawdź kolejkę druku w systemie Windows

### Etykiety nie są wykrywane (ciągły wysuw)

- Sprawdź typ materiału w ustawieniach drukarki
- Ustaw czujnik w odpowiedniej pozycji
- Wykonaj kalibrację SmartCal
- Wyczyść czujniki

### Zacięcie materiału

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał ponownie
`
      },
      {
        title: '9. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD421d 203 dpi | ZD421d 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** | **102 mm/s (4 IPS)** |
| Typ druku | **Direct Thermal** | **Direct Thermal** |
| Szerokość druku | do 104 mm (4") | do 104 mm (4") |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm (0.585") |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność

- USB 2.0 (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac (opcja)
- Bluetooth 4.1 (opcja)
- RS-232 Serial (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 40°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Service Manual ZD621/ZD421 (P213529-02EN)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD421d?

**Odpowiedź:** Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez 2 sekundy. Drukarka automatycznie wykona kalibrację SmartCal, wysuwając kilka etykiet. Po zakończeniu wskaźnik STATUS zaświeci na zielono.

### Czy drukarka Zebra ZD421d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD421d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych, które ciemnieją pod wpływem ciepła z głowicy. Jest to tańsze rozwiązanie, ale wydruki są mniej trwałe.

### Jak wyczyścić głowicę drukarki Zebra ZD421d?

**Odpowiedź:** Wyłącz drukarkę i poczekaj aż głowica ostygnie. Otwórz pokrywę. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym Zebra lub wacikiem nasączonym alkoholem izopropylowym (99,7%). Czyść od środka ku krawędziom. Poczekaj 1 minutę przed zamknięciem. Czyszczenie zalecane **co 5 rolek etykiet**.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD421d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD421d wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi oraz **102 mm/s (4 cale/s)** dla wersji 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZD421d?

**Odpowiedź:** Zebra ZD421d obsługuje etykiety termiczne o szerokości od 15 mm do 118 mm, maksymalnej długości 990 mm i średnicy rolki do 127 mm (5 cali). **Wymagane są etykiety termoczułe (Direct Thermal)** – papierowe lub syntetyczne pokryte warstwą termoczułą.

### Dlaczego drukarka Zebra ZD421d drukuje blado?

**Odpowiedź:** Najczęstsze przyczyny: 1) Zbyt niska ciemność druku – zwiększ parametr DARKNESS. 2) Zbyt wysoka prędkość druku – zmniejsz SPEED. 3) Brudna głowica – wyczyść alkoholem izopropylowym. 4) Zły typ etykiet – używaj tylko etykiet termoczułych (Direct Thermal).

### Jak wykonać reset fabryczny drukarki Zebra ZD421d?

**Odpowiedź:** Przytrzymaj jednocześnie **FEED + CANCEL** podczas włączania drukarki. Trzymaj przyciski aż wskaźnik STATUS zacznie mrugać. Drukarka przywróci ustawienia fabryczne i wydrukuje raport konfiguracji.

### Jaka jest różnica między ZD421d a ZD421t?

**Odpowiedź:** **ZD421d** to drukarka Direct Thermal (termiczna bezpośrednia) – **nie wymaga ribbonu**, używa etykiet termoczułych. **ZD421t** to drukarka Thermal Transfer (termotransferowa) – **wymaga ribbonu**, zapewnia trwalsze wydruki odporne na ścieranie i chemikalia.
`
      }
    ]
  },

  'zd621t': {
    model: 'ZD621t',
    title: 'Zebra ZD621t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-06',
    sourceDocument: 'ZD621 and ZD421 Service Manual (P213529-02EN)',
    keywords: [
      'zebra zd621t instrukcja',
      'zd621t instrukcja po polsku',
      'zebra zd621t manual',
      'drukarka zebra zd621t',
      'zebra zd621t kalibracja',
      'zd621t kalibracja smartcal',
      'zebra zd621t reset',
      'zd621t reset fabryczny',
      'zebra zd621t ribbon',
      'zd621t zakładanie taśmy',
      'zebra zd621t etykiety',
      'zd621t ładowanie etykiet',
      'zebra zd621t sterowniki',
      'zd621t instalacja',
      'zebra zd621t specyfikacja',
      'zd621t parametry techniczne',
      'zebra zd621t błędy',
      'zd621t ribbon out',
      'zd621t media out',
      'zebra zd621t czyszczenie',
      'zd621t czyszczenie głowicy',
      'zebra zd621t ethernet',
      'zd621t wifi',
      'zd621t bluetooth',
      'zebra zd621t thermal transfer',
      'zd621t termotransferowa',
      'drukarka etykiet zebra zd621t',
      'zebra zd621t 203 dpi',
      'zebra zd621t 300 dpi',
      'zd621t prędkość druku',
      'zebra zd621t serwis',
      'zd621t naprawa',
      'instrukcja obsługi zebra zd621t',
      'zebra zd621t po polsku',
      'zd621t user guide polski',
      'zd621t wyświetlacz lcd',
      'zd621t media dancer',
      'zd621t premium',
      'zd621t rs232',
      'zd621t serial',
      'drukarka zebra zd621 thermal transfer'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD621t

Zebra ZD621t to zaawansowana drukarka etykiet z serii **Premium**, wykorzystująca technologię **druku termotransferowego** (Thermal Transfer). Drukarka **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia. W porównaniu do modelu ZD421t oferuje **wyższą prędkość druku** oraz **fabrycznie zainstalowane złącza sieciowe**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy (Thermal Transfer)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m i 300 m |

### Złącza standardowe (fabrycznie zainstalowane)

- USB 2.0
- **Ethernet 10/100 (RJ-45)**
- **Port szeregowy RS-232 (DB-9)**
- Port USB Host

### Dodatkowe funkcje serii ZD621

- **Media Dancer** – mechanizm stabilizujący podawanie materiału
- **Kolorowy wyświetlacz dotykowy** (w wersjach z wyświetlaczem)
- Dwupojemnościowy system ribbonu (74 m i 300 m)

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD621t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m (jeśli używasz ribbonów innych niż Zebra)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wymianę materiałów
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 40°C**

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały i ribbon
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety papierowe, foliowe i syntetyczne**

### Procedura ładowania etykiet

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki
4. **Przeprowadź materiał pod Media Dancer** – mechanizm stabilizujący znajduje się nad ścieżką materiału
5. **Przeprowadź materiał** – przeciągnij etykiety pod obiema prowadnicami materiału
6. **Ustaw czujnik** (w zależności od typu materiału):
   - Dla etykiet z przerwą: czujnik w pozycji domyślnej (środkowej)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
7. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie | Max prędkość |
|-------------|--------------|--------------|
| **Performance Wax** | Etykiety papierowe | 8 IPS |
| **Premium Wax/Resin** | Etykiety papierowe powlekane | 8 IPS |
| **Performance Resin** | Etykiety syntetyczne | **6 IPS** |
| **Premium Resin** | Etykiety foliowe i syntetyczne | **4 IPS** |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

3. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

4. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej

5. **Usuń luz** – obróć górną gilzę aż ribbon będzie napięty

6. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

7. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon
`
      },
      {
        title: '5. Panel sterowania',
        content: `
Drukarka może być wyposażona w:
- **Panel standardowy** – 3 przyciski i 5 wskaźników LED
- **Kolorowy wyświetlacz dotykowy** – pełna konfiguracja z poziomu ekranu

### Przyciski (panel standardowy)

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Wysuw jednej etykiety |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **CANCEL** | Anulowanie zadań (gdy drukarka jest wstrzymana) |

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| **STATUS** | Zielony | Drukarka gotowa |
| **STATUS** | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| **PAUSE** | Pomarańczowy | Drukarka wstrzymana |
| **DATA** | Zielony mrugający | Transmisja danych |
| **SUPPLIES** | Czerwony | Brak materiału |
| **SUPPLIES** | Czerwony mrugający | **Brak ribbonu** |
| **NETWORK** | Zielony | Połączenie sieciowe 100 Mbps |
| **NETWORK** | Pomarańczowy | Połączenie sieciowe 10 Mbps |

### Obsługa wyświetlacza dotykowego

Ekran główny zawiera:
- **Status drukarki** – aktualny stan urządzenia
- **Info o drukarce** – szczegółowe informacje
- **Kreatory** – asystenci konfiguracji
- **Menu użytkownika** – ustawienia druku i sieci

### Ustawienie trybu druku

Drukarka ZD621t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (domyślny)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Zmiana trybu:
- Wyświetlacz dotykowy: **Menu > Druk > Jakość druku > Typ druku**
- Programowanie ZPL: komenda **^MT**

Sprawdź ustawienie na raporcie konfiguracji – **PRINT METHOD** powinno wskazywać **THERMAL-TRANS**.
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału lub ribbonu **zawsze wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Panel standardowy

1. Upewnij się, że drukarka jest włączona i w stanie gotowości (**STATUS = zielony**)
2. Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski
4. Drukarka automatycznie wysunie kilka etykiet i wykona kalibrację

### Wyświetlacz dotykowy

1. Przejdź do **Menu > Druk > Czujniki > Kalibracja ręczna**
2. Wybierz **SmartCal**
3. Drukarka wykona automatyczną kalibrację

### Druk testowy (raport konfiguracji)

**Panel standardowy:**
- Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
- Sprawdź czy **PRINT METHOD = THERMAL-TRANS**

**Wyświetlacz dotykowy:**
- Przejdź do **Menu > System > Ustawienia > Drukuj: Ustawienia systemu**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę
5. Uruchom Zebra Setup Utilities i dokończ konfigurację

### Połączenie Ethernet (fabrycznie zainstalowane)

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy) do złącza z tyłu drukarki
2. Włącz drukarkę
3. Wskaźnik **NETWORK** zaświeci na zielono (100 Mbps) lub pomarańczowo (10 Mbps)
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

#### Konfiguracja statycznego IP (wyświetlacz dotykowy):
1. Przejdź do **Połączenie > Sieć przewodowa > Protokół IP**
2. Wybierz "Stały" zamiast DHCP
3. Wprowadź adres IP, maskę podsieci i bramę

### Połączenie szeregowe RS-232 (fabrycznie zainstalowane)

1. Podłącz kabel null-modem DB-9 do złącza szeregowego
2. Domyślne ustawienia: **9600 baud, 8 bitów danych, brak parzystości, 1 bit stopu**

### Połączenie Wi-Fi/Bluetooth (opcja)

Wymaga fabrycznie zainstalowanego modułu bezprzewodowego:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Użyj funkcji **NFC (Print Touch)** lub wyszukaj drukarkę w aplikacji
4. Postępuj zgodnie z instrukcjami w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |
| **Media Dancer** | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon (jeśli jest załadowany)
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Rozpoznawanie typu wałka (po kolorze)

| Kolor wałka | Typ | Rozdzielczość |
|-------------|-----|---------------|
| Czarny | Standardowy | 203 dpi |
| Szary | Standardowy | 300 dpi |
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS świeci na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Wykonaj kalibrację SmartCal |

### Wskaźnik SUPPLIES mruga na czerwono (RIBBON OUT)

- Sprawdź czy ribbon jest prawidłowo załadowany
- Sprawdź czy ribbon nie jest zużyty (widoczna **srebrna folia odbijająca** = koniec ribbonu)
- Wymień ribbon na nowy

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku jest ustawiony na **THERMAL-TRANS**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu (smugi na wydruku)

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu
- Sprawdź czy ribbon jest odpowiedni dla danego materiału
- Zmniejsz ciemność druku lub prędkość

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Wskaźnik NETWORK nie świeci | Sprawdź kabel sieciowy |
| Brak adresu IP | Sprawdź ustawienia DHCP na serwerze |
| Wskaźnik mruga na czerwono | Błąd połączenia – sprawdź konfigurację sieci |

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Sprawdź czy **Media Dancer** nie jest zablokowany
- Wyczyść czujniki

### Zacięcie materiału lub ribbonu

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał/ribbon
4. Sprawdź czy materiał nie zablokował się w **Media Dancer**
5. Sprawdź czy nic nie pozostało w ścieżce materiału
6. Załaduj materiał i ribbon ponownie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD621t 203 dpi | ZD621t 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer** | **Thermal Transfer** |
| Szerokość druku | do 104 mm (4") | do 104 mm (4") |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **118 mm (4.65")** |
| Min szerokość | 15 mm (0.585") |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **110 mm (4.33")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | 74 m i 300 m |

### Łączność (fabrycznie zainstalowane)

- USB 2.0 (standardowo)
- **Ethernet 10/100** (standardowo)
- **RS-232 Serial** (standardowo)
- USB Host (standardowo)
- WiFi 802.11ac (opcja)
- Bluetooth 4.1 (opcja)

### Różnice ZD621t vs ZD421t

| Cecha | ZD421t | ZD621t |
|-------|--------|--------|
| Wyświetlacz dotykowy | ❌ Brak | ✅ Opcja |
| Max prędkość (203dpi) | 152 mm/s (6 IPS) | **203 mm/s (8 IPS)** |
| Ethernet / RS-232 | Opcja | **Standardowo** |
| **Media Dancer** | ❌ Brak | ✅ Tak |
| Szerokość druku | 104 mm (4") | 104 mm (4") |

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 40°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Service Manual ZD621/ZD421 (P213529-02EN)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD621t?

**Odpowiedź:** Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez 2 sekundy. Drukarka automatycznie wykona kalibrację SmartCal. Alternatywnie użyj wyświetlacza LCD: **MENU > Ustawienia > Kalibracja > SmartCal**.

### Jak załadować ribbon do drukarki Zebra ZD621t?

**Odpowiedź:** Otwórz pokrywę, załóż pustą gilzę na górny trzpień (odbiorczy), rolkę ribbonu na dolny trzpień (podający). Przeprowadź ribbon pod głowicą i przymocuj do gilzy odbiorczej. Ribbon musi być **szerszy niż etykiety** aby chronić głowicę.

### Co wyświetla się na ekranie LCD drukarki Zebra ZD621t?

**Odpowiedź:** Wyświetlacz LCD pokazuje: status drukarki, komunikaty o błędach, poziom materiałów, ustawienia druku. Umożliwia pełną konfigurację drukarki bez komputera oraz diagnostykę problemów.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD621t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD621t wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi oraz **152 mm/s (6 cali/s)** dla wersji 300 dpi. Jest to **szybsza drukarka niż ZD421t**.

### Jakie etykiety pasują do drukarki Zebra ZD621t?

**Odpowiedź:** Zebra ZD621t obsługuje etykiety o szerokości od 19 mm do 118 mm, maksymalnej długości 990 mm i średnicy rolki do **203 mm (8 cali)** – większa rolka niż w ZD421. Jako drukarka termotransferowa **wymaga ribbonu**.

### Jaka jest różnica między ZD621t a ZD421t?

**Odpowiedź:** **ZD621t** ma większą rolkę (do 203 mm vs 127 mm), szybszy druk (203 mm/s vs 152 mm/s), wyświetlacz LCD i zaawansowane opcje łączności. **ZD421t** jest bardziej kompaktowa i tańsza. Obie są termotransferowe (wymagają ribbonu).

### Jak wykonać reset fabryczny drukarki Zebra ZD621t?

**Odpowiedź:** Przez LCD: **MENU > System > Reset fabryczny > Tak**. Lub przytrzymaj **FEED + CANCEL** podczas włączania drukarki.

### Dlaczego drukarka Zebra ZD621t nie drukuje?

**Odpowiedź:** Najczęstsze przyczyny: 1) Sprawdź komunikat na wyświetlaczu LCD. 2) Brak lub źle załadowany ribbon. 3) Tryb druku Direct Thermal zamiast Thermal Transfer. 4) Brudna głowica – wyczyść alkoholem.
`
      }
    ]
  },

  'zd621d': {
    model: 'ZD621d',
    title: 'Zebra ZD621d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-06',
    sourceDocument: 'ZD621 and ZD421 Service Manual (P213529-02EN)',
    keywords: [
      'zebra zd621d instrukcja',
      'zd621d instrukcja po polsku',
      'zebra zd621d manual',
      'drukarka zebra zd621d',
      'zebra zd621d kalibracja',
      'zd621d kalibracja smartcal',
      'zebra zd621d reset',
      'zd621d reset fabryczny',
      'zebra zd621d etykiety',
      'zd621d ładowanie etykiet',
      'zebra zd621d sterowniki',
      'zd621d instalacja',
      'zebra zd621d specyfikacja',
      'zd621d parametry techniczne',
      'zebra zd621d błędy',
      'zd621d media out',
      'zebra zd621d czyszczenie',
      'zd621d czyszczenie głowicy',
      'zebra zd621d ethernet',
      'zd621d wifi',
      'zd621d bluetooth',
      'zebra zd621d direct thermal',
      'zd621d termiczna bezpośrednia',
      'drukarka etykiet zebra zd621d',
      'zebra zd621d 203 dpi',
      'zebra zd621d 300 dpi',
      'zd621d prędkość druku',
      'zebra zd621d serwis',
      'zd621d naprawa',
      'instrukcja obsługi zebra zd621d',
      'zebra zd621d po polsku',
      'zd621d user guide polski',
      'zd621d bez ribbonu',
      'zd621d etykiety termiczne',
      'drukarka termiczna zebra zd621d',
      'zd621d wyświetlacz lcd',
      'zd621d media dancer',
      'zd621d premium',
      'zd621d rs232',
      'zd621d serial',
      'drukarka zebra zd621 direct thermal'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD621d

Zebra ZD621d to zaawansowana drukarka etykiet z serii **Premium**, wykorzystująca technologię **druku termicznego bezpośredniego** (Direct Thermal). Drukarka **nie wymaga taśmy barwiącej (ribbonu)** – drukuje bezpośrednio na papierze termoczułym. W porównaniu do modelu ZD421d oferuje **wyższą prędkość druku** oraz **fabrycznie zainstalowane złącza sieciowe**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |

### Złącza standardowe (fabrycznie zainstalowane)

- USB 2.0
- **Ethernet 10/100 (RJ-45)**
- **Port szeregowy RS-232 (DB-9)**
- Port USB Host

### Dodatkowe funkcje serii ZD621

- **Media Dancer** – mechanizm stabilizujący podawanie materiału
- **Kolorowy wyświetlacz dotykowy** (w wersjach z wyświetlaczem)
- Opcja blokady komory materiału (modele Healthcare)

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD621d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wymianę materiałów
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 40°C**

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Materiały bezpodkładowe (linerless)** – z opcjonalnym wałkiem linerless

> **WAŻNE:** Drukarka ZD621d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał pod Media Dancer** – mechanizm stabilizujący znajduje się nad ścieżką materiału
5. **Przeprowadź materiał** – przeciągnij etykiety pod obiema prowadnicami materiału
6. **Ustaw czujnik** (w zależności od typu materiału):
   - Dla etykiet z przerwą: czujnik w pozycji domyślnej (środkowej)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
7. **Zamknij pokrywę** – dociśnij pokrywę aż do usłyszenia kliknięcia zatrzasków

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania',
        content: `
Drukarka może być wyposażona w:
- **Panel standardowy** – 3 przyciski i 5 wskaźników LED
- **Kolorowy wyświetlacz dotykowy** – pełna konfiguracja z poziomu ekranu

### Przyciski (panel standardowy)

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Wysuw jednej etykiety |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **CANCEL** | Anulowanie zadań (gdy drukarka jest wstrzymana) |

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| **STATUS** | Zielony | Drukarka gotowa |
| **STATUS** | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| **PAUSE** | Pomarańczowy | Drukarka wstrzymana |
| **DATA** | Zielony mrugający | Transmisja danych |
| **SUPPLIES** | Czerwony | Brak materiału |
| **NETWORK** | Zielony | Połączenie sieciowe aktywne (100 Mbps) |
| **NETWORK** | Pomarańczowy | Połączenie 10 Mbps |

### Obsługa wyświetlacza dotykowego

Ekran główny zawiera:
- **Status drukarki** – aktualny stan urządzenia
- **Info o drukarce** – szczegółowe informacje
- **Kreatory** – asystenci konfiguracji
- **Menu użytkownika** – ustawienia druku i sieci

Nawigacja:
- Dotknij ikony, aby wejść do menu
- Przesuń palcem, aby przewijać opcje
- Dotknij strzałki wstecz, aby wrócić
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **zawsze wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Panel standardowy

1. Upewnij się, że drukarka jest włączona i w stanie gotowości (**STATUS = zielony**)
2. Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski
4. Drukarka automatycznie wysunie kilka etykiet i wykona kalibrację

### Wyświetlacz dotykowy

1. Przejdź do **Menu > Druk > Czujniki > Kalibracja ręczna**
2. Wybierz **SmartCal**
3. Drukarka wykona automatyczną kalibrację

### Druk testowy (raport konfiguracji)

**Panel standardowy:**
- Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**

**Wyświetlacz dotykowy:**
- Przejdź do **Menu > System > Ustawienia > Drukuj: Ustawienia systemu**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę
5. Uruchom Zebra Setup Utilities i dokończ konfigurację

### Połączenie Ethernet (fabrycznie zainstalowane)

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy) do złącza z tyłu drukarki
2. Włącz drukarkę
3. Wskaźnik **NETWORK** zaświeci na zielono (100 Mbps) lub pomarańczowo (10 Mbps)
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

#### Konfiguracja statycznego IP (wyświetlacz dotykowy):
1. Przejdź do **Połączenie > Sieć przewodowa > Protokół IP**
2. Wybierz "Stały" zamiast DHCP
3. Wprowadź adres IP, maskę podsieci i bramę

### Połączenie szeregowe RS-232 (fabrycznie zainstalowane)

1. Podłącz kabel null-modem DB-9 do złącza szeregowego
2. Domyślne ustawienia: **9600 baud, 8 bitów danych, brak parzystości, 1 bit stopu**

### Połączenie Wi-Fi/Bluetooth (opcja)

Wymaga fabrycznie zainstalowanego modułu bezprzewodowego:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Użyj funkcji **NFC (Print Touch)** lub wyszukaj drukarkę w aplikacji
4. Postępuj zgodnie z instrukcjami w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)
`
      },
      {
        title: '7. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |
| **Media Dancer** | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Rozpoznawanie typu wałka (po kolorze)

| Kolor wałka | Typ | Rozdzielczość |
|-------------|-----|---------------|
| Czarny | Standardowy | 203 dpi |
| Szary | Standardowy | 300 dpi |
| Czerwono-brązowy | **Linerless** | 203 dpi |
| Brązowy | **Linerless** | 300 dpi |
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS świeci na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Wykonaj kalibrację SmartCal |

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Wskaźnik NETWORK nie świeci | Sprawdź kabel sieciowy |
| Brak adresu IP | Sprawdź ustawienia DHCP na serwerze |
| Wskaźnik mruga na czerwono | Błąd połączenia – sprawdź konfigurację sieci |

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Sprawdź czy **Media Dancer** nie jest zablokowany
- Wyczyść czujniki

### Etykiety nie są wykrywane (ciągły wysuw)

- Sprawdź typ materiału w ustawieniach drukarki
- Ustaw czujnik w odpowiedniej pozycji
- Wykonaj kalibrację SmartCal
- Wyczyść czujniki

### Zacięcie materiału

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał
4. Sprawdź czy materiał nie zablokował się w **Media Dancer**
5. Sprawdź czy nic nie pozostało w ścieżce materiału
6. Załaduj materiał ponownie
`
      },
      {
        title: '9. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD621d 203 dpi | ZD621d 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Direct Thermal** | **Direct Thermal** |
| Szerokość druku | do 104 mm (4") | do 104 mm (4") |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm (0.585") |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność (fabrycznie zainstalowane)

- USB 2.0 (standardowo)
- **Ethernet 10/100** (standardowo)
- **RS-232 Serial** (standardowo)
- USB Host (standardowo)
- WiFi 802.11ac (opcja)
- Bluetooth 4.1 (opcja)

### Różnice ZD621d vs ZD421d

| Cecha | ZD421d | ZD621d |
|-------|--------|--------|
| Wyświetlacz dotykowy | ❌ Brak | ✅ Opcja |
| Max prędkość (203dpi) | 152 mm/s (6 IPS) | **203 mm/s (8 IPS)** |
| Ethernet / RS-232 | Opcja | **Standardowo** |
| **Media Dancer** | ❌ Brak | ✅ Tak |
| Szerokość druku | 104 mm (4") | 104 mm (4") |

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 40°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Service Manual ZD621/ZD421 (P213529-02EN)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czy drukarka Zebra ZD621d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD621d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych, które ciemnieją pod wpływem ciepła z głowicy.

### Jak skalibrować drukarkę Zebra ZD621d?

**Odpowiedź:** Przez wyświetlacz LCD: **MENU > Ustawienia > Kalibracja > SmartCal**. Lub naciśnij i przytrzymaj **PAUSE + CANCEL** przez 2 sekundy.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD621d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD621d wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi oraz **152 mm/s (6 cali/s)** dla wersji 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZD621d?

**Odpowiedź:** Zebra ZD621d obsługuje etykiety termiczne o szerokości od 19 mm do 118 mm i średnicy rolki do **203 mm (8 cali)**. **Wymagane są etykiety termoczułe (Direct Thermal)**.

### Co to jest Media Dancer w drukarce Zebra ZD621d?

**Odpowiedź:** **Media Dancer** to system kontroli naprężenia materiału, który eliminuje problemy z nieprawidłowym podawaniem etykiet. Kompensuje różnice w naprężeniu przy różnych prędkościach druku.

### Jaka jest różnica między ZD621d a ZD421d?

**Odpowiedź:** **ZD621d** ma większą rolkę (do 203 mm vs 127 mm), szybszy druk (203 mm/s vs 152 mm/s), wyświetlacz LCD, Media Dancer i standardowy Ethernet. **ZD421d** jest bardziej kompaktowa i tańsza.

### Jak wykonać reset fabryczny drukarki Zebra ZD621d?

**Odpowiedź:** Przez LCD: **MENU > System > Reset fabryczny > Tak**. Lub przytrzymaj **FEED + CANCEL** podczas włączania drukarki.

### Dlaczego drukarka Zebra ZD621d drukuje blado?

**Odpowiedź:** Najczęstsze przyczyny: 1) Zbyt niska ciemność druku – zwiększ DARKNESS przez LCD. 2) Zbyt wysoka prędkość – zmniejsz SPEED. 3) Brudna głowica – wyczyść alkoholem. 4) Zły typ etykiet – używaj tylko etykiet termoczułych.
`
      }
    ]
  },

  'zd621r': {
    model: 'ZD621R',
    title: 'Zebra ZD621R – Instrukcja obsługi po Polsku (RFID)',
    lastUpdated: '2026-01-06',
    sourceDocument: 'ZD621 and ZD421 Service Manual (P213529-02EN)',
    keywords: [
      'zebra zd621r instrukcja',
      'zd621r instrukcja po polsku',
      'zebra zd621r manual',
      'drukarka zebra zd621r',
      'zebra zd621r rfid',
      'zd621r rfid instrukcja',
      'zebra zd621r kalibracja',
      'zd621r kalibracja rfid',
      'zd621r kalibracja smartcal',
      'zebra zd621r reset',
      'zd621r reset fabryczny',
      'zebra zd621r ribbon',
      'zd621r zakładanie taśmy',
      'zebra zd621r etykiety rfid',
      'zd621r ładowanie etykiet',
      'zebra zd621r sterowniki',
      'zd621r instalacja',
      'zebra zd621r specyfikacja',
      'zd621r parametry techniczne',
      'zebra zd621r błędy',
      'zd621r rfid error',
      'zd621r ribbon out',
      'zd621r media out',
      'zebra zd621r czyszczenie',
      'zd621r czyszczenie głowicy',
      'zd621r czyszczenie anteny rfid',
      'zebra zd621r ethernet',
      'zd621r wifi',
      'zd621r bluetooth',
      'zebra zd621r thermal transfer',
      'zd621r termotransferowa',
      'drukarka etykiet rfid zebra zd621r',
      'zebra zd621r 203 dpi',
      'zebra zd621r 300 dpi',
      'zd621r prędkość druku',
      'zebra zd621r serwis',
      'zd621r naprawa',
      'instrukcja obsługi zebra zd621r',
      'zebra zd621r po polsku',
      'zd621r user guide polski',
      'zd621r wyświetlacz lcd',
      'zd621r media dancer',
      'zd621r premium',
      'zd621r rs232',
      'zd621r serial',
      'drukarka rfid zebra',
      'zd621r uhf rfid',
      'zd621r epc gen2',
      'zd621r kodowanie rfid',
      'zd621r programowanie rfid',
      'zd621r zpl rfid',
      'zd621r void etykiety',
      'zd621r enkoder rfid',
      'drukarka z enkoderem rfid zebra'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD621R

Zebra ZD621R to zaawansowana drukarka etykiet z serii **Premium**, wyposażona w **wbudowany moduł RFID UHF**. Umożliwia jednoczesne drukowanie i kodowanie etykiet RFID. Drukarka wykorzystuje technologię druku termotransferowego i **wymaga taśmy barwiącej (ribbonu)**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy (Thermal Transfer)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Obsługiwane rolki ribbonu | 74 m i 300 m |
| **Technologia RFID** | **UHF (860-960 MHz)** |
| **Protokół RFID** | **EPC Gen 2, ISO 18000-6C** |

### Złącza standardowe (fabrycznie zainstalowane)

- USB 2.0
- **Ethernet 10/100 (RJ-45)**
- **Port szeregowy RS-232 (DB-9)**
- Port USB Host

### Dodatkowe funkcje

- **Wbudowany moduł RFID** z anteną
- **Media Dancer** – mechanizm stabilizujący podawanie materiału
- **Kolorowy wyświetlacz dotykowy** – wymagany do obsługi funkcji RFID
- Automatyczna kalibracja pozycji znacznika RFID

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD621R z modułem RFID
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- **Unikaj metalowych powierzchni** – mogą zakłócać sygnał RFID
- Zapewnij odstęp od innych urządzeń RFID/RF
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 40°C**

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały i ribbon
`
      },
      {
        title: '3. Ładowanie etykiet RFID',
        content: `
### Obsługiwane typy materiałów RFID

- **Etykiety RFID z przerwą (gap)** – z wbudowanym chipem i anteną
- **Etykiety RFID z czarnym znacznikiem** – znacznik pozycjonujący z tyłu

> **WAŻNE:** Używaj wyłącznie etykiet RFID kompatybilnych z drukarką. Pozycja chipa musi odpowiadać pozycji anteny w drukarce.

### Lokalizacja anteny RFID

Antena RFID znajduje się **między wałkiem napędowym a kanałem czujnika materiału**. Jest oznaczona charakterystyczną kopułką.

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet RFID** – umieść rolkę między prowadnicami. **Strona z chipem RFID powinna być skierowana w dół**
4. **Przeprowadź materiał pod Media Dancer**
5. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami
6. **Ustaw czujnik** w odpowiedniej pozycji
7. **Załaduj ribbon** (patrz sekcja 4)
8. **Zamknij pokrywę**

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą.

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

3. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

4. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej

5. **Usuń luz** – obróć górną gilzę aż ribbon będzie napięty

6. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

7. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon
`
      },
      {
        title: '5. Konfiguracja RFID',
        content: `
### Menu RFID (wyświetlacz dotykowy)

Przejdź do **Menu > RFID** aby uzyskać dostęp do ustawień RFID:

| Opcja | Opis |
|-------|------|
| **Status RFID** | Wyświetla aktualny stan modułu RFID |
| **Test RFID** | Testuje odczyt/zapis znacznika bez ruchu materiału |
| **Kalibracja RFID** | Automatycznie ustala optymalną pozycję programowania |
| **Moc odczytu** | Regulacja mocy anteny przy odczycie (0-30) |
| **Moc zapisu** | Regulacja mocy anteny przy zapisie (0-30) |
| **Antena RFID** | Wybór anteny (A1 - domyślnie) |
| **Licznik poprawnych** | Licznik poprawnie zakodowanych etykiet |
| **Licznik unieważnionych** | Licznik etykiet z błędem kodowania |
| **Pozycja programowania** | Ręczne ustawienie pozycji kodowania |
| **Odczyt danych RFID** | Odczyt danych z bieżącego znacznika |

### Kalibracja RFID

Przed rozpoczęciem drukowania z kodowaniem RFID **wykonaj kalibrację**:

1. Załaduj materiał RFID i ribbon
2. Wykonaj standardową kalibrację SmartCal (**PAUSE + CANCEL** przez 2 sekundy)
3. Przejdź do **Menu > RFID > Kalibracja RFID**
4. Dotknij **Start**
5. Drukarka automatycznie znajdzie optymalną pozycję kodowania

> **Uwaga:** Przed kalibracją RFID zostaw kilka centymetrów materiału wystającego z przodu drukarki – drukarka może cofać materiał podczas kalibracji.

### Test RFID

Aby przetestować odczyt/zapis bez drukowania:

1. Umieść etykietę RFID nad anteną (transponder nad kopułką anteny)
2. Przejdź do **Menu > RFID > Test RFID**
3. Dotknij **Start**
4. Wynik testu pojawi się na ekranie
`
      },
      {
        title: '6. Panel sterowania',
        content: `
Model ZD621R jest wyposażony w **kolorowy wyświetlacz dotykowy** umożliwiający pełną konfigurację RFID.

### Ekran główny

- **Status drukarki** – aktualny stan urządzenia i RFID
- **Info o drukarce** – szczegółowe informacje
- **Kreatory** – asystenci konfiguracji
- **Menu użytkownika** – ustawienia druku, sieci i RFID

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| **STATUS** | Zielony | Drukarka gotowa |
| **STATUS** | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| **PAUSE** | Pomarańczowy | Drukarka wstrzymana |
| **DATA** | Zielony mrugający | Transmisja danych |
| **SUPPLIES** | Czerwony | Brak materiału |
| **SUPPLIES** | Czerwony mrugający | **Brak ribbonu** |
| **NETWORK** | Zielony | Połączenie sieciowe aktywne |

### Kalibracja SmartCal

Po załadowaniu nowego materiału RFID:

1. Przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**
2. LUB: **Menu > Druk > Czujniki > Kalibracja ręczna > SmartCal**
3. **Po SmartCal wykonaj również Kalibrację RFID**

### Druk testowy

1. Wydrukuj raport konfiguracji: przytrzymaj **FEED + CANCEL** przez **2 sekundy**
2. Sprawdź sekcję RFID na wydruku
3. Użyj **Menu > RFID > Test RFID** do weryfikacji kodowania
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę

### Połączenie Ethernet (fabrycznie zainstalowane)

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Wskaźnik **NETWORK** zaświeci na zielono
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić adres IP

### Połączenie RS-232 (fabrycznie zainstalowane)

1. Podłącz kabel null-modem DB-9
2. Domyślne ustawienia: **9600 baud, 8 bitów, brak parzystości, 1 bit stopu**

### Konfiguracja sieciowa (wyświetlacz dotykowy)

1. Przejdź do **Połączenie > Sieć przewodowa > Protokół IP**
2. Wybierz "Stały" dla statycznego IP lub "DHCP" dla automatycznego
3. Dostęp przez przeglądarkę: wpisz adres IP drukarki

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| **Media Dancer** | W razie potrzeby |
| **Antena RFID** | Delikatne czyszczenie w razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem z alkoholem
4. **Czyść od środka ku krawędziom**
5. Poczekaj około **1 minuty** aż wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie anteny RFID

> **OSTROŻNIE:** Antena RFID to delikatny element!

1. Wyłącz drukarkę
2. Delikatnie przedmuchaj sprężonym powietrzem
3. Jeśli konieczne, przetrzyj miękką, bezpyłową ściereczką
4. **Nie używaj alkoholu** bezpośrednio na antenie
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Problemy z drukiem

| Problem | Rozwiązanie |
|---------|-------------|
| STATUS czerwony | Zamknij pokrywę, załaduj materiał |
| RIBBON OUT | Wymień ribbon lub sprawdź ładowanie |
| Marszczenie ribbonu | Wyrównaj ribbon, zmniejsz ciemność |
| Brak wydruku | Sprawdź tryb druku (THERMAL-TRANS) |

### Problemy z RFID

| Problem | Rozwiązanie |
|---------|-------------|
| Etykiety nie są kodowane | Wykonaj Kalibrację RFID |
| Wysokie unieważnienia (void) | Zmniejsz prędkość druku, zwiększ moc zapisu |
| Błąd odczytu RFID | Sprawdź pozycję etykiety nad anteną |
| Kodowanie sąsiednich etykiet | Zmniejsz moc zapisu, wykonaj Kalibrację RFID |

### Kody błędów RFID na wyświetlaczu

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| **RFID ERROR** | Ogólny błąd RFID | Sprawdź etykiety, wykonaj kalibrację |
| **NO TAG DETECTED** | Brak znacznika | Sprawdź pozycję etykiety |
| **WRITE FAILED** | Błąd zapisu | Zwiększ moc zapisu, sprawdź etykietę |
| **TAG VOIDED** | Etykieta unieważniona | Defekt etykiety, zostanie zadrukowana VOID |

### Optymalizacja kodowania RFID

Jeśli wiele etykiet jest unieważnianych:

1. **Zmniejsz prędkość druku** – daj więcej czasu na kodowanie
2. **Zwiększ moc zapisu** – Menu > RFID > Moc zapisu (wartość 0-30)
3. **Wykonaj ponownie Kalibrację RFID**
4. **Sprawdź jakość etykiet** – użyj etykiet Zebra lub certyfikowanych

### Reset liczników RFID

- **Menu > RFID > Licznik poprawnych > Reset**
- **Menu > RFID > Licznik unieważnionych > Reset**
`
      },
      {
        title: '10. Programowanie RFID (podstawy)',
        content: `
### Komendy ZPL dla RFID

| Komenda | Opis |
|---------|------|
| **^RFW** | Zapis danych do znacznika RFID |
| **^RFR** | Odczyt danych z znacznika RFID |
| **^RS** | Ustawienia RFID (pozycja, moc, typ tagu) |
| **^HR** | Kalibracja znacznika RFID |

> 📘 **Przeczytaj więcej o ZPL:** [Język ZPL - poradnik, komendy, przykłady](/blog/jezyk-zpl-poradnik-komendy-przyklady)

### Przykład etykiety ZPL z RFID

    ^XA
    ^RS8,,,3                        ; Konfiguracja RFID
    ^RFW,H^FD1234567890ABCDEF^FS    ; Zapis danych HEX do EPC
    ^FO50,50^A0N,50,50^FDProdukt ABC^FS
    ^FO50,120^BY3^BCN,100,Y,N,N^FD1234567890^FS
    ^XZ

> **Uwaga:** Szczegółowe informacje o programowaniu RFID znajdziesz w dokumentacji "RFID Programming Guide 3" dostępnej na zebra.com/manuals
`
      },
      {
        title: '11. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD621R 203 dpi | ZD621R 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer** | **Thermal Transfer** |
| Szerokość druku | do 104 mm (4") | do 104 mm (4") |

> **Uwaga:** Prędkość druku z RFID może być niższa ze względu na czas kodowania.

### Media (etykiety RFID)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **118 mm (4.65")** |
| Min szerokość | 15 mm (0.585") |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **110 mm (4.33")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | 74 m i 300 m |

### Enkoder RFID

| Parametr | Wartość |
|----------|---------|
| Typ | **UHF RFID** |
| Standard | **EPC Gen2 (ISO 18000-6C)** |
| Częstotliwość | **860-960 MHz** (region-dependent) |
| Moc wyjściowa | Regulowana (0-30) |

### Łączność (fabrycznie zainstalowane)

- USB 2.0 (standardowo)
- **Ethernet 10/100** (standardowo)
- **RS-232 Serial** (standardowo)
- USB Host (standardowo)
- WiFi 802.11ac (opcja)
- Bluetooth 4.1 (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 40°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Service Manual ZD621/ZD421 (P213529-02EN)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka RFID Zebra ZD621R?

**Odpowiedź:** Zebra ZD621R to drukarka termotransferowa z wbudowanym enkoderem RFID UHF. Jednocześnie **drukuje etykiety i programuje chipy RFID** (inlay). Obsługuje standardy EPC Gen 2 i ISO 18000-6C.

### Jak skalibrować drukarkę RFID Zebra ZD621R?

**Odpowiedź:** Wykonaj standardową kalibrację SmartCal (PAUSE + CANCEL przez 2 sek.) dla druku. Dla RFID: **MENU > RFID > CALIBRATE**. Drukarka automatycznie wykryje pozycję transpondera.

### Jakie etykiety RFID pasują do drukarki Zebra ZD621R?

**Odpowiedź:** Zebra ZD621R obsługuje etykiety RFID UHF o szerokości 19-118 mm z transponderami (inlay) w standardzie EPC Gen 2. Zalecane są etykiety Zebra Certified RFID. Pozycja transpondera jest wykrywana automatycznie podczas kalibracji.

### Co oznacza błąd RFID ERROR na drukarce Zebra ZD621R?

**Odpowiedź:** Błąd RFID ERROR oznacza problem z enkodowaniem chipa. Najczęstsze przyczyny: 1) Uszkodzony transponder – drukarka automatycznie oznaczy "Bad" etykietę. 2) Nieprawidłowa pozycja chipa – wykonaj kalibrację RFID. 3) Zbyt słaby sygnał – sprawdź moc anteny w ustawieniach.

### Ile etykiet RFID może zakodować drukarka Zebra ZD621R przed oznaczeniem jako wadliwe?

**Odpowiedź:** Domyślnie drukarka próbuje zakodować transponder **3 razy** zanim oznaczy etykietę jako wadliwą (VOID). Liczbę prób można zmienić w ustawieniach RFID (parametr RFID RETRIES).

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD621R?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD621R wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi. Prędkość może być ograniczona przy enkodowaniu RFID w zależności od złożoności danych.

### Jak zaprogramować etykietę RFID na drukarce Zebra ZD621R?

**Odpowiedź:** Użyj komend ZPL: **^RF** do zapisu danych, **^RS** do konfiguracji RFID. Przykład: RFW,H zapisuje dane HEX do pamięci EPC. Można też użyć oprogramowania ZebraDesigner.

### Czy Zebra ZD621R może drukować bez RFID?

**Odpowiedź:** **Tak.** Drukarka może pracować jako standardowa drukarka termotransferowa bez enkodowania RFID. Wystarczy użyć zwykłych etykiet bez transpondera.
`
      }
    ]
  },

  'zd411t': {
    model: 'ZD411t',
    title: 'Zebra ZD411t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD411 Series User Guide',
    keywords: [
      'zebra zd411 instrukcja',
      'zd411 instrukcja po polsku',
      'zebra zd411 instrukcja po polsku',
      'zebra zd411t instrukcja',
      'zd411t instrukcja po polsku',
      'zebra zd411t manual',
      'drukarka zebra zd411t',
      'zebra zd411t kalibracja',
      'zd411t kalibracja smartcal',
      'zebra zd411t reset',
      'zd411t reset fabryczny',
      'zebra zd411t ribbon',
      'zd411t zakładanie taśmy',
      'zebra zd411t etykiety',
      'zd411t ładowanie etykiet',
      'zebra zd411t sterowniki',
      'zd411t instalacja',
      'zebra zd411t specyfikacja',
      'zd411t parametry techniczne',
      'zebra zd411t błędy',
      'zd411t ribbon out',
      'zd411t media out',
      'zebra zd411t czyszczenie',
      'zd411t czyszczenie głowicy',
      'zebra zd411t ethernet',
      'zd411t wifi',
      'zd411t bluetooth',
      'zebra zd411t thermal transfer',
      'zd411t termotransferowa',
      'drukarka etykiet zebra zd411t',
      'zebra zd411t 203 dpi',
      'zebra zd411t 300 dpi',
      'zd411t prędkość druku',
      'zebra zd411t serwis',
      'zd411t naprawa',
      'instrukcja obsługi zebra zd411t',
      'zebra zd411t po polsku',
      'zd411t user guide polski',
      'zd411t 2 calowa',
      'zd411t 2 inch',
      'zd411t link-os',
      'zd411t nfc',
      'zd411t print touch',
      'drukarka 2 calowa zebra',
      'zd411t bateria',
      'zd411t obcinacz',
      'zd411t dispenser'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD411t

Zebra ZD411t to kompaktowa **2-calowa** drukarka etykiet z serii **Link-OS**. Wykorzystuje technologię **druku termotransferowego** – **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia. Drukarka wyposażona jest w zaawansowany interfejs użytkownika z 5 wskaźnikami LED i 3 przyciskami.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy / termiczny bezpośredni** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **56 mm** (2,20 cala) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m |
| Pamięć wewnętrzna | min. 512 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- USB Host (standard)
- RS-232 Serial – opcja fabryczna lub rozbudowa
- Ethernet 10/100 (RJ-45) – opcja fabryczna lub rozbudowa
- Wi-Fi 802.11ac/ax + Bluetooth 4.2/5.3 – opcja fabryczna lub rozbudowa

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Zaawansowany interfejs – 3 przyciski i 5 wskaźników LED
- Platforma **Link-OS** z aplikacjami mobilnymi
- **NFC Print Touch** do parowania z urządzeniami mobilnymi
- Obsługa języków ZPL i EPL
- Opcjonalna bateria z podstawą
- Opcjonalny obcinacz lub dispenser etykiet

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD411t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety z nacięciem (notch)** – materiały z wycięciami
- **Materiał linerless** – etykiety bez podkładu

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające (po obu stronach) ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym (platen roller)
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik na spodzie materiału
   - Dla etykiet z nacięciem: ustaw czujnik nad nacięciem
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą. Drukarka ZD411t obsługuje rolki ribbonu **74 m**.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie |
|-------------|--------------|
| **Performance Wax** | Etykiety papierowe |
| **Premium Wax/Resin** | Etykiety papierowe powlekane |
| **Performance Resin** | Etykiety syntetyczne (maks. 6 ips) |
| **Premium Resin** | Etykiety foliowe i syntetyczne (maks. 4 ips) |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Sprawdź nacięcia na gilzach** – ribbony Zebra mają nacięcia po lewej stronie gilzy (wymagane do prawidłowego mocowania)

3. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

4. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

5. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej

6. **Usuń luz** – obróć górną gilzę (kierunek: góra do tyłu) aż ribbon będzie napięty

7. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

8. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon

> **Ważne:** Nie używaj starych gilz z wcześniejszych modeli drukarek – mogą być za duże.
`
      },
      {
        title: '5. Panel sterowania i LED',
        content: `
Drukarka ZD411t posiada zaawansowany interfejs z **3 przyciskami** i **5 wskaźnikami LED**:

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie, tryb oszczędzania energii |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw etykiety / funkcje specjalne |
| **CANCEL** | Anulowanie zadania druku |

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

### Znaczenie kolorów

| Kolor | Znaczenie |
|-------|-----------|
| Zielony | Gotowy / działa prawidłowo |
| Pomarańczowy | Zajęty / przetwarzanie |
| Czerwony | Wymaga uwagi / błąd |
| Wygaszony | Nie wymaga uwagi |

### Tryb oszczędzania energii (Energy Star)

Krótkie naciśnięcie **POWER** (gdy drukarka jest włączona) wprowadza drukarkę w tryb niskiego poboru mocy. Wskaźnik STATUS powoli pulsuje.

### Ustawienie trybu druku

Drukarka ZD411t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (dla trwałych wydruków)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Sprawdź ustawienie na raporcie konfiguracji – **PRINT METHOD** powinno wskazywać odpowiedni tryb.
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski gdy wskaźniki zaczną migać
4. Drukarka wysunie kilka etykiet i automatycznie wykalibruje czujniki
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
3. Drukarka wydrukuje raport konfiguracji
4. Sprawdź ustawienia: **PRINT METHOD**, **PRINT WIDTH**, **LABEL LENGTH**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Włącz drukarkę gdy kreator instalacji o to poprosi
5. Windows automatycznie wykryje i skonfiguruje drukarkę

### Połączenie Ethernet (LAN)

Jeśli drukarka ma moduł Ethernet:

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Sprawdź wskaźnik **NETWORK** – zielony oznacza połączenie
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić adres IP

### Połączenie Wi-Fi

Jeśli drukarka ma moduł Wi-Fi:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Włącz drukarkę
4. Użyj funkcji **Print Touch (NFC)** – przyłóż telefon do logo Zebra na drukarce
5. Lub wyszukaj drukarkę przez Bluetooth w aplikacji
6. Skonfiguruj połączenie Wi-Fi przez kreatora w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Połączenie RS-232 (Serial)

Jeśli drukarka ma port szeregowy:

- Domyślne ustawienia: **9600 baud, 8 bitów, brak parzystości, 1 bit stopu**
- Użyj kabla null-modem (cross-over) z wtyczką DB-9
`
      },
      {
        title: '8. Funkcje dodatkowe',
        content: `
### Zebra Print Touch (NFC)

Drukarka wyposażona jest w znacznik **NFC** umożliwiający:
- Szybkie parowanie Bluetooth z telefonem/tabletem
- Uruchomienie aplikacji konfiguracyjnej
- Dostęp do strony pomocy technicznej

Aby użyć: przyłóż urządzenie NFC do logo **Zebra Print Touch** na obudowie drukarki.

### Opcja baterii

Drukarka może pracować z opcjonalną baterią w podstawie:
- Czas ładowania: ok. 2 godziny (od 0 do 100%)
- Bateria zaczyna ładowanie gdy poziom spadnie poniżej 90%
- Tryb UPS – bateria automatycznie przejmuje zasilanie przy utracie prądu

### Opcja obcinacza (Cutter)

Automatycznie odcina etykiety po wydrukowaniu. Nie wymaga konserwacji użytkownika.

> **Ostrzeżenie:** Nie wkładaj palców ani przedmiotów do mechanizmu obcinacza!

### Opcja dispensera (Label Dispenser)

Automatycznie odkleja etykietę od podkładu i prezentuje do pobrania. Czujnik wykrywa pobranie etykiety przed wydrukowaniem następnej.
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

> **Uwaga:** Nie używaj sprężarki powietrza – może wprowadzić zanieczyszczenia.

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie. Uwaga na wyładowania elektrostatyczne (ESD).

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj ok. **1 minuty** aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie wałka napędowego (Platen Roller)

1. Obróć wałek ręcznie i przetrzyj go ściereczką nasączoną alkoholem
2. Nie używaj ostrych przedmiotów
3. W razie uszkodzenia lub zużycia – wymień wałek
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS – czerwony (mruga)

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj SmartCal |

### Wskaźnik SUPPLIES – czerwony

| Problem | Rozwiązanie |
|---------|-------------|
| Brak ribbonu | Załaduj nowy ribbon |
| Koniec ribbonu | Wymień na nową rolkę |
| Ribbon w trybie Direct Thermal | Wyjmij ribbon lub zmień tryb na Thermal Transfer |

### Wskaźnik PAUSE – pomarańczowy

Drukarka jest wstrzymana. Naciśnij **PAUSE** aby wznowić drukowanie.

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku odpowiada materiałowi (Transfer vs Direct)
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu
- Zmniejsz ciemność druku lub prędkość
- Sprawdź czy gilzy mają prawidłowe nacięcia

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione

### Błąd obcinacza (Cut Error)

1. Wyłącz drukarkę (przytrzymaj POWER 5 sekund)
2. Poczekaj na pełne wyłączenie
3. Włącz drukarkę ponownie
4. Jeśli błąd się powtarza – [skontaktuj się z serwisem](/kontakt)

### Przegrzanie głowicy

Drukarka automatycznie wstrzymuje druk do ostygnięcia. Upewnij się, że wokół drukarki jest odpowiednia wentylacja i temperatura otoczenia nie przekracza 41°C.
`
      },
      {
        title: '11. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD411t 203 dpi | ZD411t 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer / Direct Thermal** | **Thermal Transfer / Direct Thermal** |
| Szerokość druku | do **56 mm (2.20")** | do **56 mm (2.20")** |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **60 mm (2.36")** |
| Min szerokość | 15 mm (0.59") |
| Max długość | 991 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **57 mm (2.24")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | **74 m** |

### Łączność

- USB 2.0 (standardowo)
- USB Host (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac/ax (opcja)
- Bluetooth 4.2/5.3 (opcja)
- RS-232 Serial (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD411 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD411t?

**Odpowiedź:** Naciśnij i przytrzymaj jednocześnie **PAUSE + CANCEL** przez 2 sekundy. Drukarka wykona kalibrację SmartCal, wysuwając kilka etykiet. Kalibrację wykonaj po każdej wymianie materiału.

### Jak załadować ribbon do drukarki Zebra ZD411t?

**Odpowiedź:** ZD411t to drukarka **2-calowa**. Załóż pustą gilzę na górny trzpień, rolkę ribbonu na dolny (odwijanie od spodu). Przeprowadź ribbon pod głowicą, przymocuj do gilzy i naciągnij. Ribbon musi być szerszy niż etykiety.

### Jaka jest maksymalna szerokość etykiet w drukarce Zebra ZD411t?

**Odpowiedź:** Maksymalna szerokość druku Zebra ZD411t wynosi **56 mm (2,2 cala)**. To drukarka z serii 2-calowej, idealna do mniejszych etykiet, kodów kreskowych i bransoletek.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD411t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD411t wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi oraz **102 mm/s (4 cale/s)** dla wersji 300 dpi.

### Czy drukarka Zebra ZD411t wymaga ribbonu?

**Odpowiedź:** **Tak.** ZD411t to drukarka **Thermal Transfer (termotransferowa)** – wymaga ribbonu. Zapewnia trwałe wydruki odporne na ścieranie. Dla etykiet bez ribbonu wybierz model ZD411d.

### Jak wyczyścić głowicę drukarki Zebra ZD411t?

**Odpowiedź:** Wyłącz drukarkę, poczekaj aż ostygnie. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyść od środka ku krawędziom. Czyszczenie zalecane **co 1 rolkę ribbonu**.

### Jak wykonać reset fabryczny drukarki Zebra ZD411t?

**Odpowiedź:** Przytrzymaj **FEED + CANCEL** podczas włączania drukarki. Trzymaj aż wskaźnik STATUS zacznie mrugać. Drukarka przywróci ustawienia fabryczne.

### Jakie są różnice między ZD411t a ZD421t?

**Odpowiedź:** **ZD411t** to drukarka **2-calowa** (max 56 mm), **ZD421t** to drukarka **4-calowa** (max 104 mm). Obie są termotransferowe (wymagają ribbonu). ZD411t jest bardziej kompaktowa, idealna do mniejszych etykiet.
`
      }
    ]
  },

  'zd411d': {
    model: 'ZD411d',
    title: 'Zebra ZD411d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD411 Series User Guide',
    keywords: [
      'zebra zd411 instrukcja',
      'zd411 instrukcja po polsku',
      'zebra zd411 instrukcja po polsku',
      'zebra zd411d instrukcja',
      'zd411d instrukcja po polsku',
      'zebra zd411d manual',
      'drukarka zebra zd411d',
      'zebra zd411d kalibracja',
      'zd411d kalibracja smartcal',
      'zebra zd411d reset',
      'zd411d reset fabryczny',
      'zebra zd411d etykiety',
      'zd411d ładowanie etykiet',
      'zebra zd411d sterowniki',
      'zd411d instalacja',
      'zebra zd411d specyfikacja',
      'zd411d parametry techniczne',
      'zebra zd411d błędy',
      'zd411d media out',
      'zebra zd411d czyszczenie',
      'zd411d czyszczenie głowicy',
      'zebra zd411d ethernet',
      'zd411d wifi',
      'zd411d bluetooth',
      'zebra zd411d direct thermal',
      'zd411d termiczna bezpośrednia',
      'drukarka etykiet zebra zd411d',
      'zebra zd411d 203 dpi',
      'zebra zd411d 300 dpi',
      'zd411d prędkość druku',
      'zebra zd411d serwis',
      'zd411d naprawa',
      'instrukcja obsługi zebra zd411d',
      'zebra zd411d po polsku',
      'zd411d user guide polski',
      'zd411d 2 calowa',
      'zd411d 2 inch',
      'zd411d link-os',
      'zd411d nfc',
      'zd411d print touch',
      'drukarka 2 calowa zebra',
      'zd411d bateria',
      'zd411d obcinacz',
      'zd411d dispenser',
      'zd411d bez ribbonu',
      'zd411d etykiety termiczne'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD411d

Zebra ZD411d to kompaktowa **2-calowa** drukarka etykiet z serii **Link-OS**. Wykorzystuje technologię **druku termicznego bezpośredniego** – **nie wymaga taśmy barwiącej (ribbonu)**. Drukarka wyposażona jest w zaawansowany interfejs użytkownika z 5 wskaźnikami LED i 3 przyciskami.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **56 mm** (2,20 cala) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Pamięć wewnętrzna | min. 512 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- USB Host (standard)
- RS-232 Serial – opcja fabryczna lub rozbudowa
- Ethernet 10/100 (RJ-45) – opcja fabryczna lub rozbudowa
- Wi-Fi 802.11ac/ax + Bluetooth 4.2/5.3 – opcja fabryczna lub rozbudowa

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Zaawansowany interfejs – 3 przyciski i 5 wskaźników LED
- Platforma **Link-OS** z aplikacjami mobilnymi
- **NFC Print Touch** do parowania z urządzeniami mobilnymi
- Obsługa języków ZPL i EPL
- Opcjonalna bateria z podstawą
- Opcjonalny obcinacz lub dispenser etykiet
- **Brak konieczności ładowania ribbonu**

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD411d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

> **WAŻNE:** Drukarka ZD411d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety z nacięciem (notch)** – materiały z wycięciami
- **Materiał linerless** – etykiety bez podkładu

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające (po obu stronach) ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym (platen roller)
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik na spodzie materiału
   - Dla etykiet z nacięciem: ustaw czujnik nad nacięciem
6. **Zamknij pokrywę** – dociśnij przód drukarki aż oba zatrzaski zablokują się

> **Wskazówka:** Jeśli drukarka nie jest używana, zaleca się pozostawienie etykiety zakrywającej wałek napędowy, aby zapobiec przywieraniu głowicy.

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania i LED',
        content: `
Drukarka ZD411d posiada zaawansowany interfejs z **3 przyciskami** i **5 wskaźnikami LED**:

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie, tryb oszczędzania energii |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw etykiety / funkcje specjalne |
| **CANCEL** | Anulowanie zadania druku |

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety) |
| **NETWORK** | Stan połączenia sieciowego |

### Znaczenie kolorów

| Kolor | Znaczenie |
|-------|-----------|
| Zielony | Gotowy / działa prawidłowo |
| Pomarańczowy | Zajęty / przetwarzanie |
| Czerwony | Wymaga uwagi / błąd |
| Wygaszony | Nie wymaga uwagi |

### Typowe wzorce wskaźników

| Wzorzec | Znaczenie |
|---------|-----------|
| STATUS zielony | Drukarka gotowa do pracy |
| PAUSE pomarańczowy | Drukarka wstrzymana |
| STATUS + SUPPLIES czerwone | Brak materiału |
| DATA zielony (mruga) | Trwa komunikacja/transfer danych |
| STATUS czerwony | Otwarta pokrywa |

### Tryb oszczędzania energii (Energy Star)

Krótkie naciśnięcie **POWER** (gdy drukarka jest włączona) wprowadza drukarkę w tryb niskiego poboru mocy. Wskaźnik STATUS powoli pulsuje.
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski gdy wskaźniki zaczną migać
4. Drukarka wysunie kilka etykiet i automatycznie wykalibruje czujniki
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
3. Drukarka wydrukuje raport konfiguracji
4. Sprawdź ustawienia: **PRINT METHOD** (powinno być **DIRECT THERMAL**), **PRINT WIDTH**, **LABEL LENGTH**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Włącz drukarkę gdy kreator instalacji o to poprosi
5. Windows automatycznie wykryje i skonfiguruje drukarkę

> **Uwaga:** Jeśli podłączyłeś drukarkę przed instalacją sterowników, może pojawić się jako "nieznane urządzenie". Odłącz USB, zainstaluj sterowniki, podłącz ponownie.

### Połączenie Ethernet (LAN)

Jeśli drukarka ma moduł Ethernet:

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Sprawdź wskaźnik **NETWORK**:
   - Zielony = połączenie 100 Mbps
   - Pomarańczowy = połączenie 10 Mbps
   - Mrugający = aktywność sieciowa
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić adres IP

### Połączenie Wi-Fi

Jeśli drukarka ma moduł Wi-Fi:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Włącz drukarkę
4. Użyj funkcji **Print Touch (NFC)** – przyłóż telefon do logo Zebra na drukarce
5. Lub wyszukaj drukarkę przez Bluetooth w aplikacji
6. Skonfiguruj połączenie Wi-Fi przez kreatora w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Połączenie RS-232 (Serial)

Jeśli drukarka ma port szeregowy:

- Domyślne ustawienia: **9600 baud, 8 bitów, brak parzystości, 1 bit stopu, XON/XOFF**
- Użyj kabla null-modem (cross-over) z wtyczką DB-9
`
      },
      {
        title: '7. Funkcje dodatkowe',
        content: `
### Zebra Print Touch (NFC)

Drukarka wyposażona jest w znacznik **NFC** umożliwiający:
- Szybkie parowanie Bluetooth z telefonem/tabletem
- Uruchomienie aplikacji konfiguracyjnej
- Dostęp do strony pomocy technicznej

Aby użyć: przyłóż urządzenie NFC do logo **Zebra Print Touch** na obudowie drukarki.

### Opcja baterii

Drukarka może pracować z opcjonalną baterią w podstawie:
- Czas ładowania: ok. 2 godziny (od 0 do 100%)
- Bateria zaczyna ładowanie gdy poziom spadnie poniżej 90%
- Tryb UPS – bateria automatycznie przejmuje zasilanie przy utracie prądu
- 4 wskaźniki LED pokazują poziom naładowania
- Przycisk kontrolny do sprawdzania stanu baterii

### Opcja obcinacza (Cutter)

Automatycznie odcina etykiety po wydrukowaniu. Nie wymaga konserwacji użytkownika.

> **Ostrzeżenie:** Nie wkładaj palców ani przedmiotów do mechanizmu obcinacza!

### Opcja dispensera (Label Dispenser)

Automatycznie odkleja etykietę od podkładu i prezentuje do pobrania. Czujnik wykrywa pobranie etykiety przed wydrukowaniem następnej.

### Druk na materiale składanym (fanfold)

Drukarka obsługuje materiał składankowy przez szczelinę z tyłu obudowy:
1. Usuń materiał rolkowy z drukarki
2. Otwórz pokrywę
3. Ustaw prowadnice na szerokość materiału składanego
4. Wprowadź materiał przez tylną szczelinę
5. Zamknij pokrywę
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

> **Uwaga:** Nie używaj sprężarki powietrza – może wprowadzić zanieczyszczenia.

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie. Uwaga na wyładowania elektrostatyczne (ESD).

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj ok. **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie wałka napędowego (Platen Roller)

1. Obróć wałek ręcznie i przetrzyj go ściereczką nasączoną alkoholem
2. Nie używaj ostrych przedmiotów
3. W razie uszkodzenia lub zużycia – wymień wałek

### Zegar czasu rzeczywistego (RTC)

Drukarka posiada wbudowany zegar z baterią o żywotności ok. 10 lat. Bateria nie jest wymienialna przez użytkownika – w razie potrzeby [skontaktuj się z serwisem](/kontakt).
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS – czerwony

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj SmartCal |

### Wskaźnik SUPPLIES – czerwony

| Problem | Rozwiązanie |
|---------|-------------|
| Koniec materiału | Załaduj nową rolkę |
| Brakująca etykieta | Przewiń materiał za brakującą etykietę, naciśnij FEED |

### Wskaźnik PAUSE – pomarańczowy

Drukarka jest wstrzymana. Naciśnij **PAUSE** aby wznowić drukowanie.

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Problemy z siecią

| Wskaźnik NETWORK | Rozwiązanie |
|------------------|-------------|
| Nie świeci | Sprawdź kabel / brak połączenia |
| Czerwony (mruga) | Błąd połączenia – sprawdź ustawienia |
| Pomarańczowy (mruga) | Trwa uwierzytelnianie Wi-Fi |
| Zielony (mruga) | Słaby sygnał Wi-Fi – przesuń drukarkę |

### Błąd obcinacza (Cut Error)

1. Wyłącz drukarkę (przytrzymaj POWER 5 sekund)
2. Poczekaj na pełne wyłączenie
3. Włącz drukarkę ponownie
4. Jeśli błąd się powtarza – [skontaktuj się z serwisem](/kontakt)

### Przegrzanie głowicy

Drukarka automatycznie wstrzymuje druk do ostygnięcia. Upewnij się, że:
- Wokół drukarki jest odpowiednia wentylacja
- Temperatura otoczenia nie przekracza 41°C
- Drukarka nie jest wystawiona na bezpośrednie światło słoneczne

### Wymiana materiału podczas drukowania

Jeśli materiał skończy się podczas drukowania:
1. **Nie wyłączaj drukarki** – utracisz dane
2. Załaduj nową rolkę materiału
3. Naciśnij **FEED** aby zsynchronizować pozycję
4. Naciśnij **PAUSE** aby wznowić drukowanie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD411d 203 dpi | ZD411d 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Direct Thermal** | **Direct Thermal** |
| Szerokość druku | do **56 mm (2.20")** | do **56 mm (2.20")** |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **60 mm (2.36")** |
| Min szerokość | 15 mm (0.59") |
| Max długość | 991 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność

- USB 2.0 (standardowo)
- USB Host (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac/ax (opcja)
- Bluetooth 4.2/5.3 (opcja)
- RS-232 Serial (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD411 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czy drukarka Zebra ZD411d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD411d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych, które ciemnieją pod wpływem ciepła.

### Jak skalibrować drukarkę Zebra ZD411d?

**Odpowiedź:** Naciśnij i przytrzymaj **PAUSE + CANCEL** przez 2 sekundy. Drukarka wykona kalibrację SmartCal automatycznie.

### Jaka jest maksymalna szerokość etykiet w drukarce Zebra ZD411d?

**Odpowiedź:** Maksymalna szerokość druku Zebra ZD411d wynosi **56 mm (2,2 cala)**. To kompaktowa drukarka 2-calowa.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD411d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD411d wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi oraz **102 mm/s (4 cale/s)** dla wersji 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZD411d?

**Odpowiedź:** ZD411d wymaga **etykiet termoczułych (Direct Thermal)** o szerokości do 56 mm. Nie używaj zwykłych etykiet papierowych – nie będą się drukować.

### Dlaczego drukarka Zebra ZD411d drukuje blado?

**Odpowiedź:** Najczęstsze przyczyny: 1) Zbyt niska ciemność druku – zwiększ DARKNESS. 2) Zbyt wysoka prędkość – zmniejsz SPEED. 3) Brudna głowica – wyczyść alkoholem. 4) Zły typ etykiet – używaj etykiet termoczułych.

### Jak wyczyścić głowicę drukarki Zebra ZD411d?

**Odpowiedź:** Wyłącz drukarkę i otwórz pokrywę. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 5 rolek etykiet** lub przy problemach z jakością.

### Jaka jest różnica między ZD411d a ZD411t?

**Odpowiedź:** **ZD411d** = Direct Thermal (bez ribbonu, tańsze etykiety, mniej trwałe wydruki). **ZD411t** = Thermal Transfer (wymaga ribbonu, trwalsze wydruki). Obie są 2-calowe.
`
      }
    ]
  },

  'zd611d': {
    model: 'ZD611d',
    title: 'Zebra ZD611d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD611 Series User Guide',
    keywords: [
      'zebra zd611 instrukcja',
      'zd611 instrukcja po polsku',
      'zebra zd611 instrukcja po polsku',
      'zebra zd611d instrukcja',
      'zd611d instrukcja po polsku',
      'zebra zd611d manual',
      'drukarka zebra zd611d',
      'zebra zd611d kalibracja',
      'zd611d kalibracja smartcal',
      'zebra zd611d reset',
      'zd611d reset fabryczny',
      'zebra zd611d etykiety',
      'zd611d ładowanie etykiet',
      'zebra zd611d sterowniki',
      'zd611d instalacja',
      'zebra zd611d specyfikacja',
      'zd611d parametry techniczne',
      'zebra zd611d błędy',
      'zd611d media out',
      'zebra zd611d czyszczenie',
      'zd611d czyszczenie głowicy',
      'zebra zd611d ethernet',
      'zd611d wifi',
      'zd611d bluetooth',
      'zebra zd611d direct thermal',
      'zd611d termiczna bezpośrednia',
      'drukarka etykiet zebra zd611d',
      'zebra zd611d 203 dpi',
      'zebra zd611d 300 dpi',
      'zd611d prędkość druku',
      'zebra zd611d serwis',
      'zd611d naprawa',
      'instrukcja obsługi zebra zd611d',
      'zebra zd611d po polsku',
      'zd611d user guide polski',
      'zd611d 2 calowa',
      'zd611d 2 inch',
      'zd611d link-os',
      'zd611d nfc',
      'zd611d print touch',
      'drukarka 2 calowa zebra',
      'zd611d bateria',
      'zd611d obcinacz',
      'zd611d dispenser',
      'zd611d bez ribbonu',
      'zd611d etykiety termiczne',
      'zd611d healthcare',
      'zd611d medyczna',
      'zd611d premium',
      'zd611d opaski na nadgarstek'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD611d

Zebra ZD611d to kompaktowa **2-calowa** drukarka etykiet z serii **Link-OS Premium**. Wykorzystuje technologię **druku termicznego bezpośredniego** – **nie wymaga taśmy barwiącej (ribbonu)**. Jest to model premium z zaawansowanymi funkcjami, w tym **opcją Healthcare** do zastosowań medycznych.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **56 mm** (2,20 cala) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Pamięć wewnętrzna | min. 512 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- USB Host (standard)
- RS-232 Serial – opcja fabryczna lub rozbudowa
- Ethernet 10/100 (RJ-45) – opcja fabryczna lub rozbudowa
- Wi-Fi 802.11ac/ax + Bluetooth 4.2/5.3 – opcja fabryczna lub rozbudowa

### Cechy charakterystyczne modelu Premium

- **Opcja Healthcare** – obudowa odporna na środki dezynfekcyjne, zasilacz klasy medycznej
- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Zaawansowany interfejs – 3 przyciski i 5 wskaźników LED
- Platforma **Link-OS** z aplikacjami mobilnymi
- **NFC Print Touch** do parowania z urządzeniami mobilnymi
- Obsługa języków ZPL, EPL i CPCL
- Opcjonalna bateria z podstawą
- Opcjonalny obcinacz lub dispenser etykiet
- **Power Failure Recovery** (automatyczne uruchomienie po awarii zasilania)

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD611d
- Zasilacz sieciowy z kablem (medyczny dla wersji Healthcare)
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wentylację
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

> **WAŻNE:** Drukarka ZD611d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety z nacięciem (notch)** – materiały z wycięciami
- **Materiał linerless** – etykiety bez podkładu
- **Opaski na nadgarstek** – do zastosowań medycznych (wersja Healthcare)

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające (po obu stronach) ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym (platen roller)
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik na spodzie materiału
   - Dla etykiet z nacięciem: ustaw czujnik nad nacięciem
6. **Zamknij pokrywę** – dociśnij przód drukarki aż oba zatrzaski zablokują się

> **Wskazówka:** Jeśli drukarka nie jest używana, zaleca się pozostawienie etykiety zakrywającej wałek napędowy, aby zapobiec przywieraniu głowicy.

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania i LED',
        content: `
Drukarka ZD611d posiada zaawansowany interfejs z **3 przyciskami** i **5 wskaźnikami LED**:

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie, tryb oszczędzania energii |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw etykiety / funkcje specjalne |
| **CANCEL** | Anulowanie zadania druku |

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety) |
| **NETWORK** | Stan połączenia sieciowego |

### Znaczenie kolorów

| Kolor | Znaczenie |
|-------|-----------|
| Zielony | Gotowy / działa prawidłowo |
| Pomarańczowy | Zajęty / przetwarzanie |
| Czerwony | Wymaga uwagi / błąd |
| Wygaszony | Nie wymaga uwagi |

### Typowe wzorce wskaźników

| Wzorzec | Znaczenie |
|---------|-----------|
| STATUS zielony | Drukarka gotowa do pracy |
| STATUS pulsujący | Tryb oszczędzania energii (Energy Star) |
| PAUSE pomarańczowy | Drukarka wstrzymana |
| STATUS + SUPPLIES czerwone | Brak materiału |
| DATA zielony (mruga) | Trwa komunikacja/transfer danych |
| STATUS czerwony | Otwarta pokrywa |

### Power Failure Recovery Mode

Drukarki z zainstalowanym modułem łączności mogą **automatycznie uruchamiać się** po przywróceniu zasilania. Funkcja aktywowana jest zworką na module.
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**
3. Zwolnij przyciski gdy wskaźniki zaczną migać
4. Drukarka wysunie kilka etykiet i automatycznie wykalibruje czujniki
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

> **Uwaga:** Po początkowej kalibracji nie trzeba kalibrować przy każdej wymianie rolki tego samego typu. Wystarczy nacisnąć FEED raz lub dwa razy.

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**
3. Drukarka wydrukuje raport konfiguracji
4. Sprawdź ustawienia: **PRINT METHOD** (powinno być **DIRECT THERMAL**), **PRINT WIDTH**, **LABEL LENGTH**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Włącz drukarkę gdy kreator instalacji o to poprosi
5. Windows automatycznie wykryje i skonfiguruje drukarkę

> **Uwaga:** Jeśli podłączyłeś drukarkę przed instalacją sterowników, może pojawić się jako "nieznane urządzenie". Odłącz USB, zainstaluj sterowniki, podłącz ponownie.

### Połączenie Ethernet (LAN)

Jeśli drukarka ma moduł Ethernet:

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Sprawdź wskaźnik **NETWORK**:
   - Zielony = połączenie 100 Mbps
   - Pomarańczowy = połączenie 10 Mbps
   - Mrugający = aktywność sieciowa
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić adres IP

### Połączenie Wi-Fi

Jeśli drukarka ma moduł Wi-Fi:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Włącz drukarkę
4. Użyj funkcji **Print Touch (NFC)** – przyłóż telefon do logo Zebra na drukarce
5. Lub wyszukaj drukarkę przez Bluetooth w aplikacji
6. Skonfiguruj połączenie Wi-Fi przez kreatora w aplikacji

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Połączenie RS-232 (Serial)

Jeśli drukarka ma port szeregowy:

- Domyślne ustawienia: **9600 baud, 8 bitów, brak parzystości, 1 bit stopu, XON/XOFF**
- Użyj kabla null-modem (cross-over) z wtyczką DB-9
`
      },
      {
        title: '7. Funkcje dodatkowe',
        content: `
### Zebra Print Touch (NFC)

Drukarka wyposażona jest w znacznik **NFC** zawierający:
- URL strony pomocy technicznej
- Adresy MAC (Bluetooth, Wi-Fi, Ethernet)
- Numer SKU i numer seryjny drukarki

Aby użyć: przyłóż urządzenie NFC do logo **Zebra Print Touch** na obudowie drukarki.

### Opcja Healthcare

Wersja Healthcare oferuje:
- Obudowę **odporną na środki dezynfekcyjne** stosowane w szpitalach
- **Zasilacz klasy medycznej**
- Możliwość druku **opasek na nadgarstek** pacjentów
- Zgodność z wymogami placówek medycznych

### Opcja baterii

Drukarka może pracować z opcjonalną baterią w podstawie:
- Czas ładowania: ok. 2 godziny (od 0 do 100%)
- Bateria zaczyna ładowanie gdy poziom spadnie poniżej 90%
- Tryb UPS – bateria automatycznie przejmuje zasilanie przy utracie prądu
- 4 wskaźniki LED pokazują poziom naładowania
- Przycisk kontrolny do sprawdzania stanu baterii

### Opcja obcinacza (Cutter)

Automatycznie odcina etykiety po wydrukowaniu. Nie wymaga konserwacji użytkownika.

> **Ostrzeżenie:** Nie wkładaj palców ani przedmiotów do mechanizmu obcinacza!

### Opcja dispensera (Label Dispenser)

Automatycznie odkleja etykietę od podkładu i prezentuje do pobrania. Czujnik wykrywa pobranie etykiety przed wydrukowaniem następnej.

### Tryby druku

| Tryb | Opis |
|------|------|
| **TEAR OFF** | Domyślny – ręczne odrywanie etykiet |
| **PEEL** | Z dispenserem – automatyczne odklejanie |
| **CUTTER** | Z obcinaczem – automatyczne cięcie |
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

> **Uwaga:** Nie używaj sprężarki powietrza – może wprowadzić zanieczyszczenia.

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie. Uwaga na wyładowania elektrostatyczne (ESD) – mogą uszkodzić elektronikę.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj ok. **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Zegar czasu rzeczywistego (RTC)

Drukarka posiada wbudowany zegar z baterią o żywotności ok. 10 lat. Bateria nie jest wymienialna przez użytkownika – w razie potrzeby [skontaktuj się z serwisem](/kontakt).
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS – czerwony

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj SmartCal |

### Wskaźnik SUPPLIES – czerwony

| Problem | Rozwiązanie |
|---------|-------------|
| Koniec materiału | Załaduj nową rolkę |
| Brakująca etykieta | Przewiń materiał za brakującą etykietę, naciśnij FEED |

### Wskaźnik PAUSE – pomarańczowy

Drukarka jest wstrzymana. Naciśnij **PAUSE** aby wznowić drukowanie.

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**
- Zwiększ ciemność druku w ustawieniach (Darkness)
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Problemy z siecią

| Wskaźnik NETWORK | Rozwiązanie |
|------------------|-------------|
| Nie świeci | Sprawdź kabel / brak połączenia |
| Czerwony (mruga) | Błąd połączenia – sprawdź ustawienia |
| Pomarańczowy (mruga) | Trwa uwierzytelnianie Wi-Fi |
| Zielony (mruga) | Słaby sygnał Wi-Fi – przesuń drukarkę |

### Błąd obcinacza (Cut Error)

1. Wyłącz drukarkę (przytrzymaj POWER 5 sekund)
2. Poczekaj na pełne wyłączenie
3. Włącz drukarkę ponownie
4. Jeśli błąd się powtarza – [skontaktuj się z serwisem](/kontakt)

### Przegrzanie głowicy (Printhead Over Temp)

Drukarka automatycznie wstrzymuje druk do ostygnięcia. Upewnij się, że:
- Wokół drukarki jest odpowiednia wentylacja
- Temperatura otoczenia nie przekracza 41°C

### Printhead Shutdown

Głowica przegrzała się krytycznie. Wyłącz drukarkę, poczekaj kilka minut na ostygnięcie, włącz ponownie.

### Wymiana materiału podczas drukowania

Jeśli materiał skończy się podczas drukowania:
1. **Nie wyłączaj drukarki** – utracisz dane
2. Załaduj nową rolkę materiału
3. Naciśnij **FEED** aby zsynchronizować pozycję
4. Naciśnij **PAUSE** aby wznowić drukowanie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD611d 203 dpi | ZD611d 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Direct Thermal** | **Direct Thermal** |
| Szerokość druku | do **56 mm (2.20")** | do **56 mm (2.20")** |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **60 mm (2.36")** |
| Min szerokość | 15 mm (0.59") |
| Max długość | 991 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność

- USB 2.0 (standardowo)
- USB Host (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac/ax (opcja)
- Bluetooth 4.2/5.3 (opcja)
- RS-232 Serial (opcja)

### Różnice ZD611d vs ZD411d

| Cecha | ZD411d | ZD611d |
|-------|--------|--------|
| Seria | Link-OS | **Link-OS Premium** |
| **Opcja Healthcare** | ❌ Brak | ✅ Dostępna |
| **Power Failure Recovery** | ❌ Brak | ✅ Tak |
| Języki programowania | ZPL, EPL | ZPL, EPL, **CPCL** |
| Opaski na nadgarstek | ❌ Brak | ✅ Healthcare |

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD611 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czy drukarka Zebra ZD611d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD611d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych. Dla wydruków z ribbonem wybierz model ZD611t.

### Jak skalibrować drukarkę Zebra ZD611d?

**Odpowiedź:** Przez wyświetlacz LCD: **MENU > Ustawienia > Kalibracja > SmartCal**. Lub naciśnij **PAUSE + CANCEL** przez 2 sekundy.

### Co to jest wyświetlacz LCD w drukarce Zebra ZD611d?

**Odpowiedź:** ZD611d ma kolorowy wyświetlacz LCD umożliwiający: pełną konfigurację bez komputera, podgląd komunikatów błędów, monitorowanie stanu materiałów, zmianę ustawień druku.

### Jaka jest maksymalna szerokość etykiet w drukarce Zebra ZD611d?

**Odpowiedź:** Maksymalna szerokość druku Zebra ZD611d wynosi **56 mm (2,2 cala)**. To zaawansowana drukarka 2-calowa z wyświetlaczem LCD.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD611d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD611d wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi oraz **152 mm/s (6 cali/s)** dla wersji 300 dpi. Jest **szybsza niż ZD411d**.

### Jaka jest różnica między ZD611d a ZD411d?

**Odpowiedź:** **ZD611d** ma: wyświetlacz LCD, szybszy druk (203 mm/s vs 152 mm/s), standardowy Ethernet. **ZD411d** jest prostsza i tańsza. Obie są 2-calowe Direct Thermal.

### Jak wykonać reset fabryczny drukarki Zebra ZD611d?

**Odpowiedź:** Przez LCD: **MENU > System > Reset fabryczny > Tak**. Lub przytrzymaj **FEED + CANCEL** podczas włączania.

### Dlaczego drukarka Zebra ZD611d drukuje blado?

**Odpowiedź:** Sprawdź ustawienia przez LCD: 1) Zwiększ DARKNESS. 2) Zmniejsz SPEED. 3) Wyczyść głowicę alkoholem. 4) Upewnij się, że używasz etykiet termoczułych (Direct Thermal).
`
      }
    ]
  },

  'zd611t': {
    model: 'ZD611t',
    title: 'Zebra ZD611t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD611 Series User Guide',
    keywords: [
      'zebra zd611 instrukcja',
      'zd611 instrukcja po polsku',
      'zebra zd611 instrukcja po polsku',
      'zebra zd611t instrukcja',
      'zd611t instrukcja po polsku',
      'zebra zd611t manual',
      'drukarka zebra zd611t',
      'zebra zd611t kalibracja',
      'zd611t kalibracja smartcal',
      'zebra zd611t reset',
      'zd611t reset fabryczny',
      'zebra zd611t etykiety',
      'zd611t ładowanie etykiet',
      'zebra zd611t sterowniki',
      'zd611t instalacja',
      'zebra zd611t specyfikacja',
      'zd611t parametry techniczne',
      'zebra zd611t błędy',
      'zd611t ribbon out',
      'zd611t media out',
      'zebra zd611t czyszczenie',
      'zd611t czyszczenie głowicy',
      'zebra zd611t ethernet',
      'zd611t wifi',
      'zd611t bluetooth',
      'zebra zd611t thermal transfer',
      'zd611t termotransferowa',
      'drukarka etykiet zebra zd611t',
      'zebra zd611t 203 dpi',
      'zebra zd611t 300 dpi',
      'zd611t prędkość druku',
      'zebra zd611t serwis',
      'zd611t naprawa',
      'instrukcja obsługi zebra zd611t',
      'zebra zd611t po polsku',
      'zd611t user guide polski',
      'zd611t 2 calowa',
      'zd611t 2 inch',
      'zd611t link-os premium',
      'zd611t nfc',
      'zd611t print touch',
      'drukarka 2 calowa zebra',
      'zd611t ribbon',
      'zd611t taśma barwiąca',
      'zd611t obcinacz',
      'zd611t dispenser',
      'zd611t healthcare',
      'zd611t medyczna',
      'zd611t wyświetlacz dotykowy',
      'zd611t lcd',
      'zd611t ekran dotykowy',
      'zd611t polski język'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD611t

Zebra ZD611t to kompaktowa **2-calowa** drukarka etykiet z serii **Link-OS Premium**. Wykorzystuje technologię **druku termotransferowego** – **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki. Model wyposażony jest w **kolorowy wyświetlacz dotykowy** do łatwej konfiguracji i obsługi. Dostępna jest również **opcja Healthcare** do zastosowań medycznych.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy / termiczny bezpośredni** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **56 mm** (2,20 cala) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | **74 m** |
| Pamięć wewnętrzna | min. 512 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- USB Host (standard)
- RS-232 Serial – opcja fabryczna lub rozbudowa
- Ethernet 10/100 (RJ-45) – opcja fabryczna lub rozbudowa
- Wi-Fi 802.11ac/ax + Bluetooth 4.2/5.3 – opcja fabryczna lub rozbudowa

### Cechy charakterystyczne modelu Premium

- **Kolorowy wyświetlacz dotykowy** – intuicyjny interfejs z menu w 19 językach (w tym **polskim**)
- **Opcja Healthcare** – obudowa odporna na środki dezynfekcyjne, zasilacz klasy medycznej
- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Platforma **Link-OS** z aplikacjami mobilnymi
- **NFC Print Touch** do parowania z urządzeniami mobilnymi
- Obsługa języków ZPL, EPL i CPCL
- **Druk autonomiczny** – bez podłączenia do komputera
- Opcjonalna bateria z podstawą
- Opcjonalny obcinacz lub dispenser etykiet

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD611t
- Zasilacz sieciowy z kablem (medyczny dla wersji Healthcare)
- Kabel USB
- **Pusta gilza do odbierania ribbonu**
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wentylację
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety z nacięciem (notch)** – materiały z wycięciami
- **Materiał linerless** – etykiety bez podkładu
- **Opaski na nadgarstek** – do zastosowań medycznych

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające (po obu stronach) ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej (transmissive)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik (reflective)
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie ribbonu',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą. Drukarka ZD611t obsługuje rolki ribbonu **74 m**.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie | Max prędkość |
|-------------|--------------|--------------|
| **Performance Wax** | Etykiety papierowe | 8 ips |
| **Premium Wax/Resin** | Etykiety papierowe powlekane | 6 ips |
| **Performance Resin** | Etykiety syntetyczne | 6 ips |
| **Premium Resin** | Etykiety foliowe i syntetyczne | 4 ips |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą
2. **Sprawdź nacięcia na gilzach** – ribbony Zebra mają nacięcia po lewej stronie gilzy
3. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu
4. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie
5. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej
6. **Usuń luz** – obróć górną gilzę (kierunek: góra do tyłu) aż ribbon będzie napięty
7. **Zamknij pokrywę** – dociśnij aż zatrzaśnie
8. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon

> 📘 **Marszczenie ribbonu?** Sprawdź sekcję rozwiązywania problemów poniżej.
`
      },
      {
        title: '5. Wyświetlacz dotykowy i panel sterowania',
        content: `
Drukarka ZD611t posiada **intuicyjny wyświetlacz dotykowy** z menu w 19 językach.

### Główne sekcje menu

| Menu | Funkcje |
|------|---------|
| **Print** (Druk) | Ciemność, prędkość, szerokość, typ materiału, kalibracja |
| **Connection** (Połączenie) | Ethernet, Wi-Fi, Bluetooth, RS-232 |
| **System** | Język, data/czas, reset, informacje o drukarce |
| **Storage** (Pamięć) | Zarządzanie plikami, formaty etykiet |

### Zmiana języka na polski

1. Na ekranie głównym dotknij **System**
2. Wybierz **Language** (Język)
3. Wybierz **Polski** z listy
4. Potwierdź wybór

### Przyciski fizyczne

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie, tryb oszczędzania energii |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw etykiety |
| **CANCEL** | Anulowanie zadania druku |

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

### Ustawienie trybu druku

Przez wyświetlacz dotykowy:
1. Dotknij **Print** > **Image** > **Print Type**
2. Wybierz:
   - **Thermal Transfer** – druk z ribbonem
   - **Direct Thermal** – druk bez ribbonu (materiały termoczułe)
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Przez wyświetlacz dotykowy

1. Dotknij **Print** > **Sensors** > **Manual Calibration**
2. Postępuj zgodnie z instrukcjami na ekranie

### Przez przyciski

1. Naciśnij i przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**
2. Drukarka automatycznie wykalibruje czujniki

### Druk testowy (raport konfiguracji)

**Przez wyświetlacz:**
1. Dotknij **System** > **Print: System Settings**
2. Drukarka wydrukuje raport konfiguracji

**Przez przyciski:**
1. Naciśnij i przytrzymaj **FEED + CANCEL** przez **2 sekundy**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki na komputerze
2. Podłącz kabel USB do drukarki
3. Windows automatycznie wykryje drukarkę

### Konfiguracja Ethernet przez wyświetlacz

1. Podłącz kabel sieciowy RJ-45
2. Dotknij **Connection** > **Wired**
3. Sprawdź **Wired IP Address** – adres przydzielony przez DHCP
4. Opcjonalnie ustaw statyczny IP:
   - Zmień **Wired IP Protocol** na **PERMANENT**
   - Wprowadź adres IP, maskę podsieci i bramę
   - Dotknij **Connection** > **Networks** > **Reset Network**

### Konfiguracja Wi-Fi przez wyświetlacz

1. Dotknij **Connection** > **WLAN**
2. Wprowadź **ESSID** (nazwę sieci Wi-Fi)
3. Ustaw **Security Type** i wprowadź hasło
4. Zmień **WLAN IP Protocol** na **DHCP** lub **PERMANENT**
5. Dotknij **Connection** > **Networks** > **Reset Network**

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### NFC Print Touch

Przyłóż telefon z włączonym NFC do logo **Zebra Print Touch** na obudowie drukarki, aby:
- Sparować przez Bluetooth
- Otworzyć aplikację konfiguracyjną
- Uzyskać dostęp do strony pomocy
`
      },
      {
        title: '8. Tryby druku i opcje',
        content: `
### Tryby druku (Collection Method)

| Tryb | Opis |
|------|------|
| **Tear Off** | Domyślny – ręczne odrywanie etykiet |
| **Peel Off** | Z dispenserem – automatyczne odklejanie |
| **Cutter** | Z obcinaczem – automatyczne cięcie |
| **Delayed Cut** | Cięcie po odebraniu poprzedniej etykiety |
| **Linerless Peel/Tear/Cut** | Dla materiałów bez podkładu |

**Ustawienie przez wyświetlacz:** **Print** > **Label Position** > **Collection Method**

### Regulacja pozycji wydruku

| Parametr | Opis | Zakres |
|----------|------|--------|
| **Tear Line Offset** | Pozycja odrywania | -120 do +120 |
| **Horizontal Label Offset** | Przesunięcie poziome | -9999 do 9999 |
| **Vertical Label Offset** | Przesunięcie pionowe | -120 do +120 |

### Opcja Healthcare

Wersja Healthcare oferuje:
- Obudowę **odporną na środki dezynfekcyjne** stosowane w szpitalach
- **Zasilacz klasy medycznej**
- Możliwość druku **opasek na nadgarstek** pacjentów
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek** materiału lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (99,7%)**
- Bezpyłowe ściereczki

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Uwaga na wyładowania elektrostatyczne (ESD).

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem z alkoholem (99,7%)
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj ok. **1 minuty** aż wyschnie

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Aktualizacja firmware

1. Dotknij **System** > **About** > **FW Version** aby sprawdzić wersję
2. Pobierz najnowszy firmware ze strony Zebra
3. Użyj Zebra Setup Utilities do aktualizacji
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Komunikaty na wyświetlaczu

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **Cover Open** | Zamknij pokrywę drukarki |
| **Media Out** | Załaduj nową rolkę etykiet |
| **Ribbon Out** | Załaduj nowy ribbon |
| **Printhead Over Temp** | Poczekaj na ostygnięcie |

### Wskaźnik SUPPLIES – czerwony

- Brak materiału lub ribbonu
- Ribbon załadowany w trybie Direct Thermal (wyjmij ribbon lub zmień tryb)

### Brak wydruku na etykiecie

- Sprawdź czy **tryb druku** odpowiada materiałowi (Thermal Transfer z ribbonem)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**
- Zwiększ ciemność druku w ustawieniach (Darkness)
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu

- Sprawdź **wyrównanie ribbonu** – ribbon powinien być wyśrodkowany
- **Usuń luz** z ribbonu – obróć górną gilzę
- **Zmniejsz ciemność** druku (Darkness)
- **Zmniejsz prędkość** druku

### Zniekształcony wydruk

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: '11. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD611t 203 dpi | ZD611t 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer / Direct Thermal** | **Thermal Transfer / Direct Thermal** |
| Szerokość druku | do **56 mm (2.20")** | do **56 mm (2.20")** |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **60 mm (2.36")** |
| Min szerokość | 15 mm (0.59") |
| Max długość | 991 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Ribbon (taśma termotransferowa)

| Parametr | Wartość |
|----------|---------|
| Max szerokość | 60 mm (2.36") |
| Długość rolki | **74 m** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Typ | CSO (carbon side out) |

### Łączność

- USB 2.0 (standardowo)
- USB Host (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac/ax (opcja)
- Bluetooth 4.2/5.3 (opcja)
- RS-232 Serial (opcja)

### Różnice ZD611t vs ZD611d

| Cecha | ZD611d | ZD611t |
|-------|--------|--------|
| Technologia druku | Direct Thermal tylko | **TT + DT** |
| **Ribbon** | ❌ Nie wymaga | ✅ **Wymaga (74m)** |
| **Wyświetlacz** | ❌ Brak | ✅ **Kolorowy dotykowy** |
| Druk autonomiczny | ❌ Nie | ✅ **Tak** |

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD611 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD611t?

**Odpowiedź:** Przez wyświetlacz LCD: **MENU > Ustawienia > Kalibracja > SmartCal**. Lub naciśnij **PAUSE + CANCEL** przez 2 sekundy.

### Jak załadować ribbon do drukarki Zebra ZD611t?

**Odpowiedź:** ZD611t to drukarka **2-calowa termotransferowa**. Załóż pustą gilzę na górny trzpień, rolkę ribbonu na dolny. Przeprowadź ribbon pod głowicą i naciągnij. Ribbon musi być szerszy niż etykiety.

### Co to jest wyświetlacz LCD w drukarce Zebra ZD611t?

**Odpowiedź:** ZD611t ma kolorowy wyświetlacz LCD umożliwiający: konfigurację bez komputera, podgląd błędów, monitorowanie materiałów i ribbonu, zmianę ustawień druku.

### Jaka jest maksymalna szerokość etykiet w drukarce Zebra ZD611t?

**Odpowiedź:** Maksymalna szerokość druku Zebra ZD611t wynosi **56 mm (2,2 cala)**. To zaawansowana drukarka 2-calowa termotransferowa.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD611t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD611t wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi oraz **152 mm/s (6 cali/s)** dla wersji 300 dpi.

### Czy drukarka Zebra ZD611t wymaga ribbonu?

**Odpowiedź:** **Tak.** ZD611t to drukarka **Thermal Transfer (termotransferowa)** – wymaga ribbonu. Zapewnia trwałe wydruki odporne na ścieranie i chemikalia.

### Jaka jest różnica między ZD611t a ZD411t?

**Odpowiedź:** **ZD611t** ma: wyświetlacz LCD, szybszy druk (203 mm/s vs 152 mm/s), standardowy Ethernet. **ZD411t** jest prostsza i tańsza. Obie są 2-calowe termotransferowe.

### Jak wykonać reset fabryczny drukarki Zebra ZD611t?

**Odpowiedź:** Przez LCD: **MENU > System > Reset fabryczny > Tak**. Lub przytrzymaj **FEED + CANCEL** podczas włączania drukarki.
`
      }
    ]
  },

  'zd611r': {
    model: 'ZD611R',
    title: 'Zebra ZD611R – Instrukcja obsługi po Polsku (RFID)',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD611 Series User Guide',
    keywords: [
      'zebra zd611r instrukcja',
      'zd611r instrukcja po polsku',
      'zebra zd611r manual',
      'drukarka zebra zd611r',
      'zebra zd611r rfid',
      'zd611r rfid instrukcja',
      'zebra zd611r kalibracja',
      'zd611r kalibracja rfid',
      'zd611r kalibracja smartcal',
      'zebra zd611r reset',
      'zd611r reset fabryczny',
      'zebra zd611r etykiety rfid',
      'zd611r ładowanie etykiet',
      'zebra zd611r sterowniki',
      'zd611r instalacja',
      'zebra zd611r specyfikacja',
      'zd611r parametry techniczne',
      'zebra zd611r błędy',
      'zd611r rfid error',
      'zd611r void tags',
      'zebra zd611r czyszczenie',
      'zd611r czyszczenie głowicy',
      'zd611r czyszczenie anteny',
      'zebra zd611r ethernet',
      'zd611r wifi',
      'zd611r bluetooth',
      'zebra zd611r thermal transfer',
      'zd611r termotransferowa',
      'drukarka rfid zebra zd611r',
      'zebra zd611r 203 dpi',
      'zebra zd611r 300 dpi',
      'zd611r prędkość druku',
      'zebra zd611r serwis',
      'zd611r naprawa',
      'instrukcja obsługi zebra zd611r',
      'zebra zd611r po polsku',
      'zd611r user guide polski',
      'zd611r 2 calowa rfid',
      'zd611r link-os premium',
      'zd611r nfc',
      'zd611r print touch',
      'drukarka 2 calowa rfid zebra',
      'zd611r ribbon',
      'zd611r taśma barwiąca',
      'zd611r adaptive encoding',
      'zd611r uhf',
      'zd611r epc gen 2',
      'zd611r programowanie tagów',
      'zd611r write power',
      'zd611r read power',
      'zd611r wyświetlacz dotykowy',
      'zd611r lcd',
      'zd611r healthcare'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD611R

Zebra ZD611R to kompaktowa **2-calowa drukarka etykiet RFID** z serii **Link-OS Premium**. Łączy technologię **druku termotransferowego** z **wbudowanym modułem RFID UHF** do kodowania tagów i etykiet inteligentnych. Model wyposażony jest w **kolorowy wyświetlacz dotykowy** oraz technologię **Adaptive Encoding** do automatycznej optymalizacji parametrów kodowania.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy / termiczny bezpośredni** |
| **Technologia RFID** | **UHF EPC Gen 2 V2, ISO/IEC 18000-63, RAIN RFID** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **203 mm/s** (8 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **56 mm** (2,20 cala) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Obsługiwane rolki ribbonu | **74 m** |
| Pamięć wewnętrzna | min. 512 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- USB Host (standard)
- RS-232 Serial – opcja
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11ac/ax + Bluetooth 4.2/5.3 – opcja

### Cechy charakterystyczne modelu RFID

- **Wbudowany moduł RFID UHF** – antena odczytu/zapisu wewnątrz drukarki
- **Adaptive Encoding Technology** – automatyczny dobór optymalnych parametrów kodowania
- **Obsługa serializacji chipów** – zgodność z wieloma producentami
- **Blokowanie pamięci użytkownika** – zgodność z ATA Spec2000 (block perma-lock)
- **Narzędzia monitorowania RFID** – śledzenie wydajności zadań
- **Kolorowy wyświetlacz dotykowy** – intuicyjny interfejs w 19 językach
- **Opcja Healthcare** – obudowa odporna na środki dezynfekcyjne
- Adaptery do rolek RFID w zestawie

> Więcej o drukarkach Zebra: [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD611R
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- **Adaptery do rolek materiałów RFID**
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wentylację
- **WAŻNE:** Unikaj źródeł zakłóceń RF (inne urządzenia RFID, silne pola elektromagnetyczne)
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
`
      },
      {
        title: '3. Ładowanie materiałów RFID',
        content: `
### Obsługiwane typy materiałów RFID

- **Etykiety RFID z przerwą (gap)** – etykiety z wbudowanym transponderem
- **Etykiety RFID z czarnym znacznikiem** – znacznik z tyłu materiału
- **Tagi RFID** – sztywne tagi do znakowania produktów
- **Opaski RFID na nadgarstek** – do zastosowań medycznych

> **WAŻNE:** Używaj materiałów RFID zgodnych z **UHF EPC Gen 2 V2**. Drukarka automatycznie wykrywa i kalibruje parametry dla różnych typów tagów.

### Procedura ładowania etykiet RFID

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet RFID** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami, **NAD KOPUŁKĄ ANTENY RFID**, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą: czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

### Lokalizacja anteny RFID

Wewnątrz drukarki znajduje się **kopułka anteny RFID** (oznaczona jako "RFID read/write antenna dome"). Materiał RFID **musi przechodzić nad tą anteną**, aby możliwe było kodowanie tagów.

> Problem z wykrywaniem etykiet? [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie ribbonu',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą. Drukarka ZD611R obsługuje rolki ribbonu **74 m**.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie | Max prędkość |
|-------------|--------------|--------------|
| **Performance Wax** | Etykiety papierowe | 8 ips |
| **Premium Wax/Resin** | Etykiety papierowe powlekane | 6 ips |
| **Performance Resin** | Etykiety syntetyczne | 6 ips |
| **Premium Resin** | Etykiety foliowe i syntetyczne | 4 ips |

### Procedura ładowania ribbonu

1. Załóż **pustą gilzę** na górny trzpień (odbiorczy)
2. Załóż **rolkę ribbonu** na dolny trzpień (podający)
3. **Przewlecz ribbon pod głowicą**
4. Przymocuj początek ribbonu do gilzy odbiorczej
5. **Usuń luz** obracając górną gilzę
6. **Zamknij pokrywę**
`
      },
      {
        title: '5. Wyświetlacz dotykowy i panel sterowania',
        content: `
### Główne sekcje menu

| Menu | Funkcje |
|------|---------|
| **Print** (Druk) | Ciemność, prędkość, szerokość, typ materiału, kalibracja |
| **Connection** (Połączenie) | Ethernet, Wi-Fi, Bluetooth, RS-232 |
| **RFID** | **Kalibracja RFID, moc odczytu/zapisu, test tagów, pozycja programowania** |
| **System** | Język, data/czas, reset, informacje o drukarce |
| **Storage** (Pamięć) | Zarządzanie plikami, formaty etykiet |

### Zmiana języka na polski

1. Dotknij **System** > **Language**
2. Wybierz **Polski**
3. Potwierdź

### Przyciski fizyczne

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw etykiety |
| **CANCEL** | Anulowanie zadania |

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów |
| **NETWORK** | Stan połączenia sieciowego |
`
      },
      {
        title: '6. Kalibracja materiału i RFID',
        content: `
### Kalibracja materiału (SmartCal)

**Przed kalibracją RFID** należy najpierw skalibrować czujniki materiału:

**Przez wyświetlacz:**
1. Dotknij **Print** > **Sensors** > **Manual Calibration**
2. Postępuj zgodnie z instrukcjami na ekranie

**Przez przyciski:**
- Przytrzymaj **PAUSE + CANCEL** przez **2 sekundy**

> Szczegółowy poradnik: [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Kalibracja RFID (RFID Calibrate)

**Kalibracja RFID jest KLUCZOWA** dla prawidłowego kodowania tagów. Drukarka automatycznie znajduje optymalną pozycję programowania i moc sygnału.

#### Procedura kalibracji RFID:

1. Załaduj **etykiety RFID** do drukarki
2. Wykonaj standardową **kalibrację materiału** (SmartCal)
3. Zamknij głowicę i wysuń co najmniej jedną etykietę
4. Dotknij **RFID** > **RFID Calibrate**
5. Drukarka automatycznie:
   - Przesunie materiał
   - Znajdzie optymalną pozycję transpondera
   - Ustawi moc odczytu i zapisu
   - Wybierze odpowiedni element anteny

> **WAŻNE:** Pozostaw kilka etykiet przed i za kalibrowaną etykietą. Pozwoli to drukarce określić ustawienia, które nie zakodują sąsiednich tagów.
`
      },
      {
        title: '7. Ustawienia i obsługa RFID',
        content: `
### Parametry RFID

Dostęp przez wyświetlacz: **RFID** > [parametr]

| Parametr | Opis | Wartości |
|----------|------|----------|
| **Read Power** | Moc odczytu tagów | 0-30 |
| **Write Power** | Moc zapisu tagów | 0-30 |
| **RFID Antenna** | Wybór anteny | A1 (domyślnie) |
| **RFID Program Position** | Pozycja kodowania | F0-F999 lub B0-B30 |

### Pozycja programowania (Program Position)

- **F0 do Fxxx** – drukarka przesuwa etykietę **do przodu** o określoną odległość (w mm) przed kodowaniem
- **B0 do B30** – drukarka **cofa** etykietę o określoną odległość przed kodowaniem

### Test RFID (RFID Test)

Test pozwala sprawdzić odczyt i zapis tagu **bez przesuwania** materiału:

1. Umieść etykietę RFID z transponderem **nad anteną** (bez przesuwania)
2. Dotknij **RFID** > **RFID Test**
3. Dotknij **Start**
4. Wyświetli się wynik testu

### Odczyt danych RFID (Read RFID Data)

1. Umieść etykietę RFID nad anteną
2. Dotknij **RFID** > **Read RFID Data**
3. Dane z tagu zostaną wyświetlone na ekranie

### Liczniki RFID

| Licznik | Opis |
|---------|------|
| **RFID Valid Count** | Liczba **poprawnie** zakodowanych tagów |
| **RFID Void Count** | Liczba **uszkodzonych/nieudanych** tagów |

Resetowanie liczników: **RFID** > **RFID Valid Count** lub **RFID Void Count**
`
      },
      {
        title: '8. Programowanie RFID (ZPL)',
        content: `
### Podstawowe komendy RFID

| Komenda | Opis |
|---------|------|
| **^RFW** | Zapis danych do tagu RFID |
| **^RFR** | Odczyt danych z tagu RFID |
| **^RS** | Ustawienia RFID (pozycja, moc, retry) |
| **^RW** | Moc odczytu/zapisu i wybór anteny |
| **^HR** | Kalibracja tagu RFID |
| **~RO** | Reset liczników RFID |
| **^RF** | Odczyt i zwrot danych tagu |

### Przykład etykiety RFID (ZPL)

    ^XA
    ^RS8,0,0,0,0,1,0^RFW,H,1,8,1^FD1234ABCD^FS
    ^FO50,50^A0N,50,50^FDProdukt RFID^FS
    ^XZ

### Obsługiwane typy pamięci tagów

- **EPC** – Electronic Product Code (główny identyfikator)
- **TID** – Tag Identifier (unikalny identyfikator chipu, tylko odczyt)
- **User Memory** – pamięć użytkownika (do zapisu własnych danych)

### Obsługiwane operacje

- Zapis EPC
- Odczyt EPC
- Zapis User Memory
- Odczyt User Memory
- Odczyt TID
- Blokowanie pamięci (lock)
- **Permanentne blokowanie** (perma-lock) zgodne z ATA Spec2000
`
      },
      {
        title: '9. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> Poradnik: [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki na komputerze
2. Podłącz kabel USB do drukarki
3. Windows automatycznie wykryje drukarkę

### Konfiguracja Ethernet przez wyświetlacz

1. Podłącz kabel sieciowy RJ-45
2. Dotknij **Connection** > **Wired**
3. Sprawdź **Wired IP Address** – adres przydzielony przez DHCP

### Konfiguracja Wi-Fi przez wyświetlacz

1. Dotknij **Connection** > **WLAN**
2. Wprowadź **ESSID** (nazwę sieci Wi-Fi)
3. Ustaw **Security Type** i wprowadź hasło
4. Dotknij **Connection** > **Networks** > **Reset Network**

> Problem z WiFi? [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)
`
      },
      {
        title: '10. Konserwacja i czyszczenie',
        content: `
> Szczegółowy poradnik: [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek** materiału |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| **Antena RFID** | W razie problemów z kodowaniem |

### Czyszczenie głowicy drukującej

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem z **alkoholem (99,7%)**
4. **Czyść od środka ku krawędziom**
5. Poczekaj aż wyschnie

### Czyszczenie anteny RFID

> **OSTROŻNIE:** Nie uszkodź kopułki anteny RFID wewnątrz drukarki!

1. Wyłącz drukarkę
2. Delikatnie przetrzyj kopułkę anteny **miękką, suchą ściereczką**
3. W razie potrzeby użyj ściereczki lekko zwilżonej alkoholem izopropylowym
4. Poczekaj aż wyschnie

> Kiedy wymienić głowicę? [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)
`
      },
      {
        title: '11. Rozwiązywanie problemów RFID',
        content: `
> Przeczytaj więcej: [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Komunikaty RFID na wyświetlaczu

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **RFID Error** | Wykonaj kalibrację RFID, sprawdź materiał |
| **RFID Write Fail** | Zwiększ Write Power, sprawdź pozycję programowania |
| **RFID Read Fail** | Zwiększ Read Power, sprawdź materiał |

### Problemy z kodowaniem RFID

| Problem | Możliwe przyczyny | Rozwiązanie |
|---------|-------------------|-------------|
| **Wysoki void rate** | Zbyt niska moc zapisu | Zwiększ **Write Power** |
| | Nieprawidłowa pozycja | Wykonaj **kalibrację RFID** |
| | Uszkodzone tagi | Sprawdź partię materiału |
| **Kodowanie sąsiednich tagów** | Zbyt wysoka moc | Zmniejsz **Write Power** |
| | Nieprawidłowa pozycja | Dostosuj **Program Position** |
| **Niestabilne kodowanie** | Zakłócenia RF | Przesuń drukarkę od źródeł zakłóceń |
| | Brudna antena | Wyczyść **antenę RFID** |

### Optymalizacja parametrów RFID

1. **Zawsze rozpocznij od kalibracji RFID** – drukarka automatycznie dobierze optymalne parametry
2. Jeśli void rate jest wysoki, zwiększaj **Write Power** o 1-2 stopnie
3. Jeśli kodowane są sąsiednie tagi, **zmniejsz moc** lub dostosuj pozycję
4. Dla materiałów z małymi tagami może być konieczne precyzyjne ustawienie **Program Position**

### Wskaźnik SUPPLIES – czerwony

- Brak materiału lub ribbonu
- Ribbon załadowany w trybie Direct Thermal (wyjmij ribbon lub zmień tryb)

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: '12. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZD611R 203 dpi | ZD611R 300 dpi |
|----------|----------------|----------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **203 mm/s (8 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer / Direct Thermal** | **Thermal Transfer / Direct Thermal** |
| Szerokość druku | do **56 mm (2.20")** | do **56 mm (2.20")** |

### Media (etykiety RFID)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **60 mm (2.36")** |
| Min szerokość | 15 mm (0.59") |
| **Max średnica rolki** | **127 mm (5.0")** |

### Specyfikacja RFID

| Parametr | Wartość |
|----------|---------|
| **Protokoły** | UHF EPC Gen 2 V2, ISO/IEC 18000-63, RAIN RFID |
| **Adaptive Encoding** | Tak |
| **Antena** | Wbudowana |
| **Blokowanie pamięci** | Tak (w tym perma-lock ATA Spec2000) |

### Ribbon (taśma termotransferowa)

| Parametr | Wartość |
|----------|---------|
| Max szerokość | 60 mm (2.36") |
| Długość rolki | **74 m** |
| Typ | CSO (carbon side out) |

### Łączność

- USB 2.0 (standardowo)
- USB Host (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac/ax (opcja)
- Bluetooth 4.2/5.3 (opcja)
- RS-232 Serial (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD611 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka RFID Zebra ZD611R?

**Odpowiedź:** Zebra ZD611R to kompaktowa **2-calowa** drukarka termotransferowa z wbudowanym enkoderem RFID UHF. Jednocześnie drukuje etykiety i programuje chipy RFID. Obsługuje standardy EPC Gen 2.

### Jak skalibrować drukarkę RFID Zebra ZD611R?

**Odpowiedź:** Przez LCD: **MENU > Ustawienia > Kalibracja > SmartCal** dla druku. Dla RFID: **MENU > RFID > CALIBRATE**. Drukarka wykryje pozycję transpondera automatycznie.

### Jakie etykiety RFID pasują do drukarki Zebra ZD611R?

**Odpowiedź:** ZD611R obsługuje etykiety RFID UHF o szerokości do **56 mm (2,2 cala)** z transponderami EPC Gen 2. Idealne do bransoletek RFID, małych etykiet i oznaczeń.

### Co oznacza błąd RFID ERROR na drukarce Zebra ZD611R?

**Odpowiedź:** Problem z enkodowaniem chipa. Przyczyny: 1) Uszkodzony transponder. 2) Nieprawidłowa pozycja chipa – wykonaj kalibrację RFID. 3) Zbyt słaby sygnał – sprawdź moc anteny.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD611R?

**Odpowiedź:** Maksymalna prędkość druku ZD611R wynosi **203 mm/s (8 cali/s)** dla wersji 203 dpi. Prędkość może być ograniczona przy enkodowaniu RFID.

### Jaka jest różnica między ZD611R a ZD621R?

**Odpowiedź:** **ZD611R** to drukarka **2-calowa** (max 56 mm), **ZD621R** to drukarka **4-calowa** (max 118 mm). Obie mają enkoder RFID UHF i wyświetlacz LCD.

### Czy Zebra ZD611R może drukować bez RFID?

**Odpowiedź:** **Tak.** Drukarka może pracować jako standardowa drukarka termotransferowa. Wystarczy użyć zwykłych etykiet bez transpondera RFID.

### Jak zaprogramować etykietę RFID na drukarce Zebra ZD611R?

**Odpowiedź:** Użyj komend ZPL: **^RF** do zapisu danych, **^RS** do konfiguracji RFID. Lub użyj oprogramowania ZebraDesigner z obsługą RFID.
`
      }
    ]
  },

  'zd220d': {
    model: 'ZD220d',
    title: 'Zebra ZD220d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd220 instrukcja',
      'zd220 instrukcja po polsku',
      'zebra zd220 instrukcja po polsku',
      'zebra zd220d instrukcja',
      'zd220d instrukcja po polsku',
      'zebra zd220d manual',
      'drukarka zebra zd220',
      'drukarka zebra zd220d',
      'zebra zd220d kalibracja',
      'zd220d kalibracja smartcal',
      'zebra zd220d reset',
      'zd220d reset fabryczny',
      'zebra zd220d etykiety',
      'zd220d ładowanie etykiet',
      'zebra zd220d sterowniki',
      'zd220d instalacja',
      'zebra zd220d specyfikacja',
      'zd220d parametry techniczne',
      'zebra zd220d błędy',
      'zd220d media out',
      'zebra zd220d czyszczenie',
      'zd220d czyszczenie głowicy',
      'zebra zd220d direct thermal',
      'zd220d termiczna bezpośrednia',
      'drukarka etykiet zebra zd220d',
      'zebra zd220d 203 dpi',
      'zd220d prędkość druku',
      'zebra zd220d serwis',
      'zd220d naprawa',
      'instrukcja obsługi zebra zd220d',
      'zebra zd220d po polsku',
      'zd220d user guide polski',
      'zd220d bez ribbonu',
      'zd220d etykiety termiczne',
      'drukarka termiczna zebra zd220d',
      'zd220d ekonomiczna',
      'zd220d usb',
      'zd220d tania drukarka etykiet',
      'zebra zd200 instrukcja'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD220d

Zebra ZD220d to kompaktowa, ekonomiczna drukarka etykiet z serii ZD200. Wykorzystuje technologię **druku termicznego bezpośredniego** – **nie wymaga taśmy barwiącej (ribbonu)**. Drukarka przeznaczona jest do podstawowych zastosowań etykietowania.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi |
| Prędkość druku | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Pamięć wewnętrzna | min. 50 MB |

### Złącza

- USB 2.0 (standard)

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Prosty interfejs – jeden przycisk FEED i wskaźnik LED
- Kompatybilność z językami ZPL i EPL
- Obsługa czcionek Unicode i TrueType

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD220d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
4. Zielona dioda na zasilaczu oznacza prawidłowe podłączenie
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków

> **WAŻNE:** Drukarka ZD220d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik na spodzie materiału
6. **Zamknij pokrywę** – dociśnij pokrywę aż do usłyszenia kliknięcia zatrzasków

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania i LED',
        content: `
Drukarka posiada minimalistyczny interfejs:

### Elementy sterowania

| Element | Funkcja |
|---------|---------|
| **Przycisk POWER** | Włączanie/wyłączanie drukarki |
| **Przycisk FEED** | Wysuw etykiety / funkcje specjalne |
| **Wskaźnik STATUS** | Informacja o stanie drukarki (LED trójkolorowy) |

### Wskaźnik STATUS – znaczenie kolorów

| Kolor | Stan | Znaczenie |
|-------|------|-----------|
| Zielony | Świeci | Drukarka gotowa |
| Zielony | Mruga | Komunikacja / przetwarzanie danych |
| Zielony | Podwójne mrugnięcie | Drukarka w trybie PAUSE |
| Czerwony | Mruga | Brak materiału / otwarta pokrywa / błąd |
| Pomarańczowy | Mruga | Przegrzanie – drukarka się chłodzi |
| Czerwony-Czerwony-Zielony | Mruga | Krytyczny błąd – wymagana interwencja |

### Włączanie drukarki

1. Upewnij się, że materiał jest załadowany
2. Naciśnij przycisk **POWER** (krótko, poniżej 2 sekund)
3. Wskaźnik STATUS zaświeci na pomarańczowo podczas uruchamiania
4. Po chwili wskaźnik zmieni się na zielony – drukarka gotowa

### Wyłączanie drukarki

Naciśnij i przytrzymaj przycisk **POWER** przez 4-9 sekund.
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj przycisk **FEED** przez **2 sekundy**
3. Wskaźnik STATUS mrugnięcie raz – kontynuuj trzymanie
4. Poczekaj na drugie i trzecie mrugnięcie, potem natychmiast zwolnij przycisk
5. Drukarka wysunie kilka etykiet i wykona kalibrację
6. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj **FEED** przez około 2 sekundy
3. Gdy wskaźnik STATUS mrugnięcie raz – natychmiast zwolnij przycisk
4. Drukarka wydrukuje raport konfiguracji

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki Zebra Setup Utilities na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Uruchom Zebra Setup Utilities
5. Włącz drukarkę gdy kreator instalacji o to poprosi
6. Postępuj zgodnie z instrukcjami na ekranie

> **Ważne:** Jeśli podłączyłeś drukarkę przed instalacją sterowników, odłącz kabel USB, zainstaluj sterowniki, a następnie podłącz ponownie.
`
      },
      {
        title: '7. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (90%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

> **Uwaga:** Nie używaj sprężarki powietrza – może wprowadzić zanieczyszczenia do drukarki.

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie czujników

1. Wyłącz drukarkę i otwórz pokrywę
2. Zlokalizuj ruchomy czujnik (pod ścieżką materiału)
3. **Nie czyść okienka czujnika** – czyść tylko kanał, w którym się przesuwa
4. Delikatnie przedmuchaj sprężonym powietrzem
5. Poczekaj aż wyschnie
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS mruga na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj kalibrację SmartCal |

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Drukarka nie reaguje na polecenia

1. Sprawdź połączenie kablowe USB
2. Sprawdź czy wskaźnik STATUS jest zielony
3. Zrestartuj drukarkę (wyłącz na 10 sekund i włącz ponownie)
4. Sprawdź kolejkę druku w systemie Windows

### Etykiety nie są wykrywane (ciągły wysuw)

- Sprawdź typ materiału w ustawieniach drukarki
- Ustaw czujnik w odpowiedniej pozycji dla typu materiału
- Wykonaj kalibrację SmartCal
- Wyczyść czujniki

### Wskaźnik mruga na pomarańczowo

Drukarka jest przegrzana – poczekaj aż ostygnie. Upewnij się, że wokół drukarki jest odpowiednia wentylacja.

### Zacięcie materiału

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał ponownie
`
      },
      {
        title: '9. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | Wartość |
|----------|---------|
| Rozdzielczość | 203 dpi (8 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** |
| Typ druku | **Direct Thermal** |
| Szerokość druku | do 104 mm (4") |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność

- USB 2.0 (standardowo)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD200 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czy drukarka Zebra ZD220d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD220d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych. To ekonomiczne rozwiązanie dla podstawowych zastosowań.

### Jak skalibrować drukarkę Zebra ZD220d?

**Odpowiedź:** Naciśnij i przytrzymaj przycisk **FEED** przez około 3 sekundy (aż dioda STATUS zamruga). Drukarka wykona auto-kalibrację.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD220d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD220d wynosi **102 mm/s (4 cale/s)**. To podstawowa drukarka z serii ZD200.

### Jakie etykiety pasują do drukarki Zebra ZD220d?

**Odpowiedź:** ZD220d obsługuje etykiety termiczne o szerokości do **104 mm (4 cale)** i średnicy rolki do **127 mm (5 cali)**. Wymagane są **etykiety termoczułe (Direct Thermal)**.

### Dlaczego drukarka Zebra ZD220d drukuje blado?

**Odpowiedź:** Najczęstsze przyczyny: 1) Zbyt niska ciemność – zwiększ DARKNESS przez Zebra Setup Utilities. 2) Zbyt wysoka prędkość. 3) Brudna głowica – wyczyść alkoholem. 4) Zły typ etykiet.

### Jak wyczyścić głowicę drukarki Zebra ZD220d?

**Odpowiedź:** Wyłącz drukarkę, otwórz pokrywę. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 5 rolek etykiet**.

### Jak wykonać reset fabryczny drukarki Zebra ZD220d?

**Odpowiedź:** Przytrzymaj przycisk **FEED** podczas włączania drukarki. Trzymaj aż dioda STATUS zamruga dwa razy. Drukarka przywróci ustawienia fabryczne.

### Jaka jest różnica między ZD220d a ZD230d?

**Odpowiedź:** **ZD230d** ma wyższą prędkość druku (152 mm/s vs 102 mm/s) i więcej opcji łączności. **ZD220d** to podstawowy model ekonomiczny. Obie są Direct Thermal 4-calowe.
`
      }
    ]
  },

  'zd220t': {
    model: 'ZD220t',
    title: 'Zebra ZD220t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd220 instrukcja',
      'zd220 instrukcja po polsku',
      'zebra zd220 instrukcja po polsku',
      'zebra zd220t instrukcja',
      'zd220t instrukcja po polsku',
      'zebra zd220t manual',
      'drukarka zebra zd220',
      'drukarka zebra zd220t',
      'zebra zd220t kalibracja',
      'zd220t kalibracja smartcal',
      'zebra zd220t reset',
      'zd220t reset fabryczny',
      'zebra zd220t ribbon',
      'zd220t zakładanie taśmy',
      'zebra zd220t etykiety',
      'zd220t ładowanie etykiet',
      'zebra zd220t sterowniki',
      'zd220t instalacja',
      'zebra zd220t specyfikacja',
      'zd220t parametry techniczne',
      'zebra zd220t błędy',
      'zd220t ribbon out',
      'zd220t media out',
      'zebra zd220t czyszczenie',
      'zd220t czyszczenie głowicy',
      'zebra zd220t thermal transfer',
      'zd220t termotransferowa',
      'drukarka etykiet zebra zd220t',
      'zebra zd220t 203 dpi',
      'zd220t prędkość druku',
      'zebra zd220t serwis',
      'zd220t naprawa',
      'instrukcja obsługi zebra zd220t',
      'zebra zd220t po polsku',
      'zd220t user guide polski',
      'zd220t ekonomiczna',
      'zd220t usb',
      'zd220t tania drukarka etykiet',
      'zebra zd200 instrukcja',
      'zd220t ribbon 74m',
      'zd220t ribbon 300m'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD220t

Zebra ZD220t to kompaktowa, ekonomiczna drukarka etykiet z serii ZD200. Wykorzystuje technologię **druku termotransferowego** – **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy (Thermal Transfer)** |
| Rozdzielczość | 203 dpi |
| Prędkość druku | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m i 300 m |
| Pamięć wewnętrzna | min. 50 MB |

### Złącza

- USB 2.0 (standard)

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Prosty interfejs – jeden przycisk FEED i wskaźnik LED
- Dwupojemnościowy system ribbonu (74 m i 300 m)
- Kompatybilność z językami ZPL i EPL

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD220t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m (dla ribbonów innych niż Zebra)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
4. Zielona dioda na zasilaczu oznacza prawidłowe podłączenie
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety papierowe, foliowe i syntetyczne**

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie |
|-------------|--------------|
| **Performance Wax** | Etykiety papierowe |
| **Premium Wax/Resin** | Etykiety papierowe powlekane |
| **Performance Resin** | Etykiety syntetyczne (maks. 6 ips) |
| **Premium Resin** | Etykiety foliowe i syntetyczne (maks. 4 ips) |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Sprawdź nacięcia na gilzach** – ribbony Zebra mają nacięcia po obu stronach gilzy

3. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

4. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

5. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej (użyj taśmy klejącej lub samoprzylepnego paska na ribbonie)

6. **Usuń luz** – obróć górną gilzę (kierunek: góra do tyłu) aż ribbon będzie napięty

7. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

8. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon
`
      },
      {
        title: '5. Panel sterowania i LED',
        content: `
Drukarka posiada minimalistyczny interfejs:

### Elementy sterowania

| Element | Funkcja |
|---------|---------|
| **Przycisk POWER** | Włączanie/wyłączanie drukarki |
| **Przycisk FEED** | Wysuw etykiety / funkcje specjalne |
| **Wskaźnik STATUS** | Informacja o stanie drukarki (LED trójkolorowy) |

### Wskaźnik STATUS – znaczenie kolorów

| Kolor | Stan | Znaczenie |
|-------|------|-----------|
| Zielony | Świeci | Drukarka gotowa |
| Zielony | Mruga | Komunikacja / przetwarzanie danych |
| Zielony | Podwójne mrugnięcie | Drukarka w trybie PAUSE |
| Czerwony | Mruga | Brak materiału / brak ribbonu / otwarta pokrywa |
| Pomarańczowy | Mruga | Przegrzanie – drukarka się chłodzi |
| Czerwony-Czerwony-Zielony | Mruga | Krytyczny błąd |

### Ustawienie trybu druku

Drukarka ZD220t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (domyślny)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Aby zmienić tryb, użyj komendy ZPL **^MT** lub sterownika drukarki.
Sprawdź ustawienie na raporcie konfiguracji – **PRINT METHOD** powinno wskazywać **THERMAL-TRANS**.
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału lub ribbonu **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj przycisk **FEED** przez **2 sekundy**
3. Wskaźnik STATUS mrugnięcie raz – kontynuuj trzymanie
4. Poczekaj na drugie i trzecie mrugnięcie, potem natychmiast zwolnij przycisk
5. Drukarka wysunie kilka etykiet i wykona kalibrację
6. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj **FEED** przez około 2 sekundy
3. Gdy wskaźnik STATUS mrugnięcie raz – natychmiast zwolnij przycisk
4. Drukarka wydrukuje raport konfiguracji
5. Sprawdź czy **PRINT METHOD = THERMAL-TRANS**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki Zebra Setup Utilities na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Uruchom Zebra Setup Utilities
5. Włącz drukarkę gdy kreator instalacji o to poprosi
6. Postępuj zgodnie z instrukcjami na ekranie

> **Ważne:** Jeśli podłączyłeś drukarkę przed instalacją sterowników, odłącz kabel USB, zainstaluj sterowniki, a następnie podłącz ponownie.
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (90%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon (jeśli jest załadowany)
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS mruga na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Brak ribbonu | Załaduj nowy ribbon lub sprawdź ładowanie |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj kalibrację SmartCal |

### Wykrywanie końca ribbonu

Drukarka automatycznie wykrywa srebrną folię odbijającą na końcu ribbonu Zebra i zatrzymuje druk. Wymień ribbon na nowy.

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku jest ustawiony na **THERMAL-TRANS**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu (smugi na wydruku)

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu (obróć gilzę odbiorczą)
- Sprawdź czy ribbon jest odpowiedni dla danego materiału
- Zmniejsz ciemność druku lub prędkość

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Zacięcie materiału lub ribbonu

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał/ribbon
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał i ribbon ponownie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | Wartość |
|----------|---------|
| Rozdzielczość | 203 dpi (8 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer** |
| Szerokość druku | do 104 mm (4") |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **110 mm (4.33")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | 74 m i 300 m |

### Łączność

- USB 2.0 (standardowo)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD200 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD220t?

**Odpowiedź:** Naciśnij i przytrzymaj przycisk **FEED** przez około 3 sekundy (aż dioda STATUS zamruga). Drukarka wykona auto-kalibrację.

### Jak załadować ribbon do drukarki Zebra ZD220t?

**Odpowiedź:** Otwórz pokrywę, załóż pustą gilzę na górny trzpień, rolkę ribbonu na dolny (odwijanie od spodu). Przeprowadź ribbon pod głowicą i przymocuj do gilzy. Naciągnij ribbon.

### Czy drukarka Zebra ZD220t wymaga ribbonu?

**Odpowiedź:** **Tak.** ZD220t to drukarka **Thermal Transfer (termotransferowa)** – wymaga ribbonu. Zapewnia trwalsze wydruki niż model ZD220d.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD220t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD220t wynosi **102 mm/s (4 cale/s)**. To podstawowa drukarka termotransferowa z serii ZD200.

### Jakie etykiety pasują do drukarki Zebra ZD220t?

**Odpowiedź:** ZD220t obsługuje etykiety o szerokości do **104 mm (4 cale)** i średnicy rolki do **127 mm (5 cali)**. Można używać etykiet papierowych, foliowych i syntetycznych z ribbonem.

### Dlaczego drukarka Zebra ZD220t nie drukuje?

**Odpowiedź:** Najczęstsze przyczyny: 1) Brak lub źle załadowany ribbon. 2) Tryb druku ustawiony na Direct Thermal. 3) Zbyt niska ciemność druku. 4) Brudna głowica.

### Jak wyczyścić głowicę drukarki Zebra ZD220t?

**Odpowiedź:** Wyłącz drukarkę, otwórz pokrywę, wyjmij ribbon. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 1 rolkę ribbonu**.

### Jaka jest różnica między ZD220t a ZD230t?

**Odpowiedź:** **ZD230t** ma wyższą prędkość druku (152 mm/s vs 102 mm/s) i więcej opcji łączności. **ZD220t** to podstawowy model ekonomiczny. Obie są Thermal Transfer 4-calowe.
`
      }
    ]
  },

  'zd230d': {
    model: 'ZD230d',
    title: 'Zebra ZD230d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd230 instrukcja',
      'zd230 instrukcja po polsku',
      'zebra zd230 instrukcja po polsku',
      'zebra zd230d instrukcja',
      'zd230d instrukcja po polsku',
      'zebra zd230d manual',
      'drukarka zebra zd230',
      'drukarka zebra zd230d',
      'zebra zd230d kalibracja',
      'zd230d kalibracja smartcal',
      'zebra zd230d reset',
      'zd230d reset fabryczny',
      'zebra zd230d etykiety',
      'zd230d ładowanie etykiet',
      'zebra zd230d sterowniki',
      'zd230d instalacja',
      'zebra zd230d specyfikacja',
      'zd230d parametry techniczne',
      'zebra zd230d błędy',
      'zd230d media out',
      'zebra zd230d czyszczenie',
      'zd230d czyszczenie głowicy',
      'zebra zd230d ethernet',
      'zd230d wifi',
      'zd230d bluetooth',
      'zebra zd230d direct thermal',
      'zd230d termiczna bezpośrednia',
      'drukarka etykiet zebra zd230d',
      'zebra zd230d 203 dpi',
      'zd230d prędkość druku',
      'zebra zd230d serwis',
      'zd230d naprawa',
      'instrukcja obsługi zebra zd230d',
      'zebra zd230d po polsku',
      'zd230d user guide polski',
      'zd230d bez ribbonu',
      'zd230d etykiety termiczne',
      'drukarka termiczna zebra zd230d',
      'zd230d sieciowa',
      'zebra zd200 instrukcja',
      'zd230d lan',
      'zd230d konfiguracja wifi'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD230d

Zebra ZD230d to kompaktowa drukarka etykiet z serii ZD200. Wykorzystuje technologię **druku termicznego bezpośredniego** – **nie wymaga taśmy barwiącej (ribbonu)**. W porównaniu do modelu ZD220d oferuje **dodatkowe opcje łączności sieciowej**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termiczny bezpośredni (Direct Thermal)** |
| Rozdzielczość | 203 dpi |
| Prędkość druku | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Pamięć wewnętrzna | min. 50 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- Ethernet 10/100 (RJ-45) – opcja fabryczna
- Wi-Fi 802.11ac (a/b/g/n) – opcja fabryczna
- Bluetooth Classic 4.x – opcja fabryczna

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Prosty interfejs – jeden przycisk FEED i wskaźnik LED
- Możliwość pracy w sieci przewodowej lub bezprzewodowej
- Kompatybilność z językami ZPL i EPL

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD230d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
4. Zielona dioda na zasilaczu oznacza prawidłowe podłączenie
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków

> **WAŻNE:** Drukarka ZD230d wymaga materiałów **termoczułych** (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Zamknij pokrywę** – dociśnij pokrywę aż do usłyszenia kliknięcia zatrzasków

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Panel sterowania i LED',
        content: `
Drukarka posiada minimalistyczny interfejs:

### Elementy sterowania

| Element | Funkcja |
|---------|---------|
| **Przycisk POWER** | Włączanie/wyłączanie drukarki |
| **Przycisk FEED** | Wysuw etykiety / funkcje specjalne |
| **Wskaźnik STATUS** | Informacja o stanie drukarki (LED trójkolorowy) |

### Wskaźnik STATUS – znaczenie kolorów

| Kolor | Stan | Znaczenie |
|-------|------|-----------|
| Zielony | Świeci | Drukarka gotowa |
| Zielony | Mruga | Komunikacja / przetwarzanie danych |
| Zielony | Podwójne mrugnięcie | Drukarka w trybie PAUSE |
| Czerwony | Mruga | Brak materiału / otwarta pokrywa / błąd |
| Pomarańczowy | Mruga | Przegrzanie – drukarka się chłodzi |

### Włączanie drukarki

1. Upewnij się, że materiał jest załadowany
2. Naciśnij przycisk **POWER** (krótko, poniżej 2 sekund)
3. Wskaźnik STATUS zaświeci na pomarańczowo podczas uruchamiania
4. Po chwili wskaźnik zmieni się na zielony – drukarka gotowa
`
      },
      {
        title: '5. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj przycisk **FEED** przez **2 sekundy**
3. Wskaźnik STATUS mrugnięcie raz – kontynuuj trzymanie
4. Poczekaj na drugie i trzecie mrugnięcie, potem natychmiast zwolnij przycisk
5. Drukarka wysunie kilka etykiet i wykona kalibrację
6. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj **FEED** przez około 2 sekundy
3. Gdy wskaźnik STATUS mrugnięcie raz – natychmiast zwolnij przycisk
4. Drukarka wydrukuje raport konfiguracji i raport sieciowy

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki Zebra Setup Utilities na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Uruchom Zebra Setup Utilities
5. Włącz drukarkę gdy kreator instalacji o to poprosi
6. Postępuj zgodnie z instrukcjami na ekranie

### Połączenie Ethernet (LAN)

Jeśli drukarka ma fabrycznie zainstalowany moduł Ethernet:

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy) do złącza z tyłu drukarki
2. Włącz drukarkę
3. Sprawdź diody LED przy złączu Ethernet:
   - Zielona = połączenie 100 Mbps
   - Pomarańczowa = połączenie 10 Mbps
   - Mrugająca = aktywność sieciowa
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

### Połączenie Wi-Fi

Jeśli drukarka ma fabrycznie zainstalowany moduł Wi-Fi:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet (Android lub iOS)
2. Włącz Bluetooth na urządzeniu mobilnym
3. Włącz drukarkę
4. W aplikacji wyszukaj drukarkę przez Bluetooth
5. Użyj kreatora w aplikacji, aby skonfigurować połączenie Wi-Fi
6. Wprowadź SSID i hasło sieci Wi-Fi
7. Po połączeniu wydrukuj raport konfiguracji, aby sprawdzić adres IP

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Połączenie Bluetooth

1. Włącz Bluetooth na komputerze lub urządzeniu mobilnym
2. Włącz drukarkę
3. Wyszukaj urządzenia Bluetooth – drukarka powinna być widoczna
4. Sparuj drukarkę z urządzeniem
5. Zainstaluj sterowniki i skonfiguruj drukarkę
`
      },
      {
        title: '7. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (90%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS mruga na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj kalibrację SmartCal |

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest **termoczuły** (direct thermal)
- Sprawdź czy materiał jest załadowany **stroną do druku w górę**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Problemy z siecią Ethernet

| Problem | Rozwiązanie |
|---------|-------------|
| Diody przy złączu nie świecą | Sprawdź kabel sieciowy |
| Brak adresu IP | Sprawdź ustawienia DHCP na serwerze |
| Drukarka niedostępna | Sprawdź adres IP na raporcie konfiguracji |

### Problemy z Wi-Fi

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia | Sprawdź SSID i hasło sieci |
| Słaby sygnał | Przesuń drukarkę bliżej routera |
| Drukarka niedostępna | Sprawdź adres IP na raporcie konfiguracji |

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Zacięcie materiału

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał ponownie
`
      },
      {
        title: '9. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | Wartość |
|----------|---------|
| Rozdzielczość | 203 dpi (8 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** |
| Typ druku | **Direct Thermal** |
| Szerokość druku | do 104 mm (4") |

### Media (etykiety termiczne)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Łączność (w zależności od konfiguracji)

- USB 2.0 (standardowo)
- Ethernet 10/100 (opcja)
- Wi-Fi 802.11ac (opcja)
- Bluetooth Classic 4.x (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD200 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czy drukarka Zebra ZD230d wymaga ribbonu?

**Odpowiedź:** **Nie.** Zebra ZD230d to drukarka **Direct Thermal (termiczna bezpośrednia)** – nie wymaga ribbonu. Używa etykiet termoczułych.

### Jak skalibrować drukarkę Zebra ZD230d?

**Odpowiedź:** Naciśnij i przytrzymaj przycisk **FEED** przez około 3 sekundy (aż dioda STATUS zamruga). Drukarka wykona auto-kalibrację.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD230d?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD230d wynosi **152 mm/s (6 cali/s)**. Jest **szybsza niż ZD220d** (102 mm/s).

### Jakie etykiety pasują do drukarki Zebra ZD230d?

**Odpowiedź:** ZD230d obsługuje etykiety termiczne o szerokości do **104 mm (4 cale)** i średnicy rolki do **127 mm (5 cali)**. Wymagane są **etykiety termoczułe**.

### Dlaczego drukarka Zebra ZD230d drukuje blado?

**Odpowiedź:** Najczęstsze przyczyny: 1) Zbyt niska ciemność – zwiększ DARKNESS. 2) Zbyt wysoka prędkość. 3) Brudna głowica – wyczyść alkoholem. 4) Zły typ etykiet – używaj tylko termoczułych.

### Jak wyczyścić głowicę drukarki Zebra ZD230d?

**Odpowiedź:** Wyłącz drukarkę, otwórz pokrywę. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 5 rolek etykiet**.

### Jaka jest różnica między ZD230d a ZD220d?

**Odpowiedź:** **ZD230d** ma wyższą prędkość druku (152 mm/s vs 102 mm/s) i więcej opcji łączności. **ZD220d** to podstawowy model ekonomiczny.

### Jak wykonać reset fabryczny drukarki Zebra ZD230d?

**Odpowiedź:** Przytrzymaj przycisk **FEED** podczas włączania drukarki. Trzymaj aż dioda STATUS zamruga dwa razy. Drukarka przywróci ustawienia fabryczne.
`
      }
    ]
  },

  'zd230t': {
    model: 'ZD230t',
    title: 'Zebra ZD230t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd230 instrukcja',
      'zd230 instrukcja po polsku',
      'zebra zd230 instrukcja po polsku',
      'zebra zd230t instrukcja',
      'zd230t instrukcja po polsku',
      'zebra zd230t manual',
      'drukarka zebra zd230',
      'drukarka zebra zd230t',
      'zebra zd230t kalibracja',
      'zd230t kalibracja smartcal',
      'zebra zd230t reset',
      'zd230t reset fabryczny',
      'zebra zd230t ribbon',
      'zd230t zakładanie taśmy',
      'zebra zd230t etykiety',
      'zd230t ładowanie etykiet',
      'zebra zd230t sterowniki',
      'zd230t instalacja',
      'zebra zd230t specyfikacja',
      'zd230t parametry techniczne',
      'zebra zd230t błędy',
      'zd230t ribbon out',
      'zd230t media out',
      'zebra zd230t czyszczenie',
      'zd230t czyszczenie głowicy',
      'zebra zd230t ethernet',
      'zd230t wifi',
      'zd230t bluetooth',
      'zebra zd230t thermal transfer',
      'zd230t termotransferowa',
      'drukarka etykiet zebra zd230t',
      'zebra zd230t 203 dpi',
      'zd230t prędkość druku',
      'zebra zd230t serwis',
      'zd230t naprawa',
      'instrukcja obsługi zebra zd230t',
      'zebra zd230t po polsku',
      'zd230t user guide polski',
      'zd230t sieciowa',
      'zebra zd200 instrukcja',
      'zd230t lan',
      'zd230t konfiguracja wifi',
      'zd230t ribbon 74m',
      'zd230t ribbon 300m'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZD230t

Zebra ZD230t to kompaktowa drukarka etykiet z serii ZD200. Wykorzystuje technologię **druku termotransferowego** – **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia. W porównaniu do modelu ZD220t oferuje **dodatkowe opcje łączności sieciowej**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy (Thermal Transfer)** |
| Rozdzielczość | 203 dpi |
| Prędkość druku | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4 cale) |
| Maks. średnica rolki | **127 mm** (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m i 300 m |
| Pamięć wewnętrzna | min. 50 MB |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- Ethernet 10/100 (RJ-45) – opcja fabryczna
- Wi-Fi 802.11ac (a/b/g/n) – opcja fabryczna
- Bluetooth Classic 4.x – opcja fabryczna

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Prosty interfejs – jeden przycisk FEED i wskaźnik LED
- Dwupojemnościowy system ribbonu (74 m i 300 m)
- Możliwość pracy w sieci przewodowej lub bezprzewodowej
- Kompatybilność z językami ZPL i EPL

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD230t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m (dla ribbonów innych niż Zebra)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na **płaskiej, stabilnej powierzchni**
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- **Unikaj** bezpośredniego światła słonecznego i źródeł ciepła
- Dla Wi-Fi: unikaj barier fizycznych między drukarką a routerem
- Zalecana temperatura pracy: **5°C – 41°C**

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
4. Zielona dioda na zasilaczu oznacza prawidłowe podłączenie
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety papierowe, foliowe i syntetyczne**

### Procedura ładowania

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi i unieś pokrywę
2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki
3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. **Strona do zadruku musi być skierowana w górę**
4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym
5. **Ustaw czujnik ruchomy**:
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik
6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

> 📘 **Problem z wykrywaniem etykiet?** [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie taśmy ribbon',
        content: `
> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę drukującą.

### Typy ribbonów Zebra

| Typ ribbonu | Zastosowanie |
|-------------|--------------|
| **Performance Wax** | Etykiety papierowe |
| **Premium Wax/Resin** | Etykiety papierowe powlekane |
| **Performance Resin** | Etykiety syntetyczne (maks. 6 ips) |
| **Premium Resin** | Etykiety foliowe i syntetyczne (maks. 4 ips) |

### Procedura ładowania ribbonu

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Sprawdź nacięcia na gilzach** – ribbony Zebra mają nacięcia po obu stronach gilzy

3. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

4. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

5. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej

6. **Usuń luz** – obróć górną gilzę (kierunek: góra do tyłu) aż ribbon będzie napięty

7. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

8. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon
`
      },
      {
        title: '5. Panel sterowania i LED',
        content: `
Drukarka posiada minimalistyczny interfejs:

### Elementy sterowania

| Element | Funkcja |
|---------|---------|
| **Przycisk POWER** | Włączanie/wyłączanie drukarki |
| **Przycisk FEED** | Wysuw etykiety / funkcje specjalne |
| **Wskaźnik STATUS** | Informacja o stanie drukarki (LED trójkolorowy) |

### Wskaźnik STATUS – znaczenie kolorów

| Kolor | Stan | Znaczenie |
|-------|------|-----------|
| Zielony | Świeci | Drukarka gotowa |
| Zielony | Mruga | Komunikacja / przetwarzanie danych |
| Zielony | Podwójne mrugnięcie | Drukarka w trybie PAUSE |
| Czerwony | Mruga | Brak materiału / brak ribbonu / otwarta pokrywa |
| Pomarańczowy | Mruga | Przegrzanie – drukarka się chłodzi |

### Ustawienie trybu druku

Drukarka ZD230t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (domyślny)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Aby zmienić tryb, użyj komendy ZPL **^MT** lub sterownika drukarki.
Sprawdź ustawienie na raporcie konfiguracji – **PRINT METHOD** powinno wskazywać **THERMAL-TRANS**.
`
      },
      {
        title: '6. Kalibracja SmartCal',
        content: `
Po załadowaniu nowego typu materiału lub ribbonu **wykonaj kalibrację**:

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Procedura

1. Upewnij się, że drukarka jest włączona i gotowa (**STATUS = zielony**)
2. Naciśnij i przytrzymaj przycisk **FEED** przez **2 sekundy**
3. Wskaźnik STATUS mrugnięcie raz – kontynuuj trzymanie
4. Poczekaj na drugie i trzecie mrugnięcie, potem natychmiast zwolnij przycisk
5. Drukarka wysunie kilka etykiet i wykona kalibrację
6. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj **FEED** przez około 2 sekundy
3. Gdy wskaźnik STATUS mrugnięcie raz – natychmiast zwolnij przycisk
4. Drukarka wydrukuje raport konfiguracji i raport sieciowy
5. Sprawdź czy **PRINT METHOD = THERMAL-TRANS**

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> 📘 **Poradnik:** [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki Zebra Setup Utilities na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Uruchom Zebra Setup Utilities
5. Włącz drukarkę gdy kreator instalacji o to poprosi
6. Postępuj zgodnie z instrukcjami na ekranie

### Połączenie Ethernet (LAN)

Jeśli drukarka ma fabrycznie zainstalowany moduł Ethernet:

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy) do złącza z tyłu drukarki
2. Włącz drukarkę
3. Sprawdź diody LED przy złączu Ethernet:
   - Zielona = połączenie 100 Mbps
   - Pomarańczowa = połączenie 10 Mbps
   - Mrugająca = aktywność sieciowa
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

### Połączenie Wi-Fi

Jeśli drukarka ma fabrycznie zainstalowany moduł Wi-Fi:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet (Android lub iOS)
2. Włącz Bluetooth na urządzeniu mobilnym
3. Włącz drukarkę
4. W aplikacji wyszukaj drukarkę przez Bluetooth
5. Użyj kreatora w aplikacji, aby skonfigurować połączenie Wi-Fi
6. Wprowadź SSID i hasło sieci Wi-Fi
7. Po połączeniu wydrukuj raport konfiguracji, aby sprawdzić adres IP

> 📘 **Problem z WiFi?** [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Połączenie Bluetooth

1. Włącz Bluetooth na komputerze lub urządzeniu mobilnym
2. Włącz drukarkę
3. Wyszukaj urządzenia Bluetooth – drukarka powinna być widoczna
4. Sparuj drukarkę z urządzeniem
5. Zainstaluj sterowniki i skonfiguruj drukarkę
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | **Co 5 rolek materiału** lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone **alkoholem izopropylowym (90%)**
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon (jeśli jest załadowany)
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. **Czyść od środka ku zewnętrznym krawędziom**
5. Poczekaj około **1 minuty** aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

> 📘 **Kiedy wymienić głowicę?** [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
> 📘 **Przeczytaj więcej:** [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Wskaźnik STATUS mruga na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Brak ribbonu | Załaduj nowy ribbon lub sprawdź ładowanie |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj kalibrację SmartCal |

### Wykrywanie końca ribbonu

Drukarka automatycznie wykrywa srebrną folię odbijającą na końcu ribbonu Zebra i zatrzymuje druk. Wymień ribbon na nowy.

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku jest ustawiony na **THERMAL-TRANS**
- Zwiększ ciemność druku w ustawieniach
- [Wyczyść głowicę drukującą](/blog/jak-wyczyscic-glowice-drukarki-zebra)

> 📘 **Blady wydruk?** [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Marszczenie ribbonu (smugi na wydruku)

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu (obróć gilzę odbiorczą)
- Sprawdź czy ribbon jest odpowiedni dla danego materiału
- Zmniejsz ciemność druku lub prędkość

### Problemy z siecią Ethernet

| Problem | Rozwiązanie |
|---------|-------------|
| Diody przy złączu nie świecą | Sprawdź kabel sieciowy |
| Brak adresu IP | Sprawdź ustawienia DHCP na serwerze |
| Drukarka niedostępna | Sprawdź adres IP na raporcie konfiguracji |

### Problemy z Wi-Fi

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia | Sprawdź SSID i hasło sieci |
| Słaby sygnał | Przesuń drukarkę bliżej routera |
| Drukarka niedostępna | Sprawdź adres IP na raporcie konfiguracji |

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj [kalibrację SmartCal](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Zacięcie materiału lub ribbonu

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał/ribbon
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał i ribbon ponownie
`
      },
      {
        title: '10. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | Wartość |
|----------|---------|
| Rozdzielczość | 203 dpi (8 dots/mm) |
| **Max prędkość druku** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer** |
| Szerokość druku | do 104 mm (4") |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **108 mm (4.25")** |
| Min szerokość | 15 mm |
| Max długość | 990 mm (39") |
| **Max średnica rolki** | **127 mm (5.0")** |
| Rdzeń wewnętrzny | 12.7 mm (0.5") lub 25.4 mm (1") |

### Taśma Ribbon

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **110 mm (4.33")** |
| Min szerokość | 33 mm (1.3") |
| Rdzeń wewnętrzny | 12.7 mm (0.5") |
| Obsługiwane rolki | 74 m i 300 m |

### Łączność (w zależności od konfiguracji)

- USB 2.0 (standardowo)
- Ethernet 10/100 (opcja)
- Wi-Fi 802.11ac (opcja)
- Bluetooth Classic 4.x (opcja)

### Środowisko pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 5°C - 41°C |
| Wilgotność | 10% - 90% (bez kondensacji) |

> 🔧 **Potrzebujesz pomocy?** [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZD200 Series User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak skalibrować drukarkę Zebra ZD230t?

**Odpowiedź:** Naciśnij i przytrzymaj przycisk **FEED** przez około 3 sekundy (aż dioda STATUS zamruga). Drukarka wykona auto-kalibrację.

### Jak załadować ribbon do drukarki Zebra ZD230t?

**Odpowiedź:** Otwórz pokrywę, załóż pustą gilzę na górny trzpień, rolkę ribbonu na dolny (odwijanie od spodu). Przeprowadź ribbon pod głowicą i przymocuj do gilzy. Naciągnij ribbon.

### Czy drukarka Zebra ZD230t wymaga ribbonu?

**Odpowiedź:** **Tak.** ZD230t to drukarka **Thermal Transfer (termotransferowa)** – wymaga ribbonu. Zapewnia trwałe wydruki odporne na ścieranie.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZD230t?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZD230t wynosi **152 mm/s (6 cali/s)**. Jest **szybsza niż ZD220t** (102 mm/s).

### Jakie etykiety pasują do drukarki Zebra ZD230t?

**Odpowiedź:** ZD230t obsługuje etykiety o szerokości do **104 mm (4 cale)** i średnicy rolki do **127 mm (5 cali)**. Można używać etykiet papierowych, foliowych i syntetycznych z ribbonem.

### Dlaczego drukarka Zebra ZD230t nie drukuje?

**Odpowiedź:** Najczęstsze przyczyny: 1) Brak lub źle załadowany ribbon. 2) Tryb druku ustawiony na Direct Thermal. 3) Zbyt niska ciemność druku. 4) Brudna głowica.

### Jak wyczyścić głowicę drukarki Zebra ZD230t?

**Odpowiedź:** Wyłącz drukarkę, otwórz pokrywę, wyjmij ribbon. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 1 rolkę ribbonu**.

### Jaka jest różnica między ZD230t a ZD220t?

**Odpowiedź:** **ZD230t** ma wyższą prędkość druku (152 mm/s vs 102 mm/s) i więcej opcji łączności. **ZD220t** to podstawowy model ekonomiczny. Obie są Thermal Transfer 4-calowe.
`
      }
    ]
  },

  'zt111': {
    model: 'ZT111',
    title: 'Zebra ZT111 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZT111 User Guide',
    keywords: [
      'zebra zt111 instrukcja',
      'zt111 instrukcja po polsku',
      'zebra zt111 manual',
      'drukarka zebra zt111',
      'zebra zt111 kalibracja',
      'zt111 kalibracja czujników',
      'zebra zt111 reset',
      'zt111 reset fabryczny',
      'zebra zt111 etykiety',
      'zt111 ładowanie etykiet',
      'zebra zt111 ribbon',
      'zt111 ładowanie ribbonu',
      'zebra zt111 sterowniki',
      'zt111 instalacja',
      'zebra zt111 specyfikacja',
      'zt111 parametry techniczne',
      'zebra zt111 błędy',
      'zt111 media out',
      'zt111 ribbon out',
      'zebra zt111 czyszczenie',
      'zt111 czyszczenie głowicy',
      'zebra zt111 ethernet',
      'zt111 wifi',
      'zt111 bluetooth',
      'zebra zt111 thermal transfer',
      'zebra zt111 direct thermal',
      'zt111 termotransferowa',
      'drukarka przemysłowa zebra zt111',
      'zebra zt111 203 dpi',
      'zebra zt111 300 dpi',
      'zt111 prędkość druku',
      'zebra zt111 serwis',
      'zt111 naprawa',
      'instrukcja obsługi zebra zt111',
      'zebra zt111 po polsku',
      'zt111 user guide polski',
      'zt111 4 calowa',
      'zt111 kompaktowa przemysłowa',
      'zt111 obcinacz',
      'zt111 dispenser',
      'zt111 cutter',
      'zt111 peel',
      'zt111 regulacja docisku',
      'zt111 naprężenie ribbonu',
      'zt111 wymiana głowicy',
      'drukarka przemysłowa 4 calowa'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT111

Zebra ZT111 to **kompaktowa drukarka przemysłowa** zaprojektowana do pracy w wymagających środowiskach, takich jak **magazyny i hale produkcyjne**. Łączy wytrzymałą konstrukcję z prostotą obsługi, oferując druk **termiczny bezpośredni** lub **termotransferowy** w zależności od konfiguracji.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | **Termotransferowy / termiczny bezpośredni** |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do **254 mm/s** (10 cali/s) |
| Prędkość druku (300 dpi) | do **152 mm/s** (6 cali/s) |
| Szerokość druku | do **104 mm** (4,09 cala) |
| Maks. średnica rolki | **203 mm** (8 cali) |
| Długość ribbonu | do **450 m** |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11ac + Bluetooth – opcja
- RS-232 Serial – opcja

### Cechy charakterystyczne

- **Kompaktowa konstrukcja przemysłowa**
- **Metalowa obudowa**
- Kolorowe punkty dotykowe (złote) ułatwiające obsługę
- Prosty panel sterowania z **5 wskaźnikami LED** i **3 przyciskami**
- Obsługa języków **ZPL i EPL**
- Opcjonalny obcinacz lub dispenser etykiet
- Regulacja docisku głowicy
- Regulacja naprężenia ribbonu

> Więcej o drukarkach Zebra: [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT111
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja Thermal Transfer)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron drukarki
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka elektrycznego
- **Komunikacja:** w zasięgu sieci WLAN lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj podkładek ani materiałów tłumiących pod lub za drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Podłączenie zasilania

1. Podłącz kabel zasilający do drukarki
2. Podłącz kabel do gniazdka elektrycznego
3. Włącz drukarkę przełącznikiem zasilania
`
      },
      {
        title: '3. Ładowanie etykiet',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – do druku paragonów i rachunków
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby obsługi materiału

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **Tear-Off** | Brak | Ręczne odrywanie etykiet (domyślny) |
| **Peel** | Dispenser | Automatyczne odklejanie od podkładu |
| **Cutter** | Obcinacz | Automatyczne cięcie po każdej etykiecie |
| **Delayed Cut** | Obcinacz | Cięcie po komendzie ZPL (~JK) |

### Procedura ładowania etykiet (tryb Tear-Off)

1. **Otwórz drzwi komory mediów** – podnieś pokrywę
2. **Przesuń prowadnicę materiału** – wysuń i odchyl prowadnicę na zewnątrz
3. **Włóż rolkę materiału:**
   - Dla rolki: umieść na wieszaku materiału, dociśnij do tyłu
   - Dla składanki: wprowadź przez tylny otwór i przewieś przez wieszak
4. **Ustaw prowadnicę** – dosuń do krawędzi rolki
5. **Zwolnij głowicę** – obróć dźwignię otwierania głowicy
6. **Przeprowadź materiał:**
   - Przepuść przez szczelinę czujnika transmisyjnego
   - Przeprowadź pod wewnętrzną prowadnicą
   - Materiał powinien dotykać tylnej krawędzi szczeliny czujnika
7. **Zamknij głowicę** – obróć dźwignię w dół aż zablokuje
8. **Zamknij pokrywę**
9. **Naciśnij PAUSE** aby wyjść z trybu pauzy i umożliwić drukowanie

> Problem z wykrywaniem etykiet? [Kalibracja drukarki Zebra - poradnik](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '4. Ładowanie ribbonu',
        content: `
> **Dotyczy tylko modeli z opcją Thermal Transfer**

### Czy potrzebuję ribbonu?

- **Materiał termotransferowy** – wymaga ribbonu
- **Materiał termoczuły (Direct Thermal)** – nie wymaga ribbonu

**Test:** Przesuń szybko paznokciem po powierzchni materiału. Jeśli pojawi się czarny ślad – materiał jest termoczuły i **nie wymaga ribbonu**.

### Rodzaj ribbonu

Drukarka ZT111 standardowo obsługuje ribbon **powlekany na zewnątrz** (coated outside). Dla ribbonu powlekanego wewnątrz wymagana jest opcjonalna gilza.

### Procedura ładowania ribbonu

1. Otwórz pokrywę komory mediów
2. Zwolnij głowicę drukującą
3. **Załóż rolkę ribbonu na dolną gilzę (podającą):**
   - Ribbon powinien odwijać się zgodnie z kierunkiem pokazanym w drukarce
   - Dociśnij rolkę do tyłu
4. **Sprawdź pustą gilzę na górnej gilzie (odbiorczej):**
   - Jeśli brak – załóż pustą gilzę z zestawu
5. **Przeprowadź ribbon pod głowicą drukującą:**
   - Ribbon powinien przebiegać jak najdalej z tyłu pod zespołem głowicy
6. **Przymocuj ribbon do gilzy odbiorczej:**
   - Owiń ribbon wokół gilzy
   - Obróć gilzę kilka razy w kierunku nawijania, aby napiąć i wyrównać ribbon
7. Zamknij głowicę (jeśli materiał jest załadowany)
8. Zamknij pokrywę

> **WAŻNE:** Ribbon musi być **szerszy niż materiał**, aby chronić głowicę przed zużyciem.
`
      },
      {
        title: '5. Panel sterowania i LED',
        content: `
Drukarka ZT111 posiada prosty panel z **5 wskaźnikami LED** i **3 przyciskami**:

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw jednej etykiety |
| **CANCEL** | Anulowanie zadań (1x = następna etykieta, 2 sek. = wszystkie) |

### Znaczenie kolorów wskaźników

| STATUS | PAUSE | DATA | SUPPLIES | NETWORK | Znaczenie |
|--------|-------|------|----------|---------|-----------|
| Zielony | Wyłączony | Wyłączony | Wyłączony | - | Drukarka gotowa |
| Zielony | Żółty | - | - | - | Drukarka wstrzymana |
| - | - | Zielony | - | - | Transfer danych |
| Czerwony | - | - | Czerwony | - | Brak materiału |
| Czerwony | - | - | - | - | Otwarta głowica |
`
      },
      {
        title: '6. Kalibracja czujników',
        content: `
### Kalibracja automatyczna (Auto Calibration)

Automatyczna kalibracja czujników materiału i ribbonu:

1. Upewnij się, że materiał i ribbon (jeśli używany) są załadowane
2. Zamknij głowicę
3. Naciśnij i przytrzymaj **PAUSE + FEED** przez **2 sekundy**
4. Drukarka przeprowadzi kalibrację i wysunie kilka etykiet

> Szczegółowy poradnik: [Kalibracja drukarki Zebra - poradnik krok po kroku](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Kalibracja ręczna

Dla trudnych materiałów może być wymagana kalibracja ręczna:

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **PAUSE + CANCEL**
3. Włącz drukarkę trzymając przyciski
4. Postępuj zgodnie z instrukcjami na wydrukowanych etykietach

### Druk testowy (etykieta konfiguracji)

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **FEED + CANCEL**
3. Włącz drukarkę trzymając oba przyciski
4. Zwolnij gdy pierwszy wskaźnik zgaśnie
5. Drukarka wydrukuje etykietę konfiguracji i etykietę sieci

### Weryfikacja

Naciśnij **FEED** - powinna wysunąć się **dokładnie jedna etykieta**. Jeśli drukarka przewija więcej etykiet - powtórz kalibrację.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

Przed podłączeniem drukarki zainstaluj sterowniki ze strony [serwis-zebry.pl/sterowniki](/sterowniki)

> Poradnik: [Sterowniki Zebra Windows 11 - instalacja i problemy](/blog/sterowniki-zebra-windows-11-instalacja-problemy)

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB do drukarki
3. Podłącz kabel USB do komputera
4. Włącz drukarkę
5. Windows automatycznie wykryje drukarkę

### Połączenie Ethernet

1. Podłącz kabel sieciowy RJ-45 do drukarki
2. Podłącz kabel do sieci
3. Włącz drukarkę
4. Drukarka automatycznie pobierze adres IP z **DHCP**
5. Wydrukuj etykietę konfiguracji aby sprawdzić adres IP
6. Uruchom kreator instalacji drukarki i wybierz połączenie sieciowe

### Połączenie Wi-Fi

1. Uruchom **Zebra Printer Setup Utility** na telefonie lub komputerze
2. Wyszukaj drukarkę przez Bluetooth
3. Skonfiguruj połączenie Wi-Fi przez kreatora
4. Po połączeniu drukarka będzie dostępna w sieci bezprzewodowej

> Problem z WiFi? [Drukarka Zebra WiFi rozłącza się / offline](/blog/drukarka-zebra-wifi-rozlacza-sie-offline)

### Ustawienia druku

| Parametr | Opis | Zakres |
|----------|------|--------|
| **Print Darkness** | Ciemność druku | 0.0 – 30.0 |
| **Print Speed** | Prędkość druku | 203 dpi: 2-10 ips, 300 dpi: 2-6 ips |
| **Media Type** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **Print Method** | Tryb druku | THERMAL TRANS, DIRECT THERMAL |
| **Tear-Off Position** | Pozycja odrywania | -120 do +120 |
`
      },
      {
        title: '8. Regulacja docisku i ribbonu',
        content: `
### Regulacja docisku głowicy

Docisk głowicy wpływa na jakość druku. Drukarka ma **dwa pokrętła regulacji docisku** na belce dociskowej:

- **Równomierny docisk:** oba pokrętła na tej samej wartości
- **Nierównomierny druk:** dostosuj pokrętło po stronie z gorszą jakością

> **Uwaga:** Zwiększaj docisk stopniowo. Zbyt wysoki docisk może uszkodzić głowicę.

### Regulacja naprężenia ribbonu

Jeśli ribbon marszczy się lub źle nawija:

1. Znajdź pokrętło regulacji naprężenia ribbonu
2. Obróć w kierunku **"+"** aby **zwiększyć** naprężenie
3. Obróć w kierunku **"-"** aby **zmniejszyć** naprężenie

### Test jakości kodów kreskowych

Drukarka może wydrukować serie etykiet testowych z różnymi ustawieniami ciemności:

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **FEED**
3. Włącz drukarkę trzymając przycisk
4. Zwolnij gdy pierwszy wskaźnik zgaśnie
5. Oceń kody kreskowe na wydrukowanych etykietach
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
> Szczegółowy poradnik: [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)

### Harmonogram czyszczenia

| Element | Częstotliwość (DT) | Częstotliwość (TT) |
|---------|--------------------|--------------------|
| Głowica drukująca | **Co 1 rolkę** materiału | **Co 1 rolkę** ribbonu |
| Wałek dociskowy (platen) | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Czujniki materiału | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Czujnik ribbonu | - | Co 1 rolkę ribbonu |
| Ścieżka materiału | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Obcinacz | W razie potrzeby | W razie potrzeby |

*DT = Direct Thermal, TT = Thermal Transfer*

### Potrzebne materiały

- Zestaw konserwacyjny Zebra lub:
- Ściereczki bezpyłowe
- **Alkohol izopropylowy 99,7%**
- Sprężone powietrze

### Czyszczenie głowicy i wałka dociskowego

> **OSTRZEŻENIE:** Głowica może być gorąca! Poczekaj aż ostygnie. Uwaga na wyładowania elektrostatyczne – dotknij metalowej ramy drukarki przed czyszczeniem.

1. Otwórz pokrywę i zwolnij głowicę
2. Wyjmij ribbon (jeśli używany) i materiał
3. Przetrzyj **brązowy pasek głowicy** wacikiem nasączonym alkoholem (od jednego końca do drugiego)
4. Przetrzyj wałek dociskowy obracając go ręcznie
5. Poczekaj aż alkohol wyschnie
6. Załaduj materiał i ribbon, zamknij głowicę

> Kiedy wymienić głowicę? [Wymiana głowicy drukarki Zebra - kiedy konieczna, ile kosztuje](/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje)

### Czyszczenie obcinacza

> **OSTRZEŻENIE:** Ostrze może spowodować skaleczenie! Zachowaj ostrożność.

1. Wyłącz drukarkę
2. Oczyść widoczne powierzchnie ostrza wacikiem z alkoholem
3. Nasmaruj osłonę ostrza smarem Zebra
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
> Przeczytaj więcej: [Drukarka Zebra nie drukuje - przyczyny i rozwiązania](/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania)

### Problemy z jakością druku

| Problem | Możliwe przyczyny | Rozwiązanie |
|---------|-------------------|-------------|
| **Blade wydruki** | Zbyt niska ciemność | Zwiększ **Darkness** |
| | Zużyta/brudna głowica | [Wyczyść](/blog/jak-wyczyscic-glowice-drukarki-zebra) lub wymień głowicę |
| **Przepalone wydruki** | Zbyt wysoka ciemność | Zmniejsz **Darkness** |
| | Zbyt niska prędkość | Zwiększ prędkość |
| **Puste obszary (void)** | Brudna głowica | Wyczyść głowicę |
| | Uszkodzone elementy głowicy | Wymień głowicę |
| **Marszczenie ribbonu** | Zbyt niskie naprężenie | Zwiększ naprężenie ribbonu |
| | Nierówny docisk | Wyreguluj docisk głowicy |

> Blady wydruk? [Blady wydruk - przyczyny i rozwiązania](/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania)

### Problemy z materiałem

| Problem | Rozwiązanie |
|---------|-------------|
| Nieprawidłowa detekcja etykiet | Wykonaj [kalibrację czujników](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku) |
| Materiał się zacina | Sprawdź prowadnice, wyczyść ścieżkę |
| Etykiety nie odklejają się (tryb Peel) | Sprawdź ustawienie dispensera |

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia Ethernet | Sprawdź kabel, wskaźniki na porcie RJ-45 |
| Brak adresu IP | Sprawdź serwer DHCP lub ustaw statyczny IP |
| Drukarka niedostępna | Wydrukuj etykietę konfiguracji, sprawdź adres IP |

### Wymiana komponentów

- **Głowica drukująca** – element eksploatacyjny, używaj tylko oryginalnych głowic Zebra
- **Wałek dociskowy** – zużyty wałek może powodować problemy z transportem materiału

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: '11. Specyfikacja techniczna',
        content: `
### Drukowanie

| Parametr | ZT111 203 dpi | ZT111 300 dpi |
|----------|---------------|---------------|
| Rozdzielczość | 203 dpi (8 dots/mm) | 300 dpi (12 dots/mm) |
| **Max prędkość druku** | **254 mm/s (10 IPS)** | **152 mm/s (6 IPS)** |
| Typ druku | **Thermal Transfer / Direct Thermal** | **Thermal Transfer / Direct Thermal** |
| Szerokość druku | do **104 mm (4.09")** | do **104 mm (4.09")** |

### Media (etykiety)

| Parametr | Wartość |
|----------|---------|
| **Max szerokość** | **114 mm (4.5")** |
| Min szerokość | 25.4 mm (1") |
| **Max średnica rolki** | **203 mm (8.0")** |
| Rdzeń wewnętrzny | 25.4 mm (1") lub 76.2 mm (3") |

### Ribbon (taśma termotransferowa)

| Parametr | Wartość |
|----------|---------|
| Max szerokość | 110 mm (4.33") |
| **Długość rolki** | do **450 m** |
| Rdzeń wewnętrzny | 25.4 mm (1") |
| Typ | Coated outside (standardowo) |

### Łączność

- USB 2.0 (standardowo)
- Ethernet 10/100 (opcja)
- WiFi 802.11ac (opcja)
- Bluetooth (opcja)
- RS-232 Serial (opcja)

### Porównanie ZT111 vs drukarki desktop

| Cecha | ZT111 | ZD421/ZD621 |
|-------|-------|-------------|
| Klasa | **Przemysłowa kompaktowa** | Desktop |
| Obudowa | **Metalowa** | Plastikowa |
| Max średnica rolki | **203 mm (8")** | 127 mm (5") |
| Długość ribbonu | **do 450 m** | do 74-300 m |
| Prędkość (203 dpi) | **do 254 mm/s** | do 203 mm/s |

### Środowisko pracy

| Parametr | Thermal Transfer | Direct Thermal |
|----------|-----------------|----------------|
| Temperatura pracy | 5°C - 40°C | 0°C - 40°C |
| Wilgotność | 20-85% (bez kondensacji) | 20-85% (bez kondensacji) |

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt) | [Więcej o drukarkach Zebra](/drukarki)

> **Źródło:** Zebra ZT111 User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka przemysłowa Zebra ZT111?

**Odpowiedź:** Zebra ZT111 to **drukarka przemysłowa** z metalową obudową, przeznaczona do intensywnej pracy w trudnych warunkach. Oferuje wysoką wydajność i niezawodność. Dostępna w wersjach 203 dpi i 300 dpi.

### Jak skalibrować drukarkę Zebra ZT111?

**Odpowiedź:** Naciśnij i przytrzymaj **PAUSE + FEED** przez 2 sekundy. Drukarka wykona automatyczną kalibrację czujników. Kalibrację wykonaj po każdej wymianie materiału.

### Jak załadować ribbon do drukarki Zebra ZT111?

**Odpowiedź:** Otwórz drzwi boczne, zwolnij głowicę. Załóż rolkę ribbonu na dolną gilzę, pustą gilzę na górną. Przeprowadź ribbon pod głowicą zgodnie ze ścieżką. Zamknij głowicę i drzwi.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZT111?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZT111 wynosi **254 mm/s (10 cali/s)** dla wersji 203 dpi oraz **203 mm/s (8 cali/s)** dla wersji 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZT111?

**Odpowiedź:** ZT111 obsługuje etykiety o szerokości do **104 mm (4 cale)** i średnicy rolki do **203 mm (8 cali)**. Obsługuje materiały rolkowe i składane (fanfold).

### Czy drukarka Zebra ZT111 może pracować jako Direct Thermal?

**Odpowiedź:** **Tak.** ZT111 obsługuje oba tryby: Thermal Transfer (z ribbonem) i Direct Thermal (bez ribbonu). Tryb można zmienić przez menu lub komendą ZPL.

### Jak wyczyścić głowicę drukarki Zebra ZT111?

**Odpowiedź:** Wyłącz drukarkę, otwórz drzwi, zwolnij głowicę. Przetrzyj brązowy pasek wacikiem z alkoholem izopropylowym (99,7%). Czyszczenie zalecane **co 1 rolkę ribbonu/materiału DT**.

### Jaka jest różnica między ZT111 a ZD621t?

**Odpowiedź:** **ZT111** to drukarka **przemysłowa** z metalową obudową, szybsza (254 mm/s vs 203 mm/s), do intensywnej pracy. **ZD621t** to drukarka **biurkowa** (desktop), bardziej kompaktowa.
`
      }
    ]
  },
  'zt230': {
    model: 'ZT230',
    title: 'Zebra ZT230 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZT220/ZT230 User Guide',
    keywords: [
      'zebra zt230 instrukcja',
      'zt230 instrukcja po polsku',
      'zebra zt230 manual',
      'drukarka zebra zt230',
      'zebra zt230 kalibracja',
      'zt230 kalibracja czujników',
      'zebra zt230 reset',
      'zt230 reset fabryczny',
      'zebra zt230 ribbon',
      'zt230 zakładanie taśmy',
      'zebra zt230 etykiety',
      'zt230 ładowanie etykiet',
      'zebra zt230 sterowniki',
      'zt230 instalacja',
      'zebra zt230 specyfikacja',
      'zt230 parametry techniczne',
      'zebra zt230 błędy',
      'zt230 paper out',
      'zt230 ribbon out',
      'zebra zt230 czyszczenie',
      'zt230 czyszczenie głowicy',
      'zebra zt230 ethernet',
      'zt230 wifi',
      'zebra zt230 lcd',
      'zt230 wyświetlacz',
      'zebra zt230 menu',
      'zt230 konfiguracja menu',
      'zebra zt230 thermal transfer',
      'zt230 termotransferowa',
      'drukarka przemysłowa zebra zt230',
      'zebra zt230 203 dpi',
      'zebra zt230 300 dpi',
      'zt230 prędkość druku',
      'zebra zt230 serwis',
      'zt230 naprawa',
      'instrukcja obsługi zebra zt230',
      'zebra zt230 po polsku',
      'zt230 user guide polski',
      'zt230 dispenser',
      'zt230 cutter',
      'zt230 obcinacz'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT230

Zebra ZT230 to drukarka przemysłowa zaprojektowana do pracy w wymagających środowiskach produkcyjnych i magazynowych. Model ZT230 wyposażony jest w **wyświetlacz LCD z systemem menu**, umożliwiający pełną konfigurację drukarki bez konieczności użycia komputera.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku | do 152 mm/s (6 cali/s) |
| Szerokość druku | do 104 mm (4,09 cala) |
| Maks. średnica rolki | 203 mm (8 cali) |
| Średnica gilzy | 25 mm – 76 mm (1" – 3") |
| Długość ribbonu | do 450 m |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11a/b/g/n + Bluetooth – opcja
- Równoległe (Parallel) – opcja

### Cechy charakterystyczne

- Metalowa konstrukcja przemysłowa
- **Wyświetlacz LCD** z intuicyjnym systemem menu
- 5 wskaźników LED + 8 przycisków nawigacyjnych
- Kolorowe punkty dotykowe (złote) ułatwiające obsługę
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz, dispenser lub nawijak podkładu
- Obsługa materiałów rolkowych i składanych (fanfold)
- Czujnik transmisyjny i refleksyjny

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT230
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Warunki przechowywania

- Temperatura: -40°C do 60°C
- Wilgotność: 5-85% bez kondensacji
`
      },
      {
        title: '3. Ładowanie materiałów eksploatacyjnych',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami, otworami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet
- **Przywieszki (tag stock)** – grubszy materiał bez kleju

### Tryby obsługi materiału

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **Tear-Off** | Brak | Ręczne odrywanie (domyślny) |
| **Peel-Off** | Dispenser | Automatyczne odklejanie od podkładu |
| **Liner Take-Up** | Nawijak | Nawijanie podkładu na rolkę |
| **Cutter** | Obcinacz | Automatyczne cięcie |

### Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** Sprawdź czy materiał wymaga ribbonu – przesuń paznokciem po powierzchni. Czarny ślad = Direct Thermal (bez ribbonu).

#### Strona powlekana ribbonu

Drukarka ZT230 wymaga ribbonu powlekanego na zewnątrz. Test: przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

#### Procedura ładowania:

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę, aby ją zwolnić
3. **Załaduj rolkę ribbonu na dolną gilzę (podającą):**
   - Ribbon odwija się zgodnie ze strzałką
   - Dociśnij rolkę do tyłu
4. **Sprawdź pustą gilzę na górnej gilzie (odbiorczej)**
5. **Przeprowadź ribbon pod głowicą** – zgodnie ze ścieżką pokazaną w drukarce
6. **Nawiń ribbon na gilzę odbiorczą:**
   - Owiń kilka zwojów
   - Obróć gilzę w kierunku nawijania
7. Zamknij głowicę (po załadowaniu materiału)

### Ładowanie materiału (tryb Tear-Off)

1. Otwórz drzwi komory mediów
2. Zwolnij głowicę (dźwignia w górę)
3. **Odsuń prowadnicę materiału** – wysuń na zewnątrz
4. **Włóż rolkę:**
   - Rolka: umieść na wieszaku, dociśnij do tyłu
   - Fanfold: wprowadź przez tylny otwór
5. **Przeprowadź materiał:**
   - Przez czujnik transmisyjny (szczelina)
   - Pod wewnętrzną prowadnicą
   - Materiał powinien dotykać tylnej krawędzi czujnika
6. **Dosuń prowadnicę** do krawędzi materiału
7. **Zamknij głowicę** (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

> 📘 **Szczegółowy poradnik:** [Jak załadować etykiety do drukarki Zebra](/blog/jak-zaladowac-etykiety-do-drukarki-zebra)
`
      },
      {
        title: '4. Panel sterowania z wyświetlaczem LCD',
        content: `
### Elementy panelu

Drukarka ZT230 posiada rozbudowany panel sterowania:

#### Wskaźniki LED:

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów |
| **NETWORK** | Stan połączenia sieciowego |

#### Przyciski:

| Przycisk | Funkcja |
|----------|---------|
| **LEFT SELECT** | Wykonuje polecenie nad przyciskiem (lewe) |
| **RIGHT SELECT** | Wykonuje polecenie nad przyciskiem (prawe) |
| **STRZAŁKA W GÓRĘ** | Zwiększa wartość / przewija listę |
| **STRZAŁKA W DÓŁ** | Zmniejsza wartość / przewija listę |
| **STRZAŁKA W LEWO** | Nawigacja w lewo |
| **STRZAŁKA W PRAWO** | Nawigacja w prawo |
| **OK** | Potwierdza wybór |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw jednej etykiety |
| **CANCEL** | Anulowanie zadań |

### Nawigacja w menu

#### Ekran bezczynności (Idle Display)

Na ekranie bezczynności wyświetla się status drukarki. Naciśnij **LEFT SELECT** aby wejść do menu głównego.

#### Menu główne (Home Menu)

Nawiguj strzałkami między ikonami. Wybrana ikona jest podświetlona (kolory odwrócone). Naciśnij **OK** aby wejść do wybranego menu.

| Ikona | Menu |
|-------|------|
| 🔧 | **SETTINGS** – Ustawienia druku |
| 📡 | **NETWORK** – Ustawienia sieciowe |
| 🌐 | **LANGUAGE** – Wybór języka |
| 📊 | **SENSORS** – Ustawienia czujników |
| 🔌 | **PORTS** – Ustawienia portów |
| ⚙️ | **TOOLS** – Narzędzia diagnostyczne |

#### Menu użytkownika

- **LEFT SELECT** – powrót do menu głównego
- **STRZAŁKI GÓRA/DÓŁ** – zmiana wartości parametru
- Zmiany są zapisywane natychmiast
- Po 15 sekundach nieaktywności – automatyczny powrót
`
      },
      {
        title: '5. Konfiguracja przez menu',
        content: `
### Menu SETTINGS (Ustawienia)

| Parametr | Opis | Wartości |
|----------|------|----------|
| **DARKNESS** | Ciemność druku | 0.0 – 30.0 |
| **SPEED** | Prędkość druku | 2, 3, 4, 5, 6 ips |
| **MEDIA TYPE** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **PRINT METHOD** | Tryb druku | THERMAL TRANS, DIRECT THERMAL |
| **PRINT MODE** | Tryb obsługi | TEAR OFF, PEEL OFF, CUTTER |
| **TEAR OFF** | Pozycja odrywania | -120 do +120 |
| **PRINT WIDTH** | Szerokość druku | w kropkach |
| **LABEL TOP** | Pozycja pionowa obrazu | -120 do +120 |
| **LEFT POSITION** | Pozycja pozioma obrazu | 0 do 9999 |

### Menu NETWORK (Sieć)

| Parametr | Opis |
|----------|------|
| **IP PROTOCOL** | ALL, DHCP, DHCP&BOOTP, PERMANENT |
| **IP ADDRESS** | Adres IP drukarki |
| **SUBNET MASK** | Maska podsieci |
| **DEFAULT GATEWAY** | Brama domyślna |
| **WLAN IP ADDRESS** | Adres IP Wi-Fi |
| **ESSID** | Nazwa sieci Wi-Fi |
| **RESET NETWORK** | Reset ustawień sieciowych |

### Menu LANGUAGE (Język)

| Parametr | Opis |
|----------|------|
| **LANGUAGE** | Język menu (w tym polski) |
| **ZPL MODE** | ZPL lub ZPL II |

### Menu SENSORS (Czujniki)

| Parametr | Opis |
|----------|------|
| **SENSOR TYPE** | TRANSMISSIVE lub REFLECTIVE |
| **LABEL SENSOR** | Czułość czujnika etykiet (0-255) |
| **TAKE LABEL** | Intensywność LED dispensera (0-255) |

### Menu PORTS (Porty)

| Parametr | Wartości |
|----------|----------|
| **BAUD RATE** | 4800 – 115200 |
| **DATA BITS** | 7 lub 8 |
| **PARITY** | NONE, EVEN, ODD |
| **HOST HANDSHAKE** | XON/XOFF, RTS/CTS, DSR/DTR |

### Menu TOOLS (Narzędzia)

| Narzędzie | Funkcja |
|-----------|---------|
| **PRINT INFO** | Druk etykiet konfiguracji |
| **CALIBRATE** | Kalibracja czujników |
| **PRINT QUALITY** | Test jakości druku |
| **SENSOR PROFILE** | Profil czujników |
| **FACTORY DEFAULTS** | Przywrócenie ustawień fabrycznych |
`
      },
      {
        title: '6. Podłączenie do komputera',
        content: `
### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki: [serwis-zebry.pl/sterowniki](/sterowniki)
2. Uruchom instalator
3. Podłącz drukarkę gdy kreator o to poprosi

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Konfiguracja Ethernet przez menu

1. Podłącz kabel RJ-45
2. Wejdź do **NETWORK** > **IP PROTOCOL**
3. Wybierz **DHCP** (automatyczny) lub **PERMANENT** (statyczny)
4. Dla statycznego IP: ustaw **IP ADDRESS**, **SUBNET MASK**, **DEFAULT GATEWAY**
5. Wybierz **RESET NETWORK** aby zastosować zmiany

### Konfiguracja Wi-Fi przez menu

1. Wejdź do **NETWORK** > **WLAN**
2. Ustaw **ESSID** (nazwa sieci)
3. Skonfiguruj zabezpieczenia (WPA, WPA2)
4. Ustaw **WLAN IP PROTOCOL**
5. Wybierz **RESET NETWORK**
`
      },
      {
        title: '7. Kalibracja',
        content: `
### Kalibracja automatyczna przez menu

1. Wejdź do **TOOLS** > **CALIBRATE**
2. Potwierdź **OK**
3. Drukarka przeprowadzi kalibrację czujników

### Kalibracja przez przyciski

1. Zamknij głowicę z załadowanym materiałem
2. Naciśnij i przytrzymaj **PAUSE + FEED** przez 2 sekundy
3. Drukarka przeprowadzi kalibrację

### Kalibracja ręczna

Dla trudnych materiałów:

1. Wejdź do **TOOLS** > **MANUAL CALIBRATE**
2. Postępuj zgodnie z instrukcjami na wyświetlaczu
3. Drukarka prowadzi przez proces krok po kroku

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
`
      },
      {
        title: '8. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu / materiału DT |
| Wałek dociskowy | Co 1 rolkę ribbonu / materiału DT |
| Czujniki | Co 1 rolkę |
| Ścieżka materiału/ribbonu | Co 1 rolkę |
| Dispenser | W razie problemów |
| Obcinacz | W razie problemów |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Otwórz drzwi i zwolnij głowicę
2. Wyjmij ribbon i materiał
3. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem (99,7%)
4. Przetrzyj wałek dociskowy obracając go ręcznie
5. Poczekaj aż wyschnie
6. Załaduj materiał i ribbon

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał |
| **RIBBON OUT** | Załaduj ribbon |
| **HEAD OPEN** | Zamknij głowicę |
| **THERMISTOR FAULT** | Błąd głowicy – skontaktuj się z [serwisem](/kontakt) |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **HEAD UNDER TEMP** | Przenieś w cieplejsze miejsce |

### Problemy z jakością druku

| Problem | Rozwiązanie |
|---------|-------------|
| Blade wydruki | Zwiększ DARKNESS, wyczyść głowicę |
| Przepalone wydruki | Zmniejsz DARKNESS, zwiększ SPEED |
| Puste obszary | Wyczyść lub wymień głowicę |
| Marszczenie ribbonu | Sprawdź wyrównanie, wyczyść ścieżkę |

### Problemy z materiałem

| Problem | Rozwiązanie |
|---------|-------------|
| Nieprawidłowa detekcja | Wykonaj kalibrację, sprawdź SENSOR TYPE |
| Złe pozycjonowanie | Ustaw TEAR OFF, LABEL TOP |

### Testy diagnostyczne (menu TOOLS)

- **PRINT INFO** – drukuje etykiety konfiguracji
- **PRINT QUALITY** – test jakości przy różnych ustawieniach
- **SENSOR PROFILE** – profil czujników dla diagnostyki

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)

> **Źródło:** Zebra ZT220/ZT230 User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT230?

**Odpowiedź:** Zebra ZT230 to **drukarka przemysłowa** z **wyświetlaczem LCD** i menu nawigacyjnym. Metalowa obudowa zapewnia trwałość w wymagających środowiskach produkcyjnych i magazynowych.

### Jak skalibrować drukarkę Zebra ZT230?

**Odpowiedź:** Przez menu LCD: **TOOLS > CALIBRATE > OK**. Lub naciśnij **PAUSE + FEED** przez 2 sekundy.

### Co wyświetla się na ekranie LCD drukarki Zebra ZT230?

**Odpowiedź:** Wyświetlacz LCD pokazuje: status drukarki, komunikaty błędów, menu konfiguracji. Umożliwia pełną konfigurację bez komputera przez intuicyjne menu.

### Jak załadować ribbon do drukarki Zebra ZT230?

**Odpowiedź:** Otwórz drzwi, zwolnij głowicę (dźwignia w górę). Załóż rolkę ribbonu na dolną gilzę, pustą na górną. Przeprowadź ribbon pod głowicą, nawiń na górną gilzę. Zamknij głowicę.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZT230?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZT230 wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi i 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZT230?

**Odpowiedź:** ZT230 obsługuje etykiety o szerokości do **104 mm (4 cale)** i średnicy rolki do **203 mm (8 cali)**. Obsługuje materiały rolkowe i składane (fanfold).

### Co oznacza komunikat PAPER OUT na drukarce Zebra ZT230?

**Odpowiedź:** Brak materiału (etykiet). Załaduj nową rolkę etykiet i wykonaj kalibrację.

### Jaka jest różnica między ZT230 a ZT220?

**Odpowiedź:** **ZT230** ma **wyświetlacz LCD** z pełnym menu konfiguracji. **ZT220** ma tylko **wskaźniki LED** – konfiguracja przez oprogramowanie/ZPL.
`
      }
    ]
  },
  'zt220': {
    model: 'ZT220',
    title: 'Zebra ZT220 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZT220/ZT230 User Guide',
    keywords: [
      'zebra zt220 instrukcja',
      'zt220 instrukcja po polsku',
      'zebra zt220 manual',
      'drukarka zebra zt220',
      'zebra zt220 kalibracja',
      'zt220 kalibracja czujników',
      'zebra zt220 reset',
      'zt220 reset fabryczny',
      'zebra zt220 ribbon',
      'zt220 zakładanie taśmy',
      'zebra zt220 etykiety',
      'zt220 ładowanie etykiet',
      'zebra zt220 sterowniki',
      'zt220 instalacja',
      'zebra zt220 specyfikacja',
      'zt220 parametry techniczne',
      'zebra zt220 błędy',
      'zt220 paper out',
      'zt220 ribbon out',
      'zebra zt220 czyszczenie',
      'zt220 czyszczenie głowicy',
      'zebra zt220 ethernet',
      'zt220 wifi',
      'zebra zt220 led',
      'zt220 wskaźniki led',
      'zebra zt220 thermal transfer',
      'zt220 termotransferowa',
      'drukarka przemysłowa zebra zt220',
      'zebra zt220 203 dpi',
      'zebra zt220 300 dpi',
      'zt220 prędkość druku',
      'zebra zt220 serwis',
      'zt220 naprawa',
      'instrukcja obsługi zebra zt220',
      'zebra zt220 po polsku',
      'zt220 user guide polski',
      'zt220 dispenser',
      'zt220 cutter',
      'zt220 obcinacz'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT220

Zebra ZT220 to drukarka przemysłowa zaprojektowana do pracy w wymagających środowiskach produkcyjnych i magazynowych. Model ZT220 wyposażony jest w prosty panel sterowania z wskaźnikami LED, co czyni go idealnym rozwiązaniem dla środowisk, gdzie konfiguracja odbywa się centralnie przez oprogramowanie.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku | do 152 mm/s (6 cali/s) |
| Szerokość druku | do 104 mm (4,09 cala) |
| Maks. średnica rolki | 203 mm (8 cali) |
| Średnica gilzy | 25 mm – 76 mm (1" – 3") |
| Długość ribbonu | do 450 m |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11a/b/g/n + Bluetooth – opcja
- Równoległe (Parallel) – opcja

### Cechy charakterystyczne

- Metalowa konstrukcja przemysłowa
- Prosty panel sterowania z 5 wskaźnikami LED
- Kolorowe punkty dotykowe (złote) ułatwiające obsługę
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz, dispenser lub nawijak podkładu
- Obsługa materiałów rolkowych i składanych (fanfold)
- Czujnik transmisyjny i refleksyjny

> 📘 **Więcej o drukarkach Zebra:** [Drukarki etykiet](/drukarki)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT220
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Warunki przechowywania

- Temperatura: -40°C do 60°C
- Wilgotność: 5-85% bez kondensacji
`
      },
      {
        title: '3. Ładowanie materiałów eksploatacyjnych',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami, otworami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet
- **Przywieszki (tag stock)** – grubszy materiał bez kleju

### Tryby obsługi materiału

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **Tear-Off** | Brak | Ręczne odrywanie (domyślny) |
| **Peel-Off** | Dispenser | Automatyczne odklejanie od podkładu |
| **Liner Take-Up** | Nawijak | Nawijanie podkładu na rolkę |
| **Cutter** | Obcinacz | Automatyczne cięcie |

### Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** Sprawdź czy materiał wymaga ribbonu – przesuń paznokciem po powierzchni. Czarny ślad = Direct Thermal (bez ribbonu).

#### Strona powlekana ribbonu

Drukarka ZT220 wymaga ribbonu powlekanego na zewnątrz. Test: przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

#### Procedura ładowania:

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę, aby ją zwolnić
3. **Załaduj rolkę ribbonu na dolną gilzę (podającą):**
   - Ribbon odwija się zgodnie ze strzałką
   - Dociśnij rolkę do tyłu
4. **Sprawdź pustą gilzę na górnej gilzie (odbiorczej)**
5. **Przeprowadź ribbon pod głowicą** – zgodnie ze ścieżką pokazaną w drukarce
6. **Nawiń ribbon na gilzę odbiorczą:**
   - Owiń kilka zwojów
   - Obróć gilzę w kierunku nawijania
7. Zamknij głowicę (po załadowaniu materiału)

### Ładowanie materiału (tryb Tear-Off)

1. Otwórz drzwi komory mediów
2. Zwolnij głowicę (dźwignia w górę)
3. **Odsuń prowadnicę materiału** – wysuń na zewnątrz
4. **Włóż rolkę:**
   - Rolka: umieść na wieszaku, dociśnij do tyłu
   - Fanfold: wprowadź przez tylny otwór
5. **Przeprowadź materiał:**
   - Przez czujnik transmisyjny (szczelina)
   - Pod wewnętrzną prowadnicą
   - Materiał powinien dotykać tylnej krawędzi czujnika
6. **Dosuń prowadnicę** do krawędzi materiału
7. **Zamknij głowicę** (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie w trybie Peel-Off

Po standardowym ładowaniu materiału:

1. Odklej ok. 15 cm etykiet od podkładu
2. Otwórz mechanizm dispensera (dźwignia zwalniająca)
3. Przeprowadź podkład przez dispenser
4. Zamknij dispenser
5. Zamknij głowicę i drzwi

### Ładowanie w trybie Cutter

Po standardowym ładowaniu:

1. Przeprowadź materiał przez otwór obcinacza
2. Zamknij głowicę i drzwi

> 📘 **Szczegółowy poradnik:** [Jak załadować etykiety do drukarki Zebra](/blog/jak-zaladowac-etykiety-do-drukarki-zebra)
`
      },
      {
        title: '4. Panel sterowania',
        content: `
### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

### Przyciski

| Przycisk | Funkcja |
|----------|---------|
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw jednej etykiety |
| **CANCEL** | Anulowanie (1x = następna, 2 sek. = wszystkie) |

### Znaczenie wzorców LED

| STATUS | PAUSE | SUPPLIES | Znaczenie |
|--------|-------|----------|-----------|
| Zielony | Wył. | Wył. | Drukarka gotowa |
| Zielony | Żółty | Wył. | Wstrzymana (pauza) |
| Żółty | Wył. | Wył. | Nagrzewanie |
| Czerwony | Wył. | Czerwony | Brak materiału/ribbonu |
| Czerwony | Wył. | Wył. | Otwarta głowica |
| Mruga czerwony | Mruga | Mruga | Błąd – wymagany serwis |
`
      },
      {
        title: '5. Podłączenie do komputera',
        content: `
### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki: [serwis-zebry.pl/sterowniki](/sterowniki)
2. Uruchom instalator
3. Podłącz drukarkę gdy kreator o to poprosi

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Podłącz kabel RJ-45
2. Włącz drukarkę
3. Wydrukuj etykietę konfiguracji (CANCEL podczas włączania)
4. Znajdź adres IP na etykiecie
5. Dodaj drukarkę w systemie używając adresu IP

### Połączenie RS-232 (Serial)

Domyślne ustawienia:
- Baud rate: 9600
- Data bits: 8
- Parity: None
- Handshake: XON/XOFF
`
      },
      {
        title: '6. Konfiguracja',
        content: `
### Zmiana ustawień

Model ZT220 nie posiada wyświetlacza, dlatego konfiguracja odbywa się przez:
- **Sterownik Windows** (Printing Preferences)
- **Zebra Setup Utilities**
- **Komendy ZPL/SGD**
- **Strona WWW drukarki** (przy połączeniu sieciowym)

### Podstawowe parametry

| Parametr | Opis | Zakres |
|----------|------|--------|
| **Print Darkness** | Ciemność druku | 0.0 – 30.0 |
| **Print Speed** | Prędkość druku | 2, 3, 4, 5, 6 ips |
| **Media Type** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **Print Method** | Tryb druku | THERMAL TRANS, DIRECT THERMAL |
| **Print Mode** | Tryb obsługi | TEAR OFF, PEEL OFF, CUTTER |
| **Tear-Off Position** | Pozycja odrywania | -120 do +120 |

### Kalibracja czujników

Automatyczna kalibracja przez przyciski:

1. Upewnij się, że materiał i ribbon są załadowane
2. Zamknij głowicę
3. Naciśnij i przytrzymaj **PAUSE + FEED** przez 2 sekundy
4. Drukarka przeprowadzi kalibrację

> 📘 **Szczegółowy poradnik:** [Kalibracja drukarki Zebra](/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)

### Druk etykiety konfiguracji

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **CANCEL**
3. Włącz drukarkę trzymając CANCEL
4. Zwolnij gdy STATUS zamiga pierwszy raz
`
      },
      {
        title: '7. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu / materiału DT |
| Wałek dociskowy (platen) | Co 1 rolkę ribbonu / materiału DT |
| Czujniki | Co 1 rolkę |
| Ścieżka materiału/ribbonu | Co 1 rolkę |
| Dispenser (jeśli zainstalowany) | W razie problemów z odklejaniem |
| Obcinacz (jeśli zainstalowany) | W razie problemów z cięciem |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD – dotknij metalowej ramy przed czyszczeniem.

1. Otwórz drzwi i zwolnij głowicę
2. Wyjmij ribbon i materiał
3. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem (99,7%)
4. Przetrzyj wałek dociskowy obracając go ręcznie
5. Poczekaj aż wyschnie
6. Załaduj materiał i ribbon

### Czyszczenie dispensera

1. Zwolnij głowicę i otwórz dispenser
2. Usuń podkład
3. Przetrzyj wałek dociskowy dispensera
4. Przetrzyj listwę odrywającą (ostrożnie, bez nadmiernej siły)
5. Załaduj ponownie

### Czyszczenie obcinacza

> **Ostrzeżenie:** Wyłącz drukarkę i odłącz zasilanie przed czyszczeniem obcinacza!

1. Zdejmij osłonę obcinacza
2. Wyczyść widoczne powierzchnie ostrza
3. Nasmaruj osłonę smarem Zebra
4. Załóż osłonę

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
### Problemy z jakością druku

| Problem | Rozwiązanie |
|---------|-------------|
| Blade wydruki | Zwiększ ciemność, wyczyść głowicę |
| Przepalone wydruki | Zmniejsz ciemność, zwiększ prędkość |
| Puste obszary | Wyczyść lub wymień głowicę |
| Marszczenie ribbonu | Sprawdź wyrównanie, wyczyść ścieżkę |

### Problemy z materiałem

| Problem | Rozwiązanie |
|---------|-------------|
| Nieprawidłowa detekcja | Wykonaj kalibrację, sprawdź typ czujnika |
| Materiał się zacina | Sprawdź prowadnice, wyczyść ścieżkę |
| Złe pozycjonowanie | Ustaw Tear-Off Position |

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia | Sprawdź kabel, wydrukuj etykietę konfiguracji |
| Nieprawidłowy IP | Sprawdź DHCP lub ustaw statyczny IP |

### Testy diagnostyczne

**Test FEED (jakość kodów kreskowych):**
1. Wyłącz drukarkę
2. Przytrzymaj FEED i włącz drukarkę
3. Zwolnij gdy STATUS zamiga

**Test PAUSE (konfiguracja):**
1. Wyłącz drukarkę  
2. Przytrzymaj PAUSE i włącz drukarkę
3. Zwolnij gdy STATUS zamiga

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)

> **Źródło:** Zebra ZT220/ZT230 User Guide
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT220?

**Odpowiedź:** Zebra ZT220 to **drukarka przemysłowa** z prostym panelem **wskaźników LED** (bez wyświetlacza LCD). Metalowa obudowa zapewnia trwałość w wymagających środowiskach. Konfiguracja odbywa się przez oprogramowanie lub komendy ZPL.

### Jak skalibrować drukarkę Zebra ZT220?

**Odpowiedź:** Naciśnij i przytrzymaj **PAUSE + FEED** przez 2 sekundy. Drukarka wykona automatyczną kalibrację czujników.

### Jak załadować ribbon do drukarki Zebra ZT220?

**Odpowiedź:** Otwórz drzwi, zwolnij głowicę (dźwignia w górę). Załóż rolkę ribbonu na dolną gilzę, pustą gilzę na górną. Przeprowadź ribbon pod głowicą, nawiń na górną gilzę. Zamknij głowicę.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZT220?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZT220 wynosi **152 mm/s (6 cali/s)** dla wersji 203 dpi i 300 dpi.

### Jakie etykiety pasują do drukarki Zebra ZT220?

**Odpowiedź:** ZT220 obsługuje etykiety o szerokości do **104 mm (4 cale)** i średnicy rolki do **203 mm (8 cali)**. Obsługuje materiały rolkowe i składane (fanfold).

### Co oznaczają diody LED na drukarce Zebra ZT220?

**Odpowiedź:** **STATUS** zielony = gotowa, czerwony = błąd. **PAUSE** żółty = wstrzymana. **SUPPLIES** czerwony = brak materiału/ribbonu. **DATA** mruga = transmisja danych. **NETWORK** = stan sieci.

### Jak wydrukować raport konfiguracji na drukarce Zebra ZT220?

**Odpowiedź:** Wyłącz drukarkę. Naciśnij i przytrzymaj **CANCEL**, włącz drukarkę. Zwolnij gdy STATUS zamiga pierwszy raz. Drukarka wydrukuje raport.

### Jaka jest różnica między ZT220 a ZT230?

**Odpowiedź:** **ZT220** ma **wskaźniki LED** – konfiguracja przez oprogramowanie/ZPL. **ZT230** ma **wyświetlacz LCD** z pełnym menu konfiguracji. Specyfikacje druku są identyczne.
`
      }
    ]
  },

  'zt231r': {
    model: 'ZT231R',
    title: 'Zebra ZT231R – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT231R User Guide',
    keywords: [
      'zebra zt231r instrukcja',
      'zt231r instrukcja po polsku',
      'zebra zt231r manual',
      'drukarka zebra zt231r',
      'zebra zt231r rfid',
      'zt231r rfid kalibracja',
      'zebra zt231r enkoder rfid',
      'zt231r programowanie tagów',
      'zebra zt231r smart labels',
      'zt231r konfiguracja rfid',
      'zebra zt231r uhf',
      'zt231r epc gen2',
      'zebra zt231 rfid instrukcja',
      'drukarka rfid zebra',
      'zt231r wyświetlacz dotykowy',
      'zebra zt231r specyfikacja'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT231R

Zebra ZT231R to przemysłowa drukarka etykiet z **wbudowanym enkoderem RFID UHF**. Model ten łączy wszystkie funkcje standardowej drukarki ZT231 (kolorowy wyświetlacz dotykowy, kreatory konfiguracji) z możliwością **programowania tagów RFID** podczas drukowania etykiet.

**Idealna do zastosowań:**
- Logistyka i zarządzanie magazynem
- Śledzenie aktywów (asset tracking)
- Identyfikacja produktów
- Systemy inwentaryzacyjne

### Parametry techniczne

- **Technologia druku:** Termotransferowy / termiczny bezpośredni
- **Rozdzielczość:** 203 dpi lub 300 dpi
- **Prędkość druku:** do 356 mm/s (14 cali/s)
- **Szerokość druku:** do 104 mm (4,09 cala)
- **Maks. średnica rolki:** 203 mm (8 cali)
- **Długość ribbonu:** do 450 m
- **RFID:** Wbudowany enkoder UHF EPC Gen2 V2
- **Pasma RFID:** EU 865-868 MHz, US 902-928 MHz

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 RJ-45 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth (opcja)
- USB Host (pendrive, skaner, klawiatura)

### Cechy charakterystyczne

- **Wbudowany enkoder RFID UHF** – programowanie tagów podczas druku
- **Kolorowy wyświetlacz dotykowy** z intuicyjnym interfejsem
- **RFID Wizard** – kreator konfiguracji RFID
- Antena RFID z wieloma elementami (A1-A4, B1-B4)
- Regulowana moc odczytu i zapisu RFID
- Automatyczna kalibracja pozycji tagu RFID
- Metalowa konstrukcja przemysłowa
`
      },
      {
        title: '2. Specyfikacja RFID',
        content: `
### Obsługiwane standardy

- **EPC Class 1 Gen2** – podstawowy standard UHF RFID
- **EPC Gen 2 V2** – rozszerzony standard z dodatkowymi funkcjami
- **ISO 18000-6C** – międzynarodowy standard UHF

### Parametry techniczne RFID

- **Pasmo EU:** 865-868 MHz
- **Pasmo US:** 902-928 MHz
- **Moc odczytu:** 0-30 (regulowana)
- **Moc zapisu:** 0-30 (regulowana)
- **Elementy anteny:** A1, A2, A3, A4, B1, B2, B3, B4
- **Pozycja programowania:** Regulowana (F0-Fxxx lub B0-B30)

### Typy obsługiwanych tagów

- Tagi z chipami zgodnymi z EPC Gen2
- **Smart labels** (etykiety z wbudowanym chipem RFID)
- Tagi na różnych materiałach (papier, folia, PET)
- Tagi o różnych rozmiarach i pozycjach inlay
`
      },
      {
        title: '3. Wyświetlacz dotykowy',
        content: `
### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki i umożliwia dostęp do wszystkich funkcji, w tym statusu RFID.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

- **Menu** – dostęp do wszystkich ustawień (w tym RFID)
- **Wizards** – kreatory konfiguracji (w tym RFID Wizard)
- **Shortcuts** – skróty do ulubionych pozycji
- **Printer Info** – informacje o drukarce i statusie RFID

### Wskaźniki LED

- **STATUS** – ogólny stan drukarki
- **PAUSE** – drukarka wstrzymana
- **DATA** – odbieranie/przetwarzanie danych
- **SUPPLIES** – stan materiałów (etykiety, ribbon)
- **NETWORK** – stan połączenia sieciowego

### Przyciski fizyczne

- **PAUSE** – wstrzymanie/wznowienie druku
- **FEED** – wysuw jednej etykiety
- **CANCEL** – anulowanie zadań druku
`
      },
      {
        title: '4. Ładowanie materiałów RFID',
        content: `
### Materiały RFID (Smart Labels)

Smart labels to etykiety z wbudowanym chipem RFID (inlay). Przy ładowaniu należy zwrócić uwagę na:

- **Pozycję inlay** – chip musi znajdować się w odpowiednim miejscu względem anteny
- **Kierunek podawania** – zgodnie ze specyfikacją materiału
- **Odstępy między tagami** – zapewniające indywidualne programowanie

### Procedura ładowania materiału RFID

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę (zwolnij głowicę)
3. Odsuń prowadnicę materiału
4. Włóż rolkę smart labels:
   - Umieść na wieszaku, dociśnij do tyłu
   - Upewnij się, że materiał jest prawidłowo zorientowany
5. Podnieś prowadnicę i dosuń do krawędzi rolki
6. Przeprowadź materiał:
   - Przez szczelinę czujnika transmisyjnego
   - Pod wewnętrzną prowadnicą
   - Materiał powinien przechodzić nad anteną RFID
7. Dosuń zewnętrzną prowadnicę do krawędzi materiału
8. Zamknij głowicę
9. Zamknij drzwi
10. **Przeprowadź kalibrację RFID**

> **Uwaga:** Użycie ribbonu nie wpływa na działanie RFID. Wybierz ribbon odpowiedni dla drukowanego materiału.
`
      },
      {
        title: '5. Menu RFID',
        content: `
### Dostęp do menu RFID

**Menu > RFID**

### RFID Status

Wyświetla aktualny stan podsystemu RFID:
- Stan połączenia z enkoderem
- Ostatni błąd RFID
- Liczniki tagów

**SGD:** rfid.error.response

### RFID Test

Testuje odczyt i zapis do tagu RFID bez przesuwania materiału:

1. Umieść etykietę z tagiem nad anteną RFID
2. Dotknij **Start**
3. Wynik testu pojawi się na ekranie

### RFID Calibrate

**Kalibracja pozycji tagu** – kluczowa procedura dla nowego materiału RFID:

1. Załaduj materiał RFID
2. Wykonaj standardową kalibrację mediów
3. Zamknij głowicę i wysuń jedną etykietę
4. Dotknij **Menu > RFID > RFID Calibrate**
5. Drukarka automatycznie:
   - Przesunie materiał
   - Określi optymalną pozycję programowania
   - Dobierze element anteny
   - Ustali moc odczytu/zapisu

### Read Power / Write Power

Ręczne ustawienie mocy odczytu/zapisu RFID:
- **Zakres:** 0-30

### RFID Antenna

Wybór elementu anteny do programowania:
- **Dostępne elementy:** A1, A2, A3, A4, B1, B2, B3, B4

### RFID Program Position

Ręczne ustawienie pozycji programowania tagu:
- **F0-Fxxx** – przesunięcie do przodu (mm)
- **B0-B30** – przesunięcie do tyłu (backfeed)
`
      },
      {
        title: '6. Kalibracja RFID',
        content: `
### Kiedy przeprowadzić kalibrację RFID?

- Przy pierwszym użyciu nowego typu materiału RFID
- Po zmianie materiału na inny typ smart labels
- Gdy występują problemy z programowaniem tagów
- Po wymianie głowicy drukującej

### Procedura kalibracji RFID

1. **Załaduj materiał RFID** do drukarki
2. **Wykonaj standardową kalibrację mediów:**
   - Menu > Print > Sensors > Manual Calibration
3. **Zamknij głowicę** i wysuń co najmniej jedną etykietę (FEED)
4. **Uruchom kalibrację RFID:**
   - Menu > RFID > RFID Calibrate
5. **Poczekaj** – drukarka automatycznie:
   - Przesunie materiał w obu kierunkach
   - Przetestuje różne pozycje programowania
   - Dobierze optymalny element anteny
   - Ustali moc odczytu i zapisu
6. **Sprawdź wyniki** na ekranie
7. **Wykonaj test** (RFID Test) dla potwierdzenia

### Wskazówki dla kalibracji RFID

- Pozostaw puste podkłady etykiet wystawające z przodu drukarki
- Nie przerywaj procesu kalibracji
- Jeśli kalibracja automatyczna zawiedzie, spróbuj ustawień ręcznych
- Zanotuj optymalne ustawienia dla danego materiału
`
      },
      {
        title: '7. Kreatory konfiguracji',
        content: `
### RFID Wizard

Dedykowany kreator dla konfiguracji RFID:

1. Dotknij **Wizards > RFID**
2. Postępuj zgodnie z instrukcjami na ekranie:
   - Załaduj materiał RFID
   - Wykonaj kalibrację mediów
   - Wykonaj kalibrację RFID
   - Przetestuj programowanie tagu

### Pozostałe kreatory

- **Set All Wizard** – uruchamia wszystkie kreatory (w tym RFID)
- **System Wizard** – ustawienia systemowe
- **Connection Wizard** – konfiguracja połączeń sieciowych
- **Print Wizard** – konfiguracja parametrów druku
`
      },
      {
        title: '8. Programowanie RFID (ZPL)',
        content: `
### Podstawowe komendy RFID

- **^RF** – odczyt danych z tagu
- **^RM** – włączenie trybu RFID Mirror
- **^RN** – włączenie trybu RFID bez VOID
- **^RR** – odczyt tagu i zwrot do hosta
- **^RT** – tryb testowy RFID
- **^RW** – ustawienie parametrów RFID (moc, antena)
- **^RS** – konfiguracja RFID (pozycja, próby)
- **^HR** – kalibracja tagu RFID
- **^HL** – status RFID

### Przykładowy format etykiety z RFID

    ^XA
    ^RS8,0,0,1,N,10,3,5000,5000
    ^RFW,H^FD1234567890ABCDEF^FS
    ^FO50,50^A0N,30,30^FDProdukt ABC^FS
    ^FO50,100^BY2^BCN,100,Y,N,N^FD123456789^FS
    ^XZ

**Objaśnienie:**
- ^RS – konfiguracja RFID (antena, moc, próby)
- ^RFW,H – zapis danych hex do tagu
- ^FD – dane do zapisania

### Obsługa błędów RFID

- **RFID ERROR** – błąd komunikacji z tagiem → sprawdź pozycję, wykonaj kalibrację
- **VOID TAG** – tag uszkodzony lub brak tagu → wymień etykietę
- **WRITE FAILED** – błąd zapisu → zwiększ moc zapisu, sprawdź tag
`
      },
      {
        title: '9. Rozwiązywanie problemów RFID',
        content: `
### Typowe problemy i rozwiązania

- **Brak programowania tagów** → Wykonaj kalibrację RFID
- **Częste VOID** → Zwiększ RFID Write Power
- **Nieczytelne tagi** → Zwiększ RFID Read Power
- **Programowanie sąsiedniego tagu** → Zmniejsz moc, zmień antenę
- **Sporadyczne błędy** → Sprawdź otoczenie, oddal inne urządzenia RFID
- **Wszystkie tagi VOID** → Sprawdź inną partię etykiet

### Sprawdzanie statusu RFID

1. **Menu > RFID > RFID Status** – wyświetla aktualny stan
2. **Menu > RFID > RFID Test** – test pojedynczego tagu
3. **Menu > RFID > Read RFID Data** – odczyt danych z tagu

### Diagnostyka ZPL

Wyślij do drukarki komendę: ~HL

Drukarka zwróci status podsystemu RFID.

### Druk etykiety konfiguracji RFID

**Menu > System > Settings > Print: System Settings**

Etykieta konfiguracji zawiera aktualne ustawienia RFID:
- Moc odczytu/zapisu
- Wybrany element anteny
- Pozycja programowania
- Liczniki tagów
`
      },
      {
        title: '10. Konserwacja',
        content: `
### Harmonogram czyszczenia

- **Głowica drukująca** – co 1 rolkę ribbonu / materiału DT
- **Wałek dociskowy** – co 1 rolkę ribbonu / materiału DT
- **Czujniki** – co 1 rolkę
- **Antena RFID** – w razie problemów z programowaniem

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Otwórz drzwi i wyjmij ribbon oraz materiał
2. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem (99,7%)
3. Przetrzyj wałek dociskowy obracając go ręcznie
4. Poczekaj aż wyschnie
5. Załaduj materiał i ribbon

### Czyszczenie obszaru RFID

- Użyj sprężonego powietrza do usunięcia pyłu z obszaru anteny
- Nie używaj płynów bezpośrednio na antenie RFID
- Regularnie sprawdzaj czy nie ma zanieczyszczeń w ścieżce materiału

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT231R?

**Odpowiedź:** Zebra ZT231R to **przemysłowa drukarka etykiet** z wbudowanym **enkoderem RFID UHF**. Łączy funkcje drukarki ZT231 (kolorowy wyświetlacz dotykowy) z możliwością programowania tagów RFID podczas drukowania etykiet.

### Jakie standardy RFID obsługuje ZT231R?

**Odpowiedź:** ZT231R obsługuje **EPC Class 1 Gen2**, **EPC Gen 2 V2** oraz **ISO 18000-6C**. Pasmo dla EU: 865-868 MHz.

### Jak skalibrować RFID w drukarce ZT231R?

**Odpowiedź:** Menu > RFID > RFID Calibrate. Drukarka automatycznie dobierze pozycję programowania, element anteny i moc odczytu/zapisu.

### Co to są smart labels?

**Odpowiedź:** Smart labels to etykiety z wbudowanym chipem RFID (inlay). Drukarka ZT231R może jednocześnie drukować na etykiecie i programować chip RFID.

### Jak zwiększyć skuteczność programowania tagów?

**Odpowiedź:** Wykonaj kalibrację RFID, zwiększ moc zapisu (Write Power), sprawdź czy tag jest prawidłowo pozycjonowany względem anteny.

### Dlaczego tagi są oznaczane jako VOID?

**Odpowiedź:** Tag może być uszkodzony, źle pozycjonowany lub moc zapisu jest zbyt niska. Spróbuj zwiększyć RFID Write Power lub wykonaj ponownie kalibrację RFID.

### Jaka jest różnica między ZT231 a ZT231R?

**Odpowiedź:** **ZT231R** posiada wbudowany **enkoder RFID UHF** do programowania tagów. Standardowy **ZT231** nie ma funkcji RFID.

### Czy mogę używać zwykłych etykiet w ZT231R?

**Odpowiedź:** Tak, ZT231R działa jak normalna drukarka etykiet. Funkcja RFID jest używana tylko gdy drukujesz na smart labels i wysyłasz komendy programowania RFID.
`
      }
    ]
  },

  'zt231': {
    model: 'ZT231',
    title: 'Zebra ZT231 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT231 User Guide',
    keywords: [
      'zebra zt231 instrukcja',
      'zt231 instrukcja po polsku',
      'zebra zt231 manual',
      'drukarka zebra zt231',
      'zebra zt231 kalibracja',
      'zt231 kalibracja czujników',
      'zebra zt231 ribbon',
      'zt231 zakładanie taśmy',
      'zebra zt231 etykiety',
      'zt231 ładowanie etykiet',
      'zebra zt231 wyświetlacz dotykowy',
      'zt231 touchscreen',
      'zebra zt231 specyfikacja',
      'zt231 parametry techniczne',
      'zebra zt231 sterowniki',
      'zt231 wifi ethernet'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT231

Zebra ZT231 to drukarka przemysłowa nowej generacji, następca popularnego modelu ZT230. Wyposażona w **kolorowy wyświetlacz dotykowy** oferuje intuicyjny interfejs z systemem menu, kreatorami konfiguracji i skrótami do ulubionych funkcji.

### Parametry techniczne

- **Technologia druku:** Termotransferowy / termiczny bezpośredni
- **Rozdzielczość:** 203 dpi lub 300 dpi
- **Prędkość druku:** do 356 mm/s (14 cali/s)
- **Szerokość druku:** do 104 mm (4,09 cala)
- **Maks. średnica rolki:** 203 mm (8 cali)
- **Średnica gilzy:** 25 mm – 76 mm (1" – 3")
- **Długość ribbonu:** do 450 m

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 RJ-45 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth (opcja)
- USB Host (pendrive, skaner, klawiatura)

### Cechy charakterystyczne

- **Kolorowy wyświetlacz dotykowy** z intuicyjnym interfejsem
- Kreatory konfiguracji (Print Wizard, System Wizard, Connection Wizard)
- System skrótów i ulubionych
- Metalowa konstrukcja przemysłowa
- 5 wskaźników LED statusu
- Opcjonalny obcinacz, dispenser lub nawijak podkładu
- Zgodność z dyrektywą EU RED (od 08/2025)
`
      },
      {
        title: '2. Wyświetlacz dotykowy',
        content: `
### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki i umożliwia dostęp do wszystkich funkcji. Możesz obracać widok drukarki o 360° dotykając i przeciągając.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

- **Menu** – dostęp do wszystkich ustawień drukarki
- **Wizards** – kreatory konfiguracji krok po kroku
- **Shortcuts** – skróty do ostatnio używanych i ulubionych pozycji
- **Printer Info** – informacje o drukarce (IP, status, liczniki)

### Zapisywanie ulubionych

Dotknij ikony serca obok pozycji menu, aby dodać ją do ulubionych.

### Wskaźniki LED

- **STATUS** – ogólny stan drukarki
- **PAUSE** – drukarka wstrzymana
- **DATA** – odbieranie/przetwarzanie danych
- **SUPPLIES** – stan materiałów (etykiety, ribbon)
- **NETWORK** – stan połączenia sieciowego

### Przyciski fizyczne

- **PAUSE** – wstrzymanie/wznowienie druku
- **FEED** – wysuw jednej etykiety
- **CANCEL** – anulowanie (1x = następna, 2 sek. = wszystkie)
`
      },
      {
        title: '3. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby obsługi materiału

- **Tear Off** – ręczne odrywanie (domyślny)
- **Peel Off** – automatyczne odklejanie (wymaga dispensera)
- **Liner Take-Up** – nawijanie podkładu (wymaga nawijaka)
- **Cutter** – automatyczne cięcie (wymaga obcinacza)

### Ładowanie ribbonu (Thermal Transfer)

> **Uwaga:** Sprawdź czy materiał wymaga ribbonu – przesuń paznokciem po powierzchni. Czarny ślad = Direct Thermal (bez ribbonu).

1. Otwórz drzwi komory mediów
2. Załaduj rolkę ribbonu na dolną gilzę (podającą)
3. Sprawdź pustą gilzę na górnej gilzie (odbiorczej)
4. Przeprowadź ribbon pod głowicą drukującą
5. Nawiń ribbon na gilzę odbiorczą (kilka zwojów)
6. Zamknij głowicę (po załadowaniu materiału)

> **Ważne:** Ribbon musi być szerszy niż materiał!

### Ładowanie materiału (tryb Tear-Off)

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę (zwolnij głowicę)
3. Odsuń prowadnicę materiału
4. Włóż rolkę na wieszak, dociśnij do tyłu
5. Podnieś prowadnicę i dosuń do krawędzi rolki
6. Przeprowadź materiał przez szczelinę czujnika
7. Dosuń zewnętrzną prowadnicę do krawędzi materiału
8. Zamknij głowicę (dźwignia w dół)
9. Zamknij drzwi
10. Naciśnij **PAUSE** aby umożliwić drukowanie
`
      },
      {
        title: '4. Kreatory konfiguracji',
        content: `
### Dostępne kreatory (Wizards)

Dotknij **Wizards** na ekranie głównym:

- **Set All Wizard** – uruchamia wszystkie kreatory po kolei
- **System Wizard** – ustawienia systemowe (język, hasło)
- **Connection Wizard** – konfiguracja połączeń sieciowych
- **Print Wizard** – konfiguracja parametrów druku

### Print Wizard – krok po kroku

1. Dotknij **Wizards > Print > Start Print**
2. Wybierz typ druku: **Thermal Transfer** lub **Direct Thermal**
3. Wybierz typ etykiety: **Continuous**, **Gap/Notch** lub **Mark**
4. Podaj szerokość etykiety
5. Wybierz tryb obsługi (Tear Off, Peel Off, Cutter...)
6. Załaduj materiał zgodnie z instrukcjami na ekranie
7. Ustaw etykietę nad czujnikiem (zielone światło)
8. Zamknij głowicę
9. Drukarka wykona kalibrację
10. Wydrukuj etykietę testową

### Print Quality Assistance

Kreator jakości druku pomaga dobrać optymalne ustawienia:

1. Wybierz liczbę etykiet testowych
2. Drukarka wydrukuje serie etykiet z różnymi ustawieniami
3. Wybierz numer etykiety z najlepszą jakością
4. Drukarka automatycznie zastosuje te ustawienia
`
      },
      {
        title: '5. Menu użytkownika',
        content: `
### System Menu

- **Language** – wybór języka (w tym polski)
- **Program Language** – tryb diagnostyczny, język poleceń
- **Settings** – format czasu, hasło, akcje przy włączeniu
- **Energy Saving** – tryb oszczędzania energii

### Connection Menu

- **Networks** – reset sieci, sieć podstawowa, porty IP
- **Wired** – ustawienia Ethernet (IP, maska, brama)
- **Wi-Fi** – ustawienia bezprzewodowe (ESSID, bezpieczeństwo)
- **Bluetooth** – włączanie BT, wykrywalność, parowanie

### Print Menu

- **Print Quality** – ciemność, prędkość, typ druku
- **Image Adjust** – tryb obsługi, pozycja odrywania
- **Sensors** – kalibracja ręczna, typ czujnika

### Storage Menu

- **USB** – kopiowanie plików z/na USB
- **Print Asset Lists** – drukowanie list formatów, obrazów
- **Print from E:** – drukowanie plików z pamięci drukarki
`
      },
      {
        title: '6. Kalibracja',
        content: `
### Kalibracja automatyczna

Drukarka może automatycznie kalibrować czujniki przy:
- **Włączeniu** (Power Up Action = CALIBRATE)
- **Zamknięciu głowicy** (Head Close Action = CALIBRATE)

Ustaw w: **Menu > System > Settings > Power Up Action / Head Close Action**

### Kalibracja ręczna

1. Dotknij **Menu > Print > Sensors > Manual Calibration**
2. Dotknij **Start Calibration**
3. Postępuj zgodnie z instrukcjami na ekranie:
   - Załaduj ribbon (jeśli używany)
   - Załaduj materiał
   - Otwórz głowicę
   - Wysuń materiał
   - Ustaw etykietę nad czujnikiem
   - Zamknij głowicę
4. Drukarka przeprowadzi kalibrację
5. Naciśnij **PAUSE** aby wyjść z trybu pauzy

### Regulacja docisku głowicy

Pokrętła regulacji docisku mają oznaczenia 1-4:

- Szerokość ≥ 89 mm → wewnętrzne: 2, zewnętrzne: 2
- Szerokość 76 mm → wewnętrzne: 2.5, zewnętrzne: 1.5
- Szerokość 51 mm → wewnętrzne: 3, zewnętrzne: 1
- Szerokość 25 mm → wewnętrzne: 4, zewnętrzne: 1
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki z [naszej strony](/sterowniki)
2. Uruchom instalator
3. Wybierz model ZT231
4. Podłącz drukarkę gdy kreator o to poprosi

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB do drukarki
3. Podłącz kabel USB do komputera
4. Włącz drukarkę
5. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Zainstaluj sterowniki
2. Podłącz kabel sieciowy RJ-45
3. Włącz drukarkę
4. Drukarka automatycznie pobierze IP z DHCP
5. Sprawdź IP: **Printer Info** na ekranie głównym
6. Dodaj drukarkę w systemie Windows

### Połączenie Wi-Fi

1. Połącz się najpierw przez USB lub Ethernet
2. Skonfiguruj ESSID: **Menu > Connection > Wi-Fi > ESSID**
3. Ustaw zabezpieczenia
4. Wykonaj reset sieci: **Menu > Connection > Networks > Reset Network**
`
      },
      {
        title: '8. Konserwacja',
        content: `
### Harmonogram czyszczenia

- **Głowica drukująca** – co 1 rolkę ribbonu / materiału DT
- **Wałek dociskowy** – co 1 rolkę ribbonu / materiału DT
- **Czujniki** – co 1 rolkę
- **Ścieżka materiału/ribbonu** – co 1 rolkę
- **Dispenser** – w razie problemów z odklejaniem
- **Obcinacz** – w razie problemów z cięciem

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Otwórz drzwi i wyjmij ribbon oraz materiał
2. Przetrzyj brązowy pasek głowicy wacikiem z alkoholem (99,7%)
3. Przetrzyj wałek dociskowy obracając go ręcznie
4. Poczekaj aż wyschnie
5. Załaduj materiał i ribbon

### Czyszczenie obcinacza

> **Ostrzeżenie:** Wyłącz drukarkę i odłącz zasilanie!

1. Zdejmij osłonę obcinacza (śruba motylkowa)
2. Obróć pokrętło aby odsłonić ostrze V
3. Wyczyść ostrze wacikiem z alkoholem
4. Po wyschnięciu nasmaruj ostrze olejem silikonowym
5. Załóż osłonę

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu

- **PAPER OUT** → Załaduj materiał
- **RIBBON OUT** → Załaduj ribbon
- **HEAD OPEN** → Zamknij głowicę
- **HEAD OVER TEMP** → Poczekaj na ostygnięcie
- **HEAD UNDER TEMP** → Przenieś w cieplejsze miejsce

### Problemy z jakością druku

- **Blade wydruki** → Zwiększ Darkness, wyczyść głowicę
- **Przepalone wydruki** → Zmniejsz Darkness, zwiększ Speed
- **Puste obszary** → Wyczyść lub wymień głowicę
- **Marszczenie ribbonu** → Sprawdź naprężenie, wyczyść ścieżkę

### Druk etykiety konfiguracji

**Menu > System > Settings > Print: System Settings**

Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

### Druk profilu czujników

**Menu > Print > Sensors > Print: Sensor Profile**

Lub: przytrzymaj **FEED + CANCEL** podczas włączania drukarki

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT231?

**Odpowiedź:** Zebra ZT231 to **drukarka przemysłowa** nowej generacji z **kolorowym wyświetlaczem dotykowym**. Jest następcą popularnego modelu ZT230, oferując intuicyjny interfejs z kreatorami konfiguracji.

### Jaka jest różnica między ZT230 a ZT231?

**Odpowiedź:** **ZT231** ma **kolorowy wyświetlacz dotykowy** z kreatorami konfiguracji. **ZT230** ma tradycyjny **wyświetlacz LCD** z przyciskami. Specyfikacje druku są zbliżone.

### Jak skalibrować drukarkę Zebra ZT231?

**Odpowiedź:** Menu > Print > Sensors > Manual Calibration > Start Calibration. Postępuj zgodnie z instrukcjami na ekranie dotykowym.

### Jak zmienić język na polski w ZT231?

**Odpowiedź:** Menu > System > Language > Polski. Drukarka automatycznie zmieni język interfejsu.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZT231?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZT231 wynosi **356 mm/s (14 cali/s)**.

### Jak wydrukować raport konfiguracji na ZT231?

**Odpowiedź:** Menu > System > Settings > Print: System Settings. Lub przytrzymaj **FEED + CANCEL** przez 2 sekundy.

### Czy ZT231 obsługuje WiFi i Bluetooth?

**Odpowiedź:** Tak, WiFi 802.11a/b/g/n/ac i Bluetooth są dostępne jako **opcja**. Sprawdź konfigurację swojej drukarki.

### Jaka jest różnica między ZT231 a ZT231R?

**Odpowiedź:** **ZT231R** posiada wbudowany **enkoder RFID UHF** do programowania tagów. Standardowy **ZT231** nie ma funkcji RFID.
`
      }
    ]
  },

  'zt411': {
    model: 'ZT411',
    title: 'Zebra ZT411 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT411 User Guide',
    keywords: [
      'zebra zt411 instrukcja',
      'zt411 instrukcja po polsku',
      'zebra zt411 manual',
      'drukarka zebra zt411',
      'zebra zt411 kalibracja',
      'zt411 kalibracja czujników',
      'zebra zt411 ribbon',
      'zt411 zakładanie taśmy',
      'zebra zt411 etykiety',
      'zt411 ładowanie etykiet',
      'zebra zt411 wyświetlacz dotykowy',
      'zt411 touchscreen',
      'zebra zt411 specyfikacja',
      'zt411 parametry techniczne',
      'zebra zt411 sterowniki',
      'zt411 wifi ethernet',
      'zebra zt411 linerless',
      'zt411 obcinacz'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT411

Zebra ZT411 to przemysłowa drukarka etykiet nowej generacji, następca popularnego modelu ZT410. Wyposażona w **kolorowy wyświetlacz dotykowy 4,3"** oferuje intuicyjny interfejs z systemem menu, kreatorami konfiguracji i skrótami do ulubionych funkcji.

### Parametry techniczne

- **Szerokość druku:** do 104 mm (4,09")
- **Technologia druku:** Termotransferowy / termiczny bezpośredni
- **Rozdzielczość:** 203 dpi, 300 dpi lub 600 dpi
- **Prędkość druku:** do 356 mm/s (14"/s) dla 203/300 dpi
- **Maks. średnica rolki:** 203 mm (8")
- **Średnica gilzy:** 25 mm – 76 mm (1" – 3")
- **Długość ribbonu:** do 450 m

### Rozdzielczości i szerokości druku

- **203 dpi:** 832 dots (104 mm)
- **300 dpi:** 1248 dots (106 mm)
- **600 dpi:** 2496 dots (106 mm)

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 RJ-45 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 (opcja)
- Parallel LPT (opcja)
- USB Host (2x) – pendrive, skaner, klawiatura

### Cechy charakterystyczne

- **Kolorowy wyświetlacz dotykowy 4,3"** z wizualizacją 3D
- Kreatory konfiguracji (Print Wizard, System Wizard)
- Opcjonalny obcinacz standardowy lub linerless
- Opcjonalny dispenser z nawijakiem podkładu
- Opcjonalny nawijak mediów (Rewind)
- Ruchomy czujnik mediów
- Print Touch (NFC) do szybkiego parowania
- Zgodność z dyrektywą EU RED (od 08/2025)
`
      },
      {
        title: '2. Wyświetlacz dotykowy',
        content: `
### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki z **wizualizacją 3D** którą można obracać o 360°.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

- **Menu** – dostęp do wszystkich ustawień drukarki
- **Wizards** – kreatory konfiguracji krok po kroku
- **Shortcuts** – skróty do ostatnio używanych i ulubionych
- **Printer Info** – informacje o drukarce (IP, status, liczniki)

### Zapisywanie ulubionych

Dotknij ikony serca obok pozycji menu, aby dodać ją do ulubionych.

### Wskaźniki LED

- **STATUS** – ogólny stan drukarki
- **PAUSE** – drukarka wstrzymana
- **DATA** – odbieranie/przetwarzanie danych
- **SUPPLIES** – stan materiałów (etykiety, ribbon)
- **NETWORK** – stan połączenia sieciowego

### Przyciski fizyczne

- **PAUSE** – wstrzymanie/wznowienie druku
- **FEED** – wysuw jednej etykiety
- **CANCEL** – anulowanie (1x = następna, 2 sek. = wszystkie)
`
      },
      {
        title: '3. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet
- **Materiał linerless** – etykiety bez podkładu

### Tryby obsługi materiału

- **Tear Off** – ręczne odrywanie (domyślny)
- **Peel Off** – automatyczne odklejanie (wymaga dispensera)
- **Liner Take-Up** – nawijanie podkładu
- **Rewind** – nawijanie całych etykiet na rolkę
- **Cutter** – automatyczne cięcie
- **Linerless Cut** – cięcie etykiet bez podkładu

### Ładowanie materiału (tryb Tear-Off)

1. Podnieś drzwi komory mediów
2. Otwórz głowicę – obróć dźwignię w górę
3. Odsuń prowadnicę materiału na zewnątrz
4. Włóż rolkę na wieszak, dociśnij do tyłu
5. Przeprowadź materiał:
   - Od wieszaka pod zespołem tancerza
   - Przez czujnik mediów
   - Pod głowicą drukującą
6. Dosuń prowadnicę do krawędzi materiału
7. Zamknij głowicę (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie ribbonu (Thermal Transfer)

> **Uwaga:** Sprawdź czy materiał wymaga ribbonu – przesuń paznokciem po powierzchni. Czarny ślad = Direct Thermal (bez ribbonu).

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. Załaduj rolkę ribbonu na dolną gilzę (podającą)
4. Przeprowadź ribbon pod głowicą i wokół jej lewej strony
5. Nawiń ribbon na górną gilzę (odbiorczą) – kilka zwojów
6. Zamknij głowicę

> **Ważne:** Ribbon musi być szerszy niż materiał!
`
      },
      {
        title: '4. Kreatory konfiguracji',
        content: `
### Dostępne kreatory (Wizards)

Dotknij **Wizards** na ekranie głównym:

- **Set All Wizard** – uruchamia wszystkie kreatory po kolei
- **System Wizard** – ustawienia systemowe (język, hasło)
- **Connection Wizard** – konfiguracja połączeń sieciowych
- **Print Wizard** – konfiguracja parametrów druku
- **RFID Wizard** – konfiguracja RFID (tylko ZT411R)

### Print Wizard – krok po kroku

1. Dotknij **Wizards > Print > Start Print**
2. Wybierz typ druku: **Thermal Transfer** lub **Direct Thermal**
3. Wybierz typ etykiety: **Continuous**, **Gap/Notch** lub **Mark**
4. Podaj szerokość etykiety
5. Wybierz tryb obsługi (Tear Off, Peel Off, Rewind, Cutter...)
6. Załaduj materiał zgodnie z instrukcjami na ekranie
7. Ustaw etykietę nad czujnikiem (zielone światło)
8. Zamknij głowicę
9. Drukarka wykona kalibrację
10. Wydrukuj etykietę testową

### Print Quality Assistance

Kreator jakości druku pomaga dobrać optymalne ustawienia:

1. Wybierz liczbę etykiet testowych
2. Drukarka wydrukuje serie z różnymi ustawieniami
3. Wybierz numer etykiety z najlepszą jakością
4. Drukarka automatycznie zastosuje te ustawienia
`
      },
      {
        title: '5. Menu użytkownika',
        content: `
### System Menu

- **Language** – wybór języka (w tym polski)
- **Program Language** – tryb diagnostyczny, Virtual Device, ZBI
- **Settings** – format czasu, hasło, akcje przy włączeniu
- **Energy Saving** – tryb oszczędzania energii

### Connection Menu

- **Networks** – reset sieci, sieć podstawowa, porty IP
- **Wired** – ustawienia Ethernet (IP, maska, brama)
- **WLAN** – ustawienia Wi-Fi (ESSID, bezpieczeństwo)
- **Bluetooth** – włączanie BT, wykrywalność, parowanie

### Print Menu

- **Print Quality** – ciemność (0-30), prędkość, typ druku
- **Image Adjust** – tryb obsługi, pozycja odrywania, backfeed
- **Sensors** – kalibracja ręczna, czułość czujnika

### Storage Menu

- **USB** – kopiowanie plików z/na USB
- **Print Asset Lists** – drukowanie list formatów, obrazów
- **Print from E:** – drukowanie plików z pamięci drukarki
`
      },
      {
        title: '6. Kalibracja',
        content: `
### Kalibracja automatyczna

Drukarka może automatycznie kalibrować czujniki przy:
- **Włączeniu** (Power Up Action = CALIBRATE)
- **Zamknięciu głowicy** (Head Close Action = CALIBRATE)

Ustaw w: **Menu > System > Settings > Power Up Action / Head Close Action**

Opcje:
- **CALIBRATE** – pełna kalibracja
- **SHORT CAL** – szybka kalibracja (tylko progi)
- **FEED** – tylko wysuw do pierwszego punktu rejestracji
- **NO MOTION** – brak ruchu

### Kalibracja ręczna

1. Dotknij **Menu > Print > Sensors > Manual Calibration**
2. Dotknij **Start Calibration**
3. Postępuj zgodnie z instrukcjami na ekranie:
   - Załaduj ribbon (jeśli używany)
   - Załaduj materiał
   - Otwórz głowicę
   - Ustaw etykietę nad czujnikiem
   - Zamknij głowicę
4. Drukarka przeprowadzi kalibrację
5. Naciśnij **PAUSE** aby wyjść z trybu pauzy

### Regulacja docisku głowicy

Pokrętła regulacji docisku mają oznaczenia 1-4:

- Szerokość 25 mm → wewnętrzne: 4, zewnętrzne: 1
- Szerokość 51 mm → wewnętrzne: 3, zewnętrzne: 1
- Szerokość 76 mm → wewnętrzne: 2.5, zewnętrzne: 1.5
- Szerokość ≥ 89 mm → wewnętrzne: 2, zewnętrzne: 2

### Ruchomy czujnik mediów

ZT411 posiada **ruchomy czujnik mediów**. Przesuń czujnik w poziomie aby dopasować do pozycji przerw/nacięć na materiale.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### EU RED – Protected Mode (EMEA od 1.08.2025)

Drukarki Zebra ZT411 sprzedawane w regionie EMEA od **1 sierpnia 2025** z Wi-Fi lub Bluetooth wymagają:
- Ustawienia hasła Protected Mode
- Skonfigurowania PIN panelu przedniego
- Wykonania powyższych kroków **przed** konfiguracją sieciową

Więcej informacji: [Dyrektywa EU RED – konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki z [naszej strony](/sterowniki)
2. Uruchom instalator
3. Wybierz model ZT411
4. Podłącz drukarkę gdy kreator o to poprosi

### Identyfikacja rozdzielczości

Na naklejce z numerem części: **ZT411xY-xxxxxxxx**
- Y = 2 → 203 dpi
- Y = 3 → 300 dpi
- Y = 6 → 600 dpi

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Zainstaluj sterowniki
2. Podłącz kabel sieciowy RJ-45
3. Włącz drukarkę
4. Drukarka automatycznie pobierze IP z DHCP
5. Sprawdź IP: **Printer Info** na ekranie głównym

### Połączenie Wi-Fi

1. Połącz się najpierw przez USB lub Ethernet
2. Skonfiguruj ESSID: **Menu > Connection > WLAN > ESSID**
3. Ustaw zabezpieczenia
4. Wykonaj reset sieci

### Print Touch (NFC)

Zbliż telefon z aplikacją Zebra Printer Setup Utility do logo Print Touch na drukarce aby szybko sparować urządzenie.
`
      },
      {
        title: '8. Konserwacja',
        content: `
### Harmonogram czyszczenia

- **Głowica drukująca** – co 1 rolkę ribbonu / materiału DT
- **Wałek dociskowy (platen)** – co 1 rolkę ribbonu / materiału DT
- **Czujniki** – co 1 rolkę
- **Obcinacz standardowy** – co 1-3 rolki
- **Obcinacz linerless** – co 1-3 rolki
- **Dispenser** – w razie problemów z odklejaniem

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Otwórz drzwi i wyjmij ribbon oraz materiał
2. **Głowica:** Przetrzyj brązowy pasek wacikiem z alkoholem (99,7%)
3. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
4. Poczekaj aż wyschnie
5. Załaduj materiał i ribbon

### Czyszczenie obcinacza standardowego

> **Ostrzeżenie:** Wyłącz drukarkę i odłącz zasilanie!

1. Usuń materiał z obcinacza
2. Zdejmij osłonę obcinacza (śruba motylkowa)
3. Obróć pokrętło silnika aby odsłonić ostrze V
4. Wyczyść ostrze wacikiem z alkoholem
5. Po wyschnięciu nasmaruj ostrze olejem silikonowym
6. Załóż osłonę

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu

- **PAPER OUT** → Załaduj materiał
- **RIBBON OUT** → Załaduj ribbon
- **HEAD OPEN** → Zamknij głowicę
- **HEAD OVER TEMP** → Poczekaj na ostygnięcie
- **HEAD UNDER TEMP** → Przenieś w cieplejsze miejsce
- **CUTTER JAM** → Usuń zacięcie w obcinaczu

### Problemy z jakością druku

- **Blade wydruki** → Zwiększ Darkness, wyczyść głowicę
- **Przepalone wydruki** → Zmniejsz Darkness, zwiększ Speed
- **Puste obszary (pionowe linie)** → Wyczyść lub wymień głowicę
- **Marszczenie ribbonu** → Sprawdź naprężenie, wyrównaj ribbon
- **Przesuwanie się materiału** → Dostosuj docisk głowicy

### Problemy z materiałem linerless

- **Zacięcie w obcinaczu** → Wyczyść klej z ostrza
- **Materiał przykleja się** → Sprawdź kompatybilność materiału
- **Nieprawidłowe cięcie** → Nasmaruj ostrze

### Druk etykiety konfiguracji

**Menu > System > Settings > Print: System Settings**

Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT411?

**Odpowiedź:** Zebra ZT411 to **przemysłowa drukarka etykiet** nowej generacji z **kolorowym wyświetlaczem dotykowym 4,3"**. Jest następcą popularnego modelu ZT410, oferując intuicyjny interfejs z wizualizacją 3D.

### Jaka jest różnica między ZT410 a ZT411?

**Odpowiedź:** **ZT411** ma **kolorowy wyświetlacz dotykowy 4,3"** z wizualizacją 3D i kreatorami. **ZT410** ma tradycyjny wyświetlacz LCD z przyciskami. Specyfikacje druku są zbliżone.

### Jakie rozdzielczości obsługuje ZT411?

**Odpowiedź:** ZT411 jest dostępna w trzech rozdzielczościach: **203 dpi**, **300 dpi** i **600 dpi**. Sprawdź numer części drukarki (ZT411x**2** = 203 dpi, **3** = 300 dpi, **6** = 600 dpi).

### Jak skalibrować drukarkę Zebra ZT411?

**Odpowiedź:** Menu > Print > Sensors > Manual Calibration > Start Calibration. Postępuj zgodnie z instrukcjami na ekranie dotykowym.

### Jaka jest maksymalna prędkość druku drukarki Zebra ZT411?

**Odpowiedź:** Maksymalna prędkość druku Zebra ZT411 wynosi **356 mm/s (14 cali/s)** dla wersji 203 dpi i 300 dpi.

### Czy ZT411 obsługuje etykiety linerless (bez podkładu)?

**Odpowiedź:** Tak, ZT411 obsługuje etykiety linerless, ale wymaga **opcjonalnego obcinacza linerless**. Zebra zaleca materiały Zebra ZeroLiner.

### Co to jest Print Touch (NFC) w ZT411?

**Odpowiedź:** Print Touch to technologia **NFC** umożliwiająca szybkie parowanie telefonu/tabletu z drukarką. Zbliż urządzenie z aplikacją Zebra do logo Print Touch na drukarce.

### Jaka jest różnica między ZT411 a ZT411R?

**Odpowiedź:** **ZT411R** posiada wbudowany **enkoder RFID UHF** do programowania tagów. Standardowy **ZT411** nie ma funkcji RFID.
`
      }
    ]
  },

  'zt421': {
    model: 'ZT421',
    title: 'Zebra ZT421 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT421 User Guide',
    keywords: [
      'zebra zt421 instrukcja',
      'zt421 instrukcja po polsku',
      'zebra zt421 manual',
      'drukarka zebra zt421',
      'zebra zt421 kalibracja',
      'zt421 6 cali',
      'zebra zt421 ribbon',
      'zt421 zakładanie taśmy',
      'zebra zt421 etykiety',
      'zt421 ładowanie etykiet',
      'zebra zt421 wyświetlacz dotykowy',
      'zt421 touchscreen',
      'zebra zt421 specyfikacja',
      'zt421 parametry techniczne',
      'zebra zt421 sterowniki',
      'zt421 wifi ethernet',
      'zebra drukarka 6 cali',
      'drukarka etykiet paletowych'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT421

Zebra ZT421 to przemysłowa drukarka etykiet nowej generacji o **szerokości druku 6 cali (168 mm)**, następca popularnego modelu ZT420. Wyposażona w **kolorowy wyświetlacz dotykowy 4,3"** oferuje intuicyjny interfejs. Przeznaczona do drukowania **dużych etykiet wysyłkowych, palet i oznaczeń przemysłowych**.

### Parametry techniczne

- **Szerokość druku:** do 168 mm (6,6") – **szersza niż ZT411**
- **Technologia druku:** Termotransferowy / termiczny bezpośredni
- **Rozdzielczość:** 203 dpi lub 300 dpi
- **Prędkość druku:** do 305 mm/s (12"/s)
- **Maks. średnica rolki:** 203 mm (8")
- **Średnica gilzy:** 25 mm – 76 mm (1" – 3")
- **Długość ribbonu:** do 450 m
- **Maks. szerokość etykiety:** 178 mm (7")

### Porównanie ZT411 vs ZT421

- **ZT411:** szerokość druku 104 mm (4"), do 356 mm/s
- **ZT421:** szerokość druku **168 mm (6")**, do 305 mm/s

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 RJ-45 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 (opcja)
- Parallel LPT (opcja)
- USB Host (2x)

### Cechy charakterystyczne

- **Szerokość druku 6 cali (168 mm)** – idealna do dużych etykiet
- **Kolorowy wyświetlacz dotykowy 4,3"** z wizualizacją 3D
- Kreatory konfiguracji (Print Wizard, System Wizard)
- Opcjonalny obcinacz standardowy lub linerless
- Opcjonalny dispenser z nawijakiem podkładu
- Ruchomy czujnik mediów
- Print Touch (NFC)
`
      },
      {
        title: '2. Zastosowania ZT421',
        content: `
### Typowe zastosowania szerokiej drukarki 6"

Drukarka ZT421 jest idealna do:

- **Logistyka i wysyłka:** duże etykiety wysyłkowe, etykiety na palety
- **Magazynowanie:** oznaczenia regałów, lokalizacji, stref
- **Produkcja:** etykiety produktowe, WIP labels, oznaczenia partii
- **Transport:** etykiety przewozowe, dokumenty CMR
- **Retail:** etykiety cenowe wielkoformatowe, oznaczenia promocji
- **Healthcare:** etykiety na pojemniki, oznaczenia próbek

### Specyfikacja materiałów dla ZT421

- **Maks. szerokość materiału:** 178 mm (7")
- **Min. szerokość materiału:** 25 mm (1")
- **Maks. szerokość druku:** 168 mm (6,6")
- **Maks. średnica rolki:** 203 mm (8")
`
      },
      {
        title: '3. Wyświetlacz dotykowy',
        content: `
### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki z **wizualizacją 3D** którą można obracać o 360°.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

- **Menu** – dostęp do wszystkich ustawień drukarki
- **Wizards** – kreatory konfiguracji krok po kroku
- **Shortcuts** – skróty do ulubionych pozycji
- **Printer Info** – informacje o drukarce (IP, status, liczniki)

### Wskaźniki LED

- **STATUS** – ogólny stan drukarki
- **PAUSE** – drukarka wstrzymana
- **DATA** – odbieranie/przetwarzanie danych
- **SUPPLIES** – stan materiałów (etykiety, ribbon)
- **NETWORK** – stan połączenia sieciowego

### Przyciski fizyczne

- **PAUSE** – wstrzymanie/wznowienie druku
- **FEED** – wysuw jednej etykiety
- **CANCEL** – anulowanie (1x = następna, 2 sek. = wszystkie)
`
      },
      {
        title: '4. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet
- **Materiał linerless** – etykiety bez podkładu

### Tryby obsługi materiału

- **Tear Off** – ręczne odrywanie (domyślny)
- **Peel Off** – automatyczne odklejanie (wymaga dispensera)
- **Liner Take-Up** – nawijanie podkładu
- **Rewind** – nawijanie całych etykiet na rolkę
- **Cutter** – automatyczne cięcie
- **Linerless Cut** – cięcie etykiet bez podkładu

### Ładowanie materiału (tryb Tear-Off)

1. Podnieś drzwi komory mediów
2. Otwórz głowicę – obróć dźwignię w górę
3. Odsuń prowadnicę materiału na zewnątrz
4. Włóż rolkę na wieszak, dociśnij do tyłu
5. Przeprowadź materiał:
   - Od wieszaka pod zespołem tancerza
   - Przez czujnik mediów
   - Pod głowicą drukującą
6. Dosuń prowadnicę do krawędzi materiału
7. Zamknij głowicę (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie ribbonu (Thermal Transfer)

> **Uwaga:** Dla ZT421 używaj ribbonu o szerokości do 178 mm (7"). Ribbon musi być szerszy niż materiał!

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. Załaduj rolkę ribbonu na dolną gilzę (podającą)
4. Przeprowadź ribbon pod głowicą i wokół jej lewej strony
5. Nawiń ribbon na górną gilzę (odbiorczą) – kilka zwojów
6. Zamknij głowicę
`
      },
      {
        title: '5. Kreatory konfiguracji',
        content: `
### Dostępne kreatory (Wizards)

Dotknij **Wizards** na ekranie głównym:

- **Set All Wizard** – uruchamia wszystkie kreatory po kolei
- **System Wizard** – ustawienia systemowe (język, hasło)
- **Connection Wizard** – konfiguracja połączeń sieciowych
- **Print Wizard** – konfiguracja parametrów druku
- **RFID Wizard** – konfiguracja RFID (tylko ZT421R)

### Print Wizard – krok po kroku

1. Dotknij **Wizards > Print > Start Print**
2. Wybierz typ druku: **Thermal Transfer** lub **Direct Thermal**
3. Wybierz typ etykiety: **Continuous**, **Gap/Notch** lub **Mark**
4. Podaj szerokość etykiety (do **168 mm** dla ZT421)
5. Wybierz tryb obsługi (Tear Off, Peel Off, Rewind, Cutter...)
6. Załaduj materiał zgodnie z instrukcjami na ekranie
7. Ustaw etykietę nad czujnikiem (zielone światło)
8. Zamknij głowicę
9. Drukarka wykona kalibrację
10. Wydrukuj etykietę testową
`
      },
      {
        title: '6. Kalibracja',
        content: `
### Kalibracja automatyczna

Drukarka może automatycznie kalibrować czujniki przy:
- **Włączeniu** (Power Up Action = CALIBRATE)
- **Zamknięciu głowicy** (Head Close Action = CALIBRATE)

### Kalibracja ręczna

1. Dotknij **Menu > Print > Sensors > Manual Calibration**
2. Dotknij **Start Calibration**
3. Postępuj zgodnie z instrukcjami na ekranie
4. Po zakończeniu naciśnij **PAUSE**

### Regulacja docisku głowicy dla ZT421

Ze względu na **szerszą głowicę 6"**, prawidłowa regulacja docisku jest szczególnie ważna.

Pokrętła regulacji (wewnętrzne i zewnętrzne) mają oznaczenia 1-4:

- Szerokość 25-50 mm → wewnętrzne: 4, zewnętrzne: 1
- Szerokość 51-76 mm → wewnętrzne: 3, zewnętrzne: 1.5
- Szerokość 77-102 mm → wewnętrzne: 2.5, zewnętrzne: 2
- Szerokość 103-127 mm → wewnętrzne: 2, zewnętrzne: 2.5
- Szerokość 128-168 mm → wewnętrzne: 2, zewnętrzne: 3

### Ruchomy czujnik mediów

ZT421 posiada **ruchomy czujnik mediów**. Przesuń czujnik w poziomie aby dopasować do pozycji przerw/nacięć na materiale.
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### EU RED – Protected Mode (EMEA od 1.08.2025)

Drukarki Zebra ZT421 sprzedawane w regionie EMEA od **1 sierpnia 2025** z Wi-Fi lub Bluetooth wymagają:
- Ustawienia hasła Protected Mode
- Skonfigurowania PIN panelu przedniego
- Wykonania powyższych kroków **przed** konfiguracją sieciową

Więcej informacji: [Dyrektywa EU RED – konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki z [naszej strony](/sterowniki)
2. Uruchom instalator
3. Wybierz model **ZT421**
4. Podłącz drukarkę gdy kreator o to poprosi

### Identyfikacja rozdzielczości

Na naklejce z numerem części: **ZT421xY-xxxxxxxx**
- Y = 2 → 203 dpi
- Y = 3 → 300 dpi

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Zainstaluj sterowniki
2. Podłącz kabel sieciowy RJ-45
3. Włącz drukarkę
4. Sprawdź IP: **Printer Info** na ekranie głównym

### Połączenie Wi-Fi

1. Połącz się najpierw przez USB lub Ethernet
2. Skonfiguruj ESSID: **Menu > Connection > WLAN > ESSID**
3. Ustaw zabezpieczenia
4. Wykonaj reset sieci

### Print Touch (NFC)

Zbliż telefon z aplikacją Zebra do logo Print Touch na drukarce aby szybko sparować urządzenie.
`
      },
      {
        title: '8. Konserwacja',
        content: `
### Harmonogram czyszczenia

- **Głowica drukująca** – co 1 rolkę ribbonu / materiału DT
- **Wałek dociskowy (platen)** – co 1 rolkę ribbonu / materiału DT
- **Czujniki** – co 1 rolkę
- **Obcinacz** – co 1-3 rolki

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

> **Uwaga:** Ze względu na **szerszą głowicę 6"** w ZT421, czyszczenie wymaga więcej uwagi aby objąć całą powierzchnię drukującą.

1. Otwórz drzwi i wyjmij ribbon oraz materiał
2. **Głowica:** Przetrzyj brązowy pasek wacikiem z alkoholem (99,7%)
3. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
4. Poczekaj aż wyschnie
5. Załaduj materiał i ribbon

### Czyszczenie obcinacza

1. Wyłącz drukarkę i odłącz zasilanie
2. Zdejmij osłonę obcinacza
3. Wyczyść ostrze wacikiem z alkoholem
4. Nasmaruj olejem silikonowym
5. Załóż osłonę

> 📘 **Szczegółowy poradnik:** [Jak wyczyścić głowicę drukarki Zebra](/blog/jak-wyczyscic-glowice-drukarki-zebra)
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu

- **PAPER OUT** → Załaduj materiał
- **RIBBON OUT** → Załaduj ribbon
- **HEAD OPEN** → Zamknij głowicę
- **HEAD OVER TEMP** → Poczekaj na ostygnięcie
- **CUTTER JAM** → Usuń zacięcie w obcinaczu

### Problemy specyficzne dla ZT421

- **Nierównomierny druk na szerokości** → Dostosuj oba pokrętła docisku
- **Marszczenie ribbonu przy szerszym materiale** → Sprawdź naprężenie i wyrównanie ribbonu
- **Przesuwanie się szerokiego materiału** → Wyrównaj prowadnice, sprawdź docisk

### Problemy z jakością druku

- **Blade wydruki** → Zwiększ Darkness, wyczyść głowicę
- **Przepalone wydruki** → Zmniejsz Darkness, zwiększ Speed
- **Puste obszary (pionowe linie)** → Wyczyść lub wymień głowicę

### Druk etykiety konfiguracji

**Menu > System > Settings > Print: System Settings**

Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

> Potrzebujesz pomocy? [Skontaktuj się z naszym serwisem](/kontakt)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Co to jest drukarka Zebra ZT421?

**Odpowiedź:** Zebra ZT421 to **przemysłowa drukarka etykiet** o szerokości druku **6 cali (168 mm)** z kolorowym wyświetlaczem dotykowym 4,3". Jest przeznaczona do drukowania dużych etykiet wysyłkowych, paletowych i przemysłowych.

### Jaka jest różnica między ZT411 a ZT421?

**Odpowiedź:** **ZT421** ma szerokość druku **168 mm (6 cali)** – idealna do dużych etykiet i palet. **ZT411** ma szerokość druku **104 mm (4 cale)** – do standardowych etykiet. ZT421 jest wolniejsza (305 mm/s vs 356 mm/s).

### Do czego służy drukarka 6-calowa ZT421?

**Odpowiedź:** ZT421 jest idealna do: dużych etykiet wysyłkowych, etykiet na palety, oznaczeń regałów magazynowych, etykiet przewozowych (CMR), wielkoformatowych etykiet cenowych.

### Jakie rozdzielczości obsługuje ZT421?

**Odpowiedź:** ZT421 jest dostępna w dwóch rozdzielczościach: **203 dpi** i **300 dpi**. W przeciwieństwie do ZT411, nie ma wersji 600 dpi.

### Jak skalibrować drukarkę Zebra ZT421?

**Odpowiedź:** Menu > Print > Sensors > Manual Calibration > Start Calibration. Postępuj zgodnie z instrukcjami na ekranie dotykowym.

### Jaka jest maksymalna szerokość etykiety w ZT421?

**Odpowiedź:** Maksymalna szerokość materiału to **178 mm (7")**, a maksymalna szerokość druku to **168 mm (6,6")**.

### Dlaczego druk jest nierównomierny na szerokości w ZT421?

**Odpowiedź:** Ze względu na szerszą głowicę 6", kluczowa jest prawidłowa regulacja docisku. Dostosuj oba pokrętła (wewnętrzne i zewnętrzne) zgodnie z szerokością materiału.

### Jaka jest różnica między ZT421 a ZT421R?

**Odpowiedź:** **ZT421R** posiada wbudowany **enkoder RFID UHF** do programowania tagów. Standardowy **ZT421** nie ma funkcji RFID.
`
      }
    ]
  },

  // ========== Zebra ZT610 ==========
  'zt610': {
    model: 'ZT610',
    title: 'Zebra ZT610 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT610 User Guide',
    keywords: [
      'ZT610', 'zebra zt610', 'drukarka przemysłowa', 'drukarka etykiet', 
      'instrukcja ZT610', 'ZT610 po polsku', 'Xi4 następca',
      'drukarka 4 cale', 'kalibracja ZT610', 'ribbon ZT610',
      'oświetlenie ścieżki mediów', 'metal construction', 'premium industrial',
      'ZT610R', 'RFID ZT610', '203 dpi', '300 dpi', '600 dpi'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT610

Zebra ZT610 to **przemysłowa drukarka etykiet klasy premium**, następca legendarnej serii Xi4. Zaprojektowana do najbardziej wymagających środowisk produkcyjnych, magazynowych i logistycznych, gdzie wymagana jest najwyższa niezawodność i wydajność.

**Wyróżniki ZT610:**
- **Metalowa konstrukcja klasy premium** – najwyższa trwałość
- **Oświetlenie ścieżki mediów** – automatyczne podświetlenie przy braku materiału
- **Oświetlenie ścieżki ribbonu** – automatyczne podświetlenie przy braku ribbonu
- **Oświetlenie przy otwartych drzwiach** – ułatwia ładowanie
- Wyświetlacz LCD z nawigacją przyciskami
- 5 wskaźników LED statusu
- Złote punkty dotykowe oznaczające elementy obsługi

### Parametry techniczne

**Szerokość druku:** do 104 mm (4,09")

**Technologia druku:** Termotransferowy / termiczny bezpośredni

**Rozdzielczość:** 203 dpi, 300 dpi lub 600 dpi

**Prędkość druku:**
- Do 356 mm/s (14"/s) dla 203 dpi
- Do 305 mm/s (12"/s) dla 300 dpi
- Do 152 mm/s (6"/s) dla 600 dpi

**Maks. średnica rolki:** 203 mm (8")

**Średnica gilzy:** 76 mm (3")

**Długość ribbonu:** do 450 m

**Maks. szerokość materiału:** 114 mm (4,5")

### Rozdzielczości i szerokości druku

- **203 dpi:** 832 dots (104 mm)
- **300 dpi:** 1248 dots (106 mm)
- **600 dpi:** 2496 dots (106 mm)

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (opcja)
- Parallel (LPT) – opcja
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 – opcja
- USB Host (2x) – do podłączenia klawiatury, skanera, pendrive
- Port aplikatora (opcja)
`
      },
      {
        title: '2. Zastosowania ZT610',
        content: `
### Gdzie sprawdza się ZT610?

**Produkcja:**
- Etykiety produktowe i identyfikacyjne
- Znakowanie komponentów
- Śledzenie partii produkcyjnych
- Etykiety z kodami 2D wysokiej rozdzielczości (600 dpi)

**Logistyka i magazyn:**
- Etykiety wysyłkowe
- Oznaczenia lokalizacji magazynowych
- Etykiety na palety
- Dokumenty transportowe

**Dystrybucja:**
- Etykiety cenowe
- Oznaczenia produktów
- Etykiety promocyjne

**Ochrona zdrowia:**
- Etykiety laboratoryjne (600 dpi dla małych próbek)
- Oznaczenia próbek
- Bransoletki identyfikacyjne

### ZT610 vs konkurencja

**Zalety ZT610:**
- Metalowa konstrukcja premium (trwalsza niż plastikowa)
- Oświetlenie ścieżki mediów i ribbonu (unikalna funkcja)
- Wysoka rozdzielczość do 600 dpi
- Szeroki wybór opcji (obcinacz, nawijak, RFID, aplikator)
- Obsługa ribbonów do 450 m (mniej wymian)
`
      },
      {
        title: '3. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT610
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki (22,7-29,4 kg)
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Warunki pracy

**Thermal Transfer:** 5°C – 40°C, 20-85% wilgotności bez kondensacji

**Direct Thermal:** 0°C – 40°C, 20-85% wilgotności bez kondensacji

### Warunki przechowywania

- Temperatura: -40°C do +60°C
- Wilgotność: 5-85% bez kondensacji
`
      },
      {
        title: '4. Panel sterowania',
        content: `
### Wyświetlacz LCD

Wyświetlacz pokazuje aktualny status drukarki i umożliwia nawigację po menu. W stanie bezczynności (Idle Display) pokazuje wersję firmware i adres IP.

### Wskaźniki LED

- **STATUS** – Ogólny stan drukarki (zielony=OK, żółty=ostrzeżenie, czerwony=błąd)
- **PAUSE** – Drukarka wstrzymana
- **DATA** – Odbieranie/przetwarzanie danych
- **SUPPLIES** – Stan materiałów eksploatacyjnych
- **NETWORK** – Stan połączenia sieciowego

### Przyciski sterujące

- **LEFT SELECT** – Wykonuje akcję pokazaną po lewej stronie wyświetlacza
- **RIGHT SELECT** – Wykonuje akcję pokazaną po prawej stronie wyświetlacza
- **UP/DOWN ARROW** – Zwiększa/zmniejsza wartość, przewija
- **LEFT/RIGHT ARROW** – Nawigacja w menu
- **OK** – Potwierdza wybór
- **PAUSE** – Wstrzymuje/wznawia drukowanie
- **FEED** – Wysuwa jedną etykietę
- **CANCEL** – Anuluje (1x = następna etykieta, 2 sek. = wszystkie)

### Menu główne (Home Menu)

Z ekranu bezczynności naciśnij **LEFT SELECT** aby wejść do menu głównego z 8 ikonami:

- **SETTINGS** – Ciemność, prędkość, typ mediów, tryb druku
- **TOOLS** – Kalibracja, diagnostyka, USB, ZBI
- **NETWORK** – Ustawienia sieciowe, IP, Wi-Fi
- **RFID** – Ustawienia RFID (tylko ZT610R)
- **LANGUAGE** – Język, komendy ZPL
- **SENSORS** – Kalibracja czujników
- **PORTS** – Ustawienia portów szeregowych
- **BLUETOOTH** – Ustawienia Bluetooth
`
      },
      {
        title: '5. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby druku (Print Mode)

- **TEAR OFF** – Ręczne odrywanie (domyślny)
- **PEEL-OFF** – Automatyczne odklejanie od podkładu (wymaga nawijaka)
- **REWIND** – Nawijanie całych etykiet na rolkę (wymaga nawijaka)
- **CUTTER** – Automatyczne cięcie (wymaga obcinacza)
- **DELAYED CUT** – Cięcie po komendzie ZPL (~JK)
- **APPLICATOR** – Współpraca z aplikatorem etykiet

### Ładowanie materiału (tryb Tear-Off)

> **Ostrzeżenie:** Głowica może być gorąca! Zdejmij biżuterię i metalowe przedmioty przed pracą przy otwartej głowicy.

1. **Podnieś drzwi komory mediów** – włączy się oświetlenie
2. **Otwórz głowicę** – obróć dźwignię w górę
3. **Odsuń prowadnicę materiału** – pokrętłem regulacyjnym na zewnątrz
4. **Włóż rolkę** na wrzeciono, dociśnij do tyłu
5. **Przeprowadź materiał:**
   - Od wrzeciona pod zespołem tancerza
   - Przez czujnik mediów
   - Pod głowicą drukującą
   - Materiał powinien dotykać tylnej ścianki czujnika
6. **Dosuń prowadnicę** pokrętłem do krawędzi materiału
7. **Zamknij głowicę** (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie w trybie Peel-Off

1. Zainstaluj płytę nawijaka w pozycji peel-off
2. Otwórz głowicę i przeprowadź materiał standardowo
3. Odklej ok. 50 cm etykiet od podkładu
4. Przeprowadź pusty podkład za płytę nawijaka
5. Nawiń podkład na wrzeciono nawijaka
6. Dosuń prowadnicę, zamknij głowicę i drzwi

### Ładowanie w trybie Cutter

1. Przeprowadź materiał standardowo przez czujnik i pod głowicę
2. Przeprowadź materiał przez obcinacz
3. Zamknij głowicę i drzwi

> **Ostrzeżenie:** Ostrze obcinacza jest ostre! Nie dotykaj ostrza palcami.
`
      },
      {
        title: '6. Ładowanie ribbonu',
        content: `
### Czy potrzebuję ribbonu?

Przesuń paznokciem po powierzchni materiału:
- **Czarny ślad** = Direct Thermal (bez ribbonu)
- **Brak śladu** = Thermal Transfer (wymaga ribbonu)

### Strona powlekana ribbonu

ZT610 standardowo obsługuje ribbon powlekany na zewnątrz.

**Test klejenia:** Przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

**Test rysowania:** Połóż rozwinięty ribbon na kartce zewnętrzną stroną do papieru. Podrap wewnętrzną stronę paznokciem. Jeśli ślad pojawi się na kartce – ribbon jest powlekany na zewnątrz.

### Procedura ładowania ribbonu

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. **Załaduj rolkę ribbonu na dolne wrzeciono (podające):**
   - Ribbon odwija się do przodu, od dołu
   - Dociśnij rolkę do tyłu
4. **Przeprowadź ribbon pod głowicą i wokół jej lewej strony**
5. **Nawiń ribbon na górne wrzeciono (odbiorcze):**
   - Ribbon musi być jak najbardziej z tyłu pod głowicą
   - Owiń kilka zwojów
   - Obróć wrzeciono w kierunku nawijania aby naprężyć
6. Załaduj materiał (jeśli jeszcze nie załadowany)
7. Zamknij głowicę (dźwignia w dół)
8. Zamknij drzwi

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę przed zużyciem.
`
      },
      {
        title: '7. Menu użytkownika',
        content: `
### SETTINGS Menu

- **DARKNESS** – Ciemność druku (0.0 – 30.0)
- **PRINT SPEED** – Prędkość druku (2-14 ips dla 203dpi)
- **MEDIA TYPE** – Typ materiału (CONTINUOUS, GAP/NOTCH, MARK)
- **PRINT METHOD** – Metoda druku (THERMAL TRANS, DIRECT THERMAL)
- **TEAR OFF** – Pozycja odrywania (-120 do +120 dots)
- **PRINT WIDTH** – Szerokość druku
- **PRINT MODE** – Tryb druku
- **LABEL TOP** – Offset pionowy
- **LEFT POSITION** – Offset poziomy
- **REPRINT MODE** – Tryb ponownego druku
- **COVER OPEN LIGHT** – Oświetlenie przy otwarciu (HIGH/MEDIUM/LOW/OFF)
- **MEDIA PATH LIGHTS** – Oświetlenie ścieżki mediów
- **RIBBON PATH LIGHTS** – Oświetlenie ścieżki ribbonu

### TOOLS Menu

- **PRINT INFORMATION** – Drukuje etykiety konfiguracji
- **POWER UP ACTION** – Akcja przy włączeniu (CALIBRATE, FEED, LENGTH, NO MOTION, SHORT CAL)
- **HEAD CLOSE ACTION** – Akcja przy zamknięciu głowicy
- **LOAD DEFAULTS** – Przywracanie ustawień (FACTORY, NETWORK, LAST SAVED)
- **MEDIA/RIBBON CAL** – Kalibracja czujników
- **DIAGNOSTIC MODE** – Tryb diagnostyczny (hex dump)
- **CONFIG INFO TO USB** – Kopiowanie konfiguracji na USB
- **PRINT USB FILE** – Drukowanie z pendrive
- **PASSWORD PROTECT** – Ochrona hasłem

### NETWORK Menu

- **PRIMARY NETWORK** – Sieć podstawowa (WIRED/WLAN)
- **WIRED IP ADDRESS** – Adres IP (kablowy)
- **WIRED SUBNET MASK** – Maska podsieci
- **WIRED GATEWAY** – Brama domyślna
- **WIRED IP PROTOCOL** – Protokół IP (ALL, DHCP, PERMANENT...)
- **WLAN IP ADDRESS** – Adres IP (Wi-Fi)
- **ESSID** – Nazwa sieci Wi-Fi
- **IP PORT** – Port TCP (domyślnie 9100)
- **RESET NETWORK** – Reset ustawień sieciowych
`
      },
      {
        title: '8. Kalibracja',
        content: `
### Kiedy kalibrować?

- Po zmianie typu lub rozmiaru materiału/ribbonu
- Gdy drukarka pomija etykiety
- Gdy obraz dryfuje w pionie lub poziomie
- Gdy ribbon nie jest wykrywany
- Gdy etykiety nieciągłe są traktowane jako ciągłe

### Kalibracja automatyczna

Ustaw akcję przy włączeniu lub zamknięciu głowicy:
- **CALIBRATE** – pełna kalibracja
- **SHORT CAL** – szybka kalibracja (bez zmiany wzmocnienia)
- **FEED** – tylko wysuw
- **LENGTH** – określenie długości
- **NO MOTION** – brak ruchu

### Kalibracja ręczna

**Metoda 1 – Z menu:**
TOOLS > MEDIA/RIBBON CAL → postępuj zgodnie z instrukcjami na ekranie

**Metoda 2 – Skrót klawiszowy:**
Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy

### Regulacja docisku głowicy

ZT610 posiada dwa elementy regulacji:

**Toggle Position** – pozycja punktu docisku (przód/tył):
1. Odkręć nakrętkę blokującą
2. Przesuń toggle do przodu lub do tyłu
3. Dokręć nakrętkę

**Printhead Pressure** – siła docisku (pokrętła wewnętrzne/zewnętrzne):
- Rozpocznij od ustawień zależnych od szerokości materiału
- Zwiększ docisk zewnętrzny jeśli materiał przesuwa się w lewo
- Zwiększ docisk wewnętrzny jeśli materiał przesuwa się w prawo

### Regulacja pozycji czujnika

Przesuń czujnik transmisyjny w poziomie za pomocą kółka regulacyjnego aby dopasować do pozycji przerw/nacięć na materiale.
`
      },
      {
        title: '9. Podłączenie do komputera',
        content: `
### Instalacja sterowników

> **Ważne:** Zainstaluj Zebra Setup Utilities PRZED podłączeniem drukarki!

1. Pobierz Zebra Setup Utilities ze strony: **serwis-zebry.pl/sterowniki**
2. Uruchom instalator i postępuj zgodnie z instrukcjami
3. Po instalacji uruchom System Prepare Wizard
4. Podłącz drukarkę gdy kreator o to poprosi

### Identyfikacja modelu i rozdzielczości

Na naklejce z numerem części: **ZT610xY-xxxxxxxx**
- ZT610 = model
- Y = rozdzielczość (2=203dpi, 3=300dpi, 6=600dpi)

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Podłącz kabel sieciowy RJ-45
2. Włącz drukarkę
3. Drukarka pobierze IP z DHCP automatycznie
4. Sprawdź IP w NETWORK > WIRED IP ADDRESS
5. Dodaj drukarkę w Zebra Setup Utilities przez port TCP/IP

### Połączenie szeregowe (Serial)

1. Podłącz kabel RS-232
2. Skonfiguruj parametry portu (BAUD RATE, DATA BITS, PARITY, HANDSHAKE) aby pasowały do komputera
3. Dodaj drukarkę przez port COM
`
      },
      {
        title: '10. Konserwacja',
        content: `
### Harmonogram czyszczenia

- **Głowica drukująca** – Co 1 rolkę ribbonu
- **Wałek dociskowy (platen)** – Co 1 rolkę ribbonu
- **Czujniki** – Co 1 rolkę
- **Ścieżka mediów/ribbonu** – Co 1 rolkę
- **Obcinacz** – W razie potrzeby
- **Obudowa zewnętrzna** – W razie potrzeby

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Wyłącz drukarkę
2. Otwórz drzwi i wyjmij ribbon oraz materiał
3. **Głowica:** Przetrzyj brązowy pasek wacikiem nasączonym alkoholem izopropylowym (99,7%)
4. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
5. Poczekaj aż wyschnie (2 minuty)
6. Załaduj materiał i ribbon

### Czyszczenie i smarowanie obcinacza

> **Ostrzeżenie:** Wyłącz drukarkę i odłącz zasilanie! Ostrze jest ostre!

1. Zdejmij osłonę obcinacza (2 śruby)
2. Wyczyść ostrze V wacikiem z alkoholem
3. Po wyschnięciu nasmaruj ostrze olejem silikonowym lub PTFE
4. Usuń nadmiar oleju
5. Załóż osłonę

### Usuwanie zużytego ribbonu

1. Otwórz głowicę
2. Odetnij ribbon między rolką podającą a głowicą
3. Zdejmij zużyty ribbon z górnego wrzeciona
4. Załóż nową pustą gilzę
5. Załaduj nowy ribbon
`
      },
      {
        title: '11. Rozwiązywanie problemów',
        content: `
### Etykieta konfiguracji

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SETTINGS
- Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

### Profil czujników

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SENSOR PROFILE
- Lub: przytrzymaj **FEED + CANCEL** podczas włączania drukarki

### Tryb diagnostyczny (Hex Dump)

**Włączenie:**
- TOOLS > DIAGNOSTIC MODE > ENABLED
- Lub: przytrzymaj **PAUSE + FEED** przez 2 sekundy

### Komunikaty błędów

- **PAPER OUT** – Załaduj materiał, sprawdź czujniki
- **RIBBON OUT** – Załaduj ribbon, sprawdź ustawienie PRINT METHOD
- **HEAD OPEN** – Zamknij głowicę
- **HEAD OVER TEMP** – Poczekaj na ostygnięcie
- **HEAD UNDER TEMP** – Przenieś w cieplejsze miejsce
- **CUTTER JAM** – Usuń zacięcie w obcinaczu
- **OUT OF MEMORY** – Zmniejsz rozmiar formatu lub dodaj pamięć

### Problemy z jakością druku

- **Blade wydruki** – Zwiększ DARKNESS, wyczyść głowicę
- **Przepalone wydruki** – Zmniejsz DARKNESS, zwiększ PRINT SPEED
- **Puste pionowe linie** – Wyczyść lub wymień głowicę
- **Marszczenie ribbonu** – Sprawdź naprężenie, wyrównaj ribbon
- **Przesuwanie materiału** – Dostosuj docisk głowicy
- **Pomijanie etykiet** – Skalibruj czujniki, sprawdź MEDIA TYPE

### Przywracanie ustawień fabrycznych

**Ustawienia drukarki:**
- TOOLS > LOAD DEFAULTS > FACTORY
- Lub: przytrzymaj **FEED + PAUSE** podczas włączania

**Ustawienia sieciowe:**
- TOOLS > LOAD DEFAULTS > NETWORK
- Lub: przytrzymaj **CANCEL + PAUSE** podczas włączania
`
      },
      {
        title: '12. RFID (ZT610R)',
        content: `
### Funkcje RFID (tylko ZT610R)

Model **ZT610R** posiada wbudowany enkoder RFID UHF do programowania tagów podczas drukowania.

### RFID Menu

- **RFID STATUS** – Status enkodera RFID
- **RFID CALIBRATE** – Kalibracja RFID
- **READ RFID DATA** – Odczyt danych z tagu
- **RFID TEST** – Test RFID
- **RFID PROGRAM POS.** – Pozycja programowania
- **RFID ANTENNA** – Wybór anteny
- **RFID READ POWER** – Moc odczytu (0-30)
- **RFID WRITE POWER** – Moc zapisu (0-30)
- **RFID VALID COUNT** – Licznik prawidłowych tagów
- **RFID VOID COUNT** – Licznik błędnych tagów

### Problemy z RFID

- **Brak programowania** – Wykonaj RFID CALIBRATE
- **Częste VOID** – Zwiększ RFID WRITE POWER
- **Nieczytelne tagi** – Zwiększ RFID READ POWER
- **Programowanie sąsiedniego tagu** – Zmniejsz moc, zmień antenę
`
      },
      {
        title: '13. Funkcje USB Host i NFC',
        content: `
### Drukowanie z pendrive

1. Włóż pendrive do portu USB Host
2. TOOLS > PRINT USB FILE
3. Wybierz plik do drukowania

### Kopiowanie plików

**Z USB do drukarki:** TOOLS > COPY USB FILE TO E:

**Z drukarki na USB:** TOOLS > STORE E: FILE TO USB

### Print Station (klawiatura USB)

1. Podłącz klawiaturę USB
2. TOOLS > PRINT STATION
3. Wybierz format z pamięci E:
4. Wprowadź dane do pól zmiennych (^FN)
5. Określ liczbę kopii

### Near Field Communication (NFC)

Zbliż telefon z aplikacją Zebra Printer Setup Utility do logo NFC na drukarce aby:
- Szybko sparować urządzenie
- Pobrać informacje o drukarce
`
      },
      {
        title: '14. Protected Mode / EU RED',
        content: `
### Dyrektywa EU RED 2025

Od **1 sierpnia 2025** nowe drukarki Zebra są dostarczane z włączonym **Protected Mode**. Przy pierwszym uruchomieniu musisz ustawić hasło administratora.

### Pierwsze uruchomienie

1. Włącz drukarkę
2. Pojawi się kreator konfiguracji (Setup Wizard)
3. Ustaw hasło administratora (min. 8 znaków)
4. Zapisz hasło w bezpiecznym miejscu!
5. Zakończ konfigurację

### Problemy z Protected Mode

Jeśli drukarka jest zablokowana i nie znasz hasła:
- Sprawdź dokumentację od dostawcy
- Poszukaj domyślnego hasła na ulotce
- Skontaktuj się z serwisem: **serwis-zebry.pl**

### Więcej informacji

Szczegółowy przewodnik po dyrektywie EU RED i PrintSecure znajdziesz na:
[Dyrektywa EU RED – konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)
`
      },
      {
        title: '15. Specyfikacje techniczne',
        content: `
### Wymiary i waga

**ZT610:** 264 x 495 x 394 mm, 22,7-29,4 kg

### Zasilanie

- Napięcie: 100-240 VAC
- Częstotliwość: 50-60 Hz

### Porównanie ZT610 vs ZT620

- **ZT610:** szerokość druku 104 mm (4 cale) – standardowe etykiety
- **ZT620:** szerokość druku 168 mm (6 cali) – większe etykiety, palety, wysyłka

### Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebry.pl
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jak załadować ribbon do Zebra ZT610?

**Odpowiedź:** Podnieś drzwi komory mediów, otwórz głowicę (dźwignia w górę). Załaduj rolkę ribbonu na dolne wrzeciono (podające) – ribbon odwija się do przodu. Przeprowadź ribbon pod głowicą i nawiń na górne wrzeciono (odbiorcze). Naprężyć obracając wrzeciono, zamknij głowicę i drzwi.

### Co oznacza oświetlenie ścieżki mediów w ZT610?

**Odpowiedź:** **Oświetlenie ścieżki mediów** to unikalna funkcja ZT610 – automatyczne podświetlenie włącza się gdy skończy się materiał lub ribbon, ułatwiając lokalizację problemu. Można regulować intensywność (HIGH/MEDIUM/LOW) lub wyłączyć (OFF) w menu SETTINGS.

### Jaka jest różnica między ZT610 a ZT620?

**Odpowiedź:** **ZT610** drukuje etykiety o szerokości do **104 mm (4 cale)**, **ZT620** do **168 mm (6 cali)**. ZT620 ma większą wagę i wymiary. Wybierz ZT610 dla standardowych etykiet, ZT620 dla etykiet paletowych i wysyłkowych.

### Jak wykonać kalibrację ZT610?

**Odpowiedź:** **Metoda 1:** TOOLS > MEDIA/RIBBON CAL i postępuj zgodnie z instrukcjami. **Metoda 2:** Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy. Kalibruj po każdej zmianie typu lub rozmiaru materiału.

### Jak wydrukować etykietę konfiguracji ZT610?

**Odpowiedź:** **Metoda 1:** TOOLS > PRINT INFORMATION > SETTINGS. **Metoda 2:** Przytrzymaj **FEED + CANCEL** przez 2 sekundy. Etykieta pokazuje wszystkie ustawienia drukarki, adres IP i wersję firmware.

### Jak przywrócić ustawienia fabryczne ZT610?

**Odpowiedź:** **Metoda 1:** TOOLS > LOAD DEFAULTS > FACTORY. **Metoda 2:** Przytrzymaj **FEED + PAUSE** podczas włączania drukarki. Reset sieciowy: TOOLS > LOAD DEFAULTS > NETWORK lub **CANCEL + PAUSE** podczas włączania.

### Jak często czyścić głowicę drukującą ZT610?

**Odpowiedź:** Głowicę i wałek należy czyścić **po każdej rolce ribbonu** wacikiem nasączonym alkoholem izopropylowym (99,7%). Regularne czyszczenie przedłuża żywotność głowicy i zapewnia wysoką jakość druku.

### Co oznacza komunikat "RIBBON OUT" mimo załadowanego ribbonu?

**Odpowiedź:** Sprawdź ustawienie **PRINT METHOD** w menu SETTINGS – powinno być **THERMAL TRANS** dla druku z ribbonem. Jeśli jest ustawione na **DIRECT THERMAL**, drukarka nie szuka ribbonu. Sprawdź też czy ribbon jest prawidłowo załadowany i naprężony.
`
      }
    ]
  },
  'zt620': {
    model: 'ZT620',
    title: 'Zebra ZT620 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT620 User Guide',
    keywords: [
      'ZT620', 'zebra zt620', 'drukarka przemysłowa', 'drukarka etykiet', 
      'instrukcja ZT620', 'ZT620 po polsku', 'drukarka 6 cali',
      'drukarka paletowa', 'etykiety wysyłkowe', 'duże etykiety',
      'kalibracja ZT620', 'ribbon ZT620', 'oświetlenie ścieżki mediów',
      'ZT620R', 'RFID ZT620', '203 dpi', '300 dpi', '168 mm'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT620

Zebra ZT620 to przemysłowa drukarka etykiet klasy premium o **szerokości druku 6 cali (168 mm)**, następca legendarnej serii Xi4. Zaprojektowana do najbardziej wymagających środowisk produkcyjnych, magazynowych i logistycznych, gdzie wymagane są duże etykiety wysyłkowe, etykiety na palety i oznaczenia przemysłowe.

### Parametry techniczne

| Parametr | ZT620 |
|----------|-------|
| **Szerokość druku** | **do 168 mm (6,6")** |
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do 305 mm/s (12"/s) |
| Prędkość druku (300 dpi) | do 203 mm/s (8"/s) |
| Maks. średnica rolki | 203 mm (8") |
| Średnica gilzy | 76 mm (3") |
| Długość ribbonu | do 450 m |
| Maks. szerokość materiału | 178 mm (7") |

### Porównanie ZT610 vs ZT620

| Parametr | ZT610 | ZT620 |
|----------|-------|-------|
| Szerokość druku | 104 mm (4") | **168 mm (6")** |
| Rozdzielczości | 203, 300, 600 dpi | 203, 300 dpi |
| Maks. prędkość (203 dpi) | 356 mm/s | 305 mm/s |
| Zastosowanie | Etykiety standardowe | **Duże etykiety, palety** |

### Zastosowania ZT620

- **Logistyka i wysyłka:** duże etykiety wysyłkowe, etykiety na palety
- **Magazynowanie:** oznaczenia regałów, lokalizacji, stref
- **Produkcja:** etykiety produktowe, WIP labels, oznaczenia partii
- **Transport:** etykiety przewozowe, dokumenty CMR
- **Retail:** etykiety cenowe wielkoformatowe
- **Healthcare:** etykiety na pojemniki, oznaczenia próbek

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 (opcja)
- USB Host (2x) – do klawiatury, skanera, pendrive
- Parallel (LPT) – opcja
- Port aplikatora – opcja

### Cechy charakterystyczne

- **Szerokość druku 6 cali (168 mm)** – idealna do dużych etykiet
- **Metalowa konstrukcja klasy premium** – najwyższa trwałość
- Wyświetlacz LCD z nawigacją przyciskami
- **Oświetlenie ścieżki mediów** – automatyczne podświetlenie przy braku materiału
- **Oświetlenie ścieżki ribbonu** – automatyczne podświetlenie przy braku ribbonu
- **Oświetlenie przy otwartych drzwiach** – ułatwia ładowanie
- 5 wskaźników LED statusu
- Złote punkty dotykowe oznaczające elementy obsługi
- Near Field Communication (NFC) / Print Touch
- Opcjonalny obcinacz, nawijak, enkoder RFID (ZT620R)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT620
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki (22,7-29,4 kg)
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Warunki przechowywania

- Temperatura: -40°C do +60°C
- Wilgotność: 5-85% bez kondensacji
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Wyświetlacz pokazuje aktualny status drukarki i umożliwia nawigację po menu. W stanie bezczynności pokazuje wersję firmware i adres IP.

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki (zielony=OK, żółty=ostrzeżenie, czerwony=błąd) |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów eksploatacyjnych |
| **NETWORK** | Stan połączenia sieciowego |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **LEFT SELECT** | Wykonuje akcję pokazaną po lewej stronie wyświetlacza |
| **RIGHT SELECT** | Wykonuje akcję pokazaną po prawej stronie wyświetlacza |
| **UP ARROW** | Zwiększa wartość / przewija w górę |
| **DOWN ARROW** | Zmniejsza wartość / przewija w dół |
| **OK** | Potwierdza wybór |
| **PAUSE** | Wstrzymuje/wznawia drukowanie |
| **FEED** | Wysuwa jedną etykietę |
| **CANCEL** | Anuluje (1x = następna etykieta, 2 sek. = wszystkie) |

### Menu główne (Home Menu)

Z ekranu bezczynności naciśnij **LEFT SELECT** aby wejść do menu głównego:

| Ikona | Menu | Zawartość |
|-------|------|-----------|
| ⚙️ | **SETTINGS** | Ciemność, prędkość, typ mediów, tryb druku |
| 🔧 | **TOOLS** | Kalibracja, diagnostyka, USB, ZBI |
| 📡 | **NETWORK** | Ustawienia sieciowe, IP, Wi-Fi |
| 📻 | **RFID** | Ustawienia RFID (tylko ZT620R) |
| 🔤 | **LANGUAGE** | Język, komendy ZPL |
| 📊 | **SENSORS** | Kalibracja czujników |
| 🔌 | **PORTS** | Ustawienia portów szeregowych |
| 📶 | **BLUETOOTH** | Ustawienia Bluetooth |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZT620

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 178 mm (7") |
| Min. szerokość materiału | 25 mm (1") |
| Maks. szerokość druku | 168 mm (6,6") |
| Maks. średnica rolki | 203 mm (8") |
| Średnica gilzy | 76 mm (3") |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby druku (Print Mode)

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **TEAR OFF** | Brak | Ręczne odrywanie (domyślny) |
| **PEEL-OFF** | Nawijak | Automatyczne odklejanie |
| **REWIND** | Nawijak | Nawijanie całych etykiet |
| **CUTTER** | Obcinacz | Automatyczne cięcie |
| **APPLICATOR** | Port aplikatora | Współpraca z aplikatorem |

### Ładowanie materiału (tryb Tear-Off)

> **Ostrzeżenie:** Głowica może być gorąca! Zdejmij biżuterię przed pracą.

1. **Podnieś drzwi komory mediów** – włączy się oświetlenie
2. **Otwórz głowicę** – obróć dźwignię w górę
3. **Odsuń prowadnicę materiału** – pokrętłem regulacyjnym
4. **Włóż rolkę** na wrzeciono, dociśnij do tyłu
5. **Przeprowadź materiał** pod zespołem tancerza, przez czujnik, pod głowicą
6. **Dosuń prowadnicę** do krawędzi materiału
7. **Zamknij głowicę** (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie
`
      },
      {
        title: '5. Ładowanie ribbonu',
        content: `
> **Dotyczy tylko trybu Thermal Transfer.**

### Ribbon dla ZT620

Dla drukarki ZT620 należy stosować ribbon o szerokości odpowiedniej do szerokiego materiału 6":
- **Maks. szerokość ribbonu:** 178 mm (7")
- Ribbon musi być szerszy niż drukowany materiał aby chronić głowicę

### Czy potrzebuję ribbonu?

Przesuń paznokciem po powierzchni materiału:
- **Czarny ślad** = Direct Thermal (bez ribbonu)
- **Brak śladu** = Thermal Transfer (wymaga ribbonu)

### Strona powlekana ribbonu

ZT620 standardowo obsługuje ribbon powlekany na zewnątrz.

**Test klejenia:** Przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

### Procedura ładowania ribbonu

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. **Załaduj rolkę ribbonu na dolne wrzeciono (podające):**
   - Ribbon odwija się do przodu, od dołu
   - Dociśnij rolkę do tyłu
4. **Przeprowadź ribbon pod głowicą i wokół jej lewej strony**
5. **Nawiń ribbon na górne wrzeciono (odbiorcze):**
   - Ribbon musi być jak najbardziej z tyłu pod głowicą
   - Owiń kilka zwojów
   - Obróć wrzeciono w kierunku nawijania aby naprężyć
6. Załaduj materiał (jeśli jeszcze nie załadowany)
7. Zamknij głowicę (dźwignia w dół)
8. Zamknij drzwi
`
      },
      {
        title: '6. Menu użytkownika',
        content: `
### SETTINGS Menu

| Pozycja | Opis | Wartości ZT620 |
|---------|------|----------------|
| **DARKNESS** | Ciemność druku | 0.0 – 30.0 |
| **PRINT SPEED** | Prędkość druku | 2-12 ips (203dpi), 2-8 ips (300dpi) |
| **MEDIA TYPE** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **PRINT METHOD** | Metoda druku | THERMAL TRANS, DIRECT THERMAL |
| **TEAR OFF** | Pozycja odrywania | -120 do +120 dots |
| **PRINT WIDTH** | Szerokość druku | Do 1344 (203dpi), 1984 (300dpi) |
| **PRINT MODE** | Tryb druku | TEAR OFF, PEEL-OFF, REWIND, CUTTER |
| **COVER OPEN LIGHT** | Oświetlenie przy otwarciu | HIGH, MEDIUM, LOW, OFF |
| **MEDIA PATH LIGHTS** | Oświetlenie ścieżki mediów | HIGH, MEDIUM, LOW, OFF |
| **RIBBON PATH LIGHTS** | Oświetlenie ścieżki ribbonu | HIGH, MEDIUM, LOW, OFF |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFORMATION** | Drukuje etykiety konfiguracji |
| **POWER UP ACTION** | Akcja przy włączeniu |
| **HEAD CLOSE ACTION** | Akcja przy zamknięciu głowicy |
| **LOAD DEFAULTS** | Przywracanie ustawień |
| **MEDIA/RIBBON CAL** | Kalibracja czujników |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny |
| **PRINT USB FILE** | Drukowanie z pendrive |
| **PRINT STATION** | Drukowanie z klawiatury USB |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **ACTIVE PRINT SERVER** | Aktywny serwer druku |
| **PRIMARY NETWORK** | Sieć podstawowa (WIRED/WLAN) |
| **WIRED IP ADDRESS** | Adres IP (kablowy) |
| **WLAN IP ADDRESS** | Adres IP (Wi-Fi) |
| **ESSID** | Nazwa sieci Wi-Fi |
| **RESET NETWORK** | Reset ustawień sieciowych |
`
      },
      {
        title: '7. Kalibracja',
        content: `
### Kiedy kalibrować?

- Po zmianie typu lub rozmiaru materiału/ribbonu
- Gdy drukarka pomija etykiety
- Gdy obraz dryfuje w pionie lub poziomie
- Gdy ribbon nie jest wykrywany

### Kalibracja automatyczna

Ustaw akcję przy włączeniu lub zamknięciu głowicy:
- **CALIBRATE** – pełna kalibracja
- **SHORT CAL** – szybka kalibracja
- **FEED** – tylko wysuw
- **LENGTH** – określenie długości
- **NO MOTION** – brak ruchu

### Kalibracja ręczna

**Metoda 1 – Z menu:**
TOOLS > MEDIA/RIBBON CAL

**Metoda 2 – Skrót klawiszowy:**
Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy

### Regulacja docisku głowicy dla ZT620

Ze względu na szerszą głowicę 6", prawidłowa regulacja docisku jest szczególnie ważna.

ZT620 posiada dwa elementy regulacji:
1. **Toggle Position** – pozycja punktu docisku (przód/tył)
2. **Printhead Pressure** – siła docisku (pokrętła wewnętrzne/zewnętrzne)

**Wskazówki dla szerokiego materiału:**
- Dla materiału >100 mm: zrównoważ docisk wewnętrzny i zewnętrzny
- Materiał przesuwa się w lewo → zwiększ zewnętrzne
- Materiał przesuwa się w prawo → zwiększ wewnętrzne
- Zbyt jasny druk z lewej → zwiększ wewnętrzne
- Zbyt jasny druk z prawej → zwiększ zewnętrzne
`
      },
      {
        title: '8. Podłączenie do komputera',
        content: `
### EU RED – Protected Mode (EMEA od 1.08.2025)

Drukarki Zebra ZT620 sprzedawane w regionie EMEA od **1 sierpnia 2025** z Wi-Fi lub Bluetooth wymagają:
- Ustawienia hasła Protected Mode
- Skonfigurowania PIN panelu przedniego
- Wykonania powyższych kroków **przed** konfiguracją sieciową

Więcej informacji: [Dyrektywa EU RED – konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Instalacja sterowników

> **Ważne:** Zainstaluj Zebra Setup Utilities PRZED podłączeniem drukarki!

1. Pobierz Zebra Setup Utilities ze strony /sterowniki
2. Uruchom instalator
3. Podłącz drukarkę gdy kreator o to poprosi

### Identyfikacja modelu i rozdzielczości

Na naklejce z numerem części: **ZT620xY-xxxxxxxx**
- ZT620 = model
- Y = rozdzielczość (2=203dpi, 3=300dpi)

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Podłącz kabel sieciowy RJ-45
2. Włącz drukarkę
3. Sprawdź IP w NETWORK > WIRED IP ADDRESS
4. Dodaj drukarkę przez port TCP/IP
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu |
| Wałek dociskowy (platen) | Co 1 rolkę ribbonu |
| Czujniki | Co 1 rolkę |
| Obcinacz | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Wyłącz drukarkę
2. Otwórz drzwi i wyjmij ribbon oraz materiał
3. **Głowica:** Przetrzyj brązowy pasek wacikiem z alkoholem (99,7%)
4. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
5. Poczekaj aż wyschnie

> **Uwaga:** Ze względu na szerszą głowicę 6" w ZT620, czyszczenie wymaga więcej uwagi aby objąć całą powierzchnię drukującą.

### Czyszczenie obcinacza

1. Wyłącz drukarkę i odłącz zasilanie
2. Zdejmij osłonę obcinacza
3. Wyczyść ostrze wacikiem z alkoholem
4. Nasmaruj olejem silikonowym
5. Załóż osłonę
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Etykieta konfiguracji

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SETTINGS
- Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

### Komunikaty błędów

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał |
| **RIBBON OUT** | Załaduj ribbon |
| **HEAD OPEN** | Zamknij głowicę |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **CUTTER JAM** | Usuń zacięcie w obcinaczu |

### Problemy specyficzne dla ZT620

| Problem | Rozwiązanie |
|---------|-------------|
| Nierównomierny druk na szerokości | Dostosuj oba pokrętła docisku |
| Marszczenie ribbonu przy szerszym materiale | Sprawdź naprężenie i wyrównanie |
| Przesuwanie się szerokiego materiału | Wyrównaj prowadnice, sprawdź docisk |

### Przywracanie ustawień fabrycznych

**Ustawienia drukarki:**
- TOOLS > LOAD DEFAULTS > FACTORY
- Lub: przytrzymaj **FEED + PAUSE** podczas włączania

**Ustawienia sieciowe:**
- TOOLS > LOAD DEFAULTS > NETWORK
- Lub: przytrzymaj **CANCEL + PAUSE** podczas włączania
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest różnica między Zebra ZT610 a ZT620?

**Odpowiedź:** **ZT610** drukuje etykiety o szerokości do **104 mm (4 cale)**, **ZT620** do **168 mm (6 cali)**. ZT620 jest przeznaczony do dużych etykiet wysyłkowych i paletowych. ZT610 oferuje dodatkowo rozdzielczość 600 dpi (ZT620 tylko 203/300 dpi).

### Do jakich zastosowań najlepiej nadaje się ZT620?

**Odpowiedź:** ZT620 jest idealny do: **dużych etykiet wysyłkowych**, **etykiet paletowych**, **oznaczeń regałów magazynowych**, **etykiet przewozowych CMR** i wszystkich aplikacji wymagających szerokości druku powyżej 4 cali (104 mm).

### Jaki ribbon wybrać do ZT620?

**Odpowiedź:** Dla ZT620 wybierz ribbon o szerokości **większej niż szerokość materiału** (maks. 178 mm / 7"). Ribbon musi być szerszy aby chronić głowicę przed kontaktem z materiałem. Sprawdź czy ribbon jest powlekany na zewnątrz (standard ZT620).

### Jak załadować ribbon do Zebra ZT620?

**Odpowiedź:** Podnieś drzwi komory mediów, otwórz głowicę. Załaduj rolkę ribbonu na dolne wrzeciono – ribbon odwija się do przodu. Przeprowadź ribbon pod głowicą i nawiń na górne wrzeciono. Naprężyć obracając wrzeciono, zamknij głowicę i drzwi.

### Co oznacza oświetlenie ścieżki mediów w ZT620?

**Odpowiedź:** **Oświetlenie ścieżki mediów** to unikalna funkcja ZT620 – automatyczne podświetlenie włącza się gdy skończy się materiał lub ribbon, ułatwiając lokalizację problemu. Można regulować intensywność w menu SETTINGS.

### Jak wyregulować docisk głowicy dla szerokiego materiału?

**Odpowiedź:** ZT620 ma dwa pokrętła docisku (wewnętrzne i zewnętrzne). Dla materiału szerszego niż 100 mm: zrównoważ oba. Gdy druk jest jaśniejszy z lewej – zwiększ wewnętrzne, gdy z prawej – zwiększ zewnętrzne.

### Jak wykonać kalibrację ZT620?

**Odpowiedź:** **Metoda 1:** TOOLS > MEDIA/RIBBON CAL. **Metoda 2:** Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy. Kalibruj po każdej zmianie typu lub rozmiaru materiału.

### Jak wydrukować etykietę konfiguracji ZT620?

**Odpowiedź:** **Metoda 1:** TOOLS > PRINT INFORMATION > SETTINGS. **Metoda 2:** Przytrzymaj **FEED + CANCEL** przez 2 sekundy. Etykieta pokazuje wszystkie ustawienia drukarki.

### Jak przywrócić ustawienia fabryczne ZT620?

**Odpowiedź:** **Metoda 1:** TOOLS > LOAD DEFAULTS > FACTORY. **Metoda 2:** Przytrzymaj **FEED + PAUSE** podczas włączania drukarki. Reset sieciowy: **CANCEL + PAUSE** podczas włączania.

### Jak często czyścić głowicę drukującą ZT620?

**Odpowiedź:** Głowicę i wałek należy czyścić **po każdej rolce ribbonu** wacikiem z alkoholem izopropylowym (99,7%). Ze względu na szerszą głowicę 6", czyszczenie wymaga więcej uwagi aby objąć całą powierzchnię.

### Co oznacza komunikat "RIBBON OUT" mimo załadowanego ribbonu?

**Odpowiedź:** Sprawdź ustawienie **PRINT METHOD** w menu SETTINGS – powinno być **THERMAL TRANS** dla druku z ribbonem. Jeśli jest ustawione na **DIRECT THERMAL**, drukarka nie szuka ribbonu.
`
      }
    ]
  },
  'zt510': {
    model: 'ZT510',
    title: 'Zebra ZT510 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZT510 User Guide',
    keywords: [
      'ZT510', 'zebra zt510', 'drukarka przemysłowa', 'drukarka etykiet', 
      'instrukcja ZT510', 'ZT510 po polsku', 'drukarka 4 cale',
      'kalibracja ZT510', 'ribbon ZT510', 'metalowa konstrukcja',
      '203 dpi', '300 dpi', 'NFC', 'Print Touch', 'EU RED', 'Protected Mode'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZT510

Zebra ZT510 to przemysłowa drukarka etykiet o szerokości druku **4 cale (104 mm)**, zaprojektowana dla środowisk produkcyjnych, magazynowych i logistycznych wymagających niezawodności w atrakcyjnej cenie. Wyposażona w wytrzymałą metalową konstrukcję, intuicyjny panel sterowania z wyświetlaczem LCD oraz szeroki zakres opcji łączności.

### Parametry techniczne

| Parametr | ZT510 |
|----------|-------|
| **Szerokość druku** | do 104 mm (4,09") |
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do 305 mm/s (12"/s) |
| Prędkość druku (300 dpi) | do 254 mm/s (10"/s) |
| Maks. średnica rolki | 203 mm (8") |
| Średnica gilzy | 76 mm (3") |
| Długość ribbonu | do 450 m |
| Maks. szerokość materiału | 114 mm (4,5") |

### Rozdzielczości i szerokości druku

| Rozdzielczość | Maks. szerokość druku (dots) | Maks. szerokość (mm) |
|---------------|------------------------------|----------------------|
| 203 dpi | 832 dots | 104 mm |
| 300 dpi | 1248 dots | 106 mm |

### Złącza

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 (opcja)
- USB Host (1x) – do klawiatury, skanera, pendrive
- Port aplikatora (opcja)

### Cechy charakterystyczne

- **Metalowa konstrukcja przemysłowa** – wysoka trwałość
- Wyświetlacz LCD z nawigacją przyciskami
- 5 wskaźników LED statusu
- Ruchomy czujnik mediów
- Regulacja docisku i pozycji głowicy
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz i nawijak
- Near Field Communication (NFC) / Print Touch
- Zebra Basic Interpreter (ZBI 2.0)
- **Zgodność z EU RED (Protected Mode)**
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZT510
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Warunki przechowywania

- Temperatura: -40°C do +60°C
- Wilgotność: 5-85% bez kondensacji
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Wyświetlacz pokazuje aktualny status drukarki i umożliwia nawigację po menu. W stanie bezczynności pokazuje wersję firmware i adres IP.

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki (zielony=OK, żółty=ostrzeżenie, czerwony=błąd) |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów eksploatacyjnych |
| **NETWORK** | Stan połączenia sieciowego |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **LEFT SELECT** | Wykonuje akcję po lewej stronie wyświetlacza |
| **RIGHT SELECT** | Wykonuje akcję po prawej stronie wyświetlacza |
| **UP/DOWN ARROW** | Zmiana wartości / przewijanie |
| **LEFT/RIGHT ARROW** | Nawigacja w menu |
| **OK** | Potwierdza wybór |
| **PAUSE** | Wstrzymuje/wznawia drukowanie |
| **FEED** | Wysuwa jedną etykietę |
| **CANCEL** | Anuluje (1x = następna, 2 sek. = wszystkie) |

### Menu główne (Home Menu)

| Ikona | Menu | Zawartość |
|-------|------|-----------|
| ⚙️ | **SETTINGS** | Ciemność, prędkość, typ mediów, tryb druku |
| 🔧 | **TOOLS** | Kalibracja, diagnostyka, USB, ZBI |
| 📡 | **NETWORK** | Ustawienia sieciowe, IP, Wi-Fi |
| 🔤 | **LANGUAGE** | Język, komendy ZPL |
| 📊 | **SENSORS** | Kalibracja czujników |
| 🔌 | **PORTS** | Ustawienia portów szeregowych |
| 📶 | **BLUETOOTH** | Ustawienia Bluetooth |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby druku (Print Mode)

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **TEAR OFF** | Brak | Ręczne odrywanie (domyślny) |
| **PEEL-OFF** | Nawijak | Automatyczne odklejanie |
| **REWIND** | Nawijak | Nawijanie całych etykiet |
| **CUTTER** | Obcinacz | Automatyczne cięcie |
| **APPLICATOR** | Port aplikatora | Współpraca z aplikatorem |

### Ładowanie materiału (tryb Tear-Off)

> **Ostrzeżenie:** Głowica może być gorąca! Zdejmij biżuterię przed pracą.

1. **Podnieś drzwi komory mediów**
2. **Otwórz głowicę** – obróć dźwignię w górę
3. **Odsuń zewnętrzną prowadnicę:**
   - Poluzuj śrubę motylkową
   - Odsuń prowadnicę na zewnątrz
4. **Włóż rolkę** na wrzeciono, dociśnij do tyłu
5. **Przeprowadź materiał:**
   - Pod rolką tancerza
   - Pod rolką prowadzącą
   - Pod górnym czujnikiem mediów
   - Pod głowicą drukującą
   - Nad wałkiem dociskowym
6. **Dosuń prowadnicę** do krawędzi materiału
7. **Dokręć śrubę motylkową**
8. **Zamknij głowicę** (dźwignia w dół)
9. Zamknij drzwi
10. Naciśnij **PAUSE** aby umożliwić drukowanie

> **Ważne:** Materiał musi przejść POD rolkami, nie nad nimi – inaczej pojawi się fałszywy błąd RIBBON OUT.
`
      },
      {
        title: '5. Ładowanie ribbonu',
        content: `
> **Dotyczy tylko trybu Thermal Transfer.**

### Czy potrzebuję ribbonu?

Przesuń paznokciem po powierzchni materiału:
- **Czarny ślad** = Direct Thermal (bez ribbonu)
- **Brak śladu** = Thermal Transfer (wymaga ribbonu)

### Strona powlekana ribbonu

ZT510 standardowo obsługuje ribbon powlekany na zewnątrz.

**Test klejenia:** Przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

### Procedura ładowania ribbonu

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. **Wyrównaj segmenty wrzeciona ribbonu**
4. **Załaduj rolkę ribbonu na dolne wrzeciono (podające):**
   - Ribbon odwija się do przodu
   - Dociśnij rolkę do tyłu
5. **Przeprowadź ribbon:**
   - Pod rolką prowadzącą
   - Pod głowicą drukującą
6. **Nawiń ribbon na górne wrzeciono (odbiorcze):**
   - Przeprowadź nad górną rolką
   - Owiń kilka zwojów
   - Obróć wrzeciono aby naprężyć
7. Załaduj materiał (jeśli jeszcze nie załadowany)
8. Zamknij głowicę (dźwignia w dół)
9. Zamknij drzwi

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę.
`
      },
      {
        title: '6. Menu użytkownika',
        content: `
### SETTINGS Menu

| Pozycja | Opis | Wartości |
|---------|------|----------|
| **DARKNESS** | Ciemność druku | 0.0 – 30.0 |
| **PRINT SPEED** | Prędkość druku | 2-12 ips (203dpi), 2-10 ips (300dpi) |
| **MEDIA TYPE** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **PRINT METHOD** | Metoda druku | THERMAL TRANS, DIRECT THERMAL |
| **TEAR OFF** | Pozycja odrywania | -120 do +120 dots |
| **PRINT WIDTH** | Szerokość druku | 2-832 (203dpi), 2-1248 (300dpi) |
| **PRINT MODE** | Tryb druku | TEAR OFF, PEEL-OFF, REWIND, CUTTER |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFORMATION** | Drukuje etykiety konfiguracji |
| **POWER UP ACTION** | Akcja przy włączeniu |
| **HEAD CLOSE ACTION** | Akcja przy zamknięciu głowicy |
| **LOAD DEFAULTS** | Przywracanie ustawień |
| **MEDIA/RIBBON CAL** | Kalibracja czujników |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny |
| **PRINT USB FILE** | Drukowanie z pendrive |
| **PRINT STATION** | Drukowanie z klawiatury USB |
| **PASSWORD PROTECT** | Ochrona hasłem |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **ACTIVE PRINT SERVER** | Aktywny serwer druku |
| **PRIMARY NETWORK** | Sieć podstawowa (WIRED/WLAN) |
| **WIRED IP ADDRESS** | Adres IP (kablowy) |
| **WLAN IP ADDRESS** | Adres IP (Wi-Fi) |
| **ESSID** | Nazwa sieci Wi-Fi |
| **RESET NETWORK** | Reset ustawień sieciowych |
`
      },
      {
        title: '7. Kalibracja',
        content: `
### Kiedy kalibrować?

- Po zmianie typu lub rozmiaru materiału/ribbonu
- Gdy drukarka pomija etykiety
- Gdy obraz dryfuje w pionie lub poziomie
- Gdy ribbon nie jest wykrywany

### Kalibracja automatyczna

Ustaw akcję przy włączeniu lub zamknięciu głowicy:
- **CALIBRATE** – pełna kalibracja
- **SHORT CAL** – szybka kalibracja
- **FEED** – tylko wysuw
- **LENGTH** – określenie długości
- **NO MOTION** – brak ruchu

### Kalibracja ręczna

**Metoda 1 – Z menu:**
TOOLS > MEDIA/RIBBON CAL

**Metoda 2 – Skrót klawiszowy:**
Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy

### Regulacja docisku głowicy

ZT510 posiada dwa elementy regulacji:
1. **Toggle Position** – pozycja punktu docisku (przód/tył)
2. **Printhead Pressure** – siła docisku

**Wskazówki:**
- Zwiększ docisk zewnętrzny jeśli materiał przesuwa się w lewo
- Zwiększ docisk wewnętrzny jeśli materiał przesuwa się w prawo

### Regulacja pozycji czujnika

Czujnik mediów można przesuwać w poziomie aby dopasować do pozycji przerw/nacięć na materiale.
`
      },
      {
        title: '8. Podłączenie do komputera',
        content: `
### EU RED – Protected Mode (EMEA od 1.08.2025)

Drukarki sprzedawane w regionie EMEA od 1 sierpnia 2025 wymagają:
- Ustawienia hasła Protected Mode
- Skonfigurowania PIN panelu przedniego
- Przed konfiguracją sieciową należy wykonać powyższe kroki

Więcej informacji: [Dyrektywa EU RED – konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki ze strony /sterowniki
2. Uruchom plik instalacyjny
3. Postępuj zgodnie z instrukcjami

### Identyfikacja modelu i rozdzielczości

Na naklejce z numerem części: **ZT510xY-xxxxxxxx**
- ZT510 = model
- Y = rozdzielczość (2=203dpi, 3=300dpi)

### Połączenie USB

1. Zainstaluj sterowniki
2. Podłącz kabel USB
3. Włącz drukarkę
4. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Podłącz kabel sieciowy RJ-45
2. Włącz drukarkę
3. Sprawdź IP w NETWORK > WIRED IP ADDRESS
4. Dodaj drukarkę przez port TCP/IP
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu |
| Wałek dociskowy (platen) | Co 1 rolkę ribbonu |
| Czujniki | Co 1 rolkę |
| Ścieżka mediów | Co 1 rolkę |
| Obcinacz | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Wyłącz drukarkę
2. Otwórz drzwi i wyjmij ribbon oraz materiał
3. **Głowica:** Przetrzyj brązowy pasek wacikiem z alkoholem (99,7%)
4. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
5. Poczekaj aż wyschnie (2 minuty)
6. Załaduj materiał i ribbon

### Usuwanie zużytego ribbonu

1. Otwórz głowicę
2. Odetnij ribbon między rolką podającą a głowicą
3. Zdejmij zużyty ribbon z górnego wrzeciona
4. Załóż nową pustą gilzę
5. Załaduj nowy ribbon
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Etykieta konfiguracji

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SETTINGS
- Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

### Komunikaty błędów

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał, sprawdź czujniki |
| **RIBBON OUT** | Załaduj ribbon, sprawdź PRINT METHOD |
| **HEAD OPEN** | Zamknij głowicę |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **CUTTER JAM** | Usuń zacięcie w obcinaczu |

### Problemy z jakością druku

| Problem | Rozwiązanie |
|---------|-------------|
| Blade wydruki | Zwiększ DARKNESS, wyczyść głowicę |
| Przepalone wydruki | Zmniejsz DARKNESS, zwiększ PRINT SPEED |
| Puste pionowe linie | Wyczyść lub wymień głowicę |
| Marszczenie ribbonu | Sprawdź naprężenie, wyrównaj ribbon |
| Przesuwanie materiału | Dostosuj docisk głowicy |

### Przywracanie ustawień fabrycznych

**Ustawienia drukarki:**
- TOOLS > LOAD DEFAULTS > FACTORY
- Lub: przytrzymaj **FEED + PAUSE** podczas włączania

**Ustawienia sieciowe:**
- TOOLS > LOAD DEFAULTS > NETWORK
- Lub: przytrzymaj **CANCEL + PAUSE** podczas włączania
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym różni się ZT510 od ZT410/ZT610?

**Odpowiedź:** **ZT510** to ekonomiczny model przemysłowy z szerokością druku 4 cale, oferujący doskonały stosunek ceny do możliwości. **ZT410** to model premium z oświetleniem ścieżki mediów. **ZT610** to również model premium, ale z rozdzielczością do 600 dpi.

### Do jakich zastosowań najlepiej nadaje się ZT510?

**Odpowiedź:** ZT510 jest idealny do: **produkcji**, **magazynów**, **logistyki** i **dystrybucji**, gdzie wymagana jest niezawodna drukarka przemysłowa w przystępnej cenie. Obsługuje etykiety do 104 mm szerokości.

### Co to jest EU RED Protected Mode?

**Odpowiedź:** Od 1 sierpnia 2025 drukarki Zebra sprzedawane w regionie EMEA z Wi-Fi/Bluetooth wymagają skonfigurowania hasła (Protected Mode) przed pierwszym użyciem. Jest to wymóg dyrektywy EU RED dotyczącej cyberbezpieczeństwa urządzeń radiowych.

### Jak załadować ribbon do Zebra ZT510?

**Odpowiedź:** Podnieś drzwi komory mediów, otwórz głowicę. Załaduj rolkę ribbonu na dolne wrzeciono – ribbon odwija się do przodu. Przeprowadź ribbon pod głowicą i nawiń na górne wrzeciono. Naprężyć obracając wrzeciono, zamknij głowicę i drzwi.

### Dlaczego pojawia się błąd RIBBON OUT mimo załadowanego ribbonu?

**Odpowiedź:** Sprawdź czy materiał przechodzi POD rolkami (nie nad nimi) – nieprawidłowe prowadzenie zasłania czujnik ribbonu. Sprawdź też ustawienie **PRINT METHOD** – powinno być **THERMAL TRANS** dla druku z ribbonem.

### Jak wykonać kalibrację ZT510?

**Odpowiedź:** **Metoda 1:** TOOLS > MEDIA/RIBBON CAL. **Metoda 2:** Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy. Kalibruj po każdej zmianie typu lub rozmiaru materiału.

### Jak wydrukować etykietę konfiguracji ZT510?

**Odpowiedź:** **Metoda 1:** TOOLS > PRINT INFORMATION > SETTINGS. **Metoda 2:** Przytrzymaj **FEED + CANCEL** przez 2 sekundy. Etykieta pokazuje wszystkie ustawienia drukarki.

### Jak przywrócić ustawienia fabryczne ZT510?

**Odpowiedź:** **Metoda 1:** TOOLS > LOAD DEFAULTS > FACTORY. **Metoda 2:** Przytrzymaj **FEED + PAUSE** podczas włączania drukarki. Reset sieciowy: **CANCEL + PAUSE** podczas włączania.

### Jak często czyścić głowicę drukującą ZT510?

**Odpowiedź:** Głowicę i wałek należy czyścić **po każdej rolce ribbonu** wacikiem z alkoholem izopropylowym (99,7%). Regularne czyszczenie przedłuża żywotność głowicy.

### Jak korzystać z funkcji NFC / Print Touch?

**Odpowiedź:** Zbliż telefon z aplikacją **Zebra Printer Setup Utility** do logo NFC na drukarce. Umożliwia to szybkie sparowanie, pobranie informacji o drukarce i konfigurację ustawień bez kabli.

### Jakie są dostępne rozdzielczości ZT510?

**Odpowiedź:** ZT510 jest dostępny w rozdzielczości **203 dpi** (do 305 mm/s) i **300 dpi** (do 254 mm/s). Rozdzielczość można sprawdzić na naklejce z Part Number: ZT510x**2** = 203 dpi, ZT510x**3** = 300 dpi.
`
      }
    ]
  },
  'zq210': {
    model: 'ZQ210',
    title: 'Zebra ZQ210 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZQ210 User Guide',
    keywords: [
      'ZQ210', 'zebra zq210', 'drukarka mobilna', 'drukarka paragonów', 
      'instrukcja ZQ210', 'ZQ210 po polsku', 'drukarka 2 cale',
      'drukarka kurierska', 'drukarka przenośna', 'Bluetooth MFi',
      'USB Type-C', 'NFC Print Touch', 'linerless', 'IP43', 'IP54'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ210

Zebra ZQ210 to kompaktowa **mobilna drukarka paragonów i etykiet** o szerokości druku **2 cale (48 mm)**, zaprojektowana dla pracowników mobilnych w branży dostawczej, kurierskiej, gastronomicznej i detalicznej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, Bluetooth 4.1 z obsługą iOS (MFi), Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony IP43 (IP54 z etui ochronnym).

### Parametry techniczne

| Parametr | ZQ210 |
|----------|-------|
| **Szerokość druku** | do 48 mm (1,89") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi × 200 dpi |
| Prędkość druku | 63,5 mm/s (materiał z podkładem) |
| | 38,1 mm/s (materiał bezpodkładowy) |
| Maks. średnica rolki | 40 mm |
| Pojemność baterii | 1500 mAh Li-Ion |
| Czas ładowania | poniżej 3,5 godziny |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 58 mm (standard) | Standardowa szerokość |
| 49,5 mm | Z wkładkami redukcyjnymi (opcja) |
| 40 mm | Z wkładkami redukcyjnymi (opcja) |
| 30 mm | Z wkładkami redukcyjnymi (opcja) |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- Bluetooth 2.1 + EDR / 4.1 Low Energy (Dual Mode)
- **Made for iPhone (MFi)** – obsługa iOS 10+
- **Near Field Communication (NFC)** – parowanie przez Print Touch

### Cechy charakterystyczne

- **Kompaktowa konstrukcja** – waga zaledwie 265 g z baterią
- Wyświetlacz OLED z 3-przyciskowym panelem sterowania
- Klasa ochrony **IP43** (IP54 z etui ochronnym)
- Obsługa materiałów z podkładem i **bezpodkładowych (linerless)**
- Język programowania CPCL
- Obrotowy klips do paska (w zestawie)
- Opcjonalne etui ochronne z paskiem na ramię
- Stacja dokująca 5-stanowiskowa (opcja)
- Kompatybilność z iOS, Android, Windows
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ210
- Bateria Li-Ion 1500 mAh
- Zasilacz AC-to-USB z wtyczką regionalną*
- Kabel USB Type-A do Type-C
- Obrotowy klips do paska
- Skrócona instrukcja obsługi

> *Zasilacz i wtyczki nie są dołączane do drukarek EMEA i LATAM

### Sprawdzenie przesyłki

1. Sprawdź wszystkie zewnętrzne powierzchnie pod kątem uszkodzeń
2. Otwórz pokrywę mediów i sprawdź komorę na materiały
3. Zachowaj opakowanie na wypadek konieczności transportu

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca (materiał z podkładem) | -20°C do +50°C | 10-90% bez kondensacji |
| Praca (materiał bezpodkładowy) | -20°C do +38°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +45°C | 10-90% bez kondensacji |
| Przechowywanie | -25°C do +60°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz OLED

Drukarka wyposażona jest w wyświetlacz OLED, który pokazuje status urządzenia w trzech trybach:
- **Ekran operacyjny** – domyślny widok podczas normalnej pracy
- **Ekran informacyjny** – komunikaty tekstowe dla użytkownika
- **Ekran konfiguracyjny** – zmiana parametrów drukarki

### Ikony statusu

| Ikona | Znaczenie |
|-------|-----------|
| ✓ (zielona) | Drukarka gotowa do pracy |
| ⚠ (żółta) | Ostrzeżenie – drukarka nadal funkcjonalna |
| ✗ (czerwona) | Błąd – wymaga interwencji |

### Ikony baterii

| Ikona | Znaczenie |
|-------|-----------|
| 🔋 (0-4 kreski) | Poziom naładowania baterii |
| 🔋⚡ | Ładowanie w toku |
| 🔋USB | Zasilanie z USB |
| 🔋⚠ | Niski poziom baterii |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Naciśnij aby włączyć; przytrzymaj 5 sek. aby wyłączyć |
| **FEED** | Przesuwa materiał o jedną etykietę |
| **CONFIG** | Nawigacja po menu konfiguracyjnym |

### Menu konfiguracyjne

Naciśnij przycisk CONFIG aby przejść do trybu konfiguracji:

| Opcja | Opis |
|-------|------|
| **DARKNESS** | Regulacja ciemności druku |
| **POWER UP** | Podawanie po włączeniu (Feed On/Off) |
| **HEAD CLOSE** | Podawanie po zamknięciu głowicy |
| **PRINT** | Drukowanie raportu konfiguracyjnego |
| **MAC ADDRESS** | Wyświetlanie adresu MAC |
| **EXIT** | Wyjście z menu konfiguracji |
`
      },
      {
        title: '4. Bateria',
        content: `
### Instalacja baterii

> **Ważne:** Baterie są dostarczane z 70% naładowaniem, co umożliwia natychmiastowe użycie drukarki.

1. Zlokalizuj komorę baterii na spodzie drukarki
2. Podłącz 5-pinowy wtyk do gniazda drukarki
3. Umieść baterię w komorze
4. Załóż pokrywę komory baterii
5. Przykręć śrubę śrubokrętem krzyżakowym #1

### Wyjmowanie baterii

1. Odkręć śrubę pokrywy komory baterii
2. Zdejmij pokrywę
3. Odłącz 5-pinowy wtyk baterii
4. Wyjmij baterię z komory

> **Uwaga:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.

### Bezpieczeństwo baterii

> **Ostrzeżenie:** Bateria może eksplodować, wyciec lub zapalić się w przypadku niewłaściwego ładowania!

- Nie rozbieraj, nie zgniataj, nie przekłuwaj baterii
- Nie zwieraj styków zewnętrznych
- Nie wrzucaj do ognia ani wody
- Ładuj tylko w ładowarkach zatwierdzonych przez Zebra
`
      },
      {
        title: '5. Ładowanie baterii',
        content: `
### Ładowanie przez USB

1. Zamontuj odpowiednią wtyczkę regionalną w zasilaczu AC-to-USB
2. Podłącz zasilacz do gniazdka sieciowego
3. Podłącz kabel USB do zasilacza
4. Odchyl gumową osłonę portu USB na drukarce
5. Podłącz kabel USB Type-C do drukarki
6. Drukarka włączy się i rozpocznie ładowanie

> **Uwaga:** Przed pierwszym użyciem zaleca się pełne naładowanie baterii.

### Czas ładowania

- **Pełne ładowanie:** poniżej 3,5 godziny (przy temperaturze 23°C ±5°C)
- **Ładowarka:** zasilacz USB 10W lub adapter samochodowy USB

### Stacja dokująca 5-stanowiskowa

Opcjonalna stacja dokująca (5-Bay Docking Cradle) umożliwia:
- Jednoczesne ładowanie do 5 drukarek
- Czas ładowania: poniżej 4 godzin
- Idealna do pomieszczeń rozliczeniowych

**Montaż drukarki w stacji:**
1. Wsuń wycięcia dokujące z tyłu drukarki na bolce stacji
2. Przechyl drukarkę do tyłu aż płytka metalowa połączy się z magnesem
`
      },
      {
        title: '6. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Materiał ciągły (journal)** – bez znaczników
- **Materiał z czarnym znacznikiem (black mark)** – znacznik z tyłu
- **Etykiety z przerwą (gap)** – rozdzielone przerwami
- **Materiał bezpodkładowy (linerless)** – opcja

### Procedura ładowania

1. **Otwórz pokrywę mediów:**
   - Naciśnij dźwignię zwalniającą po stronie drukarki
   - Pokrywa otworzy się automatycznie
   
2. **Odchyl pokrywę całkowicie do tyłu**

3. **Włóż rolkę materiału:**
   - Umieść rolkę w komorze mediów
   - Materiał powinien odwijać się od góry (strona druku na zewnątrz)
   - Rolka musi swobodnie się obracać

4. **Zamknij pokrywę mediów:**
   - Materiał automatycznie przesunie się przez ścieżkę papieru
   - Wyciągnij nadmiar materiału z drukarki

### Specyfikacja materiałów

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 58 mm ±0,75 mm |
| Minimalna długość etykiety | 12,5 mm |
| Grubość materiału | 0,058 – 0,1575 mm |
| Szerokość czarnego znacznika | min. 12,7 mm |

> **Uwaga:** Opcjonalne **wkładki redukcyjne** (adaptery do węższych rolek) umożliwiają użycie materiałów o szerokości 49,5 mm, 40 mm i 30 mm.
`
      },
      {
        title: '7. Podłączenie do urządzeń',
        content: `
### Komunikacja USB

1. Podłącz mniejszy wtyk USB Type-C do drukarki
2. Podłącz większy wtyk USB Type-A do komputera
3. Zainstaluj sterowniki ze strony [/sterowniki](/sterowniki)

> **Uwaga:** Wtyk Type-C można podłączyć w dowolnej orientacji.

### Komunikacja Bluetooth

ZQ210 obsługuje:
- Bluetooth 2.1 + EDR (klasyczny)
- Bluetooth 4.1 Low Energy (BLE)
- **Made for iPhone (MFi)** – iOS 10 i nowsze

**Parowanie:**
1. Włącz Bluetooth na urządzeniu mobilnym
2. Wyszukaj drukarkę (nazwa = numer seryjny)
3. Wprowadź PIN jeśli wymagany
4. Potwierdź parowanie

> **Uwaga:** Drukarka obsługuje "bonding" – informacje o parowaniu są zachowywane po wyłączeniu.

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. Zbliż telefon do ikony Print Touch na boku drukarki (max 7,62 cm)
3. Parowanie nastąpi automatycznie

> **Uwaga:** Tag NFC zawiera adres Bluetooth drukarki zakodowany w URL.
`
      },
      {
        title: '8. Noszenie drukarki',
        content: `
### Klips do paska

Drukarka jest wyposażona w obrotowy klips do paska:

**Montaż:**
1. Umieść klips nad pokrywą baterii
2. Przykręć śrubą przez klips i pokrywę

**Użycie:**
- Zahacz klips na pasku
- Klips obraca się, zapewniając swobodę ruchów

### Etui ochronne (opcja)

Etui (SG-MPV-SC21-01) zapewnia:
- **Ochronę IP54**
- Pasek na ramię (w zestawie)
- Dostęp do przycisków przez plastikowe okienko

**Montaż:**
1. Odchyl klapę etui (zapinana na rzep)
2. Włóż drukarkę spodem do przodu
3. Obróć etui – wyświetlacz widoczny przez okienko
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Przedłużanie żywotności baterii

- Nie wystawiaj baterii na bezpośrednie światło słoneczne
- Unikaj temperatur powyżej 45°C podczas ładowania
- Używaj tylko ładowarek zatwierdzonych przez Zebra
- Wyjmij baterię jeśli drukarka nie będzie używana przez dłuższy czas
- Baterie tracą pojemność z czasem – wymieniaj w razie potrzeby

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek (co 1 rolkę dla linerless) |
| Wałek dociskowy (z podkładem) | Co 5 rolek |
| Wałek dociskowy (linerless) | Tylko w razie problemów |
| Zgarniacz (tylko linerless) | Co 5 rolek |

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Użyj pisaka czyszczącego Zebra lub wacika z alkoholem izopropylowym 90%
2. Przetrzyj szary pasek głowicy od środka na zewnątrz
3. Poczekaj aż wyschnie przed zamknięciem

### Czyszczenie wałka dociskowego

**Materiał z podkładem:**
- Obracaj wałek i przecieraj wacikiem z alkoholem 90%

**Materiał bezpodkładowy:**
- Użyj roztworu mydła (1 część mydła : 25 części wody)
- Spłucz czystą wodą

> **Uwaga:** Częste czyszczenie wałka linerless skraca jego żywotność!
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Drukowanie raportu konfiguracyjnego

**Metoda 1 – Sekwencja przycisków:**
1. Wyłącz drukarkę, załaduj materiał ciągły
2. Przytrzymaj przycisk FEED
3. Naciśnij i puść przycisk POWER (trzymając FEED)
4. Puść FEED gdy rozpocznie się drukowanie

**Metoda 2 – Z menu:**
1. Włącz drukarkę
2. Naciskaj CONFIG aż pojawi się SETTINGS-PRINT
3. Naciśnij FEED aby wydrukować

### Typowe problemy

| Problem | Rozwiązanie |
|---------|-------------|
| **Brak zasilania** | Sprawdź baterię, naładuj lub wymień |
| **Materiał się nie przesuwa** | Zamknij pokrywę, sprawdź zacięcia |
| **Słaby/blady wydruk** | Wyczyść głowicę, sprawdź jakość materiału |
| **Krótka żywotność baterii** | Sprawdź wiek baterii, wymień jeśli starsza niż rok |
| **Pomijanie etykiet** | Sprawdź znaczniki/przerwy, skalibruj czujniki |
| **Brak NFC** | Zbliż telefon na odległość mniej niż 7,62 cm |

### Komunikaty alertów

| Komunikat | Znaczenie |
|-----------|-----------|
| **PRINTER READY** | Drukarka gotowa do pracy |
| **MEDIA OUT** | Brak materiału |
| **HEAD OPEN** | Otwarta pokrywa |
| **BATTERY LOW** | Niski poziom baterii |
| **CHARGE ERROR** | Błąd ładowania |
| **HEAD OVERTEMP** | Przegrzana głowica |
| **PAIRING SUCCESS** | Parowanie Bluetooth udane |
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Do czego służy drukarka Zebra ZQ210?

**Odpowiedź:** ZQ210 to **mobilna drukarka paragonów i etykiet** przeznaczona dla kurierów, dostawców, kelnerów i pracowników sklepów. Drukuje paragony, etykiety wysyłkowe, pokwitowania dostaw i bilety o szerokości do 48 mm (2 cale).

### Jak sparować ZQ210 z iPhonem?

**Odpowiedź:** ZQ210 ma certyfikat **Made for iPhone (MFi)**. Włącz Bluetooth na iPhonie, wyszukaj drukarkę (nazwa = numer seryjny), wybierz ją i potwierdź parowanie. Obsługuje iOS 10 i nowsze.

### Jak działa parowanie przez NFC (Print Touch)?

**Odpowiedź:** Włącz NFC na smartfonie i zbliż go do ikony **Print Touch** na boku drukarki (max 7,62 cm). Parowanie nastąpi automatycznie – bez wpisywania kodów PIN.

### Jak długo ładuje się bateria ZQ210?

**Odpowiedź:** Pełne ładowanie baterii 1500 mAh trwa **poniżej 3,5 godziny** przy temperaturze 23°C. Można ładować przez USB Type-C lub w stacji dokującej 5-stanowiskowej.

### Czy ZQ210 obsługuje materiały bezpodkładowe (linerless)?

**Odpowiedź:** Tak, ZQ210 obsługuje materiały **linerless** – etykiety bez podkładu. Prędkość druku dla linerless wynosi 38,1 mm/s (niższa niż dla materiałów z podkładem).

### Jaka jest klasa ochrony ZQ210?

**Odpowiedź:** Sama drukarka ma klasę **IP43**. Z opcjonalnym etui ochronnym (SG-MPV-SC21-01) klasa ochrony wzrasta do **IP54** – lepsza odporność na kurz i zachlapania.

### Jak wydrukować raport konfiguracyjny ZQ210?

**Odpowiedź:** **Metoda 1:** Wyłącz drukarkę, przytrzymaj FEED, naciśnij POWER, puść FEED gdy zacznie drukować. **Metoda 2:** Naciskaj CONFIG aż pojawi się SETTINGS-PRINT, naciśnij FEED.

### Jak często czyścić głowicę drukującą ZQ210?

**Odpowiedź:** Dla materiałów z podkładem – **co 5 rolek**. Dla materiałów bezpodkładowych (linerless) – **co 1 rolkę**. Używaj wacika z alkoholem izopropylowym 90%.

### Czy można używać węższych materiałów w ZQ210?

**Odpowiedź:** Tak, z opcjonalnymi **wkładkami redukcyjnymi** (adaptery do węższych rolek, nr kat. KIT-MPV-MD2SPR1-05) można używać materiałów o szerokości 49,5 mm, 40 mm i 30 mm zamiast standardowych 58 mm.

### Ile waży drukarka ZQ210?

**Odpowiedź:** ZQ210 waży tylko **265 g** z baterią. Jest to jedna z najlżejszych drukarek mobilnych w ofercie Zebra, idealna do noszenia przez cały dzień.

### Czy ZQ210 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ210 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu. Używa materiałów termoczułych, które czernieją pod wpływem ciepła głowicy.
`
      }
    ]
  },
  'zq220': {
    model: 'ZQ220',
    title: 'Zebra ZQ220 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZQ220 User Guide',
    keywords: [
      'ZQ220', 'zebra zq220', 'drukarka mobilna', 'drukarka paragonów', 
      'instrukcja ZQ220', 'ZQ220 po polsku', 'drukarka 3 cale',
      'drukarka kurierska', 'drukarka przenośna', 'Bluetooth MFi',
      'USB Type-C', 'NFC Print Touch', 'linerless', 'IP43', '80 mm'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ220

Zebra ZQ220 to kompaktowa **mobilna drukarka paragonów i etykiet** o szerokości druku **3 cale (72 mm)**, zaprojektowana dla pracowników mobilnych w branży dostawczej, kurierskiej, logistycznej i detalicznej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, Bluetooth 4.1 z obsługą iOS (MFi), Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony IP43.

### Parametry techniczne

| Parametr | ZQ220 |
|----------|-------|
| **Szerokość druku** | do 72 mm (2,91") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi × 200 dpi |
| Prędkość druku | 63,5 mm/s (2,5"/s) |
| Maks. średnica rolki | 50 mm |
| Pojemność baterii | 2550 mAh Li-Ion (2-celowa) |
| Czas ładowania | poniżej 4 godzin |

### Porównanie ZQ210 vs ZQ220

| Parametr | ZQ210 | ZQ220 |
|----------|-------|-------|
| Szerokość druku | 48 mm (2") | **72 mm (3")** |
| Szerokość materiału | 58 mm | **80 mm** |
| Bateria | 1500 mAh | **2550 mAh** |
| Waga | 265 g | **450 g** |
| Średnica rolki | 40 mm | **50 mm** |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 80 mm (standard) | Standardowa szerokość |
| 76,2 mm (3") | Z wkładkami redukcyjnymi (opcja) |
| 58 mm (2,3") | Z wkładkami redukcyjnymi (opcja) |
| 50,8 mm (2") | Z wkładkami redukcyjnymi (opcja) |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- Bluetooth 2.1 + EDR / 4.1 Low Energy (Dual Mode)
- **Made for iPhone (MFi)** – obsługa iOS 10+
- **Near Field Communication (NFC)** – parowanie przez Print Touch

### Cechy charakterystyczne

- **Kompaktowa konstrukcja** – waga 450 g z baterią
- Wyświetlacz OLED z 3-przyciskowym panelem sterowania
- Klasa ochrony **IP43**
- Obsługa materiałów z podkładem i **bezpodkładowych (linerless)**
- Język programowania CPCL
- Obrotowy klips do paska (w zestawie)
- Opcjonalne etui ochronne z paskiem na ramię
- Ładowarka 3-stanowiskowa (opcja)
- Kompatybilność z iOS, Android, Windows
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ220
- Bateria Li-Ion 2550 mAh
- Zasilacz AC-to-USB z wtyczką regionalną*
- Kabel USB Type-A do Type-C
- Obrotowy klips do paska
- Przewodnik regulacyjny

> *Zasilacz i wtyczki nie są dołączane do drukarek EMEA i LATAM

### Sprawdzenie przesyłki

1. Sprawdź wszystkie zewnętrzne powierzchnie pod kątem uszkodzeń
2. Otwórz pokrywę mediów i sprawdź komorę na materiały
3. Zachowaj opakowanie na wypadek konieczności transportu

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -10°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | 10-90% bez kondensacji |
| Przechowywanie | -20°C do +60°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz OLED

Drukarka wyposażona jest w wyświetlacz OLED, który pokazuje status urządzenia w trzech trybach:
- **Ekran operacyjny** – domyślny widok podczas normalnej pracy
- **Ekran informacyjny** – komunikaty tekstowe dla użytkownika
- **Ekran konfiguracyjny** – zmiana parametrów drukarki

### Ikony statusu

| Ikona | Znaczenie |
|-------|-----------|
| ✓ (zielona) | Drukarka gotowa do pracy |
| ⚠ (żółta) | Ostrzeżenie – drukarka nadal funkcjonalna |
| ✗ (czerwona) | Błąd – wymaga interwencji |

### Ikony baterii

| Ikona | Znaczenie |
|-------|-----------|
| 🔋 (0-4 kreski) | Poziom naładowania baterii |
| 🔋⚡ | Ładowanie w toku |
| 🔋USB | Zasilanie z USB |
| 🔋⚠ | Niski poziom baterii |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Naciśnij aby włączyć; przytrzymaj 5 sek. aby wyłączyć |
| **FEED** | Przesuwa materiał o jedną etykietę |
| **CONFIG** | Nawigacja po menu konfiguracyjnym |

### Menu konfiguracyjne

Naciśnij przycisk CONFIG aby przejść do trybu konfiguracji:

| Opcja | Opis |
|-------|------|
| **DARKNESS** | Regulacja ciemności druku |
| **POWER UP** | Podawanie po włączeniu (Feed On/Off) |
| **HEAD CLOSE** | Podawanie po zamknięciu głowicy |
| **PRINT** | Drukowanie raportu konfiguracyjnego |
| **MAC ADDRESS** | Wyświetlanie adresu MAC |
| **EXIT** | Wyjście z menu konfiguracji |
`
      },
      {
        title: '4. Bateria',
        content: `
### Informacje o baterii

Drukarka ZQ220 wykorzystuje **2-celową baterię Li-Ion** (p/n BTRY-MPV-24MA1-01) o pojemności **2550 mAh**. Bateria zapewnia do **3 dni pracy** przy: 25 przystankach dziennie, do 500 paragonów 3×8,5 cala na zmianę przy 13% pokryciu.

> **Ważne:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem podłącz zasilacz USB, aby wybudzić baterię.

### Wyjmowanie baterii

1. Obróć klips do paska aby uzyskać dostęp do komory baterii
2. Naciśnij zatrzask na pakiecie baterii
3. Odchyl baterię od wnęki i wyjmij ją z drukarki

### Instalacja baterii

1. Zlokalizuj komorę baterii na spodzie drukarki
2. Obróć klips do paska aby uzyskać dostęp
3. Włóż baterię zgodnie z orientacją (nie da się włożyć nieprawidłowo)
4. Dociśnij baterię aż zatrzaśnie się na miejscu

### Bezpieczeństwo baterii

> **Ostrzeżenie:** Bateria może eksplodować, wyciec lub zapalić się w przypadku niewłaściwego ładowania!

- Nie rozbieraj, nie zgniataj, nie przekłuwaj baterii
- Nie zwieraj styków zewnętrznych
- Nie wrzucaj do ognia ani wody
- Nie narażaj na temperatury powyżej 60°C
- Ładuj tylko w ładowarkach zatwierdzonych przez Zebra
`
      },
      {
        title: '5. Ładowanie baterii',
        content: `
### Ładowanie przez USB

> **Ważne:** Przed pierwszym użyciem drukarki należy w pełni naładować baterię.

**Procedura ładowania:**
1. Podłącz zasilacz AC-to-USB do gniazdka sieciowego
2. Podłącz kabel USB do zasilacza
3. Obróć gumową osłonę portu USB na boku drukarki
4. Podłącz kabel USB Type-C do drukarki
5. Drukarka włączy się i rozpocznie ładowanie

### Czas ładowania

- **Pełne ładowanie:** poniżej 4 godzin (przy użyciu ładowarki USB 10W)
- **Ładowarka:** zasilacz USB 10W lub adapter samochodowy USB

### Ładowarka 3-stanowiskowa (opcja)

Opcjonalna ładowarka 3-slot umożliwia jednoczesne ładowanie baterii z kilku drukarek.

> **Uwaga:** Baterie częściowo naładowane mogą być używane, jednak zaleca się pełne naładowanie dla maksymalnej żywotności.
`
      },
      {
        title: '6. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Materiał ciągły (journal)** – bez znaczników
- **Materiał z czarnym znacznikiem (black mark)** – znacznik z tyłu
- **Etykiety z przerwą (gap)** – rozdzielone przerwami
- **Materiał bezpodkładowy (linerless)** – opcja z dedykowanym wałkiem

### Procedura ładowania

1. **Otwórz pokrywę mediów:**
   - Naciśnij dźwignię zwalniającą po stronie drukarki
   - Pokrywa otworzy się automatycznie
   
2. **Odchyl pokrywę całkowicie do tyłu**

3. **Włóż rolkę materiału:**
   - Umieść rolkę w komorze mediów
   - Materiał powinien odwijać się od góry (strona druku na zewnątrz)
   - Rolka musi swobodnie się obracać

4. **Zamknij pokrywę mediów:**
   - Materiał automatycznie przesunie się przez ścieżkę papieru
   - Wyciągnij nadmiar materiału z drukarki

### Specyfikacja materiałów

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 80 mm ±0,75 mm |
| Opcjonalne szerokości | 76,2 mm, 58 mm, 50,8 mm |
| Minimalna długość etykiety | 12,5 mm |
| Grubość materiału | 0,053 – 0,1575 mm |
| Maksymalna średnica rolki | 50 mm |

> **Uwaga:** Opcjonalne **wkładki redukcyjne** (adaptery do węższych rolek, nr kat. KIT-MPV-MD3SPR1-5) umożliwiają użycie materiałów o szerokości 76,2 mm, 58 mm i 50,8 mm.
`
      },
      {
        title: '7. Podłączenie do urządzeń',
        content: `
### Komunikacja USB

1. Podłącz mniejszy wtyk USB Type-C do drukarki
2. Podłącz większy wtyk USB Type-A do komputera
3. Zainstaluj sterowniki ze strony [/sterowniki](/sterowniki)

> **Uwaga:** Wtyk Type-C można podłączyć w dowolnej orientacji.

### Komunikacja Bluetooth

ZQ220 obsługuje:
- Bluetooth 2.1 + EDR (klasyczny)
- Bluetooth 4.1 Low Energy (BLE)
- **Made for iPhone (MFi)** – iOS 10 i nowsze

**Parowanie:**
1. Włącz Bluetooth na urządzeniu mobilnym
2. Wyszukaj drukarkę (nazwa = numer seryjny)
3. Wprowadź PIN jeśli wymagany
4. Potwierdź parowanie

**Bonding:** Drukarka zapamiętuje informacje o parowaniu, dzięki czemu urządzenia pozostają sparowane przez cykle zasilania i rozłączenia.

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. Zbliż telefon do ikony Print Touch na boku drukarki (max 7,62 cm)
3. Parowanie nastąpi automatycznie

### Obsługiwane platformy

- Apple iOS 10+ (przez MFi Bluetooth)
- Android (standardowy Bluetooth)
- Windows Mobile
`
      },
      {
        title: '8. Noszenie drukarki',
        content: `
### Klips do paska

Drukarka jest wyposażona w plastikowy obrotowy klips do paska jako standardowe wyposażenie.

**Montaż/demontaż:**
1. Wyjmij baterię
2. Wsuń klips w szczelinę na spodzie drukarki
3. Zainstaluj baterię ponownie

**Użycie:**
- Zahacz klips na pasku
- Klips obraca się, zapewniając swobodę ruchów

### Pasek na ramię (opcja)

Opcjonalny pasek na ramię (SG-MPV-SDSTP1-01):
1. Zaczep jeden koniec paska do słupka z przodu drukarki
2. Zaczep drugi koniec do drugiego słupka
3. Reguluj długość paska według potrzeb

### Etui ochronne (opcja)

Etui (SG-MPV-SC31-01) umożliwia noszenie drukarki z paskiem na ramię:

**Montaż:**
1. Odchyl górną klapę etui (zapinana na rzep)
2. Włóż drukarkę do etui spodem do przodu
3. Wyświetlacz i przyciski widoczne przez plastikowe okienko
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Przedłużanie żywotności baterii

- Nie wystawiaj baterii na bezpośrednie światło słoneczne
- Unikaj temperatur powyżej 40°C podczas ładowania
- Używaj tylko ładowarek zatwierdzonych przez Zebra
- Wyjmij baterię jeśli drukarka nie będzie używana przez dzień lub dłużej
- Baterie tracą pojemność z czasem – wymieniaj w razie potrzeby

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek (co 1 rolkę dla linerless) |
| Wałek dociskowy (z podkładem) | Co 5 rolek |
| Wałek dociskowy (linerless) | Tylko w razie problemów |
| Zgarniacz (tylko linerless) | Co 5 rolek |

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Użyj pisaka czyszczącego Zebra lub wacika z alkoholem izopropylowym 90%
2. Przetrzyj szary pasek głowicy od środka na zewnątrz
3. Poczekaj aż wyschnie przed zamknięciem

### Czyszczenie wałka dociskowego

**Materiał z podkładem:**
- Obracaj wałek i przecieraj wacikiem z alkoholem 90%

**Materiał bezpodkładowy:**
- Użyj roztworu mydła (1 część mydła : 25 części wody)
- Spłucz czystą wodą

> **Uwaga:** Częste czyszczenie wałka linerless skraca jego żywotność!
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Drukowanie raportu konfiguracyjnego

**Metoda 1 – Sekwencja przycisków:**
1. Wyłącz drukarkę, załaduj materiał ciągły
2. Przytrzymaj przycisk FEED
3. Naciśnij i puść przycisk POWER (trzymając FEED)
4. Puść FEED gdy rozpocznie się drukowanie

**Metoda 2 – Z menu:**
1. Włącz drukarkę
2. Naciskaj CONFIG aż pojawi się SETTINGS-PRINT
3. Naciśnij FEED aby wydrukować

### Tryb diagnostyczny (DUMP mode)

1. Wydrukuj raport konfiguracyjny
2. Po zakończeniu pojawi się "Press FEED key to enter DUMP mode"
3. Naciśnij FEED w ciągu 3 sekund
4. Drukarka drukuje wszystkie odbierane dane jako kody HEX

### Typowe problemy

| Problem | Rozwiązanie |
|---------|-------------|
| **Brak zasilania** | Sprawdź baterię, naładuj lub wymień |
| **Materiał się nie przesuwa** | Zamknij pokrywę, sprawdź zacięcia |
| **Słaby/blady wydruk** | Wyczyść głowicę, sprawdź jakość materiału |
| **Krótka żywotność baterii** | Sprawdź wiek baterii, wymień jeśli starsza niż rok |
| **Pomijanie etykiet** | Sprawdź znaczniki/przerwy, skalibruj czujniki |
| **Brak NFC** | Zbliż telefon na odległość mniej niż 7,62 cm |

### Komunikaty alertów

| Komunikat | Znaczenie |
|-----------|-----------|
| **PRINTER READY** | Drukarka gotowa do pracy |
| **MEDIA OUT** | Brak materiału |
| **HEAD OPEN** | Otwarta pokrywa |
| **BATTERY LOW** | Niski poziom baterii |
| **CHARGE ERROR** | Błąd ładowania |
| **HEAD OVERTEMP** | Przegrzana głowica |
| **PAIRING SUCCESS** | Parowanie Bluetooth udane |
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest różnica między ZQ210 a ZQ220?

**Odpowiedź:** **ZQ210** drukuje materiał o szerokości **48 mm (2 cale)**, **ZQ220** drukuje **72 mm (3 cale)**. ZQ220 ma większą baterię (2550 mAh vs 1500 mAh), większą średnicę rolki (50 mm vs 40 mm) i większą wagę (450 g vs 265 g). Wybierz ZQ220 dla większych etykiet wysyłkowych.

### Do czego służy drukarka Zebra ZQ220?

**Odpowiedź:** ZQ220 to **mobilna drukarka paragonów i etykiet** przeznaczona dla kurierów, dostawców, pracowników magazynów i sklepów. Drukuje etykiety wysyłkowe, paragony, pokwitowania dostaw o szerokości do 72 mm (3 cale).

### Jak sparować ZQ220 z iPhonem?

**Odpowiedź:** ZQ220 ma certyfikat **Made for iPhone (MFi)**. Włącz Bluetooth na iPhonie, wyszukaj drukarkę (nazwa = numer seryjny), wybierz ją i potwierdź parowanie. Obsługuje iOS 10 i nowsze.

### Jak działa parowanie przez NFC (Print Touch)?

**Odpowiedź:** Włącz NFC na smartfonie i zbliż go do ikony **Print Touch** na boku drukarki (max 7,62 cm). Parowanie nastąpi automatycznie – bez wpisywania kodów PIN.

### Jak długo ładuje się bateria ZQ220?

**Odpowiedź:** Pełne ładowanie baterii 2550 mAh trwa **poniżej 4 godzin** przy użyciu ładowarki USB 10W. Można też używać adaptera samochodowego USB.

### Czy ZQ220 obsługuje materiały bezpodkładowe (linerless)?

**Odpowiedź:** Tak, ZQ220 obsługuje materiały **linerless** – etykiety bez podkładu. Wymaga dedykowanego wałka do linerless i częstszego czyszczenia głowicy (co 1 rolkę).

### Jaka jest klasa ochrony ZQ220?

**Odpowiedź:** ZQ220 ma klasę ochrony **IP43** – odporność na kurz i zachlapania wodą. Dla lepszej ochrony można użyć opcjonalnego etui ochronnego.

### Jak wydrukować raport konfiguracyjny ZQ220?

**Odpowiedź:** **Metoda 1:** Wyłącz drukarkę, przytrzymaj FEED, naciśnij POWER, puść FEED gdy zacznie drukować. **Metoda 2:** Naciskaj CONFIG aż pojawi się SETTINGS-PRINT, naciśnij FEED.

### Jak często czyścić głowicę drukującą ZQ220?

**Odpowiedź:** Dla materiałów z podkładem – **co 5 rolek**. Dla materiałów bezpodkładowych (linerless) – **co 1 rolkę**. Używaj wacika z alkoholem izopropylowym 90%.

### Czy można używać węższych materiałów w ZQ220?

**Odpowiedź:** Tak, z opcjonalnymi **wkładkami redukcyjnymi** (adaptery do węższych rolek, nr kat. KIT-MPV-MD3SPR1-5) można używać materiałów o szerokości 76,2 mm, 58 mm i 50,8 mm zamiast standardowych 80 mm.

### Czy ZQ220 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ220 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu. Używa materiałów termoczułych, które czernieją pod wpływem ciepła głowicy.
`
      }
    ]
  },
  'zq220plus': {
    model: 'ZQ220 Plus',
    title: 'Zebra ZQ220 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZQ220 Plus User Guide',
    keywords: [
      'ZQ220 Plus', 'zebra zq220 plus', 'drukarka mobilna', 'drukarka paragonów', 
      'instrukcja ZQ220 Plus', 'ZQ220 Plus po polsku', 'drukarka 3 cale',
      'drukarka kurierska', 'drukarka przenośna', 'Bluetooth 5.0',
      'USB Type-C', 'NFC Print Touch', 'linerless', 'IP54', '80 mm',
      'CPCL', 'ESC/POS', 'BLE iOS'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ220 Plus

Zebra ZQ220 Plus to kompaktowa **mobilna drukarka paragonów i etykiet** o szerokości druku do **72 mm (2,83")**, zaprojektowana dla pracowników mobilnych w branży dostawczej, kurierskiej, logistycznej i detalicznej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, **Bluetooth 5.0** z obsługą BLE iOS, Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony **IP54**.

### Parametry techniczne

| Parametr | ZQ220 Plus |
|----------|------------|
| **Szerokość druku** | do 72 mm (2,83") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi × 200 dpi |
| Prędkość druku | 45,72 – 50,8 mm/s (1,8 – 2,0"/s) |
| Maks. średnica rolki | 50 mm |
| Pojemność baterii | 2500 mAh Li-Ion (nominalna 2600 mAh) |
| Czas ładowania | poniżej 3,5 godziny |
| **Waga z baterią** | poniżej 390 g |

### Porównanie ZQ220 vs ZQ220 Plus

| Parametr | ZQ220 | ZQ220 Plus |
|----------|-------|------------|
| Bluetooth | 4.1 (MFi) | **5.0 (BLE iOS)** |
| Klasa ochrony | IP43 | **IP54** |
| Języki programowania | CPCL | **CPCL + ESC/POS** |
| Waga | 450 g | **<390 g** |
| Bateria | 2550 mAh | 2500 mAh (2600 nom.) |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 80 mm (standard) | ±0,75 mm |
| 76,2 mm (3") | Z wkładkami redukcyjnymi (opcja) |
| 58 mm (2,28") | Z wkładkami redukcyjnymi (opcja) |
| 50,8 mm (2") | Z wkładkami redukcyjnymi (opcja) |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- **Bluetooth 5.0**
- **BLE iOS** – obsługa iPhone 7s+, iPad Air, iPod touch
- **Near Field Communication (NFC)** – parowanie przez Print Touch

### Cechy charakterystyczne

- **Kompaktowa i lekka** – poniżej 390 g z baterią
- Wyświetlacz OLED z 3-przyciskowym panelem sterowania
- Klasa ochrony **IP54** (lepsza niż ZQ220)
- Obsługa materiałów z podkładem i **bezpodkładowych (linerless)**
- Języki programowania **CPCL i ESC/POS**
- Obrotowy klips do paska (w zestawie)
- Ładowarka 1-stanowiskowa baterii (opcja)
- Kompatybilność z iOS, Android
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ220 Plus
- Bateria Li-Ion 2500 mAh
- Przewodnik szybkiego startu
- Kabel USB Type-A do Type-C
- Przewodnik regulacyjny
- Wtyczki i adaptery (tylko APAC)
- Klips do paska (tylko EMEA/LATAM)

### Sprawdzenie przesyłki

1. Usuń materiały ochronne i zachowaj opakowanie
2. Sprawdź czy otrzymałeś wszystkie elementy
3. Sprawdź zewnętrzne powierzchnie pod kątem uszkodzeń
4. Otwórz pokrywę mediów i sprawdź komorę
5. Usuń folię ochronną z wyświetlacza LCD

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -10°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | 10-90% bez kondensacji |
| Przechowywanie | -20°C do +60°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz OLED

Drukarka wyposażona jest w wyświetlacz OLED z czterema trybami:
- **Ekran operacyjny** – domyślny widok podczas pracy
- **Ekran informacyjny** – komunikaty tekstowe
- **Ekran konfiguracyjny** – zmiana parametrów
- **Ekran uśpienia** – po 10 sekundach bezczynności

### Ikony statusu

| Ikona | Znaczenie |
|-------|-----------|
| ✓ (zielona) | Drukarka gotowa do pracy |
| ⚠ (żółta) | Ostrzeżenie – wymaga uwagi |
| ✗ (czerwona) | Błąd – wymaga interwencji |

### Ikony baterii

| Ikona | Znaczenie |
|-------|-----------|
| 🔋 (0-4 kreski) | Poziom naładowania |
| 🔋⚡ | Ładowanie w toku |
| 🔋USB | Zasilanie z USB |
| 🔋⚠ | Błąd ładowania |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Przesuwa materiał o jedną etykietę |
| **CONFIG** | Nawigacja po menu konfiguracyjnym |

### Menu konfiguracyjne

Naciśnij CONFIG aby przejść do trybu konfiguracji:

| Opcja | Opis |
|-------|------|
| **DARKNESS** | Regulacja ciemności druku |
| **POWER UP** | Podawanie po włączeniu |
| **HEAD CLOSE** | Podawanie po zamknięciu głowicy |
| **POWER SLEEP MODE** | Tryb uśpienia |
| **PRINT** | Drukowanie raportu konfiguracyjnego |
| **MAC ADDRESS** | Wyświetlanie adresu MAC |
| **MEDIA TYPE** | Typ materiału (Journal/Black Mark/Label) |
| **EXIT** | Wyjście z menu |
`
      },
      {
        title: '4. Bateria',
        content: `
### Informacje o baterii

Drukarka ZQ220 Plus wykorzystuje **2-celową baterię Li-Ion**:
- Napięcie nominalne: 7,2 VDC
- Pojemność znamionowa: 2500 mAh
- Pojemność nominalna: 2600 mAh
- Czas ładowania: poniżej 3,5 godziny

Bateria zapewnia do **3 dni pracy** przy: 25 przystankach dziennie, do 500 paragonów 3×8,5 cala na zmianę przy 13% pokryciu.

> **Ważne:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię, aby ją wybudzić.

### Wyjmowanie baterii

1. Naciśnij zatrzask zwalniający na pakiecie baterii
2. Obróć baterię na zewnątrz z komory
3. Unieś i wyjmij pakiet baterii

### Instalacja baterii

1. Zlokalizuj komorę baterii na spodzie drukarki
2. Przechyl pakiet baterii i włóż do komory
3. Obróć baterię aż zatrzaśnie się na miejscu

### Bezpieczeństwo baterii

> **Ostrzeżenie:** Bateria może eksplodować, wyciec lub zapalić się!

- Nie rozbieraj, nie zgniataj, nie przekłuwaj baterii
- Nie zwieraj styków zewnętrznych
- Nie wrzucaj do ognia ani wody
- Nie narażaj na temperatury powyżej 65°C
- Ładuj tylko w ładowarkach zatwierdzonych przez Zebra
`
      },
      {
        title: '5. Ładowanie baterii',
        content: `
### Ładowanie przez USB

> **Ważne:** Przed pierwszym użyciem drukarki naładuj baterię, aby ją wybudzić.

**Procedura ładowania:**
1. Podłącz zasilacz AC-to-USB do gniazdka
2. Podłącz kabel USB do zasilacza
3. Obróć gumową osłonę portu USB na boku drukarki
4. Podłącz kabel USB Type-C do drukarki

### Czas ładowania

- **Pełne ładowanie:** poniżej 3,5 godziny (ładowarka USB 7,5W)

### Ładowarka 1-stanowiskowa (opcja)

Diody LED wskaźnika:
- **Czerwona świeci** – ładowanie w toku
- **Zielona świeci** – bateria w pełni naładowana

**Procedura:**
1. Podłącz zasilacz do gniazdka
2. Podłącz kabel USB do portu z tyłu ładowarki
3. Przechyl baterię i włóż do komory ładowarki
4. Obróć aż zatrzaśnie się na miejscu
`
      },
      {
        title: '6. Ładowanie materiałów',
        content: `
### Obsługiwane typy materiałów

- **Materiał ciągły (journal)** – paragony bez znaczników
- **Materiał z czarnym znacznikiem (black mark)** – znacznik z przodu lub z tyłu
- **Etykiety z przerwą (gap/label)** – rozdzielone przerwami
- **Materiał bezpodkładowy (linerless)** – etykiety bez podkładu

### Procedura ładowania

1. Przesuń dźwignię zwalniającą do przodu aby odblokować pokrywę
2. Unieś i obróć pokrywę mediów
3. Włóż rolkę materiału do komory (materiał odwija się od góry)
4. Rolka powinna swobodnie się obracać
5. Zamknij pokrywę aż zatrzaśnie się na miejscu
6. Materiał zostanie automatycznie wysunięty

### Specyfikacja materiałów

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 80 mm ±0,75 mm |
| Opcjonalne szerokości | 76,2 mm, 58 mm, 50,8 mm |
| Długość etykiety | 12,7 – 203,2 mm |
| Grubość materiału | 0,058 – 0,1575 mm |
| Maksymalna średnica rolki | 50 mm |

> **Uwaga:** Opcjonalne **wkładki redukcyjne** (adaptery do węższych rolek) umożliwiają użycie materiałów o szerokości 76,2 mm, 58 mm i 50,8 mm.
`
      },
      {
        title: '7. Podłączenie do urządzeń',
        content: `
### Komunikacja USB

1. Podłącz mniejszy wtyk USB Type-C do drukarki
2. Podłącz większy wtyk USB Type-A do komputera
3. Zainstaluj sterowniki ze strony [/sterowniki](/sterowniki)

> **Uwaga:** Wtyk Type-C można podłączyć w dowolnej orientacji.

### Komunikacja Bluetooth 5.0

ZQ220 Plus obsługuje:
- **Bluetooth 5.0** (nowsza wersja niż ZQ220)
- **BLE iOS** – iPhone 7s+, iPad Air, iPod touch

**Parowanie:**
1. Włącz Bluetooth na urządzeniu mobilnym
2. Wyszukaj drukarkę (nazwa = numer seryjny)
3. Wprowadź PIN (domyślny: 0000)
4. Potwierdź parowanie

**Bonding:** Drukarka zapamiętuje informacje o parowaniu – urządzenia pozostają sparowane po cyklach zasilania.

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. Zbliż telefon do ikony Print Touch na górze drukarki (max 7,62 cm)
3. Parowanie nastąpi automatycznie

### Obsługiwane platformy

- Apple iOS (przez BLE)
- Android (Bluetooth)
`
      },
      {
        title: '8. Noszenie drukarki',
        content: `
### Klips do paska

**Instalacja:**
1. Wyjmij pakiet baterii
2. Włóż kulkę z tyłu klipsa do gniazda na spodzie drukarki
3. Obróć klips poziomo dla dostępu do komory baterii
4. Zainstaluj baterię
5. Obróć klips pionowo

### Pasek na ramię (opcja)

Regulowany do 142,2 cm (56 cali):
1. Zapnij haczyki zatrzaskowe do zaczepów z przodu drukarki
2. Zawieś pasek na ramieniu

### Etui ochronne (opcja)

**Instalacja:**
1. Unieś górną klapkę etui (zabezpieczona rzepem)
2. Włóż drukarkę spodem do przodu
3. Wyświetlacz i przyciski widoczne przez plastikowe okienko
4. Dolna część okienka – dostęp do ścieżki papieru
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Przedłużanie żywotności baterii

- Unikaj temperatur powyżej 40°C podczas ładowania
- Używaj tylko ładowarek Zebra dla baterii Li-Ion
- Rozważ użycie wstępnie zadrukowanych etykiet
- Wyjmij baterię jeśli drukarka nie będzie używana przez dzień lub dłużej

### Harmonogram czyszczenia

| Obszar | Częstotliwość |
|--------|---------------|
| Głowica drukująca | Co 5 rolek (co 1 rolkę dla linerless) |
| Wałek dociskowy | Co 5 rolek |
| Listwa odrywająca | W razie potrzeby |

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Użyj pisaka czyszczącego Zebra (p/n 105950-035) lub wacika z 99,7% alkoholem izopropylowym
2. Przetrzyj szary pasek głowicy
3. Poczekaj aż wyschnie przed zamknięciem
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Drukowanie raportu konfiguracyjnego

**Metoda 1 – Sekwencja przycisków:**
1. Wyłącz drukarkę, załaduj materiał ciągły
2. Przytrzymaj przycisk FEED
3. Naciśnij i puść przycisk POWER (trzymając FEED)
4. Puść FEED gdy rozpocznie się drukowanie

**Metoda 2 – Z menu:**
1. Włącz drukarkę
2. Naciskaj CONFIG aż pojawi się SETTINGS-PRINT
3. Naciśnij FEED

### Typowe problemy

| Problem | Rozwiązanie |
|---------|-------------|
| **Brak zasilania** | Sprawdź baterię, naładuj lub wymień |
| **Materiał się nie podaje** | Zamknij pokrywę, sprawdź blokady |
| **Słaby/blady wydruk** | Wyczyść głowicę, sprawdź jakość materiału |
| **Zniekształcony wydruk** | Wymień baterię, sprawdź kabel |
| **Krótka żywotność baterii** | Wymień baterię jeśli starsza niż rok |
| **Brak łączności NFC** | Zbliż telefon na mniej niż 7,62 cm od Print Touch |

### Komunikaty alertów

| Komunikat | Znaczenie |
|-----------|-----------|
| **PRINTER READY** | Drukarka gotowa |
| **MEDIA OUT** | Brak materiału |
| **HEAD OPEN** | Głowica otwarta |
| **BATTERY LOW** | Niski poziom baterii |
| **BATTERY TOO LOW** | Bateria zbyt słaba |
| **CHARGE ERROR** | Błąd ładowania |
| **HEAD OVERTEMP** | Głowica przegrzana |
| **DOWNLOAD FW** | Pobieranie firmware |
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest różnica między ZQ220 a ZQ220 Plus?

**Odpowiedź:** **ZQ220 Plus** ma nowszy **Bluetooth 5.0** (vs 4.1), wyższą klasę ochrony **IP54** (vs IP43), obsługuje **dwa języki programowania CPCL i ESC/POS** (vs tylko CPCL), i jest lżejsza (**<390 g** vs 450 g). ZQ220 Plus to nowsza, ulepszona wersja.

### Do czego służy drukarka Zebra ZQ220 Plus?

**Odpowiedź:** ZQ220 Plus to **mobilna drukarka paragonów i etykiet** dla kurierów, dostawców, pracowników magazynów i sklepów. Drukuje etykiety wysyłkowe, paragony, pokwitowania dostaw o szerokości do 72 mm.

### Jak sparować ZQ220 Plus z iPhonem?

**Odpowiedź:** ZQ220 Plus obsługuje **BLE iOS** (iPhone 7s+, iPad Air). Włącz Bluetooth, wyszukaj drukarkę (nazwa = numer seryjny), wprowadź PIN (domyślny: 0000) i potwierdź parowanie.

### Jak działa parowanie przez NFC (Print Touch)?

**Odpowiedź:** Włącz NFC na smartfonie i zbliż go do ikony **Print Touch** na górze drukarki (max 7,62 cm). Parowanie nastąpi automatycznie – bez wpisywania kodów PIN.

### Jak długo ładuje się bateria ZQ220 Plus?

**Odpowiedź:** Pełne ładowanie baterii 2500 mAh trwa **poniżej 3,5 godziny** przy użyciu ładowarki USB 7,5W. Można też używać opcjonalnej ładowarki 1-stanowiskowej.

### Czy ZQ220 Plus obsługuje materiały bezpodkładowe (linerless)?

**Odpowiedź:** Tak, ZQ220 Plus obsługuje materiały **linerless** – etykiety bez podkładu. Wymaga częstszego czyszczenia głowicy (po każdej rolce).

### Jaka jest klasa ochrony ZQ220 Plus?

**Odpowiedź:** ZQ220 Plus ma klasę ochrony **IP54** (wyższa niż ZQ220 z IP43) – lepsza odporność na kurz i zachlapania wodą.

### Jak wydrukować raport konfiguracyjny ZQ220 Plus?

**Odpowiedź:** **Metoda 1:** Wyłącz drukarkę, przytrzymaj FEED, naciśnij POWER, puść FEED gdy zacznie drukować. **Metoda 2:** Naciskaj CONFIG aż pojawi się SETTINGS-PRINT, naciśnij FEED.

### Jakie języki programowania obsługuje ZQ220 Plus?

**Odpowiedź:** ZQ220 Plus obsługuje **CPCL i ESC/POS** – dwa języki programowania. To przewaga nad ZQ220, który obsługuje tylko CPCL.

### Czy można używać węższych materiałów w ZQ220 Plus?

**Odpowiedź:** Tak, z opcjonalnymi **wkładkami redukcyjnymi** (adaptery do węższych rolek) można używać materiałów o szerokości 76,2 mm, 58 mm i 50,8 mm zamiast standardowych 80 mm.

### Czy ZQ220 Plus wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ220 Plus to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu. Używa materiałów termoczułych.
`
      }
    ]
  },
  'zq310plus': {
    model: 'ZQ310 Plus',
    title: 'Zebra ZQ310 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZQ310 Plus User Guide',
    keywords: [
      'ZQ310 Plus', 'zebra zq310 plus', 'drukarka mobilna', 'drukarka paragonów', 
      'instrukcja ZQ310 Plus', 'ZQ310 Plus po polsku', 'drukarka 2 cale',
      'drukarka kurierska', 'drukarka przenośna', 'Bluetooth 4.0',
      'USB Type-C', 'NFC Print Touch', 'linerless', 'IP54', '58 mm',
      'CPCL', 'ZPL', 'PowerPrecision+', 'WiFi 802.11ac'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ310 Plus

Zebra ZQ310 Plus to kompaktowa **mobilna drukarka paragonów i etykiet** o szerokości druku do **48 mm (1,89")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, **Bluetooth 4.0** (BR/EDR, LE), opcjonalnie WLAN 802.11ac, Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony **IP54**.

### Parametry techniczne

| Parametr | ZQ310 Plus |
|----------|------------|
| **Szerokość druku** | do 48 mm (1,89") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku (linered) | do 101,6 mm/s (4,0"/s) |
| Prędkość druku (linerless) | do 50,8 mm/s (2,0"/s) |
| Maks. średnica rolki | 40 mm |
| Pojemność baterii | **2280 mAh PowerPrecision+** |
| **Waga z baterią** | 0,37 kg |

### Porównanie ZQ310 Plus vs ZQ320 Plus

| Parametr | ZQ310 Plus | ZQ320 Plus |
|----------|------------|------------|
| Szerokość druku | **48 mm (2")** | 72 mm (3") |
| Szerokość materiału | 58 mm | 80 mm |
| Waga | **0,37 kg** | 0,43 kg |
| Prędkość linerless | 50,8 mm/s | 76,2 mm/s |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 58 mm (standard) | ±0,75 mm |
| 50,8 mm (2") | Z wkładkami redukcyjnymi (opcja) |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- **Bluetooth 4.0** (BR/EDR, LE) – standard
- Opcjonalnie: **Dual Radio** (802.11 a/b/g/n/ac + Bluetooth 5.2)
- **Near Field Communication (NFC)** – parowanie przez Print Touch

### Cechy charakterystyczne

- **Najlżejsza w serii** – tylko 0,37 kg z baterią
- Panel LED z ikonami statusu (Power, Feed, Fault, Battery, WiFi, Bluetooth)
- Klasa ochrony **IP54**
- Obsługa materiałów **linered i linerless**
- Języki programowania **CPCL i ZPL**
- Bateria **PowerPrecision+** z inteligentnym monitorowaniem
- Kompatybilność z iOS (MFi), Android, Windows
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ310 Plus
- Bateria Li-Ion PowerPrecision+ 2280 mAh
- Przewodnik szybkiego startu
- Kabel USB Type-A do Type-C
- Przewodnik regulacyjny
- Klips do paska

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | **-15°C do +50°C** | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | 10-90% bez kondensacji |
| Przechowywanie (bez baterii) | -20°C do +60°C | 10-90% bez kondensacji |
| Przechowywanie (z baterią) | -25°C do +45°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania LED',
        content: `
### Diody LED statusu

- **Power LED Ring** – pierścień wokół przycisku zasilania
- **Feed** – przycisk podawania materiału
- **Fault** – ikona błędu (bursztynowa LED)
- **Battery** – wskaźnik poziomu baterii (3 paski)
- **WiFi** – status połączenia WiFi
- **Bluetooth** – status połączenia Bluetooth (niebieska LED)

### Ikony statusu Power Ring

| Kolor | Znaczenie |
|-------|-----------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony pulsujący | Tryb uśpienia |
| Bursztynowy ciągły | Ładowanie baterii |
| Czerwony ciągły | Bateria niezdrowa |
| Czerwony migający | Błąd ładowania |

### Ikony baterii

| Wskaźnik | Znaczenie |
|----------|-----------|
| 3 paski | ≥66% naładowania |
| 2 paski | ≥33% naładowania |
| 1 pasek | ≥15% naładowania |
| 1 pasek migający | <15% naładowania |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | <3s = tryb uśpienia, >3s = wyłączenie |
| **FEED** | Przesuwa materiał o jedną etykietę |

### Kombinacje przycisków

| Funkcja | Sposób wykonania |
|---------|------------------|
| Raport konfiguracyjny | FEED + POWER do migania, puść POWER, trzymaj FEED do bursztynowej WiFi LED |
| Tryb wymuszony | FEED + POWER, puść POWER, trzymaj FEED do zielonej WiFi LED |
`
      },
      {
        title: '4. Bateria PowerPrecision+',
        content: `
### Informacje o baterii

Drukarka wykorzystuje inteligentną baterię **Li-Ion PowerPrecision+**:
- Napięcie nominalne: 7,2 VDC
- Pojemność: **2280 mAh**
- Inteligentne monitorowanie stanu w czasie rzeczywistym
- Śledzenie cykli ładowania i stanu zdrowia

> **Ważne:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię.

### Wyjmowanie baterii

1. Obróć klips do paska aby uzyskać dostęp
2. Naciśnij zatrzask zwalniający
3. Obróć baterię na zewnątrz i wyjmij

### Instalacja baterii

1. Ustaw baterię pod kątem (zatrzask do tyłu)
2. Wsuń przód baterii do wnęki
3. Dociśnij tył aż zatrzaśnie się na miejscu

### Metody ładowania

| Metoda | Czas ładowania |
|--------|----------------|
| Stacja dokująca 1-slot | <3,5 godziny |
| Ładowarka baterii 1-slot | <4 godziny |
| Ładowarka baterii 3-slot | <4 godziny |
| Adapter AC-to-USB | Zależny od źródła |

### Wskaźniki ładowania

| Kolor | Znaczenie |
|-------|-----------|
| Bursztynowy ciągły | Ładowanie |
| Zielony ciągły | Naładowana |
| Czerwony ciągły | Bateria niezdrowa |
| Czerwony migający | Błąd ładowania |
`
      },
      {
        title: '5. Ładowanie materiałów',
        content: `
### Obsługiwane materiały

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 58 mm ±0,75 mm |
| Szerokość z wkładkami | 50,8 mm ±0,75 mm |
| Minimalna długość etykiety | 12,5 mm |
| Grubość materiału | 0,053–0,1614 mm |
| Maks. średnica rolki | 40 mm |

### Procedura ładowania

1. Naciśnij przycisk zwalniający aby otworzyć pokrywę
2. Włóż rolkę (strona termiczna na zewnątrz)
3. Zamknij pokrywę, wyprowadzając koniec materiału
4. Pokrywa zatrzaśnie się, materiał przesunie automatycznie

### Wkładki redukcyjne (opcja)

Zestaw wkładek (p/n KIT-MPM-MD2SPR5-01) umożliwia obsługę materiałów **50,8 mm (2")**:
1. Wsuń wkładki w rowki po bokach komory
2. Aby usunąć, użyj płaskiego narzędzia
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

- Standard USB 2.0 Type-C
- Ładowanie i komunikacja jednocześnie
- Sterowniki: [/sterowniki](/sterowniki)

### Bluetooth 4.0

- BR/EDR i LE
- Kompatybilność z **iOS (MFi)**, Android, Windows
- Zasięg do 10 m
- Parowanie przez NFC

### WiFi (opcja Dual Radio)

- 802.11 a/b/g/n/ac
- Bluetooth 5.2 w opcji dual radio
- Tryby: Infrastructure, Ad-hoc

### NFC (Print Touch)

Dotknięcie ikony Print Touch umożliwia:
- Automatyczne parowanie Bluetooth
- Uruchomienie aplikacji
- Dostęp do strony wsparcia
`
      },
      {
        title: '7. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek (co 1 rolkę dla linerless) |
| Wałek dociskowy (linered) | Co 5 rolek |
| Wałek dociskowy (linerless) | Tylko przy problemach |
| Listwa odrywająca | W razie potrzeby |

### Czyszczenie głowicy

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Użyj pisaka czyszczącego Zebra lub wacika z 90% alkoholem
2. Przetrzyj szarą linię od środka na zewnątrz
3. Poczekaj aż wyschnie

### Przedłużanie żywotności baterii

- Unikaj temperatur powyżej 40°C podczas ładowania
- Wyjmuj baterię gdy drukarka nieużywana przez dzień+
- Baterie tracą pojemność z czasem – wymieniaj gdy potrzeba
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
### Drukowanie raportu konfiguracyjnego

1. Wyłącz drukarkę, załaduj materiał ciągły
2. Przytrzymaj FEED
3. Naciśnij POWER do migania LED Power Ring
4. Puść POWER (LED Fault zacznie pulsować)
5. Trzymaj FEED do bursztynowej diody WiFi
6. Puść FEED – raport wydrukuje się

### Typowe problemy

| Problem | Rozwiązanie |
|---------|-------------|
| **Brak zasilania** | Naładuj lub zainstaluj ponownie baterię |
| **Materiał się nie podaje** | Zamknij pokrywę, sprawdź komorę |
| **Słaby/wyblakły druk** | Wyczyść głowicę, naładuj baterię |
| **Krótka żywotność baterii** | Wymień baterię (>1 rok) |
| **Brak łączności NFC** | Zbliż urządzenie do 7,62 cm |

### Ikony błędów (Fault LED)

| Stan | Znaczenie |
|------|-----------|
| Wyłączona | Brak błędu |
| Ciągła bursztynowa | Brak materiału |
| Miga 1 raz/s | Pokrywa otwarta |
| Miga co 2 s | Błąd głowicy |
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest różnica między ZQ310 Plus a ZQ320 Plus?

**Odpowiedź:** **ZQ310 Plus** drukuje materiał o szerokości **48 mm (2 cale)**, **ZQ320 Plus** drukuje **72 mm (3 cale)**. ZQ310 Plus jest lżejsza (0,37 kg vs 0,43 kg) i kompaktniejsza. Wybierz ZQ310 Plus dla mniejszych paragonów i etykiet.

### Do czego służy Zebra ZQ310 Plus?

**Odpowiedź:** ZQ310 Plus to **mobilna drukarka paragonów i etykiet** dla kurierów, dostawców, pracowników magazynów. Drukuje paragony, pokwitowania dostaw, etykiety wysyłkowe o szerokości do 48 mm.

### Co to jest bateria PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z **monitorowaniem stanu w czasie rzeczywistym**. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność – informacje dostępne w oprogramowaniu Zebra.

### Jak sparować ZQ310 Plus z iPhone?

**Odpowiedź:** ZQ310 Plus ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch** do automatycznego parowania.

### Jak długo ładuje się bateria ZQ310 Plus?

**Odpowiedź:** W stacji dokującej 1-slot: **poniżej 3,5 godziny**. W ładowarce baterii: **poniżej 4 godzin**. Temperatura ładowania: 0–37°C.

### Czy ZQ310 Plus obsługuje WiFi?

**Odpowiedź:** Standardowo ZQ310 Plus ma tylko **Bluetooth 4.0**. Opcjonalnie dostępna jest wersja **Dual Radio** z WiFi 802.11ac + Bluetooth 5.2.

### Jaka jest klasa ochrony ZQ310 Plus?

**Odpowiedź:** ZQ310 Plus ma klasę ochrony **IP54** – odporność na kurz i zachlapania wodą. Idealna do pracy w terenie.

### Jakie języki programowania obsługuje ZQ310 Plus?

**Odpowiedź:** ZQ310 Plus obsługuje **CPCL i ZPL** – dwa języki programowania drukarek Zebra. Zapewnia to kompatybilność z szeroką gamą aplikacji.

### Czy można używać węższych materiałów w ZQ310 Plus?

**Odpowiedź:** Tak, z opcjonalnymi **wkładkami redukcyjnymi** (nr kat. KIT-MPM-MD2SPR5-01) można używać materiałów **50,8 mm (2")** zamiast standardowych 58 mm.

### Ile waży drukarka ZQ310 Plus?

**Odpowiedź:** ZQ310 Plus waży tylko **0,37 kg** z baterią. Jest to najlżejsza drukarka w serii ZQ3 Plus.

### Czy ZQ310 Plus wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ310 Plus to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.
`
      }
    ]
  },
  'zq320plus': {
    model: 'ZQ320 Plus',
    title: 'Zebra ZQ320 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-09',
    sourceDocument: 'Zebra ZQ320 Plus User Guide',
    keywords: [
      'ZQ320 Plus', 'zebra zq320 plus', 'drukarka mobilna', 'drukarka paragonów', 
      'instrukcja ZQ320 Plus', 'ZQ320 Plus po polsku', 'drukarka 3 cale',
      'drukarka kurierska', 'drukarka przenośna', 'Bluetooth 4.0',
      'USB Type-C', 'NFC Print Touch', 'linerless', 'IP54', '80 mm',
      'CPCL', 'ZPL', 'PowerPrecision+', 'WiFi 802.11ac', 'Indoor', 'Outdoor'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ320 Plus

Zebra ZQ320 Plus to kompaktowa **mobilna drukarka paragonów i etykiet** o szerokości druku do **72 mm (2,83")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej, rządowej i detalicznej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, **Bluetooth 4.0** (BR/EDR, LE), opcjonalnie WLAN 802.11ac, Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony **IP54**.

### Parametry techniczne

| Parametr | ZQ320 Plus |
|----------|------------|
| **Szerokość druku** | do 72 mm (2,83") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku (linered) | do 101,6 mm/s (4,0"/s) |
| Prędkość druku (linerless) | do 76,2 mm/s (3,0"/s) |
| Maks. średnica rolki | 40 mm |
| Pojemność baterii | **2280 mAh PowerPrecision+** |
| **Waga z baterią** | 0,43 kg |

### Wersje drukarki

| Model | Kolor | Łączność | Czujniki |
|-------|-------|----------|----------|
| **ZQ320 Plus Outdoor** | Czarny | Bluetooth 4.0 | Media Out, Black Bar |
| **ZQ320 Plus Indoor** | Srebrno-czarny | **Dual Radio** (WiFi + BT 5.2) | **Gap**, Black Bar, Media Out |

### Porównanie ZQ310 Plus vs ZQ320 Plus

| Parametr | ZQ310 Plus | ZQ320 Plus |
|----------|------------|------------|
| Szerokość druku | 48 mm (2") | **72 mm (3")** |
| Szerokość materiału | 58 mm | **80 mm** |
| Waga | 0,37 kg | **0,43 kg** |
| Prędkość linerless | 50,8 mm/s | **76,2 mm/s** |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 80 mm (standard) | ±0,75 mm |
| 76,2 mm (3") | Z wkładkami redukcyjnymi (opcja) |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- **Bluetooth 4.0** (BR/EDR, LE) – standard
- Opcjonalnie: **Dual Radio** (802.11 a/b/g/n/ac + Bluetooth 5.2)
- **Near Field Communication (NFC)** – parowanie przez Print Touch

### Cechy charakterystyczne

- **Kompaktowa konstrukcja** – waga 0,43 kg z baterią
- Panel LED z ikonami statusu
- Klasa ochrony **IP54**
- Obsługa materiałów **linered i linerless**
- Języki programowania **CPCL i ZPL**
- Bateria **PowerPrecision+** z inteligentnym monitorowaniem
- Wersje **Indoor** (WiFi) i **Outdoor** (tylko Bluetooth)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ320 Plus
- Bateria Li-Ion PowerPrecision+ 2280 mAh
- Przewodnik szybkiego startu
- Kabel USB Type-A do Type-C
- Przewodnik regulacyjny
- Klips do paska

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | **-15°C do +50°C** | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | 10-90% bez kondensacji |
| Przechowywanie (bez baterii) | -20°C do +60°C | 10-90% bez kondensacji |
| Przechowywanie (z baterią) | -25°C do +45°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania LED',
        content: `
### Diody LED statusu

- **Power LED Ring** – pierścień wokół przycisku zasilania
- **Feed** – przycisk podawania materiału
- **Fault** – ikona błędu (bursztynowa LED)
- **Battery** – wskaźnik poziomu baterii (3 paski)
- **WiFi** – status połączenia WiFi
- **Bluetooth** – status połączenia Bluetooth (niebieska LED)

### Ikony statusu Power Ring

| Kolor | Znaczenie |
|-------|-----------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony pulsujący | Tryb uśpienia |
| Bursztynowy ciągły | Ładowanie baterii |
| Czerwony ciągły | Bateria niezdrowa |
| Czerwony migający | Błąd ładowania |

### Ikony baterii

| Wskaźnik | Znaczenie |
|----------|-----------|
| 3 paski | ≥66% naładowania |
| 2 paski | ≥33% naładowania |
| 1 pasek | ≥15% naładowania |
| 1 pasek migający | <15% naładowania |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | <3s = tryb uśpienia, >3s = wyłączenie |
| **FEED** | Przesuwa materiał o jedną etykietę |

### Tryb uśpienia

Po **20 minutach** bezczynności drukarka automatycznie przechodzi w tryb uśpienia:
- Power LED Ring pulsuje
- Naciśnij POWER <3s aby wybudzić
`
      },
      {
        title: '4. Bateria PowerPrecision+',
        content: `
### Informacje o baterii

Drukarka wykorzystuje inteligentną baterię **Li-Ion PowerPrecision+**:
- Napięcie nominalne: 7,2 VDC
- Pojemność: **2280 mAh**
- Inteligentne monitorowanie stanu w czasie rzeczywistym
- Śledzenie cykli ładowania i stanu zdrowia

> **Ważne:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię.

### Wyjmowanie baterii

1. Obróć klips do paska aby uzyskać dostęp
2. Naciśnij zatrzask zwalniający
3. Obróć baterię na zewnątrz i wyjmij

### Instalacja baterii

1. Ustaw baterię pod kątem (zatrzask do tyłu)
2. Wsuń przód baterii do wnęki
3. Dociśnij tył aż zatrzaśnie się na miejscu

### Metody ładowania

| Metoda | Czas ładowania |
|--------|----------------|
| Stacja dokująca 1-slot | <3,5 godziny |
| Stacja dokująca 5-slot | <4 godziny |
| Ładowarka baterii 1-slot | <4 godziny |
| Ładowarka baterii 3-slot | <4 godziny |

### Wskaźniki ładowania

| Kolor | Znaczenie |
|-------|-----------|
| Bursztynowy ciągły | Ładowanie |
| Zielony ciągły | Naładowana |
| Czerwony ciągły | Bateria niezdrowa |
| Czerwony migający | Błąd ładowania |
`
      },
      {
        title: '5. Ładowanie materiałów',
        content: `
### Obsługiwane materiały

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 80 mm ±0,75 mm |
| Szerokość z wkładkami | 76,2 mm ±0,75 mm |
| Minimalna długość etykiety | 12,5 mm |
| Grubość materiału | 0,053–0,1614 mm |
| Maks. średnica rolki | 40 mm |
| Typy materiałów | Papier termiczny, etykiety, **linerless** |

### Procedura ładowania

1. Naciśnij przycisk zwalniający aby otworzyć pokrywę
2. Włóż rolkę (strona termiczna na zewnątrz)
3. Zamknij pokrywę, wyprowadzając koniec materiału
4. Pokrywa zatrzaśnie się, materiał przesunie automatycznie

### Wkładki redukcyjne (opcja)

Zestaw wkładek (p/n KIT-MPM-MDSPR5-01) umożliwia obsługę materiałów **76,2 mm (3")**:
1. Wsuń wkładki w rowki po bokach komory
2. Aby usunąć, użyj płaskiego narzędzia
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

- Standard USB 2.0 Type-C
- Ładowanie i komunikacja jednocześnie
- Sterowniki: [/sterowniki](/sterowniki)

### Bluetooth 4.0

- BR/EDR i LE
- Kompatybilność z **iOS (MFi)**, Android, Windows
- Zasięg do 10 m
- Parowanie przez NFC

### WiFi (opcja Dual Radio – wersja Indoor)

- 802.11 a/b/g/n/ac
- Bluetooth 5.2 w opcji dual radio
- Tryby: Infrastructure, Ad-hoc

### NFC (Print Touch)

Dotknięcie ikony Print Touch umożliwia:
- Automatyczne parowanie Bluetooth
- Uruchomienie aplikacji
- Dostęp do strony wsparcia
`
      },
      {
        title: '7. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek (co 1 rolkę dla linerless) |
| Wałek dociskowy (linered) | Co 5 rolek |
| Wałek dociskowy (linerless) | Tylko przy problemach |
| Listwa odrywająca | W razie potrzeby |

### Czyszczenie głowicy

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Użyj pisaka czyszczącego Zebra lub wacika z 90% alkoholem
2. Przetrzyj szarą linię od środka na zewnątrz
3. Poczekaj aż wyschnie

### Przedłużanie żywotności baterii

- Unikaj temperatur powyżej 40°C podczas ładowania
- Wyjmuj baterię gdy drukarka nieużywana przez dzień+
- Baterie tracą pojemność z czasem – wymieniaj gdy potrzeba
`
      },
      {
        title: '8. Rozwiązywanie problemów',
        content: `
### Drukowanie raportu konfiguracyjnego

1. Wyłącz drukarkę, załaduj materiał ciągły
2. Przytrzymaj FEED
3. Naciśnij POWER do migania LED Power Ring
4. Puść POWER (LED Fault zacznie pulsować)
5. Trzymaj FEED do bursztynowej diody WiFi
6. Puść FEED – raport wydrukuje się

### Typowe problemy

| Problem | Rozwiązanie |
|---------|-------------|
| **Brak zasilania** | Naładuj lub zainstaluj ponownie baterię |
| **Materiał się nie podaje** | Zamknij pokrywę, sprawdź komorę |
| **Słaby/wyblakły druk** | Wyczyść głowicę, naładuj baterię |
| **Krótka żywotność baterii** | Wymień baterię (>1 rok) |
| **Brak łączności NFC** | Zbliż urządzenie do 7,62 cm |

### Ikony błędów (Fault LED)

| Stan | Znaczenie |
|------|-----------|
| Wyłączona | Brak błędu |
| Ciągła bursztynowa | Brak materiału |
| Miga 1 raz/s | Pokrywa otwarta |
| Miga co 2 s | Błąd głowicy |
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest różnica między ZQ320 Plus Indoor a Outdoor?

**Odpowiedź:** **Indoor** (srebrno-czarny) ma **Dual Radio** (WiFi 802.11ac + Bluetooth 5.2) i czujnik **Gap** do etykiet. **Outdoor** (czarny) ma tylko Bluetooth 4.0 i jest przeznaczony do pracy w terenie bez WiFi.

### Jaka jest różnica między ZQ310 Plus a ZQ320 Plus?

**Odpowiedź:** **ZQ310 Plus** drukuje materiał o szerokości **48 mm (2 cale)**, **ZQ320 Plus** drukuje **72 mm (3 cale)**. ZQ320 Plus jest nieco cięższa (0,43 kg vs 0,37 kg) ale obsługuje większe etykiety wysyłkowe.

### Do czego służy Zebra ZQ320 Plus?

**Odpowiedź:** ZQ320 Plus to **mobilna drukarka paragonów i etykiet** dla kurierów, dostawców, pracowników magazynów. Drukuje paragony, pokwitowania dostaw, etykiety wysyłkowe o szerokości do 72 mm.

### Co to jest bateria PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z **monitorowaniem stanu w czasie rzeczywistym**. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ320 Plus z iPhone?

**Odpowiedź:** ZQ320 Plus ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jak długo ładuje się bateria ZQ320 Plus?

**Odpowiedź:** W stacji dokującej 1-slot: **poniżej 3,5 godziny**. W stacji 5-slot lub ładowarce baterii: **poniżej 4 godzin**.

### Jaka jest klasa ochrony ZQ320 Plus?

**Odpowiedź:** ZQ320 Plus ma klasę ochrony **IP54** – odporność na kurz i zachlapania wodą.

### Jakie języki programowania obsługuje ZQ320 Plus?

**Odpowiedź:** ZQ320 Plus obsługuje **CPCL i ZPL** – dwa języki programowania drukarek Zebra.

### Czy można używać węższych materiałów w ZQ320 Plus?

**Odpowiedź:** Tak, z opcjonalnymi **wkładkami redukcyjnymi** (nr kat. KIT-MPM-MDSPR5-01) można używać materiałów **76,2 mm (3")** zamiast standardowych 80 mm.

### Ile waży drukarka ZQ320 Plus?

**Odpowiedź:** ZQ320 Plus waży **0,43 kg** z baterią.

### Czy ZQ320 Plus wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ320 Plus to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.
`
      }
    ]
  },
  'zq510': {
    model: 'ZQ510',
    title: 'Zebra ZQ510 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ510/ZQ520 User Guide (P1064404-004)',
    keywords: [
      'zebra zq510 instrukcja',
      'zq510 instrukcja po polsku',
      'zebra zq510 manual',
      'drukarka mobilna zebra zq510',
      'zebra zq510 bateria',
      'zq510 ładowanie',
      'zebra zq510 bluetooth',
      'zq510 wifi',
      'zebra zq510 nfc',
      'zq510 parowanie',
      'zebra zq510 materiały',
      'zq510 rolki etykiet',
      'zebra zq510 czyszczenie',
      'zq510 głowica',
      'zebra zq510 powerprecision',
      'zq510 specyfikacja',
      'zebra zq510 ip54',
      'zq510 wytrzymała',
      'zebra zq510 mfi',
      'zq510 iphone',
      'drukarka przenośna zebra zq510',
      'zebra zq510 2 calowa',
      'zq510 paragony',
      'zebra zq510 etykiety',
      'zq510 logistyka',
      'zebra zq510 transport',
      'zq510 serwis',
      'instrukcja obsługi zebra zq510'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ510

Zebra ZQ510 to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **72 mm (2,83")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **72 mm** (2,83") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **51 mm** (2,0") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| Klasa ochrony | **IP54** |
| Certyfikat wojskowy | **MIL-STD 810G** |
| Waga z baterią | **0,61 kg** |
| Wymiary (S×W×D) | 120 × 61 × 150 mm |

### Kluczowe funkcje

- **Dual radio** 802.11ac/Bluetooth 4.1
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
`
      },
      {
        title: '2. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału | Wskaźnik siły sygnału bezprzewodowego |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane |
| Materiał | Status materiału do druku |
| Otwarta pokrywa | Pokrywa komory mediów otwarta |
| Bateria | Stan naładowania baterii |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość druku) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '3. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +55°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -30°C do +66°C |

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Wyjmowanie baterii

1. Obróć klips do paska (jeśli jest obecny).
2. Naciśnij zatrzask na baterii.
3. Obróć baterię od drukarki i wyjmij ją.

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |
`
      },
      {
        title: '4. Ładowanie baterii',
        content: `
### Smart Charger-2 (SC2)
**p/n P1031365-063**

Czas ładowania: **2 godziny** dla wszystkich baterii.

| Zasilanie DC | Wskaźnik LED | Status baterii |
|--------------|--------------|----------------|
| Obecne | Zielony | Bateria nieobecna lub w pełni naładowana |
| Obecne | Żółty | Ładowanie w toku |
| Obecne | Bursztynowy | Błąd |
| Obecne | Wyłączony | Bateria obecna, stan zdrowia = POOR |

### Ładowarka 1-Slot Battery Charger
**p/n SAC-MPP-1BCHGUS1-01**

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

### Ładowarka 3-Slot Battery Charger
**p/n SAC-MPP-3BCHGUS1-01**

Ładuje do 3 baterii jednocześnie.

### Zasilacz AC (ładowanie przez drukarkę)
**p/n P1031365-024**

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.

> **Ważne:** Ładowanie podczas używania drukarki wydłuża czas ładowania.
`
      },
      {
        title: '5. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów.
   - Włóż rolkę materiału między podpory (etykietami na zewnątrz).
   - Dyski automatycznie dopasują się do szerokości rolki.
   - Rolka powinna swobodnie się obracać.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | **80 mm** (3,15") +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału | 0,058 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **51 mm** (2,0") |
| Średnica wewnętrzna rdzenia | 19 mm standard, 12,5 mm opcja |
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem lub urządzeniem mobilnym
- Ładowanie drukarki (przez zasilacz AC)

### Bluetooth 4.1

| Parametr | Wartość |
|----------|---------|
| Wersja | Bluetooth 4.1 (BR/EDR + LE) |
| Zasięg | Do **100 m** w otwartej przestrzeni |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Częstotliwości | **2,4 GHz i 5 GHz** (dual band) |
| Zabezpieczenia | WEP, WPA, WPA2, 802.1x |
| Konfiguracja | Dual Radio (WiFi + Bluetooth) |

### Near Field Communication (NFC)

Drukarka ZQ510 obsługuje pasywny tag NFC zgodny z formatem Android Standard Tag. Funkcje NFC:
- **Parowanie Bluetooth** - automatyczne parowanie przez zbliżenie urządzenia NFC
- **Uruchamianie aplikacji** - automatyczne uruchomienie aplikacji Zebra na smartfonie
- **Dostęp do strony wsparcia** - szybki dostęp do informacji o drukarce

> **Uwaga:** Dotknij ikony **Zebra Print Touch™** smartfonem z NFC, aby uzyskać dostęp do informacji o drukarce.
`
      },
      {
        title: '7. Parowanie z urządzeniami',
        content: `
### Parowanie przez NFC (Android)

1. Włącz NFC na urządzeniu mobilnym.
2. Zbliż urządzenie do ikony Print Touch na drukarce.
3. Urządzenie automatycznie sparuje się z drukarką.

### Parowanie Bluetooth (iOS - MFi)

1. Włącz Bluetooth na urządzeniu iOS.
2. W ustawieniach Bluetooth znajdź drukarkę ZQ510.
3. Wybierz drukarkę, aby nawiązać połączenie.
4. Drukarka obsługuje iOS 10 i nowsze.

### Parowanie Bluetooth (Android)

1. Włącz Bluetooth na urządzeniu Android.
2. Wyszukaj dostępne urządzenia Bluetooth.
3. Wybierz drukarkę ZQ510 z listy.
4. Potwierdź parowanie (jeśli wymagane).

### Parowanie Bluetooth (Windows)

1. Otwórz Ustawienia > Urządzenia > Bluetooth.
2. Włącz Bluetooth i wyszukaj urządzenia.
3. Wybierz drukarkę ZQ510.
4. Zainstaluj sterownik Zebra Designer Driver (jeśli wymagany).

### Narzędzia konfiguracyjne Zebra

- **Zebra Setup Utilities** - konfiguracja pojedynczej drukarki
- **ZebraNet Bridge Enterprise** - zarządzanie flotą drukarek
- **Zebra Mobile Setup Utility** - konfiguracja przez urządzenie Android
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość | Metoda |
|---------|---------------|--------|
| Głowica drukująca | Co wymianę rolki lub przy problemach z jakością | Pisak czyszczący |
| Wałek dociskowy | Co wymianę rolki | Pisak czyszczący |
| Czujnik czarnych znaczników | W razie potrzeby | Sprężone powietrze, pisak |
| Obudowa zewnętrzna | W razie potrzeby | Miękka ściereczka |

### Czyszczenie głowicy drukującej

1. Wyłącz drukarkę i otwórz pokrywę mediów.
2. Wyjmij rolkę materiału.
3. Przetrzyj głowicę pisakiem czyszczącym (p/n 105950-035).
4. Poczekaj, aż głowica wyschnie przed zamknięciem pokrywy.

### Przedłużanie żywotności baterii

- Unikaj całkowitego rozładowania baterii
- Przechowuj baterie w temperaturze pokojowej
- Ładuj baterie przed długim przechowywaniem
- Wymieniaj baterie o stanie zdrowia REPLACE lub POOR
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Drukarka nie włącza się | Rozładowana bateria | Naładuj lub wymień baterię |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Słaba jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| | Zbyt niska temperatura | Ogrzej drukarkę |
| Zacięcie materiału | Nieprawidłowe załadowanie | Załaduj materiał ponownie |
| | Uszkodzony materiał | Użyj nowej rolki |
| Brak połączenia Bluetooth | Bluetooth wyłączony | Włącz Bluetooth na obu urządzeniach |
| | Zbyt duża odległość | Zbliż urządzenia |
| | Nieprawidłowe parowanie | Usuń parowanie i sparuj ponownie |
| Brak połączenia WiFi | Nieprawidłowe ustawienia | Sprawdź SSID i hasło |
| | Słaby sygnał | Zbliż się do punktu dostępowego |

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '10. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Kombinacja przycisków przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
3. Drukarka wydrukuje etykietę "Two Key Report".

### Metoda 2: Kombinacja przycisków przy włączaniu (rozszerzona)

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje etykietę konfiguracyjną, a następnie etykietę sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje etykietę konfiguracyjną Two-key i ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.
`
      },
      {
        title: '11. Akcesoria',
        content: `
### Lista akcesoriów ZQ510

| Akcesorium | Numer katalogowy |
|------------|------------------|
| Smart Charger-2 (SC2) | P1031365-063 |
| Zasilacz AC | P1031365-024 |
| Zasilacz AC Healthcare | P1065668-008 |
| Ładowarka 1-Slot | SAC-MPP-1BCHGUS1-01 |
| Ładowarka 3-Slot | SAC-MPP-3BCHGUS1-01 |
| Ładowarka Dual 3-Slot | SAC-MPP-6BCHUS1-01 |
| Quad Charger | AC18177-5 |
| Bateria rozszerzona 4-cell | P1058672 |
| Dyski podpory mediów 12,5mm | P1063406-025 |
| Pasek na ramię | P1031365-034 |
| Etui miękkie | P1031365-029 |
| Pisak czyszczący (12 szt.) | 105950-035 |

### Akcesoria do noszenia

- **Obrotowy klips do paska** - standardowe wyposażenie
- **Pasek na rękę** - pewny chwyt podczas przenoszenia
- **Pasek na ramię** - do noszenia podczas dłuższej pracy w terenie
- **Etui miękkie** - chroni przed uszkodzeniami mechanicznymi
- **Egzoszkielet** - dodatkowa ochrona zewnętrzna
- **Czytnik kart magnetycznych** - opcjonalne akcesorium
`
      },
      {
        title: '12. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ510?

**Odpowiedź:** ZQ510 drukuje do **72 mm (2,83")** szerokości – jest to drukarka **2-calowa**.

### Czy ZQ510 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ510 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Jak długo ładuje się bateria ZQ510?

**Odpowiedź:** W ładowarce Smart Charger-2: **2 godziny**. W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ510 z iPhone?

**Odpowiedź:** ZQ510 ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ510?

**Odpowiedź:** ZQ510 ma klasę ochrony **IP54** – odporność na kurz i zachlapania wodą. Ma też certyfikat **MIL-STD 810G**.

### Jakie języki programowania obsługuje ZQ510?

**Odpowiedź:** ZQ510 obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra.

### Ile waży drukarka ZQ510?

**Odpowiedź:** ZQ510 waży **0,61 kg** z baterią.

### Jak szybko drukuje ZQ510?

**Odpowiedź:** Prędkość druku: do **127 mm/s** (5"/s) dla materiałów linered, do **76,2 mm/s** (3"/s) dla materiałów linerless.
`
      }
    ]
  },
  'zq520': {
    model: 'ZQ520',
    title: 'Zebra ZQ520 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ510/ZQ520 User Guide (P1064404-004)',
    keywords: [
      'zebra zq520 instrukcja',
      'zq520 instrukcja po polsku',
      'zebra zq520 manual',
      'drukarka mobilna zebra zq520',
      'zebra zq520 bateria',
      'zq520 ładowanie',
      'zebra zq520 bluetooth',
      'zq520 wifi',
      'zebra zq520 nfc',
      'zq520 parowanie',
      'zebra zq520 materiały',
      'zq520 rolki etykiet',
      'zebra zq520 czyszczenie',
      'zq520 głowica',
      'zebra zq520 powerprecision',
      'zq520 specyfikacja',
      'zebra zq520 ip54',
      'zq520 wytrzymała',
      'zebra zq520 mfi',
      'zq520 iphone',
      'drukarka przenośna zebra zq520',
      'zebra zq520 4 calowa',
      'zq520 paragony',
      'zebra zq520 etykiety',
      'zq520 logistyka',
      'zebra zq520 transport',
      'zq520 serwis',
      'instrukcja obsługi zebra zq520'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ520

Zebra ZQ520 to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **104 mm (4,09")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **104 mm** (4,09") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **57 mm** (2,24") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| Klasa ochrony | **IP54** |
| Certyfikat wojskowy | **MIL-STD 810G** |
| Waga z baterią | **0,75 kg** |
| Wymiary (S×W×D) | 155 × 67 × 150 mm |

### Kluczowe funkcje

- **Dual radio** 802.11ac/Bluetooth 4.1
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
`
      },
      {
        title: '2. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału | Wskaźnik siły sygnału bezprzewodowego |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane |
| Materiał | Status materiału do druku |
| Otwarta pokrywa | Pokrywa komory mediów otwarta |
| Bateria | Stan naładowania baterii |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość druku) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '3. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +55°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -30°C do +66°C |

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.
`
      },
      {
        title: '4. Ładowanie baterii',
        content: `
### Smart Charger-2 (SC2)
**p/n P1031365-063**

Czas ładowania: **2 godziny** dla wszystkich baterii.

| Zasilanie DC | Wskaźnik LED | Status baterii |
|--------------|--------------|----------------|
| Obecne | Zielony | Bateria nieobecna lub w pełni naładowana |
| Obecne | Żółty | Ładowanie w toku |
| Obecne | Bursztynowy | Błąd |
| Obecne | Wyłączony | Bateria obecna, stan zdrowia = POOR |

### Ładowarka 1-Slot Battery Charger
**p/n SAC-MPP-1BCHGUS1-01**

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

### Ładowarka 3-Slot Battery Charger
**p/n SAC-MPP-3BCHGUS1-01**

Ładuje do 3 baterii jednocześnie.

### Zasilacz AC (ładowanie przez drukarkę)
**p/n P1031365-024**

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.
`
      },
      {
        title: '5. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów.
   - Włóż rolkę materiału między podpory (etykietami na zewnątrz).
   - Dyski automatycznie dopasują się do szerokości rolki.
   - Rolka powinna swobodnie się obracać.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | **113 mm** (4,45") +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału | 0,058 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **57 mm** (2,24") |
| Średnica wewnętrzna rdzenia | 19 mm standard, 12,5 mm opcja |
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem lub urządzeniem mobilnym
- Ładowanie drukarki (przez zasilacz AC)

### Bluetooth 4.1

| Parametr | Wartość |
|----------|---------|
| Wersja | Bluetooth 4.1 (BR/EDR + LE) |
| Zasięg | Do **100 m** w otwartej przestrzeni |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Częstotliwości | **2,4 GHz i 5 GHz** (dual band) |
| Zabezpieczenia | WEP, WPA, WPA2, 802.1x |
| Konfiguracja | Dual Radio (WiFi + Bluetooth) |

### Near Field Communication (NFC)

Drukarka ZQ520 obsługuje pasywny tag NFC. Funkcje NFC:
- **Parowanie Bluetooth** - automatyczne parowanie przez zbliżenie urządzenia NFC
- **Uruchamianie aplikacji** - automatyczne uruchomienie aplikacji Zebra na smartfonie
- **Dostęp do strony wsparcia** - szybki dostęp do informacji o drukarce

> **Uwaga:** Dotknij ikony **Zebra Print Touch™** smartfonem z NFC, aby uzyskać dostęp do informacji o drukarce.
`
      },
      {
        title: '7. Parowanie z urządzeniami',
        content: `
### Parowanie przez NFC (Android)

1. Włącz NFC na urządzeniu mobilnym.
2. Zbliż urządzenie do ikony Print Touch na drukarce.
3. Urządzenie automatycznie sparuje się z drukarką.

### Parowanie Bluetooth (iOS - MFi)

1. Włącz Bluetooth na urządzeniu iOS.
2. W ustawieniach Bluetooth znajdź drukarkę ZQ520.
3. Wybierz drukarkę, aby nawiązać połączenie.
4. Drukarka obsługuje iOS 10 i nowsze.

### Parowanie Bluetooth (Android)

1. Włącz Bluetooth na urządzeniu Android.
2. Wyszukaj dostępne urządzenia Bluetooth.
3. Wybierz drukarkę ZQ520 z listy.
4. Potwierdź parowanie (jeśli wymagane).

### Parowanie Bluetooth (Windows)

1. Otwórz Ustawienia > Urządzenia > Bluetooth.
2. Włącz Bluetooth i wyszukaj urządzenia.
3. Wybierz drukarkę ZQ520.
4. Zainstaluj sterownik Zebra Designer Driver (jeśli wymagany).

### Narzędzia konfiguracyjne Zebra

- **Zebra Setup Utilities** - konfiguracja pojedynczej drukarki
- **ZebraNet Bridge Enterprise** - zarządzanie flotą drukarek
- **Zebra Mobile Setup Utility** - konfiguracja przez urządzenie Android
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość | Metoda |
|---------|---------------|--------|
| Głowica drukująca | Co wymianę rolki lub przy problemach z jakością | Pisak czyszczący |
| Wałek dociskowy | Co wymianę rolki | Pisak czyszczący |
| Czujnik czarnych znaczników | W razie potrzeby | Sprężone powietrze, pisak |
| Obudowa zewnętrzna | W razie potrzeby | Miękka ściereczka |

### Czyszczenie głowicy drukującej

1. Wyłącz drukarkę i otwórz pokrywę mediów.
2. Wyjmij rolkę materiału.
3. Przetrzyj głowicę pisakiem czyszczącym (p/n 105950-035).
4. Poczekaj, aż głowica wyschnie przed zamknięciem pokrywy.

### Przedłużanie żywotności baterii

- Unikaj całkowitego rozładowania baterii
- Przechowuj baterie w temperaturze pokojowej
- Ładuj baterie przed długim przechowywaniem
- Wymieniaj baterie o stanie zdrowia REPLACE lub POOR
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Drukarka nie włącza się | Rozładowana bateria | Naładuj lub wymień baterię |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Słaba jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| | Zbyt niska temperatura | Ogrzej drukarkę |
| Zacięcie materiału | Nieprawidłowe załadowanie | Załaduj materiał ponownie |
| | Uszkodzony materiał | Użyj nowej rolki |
| Brak połączenia Bluetooth | Bluetooth wyłączony | Włącz Bluetooth na obu urządzeniach |
| | Zbyt duża odległość | Zbliż urządzenia |
| | Nieprawidłowe parowanie | Usuń parowanie i sparuj ponownie |
| Brak połączenia WiFi | Nieprawidłowe ustawienia | Sprawdź SSID i hasło |
| | Słaby sygnał | Zbliż się do punktu dostępowego |

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '10. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Kombinacja przycisków przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
3. Drukarka wydrukuje etykietę "Two Key Report".

### Metoda 2: Kombinacja przycisków przy włączaniu (rozszerzona)

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje etykietę konfiguracyjną, a następnie etykietę sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje etykietę konfiguracyjną Two-key i ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.
`
      },
      {
        title: '11. Akcesoria',
        content: `
### Lista akcesoriów ZQ520

| Akcesorium | Numer katalogowy |
|------------|------------------|
| Smart Charger-2 (SC2) | P1031365-063 |
| Zasilacz AC | P1031365-024 |
| Zasilacz AC Healthcare | P1065668-008 |
| Ładowarka 1-Slot | SAC-MPP-1BCHGUS1-01 |
| Ładowarka 3-Slot | SAC-MPP-3BCHGUS1-01 |
| Ładowarka Dual 3-Slot | SAC-MPP-6BCHUS1-01 |
| Quad Charger | AC18177-5 |
| Bateria rozszerzona 4-cell | P1058672 |
| Dyski podpory mediów 12,5mm | P1063406-025 |
| Pasek na ramię | P1031365-034 |
| Etui miękkie | P1031365-029 |
| Pisak czyszczący (12 szt.) | 105950-035 |

### Akcesoria do noszenia

- **Obrotowy klips do paska** - standardowe wyposażenie
- **Pasek na rękę** - pewny chwyt podczas przenoszenia
- **Pasek na ramię** - do noszenia podczas dłuższej pracy w terenie
- **Etui miękkie** - chroni przed uszkodzeniami mechanicznymi
- **Egzoszkielet** - dodatkowa ochrona zewnętrzna
- **Czytnik kart magnetycznych** - opcjonalne akcesorium
`
      },
      {
        title: '12. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ520?

**Odpowiedź:** ZQ520 drukuje do **104 mm (4,09")** szerokości – jest to drukarka **4-calowa**.

### Czy ZQ520 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ520 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Jak długo ładuje się bateria ZQ520?

**Odpowiedź:** W ładowarce Smart Charger-2: **2 godziny**. W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ520 z iPhone?

**Odpowiedź:** ZQ520 ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ520?

**Odpowiedź:** ZQ520 ma klasę ochrony **IP54** – odporność na kurz i zachlapania wodą. Ma też certyfikat **MIL-STD 810G**.

### Jakie języki programowania obsługuje ZQ520?

**Odpowiedź:** ZQ520 obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra.

### Ile waży drukarka ZQ520?

**Odpowiedź:** ZQ520 waży **0,75 kg** z baterią.

### Jak szybko drukuje ZQ520?

**Odpowiedź:** Prędkość druku: do **127 mm/s** (5"/s) dla materiałów linered, do **76,2 mm/s** (3"/s) dla materiałów linerless.

### Jaka jest różnica między ZQ510 a ZQ520?

**Odpowiedź:** Główna różnica to szerokość druku: **ZQ510** drukuje do **72 mm** (2,83"), natomiast **ZQ520** drukuje do **104 mm** (4,09"). ZQ520 jest też nieco większy i cięższy.
`
      }
    ]
  },
  'zq511': {
    model: 'ZQ511',
    title: 'Zebra ZQ511 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ511/ZQ521 User Guide (P1106523-07EN)',
    keywords: [
      'zebra zq511 instrukcja',
      'zq511 instrukcja po polsku',
      'zebra zq511 manual',
      'drukarka mobilna zebra zq511',
      'zebra zq511 bateria',
      'zq511 ładowanie',
      'zebra zq511 bluetooth 5.2',
      'zq511 wifi',
      'zebra zq511 nfc',
      'zq511 parowanie',
      'zebra zq511 materiały',
      'zq511 rolki etykiet',
      'zebra zq511 czyszczenie',
      'zq511 głowica',
      'zebra zq511 powerprecision',
      'zq511 specyfikacja',
      'zebra zq511 ip54',
      'zebra zq511 ip65',
      'zq511 wytrzymała',
      'zebra zq511 mfi',
      'zq511 iphone',
      'drukarka przenośna zebra zq511',
      'zebra zq511 3 calowa',
      'zq511 paragony',
      'zebra zq511 etykiety',
      'zq511 logistyka',
      'zebra zq511 transport',
      'zq511 linerless',
      'zq511 serwis',
      'instrukcja obsługi zebra zq511'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ511

Zebra ZQ511 to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **72 mm (2,83")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **72 mm** (2,83") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **51 mm** (2,0") |
| Maks. szerokość materiału | **80 mm** (3,15") +1 mm |
| Min. szerokość materiału | **35 mm** (1,37") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| Klasa ochrony | **IP54** (bez etui), **IP65** (z twardym etui) |
| Certyfikat wojskowy | **MIL-STD 810** |
| Waga z baterią | **0,61 kg** |
| Wymiary (S×W×D) | 120 × 61 × 150 mm |

### Kluczowe funkcje (nowości vs ZQ510)

- **Bluetooth 5.2 ready** (BR/EDR + LE)
- **Dual radio** 802.11ac/Bluetooth 5.2
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
- **Exoskeleton** z ochroną **IP65**
`
      },
      {
        title: '2. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału WiFi | 4 paski = >75%, 3 paski = ≤75%, 2 paski = ≤50% >25%, 1 pasek = ≤25%, 0 pasków = brak sieci |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane (migający = przetwarzanie) |
| Materiał | Status materiału do druku (migający = brak materiału) |
| Otwarta pokrywa | Pokrywa komory mediów otwarta (migający) |
| Bateria | 4 paski = >80%, 3 paski = 60-80%, 2 paski = 40-60%, 1 pasek = 20-40%, 0 pasków = niski poziom |
| Battery Eliminator (DC) | Zasilanie zewnętrzne (bez baterii) |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość, zwiększona prędkość do 5 ips) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '3. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa (rozszerzona) |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +50°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -25°C do +60°C |

> **Ważne:** Drukarki ZQ511 działają prawidłowo wyłącznie z oryginalnymi bateriami Zebra PP+.

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Usuwanie taśmy izolacyjnej baterii

Nowe baterie są wysyłane z taśmą izolacyjną chroniącą styki. Przed pierwszym użyciem:

1. Pociągnij za zakładkę taśmy izolacyjnej na spodzie baterii.
2. Odklej taśmę i usuń ją z górnej części baterii.
3. Wyrzuć taśmę po usunięciu.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.
`
      },
      {
        title: '4. Ładowanie baterii',
        content: `
### Optymalne warunki ładowania

Aby uzyskać najlepsze wyniki szybkiego ładowania:
- Ładuj baterie w temperaturze pokojowej z wyłączonym urządzeniem
- Idealna temperatura ładowania: **5°C do 40°C**

### Zasilacz AC (ładowanie przez drukarkę)

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz odpowiedni przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.

### Vehicle Cradle (uchwyt samochodowy)

Uchwyt samochodowy umożliwia montaż drukarki w pojeździe z jednoczesnym ładowaniem baterii. Posiada złącze USB do podłączenia laptopa lub tabletu.

### Battery Eliminator

Eliminator baterii umożliwia montaż drukarki ZQ511 w pojeździe bez użycia baterii.

### 4-Bay Power Station

Stacja ładująca umożliwia dokowanie i ładowanie do **4 drukarek** jednocześnie, zachowując pełną funkcjonalność drukarki.

### 1-Slot Battery Charger

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

| Tryb | Wskaźnik | Opis |
|------|----------|------|
| Błąd ładowania | Szybko migający czerwony | Błąd baterii |
| Ładowanie (zdrowa) | Ciągły bursztynowy | Bateria się ładuje |
| Ładowanie zakończone | Ciągły zielony | W pełni naładowana |
| Ładowanie (niezdrowa) | Ciągły czerwony | Bateria wymaga wymiany |

### 3-Slot / Dual 3-Slot Battery Charger

Ładowarka do 3 (lub 6 w wersji Dual) baterii jednocześnie.
`
      },
      {
        title: '5. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów i regulowane podpory.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów (obie podpory poruszają się jednocześnie).
   - Włóż rolkę materiału między podpory w pokazanej orientacji.
   - Dyski automatycznie dopasują się i zabezpieczą materiał.
   - Rolka powinna swobodnie się obracać na podporach.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów dla ZQ511

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | **35 mm do 80 mm** +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału (linerless) | 0,053 - 0,165 mm |
| Grubość materiału (linered) | 0,058 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **51 mm** (2,0") |
| Średnica rdzenia | 19 mm standard, 12,5 mm opcja |

> **Uwaga:** Do użycia rdzenia 12,5 mm wymagana jest wymiana dysków podpory mediów.
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem (USB 2.0 Full Speed)
- Podłączenie urządzeń zewnętrznych w trybie hosta (500mA)

### Bluetooth 5.2 ready

| Parametr | Wartość |
|----------|---------|
| Wersja | **Bluetooth 5.2 ready** (BR/EDR + LE) |
| Tryb pracy | Slave (peryferyjne) |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |
| Domyślna klasa | Class 2 (możliwość zmiany na Class 1) |

**Ograniczone parowanie (Limited Pairing Mode):** Przytrzymanie przycisku Feed przez 5 sekund włącza tryb ograniczonego wykrywania i parowania na **2 minuty**.

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Bluetooth w dual radio | **5.2 ready** |
| Bezpieczeństwo | WEP, WPA/WPA2/WPA3, Enterprise |

> **Uwaga:** Dla drukarek zakupionych w regionie EMEA po 1 sierpnia 2025 r., WLAN jest domyślnie wyłączony. Należy skonfigurować hasło Protected Mode przed włączeniem. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Near Field Communication (NFC)

Drukarka obsługuje pasywny tag NFC. Funkcje:
- **Parowanie Bluetooth** przez zbliżenie smartfona do ikony Print Touch™
- **Uruchamianie aplikacji** Zebra lub firm trzecich
- **Otwieranie strony wsparcia** produktu

Zasięg NFC: do **7,62 cm** (3 cale).
`
      },
      {
        title: '7. Funkcje oszczędzania energii',
        content: `
### Tryb uśpienia (Sleep Mode)

Drukarka automatycznie przechodzi w tryb uśpienia po **2 minutach** nieaktywności:
- Wyświetlacz LCD wyłączony, brak podświetlenia
- Wskaźnik: wolno migający zielony pierścień LED

**Wybudzanie:**
- Naciśnij Power lub Select (krótko, < 3 sekundy)
- Rozpocznij komunikację przez Bluetooth lub WLAN

**Wyłączenie:** Przytrzymaj Power > 3 sekundy.

**Konfiguracja:** Użyj komendy SGD:
- **power.sleep.enable** (on/off)
- **power.sleep.timeout** (sekundy)

### Adaptive Print Performance (PSPT PrintSmart Gen 2)

Drukarka automatycznie dostosowuje wydajność druku do warunków środowiskowych (stan naładowania, zdrowie baterii, ekstremalne temperatury, wysoka gęstość druku) bez utraty jakości wydruku.

### Tryb szkicowy (Draft Mode)

Optymalizuje drukarkę do druku tekstu:
- Zwiększona prędkość: do **5 ips** (z 4 ips)
- Obniżona gęstość optyczna: **-22%**
- Przeznaczony do paragonów tekstowych bez kodów kreskowych i grafiki

**Włączenie:** Komenda SGD **media.draft_mode** (on/off).
`
      },
      {
        title: '8. Akcesoria do noszenia',
        content: `
### Klips do paska (Swivel Belt Clip)

Standardowe wyposażenie (z wyjątkiem drukarek z baterią rozszerzoną). Klips obraca się, umożliwiając swobodne poruszanie.

### Pasek na rękę (Hand Strap)

Mocowany do dwóch słupków z przodu drukarki za pomocą karabińczyków.

### Pasek na ramię (Shoulder Strap)

Regulowany pasek do **56 cali**, mocowany do słupków z przodu drukarki.

### Etui miękkie (Soft Case)

Ochronne etui z otwartą ścieżką papieru, widocznymi przyciskami sterowania i złączami D-Ring do paska na ramię.

### Exoskeleton (twarde etui)

Obudowa typu "muszla" zapewniająca ekstremalną wytrzymałość. Podnosi klasę ochrony do **IP65**. Umożliwia używanie przycisków sterowania oraz ładowanie na Vehicle Cradle i 4-Bay Power Station.

> **Uwaga:** Drukarki linerless nie powinny być używane z Exoskeleton ze względu na brak odwrotnego odrywania i lepkość materiału.
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
### Wydłużanie żywotności baterii

- Nie narażaj baterii na bezpośrednie światło słoneczne ani temperatury powyżej 40°C podczas ładowania
- Używaj wyłącznie ładowarek Zebra do akumulatorów Li-Ion
- Używaj odpowiednich materiałów do wymagań druku
- Wybierz odpowiednią ciemność i prędkość druku dla materiału
- Wyjmuj baterię, gdy drukarka nie będzie używana przez dzień lub dłużej
- Rozważ zakup zapasowej baterii

### Czyszczenie głowicy drukującej

**Częstotliwość:** Po każdych **5 rolkach** materiału (po każdej rolce dla materiału linerless).

**Metoda:** Użyj pisaka czyszczącego Zebra (p/n 105950-035) lub wacika nasączonego 90% alkoholem medycznym. Przetrzyj szarą linię na głowicy od środka do zewnętrznych krawędzi.

> **Ostrzeżenie:** Głowica może być bardzo gorąca po długim drukowaniu. Poczekaj na jej ostygnięcie przed czyszczeniem.

### Czyszczenie wałka dociskowego (platen)

**Linered:** Obróć wałek i wyczyść go wacikiem lub szmatką zwilżoną 90% alkoholem medycznym.

**Linerless:** Użyj wacika z roztworem 1 część mydła płynnego i 25 części wody. Następnie oczyść czystą wodą.

### Czyszczenie zgarniacza (Scraper) - tylko linerless

Użyj lepkiej strony materiału do oczyszczenia zgarniacza. Częstotliwość: po każdych 5 rolkach.
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Brak zasilania | Rozładowana bateria | Naładuj lub wymień baterię |
| | Bateria nieprawidłowo zainstalowana | Sprawdź instalację baterii |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Materiał nie wysuwa się | Pokrywa nie zamknięta | Zamknij i zatrzaśnij pokrywę |
| | Zablokowany trzpień rolki | Sprawdź swobodne obracanie |
| | Zablokowany czujnik etykiet | Oczyść czujnik |
| Słaba/wyblakła jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| Częściowy lub brak wydruku | Nieprawidłowe wyrównanie materiału | Wyrównaj materiał |
| | Zabrudzona głowica | Wyczyść głowicę |
| Zniekształcony wydruk | Wyczerpana bateria | Wymień baterię |
| | Problem z kablem | Sprawdź kabel do terminala |
| Skrócona żywotność baterii | Bateria starsza niż 1 rok | Normalne starzenie |
| | Zły stan zdrowia baterii | Sprawdź stan zdrowia, wymień baterię |
| Zacięcie etykiet | Nieprawidłowe ładowanie | Otwórz pokrywę i załaduj ponownie |
| Pusty ekran LCD | Drukarka wyłączona | Włącz drukarkę |
| | Tryb uśpienia | Naciśnij Power lub Select |
| Brak połączenia NFC | Zbyt duża odległość | Zbliż smartfon do 3 cali od ikony Print Touch |

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '11. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Przycisk Feed przy włączaniu

1. Wyłącz drukarkę.
2. Załaduj materiał ciągły (bez czarnych znaczników ani przerw).
3. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
4. Gdy rozpocznie się drukowanie, zwolnij **Feed**.

Drukarka wydrukuje linię znaków "x" (test wszystkich elementów głowicy), wersję oprogramowania i raport konfiguracyjny.

### Metoda 2: Przycisk Select przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje raport konfiguracyjny, a następnie raport sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje raport Two-key i konfigurację ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.

### Tryb diagnostyczny HEX Dump

1. Wydrukuj raport konfiguracyjny (metoda 1 powyżej).
2. Na końcu raportu pojawi się: "Press FEED key to enter DUMP mode".
3. Naciśnij **Feed** w ciągu 3 sekund.
4. Drukarka wydrukuje: "Entering DUMP mode".
`
      },
      {
        title: '12. Komunikaty alertów',
        content: `
### Główne komunikaty

| Komunikat | Opis |
|-----------|------|
| PRINT HEAD OVERTEMP / PRINTING HALTED | Przegrzanie głowicy |
| HEAD MAINTEN. NEEDED / PRINTING HALTED | Wymagana konserwacja głowicy |
| BATTERY DIMINISHED / CONSIDER REPLACING | Bateria zużyta, rozważ wymianę |
| WARNING - BATTERY IS / PAST USEFUL LIFE | Bateria przekroczyła okres użytkowania |
| BATTERY DIMINISHED / SHUTTING DOWN | Bateria wyczerpana, wyłączanie |
| BATTERY FAILED / REPLACE BATTERY | Błąd uwierzytelnienia baterii |
| CHARGING TEMP FAULT / MUST BE 0-40°C | Temperatura poza zakresem ładowania |
| CHARGING FAULT / REPLACE BATTERY | Błąd ładowania |
| DOWNLOADING FIRMWARE | Pobieranie firmware |
| DOWNLOAD FAILED / PLEASE REBOOT | Pobieranie nieudane |
| FIRMWARE WRITING TO FLASH | Zapisywanie firmware do Flash |
| PRINTER PAUSED | Drukarka wstrzymana |
| ALL JOBS CLEARED | Wszystkie zadania usunięte |
| OUT OF MEMORY STORING... | Brak pamięci podczas zapisywania |
`
      },
      {
        title: '13. Oprogramowanie i narzędzia',
        content: `
### Narzędzia konfiguracyjne

- **ZebraNet Bridge Enterprise™** – konfiguracja drukarki, zarządzanie flotą
- **Zebra Setup Utilities (ZSU)** – konfiguracja pojedynczej drukarki, szybka konfiguracja
- **Zebra Mobile Setup Utility** – narzędzie konfiguracyjne dla Android
- **ZebraDesigner Pro v2** – projektowanie etykiet
- **Zebra Designer Drivers** – sterownik Windows
- **Zebra Downloader** – pobieranie firmware
- **Printer Profile Manager Enterprise (PPME)** – zarządzanie profilami drukarek

Wszystkie narzędzia dostępne na: **zebra.com/support-downloads** lub [/sterowniki](/sterowniki)

### Aplikacje mobilne

- **Zebra Printer Setup Utility** dla Android (Google Play)
- **Zebra Printer Setup Utility** dla iOS (App Store)

Obsługiwane typy połączeń:
- Bluetooth Classic
- Bluetooth Low Energy (BLE)
- Przewodowe/Ethernet
- Bezprzewodowe
- USB On-The-Go
`
      },
      {
        title: '14. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ511?

**Odpowiedź:** ZQ511 drukuje do **72 mm (2,83")** szerokości – jest to drukarka **3-calowa** (do szerokości materiału 80 mm).

### Czy ZQ511 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ511 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Czym ZQ511 różni się od ZQ510?

**Odpowiedź:** ZQ511 to nowsza wersja z: **Bluetooth 5.2** (vs 4.1), obsługą **WPA3**, nowszym firmware i wsparciem dla **Exoskeleton z IP65**. Wymiary i podstawowe parametry druku są identyczne.

### Jak długo ładuje się bateria ZQ511?

**Odpowiedź:** W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ511 z iPhone?

**Odpowiedź:** ZQ511 ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ511?

**Odpowiedź:** ZQ511 ma klasę ochrony **IP54** standardowo, ale z **Exoskeleton** (twarde etui) klasa rośnie do **IP65**. Ma też certyfikat **MIL-STD 810**.

### Jakie języki programowania obsługuje ZQ511?

**Odpowiedź:** ZQ511 obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra.

### Ile waży drukarka ZQ511?

**Odpowiedź:** ZQ511 waży **0,61 kg** z baterią.

### Jak szybko drukuje ZQ511?

**Odpowiedź:** Prędkość druku: do **127 mm/s** (5"/s) dla materiałów linered, do **76,2 mm/s** (3"/s) dla materiałów linerless.

### Co oznacza informacja o WLAN wyłączonym dla drukarek EMEA po sierpniu 2025?

**Odpowiedź:** Zgodnie z **dyrektywą EU RED**, drukarki sprzedawane w Europie po 1 sierpnia 2025 mają domyślnie wyłączone WiFi. Przed włączeniem musisz ustawić hasło Protected Mode. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)
`
      }
    ]
  },
  'zq521': {
    model: 'ZQ521',
    title: 'Zebra ZQ521 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ511/ZQ521 User Guide (P1106523-07EN)',
    keywords: [
      'zebra zq521 instrukcja',
      'zq521 instrukcja po polsku',
      'zebra zq521 manual',
      'drukarka mobilna zebra zq521',
      'zebra zq521 bateria',
      'zq521 ładowanie',
      'zebra zq521 bluetooth 5.2',
      'zq521 wifi',
      'zebra zq521 nfc',
      'zq521 parowanie',
      'zebra zq521 materiały',
      'zq521 rolki etykiet',
      'zebra zq521 czyszczenie',
      'zq521 głowica',
      'zebra zq521 powerprecision',
      'zq521 specyfikacja',
      'zebra zq521 ip54',
      'zebra zq521 ip65',
      'zq521 wytrzymała',
      'zebra zq521 mfi',
      'zq521 iphone',
      'drukarka przenośna zebra zq521',
      'zebra zq521 4 calowa',
      'zq521 paragony',
      'zebra zq521 etykiety',
      'zq521 logistyka',
      'zebra zq521 transport',
      'zq521 linerless',
      'zq521 serwis',
      'instrukcja obsługi zebra zq521'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ521

Zebra ZQ521 to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **104 mm (4,09")**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **104 mm** (4,09") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **57 mm** (2,24") |
| Maks. szerokość materiału | **113 mm** (4,45") +1 mm |
| Min. szerokość materiału | **51 mm** (2,0") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| Klasa ochrony | **IP54** (bez etui), **IP65** (z twardym etui) |
| Certyfikat wojskowy | **MIL-STD 810** |
| Waga z baterią | **0,75 kg** |
| Wymiary (S×W×D) | 155 × 67 × 150 mm |

### Kluczowe funkcje (nowości vs ZQ520)

- **Bluetooth 5.2 ready** (BR/EDR + LE)
- **Dual radio** 802.11ac/Bluetooth 5.2
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
- **Exoskeleton** z ochroną **IP65**
`
      },
      {
        title: '2. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału WiFi | 4 paski = >75%, 3 paski = ≤75%, 2 paski = ≤50% >25%, 1 pasek = ≤25%, 0 pasków = brak sieci |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane (migający = przetwarzanie) |
| Materiał | Status materiału do druku (migający = brak materiału) |
| Otwarta pokrywa | Pokrywa komory mediów otwarta (migający) |
| Bateria | 4 paski = >80%, 3 paski = 60-80%, 2 paski = 40-60%, 1 pasek = 20-40%, 0 pasków = niski poziom |
| Battery Eliminator (DC) | Zasilanie zewnętrzne (bez baterii) |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość, zwiększona prędkość do 5 ips) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '3. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa (rozszerzona) |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +50°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -25°C do +60°C |

> **Ważne:** Drukarki ZQ521 działają prawidłowo wyłącznie z oryginalnymi bateriami Zebra PP+.

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Usuwanie taśmy izolacyjnej baterii

Nowe baterie są wysyłane z taśmą izolacyjną chroniącą styki. Przed pierwszym użyciem:

1. Pociągnij za zakładkę taśmy izolacyjnej na spodzie baterii.
2. Odklej taśmę i usuń ją z górnej części baterii.
3. Wyrzuć taśmę po usunięciu.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.
`
      },
      {
        title: '4. Ładowanie baterii',
        content: `
### Optymalne warunki ładowania

Aby uzyskać najlepsze wyniki szybkiego ładowania:
- Ładuj baterie w temperaturze pokojowej z wyłączonym urządzeniem
- Idealna temperatura ładowania: **5°C do 40°C**

### Zasilacz AC (ładowanie przez drukarkę)

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz odpowiedni przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.

### Vehicle Cradle (uchwyt samochodowy)

Uchwyt samochodowy umożliwia montaż drukarki w pojeździe z jednoczesnym ładowaniem baterii. Posiada złącze USB do podłączenia laptopa lub tabletu.

### Battery Eliminator

Eliminator baterii umożliwia montaż drukarki ZQ521 w pojeździe bez użycia baterii.

### 4-Bay Power Station

Stacja ładująca umożliwia dokowanie i ładowanie do **4 drukarek** jednocześnie, zachowując pełną funkcjonalność drukarki.

### 1-Slot Battery Charger

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

| Tryb | Wskaźnik | Opis |
|------|----------|------|
| Błąd ładowania | Szybko migający czerwony | Błąd baterii |
| Ładowanie (zdrowa) | Ciągły bursztynowy | Bateria się ładuje |
| Ładowanie zakończone | Ciągły zielony | W pełni naładowana |
| Ładowanie (niezdrowa) | Ciągły czerwony | Bateria wymaga wymiany |

### 3-Slot / Dual 3-Slot Battery Charger

Ładowarka do 3 (lub 6 w wersji Dual) baterii jednocześnie.
`
      },
      {
        title: '5. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów i regulowane podpory.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów (obie podpory poruszają się jednocześnie).
   - Włóż rolkę materiału między podpory w pokazanej orientacji.
   - Dyski automatycznie dopasują się i zabezpieczą materiał.
   - Rolka powinna swobodnie się obracać na podporach.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów dla ZQ521

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | **51 mm do 113 mm** +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału | 0,053 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **57 mm** (2,24") |
| Średnica rdzenia | 19 mm standard, 12,5 mm opcja |

> **Uwaga:** Do użycia rdzenia 12,5 mm wymagana jest wymiana dysków podpory mediów.
`
      },
      {
        title: '6. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem (USB 2.0 Full Speed)
- Podłączenie urządzeń zewnętrznych w trybie hosta (500mA)

### Bluetooth 5.2 ready

| Parametr | Wartość |
|----------|---------|
| Wersja | **Bluetooth 5.2 ready** (BR/EDR + LE) |
| Tryb pracy | Slave (peryferyjne) |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |
| Domyślna klasa | Class 2 (możliwość zmiany na Class 1) |

**Ograniczone parowanie (Limited Pairing Mode):** Przytrzymanie przycisku Feed przez 5 sekund włącza tryb ograniczonego wykrywania i parowania na **2 minuty**.

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Bluetooth w dual radio | **5.2 ready** |
| Bezpieczeństwo | WEP, WPA/WPA2/WPA3, Enterprise |

> **Uwaga:** Dla drukarek zakupionych w regionie EMEA po 1 sierpnia 2025 r., WLAN jest domyślnie wyłączony. Należy skonfigurować hasło Protected Mode przed włączeniem. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Near Field Communication (NFC)

Drukarka obsługuje pasywny tag NFC. Funkcje:
- **Parowanie Bluetooth** przez zbliżenie smartfona do ikony Print Touch™
- **Uruchamianie aplikacji** Zebra lub firm trzecich
- **Otwieranie strony wsparcia** produktu

Zasięg NFC: do **7,62 cm** (3 cale).
`
      },
      {
        title: '7. Funkcje oszczędzania energii',
        content: `
### Tryb uśpienia (Sleep Mode)

Drukarka automatycznie przechodzi w tryb uśpienia po **2 minutach** nieaktywności:
- Wyświetlacz LCD wyłączony, brak podświetlenia
- Wskaźnik: wolno migający zielony pierścień LED

**Wybudzanie:**
- Naciśnij Power lub Select (krótko, < 3 sekundy)
- Rozpocznij komunikację przez Bluetooth lub WLAN

**Wyłączenie:** Przytrzymaj Power > 3 sekundy.

**Konfiguracja:** Użyj komendy SGD:
- **power.sleep.enable** (on/off)
- **power.sleep.timeout** (sekundy)

### Adaptive Print Performance (PSPT PrintSmart Gen 2)

Drukarka automatycznie dostosowuje wydajność druku do warunków środowiskowych (stan naładowania, zdrowie baterii, ekstremalne temperatury, wysoka gęstość druku) bez utraty jakości wydruku.

### Tryb szkicowy (Draft Mode)

Optymalizuje drukarkę do druku tekstu:
- Zwiększona prędkość: do **5 ips** (z 4 ips)
- Obniżona gęstość optyczna: **-22%**
- Przeznaczony do paragonów tekstowych bez kodów kreskowych i grafiki

**Włączenie:** Komenda SGD **media.draft_mode** (on/off).
`
      },
      {
        title: '8. Akcesoria do noszenia',
        content: `
### Klips do paska (Swivel Belt Clip)

Standardowe wyposażenie (z wyjątkiem drukarek z baterią rozszerzoną). Klips obraca się, umożliwiając swobodne poruszanie.

### Pasek na rękę (Hand Strap)

Mocowany do dwóch słupków z przodu drukarki za pomocą karabińczyków.

### Pasek na ramię (Shoulder Strap)

Regulowany pasek do **56 cali**, mocowany do słupków z przodu drukarki.

### Etui miękkie (Soft Case)

Ochronne etui z otwartą ścieżką papieru, widocznymi przyciskami sterowania i złączami D-Ring do paska na ramię.

### Exoskeleton (twarde etui)

Obudowa typu "muszla" zapewniająca ekstremalną wytrzymałość. Podnosi klasę ochrony do **IP65**. Umożliwia używanie przycisków sterowania oraz ładowanie na Vehicle Cradle i 4-Bay Power Station.

> **Uwaga:** Drukarki linerless nie powinny być używane z Exoskeleton ze względu na brak odwrotnego odrywania i lepkość materiału.
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
### Wydłużanie żywotności baterii

- Nie narażaj baterii na bezpośrednie światło słoneczne ani temperatury powyżej 40°C podczas ładowania
- Używaj wyłącznie ładowarek Zebra do akumulatorów Li-Ion
- Używaj odpowiednich materiałów do wymagań druku
- Wybierz odpowiednią ciemność i prędkość druku dla materiału
- Wyjmuj baterię, gdy drukarka nie będzie używana przez dzień lub dłużej
- Rozważ zakup zapasowej baterii

### Czyszczenie głowicy drukującej

**Częstotliwość:** Po każdych **5 rolkach** materiału (po każdej rolce dla materiału linerless).

**Metoda:** Użyj pisaka czyszczącego Zebra (p/n 105950-035) lub wacika nasączonego 90% alkoholem medycznym. Przetrzyj szarą linię na głowicy od środka do zewnętrznych krawędzi.

> **Ostrzeżenie:** Głowica może być bardzo gorąca po długim drukowaniu. Poczekaj na jej ostygnięcie przed czyszczeniem.

### Czyszczenie wałka dociskowego (platen)

**Linered:** Obróć wałek i wyczyść go wacikiem lub szmatką zwilżoną 90% alkoholem medycznym.

**Linerless:** Użyj wacika z roztworem 1 część mydła płynnego i 25 części wody. Następnie oczyść czystą wodą.

### Czyszczenie zgarniacza (Scraper) - tylko linerless

Użyj lepkiej strony materiału do oczyszczenia zgarniacza. Częstotliwość: po każdych 5 rolkach.
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Brak zasilania | Rozładowana bateria | Naładuj lub wymień baterię |
| | Bateria nieprawidłowo zainstalowana | Sprawdź instalację baterii |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Materiał nie wysuwa się | Pokrywa nie zamknięta | Zamknij i zatrzaśnij pokrywę |
| | Zablokowany trzpień rolki | Sprawdź swobodne obracanie |
| | Zablokowany czujnik etykiet | Oczyść czujnik |
| Słaba/wyblakła jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| Częściowy lub brak wydruku | Nieprawidłowe wyrównanie materiału | Wyrównaj materiał |
| | Zabrudzona głowica | Wyczyść głowicę |
| Zniekształcony wydruk | Wyczerpana bateria | Wymień baterię |
| | Problem z kablem | Sprawdź kabel do terminala |
| Skrócona żywotność baterii | Bateria starsza niż 1 rok | Normalne starzenie |
| | Zły stan zdrowia baterii | Sprawdź stan zdrowia, wymień baterię |
| Zacięcie etykiet | Nieprawidłowe ładowanie | Otwórz pokrywę i załaduj ponownie |
| Pusty ekran LCD | Drukarka wyłączona | Włącz drukarkę |
| | Tryb uśpienia | Naciśnij Power lub Select |
| Brak połączenia NFC | Zbyt duża odległość | Zbliż smartfon do 3 cali od ikony Print Touch |

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '11. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Przycisk Feed przy włączaniu

1. Wyłącz drukarkę.
2. Załaduj materiał ciągły (bez czarnych znaczników ani przerw).
3. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
4. Gdy rozpocznie się drukowanie, zwolnij **Feed**.

Drukarka wydrukuje linię znaków "x" (test wszystkich elementów głowicy), wersję oprogramowania i raport konfiguracyjny.

### Metoda 2: Przycisk Select przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje raport konfiguracyjny, a następnie raport sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje raport Two-key i konfigurację ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.

### Tryb diagnostyczny HEX Dump

1. Wydrukuj raport konfiguracyjny (metoda 1 powyżej).
2. Na końcu raportu pojawi się: "Press FEED key to enter DUMP mode".
3. Naciśnij **Feed** w ciągu 3 sekund.
4. Drukarka wydrukuje: "Entering DUMP mode".
`
      },
      {
        title: '12. Komunikaty alertów',
        content: `
### Główne komunikaty

| Komunikat | Opis |
|-----------|------|
| PRINT HEAD OVERTEMP / PRINTING HALTED | Przegrzanie głowicy |
| HEAD MAINTEN. NEEDED / PRINTING HALTED | Wymagana konserwacja głowicy |
| BATTERY DIMINISHED / CONSIDER REPLACING | Bateria zużyta, rozważ wymianę |
| WARNING - BATTERY IS / PAST USEFUL LIFE | Bateria przekroczyła okres użytkowania |
| BATTERY DIMINISHED / SHUTTING DOWN | Bateria wyczerpana, wyłączanie |
| BATTERY FAILED / REPLACE BATTERY | Błąd uwierzytelnienia baterii |
| CHARGING TEMP FAULT / MUST BE 0-40°C | Temperatura poza zakresem ładowania |
| CHARGING FAULT / REPLACE BATTERY | Błąd ładowania |
| DOWNLOADING FIRMWARE | Pobieranie firmware |
| DOWNLOAD FAILED / PLEASE REBOOT | Pobieranie nieudane |
| FIRMWARE WRITING TO FLASH | Zapisywanie firmware do Flash |
| PRINTER PAUSED | Drukarka wstrzymana |
| ALL JOBS CLEARED | Wszystkie zadania usunięte |
| OUT OF MEMORY STORING... | Brak pamięci podczas zapisywania |
`
      },
      {
        title: '13. Oprogramowanie i narzędzia',
        content: `
### Narzędzia konfiguracyjne

- **ZebraNet Bridge Enterprise™** – konfiguracja drukarki, zarządzanie flotą
- **Zebra Setup Utilities (ZSU)** – konfiguracja pojedynczej drukarki, szybka konfiguracja
- **Zebra Mobile Setup Utility** – narzędzie konfiguracyjne dla Android
- **ZebraDesigner Pro v2** – projektowanie etykiet
- **Zebra Designer Drivers** – sterownik Windows
- **Zebra Downloader** – pobieranie firmware
- **Printer Profile Manager Enterprise (PPME)** – zarządzanie profilami drukarek

Wszystkie narzędzia dostępne na: **zebra.com/support-downloads** lub [/sterowniki](/sterowniki)

### Aplikacje mobilne

- **Zebra Printer Setup Utility** dla Android (Google Play)
- **Zebra Printer Setup Utility** dla iOS (App Store)

Obsługiwane typy połączeń:
- Bluetooth Classic
- Bluetooth Low Energy (BLE)
- Przewodowe/Ethernet
- Bezprzewodowe
- USB On-The-Go
`
      },
      {
        title: '14. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ521?

**Odpowiedź:** ZQ521 drukuje do **104 mm (4,09")** szerokości – jest to drukarka **4-calowa** (do szerokości materiału 113 mm).

### Czy ZQ521 wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ521 to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Czym ZQ521 różni się od ZQ520?

**Odpowiedź:** ZQ521 to nowsza wersja z: **Bluetooth 5.2** (vs 4.1), obsługą **WPA3**, nowszym firmware i wsparciem dla **Exoskeleton z IP65**. Wymiary i podstawowe parametry druku są identyczne.

### Czym ZQ521 różni się od ZQ511?

**Odpowiedź:** Główna różnica to szerokość druku: **ZQ511** drukuje do **72 mm** (3-calowa), natomiast **ZQ521** drukuje do **104 mm** (4-calowa). ZQ521 jest też nieco większy (155 vs 120 mm szerokości) i cięższy (0,75 vs 0,61 kg).

### Jak długo ładuje się bateria ZQ521?

**Odpowiedź:** W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ521 z iPhone?

**Odpowiedź:** ZQ521 ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ521?

**Odpowiedź:** ZQ521 ma klasę ochrony **IP54** standardowo, ale z **Exoskeleton** (twarde etui) klasa rośnie do **IP65**. Ma też certyfikat **MIL-STD 810**.

### Jakie języki programowania obsługuje ZQ521?

**Odpowiedź:** ZQ521 obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra.

### Ile waży drukarka ZQ521?

**Odpowiedź:** ZQ521 waży **0,75 kg** z baterią.

### Jak szybko drukuje ZQ521?

**Odpowiedź:** Prędkość druku: do **127 mm/s** (5"/s) dla materiałów linered, do **76,2 mm/s** (3"/s) dla materiałów linerless.

### Co oznacza informacja o WLAN wyłączonym dla drukarek EMEA po sierpniu 2025?

**Odpowiedź:** Zgodnie z **dyrektywą EU RED**, drukarki sprzedawane w Europie po 1 sierpnia 2025 mają domyślnie wyłączone WiFi. Przed włączeniem musisz ustawić hasło Protected Mode. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)
`
      }
    ]
  },
  'zq511r': {
    model: 'ZQ511R',
    title: 'Zebra ZQ511R – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ511/ZQ521 User Guide (P1106523-07EN)',
    keywords: [
      'zebra zq511r instrukcja',
      'zq511r instrukcja po polsku',
      'zebra zq511r manual',
      'drukarka mobilna zebra zq511r',
      'zebra zq511r rfid',
      'zq511r rfid uhf',
      'zebra zq511r bateria',
      'zq511r ładowanie',
      'zebra zq511r bluetooth 5.2',
      'zq511r wifi',
      'zebra zq511r nfc',
      'zq511r parowanie',
      'zebra zq511r materiały',
      'zq511r rolki etykiet',
      'zebra zq511r czyszczenie',
      'zq511r głowica',
      'zebra zq511r powerprecision',
      'zq511r specyfikacja',
      'zebra zq511r ip54',
      'zebra zq511r ip65',
      'zq511r wytrzymała',
      'zebra zq511r mfi',
      'zq511r iphone',
      'drukarka przenośna zebra zq511r',
      'zebra zq511r 3 calowa',
      'zq511r etykiety rfid',
      'zebra zq511r logistyka',
      'zebra zq511r transport',
      'zq511r kodowanie rfid',
      'zq511r serwis',
      'instrukcja obsługi zebra zq511r'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ511R

Zebra ZQ511R to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **72 mm (2,83")** z **wbudowanym koderem/czytnikiem RFID UHF**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **72 mm** (2,83") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **51 mm** (2,0") |
| Maks. szerokość materiału | **80 mm** (3,15") +1 mm |
| Min. szerokość materiału | **35 mm** (1,37") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| **RFID** | **EPC Gen 2 Class 1 UHF** |
| Klasa ochrony | **IP54** (bez etui), **IP65** (z twardym etui) |
| Certyfikat wojskowy | **MIL-STD 810** |
| Waga z baterią | **0,61 kg** |
| Wymiary (S×W×D) | 120 × 61 × 150 mm |

### Kluczowe funkcje

- **RFID UHF** – kodowanie i weryfikacja tagów EPC Gen 2 Class 1
- **Bluetooth 5.2 ready** (BR/EDR + LE)
- **Dual radio** 802.11ac/Bluetooth 5.2
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
- **Exoskeleton** z ochroną **IP65**
`
      },
      {
        title: '2. Funkcja RFID',
        content: `
### O technologii RFID w ZQ511R

Drukarka ZQ511R jest wyposażona w koder/czytnik RFID zintegrowany z zespołem głowicy drukującej. Drukarka koduje (zapisuje) informacje na **ultracienkich transponderach RFID UHF** osadzonych w "inteligentnych" etykietach, biletach i tagach.

### Proces druku RFID

1. **Kodowanie** informacji na transponderze RFID
2. **Weryfikacja** poprawności kodowania
3. **Drukowanie** kodów kreskowych, grafiki i/lub tekstu na powierzchni etykiety

### Obsługiwane standardy RFID

| Parametr | Wartość |
|----------|---------|
| Standard | **EPC Generation 2 Class 1** |
| Typ tagów | **Pasywne tagi UHF** |
| Pamięć TID | Informacje o producencie i modelu chipa |
| Identyfikator EPC | Zazwyczaj **96-bitowy** (większe struktury obsługiwane) |

### Struktura transpondera RFID

Transponder RFID (tag / inlay) składa się z:
- **Anteny** – widoczna, gdy etykieta zostanie podniesiona pod światło
- **Układu scalonego (IC)** – wyczuwalny jako wybrzuszenie, zawiera obwód RF, kodery, dekodery i pamięć

### Obsługa błędów kodowania RFID

- Kodowanie i drukowanie etykiety RFID zazwyczaj kończy się powodzeniem przy pierwszej próbie
- W przypadku **niepowodzenia kodowania**, na etykiecie zostanie wydrukowany napis **"VOID"**
- Drukarka próbuje odczytać/zakodować "n" etykiet przed przejściem do następnego formatu
- Akceptowalne wartości "n": **1-10**, domyślnie: **3**

> **Ważne:** RFID jest opcjonalną funkcją instalowaną fabrycznie.
`
      },
      {
        title: '3. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału WiFi | 4 paski = >75%, 3 paski = ≤75%, 2 paski = ≤50% >25%, 1 pasek = ≤25%, 0 pasków = brak sieci |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane (migający = przetwarzanie) |
| Materiał | Status materiału do druku (migający = brak materiału) |
| Otwarta pokrywa | Pokrywa komory mediów otwarta (migający) |
| Bateria | 4 paski = >80%, 3 paski = 60-80%, 2 paski = 40-60%, 1 pasek = 20-40%, 0 pasków = niski poziom |
| Battery Eliminator (DC) | Zasilanie zewnętrzne (bez baterii) |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość, zwiększona prędkość do 5 ips) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '4. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa (rozszerzona) |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +50°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -25°C do +60°C |

> **Ważne:** Drukarki ZQ511R działają prawidłowo wyłącznie z oryginalnymi bateriami Zebra PP+.

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Usuwanie taśmy izolacyjnej baterii

Nowe baterie są wysyłane z taśmą izolacyjną chroniącą styki. Przed pierwszym użyciem:

1. Pociągnij za zakładkę taśmy izolacyjnej na spodzie baterii.
2. Odklej taśmę i usuń ją z górnej części baterii.
3. Wyrzuć taśmę po usunięciu.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.
`
      },
      {
        title: '5. Ładowanie baterii',
        content: `
### Optymalne warunki ładowania

Aby uzyskać najlepsze wyniki szybkiego ładowania:
- Ładuj baterie w temperaturze pokojowej z wyłączonym urządzeniem
- Idealna temperatura ładowania: **5°C do 40°C**

### Zasilacz AC (ładowanie przez drukarkę)

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz odpowiedni przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.

### Vehicle Cradle (uchwyt samochodowy)

Uchwyt samochodowy umożliwia montaż drukarki w pojeździe z jednoczesnym ładowaniem baterii. Posiada złącze USB do podłączenia laptopa lub tabletu.

### Battery Eliminator

Eliminator baterii umożliwia montaż drukarki ZQ511R w pojeździe bez użycia baterii.

### 4-Bay Power Station

Stacja ładująca umożliwia dokowanie i ładowanie do **4 drukarek** jednocześnie, zachowując pełną funkcjonalność drukarki.

### 1-Slot Battery Charger

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

| Tryb | Wskaźnik | Opis |
|------|----------|------|
| Błąd ładowania | Szybko migający czerwony | Błąd baterii |
| Ładowanie (zdrowa) | Ciągły bursztynowy | Bateria się ładuje |
| Ładowanie zakończone | Ciągły zielony | W pełni naładowana |
| Ładowanie (niezdrowa) | Ciągły czerwony | Bateria wymaga wymiany |

### 3-Slot / Dual 3-Slot Battery Charger

Ładowarka do 3 (lub 6 w wersji Dual) baterii jednocześnie.
`
      },
      {
        title: '6. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów i regulowane podpory.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów (obie podpory poruszają się jednocześnie).
   - Włóż rolkę materiału między podpory w pokazanej orientacji.
   - Dyski automatycznie dopasują się i zabezpieczą materiał.
   - Rolka powinna swobodnie się obracać na podporach.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów dla ZQ511R

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | **35 mm do 80 mm** +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału (linerless) | 0,053 - 0,165 mm |
| Grubość materiału (linered) | 0,058 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **51 mm** (2,0") |
| Średnica rdzenia | 19 mm standard, 12,5 mm opcja |

### Materiały RFID

Do druku i kodowania RFID należy używać **certyfikowanych materiałów Zebra RFID** z wbudowanymi transponderami. Pozycja transpondera musi być odpowiednio ustawiona względem głowicy drukującej/kodera.

> **Uwaga:** Do użycia rdzenia 12,5 mm wymagana jest wymiana dysków podpory mediów.
`
      },
      {
        title: '7. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem (USB 2.0 Full Speed)
- Podłączenie urządzeń zewnętrznych w trybie hosta (500mA)

### Bluetooth 5.2 ready

| Parametr | Wartość |
|----------|---------|
| Wersja | **Bluetooth 5.2 ready** (BR/EDR + LE) |
| Tryb pracy | Slave (peryferyjne) |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |
| Domyślna klasa | Class 2 (możliwość zmiany na Class 1) |

**Ograniczone parowanie (Limited Pairing Mode):** Przytrzymanie przycisku Feed przez 5 sekund włącza tryb ograniczonego wykrywania i parowania na **2 minuty**.

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Bluetooth w dual radio | **5.2 ready** |
| Bezpieczeństwo | WEP, WPA/WPA2/WPA3, Enterprise |

> **Uwaga:** Dla drukarek zakupionych w regionie EMEA po 1 sierpnia 2025 r., WLAN jest domyślnie wyłączony. Należy skonfigurować hasło Protected Mode przed włączeniem. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Near Field Communication (NFC)

Drukarka obsługuje pasywny tag NFC. Funkcje:
- **Parowanie Bluetooth** przez zbliżenie smartfona do ikony Print Touch™
- **Uruchamianie aplikacji** Zebra lub firm trzecich
- **Otwieranie strony wsparcia** produktu

Zasięg NFC: do **7,62 cm** (3 cale).
`
      },
      {
        title: '8. Funkcje oszczędzania energii',
        content: `
### Tryb uśpienia (Sleep Mode)

Drukarka automatycznie przechodzi w tryb uśpienia po **2 minutach** nieaktywności:
- Wyświetlacz LCD wyłączony, brak podświetlenia
- Wskaźnik: wolno migający zielony pierścień LED

**Wybudzanie:**
- Naciśnij Power lub Select (krótko, < 3 sekundy)
- Rozpocznij komunikację przez Bluetooth lub WLAN

**Wyłączenie:** Przytrzymaj Power > 3 sekundy.

**Konfiguracja:** Użyj komendy SGD:
- **power.sleep.enable** (on/off)
- **power.sleep.timeout** (sekundy)

### Adaptive Print Performance (PSPT PrintSmart Gen 2)

Drukarka automatycznie dostosowuje wydajność druku do warunków środowiskowych (stan naładowania, zdrowie baterii, ekstremalne temperatury, wysoka gęstość druku) bez utraty jakości wydruku.

### Tryb szkicowy (Draft Mode)

Optymalizuje drukarkę do druku tekstu:
- Zwiększona prędkość: do **5 ips** (z 4 ips)
- Obniżona gęstość optyczna: **-22%**
- Przeznaczony do paragonów tekstowych bez kodów kreskowych i grafiki

**Włączenie:** Komenda SGD **media.draft_mode** (on/off).
`
      },
      {
        title: '9. Akcesoria do noszenia',
        content: `
### Klips do paska (Swivel Belt Clip)

Standardowe wyposażenie (z wyjątkiem drukarek z baterią rozszerzoną). Klips obraca się, umożliwiając swobodne poruszanie.

### Pasek na rękę (Hand Strap)

Mocowany do dwóch słupków z przodu drukarki za pomocą karabińczyków.

### Pasek na ramię (Shoulder Strap)

Regulowany pasek do **56 cali**, mocowany do słupków z przodu drukarki.

### Etui miękkie (Soft Case)

Ochronne etui z otwartą ścieżką papieru, widocznymi przyciskami sterowania i złączami D-Ring do paska na ramię.

### Exoskeleton (twarde etui)

Obudowa typu "muszla" zapewniająca ekstremalną wytrzymałość. Podnosi klasę ochrony do **IP65**. Umożliwia używanie przycisków sterowania oraz ładowanie na Vehicle Cradle i 4-Bay Power Station.

> **Uwaga:** Drukarki linerless nie powinny być używane z Exoskeleton ze względu na brak odwrotnego odrywania i lepkość materiału.
`
      },
      {
        title: '10. Konserwacja i czyszczenie',
        content: `
### Wydłużanie żywotności baterii

- Nie narażaj baterii na bezpośrednie światło słoneczne ani temperatury powyżej 40°C podczas ładowania
- Używaj wyłącznie ładowarek Zebra do akumulatorów Li-Ion
- Używaj odpowiednich materiałów do wymagań druku
- Wybierz odpowiednią ciemność i prędkość druku dla materiału
- Wyjmuj baterię, gdy drukarka nie będzie używana przez dzień lub dłużej
- Rozważ zakup zapasowej baterii

### Czyszczenie głowicy drukującej

**Częstotliwość:** Po każdych **5 rolkach** materiału (po każdej rolce dla materiału linerless).

**Metoda:** Użyj pisaka czyszczącego Zebra (p/n 105950-035) lub wacika nasączonego 90% alkoholem medycznym. Przetrzyj szarą linię na głowicy od środka do zewnętrznych krawędzi.

> **Ostrzeżenie:** Głowica może być bardzo gorąca po długim drukowaniu. Poczekaj na jej ostygnięcie przed czyszczeniem.

### Czyszczenie wałka dociskowego (platen)

**Linered:** Obróć wałek i wyczyść go wacikiem lub szmatką zwilżoną 90% alkoholem medycznym.

**Linerless:** Użyj wacika z roztworem 1 część mydła płynnego i 25 części wody. Następnie oczyść czystą wodą.

### Czyszczenie zgarniacza (Scraper) - tylko linerless

Użyj lepkiej strony materiału do oczyszczenia zgarniacza. Częstotliwość: po każdych 5 rolkach.
`
      },
      {
        title: '11. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Brak zasilania | Rozładowana bateria | Naładuj lub wymień baterię |
| | Bateria nieprawidłowo zainstalowana | Sprawdź instalację baterii |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Materiał nie wysuwa się | Pokrywa nie zamknięta | Zamknij i zatrzaśnij pokrywę |
| | Zablokowany trzpień rolki | Sprawdź swobodne obracanie |
| | Zablokowany czujnik etykiet | Oczyść czujnik |
| Słaba/wyblakła jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| Częściowy lub brak wydruku | Nieprawidłowe wyrównanie materiału | Wyrównaj materiał |
| | Zabrudzona głowica | Wyczyść głowicę |
| Zniekształcony wydruk | Wyczerpana bateria | Wymień baterię |
| | Problem z kablem | Sprawdź kabel do terminala |
| Skrócona żywotność baterii | Bateria starsza niż 1 rok | Normalne starzenie |
| Zacięcie etykiet | Nieprawidłowe ładowanie | Otwórz pokrywę i załaduj ponownie |
| Pusty ekran LCD | Drukarka wyłączona | Włącz drukarkę |
| | Tryb uśpienia | Naciśnij Power lub Select |
| Brak połączenia NFC | Zbyt duża odległość | Zbliż smartfon do 3 cali od ikony Print Touch |

### Problemy z RFID

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| **Błąd kodowania RFID** | Uszkodzony tag RFID | Użyj nowego materiału RFID |
| | Nieprawidłowy format etykiety | Sprawdź komendy RFID |
| | Nieprawidłowe pozycjonowanie tagu | Sprawdź pozycję transpondera |
| **VOID na etykiecie RFID** | Błąd kodowania | Sprawdź materiał RFID i format |

### Rozwiązywanie problemów RFID

Jeśli na etykietach RFID pojawia się napis "VOID":
1. Sprawdź, czy materiał RFID jest **certyfikowany przez Zebra**
2. Upewnij się, że transpondery są prawidłowo ustawione
3. Sprawdź format etykiety pod kątem błędów w komendach RFID
4. Zweryfikuj ustawienia komendy **^RS**

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '12. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Przycisk Feed przy włączaniu

1. Wyłącz drukarkę.
2. Załaduj materiał ciągły (bez czarnych znaczników ani przerw).
3. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
4. Gdy rozpocznie się drukowanie, zwolnij **Feed**.

Drukarka wydrukuje linię znaków "x" (test wszystkich elementów głowicy), wersję oprogramowania i raport konfiguracyjny.

### Metoda 2: Przycisk Select przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje raport konfiguracyjny, a następnie raport sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje raport Two-key i konfigurację ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.

### Tryb diagnostyczny HEX Dump

1. Wydrukuj raport konfiguracyjny (metoda 1 powyżej).
2. Na końcu raportu pojawi się: "Press FEED key to enter DUMP mode".
3. Naciśnij **Feed** w ciągu 3 sekund.
4. Drukarka wydrukuje: "Entering DUMP mode".
`
      },
      {
        title: '13. Komunikaty alertów',
        content: `
### Główne komunikaty

| Komunikat | Opis |
|-----------|------|
| PRINT HEAD OVERTEMP / PRINTING HALTED | Przegrzanie głowicy |
| HEAD MAINTEN. NEEDED / PRINTING HALTED | Wymagana konserwacja głowicy |
| BATTERY DIMINISHED / CONSIDER REPLACING | Bateria zużyta, rozważ wymianę |
| WARNING - BATTERY IS / PAST USEFUL LIFE | Bateria przekroczyła okres użytkowania |
| BATTERY DIMINISHED / SHUTTING DOWN | Bateria wyczerpana, wyłączanie |
| BATTERY FAILED / REPLACE BATTERY | Błąd uwierzytelnienia baterii |
| CHARGING TEMP FAULT / MUST BE 0-40°C | Temperatura poza zakresem ładowania |
| CHARGING FAULT / REPLACE BATTERY | Błąd ładowania |
| DOWNLOADING FIRMWARE | Pobieranie firmware |
| DOWNLOAD FAILED / PLEASE REBOOT | Pobieranie nieudane |
| FIRMWARE WRITING TO FLASH | Zapisywanie firmware do Flash |
| PRINTER PAUSED | Drukarka wstrzymana |
| ALL JOBS CLEARED | Wszystkie zadania usunięte |
| OUT OF MEMORY STORING... | Brak pamięci podczas zapisywania |
`
      },
      {
        title: '14. Oprogramowanie i narzędzia',
        content: `
### Narzędzia konfiguracyjne

- **ZebraNet Bridge Enterprise™** – konfiguracja drukarki, zarządzanie flotą
- **Zebra Setup Utilities (ZSU)** – konfiguracja pojedynczej drukarki, szybka konfiguracja
- **Zebra Mobile Setup Utility** – narzędzie konfiguracyjne dla Android
- **ZebraDesigner Pro v2** – projektowanie etykiet
- **Zebra Designer Drivers** – sterownik Windows
- **Zebra Downloader** – pobieranie firmware
- **Printer Profile Manager Enterprise (PPME)** – zarządzanie profilami drukarek

Wszystkie narzędzia dostępne na: **zebra.com/support-downloads** lub [/sterowniki](/sterowniki)

### Aplikacje mobilne

- **Zebra Printer Setup Utility** dla Android (Google Play)
- **Zebra Printer Setup Utility** dla iOS (App Store)

Obsługiwane typy połączeń:
- Bluetooth Classic
- Bluetooth Low Energy (BLE)
- Przewodowe/Ethernet
- Bezprzewodowe
- USB On-The-Go

### Dokumentacja RFID

- **RFID Programming Guide 3** – szczegółowe informacje o komendach RFID (dostępny na zebra.com/manuals)
`
      },
      {
        title: '15. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ511R?

**Odpowiedź:** ZQ511R drukuje do **72 mm (2,83")** szerokości – jest to drukarka **3-calowa** (do szerokości materiału 80 mm).

### Czy ZQ511R wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ511R to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Czym ZQ511R różni się od ZQ511?

**Odpowiedź:** ZQ511R ma wbudowany **koder/czytnik RFID UHF** (EPC Gen 2 Class 1), który umożliwia kodowanie i weryfikację tagów RFID. Pozostałe parametry są identyczne.

### Co oznacza "VOID" na etykiecie RFID?

**Odpowiedź:** Napis **"VOID"** oznacza, że kodowanie tagu RFID nie powiodło się. Drukarka automatycznie drukuje VOID, aby oznaczyć uszkodzoną etykietę. Sprawdź materiał RFID i format etykiety.

### Jakie tagi RFID obsługuje ZQ511R?

**Odpowiedź:** ZQ511R obsługuje **pasywne tagi UHF** zgodne ze standardem **EPC Generation 2 Class 1**. Identyfikator EPC to zazwyczaj 96 bitów.

### Jak długo ładuje się bateria ZQ511R?

**Odpowiedź:** W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ511R z iPhone?

**Odpowiedź:** ZQ511R ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ511R?

**Odpowiedź:** ZQ511R ma klasę ochrony **IP54** standardowo, ale z **Exoskeleton** (twarde etui) klasa rośnie do **IP65**. Ma też certyfikat **MIL-STD 810**.

### Jakie języki programowania obsługuje ZQ511R?

**Odpowiedź:** ZQ511R obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra. Do kodowania RFID używa się komend **^RF** i **^RS**.

### Ile waży drukarka ZQ511R?

**Odpowiedź:** ZQ511R waży **0,61 kg** z baterią – identycznie jak ZQ511 bez RFID.

### Co oznacza informacja o WLAN wyłączonym dla drukarek EMEA po sierpniu 2025?

**Odpowiedź:** Zgodnie z **dyrektywą EU RED**, drukarki sprzedawane w Europie po 1 sierpnia 2025 mają domyślnie wyłączone WiFi. Przed włączeniem musisz ustawić hasło Protected Mode. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)
`
      }
    ]
  },
  'zq521r': {
    model: 'ZQ521R',
    title: 'Zebra ZQ521R – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-12',
    sourceDocument: 'Zebra ZQ511/ZQ521 User Guide (P1106523-07EN)',
    keywords: [
      'zebra zq521r instrukcja',
      'zq521r instrukcja po polsku',
      'zebra zq521r manual',
      'drukarka mobilna zebra zq521r',
      'zebra zq521r rfid',
      'zq521r rfid uhf',
      'zebra zq521r bateria',
      'zq521r ładowanie',
      'zebra zq521r bluetooth 5.2',
      'zq521r wifi',
      'zebra zq521r nfc',
      'zq521r parowanie',
      'zebra zq521r materiały',
      'zq521r rolki etykiet',
      'zebra zq521r czyszczenie',
      'zq521r głowica',
      'zebra zq521r powerprecision',
      'zq521r specyfikacja',
      'zebra zq521r ip54',
      'zebra zq521r ip65',
      'zq521r wytrzymała',
      'zebra zq521r mfi',
      'zq521r iphone',
      'drukarka przenośna zebra zq521r',
      'zebra zq521r 4 calowa',
      'zq521r etykiety rfid',
      'zebra zq521r logistyka',
      'zebra zq521r transport',
      'zq521r kodowanie rfid',
      'zq521r serwis',
      'instrukcja obsługi zebra zq521r'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce Zebra ZQ521R

Zebra ZQ521R to wytrzymała mobilna drukarka paragonów i etykiet o szerokości druku do **104 mm (4,09")** z **wbudowanym koderem/czytnikiem RFID UHF**, zaprojektowana dla pracowników mobilnych w branży transportowej, logistycznej, produkcyjnej i rządowej.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do **104 mm** (4,09") |
| Technologia druku | **Termiczny bezpośredni** (Direct Thermal) |
| Rozdzielczość | **203 dpi** (poziomo) × 200 dpi (pionowo) |
| Prędkość druku (linered) | do **127 mm/s** (5"/s) |
| Prędkość druku (linerless) | do **76,2 mm/s** (3"/s) |
| Maks. średnica rolki | **57 mm** (2,24") |
| Maks. szerokość materiału | **113 mm** (4,45") +1 mm |
| Min. szerokość materiału | **51 mm** (2,0") |
| Pamięć Flash | **512 MB** |
| Pamięć RAM | **256 MB** |
| Języki programowania | **CPCL, ZPL II** |
| **RFID** | **EPC Gen 2 Class 1 UHF** |
| Klasa ochrony | **IP54** (bez etui), **IP65** (z twardym etui) |
| Certyfikat wojskowy | **MIL-STD 810** |
| Waga z baterią | **0,75 kg** |
| Wymiary (S×W×D) | 155 × 67 × 150 mm |

### Kluczowe funkcje

- **RFID UHF** – kodowanie i weryfikacja tagów EPC Gen 2 Class 1
- **Bluetooth 5.2 ready** (BR/EDR + LE)
- **Dual radio** 802.11ac/Bluetooth 5.2
- Inteligentna bateria **PowerPrecision+**
- **Near Field Communication (NFC)** do szybkiego parowania
- Kolorowy wyświetlacz **LCD**
- Certyfikat **Made for iPhone® (MFi)**
- **Exoskeleton** z ochroną **IP65**
`
      },
      {
        title: '2. Funkcja RFID',
        content: `
### O technologii RFID w ZQ521R

Drukarka ZQ521R jest wyposażona w koder/czytnik RFID zintegrowany z zespołem głowicy drukującej. Drukarka koduje (zapisuje) informacje na **ultracienkich transponderach RFID UHF** osadzonych w "inteligentnych" etykietach, biletach i tagach.

### Proces druku RFID

1. **Kodowanie** informacji na transponderze RFID
2. **Weryfikacja** poprawności kodowania
3. **Drukowanie** kodów kreskowych, grafiki i/lub tekstu na powierzchni etykiety

### Obsługiwane standardy RFID

| Parametr | Wartość |
|----------|---------|
| Standard | **EPC Generation 2 Class 1** |
| Typ tagów | **Pasywne tagi UHF** |
| Pamięć TID | Informacje o producencie i modelu chipa |
| Identyfikator EPC | Zazwyczaj **96-bitowy** (większe struktury obsługiwane) |

### Struktura transpondera RFID

Transponder RFID (tag / inlay) składa się z:
- **Anteny** – widoczna, gdy etykieta zostanie podniesiona pod światło
- **Układu scalonego (IC)** – wyczuwalny jako wybrzuszenie, zawiera obwód RF, kodery, dekodery i pamięć

### Obsługa błędów kodowania RFID

- Kodowanie i drukowanie etykiety RFID zazwyczaj kończy się powodzeniem przy pierwszej próbie
- W przypadku **niepowodzenia kodowania**, na etykiecie zostanie wydrukowany napis **"VOID"**
- Drukarka próbuje odczytać/zakodować "n" etykiet przed przejściem do następnego formatu
- Akceptowalne wartości "n": **1-10**, domyślnie: **3**

> **Ważne:** RFID jest opcjonalną funkcją instalowaną fabrycznie.
`
      },
      {
        title: '3. Panel sterowania i wyświetlacz',
        content: `
### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **Power** | Włączanie/wyłączanie drukarki, wybudzanie z trybu uśpienia |
| **Feed** | Wysuw materiału o jedną etykietę lub określoną długość |
| **Select** | Wybór opcji menu na wyświetlaczu LCD |

### Ikony statusu na wyświetlaczu

| Ikona | Znaczenie |
|-------|-----------|
| Bluetooth | Połączenie Bluetooth aktywne |
| WiFi | Połączenie WiFi aktywne |
| Siła sygnału WiFi | 4 paski = >75%, 3 paski = ≤75%, 2 paski = ≤50% >25%, 1 pasek = ≤25%, 0 pasków = brak sieci |
| Błąd | Wystąpił błąd wymagający uwagi |
| Dane | Drukarka odbiera dane (migający = przetwarzanie) |
| Materiał | Status materiału do druku (migający = brak materiału) |
| Otwarta pokrywa | Pokrywa komory mediów otwarta (migający) |
| Bateria | 4 paski = >80%, 3 paski = 60-80%, 2 paski = 40-60%, 1 pasek = 20-40%, 0 pasków = niski poziom |
| Battery Eliminator (DC) | Zasilanie zewnętrzne (bez baterii) |
| Power Save | Tryb oszczędzania energii |
| Draft Mode | Tryb szkicowy (obniżona jakość, zwiększona prędkość do 5 ips) |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor LED | Status |
|-----------|--------|
| Zielony ciągły | Drukarka włączona, bateria naładowana |
| Zielony migający | Tryb uśpienia |
| Bursztynowy ciągły | Bateria się ładuje |
| Bursztynowy migający | Tryb uśpienia + ładowanie |
| Czerwony ciągły | Błąd baterii |
`
      },
      {
        title: '4. Bateria PowerPrecision+',
        content: `
### Specyfikacja baterii

| Parametr | Wartość |
|----------|---------|
| Typ | Li-Ion 2-komórkowa lub 4-komórkowa (rozszerzona) |
| Napięcie nominalne | **7,4 V DC** |
| Pojemność minimalna | **2,45 Ah** |
| Temperatura pracy | -20°C do +50°C |
| Temperatura ładowania | 0°C do +40°C |
| Temperatura przechowywania | -25°C do +60°C |

> **Ważne:** Drukarki ZQ521R działają prawidłowo wyłącznie z oryginalnymi bateriami Zebra PP+.

### Instalacja baterii

1. Jeśli jest zamontowany klips do paska, obróć go, aby uzyskać dostęp do komory baterii.
2. Włóż baterię do drukarki w pokazanej orientacji (nie można włożyć baterii nieprawidłowo).
3. Dociśnij baterię, aż zatrzaśnie się na miejscu i będzie równo osadzona.

### Usuwanie taśmy izolacyjnej baterii

Nowe baterie są wysyłane z taśmą izolacyjną chroniącą styki. Przed pierwszym użyciem:

1. Pociągnij za zakładkę taśmy izolacyjnej na spodzie baterii.
2. Odklej taśmę i usuń ją z górnej części baterii.
3. Wyrzuć taśmę po usunięciu.

### Stan zdrowia baterii PowerPrecision+

| Liczba cykli ładowania | Stan zdrowia | Komunikat |
|------------------------|--------------|-----------|
| < 300 | GOOD (Dobry) | Brak |
| ≥ 300, < 550 | REPLACE (Wymień) | "Battery Diminished Consider Replacing" |
| ≥ 550, < 600 | REPLACE (Wymień) | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR (Zły) | "Replace Battery Shutting Down" |

> **Ważne:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych.
`
      },
      {
        title: '5. Ładowanie baterii',
        content: `
### Optymalne warunki ładowania

Aby uzyskać najlepsze wyniki szybkiego ładowania:
- Ładuj baterie w temperaturze pokojowej z wyłączonym urządzeniem
- Idealna temperatura ładowania: **5°C do 40°C**

### Zasilacz AC (ładowanie przez drukarkę)

1. Otwórz osłonę gniazda DC na drukarce.
2. Podłącz odpowiedni przewód AC do zasilacza, a następnie do gniazdka.
3. Podłącz wtyczkę DC do gniazda ładowania na drukarce.
4. Drukarka włączy się i rozpocznie ładowanie.

### Vehicle Cradle (uchwyt samochodowy)

Uchwyt samochodowy umożliwia montaż drukarki w pojeździe z jednoczesnym ładowaniem baterii. Posiada złącze USB do podłączenia laptopa lub tabletu.

### Battery Eliminator

Eliminator baterii umożliwia montaż drukarki ZQ521R w pojeździe bez użycia baterii.

### 4-Bay Power Station

Stacja ładująca umożliwia dokowanie i ładowanie do **4 drukarek** jednocześnie, zachowując pełną funkcjonalność drukarki.

### 1-Slot Battery Charger

Czas ładowania: **< 4 godziny** (bateria 2-komórkowa), **< 6 godzin** (bateria 4-komórkowa).

| Tryb | Wskaźnik | Opis |
|------|----------|------|
| Błąd ładowania | Szybko migający czerwony | Błąd baterii |
| Ładowanie (zdrowa) | Ciągły bursztynowy | Bateria się ładuje |
| Ładowanie zakończone | Ciągły zielony | W pełni naładowana |
| Ładowanie (niezdrowa) | Ciągły czerwony | Bateria wymaga wymiany |

### 3-Slot / Dual 3-Slot Battery Charger

Ładowarka do 3 (lub 6 w wersji Dual) baterii jednocześnie.
`
      },
      {
        title: '6. Ładowanie materiału',
        content: `
### Procedura ładowania

1. **Otwarcie drukarki:**
   - Naciśnij przycisk Media Cover Button na boku drukarki.
   - Pokrywa otworzy się automatycznie.
   - Odchyl pokrywę do tyłu, odsłaniając komorę mediów i regulowane podpory.

2. **Ładowanie rolki:**
   - Rozsuń dyski podpory mediów (obie podpory poruszają się jednocześnie).
   - Włóż rolkę materiału między podpory w pokazanej orientacji.
   - Dyski automatycznie dopasują się i zabezpieczą materiał.
   - Rolka powinna swobodnie się obracać na podporach.

3. **Zamknięcie drukarki:**
   - Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu.
   - Materiał zostanie automatycznie wysunięty.

### Specyfikacja materiałów dla ZQ521R

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | **51 mm do 113 mm** +1 mm |
| Min. długość etykiety | **12,5 mm** (0,5") |
| Grubość materiału | 0,053 - 0,165 mm |
| Maks. grubość tagów | 0,058 - 0,140 mm |
| Maks. średnica rolki | **57 mm** (2,24") |
| Średnica rdzenia | 19 mm standard, 12,5 mm opcja |

### Materiały RFID

Do druku i kodowania RFID należy używać **certyfikowanych materiałów Zebra RFID** z wbudowanymi transponderami. Pozycja transpondera musi być odpowiednio ustawiona względem głowicy drukującej/kodera.

> **Uwaga:** Do użycia rdzenia 12,5 mm wymagana jest wymiana dysków podpory mediów.
`
      },
      {
        title: '7. Komunikacja',
        content: `
### USB

Drukarka wyposażona jest w port **USB Micro AB (On-The-Go)** umożliwiający:
- Komunikację z komputerem (USB 2.0 Full Speed)
- Podłączenie urządzeń zewnętrznych w trybie hosta (500mA)

### Bluetooth 5.2 ready

| Parametr | Wartość |
|----------|---------|
| Wersja | **Bluetooth 5.2 ready** (BR/EDR + LE) |
| Tryb pracy | Slave (peryferyjne) |
| Certyfikat MFi | **Tak** (Made for iPhone/iPad) |
| Obsługiwane systemy | iOS 10+, Android, Windows |
| Domyślna klasa | Class 2 (możliwość zmiany na Class 1) |

**Ograniczone parowanie (Limited Pairing Mode):** Przytrzymanie przycisku Feed przez 5 sekund włącza tryb ograniczonego wykrywania i parowania na **2 minuty**.

### WLAN 802.11ac (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | 802.11 a/b/g/n/ac |
| Bluetooth w dual radio | **5.2 ready** |
| Bezpieczeństwo | WEP, WPA/WPA2/WPA3, Enterprise |

> **Uwaga:** Dla drukarek zakupionych w regionie EMEA po 1 sierpnia 2025 r., WLAN jest domyślnie wyłączony. Należy skonfigurować hasło Protected Mode przed włączeniem. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)

### Near Field Communication (NFC)

Drukarka obsługuje pasywny tag NFC. Funkcje:
- **Parowanie Bluetooth** przez zbliżenie smartfona do ikony Print Touch™
- **Uruchamianie aplikacji** Zebra lub firm trzecich
- **Otwieranie strony wsparcia** produktu

Zasięg NFC: do **7,62 cm** (3 cale).
`
      },
      {
        title: '8. Funkcje oszczędzania energii',
        content: `
### Tryb uśpienia (Sleep Mode)

Drukarka automatycznie przechodzi w tryb uśpienia po **2 minutach** nieaktywności:
- Wyświetlacz LCD wyłączony, brak podświetlenia
- Wskaźnik: wolno migający zielony pierścień LED

**Wybudzanie:**
- Naciśnij Power lub Select (krótko, < 3 sekundy)
- Rozpocznij komunikację przez Bluetooth lub WLAN

**Wyłączenie:** Przytrzymaj Power > 3 sekundy.

**Konfiguracja:** Użyj komendy SGD:
- **power.sleep.enable** (on/off)
- **power.sleep.timeout** (sekundy)

### Adaptive Print Performance (PSPT PrintSmart Gen 2)

Drukarka automatycznie dostosowuje wydajność druku do warunków środowiskowych (stan naładowania, zdrowie baterii, ekstremalne temperatury, wysoka gęstość druku) bez utraty jakości wydruku.

### Tryb szkicowy (Draft Mode)

Optymalizuje drukarkę do druku tekstu:
- Zwiększona prędkość: do **5 ips** (z 4 ips)
- Obniżona gęstość optyczna: **-22%**
- Przeznaczony do paragonów tekstowych bez kodów kreskowych i grafiki

**Włączenie:** Komenda SGD **media.draft_mode** (on/off).
`
      },
      {
        title: '9. Akcesoria do noszenia',
        content: `
### Klips do paska (Swivel Belt Clip)

Standardowe wyposażenie (z wyjątkiem drukarek z baterią rozszerzoną). Klips obraca się, umożliwiając swobodne poruszanie.

### Pasek na rękę (Hand Strap)

Mocowany do dwóch słupków z przodu drukarki za pomocą karabińczyków.

### Pasek na ramię (Shoulder Strap)

Regulowany pasek do **56 cali**, mocowany do słupków z przodu drukarki.

### Etui miękkie (Soft Case)

Ochronne etui z otwartą ścieżką papieru, widocznymi przyciskami sterowania i złączami D-Ring do paska na ramię.

### Exoskeleton (twarde etui)

Obudowa typu "muszla" zapewniająca ekstremalną wytrzymałość. Podnosi klasę ochrony do **IP65**. Umożliwia używanie przycisków sterowania oraz ładowanie na Vehicle Cradle i 4-Bay Power Station.

> **Uwaga:** Drukarki linerless nie powinny być używane z Exoskeleton ze względu na brak odwrotnego odrywania i lepkość materiału.
`
      },
      {
        title: '10. Konserwacja i czyszczenie',
        content: `
### Wydłużanie żywotności baterii

- Nie narażaj baterii na bezpośrednie światło słoneczne ani temperatury powyżej 40°C podczas ładowania
- Używaj wyłącznie ładowarek Zebra do akumulatorów Li-Ion
- Używaj odpowiednich materiałów do wymagań druku
- Wybierz odpowiednią ciemność i prędkość druku dla materiału
- Wyjmuj baterię, gdy drukarka nie będzie używana przez dzień lub dłużej
- Rozważ zakup zapasowej baterii

### Czyszczenie głowicy drukującej

**Częstotliwość:** Po każdych **5 rolkach** materiału (po każdej rolce dla materiału linerless).

**Metoda:** Użyj pisaka czyszczącego Zebra (p/n 105950-035) lub wacika nasączonego 90% alkoholem medycznym. Przetrzyj szarą linię na głowicy od środka do zewnętrznych krawędzi.

> **Ostrzeżenie:** Głowica może być bardzo gorąca po długim drukowaniu. Poczekaj na jej ostygnięcie przed czyszczeniem.

### Czyszczenie wałka dociskowego (platen)

**Linered:** Obróć wałek i wyczyść go wacikiem lub szmatką zwilżoną 90% alkoholem medycznym.

**Linerless:** Użyj wacika z roztworem 1 część mydła płynnego i 25 części wody. Następnie oczyść czystą wodą.

### Czyszczenie zgarniacza (Scraper) - tylko linerless

Użyj lepkiej strony materiału do oczyszczenia zgarniacza. Częstotliwość: po każdych 5 rolkach.
`
      },
      {
        title: '11. Rozwiązywanie problemów',
        content: `
### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Brak zasilania | Rozładowana bateria | Naładuj lub wymień baterię |
| | Bateria nieprawidłowo zainstalowana | Sprawdź instalację baterii |
| | Uszkodzona bateria | Sprawdź stan zdrowia baterii |
| Materiał nie wysuwa się | Pokrywa nie zamknięta | Zamknij i zatrzaśnij pokrywę |
| | Zablokowany trzpień rolki | Sprawdź swobodne obracanie |
| | Zablokowany czujnik etykiet | Oczyść czujnik |
| Słaba/wyblakła jakość druku | Zabrudzona głowica | Wyczyść głowicę pisakiem |
| | Nieodpowiedni materiał | Użyj materiałów Zebra |
| Częściowy lub brak wydruku | Nieprawidłowe wyrównanie materiału | Wyrównaj materiał |
| | Zabrudzona głowica | Wyczyść głowicę |
| Zniekształcony wydruk | Wyczerpana bateria | Wymień baterię |
| | Problem z kablem | Sprawdź kabel do terminala |
| Skrócona żywotność baterii | Bateria starsza niż 1 rok | Normalne starzenie |
| Zacięcie etykiet | Nieprawidłowe ładowanie | Otwórz pokrywę i załaduj ponownie |
| Pusty ekran LCD | Drukarka wyłączona | Włącz drukarkę |
| | Tryb uśpienia | Naciśnij Power lub Select |
| Brak połączenia NFC | Zbyt duża odległość | Zbliż smartfon do 3 cali od ikony Print Touch |

### Problemy z RFID

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| **Błąd kodowania RFID** | Uszkodzony tag RFID | Użyj nowego materiału RFID |
| | Nieprawidłowy format etykiety | Sprawdź komendy RFID |
| | Nieprawidłowe pozycjonowanie tagu | Sprawdź pozycję transpondera |
| **VOID na etykiecie RFID** | Błąd kodowania | Sprawdź materiał RFID i format |

### Rozwiązywanie problemów RFID

Jeśli na etykietach RFID pojawia się napis "VOID":
1. Sprawdź, czy materiał RFID jest **certyfikowany przez Zebra**
2. Upewnij się, że transpondery są prawidłowo ustawione
3. Sprawdź format etykiety pod kątem błędów w komendach RFID
4. Zweryfikuj ustawienia komendy **^RS**

### Wyłączenie termiczne

Drukarka automatycznie zatrzymuje drukowanie, gdy temperatura głowicy osiągnie **65°C**. Drukowanie wznawia się po schłodzeniu do **60°C** bez utraty danych.
`
      },
      {
        title: '12. Drukowanie etykiety konfiguracyjnej',
        content: `
### Metoda 1: Przycisk Feed przy włączaniu

1. Wyłącz drukarkę.
2. Załaduj materiał ciągły (bez czarnych znaczników ani przerw).
3. Przytrzymaj przycisk **Feed** i naciśnij **Power**.
4. Gdy rozpocznie się drukowanie, zwolnij **Feed**.

Drukarka wydrukuje linię znaków "x" (test wszystkich elementów głowicy), wersję oprogramowania i raport konfiguracyjny.

### Metoda 2: Przycisk Select przy włączaniu

1. Wyłącz drukarkę.
2. Przytrzymaj przycisk **Select** i naciśnij **Power**.
3. Drukarka wydrukuje raport konfiguracyjny, a następnie raport sieci.

### Metoda 3: Kombinacja przycisków w trakcie pracy

1. Przytrzymaj jednocześnie **Feed** i **Select** przez 3 sekundy.
2. Drukarka wydrukuje raport Two-key i konfigurację ZPL.

### Wymuszony tryb pobierania (Forced Download)

1. Wyłącz drukarkę.
2. Przytrzymaj jednocześnie **Select** i **Feed**, a następnie naciśnij **Power**.
3. Drukarka uruchomi się w trybie umożliwiającym aktualizację firmware.

### Tryb diagnostyczny HEX Dump

1. Wydrukuj raport konfiguracyjny (metoda 1 powyżej).
2. Na końcu raportu pojawi się: "Press FEED key to enter DUMP mode".
3. Naciśnij **Feed** w ciągu 3 sekund.
4. Drukarka wydrukuje: "Entering DUMP mode".
`
      },
      {
        title: '13. Komunikaty alertów',
        content: `
### Główne komunikaty

| Komunikat | Opis |
|-----------|------|
| PRINT HEAD OVERTEMP / PRINTING HALTED | Przegrzanie głowicy |
| HEAD MAINTEN. NEEDED / PRINTING HALTED | Wymagana konserwacja głowicy |
| BATTERY DIMINISHED / CONSIDER REPLACING | Bateria zużyta, rozważ wymianę |
| WARNING - BATTERY IS / PAST USEFUL LIFE | Bateria przekroczyła okres użytkowania |
| BATTERY DIMINISHED / SHUTTING DOWN | Bateria wyczerpana, wyłączanie |
| BATTERY FAILED / REPLACE BATTERY | Błąd uwierzytelnienia baterii |
| CHARGING TEMP FAULT / MUST BE 0-40°C | Temperatura poza zakresem ładowania |
| CHARGING FAULT / REPLACE BATTERY | Błąd ładowania |
| DOWNLOADING FIRMWARE | Pobieranie firmware |
| DOWNLOAD FAILED / PLEASE REBOOT | Pobieranie nieudane |
| FIRMWARE WRITING TO FLASH | Zapisywanie firmware do Flash |
| PRINTER PAUSED | Drukarka wstrzymana |
| ALL JOBS CLEARED | Wszystkie zadania usunięte |
| OUT OF MEMORY STORING... | Brak pamięci podczas zapisywania |
`
      },
      {
        title: '14. Oprogramowanie i narzędzia',
        content: `
### Narzędzia konfiguracyjne

- **ZebraNet Bridge Enterprise™** – konfiguracja drukarki, zarządzanie flotą
- **Zebra Setup Utilities (ZSU)** – konfiguracja pojedynczej drukarki, szybka konfiguracja
- **Zebra Mobile Setup Utility** – narzędzie konfiguracyjne dla Android
- **ZebraDesigner Pro v2** – projektowanie etykiet
- **Zebra Designer Drivers** – sterownik Windows
- **Zebra Downloader** – pobieranie firmware
- **Printer Profile Manager Enterprise (PPME)** – zarządzanie profilami drukarek

Wszystkie narzędzia dostępne na: **zebra.com/support-downloads** lub [/sterowniki](/sterowniki)

### Aplikacje mobilne

- **Zebra Printer Setup Utility** dla Android (Google Play)
- **Zebra Printer Setup Utility** dla iOS (App Store)

Obsługiwane typy połączeń:
- Bluetooth Classic
- Bluetooth Low Energy (BLE)
- Przewodowe/Ethernet
- Bezprzewodowe
- USB On-The-Go

### Dokumentacja RFID

- **RFID Programming Guide 3** – szczegółowe informacje o komendach RFID (dostępny na zebra.com/manuals)
`
      },
      {
        title: '15. FAQ – Często zadawane pytania',
        content: `
### Jaka jest szerokość druku ZQ521R?

**Odpowiedź:** ZQ521R drukuje do **104 mm (4,09")** szerokości – jest to drukarka **4-calowa** (do szerokości materiału 113 mm).

### Czy ZQ521R wymaga ribbonu?

**Odpowiedź:** **Nie**, ZQ521R to drukarka **termiczna bezpośrednia (Direct Thermal)** – nie wymaga ribbonu.

### Czym ZQ521R różni się od ZQ521?

**Odpowiedź:** ZQ521R ma wbudowany **koder/czytnik RFID UHF** (EPC Gen 2 Class 1), który umożliwia kodowanie i weryfikację tagów RFID. Pozostałe parametry są identyczne.

### Czym ZQ521R różni się od ZQ511R?

**Odpowiedź:** Główna różnica to szerokość druku: **ZQ511R** drukuje do **72 mm** (3-calowa), natomiast **ZQ521R** drukuje do **104 mm** (4-calowa). ZQ521R jest też większy (155 vs 120 mm) i cięższy (0,75 vs 0,61 kg). Oba mają RFID UHF.

### Co oznacza "VOID" na etykiecie RFID?

**Odpowiedź:** Napis **"VOID"** oznacza, że kodowanie tagu RFID nie powiodło się. Drukarka automatycznie drukuje VOID, aby oznaczyć uszkodzoną etykietę. Sprawdź materiał RFID i format etykiety.

### Jakie tagi RFID obsługuje ZQ521R?

**Odpowiedź:** ZQ521R obsługuje **pasywne tagi UHF** zgodne ze standardem **EPC Generation 2 Class 1**. Identyfikator EPC to zazwyczaj 96 bitów.

### Jak długo ładuje się bateria ZQ521R?

**Odpowiedź:** W ładowarce 1-Slot: **< 4 godziny** (bateria 2-cell), **< 6 godzin** (bateria 4-cell).

### Co to jest PowerPrecision+?

**Odpowiedź:** **PowerPrecision+** to inteligentna bateria Li-Ion Zebra z monitorowaniem stanu w czasie rzeczywistym. Śledzi cykle ładowania, stan zdrowia i pozostałą pojemność.

### Jak sparować ZQ521R z iPhone?

**Odpowiedź:** ZQ521R ma certyfikat **MFi** dla iOS. Włącz Bluetooth na iPhonie, wyszukaj drukarkę, wybierz ją i potwierdź parowanie. Można też użyć **NFC Print Touch**.

### Jaka jest klasa ochrony ZQ521R?

**Odpowiedź:** ZQ521R ma klasę ochrony **IP54** standardowo, ale z **Exoskeleton** (twarde etui) klasa rośnie do **IP65**. Ma też certyfikat **MIL-STD 810**.

### Jakie języki programowania obsługuje ZQ521R?

**Odpowiedź:** ZQ521R obsługuje **CPCL i ZPL II** – dwa języki programowania drukarek Zebra. Do kodowania RFID używa się komend **^RF** i **^RS**.

### Ile waży drukarka ZQ521R?

**Odpowiedź:** ZQ521R waży **0,75 kg** z baterią – identycznie jak ZQ521 bez RFID.

### Co oznacza informacja o WLAN wyłączonym dla drukarek EMEA po sierpniu 2025?

**Odpowiedź:** Zgodnie z **dyrektywą EU RED**, drukarki sprzedawane w Europie po 1 sierpnia 2025 mają domyślnie wyłączone WiFi. Przed włączeniem musisz ustawić hasło Protected Mode. Więcej informacji: [/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja](/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja)
`
      }
    ]
  },

  'zq610': {
    model: 'ZQ610',
    title: 'Zebra ZQ610 – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-14',
    sourceDocument: 'ZQ610/ZQ620 User Guide',
    keywords: [
      'zebra zq610 instrukcja',
      'zq610 instrukcja po polsku',
      'zebra zq610 manual',
      'drukarka zebra zq610',
      'zebra zq610 mobilna',
      'zq610 drukarka przenośna',
      'zebra zq610 2 cale',
      'zq610 bateria',
      'zebra zq610 ładowanie',
      'zq610 bluetooth',
      'zebra zq610 wifi',
      'zq610 nfc',
      'zebra zq610 parowanie',
      'zq610 etykiety',
      'zebra zq610 materiały',
      'zq610 kalibracja',
      'zebra zq610 czyszczenie',
      'zq610 konserwacja',
      'zebra zq610 błędy',
      'zq610 rozwiązywanie problemów',
      'zebra zq610 specyfikacja',
      'zq610 parametry',
      'zebra zq610 lcd',
      'zq610 wyświetlacz',
      'zebra zq610 peel off',
      'zq610 odklejanie etykiet',
      'zebra zq610 logistyka',
      'zq610 handel detaliczny',
      'zebra zq610 służba zdrowia',
      'zq610 healthcare',
      'drukarka etykiet mobilna zebra',
      'zebra zq610 serwis',
      'zq610 naprawa'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZQ610

Zebra ZQ610 to kompaktowa mobilna drukarka etykiet o **szerokości druku 2 cale (48 mm)**, zaprojektowana do pracy w terenie i wymagających środowiskach przemysłowych. Wyposażona w wytrzymałą konstrukcję z certyfikatem IP43 (IP54 z opcjonalną obudową ochronną), inteligentną baterię PowerPrecision+, kolorowy wyświetlacz LCD oraz technologie NFC i Bluetooth 4.1. Idealna dla pracowników mobilnych w logistyce, handlu detalicznym, służbie zdrowia i usługach terenowych.

### Parametry techniczne

| Parametr | ZQ610 |
|----------|-------|
| **Szerokość druku** | **do 48 mm (1,89")** |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (4"/s) standardowo |
| | 127 mm/s (5"/s) w trybie Draft |
| Maks. średnica rolki | 55,8 mm (2,2") |
| Średnica gilzy | 19 mm lub 35 mm |
| Maks. szerokość materiału | 55,37 mm (2,18") |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |

### Porównanie ZQ610 vs ZQ620

| Parametr | ZQ610 | ZQ620 |
|----------|-------|-------|
| Szerokość druku | **48 mm (2")** | 72 mm (3") |
| Maks. szerokość materiału | 55,37 mm | 79,4 mm |
| Maks. średnica rolki | 55,8 mm | 66,8 mm |
| Waga z baterią | **0,61 kg** | 0,75 kg |
| Wymiary (SxDxW) | **91,4 x 170,9 x 72,4 mm** | 117,9 x 173,7 x 76,9 mm |
| Zastosowanie | Małe etykiety, paragony | Większe etykiety |

### Zastosowania ZQ610

- **Logistyka i wysyłka:** etykiety wysyłkowe, potwierdzenia dostawy
- **Handel detaliczny:** etykiety cenowe, oznaczenia promocji
- **Służba zdrowia:** etykiety na próbki, opaski identyfikacyjne
- **Transport:** dokumenty przewozowe, pokwitowania
- **Usługi terenowe:** potwierdzenia usług, protokoły
- **Gastronomia:** etykiety dat przydatności, zamówienia

### Złącza i łączność

- USB 2.0 Full Speed (standard)
- RS-232 Serial 14-pin (standard)
- Bluetooth 4.1 Classic + BLE (opcja)
- 802.11 a/b/g/n/ac Wi-Fi + Bluetooth 4.1 (opcja dual radio)
- Ethernet 10/100 (przez stację dokującą)
- NFC (Near Field Communication)

### Cechy charakterystyczne

- **Kompaktowa konstrukcja 2"** – idealna do noszenia przy pasku
- **Certyfikat IP43/IP54** – odporność na kurz i wodę
- **Bateria PowerPrecision+** – inteligentne zarządzanie energią
- **Kolorowy wyświetlacz LCD** – intuicyjny interfejs użytkownika
- **NFC Print Touch** – szybkie parowanie przez zbliżenie
- **Made for iPhone (MFi)** – certyfikowana zgodność z iOS
- Obsługa języków CPCL, ZPL i EPL
- Tryb Peel-Off (automatyczne odklejanie)
- Czujnik przerwy (gap) i czarnego znacznika (black mark)
- Wersja Healthcare w kolorze białym
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ610
- Bateria litowo-jonowa PowerPrecision+
- Klips do paska
- Karta rejestracyjna
- Skrócona instrukcja obsługi
- Przewodnik bezpieczeństwa

### Instalacja baterii

1. **Usuń taśmę izolacyjną** z nowej baterii (pociągnij za zakładkę)
2. **Obróć klips do paska** (jeśli zamontowany) aby uzyskać dostęp do komory baterii
3. **Włóż baterię** do komory zgodnie z oznaczeniami
4. **Dociśnij baterię** aż zatrzaśnie się na miejscu

> **Uwaga:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię w ładowarce lub podłącz drukarkę do zasilacza AC.

### Wyjmowanie baterii

1. Naciśnij zatrzask na baterii
2. Odchyl baterię od komory
3. Wyjmij baterię z drukarki

> **Ważne:** Zawsze wyłącz drukarkę przed wyjęciem baterii aby uniknąć uszkodzenia danych.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -20°C do +50°C | 10-90% bez kondensacji |
| Praca (Healthcare) | 0°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | – |
| Przechowywanie | -25°C do +65°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Kolorowy wyświetlacz LCD (288x240 pikseli) pokazuje status drukarki, ikony stanu i menu konfiguracyjne. Automatycznie przyciemnia się po okresie bezczynności.

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włącza/wyłącza drukarkę (przytrzymaj 3 sek. aby wyłączyć) |
| **FEED** | Wysuwa materiał / budzenie z trybu uśpienia |
| **Strzałki nawigacyjne** | Nawigacja po menu LCD |
| **OK** | Potwierdza wybór w menu |
| **Klawisze funkcyjne** | Wykonują akcje pokazane na pasku nawigacji |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor | Zachowanie | Znaczenie |
|-------|------------|-----------|
| Zielony | Stały | Bateria naładowana, drukarka włączona |
| Zielony | Pulsujący | Tryb uśpienia, bateria naładowana |
| Bursztynowy | Stały | Ładowanie w toku |
| Bursztynowy | Pulsujący | Ładowanie w trybie uśpienia |
| Czerwony | Stały | Niezdrowa bateria (wymień) |
| Czerwony | Migający 2x/s | Błąd ładowania |

### Ikony paska statusu

| Ikona | Znaczenie |
|-------|-----------|
| 📶 | Siła sygnału Wi-Fi (1-4 kreski) |
| 🔵 | Połączenie Bluetooth aktywne |
| 🔋 | Poziom naładowania baterii |
| ⚡ | Ładowanie w toku |
| 📄 | Status mediów (brak = miga czerwono) |
| ⚠️ | Błąd (miga czerwono) |
| 🔓 | Pokrywa otwarta (miga czerwono) |

### Menu główne (Home Menu)

Z ekranu głównego naciśnij lewy klawisz funkcyjny aby wejść do menu z ikonami:

| Ikona | Menu | Zawartość |
|-------|------|-----------|
| ⚙️ | **Settings** | Ciemność druku, typ mediów, tryb druku |
| 🔧 | **Tools** | Informacje, diagnostyka, reset |
| 📡 | **Network** | Ustawienia Wi-Fi, IP, DHCP |
| 🔋 | **Battery** | Status baterii, zdrowie, cykle |
| 🔤 | **Language** | Język wyświetlacza |
| 📊 | **Sensors** | Status czujników |
| 🔌 | **Ports** | Ustawienia portów komunikacyjnych |
| 📻 | **Bluetooth** | Ustawienia Bluetooth |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZQ610

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 55,37 mm (2,18") |
| Min. szerokość materiału | 25,4 mm (1") |
| Maks. długość etykiety | 812,8 mm (32") |
| Min. długość etykiety | 12,7 mm (0,5") |
| Maks. średnica rolki | 55,8 mm (2,2") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość materiału | 0,058-0,165 mm |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – paragony, kwity
- **Materiał bezpodkładowy (linerless)** – wymaga specjalnego wałka

### Ładowanie materiału (tryb Tear-Off)

1. **Otwórz pokrywę mediów** – naciśnij przycisk zwalniający z boku drukarki
2. **Odchyl pokrywę** do tyłu, odsłaniając komorę mediów
3. **Rozsuń dyski podtrzymujące** – odsuń je od siebie
4. **Włóż rolkę materiału** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. Naciśnij **FEED** aby wysunąć i wyrównać materiał

### Ładowanie w trybie Peel-Off

1. Otwórz pokrywę mediów
2. Załaduj rolkę materiału standardowo
3. **Odklej kilka etykiet** od podkładu
4. **Pociągnij dźwignię peelera** do przodu
5. **Podnieś ramię peelera** do góry
6. Przeprowadź pusty **podkład** za ramię peelera
7. Zamknij pokrywę – ramię peelera zablokuje się automatycznie
8. Włącz drukarkę lub naciśnij FEED

> **Uwaga:** Aby wyłączyć tryb Peel-Off, otwórz pokrywę i naciśnij ramię peelera w dół aż zatrzaśnie się w pozycji wyjściowej.
`
      },
      {
        title: '5. Ładowanie i zarządzanie baterią',
        content: `
### Bateria PowerPrecision+

Drukarka ZQ610 wykorzystuje inteligentną baterię litowo-jonową 2-ogniwową (7,4V, 2,45 Ah) z technologią PowerPrecision+, która zapewnia:

- Monitorowanie stanu zdrowia baterii w czasie rzeczywistym
- Licznik cykli ładowania
- Prognozowanie czasu pracy
- Optymalne zarządzanie ładowaniem

### Stan zdrowia baterii

| Liczba cykli | Stan | Komunikat |
|--------------|------|-----------|
| < 300 | GOOD | Brak |
| 300-549 | REPLACE | "Battery Diminished Consider Replacing" |
| 550-599 | REPLACE | "Warning-Battery Is Past Useful Life" |
| ≥ 600 | POOR | "Replace Battery Shutting Down" |

### Opcje ładowania

| Ładowarka | Opis | Czas ładowania |
|-----------|------|----------------|
| **Zasilacz AC** | Ładowanie przez gniazdo DC | Podczas pracy |
| **Smart Charger-2 (SC2)** | Ładowarka pojedyncza | ~2 godziny |
| **Quad Charger (UCLI72-4)** | 4 baterie jednocześnie | ~2 godziny |
| **1-Slot Battery Charger** | Ładowarka pojedyncza | ~4 godziny |
| **3-Slot Battery Charger** | 3 baterie jednocześnie | ~4 godziny |
| **Stacja dokująca Ethernet** | Z jednoczesną komunikacją | Podczas pracy |

### Wskaźniki ładowania (Smart Charger-2)

| LED | Status baterii |
|-----|----------------|
| Zielony (brak baterii) | Bateria niewłożona |
| Zielony (stały) | W pełni naładowana |
| Żółty (stały) | Ładowanie w toku |
| Bursztynowy | Błąd ładowania |

### Bezpieczeństwo baterii

> **Ostrzeżenie:** 
> - Nie narażaj baterii na temperatury powyżej 65°C
> - Używaj tylko ładowarek zatwierdzonych przez Zebra
> - Nie rozbieraj, nie zgniataj ani nie przebijaj baterii
> - Nie wrzucaj baterii do ognia ani wody
> - Unikaj zwarcia styków baterii
`
      },
      {
        title: '6. Konfiguracja i ustawienia',
        content: `
### SETTINGS Menu

| Pozycja | Opis | Opcje |
|---------|------|-------|
| **DARKNESS** | Ciemność druku | 0-30 |
| **MEDIA TYPE** | Typ mediów | Gap, Black Mark, Continuous |
| **PRINT MODE** | Tryb druku | Tear Off, Peel Off |
| **LABEL LENGTH** | Długość etykiety | Automatyczna/ręczna |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFO** | Drukuje etykietę konfiguracji |
| **SENSOR CALIBRATION** | Kalibracja czujników |
| **FACTORY DEFAULTS** | Przywracanie ustawień fabrycznych |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny (DUMP) |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **WLAN IP ADDRESS** | Adres IP Wi-Fi |
| **WLAN SUBNET** | Maska podsieci |
| **WLAN GATEWAY** | Brama domyślna |
| **ESSID** | Nazwa sieci Wi-Fi |
| **DHCP** | Automatyczne przydzielanie IP |
| **SECURITY** | Tryb zabezpieczeń sieci |

### BLUETOOTH Menu

| Pozycja | Opis |
|---------|------|
| **ENABLED** | Włączenie/wyłączenie Bluetooth |
| **DISCOVERABLE** | Widoczność dla innych urządzeń |
| **FRIENDLY NAME** | Nazwa wyświetlana drukarki |
| **SECURITY MODE** | Tryb zabezpieczeń (1-4) |
| **BONDING** | Zapamiętywanie sparowanych urządzeń |
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com
2. Zainstaluj oprogramowanie PRZED podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub RS-232
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB (mały 5-pin) do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę

### Połączenie Bluetooth

1. Włącz Bluetooth w drukarce (BLUETOOTH > ENABLED > ON)
2. Ustaw DISCOVERABLE na ON
3. Na urządzeniu mobilnym wyszukaj drukarkę
4. Sparuj urządzenia (kod PIN domyślnie nie jest wymagany w trybie SSP)

### Parowanie przez NFC

1. Włącz NFC na smartfonie
2. **Zbliż telefon** do ikony Print Touch na drukarce
3. Parowanie nastąpi automatycznie
4. Opcjonalnie: uruchomi się aplikacja Zebra

### Połączenie Wi-Fi

1. Skonfiguruj ustawienia sieci przez Zebra Setup Utilities
2. Wprowadź ESSID (nazwę sieci)
3. Skonfiguruj zabezpieczenia (WPA2, itp.)
4. Drukarka połączy się automatycznie
`
      },
      {
        title: '8. Weryfikacja działania',
        content: `
### Drukowanie etykiety konfiguracji (Two Key Report)

1. Wyłącz drukarkę
2. Załaduj materiał ciągły (bez znaczników)
3. **Przytrzymaj przycisk FEED**
4. **Naciśnij i zwolnij przycisk POWER** (trzymając FEED)
5. Zwolnij FEED gdy rozpocznie się drukowanie

Etykieta konfiguracji zawiera:
- Numer seryjny i model
- Wersję firmware
- Ustawienia komunikacji
- Status sieci i Bluetooth
- Zainstalowane czcionki i kody kreskowe

### Wejście w tryb diagnostyczny (DUMP Mode)

1. Wydrukuj etykietę konfiguracji
2. Na końcu wydruku pojawi się: "Press FEED key to enter DUMP mode"
3. Naciśnij FEED w ciągu 3 sekund
4. Drukarka będzie drukować odebrane dane w formacie HEX
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Wałek dociskowy (platen) | Co 5 rolek materiału |
| Czujniki (gap, black bar) | Co 5 rolek |
| Listwa odrywająca (tear bar) | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz pokrywę i wyjmij materiał
3. **Głowica:** Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem izopropylowym (90%+)
4. **Wałek:** Przetrzyj wacikiem z alkoholem, obracając ręcznie
5. **Czujniki:** Wydmuchaj kurz, przetrzyj suchym wacikiem
6. Poczekaj aż wyschnie przed załadowaniem materiału

### Materiały do czyszczenia

- Pisak czyszczący Zebra
- Waciki bezpyłowe
- Alkohol izopropylowy (90%+)
- Ściereczka bezpyłowa
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Komunikaty alertów

| Alert | Kolor | Znaczenie | Rozwiązanie |
|-------|-------|-----------|-------------|
| Media Out | Czerwony (miga) | Brak materiału | Załaduj materiał |
| Media Cover Open | Czerwony (miga) | Pokrywa otwarta | Zamknij pokrywę |
| Battery Low | – | Niski poziom baterii | Naładuj/wymień baterię |
| Battery Diminished | Żółty | Bateria zużyta | Rozważ wymianę |
| Error | Czerwony (miga) | Błąd ogólny | Sprawdź wyświetlacz |

### Problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Brak zasilania | Sprawdź instalację baterii, naładuj baterię |
| Materiał nie wysuwa się | Sprawdź czy pokrywa jest zamknięta, sprawdź rolkę |
| Słaby/wyblakły druk | Wyczyść głowicę, zwiększ ciemność, sprawdź materiał |
| Brakujący druk | Sprawdź wyrównanie materiału, wyczyść głowicę |
| Zniekształcony druk | Sprawdź baud rate, kabel komunikacyjny |
| Brak druku | Sprawdź komunikację, wymień baterię |
| Pomijanie etykiet | Skalibruj czujniki, sprawdź znaczniki/przerwy |
| Zacięcie materiału | Otwórz pokrywę, usuń zacięty materiał |
| Pusty ekran LCD | Włącz drukarkę, przeładuj firmware |
| Brak NFC | Zbliż telefon do 7,5 cm od ikony Print Touch |

### Przywracanie ustawień fabrycznych

**Z menu:**
TOOLS > FACTORY DEFAULTS

**Kombinacja klawiszy:**
Przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki
`
      },
      {
        title: '11. Akcesoria i opcje',
        content: `
### Opcje noszenia

| Akcesorium | Nr części |
|------------|-----------|
| Klips do paska (standard) | W zestawie |
| Pasek na ramię | P1031365-192 |
| Pasek na rękę | P1031365-027 |
| Miękka obudowa (soft case) | P1031365-044 |

### Ładowarki i stacje dokujące

| Akcesorium | Nr części |
|------------|-----------|
| Zasilacz AC | P1031365-024 |
| Smart Charger-2 (SC2) | P1031365-063 |
| Quad Charger UCLI72-4 | AC18177-5 |
| 1-Slot Battery Charger | SAC-MPP-1BCHGUS1-01SA |
| 3-Slot Battery Charger | SAC-MPP-3BCHGUS1-01 |
| Single Ethernet Cradle | – |
| 4-Bay Ethernet Cradle | – |
`
      },
      {
        title: '12. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 91,4 mm (3,5") |
| Długość | 170,9 mm (6,73") |
| Wysokość | 72,4 mm (2,85") |
| Waga z baterią | 0,61 kg (1,35 lbs) |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria | Li-Ion 7,4V, 2,45 Ah |
| Bateria rozszerzona | 4-ogniwowa (opcja) |
| Zasilacz AC | 100-240 VAC, 50-60 Hz |

### Certyfikaty

| Parametr | Wartość |
|----------|---------|
| Stopień ochrony IP | IP43 (IP54 z obudową) |
| Certyfikaty | FCC, CE, IC, MFi |
`
      },
      {
        title: 'FAQ – Często zadawane pytania',
        content: `
### Jaka jest maksymalna szerokość etykiety dla ZQ610?

**Odpowiedź:** Maksymalna szerokość materiału dla ZQ610 to **55,37 mm (2,18")**, a szerokość druku to **48 mm (1,89")**.

### Jak długo ładuje się bateria ZQ610?

**Odpowiedź:** W ładowarce Smart Charger-2: **~2 godziny**. W ładowarce 1-Slot Battery Charger: **~4 godziny**.

### Jak sparować ZQ610 z telefonem przez NFC?

**Odpowiedź:** Włącz NFC na telefonie i **zbliż go do ikony Print Touch** na drukarce. Parowanie nastąpi automatycznie. Maksymalna odległość to 7,5 cm.

### Co oznacza komunikat "Battery Diminished"?

**Odpowiedź:** Bateria wykonała **300-549 cykli ładowania** i jej pojemność jest obniżona. Rozważ wymianę baterii na nową.

### Jak przywrócić ustawienia fabryczne ZQ610?

**Odpowiedź:** Z menu: **TOOLS > FACTORY DEFAULTS**. Lub przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki.

### Czy ZQ610 obsługuje tryb Peel-Off?

**Odpowiedź:** Tak, ZQ610 obsługuje tryb **Peel-Off** (automatyczne odklejanie etykiet). Wymaga odpowiedniego ustawienia ramienia peelera.

### Jaka jest różnica między ZQ610 a ZQ620?

**Odpowiedź:** ZQ610 to drukarka **2-calowa** (48 mm), a ZQ620 to **3-calowa** (72 mm). ZQ610 jest mniejsza i lżejsza (0,61 kg vs 0,75 kg).

### Jak wyczyścić głowicę drukującą ZQ610?

**Odpowiedź:** Wyłącz drukarkę, poczekaj na ostygnięcie. Przetrzyj **brązowy pasek elementów grzejnych** wacikiem nasączonym alkoholem izopropylowym (90%+).

### Czy ZQ610 jest odporna na kurz i wodę?

**Odpowiedź:** ZQ610 ma certyfikat **IP43** standardowo. Z opcjonalną obudową ochronną klasa wzrasta do **IP54**.

### Jakie języki programowania obsługuje ZQ610?

**Odpowiedź:** ZQ610 obsługuje **CPCL, ZPL i EPL** – trzy popularne języki programowania drukarek Zebra.

### Ile waży drukarka ZQ610?

**Odpowiedź:** ZQ610 waży **0,61 kg** z baterią – jest jedną z najlżejszych mobilnych drukarek Zebra.

### Czy ZQ610 ma certyfikat MFi dla iPhone?

**Odpowiedź:** Tak, ZQ610 ma certyfikat **Made for iPhone (MFi)**, co zapewnia pełną kompatybilność z urządzeniami iOS.

### Jak wydrukować etykietę konfiguracji ZQ610?

**Odpowiedź:** Wyłącz drukarkę, przytrzymaj **FEED**, naciśnij i zwolnij **POWER** (trzymając FEED), zwolnij FEED gdy rozpocznie się drukowanie.
`
      }
    ]
  },

  'zq620': {
    model: 'ZQ620',
    title: 'Zebra ZQ620 – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZQ600 Series User Guide (P1080358-001 Rev. A)',
    keywords: [
      'zebra zq620 instrukcja', 'zq620 instrukcja po polsku', 'zebra zq620 manual',
      'drukarka zebra zq620', 'zq620 kalibracja', 'zq620 reset', 'zq620 bateria',
      'zq620 ładowanie etykiet', 'zq620 sterowniki', 'zq620 specyfikacja',
      'zq620 błędy', 'zq620 czyszczenie', 'zq620 bluetooth', 'zq620 wifi',
      'zq620 nfc', 'zq620 peel off', 'zq620 tear off', 'zq620 ip43', 'zq620 ip54',
      'zq620 powerprecision+', 'zq620 3 cale', 'mobilna drukarka etykiet',
      'zq620 vs zq610', 'zq620 healthcare', 'zq620 etykiety wysyłkowe'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZQ620

Zebra ZQ620 to wydajna mobilna drukarka etykiet o **szerokości druku 3 cale (72 mm)**, zaprojektowana do pracy w terenie i wymagających środowiskach przemysłowych. Oferuje większą szerokość druku niż model ZQ610, zachowując kompaktową konstrukcję z certyfikatem IP43 (IP54 z opcjonalną obudową ochronną). Wyposażona w inteligentną baterię PowerPrecision+, kolorowy wyświetlacz LCD oraz technologie NFC i Bluetooth 4.1. Idealna do drukowania większych etykiet wysyłkowych, dokumentów przewozowych i paragonów.

### Parametry techniczne

| Parametr | ZQ620 |
|----------|-------|
| **Szerokość druku** | **do 72 mm (2,91")** |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (4"/s) standardowo |
| | 127 mm/s (5"/s) w trybie Draft |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |

### Porównanie ZQ620 vs ZQ610

| Parametr | ZQ620 | ZQ610 |
|----------|-------|-------|
| Szerokość druku | **72 mm (3")** | 48 mm (2") |
| Maks. szerokość materiału | **79,4 mm** | 55,37 mm |
| Maks. średnica rolki | **66,8 mm** | 55,8 mm |
| Waga z baterią | 0,75 kg | 0,61 kg |
| Wymiary (SxDxW) | **117,9 x 173,7 x 76,9 mm** | 91,4 x 170,9 x 72,4 mm |
| Zastosowanie | **Większe etykiety, dokumenty** | Małe etykiety, paragony |

### Zastosowania ZQ620

- **Logistyka i wysyłka:** duże etykiety wysyłkowe, dokumenty przewozowe
- **Magazynowanie:** etykiety na półki, oznaczenia lokalizacji
- **Handel detaliczny:** etykiety cenowe, oznaczenia promocyjne
- **Służba zdrowia:** etykiety laboratoryjne, opaski identyfikacyjne
- **Transport:** listy przewozowe, potwierdzenia dostawy
- **Usługi terenowe:** protokoły serwisowe, faktury

### Złącza i łączność

- USB 2.0 Full Speed (standard)
- RS-232 Serial 14-pin (standard)
- Bluetooth 4.1 Classic + BLE (opcja)
- 802.11 a/b/g/n/ac Wi-Fi + Bluetooth 4.1 (opcja dual radio)
- Ethernet 10/100 (przez stację dokującą)
- NFC (Near Field Communication)

### Cechy charakterystyczne

- **Szerokość druku 3" (72 mm)** – idealna do większych etykiet
- **Certyfikat IP43/IP54** – odporność na kurz i wodę
- **Bateria PowerPrecision+** – inteligentne zarządzanie energią
- **Kolorowy wyświetlacz LCD** – intuicyjny interfejs użytkownika
- **NFC Print Touch** – szybkie parowanie przez zbliżenie
- **Made for iPhone (MFi)** – certyfikowana zgodność z iOS
- Obsługa języków CPCL, ZPL i EPL
- Tryb Peel-Off (automatyczne odklejanie)
- Czujnik przerwy (gap) i czarnego znacznika (black mark)
- Wersja Healthcare w kolorze białym
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ620
- Bateria litowo-jonowa PowerPrecision+
- Klips do paska
- Karta rejestracyjna
- Skrócona instrukcja obsługi
- Przewodnik bezpieczeństwa

### Instalacja baterii

1. **Usuń taśmę izolacyjną** z nowej baterii (pociągnij za zakładkę)
2. **Obróć klips do paska** (jeśli zamontowany) aby uzyskać dostęp do komory baterii
3. **Włóż baterię** do komory zgodnie z oznaczeniami
4. **Dociśnij baterię** aż zatrzaśnie się na miejscu

> **Uwaga:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię w ładowarce lub podłącz drukarkę do zasilacza AC.

### Wyjmowanie baterii

1. Naciśnij zatrzask na baterii
2. Odchyl baterię od komory
3. Wyjmij baterię z drukarki

> **Ważne:** Zawsze wyłącz drukarkę przed wyjęciem baterii aby uniknąć uszkodzenia danych.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -20°C do +50°C | 10-90% bez kondensacji |
| Praca (Healthcare) | 0°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | – |
| Przechowywanie | -25°C do +65°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Kolorowy wyświetlacz LCD (288x240 pikseli) pokazuje status drukarki, ikony stanu i menu konfiguracyjne. Automatycznie przyciemnia się po okresie bezczynności.

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włącza/wyłącza drukarkę (przytrzymaj 3 sek. aby wyłączyć) |
| **FEED** | Wysuwa materiał / budzenie z trybu uśpienia |
| **Strzałki nawigacyjne** | Nawigacja po menu LCD |
| **OK** | Potwierdza wybór w menu |
| **Klawisze funkcyjne** | Wykonują akcje pokazane na pasku nawigacji |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor | Zachowanie | Znaczenie |
|-------|------------|-----------|
| Zielony | Stały | Bateria naładowana, drukarka włączona |
| Zielony | Pulsujący | Tryb uśpienia, bateria naładowana |
| Bursztynowy | Stały | Ładowanie w toku |
| Bursztynowy | Pulsujący | Ładowanie w trybie uśpienia |
| Czerwony | Stały | Niezdrowa bateria (wymień) |
| Czerwony | Migający 2x/s | Błąd ładowania |

### Ikony paska statusu

| Ikona | Znaczenie |
|-------|-----------|
| Sygnał Wi-Fi | Siła sygnału Wi-Fi (1-4 kreski) |
| Bluetooth | Połączenie Bluetooth aktywne |
| Bateria | Poziom naładowania baterii |
| Błyskawica | Ładowanie w toku |
| Dokument | Status mediów (brak = miga czerwono) |
| Ostrzeżenie | Błąd (miga czerwono) |
| Kłódka | Pokrywa otwarta (miga czerwono) |

### Menu główne (Home Menu)

Z ekranu głównego naciśnij lewy klawisz funkcyjny aby wejść do menu z ikonami:

| Menu | Zawartość |
|------|-----------|
| **Settings** | Ciemność druku, typ mediów, tryb druku |
| **Tools** | Informacje, diagnostyka, reset |
| **Network** | Ustawienia Wi-Fi, IP, DHCP |
| **Battery** | Status baterii, zdrowie, cykle |
| **Language** | Język wyświetlacza |
| **Sensors** | Status czujników |
| **Ports** | Ustawienia portów komunikacyjnych |
| **Bluetooth** | Ustawienia Bluetooth |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZQ620

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Min. szerokość materiału | 25,4 mm (1") |
| Maks. długość etykiety | 812,8 mm (32") |
| Min. długość etykiety | 12,7 mm (0,5") |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość materiału | 0,058-0,165 mm |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – paragony, kwity
- **Materiał bezpodkładowy (linerless)** – wymaga specjalnego wałka

### Ładowanie materiału (tryb Tear-Off)

1. **Otwórz pokrywę mediów** – naciśnij przycisk zwalniający z boku drukarki
2. **Odchyl pokrywę** do tyłu, odsłaniając komorę mediów
3. **Rozsuń dyski podtrzymujące** – odsuń je od siebie
4. **Włóż rolkę materiału** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. Naciśnij **FEED** aby wysunąć i wyrównać materiał

> **Uwaga:** ZQ620 obsługuje szerszy materiał do 79,4 mm. Upewnij się, że materiał jest prawidłowo wyśrodkowany między dyskami podtrzymującymi.

### Ładowanie w trybie Peel-Off

1. Otwórz pokrywę mediów
2. Załaduj rolkę materiału standardowo
3. **Odklej kilka etykiet** od podkładu
4. **Pociągnij dźwignię peelera** do przodu
5. **Podnieś ramię peelera** do góry
6. Przeprowadź pusty **podkład** za ramię peelera
7. Zamknij pokrywę – ramię peelera zablokuje się automatycznie
8. Włącz drukarkę lub naciśnij FEED

> **Uwaga:** Aby wyłączyć tryb Peel-Off, otwórz pokrywę i naciśnij ramię peelera w dół aż zatrzaśnie się w pozycji wyjściowej.
`
      },
      {
        title: '5. Ładowanie i zarządzanie baterią',
        content: `
### Bateria PowerPrecision+

Drukarka ZQ620 wykorzystuje inteligentną baterię litowo-jonową 2-ogniwową (7,4V, 2,45 Ah) z technologią PowerPrecision+, która zapewnia:

- Monitorowanie stanu zdrowia baterii w czasie rzeczywistym
- Licznik cykli ładowania
- Prognozowanie czasu pracy
- Optymalne zarządzanie ładowaniem

### Stan zdrowia baterii

| Liczba cykli | Stan | Komunikat |
|--------------|------|-----------|
| < 300 | GOOD | Brak |
| 300-549 | REPLACE | "Battery Diminished Consider Replacing" |
| 550-599 | REPLACE | "Warning-Battery Is Past Useful Life" |
| >= 600 | POOR | "Replace Battery Shutting Down" |

### Opcje ładowania

| Ładowarka | Opis | Czas ładowania |
|-----------|------|----------------|
| **Zasilacz AC** | Ładowanie przez gniazdo DC | Podczas pracy |
| **Smart Charger-2 (SC2)** | Ładowarka pojedyncza | ~2 godziny |
| **Quad Charger (UCLI72-4)** | 4 baterie jednocześnie | ~2 godziny |
| **1-Slot Battery Charger** | Ładowarka pojedyncza | ~4 godziny |
| **3-Slot Battery Charger** | 3 baterie jednocześnie | ~4 godziny |
| **Stacja dokująca Ethernet** | Z jednoczesną komunikacją | Podczas pracy |

### Wskaźniki ładowania (Smart Charger-2)

| LED | Status baterii |
|-----|----------------|
| Zielony (brak baterii) | Bateria niewłożona |
| Zielony (stały) | W pełni naładowana |
| Żółty (stały) | Ładowanie w toku |
| Bursztynowy | Błąd ładowania |

### Bezpieczeństwo baterii

> **Ostrzeżenie:** 
> - Nie narażaj baterii na temperatury powyżej 65°C
> - Używaj tylko ładowarek zatwierdzonych przez Zebra
> - Nie rozbieraj, nie zgniataj ani nie przebijaj baterii
> - Nie wrzucaj baterii do ognia ani wody
> - Unikaj zwarcia styków baterii
`
      },
      {
        title: '6. Konfiguracja i ustawienia',
        content: `
### SETTINGS Menu

| Pozycja | Opis | Opcje |
|---------|------|-------|
| **DARKNESS** | Ciemność druku | 0-30 |
| **MEDIA TYPE** | Typ mediów | Gap, Black Mark, Continuous |
| **PRINT MODE** | Tryb druku | Tear Off, Peel Off |
| **LABEL LENGTH** | Długość etykiety | Automatyczna/ręczna |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFO** | Drukuje etykietę konfiguracji |
| **SENSOR CALIBRATION** | Kalibracja czujników |
| **FACTORY DEFAULTS** | Przywracanie ustawień fabrycznych |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny (DUMP) |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **WLAN IP ADDRESS** | Adres IP Wi-Fi |
| **WLAN SUBNET** | Maska podsieci |
| **WLAN GATEWAY** | Brama domyślna |
| **ESSID** | Nazwa sieci Wi-Fi |
| **DHCP** | Automatyczne przydzielanie IP |
| **SECURITY** | Tryb zabezpieczeń sieci |

### BLUETOOTH Menu

| Pozycja | Opis |
|---------|------|
| **ENABLED** | Włączenie/wyłączenie Bluetooth |
| **DISCOVERABLE** | Widoczność dla innych urządzeń |
| **FRIENDLY NAME** | Nazwa wyświetlana drukarki |
| **SECURITY MODE** | Tryb zabezpieczeń (1-4) |
| **BONDING** | Zapamiętywanie sparowanych urządzeń |
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com
2. Zainstaluj oprogramowanie PRZED podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub RS-232
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB (mały 5-pin) do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę

### Połączenie Bluetooth

1. Włącz Bluetooth w drukarce (BLUETOOTH > ENABLED > ON)
2. Ustaw DISCOVERABLE na ON
3. Na urządzeniu mobilnym wyszukaj drukarkę
4. Sparuj urządzenia (kod PIN domyślnie nie jest wymagany w trybie SSP)

### Parowanie przez NFC

1. Włącz NFC na smartfonie
2. **Zbliż telefon** do ikony Print Touch na drukarce
3. Parowanie nastąpi automatycznie
4. Opcjonalnie: uruchomi się aplikacja Zebra

### Połączenie Wi-Fi

1. Skonfiguruj ustawienia sieci przez Zebra Setup Utilities
2. Wprowadź ESSID (nazwę sieci)
3. Skonfiguruj zabezpieczenia (WPA2, itp.)
4. Drukarka połączy się automatycznie

### Stacja dokująca Ethernet

1. Podłącz stację dokującą do sieci kablem Ethernet
2. Podłącz zasilacz do stacji dokującej
3. **Umieść drukarkę** w stacji dokującej
4. Drukarka automatycznie przełączy się na Ethernet i rozpocznie ładowanie

> **Uwaga:** Drukarka ZQ620 z baterią rozszerzoną (4-ogniwową) nie jest kompatybilna ze stacjami dokującymi EC i EC4.
`
      },
      {
        title: '8. Weryfikacja działania',
        content: `
### Drukowanie etykiety konfiguracji (Two Key Report)

1. Wyłącz drukarkę
2. Załaduj materiał ciągły (bez znaczników)
3. **Przytrzymaj przycisk FEED**
4. **Naciśnij i zwolnij przycisk POWER** (trzymając FEED)
5. Zwolnij FEED gdy rozpocznie się drukowanie

Etykieta konfiguracji zawiera:
- Numer seryjny i model (ZQ620)
- Wersję firmware
- Ustawienia komunikacji
- Status sieci Wi-Fi i Bluetooth
- Adresy MAC
- Zainstalowane czcionki i kody kreskowe

### Wejście w tryb diagnostyczny (DUMP Mode)

1. Wydrukuj etykietę konfiguracji
2. Na końcu wydruku pojawi się: "Press FEED key to enter DUMP mode"
3. Naciśnij FEED w ciągu 3 sekund
4. Drukarka będzie drukować odebrane dane w formacie HEX
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Wałek dociskowy (platen) | Co 5 rolek materiału |
| Czujniki (gap, black bar) | Co 5 rolek |
| Listwa odrywająca (tear bar) | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz pokrywę i wyjmij materiał
3. **Głowica:** Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem izopropylowym (90%+)
4. **Wałek:** Przetrzyj wacikiem z alkoholem, obracając ręcznie
5. **Czujniki:** Wydmuchaj kurz, przetrzyj suchym wacikiem
6. Poczekaj aż wyschnie przed załadowaniem materiału

> **Uwaga:** Głowica w modelu ZQ620 jest szersza niż w ZQ610 (72 mm vs 48 mm). Upewnij się, że cała powierzchnia elementów grzejnych została wyczyszczona.

### Czyszczenie drukarek Healthcare (ZQ620-HC)

Drukarki w wersji Healthcare zostały zaprojektowane do regularnej dezynfekcji. Używaj zatwierdzonych środków czyszczących stosowanych w placówkach medycznych.

### Materiały do czyszczenia

- Pisak czyszczący Zebra
- Waciki bezpyłowe
- Alkohol izopropylowy (90%+)
- Ściereczka bezpyłowa
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Komunikaty alertów

| Alert | Kolor | Znaczenie | Rozwiązanie |
|-------|-------|-----------|-------------|
| Media Out | Czerwony (miga) | Brak materiału | Załaduj materiał |
| Media Cover Open | Czerwony (miga) | Pokrywa otwarta | Zamknij pokrywę |
| Battery Low | – | Niski poziom baterii | Naładuj/wymień baterię |
| Battery Diminished | Żółty | Bateria zużyta | Rozważ wymianę |
| Error | Czerwony (miga) | Błąd ogólny | Sprawdź wyświetlacz |

### Problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Brak zasilania | Sprawdź instalację baterii, naładuj baterię |
| Materiał nie wysuwa się | Sprawdź czy pokrywa jest zamknięta, sprawdź rolkę |
| Słaby/wyblakły druk | Wyczyść głowicę, zwiększ ciemność, sprawdź materiał |
| Brakujący druk | Sprawdź wyrównanie materiału, wyczyść głowicę |
| Zniekształcony druk | Sprawdź baud rate, kabel komunikacyjny |
| Brak druku | Sprawdź komunikację, wymień baterię |
| Pomijanie etykiet | Skalibruj czujniki, sprawdź znaczniki/przerwy |
| Zacięcie materiału | Otwórz pokrywę, usuń zacięty materiał |
| Pusty ekran LCD | Włącz drukarkę, przeładuj firmware |
| Brak NFC | Zbliż telefon do 7,5 cm od ikony Print Touch |
| Drukarka nie ładuje w stacji | Sprawdź czy nie ma baterii rozszerzonej |

### Przywracanie ustawień fabrycznych

**Z menu:**
TOOLS > FACTORY DEFAULTS

**Kombinacja klawiszy:**
Przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki
`
      },
      {
        title: '11. Akcesoria i opcje',
        content: `
### Opcje noszenia

| Akcesorium | Nr części |
|------------|-----------|
| Klips do paska (standard) | W zestawie |
| Pasek na ramię | P1031365-192 |
| Pasek na rękę | P1031365-027 |
| Miękka obudowa (soft case) | P1031365-029 |

### Ładowarki i stacje dokujące

| Akcesorium | Nr części |
|------------|-----------|
| Zasilacz AC | P1031365-024 |
| Zasilacz AC Healthcare | P1065668-008 |
| Smart Charger-2 (SC2) | P1031365-063 |
| Quad Charger UCLI72-4 | AC18177-5 |
| 1-Slot Battery Charger | SAC-MPP-1BCHGUS1-01SA |
| 3-Slot Battery Charger | SAC-MPP-3BCHGUS1-01 |
| Single Ethernet Cradle | Dostępna |
| 4-Bay Ethernet Cradle | Dostępna |
`
      },
      {
        title: '12. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 117,9 mm (4,65") |
| Długość | 173,7 mm (6,85") |
| Wysokość | 76,9 mm (3,15") |
| Waga z baterią | 0,75 kg (1,6 lbs) |

### Specyfikacje druku

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do 72 mm (2,91") |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (127 mm/s Draft) |
| Odległość linii druku do krawędzi | 5,08 mm |
| Żywotność głowicy | 600 000 cali |

### Specyfikacje materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Min. szerokość materiału | 25,4 mm (1") |
| Długość etykiety | 12,7-812,8 mm |
| Maks. średnica rolki | 66,8 mm (2,6") |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria | Li-Ion 7,4V, 2,45 Ah |
| Bateria rozszerzona | 4-ogniwowa (opcja) |
| Zasilacz AC | 100-240 VAC, 50-60 Hz |

### Certyfikaty i ochrona

| Parametr | Wartość |
|----------|---------|
| Stopień ochrony IP | IP43 (IP54 z obudową) |
| Certyfikaty | FCC, CE, IC, MFi |

### Obsługiwane kody kreskowe

**Kody liniowe:**
- Code 39, Code 93, Code 128
- Codabar, Interleaved 2 of 5
- UPC-A, UPC-E, EAN-8, EAN-13
- MSI, Plessey, POSTNET

**Kody 2D:**
- QR Code, Data Matrix
- PDF417, Micro PDF417
- Aztec, MaxiCode
- GS1 DataBar (RSS)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Jaka jest szerokość druku drukarki ZQ620?

**Odpowiedź:** Zebra ZQ620 drukuje etykiety o szerokości **do 72 mm (2,91 cala / 3 cale)**. To o 50% więcej niż model ZQ610 (48 mm).

### Czym różni się ZQ620 od ZQ610?

**Odpowiedź:** Główna różnica to **szerokość druku**: ZQ620 drukuje do 72 mm (3"), ZQ610 do 48 mm (2"). ZQ620 jest też większa (117,9 x 173,7 x 76,9 mm) i cięższa (0,75 kg vs 0,61 kg).

### Ile waży drukarka ZQ620?

**Odpowiedź:** Zebra ZQ620 waży **0,75 kg** z zainstalowaną baterią standardową.

### Czy ZQ620 jest odporna na kurz i wodę?

**Odpowiedź:** ZQ620 ma certyfikat **IP43** standardowo. Z opcjonalną obudową ochronną klasa wzrasta do **IP54**.

### Jak długo wytrzymuje bateria w ZQ620?

**Odpowiedź:** Bateria PowerPrecision+ (2,45 Ah) jest zoptymalizowana do całodziennej pracy. Dostępna jest też **bateria rozszerzona 4-ogniwowa** dla większej pojemności.

### Jak załadować materiał do ZQ620?

**Odpowiedź:** Naciśnij przycisk zwalniający z boku, odchyl pokrywę, rozsuń dyski podtrzymujące, włóż rolkę (strona do druku na zewnątrz), przeprowadź materiał pod wałkiem, zamknij pokrywę i naciśnij FEED.

### Czy mogę używać ZQ620 ze stacją dokującą Ethernet?

**Odpowiedź:** Tak, ale **bateria rozszerzona (4-ogniwowa) nie jest kompatybilna** ze stacjami dokującymi EC i EC4. Standardowa bateria działa bez problemu.

### Jak wyczyścić głowicę drukującą ZQ620?

**Odpowiedź:** Wyłącz drukarkę, poczekaj na ostygnięcie. Przetrzyj **brązowy pasek elementów grzejnych** wacikiem nasączonym alkoholem izopropylowym (90%+). Głowica ZQ620 jest szersza (72 mm) niż ZQ610.

### Jakie materiały obsługuje ZQ620?

**Odpowiedź:** ZQ620 obsługuje: etykiety z przerwą (gap), z czarnym znacznikiem (black mark), materiał ciągły (continuous) i bezpodkładowy (linerless) o szerokości **25,4-79,4 mm**.

### Jak przywrócić ustawienia fabryczne ZQ620?

**Odpowiedź:** Z menu: **TOOLS > FACTORY DEFAULTS**. Lub przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki.

### Czy ZQ620 ma certyfikat MFi dla iPhone?

**Odpowiedź:** Tak, ZQ620 ma certyfikat **Made for iPhone (MFi)**, co zapewnia pełną kompatybilność z urządzeniami iOS.

### Jak sparować ZQ620 przez NFC?

**Odpowiedź:** Włącz NFC na smartfonie i **zbliż telefon** do ikony Print Touch na drukarce (max 7,5 cm). Parowanie nastąpi automatycznie.

### Do czego najlepiej nadaje się ZQ620?

**Odpowiedź:** ZQ620 jest idealna do drukowania **dużych etykiet wysyłkowych**, dokumentów przewozowych, listów przewozowych, etykiet na półki i protokołów serwisowych dzięki szerokości druku 3 cale.
`
      }
    ]
  },

  'zq610plus': {
    model: 'ZQ610 Plus',
    title: 'Zebra ZQ610 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZQ600 Plus Series User Guide',
    keywords: [
      'zebra zq610 plus instrukcja', 'zq610 plus instrukcja po polsku', 'zebra zq610 plus manual',
      'drukarka zebra zq610 plus', 'zq610 plus kalibracja', 'zq610 plus reset', 'zq610 plus bateria',
      'zq610 plus ładowanie etykiet', 'zq610 plus sterowniki', 'zq610 plus specyfikacja',
      'zq610 plus błędy', 'zq610 plus czyszczenie', 'zq610 plus bluetooth 5.3', 'zq610 plus wifi 6',
      'zq610 plus nfc', 'zq610 plus peel off', 'zq610 plus ip54', 'zq610 plus healthcare',
      'zq610 plus powerprecision+', 'zq610 plus 2 cale', 'mobilna drukarka etykiet',
      'zq610 plus vs zq610', 'zq600 plus series', 'wifi 6 drukarka'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZQ610 Plus

Zebra ZQ610 Plus to zaawansowana mobilna drukarka etykiet o **szerokości druku 2 cale (48 mm)**, będąca następcą popularnego modelu ZQ610. Zaprojektowana do pracy w terenie i wymagających środowiskach przemysłowych, oferuje ulepszoną łączność z Wi-Fi 6 (802.11ax) i Bluetooth 5.3, podwyższoną odporność IP54, kolorowy wyświetlacz LCD oraz technologię NFC. Jest to najbardziej kompaktowy model z serii ZQ600 Plus, idealny do drukowania małych etykiet, paragonów i potwierdzeń.

### Parametry techniczne

| Parametr | ZQ610 Plus |
|----------|------------|
| **Szerokość druku** | **do 48 mm (1,89")** |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (4"/s) standardowo |
| | 127 mm/s (5"/s) w trybie Draft |
| Maks. średnica rolki | 55,8 mm (2,2") |
| Średnica gilzy | 19 mm lub 35 mm |
| Maks. szerokość materiału | 55,37 mm (2,18") |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |

### Porównanie ZQ610 Plus vs ZQ610

| Parametr | ZQ610 Plus | ZQ610 |
|----------|------------|-------|
| Wi-Fi | **Wi-Fi 6 (802.11ax)** | Wi-Fi 5 (802.11ac) |
| Bluetooth | **Bluetooth 5.3** | Bluetooth 4.1 |
| Stopień ochrony IP | **IP54** | IP43/IP54 |
| Procesor | **Ulepszona wydajność** | Standardowy |
| Adaptive Print | **PSPT PrintSmart Gen 2** | PSPT Gen 1 |
| Made for iPhone | Tak | Tak |

### Porównanie serii ZQ600 Plus

| Parametr | ZQ610 Plus | ZQ620 Plus | ZQ630 Plus |
|----------|------------|------------|------------|
| Szerokość druku | **48 mm (2")** | 72 mm (3") | 104 mm (4") |
| Maks. szerokość materiału | 55,37 mm | 79,4 mm | 111 mm |
| Waga z baterią | **0,6 kg** | 0,73 kg | 1,113 kg |
| Opcja RFID | Nie | Nie | **Tak** |

### Zastosowania ZQ610 Plus

- **Handel detaliczny:** etykiety cenowe, oznaczenia produktów
- **Logistyka:** małe etykiety identyfikacyjne, potwierdzenia
- **Służba zdrowia:** opaski pacjentów, etykiety próbek
- **Transport:** paragony, potwierdzenia dostaw
- **Magazynowanie:** etykiety lokalizacji, oznaczenia półek
- **Usługi terenowe:** kwity serwisowe, rachunki

### Złącza i łączność

- USB 2.0 Full Speed (standard)
- RS-232 Serial 14-pin (standard)
- Wi-Fi 6 dual radio (802.11ax + Bluetooth 5.3)
- Wi-Fi 5 dual radio (802.11ac + Bluetooth 4.2) - opcja
- Ethernet 10/100 (przez stację dokującą)
- NFC (Near Field Communication)

### Cechy charakterystyczne

- **Wi-Fi 6 i Bluetooth 5.3** – najnowsze standardy łączności
- **Certyfikat IP54** – zwiększona odporność na kurz i wodę
- **Bateria PowerPrecision+** – inteligentne zarządzanie energią
- **Kolorowy wyświetlacz LCD** – intuicyjny interfejs 288x240 pikseli
- **NFC Print Touch** – szybkie parowanie przez zbliżenie
- **Made for iPhone (MFi)** – certyfikowana zgodność z iOS 10+
- **PSPT PrintSmart Gen 2** – adaptacyjna jakość druku
- Obsługa języków CPCL, ZPL i EPL
- Tryb Peel-Off (automatyczne odklejanie)
- Wersja Healthcare w kolorze białym (ZQ610 Plus-HC)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ610 Plus
- Bateria litowo-jonowa PowerPrecision+ (2-ogniwowa)
- Klips do paska
- Karta rejestracyjna
- Skrócona instrukcja obsługi
- Przewodnik bezpieczeństwa

### Instalacja baterii

1. **Usuń taśmę izolacyjną** z nowej baterii (pociągnij za zakładkę)
2. **Obróć klips do paska** (jeśli zamontowany) aby uzyskać dostęp do komory baterii
3. **Włóż baterię** do komory pod kątem zgodnie z oznaczeniami
4. **Obróć baterię** aż zatrzaśnie się na miejscu

> **Uwaga:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię w ładowarce lub podłącz drukarkę do zasilacza AC.

### Wyjmowanie baterii

1. Naciśnij zatrzask na baterii
2. Odchyl baterię od komory
3. Wyjmij baterię z drukarki

> **Ważne:** Zawsze wyłącz drukarkę przed wyjęciem baterii aby uniknąć uszkodzenia danych.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -20°C do +50°C | 10-90% bez kondensacji |
| Praca (Healthcare) | 0°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | – |
| Przechowywanie | -25°C do +65°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Kolorowy wyświetlacz LCD (288x240 pikseli) pokazuje status drukarki, ikony stanu i menu konfiguracyjne. Automatycznie przyciemnia się po okresie bezczynności (domyślnie 20 min).

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włącza/wyłącza drukarkę (przytrzymaj 3 sek. aby wyłączyć) |
| **FEED** | Wysuwa materiał / budzenie z trybu uśpienia |
| **Strzałki nawigacyjne** | Nawigacja po menu LCD (GÓRA, DÓŁ, LEWO, PRAWO) |
| **OK** | Potwierdza wybór w menu |
| **LEFT/RIGHT SELECT** | Wykonują akcje pokazane na pasku nawigacji |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor | Zachowanie | Znaczenie |
|-------|------------|-----------|
| Zielony | Stały | Bateria naładowana, drukarka włączona |
| Zielony | Pulsujący | Tryb uśpienia, bateria naładowana |
| Bursztynowy | Stały | Ładowanie w toku |
| Bursztynowy | Pulsujący | Ładowanie w trybie uśpienia |
| Czerwony | Stały | Niezdrowa bateria – wymień |
| Czerwony | Migający | Błąd ładowania |

### Menu główne (Home Menu)

Z ekranu głównego naciśnij LEFT SELECT aby wejść do menu z ikonami:

| Menu | Zawartość |
|------|-----------|
| **Settings** | Ciemność druku, typ mediów, tryb druku, szerokość |
| **Tools** | Informacje, diagnostyka, reset fabryczny |
| **Network** | Ustawienia Wi-Fi, IP, DHCP, Ethernet |
| **Language** | Język wyświetlacza, język poleceń |
| **Sensors** | Status czujników, kalibracja |
| **Communications** | Ustawienia portów szeregowych |
| **Bluetooth** | Ustawienia Bluetooth, parowanie |
| **Battery** | Status baterii, zdrowie, cykle |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZQ610 Plus

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 55,37 mm (2,18") |
| Min. szerokość materiału | 25,4 mm (1") |
| Maks. długość etykiety | 812,8 mm (32") |
| Min. długość etykiety | 12,7 mm (0,5") |
| Maks. średnica rolki | 55,8 mm (2,2") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość materiału | 0,058-0,165 mm |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – paragony, kwity
- **Materiał bezpodkładowy (linerless)** – wymaga specjalnego wałka

### Ładowanie materiału (tryb Tear-Off)

1. **Naciśnij przycisk zwalniający** z boku drukarki
2. **Odchyl pokrywę mediów** do tyłu, odsłaniając komorę
3. **Rozsuń dyski podtrzymujące** – odsuń je od siebie
4. **Włóż rolkę materiału** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. Naciśnij **FEED** aby wysunąć i wyrównać materiał

### Ładowanie w trybie Peel-Off

1. **Odklej kilka etykiet** od podkładu
2. Otwórz pokrywę mediów
3. Załaduj rolkę materiału standardowo
4. **Pociągnij dźwignię peelera** do góry
5. Przeprowadź pusty **podkład** za ramię peelera
6. Zamknij pokrywę – ramię peelera zablokuje się automatycznie
7. Włącz drukarkę lub naciśnij FEED
`
      },
      {
        title: '5. Ładowanie i zarządzanie baterią',
        content: `
### Bateria PowerPrecision+

Drukarka ZQ610 Plus wykorzystuje inteligentną baterię litowo-jonową 2-ogniwową (7,4V, 3250 mAh) z technologią PowerPrecision+, która zapewnia:

- Monitorowanie stanu zdrowia baterii w czasie rzeczywistym
- Licznik cykli ładowania
- Prognozowanie czasu pracy
- Optymalne zarządzanie ładowaniem

Opcjonalnie dostępna jest bateria rozszerzona 4-ogniwowa dla dłuższego czasu pracy.

### Stan zdrowia baterii

| Liczba cykli | Stan | Komunikat |
|--------------|------|-----------|
| < 300 | GOOD | Brak |
| 300-549 | REPLACE | "Battery Diminished Consider Replacing" |
| 550-599 | REPLACE | "Warning-Battery Is Past Useful Life" |
| >= 600 | POOR | "Replace Battery Shutting Down" |

### Opcje ładowania

| Ładowarka | Opis | Czas ładowania |
|-----------|------|----------------|
| **Zasilacz AC** | Ładowanie przez gniazdo DC | Podczas pracy |
| **Smart Charger-2 (SC2)** | Ładowarka pojedyncza | ~2 godziny |
| **Quad Charger (UCLI72-4)** | 4 baterie jednocześnie | ~2 godziny |
| **1-Slot Battery Charger** | Ładowarka pojedyncza | ~4 godziny |
| **3-Slot Battery Charger** | 3 baterie jednocześnie | ~4 godziny |
| **Stacja dokująca Ethernet** | Z jednoczesną komunikacją | Podczas pracy |

### Wskazówki dotyczące żywotności baterii

- Nie wystawiaj baterii na temperaturę powyżej 40°C podczas ładowania
- Używaj tylko ładowarek Zebra przeznaczonych do baterii Li-Ion
- Używaj odpowiednich materiałów eksploatacyjnych Zebra
- Wybierz optymalną ciemność i prędkość druku
- Wyjmuj baterię jeśli drukarka nie jest używana przez dłuższy czas
`
      },
      {
        title: '6. Łączność bezprzewodowa',
        content: `
### Wi-Fi 6 (802.11ax)

ZQ610 Plus oferuje opcję Wi-Fi 6 dual radio z najnowszą technologią bezprzewodową:

- **802.11ax** – szybsza transmisja i lepsza wydajność w zatłoczonych sieciach
- **Bluetooth 5.3** – zwiększony zasięg i prędkość parowania
- Wsteczna kompatybilność z 802.11 a/b/g/n/ac

### Bluetooth 5.3

ZQ610 Plus obsługuje Bluetooth 5.3 Classic + BLE z trybami bezpieczeństwa:

- **Secure Simple Pairing (SSP)** – automatyczne parowanie bez PIN
- **Numeric Comparison** – weryfikacja 6-cyfrowym kodem
- **Just Works** – najprostszy tryb dla urządzeń bez wyświetlacza
- Bonding – zapamiętywanie sparowanych urządzeń

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. **Zbliż telefon** do ikony Print Touch na boku drukarki (max 7,5 cm)
3. Parowanie nastąpi automatycznie
4. Opcjonalnie: uruchomi się aplikacja Zebra

### Połączenie Wi-Fi

1. Skonfiguruj ustawienia sieci przez Zebra Setup Utilities
2. Wprowadź ESSID (nazwę sieci)
3. Skonfiguruj zabezpieczenia (WPA2, WPA3)
4. Drukarka połączy się automatycznie
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com/drivers
2. Zainstaluj oprogramowanie PRZED podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub RS-232
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB (mały 5-pin) do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę

### Stacja dokująca Ethernet

1. Podłącz stację dokującą do sieci kablem Ethernet
2. Podłącz zasilacz do stacji dokującej
3. **Umieść drukarkę** w stacji dokującej
4. Drukarka automatycznie przełączy się na Ethernet i rozpocznie ładowanie

> **Uwaga:** Drukarka z baterią rozszerzoną 4-ogniwową może nie być kompatybilna ze wszystkimi stacjami dokującymi.
`
      },
      {
        title: '8. Weryfikacja działania',
        content: `
### Drukowanie etykiety konfiguracji (Two Key Report)

1. Wyłącz drukarkę
2. Załaduj materiał ciągły (bez znaczników)
3. **Przytrzymaj przycisk FEED**
4. **Naciśnij i zwolnij przycisk POWER** (trzymając FEED)
5. Zwolnij FEED gdy rozpocznie się drukowanie

Etykieta konfiguracji zawiera:
- Numer seryjny i model (ZQ610 Plus)
- Wersję firmware
- Ustawienia komunikacji
- Status sieci Wi-Fi i Bluetooth
- Adresy MAC
- Zainstalowane czcionki i kody kreskowe

### Wejście w tryb diagnostyczny (DUMP Mode)

1. Wydrukuj etykietę konfiguracji
2. Na końcu wydruku pojawi się: "Press FEED key to enter DUMP mode"
3. Naciśnij FEED w ciągu 3 sekund
4. Drukarka będzie drukować odebrane dane w formacie HEX
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Wałek dociskowy (platen) | Co 5 rolek materiału |
| Czujniki (gap, black bar) | Co 5 rolek |
| Listwa odrywająca (tear bar) | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz pokrywę i wyjmij materiał
3. **Głowica:** Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem izopropylowym (90%+)
4. **Wałek:** Przetrzyj wacikiem z alkoholem, obracając ręcznie
5. **Czujniki:** Wydmuchaj kurz, przetrzyj suchym wacikiem
6. Poczekaj aż wyschnie przed załadowaniem materiału

### Czyszczenie drukarek Healthcare (ZQ610 Plus-HC)

Drukarki w wersji Healthcare zostały zaprojektowane do regularnej dezynfekcji. Używaj zatwierdzonych środków czyszczących stosowanych w placówkach medycznych.

### Materiały do czyszczenia

- Pisak czyszczący Zebra
- Waciki bezpyłowe
- Alkohol izopropylowy (90%+)
- Ściereczka bezpyłowa
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Komunikaty alertów

| Alert | Kolor | Znaczenie | Rozwiązanie |
|-------|-------|-----------|-------------|
| Media Out | Czerwony (miga) | Brak materiału | Załaduj materiał |
| Media Cover Open | Czerwony (miga) | Pokrywa otwarta | Zamknij pokrywę |
| Battery Low | Żółty | Niski poziom baterii | Naładuj/wymień baterię |
| Battery Diminished | Żółty | Bateria zużyta | Rozważ wymianę |
| Head Over Temp | Żółty | Przegrzanie głowicy | Poczekaj na ochłodzenie |
| Error | Czerwony (miga) | Błąd ogólny | Sprawdź wyświetlacz |

### Problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Brak zasilania | Sprawdź instalację baterii, naładuj baterię |
| Materiał nie wysuwa się | Sprawdź czy pokrywa jest zamknięta, sprawdź rolkę |
| Słaby/wyblakły druk | Wyczyść głowicę, zwiększ ciemność, sprawdź materiał |
| Brakujący druk | Sprawdź wyrównanie materiału, wyczyść głowicę |
| Zniekształcony druk | Sprawdź baud rate, kabel komunikacyjny |
| Brak druku | Sprawdź komunikację, wymień baterię |
| Pomijanie etykiet | Skalibruj czujniki, sprawdź znaczniki/przerwy |
| Zacięcie materiału | Otwórz pokrywę, usuń zacięty materiał |
| Pusty ekran LCD | Włącz drukarkę, przeładuj firmware |
| Brak NFC | Zbliż telefon do 7,5 cm od ikony Print Touch |

### Przywracanie ustawień fabrycznych

**Z menu:**
TOOLS > LOAD DEFAULTS > FACTORY

**Kombinacja klawiszy:**
Przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki
`
      },
      {
        title: '11. Akcesoria i opcje',
        content: `
### Opcje noszenia

| Akcesorium | Opis |
|------------|------|
| Klips do paska | W zestawie – obrotowy |
| Pasek na ramię | Regulowany, mocowany do uchwytów |
| Pasek na rękę | Wygodne noszenie jedną ręką |
| Miękka obudowa (soft case) | Ochrona z oknem na LCD |

### Ładowarki i stacje dokujące

| Akcesorium | Nr części |
|------------|-----------|
| Zasilacz AC (US) | P1031365-024 |
| Zasilacz AC Healthcare | P1065668-008 |
| Smart Charger-2 (SC2) | P1031365-063 |
| Quad Charger UCLI72-4 | AC18177-5 |
| 1-Slot Battery Charger | SAC-MPP-1BCHGUS1-01 |
| 3-Slot Battery Charger | SAC-MPP-3BCHGUS1-01 |
| Single Ethernet Cradle | P1031365-038 |
| 4-Bay Ethernet Cradle | P1031365-045 |
| Bateria zapasowa 2-cell | P1031365-059 |
| Bateria rozszerzona 4-cell | P1031365-069 |
`
      },
      {
        title: '12. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 91,4 mm (3,6") |
| Długość | 170,9 mm (6,73") |
| Wysokość | 72,4 mm (2,85") |
| Waga z baterią | 0,6 kg (1,33 lbs) |

### Specyfikacje druku

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do 48 mm (1,89") |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (127 mm/s Draft) |

### Specyfikacje materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 55,37 mm (2,18") |
| Min. szerokość materiału | 25,4 mm (1") |
| Długość etykiety | 12,7-812,8 mm |
| Maks. średnica rolki | 55,8 mm (2,2") |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria standardowa | Li-Ion 7,4V, 3250 mAh (2-cell) |
| Bateria rozszerzona | Li-Ion 7,4V (4-cell) - opcja |
| Zasilacz AC | 100-240 VAC, 50-60 Hz |

### Łączność

| Parametr | Wartość |
|----------|---------|
| USB | 2.0 Full Speed |
| Serial | RS-232C (14-pin), 9600-115200 bps |
| Wi-Fi (opcja) | 802.11ax (Wi-Fi 6) lub 802.11ac (Wi-Fi 5) |
| Bluetooth (opcja) | 5.3 lub 4.2 Classic + BLE |
| NFC | Print Touch |
| Ethernet | 10/100 Mb/s (przez stację dokującą) |

### Certyfikaty i ochrona

| Parametr | Wartość |
|----------|---------|
| Stopień ochrony IP | IP54 |
| Certyfikaty | FCC, CE, IC, MFi |

### Obsługiwane kody kreskowe

**Kody liniowe:**
- Code 39, Code 93, Code 128
- Codabar, Interleaved 2 of 5
- UPC-A, UPC-E, EAN-8, EAN-13
- MSI, Plessey, POSTNET

**Kody 2D:**
- QR Code, Data Matrix
- PDF417, Micro PDF417
- Aztec, MaxiCode
- GS1 DataBar (RSS)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym różni się ZQ610 Plus od ZQ610?

**Odpowiedź:** ZQ610 Plus to ulepszona wersja z **Wi-Fi 6 (802.11ax)** zamiast Wi-Fi 5, **Bluetooth 5.3** zamiast 4.1, wyższą odpornością **IP54** (vs IP43), i **PSPT PrintSmart Gen 2** dla lepszej jakości druku. Wymiary pozostają identyczne.

### Jaka jest szerokość druku drukarki ZQ610 Plus?

**Odpowiedź:** Zebra ZQ610 Plus drukuje etykiety o szerokości **do 48 mm (1,89 cala / 2 cale)**. To najmniejszy model z serii ZQ600 Plus.

### Czy ZQ610 Plus obsługuje Wi-Fi 6?

**Odpowiedź:** Tak, ZQ610 Plus oferuje opcję **Wi-Fi 6 (802.11ax)** dual radio z Bluetooth 5.3. Jest to najnowszy standard zapewniający szybszą transmisję i lepszą wydajność w zatłoczonych sieciach.

### Jaki jest stopień ochrony IP drukarki ZQ610 Plus?

**Odpowiedź:** ZQ610 Plus ma certyfikat **IP54** standardowo – to wyższy poziom ochrony niż poprzednik ZQ610 (IP43). IP54 oznacza ochronę przed kurzem i bryzgami wody z każdego kierunku.

### Ile waży drukarka ZQ610 Plus?

**Odpowiedź:** Zebra ZQ610 Plus waży **0,6 kg** z zainstalowaną baterią standardową – jest to najlżejszy model z serii ZQ600 Plus.

### Jak długo wytrzymuje bateria w ZQ610 Plus?

**Odpowiedź:** Bateria PowerPrecision+ (3250 mAh) jest zoptymalizowana do całodziennej pracy. Dostępna jest też **bateria rozszerzona 4-ogniwowa** dla większej pojemności.

### Jak załadować materiał do ZQ610 Plus?

**Odpowiedź:** Naciśnij przycisk zwalniający z boku, odchyl pokrywę, rozsuń dyski podtrzymujące, włóż rolkę (strona do druku na zewnątrz), przeprowadź materiał pod wałkiem, zamknij pokrywę i naciśnij FEED.

### Jak sparować ZQ610 Plus przez NFC?

**Odpowiedź:** Włącz NFC na smartfonie i **zbliż telefon** do ikony Print Touch na drukarce (max 7,5 cm). Parowanie z Bluetooth 5.3 nastąpi automatycznie.

### Czy ZQ610 Plus ma certyfikat MFi dla iPhone?

**Odpowiedź:** Tak, ZQ610 Plus ma certyfikat **Made for iPhone (MFi)**, co zapewnia pełną kompatybilność z urządzeniami iOS 10 i nowszymi.

### Jak wyczyścić głowicę drukującą ZQ610 Plus?

**Odpowiedź:** Wyłącz drukarkę, poczekaj na ostygnięcie. Przetrzyj **brązowy pasek elementów grzejnych** wacikiem nasączonym alkoholem izopropylowym (90%+).

### Jakie materiały obsługuje ZQ610 Plus?

**Odpowiedź:** ZQ610 Plus obsługuje: etykiety z przerwą (gap), z czarnym znacznikiem (black mark), materiał ciągły (continuous) i bezpodkładowy (linerless) o szerokości **25,4-55,37 mm**.

### Jak przywrócić ustawienia fabryczne ZQ610 Plus?

**Odpowiedź:** Z menu: **TOOLS > LOAD DEFAULTS > FACTORY**. Lub przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki.

### Czy dostępna jest wersja Healthcare drukarki ZQ610 Plus?

**Odpowiedź:** Tak, dostępna jest wersja **ZQ610 Plus-HC** w kolorze białym, zaprojektowana do regularnej dezynfekcji w placówkach medycznych.
`
      }
    ]
  },

  'zq620plus': {
    model: 'ZQ620 Plus',
    title: 'Zebra ZQ620 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZQ600 Plus Series User Guide',
    keywords: [
      'zebra zq620 plus instrukcja', 'zq620 plus instrukcja po polsku', 'zebra zq620 plus manual',
      'drukarka zebra zq620 plus', 'zq620 plus kalibracja', 'zq620 plus reset', 'zq620 plus bateria',
      'zq620 plus ładowanie etykiet', 'zq620 plus sterowniki', 'zq620 plus specyfikacja',
      'zq620 plus błędy', 'zq620 plus czyszczenie', 'zq620 plus bluetooth 5.3', 'zq620 plus wifi 6',
      'zq620 plus nfc', 'zq620 plus peel off', 'zq620 plus ip54', 'zq620 plus healthcare',
      'zq620 plus powerprecision+', 'zq620 plus 3 cale', 'mobilna drukarka etykiet',
      'zq620 plus vs zq620', 'zq600 plus series', 'wifi 6 drukarka'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZQ620 Plus

Zebra ZQ620 Plus to zaawansowana mobilna drukarka etykiet o **szerokości druku 3 cale (72 mm)**, będąca następcą popularnego modelu ZQ620. Zaprojektowana do pracy w terenie i wymagających środowiskach przemysłowych, oferuje ulepszoną łączność z Wi-Fi 6 (802.11ax) i Bluetooth 5.3, podwyższoną odporność IP54, kolorowy wyświetlacz LCD oraz technologię NFC. Jest to średni model z serii ZQ600 Plus, idealny do drukowania etykiet wysyłkowych, dokumentów przewozowych i większych paragonów.

### Parametry techniczne

| Parametr | ZQ620 Plus |
|----------|------------|
| **Szerokość druku** | **do 72 mm (2,91")** |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (4"/s) standardowo |
| | 127 mm/s (5"/s) w trybie Draft |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |

### Porównanie ZQ620 Plus vs ZQ620

| Parametr | ZQ620 Plus | ZQ620 |
|----------|------------|-------|
| Wi-Fi | **Wi-Fi 6 (802.11ax)** | Wi-Fi 5 (802.11ac) |
| Bluetooth | **Bluetooth 5.3** | Bluetooth 4.1 |
| Stopień ochrony IP | **IP54** | IP43/IP54 |
| Procesor | **Ulepszona wydajność** | Standardowy |
| Adaptive Print | **PSPT PrintSmart Gen 2** | PSPT Gen 1 |
| Made for iPhone | Tak | Tak |

### Porównanie serii ZQ600 Plus

| Parametr | ZQ610 Plus | ZQ620 Plus | ZQ630 Plus |
|----------|------------|------------|------------|
| Szerokość druku | 48 mm (2") | **72 mm (3")** | 104 mm (4") |
| Maks. szerokość materiału | 55,37 mm | **79,4 mm** | 111 mm |
| Waga z baterią | 0,6 kg | **0,73 kg** | 1,113 kg |
| Opcja RFID | Nie | Nie | **Tak** |

### Zastosowania ZQ620 Plus

- **Logistyka i wysyłka:** duże etykiety wysyłkowe, dokumenty przewozowe
- **Magazynowanie:** etykiety na półki, oznaczenia lokalizacji
- **Handel detaliczny:** etykiety cenowe, oznaczenia promocyjne
- **Służba zdrowia:** etykiety laboratoryjne, opaski identyfikacyjne
- **Transport:** listy przewozowe, potwierdzenia dostawy
- **Usługi terenowe:** protokoły serwisowe, faktury

### Złącza i łączność

- USB 2.0 Full Speed (standard)
- RS-232 Serial 14-pin (standard)
- Wi-Fi 6 dual radio (802.11ax + Bluetooth 5.3)
- Wi-Fi 5 dual radio (802.11ac + Bluetooth 4.2) - opcja
- Ethernet 10/100 (przez stację dokującą)
- NFC (Near Field Communication)

### Cechy charakterystyczne

- **Wi-Fi 6 i Bluetooth 5.3** – najnowsze standardy łączności
- **Certyfikat IP54** – zwiększona odporność na kurz i wodę
- **Bateria PowerPrecision+** – inteligentne zarządzanie energią
- **Kolorowy wyświetlacz LCD** – intuicyjny interfejs 288x240 pikseli
- **NFC Print Touch** – szybkie parowanie przez zbliżenie
- **Made for iPhone (MFi)** – certyfikowana zgodność z iOS 10+
- **PSPT PrintSmart Gen 2** – adaptacyjna jakość druku
- **Szerokość druku 3" (72 mm)** – idealna do większych etykiet
- Obsługa języków CPCL, ZPL i EPL
- Tryb Peel-Off (automatyczne odklejanie)
- Wersja Healthcare w kolorze białym (ZQ620 Plus-HC)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ620 Plus
- Bateria litowo-jonowa PowerPrecision+ (2-ogniwowa)
- Klips do paska
- Karta rejestracyjna
- Skrócona instrukcja obsługi
- Przewodnik bezpieczeństwa

### Instalacja baterii

1. **Usuń taśmę izolacyjną** z nowej baterii (pociągnij za zakładkę)
2. **Obróć klips do paska** (jeśli zamontowany) aby uzyskać dostęp do komory baterii
3. **Włóż baterię** do komory pod kątem zgodnie z oznaczeniami
4. **Obróć baterię** aż zatrzaśnie się na miejscu

> **Uwaga:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię w ładowarce lub podłącz drukarkę do zasilacza AC.

### Wyjmowanie baterii

1. Naciśnij zatrzask na baterii
2. Odchyl baterię od komory
3. Wyjmij baterię z drukarki

> **Ważne:** Zawsze wyłącz drukarkę przed wyjęciem baterii aby uniknąć uszkodzenia danych.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -20°C do +50°C | 10-90% bez kondensacji |
| Praca (Healthcare) | 0°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | – |
| Przechowywanie | -25°C do +65°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Kolorowy wyświetlacz LCD (288x240 pikseli) pokazuje status drukarki, ikony stanu i menu konfiguracyjne. Automatycznie przyciemnia się po okresie bezczynności (domyślnie 20 min).

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włącza/wyłącza drukarkę (przytrzymaj 3 sek. aby wyłączyć) |
| **FEED** | Wysuwa materiał / budzenie z trybu uśpienia |
| **Strzałki nawigacyjne** | Nawigacja po menu LCD (GÓRA, DÓŁ, LEWO, PRAWO) |
| **OK** | Potwierdza wybór w menu |
| **LEFT/RIGHT SELECT** | Wykonują akcje pokazane na pasku nawigacji |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor | Zachowanie | Znaczenie |
|-------|------------|-----------|
| Zielony | Stały | Bateria naładowana, drukarka włączona |
| Zielony | Pulsujący | Tryb uśpienia, bateria naładowana |
| Bursztynowy | Stały | Ładowanie w toku |
| Bursztynowy | Pulsujący | Ładowanie w trybie uśpienia |
| Czerwony | Stały | Niezdrowa bateria – wymień |
| Czerwony | Migający | Błąd ładowania |

### Menu główne (Home Menu)

Z ekranu głównego naciśnij LEFT SELECT aby wejść do menu z ikonami:

| Menu | Zawartość |
|------|-----------|
| **Settings** | Ciemność druku, typ mediów, tryb druku, szerokość |
| **Tools** | Informacje, diagnostyka, reset fabryczny |
| **Network** | Ustawienia Wi-Fi, IP, DHCP, Ethernet |
| **Language** | Język wyświetlacza, język poleceń |
| **Sensors** | Status czujników, kalibracja |
| **Communications** | Ustawienia portów szeregowych |
| **Bluetooth** | Ustawienia Bluetooth, parowanie |
| **Battery** | Status baterii, zdrowie, cykle |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZQ620 Plus

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Min. szerokość materiału | 25,4 mm (1") |
| Maks. długość etykiety | 812,8 mm (32") |
| Min. długość etykiety | 12,7 mm (0,5") |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość materiału | 0,058-0,165 mm |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – paragony, kwity
- **Materiał bezpodkładowy (linerless)** – wymaga specjalnego wałka

### Ładowanie materiału (tryb Tear-Off)

1. **Naciśnij przycisk zwalniający** z boku drukarki
2. **Odchyl pokrywę mediów** do tyłu, odsłaniając komorę
3. **Rozsuń dyski podtrzymujące** – odsuń je od siebie
4. **Włóż rolkę materiału** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. Naciśnij **FEED** aby wysunąć i wyrównać materiał

> **Uwaga:** ZQ620 Plus obsługuje szerszy materiał do 79,4 mm. Upewnij się, że materiał jest prawidłowo wyśrodkowany między dyskami podtrzymującymi.

### Ładowanie w trybie Peel-Off

1. **Odklej kilka etykiet** od podkładu
2. Otwórz pokrywę mediów
3. Załaduj rolkę materiału standardowo
4. **Pociągnij dźwignię peelera** do góry
5. Przeprowadź pusty **podkład** za ramię peelera
6. Zamknij pokrywę – ramię peelera zablokuje się automatycznie
7. Włącz drukarkę lub naciśnij FEED
`
      },
      {
        title: '5. Ładowanie i zarządzanie baterią',
        content: `
### Bateria PowerPrecision+

Drukarka ZQ620 Plus wykorzystuje inteligentną baterię litowo-jonową 2-ogniwową (7,4V, 3250 mAh) z technologią PowerPrecision+, która zapewnia:

- Monitorowanie stanu zdrowia baterii w czasie rzeczywistym
- Licznik cykli ładowania
- Prognozowanie czasu pracy
- Optymalne zarządzanie ładowaniem

Opcjonalnie dostępna jest bateria rozszerzona 4-ogniwowa dla dłuższego czasu pracy.

### Stan zdrowia baterii

| Liczba cykli | Stan | Komunikat |
|--------------|------|-----------|
| < 300 | GOOD | Brak |
| 300-549 | REPLACE | "Battery Diminished Consider Replacing" |
| 550-599 | REPLACE | "Warning-Battery Is Past Useful Life" |
| >= 600 | POOR | "Replace Battery Shutting Down" |

### Opcje ładowania

| Ładowarka | Opis | Czas ładowania |
|-----------|------|----------------|
| **Zasilacz AC** | Ładowanie przez gniazdo DC | Podczas pracy |
| **Smart Charger-2 (SC2)** | Ładowarka pojedyncza | ~2 godziny |
| **Quad Charger (UCLI72-4)** | 4 baterie jednocześnie | ~2 godziny |
| **1-Slot Battery Charger** | Ładowarka pojedyncza | ~4 godziny |
| **3-Slot Battery Charger** | 3 baterie jednocześnie | ~4 godziny |
| **Stacja dokująca Ethernet** | Z jednoczesną komunikacją | Podczas pracy |

### Wskazówki dotyczące żywotności baterii

- Nie wystawiaj baterii na temperaturę powyżej 40°C podczas ładowania
- Używaj tylko ładowarek Zebra przeznaczonych do baterii Li-Ion
- Używaj odpowiednich materiałów eksploatacyjnych Zebra
- Wybierz optymalną ciemność i prędkość druku
- Wyjmuj baterię jeśli drukarka nie jest używana przez dłuższy czas
`
      },
      {
        title: '6. Łączność bezprzewodowa',
        content: `
### Wi-Fi 6 (802.11ax)

ZQ620 Plus oferuje opcję Wi-Fi 6 dual radio z najnowszą technologią bezprzewodową:

- **802.11ax** – szybsza transmisja i lepsza wydajność w zatłoczonych sieciach
- **Bluetooth 5.3** – zwiększony zasięg i prędkość parowania
- Wsteczna kompatybilność z 802.11 a/b/g/n/ac

### Bluetooth 5.3

ZQ620 Plus obsługuje Bluetooth 5.3 Classic + BLE z trybami bezpieczeństwa:

- **Secure Simple Pairing (SSP)** – automatyczne parowanie bez PIN
- **Numeric Comparison** – weryfikacja 6-cyfrowym kodem
- **Just Works** – najprostszy tryb dla urządzeń bez wyświetlacza
- Bonding – zapamiętywanie sparowanych urządzeń

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. **Zbliż telefon** do ikony Print Touch na boku drukarki (max 7,5 cm)
3. Parowanie nastąpi automatycznie
4. Opcjonalnie: uruchomi się aplikacja Zebra

### Połączenie Wi-Fi

1. Skonfiguruj ustawienia sieci przez Zebra Setup Utilities
2. Wprowadź ESSID (nazwę sieci)
3. Skonfiguruj zabezpieczenia (WPA2, WPA3)
4. Drukarka połączy się automatycznie
`
      },
      {
        title: '7. Podłączenie do komputera',
        content: `
### Instalacja sterowników

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com/drivers
2. Zainstaluj oprogramowanie PRZED podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub RS-232
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB (mały 5-pin) do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę

### Stacja dokująca Ethernet

1. Podłącz stację dokującą do sieci kablem Ethernet
2. Podłącz zasilacz do stacji dokującej
3. **Umieść drukarkę** w stacji dokującej
4. Drukarka automatycznie przełączy się na Ethernet i rozpocznie ładowanie

> **Uwaga:** Drukarka z baterią rozszerzoną 4-ogniwową może nie być kompatybilna ze wszystkimi stacjami dokującymi.
`
      },
      {
        title: '8. Weryfikacja działania',
        content: `
### Drukowanie etykiety konfiguracji (Two Key Report)

1. Wyłącz drukarkę
2. Załaduj materiał ciągły (bez znaczników)
3. **Przytrzymaj przycisk FEED**
4. **Naciśnij i zwolnij przycisk POWER** (trzymając FEED)
5. Zwolnij FEED gdy rozpocznie się drukowanie

Etykieta konfiguracji zawiera:
- Numer seryjny i model (ZQ620 Plus)
- Wersję firmware
- Ustawienia komunikacji
- Status sieci Wi-Fi i Bluetooth
- Adresy MAC
- Zainstalowane czcionki i kody kreskowe

### Wejście w tryb diagnostyczny (DUMP Mode)

1. Wydrukuj etykietę konfiguracji
2. Na końcu wydruku pojawi się: "Press FEED key to enter DUMP mode"
3. Naciśnij FEED w ciągu 3 sekund
4. Drukarka będzie drukować odebrane dane w formacie HEX
`
      },
      {
        title: '9. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Wałek dociskowy (platen) | Co 5 rolek materiału |
| Czujniki (gap, black bar) | Co 5 rolek |
| Listwa odrywająca (tear bar) | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz pokrywę i wyjmij materiał
3. **Głowica:** Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem izopropylowym (90%+)
4. **Wałek:** Przetrzyj wacikiem z alkoholem, obracając ręcznie
5. **Czujniki:** Wydmuchaj kurz, przetrzyj suchym wacikiem
6. Poczekaj aż wyschnie przed załadowaniem materiału

> **Uwaga:** Głowica w modelu ZQ620 Plus jest szersza niż w ZQ610 Plus. Upewnij się, że cała powierzchnia elementów grzejnych została wyczyszczona.

### Czyszczenie drukarek Healthcare (ZQ620 Plus-HC)

Drukarki w wersji Healthcare zostały zaprojektowane do regularnej dezynfekcji. Używaj zatwierdzonych środków czyszczących stosowanych w placówkach medycznych.

### Materiały do czyszczenia

- Pisak czyszczący Zebra
- Waciki bezpyłowe
- Alkohol izopropylowy (90%+)
- Ściereczka bezpyłowa
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Komunikaty alertów

| Alert | Kolor | Znaczenie | Rozwiązanie |
|-------|-------|-----------|-------------|
| Media Out | Czerwony (miga) | Brak materiału | Załaduj materiał |
| Media Cover Open | Czerwony (miga) | Pokrywa otwarta | Zamknij pokrywę |
| Battery Low | Żółty | Niski poziom baterii | Naładuj/wymień baterię |
| Battery Diminished | Żółty | Bateria zużyta | Rozważ wymianę |
| Head Over Temp | Żółty | Przegrzanie głowicy | Poczekaj na ochłodzenie |
| Error | Czerwony (miga) | Błąd ogólny | Sprawdź wyświetlacz |

### Problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Brak zasilania | Sprawdź instalację baterii, naładuj baterię |
| Materiał nie wysuwa się | Sprawdź czy pokrywa jest zamknięta, sprawdź rolkę |
| Słaby/wyblakły druk | Wyczyść głowicę, zwiększ ciemność, sprawdź materiał |
| Brakujący druk | Sprawdź wyrównanie materiału, wyczyść głowicę |
| Zniekształcony druk | Sprawdź baud rate, kabel komunikacyjny |
| Brak druku | Sprawdź komunikację, wymień baterię |
| Pomijanie etykiet | Skalibruj czujniki, sprawdź znaczniki/przerwy |
| Zacięcie materiału | Otwórz pokrywę, usuń zacięty materiał |
| Pusty ekran LCD | Włącz drukarkę, przeładuj firmware |
| Brak NFC | Zbliż telefon do 7,5 cm od ikony Print Touch |

### Przywracanie ustawień fabrycznych

**Z menu:**
TOOLS > LOAD DEFAULTS > FACTORY

**Kombinacja klawiszy:**
Przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki
`
      },
      {
        title: '11. Akcesoria i opcje',
        content: `
### Opcje noszenia

| Akcesorium | Opis |
|------------|------|
| Klips do paska | W zestawie – obrotowy |
| Pasek na ramię | Regulowany, mocowany do uchwytów |
| Pasek na rękę | Wygodne noszenie jedną ręką |
| Miękka obudowa (soft case) | Ochrona z oknem na LCD |

### Ładowarki i stacje dokujące

| Akcesorium | Nr części |
|------------|-----------|
| Zasilacz AC (US) | P1031365-024 |
| Zasilacz AC Healthcare | P1065668-008 |
| Smart Charger-2 (SC2) | P1031365-063 |
| Quad Charger UCLI72-4 | AC18177-5 |
| 1-Slot Battery Charger | SAC-MPP-1BCHGUS1-01 |
| 3-Slot Battery Charger | SAC-MPP-3BCHGUS1-01 |
| Single Ethernet Cradle | P1031365-038 |
| 4-Bay Ethernet Cradle | P1031365-045 |
| Bateria zapasowa 2-cell | P1031365-059 |
| Bateria rozszerzona 4-cell | P1031365-069 |
`
      },
      {
        title: '12. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 117,9 mm (4,64") |
| Długość | 173,7 mm (6,84") |
| Wysokość | 76,9 mm (3,03") |
| Waga z baterią | 0,73 kg (1,6 lbs) |

### Specyfikacje druku

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do 72 mm (2,91") |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (127 mm/s Draft) |

### Specyfikacje materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 79,4 mm (3,125") |
| Min. szerokość materiału | 25,4 mm (1") |
| Długość etykiety | 12,7-812,8 mm |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria standardowa | Li-Ion 7,4V, 3250 mAh (2-cell) |
| Bateria rozszerzona | Li-Ion 7,4V (4-cell) - opcja |
| Zasilacz AC | 100-240 VAC, 50-60 Hz |

### Łączność

| Parametr | Wartość |
|----------|---------|
| USB | 2.0 Full Speed |
| Serial | RS-232C (14-pin), 9600-115200 bps |
| Wi-Fi (opcja) | 802.11ax (Wi-Fi 6) lub 802.11ac (Wi-Fi 5) |
| Bluetooth (opcja) | 5.3 lub 4.2 Classic + BLE |
| NFC | Print Touch |
| Ethernet | 10/100 Mb/s (przez stację dokującą) |

### Certyfikaty i ochrona

| Parametr | Wartość |
|----------|---------|
| Stopień ochrony IP | IP54 |
| Certyfikaty | FCC, CE, IC, MFi |

### Obsługiwane kody kreskowe

**Kody liniowe:**
- Code 39, Code 93, Code 128
- Codabar, Interleaved 2 of 5
- UPC-A, UPC-E, EAN-8, EAN-13
- MSI, Plessey, POSTNET

**Kody 2D:**
- QR Code, Data Matrix
- PDF417, Micro PDF417
- Aztec, MaxiCode
- GS1 DataBar (RSS)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym różni się ZQ620 Plus od ZQ620?

**Odpowiedź:** ZQ620 Plus to ulepszona wersja z **Wi-Fi 6 (802.11ax)** zamiast Wi-Fi 5, **Bluetooth 5.3** zamiast 4.1, wyższą odpornością **IP54** (vs IP43), i **PSPT PrintSmart Gen 2** dla lepszej jakości druku. Wymiary pozostają identyczne.

### Jaka jest szerokość druku drukarki ZQ620 Plus?

**Odpowiedź:** Zebra ZQ620 Plus drukuje etykiety o szerokości **do 72 mm (2,91 cala / 3 cale)**. To średni model z serii ZQ600 Plus.

### Czy ZQ620 Plus obsługuje Wi-Fi 6?

**Odpowiedź:** Tak, ZQ620 Plus oferuje opcję **Wi-Fi 6 (802.11ax)** dual radio z Bluetooth 5.3. Jest to najnowszy standard zapewniający szybszą transmisję i lepszą wydajność w zatłoczonych sieciach.

### Jaki jest stopień ochrony IP drukarki ZQ620 Plus?

**Odpowiedź:** ZQ620 Plus ma certyfikat **IP54** standardowo – to wyższy poziom ochrony niż poprzednik ZQ620 (IP43). IP54 oznacza ochronę przed kurzem i bryzgami wody z każdego kierunku.

### Ile waży drukarka ZQ620 Plus?

**Odpowiedź:** Zebra ZQ620 Plus waży **0,73 kg** z zainstalowaną baterią standardową – jest to średnia waga w serii ZQ600 Plus.

### Jak długo wytrzymuje bateria w ZQ620 Plus?

**Odpowiedź:** Bateria PowerPrecision+ (3250 mAh) jest zoptymalizowana do całodziennej pracy. Dostępna jest też **bateria rozszerzona 4-ogniwowa** dla większej pojemności.

### Jak załadować materiał do ZQ620 Plus?

**Odpowiedź:** Naciśnij przycisk zwalniający z boku, odchyl pokrywę, rozsuń dyski podtrzymujące, włóż rolkę (strona do druku na zewnątrz), przeprowadź materiał pod wałkiem, zamknij pokrywę i naciśnij FEED.

### Jak sparować ZQ620 Plus przez NFC?

**Odpowiedź:** Włącz NFC na smartfonie i **zbliż telefon** do ikony Print Touch na drukarce (max 7,5 cm). Parowanie z Bluetooth 5.3 nastąpi automatycznie.

### Czy ZQ620 Plus ma certyfikat MFi dla iPhone?

**Odpowiedź:** Tak, ZQ620 Plus ma certyfikat **Made for iPhone (MFi)**, co zapewnia pełną kompatybilność z urządzeniami iOS 10 i nowszymi.

### Jak wyczyścić głowicę drukującą ZQ620 Plus?

**Odpowiedź:** Wyłącz drukarkę, poczekaj na ostygnięcie. Przetrzyj **brązowy pasek elementów grzejnych** wacikiem nasączonym alkoholem izopropylowym (90%+). Głowica ZQ620 Plus jest szersza niż ZQ610 Plus.

### Jakie materiały obsługuje ZQ620 Plus?

**Odpowiedź:** ZQ620 Plus obsługuje: etykiety z przerwą (gap), z czarnym znacznikiem (black mark), materiał ciągły (continuous) i bezpodkładowy (linerless) o szerokości **25,4-79,4 mm**.

### Jak przywrócić ustawienia fabryczne ZQ620 Plus?

**Odpowiedź:** Z menu: **TOOLS > LOAD DEFAULTS > FACTORY**. Lub przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki.

### Czy dostępna jest wersja Healthcare drukarki ZQ620 Plus?

**Odpowiedź:** Tak, dostępna jest wersja **ZQ620 Plus-HC** w kolorze białym, zaprojektowana do regularnej dezynfekcji w placówkach medycznych.

### Do czego najlepiej nadaje się ZQ620 Plus?

**Odpowiedź:** ZQ620 Plus jest idealna do drukowania **dużych etykiet wysyłkowych**, dokumentów przewozowych, listów przewozowych i protokołów serwisowych dzięki szerokości druku 3 cale (72 mm).
`
      }
    ]
  },

  'zq630plus': {
    model: 'ZQ630 Plus',
    title: 'Zebra ZQ630 Plus – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZQ600 Plus Series User Guide',
    keywords: [
      'zebra zq630 plus instrukcja', 'zq630 plus instrukcja po polsku', 'zebra zq630 plus manual',
      'drukarka zebra zq630 plus', 'zq630 plus kalibracja', 'zq630 plus reset', 'zq630 plus bateria',
      'zq630 plus ładowanie etykiet', 'zq630 plus sterowniki', 'zq630 plus specyfikacja',
      'zq630 plus błędy', 'zq630 plus czyszczenie', 'zq630 plus bluetooth 5.3', 'zq630 plus wifi 6',
      'zq630 plus nfc', 'zq630 plus peel off', 'zq630 plus ip54', 'zq630 plus rfid',
      'zq630 plus powerprecision+', 'zq630 plus 4 cale', 'mobilna drukarka etykiet rfid',
      'zq630 plus vs zq630', 'zq600 plus series', 'wifi 6 drukarka rfid', 'epc gen 2 uhf'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZQ630 Plus

Zebra ZQ630 Plus to najbardziej zaawansowana mobilna drukarka etykiet z serii ZQ600 Plus o **szerokości druku 4 cale (104 mm)**. Jest następcą modelu ZQ630 i oferuje ulepszoną łączność z Wi-Fi 6 (802.11ax) i Bluetooth 5.3, podwyższoną odporność IP54, kolorowy wyświetlacz LCD oraz technologię NFC. Unikalną cechą tego modelu jest **opcjonalny moduł RFID** umożliwiający kodowanie inteligentnych etykiet. Idealny do drukowania dużych etykiet wysyłkowych, dokumentów logistycznych i etykiet RFID.

### Parametry techniczne

| Parametr | ZQ630 Plus |
|----------|------------|
| **Szerokość druku** | **do 104 mm (4,09")** |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (4"/s) standardowo |
| | 127 mm/s (5"/s) w trybie Draft |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Maks. szerokość materiału | 111 mm (4,4") |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |
| **Opcja RFID** | **EPC Gen 2 UHF** |

### Porównanie serii ZQ600 Plus

| Parametr | ZQ610 Plus | ZQ620 Plus | ZQ630 Plus |
|----------|------------|------------|------------|
| Szerokość druku | 48 mm (2") | 72 mm (3") | **104 mm (4")** |
| Maks. szerokość materiału | 55,37 mm | 79,4 mm | **111 mm** |
| Waga z baterią | 0,6 kg | 0,73 kg | **1,113 kg** |
| Bateria | 2-cell/4-cell | 2-cell/4-cell | **4-cell** |
| Opcja RFID | Nie | Nie | **Tak** |

### Zastosowania ZQ630 Plus

- **Logistyka i wysyłka:** duże etykiety paletowe, dokumenty przewozowe
- **Magazynowanie:** etykiety RFID na towary, oznaczenia lokalizacji
- **Handel detaliczny:** etykiety antykradzieżowe RFID, oznaczenia produktów
- **Produkcja:** etykiety śledzenia WIP (Work-in-Progress)
- **Służba zdrowia:** etykiety RFID na sprzęt medyczny
- **Transport:** listy przewozowe, potwierdzenia dostawy

### Złącza i łączność

- USB 2.0 Full Speed (standard)
- RS-232 Serial 14-pin (standard)
- Wi-Fi 6 dual radio (802.11ax + Bluetooth 5.3)
- Wi-Fi 5 dual radio (802.11ac + Bluetooth 4.2) - opcja
- Ethernet 10/100 (przez stację dokującą)
- NFC (Near Field Communication)

### Cechy charakterystyczne

- **Szerokość druku 4" (104 mm)** – największa w serii
- **Opcjonalny moduł RFID** – kodowanie EPC Gen 2 Class 1 UHF
- **Wi-Fi 6 i Bluetooth 5.3** – najnowsze standardy łączności
- **Certyfikat IP54** – zwiększona odporność na kurz i wodę
- **Bateria PowerPrecision+ 4-ogniwowa** – dłuższy czas pracy
- **Kolorowy wyświetlacz LCD** – intuicyjny interfejs 288x240 pikseli
- **NFC Print Touch** – szybkie parowanie przez zbliżenie
- **Made for iPhone (MFi)** – certyfikowana zgodność z iOS 10+
- **PSPT PrintSmart Gen 2** – adaptacyjna jakość druku
- Obsługa języków CPCL, ZPL i EPL
- Metalowy klips do paska i twarda obudowa (opcja)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZQ630 Plus
- Bateria litowo-jonowa PowerPrecision+ (4-ogniwowa)
- Klips do paska
- Karta rejestracyjna
- Skrócona instrukcja obsługi
- Przewodnik bezpieczeństwa

### Instalacja baterii

1. **Usuń taśmę izolacyjną** z nowej baterii (pociągnij za zakładkę)
2. **Obróć klips do paska** (jeśli zamontowany) aby uzyskać dostęp do komory baterii
3. **Włóż baterię** do komory pod kątem zgodnie z oznaczeniami
4. **Obróć baterię** aż zatrzaśnie się na miejscu

> **Uwaga:** Baterie są dostarczane w trybie uśpienia. Przed pierwszym użyciem naładuj baterię w ładowarce lub podłącz drukarkę do zasilacza AC.

### Wyjmowanie baterii

1. Naciśnij zatrzask na baterii
2. Odchyl baterię od komory
3. Wyjmij baterię z drukarki

> **Ważne:** Zawsze wyłącz drukarkę przed wyjęciem baterii aby uniknąć uszkodzenia danych.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -20°C do +50°C | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C | – |
| Przechowywanie | -25°C do +65°C | 10-90% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Wyświetlacz LCD

Kolorowy wyświetlacz LCD (288x240 pikseli) pokazuje status drukarki, ikony stanu i menu konfiguracyjne. Automatycznie przyciemnia się po okresie bezczynności (domyślnie 20 min).

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włącza/wyłącza drukarkę (przytrzymaj 3 sek. aby wyłączyć) |
| **FEED** | Wysuwa materiał / budzenie z trybu uśpienia |
| **Strzałki nawigacyjne** | Nawigacja po menu LCD (GÓRA, DÓŁ, LEWO, PRAWO) |
| **OK** | Potwierdza wybór w menu |
| **LEFT/RIGHT SELECT** | Wykonują akcje pokazane na pasku nawigacji |

### Wskaźnik LED (pierścień wokół przycisku Power)

| Kolor | Zachowanie | Znaczenie |
|-------|------------|-----------|
| Zielony | Stały | Bateria naładowana, drukarka włączona |
| Zielony | Pulsujący | Tryb uśpienia, bateria naładowana |
| Bursztynowy | Stały | Ładowanie w toku |
| Bursztynowy | Pulsujący | Ładowanie w trybie uśpienia |
| Czerwony | Stały | Niezdrowa bateria – wymień |
| Czerwony | Migający | Błąd ładowania |

### Menu główne (Home Menu)

Z ekranu głównego naciśnij LEFT SELECT aby wejść do menu z ikonami:

| Menu | Zawartość |
|------|-----------|
| **Settings** | Ciemność druku, typ mediów, tryb druku, szerokość |
| **Tools** | Informacje, diagnostyka, reset fabryczny |
| **Network** | Ustawienia Wi-Fi, IP, DHCP, Ethernet |
| **RFID** | Kalibracja RFID, status, moc odczytu/zapisu |
| **Language** | Język wyświetlacza, język poleceń |
| **Sensors** | Status czujników, kalibracja |
| **Communications** | Ustawienia portów szeregowych |
| **Battery** | Status baterii, zdrowie, cykle |
`
      },
      {
        title: '4. Ładowanie materiałów eksploatacyjnych',
        content: `
### Specyfikacja materiałów dla ZQ630 Plus

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 111 mm (4,4") z podkładem |
| | 109 mm (4,3") linerless |
| Min. szerokość materiału | 50,8 mm (2") |
| Maks. długość etykiety | 812,8 mm (32") |
| Min. długość etykiety | 12,7 mm (0,5") |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość materiału | 0,081-0,190 mm |

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły (continuous)** – paragony, kwity
- **Materiał bezpodkładowy (linerless)** – wymaga specjalnego wałka
- **Etykiety RFID** – z wbudowanym transponderem UHF (opcja)

### Ładowanie materiału (tryb Tear-Off)

1. **Naciśnij przycisk zwalniający** z boku drukarki
2. **Odchyl pokrywę mediów** do tyłu, odsłaniając komorę
3. **Rozsuń dyski podtrzymujące** – odsuń je od siebie
4. **Włóż rolkę materiału** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. Naciśnij **FEED** aby wysunąć i wyrównać materiał

### Ładowanie w trybie Peel-Off

1. **Odklej kilka etykiet** od podkładu
2. Otwórz pokrywę mediów
3. Załaduj rolkę materiału standardowo
4. Zamknij pokrywę mediów
5. **Pociągnij dźwignię peelera** do góry aż zablokuje się
6. Ramię peelera odchyli się do tyłu
7. Włącz drukarkę lub naciśnij FEED
`
      },
      {
        title: '5. RFID (Radio Frequency Identification)',
        content: `
### Informacje o RFID

ZQ630 Plus jako jedyna drukarka z serii ZQ600 Plus oferuje **opcjonalny moduł RFID** zintegrowany z głowicą drukującą. Umożliwia kodowanie informacji na ultracienkich transponderach UHF RFID wbudowanych w inteligentne etykiety.

### Obsługiwane standardy RFID

- **EPC Generation 2 Class 1 UHF** – standard pasywnych tagów RFID
- Identyfikator EPC 96-bit (standardowy)
- Pamięć użytkownika (zależna od modelu taga)
- Zgodność z ISO 18000-6C

### Kalibracja RFID

Kalibracja RFID ustawia parametry komunikacji dla danego typu taga. Procedurę należy wykonać po zmianie typu materiału RFID.

1. Załaduj materiał RFID do drukarki
2. Wykonaj kalibrację długości etykiety (Label Length Cal)
3. Naciśnij FEED aby wysunąć jedną etykietę
4. Wejdź do menu: HOME > RFID > RFID CALIBRATE
5. Naciśnij OK aby rozpocząć kalibrację
6. Drukarka wolno wysuwa etykietę podczas kalibracji
7. Po zakończeniu wyświetli się komunikat "READY"

### Menu RFID

| Opcja | Opis |
|-------|------|
| RFID Status | Status podsystemu RFID |
| RFID Calibrate | Kalibracja dla nowego materiału |
| Read RFID Data | Odczyt danych z taga |
| RFID Test | Test odczytu/zapisu taga |
| RFID Programming Position | Pozycja programowania |
| RFID Read Power | Moc odczytu (dBm) |
| RFID Write Power | Moc zapisu (dBm) |
| RFID Valid Count | Licznik poprawnych etykiet |
| RFID Void Count | Licznik unieważnionych etykiet |

### Obsługa błędów RFID

Jeśli tag RFID nie może zostać zakodowany, drukarka:
1. Drukuje "VOID" na etykiecie
2. Próbuje zakodować kolejne etykiety (domyślnie do 3 prób)
3. Po przekroczeniu limitu – przechodzi do następnego formatu

> **Uwaga:** Używaj tylko materiałów RFID Zebra. Materiały innych producentów mogą nie przejść kalibracji RFID.
`
      },
      {
        title: '6. Ładowanie i zarządzanie baterią',
        content: `
### Bateria PowerPrecision+

Drukarka ZQ630 Plus wykorzystuje inteligentną baterię litowo-jonową **4-ogniwową** (7,4V, 6600 mAh) z technologią PowerPrecision+, która zapewnia:

- Monitorowanie stanu zdrowia baterii w czasie rzeczywistym
- Licznik cykli ładowania
- Prognozowanie czasu pracy
- Optymalne zarządzanie ładowaniem
- Dłuższy czas pracy dzięki większej pojemności

### Stan zdrowia baterii

| Liczba cykli | Stan | Komunikat |
|--------------|------|-----------|
| < 300 | GOOD | Brak |
| 300-549 | REPLACE | "Battery Diminished Consider Replacing" |
| 550-599 | REPLACE | "Warning-Battery Is Past Useful Life" |
| >= 600 | POOR | "Replace Battery Shutting Down" |

### Opcje ładowania

| Ładowarka | Opis | Czas ładowania |
|-----------|------|----------------|
| **Zasilacz AC** | Ładowanie przez gniazdo DC | Podczas pracy |
| **Smart Charger-2 (SC2)** | Ładowarka pojedyncza | ~2 godziny |
| **Quad Charger (UCLI72-4)** | 4 baterie jednocześnie | ~2 godziny |
| **1-Slot Battery Charger** | Ładowarka pojedyncza | ~6 godzin |
| **3-Slot Battery Charger** | 3 baterie jednocześnie | ~6 godzin |
| **Stacja dokująca Ethernet** | Z jednoczesną komunikacją | Podczas pracy |
`
      },
      {
        title: '7. Łączność bezprzewodowa',
        content: `
### Wi-Fi 6 (802.11ax)

ZQ630 Plus oferuje opcję Wi-Fi 6 dual radio z najnowszą technologią bezprzewodową:

- **802.11ax** – szybsza transmisja i lepsza wydajność w zatłoczonych sieciach
- **Bluetooth 5.3** – zwiększony zasięg i prędkość parowania
- Wsteczna kompatybilność z 802.11 a/b/g/n/ac

### Bluetooth 5.3

ZQ630 Plus obsługuje Bluetooth 5.3 Classic + BLE z trybami bezpieczeństwa:

- **Secure Simple Pairing (SSP)** – automatyczne parowanie bez PIN
- **Numeric Comparison** – weryfikacja 6-cyfrowym kodem
- **Just Works** – najprostszy tryb dla urządzeń bez wyświetlacza
- Bonding – zapamiętywanie sparowanych urządzeń
- Bluetooth Class 1 lub Class 2 (konfigurowalny przez SGD)

### Parowanie przez NFC (Print Touch)

1. Włącz NFC na smartfonie
2. **Zbliż telefon** do ikony Print Touch na boku drukarki (max 7,5 cm)
3. Parowanie nastąpi automatycznie
4. Opcjonalnie: uruchomi się aplikacja Zebra
`
      },
      {
        title: '8. Podłączenie do komputera',
        content: `
### Instalacja sterowników

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com/drivers
2. Zainstaluj oprogramowanie PRZED podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub RS-232
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB (mały 5-pin) do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę

### Stacja dokująca Ethernet

1. Podłącz stację dokującą do sieci kablem Ethernet
2. Podłącz zasilacz do stacji dokującej
3. **Umieść drukarkę** w stacji dokującej
4. Drukarka automatycznie przełączy się na Ethernet i rozpocznie ładowanie
`
      },
      {
        title: '9. Weryfikacja działania',
        content: `
### Drukowanie etykiety konfiguracji (Two Key Report)

1. Wyłącz drukarkę
2. Załaduj materiał ciągły (bez znaczników)
3. **Przytrzymaj przycisk FEED**
4. **Naciśnij i zwolnij przycisk POWER** (trzymając FEED)
5. Zwolnij FEED gdy rozpocznie się drukowanie

Etykieta konfiguracji zawiera:
- Numer seryjny i model (ZQ630 Plus)
- Wersję firmware
- Ustawienia komunikacji
- Status sieci Wi-Fi i Bluetooth
- Status modułu RFID (jeśli zainstalowany)
- Adresy MAC
- Zainstalowane czcionki i kody kreskowe
`
      },
      {
        title: '10. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Wałek dociskowy (platen) | Co 5 rolek materiału |
| Czujniki (gap, black bar) | Co 5 rolek |
| Skrobak (linerless) | Co 5 rolek |
| Listwa odrywająca (tear bar) | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz pokrywę i wyjmij materiał
3. **Głowica:** Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem izopropylowym (90%+)
4. **Wałek:** Przetrzyj wacikiem z alkoholem, obracając ręcznie
5. **Czujniki:** Wydmuchaj kurz, przetrzyj suchym wacikiem
6. Poczekaj aż wyschnie przed załadowaniem materiału

> **Uwaga:** Głowica w modelu ZQ630 Plus jest najszersza w całej serii. Upewnij się, że cała powierzchnia elementów grzejnych została wyczyszczona.

### Czyszczenie wałka linerless

Dla drukarek z wałkiem linerless:
1. Użyj roztworu mydła i wody (1:25)
2. Przetrzyj wałek wacikiem bezpyłowym
3. Opłucz czystą wodą
4. Poczekaj na wyschnięcie
`
      },
      {
        title: '11. Rozwiązywanie problemów',
        content: `
### Komunikaty alertów

| Alert | Kolor | Znaczenie | Rozwiązanie |
|-------|-------|-----------|-------------|
| Media Out | Czerwony (miga) | Brak materiału | Załaduj materiał |
| Media Cover Open | Czerwony (miga) | Pokrywa otwarta | Zamknij pokrywę |
| Battery Low | Żółty | Niski poziom baterii | Naładuj/wymień baterię |
| Battery Diminished | Żółty | Bateria zużyta | Rozważ wymianę |
| Head Over Temp | Żółty | Przegrzanie głowicy | Poczekaj na ochłodzenie |
| RFID Error | Czerwony | Błąd RFID | Sprawdź materiał/kalibrację |
| Error | Czerwony (miga) | Błąd ogólny | Sprawdź wyświetlacz |

### Problemy RFID i rozwiązania

| Problem | Rozwiązanie |
|---------|-------------|
| Brak kodowania RFID | Wykonaj kalibrację RFID |
| VOID na wszystkich etykietach | Sprawdź materiał RFID, użyj materiałów Zebra |
| Niestabilne kodowanie | Dostosuj moc zapisu w menu RFID |
| Błąd odczytu | Sprawdź pozycję programowania |

### Przywracanie ustawień fabrycznych

**Z menu:**
TOOLS > LOAD DEFAULTS > FACTORY

**Kombinacja klawiszy:**
Przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki
`
      },
      {
        title: '12. Akcesoria i opcje',
        content: `
### Opcje noszenia ZQ630 Plus

| Akcesorium | Nr części |
|------------|-----------|
| Metalowy klips do paska | P1050667-031 |
| Twarda obudowa z klipsem | P1050667-034 |
| Miękka obudowa (soft case) | P1050667-017 |
| Pas biodrowy (waist holster) | SG-MPP-Q4HLSTR1-01 |
| Uchwyt RAM Mount | P1050667-047 |
| Uchwyt na wózki widłowe | P1050667-035 |

### Ładowarki i stacje dokujące

| Akcesorium | Nr części |
|------------|-----------|
| Zasilacz AC (US) | P1050667-018 |
| Smart Charger-2 (SC2) | P1031365-063 |
| Quad Charger UCLI72-4 | AC18177-5 |
| 1-Slot Battery Charger | SAC-MPP-1BCHGUS1-01 |
| 3-Slot Battery Charger | SAC-MPP-3BCHGUS1-01 |
| Single Ethernet Cradle | P1050667-029 |
| Bateria zapasowa 4-cell | BTRY-MPP-68MA1-01 |
| Vehicle Adapter | VAM-MPP-VHCH1-01 |
| Battery Eliminator | P1050667-041 |
`
      },
      {
        title: '13. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 165,1 mm (6,5") |
| Długość | 186,7 mm (7,35") |
| Wysokość | 82,5 mm (3,25") |
| Waga z baterią | 1,113 kg (2,45 lbs) |

### Specyfikacje druku

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do 104 mm (4,09") |
| Rozdzielczość | 203 dpi |
| Prędkość druku | 102 mm/s (127 mm/s Draft) |

### Specyfikacje materiałów

| Parametr | Wartość |
|----------|---------|
| Maks. szerokość materiału | 111 mm (4,4") z podkładem |
| | 109 mm (4,3") linerless |
| Min. szerokość materiału | 50,8 mm (2") |
| Długość etykiety | 12,7-812,8 mm |
| Maks. średnica rolki | 66,8 mm (2,6") |

### Specyfikacje RFID (opcja)

| Parametr | Wartość |
|----------|---------|
| Standard | EPC Generation 2 Class 1 UHF |
| Protokół | ISO 18000-6C |
| Identyfikator EPC | 96-bit (standard) |
| Funkcje | Odczyt, zapis, weryfikacja |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria | Li-Ion 7,4V, 6600 mAh (4-cell) |
| Zasilacz AC | 100-240 VAC, 50-60 Hz |

### Łączność

| Parametr | Wartość |
|----------|---------|
| USB | 2.0 Full Speed |
| Serial | RS-232C (14-pin), 9600-115200 bps |
| Wi-Fi (opcja) | 802.11ax (Wi-Fi 6) lub 802.11ac (Wi-Fi 5) |
| Bluetooth (opcja) | 5.3 lub 4.2 Classic + BLE |
| NFC | Print Touch |
| Ethernet | 10/100 Mb/s (przez stację dokującą) |

### Certyfikaty i ochrona

| Parametr | Wartość |
|----------|---------|
| Stopień ochrony IP | IP54 |
| Certyfikaty | FCC, CE, IC, MFi |

### Obsługiwane kody kreskowe

**Kody liniowe:**
- Code 39, Code 93, Code 128
- Codabar, Interleaved 2 of 5
- UPC-A, UPC-E, EAN-8, EAN-13
- MSI, Plessey, POSTNET

**Kody 2D:**
- QR Code, Data Matrix
- PDF417, Micro PDF417
- Aztec, MaxiCode
- GS1 DataBar (RSS)
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym różni się ZQ630 Plus od ZQ620 Plus?

**Odpowiedź:** ZQ630 Plus ma **szerokość druku 4 cale (104 mm)** vs 3 cale w ZQ620 Plus, **opcjonalny moduł RFID**, większą baterię 4-ogniwową (6600 mAh) i waży 1,113 kg. Jest przeznaczony do dużych etykiet i etykiet RFID.

### Jaka jest szerokość druku drukarki ZQ630 Plus?

**Odpowiedź:** Zebra ZQ630 Plus drukuje etykiety o szerokości **do 104 mm (4,09 cala / 4 cale)**. To największy model z serii ZQ600 Plus.

### Czy ZQ630 Plus obsługuje RFID?

**Odpowiedź:** Tak, ZQ630 Plus jako jedyna w serii ZQ600 Plus oferuje **opcjonalny moduł RFID** do kodowania etykiet EPC Generation 2 Class 1 UHF zgodnych z ISO 18000-6C.

### Jak skalibrować RFID w ZQ630 Plus?

**Odpowiedź:** Załaduj materiał RFID, wykonaj kalibrację długości etykiety, naciśnij FEED, wejdź do **HOME > RFID > RFID CALIBRATE** i naciśnij OK. Kalibrację należy powtórzyć po zmianie typu materiału RFID.

### Jaki jest stopień ochrony IP drukarki ZQ630 Plus?

**Odpowiedź:** ZQ630 Plus ma certyfikat **IP54** – ochrona przed kurzem i bryzgami wody z każdego kierunku.

### Ile waży drukarka ZQ630 Plus?

**Odpowiedź:** Zebra ZQ630 Plus waży **1,113 kg** z zainstalowaną baterią 4-ogniwową – jest to najcięższa drukarka z serii ZQ600 Plus.

### Jak długo wytrzymuje bateria w ZQ630 Plus?

**Odpowiedź:** Bateria PowerPrecision+ 4-ogniwowa (6600 mAh) zapewnia **dłuższy czas pracy** niż modele ZQ610/ZQ620 Plus, wystarczający na całą zmianę intensywnej pracy.

### Co oznacza "VOID" na etykiecie RFID?

**Odpowiedź:** "VOID" oznacza, że **tag RFID nie mógł zostać zakodowany**. Drukarka próbuje do 3 razy, a potem przechodzi dalej. Sprawdź materiał i wykonaj kalibrację RFID.

### Jak załadować materiał do ZQ630 Plus?

**Odpowiedź:** Naciśnij przycisk zwalniający, odchyl pokrywę, rozsuń dyski podtrzymujące, włóż rolkę (strona do druku na zewnątrz), przeprowadź materiał pod wałkiem, zamknij pokrywę i naciśnij FEED.

### Jak sparować ZQ630 Plus przez NFC?

**Odpowiedź:** Włącz NFC na smartfonie i **zbliż telefon** do ikony Print Touch na drukarce (max 7,5 cm). Parowanie z Bluetooth 5.3 nastąpi automatycznie.

### Czy ZQ630 Plus ma certyfikat MFi dla iPhone?

**Odpowiedź:** Tak, ZQ630 Plus ma certyfikat **Made for iPhone (MFi)**, co zapewnia pełną kompatybilność z urządzeniami iOS 10 i nowszymi.

### Jak wyczyścić głowicę drukującą ZQ630 Plus?

**Odpowiedź:** Wyłącz drukarkę, poczekaj na ostygnięcie. Przetrzyj **brązowy pasek elementów grzejnych** wacikiem nasączonym alkoholem izopropylowym (90%+). Głowica ZQ630 Plus jest najszersza w serii (104 mm).

### Jakie materiały obsługuje ZQ630 Plus?

**Odpowiedź:** ZQ630 Plus obsługuje: etykiety z przerwą (gap), z czarnym znacznikiem (black mark), materiał ciągły, bezpodkładowy (linerless) i **etykiety RFID** o szerokości **50,8-111 mm**.

### Jak przywrócić ustawienia fabryczne ZQ630 Plus?

**Odpowiedź:** Z menu: **TOOLS > LOAD DEFAULTS > FACTORY**. Lub przytrzymaj **strzałki GÓRA + DÓŁ** podczas włączania drukarki.

### Do czego najlepiej nadaje się ZQ630 Plus?

**Odpowiedź:** ZQ630 Plus jest idealna do drukowania **dużych etykiet paletowych**, dokumentów logistycznych, **etykiet RFID** do śledzenia aktywów i produktów dzięki szerokości druku 4 cale i opcjonalnemu modułowi RFID.
`
      }
    ]
  },

  'zq630plusrfid': {
    model: 'ZQ630 Plus RFID',
    title: 'Zebra ZQ630 Plus RFID – Instrukcja kodowania etykiet RFID',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZQ600 Plus Series RFID Programming Guide',
    keywords: [
      'zebra zq630 plus rfid instrukcja', 'zq630 plus rfid kodowanie', 'zebra rfid etykiety',
      'zq630 plus kalibracja rfid', 'zq630 plus void rfid', 'zq630 plus epc gen 2',
      'rfid uhf drukarka', 'smart label drukarka', 'inteligentne etykiety rfid',
      'zpl rfid komendy', 'sgd rfid komendy', 'rfid programowanie', 'rfid void',
      'epc generation 2', 'iso 18000-6c', 'rfid moc zapisu', 'rfid kalibracja',
      'rfid troubleshooting', 'rfid błędy', 'mobilna drukarka rfid',
      'zebra savanna', 'rfid integracja', 'etykiety rfid zebra'
    ],
    sections: [
      {
        title: '1. Wprowadzenie do RFID',
        content: `
### Czym jest RFID?

RFID (Radio Frequency Identification) to technologia bezprzewodowej identyfikacji obiektów za pomocą fal radiowych. Drukarka ZQ630 Plus z opcjonalnym modułem RFID może **kodować (zapisywać)** informacje na ultracienkich transponderach UHF RFID wbudowanych w inteligentne etykiety, jednocześnie **drukując** kody kreskowe, grafikę i tekst na powierzchni etykiety.

### Zalety etykiet RFID

- **Odczyt bez linii wzroku** – nie wymaga bezpośredniej widoczności jak kody kreskowe
- **Masowy odczyt** – jednoczesny odczyt wielu tagów
- **Większa pojemność danych** – więcej informacji niż kod kreskowy
- **Możliwość zapisu** – dane można aktualizować
- **Trwałość** – odporność na zabrudzenia i uszkodzenia
- **Bezpieczeństwo** – możliwość szyfrowania danych

### Budowa etykiety RFID

Etykieta RFID (smart label) składa się z:

| Element | Opis |
|---------|------|
| **Transponder (inlay)** | Antena + chip IC wbudowane w etykietę |
| **Antena** | Odbiera i wysyła sygnały radiowe |
| **Chip IC** | Zawiera pamięć i logikę sterującą |
| **Warstwa drukowa** | Powierzchnia do druku termicznego |
| **Podkład (liner)** | Warstwa ochronna z tyłu |

> **Wskazówka:** Patrząc na etykietę pod światło, można zobaczyć antenę transpondera. Wybrzuszenie wskazuje lokalizację chipu IC.
`
      },
      {
        title: '2. Obsługiwane standardy RFID',
        content: `
### EPC Generation 2 Class 1 UHF

ZQ630 Plus obsługuje standard **EPC Gen 2 Class 1** – najpopularniejszy standard pasywnych tagów RFID UHF:

| Parametr | Wartość |
|----------|---------|
| Częstotliwość | UHF (860-960 MHz) |
| Standard | EPC Global Gen 2 |
| Protokół | ISO 18000-6C |
| Typ taga | Pasywny (zasilany polem RF) |
| Identyfikator EPC | 96-bit (standardowy) |
| Pamięć TID | Identyfikator producenta i modelu |
| Pamięć użytkownika | Zależna od modelu taga |

### Struktura pamięci taga Gen 2

| Bank pamięci | Zawartość | Opis |
|--------------|-----------|------|
| **Bank 0 (Reserved)** | Kill Password, Access Password | Hasła zabezpieczające |
| **Bank 1 (EPC)** | CRC, PC, EPC | Główny identyfikator produktu |
| **Bank 2 (TID)** | Tag ID | Unikalny ID producenta (tylko odczyt) |
| **Bank 3 (User)** | Dane użytkownika | Opcjonalna pamięć na dane |

### Zalety tagów Gen 2

- **Większa pojemność** – 96-bit EPC vs 64-bit w starszych tagach
- **Szybszy odczyt** – do 1000 tagów/sekundę
- **Lepsza ochrona** – szyfrowanie i hasła dostępu
- **Globalna kompatybilność** – jeden standard na całym świecie
- **Pamięć TID** – identyfikacja producenta i modelu chipa
`
      },
      {
        title: '3. Wymagania materiałowe',
        content: `
### Materiały RFID Zebra

> **Ważne:** Dla optymalnych wyników używaj wyłącznie materiałów RFID Zebra. Materiały innych producentów mogą nie przejść kalibracji RFID lub powodować niestabilne kodowanie.

### Specyfikacja materiałów RFID dla ZQ630 Plus

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | 50,8-111 mm (2-4,4") |
| Długość etykiety | 12,7-812,8 mm (0,5-32") |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość | 0,081-0,190 mm |

### Popularne materiały RFID Zebra

| Materiał | Zastosowanie |
|----------|--------------|
| **Z-Select 4000T** | Ogólne zastosowania, trwałe etykiety |
| **Z-Perform 1500T** | Ekonomiczne etykiety RFID |
| **PolyPro 3000T** | Odporne na wilgoć i chemikalia |
| **Z-Ultimate 3000T** | Ekstremalne warunki, metal |

### Przechowywanie materiałów RFID

- Temperatura: 15-25°C (59-77°F)
- Wilgotność: 40-60% RH
- Z dala od źródeł pól elektromagnetycznych
- W oryginalnym opakowaniu do momentu użycia
- Maksymalny czas przechowywania: 2 lata
`
      },
      {
        title: '4. Ładowanie materiału RFID',
        content: `
### Procedura ładowania

1. **Naciśnij przycisk zwalniający** z boku drukarki
2. **Odchyl pokrywę mediów** do tyłu
3. **Rozsuń dyski podtrzymujące**
4. **Włóż rolkę RFID** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. **Wykonaj kalibrację RFID** (patrz rozdział 5)

### Orientacja materiału

Strona do druku musi być na zewnątrz rolki. Transponder (IC) znajduje się wewnątrz rolki, pod warstwą drukową.

> **Uwaga:** Nie usuwaj etykiet z podkładu przed kalibracją. Drukarka potrzebuje pełnych etykiet do określenia parametrów RFID.
`
      },
      {
        title: '5. Kalibracja RFID',
        content: `
### Kiedy wykonać kalibrację?

Kalibrację RFID należy wykonać:

- Po załadowaniu **nowego typu** materiału RFID
- Po zmianie **rozmiaru** etykiet RFID
- Po zmianie **producenta** tagów RFID
- Po **resecie fabrycznym** drukarki
- Gdy występują **błędy kodowania**

Kalibracji **nie trzeba** wykonywać przy wymianie rolki tego samego materiału.

### Procedura kalibracji RFID

**Krok 1: Kalibracja długości etykiety**

1. Załaduj materiał RFID
2. Wejdź do menu: **TOOLS > Label Length Cal**
3. Naciśnij **OK** – drukarka wysuwa kilka etykiet
4. Poczekaj na komunikat "Calibration Complete"

**Krok 2: Kalibracja RFID**

1. Naciśnij **FEED** aby wysunąć jedną etykietę
2. Wejdź do menu: **HOME > RFID**
3. Użyj strzałek aby wybrać **RFID CALIBRATE**
4. Naciśnij **OK** aby rozpocząć

**Krok 3: Proces kalibracji**

Podczas kalibracji drukarka:
- Wolno wysuwa etykietę RFID
- Automatycznie dostosowuje pozycję programowania
- Określa optymalną moc odczytu/zapisu
- Testuje kodowanie na kilku etykietach

**Krok 4: Zakończenie**

- Po pomyślnej kalibracji: wyświetli się **"READY"**
- Usuń ewentualne testowe etykiety
- Drukarka jest gotowa do pracy

### Rozwiązywanie problemów z kalibracją

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| Kalibracja nie kończy się | Uszkodzony materiał | Wymień rolkę RFID |
| Błąd "RFID Error" | Niekompatybilny tag | Użyj materiałów Zebra |
| Niestabilne wyniki | Zakłócenia RF | Oddal od źródeł EMI |
| Słaby odczyt | Zła orientacja | Sprawdź ułożenie materiału |
`
      },
      {
        title: '6. Menu RFID',
        content: `
### Dostęp do menu RFID

1. Z ekranu głównego naciśnij **LEFT SELECT** (Home)
2. Użyj strzałek nawigacyjnych aby wybrać ikonę **RFID**
3. Naciśnij **OK** aby wejść

### Opcje menu RFID

| Opcja | Opis | Wartości |
|-------|------|----------|
| **RFID Status** | Aktualny status podsystemu RFID | Ready / Error / Not Present |
| **RFID Calibrate** | Uruchamia kalibrację RFID | Execute |
| **Read RFID Data** | Odczytuje dane z taga w pozycji druku | Execute |
| **RFID Test** | Testuje odczyt i zapis taga | Pass / Fail |
| **RFID Programming Position** | Pozycja programowania (mm od krawędzi) | -120 do +120 |
| **RFID Read Power** | Moc odczytu w dBm | 5-30 dBm |
| **RFID Write Power** | Moc zapisu w dBm | 5-30 dBm |
| **RFID Valid Count** | Licznik poprawnie zakodowanych etykiet | 0-999999 |
| **RFID Void Count** | Licznik unieważnionych etykiet | 0-999999 |

### Pozycja programowania (Programming Position)

Pozycja programowania określa, gdzie na etykiecie następuje kodowanie RFID względem linii druku głowicy.

- **Wartość dodatnia (+):** transponder przed linią druku
- **Wartość ujemna (-):** transponder za linią druku
- **Zakres:** -120 do +120 mm
- **Domyślnie:** ustawiane automatycznie podczas kalibracji

### Moc odczytu/zapisu (Read/Write Power)

| Parametr | Zakres | Domyślnie | Uwagi |
|----------|--------|-----------|-------|
| Read Power | 5-30 dBm | Auto | Wyższa = dalszy zasięg |
| Write Power | 5-30 dBm | Auto | Wyższa = stabilniejszy zapis |

> **Wskazówka:** Wartości są ustawiane automatycznie podczas kalibracji. Zmień ręcznie tylko gdy występują problemy.
`
      },
      {
        title: '7. Programowanie etykiet RFID (ZPL)',
        content: `
### Komendy ZPL do RFID

ZQ630 Plus obsługuje komendy RFID w języku ZPL. Najważniejsze polecenia:

| Komenda | Opis |
|---------|------|
| ^RF | Odczyt/zapis danych RFID |
| ^RB | Zdefiniowanie formatu RFID |
| ^RS | Ustawienia RFID (retry, void) |
| ^RW | Ustawienie mocy zapisu |
| ^RR | Ustawienie mocy odczytu |
| ^HR | Odczyt i wydruk danych RFID |
| ^HV | Weryfikacja taga |

### Przykład etykiety RFID (ZPL)

^XA
^RS8                        ; Próby kodowania: 8
^RFW,H^FD1234567890ABCDEF^FS  ; Zapis EPC (HEX)
^FO50,50^A0N,30,30^FDProduct: Widget A^FS
^FO50,90^BY2^BCN,100,Y,N,N^FD12345^FS
^XZ

Ten format:
1. Ustawia 8 prób kodowania w przypadku błędu
2. Zapisuje EPC "1234567890ABCDEF" na tagu
3. Drukuje tekst "Product: Widget A"
4. Drukuje kod kreskowy Code 128

### Przykład odczytu i druku EPC

^XA
^FO50,50^A0N,25,25^FDTag EPC:^FS
^FO50,80^A0N,25,25^HR^FS    ; Odczyt i wydruk EPC
^XZ

### Komenda ^RS – Ustawienia retry

^RSn,v,a,b,c,d

| Parametr | Opis | Wartości |
|----------|------|----------|
| n | Liczba prób kodowania | 1-10 (domyślnie 3) |
| v | Akcja po błędzie | N=brak, P=pauza, E=błąd |
| a | Pozycja VOID | 0-9999 |
| b | Długość VOID | 0-9999 |
`
      },
      {
        title: '8. Obsługa błędów RFID',
        content: `
### Proces kodowania z obsługą błędów

Gdy tag RFID nie może zostać zakodowany:

1. Drukarka drukuje **"VOID"** na etykiecie
2. Etykieta jest wysuwana
3. Drukarka próbuje zakodować następny tag
4. Po przekroczeniu limitu prób – wykonuje zdefiniowaną akcję

### Kody błędów RFID

| Kod | Komunikat | Przyczyna | Rozwiązanie |
|-----|-----------|-----------|-------------|
| E001 | RFID Not Present | Brak modułu RFID | Skontaktuj się z serwisem |
| E002 | RFID Read Error | Błąd odczytu taga | Sprawdź materiał |
| E003 | RFID Write Error | Błąd zapisu taga | Zwiększ moc zapisu |
| E004 | RFID Verify Error | Błąd weryfikacji | Wykonaj kalibrację |
| E005 | RFID Calibration Fail | Błąd kalibracji | Użyj materiałów Zebra |
| E006 | Tag Not Found | Brak taga w pozycji | Sprawdź pozycję programowania |

### Najczęstsze problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| VOID na wszystkich etykietach | Zły materiał | Użyj materiałów Zebra |
| | Brak kalibracji | Wykonaj kalibrację RFID |
| | Zbyt niska moc | Zwiększ Write Power |
| Losowe błędy kodowania | Zakłócenia EMI | Oddal od źródeł zakłóceń |
| | Słaba jakość tagów | Wymień materiał |
| Odczyt sąsiednich tagów | Za wysoka moc | Zmniejsz Read Power |
| Wolne kodowanie | Za dużo prób | Zmniejsz retry w ^RS |
`
      },
      {
        title: '9. Komendy SGD dla RFID',
        content: `
### Set-Get-Do Commands

Komendy SGD umożliwiają zaawansowaną konfigurację RFID przez port szeregowy lub Zebra Setup Utilities.

### Podstawowe komendy RFID SGD

| Komenda | Opis | Wartości |
|---------|------|----------|
| rfid.error.response | Status błędu RFID | Odczyt |
| rfid.tag.calibrate | Kalibracja RFID | Execute / Restore |
| rfid.tag.read.content | Zawartość odczytu | EPC / TID / USER |
| rfid.tag.read.execute | Wykonaj odczyt | Execute |
| rfid.tag.test | Wynik testu | Pass / Fail |
| rfid.tag.test.execute | Wykonaj test | Execute |
| rfid.position.program | Pozycja programowania | -120 do +120 |
| rfid.reader_1.power.read | Moc odczytu | 5-30 |
| rfid.reader_1.power.write | Moc zapisu | 5-30 |

### Komendy liczników RFID

| Komenda | Opis |
|---------|------|
| odometer.rfid.valid_resettable | Licznik poprawnych (resetowalny) |
| odometer.rfid.void_resettable | Licznik VOID (resetowalny) |
| odometer.rfid.valid_lifetime | Licznik poprawnych (całkowity) |
| odometer.rfid.void_lifetime | Licznik VOID (całkowity) |

### Przykłady użycia SGD

**Odczyt pozycji programowania:**
! U1 getvar "rfid.position.program"

**Ustawienie mocy zapisu na 25 dBm:**
! U1 setvar "rfid.reader_1.power.write" "25"

**Wykonanie kalibracji:**
! U1 do "rfid.tag.calibrate" "execute"

**Reset licznika VOID:**
! U1 setvar "odometer.rfid.void_resettable" "0"
`
      },
      {
        title: '10. Integracja z systemami',
        content: `
### Popularne platformy RFID

ZQ630 Plus jest kompatybilny z:

- **Zebra Savanna** – platforma chmurowa IoT
- **Zebra DNA** – oprogramowanie mobilne
- **SAP EWM** – zarządzanie magazynem
- **Oracle WMS** – system magazynowy
- **Manhattan Associates** – łańcuch dostaw
- **Blue Yonder** – optymalizacja łańcucha dostaw

### Sterowniki i SDK

| Narzędzie | Zastosowanie |
|-----------|--------------|
| **Zebra Designer** | Projektowanie etykiet RFID |
| **ZebraNet Bridge** | Zarządzanie flotą drukarek |
| **Multiplatform SDK** | Integracja z aplikacjami |
| **OPOS Driver** | Systemy POS |
| **JPOS Driver** | Aplikacje Java |

### Formaty danych EPC

| Format | Opis | Zastosowanie |
|--------|------|--------------|
| **SGTIN-96** | Serialized GTIN | Produkty detaliczne |
| **SSCC-96** | Serial Shipping Container | Palety, kontenery |
| **GRAI-96** | Global Returnable Asset | Zasoby zwrotne |
| **GIAI-96** | Global Individual Asset | Środki trwałe |
| **GSRN-96** | Global Service Relation | Usługi, subskrypcje |
`
      },
      {
        title: '11. Konserwacja modułu RFID',
        content: `
### Harmonogram konserwacji

| Element | Częstotliwość | Czynność |
|---------|---------------|----------|
| Antena RFID | Co miesiąc | Wizualna kontrola |
| Kalibracja | Po zmianie materiału | Wykonaj kalibrację |
| Firmware | Kwartalnie | Sprawdź aktualizacje |
| Liczniki | Tygodniowo | Monitoruj VOID rate |

### Wskaźniki wydajności RFID

Monitoruj następujące wskaźniki:

| Wskaźnik | Wartość docelowa | Akcja przy przekroczeniu |
|----------|------------------|--------------------------|
| VOID rate | < 1% | Sprawdź materiał/kalibrację |
| Retry rate | < 5% | Dostosuj moc zapisu |
| Read failures | < 0.1% | Sprawdź antenę |

### Obliczanie VOID rate

VOID rate = (VOID Count / Total Labels) x 100%

Przykład:
VOID Count = 5
Total Labels = 1000
VOID rate = 0.5% (akceptowalny)
`
      },
      {
        title: '12. Specyfikacje techniczne RFID',
        content: `
### Moduł RFID ZQ630 Plus

| Parametr | Wartość |
|----------|---------|
| Standard | EPC Global Gen 2 |
| Protokół | ISO 18000-6C |
| Częstotliwość | UHF 860-960 MHz |
| Moc wyjściowa | 5-30 dBm (regulowana) |
| Typ anteny | Wbudowana, liniowa |
| Pozycja kodowania | Regulowana +-120 mm |
| Obsługiwana pamięć | EPC, TID, User, Reserved |
| Max EPC | 496 bitów |
| Max User Memory | Zależna od taga |

### Obsługiwane typy tagów

| Producent | Model | EPC | User Memory |
|-----------|-------|-----|-------------|
| Impinj | Monza 4 | 96/128 bit | 32 bit |
| Impinj | Monza R6 | 96 bit | 0 bit |
| NXP | UCODE 7 | 96/128 bit | 32 bit |
| NXP | UCODE 8 | 96/128 bit | 128 bit |
| Alien | Higgs 3 | 96 bit | 512 bit |
| Alien | Higgs 4 | 96 bit | 128 bit |

### Zgodność z regulacjami

| Region | Częstotliwość | Standard |
|--------|---------------|----------|
| Europa (ETSI) | 865-868 MHz | EN 302 208 |
| USA (FCC) | 902-928 MHz | FCC Part 15 |
| Japonia | 916-921 MHz | ARIB STD-T106 |
| Chiny | 920-925 MHz | GB/T 29768 |
| Australia | 918-926 MHz | AS/NZS 4268 |
`
      },
      {
        title: '13. Rozwiązywanie problemów RFID',
        content: `
### Diagnostyka krok po kroku

**1. Sprawdź status RFID:**
Menu: HOME > RFID > RFID Status
Oczekiwany wynik: "Ready"

**2. Wykonaj test RFID:**
Menu: HOME > RFID > RFID Test
Oczekiwany wynik: "Pass"

**3. Sprawdź liczniki:**
Menu: HOME > RFID > RFID Valid Count
Menu: HOME > RFID > RFID Void Count
Oblicz VOID rate

**4. Zweryfikuj kalibrację:**
Menu: HOME > RFID > RFID Calibrate
Wykonaj ponowną kalibrację

### Tabela diagnostyczna

| Objaw | Test | Rozwiązanie |
|-------|------|-------------|
| Status "Not Present" | Sprawdź konfigurację | Skontaktuj się z serwisem |
| Status "Error" | Wykonaj test RFID | Wykonaj kalibrację |
| Test "Fail" | Sprawdź materiał | Wymień na materiał Zebra |
| Wysoki VOID rate | Sprawdź moc zapisu | Zwiększ Write Power |
| Wolne kodowanie | Sprawdź retry | Zmniejsz liczbę prób |

### Kiedy skontaktować się z serwisem?

- Status RFID ciągle pokazuje "Not Present" lub "Error"
- Test RFID zawsze kończy się niepowodzeniem z materiałami Zebra
- Fizyczne uszkodzenie anteny lub modułu
- VOID rate > 10% mimo kalibracji i wymiany materiału
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania o RFID',
        content: `
### Czym jest RFID i do czego służy?

**Odpowiedź:** RFID (Radio Frequency Identification) to technologia **bezprzewodowej identyfikacji obiektów** za pomocą fal radiowych. Pozwala na odczyt wielu tagów jednocześnie, bez linii wzroku, i umożliwia zapis/aktualizację danych.

### Jaki standard RFID obsługuje ZQ630 Plus?

**Odpowiedź:** ZQ630 Plus obsługuje standard **EPC Generation 2 Class 1 UHF** zgodny z protokołem **ISO 18000-6C**. Jest to najpopularniejszy globalny standard pasywnych tagów RFID.

### Kiedy należy wykonać kalibrację RFID?

**Odpowiedź:** Kalibrację RFID wykonaj po: załadowaniu **nowego typu materiału**, zmianie **rozmiaru etykiet**, zmianie **producenta tagów**, **resecie fabrycznym** lub gdy występują **błędy kodowania**.

### Co oznacza "VOID" na etykiecie RFID?

**Odpowiedź:** "VOID" oznacza, że **tag RFID nie mógł zostać zakodowany**. Drukarka drukuje VOID, wysuwa etykietę i próbuje kodować kolejną. Sprawdź materiał i wykonaj kalibrację.

### Jak zwiększyć skuteczność kodowania RFID?

**Odpowiedź:** Użyj **materiałów RFID Zebra**, wykonaj **kalibrację RFID**, zwiększ **moc zapisu (Write Power)** w menu RFID, oddal drukarkę od **źródeł zakłóceń EMI**.

### Jakie materiały RFID są obsługiwane?

**Odpowiedź:** ZQ630 Plus obsługuje materiały RFID o szerokości **50,8-111 mm**. Zalecane materiały Zebra: Z-Select 4000T, Z-Perform 1500T, PolyPro 3000T, Z-Ultimate 3000T.

### Co to jest pozycja programowania (Programming Position)?

**Odpowiedź:** Pozycja programowania określa **odległość transpondera od linii druku** (w mm). Zakres: -120 do +120 mm. Ustawiana automatycznie podczas kalibracji.

### Jak odczytać dane z taga RFID?

**Odpowiedź:** W menu: **HOME > RFID > Read RFID Data**. Lub użyj komendy ZPL **^HR** do odczytu i wydruku EPC na etykiecie.

### Jaka powinna być wartość VOID rate?

**Odpowiedź:** Akceptowalny **VOID rate < 1%**. Jeśli przekracza 1%, sprawdź materiał, wykonaj kalibrację lub zwiększ moc zapisu.

### Jakie chipy RFID są obsługiwane?

**Odpowiedź:** Obsługiwane są popularne chipy: **Impinj Monza 4/R6**, **NXP UCODE 7/8**, **Alien Higgs 3/4**. Tagi muszą być zgodne z EPC Gen 2.

### Jak zresetować liczniki RFID?

**Odpowiedź:** Użyj komendy SGD: ! U1 setvar "odometer.rfid.void_resettable" "0" lub ! U1 setvar "odometer.rfid.valid_resettable" "0"

### Jakie są częstotliwości RFID w różnych regionach?

**Odpowiedź:** Europa (ETSI): **865-868 MHz**, USA (FCC): **902-928 MHz**, Japonia: **916-921 MHz**. ZQ630 Plus automatycznie dostosowuje się do regionu.

### Czy mogę używać materiałów RFID innych producentów?

**Odpowiedź:** **Nie zalecane.** Materiały innych producentów mogą nie przejść kalibracji lub powodować niestabilne kodowanie. Dla optymalnych wyników używaj materiałów Zebra.
`
      }
    ]
  },

  'zd510': {
    model: 'ZD510',
    title: 'Zebra ZD510 – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZD510 Wristband Printing Solution User Guide',
    keywords: [
      'zebra zd510 instrukcja', 'zd510 instrukcja po polsku', 'zebra zd510 manual',
      'drukarka opasek zebra', 'zd510 opaski na nadgarstek', 'zd510 healthcare',
      'zd510 kartridż', 'zd510 szpital', 'zd510 identyfikacja pacjentów',
      'drukarka opasek identyfikacyjnych', 'zd510 wristband', 'zd510 specyfikacja',
      'zd510 konfiguracja', 'zd510 czyszczenie', 'zd510 błędy', 'zd510 wifi',
      'zd510 bluetooth', 'zd510 nfc', 'zd510 link-os', 'opaski szpitalne zebra',
      'identyfikacja pacjentów', 'opaski noworodkowe', 'centra krwiodawstwa'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZD510

Zebra ZD510 to specjalistyczna drukarka opasek identyfikacyjnych na nadgarstek, zaprojektowana z myślą o placówkach ochrony zdrowia. Wykorzystuje innowacyjny **system kartridżów**, który umożliwia szybką i łatwą wymianę materiałów bez bezpośredniego kontaktu z opaskami. Drukarka automatycznie ładuje materiał, kalibruje się i przygotowuje do druku po włożeniu kartridża. Obudowa drukarki jest odporna na działanie środków czyszczących stosowanych w szpitalach, a zasilacz posiada certyfikację medyczną.

### Parametry techniczne

| Parametr | ZD510 |
|----------|-------|
| **Technologia druku** | Termiczny bezpośredni (Direct Thermal) |
| **Rozdzielczość** | 300 dpi (12 punktów/mm) |
| Szerokość druku | Określona przez kartridż |
| Prędkość druku | Określona przez kartridż |
| Pamięć Flash | 512 MB |
| Pamięć RAM | 256 MB |
| Szerokość opaski | 25,4 mm (1") |
| System zasilania materiałem | Kartridż z opaskami |

### Cechy charakterystyczne

- **System kartridży** – automatyczne ładowanie i kalibracja
- **Obudowa odporna na środki dezynfekujące** – przystosowana do środowiska medycznego
- **Zasilacz z certyfikatem medycznym** – zgodność z normami dla urządzeń medycznych
- **Link-OS** – platforma do zarządzania i integracji
- **Bluetooth Low Energy (BTLE)** – konfiguracja przez urządzenia mobilne
- **Zebra Print Touch (NFC)** – szybkie parowanie przez zbliżenie (opcja)
- **USB Host** – łatwa aktualizacja firmware przez pendrive
- **Ethernet 10/100** – wbudowany serwer wydruku
- **Opcjonalne Wi-Fi i Bluetooth Classic** – bezprzewodowa łączność

### Zastosowania ZD510

- **Szpitale:** identyfikacja pacjentów, opaski identyfikacyjne
- **Laboratoria:** oznaczanie próbek krwi i materiału biologicznego
- **Centra krwiodawstwa:** identyfikacja dawców
- **Izby przyjęć:** szybka rejestracja pacjentów
- **Oddziały noworodkowe:** opaski identyfikacyjne dla niemowląt i matek
- **Domy opieki:** identyfikacja pensjonariuszy

### Złącza i łączność

- USB 2.0 (standard)
- Ethernet 10/100 RJ-45 (standard)
- USB Host (standard)
- Wi-Fi 802.11ac + Bluetooth Classic 4.1 (opcja fabryczna)
- Bluetooth Low Energy (BTLE) – do konfiguracji mobilnej (opcja)
- NFC (Zebra Print Touch) – do szybkiego parowania (opcja)
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZD510
- Zasilacz z certyfikatem medycznym
- Przewód zasilający (zależny od regionu)
- Dokumentacja drukarki
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** solidna, pozioma, wystarczająca do utrzymania drukarki
- **Przestrzeń:** pozostaw wolną przestrzeń wokół drukarki dla wentylacji i dostępu do złączy
- **Zasilanie:** łatwy dostęp do gniazdka elektrycznego
- **Środowisko:** unikaj bezpośredniego światła słonecznego i źródeł ciepła

> **Ważne:** Nie umieszczaj materiałów ani podkładek pod drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Podłączanie zasilania

1. Podłącz zasilacz do gniazda DC drukarki
2. Włóż przewód zasilający do zasilacza
3. Podłącz przewód zasilający do gniazdka sieciowego
4. Zielona dioda na zasilaczu wskazuje prawidłowe podłączenie

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | 0°C do +40°C | 20-85% bez kondensacji |
| Przechowywanie | -40°C do +60°C | 5-85% bez kondensacji |
`
      },
      {
        title: '3. Panel sterowania',
        content: `
### Elementy panelu sterowania

Panel sterowania znajduje się na górnej przedniej części drukarki i zawiera trzy grupy wskaźników świetlnych oraz dwa przyciski.

### Wskaźniki świetlne

| Wskaźnik | Opis |
|----------|------|
| **Status mediów** | Informuje o stanie materiału w kartridżu |
| **Status drukarki** | Zewnętrzny pierścień – główny wskaźnik stanu |
| **Status Wi-Fi** | Informuje o połączeniu bezprzewodowym (jeśli zainstalowane) |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **EJECT** | Wysuwa kartridż (krótkie naciśnięcie) / wymuszony wysuw (przytrzymanie 6 sek.) |
| **PAUSE/FEED** | Pauza drukowania / wysuw materiału / tryb konfiguracji użytkownika |

### Znaczenie wzorów świetlnych

| Wzór | Znaczenie |
|------|-----------|
| Pierścień zielony (stały) | Drukarka gotowa do pracy |
| Pierścień zielony (2 mignięcia) | Drukarka wstrzymana (pauza) |
| Pierścień zielony + Media pomarańczowy | Niski poziom materiału (~20 opasek) |
| Oba wskaźniki migają pomarańczowo | Brak materiału lub błąd kartridża |
| Obracające się zielone światło | Transfer danych |
| Pierścień pomarańczowy (stały) | Alert temperatury |
| Obracające się żółte światła | Wyłączenie termiczne głowicy |

### Tryb konfiguracji użytkownika

Przytrzymaj przycisk PAUSE/FEED – wskaźnik będzie migać pomarańczowo co 2 sekundy:

| Liczba mignięć | Akcja po zwolnieniu przycisku |
|----------------|-------------------------------|
| 1 | Drukuje raport konfiguracji |
| 2 | Drukuje profil czujnika mediów |
| 3 | Resetuje parametry sieciowe do domyślnych |
| 4 | Resetuje wszystkie parametry drukarki do domyślnych |
`
      },
      {
        title: '4. Ładowanie kartridża z opaskami',
        content: `
### O kartridżach Zebra

Kartridże Zebra są zaprojektowane tak, aby maksymalnie uprościć obsługę drukarki:

- **Automatyczna autentykacja** – drukarka weryfikuje oryginalność kartridża
- **Automatyczne ustawienia** – parametry druku są odczytywane z chipa Smart Card
- **Brak kontaktu z materiałem** – operator nie dotyka opasek podczas wymiany
- **Automatyczne ładowanie** – drukarka sama przygotowuje materiał do druku

### Ładowanie kartridża

1. **Włącz drukarkę** – naciśnij przycisk zasilania z tyłu urządzenia
2. **Poczekaj na inicjalizację** – wskaźniki będą migać, a następnie pokażą pomarańczowy (brak materiału)
3. **Zorientuj kartridż** – chip Smart Card powinien być skierowany w dół, w stronę drukarki
4. **Włóż kartridż** – naciśnij w środkowej części aż usłyszysz kliknięcie
5. **Poczekaj na załadowanie** – drukarka automatycznie załaduje opaskę do pozycji druku
6. **Gotowe** – pierścień statusu świeci na zielono

> **Uwaga:** Używaj wyłącznie oryginalnych kartridży Zebra. Kartridże nie mogą być napełniane ani przerabiane.

### Wskazówki dotyczące kartridży

- **Nie ciągnij materiału** z kartridża – może to uszkodzić mechanizm
- **Przechowuj w opakowaniu** aż do użycia
- **Jeśli materiał wystaje** z kartridża, odetnij go nożyczkami przed włożeniem
- **Sprawdzaj datę ważności** – materiały termiczne mają określony okres przydatności

### Wyjmowanie kartridża

1. Naciśnij przycisk **EJECT**
2. Drukarka automatycznie wcofa materiał i wysunie kartridż
3. Wyjmij kartridż z drukarki
`
      },
      {
        title: '5. Otwieranie górnej pokrywy',
        content: `
### Kiedy otwierać pokrywę

Górna pokrywa nie wymaga otwierania podczas normalnej pracy. Otwórz ją w przypadku:

- **Konserwacji** – czyszczenie ścieżki mediów, głowicy i wałka
- **Rozwiązywania problemów** – kartridż nie może prawidłowo wycofać materiału
- **Wymuszonego wysunięcia** – po przytrzymaniu EJECT przez 6 sekund

### Otwieranie pokrywy

1. Naciśnij jednocześnie oba przyciski zwalniające pokrywę (po bokach drukarki)
2. Pokrywa odskoczy częściowo
3. Podnieś pokrywę do góry i odchyl do tyłu
4. Uzyskujesz dostęp do głowicy drukującej, wałka i czujników

### Ręczne wyjmowanie kartridża (bez zasilania)

1. Wyłącz drukarkę i odłącz zasilanie
2. Obróć drukarkę spodem do góry
3. Włóż płaski śrubokręt w środkowy otwór na spodzie drukarki
4. Pchnij języczek zwalniający w kierunku tyłu drukarki
5. Obróć drukarkę i wyjmij kartridż
6. Jeśli materiał wystaje, otwórz pokrywę aby go uwolnić
`
      },
      {
        title: '6. Strefa druku na opasce',
        content: `
### Zalecana strefa druku

Nie wszystkie obszary opaski nadają się do druku. Aby uzyskać optymalne wyniki:

| Parametr | Wartość |
|----------|---------|
| Początek strefy druku | 25 mm (1") od krawędzi wiodącej |
| Odległość od krawędzi bocznych | Min. 1,2 mm (0,05") |
| Strefa nadruku | Zależna od typu i długości opaski |

### Zalecana pozycja startowa druku

| Typ opaski | Długość | Pozycja startowa od krawędzi wiodącej |
|------------|---------|---------------------------------------|
| Zamknięcie klejone | 279 mm (11") | 114 mm (4,5") |
| Zamknięcie klejone | 178 mm (7") | 64 mm (2,5") |
| Zamknięcie klejone | 152 mm (6") | 51 mm (2") |
| Zamknięcie klipsem | 279 mm (11") | 159 mm (6,25") |
| Zamknięcie klipsem | 178 mm (7") | 83 mm (3,25") |

> **Uwaga:** Unikaj drukowania na obszarach z otworami, nacięciami lub niepowlekanymi fragmentami opaski.
`
      },
      {
        title: '7. Zebra Print Touch (NFC)',
        content: `
### O funkcji Print Touch

Zebra Print Touch umożliwia sparowanie drukarki z urządzeniem mobilnym wyposażonym w NFC (Android) przez zbliżenie telefonu do logo Print Touch na obudowie drukarki.

### Dane zakodowane w tagu NFC

- URL do strony wsparcia Zebra QuickHelp
- Adres MAC Bluetooth Low Energy (jeśli zainstalowany)
- Adres MAC Bluetooth Classic (jeśli zainstalowany)
- Adres MAC Wi-Fi (jeśli zainstalowany)
- Adres MAC Ethernet
- SKU drukarki (np. ZD42022-D01W01EZ)
- Numer seryjny drukarki

### Zastosowania NFC

- Ułatwienie parowania Bluetooth z urządzeniem mobilnym
- Uruchomienie aplikacji
- Otwarcie strony internetowej w przeglądarce mobilnej
`
      },
      {
        title: '8. Konfiguracja i ustawienia',
        content: `
### Metody dostępu do ustawień

- **Strony WWW serwera wydruku** – przez przeglądarkę internetową
- **Zebra Setup Utility** – aplikacja Windows
- **Sterownik Zebra Windows**
- **ZebraNet Bridge** – narzędzie do zarządzania drukarkami
- **Aplikacje mobilne Link-OS**

### Dostęp przez stronę WWW

1. Upewnij się, że drukarka jest podłączona do sieci Ethernet
2. Wydrukuj raport konfiguracji, aby uzyskać adres IP
3. Wpisz adres IP drukarki w przeglądarce
4. Domyślne dane logowania:
   - **User ID:** admin
   - **Password:** 1234

### Najczęściej używane ustawienia

| Parametr | Opis | Domyślna wartość |
|----------|------|------------------|
| DARKNESS | Ciemność druku | 21 (zakres 0-30) |
| DARKNESS MODE | Tryb ciemności | CARTRIDGE |
| TEAR OFF | Pozycja odrywania | +000 |
| LABEL TOP | Pozycja pionowa obrazu | +000 |
| LEFT POSITION | Pozycja pozioma obrazu | +0000 |

### Tryby ciemności druku

| Tryb | Opis |
|------|------|
| CARTRIDGE | Ciemność ustawiana przez kartridż (domyślne) |
| USER | Ciemność ustawiana przez użytkownika |
| RELATIVE | Różnica względem domyślnej wartości kartridża |
`
      },
      {
        title: '9. Podłączenie do komputera',
        content: `
### Instalacja sterowników (Windows)

1. Pobierz **Zebra Setup Utilities** ze strony zebra.com
2. Zainstaluj oprogramowanie **PRZED** podłączeniem drukarki
3. Podłącz drukarkę kablem USB lub przez sieć
4. Postępuj zgodnie z kreatorem konfiguracji

### Połączenie USB

1. Podłącz kabel USB do drukarki
2. Podłącz drugi koniec do komputera
3. Windows automatycznie rozpozna drukarkę (jeśli sterowniki są zainstalowane)

### Połączenie Ethernet (przewodowe)

1. Podłącz kabel Ethernet (RJ-45) do drukarki
2. Drukarka automatycznie uzyska adres IP przez DHCP
3. Wydrukuj raport konfiguracji, aby poznać adres IP

### Wskaźniki Ethernet

| Diody LED | Znaczenie |
|-----------|-----------|
| Obie wyłączone | Brak połączenia Ethernet |
| Zielona | Połączenie 100 Mbps |
| Zielona + migająca bursztynowa | Połączenie 100 Mbps z aktywnością |
| Bursztynowa | Połączenie 10 Mbps |
| Bursztynowa + migająca zielona | Połączenie 10 Mbps z aktywnością |

### Konfiguracja Wi-Fi (opcja)

1. Użyj **Zebra Setup Utilities** > Connectivity Wizard
2. Wybierz **Wireless** jako typ połączenia
3. Wprowadź ESSID (nazwę sieci)
4. Skonfiguruj zabezpieczenia (WPA2, itp.)
5. Wyślij konfigurację do drukarki
6. Zrestartuj drukarkę
`
      },
      {
        title: '10. Weryfikacja działania',
        content: `
### Drukowanie raportu konfiguracji

1. Upewnij się, że drukarka jest gotowa (zielony wskaźnik)
2. Przytrzymaj przycisk **PAUSE/FEED**
3. Zwolnij po pierwszym pomarańczowym mignięciu
4. Drukarka wydrukuje raport konfiguracji

### Zawartość raportu konfiguracji

- TEAR OFF ADJUST – pozycja odrywania
- USB COMM – status połączenia USB
- BLUETOOTH ADDRESS – adres Bluetooth (jeśli zainstalowany)
- FIRMWARE – wersja oprogramowania
- IP ADDRESS – adres IP (dla połączeń sieciowych)
- MAC ADDRESS – adres fizyczny interfejsu sieciowego

### Test druku z Windows

1. Otwórz **Drukarki i urządzenia** w Panelu sterowania
2. Kliknij prawym przyciskiem na drukarkę Zebra
3. Wybierz **Właściwości** > **Drukuj stronę testową**
`
      },
      {
        title: '11. Konserwacja',
        content: `
### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Ścieżka mediów | Co wymianę kartridża lub w razie problemów z jakością |
| Głowica drukująca | Co wymianę kartridża |
| Wałek dociskowy (platen) | Co wymianę kartridża |
| Czujnik mediów | W razie problemów z wykrywaniem materiału |
| Styki Smart Card | W razie problemów z rozpoznawaniem kartridża |
| Obudowa zewnętrzna | W razie potrzeby |

### Materiały do czyszczenia

- Karty czyszczące Zebra
- Waciki bezpyłowe
- Alkohol izopropylowy (90%+)
- Ściereczka bezpyłowa

### Czyszczenie ścieżki mediów (kartą czyszczącą)

1. Wyjmij kartridż z drukarki
2. Włóż kartę czyszczącą do szczeliny kartridża
3. Naciśnij przycisk PAUSE/FEED aby przeprowadzić kartę
4. Powtórz 2-3 razy
5. Poczekaj na wyschnięcie przed włożeniem kartridża

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj na ostygnięcie.

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przetrzyj brązowy pasek elementów grzejnych wacikiem nasączonym alkoholem
4. Poczekaj aż wyschnie przed zamknięciem pokrywy

### Czyszczenie styków Smart Card

1. Użyj wacika zwilżonego alkoholem
2. Przetrzyj złote styki czytnika w szczelinie kartridża
3. Poczekaj aż wyschnie przed włożeniem kartridża
`
      },
      {
        title: '12. Rozwiązywanie problemów',
        content: `
### Alerty i rozwiązania

| Alert | Wskaźniki | Przyczyna | Rozwiązanie |
|-------|-----------|-----------|-------------|
| Pokrywa otwarta | Czerwone miganie | Pokrywa nie jest zamknięta | Zamknij pokrywę i naciśnij PAUSE/FEED |
| Brak materiału | Pomarańczowe miganie | Kartridż pusty lub błąd | Wymień kartridż |
| Alert temperatury | Pomarańczowy stały | Temp. poza zakresem | Poczekaj na normalizację temperatury |
| Wyłączenie termiczne | Żółte obracające się | Przegrzanie głowicy | Poczekaj na ostygnięcie |
| Błąd pamięci | Pomarańczowe 2 mignięcia | Błąd danych lub brak pamięci | Sprawdź format lub zwolnij pamięć |

### Problemy z jakością druku

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| Słaby/wyblakły druk | Brudna głowica | Wyczyść głowicę |
| | Zbyt niska ciemność | Zwiększ ciemność (tryb USER) |
| Brakujące fragmenty | Uszkodzona głowica | Wymień głowicę |
| | Zanieczyszczenia | Wyczyść ścieżkę mediów |
| Zniekształcony wydruk | Błąd komunikacji | Sprawdź kable i ustawienia |
| Ciemny wydruk | Wysoka temp./wilgotność | Zmniejsz ciemność |

### Problemy z kartridżem

| Problem | Rozwiązanie |
|---------|-------------|
| Kartridż nie jest rozpoznawany | Wyczyść styki Smart Card |
| | Sprawdź czy kartridż jest oryginalny Zebra |
| Materiał wciąga się do kartridża | Otwórz kartridż i wyciągnij materiał |
| Chip odłączył się od kartridża | Wciśnij chip z powrotem i zamknij zatrzaski |
| Kartridż nie wysuwa się | Użyj ręcznego wysuwu (śrubokręt) |

### Przywracanie ustawień fabrycznych

**Ustawienia sieciowe:**
Przytrzymaj PAUSE/FEED - zwolnij po 3 pomarańczowych mignięciach

**Wszystkie ustawienia:**
Przytrzymaj PAUSE/FEED - zwolnij po 4 pomarańczowych mignięciach
`
      },
      {
        title: '13. USB Host',
        content: `
### Zastosowania portu USB Host

- **Aktualizacja firmware** – z pendrive'a
- **Transfer plików** – kopiowanie formatów, czcionek, grafik
- **Urządzenia wejściowe** – podłączenie klawiatury lub skanera

### Aktualizacja firmware przez USB

1. Na pendrive'ie utwórz folder **Zebra** z podfolderami:
   - /appl (firmware)
   - /commands (polecenia)
   - /files (pliki)
2. Umieść plik firmware w folderze /appl
3. Włóż pendrive do portu USB Host
4. Drukarka automatycznie zaktualizuje firmware
5. Po restarcie wydrukuj raport konfiguracji

> **Uwaga:** Pendrive musi być sformatowany w systemie FAT. Maksymalna pojemność: 1 TB.
`
      },
      {
        title: '14. Specyfikacje',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 121 mm (4,8") |
| Głębokość | 238 mm (9,4") |
| Wysokość | 170 mm (6,7") |
| Waga | ~1,6 kg (bez kartridża) |

### Druk

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termiczny bezpośredni |
| Rozdzielczość | 300 dpi (12 punktów/mm) |
| Szerokość druku | Określona przez kartridż |
| Prędkość druku | Określona przez kartridż |

### Pamięć

| Parametr | Wartość |
|----------|---------|
| RAM | 256 MB |
| Flash | 512 MB |

### Łączność (standard)

| Parametr | Wartość |
|----------|---------|
| USB 2.0 | Tak |
| Ethernet | 10/100 Base-T (RJ-45) |
| USB Host | Tak |

### Łączność (opcja fabryczna)

| Parametr | Wartość |
|----------|---------|
| Wi-Fi | 802.11ac |
| Bluetooth Classic | 4.1 (kompatybilny z 3.0) |
| Bluetooth Low Energy | BTLE (do konfiguracji) |
| NFC | Zebra Print Touch |

### Środowisko

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | 0°C do +40°C | 20-85% bez kondensacji |
| Przechowywanie | -40°C do +60°C | 5-85% bez kondensacji |

### Certyfikaty

- FCC Class B
- CE
- Zasilacz z certyfikatem medycznym
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym jest drukarka ZD510?

**Odpowiedź:** Zebra ZD510 to specjalistyczna **drukarka opasek identyfikacyjnych na nadgarstek** dla służby zdrowia. Wykorzystuje system kartridżów z automatycznym ładowaniem i kalibracją.

### Do czego służy drukarka ZD510?

**Odpowiedź:** ZD510 służy do drukowania **opasek identyfikacyjnych** dla pacjentów w szpitalach, laboratoriach, centrach krwiodawstwa, na izbach przyjęć i oddziałach noworodkowych.

### Jak załadować kartridż do ZD510?

**Odpowiedź:** Włącz drukarkę, zorientuj kartridż (chip Smart Card w dół), włóż kartridż i naciśnij aż kliknie. Drukarka **automatycznie załaduje** materiał. Zielony wskaźnik = gotowość.

### Czy mogę używać kartridży innych producentów?

**Odpowiedź:** **Nie.** ZD510 wymaga oryginalnych kartridży Zebra. Drukarka automatycznie weryfikuje oryginalność kartridża przez chip Smart Card.

### Jak wydrukować raport konfiguracji?

**Odpowiedź:** Przytrzymaj **PAUSE/FEED** i zwolnij po **pierwszym pomarańczowym mignięciu**. Raport zawiera adres IP, MAC, wersję firmware.

### Co oznacza pomarańczowe miganie?

**Odpowiedź:** Pomarańczowe miganie oznacza **brak materiału** lub **błąd kartridża**. Wymień lub ponownie włóż kartridż.

### Jak wyczyścić drukarkę ZD510?

**Odpowiedź:** Używaj **kart czyszczących Zebra** – włóż kartę w szczelinę kartridża i naciśnij PAUSE/FEED. Do głowicy używaj wacików z alkoholem izopropylowym (90%+).

### Jak zresetować drukarkę do ustawień fabrycznych?

**Odpowiedź:** Przytrzymaj **PAUSE/FEED** i zwolnij po **4 pomarańczowych mignięciach** (reset wszystkich ustawień) lub po 3 mignięciach (reset sieci).

### Czy ZD510 ma certyfikat medyczny?

**Odpowiedź:** Tak, **zasilacz ZD510 ma certyfikat medyczny**. Obudowa jest odporna na środki dezynfekujące stosowane w placówkach medycznych.

### Jak wyjąć zacięty kartridż?

**Odpowiedź:** Przytrzymaj **EJECT przez 6 sekund** (wymuszony wysuw). Jeśli nie pomoże – obróć drukarkę spodem do góry i użyj śrubokręta w środkowym otworze.

### Jak skonfigurować Wi-Fi w ZD510?

**Odpowiedź:** Użyj **Zebra Setup Utilities** > Connectivity Wizard > Wireless. Wprowadź ESSID i ustawienia zabezpieczeń, wyślij konfigurację i zrestartuj drukarkę.

### Gdzie na opasce drukować?

**Odpowiedź:** Zacznij druk **min. 25 mm od krawędzi wiodącej**. Unikaj obszarów z otworami, nacięciami i niepowlekanymi fragmentami. Zachowaj min. 1,2 mm od krawędzi bocznych.
`
      }
    ]
  },

  'zc100': {
    model: 'ZC100',
    title: 'Zebra ZC100 – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZC100 Card Printer User Guide',
    keywords: [
      'zebra zc100 instrukcja', 'zc100 instrukcja po polsku', 'zebra zc100 manual',
      'drukarka kart zebra', 'zc100 drukarka kart id', 'zc100 konfiguracja',
      'zc100 taśma', 'zc100 enkoder magnetyczny', 'zc100 karta inteligentna',
      'drukarka kart identyfikacyjnych', 'zc100 specyfikacja', 'zc100 led',
      'zc100 czyszczenie', 'zc100 błędy', 'zc100 wifi', 'zc100 ethernet',
      'druk kart pvc', 'sublimacja barwników', 'ymcko', 'cr80', 'cr70',
      'karty id', 'identyfikatory', 'przepustki', 'karty dostępu'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZC100

Zebra ZC100 to kompaktowa jednostronna drukarka kart identyfikacyjnych, zaprojektowana do druku pełnokolorowego metodą sublimacji barwników (dye sublimation) lub monochromatycznego druku termotransferowego. Obsługuje standardowe karty PVC i PVC-composite w formatach CR70 (52x84 mm) i CR80 (54x86 mm) o grubości 10-40 mil. Drukarka wyposażona jest w podajnik na 100 kart, zintegrowany system odwracania kart (flipper) oraz kasety z taśmą ze zintegrowanym wałkiem czyszczącym. Model ZC100 posiada intuicyjny panel LED do wskazywania statusu drukarki.

### Parametry techniczne

| Parametr | ZC100 |
|----------|-------|
| **Druk** | **Jednostronny** |
| Technologia druku | Sublimacja barwników / Termotransfer |
| Rozdzielczość | 300 dpi (11,8 punktów/mm) |
| Prędkość druku (YMCKO) | do 180 kart/godz. (kolor jednostronny) |
| Prędkość druku (K) | do 700 kart/godz. (mono jednostronny) |
| Formaty kart | CR80 (54x86 mm), CR70 (52x84 mm) |
| Grubość kart | 10-40 mil (0,25-1,02 mm) |
| Pojemność podajnika | 100 kart (30 mil) |
| Pojemność odbiornika | 100 kart (30 mil) |
| Pamięć RAM | 512 MB |

### Porównanie ZC100 vs ZC300

| Parametr | ZC100 | ZC300 |
|----------|-------|-------|
| Druk | **Jednostronny** | Jednostronny/Dwustronny |
| Interfejs użytkownika | **Diody LED** | Kolorowy wyświetlacz LCD |
| Wyświetlacz | Brak | 2" LCD z 3 przyciskami |
| Prędkość (YMCKO) | 180 kart/h | 200 kart/h |
| Menu pomocy | Brak | Animacje na LCD |

### Złącza i komunikacja

| Interfejs | Opis |
|-----------|------|
| USB 2.0 | Połączenie bezpośrednie z PC |
| 10/100 Ethernet | Połączenie sieciowe (RJ-45) |
| Wi-Fi | Opcjonalne 802.11b/g |
| Bluetooth | Opcjonalne parowanie |
| NFC | Zebra Print Touch |

### Opcje fabryczne i rozszerzenia

- **Enkoder magnetyczny** – zapis ISO na 3 ścieżkach (HiCo/LoCo)
- **Enkoder kart inteligentnych** – stykowy i zbliżeniowy
- **Moduł druku dwustronnego** – flipper z pojemnikiem na karty odrzucone
- **Wi-Fi** – łączność bezprzewodowa 802.11b/g
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZC100
- Zasilacz 100W z kablem sieciowym
- Kabel USB
- Dokumentacja startowa

**Ważne:** Zachowaj oryginalne opakowanie do ewentualnego transportu serwisowego.

### Podłączenie zasilania

1. Podłącz żeński wtyk kabla sieciowego do zasilacza
2. Podłącz wtyk zasilacza do gniazda z tyłu drukarki
3. Podłącz wtyk sieciowy do gniazdka elektrycznego
4. Naciśnij przycisk zasilania – dioda zaświeci się na zielono

**Uwaga:** Używaj wyłącznie zasilacza dostarczonego z drukarką (100W).

### Podłączenie USB

1. Podłącz wtyk USB typu B do gniazda z tyłu drukarki
2. Podłącz wtyk USB typu A do portu komputera
3. Sterownik zostanie zainstalowany automatycznie z Windows Update

### Podłączenie Ethernet

1. Podłącz kabel Ethernet (RJ-45) do gniazda z tyłu drukarki
2. Podłącz drugi koniec do przełącznika sieciowego lub routera
3. Drukarka automatycznie uzyska adres IP przez DHCP
`
      },
      {
        title: '3. Ładowanie materiałów eksploatacyjnych',
        content: `
### Ładowanie kasety z taśmą

Każda kaseta Zebra ZC Series zawiera wbudowany wałek czyszczący i chip identyfikacyjny.

1. Otwórz górną pokrywę drukarki (przycisk z tyłu)
2. Usuń osłonę ochronną z wałka czyszczącego
3. Włóż kasetę w orientacji pokazanej na obudowie – kaseta pasuje tylko w jednej pozycji
4. Zamknij górną pokrywę

### Ładowanie kart

Orientacja kart zależy od ich typu:

| Typ karty | Orientacja |
|-----------|------------|
| Zwykłe karty PVC | Dowolna |
| Karty z paskiem magnetycznym | Pasek na dole, po prawej stronie |
| Karty kontaktowe (chip) | Chip do góry, z przodu |
| Karty zbliżeniowe | Dowolna |

1. Otwórz pokrywę podajnika wejściowego
2. Włóż stos kart (maks. 100 szt. przy 30 mil)
3. Zamknij pokrywę podajnika

### Podawanie ręczne

Drukarka posiada szczelinę podawania ręcznego poniżej podajnika głównego:

1. Wybierz podawanie ręczne w sterowniku drukarki
2. Gdy szczelina zaświeci się na zielono, włóż kartę w tej samej orientacji co karty w podajniku
3. Karta zostanie pobrana automatycznie i wydrukowana
`
      },
      {
        title: '4. Wskaźniki LED',
        content: `
### Dioda zasilania (Power)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Uruchamianie |
| Świeci zielono | Drukarka gotowa |
| Świeci czerwono | Błąd krytyczny |

### Dioda kart (Card)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie/Kodowanie w toku |
| Świeci zielono | Karty dostępne |
| Miga czerwono | Zacięcie karty |
| Świeci czerwono | Brak kart |

### Dioda taśmy (Ribbon)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie w toku |
| Świeci zielono | Taśma dostępna |
| Świeci bursztynowo | Niski poziom taśmy |
| Miga czerwono | Brak taśmy / Zacięcie / Zerwanie |
| Świeci czerwono | Nieprawidłowa taśma |

### Dioda czyszczenia (Clean)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Czyszczenie w toku |
| Świeci zielono | Czyszczenie zakończone |
| Świeci bursztynowo | Wymagane czyszczenie |
| Świeci czerwono | Błąd czyszczenia / Pełny pojemnik odrzutów |

### Dioda podawania ręcznego (Manual Feed)

| Stan diody | Znaczenie |
|------------|-----------|
| Świeci zielono | Gotowy na kartę / kartę czyszczącą |
| Świeci czerwono | Błąd wkładania karty |
`
      },
      {
        title: '5. Drukowanie',
        content: `
### Drukowanie karty testowej

1. Upewnij się, że drukarka jest włączona i gotowa
2. Otwórz panel sterowania sterownika drukarki na komputerze
3. Przejdź do zakładki **Help & Support**
4. Wybierz **Print Test Card**
5. Karta testowa zostanie wydrukowana

### Instalacja sterownika

Sterownik instaluje się automatycznie z usługi Windows Update po podłączeniu drukarki przez USB.

Aby zainstalować sterownik ręcznie:
1. Pobierz sterownik ze strony www.zebra.com/zc100-info
2. Uruchom plik instalacyjny
3. Postępuj zgodnie z instrukcjami na ekranie
`
      },
      {
        title: '6. Konserwacja i czyszczenie',
        content: `
### Kiedy czyścić drukarkę

Dioda czyszczenia świecąca na bursztynowo sygnalizuje konieczność wyczyszczenia drukarki. Regularne czyszczenie zapewnia wysoką jakość druku i wydłuża żywotność głowicy drukującej.

### Czyszczenie ze sterownika

1. Otwórz **Printing Preferences** drukarki
2. Przejdź do zakładki **Help & Support**
3. W sekcji **Cleaning** kliknij **Clean Now**
4. Włóż kartę czyszczącą gdy szczelina zaświeci się na zielono
5. Poczekaj na zakończenie cyklu czyszczenia

### Czyszczenie głowicy drukującej

Do usunięcia uporczywych zabrudzeń użyj patyczków nasączonych alkoholem:

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementów grzejnych głowicy (ruch w lewo-prawo)
4. Odczekaj 2-3 minuty przed włączeniem drukarki

**Uwaga:** Nigdy nie używaj ostrych narzędzi do czyszczenia głowicy – spowoduje to trwałe uszkodzenie!

### Czyszczenie enkodera magnetycznego

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementu enkodera
4. Odczekaj 2-3 minuty przed włączeniem drukarki
`
      },
      {
        title: '7. Rozwiązywanie problemów',
        content: `
### Zacięcie karty

Zacięcie występuje, gdy karta nie dociera do czujnika lub blokuje czujnik niespodziewanie.

**Usuwanie zacięcia:**
1. Otwórz górną pokrywę drukarki
2. Wyjmij kasetę z taśmą
3. Obróć kółko ręcznego posuwu w kierunku przodu drukarki, aż karta wysunie się z mechanizmu
4. Włóż kasetę z powrotem i zamknij pokrywę

**Uwaga:** Nie używaj narzędzi do usuwania zaciętych kart – unieważni to gwarancję!

### Problemy z jakością druku

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Plamy, plamki | Zanieczyszczenia | Wymień wałek czyszczący, wyczyść drukarkę |
| Przesunięty obraz | Błąd pozycjonowania | Użyj regulacji Print Position w sterowniku |
| Smugi kolorów | Pomarszczona taśma | Skontaktuj się z serwisem |
| Nieostre kolory | Złe wyodrębnienie czerni | Sprawdź ustawienia K Extraction |
| Niedokładność kolorów | Brak kalibracji | Użyj Color Optimization lub profilu ICC |

### Wskaźniki Ethernet

**Pomarańczowa dioda (prędkość połączenia):**
- Wyłączona – brak połączenia
- 1 mrugnięcie – połączenie 10Base
- 2 mrugnięcia – połączenie 100Base

**Zielona dioda (aktywność):**
- Wyłączona – brak połączenia
- Świeci – połączenie aktywne
- Miga – transmisja danych
`
      },
      {
        title: '8. Opcje i rozszerzenia',
        content: `
### Enkoder magnetyczny

Obsługuje standardowy format ISO 7811 na 3 ścieżkach:

| Ścieżka | Gęstość | Bitów/znak | Maks. znaków | Format |
|---------|---------|------------|--------------|--------|
| 1 | 210 BPI | 7 | 76 | IATA (alfanumeryczny) |
| 2 | 75 BPI | 5 | 37 | ABA (numeryczny) |
| 3 | 210 BPI | 5 | 104 | THRIFT (numeryczny) |

### Enkoder kart inteligentnych

- **Karty stykowe** – programowanie przez zewnętrzny programator podłączony do złącza DB-9
- **Karty zbliżeniowe** – kodowanie przez antenę w ścieżce transportu kart

### Wi-Fi (opcja)

- Standard: IEEE 802.11b/g
- Prędkość: do 54 Mbps (802.11g) / 11 Mbps (802.11b)
- Bezpieczeństwo: WEP, WPA/WPA2
- Szyfrowanie: RC4, TKIP, CCMP (AES)
`
      },
      {
        title: '9. Dane techniczne',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | ok. 193 mm |
| Głębokość | ok. 290 mm |
| Wysokość | ok. 209 mm |
| Waga | ok. 2,9 kg |

### Warunki pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 15°C – 35°C |
| Wilgotność | 20% – 80% RH (bez kondensacji) |
| Temperatura przechowywania | -5°C – 70°C |

### Certyfikaty

- FCC Class B
- CE
- IC
- UL/cUL Listed
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym jest drukarka ZC100?

**Odpowiedź:** Zebra ZC100 to kompaktowa **jednostronna drukarka kart identyfikacyjnych** do druku pełnokolorowego (YMCKO) lub monochromatycznego na kartach PVC formatu CR80/CR70.

### Jaka jest prędkość druku ZC100?

**Odpowiedź:** ZC100 drukuje do **180 kart/godz.** w trybie kolorowym (YMCKO) i do **700 kart/godz.** w trybie monochromatycznym (K).

### Jakie formaty kart obsługuje ZC100?

**Odpowiedź:** ZC100 obsługuje standardowe karty **CR80 (54x86 mm)** i **CR70 (52x84 mm)** o grubości **10-40 mil (0,25-1,02 mm)**.

### Jak włożyć taśmę do ZC100?

**Odpowiedź:** Otwórz górną pokrywę (przycisk z tyłu), usuń osłonę z wałka czyszczącego kasety, włóż kasetę w orientacji pokazanej na obudowie i zamknij pokrywę.

### Co oznacza bursztynowa dioda taśmy?

**Odpowiedź:** Bursztynowa dioda taśmy oznacza **niski poziom taśmy** – wkrótce będzie konieczna wymiana kasety.

### Jak wyczyścić ZC100?

**Odpowiedź:** Otwórz Printing Preferences, przejdź do Help & Support, kliknij **Clean Now** i włóż kartę czyszczącą gdy szczelina zaświeci się na zielono.

### Jak usunąć zacięcie karty?

**Odpowiedź:** Otwórz górną pokrywę, wyjmij kasetę z taśmą, obróć kółko ręcznego posuwu w kierunku przodu drukarki aż karta się wysunie.

### Czy ZC100 drukuje dwustronnie?

**Odpowiedź:** Standardowo ZC100 drukuje **jednostronnie**. Moduł druku dwustronnego jest dostępny jako **opcja fabryczna**.

### Czy ZC100 ma enkoder magnetyczny?

**Odpowiedź:** Enkoder magnetyczny jest dostępny jako **opcja fabryczna** – obsługuje format ISO 7811 na 3 ścieżkach (HiCo/LoCo).

### Jak drukować kartę testową?

**Odpowiedź:** W panelu sterowania sterownika przejdź do **Help & Support** i wybierz **Print Test Card**.

### Czym różni się ZC100 od ZC300?

**Odpowiedź:** ZC100 ma **diody LED**, ZC300 ma **kolorowy wyświetlacz LCD 2"** z przyciskami i animacjami pomocy. ZC300 jest też szybsza (200 vs 180 kart/h w YMCKO).
`
      }
    ]
  },

  'zc300': {
    model: 'ZC300',
    title: 'Zebra ZC300 – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZC300 Card Printer User Guide',
    keywords: [
      'zebra zc300 instrukcja', 'zc300 instrukcja po polsku', 'zebra zc300 manual',
      'drukarka kart zebra', 'zc300 drukarka kart id', 'zc300 konfiguracja',
      'zc300 taśma', 'zc300 enkoder magnetyczny', 'zc300 karta inteligentna',
      'drukarka kart identyfikacyjnych', 'zc300 specyfikacja', 'zc300 lcd',
      'zc300 czyszczenie', 'zc300 błędy', 'zc300 wifi', 'zc300 ethernet',
      'druk kart pvc', 'sublimacja barwników', 'ymcko', 'cr80', 'cr70',
      'karty id', 'identyfikatory', 'przepustki', 'karty dostępu',
      'zc300 dwustronny', 'zc300 flipper', 'zc300 wyświetlacz'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZC300

Zebra ZC300 to zaawansowana drukarka kart identyfikacyjnych z **kolorowym wyświetlaczem LCD 2"** i trzema przyciskami funkcyjnymi, umożliwiająca pełnokolorowy druk metodą sublimacji barwników lub monochromatyczny druk termotransferowy. Obsługuje standardowe karty PVC i PVC-composite w formatach CR70 (52x84 mm) i CR80 (54x86 mm) o grubości 10-40 mil. Drukarka posiada podajnik na 100 kart, intuicyjne menu z animowaną pomocą oraz opcję druku dwustronnego. Model ZC300 oferuje lepszą diagnostykę i łatwiejszą obsługę dzięki ekranowi LCD.

### Parametry techniczne

| Parametr | ZC300 |
|----------|-------|
| **Druk** | **Jednostronny / Dwustronny (opcja)** |
| Technologia druku | Sublimacja barwników / Termotransfer |
| Rozdzielczość | 300 dpi (11,8 punktów/mm) |
| Prędkość druku (YMCKO) | do 200 kart/godz. (kolor jednostronny) |
| | do 140 kart/godz. (kolor dwustronny) |
| Prędkość druku (K) | do 800 kart/godz. (mono jednostronny) |
| Formaty kart | CR80 (54x86 mm), CR70 (52x84 mm) |
| Grubość kart | 10-40 mil (0,25-1,02 mm) |
| Pojemność podajnika | 100 kart (30 mil) |
| Pojemność odbiornika | 100 kart (30 mil) |
| Wyświetlacz | **2" kolorowy LCD** |
| Pamięć RAM | 512 MB |

### Porównanie ZC300 vs ZC100

| Parametr | ZC300 | ZC100 |
|----------|-------|-------|
| Interfejs użytkownika | **Kolorowy LCD 2"** | Diody LED |
| Przyciski funkcyjne | **3 przyciski** | Brak |
| Menu pomocy | **Animacje na LCD** | Brak |
| Prędkość (YMCKO) | **200 kart/h** | 180 kart/h |
| Diagnostyka | **Rozszerzona (LCD)** | Podstawowa (LED) |

### Złącza i komunikacja

| Interfejs | Opis |
|-----------|------|
| USB 2.0 | Połączenie bezpośrednie z PC |
| 10/100 Ethernet | Połączenie sieciowe (RJ-45) |
| Wi-Fi | Opcjonalne 802.11b/g |
| Bluetooth | Opcjonalne parowanie |
| NFC | Zebra Print Touch |

### Opcje fabryczne i rozszerzenia

- **Enkoder magnetyczny** – zapis ISO na 3 ścieżkach (HiCo/LoCo)
- **Enkoder kart inteligentnych** – stykowy i zbliżeniowy
- **Moduł druku dwustronnego** – flipper z pojemnikiem na karty odrzucone
- **Wi-Fi** – łączność bezprzewodowa 802.11b/g
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZC300
- Zasilacz 100W z kablem sieciowym
- Kabel USB
- Dokumentacja startowa

**Ważne:** Zachowaj oryginalne opakowanie do ewentualnego transportu serwisowego.

### Podłączenie zasilania

1. Podłącz żeński wtyk kabla sieciowego do zasilacza
2. Podłącz wtyk zasilacza do gniazda z tyłu drukarki
3. Podłącz wtyk sieciowy do gniazdka elektrycznego
4. Naciśnij przycisk zasilania – na wyświetlaczu pojawi się ekran startowy

**Uwaga:** Używaj wyłącznie zasilacza dostarczonego z drukarką (100W).

### Podłączenie USB

1. Podłącz wtyk USB typu B do gniazda z tyłu drukarki
2. Podłącz wtyk USB typu A do portu komputera
3. Sterownik zostanie zainstalowany automatycznie z Windows Update

### Podłączenie Ethernet

1. Podłącz kabel Ethernet (RJ-45) do gniazda z tyłu drukarki
2. Podłącz drugi koniec do przełącznika sieciowego lub routera
3. Drukarka automatycznie uzyska adres IP przez DHCP
4. Adres IP wyświetli się na ekranie głównym LCD
`
      },
      {
        title: '3. Ładowanie materiałów eksploatacyjnych',
        content: `
### Ładowanie kasety z taśmą

Każda kaseta Zebra ZC Series zawiera wbudowany wałek czyszczący i chip identyfikacyjny.

1. Otwórz górną pokrywę drukarki (przycisk z tyłu)
2. Usuń osłonę ochronną z wałka czyszczącego
3. Włóż kasetę w orientacji pokazanej na obudowie – kaseta pasuje tylko w jednej pozycji
4. Zamknij górną pokrywę

### Ładowanie kart

Orientacja kart zależy od ich typu:

| Typ karty | Orientacja |
|-----------|------------|
| Zwykłe karty PVC | Dowolna |
| Karty z paskiem magnetycznym | Pasek na dole, po prawej stronie |
| Karty kontaktowe (chip) | Chip do góry, z przodu |
| Karty zbliżeniowe | Dowolna |

1. Otwórz pokrywę podajnika wejściowego
2. Włóż stos kart (maks. 100 szt. przy 30 mil)
3. Zamknij pokrywę podajnika

### Podawanie ręczne

Drukarka posiada szczelinę podawania ręcznego poniżej podajnika głównego:

1. Wybierz podawanie ręczne w sterowniku drukarki
2. Gdy szczelina zaświeci się na zielono, włóż kartę w tej samej orientacji co karty w podajniku
3. Karta zostanie pobrana automatycznie i wydrukowana
`
      },
      {
        title: '4. Obsługa wyświetlacza LCD',
        content: `
### Ekran główny (Printer Ready)

Po uruchomieniu drukarka wyświetla ekran gotowości z następującymi elementami:

- **Górny pasek** – ikony statusu połączeń (Ethernet, Bluetooth, Wi-Fi)
- **Środek ekranu** – aktualny stan drukarki i adres IP
- **Dolny pasek** – ikony menu: Help, Info, Tools

### Przyciski funkcyjne (Soft Keys)

Trzy przyciski pod ekranem LCD odpowiadają ikonom wyświetlanym na dole ekranu:

| Pozycja | Funkcja na ekranie głównym | Funkcja w menu |
|---------|---------------------------|----------------|
| Lewy | Help (Pomoc) | Powrót |
| Środkowy | Info (Informacje) | W dół (przewijanie) |
| Prawy | Tools (Narzędzia) | Wybór/Dalej |

### Menu Help (Pomoc)

Menu pomocy zawiera animacje pokazujące podstawowe czynności:

- **Loading cards** – ładowanie kart
- **Loading ribbon** – ładowanie kasety z taśmą
- **Printing a demo card** – drukowanie karty demonstracyjnej
- **Cleaning the printer** – czyszczenie drukarki
- **Clearing card jam** – usuwanie zacięcia karty
- **Clearing ribbon jam** – usuwanie zacięcia taśmy
- **More help** – kod QR do strony wsparcia

### Menu Info (Informacje)

- **Printer info** – informacje o drukarce (model, wersja firmware)
- **Wired network** – status sieci przewodowej i adres IP
- **Wireless network** – status sieci Wi-Fi
- **Bluetooth** – status połączenia Bluetooth
- **Ribbon info** – informacje o zainstalowanej kasecie
- **Card count** – licznik wydrukowanych kart
- **Installed options** – lista zainstalowanych opcji

### Menu Tools (Narzędzia)

- **Print sample cards** – drukowanie kart demonstracyjnych
- **Select language** – wybór języka menu
- **Clean printer** – uruchomienie czyszczenia drukarki
`
      },
      {
        title: '5. Wskaźniki statusu połączenia',
        content: `
### Ethernet (ikona sieci przewodowej)

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Kabel podłączony, brak adresu IP |
| Zielona | Połączono z siecią |

### Bluetooth

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Sparowane, ale niepołączone |
| Zielona | Sparowane i połączone |

### Wi-Fi

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Brak połączenia |
| Pomarańczowa | Słabe połączenie |
| Zielona | Połączono |
`
      },
      {
        title: '6. Wskaźniki LED',
        content: `
Model ZC300 posiada zarówno wyświetlacz LCD, jak i diody LED wskazujące status:

### Dioda zasilania (Power)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Uruchamianie |
| Świeci zielono | Drukarka gotowa |
| Świeci czerwono | Błąd krytyczny |

### Dioda kart (Card)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie/Kodowanie w toku |
| Świeci zielono | Karty dostępne |
| Miga czerwono | Zacięcie karty |
| Świeci czerwono | Brak kart |

### Dioda taśmy (Ribbon)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie w toku |
| Świeci zielono | Taśma dostępna |
| Świeci bursztynowo | Niski poziom taśmy |
| Miga czerwono | Brak taśmy / Zacięcie / Zerwanie |
| Świeci czerwono | Nieprawidłowa taśma |

### Dioda czyszczenia (Clean)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Czyszczenie w toku |
| Świeci zielono | Czyszczenie zakończone |
| Świeci bursztynowo | Wymagane czyszczenie |
| Świeci czerwono | Błąd czyszczenia / Pełny pojemnik odrzutów |
`
      },
      {
        title: '7. Drukowanie',
        content: `
### Drukowanie karty demonstracyjnej z LCD

1. Upewnij się, że drukarka jest włączona i gotowa (ekran "Printer ready")
2. Naciśnij prawy przycisk funkcyjny (Tools)
3. Naciśnij środkowy przycisk, aby wybrać **Print sample cards**
4. Naciśnij prawy przycisk, aby potwierdzić wybór
5. Wybierz kartę do wydruku i naciśnij prawy przycisk

### Drukowanie karty testowej ze sterownika

1. Otwórz panel sterowania sterownika drukarki na komputerze
2. Przejdź do zakładki **Help & Support**
3. Wybierz **Print Test Card**
4. Karta testowa zostanie wydrukowana

### Instalacja sterownika

Sterownik instaluje się automatycznie z usługi Windows Update po podłączeniu drukarki przez USB.

Aby zainstalować sterownik ręcznie:
1. Pobierz sterownik ze strony www.zebra.com/zc300-info
2. Uruchom plik instalacyjny
3. Postępuj zgodnie z instrukcjami na ekranie
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
### Kiedy czyścić drukarkę

Dioda czyszczenia świecąca na bursztynowo sygnalizuje konieczność wyczyszczenia drukarki. Na wyświetlaczu LCD pojawi się odpowiedni komunikat.

### Czyszczenie z menu LCD

1. Na ekranie głównym naciśnij prawy przycisk (Tools)
2. Wybierz **Clean printer** i naciśnij prawy przycisk
3. Na pytanie "Would you like to start the cleaning process?" naciśnij prawy przycisk
4. Postępuj zgodnie z instrukcjami na ekranie
5. Włóż kartę czyszczącą gdy zostaniesz o to poproszony

### Czyszczenie ze sterownika

1. Otwórz **Printing Preferences** drukarki
2. Przejdź do zakładki **Help & Support**
3. W sekcji **Cleaning** kliknij **Clean Now**
4. Postępuj zgodnie z instrukcjami na ekranie LCD drukarki

### Czyszczenie głowicy drukującej

Do usunięcia uporczywych zabrudzeń użyj patyczków nasączonych alkoholem:

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementów grzejnych głowicy (ruch w lewo-prawo)
4. Odczekaj 2-3 minuty przed włączeniem drukarki

**Uwaga:** Nigdy nie używaj ostrych narzędzi do czyszczenia głowicy – spowoduje to trwałe uszkodzenie!

### Czyszczenie enkodera magnetycznego

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementu enkodera
4. Odczekaj 2-3 minuty przed włączeniem drukarki
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu LCD

#### Ostrzeżenia (żółte tło)

Ostrzeżenia wymagają uwagi operatora, ale nie blokują drukowania:

- **Ribbon low** – niski poziom taśmy
- **Cards low** – mało kart w podajniku
- **Cleaning required** – wymagane czyszczenie

Naciśnij lewy przycisk, aby wyświetlić animację pomocy.

#### Błędy (czerwone tło)

Błędy wymagają natychmiastowej interwencji:

- **Ribbon out** – brak taśmy
- **Cards out** – brak kart
- **Ribbon jam** – zacięcie taśmy
- **Card jam** – zacięcie karty
- **Ribbon color detect error** – błąd wykrywania koloru taśmy
- **Invalid ribbon** – nieprawidłowa kaseta z taśmą

### Zacięcie karty

**Usuwanie zacięcia:**
1. Otwórz górną pokrywę drukarki
2. Wyjmij kasetę z taśmą
3. Obróć kółko ręcznego posuwu w kierunku przodu drukarki, aż karta wysunie się z mechanizmu
4. Włóż kasetę z powrotem i zamknij pokrywę

**Uwaga:** Nie używaj narzędzi do usuwania zaciętych kart – unieważni to gwarancję!

### Odrzucone karty

- **Bez modułu flipper** – karta trafia na wierzch stosu w odbiorniku
- **Z modułem flipper** – karta trafia do pojemnika odrzutów (nad flipperem)

### Problemy z jakością druku

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Plamy, plamki | Zanieczyszczenia | Wymień wałek czyszczący, wyczyść drukarkę |
| Przesunięty obraz | Błąd pozycjonowania | Użyj regulacji Print Position w sterowniku |
| Smugi kolorów | Pomarszczona taśma | Skontaktuj się z serwisem |
| Nieostre kolory | Złe wyodrębnienie czerni | Sprawdź ustawienia K Extraction |
| Rozmazanie | Zbyt wysoka temperatura | Zmniejsz wartość Preheat |
`
      },
      {
        title: '10. Opcje i rozszerzenia',
        content: `
### Enkoder magnetyczny

Obsługuje standardowy format ISO 7811 na 3 ścieżkach:

| Ścieżka | Gęstość | Bitów/znak | Maks. znaków | Format |
|---------|---------|------------|--------------|--------|
| 1 | 210 BPI | 7 | 76 | IATA (alfanumeryczny) |
| 2 | 75 BPI | 5 | 37 | ABA (numeryczny) |
| 3 | 210 BPI | 5 | 104 | THRIFT (numeryczny) |

### Enkoder kart inteligentnych

- **Karty stykowe** – programowanie przez zewnętrzny programator podłączony do złącza DB-9
- **Karty zbliżeniowe** – kodowanie przez antenę w ścieżce transportu kart

### Druk dwustronny (flipper)

Moduł flipper umożliwia automatyczny druk dwustronny oraz przekierowywanie odrzuconych kart do oddzielnego pojemnika.

### Wi-Fi (opcja)

- Standard: IEEE 802.11b/g
- Prędkość: do 54 Mbps (802.11g) / 11 Mbps (802.11b)
- Bezpieczeństwo: WEP, WPA/WPA2
- Szyfrowanie: RC4, TKIP, CCMP (AES)

**Zalecenia dotyczące lokalizacji drukarki z Wi-Fi:**
- Umieść drukarkę jak najbliżej punktu dostępowego
- Zapewnij linię wzrokową między antenami
- Unikaj metalowych obudów i przeszkód
- Unikaj urządzeń emitujących zakłócenia 2,4 GHz
`
      },
      {
        title: '11. Dane techniczne',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | ok. 193 mm |
| Głębokość | ok. 290 mm |
| Wysokość | ok. 209 mm |
| Waga | ok. 2,9 kg |

### Warunki pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 15°C – 35°C |
| Wilgotność | 20% – 80% RH (bez kondensacji) |
| Temperatura przechowywania | -5°C – 70°C |

### Certyfikaty

- FCC Class B
- CE
- IC
- UL/cUL Listed
`
      },
      {
        title: '12. Wymiana głowicy drukującej',
        content: `
### Demontaż

1. Otwórz górną pokrywę
2. Pchnij głowicę do góry i obróć, aby zwolnić ją z zaczepów
3. Odłącz złącze kablowe od głowicy

### Montaż

1. Podłącz złącze kablowe do nowej głowicy
2. Zanotuj numer seryjny i wartość rezystancji nowej głowicy
3. Włóż kulkę stabilizującą do gniazda w górnej pokrywie
4. Pchnij głowicę do góry i obróć do zaczepów
5. W sterowniku przejdź do: **Advanced > Diagnostics and Calibration > Commands & Calibration**
6. W sekcji **Printhead** wprowadź numer seryjny i wartość rezystancji
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym jest drukarka ZC300?

**Odpowiedź:** Zebra ZC300 to zaawansowana drukarka kart identyfikacyjnych z **kolorowym wyświetlaczem LCD 2"** i trzema przyciskami funkcyjnymi, do druku pełnokolorowego lub monochromatycznego na kartach PVC.

### Jaka jest prędkość druku ZC300?

**Odpowiedź:** ZC300 drukuje do **200 kart/godz.** (kolor jednostronny), **140 kart/godz.** (kolor dwustronny) i do **800 kart/godz.** (mono jednostronny).

### Czym różni się ZC300 od ZC100?

**Odpowiedź:** ZC300 ma **kolorowy wyświetlacz LCD 2"** z animacjami pomocy i 3 przyciskami, ZC100 ma tylko diody LED. ZC300 jest szybsza (200 vs 180 kart/h).

### Jak drukować kartę demonstracyjną z LCD?

**Odpowiedź:** Naciśnij prawy przycisk (Tools), wybierz **Print sample cards** środkowym przyciskiem, potwierdź prawym przyciskiem i wybierz kartę do wydruku.

### Co oznaczają kolory ikon na LCD?

**Odpowiedź:** **Zielona** = połączono/OK, **Czerwona** = błąd/brak połączenia, **Pomarańczowa** = słabe połączenie Wi-Fi, **Szara** = wyłączone.

### Jak uruchomić czyszczenie z LCD?

**Odpowiedź:** Naciśnij prawy przycisk (Tools), wybierz **Clean printer** i postępuj zgodnie z instrukcjami na ekranie. Włóż kartę czyszczącą gdy zostaniesz poproszony.

### Co oznacza żółte tło na wyświetlaczu?

**Odpowiedź:** Żółte tło oznacza **ostrzeżenie** (np. niski poziom taśmy, mało kart) – drukarka nadal działa, ale wymaga uwagi.

### Co oznacza czerwone tło na wyświetlaczu?

**Odpowiedź:** Czerwone tło oznacza **błąd** wymagający natychmiastowej interwencji (np. brak taśmy, zacięcie karty).

### Jak usunąć zacięcie karty?

**Odpowiedź:** Otwórz górną pokrywę, wyjmij kasetę z taśmą, obróć kółko ręcznego posuwu w kierunku przodu drukarki aż karta się wysunie.

### Czy ZC300 drukuje dwustronnie?

**Odpowiedź:** Standardowo ZC300 drukuje jednostronnie. **Moduł flipper** (druk dwustronny) jest dostępny jako opcja fabryczna – umożliwia też odrzucanie wadliwych kart.

### Jak sprawdzić adres IP drukarki?

**Odpowiedź:** Adres IP wyświetla się na **ekranie głównym LCD**. Możesz też nacisnąć środkowy przycisk (Info) i wybrać **Wired network**.

### Jak wymienić głowicę drukującą?

**Odpowiedź:** Otwórz pokrywę, pchnij głowicę do góry i obróć, odłącz kabel. Przy montażu nowej wprowadź jej numer seryjny i wartość rezystancji w sterowniku (Advanced > Diagnostics).
`
      }
    ]
  },

  'zc350': {
    model: 'ZC350',
    title: 'Zebra ZC350 – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZC350 Card Printer User Guide',
    keywords: [
      'zebra zc350 instrukcja', 'zc350 instrukcja po polsku', 'zebra zc350 manual',
      'drukarka kart zebra', 'zc350 drukarka kart id', 'zc350 konfiguracja',
      'zc350 taśma', 'zc350 enkoder magnetyczny', 'zc350 karta inteligentna',
      'drukarka kart identyfikacyjnych', 'zc350 specyfikacja', 'zc350 lcd',
      'zc350 czyszczenie', 'zc350 błędy', 'zc350 wifi', 'zc350 ethernet',
      'druk kart pvc', 'sublimacja barwników', 'ymcko', 'cr80', 'cr79',
      'karty id', 'identyfikatory', 'przepustki', 'karty dostępu',
      'zc350 dwustronny', 'zc350 flipper', 'zc350 zabezpieczenia',
      'zc350 hologram', 'zc350 3d', 'zc350 szyfrowanie', 'zc350 print dna',
      'taśma ymckll', 'taśma ymcpko', 'taśma sdymcko', 'blokada pokrywy'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZC350

Zebra ZC350 to flagowa drukarka kart identyfikacyjnych z serii ZC, wyposażona w **kolorowy wyświetlacz LCD 2"** i trzy przyciski funkcyjne. Oferuje pełnokolorowy druk metodą sublimacji barwników lub monochromatyczny druk termotransferowy na standardowych kartach PVC i PVC-composite w formatach CR79 (53x84 mm) i CR80 (54x86 mm) o grubości 10-40 mil. Model ZC350 wyróżnia się **zaawansowanymi funkcjami bezpieczeństwa** (szyfrowanie klasy rządowej, uwierzytelnianie host-drukarka) oraz obsługą specjalnych taśm z efektami 3D, holograficznymi i długotrwałymi. Drukarka automatycznie dostosowuje się do grubości karty i posiada zmodernizowane podajniki na 100 kart.

### Parametry techniczne

| Parametr | ZC350 |
|----------|-------|
| **Druk** | **Jednostronny / Dwustronny (opcja)** |
| Technologia druku | Sublimacja barwników / Termotransfer |
| Rozdzielczość | 300 dpi (11,8 punktów/mm) |
| Prędkość druku (YMCKO) | do 225 kart/godz. (kolor jednostronny) |
| | do 150 kart/godz. (kolor dwustronny) |
| Prędkość druku (K) | do 1000 kart/godz. (mono jednostronny) |
| | do 500 kart/godz. (mono dwustronny) |
| Formaty kart | CR80 (54x86 mm), CR79 (53x84 mm) |
| Grubość kart | 10-40 mil (0,25-1,02 mm) |
| Pojemność podajnika | 100 kart (30 mil) |
| Pojemność odbiornika | 100 kart (30 mil) |
| Wyświetlacz | **2" kolorowy LCD** |
| Pamięć RAM | 512 MB |
| Gwarancja | **2 lata (drukarka i głowica)** |

### Porównanie ZC350 vs ZC300

| Parametr | ZC350 | ZC300 |
|----------|-------|-------|
| Prędkość (YMCKO jednostronny) | **225 kart/h** | 200 kart/h |
| Prędkość (K mono dwustronny) | **500 kart/h** | 400 kart/h |
| Specjalne taśmy | **3D, holograficzne, długotrwałe** | Standardowe |
| Zabezpieczenia | **Szyfrowanie rządowe, auth.** | Standardowe |
| Automatyczna grubość karty | **Tak** | Nie |
| Blokada pokrywy | **Tak (opcja)** | Nie |
| Gwarancja | **2 lata** | 3 lata |

### Złącza i komunikacja

| Interfejs | Opis |
|-----------|------|
| USB 2.0 | Połączenie bezpośrednie z PC |
| 10/100 Ethernet | Połączenie sieciowe (RJ-45) – standard |
| Wi-Fi | Opcjonalne 802.11b/g/n |
| Bluetooth | Opcjonalne parowanie |
| NFC | Zebra Print Touch |

### Opcje fabryczne i rozszerzenia

- **Enkoder magnetyczny** – zapis ISO na 3 ścieżkach (HiCo/LoCo)
- **Enkoder kart stykowych** – programowanie chipów przez złącze DB-9
- **Enkoder kart zbliżeniowych** – kodowanie przez antenę wbudowaną
- **Enkoder kart proximity** – obsługa kart dostępowych
- **Moduł druku dwustronnego** – flipper z pojemnikiem na karty odrzucone
- **Wi-Fi** – łączność bezprzewodowa 802.11b/g/n
- **Blokada pokrywy** – zabezpieczenie przed nieautoryzowanym dostępem
`
      },
      {
        title: '2. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZC350
- Zasilacz 100W z kablem sieciowym
- Kabel USB
- Dokumentacja startowa

**Ważne:** Zachowaj oryginalne opakowanie do ewentualnego transportu serwisowego.

### Podłączenie zasilania

1. Podłącz żeński wtyk kabla sieciowego do zasilacza
2. Podłącz wtyk zasilacza do gniazda z tyłu drukarki
3. Podłącz wtyk sieciowy do gniazdka elektrycznego
4. Naciśnij przycisk zasilania – na wyświetlaczu pojawi się ekran startowy

**Uwaga:** Używaj wyłącznie zasilacza dostarczonego z drukarką (100W).

### Podłączenie USB

1. Podłącz wtyk USB typu B do gniazda z tyłu drukarki
2. Podłącz wtyk USB typu A do portu komputera
3. Sterownik zostanie zainstalowany automatycznie z Windows Update

### Podłączenie Ethernet

1. Podłącz kabel Ethernet (RJ-45) do gniazda z tyłu drukarki
2. Podłącz drugi koniec do przełącznika sieciowego lub routera
3. Drukarka automatycznie uzyska adres IP przez DHCP
4. Adres IP wyświetli się na ekranie głównym LCD
`
      },
      {
        title: '3. Ładowanie materiałów eksploatacyjnych',
        content: `
### Ładowanie kasety z taśmą

Kasety Zebra ZC350 posiadają uchwyt typu "klamka drzwiowa" ułatwiający wymianę, wbudowany wałek czyszczący i chip identyfikacyjny.

1. Otwórz zatrzask drzwiczek taśmy (jeden ruch – odblokowanie i otwarcie)
2. Chwyć kasetę za uchwyt "klamka" i wyjmij zużytą kasetę
3. Usuń osłonę ochronną z wałka czyszczącego nowej kasety
4. Włóż nową kasetę chwytając za uchwyt – kaseta pasuje tylko w jednej pozycji
5. Zamknij drzwiczki taśmy

### Typy taśm ZC350

| Typ taśmy | Opis | Zastosowanie |
|-----------|------|--------------|
| YMCKO | Pełnokolorowa ze standardowym overlayem | Karty standardowe |
| YMCKOK | Pełnokolorowa + czarny rewers | Druk dwustronny |
| **YMCKLL** | **Długotrwały overlay (4x wytrzymalość)** | Karty o przedłużonej żywotności |
| **YMCPKO** | **Efekt holograficzny (color-shifting)** | Karty bezpieczne |
| **SDYMCKO** | **Efekt 3D srebrny** | Karty premium |
| KdO | Czarny barwiący + overlay | Karty monochromatyczne |
| KrO | Czarny żywiczny + overlay | Karty z kodem kreskowym |
| K | Monochromatyczny | Szybki druk tekstu |

### Ładowanie kart

Drukarka ZC350 automatycznie dostosowuje się do grubości kart (10-40 mil).

Orientacja kart zależy od ich typu:

| Typ karty | Orientacja |
|-----------|------------|
| Zwykłe karty PVC | Dowolna |
| Karty z paskiem magnetycznym | Pasek na dole, po prawej stronie |
| Karty kontaktowe (chip) | Chip do góry, z przodu |
| Karty zbliżeniowe / proximity | Dowolna |

1. Otwórz pokrywę podajnika wejściowego
2. Włóż stos kart (maks. 100 szt. przy 30 mil)
3. Zamknij pokrywę podajnika

### Podawanie ręczne

Drukarka ZC350 posiada **podświetlaną szczelinę podawania ręcznego** z systemem prowadzenia podobnym do bankomatów:

1. Wybierz podawanie ręczne w sterowniku drukarki
2. Gdy szczelina zaświeci się na zielono, podświetlenie wskaże gdzie włożyć kartę
3. Włóż kartę w tej samej orientacji co karty w podajniku
4. Karta zostanie pobrana automatycznie i wydrukowana

### Odbieranie kart

Podajnik wyjściowy ZC350 posiada **drzwiczki typu "saloon"** – wystarczy sięgnąć i wyjąć karty bez otwierania pokrywy.
`
      },
      {
        title: '4. Obsługa wyświetlacza LCD',
        content: `
### Ekran główny (Printer Ready)

Po uruchomieniu drukarka wyświetla ekran gotowości z następującymi elementami:

- **Górny pasek** – ikony statusu połączeń (Ethernet, Bluetooth, Wi-Fi)
- **Środek ekranu** – aktualny stan drukarki i adres IP
- **Dolny pasek** – ikony menu: Help, Info, Tools

### Przyciski funkcyjne (Soft Keys)

Trzy przyciski pod ekranem LCD odpowiadają ikonom wyświetlanym na dole ekranu:

| Pozycja | Funkcja na ekranie głównym | Funkcja w menu |
|---------|---------------------------|----------------|
| Lewy | Help (Pomoc) | Powrót |
| Środkowy | Info (Informacje) | W dół (przewijanie) |
| Prawy | Tools (Narzędzia) | Wybór/Dalej |

### Menu Help (Pomoc)

Menu pomocy zawiera **animacje i filmy instruktażowe** pokazujące podstawowe czynności:

- **Loading cards** – ładowanie kart
- **Loading ribbon** – ładowanie kasety z taśmą
- **Printing a demo card** – drukowanie karty demonstracyjnej
- **Cleaning the printer** – czyszczenie drukarki
- **Clearing card jam** – usuwanie zacięcia karty
- **Clearing ribbon jam** – usuwanie zacięcia taśmy
- **More help** – kod QR do strony wsparcia

### Menu Info (Informacje)

- **Printer info** – informacje o drukarce (model, wersja firmware)
- **Wired network** – status sieci przewodowej i adres IP
- **Wireless network** – status sieci Wi-Fi
- **Bluetooth** – status połączenia Bluetooth
- **Ribbon info** – informacje o zainstalowanej kasecie
- **Card count** – licznik wydrukowanych kart
- **Installed options** – lista zainstalowanych opcji

### Menu Tools (Narzędzia)

- **Print sample cards** – drukowanie kart demonstracyjnych
- **Select language** – wybór języka menu (9 języków w tym polski)
- **Clean printer** – uruchomienie czyszczenia drukarki
`
      },
      {
        title: '5. Wskaźniki statusu połączenia',
        content: `
### Ethernet (ikona sieci przewodowej)

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Kabel podłączony, brak adresu IP |
| Zielona | Połączono z siecią |

### Bluetooth

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Sparowane, ale niepołączone |
| Zielona | Sparowane i połączone |

### Wi-Fi

| Ikona | Status |
|-------|--------|
| Szara | Wyłączone |
| Czerwona | Brak połączenia |
| Pomarańczowa | Słabe połączenie |
| Zielona | Połączono |
`
      },
      {
        title: '6. Wskaźniki LED',
        content: `
Model ZC350 posiada zarówno wyświetlacz LCD, jak i diody LED wskazujące status:

### Dioda zasilania (Power)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Uruchamianie |
| Świeci zielono | Drukarka gotowa |
| Świeci czerwono | Błąd krytyczny |

### Dioda kart (Card)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie/Kodowanie w toku |
| Świeci zielono | Karty dostępne |
| Miga czerwono | Zacięcie karty |
| Świeci czerwono | Brak kart |

### Dioda taśmy (Ribbon)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie w toku |
| Świeci zielono | Taśma dostępna |
| Świeci bursztynowo | Niski poziom taśmy |
| Miga czerwono | Brak taśmy / Zacięcie / Zerwanie |
| Świeci czerwono | Nieprawidłowa taśma |

### Dioda czyszczenia (Clean)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Czyszczenie w toku |
| Świeci zielono | Czyszczenie zakończone |
| Świeci bursztynowo | Wymagane czyszczenie |
| Świeci czerwono | Błąd czyszczenia / Pełny pojemnik odrzutów |
`
      },
      {
        title: '7. Zabezpieczenia',
        content: `
### Funkcje bezpieczeństwa ZC350

Drukarka ZC350 oferuje zaawansowane funkcje bezpieczeństwa niedostępne w innych modelach serii ZC:

| Funkcja | Opis |
|---------|------|
| **Uwierzytelnianie host-drukarka** | Blokuje drukowanie z nieautoryzowanych aplikacji |
| **Szyfrowanie klasy rządowej** | Chroni wrażliwe dane (numery kont) podczas druku |
| **Blokada pokrywy** (opcja) | Zabezpiecza przed kradzieżą kart i materiałów |
| **Pojemnik na karty odrzucone** | Izoluje błędnie wydrukowane karty (z flipperem) |

### Specjalne taśmy bezpieczeństwa

| Taśma | Efekt zabezpieczający |
|-------|----------------------|
| **YMCPKO** | Obraz zmieniający kolor (holograficzny) – trudny do podrobienia |
| **SDYMCKO** | Efekty 3D na srebrnym tle – odstraszają fałszerzy |
| **YMCKLL** | Znak wodny widoczny pod kątem lub w UV |
`
      },
      {
        title: '8. Drukowanie',
        content: `
### Drukowanie karty demonstracyjnej z LCD

1. Upewnij się, że drukarka jest włączona i gotowa (ekran "Printer ready")
2. Naciśnij prawy przycisk funkcyjny (Tools)
3. Naciśnij środkowy przycisk, aby wybrać **Print sample cards**
4. Naciśnij prawy przycisk, aby potwierdzić wybór
5. Wybierz kartę do wydruku i naciśnij prawy przycisk

### Drukowanie karty testowej ze sterownika

1. Otwórz panel sterowania sterownika drukarki na komputerze
2. Przejdź do zakładki **Help & Support**
3. Wybierz **Print Test Card**
4. Karta testowa zostanie wydrukowana

### Instalacja sterownika

Sterownik instaluje się automatycznie z usługi Windows Update po podłączeniu drukarki przez USB.

Sterownik obsługuje 9 języków: angielski, włoski, hiszpański, portugalski, niemiecki, **polski**, rosyjski, chiński (uproszczony) i arabski.

Aby zainstalować sterownik ręcznie:
1. Pobierz sterownik ze strony www.zebra.com/zc350-info
2. Uruchom plik instalacyjny
3. Postępuj zgodnie z instrukcjami na ekranie

### Oprogramowanie Print DNA

Drukarka ZC350 współpracuje z pakietem **Zebra Print DNA**:

- **CardStudio** – projektowanie kart lojalnościowych, upominkowych, ID
- **MultiPlatform SDK** – zestaw dla programistów
- **Print Touch** – dostęp do pomocy przez NFC na urządzeniach Android
`
      },
      {
        title: '9. Konserwacja i czyszczenie',
        content: `
### Kiedy czyścić drukarkę

Dioda czyszczenia świecąca na bursztynowo sygnalizuje konieczność wyczyszczenia drukarki. Na wyświetlaczu LCD pojawi się odpowiedni komunikat.

Zalecane czyszczenie: co 1000 wydrukowanych obrazów.

### Czyszczenie z menu LCD

1. Na ekranie głównym naciśnij prawy przycisk (Tools)
2. Wybierz **Clean printer** i naciśnij prawy przycisk
3. Na pytanie "Would you like to start the cleaning process?" naciśnij prawy przycisk
4. Postępuj zgodnie z instrukcjami na ekranie
5. Włóż kartę czyszczącą gdy zostaniesz o to poproszony

### Czyszczenie ze sterownika

1. Otwórz **Printing Preferences** drukarki
2. Przejdź do zakładki **Help & Support**
3. W sekcji **Cleaning** kliknij **Clean Now**
4. Postępuj zgodnie z instrukcjami na ekranie LCD drukarki

### Czyszczenie głowicy drukującej

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementów grzejnych głowicy (ruch w lewo-prawo)
4. Odczekaj 2-3 minuty przed włączeniem drukarki

**Uwaga:** Nigdy nie używaj ostrych narzędzi do czyszczenia głowicy – spowoduje to trwałe uszkodzenie!

### Zestawy czyszczące

Dostępne dwie opcje zestawów czyszczących:
- Zestaw 2 kart czyszczących (1000 obrazów/karta)
- Zestaw 5 kart czyszczących z alkoholem izopropylowym (1000 obrazów/karta)
`
      },
      {
        title: '10. Rozwiązywanie problemów',
        content: `
### Komunikaty na wyświetlaczu LCD

#### Ostrzeżenia (żółte tło)

Ostrzeżenia wymagają uwagi operatora, ale nie blokują drukowania:

- **Ribbon low** – niski poziom taśmy
- **Cards low** – mało kart w podajniku
- **Cleaning required** – wymagane czyszczenie

Naciśnij lewy przycisk, aby wyświetlić animację pomocy.

#### Błędy (czerwone tło)

Błędy wymagają natychmiastowej interwencji:

- **Ribbon out** – brak taśmy
- **Cards out** – brak kart
- **Ribbon jam** – zacięcie taśmy
- **Card jam** – zacięcie karty
- **Ribbon color detect error** – błąd wykrywania koloru taśmy
- **Invalid ribbon** – nieprawidłowa kaseta z taśmą

### Zacięcie karty

**Usuwanie zacięcia:**
1. Otwórz górną pokrywę drukarki
2. Wyjmij kasetę z taśmą
3. Obróć kółko ręcznego posuwu w kierunku przodu drukarki, aż karta wysunie się z mechanizmu
4. Włóż kasetę z powrotem i zamknij pokrywę

**Uwaga:** Nie używaj narzędzi do usuwania zaciętych kart – unieważni to gwarancję!

### Odrzucone karty

- **Bez modułu flipper** – karta trafia na wierzch stosu w odbiorniku
- **Z modułem flipper** – karta trafia do pojemnika odrzutów (nad flipperem)

### Problemy z jakością druku

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Plamy, plamki | Zanieczyszczenia | Wymień wałek czyszczący, wyczyść drukarkę |
| Przesunięty obraz | Błąd pozycjonowania | Użyj regulacji Print Position w sterowniku |
| Smugi kolorów | Pomarszczona taśma | Skontaktuj się z serwisem |
| Nieostre kolory | Złe wyodrębnienie czerni | Sprawdź ustawienia K Extraction |
| Rozmazanie | Zbyt wysoka temperatura | Zmniejsz wartość Preheat |
`
      },
      {
        title: '11. Opcje i rozszerzenia',
        content: `
### Enkoder magnetyczny

Obsługuje standardowy format ISO 7811 na 3 ścieżkach:

| Ścieżka | Gęstość | Bitów/znak | Maks. znaków | Format |
|---------|---------|------------|--------------|--------|
| 1 | 210 BPI | 7 | 76 | IATA (alfanumeryczny) |
| 2 | 75 BPI | 5 | 37 | ABA (numeryczny) |
| 3 | 210 BPI | 5 | 104 | THRIFT (numeryczny) |

Obsługa kart nowych i pre-kodowanych, HiCo i LoCo, pasek u góry lub u dołu (druk dwustronny).

### Enkoder kart inteligentnych

- **Karty stykowe** – programowanie przez zewnętrzny programator podłączony do złącza DB-9
- **Karty zbliżeniowe** – kodowanie przez antenę w ścieżce transportu kart
- **Karty proximity** – obsługa kart dostępowych

### Druk dwustronny (flipper)

Moduł flipper umożliwia automatyczny druk dwustronny oraz przekierowywanie odrzuconych kart do oddzielnego pojemnika.

### Wi-Fi (opcja)

- Standard: IEEE 802.11b/g/n
- Prędkość: do 54 Mbps (802.11g) / 11 Mbps (802.11b)
- Bezpieczeństwo: WEP, WPA/WPA2
- Szyfrowanie: RC4, TKIP, CCMP (AES)
`
      },
      {
        title: '12. Dane techniczne',
        content: `
### Wymiary i waga

| Model | Szerokość | Głębokość | Wysokość | Waga |
|-------|-----------|-----------|----------|------|
| ZC350 jednostronny | ok. 157 mm | ok. 379 mm | ok. 258 mm | ok. 3,6 kg |
| ZC350 dwustronny | ok. 157 mm | ok. 468 mm | ok. 258 mm | ok. 4,4 kg |

### Warunki pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 15°C – 35°C |
| Wilgotność | 20% – 80% RH (bez kondensacji) |
| Temperatura przechowywania | -5°C – 70°C |

### Certyfikaty

- FCC Class A
- CE
- IC
- UL/cUL Listed

### Zgodność kart

- **Pełnokolorowy druk:** karty CR80 i CR79, grubość 10-40 mil
- **Druk monochromatyczny:** karty CR80 i CR79, grubość < 20 mil (tylko spot color)
`
      },
      {
        title: '13. Wymiana głowicy drukującej',
        content: `
### Demontaż

1. Otwórz górną pokrywę
2. Pchnij głowicę do góry i obróć, aby zwolnić ją z zaczepów
3. Odłącz złącze kablowe od głowicy

### Montaż

1. Podłącz złącze kablowe do nowej głowicy
2. Zanotuj numer seryjny i wartość rezystancji nowej głowicy
3. Włóż kulkę stabilizującą do gniazda w górnej pokrywie
4. Pchnij głowicę do góry i obróć do zaczepów
5. W sterowniku przejdź do: **Advanced > Diagnostics and Calibration > Commands & Calibration**
6. W sekcji **Printhead** wprowadź numer seryjny i wartość rezystancji
`
      },
      {
        title: '14. Zebra Print Touch (NFC)',
        content: `
Drukarka ZC350 posiada punkt NFC **Zebra Print Touch** umożliwiający:

- Szybki dostęp do informacji o drukarce przez smartfon z Androidem
- Wyświetlanie filmów instruktażowych i pomocy
- Rozwiązywanie problemów bez komputera

Aby skorzystać: zbliż telefon z NFC do oznaczenia Print Touch na drukarce.
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym jest drukarka ZC350?

**Odpowiedź:** Zebra ZC350 to **flagowa drukarka kart identyfikacyjnych** z serii ZC, z wyświetlaczem LCD 2", zaawansowanymi zabezpieczeniami i obsługą specjalnych taśm 3D/holograficznych.

### Jaka jest prędkość druku ZC350?

**Odpowiedź:** ZC350 drukuje do **225 kart/godz.** (kolor jednostronny), **150 kart/godz.** (kolor dwustronny) i do **1000 kart/godz.** (mono jednostronny).

### Czym różni się ZC350 od ZC300?

**Odpowiedź:** ZC350 jest szybsza (**225 vs 200 kart/h**), obsługuje **specjalne taśmy** (3D, holograficzne, długotrwałe), ma **szyfrowanie klasy rządowej** i opcjonalną **blokadę pokrywy**.

### Jakie specjalne taśmy obsługuje ZC350?

**Odpowiedź:** ZC350 obsługuje: **YMCKLL** (4x dłuższa żywotność karty), **YMCPKO** (efekt holograficzny), **SDYMCKO** (efekty 3D na srebrnym tle).

### Jakie zabezpieczenia oferuje ZC350?

**Odpowiedź:** ZC350 oferuje: **uwierzytelnianie host-drukarka**, **szyfrowanie klasy rządowej**, opcjonalną **blokadę pokrywy** i **pojemnik na karty odrzucone**.

### Czy ZC350 automatycznie dostosowuje się do grubości karty?

**Odpowiedź:** Tak, ZC350 **automatycznie dostosowuje się** do grubości kart w zakresie 10-40 mil bez konieczności ręcznej regulacji.

### Co to jest podajnik typu "saloon"?

**Odpowiedź:** Podajnik wyjściowy ZC350 ma **drzwiczki typu "saloon"** – pozwalają na łatwe wyjęcie kart bez otwierania pokrywy drukarki.

### Jak działa podświetlane podawanie ręczne?

**Odpowiedź:** Szczelina podawania ręcznego **świeci na zielono** gdy jest gotowa na kartę, z **systemem prowadzenia podobnym do bankomatów** wskazującym miejsce włożenia.

### Czy ZC350 obsługuje język polski?

**Odpowiedź:** Tak, sterownik ZC350 obsługuje **9 języków w tym polski**. Język można wybrać w menu Tools > Select language.

### Co to jest Zebra Print Touch?

**Odpowiedź:** **Zebra Print Touch** to punkt NFC na drukarce – zbliż telefon z Androidem aby uzyskać dostęp do pomocy, filmów instruktażowych i informacji o drukarce.

### Co to jest CardStudio?

**Odpowiedź:** **CardStudio** to oprogramowanie Zebra Print DNA do projektowania kart identyfikacyjnych, lojalnościowych i upominkowych – współpracuje z ZC350.

### Jaka jest gwarancja ZC350?

**Odpowiedź:** ZC350 ma **2-letnią gwarancję** obejmującą drukarkę i głowicę drukującą (krótsza niż ZC300 ze względu na zaawansowane funkcje).
`
      }
    ]
  },

  'zc10l': {
    model: 'ZC10L',
    title: 'Zebra ZC10L – Instrukcja obsługi po Polsku',
    lastUpdated: '2025-01-20',
    sourceDocument: 'Zebra ZC10L Card Printer User Guide (P1091978-001)',
    keywords: [
      'zebra zc10l instrukcja', 'zc10l instrukcja po polsku', 'zebra zc10l manual',
      'drukarka kart zebra', 'zc10l drukarka kart', 'zc10l konfiguracja',
      'zc10l taśma', 'drukarka hotelowa', 'karty hotelowe', 'hospitality',
      'zc10l specyfikacja', 'zc10l czyszczenie', 'zc10l błędy', 'zc10l usb',
      'wielkoformatowa drukarka kart', 'karty z zakładką', 'tabbed cards',
      'direct-to-card', 'edge-to-edge', 'zc10l zacięcie', 'zc10l sterownik',
      'zc10l wałek czyszczący', 'tab waste bin', 'card catcher'
    ],
    sections: [
      {
        title: '1. Podstawowe informacje',
        content: `
### O drukarce ZC10L

Zebra ZC10L to wielkoformatowa drukarka kart zaprojektowana specjalnie z myślą o **branży hotelarskiej (Hospitality)**. Jest to jedyna na rynku wielkoformatowa drukarka direct-to-card, która może drukować pełnokolorowe karty **edge-to-edge w jednym procesie drukowania**. Drukarka wykorzystuje technologię termotransferową i wyposażona jest w szufladę na karty, wałek czyszczący oraz pojemnik na odpady (Tab Waste Bin). Model ZC10L posiada panel z trzema diodami LED wskazującymi status drukarki.

### Parametry techniczne

| Parametr | ZC10L |
|----------|-------|
| **Druk** | **Jednostronny, wielkoformatowy** |
| Technologia druku | Termotransfer (Direct-to-Card) |
| Rozdzielczość | 300 dpi |
| Format kart | Karty wielkoformatowe z zakładką (tabbed cards) |
| Pojemność szuflady | Standardowy stos kart |
| Zasilanie | Wewnętrzny zasilacz 90V-264V, 48-62Hz |
| Pobór prądu | Maks. 16A |
| Waga | ok. 19 kg (41,9 lbs) |

### Złącza i komunikacja

| Interfejs | Opis |
|-----------|------|
| USB 2.0 | Połączenie bezpośrednie z PC |

### Porównanie ZC10L vs ZC100

| Parametr | ZC10L | ZC100 |
|----------|-------|-------|
| Przeznaczenie | **Branża hotelarska** | Karty ID |
| Format kart | **Wielkoformatowe z zakładką** | CR80/CR70 |
| Druk edge-to-edge | **Tak** | Nie |
| Waga | 19 kg | 2,9 kg |
| Interfejs | Diody LED | Diody LED |
| Zasilanie | Wewnętrzny | Zewnętrzny 100W |
`
      },
      {
        title: '2. Elementy drukarki',
        content: `
### Widok z przodu i z tyłu

| Nr | Element | Opis |
|----|---------|------|
| 1 | Wskaźniki statusu (LED) | Panel z diodami LED wskazującymi stan drukarki |
| 2 | Górna pokrywa | Otwierana przy wymianie taśmy, kart lub podczas konserwacji |
| 3 | Szuflada na karty | Otwierana przy wkładaniu kart lub podczas konserwacji |
| 4 | Przycisk zwalniający szufladę | Naciśnij, aby otworzyć szufladę na karty |
| 5 | Wyłącznik zasilania | Włącza (|) i wyłącza (O) zasilanie drukarki |
| 6 | Złącze zasilania | Gniazdo kabla zasilającego |
| 7 | Złącze USB | Port USB do połączenia z komputerem |
| 8 | Zwolnienie górnej pokrywy | Ściśnij i pociągnij, aby otworzyć górną pokrywę |
`
      },
      {
        title: '3. Wskaźniki LED',
        content: `
Model ZC10L wyposażony jest w trzy diody LED wskazujące status drukarki: **POWER, MEDIA, ERROR**.

### Znaczenie kombinacji diod

| Power | Media | Error | Znaczenie |
|-------|-------|-------|-----------|
| Off | Off | Off | Drukarka wyłączona |
| Miga | Off | Off | Inicjalizacja; głowica nagrzewa się lub chłodzi |
| On | Off | Off | Drukarka gotowa do pracy |
| On | Off | Miga | Górna pokrywa lub szuflada otwarta |
| On | Off | On | Zacięcie karty; błąd mechaniczny; błąd płyty głównej |
| On | Miga | On | Taśma drukująca nieobsługiwana |
| On | On | On | Błąd podawania kart; brak taśmy; pełny pojemnik odpadów |
| On | Miga | Miga | Synchronizacja taśmy drukującej |
`
      },
      {
        title: '4. Rozpakowanie i instalacja',
        content: `
### Zawartość opakowania

- Drukarka ZC10L
- Card Catcher (łapacz kart)
- Wałek czyszczący
- Kabel USB
- Kabel zasilający

**Ważne:** Zachowaj oryginalne opakowanie do ewentualnego transportu serwisowego.

### Rozpakowanie drukarki

**Uwaga:** Drukarka waży około **19 kg (41,9 lbs)**. Do wyjęcia z kartonu potrzebne są **dwie osoby**!

1. Sprawdź opakowanie pod kątem uszkodzeń transportowych
2. Otwórz karton i wyjmij materiały opakowaniowe
3. Chwyć drukarkę obiema rękami i wyjmij z kartonu
4. Umieść drukarkę na płaskiej powierzchni z minimum 10 cm wolnej przestrzeni ze wszystkich stron

### Podłączenie zasilania

**Ostrzeżenie:** Zasilanie AC musi być w zakresie **90V-264V, 48-62Hz**. Pobór prądu nie może przekraczać 16A.

1. Włóż kabel zasilający do gniazda z tyłu drukarki

### Podłączenie USB

**Ważne:** Przed włączeniem drukarki zainstaluj sterownik USB!

1. Podłącz wtyk USB do gniazda z tyłu drukarki
2. Podłącz drugi koniec do portu USB komputera
`
      },
      {
        title: '5. Ładowanie materiałów eksploatacyjnych',
        content: `
### Ładowanie kart

**Uwaga:** NIE zginaj kart i nie dotykaj powierzchni druku – może to pogorszyć jakość wydruku.

1. Zdejmij folię z pakietu kart
2. Trzymając karty za boki, oprzyj stos pionowo o blat biurka
3. Przesuń stos w przód i w tył pod kątem ok. 45° aby rozdzielić karty
4. Przywróć stos do prostokątnego ułożenia
5. Otwórz szufladę na karty
6. Włóż karty do szuflady **zakładką do dołu**
7. Upewnij się, że karty leżą płasko
8. Zamknij szufladę

### Instalacja Card Catcher (łapacza kart)

1. Otwórz szufladę na karty
2. Zamontuj łapacz kart na przedniej krawędzi szuflady
3. Zamknij szufladę

### Instalacja wałka czyszczącego

**Ważne:** Wałek pasuje tylko w jednym kierunku: dłuższy trzpień idzie w lewo, krótszy w prawo.

1. Otwórz górną pokrywę
2. Włóż wałek czyszczący do drukarki
3. Wciśnij aż usłyszysz kliknięcie

### Instalacja taśmy drukującej

1. Wsuń szpulę z taśmą w prowadnice (w stronę tyłu drukarki)
2. Wsuń szpulę odbiorczą w prowadnice (w stronę przodu drukarki)
3. Obróć lekko szpulę podającą, aby usunąć luz taśmy
4. Zamknij górną pokrywę

**Uwaga:** Jeśli taśma się zerwie, połącz końce taśmą klejącą i przewiń poza miejsce zerwania.
`
      },
      {
        title: '6. Instalacja sterownika Windows',
        content: `
Sterownik obsługuje: Windows 7, 8, 10, Server 2008, Server 2012.

### Procedura instalacji

1. Uruchom instalator sterownika drukarki
2. Zaznacz **Agree** w oknie umowy licencyjnej i kliknij **Next**
3. Zamknij inne uruchomione aplikacje i kliknij **Next**
4. Wybierz model **Zebra ZC10L USB Card Printer** i kliknij **Next**
5. Wybierz metodę instalacji **Plug and Play** i kliknij **Next**
6. Sprawdź informacje i kliknij **Finish**
7. Jeśli pojawi się ostrzeżenie Windows Security, kliknij **Install this driver software anyway**
8. Włącz drukarkę i podłącz kabel USB
9. Kliknij **Finish**

**Ważne:** Po instalacji może być konieczne ponowne uruchomienie komputera.
`
      },
      {
        title: '7. Pojemnik na odpady (Tab Waste Bin)',
        content: `
Podczas druku kart z zakładkami, obcięte zakładki gromadzą się w pojemniku na odpady. Należy go **regularnie opróżniać**.

### Opróżnianie pojemnika

1. Otwórz szufladę na karty
2. Wyjmij pojemnik na odpady i opróżnij zawartość do kosza
3. Włóż pojemnik z powrotem na miejsce
4. Zamknij szufladę

**Uwaga:** Gdy diody pokazują błąd (wszystkie świecą), jedną z przyczyn może być pełny pojemnik odpadów.
`
      },
      {
        title: '8. Konserwacja i czyszczenie',
        content: `
Dzięki technologii termotransferowej codzienna konserwacja nie jest konieczna. Jednak dla utrzymania najwyższej jakości druku, zaleca się czyszczenie głowicy, wałka dociskowego i wałka czyszczącego **raz w miesiącu**.

### Czyszczenie głowicy drukującej

**Uwaga:** Głowica jest bardzo gorąca tuż po drukowaniu – nie dotykaj jej! Poczekaj aż ostygnie.

**Uwaga:** Zdejmij pierścionki, zegarki i inne metalowe przedmioty przed pracą przy głowicy.

1. Otwórz górną pokrywę
2. Użyj niestrzępiącej się szmatki nasączonej alkoholem izopropylowym do wyczyszczenia elementu grzejnego głowicy i listew napinających taśmę

### Czyszczenie wałka dociskowego (Platen)

1. Otwórz górną pokrywę
2. Wyjmij taśmę drukującą
3. Użyj szmatki z alkoholem do wyczyszczenia wałka dociskowego

### Czyszczenie wałka czyszczącego

1. Wyjmij wałek czyszczący z drukarki
2. Wyczyść szmatką z alkoholem
3. Zamontuj wałek z powrotem

### Czyszczenie obudowy zewnętrznej

Przetrzyj zewnętrzną powierzchnię miękką szmatką. W przypadku uporczywych zabrudzeń użyj rozcieńczonego neutralnego detergentu.

### Czyszczenie filtrów

Jeśli kurz gromadzi się na otworach wentylacyjnych, oczyść je odkurzaczem.
`
      },
      {
        title: '9. Rozwiązywanie problemów',
        content: `
### Objawy awarii

| Objaw | Działanie |
|-------|-----------|
| Brak zasilania | Sprawdź kabel zasilający |
| Komputer nie rozpoznaje drukarki | Sprawdź kabel USB |
| Drukarka nie osiąga stanu gotowości | Upewnij się, że szuflada i pokrywa są zamknięte; sprawdź czy nie ma zacięcia |
| Szuflada nie otwiera się | Upewnij się, że drukarka stoi na płaskiej powierzchni |
| Białe linie na karcie | Głowica może być brudna – wyczyść ją |
| Niewydrukowane "plamy" | Wałek czyszczący lub głowica brudne – wyczyść |

### Zacięcie karty

1. Otwórz górną pokrywę i wyjmij taśmę drukującą
2. Znajdź zielone kółko ręcznego posuwu (z tyłu po lewej)
3. Obracaj kółko zgodnie z ruchem wskazówek zegara, aż karta się zatrzyma
4. Ostrożnie wyjmij kartę

### Przerwa w zasilaniu podczas drukowania

1. Wyłącz drukarkę
2. Poczekaj na przywrócenie zasilania
3. Włącz drukarkę po kilku sekundach

Niektóre karty mogą wymagać ponownego wydrukowania.
`
      },
      {
        title: '10. Dane techniczne',
        content: `
### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Waga | ok. 19 kg (41,9 lbs) |

### Warunki pracy

| Parametr | Wartość |
|----------|---------|
| Napięcie zasilania | 90V – 264V AC |
| Częstotliwość | 48 – 62 Hz |
| Maksymalny pobór prądu | 16A |

### Wymagania środowiskowe

- Środowisko w miarę wolne od kurzu i brudu
- Płaska, stabilna powierzchnia
- Minimum 10 cm wolnej przestrzeni ze wszystkich stron
- Dostęp do zasilania AC
`
      },
      {
        title: 'FAQ – Najczęściej zadawane pytania',
        content: `
### Czym jest drukarka ZC10L?

**Odpowiedź:** Zebra ZC10L to **wielkoformatowa drukarka kart** zaprojektowana dla **branży hotelarskiej**, drukująca karty z zakładkami (tabbed cards) edge-to-edge w jednym procesie.

### Do czego służy ZC10L?

**Odpowiedź:** ZC10L służy do drukowania **kart hotelowych** (key cards) z zakładkami – wielkoformatowych kart identyfikacyjnych i dostępowych dla gości hotelowych.

### Czym różni się ZC10L od ZC100?

**Odpowiedź:** ZC10L drukuje **wielkoformatowe karty z zakładkami** (dla hoteli), waży **19 kg** i ma wbudowany zasilacz. ZC100 drukuje standardowe karty CR80/CR70 i waży tylko 2,9 kg.

### Co to jest druk edge-to-edge?

**Odpowiedź:** Druk **edge-to-edge** oznacza drukowanie na całej powierzchni karty, od krawędzi do krawędzi, bez białych marginesów – ZC10L jako jedyna wielkoformatowa drukarka oferuje to w jednym procesie.

### Ile osób potrzeba do przenoszenia ZC10L?

**Odpowiedź:** Ze względu na wagę **19 kg (41,9 lbs)**, do wyjęcia drukarki z kartonu i przenoszenia potrzebne są **dwie osoby**.

### Co to jest Tab Waste Bin?

**Odpowiedź:** **Tab Waste Bin** to pojemnik na odpady, w którym gromadzą się obcięte zakładki kart. Należy go **regularnie opróżniać**.

### Co to jest Card Catcher?

**Odpowiedź:** **Card Catcher** (łapacz kart) to akcesorium montowane na przedniej krawędzi szuflady, które zbiera wydrukowane karty.

### Co oznacza gdy wszystkie diody świecą?

**Odpowiedź:** Wszystkie trzy diody świecące (POWER, MEDIA, ERROR) oznaczają: **błąd podawania kart**, **brak taśmy** lub **pełny pojemnik odpadów**.

### Jak usunąć zacięcie karty?

**Odpowiedź:** Otwórz górną pokrywę, wyjmij taśmę, znajdź **zielone kółko ręcznego posuwu** (z tyłu po lewej) i obracaj zgodnie z ruchem wskazówek zegara aż karta się wysunie.

### Jak często czyścić ZC10L?

**Odpowiedź:** Zaleca się czyszczenie głowicy drukującej, wałka dociskowego i wałka czyszczącego **raz w miesiącu** dla utrzymania najwyższej jakości druku.

### Jak zainstalować wałek czyszczący?

**Odpowiedź:** Wałek pasuje tylko w jednym kierunku: **dłuższy trzpień w lewo, krótszy w prawo**. Włóż i wciśnij aż usłyszysz kliknięcie.

### Jakie systemy obsługuje sterownik ZC10L?

**Odpowiedź:** Sterownik obsługuje **Windows 7, 8, 10, Server 2008 i Server 2012**.
`
      }
    ]
  }
}

// Funkcja pomocnicza do pobierania polskiej instrukcji
export function getPolishManual(model: string): PolishManual | null {
  const normalizedModel = model.toLowerCase().replace(/^zebra-/, '').replace(/-/g, '')
  return polishManuals[normalizedModel] || null
}

// Sprawdź czy model ma polską instrukcję
export function hasPolishManual(model: string): boolean {
  const normalizedModel = model.toLowerCase().replace(/^zebra-/, '').replace(/-/g, '')
  return normalizedModel in polishManuals
}
