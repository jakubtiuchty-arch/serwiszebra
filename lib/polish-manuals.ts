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
      }
    ]
  },

  'zd411t': {
    model: 'ZD411t',
    title: 'Zebra ZD411t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD411 Series User Guide',
    keywords: [
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
      }
    ]
  },

  'zd411d': {
    model: 'ZD411d',
    title: 'Zebra ZD411d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD411 Series User Guide',
    keywords: [
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
      }
    ]
  },

  'zd611d': {
    model: 'ZD611d',
    title: 'Zebra ZD611d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD611 Series User Guide',
    keywords: [
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
      }
    ]
  },

  'zd611t': {
    model: 'ZD611t',
    title: 'Zebra ZD611t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD611 Series User Guide',
    keywords: [
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
      }
    ]
  },

  'zd220d': {
    model: 'ZD220d',
    title: 'Zebra ZD220d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd220d instrukcja',
      'zd220d instrukcja po polsku',
      'zebra zd220d manual',
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
      }
    ]
  },

  'zd220t': {
    model: 'ZD220t',
    title: 'Zebra ZD220t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd220t instrukcja',
      'zd220t instrukcja po polsku',
      'zebra zd220t manual',
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
      }
    ]
  },

  'zd230d': {
    model: 'ZD230d',
    title: 'Zebra ZD230d – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd230d instrukcja',
      'zd230d instrukcja po polsku',
      'zebra zd230d manual',
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
      }
    ]
  },

  'zd230t': {
    model: 'ZD230t',
    title: 'Zebra ZD230t – Instrukcja obsługi po Polsku',
    lastUpdated: '2026-01-07',
    sourceDocument: 'Zebra ZD200 Series User Guide',
    keywords: [
      'zebra zd230t instrukcja',
      'zd230t instrukcja po polsku',
      'zebra zd230t manual',
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
