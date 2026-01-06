# Instrukcja obsługi drukarki Zebra ZD621r

**Drukarka termotransferowa z funkcją RFID**

---

## 1. Podstawowe informacje

### O drukarce ZD621r

Zebra ZD621r to zaawansowana drukarka etykiet z serii Premium, wyposażona w **wbudowany moduł RFID UHF**. Umożliwia jednoczesne drukowanie i kodowanie etykiet RFID. Drukarka wykorzystuje technologię druku termotransferowego i **wymaga taśmy barwiącej (ribbonu)**.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termotransferowy |
| Rozdzielczość | 203 dpi lub 300 dpi |
| Prędkość druku (203 dpi) | do 203 mm/s (8 cali/s) |
| Prędkość druku (300 dpi) | do 152 mm/s (6 cali/s) |
| Szerokość druku | do 104 mm (4 cale) |
| Maks. średnica rolki | 127 mm (5 cali) |
| Obsługiwane rolki ribbonu | 74 m i 300 m |
| **Technologia RFID** | UHF (860-960 MHz) |
| **Protokół RFID** | EPC Gen 2, ISO 18000-6C |

### Złącza standardowe (fabrycznie zainstalowane)

- USB 2.0
- Ethernet 10/100 (RJ-45)
- Port szeregowy RS-232 (DB-9)
- Port USB Host

### Dodatkowe funkcje

- **Wbudowany moduł RFID** z anteną
- **Media Dancer** – mechanizm stabilizujący podawanie materiału
- **Kolorowy wyświetlacz dotykowy** – wymagany do obsługi funkcji RFID
- Automatyczna kalibracja pozycji znacznika RFID

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZD621r z modułem RFID
- Zasilacz sieciowy z kablem
- Kabel USB
- Pusta gilza do odbierania ribbonu
- Adaptery do ribbonów 300 m
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na płaskiej, stabilnej powierzchni
- **Unikaj metalowych powierzchni** – mogą zakłócać sygnał RFID
- Zapewnij odstęp od innych urządzeń RFID/RF
- Unikaj bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: 5°C – 40°C

### Podłączenie zasilania

1. Podłącz kabel zasilający do zasilacza
2. Podłącz zasilacz do gniazda DC z tyłu drukarki
3. Podłącz kabel do gniazdka elektrycznego
4. **Nie włączaj jeszcze drukarki** – najpierw załaduj materiały i ribbon

---

## 3. Ładowanie materiałów eksploatacyjnych

### Obsługiwane typy materiałów RFID

- **Etykiety RFID z przerwą (gap)** – z wbudowanym chipem i anteną
- **Etykiety RFID z czarnym znacznikiem** – znacznik pozycjonujący z tyłu

> **Ważne:** Używaj wyłącznie etykiet RFID kompatybilnych z drukarką. Pozycja chipa musi odpowiadać pozycji anteny w drukarce.

### Lokalizacja anteny RFID

Antena RFID znajduje się **między wałkiem napędowym a kanałem czujnika materiału**. Jest oznaczona charakterystyczną kopułką.

### Procedura ładowania etykiet RFID

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi drukarki

2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki

3. **Włóż rolkę etykiet RFID** – umieść rolkę między prowadnicami. Strona z chipem RFID powinna być skierowana w dół

4. **Przeprowadź materiał pod Media Dancer**

5. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami

6. **Ustaw czujnik** w odpowiedniej pozycji

7. **Załaduj ribbon** (patrz sekcja poniżej)

8. **Zamknij pokrywę**

### Ładowanie taśmy barwiącej (ribbonu)

> **Ważne:** Ribbon musi być szerszy niż materiał, aby chronić głowicę drukującą.

#### Procedura:

1. **Przygotuj ribbon** – usuń opakowanie i taśmę zabezpieczającą

2. **Załóż pustą gilzę na górny trzpień (odbiorczy)**
   - Umieść gilzę na prawym trzpieniu sprężynowym
   - Wyrównaj nacięcia gilzy z wypustkami trzpienia
   - Obróć gilzę aż zatrzaśnie się na miejscu

3. **Załóż rolkę ribbonu na dolny trzpień (podający)**
   - Ribbon powinien odwijać się od spodu rolki
   - Wyrównaj nacięcia i obróć aż zatrzaśnie

4. **Przewlecz ribbon pod głowicą**
   - Przeprowadź ribbon pod głowicą drukującą
   - Przymocuj początek ribbonu do gilzy odbiorczej

5. **Usuń luz** – obróć górną gilzę aż ribbon będzie napięty

6. **Zamknij pokrywę** – dociśnij aż zatrzaśnie

7. **Naciśnij FEED** – drukarka wysunie ok. 20 cm materiału, wyrównując ribbon

