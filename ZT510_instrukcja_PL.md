# Instrukcja obsługi drukarki Zebra ZT510

**Przemysłowa drukarka etykiet 4-calowa**

---

## 1. Podstawowe informacje

### O drukarce ZT510

Zebra ZT510 to przemysłowa drukarka etykiet o szerokości druku 4 cale (104 mm), zaprojektowana dla środowisk produkcyjnych, magazynowych i logistycznych wymagających niezawodności w atrakcyjnej cenie. Wyposażona w wytrzymałą metalową konstrukcję, intuicyjny panel sterowania z wyświetlaczem LCD oraz szeroki zakres opcji łączności. ZT510 oferuje doskonały stosunek możliwości do ceny w klasie drukarek przemysłowych.

### Parametry techniczne

| Parametr | ZT510 |
|----------|-------|
| Szerokość druku | do 104 mm (4,09") |
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku | do 305 mm/s (12"/s) dla 203 dpi |
| | do 254 mm/s (10"/s) dla 300 dpi |
| Maks. średnica rolki | 203 mm (8") |
| Średnica gilzy | 76 mm (3") |
| Długość ribbonu | do 450 m |
| Maks. szerokość materiału | 114 mm (4,5") |

### Rozdzielczości i szerokości druku

| Rozdzielczość | Maks. szerokość druku (dots) | Maks. szerokość (mm) |
|---------------|------------------------------|----------------------|
| 203 dpi | 832 dots | 104 mm |
| 300 dpi | 1248 dots | 106 mm |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (opcja)
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 – opcja
- USB Host (1x) – do podłączenia klawiatury, skanera, pendrive
- Aplikator (opcja)

### Cechy charakterystyczne

- **Metalowa konstrukcja przemysłowa** – wysoka trwałość
- Wyświetlacz LCD z nawigacją przyciskami
- 5 wskaźników LED statusu (STATUS, PAUSE, DATA, SUPPLIES, NETWORK)
- Ruchomy czujnik mediów
- Regulacja docisku i pozycji głowicy (toggles)
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz
- Opcjonalny nawijak/dispenser (Rewind)
- Near Field Communication (NFC) / Print Touch
- Zebra Basic Interpreter (ZBI 2.0)
- Zgodność z EU RED (Protected Mode)

---

## 2. Rozpakowanie i instalacja

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

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

### Warunki przechowywania

- Temperatura: -40°C do +60°C
- Wilgotność: 5-85% bez kondensacji

---

## 3. Panel sterowania

### Wyświetlacz LCD

Wyświetlacz pokazuje aktualny status drukarki i umożliwia nawigację po menu. W stanie bezczynności (Idle Display) pokazuje wersję firmware i adres IP.

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
| **LEFT ARROW** | Nawigacja w lewo w menu |
| **RIGHT ARROW** | Nawigacja w prawo w menu |
| **OK** | Potwierdza wybór |
| **PAUSE** | Wstrzymuje/wznawia drukowanie |
| **FEED** | Wysuwa jedną etykietę |
| **CANCEL** | Anuluje (1x = następna etykieta, 2 sek. = wszystkie) |

### Nawigacja w menu

**Ekran bezczynności (Idle Display):**
- Naciśnij **LEFT SELECT** aby wejść do menu głównego (Home Menu)
- Drukarka automatycznie wraca do ekranu bezczynności po 15 sekundach nieaktywności

**Menu główne (Home Menu):**
- Użyj **strzałek** aby przemieszczać się między ikonami
- Naciśnij **OK** aby wybrać podświetloną opcję
- Naciśnij **LEFT SELECT** aby wrócić do ekranu bezczynności

**Menu użytkownika:**
- **LEFT/RIGHT ARROW** – przewijanie opcji w menu
- **UP/DOWN ARROW** – zmiana wartości parametrów
- **OK** lub **RIGHT SELECT** – wykonanie akcji
- **LEFT SELECT** – powrót do menu głównego

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

---

## 4. Ładowanie materiałów eksploatacyjnych

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap/notch)** – rozdzielone przerwami lub nacięciami
- **Etykiety z czarnym znacznikiem (mark)** – czarny znacznik z tyłu
- **Materiał ciągły (continuous)** – bez znaczników separacji
- **Materiał składany (fanfold)** – stos składanych etykiet

### Tryby druku (Print Mode)

| Tryb | Wymagana opcja | Opis |
|------|----------------|------|
| **TEAR OFF** | Brak | Ręczne odrywanie (domyślny) |
| **PEEL-OFF** | Nawijak | Automatyczne odklejanie od podkładu |
| **REWIND** | Nawijak | Nawijanie całych etykiet na rolkę |
| **CUTTER** | Obcinacz | Automatyczne cięcie |
| **DELAYED CUT** | Obcinacz | Cięcie po komendzie ZPL (~JK) |
| **APPLICATOR** | Port aplikatora | Współpraca z aplikatorem etykiet |

### Ładowanie materiału (tryb Tear-Off)

> **Ostrzeżenie:** Głowica może być gorąca! Zdejmij biżuterię i metalowe przedmioty przed pracą przy otwartej głowicy.

1. **Podnieś drzwi komory mediów**
2. **Otwórz głowicę** – obróć dźwignię w górę
3. **Odsuń zewnętrzną prowadnicę:**
   - Poluzuj śrubę motylkową na spodzie prowadnicy
   - Odsuń prowadnicę na zewnątrz
4. **Włóż rolkę:**
   - **Rolka:** umieść na wrzecionie, dociśnij do tyłu, dosuń prowadnicę
   - **Fanfold:** wprowadź przez tylny otwór lub od dołu
5. **Przeprowadź materiał:**
   - Pod rolką tancerza (1)
   - Pod rolką prowadzącą (2)
   - Pod górnym czujnikiem mediów (3)
   - **Ważne:** Materiał musi przejść POD tymi elementami, nie nad nimi!
6. **Przeprowadź dalej:**
   - Pod głowicą drukującą (1)
   - Pod płytką zatrzaskową (snap plate) (2)
   - Nad wałkiem dociskowym (platen roller) (3)
7. **Dosuń prowadnicę** do krawędzi materiału
8. **Dokręć śrubę motylkową**
9. **Zamknij głowicę** (dźwignia w dół)
10. Zamknij drzwi
11. Naciśnij **PAUSE** aby umożliwić drukowanie

> **Ważne:** Jeśli materiał przeprowadzisz NAD rolkami zamiast pod nimi, czujnik ribbonu zostanie zasłonięty i pojawi się fałszywy błąd RIBBON OUT.

### Ładowanie w trybie Peel-Off

1. Zainstaluj płytę nawijaka w pozycji peel-off
2. Otwórz głowicę i przeprowadź materiał standardowo
3. Odklej ok. 50 cm etykiet od podkładu
4. Przeprowadź pusty podkład za płytę nawijaka
5. (Opcjonalnie) Załóż gilzę na wrzeciono nawijaka
6. Zdejmij haczyk z wrzeciona nawijaka
7. Nawiń podkład na wrzeciono nawijaka
8. Załóż haczyk z powrotem (długi koniec w mały otwór płyty, krótki w otwór nakrętki)
9. Dosuń prowadnicę, dokręć śrubę, zamknij głowicę i drzwi

### Ładowanie w trybie Rewind

1. Zainstaluj płytę nawijaka w pozycji rewind
2. Załóż gilzę na wrzeciono nawijaka
3. Przeprowadź materiał standardowo przez czujnik i pod głowicę
4. Wysuń ok. 50 cm materiału
5. Przeprowadź materiał NAD płytą nawijaka
6. Nawiń materiał na gilzę nawijaka
7. Dosuń prowadnicę, dokręć śrubę, zamknij głowicę i drzwi

### Ładowanie w trybie Cutter

1. Przeprowadź materiał standardowo przez czujnik i pod głowicę
2. Przeprowadź materiał przez zespół obcinacza
3. Zamknij głowicę i drzwi

> **Ostrzeżenie:** Ostrze obcinacza jest ostre! Nie dotykaj ostrza palcami.

---

## 5. Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** 

### Czy potrzebuję ribbonu?

Przesuń paznokciem po powierzchni materiału:
- **Czarny ślad** = Direct Thermal (bez ribbonu)
- **Brak śladu** = Thermal Transfer (wymaga ribbonu)

### Strona powlekana ribbonu

ZT510 standardowo obsługuje ribbon powlekany na zewnątrz.

**Test klejenia:** Przyklej kawałek etykiety do zewnętrznej strony rolki. Jeśli farba przylgnie do etykiety – ribbon jest powlekany na zewnątrz.

**Test rysowania:** Połóż rozwinięty ribbon na kartce zewnętrzną stroną do papieru. Podrap wewnętrzną stronę paznokciem. Jeśli ślad pojawi się na kartce – ribbon jest powlekany na zewnątrz.

### Procedura ładowania ribbonu

1. Podnieś drzwi komory mediów
2. Otwórz głowicę (dźwignia w górę)
3. **Wyrównaj segmenty wrzeciona ribbonu**
4. **Załaduj rolkę ribbonu na dolne wrzeciono (podające):**
   - Ribbon odwija się do przodu
   - Dociśnij rolkę do tyłu
5. **(Opcjonalnie) Przygotuj lidera ribbonu:**
   - Jeśli ribbon nie ma papierowego lidera
   - Oderwij 10-15 cm materiału
   - Odklej etykietę i przyklej do końca ribbonu
6. **Przeprowadź ribbon:**
   - Pod rolką prowadzącą
   - Pod głowicą drukującą
7. **Nawiń ribbon na górne wrzeciono (odbiorcze):**
   - Przeprowadź nad górną rolką
   - Owiń kilka zwojów na wrzecionie odbiorczym
   - Obróć wrzeciono aby naprężyć
8. Załaduj materiał (jeśli jeszcze nie załadowany)
9. Zamknij głowicę (dźwignia w dół)
10. Zamknij drzwi

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę przed zużyciem.

---

## 6. Menu użytkownika

### SETTINGS Menu

| Pozycja | Opis | Wartości |
|---------|------|----------|
| **DARKNESS** | Ciemność druku | 0.0 – 30.0 |
| **PRINT SPEED** | Prędkość druku | 2-12 ips (203dpi), 2-10 ips (300dpi) |
| **MEDIA TYPE** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **PRINT METHOD** | Metoda druku | THERMAL TRANS, DIRECT THERMAL |
| **TEAR OFF** | Pozycja odrywania | -120 do +120 dots |
| **PRINT WIDTH** | Szerokość druku | 2-832 (203dpi), 2-1248 (300dpi) |
| **PRINT MODE** | Tryb druku | TEAR OFF, PEEL-OFF, REWIND, CUTTER, DELAYED CUT, APPLICATOR |
| **LABEL TOP** | Offset pionowy | -120 do +120 dots |
| **LEFT POSITION** | Offset poziomy | -9999 do +9999 dots |
| **REPRINT MODE** | Tryb ponownego druku | ON, OFF |
| **LABEL LENGTH MAX** | Maks. długość etykiety | Do maksymalnej obsługiwanej |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFORMATION** | Drukuje etykiety konfiguracji (SETTINGS, NETWORK, FORMATS, IMAGES, FONTS, BARCODES, ALL, SENSOR PROFILE) |
| **IDLE DISPLAY** | Co pokazywać na ekranie bezczynności (FW VERSION, IP ADDRESS, data/czas) |
| **POWER UP ACTION** | Akcja przy włączeniu (CALIBRATE, FEED, LENGTH, NO MOTION, SHORT CAL) |
| **HEAD CLOSE ACTION** | Akcja przy zamknięciu głowicy |
| **LOAD DEFAULTS** | Przywracanie ustawień (FACTORY, NETWORK, LAST SAVED) |
| **MEDIA/RIBBON CAL** | Kalibracja czujników |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny (hex dump) |
| **ENERGY STAR** | Tryb oszczędzania energii |
| **CONFIG INFO TO USB** | Kopiowanie konfiguracji na USB |
| **ZBI ENABLED?** | Status Zebra Basic Interpreter |
| **RUN ZBI PROGRAM** | Uruchomienie programu ZBI |
| **STOP ZBI PROGRAM** | Zatrzymanie programu ZBI |
| **PRINT USB FILE** | Drukowanie z pendrive |
| **COPY USB FILE TO E:** | Kopiowanie z USB do pamięci |
| **STORE E: FILE TO USB** | Kopiowanie z pamięci na USB |
| **PRINT STATION** | Drukowanie z klawiatury USB |
| **PASSWORD PROTECT** | Ochrona hasłem |
| **PRINT TEST FORMAT** | Drukowanie formatu testowego |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **ACTIVE PRINT SERVER** | Aktywny serwer druku |
| **PRIMARY NETWORK** | Sieć podstawowa (WIRED/WLAN) |
| **WIRED IP ADDRESS** | Adres IP (kablowy) |
| **WIRED SUBNET MASK** | Maska podsieci |
| **WIRED GATEWAY** | Brama domyślna |
| **WIRED IP PROTOCOL** | Protokół IP (ALL, PERMANENT, DHCP...) |
| **WIRED MAC ADDRESS** | Adres MAC |
| **WLAN IP ADDRESS** | Adres IP (Wi-Fi) |
| **WLAN SUBNET MASK** | Maska podsieci Wi-Fi |
| **WLAN GATEWAY** | Brama Wi-Fi |
| **WLAN IP PROTOCOL** | Protokół IP Wi-Fi |
| **WLAN MAC ADDRESS** | Adres MAC Wi-Fi |
| **ESSID** | Nazwa sieci Wi-Fi |
| **CHANNEL** | Kanał Wi-Fi |
| **SIGNAL** | Siła sygnału |
| **IP PORT** | Port TCP (domyślnie 9100) |
| **IP ALTERNATE PORT** | Alternatywny port |
| **RESET NETWORK** | Reset ustawień sieciowych |
| **VISIBILITY AGENT** | Agent widoczności Zebra |

### LANGUAGE Menu

| Pozycja | Opis |
|---------|------|
| **LANGUAGE** | Język wyświetlacza (w tym polski) |
| **COMMAND LANGUAGE** | Język poleceń (ZPL, EPL...) |
| **COMMAND CHAR** | Znak początku komendy (domyślnie ^) |
| **CONTROL CHAR** | Znak kontrolny (domyślnie ~) |
| **DELIMITER CHAR** | Znak rozdzielający (domyślnie ,) |
| **ZPL MODE** | Tryb ZPL |
| **VIRTUAL DEVICE** | Urządzenia wirtualne |

### SENSORS Menu

| Pozycja | Opis |
|---------|------|
| **SENSOR TYPE** | Typ czujnika (TRANSMISSIVE, REFLECTIVE) |
| **MEDIA/RIBBON CAL** | Kalibracja czujników |
| **LABEL SENSOR** | Czułość czujnika etykiet |
| **TAKE LABEL** | Czujnik pobrania etykiety |

### PORTS Menu

| Pozycja | Opis | Wartości |
|---------|------|----------|
| **BAUD RATE** | Prędkość transmisji | 300 – 115200 |
| **DATA BITS** | Bity danych | 7, 8 |
| **PARITY** | Parzystość | NONE, ODD, EVEN |
| **HOST HANDSHAKE** | Kontrola przepływu | XON/XOFF, DTR/DSR, RTS/CTS |
| **WML** | Web Markup Language | ON, OFF |

### BLUETOOTH Menu

| Pozycja | Opis |
|---------|------|
| **BLUETOOTH ADDRESS** | Adres MAC Bluetooth |
| **MODE** | Tryb Bluetooth |
| **DISCOVERY** | Wykrywalność |
| **CONNECTED** | Status połączenia |
| **BT SPEC VERSION** | Wersja specyfikacji BT |
| **MIN SECURITY MODE** | Minimalny tryb bezpieczeństwa |

---

## 7. Kalibracja

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
1. TOOLS > MEDIA/RIBBON CAL
2. Postępuj zgodnie z instrukcjami na ekranie

**Metoda 2 – Skrót klawiszowy:**
Przytrzymaj **PAUSE + CANCEL** przez 2 sekundy

### Regulacja docisku głowicy

ZT510 posiada dwa elementy regulacji:
1. **Toggle Position** – pozycja punktu docisku (przód/tył)
2. **Printhead Pressure** – siła docisku

**Regulacja pozycji toggle:**
- Poluzuj nakrętkę blokującą
- Przesuń toggle do przodu lub do tyłu
- Dokręć nakrętkę

**Regulacja docisku:**
- Zwiększ docisk zewnętrzny jeśli materiał przesuwa się w lewo
- Zwiększ docisk wewnętrzny jeśli materiał przesuwa się w prawo

### Regulacja pozycji czujnika transmisyjnego

Czujnik mediów można przesuwać w poziomie aby dopasować do pozycji przerw/nacięć na materiale:
1. Poluzuj śrubę mocującą czujnik
2. Przesuń czujnik w żądane położenie
3. Dokręć śrubę

---

## 8. Podłączenie do komputera

### EU RED – Protected Mode (EMEA od 1.08.2025)

Drukarki sprzedawane w regionie EMEA od 1 sierpnia 2025 wymagają:
- Ustawienia hasła Protected Mode
- Skonfigurowania PIN panelu przedniego
- Przed konfiguracją sieciową należy wykonać powyższe kroki

Więcej informacji: zebra.com/asr lub Zebra Link-OS PrintSecure Printer Administration Guide.

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki: zebra.com/drivers
2. Wybierz drukarkę > Drivers
3. Uruchom plik instalacyjny
4. Postępuj zgodnie z instrukcjami

### Identyfikacja modelu i rozdzielczości

Na naklejce z numerem części: **ZT510xY-xxxxxxxx**
- ZT510 = model
- Y = rozdzielczość (2=203dpi, 3=300dpi)

### Połączenie USB

1. Zainstaluj sterowniki
2. Zdejmij etykietę z portu USB
3. Podłącz kabel USB
4. Podłącz zasilanie
5. Włącz drukarkę
6. Windows wykryje drukarkę automatycznie

### Połączenie Ethernet

1. Podłącz kabel sieciowy RJ-45
2. Włącz drukarkę
3. Drukarka pobierze IP z DHCP automatycznie
4. Sprawdź IP w NETWORK > WIRED IP ADDRESS
5. Jeśli IP = 0.0.0.0:
   - Sprawdź połączenie kablowe
   - Skonfiguruj statyczny IP (WIRED IP PROTOCOL = PERMANENT)

### Połączenie Wi-Fi

1. Podłącz drukarkę przez USB lub Ethernet
2. Skonfiguruj ESSID (nazwę sieci)
3. Ustaw WLAN GATEWAY i WLAN SUBNET MASK
4. Wykonaj RESET NETWORK
5. Jeśli brak połączenia, ustaw statyczny WLAN IP ADDRESS

---

## 9. Konserwacja

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu |
| Wałek dociskowy (platen) | Co 1 rolkę ribbonu |
| Czujniki | Co 1 rolkę |
| Ścieżka mediów | Co 1 rolkę |
| Obcinacz | W razie potrzeby |
| Obudowa zewnętrzna | W razie potrzeby |

### Czyszczenie głowicy i wałka

> **Ostrzeżenie:** Głowica może być gorąca! Uwaga na ESD.

1. Wyłącz drukarkę
2. Otwórz drzwi i wyjmij ribbon oraz materiał
3. **Głowica:** Przetrzyj brązowy pasek wacikiem nasączonym alkoholem izopropylowym (99,7%)
4. **Wałek:** Przetrzyj wacikiem obracając go ręcznie
5. Poczekaj aż wyschnie (2 minuty)
6. Załaduj materiał i ribbon

### Czyszczenie czujników

1. Oczyść obszar czujnika mediów wacikiem z alkoholem
2. Usuń pył i zanieczyszczenia

### Usuwanie zużytego ribbonu

1. Otwórz głowicę
2. Odetnij ribbon między rolką podającą a głowicą
3. Zdejmij zużyty ribbon z górnego wrzeciona
4. Załóż nową pustą gilzę
5. Załaduj nowy ribbon

---

## 10. Rozwiązywanie problemów

### Etykieta konfiguracji

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SETTINGS
- Lub: przytrzymaj **CANCEL** podczas włączania drukarki
- Lub: przytrzymaj **FEED + CANCEL** przez 2 sekundy (drukarka gotowa)

### Profil czujników

**Drukowanie:**
- TOOLS > PRINT INFORMATION > SENSOR PROFILE
- Lub: przytrzymaj **FEED + CANCEL** podczas włączania drukarki

### Tryb diagnostyczny (Hex Dump)

**Włączenie:**
- TOOLS > DIAGNOSTIC MODE > ENABLED
- Lub: przytrzymaj **PAUSE + FEED** przez 2 sekundy

### Test FEED (optymalna ciemność)

Przytrzymaj **FEED** podczas włączania drukarki aby wydrukować serię etykiet z różnymi ustawieniami ciemności i prędkości. Wybierz optymalne ustawienia.

### Komunikaty błędów

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał, sprawdź czujniki |
| **RIBBON OUT** | Załaduj ribbon, sprawdź ustawienie PRINT METHOD |
| **HEAD OPEN** | Zamknij głowicę |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **HEAD UNDER TEMP** | Przenieś w cieplejsze miejsce |
| **CUTTER JAM** | Usuń zacięcie w obcinaczu |
| **OUT OF MEMORY** | Zmniejsz rozmiar formatu lub dodaj pamięć |

### Problemy z jakością druku

| Problem | Rozwiązanie |
|---------|-------------|
| Blade wydruki | Zwiększ DARKNESS, wyczyść głowicę |
| Przepalone wydruki | Zmniejsz DARKNESS, zwiększ PRINT SPEED |
| Puste pionowe linie | Wyczyść lub wymień głowicę |
| Marszczenie ribbonu | Sprawdź naprężenie, wyrównaj ribbon |
| Przesuwanie materiału | Dostosuj docisk głowicy |
| Pomijanie etykiet | Skalibruj czujniki, sprawdź MEDIA TYPE |

### Problemy z komunikacją

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia USB | Sprawdź kabel, reinstaluj sterowniki |
| Brak połączenia sieciowego | Sprawdź kabel, IP, maskę, bramę |
| Wskaźnik NETWORK czerwony | Sprawdź połączenie fizyczne |

### Przywracanie ustawień fabrycznych

**Ustawienia drukarki:**
- TOOLS > LOAD DEFAULTS > FACTORY
- Lub: przytrzymaj **FEED + PAUSE** podczas włączania

**Ustawienia sieciowe:**
- TOOLS > LOAD DEFAULTS > NETWORK
- Lub: przytrzymaj **CANCEL + PAUSE** podczas włączania

---

## 11. Funkcje USB Host i NFC

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

### Near Field Communication (NFC) / Print Touch

Zbliż telefon z aplikacją Zebra Printer Setup Utility do logo NFC na drukarce aby:
- Szybko sparować urządzenie
- Pobrać informacje o drukarce
- Skonfigurować ustawienia

**Aplikacje mobilne:**
- Android: Google Play
- iOS: App Store

---

## 12. Specyfikacje

### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | ~267 mm |
| Głębokość | ~495 mm |
| Wysokość | ~394 mm |
| Waga | ~18-25 kg (w zależności od opcji) |

### Zasilanie

- Napięcie: 100-240 VAC
- Częstotliwość: 50-60 Hz

### Pamięć

- RAM: 256 MB (standard)
- Flash: 512 MB (standard)

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies (P1095460-07EN Rev A, 2025/09/30).*  
*Wersja: 1.0 | Data: Styczeń 2025*
