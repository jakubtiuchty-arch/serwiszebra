# Kompletna baza wiedzy: problemy skanerów Zebra serii LS, DS i LI

Skanery Zebra dominują rynek przemysłowych urządzeń do odczytu kodów kreskowych, ale użytkownicy regularnie zgłaszają typowe problemy techniczne. Ten raport dokumentuje **wszystkie główne usterki sprzętowe, programowe i integracyjne** dla trzech serii: laserowej LS, imagerowej DS oraz liniowo-obrazowej LI. Każdy problem zawiera objawy diagnostyczne, przyczyny źródłowe i procedury naprawcze krok po kroku — od prostych czynności użytkownika po sytuacje wymagające serwisu profesjonalnego. Materiał uwzględnia specyfikę polskiego rynku, w tym integrację z systemami WMS, kasami fiskalnymi, SILP Lasów Państwowych oraz wymogami Dyrektywy Fałszywkowej w aptekach.

---

## Problemy sprzętowe wspólne dla wszystkich serii

### Uszkodzenia elementu skanującego (laser/imager)

**Objawy rozpoznawcze:**
- Brak wiązki laserowej (LS) lub linii celującej (DS, LI) po naciśnięciu triggera
- Słaba lub migocząca wiązka świetlna
- Skaner emituje dźwięk potwierdzenia, ale nie dekoduje kodów
- Niestabilne odczyty wymagające wielokrotnych prób skanowania

**Przyczyny źródłowe:**
- Brak zasilania skanera lub rozładowana bateria
- Uszkodzony kabel USB/RS-232
- Zużycie modułu laserowego (seria LS) lub sensora obrazowego (DS, LI)
- Zanieczyszczone okienko skanujące
- Uszkodzenie po upadku przekraczającym specyfikację

**Procedura diagnostyczna krok po kroku:**
1. Sprawdź połączenie kabla — odłącz i podłącz ponownie do innego portu USB
2. Dla modeli bezprzewodowych: naładuj baterię minimum **4 godziny**
3. Oczyść okienko skanera miękką, niestrzępiącą się ściereczką
4. Wykonaj reset fabryczny — zeskanuj kod **SET DEFAULTS** z instrukcji
5. Przetestuj z innym, pewnie działającym kodem kreskowym
6. Dla serii DS: włącz funkcję "Enable Aiming Line" jeśli linia celująca nie pojawia się

**Kiedy serwis profesjonalny:** Gdy po wykonaniu wszystkich kroków element skanujący nadal nie działa — wymiana modułu laserowego lub imagera wymaga autoryzowanego serwisu.

**Modele dotknięte:** Wszystkie LS1203, LS2208, LS4208, LS4278, LS3578; DS2208, DS4308, DS4608, DS8108, DS8178, DS9208, DS9308; LI2208, LI4278

---

### Problemy z okienkiem skanującym

**Objawy rozpoznawcze:**
- Pogorszona jakość skanowania w czasie
- Konieczność wielokrotnego skanowania tego samego kodu
- Problemy z odczytem z normalnej odległości roboczej
- Skaner odczytuje tylko bardzo wyraźne, duże kody

**Przyczyny źródłowe:**
- Kurz i zabrudzenia na soczewce
- Zarysowania od nieprawidłowego czyszczenia lub upadków
- Osady chemiczne (szczególnie w środowisku przemysłowym)
- Odciski palców i smugi

**Procedura czyszczenia:**
1. **Czyszczenie codzienne:** miękka ściereczka bezwłóknowa, delikatne przecieranie
2. **Czyszczenie głębokie:** alkohol izopropylowy na ściereczce (nie bezpośrednio na okienko)
3. **Zabronione środki:** aceton, amoniak, benzen, eter, ketony, rozcieńczalniki
4. Dla modeli Healthcare (DS4608-HC, DS8108-HC): tylko środki z listy zatwierdzonej przez Zebra

**Kiedy serwis profesjonalny:** Głębokie zarysowania wymagają wymiany okienka — część zamienna LS3578: **21-92853-01**

**Modele dotknięte:** Wszystkie modele wszystkich serii

---

### Uszkodzenia mechaniczne (trigger, obudowa)

**Objawy rozpoznawcze:**
- Przycisk trigger nie reaguje lub wymaga silnego naciśnięcia
- Trigger zacina się w pozycji wciśniętej
- Widoczne pęknięcia obudowy
- Luźne elementy wewnętrzne słyszalne przy potrząsaniu
- Skaner aktywuje się samoczynnie bez naciśnięcia triggera

**Przyczyny źródłowe:**
- Upadek przekraczający specyfikację odporności modelu
- Wielokrotne upadki powodujące kumulację uszkodzeń
- Mechaniczne zużycie przełącznika trigger przy intensywnym użytkowaniu
- Wnikanie zanieczyszczeń do mechanizmu

