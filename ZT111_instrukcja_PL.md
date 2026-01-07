# Instrukcja obsługi drukarki Zebra ZT111

**Kompaktowa drukarka przemysłowa**

---

## 1. Podstawowe informacje

### O drukarce ZT111

Zebra ZT111 to kompaktowa drukarka przemysłowa zaprojektowana do pracy w wymagających środowiskach, takich jak magazyny i hale produkcyjne. Łączy wytrzymałą konstrukcję z prostotą obsługi, oferując druk termiczny bezpośredni lub termotransferowy w zależności od konfiguracji.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy / termiczny bezpośredni |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do 254 mm/s (10 cali/s) |
| Prędkość druku (300 dpi) | do 152 mm/s (6 cali/s) |
| Szerokość druku | do 104 mm (4,09 cala) |
| Maks. średnica rolki | 203 mm (8 cali) |
| Długość ribbonu | do 450 m |

### Złącza (w zależności od konfiguracji)

- USB 2.0 (standard)
- Ethernet 10/100 (RJ-45) – opcja
- Wi-Fi 802.11ac + Bluetooth – opcja
- RS-232 Serial – opcja

### Cechy charakterystyczne

- Kompaktowa konstrukcja przemysłowa
- Metalowa obudowa
- Kolorowe punkty dotykowe (złote) ułatwiające obsługę
- Prosty panel sterowania z 5 wskaźnikami LED i 3 przyciskami
- Obsługa języków ZPL i EPL
- Opcjonalny obcinacz lub dispenser etykiet
- Regulacja docisku głowicy
- Regulacja naprężenia ribbonu

---

## 2. Rozpakowanie i instalacja

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

---

## 3. Ładowanie materiałów eksploatacyjnych

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

### Ładowanie taśmy barwiącej (ribbonu)

> **Dotyczy tylko modeli z opcją Thermal Transfer**

#### Czy potrzebuję ribbonu?

- **Materiał termotransferowy** – wymaga ribbonu
- **Materiał termoczuły (Direct Thermal)** – nie wymaga ribbonu

**Test:** Przesuń szybko paznokciem po powierzchni materiału. Jeśli pojawi się czarny ślad – materiał jest termoczuły i nie wymaga ribbonu.

#### Rodzaj ribbonu

Drukarka ZT111 standardowo obsługuje ribbon powlekany na zewnątrz (coated outside). Dla ribbonu powlekanego wewnątrz wymagana jest opcjonalna gilza.

#### Procedura ładowania ribbonu:

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

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę przed zużyciem.

---

## 4. Podstawowa obsługa

### Panel sterowania

Drukarka ZT111 posiada prosty panel z 5 wskaźnikami LED i 3 przyciskami:

#### Wskaźniki LED:

| Wskaźnik | Znaczenie |
|----------|-----------|
| **STATUS** | Ogólny stan drukarki |
| **PAUSE** | Drukarka wstrzymana |
| **DATA** | Odbieranie/przetwarzanie danych |
| **SUPPLIES** | Stan materiałów (etykiety, ribbon) |
| **NETWORK** | Stan połączenia sieciowego |

#### Przyciski:

| Przycisk | Funkcja |
|----------|---------|
| **PAUSE** | Wstrzymanie/wznowienie druku |
| **FEED** | Wysuw jednej etykiety |
| **CANCEL** | Anulowanie zadań (1x = następna etykieta, 2 sek. = wszystkie) |

### Druk testowy (etykieta konfiguracji)

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **FEED + CANCEL**
3. Włącz drukarkę trzymając oba przyciski
4. Zwolnij gdy pierwszy wskaźnik zgaśnie
5. Drukarka wydrukuje etykietę konfiguracji i etykietę sieci

### Ustawienia druku

Podstawowe parametry druku można zmienić przez:
- Sterownik Windows (Printing Preferences)
- Zebra Setup Utilities
- Komendy ZPL/SGD
- Stronę WWW drukarki (przy połączeniu sieciowym)

