# Zebra DS3608 / DS3678 -- Kompletne dane techniczne i serwisowe

> Materiał referencyjny do artykulu serwisowego. Dane zebrane z oficjalnych zrodel Zebra Technologies: Product Reference Guide (MN-002689-22EN), spec sheets SR/ER/HP/HD/DP, Quick Start Guide, Zebra Support Community.

---

## 1. SPECYFIKACJA TECHNICZNA

### 1.1 Wymiary i waga

| Parametr | DS3608 (przewodowy) | DS3678 (bezprzewodowy) |
|---|---|---|
| Wysokosc | 18,5 cm (7,3 in.) | 18,5 cm (7,3 in.) |
| Szerokosc | 7,6 cm (3,0 in.) | 7,6 cm (3,0 in.) |
| Glebokosc | 13,2 cm (5,2 in.) | 14,2 cm (5,6 in.) |
| Waga (SR) | ~305 g (10,76 oz) | ~411 g (14,5 oz) z bateria |
| Waga (HP) | 309 g (10,9 oz) | 411 g (14,5 oz) z bateria |
| Waga (HD) | 309 g (10,9 oz) | ~411 g (14,5 oz) z bateria |
| Waga (ER) | ~335 g (11,8 oz) | 436 g (0,96 lb) z bateria |
| Kolor | Industrial Green | Industrial Green |

**Uwaga:** DS3678 jest o 1 cm glebszy od DS3608 (14,2 vs 13,2 cm) ze wzgledu na modul baterii i Bluetooth.

### 1.2 Odpornosc i trwalosc

| Parametr | Wartosc | Uwagi |
|---|---|---|
| Klasa IP (skaner) | IP65 i IP67 | Pyloodporny, odporny na strumien wody, zanurzenie do 30 min |
| Klasa IP (ER/XR/DP nowe) | IP65 i IP68 | Podwojne uszczelnienie, pelna submersja |
| Drop spec (SR/HP/HD) | 2,4 m (8 ft) na beton | Wielokrotne upadki |
| Drop spec (ER/DP nowe) | 3,0 m (10 ft) na beton | 23% wiecej niz konkurencja |
| Tumble test | 5000 przewrotow z 1 m (3,3 ft) | Symulacja realnych warunkow |
| Tumble test (ER/DP nowe) | 7500 przewrotow | Ulepszony standard |
| ESD | +/-25 kV wyladowanie powietrzne, +/-10 kV wyladowanie bezposrednie, +/-10 kV wyladowanie posrednie | Norma EN61000-4-2 |
| Odpornosc na swiatlo otoczenia | 0-10 037 fc (0-108 000 lux) | Pelne swiatlo sloneczne |

### 1.3 Warunki srodowiskowe

| Parametr | DS3608 (przewodowy) | DS3678 (bezprzewodowy) |
|---|---|---|
| Temperatura pracy | od -30°C do +50°C (od -22°F do 122°F) | od -20°C do +50°C (od -4°F do 122°F) |
| Temperatura przechowywania | od -40°C do +70°C (od -40°F do 158°F) | od -40°C do +70°C (od -40°F do 158°F) |
| Wilgotnosc | 5% do 95% (kondensacyjna) | 5% do 95% (kondensacyjna) |

**Uwaga:** DS3608 (przewodowy) moze pracowac do -30°C, DS3678 (bezprzewodowy) do -20°C -- roznica wynika z ograniczen baterii Li-Ion w niskich temperaturach. Oba modele sa przystosowane do pracy w mrozniach.

### 1.4 Bateria DS3678

| Parametr | Wartosc |
|---|---|
| Typ | PowerPrecision+ Li-Ion, wymienna |
| Pojemnosc | 3100 mAh (11,16 Wh, 4,2 V nominalnie) |
| Pojemnosc (nowa wersja) | 3150 mAh (PowerPrecision Plus) |
| Numer czesci baterii | BTRY-36IAB0E-00 |
| Skany na ladowanie (SR) | ponad 100 000 |
| Skany na ladowanie (HP) | ponad 70 000 |
| Skany na ladowanie (ER) | ponad 70 000 (min. 23 h ciaglej pracy) |
| Skany na ladowanie (XR) | ponad 80 000 (min. 23 h ciaglej pracy) |
| Czas ladowania (zasilacz zewnetrzny) | ok. 3 godziny (0-90%) |
| Czas ladowania (USB) | do 10 godzin |
| Gwarancja baterii | 12 miesiecy |

