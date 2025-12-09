# Kompletna baza wiedzy serwisowej Zebra TC22/TC27 i MC3400/MC3450

Zebra TC22/TC27 oraz MC3400/MC3450 to najnowsze generacje terminali mobilnych dla przemysłu, wprowadzone w 2023-2024 roku. TC22/TC27 zastąpiły serię TC21/TC26 z większym ekranem 6 cali i procesorem **2x szybszym**, podczas gdy MC3400/MC3450 to następcy MC3300x z **procesor 2.5x wydajniejszym** i wsparciem do Android 18. Obie rodziny oferują WiFi 6E, ulepszone skanery z zasięgiem do **40 stóp (SE55)** lub **100 stóp (SE58)**, oraz baterie z technologią BLE Beacon do lokalizacji zgubionych urządzeń.

---

## CZĘŚĆ I: ZEBRA TC22/TC27

### 1. Specyfikacje techniczne TC22/TC27

| Parametr | TC22 | TC27 |
|----------|------|------|
| **Ekran** | 6.0" Full HD+ 1080x2160, 402 ppi, Gorilla Glass | Identyczny |
| **Procesor** | Qualcomm QCM5430 Hex-Core 2.1 GHz | Identyczny |
| **RAM/Flash** | 6GB/64GB lub 8GB/128GB | Identyczny |
| **Bateria standardowa** | BTRY-TC2L-2XMAXX-01, 3800 mAh | Identyczny |
| **Bateria extended** | BTRY-TC2L-3XMAXX-01, 5200 mAh | Identyczny |
| **Silniki skanera** | SE4710 (standard) lub SE55 (advanced, do 12m) | Identyczny |
| **WiFi** | WiFi 6/6E (2.4/5/6 GHz) | Identyczny |
| **Bluetooth** | 5.2 BLE | Identyczny |
| **WWAN** | ❌ Brak | ✅ 5G + 4G LTE |
| **GPS** | ❌ Brak | ✅ GPS, GLONASS, Galileo, BeiDou |
| **SIM** | ❌ Brak | Nano SIM + eSIM |
| **IP Rating** | IP65/IP68 | IP65/IP68 |
| **Upadki** | 1.5m na beton z osłoną (MIL-STD-810H) | Identyczny |
| **Temperatura pracy** | -10°C do 50°C | Identyczny |
| **Temperatura ładowania** | 5°C do 40°C | Identyczny |
| **Android** | Android 13 → aktualizacje do Android 16 | Identyczny |

### 2. Problemy sprzętowe TC22/TC27 i rozwiązania

#### 2.1 Problemy z ekranem

**P: Ekran dotykowy nie reaguje lub reaguje z opóźnieniem.**
**O:** Sprawdź tryb panelu dotykowego w Settings → Display → Touch panel mode. Dostępne tryby:
- **Finger Only** (domyślny) - tylko palec
- **Finger and Glove** - obsługa rękawiczek (latex, skóra, bawełna, wełna)
- CIĘŻKIE rękawiczki outdoorowe mogą nie być wykrywane

**P: Ekran nie działa w rękawiczkach.**
**O:** Przełącz tryb: Settings → Display Settings → Touch Panel Mode → wybierz "Finger and Glove". Obsługiwane są rękawiczki lekkie i średnie (latex medyczny, skóra, bawełna, wełna).

**P: Ekran jest pęknięty - czy można naprawić?**
**O:** Wymiana ekranu wymaga serwisu autoryzowanego. Ekran chroniony jest szkłem Corning Gorilla Glass. Części zamienne LCD z digitizerem są dostępne (np. Amazon), ale wymiana samodzielna anuluje gwarancję.

**P: Na ekranie widoczne są martwe piksele.**
**O:** Martwe piksele mogą być wadą fabryczną lub skutkiem uszkodzenia. Jeśli urządzenie jest na gwarancji - zgłoś do serwisu. Pojedyncze martwe piksele mogą nie kwalifikować się do wymiany zgodnie z polityką Zebra.

#### 2.2 Problemy z baterią

**P: Bateria szybko się rozładowuje.**
**O:** Przyczyny i rozwiązania:
1. Zmniejsz jasność ekranu
2. Zamknij aplikacje działające w tle
3. Włącz Battery Saver Mode
4. Sprawdź zużycie baterii: Settings → Battery
5. Odinstaluj niepotrzebne aplikacje
6. Unikaj ekspozycji na słońce

**P: LED miga wolno na czerwono co 4 sekundy.**
**O:** Bateria osiągnęła koniec żywotności - **wymiana konieczna**. Zamów nową baterię:
- Standardowa: BTRY-TC2L-2XMAXX-01 (3800 mAh)
- Extended: BTRY-TC2L-3XMAXX-01 (5200 mAh)

