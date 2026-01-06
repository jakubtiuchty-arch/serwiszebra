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
    title: 'Zebra ZD421t – Skrócona instrukcja obsługi',
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
      }
    ]
  },

  'zd421d': {
    model: 'ZD421d',
    title: 'Zebra ZD421d – Skrócona instrukcja obsługi',
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
      }
    ]
  },

  'zd621t': {
    model: 'ZD621t',
    title: 'Zebra ZD621t – Skrócona instrukcja obsługi',
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
      }
    ]
  },

  'zd621d': {
    model: 'ZD621d',
    title: 'Zebra ZD621d – Skrócona instrukcja obsługi',
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
      }
    ]
  },

  'zd621r': {
    model: 'ZD621R',
    title: 'Zebra ZD621R – Skrócona instrukcja obsługi (RFID)',
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

\`\`\`zpl
^XA
^RS8,,,3                        ; Konfiguracja RFID
^RFW,H^FD1234567890ABCDEF^FS    ; Zapis danych HEX do EPC
^FO50,50^A0N,50,50^FDProdukt ABC^FS
^FO50,120^BY3^BCN,100,Y,N,N^FD1234567890^FS
^XZ
\`\`\`

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