**Uwaga:** Czas ladowania do pelna (100%) moze trwac do 3h przez zasilacz zewnetrzny. Ladowanie po USB jest znacznie wolniejsze (do 10h) ze wzgledu na ograniczenie pradu.

### 1.5 Bluetooth (DS3678)

| Parametr | Wartosc |
|---|---|
| Wersja | Bluetooth 4.0 (Classic + Low Energy) |
| Klasa | Class 1 |
| Profile | Serial Port Profile (SPP), HID |
| Zasieg (Classic) | do 100 m (330 ft / ~300 ft) |
| Zasieg (Low Energy) | do 10 m (30 ft) |
| Laczenie z baza (multipoint) | 1 baza do 7 skanerów |
| Virtual Tether | Tak -- alarm gdy skaner oddala sie od bazy |
| Wi-Fi Friendly Mode | Tak -- minimalizuje zaklócenia 2,4 GHz |
| PIN domyslny | 0000 |

### 1.6 Interfejsy (DS3608 przewodowy)

| Interfejs | Obslugiwany |
|---|---|
| USB (HID / CDC) | Tak |
| RS-232 | Tak |
| Keyboard Wedge (PS/2) | Tak |
| Industrial Ethernet | Tak |
| EtherNet/IP | Tak (ER/DP) |
| Profinet | Tak (ER/DP) |
| Modbus TCP | Tak (ER/DP) |
| Standard TCP/IP | Tak (ER/DP) |

**Uwaga:** Wersje ER i DP obsluguja protokoly przemyslowe Ethernet (EtherNet/IP, Profinet, Modbus TCP), co pozwala na bezposrednia integracje z PLC.

### 1.7 Zasilanie (DS3608)

| Parametr | Wartosc |
|---|---|
| Zasilanie z hosta (USB) | 4,5 VDC min. do 5,5 VDC max. |
| Zasilacz zewnetrzny | 11,4 VDC min. do 12,6 VDC max. |
| Prad roboczy (typowy) | 450 mA |
| Prad spoczynkowy (typowy) | 100 mA |

---

## 2. SILNIKI SKANUJACE I ZASIĘGI DEKODOWANIA

### 2.1 Przeglad silników skanujacych

| Wersja skanera | Silnik (scan engine) | Sensor | Pole widzenia |
|---|---|---|---|
| SR (Standard Range) | SE4750-SR | 1280 x 800 px (1 Mpx) | 42,8° H x 28,8° V |
| HD (High Density) | SE4750 (wariant HD) | 1280 x 960 px | 31,0° H x 23,0° V |
| HP (High Performance) | SE4750 (wariant HP) | 1280 x 960 px | 31,0° H x 23,0° V |
| ER (Extended Range) | SE4850-ER | 1280 x 800 px (near), 1920 x 1080 px (far) | Near: 32° H x 20° V, Far: 12° H x 7,6° V |
| XR (Extended Range+) | SE4850 (wariant XR) | 1280 x 800 px (near), 1920 x 1080 px (far) | Near: 42,1° H x 27° V, Far: 14° H x 7,9° V |
| DP/DPA (DPM) | SE4750-DL (wariant DPM) | 1280 x 960 px | ~31° H x 23° V |

**Celownik (aimer):** Laser 655 nm
**Iluminacja:** LED 660 nm
**Min. kontrast druku:** 15% (HP/HD), 25% (SR/ER)
**Orientacja skanowania:** Pochylenie (skew) +/-60°, przechyl (pitch) +/-60°, obrot (roll) +/-360°

### 2.2 Zasięgi dekodowania SE4750-SR (dla DS3608-SR / DS3678-SR)

Warunki testowe: Kody fotograficzne, kat 18° pochylenia, 30 fcd oswietlenie otoczenia.

| Typ kodu | Rozdzielczosc | Odl. minimalna (near) | Odl. maksymalna (far) |
|---|---|---|---|
| Code 39 | 3 mil | 7,1 cm (2,8 in.) | 15,8 cm (6,2 in.) |
| Code 128 | 5 mil | 5,8 cm (2,3 in.) | 22,1 cm (8,7 in.) |
| PDF417 | 5 mil | 7,6 cm (3,0 in.) | 20,6 cm (8,1 in.) |
| PDF417 | 6,67 mil | 5,6 cm (2,2 in.) | 26,9 cm (10,6 in.) |
| Data Matrix | 10 mil | 6,1 cm (2,4 in.) | 25,4 cm (10,0 in.) |
| UPC-A | 100% (13 mil) | 4,1 cm (1,6 in.)* | 58,4 cm (23,0 in.) |
| Code 128 | 15 mil | 6,1 cm (2,4 in.)* | 64,0 cm (25,2 in.) |
| Code 39 | 20 mil | 4,1 cm (1,6 in.)* | 92,2 cm (36,3 in.) |

