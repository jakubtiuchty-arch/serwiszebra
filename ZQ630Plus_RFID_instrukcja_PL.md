# Instrukcja RFID dla drukarki Zebra ZQ630 Plus

**Kodowanie i drukowanie inteligentnych etykiet RFID**

---

## 1. Wprowadzenie do RFID

### Czym jest RFID?

RFID (Radio Frequency Identification) to technologia bezprzewodowej identyfikacji obiektów za pomocą fal radiowych. Drukarka ZQ630 Plus z opcjonalnym modułem RFID może **kodować (zapisywać)** informacje na ultracienkich transponderach UHF RFID wbudowanych w inteligentne etykiety, jednocześnie **drukując** kody kreskowe, grafikę i tekst na powierzchni etykiety.

### Zalety etykiet RFID

- **Odczyt bez linii wzroku** – nie wymaga bezpośredniej widoczności jak kody kreskowe
- **Masowy odczyt** – jednoczesny odczyt wielu tagów
- **Większa pojemność danych** – więcej informacji niż kod kreskowy
- **Możliwość zapisu** – dane można aktualizować
- **Trwałość** – odporność na zabrudzenia i uszkodzenia
- **Bezpieczeństwo** – możliwość szyfrowania danych

### Budowa etykiety RFID

Etykieta RFID (smart label) składa się z:

| Element | Opis |
|---------|------|
| **Transponder (inlay)** | Antena + chip IC wbudowane w etykietę |
| **Antena** | Odbiera i wysyła sygnały radiowe |
| **Chip IC** | Zawiera pamięć i logikę sterującą |
| **Warstwa drukowa** | Powierzchnia do druku termicznego |
| **Podkład (liner)** | Warstwa ochronna z tyłu |

> **Wskazówka:** Patrząc na etykietę pod światło, można zobaczyć antenę transpondera. Wybrzuszenie wskazuje lokalizację chipu IC.

---

## 2. Obsługiwane standardy RFID

### EPC Generation 2 Class 1 UHF

ZQ630 Plus obsługuje standard **EPC Gen 2 Class 1** – najpopularniejszy standard pasywnych tagów RFID UHF:

| Parametr | Wartość |
|----------|---------|
| Częstotliwość | UHF (860-960 MHz) |
| Standard | EPC Global Gen 2 |
| Protokół | ISO 18000-6C |
| Typ taga | Pasywny (zasilany polem RF) |
| Identyfikator EPC | 96-bit (standardowy) |
| Pamięć TID | Identyfikator producenta i modelu |
| Pamięć użytkownika | Zależna od modelu taga |

### Struktura pamięci taga Gen 2

| Bank pamięci | Zawartość | Opis |
|--------------|-----------|------|
| **Bank 0 (Reserved)** | Kill Password, Access Password | Hasła zabezpieczające |
| **Bank 1 (EPC)** | CRC, PC, EPC | Główny identyfikator produktu |
| **Bank 2 (TID)** | Tag ID | Unikalny ID producenta (tylko odczyt) |
| **Bank 3 (User)** | Dane użytkownika | Opcjonalna pamięć na dane |

### Zalety tagów Gen 2

- **Większa pojemność** – 96-bit EPC vs 64-bit w starszych tagach
- **Szybszy odczyt** – do 1000 tagów/sekundę
- **Lepsza ochrona** – szyfrowanie i hasła dostępu
- **Globalna kompatybilność** – jeden standard na całym świecie
- **Pamięć TID** – identyfikacja producenta i modelu chipa

---

## 3. Wymagania materiałowe

### Materiały RFID Zebra

> **Ważne:** Dla optymalnych wyników używaj wyłącznie materiałów RFID Zebra. Materiały innych producentów mogą nie przejść kalibracji RFID lub powodować niestabilne kodowanie.

### Specyfikacja materiałów RFID dla ZQ630 Plus

