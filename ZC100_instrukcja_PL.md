# Instrukcja obsługi drukarki kart Zebra ZC100

**Jednostronna drukarka kart ID**

---

## 1. Podstawowe informacje

### O drukarce ZC100

Zebra ZC100 to kompaktowa jednostronna drukarka kart identyfikacyjnych, zaprojektowana do druku pełnokolorowego metodą sublimacji barwników (dye sublimation) lub monochromatycznego druku termotransferowego. Obsługuje standardowe karty PVC i PVC-composite w formatach CR70 (52×84 mm) i CR80 (54×86 mm) o grubości 10-40 mil. Drukarka wyposażona jest w podajnik na 100 kart oraz kasety z taśmą ze zintegrowanym wałkiem czyszczącym. ZC100 drukuje wyłącznie jednostronnie. Drukarka nie ma modułu obracania kart (flipper). Model ZC100 posiada intuicyjny panel LED do wskazywania statusu drukarki.

### Parametry techniczne

| Parametr | ZC100 |
|----------|-------|
| **Druk** | **Wyłącznie jednostronny** |
| Technologia druku | Sublimacja barwników / Termotransfer |
| Rozdzielczość | 300 dpi (11,8 punktów/mm) |
| Prędkość druku (YMCKO) | do 150 kart/godz. (kolor jednostronny) |
| Prędkość druku (K) | do 700 kart/godz. (mono jednostronny) |
| Formaty kart | CR80 (54×86 mm), CR70 (52×84 mm) |
| Grubość kart | 10-40 mil (0,25-1,02 mm) |
| Pojemność podajnika | 100 kart (30 mil) |
| Pojemność odbiornika | 100 kart (30 mil) |
| Pamięć flash | 2 GB |
| Zasilanie | 100W zasilacz zewnętrzny |

### Porównanie ZC100 vs ZC300

| Parametr | ZC100 | ZC300 |
|----------|-------|-------|
| Druk | **Wyłącznie jednostronny** | Jednostronny; dwustronny z modułem druku dwustronnego |
| Interfejs użytkownika | **Diody LED** | Kolorowy wyświetlacz LCD |
| Wyświetlacz | Brak | Kolorowy LCD z 3 przyciskami |
| Prędkość (YMCKO, jednostronnie) | 150 kart/h | 200 kart/h |
| Prędkość (mono, jednostronnie) | 700 kart/h | 900 kart/h |
| Menu pomocy | Brak | Animacje na LCD |
| Druk dwustronny | Brak | Opcja (moduł druku dwustronnego) |

### Złącza i komunikacja

| Interfejs | Opis |
|-----------|------|
| USB 2.0 | Połączenie bezpośrednie z PC |
| 10/100 Ethernet | Opcjonalne połączenie sieciowe (RJ-45) |
| Wi-Fi | Opcjonalne 802.11ac |
| NFC | Zebra Print Touch |

### Opcje fabryczne i rozszerzenia

- **Enkoder magnetyczny** – zapis ISO 7811 na 3 ścieżkach (HiCo/LoCo), tylko karty 30 mil
- **Ethernet 10/100** – połączenie sieciowe
- **Wi-Fi** – łączność bezprzewodowa 802.11ac

ZC100 nie ma opcji druku dwustronnego ani enkodera kart inteligentnych. Te opcje są dostępne w drukarce ZC300.

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZC100
- Zasilacz 100W z kablem sieciowym
- Kabel USB
- Dokumentacja startowa

**Ważne:** Zachowaj oryginalne opakowanie do ewentualnego transportu serwisowego.

### Podłączenie zasilania

1. Podłącz żeński wtyk kabla sieciowego do zasilacza
2. Podłącz wtyk zasilacza do gniazda z tyłu drukarki
3. Podłącz wtyk sieciowy do gniazdka elektrycznego
4. Naciśnij przycisk zasilania – dioda zaświeci się na zielono

**Uwaga:** Używaj wyłącznie zasilacza dostarczonego z drukarką (100W).

### Podłączenie USB

1. Podłącz wtyk USB typu B do gniazda z tyłu drukarki
2. Podłącz wtyk USB typu A do portu komputera
3. Sterownik zostanie zainstalowany automatycznie z Windows Update

### Podłączenie Ethernet

Ethernet w ZC100 jest opcją. Ta procedura dotyczy drukarek z interfejsem Ethernet.