**P: Urządzenie nie ładuje się - LED nie świeci.**
**O:** Sprawdź kolejno:
1. Czy urządzenie jest prawidłowo umieszczone w stacji dokującej
2. Czy zasilacz jest podłączony (PWR-BGA12V50W0WW dla 1-slot)
3. Czy kontakty pogo pins są czyste
4. Czy bateria jest prawidłowo włożona

**P: LED świeci na przemian czerwono i bursztynowo.**
**O:** Temperatura baterii jest poza zakresem dozwolonym dla ładowania (5-40°C). Poczekaj aż urządzenie osiągnie temperaturę pokojową.

**P: Ile trwa ładowanie baterii?**
**O:** 
- Bateria 3800 mAh: 0-80% w ~1h 20 min
- Bateria 5200 mAh: 0-80% w ~1h 50 min
- Ładowanie baterii zapasowej 0-90%: < 4 godziny

**P: Czy można wymienić baterię bez wyłączania urządzenia?**
**O:** Tak, baterie TC22/TC27 są "warm swappable". Wymień baterię w ciągu 30 sekund, aby zachować połączenie WiFi. Do 5 minut dane RAM są zachowane.

#### 2.3 Problemy ze skanerem

**P: Skaner nie działa / nie emituje wiązki.**
**O:** Sprawdź kolejno:
1. Czy DataWedge jest włączony (aplikacja DataWedge → zaznacz checkbox)
2. Czy aktywny profil ma włączony Scanner Input
3. Czy aplikacja jest powiązana z profilem DataWedge
4. Wykonaj restart urządzenia
5. Sprawdź aktualizacje LifeGuard

**P: Skaner skanuje podwójnie przy jednym naciśnięciu przycisku.**
**O:** Bug SPR-53548/53612 - naprawiony w wersji 13-34-23.00-TN-U00. Zaktualizuj firmware do najnowszej wersji LifeGuard.

**P: Skaner słabo czyta kody Enhanced Dot Data-matrix.**
**O:** Bug SPR-53808 - naprawiony w wersji 13-43-26.00-TN-U00.

**P: Jaka jest różnica między silnikami skanera SE4710 a SE55?**
**O:**
- **SE4710**: Standard range, zasięg kilka cm do ~60 cm, czerwony punkt celownika
- **SE55**: Advanced range, zasięg kilka cm do **40 stóp (12m)**, zielony celownik "dash-dot-dash", technologia IntelliFocus - idealny do wysokich regałów magazynowych

**P: Jak wyczyścić okno skanera?**
**O:** Użyj miękkiej, czystej ściereczki zwilżonej wodą lub izopropanolem (do 70%). NIE używaj środków ściernych.

#### 2.4 Problemy z ładowaniem i stacjami dokującymi

**P: Jakie stacje dokujące są kompatybilne z TC22/TC27?**
**O:**
- **1-Slot Charge Only**: CRD-TC2L-BS1CO-01
- **1-Slot USB Cradle**: CRD-TC2L-SE1ET-01 (ładowanie + USB)
- **1-Slot + Spare Battery**: CRD-TC2L-BS11B-01
- **5-Slot Charge Only**: CRD-TC2L-BS5CO-01
- **5-Slot Ethernet**: CRD-TC2L-SE5ET-01 (1Gbps Ethernet)
- **4-Slot Battery Charger**: SAC-TC2L-4SCHG-01

**P: Czy mogę użyć stacji dokującej z TC21/TC26?**
**O:** **NIE!** Stacje dokujące TC21/TC26 (SKU zawierające "TC2X") NIE są kompatybilne z TC22/TC27 (SKU zawierające "TC2L"). Jedyny wyjątek to ShareCradle - można wymienić tylko kubki na CRDCUP-TC2L1E-01.

**P: Jaki zasilacz jest wymagany?**
**O:**
- Dla 1-slot cradle: PWR-BGA12V50W0WW (50W)
- Dla 5-slot cradle: PWR-BGA12V108W0WW (108W)
- Kabel DC: CBL-DC-388A1-01

#### 2.5 Problemy z przyciskami

**P: Przycisk Home przestaje działać po pewnym czasie.**
**O:** Bug SPR-53473 (TC27) - naprawiony w wersji 13-34-23.00-TN-U00. Zaktualizuj firmware.

**P: Jak zaprogramować przyciski na TC22/TC27?**
**O:** Programowalne przyciski:
- **Scan Button** (bok) - domyślnie skanowanie
- **PTT Button** (bok) - Push-to-Talk
- **Volume +/-** - głośność

Konfiguracja: przez DataWedge, MX KeyMappingMgr lub StageNow.

#### 2.6 Uszkodzenia mechaniczne

