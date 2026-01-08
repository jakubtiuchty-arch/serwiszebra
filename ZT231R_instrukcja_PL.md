# Instrukcja obsługi drukarki Zebra ZT231R

**Drukarka przemysłowa z kolorowym wyświetlaczem dotykowym i wbudowanym enkoderem RFID**

---

## 1. Podstawowe informacje

### O drukarce ZT231R

Zebra ZT231R to przemysłowa drukarka etykiet z **wbudowanym enkoderem RFID UHF**. Model ten łączy wszystkie funkcje standardowej drukarki ZT231 (kolorowy wyświetlacz dotykowy, kreatory konfiguracji) z możliwością programowania tagów RFID podczas drukowania etykiet. Idealna do zastosowań wymagających jednoczesnego druku i kodowania RFID – logistyka, zarządzanie magazynem, śledzenie aktywów.

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
| **RFID** | **Wbudowany enkoder UHF EPC Gen2 V2** |
| **Pasma RFID** | **EU 865-868 MHz, US 902-928 MHz** |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- RS-232 Serial (opcja)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11a/b/g/n/ac + Bluetooth – opcja
- USB Host (do podłączenia klawiatury, skanera, pendrive)

### Cechy charakterystyczne

- **Wbudowany enkoder RFID UHF** – programowanie tagów podczas druku
- **Kolorowy wyświetlacz dotykowy** z intuicyjnym interfejsem
- Kreatory konfiguracji (w tym **RFID Wizard**)
- Antena RFID z wieloma elementami (A1-A4, B1-B4)
- Regulowana moc odczytu i zapisu RFID
- Automatyczna kalibracja pozycji tagu RFID
- Metalowa konstrukcja przemysłowa
- 5 wskaźników LED statusu
- Obsługa języków ZPL i ZPL II
- Zgodność z EPC Class 1 Gen2 i EPC Gen 2 V2

---

## 2. Specyfikacja RFID

### Obsługiwane standardy

| Standard | Opis |
|----------|------|
| **EPC Class 1 Gen2** | Podstawowy standard UHF RFID |
| **EPC Gen 2 V2** | Rozszerzony standard z dodatkowymi funkcjami |
| **ISO 18000-6C** | Międzynarodowy standard UHF |

### Parametry techniczne RFID

| Parametr | Wartość |
|----------|---------|
| Pasmo EU | 865-868 MHz |
| Pasmo US | 902-928 MHz |
| Moc odczytu | 0-30 (regulowana) |
| Moc zapisu | 0-30 (regulowana) |
| Elementy anteny | A1, A2, A3, A4, B1, B2, B3, B4 |
| Pozycja programowania | Regulowana (F0-Fxxx lub B0-B30) |

### Typy obsługiwanych tagów RFID

- Tagi z chipami zgodne z EPC Gen2
- Smart labels (etykiety z wbudowanym chipem RFID)
- Tagi na różnych materiałach (papier, folia, PET)
- Tagi o różnych rozmiarach i pozycjach inlay

---

## 3. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZT231R
- Kabel zasilający
- Kabel USB
- Pusta gilza do odbierania ribbonu (wersja TT)
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- **Powierzchnia:** płaska, stabilna, zdolna utrzymać ciężar drukarki
- **Przestrzeń:** zapewnij wentylację ze wszystkich stron
- **Zasilanie:** w pobliżu łatwo dostępnego gniazdka
- **Komunikacja:** w zasięgu sieci lub kabli komunikacyjnych
- **RFID:** unikaj zakłóceń od innych urządzeń RFID w pobliżu

> **Uwaga:** Nie umieszczaj materiałów tłumiących pod drukarką – ogranicza to przepływ powietrza i może prowadzić do przegrzania.

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Thermal Transfer | 5°C – 40°C | 20-85% bez kondensacji |
| Direct Thermal | 0°C – 40°C | 20-85% bez kondensacji |

---

## 4. Kolorowy wyświetlacz dotykowy

### Ekran główny (Home Screen)