**Specyfikacje odporności na upadki:**
| Model | Odporność | Klasa IP |
|-------|-----------|----------|
| LS1203, LS2208 | 1,5m (5 ft) | IP40 |
| LS4208, LS4278 | 1,8m (6 ft) | IP43 |
| LS3578 | 1,8m wielokrotnie | **IP54** |
| DS2208 | 1,5m | IP42 |
| DS4608 | 1,8m | IP52 |
| DS8108/DS8178 | 2,1m | IP52/IP43 |
| LI2208 | 1,8m (100+ upadków) | IP42 |
| LI4278 | 1,8m (100+ upadków) | IP43 |

**Procedura diagnostyczna:**
1. Po upadku: restart skanera, reset do ustawień fabrycznych
2. Oczyść mechanizm triggera sprężonym powietrzem
3. Sprawdź czy obudowa jest prawidłowo złożona
4. Przetestuj na innym komputerze

**Kiedy serwis profesjonalny:** Wymiana triggera lub obudowy wymaga profesjonalnej naprawy — mikrostyk i taśma łącząca z płytą główną to najczęstsze usterki wg polskich serwisów.

---

### Uszkodzenia kabli i złączy

**Objawy rozpoznawcze:**
- Skaner włącza się i wyłącza nieregularnie
- Komunikat "Unknown USB Device" w Windows
- Przerywana transmisja danych
- **4 krótkie piknięcia z czerwoną diodą LED** (kod błędu transmisji)
- Brak zasilania skanera (diody LED nie świecą)

**Przyczyny źródłowe:**
- Fizyczne uszkodzenie kabla (przetarcia, zagniecenia)
- Poluzowane złącze w skanerze lub porcie komputera
- Nieoryginalne kable niekompatybilne elektrycznie
- Niewystarczające zasilanie z portu USB (szczególnie przez hub)
- Uszkodzone piny w złączu RJ-45 skanera

**Procedura naprawcza USB:**
1. Odłącz i ponownie podłącz kabel — sprawdź czy jest całkowicie wsunięty
2. Wypróbuj inny port USB (preferuj USB 3.0, bezpośrednio do komputera)
3. Wizualnie sprawdź kabel pod kątem uszkodzeń
4. Wymień na oryginalny kabel Zebra (LI2208/LI4278: **CBA-U01-S07ZAR**)
5. Zainstaluj sterownik USB CDC ze strony Zebra
6. Użyj zasilanego huba USB jeśli port nie dostarcza wystarczającej mocy

**Procedura naprawcza RS-232:**
1. Upewnij się że zewnętrzny zasilacz jest podłączony (RS-232 nie dostarcza zasilania)
2. Sprawdź parametry komunikacji: standardowo **9600 baud, 8 bitów danych, 1 bit stopu, brak parzystości**
3. Użyj kabli Zebra z konwersją TTL-to-RS-232C
4. Zeskanuj odpowiedni kod host type z Product Reference Guide

**Kiedy serwis profesjonalny:** Gdy problem występuje z wieloma różnymi kablami — prawdopodobne uszkodzenie portu w urządzeniu.

---

## Problemy z bateriami (modele bezprzewodowe)

### Bateria nie ładuje się lub szybko się rozładowuje

**Modele dotknięte:** LS4278, LS3578, DS6878, DS8178, LI4278

**Objawy rozpoznawcze:**
- Skaner nie włącza się po umieszczeniu w stacji dokującej
- Dioda ładowania nie świeci lub świeci na czerwono dłużej niż 3 sekundy
- Bateria wytrzymuje znacznie krócej niż specyfikacja
- **3 krótkie piknięcia przed skanowaniem** — sygnał niskiego poziomu baterii
- Skaner działa tylko na stacji dokującej

**Przyczyny źródłowe:**
- Zużyta bateria (żywotność: **2-3 lata** przy codziennym użytkowaniu)
- Nieprawidłowe osadzenie baterii w gnieździe
- Zabrudzenie styków ładowania (skanera lub stacji)
- Błąd temperatury — ładowanie poza zakresem **0-40°C**
- Ładowanie przez USB zamiast dedykowanego zasilacza (powolne trickle charge)
- Ustawienia oszczędzania energii Windows wyłączające USB

**Procedura diagnostyczna i naprawcza:**
1. **Oczyść styki ładowania** wacikiem nasączonym alkoholem izopropylowym
2. Sprawdź czy skaner jest prawidłowo osadzony w stacji (styki muszą się stykać)
3. Sprawdź zasilanie stacji — dioda LED powinna świecić
4. Użyj dedykowanego zasilacza zamiast ładowania USB
5. Sprawdź temperaturę otoczenia: idealna **5-35°C** do ładowania
6. **Wykonaj kalibrację baterii** (zalecana raz na kwartał):
   - Naładuj baterię do 100%
   - Używaj skanera do pełnego rozładowania
   - Naładuj ponownie do pełna bez przerw