| Parametr | Opis | Zakres |
|----------|------|--------|
| **Print Darkness** | Ciemność druku | 0.0 – 30.0 |
| **Print Speed** | Prędkość druku | 203 dpi: 2-10 ips, 300 dpi: 2-6 ips |
| **Media Type** | Typ materiału | CONTINUOUS, GAP/NOTCH, MARK |
| **Print Method** | Tryb druku | THERMAL TRANS, DIRECT THERMAL |
| **Tear-Off Position** | Pozycja odrywania | -120 do +120 |

---

## 5. Podłączenie do komputera

### Instalacja sterowników

> **Ważne:** Zainstaluj sterowniki PRZED podłączeniem drukarki do komputera!

1. Pobierz sterowniki ze strony zebra.com/zt111-info
2. Uruchom instalator i postępuj zgodnie z instrukcjami
3. Podłącz drukarkę gdy kreator o to poprosi

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
4. Drukarka automatycznie pobierze adres IP z DHCP
5. Wydrukuj etykietę konfiguracji aby sprawdzić adres IP
6. Uruchom kreator instalacji drukarki i wybierz połączenie sieciowe

### Połączenie Wi-Fi

1. Uruchom Zebra Printer Setup Utility na telefonie lub komputerze
2. Wyszukaj drukarkę przez Bluetooth
3. Skonfiguruj połączenie Wi-Fi przez kreatora
4. Po połączeniu drukarka będzie dostępna w sieci bezprzewodowej

---

## 6. Kalibracja i regulacja

### Kalibracja czujników (Auto Calibration)

Automatyczna kalibracja czujników materiału i ribbonu:

1. Upewnij się, że materiał i ribbon (jeśli używany) są załadowane
2. Zamknij głowicę
3. Naciśnij i przytrzymaj **PAUSE + FEED** przez 2 sekundy
4. Drukarka przeprowadzi kalibrację i wysunie kilka etykiet

### Kalibracja ręczna

Dla trudnych materiałów może być wymagana kalibracja ręczna:

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **PAUSE + CANCEL**
3. Włącz drukarkę trzymając przyciski
4. Postępuj zgodnie z instrukcjami na wydrukowanych etykietach

### Regulacja docisku głowicy

Docisk głowicy wpływa na jakość druku. Drukarka ma dwie pokrętła regulacji docisku na belce dociskowej:

- **Równomierny docisk:** oba pokrętła na tej samej wartości
- **Nierównomierny druk:** dostosuj pokrętło po stronie z gorszą jakością

> **Uwaga:** Zwiększaj docisk stopniowo. Zbyt wysoki docisk może uszkodzić głowicę.

### Regulacja naprężenia ribbonu

Jeśli ribbon marszczy się lub źle nawija:

1. Znajdź pokrętło regulacji naprężenia ribbonu
2. Obróć w kierunku "+" aby zwiększyć naprężenie
3. Obróć w kierunku "-" aby zmniejszyć naprężenie

---

## 7. Konserwacja i czyszczenie

### Harmonogram czyszczenia

| Element | Częstotliwość (DT) | Częstotliwość (TT) |
|---------|--------------------|--------------------|
| Głowica drukująca | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Wałek dociskowy (platen) | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Czujniki materiału | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Czujnik ribbonu | - | Co 1 rolkę ribbonu |
| Ścieżka materiału | Co 1 rolkę materiału | Co 1 rolkę ribbonu |
| Obcinacz | W razie potrzeby | W razie potrzeby |

*DT = Direct Thermal, TT = Thermal Transfer*

### Potrzebne materiały

- Zestaw konserwacyjny Zebra (nr kat. 47362) lub:
- Ściereczki bezpyłowe
- Alkohol izopropylowy 99,7%
- Sprężone powietrze

### Czyszczenie głowicy i wałka dociskowego

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie. Uwaga na wyładowania elektrostatyczne – dotknij metalowej ramy drukarki przed czyszczeniem.