*Ograniczone przez szerokosc kodu w polu widzenia.

**Zasieg ogolny SR:** od bliskiego kontaktu do ~1,5 m (5 ft)

### 2.3 Zasięgi dekodowania SE4850-ER (dla DS3608-ER / DS3678-ER)

Warunki testowe: 20 ft-cd minimalne oswietlenie.

| Typ kodu | Rozdzielczosc | Odl. minimalna (near) | Odl. maksymalna (far) |
|---|---|---|---|
| Code 39 | 10 mil | 12,7 cm (5,0 in.) | 157,5 cm (62,0 in.) |
| UPC | 100% (13 mil) | 17,8 cm (7,0 in.) | 195,6 cm (77,0 in.) |
| Code 128 | 15 mil | 25,4 cm (10,0 in.) | 218,4 cm (86,0 in.) |
| Code 128 | 15 mil (4 in. wide) | 20,3 cm (8,0 in.) | 218,4 cm (86,0 in.) |
| Code 39 | 20 mil | 20,3 cm (8,0 in.) | 348,0 cm (137,0 in.) |
| Code 39 | 40 mil | 22,9 cm (9,0 in.) | 756,9 cm (298,0 in.) |
| Code 39 | 55 mil | 27,9 cm (11,0 in.) | 960,1 cm (378,0 in.) |
| Code 39 | 100 mil (papier) | 53,3 cm (21,0 in.) | 1524 cm (600,0 in.) -- 15,2 m |
| Code 39 | 100 mil (reflective) | 106,7 cm (42,0 in.) | 1524 cm (600,0 in.) -- 15,2 m |
| Data Matrix | 10 mil | 15,2 cm (6,0 in.) | 96,5 cm (38,0 in.) |
| Data Matrix | 55 mil | 17,8 cm (7,0 in.) | 508,0 cm (200,0 in.) -- 5,1 m |
| Data Matrix | 300 mil (reflective) | 58,4 cm (23,0 in.) | 1310,6 cm (516,0 in.) -- 13,1 m |

**Zasieg ogolny ER:** od 7,6 cm (3 in.) do 21,4 m (70 ft)

### 2.4 Zasięgi dekodowania DS3608-HP / DS3678-HP

| Parametr | Wartosc |
|---|---|
| Zasieg ogolny | od 7,1 cm (2,8 in.) do 203 cm (80 in. / ~2,1 m) |
| Zasieg calkowity max. | do 7 ft (2,1 m) w zaleznosci od typu i rozmiaru kodu |
| Sensor | 1280 x 960 px |
| Pole widzenia | 31° H x 23° V |

Wersja HP jest zoptymalizowana pod kątem szybkiego odczytu kodów 1D/2D, OCR, zdjec i dokumentow. Laczy cechy SR i HP z mozliwoscia skanowania do wiekszych odleglosci niz SR.

### 2.5 Zasięgi dekodowania DS3608-HD / DS3678-HD

| Parametr | Wartosc |
|---|---|
| Specjalizacja | Kody o wysokiej gestosci (od 3 mil) |
| Sensor | 1280 x 960 px |
| Pole widzenia | 31° H x 23° V |
| Typowy zasieg roboczy | od 1,3 in. (3,3 cm) do 7,1 in. (18 cm) w zaleznosci od gestosci |

Wersja HD jest zoptymalizowana do skanowania bardzo malych kodow (3 mil i mniejsze), drukowanych na etykietach lub bezposrednio na komponentach.

### 2.6 DS3608-DP / DS3678-DP (Direct Part Marking)

| Parametr | Wartosc |
|---|---|
| Technologia | PRZM Intelligent Imaging |
| Obslugiwane znakowania DPM | Dot peen, laser etch, ink mark, chemical etch, inkjet mold, cast, thermal spray |
| Zasieg dekodowania DPM | Zalezy od wielkosci, powierzchni, kontrastu i gestosci znakowania |
| Przykladowy zasieg Code 39 (3 mil DPM) | 0,5-7,1 cm (0,2-2,8 in.) |
| Przykladowy zasieg Code 39 (5 mil DPM) | 0,5-7,1 cm (0,2-2,8 in.) |
| Przykladowy zasieg PDF417 (5 mil DPM) | 5,1-15,2 cm (2,0-6,0 in.) |