7. Dla LI4278: zeskanuj kod **Battery Recondition** z instrukcji
8. W Windows: wyłącz opcję "Zezwalaj komputerowi na wyłączanie urządzenia w celu oszczędzania energii" w Device Manager → USB

**Specyfikacje baterii:**
| Model | Typ baterii | Czas pracy | Czas ładowania |
|-------|-------------|------------|----------------|
| LS4278 | Li-Ion | ~57 000 skanów | ~4h |
| LS3578 | NiMH | do 12h | ~4h |
| LI4278 | NiMH | 50 000+ skanów | ~3h (zasilacz), ~5h (USB) |
| DS6878 | Li-Ion | 72 000 skanów | ~4h |
| DS8178 | PowerPrecision | 57 000 skanów | ~4h |

**Wskaźniki LED ładowania (LI4278, DS6878, DS8178):**
| LED | Znaczenie |
|-----|-----------|
| Zielony pulsujący | Ładowanie w toku |
| Zielony stały | W pełni naładowany |
| Czerwony stały >3s | Błąd / tryb pre-charge po głębokim rozładowaniu |
| Żółty | Ładowanie przez USB (wolniejsze) |
| Czerwono-zielone miganie | Rekondycjonowanie baterii |

**Kiedy serwis profesjonalny:** Gdy wymiana baterii nie rozwiązuje problemu — prawdopodobne uszkodzenie obwodu ładowania. Części zamienne: LS3578 Battery Pack **P1033090-001**.

---

## Problemy z Bluetooth (modele bezprzewodowe)

### Skaner nie paruje się ze stacją dokującą lub hostem

**Modele dotknięte:** LS4278, LS3578, DS6878, DS8178, LI4278

**Objawy rozpoznawcze:**
- Skaner nie łączy się automatycznie po włożeniu do stacji
- Brak sygnału dźwiękowego połączenia (niska/wysoka nuta)
- Urządzenie niewidoczne na liście Bluetooth
- Dioda LED stacji nie świeci na zielono
- Błąd parowania na hoście

**Przyczyny źródłowe:**
- Skaner sparowany z innym urządzeniem (wymaga rozpięcia)
- Tryb parowania nieaktywny
- Podstawka nieprawidłowo podłączona lub bez zasilania
- Niekompatybilny stack Bluetooth na hoście
- Zbyt duża odległość podczas próby parowania

**Metody parowania — podstawka (cradle):**

**A) Presentation Cradle (CR0078-P):**
- Parowanie automatyczne przez kontakty — włóż skaner do podstawki
- Poczekaj na sekwencję dźwięków: low/high = połączenie ustanowione

**B) Standard Cradle (CR0078-S):**
1. Znajdź kod parowania na etykiecie (góra lub dół podstawki)
2. Zeskanuj ten kod
3. Poczekaj na potwierdzenie dźwiękiem (3 sygnały)

**Parowanie bezpośrednie z komputerem/tabletem:**
1. Wykonaj reset fabryczny skanera (SET DEFAULTS)
2. Zeskanuj kod "Bluetooth Discoverable Mode" z PRG
3. Na hoście: włącz Bluetooth i wyszukaj urządzenia
4. Wybierz skaner z listy i potwierdź parowanie
5. Zbliż urządzenia do siebie (<1m) podczas parowania

**Tryby Bluetooth:**
- **HID (Human Interface Device):** emulacja klawiatury — najprostsza konfiguracja
- **SPP (Serial Port Profile):** emulacja portu szeregowego
- **SSI (Simple Serial Interface):** zaawansowane aplikacje z dwukierunkową komunikacją

**Kiedy serwis profesjonalny:** Gdy moduł Bluetooth nie jest wykrywany przez żadne urządzenie po resecie.

---

### Regularna utrata połączenia Bluetooth

**Objawy rozpoznawcze:**
- Skaner rozłącza się podczas pracy (sygnał high/low)
- Połączenie i rozłączenie w pętli (szczególnie na stacji ładowania)
- Dane nie są przesyłane po skanowaniu mimo dekodowania
- Konieczność ponownego parowania co jakiś czas
- Sygnał "Page timeout" (długi niski/długi wysoki dźwięk)

**Przyczyny źródłowe:**
- Skaner poza zasięgiem Bluetooth
- Zakłócenia od routerów WiFi 2.4GHz i innych urządzeń Bluetooth
- Przeszkody fizyczne (metalowe regały w magazynach)
- Słaba bateria
- Tryb oszczędzania energii USB w Windows
- Konflikty sterowników Bluetooth (szczególnie Windows 10/11)