**P: Urządzenie spadło - co sprawdzić?**
**O:** TC22/TC27 wytrzymują upadek z 1.5m na beton (z osłoną ochronną) lub 1.3m bez osłony. Po upadku sprawdź:
1. Ekran - pęknięcia, dotyk
2. Skaner - test skanowania
3. Bateria - czy prawidłowo siedzi w gnieździe
4. Przyciski - czy reagują
5. Uruchom Device Diagnostic Tool

**P: Jaką osłonę ochronną kupić?**
**O:** Rubber Boot: SG-TC2L-BOOT-01. Osłona jest wymagana do użycia trigger handle TRG-TC2L-SNP1-01.

### 3. Problemy softwareowe TC22/TC27

#### 3.1 Android i LifeGuard Updates

**P: Jaka wersja Android jest na TC22/TC27?**
**O:** Android 13 z fabryki. Gwarantowane aktualizacje do **Android 16**.

**P: Jak sprawdzić wersję firmware?**
**O:** Settings → About phone:
- Android version
- Android security patch level
- Build number (numer LifeGuard)

**P: Jak zaktualizować firmware?**
**O:** Metody aktualizacji:
1. **LifeGuard OTA** - automatycznie przez sieć (wymaga EMM)
2. **microSD** - pobierz ZIP z zebra.com/support, skopiuj na kartę, Recovery Mode → Apply upgrade from SD card
3. **ADB** - `adb sideload [plik.zip]`
4. **StageNow** - profil z aktualizacją

**⚠️ KRYTYCZNE OSTRZEŻENIE:** Wersje 13-34-23.00-TN-U00 i 13-36-10.00-TN-U00 zostały USUNIĘTE z powodu problemów. Jeśli masz te wersje:
1. NAJPIERW zainstaluj 13-39-18.00-TN-U00
2. DOPIERO POTEM aktualizuj do Android 14

**P: Jakie są najnowsze wersje LifeGuard dla TC22/TC27?**
**O:** Stan na grudzień 2025:
- **13-45-23.00-TN-U00** (Android 13, Security Patch: September 2025)
- **13-43-26.00-TN-U00** (August 2025)
- **13-40-29.00-TN-U00** (May 2025)

#### 3.2 DataWedge

**P: Jak włączyć DataWedge?**
**O:** 
1. Przesuń w górę z dolnej części ekranu
2. Znajdź aplikację DataWedge
3. Zaznacz checkbox "DataWedge enabled"

**P: Skaner działa, ale dane nie trafiają do aplikacji.**
**O:** Sprawdź konfigurację profilu:
1. Otwórz DataWedge
2. Wybierz profil (Profile0 lub dedykowany)
3. Sprawdź "Associated apps" - czy Twoja aplikacja jest dodana
4. Sprawdź "Keystroke Output" lub "Intent Output" - czy włączone

**P: Jak skonfigurować DataWedge dla mojej aplikacji?**
**O:**
1. Utwórz nowy profil (+)
2. Nadaj nazwę
3. Associated apps → dodaj pakiet aplikacji
4. Barcode Input → włącz Scanner
5. Keystroke Output → włącz (dane jako klawisze) LUB Intent Output → włącz (dane przez Intent)

**P: DataWedge pokazuje "Plugin not ready".**
**O:** Problem z uprawnieniami w Android 13+. Sprawdź czy aplikacja nie jest w Work Profile. Zrestartuj urządzenie.

#### 3.3 WiFi 6E

**P: Jak skonfigurować WiFi?**
**O:** Settings → Network & Internet → Wi-Fi → wybierz sieć → wprowadź hasło

**P: WiFi często się rozłącza.**
**O:** Sprawdź:
1. Czy Airplane Mode jest wyłączony
2. Siłę sygnału (powyżej -70 dBm zalecane)
3. Konfigurację roamingu (dla magazynów z wieloma AP)
4. Ustawienia Fusion (WiFi Preferences → Advanced)

**P: Jak poprawić roaming WiFi?**
**O:** Ustawienia Fusion (Settings → WiFi → Preferences → Advanced):
- Włącz Fast Transition (802.11r)
- Włącz OKC (Opportunistic Key Caching)
- Dostosuj Roam RSSI Threshold (domyślnie -65 dBm)
- Włącz 802.11k/v support

**P: TC22/TC27 obsługuje WiFi 6GHz?**
**O:** Tak, TC22/TC27 obsługują WiFi 6E (pasma 2.4/5.0/6.0 GHz).

#### 3.4 Bluetooth

**P: Jak sparować skaner pierścieniowy RS5100/RS6100?**
**O:** Metody parowania:
1. **NFC Tap-to-Pair**: Zbliż ikonę NFC na skanerze do ikony NFC na urządzeniu (wymaga konfiguracji z NFC)
2. **SSI Mode**: W DataWedge → Bluetooth Scanner → zeskanuj barcode parowania z etykiety skanera
3. **HID Mode**: Settings → Connected devices → Pair new device → wybierz skaner