---

## 4. Konfiguracja RFID

### Menu RFID (wyświetlacz dotykowy)

Przejdź do **Menu > RFID** aby uzyskać dostęp do ustawień RFID:

| Opcja | Opis |
|-------|------|
| **Status RFID** | Wyświetla aktualny stan modułu RFID |
| **Test RFID** | Testuje odczyt/zapis znacznika bez ruchu materiału |
| **Kalibracja RFID** | Automatycznie ustala optymalną pozycję programowania |
| **Moc odczytu** | Regulacja mocy anteny przy odczycie (0-30) |
| **Moc zapisu** | Regulacja mocy anteny przy zapisie (0-30) |
| **Antena RFID** | Wybór anteny (A1 - domyślnie) |
| **Licznik poprawnych** | Licznik poprawnie zakodowanych etykiet |
| **Licznik unieważnionych** | Licznik etykiet z błędem kodowania |
| **Pozycja programowania** | Ręczne ustawienie pozycji kodowania |
| **Odczyt danych RFID** | Odczyt danych z bieżącego znacznika |

### Kalibracja RFID

Przed rozpoczęciem drukowania z kodowaniem RFID wykonaj kalibrację:

1. Załaduj materiał RFID i ribbon
2. Wykonaj standardową kalibrację SmartCal (PAUSE + CANCEL przez 2 sekundy)
3. Przejdź do **Menu > RFID > Kalibracja RFID**
4. Dotknij **Start**
5. Drukarka automatycznie znajdzie optymalną pozycję kodowania

> **Uwaga:** Przed kalibracją RFID zostaw kilka centymetrów materiału wystającego z przodu drukarki – drukarka może cofać materiał podczas kalibracji.

### Test RFID

Aby przetestować odczyt/zapis bez drukowania:

1. Umieść etykietę RFID nad anteną (transponder nad kopułką anteny)
2. Przejdź do **Menu > RFID > Test RFID**
3. Dotknij **Start**
4. Wynik testu pojawi się na ekranie

### Odczyt danych z etykiety RFID

1. Umieść etykietę nad anteną
2. Przejdź do **Menu > RFID > Odczyt danych RFID**
3. Dotknij **Odczyt danych RFID**
4. Wyświetlą się dane zapisane na znaczniku

---

## 5. Podstawowa obsługa

### Panel sterowania (wyświetlacz dotykowy)

Model ZD621r jest wyposażony w kolorowy wyświetlacz dotykowy umożliwiający pełną konfigurację RFID.

Ekran główny zawiera:
- **Status drukarki** – aktualny stan urządzenia i RFID
- **Info o drukarce** – szczegółowe informacje
- **Kreatory** – asystenci konfiguracji
- **Menu użytkownika** – ustawienia druku, sieci i RFID

### Wskaźniki LED

| Wskaźnik | Kolor | Znaczenie |
|----------|-------|-----------|
| STATUS | Zielony | Drukarka gotowa |
| STATUS | Czerwony | Błąd (brak materiału, otwarta pokrywa) |
| PAUSE | Pomarańczowy | Drukarka wstrzymana |
| DATA | Zielony mrugający | Transmisja danych |
| SUPPLIES | Czerwony | Brak materiału |
| SUPPLIES | Czerwony mrugający | Brak ribbonu |
| NETWORK | Zielony | Połączenie sieciowe aktywne |

### Kalibracja SmartCal

Po załadowaniu nowego materiału RFID:

1. Przytrzymaj **PAUSE** + **CANCEL** przez 2 sekundy
2. LUB: Menu > Druk > Czujniki > Kalibracja ręczna > SmartCal
3. **Po SmartCal wykonaj również Kalibrację RFID**

### Druk testowy

1. Wydrukuj raport konfiguracji: przytrzymaj **FEED** + **CANCEL** przez 2 sekundy
2. Sprawdź sekcję RFID na wydruku
3. Użyj Menu > RFID > Test RFID do weryfikacji kodowania

---

## 6. Podłączenie do komputera

### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki **Zebra Setup Utilities** ze strony: [zebra.com/setup](https://zebra.com/setup)

### Połączenie USB

1. Zainstaluj sterowniki Zebra Setup Utilities
2. Podłącz kabel USB do drukarki i komputera
3. Włącz drukarkę
4. System Windows automatycznie wykryje drukarkę

### Połączenie Ethernet (fabrycznie zainstalowane)

1. Podłącz kabel sieciowy RJ-45 (CAT-5 lub lepszy)
2. Włącz drukarkę
3. Wskaźnik NETWORK zaświeci na zielono
4. Drukarka automatycznie pobierze adres IP z DHCP
5. Wydrukuj raport konfiguracji, aby sprawdzić adres IP