### 2.7 Obslugiwane symbologie

**Kody 1D:**
- Code 39, Code 128, Code 93
- Codabar / NW7
- Code 11
- MSI Plessey
- UPC / EAN
- Interleaved 2 of 5
- Korean 3 of 5
- GS1 DataBar (wszystkie warianty)
- Base 32 (Italian Pharma)

**Kody 2D:**
- PDF417, Micro PDF417
- Composite Codes
- TLC-39
- Aztec
- Data Matrix
- MaxiCode
- QR Code, Micro QR
- Han Xin (Chinese Sensible)
- Kody pocztowe (Postal Codes)

**Dodatkowe:**
- Digimarc Digital Watermark
- IUID Parsing (identyfikacja unikalna DoD)
- OCR (wersja HP)

---

## 3. KODY DŹWIĘKOWE (BEEPER)

### 3.1 DS3608 -- Definicje sygnałow dzwiekowych

| Zdarzenie | Liczba sygnałow | Ton | Opis |
|---|---|---|---|
| Power Up (wlaczenie) | 1 seria | Low-medium-high (rosnaca) | Trójtonal rosnacy, oznacza pomyslne uruchomienie skanera |
| Good Decode (poprawne skanowanie) | 1 | Medium (sredni) | Krótki pojedynczy bip potwierdzajacy odczyt kodu |
| Transmit Error (blad transmisji) | 4 | Long Low (dlugie niskie) | 4 dlugie niskie tony -- dane nie zostaly wyslane do hosta |
| Parameter Entry (wejscie w programowanie) | 1 seria | High-low-high-low | Sygnalizuje wejscie w tryb programowania |
| Parameter Entry Accepted | 1 seria | High-low | Parametr zaakceptowany |
| Parameter Entry Error (blad) | 1 seria | Long low-long high | Niepoprawny kod konfiguracyjny lub Cancel |
| Host Command Beep | konfigurowalny | konfigurowalny | Sygnał wyslany przez hosta |
| ADF/MDF Match | 1 | High (wysoki) | Poprawne dopasowanie reguly ADF/MDF |

### 3.2 DS3678 -- Dodatkowe sygnaly bezprzewodowe

| Zdarzenie | Liczba sygnałow | Ton | Opis |
|---|---|---|---|
| Bluetooth Pairing Success | 1 seria | High-low-high-low + low-high | Pomyslne sparowanie z baza/hostem |
| Bluetooth Pairing Failure | 1 seria | Long low, long high | Nieudana proba parowania |
| Bluetooth Connected | 1 | Medium-high | Polaczenie nawiazane |
| Out of Range | 1 ciagly | Continuous tone | Ciagly ton -- skaner poza zasiegiem bazy |
| Low Battery Warning | 1 seria | Low-frequency tone | Niski ton -- bateria bliska rozladowania |
| Battery Critical | 6 | High (szybkie) | 6 szybkich wysokich tonow + niebieska dioda LED + wibracje |
| Virtual Tether Alert | seria | konfigurowalny | Alarm oddalenia skanera od bazy |

### 3.3 Konfiguracja beepera

Beeper mozna konfigurowac za pomoca kodów programujacych z PRG:
- **Volume (glosnosc):** Low / Medium / High
- **Tone (czestotliwosc):** Low / Medium / High
- **Duration (czas trwania):** Short / Normal / Long
- **Good Decode Beep:** Enable / Disable
- **Beep on BLE/SPP:** Enable / Disable

---

## 4. WSKAŹNIKI LED

### 4.1 DS3608 LED skanera

DS3608 wykorzystuje dwukolorowa diode LED (zielona/czerwona, z mieszanka dajaca bursztynowy).

| Stan LED | Kolor | Opis |
|---|---|---|
| Pojedynczy blysk przy wlaczeniu | Zielony | Pomyslne uruchomienie skanera |
| Pojedynczy blysk przy skanowaniu | Zielony | Kod pomyslnie odczytany (good decode) |
| Ciagle swiecenie | Zielony | Skaner gotowy / polaczony |
| Miganie | Bursztynowy (amber) | Tryb programowania aktywny |
| Miganie | Czerwony | Blad transmisji lub blad skanowania |
| Swiecenie | Czerwony | Awaria / blad krytyczny |
| Brak swiecenia | Wylaczony | Brak zasilania lub tryb uspienia |

### 4.2 DS3678 LED skanera