**P: Bluetooth rozłącza się losowo.**
**O:**
1. Sprawdź odległość (max 10m dla Class 2)
2. Sprawdź poziom baterii skanera/słuchawek
3. Usuń parowanie i sparuj ponownie
4. Zaktualizuj firmware skanera

#### 3.5 Factory Reset i Recovery Mode

**P: Jak wejść w Recovery Mode na TC22/TC27?**
**O:** **DOKŁADNA PROCEDURA:**
1. Naciśnij i przytrzymaj **Power** aż pojawi się menu
2. Wybierz **Restart**
3. Natychmiast po restarcie naciśnij i przytrzymaj **przycisk PTT**
4. Trzymaj PTT aż urządzenie zawibruje
5. Pojawi się ekran System Recovery

**Alternatywnie (urządzenie wyłączone):** Power + Volume Down, zwolnij po logo Zebra.

**P: Jak wykonać Factory Reset?**
**O:** 
**Metoda 1 - z Recovery Mode:**
1. Wejdź w Recovery Mode (procedura powyżej)
2. Volume Up/Down → nawiguj do "Wipe data/factory reset"
3. Power → potwierdź
4. Wybierz "Yes"
5. Po zakończeniu wybierz "Reboot system now"

**Metoda 2 - z Settings:**
Settings → Backup & Reset → Factory Data Reset

**P: Jaka jest różnica między Enterprise Reset a Factory Reset?**
**O:**
| Aspekt | Enterprise Reset | Factory Reset |
|--------|------------------|---------------|
| /data | USUWA | USUWA |
| /enterprise | ZACHOWUJE | USUWA |
| Konfiguracja MDM | MOŻE BYĆ ZACHOWANA | USUWA |
| Certyfikaty | ZACHOWUJE | USUWA |

**P: Jak wykonać Hard Reset gdy urządzenie nie odpowiada?**
**O:** Naciśnij jednocześnie: **Power + Lewy Scan + Volume Up** przez minimum 4 sekundy. Gdy ekran zgaśnie - puść przyciski.

#### 3.6 MDM Enrollment

**P: Jakie systemy MDM obsługują TC22/TC27?**
**O:** SOTI MobiControl, VMware Workspace ONE, Microsoft Intune, 42Gears SureMDM, MobileIron, i inne z Android Enterprise.

**P: Jak wykonać Zero-Touch Enrollment?**
**O:** Urządzenie musi być zakupione przez autoryzowanego resellera z konfiguracją zero-touch. Po pierwszym włączeniu urządzenie automatycznie łączy się z MDM.

**P: Jak wykonać enrollment przez StageNow?**
**O:**
1. Utwórz profil w StageNow (XpertConfig)
2. Dodaj: WiFi Manager, FileMgr (pobierz APK), AppMgr (instaluj), Intent (Device Owner enrollment)
3. Wygeneruj barcode
4. Zeskanuj podczas Setup Wizard

### 4. Kody błędów i LED TC22/TC27

#### 4.1 Wskaźniki LED

| LED | Kolor/Stan | Znaczenie |
|-----|------------|-----------|
| Ładowanie | Brak | Nie ładuje - złe położenie lub brak zasilania |
| Ładowanie | Bursztynowy stały | Ładowanie w toku |
| Ładowanie | Zielony stały | Naładowane 100% |
| Ładowanie | Czerwony wolno migający (co 4s) | **Bateria do wymiany** |
| Ładowanie | Czerwony/Bursztynowy naprzemiennie | Temperatura poza zakresem |
| Skanowanie | Zielony błysk | Kod zdekodowany poprawnie |
| Skanowanie | Czerwony błysk | Błąd dekodowania |

#### 4.2 Kody błędów DataWedge

| Kod | Znaczenie | Rozwiązanie |
|-----|-----------|-------------|
| DATAWEDGE_DISABLED | DataWedge wyłączony | Włącz w aplikacji DataWedge |
| PROFILE_DISABLED | Profil nieaktywny | Aktywuj profil |
| SCANNER_NOT_INITIALIZED | Skaner nie zainicjowany | Restart urządzenia |
| PLUGIN_NOT_READY | Problem z uprawnieniami | Sprawdź Work Profile, restart |
| PROFILE_NOT_FOUND | Profil nie istnieje | Utwórz profil |
| APP_ALREADY_ASSOCIATED | Aplikacja w innym profilu | Usuń powiązanie z poprzedniego |

### 5. Akcesoria TC22/TC27

#### 5.1 Kompatybilne akcesoria