| Parametr | Wartość |
|----------|---------|
| Szerokość materiału | 50,8-111 mm (2-4,4") |
| Długość etykiety | 12,7-812,8 mm (0,5-32") |
| Maks. średnica rolki | 66,8 mm (2,6") |
| Średnica gilzy | 19 mm lub 35 mm |
| Grubość | 0,081-0,190 mm |

### Popularne materiały RFID Zebra

| Materiał | Zastosowanie |
|----------|--------------|
| **Z-Select 4000T** | Ogólne zastosowania, trwałe etykiety |
| **Z-Perform 1500T** | Ekonomiczne etykiety RFID |
| **PolyPro 3000T** | Odporne na wilgoć i chemikalia |
| **Z-Ultimate 3000T** | Ekstremalne warunki, metal |

### Przechowywanie materiałów RFID

- Temperatura: 15-25°C (59-77°F)
- Wilgotność: 40-60% RH
- Z dala od źródeł pól elektromagnetycznych
- W oryginalnym opakowaniu do momentu użycia
- Maksymalny czas przechowywania: 2 lata

---

## 4. Ładowanie materiału RFID

### Procedura ładowania

1. **Naciśnij przycisk zwalniający** z boku drukarki
2. **Odchyl pokrywę mediów** do tyłu
3. **Rozsuń dyski podtrzymujące**
4. **Włóż rolkę RFID** między dyski (strona do druku na zewnątrz)
5. **Przeprowadź materiał** pod wałkiem dociskowym
6. **Zamknij pokrywę** – zatrzaśnij na miejscu
7. **Wykonaj kalibrację RFID** (patrz rozdział 5)

### Orientacja materiału

```
    ┌─────────────────────┐
    │   STRONA DO DRUKU   │  ← Na zewnątrz
    │  ┌───────────────┐  │
    │  │   TRANSPONDER │  │  ← Wewnątrz rolki
    │  │      (IC)     │  │
    │  └───────────────┘  │
    │      PODKŁAD        │
    └─────────────────────┘
```

> **Uwaga:** Nie usuwaj etykiet z podkładu przed kalibracja. Drukarka potrzebuje pełnych etykiet do określenia parametrów RFID.

---

## 5. Kalibracja RFID

### Kiedy wykonać kalibrację?

Kalibrację RFID należy wykonać:

- ✅ Po załadowaniu **nowego typu** materiału RFID
- ✅ Po zmianie **rozmiaru** etykiet RFID
- ✅ Po zmianie **producenta** tagów RFID
- ✅ Po **resecie fabrycznym** drukarki
- ✅ Gdy występują **błędy kodowania**

Kalibracji **nie trzeba** wykonywać:

- ❌ Przy wymianie rolki **tego samego** materiału
- ❌ Po włączeniu/wyłączeniu drukarki
- ❌ Po zmianie ustawień druku (ciemność, prędkość)

### Procedura kalibracji RFID

**Krok 1: Kalibracja długości etykiety**

Przed kalibracją RFID wykonaj kalibrację mediów:

1. Załaduj materiał RFID
2. Wejdź do menu: **TOOLS > Label Length Cal**
3. Naciśnij **OK** – drukarka wysuwa kilka etykiet
4. Poczekaj na komunikat "Calibration Complete"

**Krok 2: Kalibracja RFID**

1. Naciśnij **FEED** aby wysunąć jedną etykietę
2. Wejdź do menu: **HOME > RFID**
3. Użyj strzałek aby wybrać **RFID CALIBRATE**
4. Naciśnij **OK** aby rozpocząć

**Krok 3: Proces kalibracji**

Podczas kalibracji drukarka:
- Wolno wysuwa etykietę RFID
- Automatycznie dostosowuje pozycję programowania
- Określa optymalną moc odczytu/zapisu
- Testuje kodowanie na kilku etykietach

**Krok 4: Zakończenie**

- Po pomyślnej kalibracji: wyświetli się **"READY"**
- Usuń ewentualne testowe etykiety
- Drukarka jest gotowa do pracy

### Rozwiązywanie problemów z kalibracją

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| Kalibracja nie kończy się | Uszkodzony materiał | Wymień rolkę RFID |
| Błąd "RFID Error" | Niekompatybilny tag | Użyj materiałów Zebra |
| Niestabilne wyniki | Zakłócenia RF | Oddal od źródeł EMI |
| Słaby odczyt | Zła orientacja | Sprawdź ułożenie materiału |

---

## 6. Menu RFID

### Dostęp do menu RFID

1. Z ekranu głównego naciśnij **LEFT SELECT** (Home)
2. Użyj strzałek nawigacyjnych aby wybrać ikonę **RFID**
3. Naciśnij **OK** aby wejść

### Opcje menu RFID

| Opcja | Opis | Wartości |
|-------|------|----------|
| **RFID Status** | Aktualny status podsystemu RFID | Ready / Error / Not Present |
| **RFID Calibrate** | Uruchamia kalibrację RFID | Execute |
| **Read RFID Data** | Odczytuje dane z taga w pozycji druku | Execute |
| **RFID Test** | Testuje odczyt i zapis taga | Pass / Fail |
| **RFID Programming Position** | Pozycja programowania (mm od krawędzi) | -120 do +120 |
| **RFID Read Power** | Moc odczytu w dBm | 5-30 dBm |
| **RFID Write Power** | Moc zapisu w dBm | 5-30 dBm |
| **RFID Valid Count** | Licznik poprawnie zakodowanych etykiet | 0-999999 |
| **RFID Void Count** | Licznik unieważnionych etykiet | 0-999999 |

### Pozycja programowania (Programming Position)

Pozycja programowania określa, gdzie na etykiecie następuje kodowanie RFID względem linii druku głowicy.

```
    Kierunek podawania materiału
    ─────────────────────────────►

    ┌─────────────────────────────┐
    │                             │
    │    ┌───┐                    │
    │    │ IC│ ◄── Transponder    │
    │    └───┘                    │
    │                             │
    └─────────────────────────────┘
         ▲
         │
    Pozycja programowania
    (odległość od linii druku)
```

- **Wartość dodatnia (+):** transponder przed linią druku
- **Wartość ujemna (-):** transponder za linią druku
- **Zakres:** -120 do +120 mm
- **Domyślnie:** ustawiane automatycznie podczas kalibracji

### Moc odczytu/zapisu (Read/Write Power)

| Parametr | Zakres | Domyślnie | Uwagi |
|----------|--------|-----------|-------|
| Read Power | 5-30 dBm | Auto | Wyższa = dalszy zasięg |
| Write Power | 5-30 dBm | Auto | Wyższa = stabilniejszy zapis |

> **Wskazówka:** Wartości są ustawiane automatycznie podczas kalibracji. Zmień ręcznie tylko gdy występują problemy.

---

## 7. Programowanie etykiet RFID

### Komendy ZPL do RFID

ZQ630 Plus obsługuje komendy RFID w języku ZPL. Najważniejsze polecenia:

| Komenda | Opis |
|---------|------|
| `^RF` | Odczyt/zapis danych RFID |
| `^RB` | Zdefiniowanie formatu RFID |
| `^RS` | Ustawienia RFID (retry, void) |
| `^RW` | Ustawienie mocy zapisu |
| `^RR` | Ustawienie mocy odczytu |
| `^HR` | Odczyt i wydruk danych RFID |
| `^HV` | Weryfikacja taga |

### Przykład etykiety RFID (ZPL)

```zpl
^XA
^RS8                        ; Próby kodowania: 8
^RFW,H^FD1234567890ABCDEF^FS  ; Zapis EPC (HEX)
^FO50,50^A0N,30,30^FDProduct: Widget A^FS
^FO50,90^BY2^BCN,100,Y,N,N^FD12345^FS
^XZ
```

Ten format:
1. Ustawia 8 prób kodowania w przypadku błędu
2. Zapisuje EPC "1234567890ABCDEF" na tagu
3. Drukuje tekst "Product: Widget A"
4. Drukuje kod kreskowy Code 128

### Przykład odczytu i druku EPC

```zpl
^XA
^FO50,50^A0N,25,25^FDTag EPC:^FS
^FO50,80^A0N,25,25^HR^FS    ; Odczyt i wydruk EPC
^XZ
```

### Komenda ^RS – Ustawienia retry

```zpl
^RSn,v,a,b,c,d
```

| Parametr | Opis | Wartości |
|----------|------|----------|
| n | Liczba prób kodowania | 1-10 (domyślnie 3) |
| v | Akcja po błędzie | N=brak, P=pauza, E=błąd |
| a | Pozycja VOID | 0-9999 |
| b | Długość VOID | 0-9999 |
| c | Pozycja pionowa VOID | 0-9999 |
| d | Długość pionowa VOID | 0-9999 |

---

## 8. Obsługa błędów RFID

### Proces kodowania z obsługą błędów

```
┌─────────────────┐
│  Rozpocznij    │
│  kodowanie     │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐     NIE
│  Kodowanie     ├──────────┐
│  udane?        │          │
└───────┬─────────┘          │
        │ TAK               ▼
        │         ┌─────────────────┐
        │         │  Drukuj VOID   │
        │         │  na etykiecie  │
        │         └───────┬─────────┘
        │                 │
        │                 ▼
        │         ┌─────────────────┐
        │         │  Próba < max?  │
        │         └───────┬─────────┘
        │                 │ TAK
        │                 ▼
        │         ┌─────────────────┐
        │         │  Następna      │
        │         │  etykieta      │
        │         └───────┬─────────┘
        │                 │
        ▼                 │
┌─────────────────┐       │
│  Drukuj        │◄──────┘
│  etykietę      │
└───────┬─────────┘
        │
        ▼
┌─────────────────┐
│  Koniec        │
└─────────────────┘
```

### Drukowanie VOID

Gdy tag RFID nie może zostać zakodowany:

1. Drukarka drukuje **"VOID"** na etykiecie
2. Etykieta jest wysuwana
3. Drukarka próbuje zakodować następny tag
4. Po przekroczeniu limitu prób – wykonuje zdefiniowaną akcję

### Kody błędów RFID

| Kod | Komunikat | Przyczyna | Rozwiązanie |
|-----|-----------|-----------|-------------|
| E001 | RFID Not Present | Brak modułu RFID | Skontaktuj się z serwisem |
| E002 | RFID Read Error | Błąd odczytu taga | Sprawdź materiał |
| E003 | RFID Write Error | Błąd zapisu taga | Zwiększ moc zapisu |
| E004 | RFID Verify Error | Błąd weryfikacji | Wykonaj kalibrację |
| E005 | RFID Calibration Fail | Błąd kalibracji | Użyj materiałów Zebra |
| E006 | Tag Not Found | Brak taga w pozycji | Sprawdź pozycję programowania |

### Najczęstsze problemy i rozwiązania

| Problem | Możliwa przyczyna | Rozwiązanie |
|---------|-------------------|-------------|
| VOID na wszystkich etykietach | Zły materiał | Użyj materiałów Zebra |
| | Brak kalibracji | Wykonaj kalibrację RFID |
| | Zbyt niska moc | Zwiększ Write Power |
| Losowe błędy kodowania | Zakłócenia EMI | Oddal od źródeł zakłóceń |
| | Słaba jakość tagów | Wymień materiał |
| | Zła pozycja | Dostosuj Programming Position |
| Odczyt sąsiednich tagów | Za wysoka moc | Zmniejsz Read Power |
| | Brak kalibracji | Wykonaj kalibrację |
| Wolne kodowanie | Za dużo prób | Zmniejsz retry w ^RS |
| | Zły materiał | Sprawdź zgodność tagów |

---

## 9. Komendy SGD dla RFID

### Set-Get-Do Commands

Komendy SGD umożliwiają zaawansowaną konfigurację RFID przez port szeregowy lub Zebra Setup Utilities.

### Podstawowe komendy RFID SGD

| Komenda | Opis | Wartości |
|---------|------|----------|
| `rfid.error.response` | Status błędu RFID | Odczyt |
| `rfid.tag.calibrate` | Kalibracja RFID | Execute / Restore |
| `rfid.tag.read.content` | Zawartość odczytu | EPC / TID / USER |
| `rfid.tag.read.execute` | Wykonaj odczyt | Execute |
| `rfid.tag.test` | Wynik testu | Pass / Fail |
| `rfid.tag.test.execute` | Wykonaj test | Execute |
| `rfid.position.program` | Pozycja programowania | -120 do +120 |
| `rfid.reader_1.power.read` | Moc odczytu | 5-30 |
| `rfid.reader_1.power.write` | Moc zapisu | 5-30 |

### Komendy liczników RFID

| Komenda | Opis |
|---------|------|
| `odometer.rfid.valid_resettable` | Licznik poprawnych (resetowalny) |
| `odometer.rfid.void_resettable` | Licznik VOID (resetowalny) |
| `odometer.rfid.valid_lifetime` | Licznik poprawnych (całkowity) |
| `odometer.rfid.void_lifetime` | Licznik VOID (całkowity) |

### Przykłady użycia SGD

**Odczyt pozycji programowania:**
```
! U1 getvar "rfid.position.program"
```

**Ustawienie mocy zapisu na 25 dBm:**
```
! U1 setvar "rfid.reader_1.power.write" "25"
```

**Wykonanie kalibracji:**
```
! U1 do "rfid.tag.calibrate" "execute"
```

**Reset licznika VOID:**
```
! U1 setvar "odometer.rfid.void_resettable" "0"
```

---

## 10. Integracja z systemami

### Popularne platformy RFID

ZQ630 Plus jest kompatybilny z:

- **Zebra Savanna** – platforma chmurowa IoT
- **Zebra DNA** – oprogramowanie mobilne
- **SAP EWM** – zarządzanie magazynem
- **Oracle WMS** – system magazynowy
- **Manhattan Associates** – łańcuch dostaw
- **Blue Yonder** – optymalizacja łańcucha dostaw

### Sterowniki i SDK

| Narzędzie | Zastosowanie |
|-----------|--------------|
| **Zebra Designer** | Projektowanie etykiet RFID |
| **ZebraNet Bridge** | Zarządzanie flotą drukarek |
| **Multiplatform SDK** | Integracja z aplikacjami |
| **OPOS Driver** | Systemy POS |
| **JPOS Driver** | Aplikacje Java |

### Formaty danych EPC

| Format | Opis | Zastosowanie |
|--------|------|--------------|
| **SGTIN-96** | Serialized GTIN | Produkty detaliczne |
| **SSCC-96** | Serial Shipping Container | Palety, kontenery |
| **GRAI-96** | Global Returnable Asset | Zasoby zwrotne |
| **GIAI-96** | Global Individual Asset | Środki trwałe |
| **GSRN-96** | Global Service Relation | Usługi, subskrypcje |

---

## 11. Konserwacja modułu RFID

### Harmonogram konserwacji

| Element | Częstotliwość | Czynność |
|---------|---------------|----------|
| Antena RFID | Co miesiąc | Wizualna kontrola |
| Kalibracja | Po zmianie materiału | Wykonaj kalibrację |
| Firmware | Kwartalnie | Sprawdź aktualizacje |
| Liczniki | Tygodniowo | Monitoruj VOID rate |

### Wskaźniki wydajności RFID

Monitoruj następujące wskaźniki:

| Wskaźnik | Wartość docelowa | Akcja przy przekroczeniu |
|----------|------------------|--------------------------|
| VOID rate | < 1% | Sprawdź materiał/kalibrację |
| Retry rate | < 5% | Dostosuj moc zapisu |
| Read failures | < 0.1% | Sprawdź antenę |

### Obliczanie VOID rate

```
VOID rate = (VOID Count / Total Labels) × 100%

Przykład:
VOID Count = 5
Total Labels = 1000
VOID rate = (5 / 1000) × 100% = 0.5% ✓
```

---

## 12. Specyfikacje techniczne RFID

### Moduł RFID ZQ630 Plus

| Parametr | Wartość |
|----------|---------|
| Standard | EPC Global Gen 2 |
| Protokół | ISO 18000-6C |
| Częstotliwość | UHF 860-960 MHz |
| Moc wyjściowa | 5-30 dBm (regulowana) |
| Typ anteny | Wbudowana, liniowa |
| Pozycja kodowania | Regulowana ±120 mm |
| Obsługiwana pamięć | EPC, TID, User, Reserved |
| Max EPC | 496 bitów |
| Max User Memory | Zależna od taga |

### Obsługiwane typy tagów

| Producent | Model | EPC | User Memory |
|-----------|-------|-----|-------------|
| Impinj | Monza 4 | 96/128 bit | 32 bit |
| Impinj | Monza R6 | 96 bit | 0 bit |
| NXP | UCODE 7 | 96/128 bit | 32 bit |
| NXP | UCODE 8 | 96/128 bit | 128 bit |
| Alien | Higgs 3 | 96 bit | 512 bit |
| Alien | Higgs 4 | 96 bit | 128 bit |

### Zgodność z regulacjami

| Region | Częstotliwość | Standard |
|--------|---------------|----------|
| Europa (ETSI) | 865-868 MHz | EN 302 208 |
| USA (FCC) | 902-928 MHz | FCC Part 15 |
| Japonia | 916-921 MHz | ARIB STD-T106 |
| Chiny | 920-925 MHz | GB/T 29768 |
| Australia | 918-926 MHz | AS/NZS 4268 |

---

## 13. Rozwiązywanie problemów RFID

### Diagnostyka krok po kroku

**1. Sprawdź status RFID:**
```
Menu: HOME > RFID > RFID Status
Oczekiwany wynik: "Ready"
```

**2. Wykonaj test RFID:**
```
Menu: HOME > RFID > RFID Test
Oczekiwany wynik: "Pass"
```

**3. Sprawdź liczniki:**
```
Menu: HOME > RFID > RFID Valid Count
Menu: HOME > RFID > RFID Void Count
Oblicz VOID rate
```

**4. Zweryfikuj kalibrację:**
```
Menu: HOME > RFID > RFID Calibrate
Wykonaj ponowną kalibrację
```

### Tabela diagnostyczna

| Objaw | Test | Rozwiązanie |
|-------|------|-------------|
| Status "Not Present" | Sprawdź konfigurację | Skontaktuj się z serwisem |
| Status "Error" | Wykonaj test RFID | Wykonaj kalibrację |
| Test "Fail" | Sprawdź materiał | Wymień na materiał Zebra |
| Wysoki VOID rate | Sprawdź moc zapisu | Zwiększ Write Power |
| Wolne kodowanie | Sprawdź retry | Zmniejsz liczbę prób |

### Kiedy skontaktować się z serwisem?

- Status RFID ciągle pokazuje "Not Present" lub "Error"
- Test RFID zawsze kończy się niepowodzeniem z materiałami Zebra
- Fizyczne uszkodzenie anteny lub modułu
- VOID rate > 10% mimo kalibracji i wymiany materiału

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

**Zasoby online:**
- Dokumentacja RFID: zebra.com/rfid
- Materiały RFID: zebra.com/supplies
- SDK i sterowniki: zebra.com/sdk
- ZPL Programming Guide: zebra.com/manuals

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