| Stan LED | Kolor | Opis |
|---|---|---|
| Ciagle swiecenie | Zielony | Polaczony i gotowy do pracy |
| Miganie | Bursztynowy (amber) | Szukanie polaczenia / parowanie |
| Miganie | Czerwony | Niski poziom baterii lub blad komunikacji |
| Miganie | Niebieski | Tryb discoverable (parowanie BT) |
| Pojedynczy blysk | Zielony | Poprawne skanowanie kodu |
| 6 szybkich blysków + wibracje | Niebieski | Bateria krytycznie niska (wymaga natychmiastowego ladowania) |

### 4.3 STB3678 Cradle (baza ladujaca) LED

| Stan LED | Kolor | Opis |
|---|---|---|
| Ciagle swiecenie | Zielony | Normalna praca / bateria w pełni naladowana |
| Swiecenie | Bursztynowy (amber) | Ladowanie w toku |
| Miganie | Bursztynowy (amber) | Ladowanie rozpoczete (wlozono skaner) |
| Swiecenie | Czerwony | Blad ladowania lub usterka |
| Brak swiecenia | Wylaczony | Brak zasilania bazy |

### 4.4 Four Slot Battery Charger LED (SAC3600-4001CR)

Ladowarka 4-slotowa posiada indywidualne diody LED dla kazdego slotu baterii:

| Stan LED | Kolor | Opis |
|---|---|---|
| Swiecenie | Bursztynowy | Ladowanie w toku |
| Swiecenie | Zielony | Bateria w pełni naladowana |
| Miganie | Czerwony | Blad ladowania (zla bateria, temperatura) |
| Brak | Wylaczony | Brak baterii w slocie |

---

## 5. TROUBLESHOOTING (ROZWIĄZYWANIE PROBLEMÓW)

### 5.1 Oficjalna tabela Problem / Przyczyna / Rozwiazanie

| Problem | Mozliwa przyczyna | Rozwiazanie |
|---|---|---|
| Skaner nie działa (brak zasilania) | Brak zasilania systemu | Sprawdź zasilanie systemu (USB, zasilacz) |
| Skaner nie działa | Skaner jest wylaczony (disabled) | Zeskanuj kod aktywacyjny z PRG |
| Skaner nie działa | Luźny kabel interfejsu | Sprawdź i wcisnij kabel USB/RS-232 |
| Skaner nie dekoduje kodów | Kod nieczytelny (uszkodzony, zamazany) | Sprawdź jakosc kodu, przetestuj z innym kodem |
| Skaner nie dekoduje kodów | Symbologia wylaczona | Wlacz odpowiednia symbologie w konfiguracji skanera |
| Skaner nie dekoduje kodów | Kod poza zasiegiem skanera | Przysun/oddal skaner -- sprawdz zasieg dla danej rozdzielczosci |
| Skaner nie dekoduje kodów | Szyba skanera brudna | Wyczysc okno skanujace miekka sciereczka z IPA |
| Skaner nie dekoduje kodów | Region niepoprawnie skonfigurowany | Ustaw poprawny region w konfiguracji |
| Niepoprawne reguly ADF | Bledne zaprogramowanie regul ADF | Zaprogramuj poprawne reguly ADF |
| DS3678: brak polaczenia z baza | Skaner nie sparowany z baza | Zeskanuj kod parowania bazy (barcode na spodzie STB3678) |
| DS3678: utrata polaczenia | Skaner poza zasiegiem BT | Przybliż skaner do bazy; sprawdz przeszkody |
| DS3678: niebieska LED + 6 beeperów + wibracje | Bateria krytycznie niska | Natychmiast nałoż skaner na baze lub wymień baterie |
| DS3678: nie laduje sie | Blad ladowania | Sprawdz zasilacz bazy (PWR-BGA12V50W0WW); sprawdz styki ladowania; wyczysc styki IPA |
| Dane nie trafiaja do systemu | Blad transmisji (4 dlugie niskie tony) | Sprawdz kabel, driver USB, ponow polaczenie |
| Slaba jakosc skanowania | Brudna szyba/sensor | Wyczysc okno skanujace |
| Skaner bipa ale brak danych | Interfejs zle skonfigurowany | Zeskanuj poprawny kod interfejsu (USB HID, USB COM, RS-232) |
| Skaner nie wlacza sie (DS3678) | Rozladowana bateria | Naladuj baterie; sprawdz kontakty; wymien baterie |

### 5.2 Dodatkowe problemy i rozwiazania

**Problem: Firmware nieaktualny**
- Rozwiazanie: Pobierz najnowszy firmware z zebra.com/support, zaktualizuj przez Zebra Scanner Management Software (123Scan2) lub EMDK.