| Kategoria | Numer części | Opis |
|-----------|--------------|------|
| **Stacja 1-slot** | CRD-TC2L-SE1ET-01 | USB + ładowanie |
| **Stacja 5-slot** | CRD-TC2L-BS5CO-01 | 5 urządzeń |
| **Ładowarka baterii** | SAC-TC2L-4SCHG-01 | 4 zapasowe baterie |
| **Bateria standard** | BTRY-TC2L-2XMAXX-01 | 3800 mAh |
| **Bateria extended** | BTRY-TC2L-3XMAXX-01 | 5200 mAh |
| **Rubber boot** | SG-TC2L-BOOT-01 | Osłona ochronna |
| **Trigger handle** | TRG-TC2L-SNP1-01 | Uchwyt pistoletowy (wymaga boot) |
| **Holster** | SG-TC2L-HLSTR1-01 | Kabura |
| **Hand strap** | SG-TC2L-HDSTPD-01 | Pasek na rękę |
| **Wrist mount** | SG-TC2L-WMADP1-01 | Mocowanie na nadgarstek BOA |

#### 5.2 Kompatybilność wsteczna z TC21/TC26

**⚠️ BRAK KOMPATYBILNOŚCI WSTECZNEJ!**

Akcesoria TC21/TC26 (SKU z "TC2X") **NIE SĄ** kompatybilne z TC22/TC27 (SKU z "TC2L"). Form factor się zmienił.

**Jedyny wyjątek:** ShareCradle - można wymienić kubki (CRDCUP-TC2L4B-01).

---

## CZĘŚĆ II: ZEBRA MC3400/MC3450

### 1. Specyfikacje techniczne MC3400/MC3450

| Parametr | MC3400 | MC3450 |
|----------|--------|--------|
| **Ekran** | 4.0" WVGA 800x480, 350/600 NITS, Gorilla Glass | Identyczny |
| **Procesor** | Qualcomm 4490 Octa-Core 2.4 GHz | Identyczny |
| **RAM/Flash** | 4GB/64GB, 6GB/64GB lub 6GB/128GB | 6GB/64GB lub 6GB/128GB |
| **Bateria** | BTRY-MC3X-70MA-01, 7000 mAh | Identyczny |
| **Klawiatury** | 29-key, 38-key, 47-key | Identyczny |
| **Form factor** | Gun lub Straight Shooter | Identyczny |
| **Silniki skanera** | SE4710, SE4770, SE55, SE58 | Identyczny |
| **WiFi** | WiFi 6E (2.4/5/6 GHz) | Identyczny |
| **Bluetooth** | 5.3 BLE | Identyczny |
| **WWAN** | ❌ Brak | ✅ 5G + LTE (data only) |
| **GPS** | ❌ Brak | ✅ GPS, GLONASS, Galileo |
| **SIM** | ❌ Brak | Nano SIM + eSIM |
| **IP Rating** | IP65 + IP67 | Identyczny |
| **Upadki** | 2.4m na beton (+23°C), 1.8m przez cały zakres temp. | Identyczny |
| **Temperatura pracy** | -20°C do 50°C | Identyczny |
| **Temperatura ładowania** | 0°C do 45°C | Identyczny |
| **Android** | Android 11 → do Android 18 | Identyczny |

### 2. Problemy sprzętowe MC3400/MC3450

#### 2.1 Problemy z ekranem

**P: Jak ustawić tryb dotykowy dla rękawiczek na MC3400?**
**O:** Settings → Display → Touch panel mode:
- Finger Only (domyślny)
- Stylus and Finger
- **Glove and Finger** (bez folii ochronnej)
- Glove and Finger (z folią ochronną)

**P: Ekran ma niską jasność.**
**O:** Sprawdź tier urządzenia:
- **Standard Tier**: 350 NITS
- **Expanded/Full Tier**: 600 NITS

#### 2.2 Problemy z klawiaturą

**P: Jakie klawiatury są dostępne dla MC3400?**
**O:**
- **29-key** - numeryczna
- **38-key** - funkcjonalna numeryczna
- **47-key** - alfanumeryczna

Klawisze MC3400 są **12% większe** niż w MC3300x, z większą przestrzenią między nimi.

**P: Jak remapować klawisze?**
**O:** Settings → System → Key Mapping (lub Key Programmer)
Programowalne: GRIP_TRIGGER, SCAN, P1, DIAMOND, LEFT/RIGHT_TRIGGER_1, 0-9, A-Z, F1-F10, ENTER, ESC
NIE programowalne: POWER, BACK, HOME, RECENT (wirtualne)

**P: Jak wprowadzać litery na klawiaturze numerycznej?**
**O:** Naciśnij ORANGE lub BLUE, następnie odpowiedni klawisz numeryczny. Tryby: Normal, SHIFT, CTRL, ALT, BLUE, ORANGE.