**Specyfikacje zasięgu:**
| Model | Klasa BT | Zasięg teoretyczny | Zasięg praktyczny |
|-------|----------|-------------------:|------------------:|
| LS4278, LS3578 | Class 2 | 100m (330 ft) | 30-50m wewnątrz |
| DS6878, DS8178 | Class 1 | 100m | 50-70m wewnątrz |
| LI4278 | Class 2 | 10m | 5-8m wewnątrz |

**Procedura naprawcza:**
1. **Sprawdź zasięg** — pracuj bliżej podstawki
2. **Minimalizuj zakłócenia:**
   - Oddal routery WiFi pracujące na 2.4GHz
   - Usuń inne urządzenia Bluetooth z okolicy
   - Usuń przeszkody metalowe między skanerem a bazą
3. **Naładuj baterię do pełna** — niski poziom wpływa na zasięg
4. **Wyłącz oszczędzanie energii USB w Windows:**
   - Device Manager → USB Root Hub → Properties → Power Management
   - Odznacz "Allow computer to turn off this device to save power"
5. **Włącz automatyczne ponowne łączenie:**
   - Po utracie połączenia naciśnij trigger — skaner automatycznie spróbuje się połączyć
   - Zeskanuj kod "Enable Auto-Reconnect" z PRG
6. **Zaktualizuj sterowniki Bluetooth na hoście**
7. **Znany problem DS6878 z Square/POS:** skaner rozłącza się podczas ładowania — użyj osobnej stacji tylko do ładowania nocnego

**Kiedy serwis profesjonalny:** Przy uporczywych problemach z wieloma urządzeniami i po wykluczeniu zakłóceń zewnętrznych.

---

## Problemy z oprogramowaniem i konfiguracją

### Skaner nie odczytuje określonych typów kodów kreskowych

**Objawy rozpoznawcze:**
- Skaner odczytuje niektóre kody, a innych nie
- Brak reakcji na QR, DataMatrix lub PDF417 (seria LS)
- Sygnał błędu przy próbie skanowania określonych symbologii
- Kody z ekranów telefonu nie są rozpoznawane

**Przyczyny źródłowe:**
- Dana symbologia wyłączona w konfiguracji (domyślnie niektóre są wyłączone)
- Seria LS **nie obsługuje kodów 2D** — to skanery laserowe 1D
- Tryb Mobile Phone/Display wyłączony (dla kodów z ekranów)
- Kod poza zasięgiem skanowania lub słabej jakości

**Obsługiwane symbologie według serii:**
| Symbologia | Seria LS | Seria DS | Seria LI |
|------------|:--------:|:--------:|:--------:|
| UPC/EAN | ✓ | ✓ | ✓ |
| Code 39/128 | ✓ | ✓ | ✓ |
| Codabar | ✓ | ✓ | ✓ |
| GS1 DataBar | ✓* | ✓ | ✓ |
| **QR Code** | ✗ | ✓ | ✗ |
| **DataMatrix** | ✗ | ✓ | ✗ |
| **PDF417** | ✗ | ✓ | ✗ |
| DPM | ✗ | ✓** | ✗ |

*Tylko LS4208, LS4278, LS3578  
**Wymaga modelu DS4608-DPE

**Procedura naprawcza:**
1. **Włącz wymaganą symbologię** — zeskanuj odpowiedni kod aktywacyjny z Product Reference Guide
2. **Użyj 123Scan** do konfiguracji zaawansowanej:
   - Połącz skaner przez USB
   - Przejdź do sekcji Symbologies/Decoders
   - Włącz wymagane typy kodów
3. **Dla kodów z ekranów (seria DS):**
   - Zwiększ jasność ekranu telefonu do maksimum
   - Włącz tryb "Mobile Phone/Display Mode"
   - Powiększ kod do minimum **125%**
4. **Dla kodów inwersyjnych (białe na czarnym):**
   - Włącz "Inverse QR auto-detection" (DS9208, DS9308)
5. **Jeśli potrzebujesz kodów 2D:** wymień skaner LS na DS lub terminal mobilny

**Modele dotknięte:** Wszystkie modele — problem konfiguracyjny

---

### Nieprawidłowe dane po skanowaniu (brakujące znaki, błędne formatowanie)

**Objawy rozpoznawcze:**
- Brak znaku Enter po skanowaniu — dane pozostają w polu wyszukiwania
- Nieprawidłowe znaki (polskie litery zamienione na symbole)
- Brakujące cyfry (np. początkowe zera w kodach UPC)
- Dodatkowe niepożądane znaki (np. @, 0, spacja, ÿ)
- Znaki uppercase zamienione na lowercase lub odwrotnie