**Problem: Skaner skanuje ale dane sa bledne**
- Rozwiazanie: Sprawdz reguly ADF/MDF, zresetuj do ustawien fabrycznych, ponownie skonfiguruj prefix/suffix.

**Problem: Interferencje Wi-Fi (DS3678)**
- Rozwiazanie: Wlacz Wi-Fi Friendly Mode w konfiguracji skanera.

---

## 6. PROCEDURY SERWISOWE

### 6.1 Factory Reset (przywrocenie ustawien fabrycznych)

**Metoda 1: Skanowanie kodu resetujacego (zalecana)**
1. Otworz Product Reference Guide (PRG) -- rozdzial "User Preferences"
2. Znajdz kod kreskowy "Set Factory Defaults" (lub "Restore Defaults")
3. Zeskanuj ten kod -- skaner wyda serie tonow potwierdzajacych reset
4. Skaner powroci do ustawien fabrycznych (wszystkie parametry, interfejs, beeper, symbologie)

**Metoda 2: Zebra 123Scan2 (oprogramowanie PC)**
1. Podlacz skaner do PC przez USB
2. Otworz 123Scan2
3. Wybierz opcje "Restore Defaults"
4. Poczekaj na potwierdzenie z skanera

**Metoda 3: Hard Reset (DS3678)**
1. Wylacz skaner
2. Wyjmij baterie
3. Poczekaj 10 sekund
4. Wloz baterie i wlacz skaner
5. Skaner uruchomi sie z ustawieniami fabrycznymi

**UWAGA:** Factory reset kasuje WSZYSTKIE ustawienia uzytkownika, wlaczajac:
- Typ interfejsu (USB HID, RS-232 itp.)
- Reguly ADF/MDF
- Aktywowane/dezaktywowane symbologie
- Ustawienia beepera i LED
- Parowanie Bluetooth (DS3678)

Po resecie nalezy ponownie skonfigurowac skaner i sparowac z baza (DS3678).

### 6.2 Parowanie Bluetooth DS3678

**Parowanie z baza STB3678 (Point-to-Point):**
1. Upewnij sie, ze baza STB3678 jest zasilona (LED bazy swieci)
2. Zlokalizuj kod kreskowy parowania na spodzie bazy
3. Zeskanuj kod parowania skanerem DS3678
4. Poprawne parowanie = seria tonow high-low-high-low + low-high
5. LED skanera zmieni sie na ciagly zielony
6. Alternatywnie: wloz skaner do bazy (jesli Contact Pairing jest wlaczone)

**Parowanie w trybie Multipoint-to-Point:**
1. Jedna baza STB3678 moze byc sparowana z max. 7 skanerami
2. Kazdy skaner skanuje ten sam kod parowania bazy
3. Baza zarzadza kolejka transmisji danych od wielu skanerów

**Parowanie bezposrednie z urzadzeniem (HID/SPP):**
1. Wlacz tryb discoverable na skanerze (zeskanuj odpowiedni kod z PRG)
2. Na urzadzeniu hosta wlacz Bluetooth i wyszukaj urzadzenia
3. Wybierz "DS3678-xxxx" z listy
4. Wprowadz PIN: 0000 (domyslny)
5. Po polaczeniu LED skanera = ciagly zielony

### 6.3 Czyszczenie i konserwacja

**Czestotliwosc:** Regularne czyszczenie zalecane w srodowiskach zapylonych/przemyslowych. Inspekcja styków miesieczna.

**Dopuszczone srodki czyszczace:**
- Alkohol izopropylowy (IPA) 70% -- PODSTAWOWY srodek czyszczacy
- Lagodny roztwor mydla z woda
- Nadtlenek wodoru (hydrogen peroxide) -- do dezynfekcji
- Chlorek amonu (ammonium chloride) -- do dezynfekcji
- Podchloryn sodu (bleach/sodium hypochlorite) -- WYLACZNIE do skanera, NIE do bazy/cradle
- Gotowe chusteczki czyszczace do skanerów

**ZABRONIONE srodki:**
- Aceton
- Rozpuszczalniki na bazie ropy naftowej
- Srodki scierne
- Srodki zawierajace amoniak (do szyby)
- Zanurzanie w roztworach czyszczacych