#### 2.3 Problemy z baterią

**P: Jaka bateria jest w MC3400/MC3450?**
**O:** 
- **Główna**: BTRY-MC3X-70MA-01, 7000 mAh, 25.20 Wh
- **Z BLE Beacon**: BTRY-MC3X-7BLE-01, 7000 mAh (lokalizacja Device Tracker)

**P: Czy baterie z MC33/MC3300x są kompatybilne?**
**O:** **TAK**, ale z ograniczeniami:
- Bateria 5200 mAh z MC33 **obniża klasę IP** z IP65/IP67 do **tylko IP65**
- Baterie MC34 (7000 mAh) są też kompatybilne wstecznie z MC3300x

**P: Ile trwa ładowanie baterii MC3400?**
**O:**
- 7000 mAh: **4.5 godziny** do 100%
- 5200 mAh: **3.5 godziny** do 100%

**P: Jak działa Hot Swap na MC3400?**
**O:**
- **30 sekund**: zachowanie połączenia WiFi (LED miga bursztynowo)
- **~5 minut**: zachowanie danych RAM

**Procedura wymiany baterii (Gun):**
1. Poluzuj pasek na dłoń
2. Naciśnij dwa przyciski zwalniające
3. Wyjmij starą baterię
4. Włóż nową, wyrównując
5. Wciśnij mocno do zatrzaśnięcia

#### 2.4 Problemy ze skanerem

**P: Jakie silniki skanera są dostępne dla MC3400?**
**O:**
- **SE4710**: Standard range, skanowanie bliskie
- **SE4770**: Standard range z **czerwonym laserem**, praca wewnątrz/zewnątrz
- **SE55**: Advanced range, do **12.2m (40 ft)**, IntelliFocus
- **SE58**: Extended range, do **30.5m (100 ft)**, **zielony laser 7x lepiej widoczny**

**P: Który silnik skanera wybrać?**
**O:**
- **SE4710/SE4770**: Retail, standardowe magazyny
- **SE55**: Magazyny z wysokimi regałami (do 12m)
- **SE58**: Porty, place kontenerowe, bardzo duże odległości (do 30m)

**P: Jak włączyć Picklist Mode?**
**O:** DataWedge → profil → Reader params → Picklist → Enable. Celownik musi dotykać wybranego kodu.

#### 2.5 Problemy z ładowaniem i stacjami

**P: Jakie stacje dokujące są kompatybilne z MC3400?**
**O:**
- **1-Slot USB + Battery**: CRD-MC33-2SUCHG-01
- **5-Slot Charge Only**: CRD-MC33-5SCHG-01
- **5-Slot Ethernet**: CRD-MC33-5SETH-01 (1Gbps)
- **4-Slot + 4 baterie**: CRD-MC33-4SC4BC-01
- **Ładowarka baterii**: SAC-MC3X-4SCHG-01 (4 baterie)

**P: Czy stacje z MC33/MC3300x są kompatybilne?**
**O:** **TAK!** Wszystkie stacje dokujące, ładowarki i większość akcesoriów MC33 są kompatybilne z MC3400.

#### 2.6 Wskaźniki LED MC3400

| LED | Kolor/Stan | Znaczenie |
|-----|------------|-----------|
| Ładowanie | Brak | Nie ładuje |
| Ładowanie | Bursztynowy stały | Ładowanie w toku |
| Ładowanie | Bursztynowy migający | Hot Swap - sesja WiFi aktywna |
| Ładowanie | Zielony stały | Naładowane 100% |
| Ładowanie | Czerwony stały | Błąd ładowania |
| Ładowanie | Czerwony szybko miga (2x/s) | Temperatura za niska/wysoka lub ładowanie >8h |
| Ładowanie | Niebieski migający | Powiadomienie aplikacji |

### 3. Problemy softwareowe MC3400/MC3450

#### 3.1 Android i LifeGuard

**P: Jaka wersja Android jest na MC3400?**
**O:** Android 11 (fabrycznie), aktualizacje przez Android 13, 14. Wsparcie do **Android 18** (Full/Expanded Tier).

**P: Jaka jest najnowsza wersja firmware?**
**O:** 14-15-22.00-UG-U40-STD (Android 14, Security Patch: June 2025)

**P: Znane problemy w Android 14 na MC3400:**
**O:**
- Delta OTA nie działają w Recovery Mode - użyj StageNow/MDM
- 4K video nie obsługiwane przez natywny player
- NFC HCE nie obsługiwane na niektórych modelach
- MC3450 carrier approvals AT&T/Verizon: w trakcie (szacowane: wrzesień 2025)

#### 3.2 Recovery Mode MC3400

