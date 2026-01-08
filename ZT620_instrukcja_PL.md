# Instrukcja obsługi drukarki Zebra ZT620

**Przemysłowa drukarka etykiet 6-calowa klasy premium**

---

## 1. Podstawowe informacje

### O drukarce ZT620

Zebra ZT620 to przemysłowa drukarka etykiet klasy premium o **szerokości druku 6 cali (168 mm)**, następca legendarnej serii Xi4. Zaprojektowana do najbardziej wymagających środowisk produkcyjnych, magazynowych i logistycznych, gdzie wymagane są duże etykiety wysyłkowe, etykiety na palety i oznaczenia przemysłowe. Wyposażona w wytrzymałą metalową konstrukcję, zaawansowane oświetlenie ścieżki mediów i ribbonu oraz intuicyjny panel sterowania z wyświetlaczem LCD.

### Parametry techniczne

| Parametr | ZT620 |
|----------|-------|
| **Szerokość druku** | **do 168 mm (6,6")** |
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku | do 305 mm/s (12"/s) dla 203 dpi |
| | do 203 mm/s (8"/s) dla 300 dpi |
| Maks. średnica rolki | 203 mm (8") |
| Średnica gilzy | 76 mm (3") |
| Długość ribbonu | do 450 m |
| Maks. szerokość materiału | 178 mm (7") |

### Rozdzielczości i szerokości druku

| Rozdzielczość | Maks. szerokość druku (dots) | Maks. szerokość (mm) |
|---------------|------------------------------|----------------------|
| 203 dpi | 1344 dots | 168 mm |
| 300 dpi | 1984 dots | 168 mm |

### Porównanie ZT610 vs ZT620

| Parametr | ZT610 | ZT620 |
|----------|-------|-------|
| Szerokość druku | 104 mm (4") | **168 mm (6")** |
| Rozdzielczości | 203, 300, **600** dpi | 203, 300 dpi |
| Maks. prędkość (203 dpi) | 356 mm/s (14 ips) | 305 mm/s (12 ips) |
| Maks. prędkość (300 dpi) | 305 mm/s (12 ips) | 203 mm/s (8 ips) |
| Zastosowanie | Etykiety standardowe | **Duże etykiety, palety** |

### Zastosowania ZT620

- **Logistyka i wysyłka:** duże etykiety wysyłkowe, etykiety na palety
- **Magazynowanie:** oznaczenia regałów, lokalizacji, stref
- **Produkcja:** etykiety produktowe, WIP labels, oznaczenia partii
- **Transport:** etykiety przewozowe, dokumenty CMR
- **Retail:** etykiety cenowe wielkoformatowe
- **Healthcare:** etykiety na pojemniki, oznaczenia próbek

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (standard)
- Ethernet 10/100 (opcja)
- Parallel (LPT) – opcja
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth 4.1 – opcja
- USB Host (2x) – do podłączenia klawiatury, skanera, pendrive
- Aplikator (opcja)

### Cechy charakterystyczne

- **Szerokość druku 6 cali (168 mm)** – idealna do dużych etykiet
- **Metalowa konstrukcja klasy premium** – najwyższa trwałość
- Wyświetlacz LCD z nawigacją przyciskami
- **Oświetlenie ścieżki mediów** – automatyczne podświetlenie przy braku materiału
- **Oświetlenie ścieżki ribbonu** – automatyczne podświetlenie przy braku ribbonu
- **Oświetlenie przy otwartych drzwiach** – ułatwia ładowanie
- 5 wskaźników LED statusu
- Złote punkty dotykowe oznaczające elementy obsługi
- Ruchomy czujnik mediów
- Regulacja docisku i pozycji głowicy (toggles)
- Obsługa języków ZPL i ZPL II
- Opcjonalny obcinacz
- Opcjonalny nawijak/dispenser (Rewind)
- Opcjonalny enkoder RFID (ZT620R)
- Near Field Communication (NFC) / Print Touch
- Zebra Basic Interpreter (ZBI 2.0)

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZT620
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki (22,7-29,4 kg)
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron (ZT620 jest większy niż ZT610)
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

### Menu główne (Home Menu)

Z ekranu bezczynności naciśnij **LEFT SELECT** aby wejść do menu głównego z 8 ikonami:

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

---

## 4. Ładowanie materiałów eksploatacyjnych

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
| **PEEL-OFF** | Nawijak | Automatyczne odklejanie od podkładu |
| **REWIND** | Nawijak | Nawijanie całych etykiet na rolkę |
| **CUTTER** | Obcinacz | Automatyczne cięcie |
| **DELAYED CUT** | Obcinacz | Cięcie po komendzie ZPL (~JK) |
| **APPLICATOR** | Port aplikatora | Współpraca z aplikatorem etykiet |

### Ładowanie materiału (tryb Tear-Off)

> **Ostrzeżenie:** Głowica może być gorąca! Zdejmij biżuterię i metalowe przedmioty przed pracą przy otwartej głowicy.

1. **Podnieś drzwi komory mediów** – włączy się oświetlenie
2. **Otwórz głowicę** – obróć dźwignię w górę
3. **Odsuń prowadnicę materiału** – pokrętłem regulacyjnym na zewnątrz
4. **Włóż rolkę:**
   - Rolka: umieść na wrzecionie, dociśnij do tyłu
   - Fanfold: wprowadź przez tylny otwór lub od dołu
5. **Przeprowadź materiał:**
   - Od wrzeciona (1) pod zespołem tancerza (2)
   - Przez czujnik mediów (3)
   - Pod głowicą drukującą (4)
   - Materiał powinien dotykać tylnej ścianki czujnika
6. **Dosuń prowadnicę** pokrętłem do krawędzi materiału
7. **Zamknij głowicę** (dźwignia w dół)
8. Zamknij drzwi
9. Naciśnij **PAUSE** aby umożliwić drukowanie

### Ładowanie w trybie Peel-Off

1. Zainstaluj płytę nawijaka w pozycji peel-off
2. (Opcjonalnie) Załóż gilzę na wrzeciono nawijaka
3. Otwórz głowicę i przeprowadź materiał standardowo
4. Odklej ok. 50 cm etykiet od podkładu
5. Przeprowadź pusty podkład za płytę nawijaka
6. Zdejmij haczyk z wrzeciona nawijaka
7. Nawiń podkład na wrzeciono nawijaka
8. Załóż haczyk z powrotem
9. Dosuń prowadnicę, zamknij głowicę i drzwi

### Ładowanie w trybie Rewind

1. Zainstaluj płytę nawijaka w pozycji rewind (4 zatrzaski)
2. Załóż gilzę na wrzeciono nawijaka
3. Przeprowadź materiał standardowo przez czujnik i pod głowicę
4. Przeprowadź materiał NAD płytą nawijaka
5. Nawiń materiał na gilzę nawijaka
6. Dosuń prowadnicę, zamknij głowicę i drzwi

### Ładowanie w trybie Cutter

1. Przeprowadź materiał standardowo przez czujnik i pod głowicę
2. Przeprowadź materiał przez obcinacz
3. Zamknij głowicę i drzwi

> **Ostrzeżenie:** Ostrze obcinacza jest ostre! Nie dotykaj ostrza palcami.

---

## 5. Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** 

### Ribbon dla ZT620

Dla drukarki ZT620 należy stosować ribbon o szerokości odpowiedniej do szerokiego materiału 6":
- Maks. szerokość ribbonu: 178 mm (7")
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

---

## 6. Menu użytkownika

### SETTINGS Menu

| Pozycja | Opis | Wartości ZT620 |
|---------|------|----------------|
| **DARKNESS** | Ciemność druku | 0.0 – 30.0 |
| **PRINT SPEED** | Prędkość druku | 2-12 ips (203dpi), 2-8 ips (300dpi) |
| **MEDIA TYPE** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **PRINT METHOD** | Metoda druku | THERMAL TRANS, DIRECT THERMAL |
| **TEAR OFF** | Pozycja odrywania | -120 do +120 dots |
| **PRINT WIDTH** | Szerokość druku | Do 1344 (203dpi), 1984 (300dpi) |
| **PRINT MODE** | Tryb druku | TEAR OFF, PEEL-OFF, REWIND, CUTTER, DELAYED CUT, APPLICATOR |
| **LABEL TOP** | Offset pionowy | -120 do +120 dots |
| **LEFT POSITION** | Offset poziomy | -9999 do +9999 dots |
| **REPRINT MODE** | Tryb ponownego druku | ON, OFF |
| **LABEL LENGTH MAX** | Maks. długość etykiety | Do maksymalnej obsługiwanej |
| **COVER OPEN LIGHT** | Oświetlenie przy otwarciu | HIGH, MEDIUM, LOW, OFF |
| **MEDIA PATH LIGHTS** | Oświetlenie ścieżki mediów | HIGH, MEDIUM, LOW, OFF |
| **RIBBON PATH LIGHTS** | Oświetlenie ścieżki ribbonu | HIGH, MEDIUM, LOW, OFF |

### TOOLS Menu

| Pozycja | Opis |
|---------|------|
| **PRINT INFORMATION** | Drukuje etykiety konfiguracji |
| **IDLE DISPLAY** | Co pokazywać na ekranie bezczynności |
| **POWER UP ACTION** | Akcja przy włączeniu |
| **HEAD CLOSE ACTION** | Akcja przy zamknięciu głowicy |
| **LOAD DEFAULTS** | Przywracanie ustawień |
| **MEDIA/RIBBON CAL** | Kalibracja czujników |
| **DIAGNOSTIC MODE** | Tryb diagnostyczny |
| **ENERGY STAR** | Tryb oszczędzania energii |
| **CONFIG INFO TO USB** | Kopiowanie konfiguracji na USB |
| **ZBI ENABLED?** | Status Zebra Basic Interpreter |
| **PRINT USB FILE** | Drukowanie z pendrive |
| **COPY USB FILE TO E:** | Kopiowanie z USB do pamięci |
| **STORE E: FILE TO USB** | Kopiowanie z pamięci na USB |
| **PRINT STATION** | Drukowanie z klawiatury USB |

### NETWORK Menu

| Pozycja | Opis |
|---------|------|
| **ACTIVE PRINT SERVER** | Aktywny serwer druku |
| **PRIMARY NETWORK** | Sieć podstawowa (WIRED/WLAN) |
| **WIRED IP ADDRESS** | Adres IP (kablowy) |
| **WIRED SUBNET MASK** | Maska podsieci |
| **WIRED GATEWAY** | Brama domyślna |
| **WIRED IP PROTOCOL** | Protokół IP |
| **WLAN IP ADDRESS** | Adres IP (Wi-Fi) |
| **ESSID** | Nazwa sieci Wi-Fi |
| **RESET NETWORK** | Reset ustawień sieciowych |

### RFID Menu (tylko ZT620R)

| Pozycja | Opis |
|---------|------|
| **RFID STATUS** | Status enkodera RFID |
| **RFID CALIBRATE** | Kalibracja RFID |
| **READ RFID DATA** | Odczyt danych z tagu |
| **RFID TEST** | Test RFID |
| **RFID PROGRAM POS.** | Pozycja programowania |
| **RFID ANTENNA** | Wybór anteny |
| **RFID READ POWER** | Moc odczytu (0-30) |
| **RFID WRITE POWER** | Moc zapisu (0-30) |

---

## 7. Kalibracja

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

### Regulacja pozycji czujnika

Przesuń czujnik transmisyjny w poziomie za pomocą kółka regulacyjnego aby dopasować do pozycji przerw/nacięć na materiale.

---

## 8. Podłączenie do komputera

### Instalacja sterowników

> **Ważne:** Zainstaluj Zebra Setup Utilities PRZED podłączeniem drukarki!

1. Pobierz Zebra Setup Utilities: zebra.com/setup
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

---

## 9. Konserwacja

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

---

## 10. Rozwiązywanie problemów

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

---

## 11. Funkcje USB Host i NFC

### Drukowanie z pendrive

1. Włóż pendrive do portu USB Host
2. TOOLS > PRINT USB FILE
3. Wybierz plik do drukowania

### Print Station (klawiatura USB)

1. Podłącz klawiaturę USB
2. TOOLS > PRINT STATION
3. Wybierz format i wprowadź dane

### Near Field Communication (NFC)

Zbliż telefon z aplikacją Zebra Printer Setup Utility do logo NFC na drukarce.

---

## 12. Specyfikacje

### Wymiary i waga

| Model | Szerokość druku | Waga |
|-------|-----------------|------|
| ZT620 | 168 mm (6,6") | 22,7-29,4 kg |

### Zasilanie

- Napięcie: 100-240 VAC
- Częstotliwość: 50-60 Hz

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
