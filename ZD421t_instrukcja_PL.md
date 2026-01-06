# Instrukcja obsługi drukarki Zebra ZD421t

**Drukarka termotransferowa (Thermal Transfer)**

---

## 1. Podstawowe informacje

### O drukarce ZD421t

Zebra ZD421t to kompaktowa drukarka etykiet wykorzystująca technologię druku termotransferowego. Drukarka **wymaga taśmy barwiącej (ribbonu)**, co zapewnia trwałe wydruki odporne na ścieranie, wilgoć i chemikalia.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do 152 mm/s (6 cali/s) |
| Prędkość druku (300 dpi) | do 102 mm/s (4 cale/s) |
| Szerokość druku | do 104 mm (4 cale) |
| Maks. średnica rolki | 127 mm (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Obsługiwane rolki ribbonu | 74 m i 300 m |

### Złącza standardowe

- USB 2.0
- Gniazdo na moduł łączności (opcjonalny Ethernet lub RS-232)

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZD421t
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m (jeśli używasz ribbonów innych niż Zebra)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na płaskiej, stabilnej powierzchni
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy i wymianę materiałów
- Unikaj bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: 5°C – 40°C

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały i ribbon

---

## 3. Ładowanie materiałów eksploatacyjnych

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków
- **Etykiety papierowe, foliowe i syntetyczne**

### Procedura ładowania etykiet

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki

2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki

3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. Strona do zadruku musi być skierowana w górę

4. **Przeprowadź materiał** – przeciągnij etykiety pod obiema prowadnicami materiału

5. **Ustaw czujnik** (w zależności od typu materiału):
   - Dla etykiet z przerwą: czujnik w pozycji domyślnej (środkowej)
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik

6. **Nie zamykaj jeszcze pokrywy** – najpierw załaduj ribbon

### Ładowanie taśmy barwiącej (ribbonu)

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę drukującą.

#### Typy ribbonów Zebra:
- **Performance Wax** – do etykiet papierowych
- **Premium Wax/Resin** – do etykiet papierowych powlekanych
- **Performance Resin** – do etykiet syntetycznych
- **Premium Resin** – do etykiet foliowych i syntetycznych

#### Procedura ładowania ribbonu:

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

---

## 4. Podstawowa obsługa i kalibracja

### Panel sterowania

Drukarka posiada 3 przyciski i 5 wskaźników LED:

| Przycisk | Funkcja |
|----------|---------|
| **POWER** | Włączanie/wyłączanie drukarki |
| **FEED** | Wysuw jednej etykiety |
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **CANCEL** | Anulowanie zadań (gdy drukarka jest wstrzymana) |

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| STATUS | Zielony | Drukarka gotowa |
| STATUS | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| PAUSE | Pomarańczowy | Drukarka wstrzymana |
| DATA | Zielony mrugający | Transmisja danych |
| SUPPLIES | Czerwony | Brak materiału |
| SUPPLIES | Czerwony mrugający | Brak ribbonu |

### Ustawienie trybu druku

Drukarka ZD421t może pracować w dwóch trybach:

- **Thermal Transfer** – z ribbonem (domyślny)
- **Direct Thermal** – bez ribbonu (dla materiałów termoczułych)

Sprawdź ustawienie na raporcie konfiguracji. Zmiana trybu wymaga zmiany parametru PRINT METHOD.

### Kalibracja SmartCal (automatyczna)

Po załadowaniu nowego typu materiału lub ribbonu:

1. Upewnij się, że drukarka jest włączona i w stanie gotowości (STATUS = zielony)
2. Naciśnij i przytrzymaj jednocześnie **PAUSE** + **CANCEL** przez 2 sekundy
3. Zwolnij przyciski
4. Drukarka automatycznie wysunie kilka etykiet i wykona kalibrację
5. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa
2. Naciśnij i przytrzymaj **FEED** + **CANCEL** przez 2 sekundy
3. Drukarka wydrukuje raport konfiguracji
4. Sprawdź czy PRINT METHOD = THERMAL-TRANS

---

## 5. Podłączenie do komputera

### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki **Zebra Setup Utilities** ze strony: [zebra.com/setup](https://zebra.com/setup)

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
3. Drukarka automatycznie pobierze adres IP z DHCP
4. Wydrukuj raport konfiguracji, aby sprawdzić przydzielony adres IP

### Połączenie Wi-Fi/Bluetooth (opcja)

Wymaga fabrycznie zainstalowanego modułu bezprzewodowego:

1. Pobierz aplikację **Zebra Printer Setup Utility** na telefon/tablet
2. Włącz Bluetooth na urządzeniu mobilnym
3. Użyj funkcji NFC (Print Touch) lub wyszukaj drukarkę w aplikacji
4. Postępuj zgodnie z instrukcjami w aplikacji

---

## 6. Konserwacja i czyszczenie

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone alkoholem izopropylowym (99,7%)
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon (jeśli jest załadowany)
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. Czyść od środka ku zewnętrznym krawędziom
5. Poczekaj około 1 minuty aż alkohol wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

### Czyszczenie czujników

1. Wyłącz drukarkę i otwórz pokrywę
2. Zlokalizuj czujniki (ruchomy czujnik pod materiałem i górny czujnik)
3. Delikatnie przedmuchaj sprężonym powietrzem
4. Przetrzyj patyczkiem nasączonym alkoholem
5. Poczekaj aż wyschnie

### Czyszczenie wałka napędowego

1. Obróć wałek ręcznie i przetrzyj go ściereczką nasączoną alkoholem
2. Nie używaj ostrych przedmiotów
3. Sprawdź czy wałek nie jest uszkodzony

---

## 7. Rozwiązywanie problemów

### Wskaźnik STATUS świeci na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Wykonaj kalibrację SmartCal |

### Wskaźnik SUPPLIES mruga na czerwono (RIBBON OUT)

- Sprawdź czy ribbon jest prawidłowo załadowany
- Sprawdź czy ribbon nie jest zużyty (widoczna srebrna folia odbijająca = koniec ribbonu)
- Wymień ribbon na nowy

### Brak wydruku na etykiecie

- Sprawdź czy ribbon jest załadowany i prawidłowo napięty
- Sprawdź czy tryb druku jest ustawiony na THERMAL-TRANS
- Zwiększ ciemność druku w ustawieniach
- Wyczyść głowicę drukującą

### Marszczenie ribbonu (smugi na wydruku)

- Sprawdź czy ribbon jest prawidłowo wyrównany
- Usuń luz z ribbonu
- Sprawdź czy ribbon jest odpowiedni dla danego materiału
- Zmniejsz ciemność druku lub prędkość

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj kalibrację SmartCal
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

### Zacięcie materiału lub ribbonu

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał/ribbon
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał i ribbon ponownie

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
