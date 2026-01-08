# Instrukcja obsługi drukarki Zebra ZT231

**Drukarka przemysłowa z kolorowym wyświetlaczem dotykowym**

---

## 1. Podstawowe informacje

### O drukarce ZT231

Zebra ZT231 to drukarka przemysłowa nowej generacji, następca popularnego modelu ZT230. Wyposażona w **kolorowy wyświetlacz dotykowy** oferuje intuicyjny interfejs z systemem menu, kreatorami konfiguracji i skrótami do ulubionych funkcji. Zaprojektowana do pracy w wymagających środowiskach magazynowych i produkcyjnych.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku | do 356 mm/s (14 cali/s) |
| Szerokość druku | do 104 mm (4,09 cala) |
| Maks. średnica rolki | 203 mm (8 cali) |
| Średnica gilzy | 25 mm – 76 mm (1" – 3") |
| Długość ribbonu | do 450 m |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth – opcja
- USB Host (do podłączenia klawiatury, skanera, pendrive)

### Cechy charakterystyczne

- **Kolorowy wyświetlacz dotykowy** z intuicyjnym interfejsem
- Kreatory konfiguracji (Print Wizard, System Wizard, Connection Wizard)
- System skrótów i ulubionych
- Metalowa konstrukcja przemysłowa
- 5 wskaźników LED statusu
- Kolorowe punkty dotykowe (złote) ułatwiające obsługę
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz, dispenser lub nawijak podkładu
- Regulacja docisku głowicy i naprężenia ribbonu
- Zgodność z dyrektywą EU RED (od 08/2025)
- Tryb chroniony (Protected Mode) dla bezpieczeństwa

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZT231
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

---

## 3. Kolorowy wyświetlacz dotykowy

### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki i umożliwia dostęp do wszystkich funkcji. Możesz obracać widok drukarki o 360° dotykając i przeciągając.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

| Element | Funkcja |
|---------|---------|
| **Menu** | Dostęp do wszystkich ustawień drukarki |
| **Wizards** | Kreatory konfiguracji krok po kroku |
| **Shortcuts** | Skróty do ostatnio używanych i ulubionych pozycji |
| **Printer Info** | Informacje o drukarce (IP, status, liczniki) |

### Zapisywanie ulubionych

Dotknij ikony serca obok pozycji menu, aby dodać ją do ulubionych. Ulubione są wyświetlane w kolejności dodawania.

### Wskaźniki LED

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

### Przyciski fizyczne

| Przycisk | Funkcja |
|----------|---------|
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw jednej etykiety |
| **CANCEL** | Anulowanie (1x = następna, 2 sek. = wszystkie) |

---

## 4. Ładowanie materiałów eksploatacyjnych

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami, otworami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby obsługi materiału

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **Tear Off** | Brak | Ręczne odrywanie (domyślny) |
| **Peel Off** | Dispenser | Automatyczne odklejanie od podkładu |
| **Liner Take-Up** | Nawijak | Nawijanie podkładu na rolkę |
| **Cutter** | Obcinacz | Automatyczne cięcie |
| **Delayed Cut** | Obcinacz | Cięcie po komendzie ZPL (~JK) |
| **Applicator** | Port aplikatora | Współpraca z aplikatorem etykiet |

### Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** Sprawdź czy materiał wymaga ribbonu – przesuń paznokciem po powierzchni. Czarny ślad = Direct Thermal (bez ribbonu).

#### Strona powlekana ribbonu

Drukarka ZT231 standardowo obsługuje ribbon powlekany na zewnątrz. Test: przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

#### Procedura ładowania ribbonu:

1. Otwórz drzwi komory mediów
2. **Załaduj rolkę ribbonu na dolną gilzę (podającą):**
   - Ribbon odwija się zgodnie ze strzałką
   - Dociśnij rolkę do tyłu
3. **Sprawdź pustą gilzę na górnej gilzie (odbiorczej)**
4. **Przeprowadź ribbon pod głowicą drukującą**
5. **Nawiń ribbon na gilzę odbiorczą:**
   - Owiń kilka zwojów
   - Obróć gilzę w kierunku nawijania
6. Zamknij głowicę (po załadowaniu materiału)

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę przed zużyciem.