**Procedura czyszczenia skanera:**
1. Wylacz skaner / odlacz od zasilania
2. Zwilz miekka, bezpylowa sciereczke dopuszczonym srodkiem (70% IPA)
3. Delikatnie wytrzyj okno skanujace (scan window / exit window)
4. Wytrzyj obudowe skanera
5. Wyczysc styki ladowania (DS3678) -- IPA na sciereczce
6. Pozostaw do calkowitego wyschnięcia
7. NIE zanurzaj skanera w cieczy mimo IP67 -- chodzi o czyszczenie chemiczne, nie zanurzanie
8. NIE uzywaj spreznoego powietrza bezposrednio na okno skanujace

**Czyszczenie bazy STB3678:**
- Styki elektryczne: IPA na bezpylowej sciereczce
- Obudowa: lagodne mydlo z woda
- NIE uzywac srodków na bazie chloru (bleach) do bazy!

**Konserwacja okresowa:**
- Sprawdzaj stan okna skanujacego pod katem zarysowań
- Kontroluj styki ladowania pod katem korozji
- Sprawdzaj stan kabli (USB, RS-232)
- Aktualizuj firmware w razie potrzeby
- Sprawdzaj kondycje baterii (PowerPrecision raportuje stan zdrowia baterii)

---

## 7. RÓŻNICE MIĘDZY WERSJAMI

### 7.1 Tabela porownawcza

| Cecha | SR (Standard Range) | ER (Extended Range) | HP (High Performance) | HD (High Density) | DP/DPA (DPM) |
|---|---|---|---|---|---|
| **Silnik** | SE4750-SR | SE4850-ER | SE4750-HP | SE4750-HD | SE4750-DL |
| **Sensor** | 1280x800 | 1280x800 / 1920x1080 | 1280x960 | 1280x960 | 1280x960 |
| **Zasieg max** | ~1,5 m (5 ft) | ~21,4 m (70 ft) | ~2,1 m (7 ft) | ~18 cm (7,1 in.) | Bliski kontakt |
| **Min. rozdzielczosc** | 3 mil | 10 mil | 3 mil | 3 mil | 3 mil DPM |
| **Drop spec** | 2,4 m (8 ft) | 3,0 m (10 ft) | 2,4 m (8 ft) | 2,4 m (8 ft) | 3,0 m (10 ft) |
| **IP rating** | IP65/IP67 | IP65/IP68 | IP65/IP67 | IP65/IP67 | IP65/IP68 |
| **Tumble** | 5000 | 7500 | 5000 | 5000 | 7500 |
| **OCR** | Nie | Nie | Tak | Nie | Nie |
| **Dokumenty/zdjecia** | Nie | Nie | Tak | Nie | Nie |
| **DPM** | Ograniczony | Ograniczony | Ograniczony | Nie | PELNY |
| **Ethernet przemyslowy** | Nie | Tak | Nie | Nie | Tak |
| **Zastosowanie** | Ogolne magazynowe | Duze magazyny, outdoor, daleki zasieg | Produkcja, wiele typow kodow, OCR | Elektronika, maly PCB, miniaturowe kody | Automotive, lotniczy, metalowe czesci |

### 7.2 Kiedy wybrac ktora wersje

**SR (Standard Range)** -- Najczesciej wybierany model. Idealny do:
- Magazynów standardowych
- Linii pakujacych
- Punktów przyjecia/wydania towaru
- Kodów na etykietach w zasiegu do 1,5 m

**ER (Extended Range)** -- Dla zasiegow do 21 m. Idealny do:
- Duzych magazynów wysokiego skladowania
- Skanowania kodów na paletach z wózka widlowego
- Yardów logistycznych (kody na ciezarówkach)
- Zasiegow, gdzie trzeba czytac kody od 3 in. do 70 ft

**HP (High Performance)** -- Wszechstronny skaner. Idealny do:
- Linii produkcyjnych z roznymi typami kodów
- Skanowania OCR (numery seryjne, daty)
- Przechwytywania dokumentow i zdjec
- Mieszanych srodowisk (etykiety + ekrany + dokumenty)

**HD (High Density)** -- Precyzja na miniaturowych kodach. Idealny do:
- Branzy elektronicznej (kody na PCB, chipach)
- Farmaceutycznej (kody 3 mil na malych opakowaniach)
- Laboratoryjnej (kody na probówkach)

**DP/DPA (Direct Part Marking)** -- Odczyt znakowan bezposrednich. Idealny do:
- Automotive (kody dot peen na czesciach silnika)
- Lotnictwo (laser etch na czesciach)
- Obronnosc (IUID)
- Kazda branza ze znakowaniem DPM

---

## 8. AKCESORIA I CZESCI ZAMIENNE