**Przyczyny źródłowe:**
- Brak skonfigurowanego sufiksu Carriage Return (Enter)
- Niewłaściwy typ klawiatury (Country Code) skonfigurowany
- Włączony CAPS LOCK na klawiaturze hosta
- Nieprawidłowe ustawienia ADF (Advanced Data Formatting)
- Wyłączona opcja "Transmit Leading Zero" dla kodów UPC
- Problem z RDP/Citrix — pakiety UDP z klawiszy modyfikujących docierają po danych

**Procedura naprawcza:**

**A) Dodanie Enter (Carriage Return) po skanowaniu:**
1. Zeskanuj kody z instrukcji: "Scan Options" → "Data Suffix" → "Enter"
2. Lub przez 123Scan: Data Formatting → Suffix → CR/LF
3. Lub przez DataWedge (Android): Basic Data Formatting → Send ENTER key

**B) Konfiguracja polskiego układu klawiatury:**
1. Zeskanuj kod "USB Country Keyboard Types" → "Polish" z PRG
2. Lub przez 123Scan: Device Settings → Country Code → Poland

**C) Dla problemu z brakującymi zerami:**
1. Sprawdź ustawienia "Transmit Leading Zero" w konfiguracji UPC
2. Włącz przez skanowanie odpowiedniego kodu z PRG

**D) Dla problemów w Citrix/RDP:**
1. W kliencie RDP: Show Options → Local Resources → Keyboard → "On This Computer"
2. Dodaj do pliku .rdp: `keyboardhook:i:0`
3. Zwiększ opóźnienie między znakami w konfiguracji skanera (Inter character delay: **5ms**)
4. Alternatywnie: USB redirection zamiast keyboard wedge

**Sygnały błędów ADF:**
| Sygnał dźwiękowy | Znaczenie |
|------------------|-----------|
| Niski/wysoki/niski | Błąd transmisji ADF |
| Niski/wysoki/niski/wysoki | Nieprawidłowa reguła ADF |

**Modele dotknięte:** Wszystkie modele wszystkich serii

---

### Resetowanie do ustawień fabrycznych

**Kiedy wykonać reset:**
- Skaner nie działa po błędnej konfiguracji
- Nieznane ustawienia po skanowaniu przypadkowych kodów konfiguracyjnych
- Przygotowanie skanera dla nowego użytkownika/stanowiska
- Rozwiązywanie uporczywych problemów z dekodowaniem lub transmisją

**Metoda 1 — kod kreskowy (zalecana):**
1. Znajdź kod "SET DEFAULTS" / "Factory Reset" w:
   - Quick Start Guide (drukowana instrukcja w pudełku)
   - Product Reference Guide (PDF na zebra.com/support)
   - Strona wsparcia Zebra dla konkretnego modelu
2. Zeskanuj ten kod
3. Skaner wyda serię sygnałów potwierdzających reset
4. Wszystkie ustawienia powrócą do wartości domyślnych

**Metoda 2 — 123Scan:**
1. Podłącz skaner przez USB
2. Otwórz 123Scan
3. Actions → Load Defaults
4. Potwierdź operację

**Metoda 3 — reset fizyczny (modele przewodowe):**
1. Odłącz kabel USB
2. Poczekaj 30 sekund
3. Podłącz ponownie

**Po resecie należy ponownie skonfigurować:**
- Typ interfejsu hosta (USB HID, RS-232, etc.)
- Prefiksy/sufiksy (Enter, Tab)
- Wymagane symbologie kodów
- Układ klawiatury (Country Code)
- Dla modeli bezprzewodowych: ponowne parowanie z bazą

**UWAGA:** Reset nie usuwa firmware — tylko ustawienia użytkownika.

---

### Problemy z firmware i aktualizacjami

**Objawy rozpoznawcze:**
- Aktualizacja przerywa się w trakcie
- Błąd "Failed to load plugin" w 123Scan
- Skaner nie uruchamia się po aktualizacji (bricked)
- Utrata funkcjonalności po aktualizacji
- Nieoczekiwane zachowanie, losowe restarty

**Przyczyny źródłowe:**
- Przerwane połączenie podczas aktualizacji
- Niekompatybilna wersja firmware
- Uszkodzony plik firmware
- Brak wystarczającego zasilania podczas aktualizacji

**Procedura aktualizacji firmware:**
1. Pobierz najnowszy firmware ze strony **zebra.com/support** dla konkretnego modelu
2. Zainstaluj/zaktualizuj 123Scan i odpowiednie pluginy
3. Podłącz skaner przez USB (nie Bluetooth)
4. Upewnij się że bateria jest naładowana (modele bezprzewodowe)
5. Użyj zasilania zewnętrznego lub zasilanego huba USB
6. **NIE odłączaj skanera podczas aktualizacji**
7. Po aktualizacji: wykonaj reset fabryczny i rekonfigurację

