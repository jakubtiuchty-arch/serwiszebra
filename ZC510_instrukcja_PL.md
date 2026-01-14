# Instrukcja obsługi drukarki Zebra ZD510

**Drukarka opasek identyfikacyjnych na nadgarstek**

---

## 1. Podstawowe informacje

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
- Język programowania ZPL II
- Wsparcie dla czcionek TrueType i OpenType
- Wbudowany zegar czasu rzeczywistego (RTC)

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

---

## 2. Rozpakowanie i instalacja

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

---

## 3. Panel sterowania

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

### Wskaźniki Wi-Fi (opcja)

| Wskaźnik | Znaczenie |
|----------|-----------|
| Zielony (stały) | Połączony z WLAN, silny sygnał |
| Zielony (migający) | Niepołączony z WLAN, silny sygnał |
| Pomarańczowy (stały) | Połączony z WLAN, słaby sygnał |
| Pomarańczowy (migający) | Niepołączony z WLAN, słaby sygnał |
| Wyłączony | Brak sygnału Wi-Fi |

### Tryb konfiguracji użytkownika

Przytrzymaj przycisk PAUSE/FEED – wskaźnik będzie migać pomarańczowo co 2 sekundy:

| Liczba mignięć | Akcja po zwolnieniu przycisku |
|----------------|-------------------------------|
| 1 | Drukuje raport konfiguracji |
| 2 | Drukuje profil czujnika mediów |
| 3 | Resetuje parametry sieciowe do domyślnych |
| 4 | Resetuje wszystkie parametry drukarki do domyślnych |

---

## 4. Ładowanie kartridża z opaskami

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

> **Uwaga:** Używaj wyłącznie oryginalnych kartridży Zebra™. Kartridże nie mogą być napełniane ani przerabiane.

### Wskazówki dotyczące kartridży

- **Nie ciągnij materiału** z kartridża – może to uszkodzić mechanizm
- **Przechowuj w opakowaniu** aż do użycia
- **Jeśli materiał wystaje** z kartridża, odetnij go nożyczkami przed włożeniem
- **Sprawdzaj datę ważności** – materiały termiczne mają określony okres przydatności

### Wyjmowanie kartridża

1. Naciśnij przycisk **EJECT**
2. Drukarka automatycznie wcofa materiał i wysunie kartridż
3. Wyjmij kartridż z drukarki

---

## 5. Otwieranie górnej pokrywy

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

---

## 6. Strefa druku na opasce

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

---

## 7. Zebra Print Touch (NFC) – opcja

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

---

## 8. Konfiguracja i ustawienia

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

---

## 9. Podłączenie do komputera

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

### Parowanie Bluetooth (opcja)

1. Otwórz Zebra Setup Utilities
2. Kliknij **Configure Printer Connectivity**
3. Wybierz **Bluetooth**
4. Włącz Bluetooth i ustaw **Discoverable** na ON
5. Wprowadź nazwę przyjazną (Friendly Name)
6. Wyślij konfigurację do drukarki

---

## 10. Weryfikacja działania

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

---

## 11. Konserwacja

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

### Czyszczenie wałka dociskowego

1. Otwórz górną pokrywę
2. Przetrzyj wałek wacikiem z alkoholem, obracając go ręcznie
3. Poczekaj aż wyschnie

### Czyszczenie styków Smart Card

1. Użyj wacika zwilżonego alkoholem
2. Przetrzyj złote styki czytnika w szczelinie kartridża
3. Poczekaj aż wyschnie przed włożeniem kartridża

### Wymiana głowicy drukującej

Głowica jest elementem wymiennym przez użytkownika. Procedura wymaga:
1. Wyłączenia drukarki
2. Otwarcia górnej pokrywy
3. Odłączenia kabli głowicy
4. Wyjęcia starej głowicy
5. Instalacji nowej głowicy
6. Podłączenia kabli
7. Zamknięcia pokrywy

> **Uwaga:** Szczegółowe instrukcje znajdują się w dokumentacji serwisowej.

### Wymiana wałka dociskowego

Wałek (platen) jest elementem wymiennym przez użytkownika:
1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij głowicę drukującą
3. Podnieś zielone ramiona po bokach wałka
4. Wyjmij stary wałek
5. Włóż nowy wałek i opuść ramiona
6. Zainstaluj głowicę drukującą
7. Zamknij pokrywę

---

## 12. Rozwiązywanie problemów

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
| Materiał wciąga się do kartridża | Otwórz kartridż i wyciągnij materiał (tylko szare kartridże) |
| Chip odłączył się od kartridża | Wciśnij chip z powrotem i zamknij zatrzaski |
| Kartridż nie wysuwa się | Użyj ręcznego wysuwu (śrubokręt) |

### Problemy z komunikacją

| Problem | Rozwiązanie |
|---------|-------------|
| Brak transferu danych | Sprawdź kable i ustawienia komunikacji |
| Dane przesyłane, brak druku | Sprawdź prefiks i delimiter ZPL |
| Zmiana adresu IP po restarcie | Ustaw statyczny adres IP |
| Brak połączenia Wi-Fi | Sprawdź ESSID i ustawienia zabezpieczeń |

### Przywracanie ustawień fabrycznych

**Ustawienia sieciowe:**
Przytrzymaj PAUSE/FEED → zwolnij po 3 pomarańczowych mignięciach

**Wszystkie ustawienia:**
Przytrzymaj PAUSE/FEED → zwolnij po 4 pomarańczowych mignięciach

---

## 13. USB Host

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

---

## 14. Specyfikacje

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

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Zasilacz | Zewnętrzny, certyfikat medyczny |
| Wejście AC | 100-240 VAC, 50-60 Hz |

### Środowisko

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | 0°C do +40°C | 20-85% bez kondensacji |
| Przechowywanie | -40°C do +60°C | 5-85% bez kondensacji |

### Certyfikaty

- FCC Class B
- CE
- Zasilacz z certyfikatem medycznym

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