Ekran główny wyświetla aktualny status drukarki i umożliwia dostęp do wszystkich funkcji, w tym statusu RFID.

**Kolory tła ekranu:**
- **Zielony** – drukarka gotowa
- **Żółty** – ostrzeżenie (alert)
- **Czerwony** – błąd wymagający interwencji

### Elementy ekranu głównego

| Element | Funkcja |
|---------|---------|
| **Menu** | Dostęp do wszystkich ustawień (w tym RFID) |
| **Wizards** | Kreatory konfiguracji (w tym RFID Wizard) |
| **Shortcuts** | Skróty do ulubionych pozycji |
| **Printer Info** | Informacje o drukarce i statusie RFID |

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
| **CANCEL** | Anulowanie zadań druku |

---

## 5. Ładowanie materiałów RFID

### Materiały RFID (Smart Labels)

Smart labels to etykiety z wbudowanym chipem RFID (inlay). Przy ładowaniu materiałów RFID należy zwrócić uwagę na:

- **Pozycję inlay** – chip musi znajdować się w odpowiednim miejscu względem anteny
- **Kierunek podawania** – zgodnie ze specyfikacją materiału
- **Odstępy między tagami** – zapewniające indywidualne programowanie

### Procedura ładowania materiału RFID

1. Otwórz drzwi komory mediów
2. Obróć dźwignię głowicy w górę (zwolnij głowicę)
3. **Odsuń prowadnicę materiału**
4. **Włóż rolkę smart labels:**
   - Umieść na wieszaku, dociśnij do tyłu
   - Upewnij się, że materiał jest prawidłowo zorientowany
5. Podnieś prowadnicę i dosuń do krawędzi rolki
6. **Przeprowadź materiał:**
   - Przez szczelinę czujnika transmisyjnego
   - Pod wewnętrzną prowadnicą
   - Materiał powinien przechodzić nad anteną RFID
7. Dosuń zewnętrzną prowadnicę do krawędzi materiału
8. **Zamknij głowicę**
9. Zamknij drzwi
10. **Przeprowadź kalibrację RFID** (patrz sekcja 7)

### Ribbon dla materiałów RFID

> **Uwaga:** Użycie ribbonu nie wpływa na działanie RFID. Wybierz ribbon odpowiedni dla drukowanego materiału (TT lub DT).

---

## 6. Menu RFID

Dostęp: **Menu > RFID**

### RFID Status

Wyświetla aktualny stan podsystemu RFID:
- Stan połączenia z enkoderem
- Ostatni błąd RFID
- Liczniki tagów

**Komendy ZPL:** ^HL lub ~HL  
**SGD:** rfid.error.response

### RFID Test

Testuje odczyt i zapis do tagu RFID bez przesuwania materiału:

1. Umieść etykietę z tagiem nad anteną RFID
2. Dotknij **Start**
3. Wynik testu pojawi się na ekranie

**SGD:** rfid.tag.test.content, rfid.tag.test.execute

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

> **Ważne:** Pozostaw kilka etykiet przed i za kalibrowanym tagiem. Pozwól, aby materiał wystawał z przodu drukarki (dla backfeed).

**Komenda ZPL:** ^HR  
**SGD:** rfid.tag.calibrate

### Read Power (Moc odczytu)

Ręczne ustawienie mocy odczytu RFID (jeśli kalibracja automatyczna nie dała optymalnych wyników):

**Zakres:** 0-30  
**Komenda ZPL:** ^RW  
**SGD:** rfid.reader_1.power.read

### RFID Write Power (Moc zapisu)

Ręczne ustawienie mocy zapisu RFID:

**Zakres:** 0-30  
**Komenda ZPL:** ^RW  
**SGD:** rfid.reader_1.power.write

### RFID Antenna (Element anteny)

Wybór elementu anteny do programowania:

**Dostępne elementy:** A1, A2, A3, A4, B1, B2, B3, B4  
**Komenda ZPL:** ^RW  
**SGD:** rfid.reader_1.antenna_port

### RFID Valid Count

Wyświetla i resetuje licznik poprawnie zaprogramowanych tagów:

**SGD:** odometer.rfid.valid_resettable  
**Komenda ZPL:** ~RO

### RFID Void Count

Wyświetla i resetuje licznik uszkodzonych/nieudanych tagów:

**SGD:** odometer.rfid.void_resettable  
**Komenda ZPL:** ~RO

### RFID Program Position (Pozycja programowania)

Ręczne ustawienie pozycji programowania tagu:

| Wartość | Opis |
|---------|------|
| F0-Fxxx | Przesunięcie do przodu (xxx = mm lub max 999) |
| B0-B30 | Przesunięcie do tyłu (backfeed) |

**Komenda ZPL:** ^RS  
**SGD:** rfid.position.program

### Read RFID Data

Odczyt danych z tagu RFID bez przesuwania materiału:

1. Umieść etykietę z tagiem nad anteną
2. Dotknij **Read RFID Data**
3. Dane z tagu wyświetlą się na ekranie

**Komenda ZPL:** ^RF  
**SGD:** rfid.tag.read.content, rfid.tag.read.execute

---

## 7. Kalibracja RFID

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

---

## 8. Kreatory konfiguracji (Wizards)

### RFID Wizard

Dedykowany kreator dla konfiguracji RFID:

1. Dotknij **Wizards > RFID**
2. Postępuj zgodnie z instrukcjami na ekranie:
   - Załaduj materiał RFID
   - Wykonaj kalibrację mediów
   - Wykonaj kalibrację RFID
   - Przetestuj programowanie tagu

### Pozostałe kreatory

| Kreator | Funkcja |
|---------|---------|
| **Set All Wizard** | Uruchamia wszystkie kreatory (w tym RFID) |
| **System Wizard** | Ustawienia systemowe |
| **Connection Wizard** | Konfiguracja połączeń sieciowych |
| **Print Wizard** | Konfiguracja parametrów druku |

---

## 9. Programowanie RFID z poziomu ZPL

### Podstawowe komendy RFID

| Komenda | Funkcja |
|---------|---------|
| **^RF** | Odczyt danych z tagu |
| **^RM** | Włączenie trybu RFID Mirror |
| **^RN** | Włączenie trybu RFID bez VOID |
| **^RR** | Odczyt tagu i zwrot do hosta |
| **^RT** | Tryb testowy RFID |
| **^RW** | Ustawienie parametrów RFID (moc, antena) |
| **^RS** | Konfiguracja RFID (pozycja, próby) |
| **^HR** | Kalibracja tagu RFID |
| **^HL** | Status RFID |

### Przykładowy format etykiety z RFID

```zpl
^XA
^RS8,0,0,1,N,10,3,5000,5000
^RFW,H^FD1234567890ABCDEF^FS
^FO50,50^A0N,30,30^FDProdukt ABC^FS
^FO50,100^BY2^BCN,100,Y,N,N^FD123456789^FS
^XZ
```

**Objaśnienie:**
- ^RS – konfiguracja RFID (antena, moc, próby)
- ^RFW,H – zapis danych hex do tagu
- ^FD – dane do zapisania

### Obsługa błędów RFID

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| RFID ERROR | Błąd komunikacji z tagiem | Sprawdź pozycję tagu, wykonaj kalibrację |
| VOID TAG | Tag uszkodzony lub brak tagu | Wymień etykietę |
| WRITE FAILED | Błąd zapisu | Zwiększ moc zapisu, sprawdź tag |

---

## 10. Ładowanie ribbonu

> **Dotyczy tylko trybu Thermal Transfer.** Sprawdź czy materiał wymaga ribbonu.

### Procedura ładowania ribbonu

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

---

## 11. Konserwacja

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 1 rolkę ribbonu / materiału DT |
| Wałek dociskowy | Co 1 rolkę ribbonu / materiału DT |
| Czujniki | Co 1 rolkę |
| Antena RFID | W razie problemów z programowaniem |

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

---

## 12. Rozwiązywanie problemów RFID