**Procedura odzyskiwania po nieudanej aktualizacji:**
1. Przytrzymaj trigger przez 10 sekund podczas włączania skanera
2. Spróbuj połączyć jako HID Keyboard
3. Użyj trybu recovery (jeśli dostępny dla modelu)
4. Skontaktuj się z serwisem Zebra

**Kiedy serwis profesjonalny:** Gdy skaner nie uruchamia się po nieudanej aktualizacji (bricked) i tryb recovery nie działa.

---

## Problemy z integracją systemową

### USB HID vs USB COM — wybór trybu komunikacji

**Problem:** Skaner działa jak klawiatura zamiast wysyłać dane do aplikacji, lub odwrotnie.

**Tryby USB i ich zastosowania:**
| Tryb | Opis | Zastosowanie |
|------|------|--------------|
| **USB HID Keyboard** | Emulacja klawiatury — dane jako keystroke | Proste aplikacje, Notepad, Excel, formularze web |
| **USB SNAPI** | Dwukierunkowa komunikacja, zarządzanie | Zaawansowane aplikacje, SDK, 123Scan |
| **USB OPOS** | Dla systemów POS | Kasy fiskalne, systemy sprzedaży |
| **USB CDC (COM)** | Emulacja portu szeregowego | Aplikacje legacy, terminale |

**Procedura zmiany trybu:**
1. Znajdź kod odpowiedniego trybu w Product Reference Guide
2. Zeskanuj kod (np. "USB HID Keyboard", "USB OPOS", "USB SNAPI")
3. Dla USB OPOS/SNAPI: zainstaluj sterownik **CoreScanner Driver** ze strony Zebra
4. Dla USB CDC: zainstaluj sterownik **USB CDC Driver**
5. Restart skanera i komputera

**Kiedy specjalista:** Przy integracji z niestandardowymi aplikacjami wymagającymi specyficznego trybu.

---

### Integracja z systemami WMS/ERP

**Typowe problemy:**
- Dane nie trafiają do właściwych pól WMS
- Brak automatyzacji workflow po skanowaniu
- Niezgodność formatów danych między skanerem a systemem
- Błędy synchronizacji z SAP, Oracle, Dynamics

**Rozwiązania dla WMS:**
1. Skonfiguruj prefiksy/sufiksy dla różnych typów kodów używając 123Scan → ADF
2. Zastosuj middleware (RF-SMART, Cleverence) jako warstwę pośrednią
3. Dla urządzeń Zebra Android: skonfiguruj DataWedge z odpowiednim profilem

**Rozwiązania dla SAP:**
1. Użyj SAP Console lub SAP Business Connector
2. Zainstaluj Cleverence jako middleware między skanerem a SAP
3. Dla SAP S/4HANA: konfiguracja przez REST/SOAP API
4. Zebra SAP Integration Software — tworzenie kodów bezpośrednio z SAP Smart Forms
5. Dla ITSmobile: dostosuj UserAgent w Enterprise Browser

**Rozwiązania dla POS:**
1. Zainstaluj **Zebra OPOS Driver** (w Scanner SDK for Windows)
2. Zainstaluj Common Control Objects (CCO) Monroe
3. Skonfiguruj skaner w trybie USB OPOS lub IBM Hand-held
4. Dla JPOS: zarejestruj urządzenie w jpos.xml

---

### Kompatybilność z systemami operacyjnymi

**Windows 10/11:**
- Pobierz **CoreScanner Driver for Windows** i **Scanner SDK for Windows**
- Wspierane sterowniki: OPOS v1.14, JPOS (Java 8-21), TWAIN, WMI Provider
- Uruchom instalator z prawami administratora

**Linux:**
- Zainstaluj Scanner SDK for Linux
- JPOS Driver wspierany
- Dla podstawowej funkcjonalności: USB HID Keyboard (plug-and-play)

**macOS:**
- Ograniczone wsparcie — brak 123Scan i SDK
- USB HID Keyboard działa plug-and-play
- Skonfiguruj skaner na Windows i przenieś na Mac

**Android (urządzenia Zebra):**
- Konfiguracja przez **DataWedge** (wbudowane)
- Utwórz dedykowany profil dla aplikacji
- Skonfiguruj: Barcode Input → enabled, Keystroke Output → enabled, Send ENTER key
- Dla zewnętrznych skanerów Bluetooth: Scanner Selection → "Zebra Bluetooth Scanner"

**iOS:**
- Tylko tryb Bluetooth HID (klawiatura zewnętrzna)
- Brak natywnego SDK

