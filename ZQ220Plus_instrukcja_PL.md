# Instrukcja obsługi drukarki Zebra ZQ220 Plus

**Mobilna drukarka paragonów i etykiet 3-calowa**

---

## 1. Podstawowe informacje

### O drukarce ZQ220 Plus

Zebra ZQ220 Plus to kompaktowa mobilna drukarka paragonów i etykiet o szerokości druku do 72 mm (2,83"), zaprojektowana dla pracowników mobilnych w branży dostawczej, kurierskiej, logistycznej i detalicznej. Wykorzystuje najnowsze technologie: ładowanie przez USB Type-C, Bluetooth 5.0 z obsługą BLE iOS, Near Field Communication (NFC) oraz wytrzymałą konstrukcję o klasie ochrony IP54.

### Parametry techniczne

| Parametr | ZQ220 Plus |
|----------|------------|
| Szerokość druku | do 72 mm (2,83") |
| Technologia druku | Termiczny bezpośredni (Direct Thermal) |
| Rozdzielczość | 203 dpi (poziomo) × 200 dpi (pionowo) |
| Prędkość druku | 45,72 – 50,8 mm/s (1,8 – 2,0"/s) przy 13% pokryciu |
| Maks. średnica rolki | 50 mm (1,97") |
| Średnica gilzy | 12,7 mm (0,5") |
| Pojemność baterii | 2500 mAh Li-Ion (2-celowa), nominalna 2600 mAh |
| Czas ładowania | poniżej 3,5 godziny (ładowarka 7,5W USB) |
| Waga z baterią | poniżej 390 g (0,85 lb) |

### Szerokości materiałów

| Szerokość materiału | Uwagi |
|--------------------|-------|
| 80 mm (standard) | ±0,75 mm, bez spacerów |
| 76,2 mm (3") | ±0,65 mm, z opcjonalnymi spacerami |
| 58 mm (2,28") | ±0,65 mm, z opcjonalnymi spacerami |
| 50,8 mm (2") | ±0,65 mm, z opcjonalnymi spacerami |

### Złącza i komunikacja

- USB 2.0 Type-C (ładowanie i komunikacja)
- Bluetooth 5.0
- BLE iOS – obsługa iPhone 7s lub nowszy, iPad Air, iPod touch
- Near Field Communication (NFC) – parowanie przez Print Touch

### Cechy charakterystyczne

- **Kompaktowa konstrukcja mobilna** – waga poniżej 390 g z baterią
- Wyświetlacz OLED z 3-przyciskowym panelem sterowania
- Klasa ochrony IP54 (bez etui)
- Obsługa materiałów z podkładem i bezpodkładowych (linerless)
- Języki programowania CPCL i ESC/POS
- Obrotowy klips do paska (w zestawie)
- Opcjonalne etui ochronne z paskiem na ramię
- Ładowarka 1-stanowiskowa baterii (opcja)
- Technologia Zebra Print Touch (NFC)
- Kompatybilność z urządzeniami iOS, Android

### Oprogramowanie i narzędzia

- **ZebraNet Bridge Enterprise** – zarządzanie flotą drukarek, konfiguracja
- **Zebra Printer Setup Utilities** – konfiguracja pojedynczej drukarki
- **ZebraDesigner Pro v2** – projektowanie etykiet (Windows)
- **Zebra Designer Drivers** – sterowniki Windows
- **OPOS Driver** – sterownik Windows OPOS
- **Multiplatform SDK** – programowanie aplikacji mobilnych
- **Zebra Downloader** – pobieranie firmware
- **Mobile Label Designer (斑马智印)** – projektowanie na urządzeniach mobilnych

Pobierz z: zebra.com/support

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZQ220 Plus
- Bateria Li-Ion 2500 mAh
- Przewodnik szybkiego startu (Quick Start Guide)
- Kabel USB Type-A do Type-C
- Przewodnik regulacyjny
- Wtyczki i adaptery (tylko APAC)
- Klips do paska (tylko EMEA/LATAM)

### Sprawdzenie przesyłki

1. Ostrożnie usuń wszystkie materiały ochronne i zachowaj opakowanie na wypadek późniejszego transportu
2. Sprawdź czy otrzymałeś wszystkie elementy wymienione powyżej
3. Sprawdź wszystkie zewnętrzne powierzchnie pod kątem uszkodzeń
4. Otwórz pokrywę mediów i sprawdź komorę na materiały
5. Przed pierwszym użyciem usuń folię ochronną z wyświetlacza LCD

### Zgłaszanie uszkodzeń

W przypadku wykrycia uszkodzeń transportowych:
- Natychmiast powiadom przewoźnika i zgłoś szkodę
- Zebra Technologies Corporation nie ponosi odpowiedzialności za uszkodzenia powstałe podczas transportu i nie pokryje naprawy w ramach gwarancji
- Zachowaj karton i wszystkie materiały opakowaniowe do inspekcji
- Powiadom autoryzowanego dystrybutora Zebra

### Warunki pracy

| Tryb | Temperatura | Wilgotność |
|------|-------------|------------|
| Praca | -10°C do +50°C (14°F do 122°F) | 10-90% bez kondensacji |
| Ładowanie | 0°C do +40°C (32°F do 104°F) | 10-90% bez kondensacji |
| Przechowywanie | -20°C do +60°C (-4°F do 140°F) | 10-90% bez kondensacji |

---

## 3. Panel sterowania

### Wyświetlacz OLED

Drukarka wyposażona jest w wyświetlacz OLED, który pokazuje status urządzenia w czterech trybach:

- **Ekran operacyjny (Operation Screen)** – domyślny widok podczas normalnej pracy, pokazuje ikony statusu
- **Ekran informacyjny (Information Screen)** – komunikaty tekstowe dla użytkownika
- **Ekran konfiguracyjny (Configuration Screen)** – zmiana parametrów drukarki
- **Ekran uśpienia (Sleep Screen)** – wyświetla się po 10 sekundach bezczynności

### Ikony statusu drukarki

| Ikona | Znaczenie |
|-------|-----------|
| ✓ (zielona) | Drukarka w pełni operacyjna i gotowa do pracy |
| ⚠ (żółta) | Ostrzeżenie – drukarka nadal funkcjonalna, ale wymaga uwagi |
| ✗ (czerwona) | Błąd – brak niektórych podstawowych funkcji |

### Ikony mediów

| Ikona | Znaczenie |
|-------|-----------|
| 📄 | Materiał załadowany i gotowy do druku |
| 📄✗ | Brak materiału w drukarce |
| 🚪 | Pokrywa mediów otwarta/niezatrzaśnięta |

### Ikony komunikacji

| Ikona | Znaczenie |
|-------|-----------|
| 📥 | Drukarka odbiera dane |
| 📭 | Drukarka nie odbiera danych |
| 🔵 | Bluetooth połączony |
| (brak ikony) | Bluetooth rozłączony |

### Ikony baterii

| Ikona | Znaczenie |
|-------|-----------|
| 🔋 (0-4 kreski) | Poziom naładowania baterii |
| 🔋⚡ | Ładowanie baterii w toku |
| 🔋USB | Zasilanie z portu USB |
| 🔋⚠ | Błąd ładowania baterii |

### Przyciski sterujące

| Przycisk | Funkcja |
|----------|---------|
| **POWER** (Zasilanie) | Naciśnij aby włączyć; naciśnij ponownie aby wyłączyć |
| **FEED** (Podawanie) | Przesuwa materiał o jedną etykietę lub określoną długość; zmienia wartości w trybie konfiguracji |
| **CONFIG** (Konfiguracja) | Nawigacja po menu konfiguracyjnym; wybór opcji |

### Kombinacje przycisków

| Sekwencja | Funkcja | Sposób wykonania |
|-----------|---------|------------------|
| Raport konfiguracyjny | 1 | Przytrzymaj FEED, naciśnij i puść POWER |
| Tryb wymuszony (Forced Download) | 2 | Przytrzymaj CONFIG + FEED, naciśnij POWER |
| Włączenie/wyłączenie | 3 | Naciśnij POWER |

### Menu konfiguracyjne

Naciśnij przycisk CONFIG aby przejść do trybu konfiguracji. Dostępne opcje:

| Opcja | Opis |
|-------|------|
| **DARKNESS** | Regulacja ciemności druku (przycisk FEED zmienia wartość) |
| **POWER UP** | Podawanie po włączeniu: Feed On / Feed Off |
| **HEAD CLOSE** | Podawanie po zamknięciu głowicy: Head Open / Head Close |
| **POWER SLEEP MODE** | Tryb uśpienia: Enable / Disable |
| **PRINT** | Drukowanie raportu konfiguracyjnego |
| **MAC ADDRESS** | Wyświetlanie adresu MAC: Display On / Display Off |
| **MEDIA TYPE** | Typ materiału: Journal / Front Black Mark / Back Black Mark / Label |
| **EXIT CONFIGURATION** | Wyjście z menu konfiguracji i powrót do ekranu operacyjnego |

### Ekran uśpienia

Po 10 sekundach bezczynności wyświetlacz przechodzi w tryb uśpienia:
- Wyświetla animację logo Zebra przesuwającego się od lewej do prawej
- Podczas ładowania wyświetla ikonę ładowania baterii

---

## 4. Bateria

### Informacje o baterii

Drukarka ZQ220 Plus wykorzystuje 2-celową baterię Li-Ion o następujących parametrach:
- Napięcie nominalne: 7,2 VDC
- Pojemność znamionowa: 2500 mAh
- Pojemność nominalna: 2600 mAh
- Czas ładowania: poniżej 3,5 godziny (ładowarka USB 7,5W przy włączonej drukarce)

Bateria zapewnia do 3 dni pracy przy następujących warunkach:
- 25 przystanków dziennie
- 25 włączeń urządzenia dziennie
- Do 500 paragonów 3×8,5 cala na 8-godzinną zmianę przy 13% pokryciu

> **Ważne:** Baterie są dostarczane w trybie uśpienia (sleep mode), aby zachować maksymalną pojemność podczas przechowywania. Przed pierwszym użyciem należy naładować baterię, aby ją wybudzić.

> **Uwaga:** Wyłącz drukarkę przed wyjęciem baterii, aby zminimalizować ryzyko uszkodzenia danych. Drukarka działa prawidłowo tylko z oryginalnymi bateriami Zebra.

### Wyjmowanie baterii

1. Naciśnij zatrzask zwalniający na pakiecie baterii
2. Zacznij obracać baterię na zewnątrz z komory
3. Unieś pakiet baterii do góry i wyjmij go z wnęki

### Usuwanie izolatora taśmowego baterii

Izolator taśmowy baterii chroni styki podczas transportu:

> **Ostrzeżenie:** Bateria może eksplodować, wyciec lub zapalić się w przypadku niewłaściwego ładowania lub narażenia na wysoką temperaturę. Nie rozbieraj, nie zgniataj, nie przekłuwaj, nie zwieraj styków zewnętrznych, nie wrzucaj do ognia ani wody. Ładuj tylko w ładowarkach zatwierdzonych przez Zebra dla akumulatorów Li-Ion.

1. Obróć pakiet baterii i zlokalizuj taśmę na stykach
2. Odklej taśmę, aby odsłonić styki
3. Wyrzuć taśmę

### Instalacja baterii

1. Zlokalizuj komorę baterii na spodzie drukarki
2. Przechyl pakiet baterii i włóż go do komory
3. Obróć baterię w komorze, aż zatrzaśnie się na miejscu i będzie leżeć równo w drukarce

### Bezpieczeństwo baterii

> **Ostrzeżenie:** Bateria może eksplodować, wyciec lub zapalić się!

- Nie rozbieraj, nie zgniataj, nie przekłuwaj baterii
- Nie zwieraj styków zewnętrznych – może to spowodować oparzenia lub pożar
- Nie wrzucaj do ognia ani wody
- Nie narażaj na temperatury powyżej 65°C (149°F)
- Ładuj tylko w ładowarkach zatwierdzonych przez Zebra dla akumulatorów Li-Ion
- Używanie ładowarki niezatwierdzonej przez Zebra może uszkodzić baterię lub drukarkę i unieważni gwarancję
- Zawsze prawidłowo utylizuj zużyte baterie

---

## 5. Ładowanie baterii

### Bezpieczeństwo ładowarki

- Nie umieszczaj ładowarki w miejscach, gdzie mogą do niej dostać się ciecze lub metalowe przedmioty
- Nie blokuj szczelin wentylacyjnych na górnej i dolnej pokrywie
- Upewnij się, że ładowarka jest skonfigurowana dla napięcia AC w Twoim regionie
- Używaj odpowiedniego kabla zasilającego AC dla danego kraju

### Ładowanie przez USB (AC-to-USB Charger)

> **Ważne:** Przed pierwszym użyciem drukarki należy naładować baterię, aby ją wybudzić.

**Procedura ładowania:**

1. Podłącz zasilacz AC-to-USB do gniazdka sieciowego
2. Podłącz kabel USB do zasilacza
3. Obróć gumową osłonę portu USB na boku drukarki, aby uzyskać dostęp do portu
4. Podłącz kabel USB Type-C do drukarki

> **Uwaga:** Baterie częściowo naładowane mogą być używane, jednak zaleca się pełne naładowanie dla maksymalnej żywotności baterii.

### Ładowarka 1-stanowiskowa baterii (1-Slot Battery Charger)

Ładowarka 1-Slot ładuje jedną baterię naraz i posiada diodę LED wskaźnika:
- **Czerwona świeci ciągle** – ładowanie w toku
- **Zielona świeci ciągle** – bateria w pełni naładowana

**Procedura ładowania:**

1. Podłącz zasilacz AC-to-USB do gniazdka sieciowego
2. Podłącz kabel USB do portu z tyłu ładowarki
3. Przechyl pakiet baterii i włóż go do komory ładowarki
4. Obróć baterię w komorze, aż zatrzaśnie się na miejscu i będzie leżeć równo w ładowarce

---

## 6. Ładowanie materiału

Drukarka jest zaprojektowana do drukowania na materiale ciągłym (paragony) lub etykietowym.

### Procedura ładowania materiału

1. Przesuń dźwignię zwalniającą zatrzask do przodu, aby odblokować pokrywę mediów
2. Unieś i obróć pokrywę mediów
3. Włóż rolkę materiału (w pokazanej orientacji) do komory na media
4. Rolka powinna swobodnie obracać się wewnątrz komory
5. Zamknij pokrywę mediów, aż zatrzaśnie się na miejscu
6. Materiał zostanie automatycznie wysunięty po zamknięciu pokrywy

> **Uwaga:** Szczegółowe informacje o zmianie długości podawania materiału znajdują się w dokumentacji poleceń Set Get Do (SGD) w Przewodniku Programowania.

---

## 7. Komunikacja

### Komunikacja USB

> **Ostrzeżenie:** Drukarka musi być wyłączona przed podłączeniem lub odłączeniem kabla komunikacyjnego.

Standardowe połączenie kablowe dla drukarek to kabel USB 2.0 służący do komunikacji i ładowania:
- Jeden koniec kabla ma złącze USB Type-A
- Drugi koniec ma złącze USB Type-C

Małe złącze Type-C podłącza się do drukarki. Złącze nie jest kluczowane, więc można je podłączyć w dowolnej orientacji. Nie stosuj siły, jeśli złącze nie pasuje. Złącze Type-A należy podłączyć do dowolnego portu USB 2.0 hosta.

Sterowniki USB są dołączone do Zebra Designer Driver, który można pobrać ze strony zebra.com/drivers.

### Komunikacja bezprzewodowa Bluetooth

Bluetooth to światowy standard wymiany danych między urządzeniami za pomocą częstotliwości radiowych. Ta forma komunikacji punkt-punkt nie wymaga punktów dostępowych ani innej infrastruktury.

Radia Bluetooth mają stosunkowo niską moc, aby zapobiec zakłóceniom z innymi urządzeniami. Ogranicza to zasięg urządzenia Bluetooth do około 10 metrów (32 stopy). Domyślnie drukarki są klasy 2.

### Przegląd sieci Bluetooth

Każda drukarka z włączonym Bluetooth jest identyfikowana przez unikalny adres urządzenia Bluetooth (BDADDR). Adres ten przypomina adres MAC – pierwsze trzy bajty to identyfikator producenta, a ostatnie trzy bajty to identyfikator urządzenia (np. 00:22:58:3C:B8:CB).

Adres jest oznaczony kodem kreskowym na spodzie drukarki, co ułatwia parowanie. Aby wymieniać dane, dwa urządzenia z Bluetooth muszą nawiązać połączenie.

### Tryby bezpieczeństwa Bluetooth

**Tryb bezpieczeństwa 4: Simple Secure Pairing**
- Architektura bezpieczeństwa wspierana w Bluetooth >= 2.1
- Wymuszane na poziomie usługi
- Obowiązkowe gdy oba urządzenia mają Bluetooth >= 2.1
- Obsługuje cztery modele asocjacji
- Poprawia bezpieczeństwo poprzez kryptografię klucza publicznego ECDH

**Tryb bezpieczeństwa 2: Wprowadzanie kodu PIN**
- Wprowadź kod PIN podczas łączenia z drukarką
- Domyślny PIN: 0000
- PIN można zmienić przez SGD bluetooth.bluetooth_pin

### Funkcje Bluetooth

SGD bluetooth.minimum_security_mode ustawia poziom bezpieczeństwa połączenia Bluetooth. Aby zmienić tryb bezpieczeństwa, użyj Zebra Setup Utilities.

Drukarka ZQ220 Plus obsługuje również wiązanie (bonding) dla Bluetooth. Drukarka przechowuje informacje o parowaniu, więc urządzenia pozostają sparowane po cyklach zasilania i rozłączeniach.

SGD bluetooth.bonding jest domyślnie włączone.

Drukarki obsługują także funkcję Scan and Pair za pomocą urządzenia przenośnego i etykiety z adresem MAC na spodzie drukarki.

### Parowanie NFC

Drukarka ZQ220 Plus posiada pasywną technologię NFC (Near Field Communication). Używając funkcji Print Touch znajdującej się na górze drukarki, użytkownicy mogą automatycznie sparować się z urządzeniem przenośnym obsługującym NFC.

Tag NFC ma zakodowany adres BDADDR drukarki w URL. Wystarczy dotknąć urządzeniem NFC ikony Print Touch na drukarce, aby połączyć i sparować urządzenie z drukarką.

---

## 8. Łączenie z urządzeniem

### Łączenie z telefonem lub tabletem

Pobierz bezpłatną aplikację Zebra Printer Setup Utility dla swojego urządzenia:
- Urządzenia Android
- Urządzenia Apple

Aplikacje obsługują następujące typy połączeń:
- Bluetooth Classic
- Bluetooth Low Energy (BLE)
- Przewodowe/Ethernet
- Bezprzewodowe
- USB On-The-Go

Przewodniki użytkownika dla tych narzędzi konfiguracyjnych: zebra.com/setup

### Instalacja sterowników i łączenie z komputerem Windows

> **Ważne:** Możesz podłączyć drukarkę do komputera za pomocą dowolnego dostępnego połączenia. Jednak nie podłączaj żadnych kabli od komputera do drukarki, dopóki nie zostaniesz o to poproszony. Jeśli podłączysz je w niewłaściwym momencie, drukarka nie zainstaluje prawidłowych sterowników.

**Instalacja sterowników:**

1. Przejdź do zebra.com/drivers
2. Kliknij Printers
3. Wybierz model drukarki
4. Na stronie produktu kliknij Drivers
5. Pobierz odpowiedni sterownik dla Windows
6. Uruchom plik wykonywalny i postępuj zgodnie z instrukcjami
7. Po zakończeniu instalacji możesz dodać konkretne drukarki

**Co zrobić, jeśli zapomnisz najpierw zainstalować sterowniki:**

Jeśli podłączysz drukarkę Zebra przed zainstalowaniem sterowników, drukarka wyświetli się jako Nieokreślone urządzenie (Unspecified device):

1. Zainstaluj sterowniki zgodnie z powyższą instrukcją
2. Kliknij prawym przyciskiem myszy menu Windows i wybierz Menedżer urządzeń
3. Znajdź Drukarki na liście i rozwiń
4. Kliknij prawym przyciskiem myszy drukarkę Zebra i wybierz Aktualizuj sterownik
5. Kliknij Przeglądaj mój komputer w poszukiwaniu sterowników
6. Przejdź do folderu Downloads i kliknij OK
7. Kliknij Dalej – urządzenie zostanie zaktualizowane prawidłowymi sterownikami

### Zebra Printer Setup Utilities

Przed skonfigurowaniem drukarki do użycia potrzebujesz podstawowych informacji umożliwiających ustanowienie konfiguracji sieciowej. Narzędzie Zebra Printer Setup Utilities zapewnia szybki i łatwy sposób konfiguracji drukarki, w tym ustawienia jej do komunikacji Bluetooth.

Pobierz z: zebra.com/us/en/support-downloads.html

---

## 9. Near Field Communication (NFC)

### Informacje o NFC

Near Field Communication (NFC) umożliwia bezprzewodową komunikację i wymianę danych między urządzeniami cyfrowymi, takimi jak drukarka i smartfon, za pomocą elektromagnetycznych pól radiowych.

NFC jest podklasą technologii RFID (Radio Frequency Identification) zaprojektowaną do użytku przez urządzenia znajdujące się w bliskiej odległości od siebie. Technologia NFC pozwala urządzeniom nawiązać komunikację przez dotknięcie lub zbliżenie ich, zazwyczaj nie więcej niż 7,62 cm (3 cale).

Drukarka zawiera pasywny tag NFC, który zawiera informacje, które inne urządzenia, takie jak smartfon, mogą odczytać. Tag NFC sam nie odczytuje informacji – tylko je przekazuje.

### Przypadki użycia NFC

**Pasywne:**

- **Parowanie Bluetooth** – powoduje automatyczne sparowanie tabletu, smartfona lub komputera mobilnego z drukarką przez połączenie Bluetooth, w ramach używanego profilu bezpieczeństwa. Zawiera adres Bluetooth i numer seryjny drukarki.

- **Uruchamianie aplikacji** – powoduje uruchomienie aplikacji opracowanej przez Zebra lub stronę trzecią na smartfonie, tablecie lub terminalu.

- **Uruchamianie strony internetowej** – powoduje wyświetlenie strony internetowej opracowanej przez Zebra lub stronę trzecią na smartfonie, tablecie lub terminalu.

Dotknięcie ikony Zebra Print Touch urządzeniem z NFC zapewni natychmiastowy dostęp do informacji specyficznych dla drukarki. Więcej informacji o NFC i produktach Zebra: zebra.com/nfc

---

## 10. Noszenie drukarki

### Obrotowy klips do paska (Swivel Belt Clip)

Drukarka ma plastikowy obrotowy klips do paska dołączony jako akcesorium.

**Instalacja:**

1. Wyjmij pakiet baterii
2. Włóż kulkę z tyłu klipsa do gniazda na spodzie drukarki
3. Obróć klips poziomo, aby uzyskać dostęp do otworu komory baterii
4. Zainstaluj ponownie pakiet baterii
5. Obróć klips pionowo

### Pasek na ramię (Shoulder Strap)

Akcesorium paska na ramię zapewnia kolejną opcję wygodnego noszenia drukarek ZQ220 Plus i ZQ120 Plus. Pasek mocuje się do dwóch zaczepów z przodu drukarki za pomocą wytrzymałych obrotowych haczyków zatrzaskowych.

Pasek można łatwo regulować do 142,2 cm (56 cali) od końca do końca.

**Instalacja:**

1. Zapnij każdy haczyk zatrzaskowy paska na ramię do odpowiedniego zaczepu z przodu drukarki
2. Zawieś pasek na ramieniu, aby drukarka wisiała bezpiecznie w pozycji pionowej

### Etui ochronne (Soft Case)

Drukarki mają opcjonalne etui ochronne Soft Case, które pomaga chronić drukarkę, jednocześnie umożliwiając użytkownikowi noszenie jej przy pasku.

Ścieżka papieru pozostaje otwarta, aby zachować możliwość drukowania, a elementy sterujące są widoczne i dostępne przez plastikowe okienko. Złącza D-Ring umożliwiają mocowanie do opcji paska na ramię.

**Instalacja:**

1. Unieś górną klapkę etui, która jest zabezpieczona rzepem
2. Włóż drukarkę do etui spodem do przodu
3. Obróć etui, aby uzyskać dostęp do wyświetlacza LCD i elementów sterujących, które są widoczne przez plastikowe okienko
4. Unieś dolną część okienka, aby uzyskać dostęp do ścieżki papieru

---

## 11. Komunikaty na wyświetlaczu

### Komunikaty czasowe (Timed Messages)

Te komunikaty pojawiają się na określony czas, a następnie znikają:

| Komunikat | Czas | Znaczenie |
|-----------|------|-----------|
| PRINTER READY | 30 sek. | Drukarka gotowa do druku |

### Komunikaty wymagające akcji użytkownika (User Activity Messages)

Te komunikaty wymagają wykonania określonej czynności przez użytkownika:

| Komunikat | Znaczenie |
|-----------|-----------|
| DOWNLOAD FW | Pobieranie firmware |
| DOWNLOAD FAILED | Pobieranie nieudane |
| HEAD OVERTEMP | Głowica przegrzana |
| HEAD UNDERTEMP | Głowica za zimna |
| BATTERY TOO LOW | Bateria zbyt słaba |
| MEDIA OUT | Brak materiału |
| HEAD OPEN | Głowica otwarta |
| CHARGE ERROR | Błąd ładowania |
| NO PRINTING | Brak baterii |
| BATTERY LOW | Niski poziom baterii |

---

## 12. Konserwacja i rozwiązywanie problemów

### Konserwacja zapobiegawcza

#### Przedłużanie żywotności baterii

- Nigdy nie narażaj baterii na bezpośrednie światło słoneczne ani temperatury powyżej 40°C (104°F) podczas ładowania
- Zawsze używaj ładowarki Zebra zaprojektowanej specjalnie dla baterii litowo-jonowych
- Używaj odpowiednich materiałów do swoich wymagań drukowania
- Rozważ użycie wstępnie zadrukowanych etykiet, jeśli drukujesz ten sam tekst lub grafikę na każdej etykiecie
- Wybierz odpowiednią ciemność druku i prędkość dla swoich materiałów
- Używaj handshakingu programowego (XON/XOFF) kiedy to możliwe
- Wyjmij baterię, jeśli drukarka nie będzie używana przez dzień lub dłużej
- Rozważ zakup zapasowej baterii
- Pamiętaj, że każda bateria akumulatorowa z czasem traci zdolność utrzymywania ładunku

### Czyszczenie

> **Uwaga:** Głowica drukująca może być bardzo gorąca po długotrwałym drukowaniu. Poczekaj, aż ostygnie, przed przystąpieniem do czyszczenia.

> **Ważne:** Używaj tylko pisaka czyszczącego Zebra (niedołączony do drukarki) lub wacika bawełnianego z 90% alkoholem medycznym do czyszczenia głowicy.

| Obszar | Metoda | Częstotliwość |
|--------|--------|---------------|
| **Głowica drukująca** | Pisak czyszczący Zebra (p/n 105950-035) lub czysty wacik z 99,7% alkoholem izopropylowym | Co 5 rolek materiału (lub częściej w razie potrzeby). Przy materiale linerless – po każdej rolce |
| **Wałek dociskowy** | Obróć wałek i wyczyść go dokładnie wacikiem bezpyłowym lub szmatką lekko zwilżoną 99,7% alkoholem izopropylowym | Co 5 rolek materiału |
| **Listwa odrywająca** | Wyczyść dokładnie 99,7% alkoholem izopropylowym i wacikiem bawełnianym | W razie potrzeby |
| **Zewnętrzna obudowa** | Szmatka zwilżona wodą lub chusteczka z 99,7% alkoholem izopropylowym | W razie potrzeby |
| **Wnętrze drukarki** | Delikatnie odmieść drukarkę. Upewnij się, że okienka czujników są wolne od kurzu | W razie potrzeby |

### Rozwiązywanie problemów

#### Brak zasilania
- Sprawdź, czy bateria jest prawidłowo zainstalowana
- Naładuj lub wymień baterię w razie potrzeby

#### Materiał się nie podaje
- Upewnij się, że pokrywa mediów jest zamknięta i zatrzaśnięta
- Sprawdź komorę na media pod kątem blokad
- Upewnij się, że czujnik etykiet nie jest zablokowany

#### Słaby lub wyblakły wydruk
- Wyczyść głowicę drukującą
- Sprawdź jakość materiału

#### Częściowy lub brakujący wydruk
- Sprawdź wyrównanie materiału
- Wyczyść głowicę drukującą
- Upewnij się, że pokrywa mediów jest prawidłowo zamknięta i zatrzaśnięta

#### Zniekształcony wydruk
- Wymień baterię
- Sprawdź kabel do urządzenia hosta
- Nawiąż połączenie RF i/lub przywróć łączność LAN

#### Brak wydruku
- Wymień baterię
- Sprawdź kabel do urządzenia hosta
- Nawiąż połączenie RF i/lub przywróć łączność LAN
- Nieprawidłowy format etykiety lub struktura poleceń – przełącz drukarkę w tryb diagnostyczny komunikacji (Hex Dump)

#### Skrócona żywotność baterii
- Jeśli bateria ma więcej niż rok, krótki czas pracy może wynikać z normalnego starzenia
- Sprawdź stan baterii
- Wymień baterię

#### Migająca ikona danych
- Migająca ikona danych jest normalna podczas odbierania danych

#### Migające ikony braku materiału lub otwartej głowicy
- Sprawdź, czy materiał jest załadowany i czy pokrywa mediów jest zamknięta i bezpiecznie zatrzaśnięta

#### Błąd komunikacji
- Wymień kabel do terminala
- Sprawdź szybkość transmisji (baud rate)

#### Zakleszczenie etykiety
- Otwórz zatrzask zwalniający głowicę i pokrywę mediów
- Wyjmij i ponownie załaduj materiał

#### Pomijanie etykiet
- Sprawdź materiał pod kątem znacznika czujnika lub przerwy między etykietami
- Sprawdź, czy nie przekroczono maksymalnego pola druku na etykiecie
- Upewnij się, że czujnik znacznika lub przerwy nie jest zablokowany ani uszkodzony

#### Pusty ekran LCD
- Upewnij się, że drukarka jest włączona
- Brak załadowanej aplikacji lub aplikacja uszkodzona – ponownie załaduj program

#### Brak łączności NFC
- Upewnij się, że smartfon jest umieszczony 7,62 cm (3 cale) lub bliżej od ikony Print Touch na górze drukarki

### Drukowanie etykiety konfiguracyjnej

Aby wydrukować raport bieżącej konfiguracji drukarki:

1. Wyłącz drukarkę
2. Załaduj komorę na media materiałem ciągłym (bez czarnych znaczników ani przerw z tyłu)
3. Naciśnij i przytrzymaj przycisk FEED
4. Naciśnij i puść przycisk POWER, trzymając wciśnięty FEED
5. Gdy rozpocznie się drukowanie, puść FEED

Drukarka wydrukuje linię przeplatających się znaków "x", aby upewnić się, że wszystkie elementy głowicy działają, następnie wydrukuje wersję oprogramowania i raport konfiguracyjny.

Raport zawiera: model, numer seryjny, szybkość transmisji i szczegółowe informacje o konfiguracji i ustawieniach parametrów drukarki.

Możesz także wydrukować raport konfiguracyjny włączając drukarkę, naciskając CONFIG wielokrotnie aż do ekranu SETTINGS-PRINT, a następnie naciskając FEED.

---

## 13. Projektowanie etykiet

### Język programowania

Drukarka wykorzystuje języki programowania CPCL i ESC/POS zaprojektowane dla aplikacji druku mobilnego. CPCL jest szczegółowo opisany w CPCL Programming Guide dostępnym na zebra.com/manuals

### Oprogramowanie

- **ZebraDesigner Pro v2** – projektowanie etykiet (Windows)
- **Zebra Setup Utilities (ZSU)** – konfiguracja pojedynczej drukarki
- **ZebraNet Bridge Enterprise** – zarządzanie flotą drukarek

### Zalecenia projektowe

**Materiał z przerwami (Gap Media):**
- Maksymalna wysokość etykiety: H - 2,5 mm (gdzie H to odległość między przerwami)

**Materiał ciągły (Journal Media):**
- Marginesy boczne: 1,59 mm (0,06") od lewej i prawej krawędzi
- Strefa bezpieczna do druku znajduje się między marginesami

**Materiał z czarnym znacznikiem (Black Bar Media):**
- Maksymalna wysokość etykiety: H - 2,5 mm
- Zachowaj wolną ścieżkę na środku dla czujnika (15 mm szerokości)
- Unikaj ciemnych grafik, kodów kreskowych i tekstu w ścieżce znacznika

### Wymiary czarnego znacznika (dla materiału paragonowego)

Czarne znaczniki odblaskowe powinny być umieszczone na przedniej stronie papieru:
- **Minimalna szerokość znacznika:** 15 mm (0,59") prostopadle do krawędzi materiału, wyśrodkowana na szerokości rolki
- **Długość znacznika:** 4,8 – 6,0 mm (0,19 – 0,24") równolegle do krawędzi materiału

### Strefy bez nadruku

Ciemne wstępnie nadrukowane grafiki (symbole, kody kreskowe, tekst, kolorowe obszary) powinny być trzymane z dala od ścieżki czujnika w środkowej części materiału.

**Strefy bezpieczne (Keep-Out Areas):**
- Środek papieru o szerokości 15 mm musi być wolny od ciemnych nadruków dla prawidłowej detekcji znacznika

---

## 14. Specyfikacje

### Wymiary i waga

| Parametr | Wartość |
|----------|---------|
| Wysokość | 58,8 mm (2,31") |
| Szerokość | 114,5 mm (4,5") |
| Głębokość | 129,5 mm (5,09") |
| Waga z baterią | poniżej 390 g (0,85 lb) |

### Drukowanie

| Parametr | Wartość |
|----------|---------|
| Szerokość druku | do 72 mm (2,83") |
| Prędkość druku | 45,72 – 50,8 mm/s (1,8 – 2,0"/s) przy 13% pokryciu |
| Rozdzielczość | 203 dpi (poziomo) × 200 dpi lub lepsza |
| Odległość linii druku do krawędzi odrywania | 5,4 mm (0,21") ±0,5 mm (przednia strona), odrywanie wsteczne niedostępne |
| Żywotność głowicy | 4064 m (160 000") podawania papieru MTBF przy 13% pokryciu, 23°C ±5, przy użyciu oryginalnych materiałów |

### Pamięć

| Typ | Pojemność |
|-----|-----------|
| Flash | 16 MB |
| RAM | 8 MB |

### Materiały

| Parametr | Wartość |
|----------|---------|
| Szerokość standardowa | 80 mm ±0,75 mm (3,15" ±0,02") |
| Szerokości opcjonalne | 76,2 mm, 58 mm, 50,8 mm (z opcjonalnymi spacerami) |
| Długość etykiety | 12,7 mm – 203,2 mm (0,5" – 8") |
| Grubość materiału | 0,058 – 0,1575 mm (2,28 – 6,2 mils) |
| Maks. średnica rolki | 50 mm (1,97") |
| Średnica gilzy | 12,7 mm (0,5") standard |
| Odległość czujnika znacznika do linii druku | 16,57 mm (0,65") +1,0/-0,6 mm |

### Wymiary czarnego znacznika

| Parametr | Wartość |
|----------|---------|
| Minimalna szerokość | 12,7 mm (0,5") |
| Długość | 2,4 – 11 mm (0,09 – 0,43") |
| Lokalizacja | Wyśrodkowany na szerokości rolki |

### Zasilanie

| Parametr | Wartość |
|----------|---------|
| Bateria | 2-celowa Li-Ion 7,2 VDC (nominalne), 2500 mAh (znamionowa), 2600 mAh (nominalna) |

### Środowisko pracy

| Tryb | Temperatura |
|------|-------------|
| Praca | -5°C do +50°C (23°F do 122°F) |
| Ładowanie | 0°C do +40°C (32°F do 104°F) |
| Przechowywanie | -20°C do +60°C (-4°F do 140°F) |

Wilgotność: 10-90% bez kondensacji (praca/przechowywanie)

### Klasa ochrony

| Konfiguracja | Klasa IP |
|--------------|----------|
| Bez etui | IP54 |

### Komunikacja

| Interfejs | Opis |
|-----------|------|
| USB | USB 2.0 |
| Bluetooth | Bluetooth 5.0 |

### Kody kreskowe

**Kody liniowe (1D):**
Codabar, Codabar 16, UCC/EAN-128, Code 39 (39, 39C, F39, F39C), Code 93, Code 128, EAN-8/13 (z rozszerzeniami 2 i 5 cyfrowy), EAN-8 Composite, EAN-13 Composite, Plessey, Interleaved 2 of 5 (I2OF5), MSI (MSI, MSI10, MSI1110), FIM/POSTNET, TLC39, UCC Composite A/B/C, UPC-A (z rozszerzeniami 2 i 5 cyfrowy), UPC-A Composite, UPC-E (z rozszerzeniami 2 i 5 cyfrowy), UPC-E Composite

**Kody 2D:**
Aztec, MaxiCode, PDF-417, QR Code, RSS-14 (wszystkie warianty: Standard, Truncated, Stacked, Stacked Omnidirectional), RSS Limited, RSS Expanded

**Kąty obrotu:** 0°, 90°, 180°, 270°

### Czcionki standardowe

- FONTA.CPF – czcionka domyślna ESC/POS, 12×24 bitmap
- FONTB.CPF – czcionka domyślna ESC/POS, 9×17 bitmap
- FONTC.CPF – czcionka domyślna ESC/POS, 9×24 bitmap
- GBUNSG16.CPF – SimSun, chiński uproszczony 16×16 bitmap
- GBUNSG24.CPF – SimSun, chiński uproszczony 24×24 bitmap

### Opcjonalne czcionki

- SWIS721.CSF – czcionka skalowalna CPCL
- DEJAVU12/14/16/20.CPF – czcionki preskalowane
- MUTOS16.CPF – Utah, wietnamski 16×16 bitmap
- CTUNMK24.CPF – M Kai, chiński tradycyjny 24×24 bitmap
- NSMTTC16.CPF – New Sans MT, chiński tradycyjny 16×16 bitmap

---

## 15. Akcesoria

Pełna lista akcesoriów dostępna na zebra.com/manuals – wyszukaj Mobile Printer Accessories Guide i przejdź do strony produktu ZQ220 Plus.

### Główne akcesoria

| Opis | Uwagi |
|------|-------|
| Zasilacz AC-to-USB | Różne wersje regionalne (NA, EU, UK, BR, IN, KR) |
| Adapter samochodowy USB | Uniwersalny (WW) |
| Bateria zapasowa 2500 mAh | Dla ZQ220 Plus/ZQ120 Plus |
| Spacery do materiałów | Dla materiałów 76,2mm/58mm/50,8mm |
| Etui ochronne Soft Case | Uniwersalne |
| Pasek na ramię | Uniwersalny |
| Klips do paska | Pakiet 5 szt. |
| Ładowarka 1-slot baterii | Różne wersje regionalne |
| Kabel USB Type-A do Type-C | Pakiet 1 lub 5 szt. |

---

## 16. Kabel USB – pinout

### Kabel USB Type-A do Type-C

| Wtyk Type-C | Sygnał | Nr przewodu | Wtyk Type-A | Sygnał |
|-------------|--------|-------------|-------------|--------|
| A1,B1,A12,B12 | GND | 1 | 4 | GND |
| A4,B4,A9,B9 | VBUS | 2 | 1 | VBUS |
| A5 | CC | * | - | - |
| B5 | VCONN | - | - | - |
| A6 | Dp1 | 3 | 3 | D+ |
| A7 | Dn1 | 4 | 2 | D- |
| Shield | Braid | Shield | Shell | Shield |

**Uwagi:**
1. Pin A5 (CC) wtyku USB Type-C połączony z VBUS przez rezystor Rp (56 kΩ ±5%)
2. Kontakty B6 i B7 nie powinny być obecne we wtyku USB Type-C
3. Wszystkie piny VBUS połączone razem we wtyku USB Type-C
4. Wszystkie piny masy połączone razem we wtyku USB Type-C
5. Ekran i GND połączone we wtykach USB Type-C i USB 2.0 Standard-A
6. Wszystkie piny wtyku USB Type-C nie wymienione w tabeli są otwarte (niepodłączone)

---

## 17. Lokalizacja numeru seryjnego i PCC

Numer seryjny oraz kod konfiguracji produktu (PCC) znajdują się na etykiecie na spodzie drukarki (na baterii):

- **Serial Number (S/N)** – unikalny numer seryjny drukarki (z kodem kreskowym)
- **PCC** – 15-cyfrowy kod konfiguracji produktu (z kodem kreskowym)

> **Ważne:** Ze względu na ograniczenia celne i zgodność, integrator może nie być w stanie wysłać drukarki zakupionej w jednym kraju do innego kraju na podstawie ograniczeń narzuconych przez regionalne SKU. Kod kraju w SKU drukarki określa region świata, w którym można używać drukarki.

---

## 18. Kod QR informacji o produkcie

Kod QR na spodzie drukarki zawiera czytelny URL tekstowy (np. zebra.com/zq220plus-info), który kieruje użytkownika do informacji o drukarce i filmów na tematy takie jak:
- Zakup materiałów eksploatacyjnych
- Przegląd funkcji
- Ładowanie materiału
- Drukowanie raportu konfiguracyjnego
- Instrukcje czyszczenia
- Informacje o akcesoriach

---

## 19. Materiały eksploatacyjne

### Materiały do druku

Aby zapewnić maksymalną żywotność drukarki oraz stałą jakość i wydajność druku, zaleca się używanie wyłącznie materiałów produkowanych przez Zebra.

Zalety:
- Stała jakość i niezawodność produktów
- Szeroki zakres standardowych formatów
- Wewnętrzna usługa projektowania formatów niestandardowych
- Duże moce produkcyjne obsługujące potrzeby konsumentów na całym świecie
- Produkty spełniające lub przekraczające standardy branżowe

Więcej informacji: zebra.com – zakładka Products

### Materiały do konserwacji

- Pisak czyszczący (opakowanie 12 szt.): p/n 105950-035

---

## 20. Utylizacja

### Utylizacja baterii

Baterie Li-Ion należy utylizować zgodnie z lokalnymi przepisami dotyczącymi recyklingu. Nie wyrzucaj baterii do zwykłych odpadów komunalnych.

> **Ważne:** Przed utylizacją zaizoluj styki baterii taśmą.

### Utylizacja drukarki

Większość elementów drukarki nadaje się do recyklingu. Nie wyrzucaj żadnych elementów drukarki do niesortowanych odpadów komunalnych. Utylizuj baterię zgodnie z lokalnymi przepisami i poddaj recyklingowi pozostałe elementy drukarki zgodnie z lokalnymi standardami.

Więcej informacji: zebra.com/environment

---

## 21. Kontakt z pomocą techniczną

### Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce:**  
serwiszebra.pl

**Wsparcie techniczne Zebra:**  
zebra.com/contact

### Informacje wymagane przy zgłaszaniu problemu

Przy kontakcie z pomocą techniczną Zebra przygotuj następujące informacje:

- **Model drukarki** (np. ZQ220 Plus lub ZQ120 Plus)
- **Numer seryjny** (znajduje się na dużej etykiecie z tyłu drukarki, również na wydruku konfiguracyjnym)
- **Kod konfiguracji produktu (PCC)** – 15-cyfrowy numer na etykiecie z tyłu urządzenia

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies (P1129077-02EN Rev A).*  
*Wersja: 1.0 | Data: Styczeń 2025*