### Typowe problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| **Brak programowania tagów** | Nieprawidłowa pozycja tagu | Wykonaj kalibrację RFID |
| **Częste VOID** | Za niska moc zapisu | Zwiększ RFID Write Power |
| **Nieczytelne tagi** | Za niska moc odczytu | Zwiększ RFID Read Power |
| **Programowanie sąsiedniego tagu** | Za wysoka moc | Zmniejsz moc, zmień antenę |
| **Sporadyczne błędy** | Zakłócenia | Sprawdź otoczenie, oddal inne urządzenia RFID |
| **Wszystkie tagi VOID** | Uszkodzony materiał | Sprawdź inną partię etykiet |

### Sprawdzanie statusu RFID

1. **Menu > RFID > RFID Status** – wyświetla aktualny stan
2. **Menu > RFID > RFID Test** – test pojedynczego tagu
3. **Menu > RFID > Read RFID Data** – odczyt danych z tagu

### Diagnostyka z wykorzystaniem ZPL

Wyślij do drukarki:
```
~HL
```

Drukarka zwróci status podsystemu RFID.

### Druk etykiety konfiguracji RFID

**Menu > System > Settings > Print: System Settings**

Etykieta konfiguracji zawiera aktualne ustawienia RFID:
- Moc odczytu/zapisu
- Wybrany element anteny
- Pozycja programowania
- Liczniki tagów

---

## 13. Komunikaty na wyświetlaczu

### Komunikaty ogólne

| Komunikat | Rozwiązanie |
|-----------|-------------|
| **PAPER OUT** | Załaduj materiał |
| **RIBBON OUT** | Załaduj ribbon |
| **HEAD OPEN** | Zamknij głowicę |
| **HEAD OVER TEMP** | Poczekaj na ostygnięcie |
| **HEAD UNDER TEMP** | Przenieś w cieplejsze miejsce |

### Komunikaty RFID

| Komunikat | Znaczenie | Rozwiązanie |
|-----------|-----------|-------------|
| **RFID ERROR** | Błąd podsystemu RFID | Sprawdź materiał, wykonaj kalibrację |
| **VOID TAG** | Tag uszkodzony | Etykieta zostanie oznaczona jako VOID |
| **RFID WRITE ERROR** | Błąd zapisu | Zwiększ moc, sprawdź pozycję |
| **RFID READ ERROR** | Błąd odczytu | Zwiększ moc odczytu |

---

## 14. Podłączenie do komputera

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki!

1. Pobierz sterowniki: zebra.com/drivers
2. Uruchom instalator
3. Wybierz model ZT231R
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

### Połączenie Wi-Fi

1. Połącz się najpierw przez USB lub Ethernet
2. Skonfiguruj ESSID: **Menu > Connection > Wi-Fi > ESSID**
3. Ustaw zabezpieczenia
4. Wykonaj reset sieci

---

## 15. Tryb chroniony (Protected Mode) i EU RED

### Drukarki zakupione w UE po 1 sierpnia 2025

Drukarki sprzedawane w EMEA od 08/2025 mają włączone dodatkowe zabezpieczenia zgodne z **dyrektywą EU RED**:

1. Przed konfiguracją musisz ustawić **hasło Protected Mode**
2. Musisz ustawić **PIN do panelu**
3. Niektóre usługi sieciowe są domyślnie wyłączone

Szczegóły: zebra.com/asr lub **PrintSecure Printer Administration Guide**

---

## 16. Specyfikacja materiałów RFID

### Wymagania dla smart labels

| Parametr | Wymaganie |
|----------|-----------|
| Zgodność chipa | EPC Class 1 Gen2 / Gen 2 V2 |
| Pozycja inlay | Zgodna ze specyfikacją drukarki |
| Odległość między tagami | Min. zalecana przez producenta |
| Orientacja | Zgodna z kierunkiem podawania |

### Zalecane materiały

Zebra oferuje szeroki wybór smart labels zoptymalizowanych dla drukarek ZT231R. Skontaktuj się z autoryzowanym dystrybutorem Zebra po szczegóły: zebra.com/supplies

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