### 8.1 Bazy i ladowarki

| Model | Opis | Uwagi |
|---|---|---|
| STB3678-C100F3WW | Standardowa baza ladujaco-komunikacyjna | Bluetooth + ladowanie; wymaga zasilacza i kabla |
| FLB3678 | Baza na wózek widlowy (forklift cradle) | Montaz na wózku, ladowanie + komunikacja |
| SAC3600-4001CR | Ladowarka 4-slotowa baterii | Laduje 4 baterie jednoczesnie |

### 8.2 Zasilacze i kable (wymagane do STB3678)

| Model | Opis |
|---|---|
| PWR-BGA12V50W0WW | Zasilacz 12V |
| CBL-DC-451A1-01 | Kabel zasilajacy DC |
| 23844-00-00R | Kabel Line Cord |
| + kabel komunikacyjny USB/RS-232 | Do polaczenia bazy z hostem |

### 8.3 Baterie

| Model | Opis |
|---|---|
| BTRY-36IAB0E-00 | PowerPrecision+ 3100 mAh bateria wymienna |

### 8.4 Gwarancja

| Element | Okres |
|---|---|
| Skaner | 36 miesiecy (3 lata) |
| Baza (cradle) | 36 miesiecy (3 lata) |
| Bateria | 12 miesiecy (1 rok) |

---

## 9. ZRODLA

Dane zebrane z nastepujacych oficjalnych zrodel Zebra Technologies:

1. [DS36X8 Product Reference Guide MN-002689-22EN](https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/ds36x8-prg-en.pdf)
2. [DS3600-SR Spec Sheet (Zebra)](https://www.zebra.com/us/en/products/spec-sheets/scanners/ultra-rugged-scanners/ds36x8-sr.html)
3. [DS3600-ER Spec Sheet (Zebra)](https://www.zebra.com/us/en/products/spec-sheets/scanners/ultra-rugged-scanners/ds36x8-er.html)
4. [DS3600-HP Spec Sheet (Zebra)](https://www.zebra.com/us/en/products/spec-sheets/scanners/ultra-rugged-scanners/ds36x8-hp.html)
5. [DS3600-HD Spec Sheet (Zebra)](https://www.zebra.com/us/en/products/spec-sheets/scanners/ultra-rugged-scanners/ds36x8-hd.html)
6. [DS3600-DP Spec Sheet (Zebra)](https://www.zebra.com/us/en/products/spec-sheets/scanners/ultra-rugged-scanners/ds36x8-dp.html)
7. [SE4750-SR Decode Zone (Zebra TechDocs)](https://docs.zebra.com/content/tcm/us/en/mobile-computers/handheld/mc9-series/mc93xx-product-reference-guide-for-android-11/technical-specifications/se4750-sr-decode-zone.html)
8. [SE4850-ER Decode Zone (Zebra TechDocs)](https://docs.zebra.com/us/en/mobile-computers/handheld/mc9-series/mc93xx-product-reference-guide/technical-specifications/se4850-er-decode-zone.html)
9. [SE4750 Expansion Back Decode Range (Zebra TechDocs)](https://docs.zebra.com/us/en/tablets/et5-series/et51-56-enterprise-tablet-product-reference-guide/specifications/se4750-expansion-back-decode-range.html)
10. [DS3678 Quick Start Guide](https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/ds3678-qsg-en.pdf)
11. [STB3678 Cradle Quick Reference Guide](https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/accessory/STB3678-cradle-qrg-en.pdf)
12. [Zebra Support Community - DS3608 Factory Reset](https://supportcommunity.zebra.com/s/article/000026717?language=en_US)
13. [Zebra Support Community - DS3678 Blue LED Issue](https://supportcommunity.zebra.com/s/article/000027722?language=en_US)
14. [DS3608-HP/DS3678-HP Spec Sheet (indiamart.com)](https://www.indiamart.com/proddetail/zebra-ds3608-hp-ds3678-hp-1d-2d-ultra-rugged-scanner-16888254512.html)
15. [DS3678-ER Spec Data (atlasRFIDstore)](https://www.atlasrfidstore.com/zebra-ds3678-er-cordless-extended-range-handheld-scanner/)
16. [DS3600-ER Spec Data (rfid4ustore)](https://rfid4ustore.com/zebra-ds3600-er-extended-range-ultra-rugged-1d-2d-barcode-scanner/)
17. [DS3678-SR Spec Data (barcodebonanza)](https://www.barcodebonanza.com/products/zebra-ds3678-sr-bar-code-scanners.jsp)