**P: Jak wejść w Recovery Mode na MC3400?**
**O:** **DOKŁADNA PROCEDURA:**
1. Wyłącz urządzenie
2. Naciśnij jednocześnie: **Power + Scan (górny) + Volume Up**
3. Trzymaj do pojawienia się Recovery
4. Nawiguj Volume buttons, potwierdź Power/Enter

**P: Jak wykonać Factory Reset na MC3400?**
**O:**
1. Wejdź w Recovery Mode
2. Wybierz "Wipe data/factory reset"
3. Potwierdź "Yes"
4. Wybierz "Reboot system now"

**P: Jak wykonać Hard Reset na MC3400?**
**O:** Przytrzymaj **Power przez 10-12 sekund**. Urządzenie zrestartuje się (NIE kasuje danych).

#### 3.3 RxLogger - Diagnostyka

**P: Jak uruchomić RxLogger na MC3400?**
**O:**
1. Przesuń w górę z dołu ekranu
2. Otwórz RxLogger
3. Dotknij "Start"

**P: Jak pobrać logi z RxLogger?**
**O:**
1. Podłącz USB do PC
2. Wybierz "File Transfer"
3. Nawiguj do /sdcard/RxLogger/
4. Skopiuj pliki logów

**P: Jak włączyć Chat Head RxLogger?**
**O:** RxLogger → Menu → Toggle Chat Head. Pojawi się pływająca ikona do podglądu logów.

### 4. Akcesoria MC3400/MC3450

#### 4.1 Kompatybilne akcesoria

| Kategoria | Numer części | Opis |
|-----------|--------------|------|
| **Stacja 1-slot** | CRD-MC33-2SUCHG-01 | USB + spare battery |
| **Stacja 5-slot** | CRD-MC33-5SCHG-01 | Charge only |
| **Stacja 5-slot Ethernet** | CRD-MC33-5SETH-01 | 1Gbps |
| **Ładowarka baterii** | SAC-MC3X-4SCHG-01 | 4 baterie |
| **Bateria 7000mAh** | BTRY-MC3X-70MA-01 | Extended capacity |
| **Bateria BLE** | BTRY-MC3X-7BLE-01 | Z Device Tracker |
| **Rubber boot Gun** | SG-MC34-RBSTG-01 | Ochrona Gun |
| **Rubber boot Brick** | SG-MC34-RBSTS-01 | Ochrona Straight Shooter |
| **Hand strap Gun** | SG-MC34-HDSTPG-01 | Pasek Gun |
| **Hand strap Brick** | SG-MC34-HDSTPS-01 | Pasek Straight Shooter |
| **Holster** | SG-MC3021212-01R | Kabura fabric |

#### 4.2 Kompatybilność wsteczna z MC33/MC3300x

**✅ DOSKONAŁA KOMPATYBILNOŚĆ WSTECZNA!**

**Kompatybilne:**
- ✅ Wszystkie stacje dokujące
- ✅ Baterie (MC34 też działa z MC3300x)
- ✅ Ładowarki baterii
- ✅ Holstery
- ✅ Hand straps
- ✅ Kable USB
- ✅ Vehicle mounts

**NIE kompatybilne:**
- ❌ Rubber boot (nowy design)
- ❌ Tempered glass screen protector (inny wymiar)

---

## CZĘŚĆ III: SKANERY PIERŚCIENIOWE RS5100/RS6100

### Kompatybilność

| Skaner | TC22/TC27 | MC3400/MC3450 |
|--------|-----------|---------------|
| RS5100 | ✅ | ✅ |
| RS6100 | ✅ | ✅ |
| RS6000 | ✅ | ✅ |
| DS3678 | ✅ | ✅ |
| DS8178 | ✅ | ✅ |

### Metody parowania RS5100/RS6100

**1. NFC Tap-to-Pair:**
- Włącz NFC na urządzeniu (Settings → Connected devices → NFC)
- Zbliż ikonę NFC na skanerze do NFC na urządzeniu
- LED miga niebiesko → gaśnie = połączono

**2. SSI Mode (DataWedge):**
- Otwórz Bluetooth Pairing Utility
- Zeskanuj barcode parowania z etykiety skanera
- Sygnał dźwiękowy low/high = połączono

**3. HID Mode:**
- Zresetuj skaner do HID (skanuj barcode HID)
- Settings → Connected devices → Pair new device
- Wybierz skaner z listy

---

## CZĘŚĆ IV: PROCEDURY SERWISOWE

### Sprawdzanie numeru seryjnego

**TC22/TC27:**
1. Settings → About phone → Model & hardware → Serial number
2. Lub wpisz *#06# w dialerze
3. Lub sprawdź etykietę pod baterią

**MC3400/MC3450:**
1. Settings → About phone → Serial number
2. Lub przeciągnij Status bar → ⚙ → Model