**Citrix/RDP — specyficzne problemy:**
- Dodatkowe znaki w środku kodu
- Rozwiązanie: keyboardhook:i:0 w pliku .rdp, zwiększenie inter character delay
- Alternatywnie: USB device redirection zamiast keyboard wedge

---

## Problemy z podstawkami (Cradle)

### Typy podstawek i ich funkcje

| Model podstawki | Funkcja | Kompatybilność |
|-----------------|---------|----------------|
| CR0078-S (Standard) | Komunikacja + ładowanie, parowanie przez kod | LS4278, DS6878, LI4278 |
| CR0078-P (Presentation) | Komunikacja + ładowanie, automatyczne parowanie | LS4278, DS6878, LI4278 |
| STB4278 | Komunikacja + ładowanie | DS3678, LI3678 |
| Charging-only | Tylko ładowanie | Różne modele |

**Problem: Podstawka nie przesyła danych**
- Sprawdź czy to model komunikacyjny (CR0078-SC) a nie tylko ładujący
- Podłącz odpowiedni kabel USB/RS-232 do podstawki
- Dla Standard Cradle: zeskanuj kod parowania z etykiety

**Problem: Skaner nie ładuje się w podstawce**
1. Sprawdź zasilanie podstawki (LED powinien świecić)
2. Oczyść styki na skanerze i podstawce
3. Użyj dedykowanego zasilacza (nie USB komputera)
4. Pierwsze pełne ładowanie nowej baterii: **24 godziny**

---

## Sygnały dźwiękowe i diagnostyka LED

### Tabela sygnałów dźwiękowych (wszystkie serie)

| Sygnał | Znaczenie |
|--------|-----------|
| 1 wysoki beep | Pomyślne zdekodowanie kodu |
| 3 krótkie wysokie | Bufor Code 39 pełny |
| **4 beeply z czerwoną LED** | Błąd transmisji — sprawdź połączenie |
| 5 beepów | Błąd konfiguracji |
| Niska/wysoka | Połączenie Bluetooth nawiązane |
| Wysoka/niska | Rozłączenie Bluetooth |
| Długa niska/długa wysoka | Timeout — urządzenie poza zasięgiem |
| Długa niska x4 | Odrzucone połączenie przez host |
| 3 krótkie (jeden ton) | Niski poziom baterii |

### Tabela wskaźników LED

| LED | Lokalizacja | Znaczenie |
|-----|-------------|-----------|
| Zielony flash | Skaner | Pomyślny odczyt |
| Czerwony | Skaner | Błąd dekodowania |
| Zielona ciągła | Stacja | Połączono / w pełni naładowano |
| Żółta/bursztynowa | Stacja | Ładowanie w toku |
| Czerwona ciągła | Stacja | Problem z ładowaniem — kontakt z serwisem |

---

## Specyfika polskiego rynku

### Kontekst magazynowy i logistyczny

**Typowe wyzwania w polskich magazynach:**
- Kurz i pył — szczególnie w magazynach budowlanych i przemysłowych
- Praca w chłodniach/mroźniach — kondensacja wilgoci
- Metalowe regały wysokiego składowania — zakłócenia Bluetooth
- Intensywność użytkowania — praca wielozmianowa

**Zalecane modele dla magazynów:**
| Środowisko | Zalecany model | Klasa IP |
|------------|----------------|----------|
| Magazyn lekki | DS2208, LI2208 | IP42 |
| Magazyn przemysłowy | DS3608 | IP67 |
| Magazyn z chłodnią | DS3678 (bezprzewodowy) | IP67 |
| Wózki widłowe | LS3578 z zestawem FLB3508 | IP54 |

**Polscy integratorzy:**
- **Kreski Sp.J. (Warszawa)** — autoryzowany partner Zebra, czas naprawy do 5 dni
- **IBCS Poland** — rozwiązania dla produkcji i logistyki
- **Codeon.net.pl (Poznań)** — serwis pogwarancyjny

---

### Kontekst retail i handel

**Typowe problemy przy kasach fiskalnych:**
- Skaner dodaje dodatkowe znaki (problem BaseLinker)
- Brak automatycznego ENTER po zeskanowaniu
- Kody na błyszczących/foliowanych opakowaniach
- Integracja z polskimi systemami fiskalnymi

**Rozwiązania:**
- Konfiguracja emulacji klawiatury/portu COM według wymagań kasy
- Programowanie sufiksu ENTER w ustawieniach skanera
- Skanery prezentacyjne (DS9208, DS9308) dla kas o dużym ruchu
- Skanery 2D (imagery) zamiast laserowych dla wszechstronności

---

### Kontekst aptek i służby zdrowia