1. Podłącz kabel Ethernet (RJ-45) do gniazda z tyłu drukarki
2. Podłącz drugi koniec do przełącznika sieciowego lub routera
3. Drukarka automatycznie uzyska adres IP przez DHCP

---

## 3. Ładowanie materiałów eksploatacyjnych

### Ładowanie kasety z taśmą

Każda kaseta Zebra ZC Series zawiera wbudowany wałek czyszczący i chip identyfikacyjny.

1. Otwórz górną pokrywę drukarki (przycisk z tyłu)
2. Usuń osłonę ochronną z wałka czyszczącego
3. Włóż kasetę w orientacji pokazanej na obudowie – kaseta pasuje tylko w jednej pozycji
4. Zamknij górną pokrywę

### Ładowanie kart

Orientacja kart zależy od ich typu:

| Typ karty | Orientacja |
|-----------|------------|
| Zwykłe karty PVC | Dowolna |
| Karty z paskiem magnetycznym | Pasek na dole, po prawej stronie |
| Karty kontaktowe (chip) | Chip do góry, w stronę tyłu drukarki |
| Karty zbliżeniowe | Dowolna |

1. Otwórz pokrywę podajnika wejściowego
2. Włóż stos kart (maks. 100 szt. przy 30 mil)
3. Zamknij pokrywę podajnika

### Podawanie ręczne

Drukarka posiada szczelinę podawania ręcznego poniżej podajnika głównego:

1. Wybierz podawanie ręczne w sterowniku drukarki
2. Gdy szczelina zaświeci się na zielono, włóż kartę w tej samej orientacji co karty w podajniku
3. Karta zostanie pobrana automatycznie i wydrukowana

---

## 4. Wskaźniki LED

ZC100 ma trzy trójkolorowe wskaźniki stanu: Card (karty), Ribbon (taśma) i Clean (czyszczenie). Dioda zasilania znajduje się w przycisku zasilania. Szczelina podawania ręcznego ma podświetlenie LED.

### Dioda zasilania (Power)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Uruchamianie |
| Świeci zielono | Drukarka gotowa |
| Świeci czerwono | Błąd krytyczny |

### Dioda kart (Card)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie/Kodowanie w toku |
| Świeci zielono | Karty dostępne |
| Miga czerwono | Zacięcie karty |
| Świeci czerwono | Brak kart |

### Dioda taśmy (Ribbon)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Drukowanie w toku |
| Świeci zielono | Taśma dostępna |
| Świeci bursztynowo | Niski poziom taśmy |
| Miga czerwono | Brak taśmy / Zacięcie / Zerwanie |
| Świeci czerwono | Nieprawidłowa taśma |

### Dioda czyszczenia (Clean)

| Stan diody | Znaczenie |
|------------|-----------|
| Miga zielono | Czyszczenie w toku |
| Świeci zielono | Czyszczenie zakończone |
| Świeci bursztynowo | Wymagane czyszczenie |
| Świeci czerwono | Błąd czyszczenia |

### Dioda podawania ręcznego (Manual Feed)

| Stan diody | Znaczenie |
|------------|-----------|
| Świeci zielono | Gotowy na kartę / kartę czyszczącą |
| Świeci czerwono | Błąd wkładania karty |

---

## 5. Drukowanie

### Drukowanie karty testowej

1. Upewnij się, że drukarka jest włączona i gotowa
2. Otwórz panel sterowania sterownika drukarki na komputerze
3. Przejdź do zakładki **Help & Support**
4. Wybierz **Print Test Card**
5. Karta testowa zostanie wydrukowana

### Instalacja sterownika

Sterownik instaluje się automatycznie z usługi Windows Update po podłączeniu drukarki przez USB.

Aby zainstalować sterownik ręcznie:
1. Pobierz sterownik ze strony www.zebra.com/zc100-info
2. Uruchom plik instalacyjny
3. Postępuj zgodnie z instrukcjami na ekranie

---

## 6. Konserwacja i czyszczenie

### Kiedy czyścić drukarkę

Dioda czyszczenia świecąca na bursztynowo sygnalizuje konieczność wyczyszczenia drukarki. Regularne czyszczenie zapewnia wysoką jakość druku i wydłuża żywotność głowicy drukującej.

### Czyszczenie ze sterownika

1. Otwórz **Printing Preferences** drukarki
2. Przejdź do zakładki **Help & Support**
3. W sekcji **Cleaning** kliknij **Clean Now**
4. Włóż kartę czyszczącą gdy szczelina zaświeci się na zielono
5. Poczekaj na zakończenie cyklu czyszczenia