1. Otwórz pokrywę i zwolnij głowicę
2. Wyjmij ribbon (jeśli używany) i materiał
3. Przetrzyj brązowy pasek głowicy wacikiem nasączonym alkoholem (od jednego końca do drugiego)
4. Przetrzyj wałek dociskowy obracając go ręcznie
5. Poczekaj aż alkohol wyschnie
6. Załaduj materiał i ribbon, zamknij głowicę

### Czyszczenie czujników

1. Przedmuchaj czujniki sprężonym powietrzem
2. W razie potrzeby przetrzyj wacikiem z alkoholem

### Czyszczenie obcinacza

> **Ostrzeżenie:** Ostrze może spowodować skaleczenie! Zachowaj ostrożność.

1. Wyłącz drukarkę
2. Oczyść widoczne powierzchnie ostrza wacikiem z alkoholem
3. Nasmaruj osłonę ostrza smarem Zebra (!"LUBRICANT - G15382)

---

## 8. Rozwiązywanie problemów

### Znaczenie wskaźników LED

| STATUS | PAUSE | DATA | SUPPLIES | NETWORK | Znaczenie |
|--------|-------|------|----------|---------|-----------|
| Zielony | Wyłączony | Wyłączony | Wyłączony | - | Drukarka gotowa |
| Zielony | Żółty | - | - | - | Drukarka wstrzymana |
| - | - | Zielony | - | - | Transfer danych |
| Czerwony | - | - | Czerwony | - | Brak materiału |
| Czerwony | - | - | - | - | Otwarta głowica |

### Problemy z jakością druku

| Problem | Możliwe przyczyny | Rozwiązanie |
|---------|-------------------|-------------|
| Blade wydruki | Zbyt niska ciemność | Zwiększ Darkness |
| | Zużyta/brudna głowica | Wyczyść lub wymień głowicę |
| Przepalone wydruki | Zbyt wysoka ciemność | Zmniejsz Darkness |
| | Zbyt niska prędkość | Zwiększ prędkość |
| Puste obszary (void) | Brudna głowica | Wyczyść głowicę |
| | Uszkodzone elementy głowicy | Wymień głowicę |
| Marszczenie ribbonu | Zbyt niskie naprężenie | Zwiększ naprężenie ribbonu |
| | Nierówny docisk | Wyreguluj docisk głowicy |

### Problemy z materiałem

| Problem | Rozwiązanie |
|---------|-------------|
| Nieprawidłowa detekcja etykiet | Wykonaj kalibrację czujników |
| Materiał się zacina | Sprawdź prowadnice, wyczyść ścieżkę |
| Etykiety nie odklejają się (tryb Peel) | Sprawdź ustawienie dispensera |

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Brak połączenia Ethernet | Sprawdź kabel, wskaźniki na porcie RJ-45 |
| Brak adresu IP | Sprawdź serwer DHCP lub ustaw statyczny IP |
| Drukarka niedostępna | Wydrukuj etykietę konfiguracji, sprawdź adres IP |

### Test jakości kodów kreskowych

Drukarka może wydrukować serie etykiet testowych z różnymi ustawieniami ciemności:

1. Wyłącz drukarkę
2. Naciśnij i przytrzymaj **FEED**
3. Włącz drukarkę trzymając przycisk
4. Zwolnij gdy pierwszy wskaźnik zgaśnie
5. Oceń kody kreskowe na wydrukowanych etykietach

---

## 9. Wymiana komponentów

### Wymiana głowicy drukującej

Głowica drukująca jest elementem eksploatacyjnym i może wymagać wymiany. Używaj wyłącznie oryginalnych głowic Zebra.

### Wymiana wałka dociskowego

Zużyty wałek może powodować problemy z transportem materiału i jakością druku.

### Usuwanie zużytego ribbonu

1. Jeśli ribbon się skończył – przejdź do kroku 2
2. Jeśli nie – przetnij ribbon przed gilzą odbiorczą
3. Zsuń gilzę ze zużytym ribbonem z trzpienia
4. Wyrzuć zużyty ribbon
5. Pustą gilzę z trzpienia podającego przenieś na trzpień odbiorczy

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