### Połączenie RS-232 (fabrycznie zainstalowane)

1. Podłącz kabel null-modem DB-9
2. Domyślne ustawienia: 9600 baud, 8 bitów, brak parzystości, 1 bit stopu

### Konfiguracja sieciowa (wyświetlacz dotykowy)

1. Przejdź do Połączenie > Sieć przewodowa > Protokół IP
2. Wybierz "Stały" dla statycznego IP lub "DHCP" dla automatycznego
3. Dostęp przez przeglądarkę: wpisz adres IP drukarki

---

## 7. Konserwacja i czyszczenie

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek lub przy wymianie ribbonu |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Media Dancer | W razie potrzeby |
| **Antena RFID** | Delikatne czyszczenie w razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone alkoholem izopropylowym (99,7%)
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij ribbon
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem z alkoholem
4. Czyść od środka ku krawędziom
5. Poczekaj około 1 minuty aż wyschnie
6. Załaduj ribbon i materiał, zamknij pokrywę

### Czyszczenie anteny RFID

> **Ostrożnie:** Antena RFID to delikatny element!

1. Wyłącz drukarkę
2. Delikatnie przedmuchaj sprężonym powietrzem
3. Jeśli konieczne, przetrzyj miękką, bezpyłową ściereczką
4. **Nie używaj alkoholu** bezpośrednio na antenie

---

## 8. Rozwiązywanie problemów

### Problemy z drukiem

| Problem | Rozwiązanie |
|---------|-------------|
| STATUS czerwony | Zamknij pokrywę, załaduj materiał |
| RIBBON OUT | Wymień ribbon lub sprawdź ładowanie |
| Marszczenie ribbonu | Wyrównaj ribbon, zmniejsz ciemność |
| Brak wydruku | Sprawdź tryb druku (THERMAL-TRANS) |

### Problemy z RFID

| Problem | Rozwiązanie |
|---------|-------------|
| Etykiety nie są kodowane | Wykonaj Kalibrację RFID |
| Wysokie unieważnienia (void) | Zmniejsz prędkość druku, zwiększ moc zapisu |
| Błąd odczytu RFID | Sprawdź pozycję etykiety nad anteną |
| Kodowanie sąsiednich etykiet | Zmniejsz moc zapisu, wykonaj Kalibrację RFID |

### Kody błędów RFID na wyświetlaczu

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| RFID ERROR | Ogólny błąd RFID | Sprawdź etykiety, wykonaj kalibrację |
| NO TAG DETECTED | Brak znacznika | Sprawdź pozycję etykiety |
| WRITE FAILED | Błąd zapisu | Zwiększ moc zapisu, sprawdź etykietę |
| TAG VOIDED | Etykieta unieważniona | Defekt etykiety, zostanie zadrukowana VOID |

### Optymalizacja kodowania RFID

Jeśli wiele etykiet jest unieważnianych:

1. **Zmniejsz prędkość druku** – daj więcej czasu na kodowanie
2. **Zwiększ moc zapisu** – Menu > RFID > Moc zapisu (wartość 0-30)
3. **Wykonaj ponownie Kalibrację RFID**
4. **Sprawdź jakość etykiet** – użyj etykiet Zebra lub certyfikowanych

### Reset liczników RFID

- Menu > RFID > Licznik poprawnych > Reset
- Menu > RFID > Licznik unieważnionych > Reset

### Problemy z siecią

| Problem | Rozwiązanie |
|---------|-------------|
| Wskaźnik NETWORK nie świeci | Sprawdź kabel sieciowy |
| Brak adresu IP | Sprawdź ustawienia DHCP |
| Wskaźnik mruga na czerwono | Błąd połączenia |

---

## 9. Programowanie RFID (podstawy)

### Komendy ZPL dla RFID

| Komenda | Opis |
|---------|------|
| ^RFW | Zapis danych do znacznika RFID |
| ^RFR | Odczyt danych z znacznika RFID |
| ^RS | Ustawienia RFID (pozycja, moc, typ tagu) |
| ^HR | Kalibracja znacznika RFID |

### Przykład etykiety ZPL z RFID

```zpl
^XA
^RS8,,,3                        ; Konfiguracja RFID
^RFW,H^FD1234567890ABCDEF^FS    ; Zapis danych HEX do EPC
^FO50,50^A0N,50,50^FDProdukt ABC^FS
^FO50,120^BY3^BCN,100,Y,N,N^FD1234567890^FS
^XZ
```

> **Uwaga:** Szczegółowe informacje o programowaniu RFID znajdziesz w dokumentacji "RFID Programming Guide 3" dostępnej na zebra.com/manuals

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*