### Sprawdzanie IMEI (TC27/MC3450)

Settings → About phone → IMEI
Lub wpisz *#06# w dialerze

### Sprawdzanie stanu gwarancji

1. Wejdź na zebra.com/warranty
2. Wprowadź numer seryjny
3. Wyświetli się status i data końca gwarancji

### Device Diagnostic Tool (DDT)

**Dostępne testy:**
- Scanner Test
- Button Test
- Touch Screen Test
- Bluetooth Test
- WiFi Test
- Battery Test
- WWAN Test (TC27/MC3450)
- Audio Test
- SD Card Test
- USB Test
- Camera Test

**Interpretacja wyników:**
- **Pass** (zielony ✓) - test zaliczony
- **Fail** (czerwony ⚠) - problem wykryty
- **Timed-out** - przekroczony czas

### Czyszczenie urządzenia

**Dozwolone środki:**
- Izopropanol (do 70%)
- Wybielacz (rozcieńczony 1:10)
- Środki na bazie amoniaku
- Miękka ściereczka

**NIE używać:**
- Środków ściernych
- Rozpuszczalników
- Bezpośredniego strumienia wody

---

## CZĘŚĆ V: ZNANE BUGI I WORKAROUNDY

### TC22/TC27 - Naprawione bugi

| SPR | Problem | Wersja naprawy |
|-----|---------|----------------|
| SPR-55766 | Mikrofon zbiera nadmierny szum | 13-39-18.00 |
| SPR-53548 | Double decode przy skanowaniu | 13-34-23.00 |
| SPR-53473 | Przycisk Home przestaje działać (TC27) | 13-34-23.00 |
| SPR-54873 | Problem detekcji SIM - tylko emergency calls | 13-45-23.00 |
| SPR-56213 | Boot loop po aktywacji eSIM | 13-45-23.00 |
| SPR-53808 | Słabe skanowanie Enhanced Dot Data-matrix | 13-43-26.00 |

### Problemy z roamingiem WiFi - najczęstszy problem

**Objawy:** Częste rozłączenia, opóźnienia 3-6s przy zmianie AP

**Rozwiązania:**
1. Site survey - zapewnij pokrycie sygnału
2. Włącz 802.11r/k/v na kontrolerze i urządzeniu
3. Dostosuj Roam RSSI Threshold w Fusion
4. Włącz "avoid poor connections" w Android WiFi
5. Rozważ licencję Mobility DNA Enterprise dla Fusion analytics

### Problemy z zimnym magazynem

**⚠️ TC22/TC27 i MC3400/MC3450 NIE są freezer-rated!**

Dla zimnych magazynów (-30°C) użyj:
- MC9300/MC9400 Freezer Grade
- Podgrzewane wyświetlacze i okienka skanera
- Baterie rated dla zimna

---

## CZĘŚĆ VI: PYTANIA KLIENTÓW - QUICK REFERENCE

### Najczęstsze pytania TC22/TC27

| Pytanie | Krótka odpowiedź |
|---------|------------------|
| Czy akcesoria z TC21 pasują? | NIE - nowy form factor |
| Jaki zasięg skanera SE55? | Do 40 stóp (12m) |
| Ile trwa ładowanie? | 80 min do 80% (bateria 3800mAh) |
| Jak wejść w Recovery? | Power → Restart → trzymaj PTT |
| Jaka wersja Android? | Android 13, aktualizacje do A16 |

### Najczęstsze pytania MC3400/MC3450

| Pytanie | Krótka odpowiedź |
|---------|------------------|
| Czy akcesoria z MC33 pasują? | TAK (oprócz boot i screen protector) |
| Jaki zasięg skanera SE58? | Do 100 stóp (30m) |
| Ile trwa ładowanie? | 4.5h do 100% (bateria 7000mAh) |
| Jak wejść w Recovery? | Power + Scan + Volume Up |
| Jaka wersja Android? | Android 11-14, aktualizacje do A18 |

---

## KONTAKT Z SUPPORTEM ZEBRA

**Strona wsparcia:** zebra.com/support
**TechDocs:** techdocs.zebra.com
**Developer Portal:** developer.zebra.com
**Support Community:** supportcommunity.zebra.com

**Wymagane informacje przy zgłoszeniu:**
1. Model urządzenia (TC22/TC27/MC3400/MC3450)
2. Numer seryjny
3. Wersja Android i Build number
4. Opis problemu
5. Wyniki DDT (jeśli możliwe)
6. Logi (logcat, RxLogger)

---

*Dokumentacja opracowana na podstawie oficjalnej dokumentacji Zebra TechDocs, Product Reference Guides, LifeGuard Release Notes i Zebra Support Community. Stan na grudzień 2025.*