**Wymagania Dyrektywy Fałszywkowej (FMD):**
- Obowiązek weryfikacji leków od **9 lutego 2019**
- System PLMVS (Polski System Weryfikacji Autentyczności Leków)
- Kody **GS1 DataMatrix** — wymagają skanerów 2D

**Zgłaszane problemy przez farmaceutów:**
- "Opakowanie skanuje się dopiero za którymś razem"
- Kody zalane przez mokre palce na etapie produkcji
- Część opakowań ma identyczne kody z różnych dostaw

**Zalecane modele dla aptek:**
- Zebra **DS2208** (biała wersja) — rekomendowany przez HANT
- Zebra **DS2278** — wersja bezprzewodowa Bluetooth
- Obudowy odporne na dezynfekcję

**EMVO** udostępnia narzędzie do testowania poprawności konfiguracji skanerów dla systemu PLMVS.

---

### Kontekst Lasy Państwowe (SILP)

**System SILP** — ~17 000 użytkowników, aplikacje: Leśnik+, Panel Leśniczego

**Specyficzne wyzwania w terenie:**
- Brak zasięgu sieci w odległych lokalizacjach
- Warunki atmosferyczne: deszcz, mróz, wilgoć
- GPS: problemy z sygnałem pod koroną drzew
- Długi czas pracy bez możliwości ładowania

**Rekomendowane rozwiązania:**
- Terminale mobilne z trybem **offline (batch mode)**
- Kolektory danych z dużą pamięcią wewnętrzną
- Wysoka klasa IP (**IP67+**)
- Pojemne baterie (praca przez cały dzień)
- Wzmocnione obudowy **MIL-STD**

---

### Kontekst inwentaryzacji

**Typowe problemy:**
- Wyczerpywanie baterii przy wielogodzinnej pracy
- Ograniczona pamięć starszych kolektorów (max 2000 rekordów)
- Problemy z importem do Subiekt GT, WF-Mag, CDN OPTIMA
- Starsze kolektory Windows CE niekompatybilne z nowymi systemami

**Rozwiązania:**
- Nowoczesne kolektory Android (nie Windows CE)
- Kolektory z dużą pamięcią (**40 000+ rekordów**)
- Tryb Batch Mode dla pracy poza zasięgiem
- Export do Excel/CSV dla uniwersalnej kompatybilności
- Polskie oprogramowanie: Szybka Inwentaryzacja®, Mobilny Inwentaryzator

---

## Kiedy kontaktować serwis profesjonalny

**Wymagany serwis autoryzowany gdy:**
1. Moduł laserowy/imager nie działa po wszystkich krokach diagnostycznych
2. Uszkodzenia mechaniczne obudowy/triggera wpływają na działanie
3. Problemy z ładowaniem utrzymują się po wymianie baterii
4. Firmware nie może być zaktualizowany lub skaner "bricked"
5. Wielokrotne błędy transmisji mimo prawidłowej konfiguracji
6. Dioda czerwona na stacji dokującej (problem z ładowaniem)
7. Widoczne uszkodzenia wewnętrzne lub kontakt z płynami

**Kontakt Zebra:**
- Strona wsparcia: **zebra.com/support**
- Przygotuj: numer modelu, numer seryjny, opis problemu i wykonane kroki diagnostyczne

**Polskie serwisy autoryzowane:**
- Kreski Sp.J. (Warszawa) — kreski.pl
- Codeon.net.pl (Poznań)
- IBCS Poland

---

## Narzędzia konfiguracyjne i zasoby

**123Scan (Windows):**
- Konfiguracja, zarządzanie, aktualizacja firmware
- Pobierz: zebra.com/123scan
- Wymaga: CoreScanner Driver, .NET Framework

**DataWedge (Android Zebra):**
- Wbudowane w urządzenia Zebra
- Konfiguracja przez profile dla aplikacji

**Scanner SDK:**
- Dla programistów: C#, Java, C++
- Integracja z własnymi aplikacjami

**Product Reference Guide:**
- Szczegółowa dokumentacja dla każdego modelu
- Kody programujące dla wszystkich ustawień
- zebra.com/support → wybierz model → Documentation

---

## Status wsparcia modeli (End of Life)

| Model | Status | Data końca wsparcia | Zamiennik |
|-------|--------|---------------------|-----------|
| LS4208 | EOL | 31 grudnia 2024 | LS2208, DS2208, DS4608 |
| LS3578-ER | EOL | 28 lutego 2024 | DS3678 |
| DS4308 | EOL | 2025 | DS4608 |
| DS9208 | EOL | 2025 | DS9308 |

**Zalecenie:** Przed zakupem nowych skanerów sprawdź aktualny status modelu na stronie Zebra, aby uniknąć inwestycji w wycofywane produkty.