### Czyszczenie głowicy drukującej

Do usunięcia uporczywych zabrudzeń użyj patyczków nasączonych alkoholem:

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementów grzejnych głowicy (ruch w lewo-prawo)
4. Odczekaj 2-3 minuty przed włączeniem drukarki

**Uwaga:** Nigdy nie używaj ostrych narzędzi do czyszczenia głowicy – spowoduje to trwałe uszkodzenie!

### Czyszczenie enkodera magnetycznego

1. Wyłącz drukarkę
2. Otwórz górną pokrywę
3. Przesuń wilgotny patyczek wzdłuż elementu enkodera
4. Odczekaj 2-3 minuty przed włączeniem drukarki

---

## 7. Rozwiązywanie problemów

### Zacięcie karty

Zacięcie występuje, gdy karta nie dociera do czujnika lub blokuje czujnik niespodziewanie.

**Usuwanie zacięcia:**
1. Otwórz górną pokrywę drukarki
2. Wyjmij kasetę z taśmą
3. Obróć kółko ręcznego posuwu w kierunku przodu drukarki, aż karta wysunie się z mechanizmu
4. Włóż kasetę z powrotem i zamknij pokrywę

**Uwaga:** Nie używaj narzędzi do usuwania zaciętych kart – unieważni to gwarancję!

### Karta odrzucona

Gdy podczas druku wystąpi błąd, drukarka odrzuca kartę. W ZC100 karta odrzucona trafia do odbiornika kart. Należy zdjąć kartę z wierzchu stosu w odbiorniku. ZC100 nie ma pojemnika na karty odrzucone. Ten pojemnik mają tylko drukarki ZC300 i ZC350 z modułem druku dwustronnego.

### Problemy z jakością druku

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| Plamy, plamki | Zanieczyszczenia | Wymień wałek czyszczący, wyczyść drukarkę |
| Przesunięty obraz | Błąd pozycjonowania | Użyj regulacji Print Position w sterowniku |
| Smugi kolorów | Pomarszczona taśma | Skontaktuj się z serwisem |
| Nieostre kolory | Złe wyodrębnienie czerni | Sprawdź ustawienia K Extraction |
| Niedokładność kolorów | Brak kalibracji | Użyj Color Optimization lub profilu ICC |

### Wskaźniki Ethernet

**Pomarańczowa dioda (prędkość połączenia):**
- Wyłączona – brak połączenia
- 1 mrugnięcie – połączenie 10Base
- 2 mrugnięcia – połączenie 100Base

**Zielona dioda (aktywność):**
- Wyłączona – brak połączenia
- Świeci – połączenie aktywne
- Miga – transmisja danych

---

## 8. Opcje i rozszerzenia

### Enkoder magnetyczny

Enkoder koduje tylko karty o grubości 30 mil. Karty z paskiem magnetycznym należy wkładać paskiem w dół. Enkoder obsługuje standardowy format ISO 7811 na 3 ścieżkach:

| Ścieżka | Gęstość | Bitów/znak | Maks. znaków | Format |
|---------|---------|------------|--------------|--------|
| 1 | 210 BPI | 7 | 76 | IATA (alfanumeryczny) |
| 2 | 75 BPI | 5 | 37 | ABA (numeryczny) |
| 3 | 210 BPI | 5 | 104 | THRIFT (numeryczny) |

### Karty inteligentne

ZC100 nie ma opcji enkodera kart inteligentnych (stykowych ani zbliżeniowych). Kodowanie kart inteligentnych jest dostępne w drukarce ZC300.

### Wi-Fi (opcja)

- Standard: IEEE 802.11ac
- Konfiguracja: w sterowniku drukarki
- Bezpieczeństwo: WEP, WPA/WPA2
- Szyfrowanie: RC4, TKIP, CCMP (AES)

---

## 9. Dane techniczne

### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Szerokość | 157 mm |
| Głębokość | 383 mm |
| Wysokość | 258 mm |
| Waga | 3,9 kg |

### Warunki pracy

| Parametr | Wartość |
|----------|---------|
| Temperatura pracy | 15°C – 35°C |
| Wilgotność | 20% – 80% RH (bez kondensacji) |
| Temperatura przechowywania | -5°C – 70°C |

### Certyfikaty

- FCC Class A
- CE
- IC
- UL/cUL Listed

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.1 | Data: październik 2026*