### Ładowanie materiału (tryb Tear-Off)

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę (zwolnij głowicę)
3. **Odsuń prowadnicę materiału** – wysuń i odchyl na zewnątrz
4. **Włóż rolkę:**
   - Rolka: umieść na wieszaku, dociśnij do tyłu
   - Fanfold: wprowadź przez tylny otwór
5. Podnieś prowadnicę i dosuń do krawędzi rolki
6. **Przeprowadź materiał:**
   - Przez szczelinę czujnika transmisyjnego
   - Pod wewnętrzną prowadnicą
   - Materiał powinien dotykać tylnej krawędzi szczeliny czujnika
7. Dosuń zewnętrzną prowadnicę do krawędzi materiału
8. **Zamknij głowicę** (dźwignia w dół)
9. Zamknij drzwi
10. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie w trybie Peel-Off

Po standardowym ładowaniu:

1. Otwórz mechanizm dispensera (dźwignia zwalniająca)
2. Odklej ok. 50 cm etykiet od podkładu
3. Przeprowadź pusty podkład przez dispenser
4. (Opcjonalnie) Nawlecz podkład na gilzę nawijaka
5. Zamknij dispenser
6. Zamknij głowicę i drzwi

### Ładowanie w trybie Cutter

Po standardowym ładowaniu:

1. Przeprowadź materiał przez otwór obcinacza
2. Zamknij głowicę i drzwi
3. (Opcjonalnie) Załóż tackę zbierającą etykiety

---

## 5. Kreatory konfiguracji (Wizards)

### Dostępne kreatory

Dotknij **Wizards** na ekranie głównym:

| Kreator | Funkcja |
|---------|---------|
| **Set All Wizard** | Uruchamia wszystkie kreatory po kolei |
| **System Wizard** | Ustawienia systemowe (język, hasło, oszczędzanie energii) |
| **Connection Wizard** | Konfiguracja połączeń sieciowych |
| **Print Wizard** | Konfiguracja parametrów druku |
| **RFID Wizard** | Konfiguracja RFID (tylko ZT231R) |

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
11. (Opcjonalnie) Uruchom **Print Quality Assistance** dla optymalizacji

### Print Quality Assistance

Kreator jakości druku pomaga dobrać optymalne ustawienia ciemności i prędkości:

1. Wybierz liczbę etykiet testowych (więcej = więcej opcji)
2. Drukarka wydrukuje serie etykiet z różnymi ustawieniami
3. Wybierz numer etykiety z najlepszą jakością
4. Drukarka automatycznie zastosuje te ustawienia

---

## 6. Menu użytkownika

### System Menu

| Pozycja | Funkcja |
|---------|---------|
| **Language** | Wybór języka (w tym polski) |
| **Program Language** | Tryb diagnostyczny, język poleceń, ZBI |
| **Settings** | Format czasu, hasło, akcje przy włączeniu/zamknięciu głowicy |
| **Energy Saving** | Tryb oszczędzania energii (Energy Star) |

### Connection Menu

| Pozycja | Funkcja |
|---------|---------|
| **Networks** | Reset sieci, sieć podstawowa, porty IP |
| **Wired** | Ustawienia Ethernet (IP, maska, brama, MAC) |
| **Wi-Fi** | Ustawienia bezprzewodowe (ESSID, bezpieczeństwo, pasmo) |
| **Bluetooth** | Włączanie BT, wykrywalność, parowanie, PIN |

### Print Menu

| Pozycja | Funkcja |
|---------|---------|
| **Print Quality** | Ciemność, prędkość, typ druku, typ etykiety |
| **Image Adjust** | Tryb obsługi, pozycja odrywania, offsety obrazu |
| **Sensors** | Kalibracja ręczna, typ czujnika, profil czujników |
| **Print Station** | Drukowanie formatów z USB |
| **Applicator** | Ustawienia portu aplikatora |

### Storage Menu

| Pozycja | Funkcja |
|---------|---------|
| **USB** | Kopiowanie plików z/na USB, drukowanie z USB |
| **Print Asset Lists** | Drukowanie list formatów, obrazów, fontów |
| **Print from E:** | Drukowanie plików z pamięci drukarki |

---

## 7. Kalibracja

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

Pokrętła regulacji docisku (wewnętrzne i zewnętrzne) mają oznaczenia 1-4:

| Szerokość materiału | Pokrętło wewnętrzne | Pokrętło zewnętrzne |
|--------------------|---------------------|---------------------|
| ≥ 89 mm | 2 | 2 |
| 76 mm | 2.5 | 1.5 |
| 51 mm | 3 | 1 |
| 25 mm | 4 | 1 |

**Rozwiązywanie problemów:**
- Materiał przesuwa się w lewo → zwiększ zewnętrzne lub zmniejsz wewnętrzne
- Materiał przesuwa się w prawo → zwiększ wewnętrzne lub zmniejsz zewnętrzne
- Zbyt jasny druk z lewej → zwiększ wewnętrzne
- Zbyt jasny druk z prawej → zwiększ zewnętrzne

### Regulacja naprężenia ribbonu

Obie gilze ribbonu (podająca i odbiorcza) mają regulację naprężenia:
- **Normalne naprężenie** – zaślepki wysunięte (większość zastosowań)
- **Niskie naprężenie** – zaślepki wciśnięte (wąski ribbon lub problemy z nawijaniem)

---

## 8. Podłączenie do komputera

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki: zebra.com/drivers
2. Uruchom instalator
3. Wybierz **Configure System** lub uruchom **Printer Installation Wizard**
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
3. Ustaw zabezpieczenia: **Menu > Connection > Wi-Fi > Wi-Fi Security**
4. Wykonaj reset sieci: **Menu > Connection > Networks > Reset Network**

---

## 9. Konserwacja

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu / materiału DT |
| Wałek dociskowy | Co 1 rolkę ribbonu / materiału DT |
| Czujniki | Co 1 rolkę |
| Ścieżka materiału/ribbonu | Co 1 rolkę |
| Dispenser | W razie problemów z odklejaniem |
| Obcinacz | W razie problemów z cięciem |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD – dotknij metalowej ramy przed czyszczeniem.

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

---

## 10. Rozwiązywanie problemów

### Komunikaty na wyświetlaczu

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał |
| **RIBBON OUT** | Załaduj ribbon |
| **HEAD OPEN** | Zamknij głowicę |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **HEAD UNDER TEMP** | Przenieś w cieplejsze miejsce |

### Problemy z jakością druku

| Problem | Rozwiązanie |
|---------|-------------|
| Blade wydruki | Zwiększ Darkness, wyczyść głowicę |
| Przepalone wydruki | Zmniejsz Darkness, zwiększ Speed |
| Puste obszary | Wyczyść lub wymień głowicę |
| Marszczenie ribbonu | Sprawdź naprężenie, wyczyść ścieżkę |

### Druk etykiety konfiguracji

**Menu > System > Settings > Print: System Settings**

Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy

### Druk profilu czujników

**Menu > Print > Sensors > Print: Sensor Profile**

Lub: przytrzymaj **FEED + CANCEL** podczas włączania drukarki

---

## 11. Tryb chroniony (Protected Mode) i EU RED

### Drukarki zakupione w UE po 1 sierpnia 2025

Drukarki sprzedawane w EMEA od 08/2025 mają włączone dodatkowe zabezpieczenia zgodne z **dyrektywą EU RED**:

1. Przed konfiguracją musisz ustawić **hasło Protected Mode**
2. Musisz ustawić **PIN do panelu** (front panel password)
3. Niektóre usługi sieciowe są domyślnie wyłączone

Szczegóły: zebra.com/asr lub **PrintSecure Printer Administration Guide**

### Protected Mode

Po włączeniu trybu chronionego zmiana zabezpieczonych ustawień wymaga hasła administratora. Dotyczy to m.in.:
- Ustawień sieciowych
- Aktualizacji firmware
- Niektórych parametrów druku

---

## 12. Funkcje USB Host

### Drukowanie z pendrive

1. Włóż pendrive do portu USB Host
2. Dotknij **Menu > Storage > USB > Print: From USB**
3. Wybierz pliki do drukowania
4. Dotknij znacznika potwierdzenia

### Kopiowanie plików

**Z drukarki na USB:**
Menu > Storage > USB > Copy: Files to USB

**Z USB do drukarki:**
Menu > Storage > USB > Copy: Files to Printer

### Print Station (drukowanie z klawiatury USB)

1. Podłącz klawiaturę USB do portu USB Host
2. Dotknij **Menu > Print > Print Station**
3. Wybierz format z pamięci E:
4. Wprowadź dane do pól zmiennych
5. Określ liczbę kopii i drukuj

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
