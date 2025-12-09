# Kompletna dokumentacja serwisowa Zebra TC58 dla serwiszebra.pl

Terminal mobilny Zebra TC58 to flagowe urządzenie WWAN serii TC5x, wyposażone w procesor Qualcomm 6490 (2.7 GHz), wyświetlacz 6" Full HD+, łączność 5G/LTE oraz Wi-Fi 6E. Urządzenie jest powszechnie stosowane przez polskich kurierów w firmach DHL, InPost, DPD i GLS. Niniejsza dokumentacja zawiera **wszystkie znane problemy serwisowe**, procedury naprawcze i odpowiedzi na pytania klientów w języku polskim.

---

## SPECYFIKACJE TECHNICZNE TC58

### Podstawowe parametry sprzętowe

| Parametr | Specyfikacja |
|----------|--------------|
| Procesor | Qualcomm 6490, 8-rdzeniowy, 2.7 GHz |
| RAM | 4 GB / 6 GB / 8 GB (w zależności od SKU) |
| Pamięć wewnętrzna | 64 GB / 128 GB UFS |
| Slot microSD | Do 2 TB |
| Wyświetlacz | 6.0" LCD, 1080×2160 (Full HD+), 600 nitów |
| Szkło ochronne | Corning Gorilla Glass 5 |
| Wymiary | 164.8 × 77.35 × 16.75 mm |
| Waga | 293 g (z baterią standardową) |
| Klasa IP | IP68 (zanurzenie 1.5m/30 min) + IP65 |
| Upadki | 1.8 m na beton (z etui), 1.5 m bez etui |
| Temperatura pracy | -20°C do +50°C |

### Baterie dostępne dla TC58

| Numer części | Typ | Pojemność | Funkcje specjalne |
|--------------|-----|-----------|-------------------|
| BTRY-NGTC5TC7-44MA-01 | Standardowa | 4,680 mAh | PowerPrecision+ |
| BTRY-NGTC5TC7-44MABLE-01 | Standardowa + BLE | 4,680 mAh | Beacon do lokalizacji |
| BTRY-NGTC5TC7-44MAWC-01 | Bezprzewodowe ładowanie | 4,680 mAh | Qi charging (tylko Premium SKU) |
| BTRY-NGTC5TC7-66MA-01 | Rozszerzona | 7,000 mAh | Dłuższy czas pracy |

**Czasy ładowania:**
- 0-90%: ~2 godziny (w urządzeniu), ~2.5 h (bateria zapasowa)
- 0-100%: ~3 godziny (w urządzeniu), ~3.5 h (bateria zapasowa)

### Silniki skanera

| Silnik | Zasięg | Charakterystyka |
|--------|--------|-----------------|
| **SE4720** | Do 60 cm | Standardowy, zielony celownik LED, idealny dla kurierów |
| **SE55** | 5.6 cm do 12.2 m | Zaawansowany IntelliFocus™, zielony laser 7× lepiej widoczny |

### Łączność

- **WiFi**: 802.11 a/b/g/n/ac/ax (Wi-Fi 6E), 2.4/5/6 GHz, 2×2 MU-MIMO
- **Bluetooth**: 5.2 (Class 2), BLE Beaconing
- **5G**: FR1 n1/2/3/5/7/8/20/28/38/40/41/77/78 (ROW)
- **4G LTE**: Pełne pokrycie pasm europejskich
- **GPS**: GPS, GLONASS, Galileo, Beidou, QZSS, Dual-Band GNSS (L1+L5)
- **NFC**: ISO 14443 A/B, Apple VAS, Google Smart Tap

### Wersje Android

- **Fabryczny**: Android 11
- **Aktualizacje**: Android 13, Android 14
- **Przyszłe wsparcie**: Android 16 (potwierdzony upgrade path)

---

## RÓŻNICE MIĘDZY MODELAMI SERII TC5x

### TC58 vs TC52

| Cecha | TC58 | TC52 |
|-------|------|------|
| Łączność | 5G + Wi-Fi 6E | Tylko Wi-Fi (802.11ac) |
| Procesor | Qualcomm 6490 @ 2.7 GHz | Snapdragon 660 @ 2.2 GHz |
| Wyświetlacz | 6.0" FHD+ | 5.0" FHD |
| RAM/Pamięć | Do 8GB/128GB | 4GB/32GB |
| microSD | Do 2 TB | Do 256 GB |
| Aparat | 16 MP | 13 MP |

### TC58 vs TC57

| Cecha | TC58 | TC57 |
|-------|------|------|
| Sieć komórkowa | 5G FR1 | Tylko 4G LTE |
| Wi-Fi | Wi-Fi 6E | 802.11ac |
| Wyświetlacz | 6.0" | 5.0" |
| Silniki skanera | SE4720, SE55 | Tylko SE4720 |
| Time of Flight | Tak (Premium SKU) | Nie |

### TC58 vs TC53

| Cecha | TC58 | TC53 |
|-------|------|------|
| Łączność komórkowa | 5G/LTE + GPS | Brak (tylko Wi-Fi) |
| Przeznaczenie | Praca w terenie | Praca wewnątrz budynków |
| Reszta specyfikacji | Identyczna | Identyczna |

**Kompatybilność akcesoriów**: TC53 i TC58 współdzielą wszystkie akcesoria (stacje dokujące, etui, uchwyty, baterie).

---

## PYTANIA I ODPOWIEDZI - PROBLEMY SPRZĘTOWE

### Problemy z ekranem

**P: Ekran dotykowy TC58 nie reaguje na dotyk. Co robić?**

O: Wykonaj następujące kroki:
1. Wyczyść ekran miękką ściereczką z mikrofibry
2. Wykonaj miękki reset: przytrzymaj przycisk zasilania 10-15 sekund
3. Sprawdź ustawienia Touch Panel Mode w Settings > Display
4. Wykonaj twardy reset: przytrzymaj jednocześnie Power + PTT, zwolnij Power trzymając PTT
5. Jeśli problem nie ustępuje - kontakt z serwisem (uszkodzenie hardware)

**P: Jak skonfigurować ekran do pracy w rękawiczkach?**

O: Przejdź do Settings > Display > Touch Panel Mode i wybierz:
- **Glove and Finger (Screen Protector OFF)** - dla rękawiczek bez folii
- **Glove and Finger (Screen Protector ON)** - dla rękawiczek z folią ochronną

Obsługiwane są rękawiczki lateksowe, skórzane, bawełniane i wełniane.

**P: Ekran TC58 jest słabo widoczny w słońcu. Jak to poprawić?**

O: TC58 ma jasność 600 nitów, co zapewnia dobrą widoczność na zewnątrz. Zalecenia:
- Użyj matowej folii antyrefleksyjnej (Zebra SG-NGTC5-SCRNP-03)
- Zwiększ jasność ekranu w ustawieniach
- Wyświetlacz jest optycznie bondowany, co redukuje odbicia wewnętrzne

**P: Mam problem z duchowymi dotykami (ghost touch) na TC58.**

O: Rozwiązanie:
1. Dokładnie wyczyść ekran
2. Zdejmij folię ochronną i przetestuj
3. Dostosuj czułość dotyku w ustawieniach
4. Sprawdź ustawienia Water droplet rejection
5. Wykonaj factory reset jeśli problem jest softwarowy
6. Jeśli problem się powtarza - uszkodzenie sprzętowe, wymagana naprawa

### Problemy z baterią

**P: Bateria TC58 się nie ładuje. Co sprawdzić?**

O: Sprawdź kolejno:
1. **Złącze ładowania** - wyczyść port USB-C sprężonym powietrzem
2. **Pozycja w stacji dokującej** - upewnij się, że pogo piny mają kontakt
3. **Kabel/ładowarka** - wymagane minimum 9V/2A
4. **Temperatura** - ładowanie działa tylko w zakresie 0°C do 50°C

**P: Bateria TC58 szybko się rozładowuje. Jak to naprawić?**

O: Optymalizacja baterii:
1. Zmniejsz jasność ekranu
2. Wyłącz WiFi/Bluetooth gdy nie są używane
3. Zamknij aplikacje w tle
4. Wyłącz nieużywane funkcje (GPS)
5. Włącz tryb oszczędzania baterii
6. Skróć czas wygaszania ekranu
7. Sprawdź Battery Manager - które aplikacje zużywają najwięcej energii

**P: Co oznaczają kolory diody LED podczas ładowania TC58?**

O: Znaczenie wskaźników LED:

| Stan LED | Znaczenie |
|----------|-----------|
| Migająca bursztynowa | Ładowanie w toku |
| Stała zielona | W pełni naładowana |
| Stała bursztynowa (wolne mig.) | Temperatura za niska lub za wysoka |
| Wyłączona | Brak ładowania/połączenia |
| Czerwona | Błąd krytyczny baterii |
| Migająca co 4 sek. (czerwona) | Bateria wymaga wymiany |

**P: Jak wykonać Hot Swap baterii w TC58?**

O: Procedura Hot Swap (tylko Premium SKU):
1. Naciśnij przycisk Power aż pojawi się menu
2. Wybierz **Battery Swap**
3. Postępuj zgodnie z instrukcjami na ekranie
4. **WAŻNE**: NIE wyjmuj baterii dopóki czerwona dioda LED całkowicie nie zgaśnie
5. Urządzenie pozostaje aktywne przez pierwsze 30 sekund
6. Memory Persistence Mode trwa minimum 60 sekund
7. Włóż nową baterię dolną krawędzią w przegrodę
8. Dociśnij aż zatrzaski się zamkną

**P: Jak sprawdzić stan zdrowia baterii w TC58?**

O: Otwórz aplikację Battery Manager lub Device Diagnostic Tool:
- **Good** - bateria działa prawidłowo
- **Decommission** - bateria przeterminowana, wymień
- **Charge error** - skontaktuj się z administratorem
- **Dead** - bateria całkowicie rozładowana, wymień

PowerPrecision+ pokazuje: napięcie (mV), temperaturę, datę produkcji, numer seryjny, liczbę cykli ładowania.

**P: Bateria TC58 jest spuchnięta. Co robić?**

O: **NATYCHMIAST przestań używać baterii!** Nie ładuj i nie wkładaj spuchniętej baterii do urządzenia. Zutylizuj przez odpowiedni kanał utylizacji odpadów niebezpiecznych. Skontaktuj się z Zebra Support po wymianę.

### Problemy ze skanerem

**P: Skaner TC58 nie czyta kodów kreskowych. Jak to naprawić?**

O: Kroki diagnostyczne:
1. Wyczyść okienko skanera ściereczką z mikrofibry
2. Zrestartuj urządzenie
3. Sprawdź czy właściwa aplikacja skanująca jest aktywna
4. Zweryfikuj czy typ kodu jest włączony w konfiguracji skanera
5. Przetestuj na innych kodach kreskowych
6. Sprawdź poziom baterii (niski poziom wpływa na skaner)
7. Zresetuj ustawienia skanera do fabrycznych

**P: Jaka jest różnica między silnikami SE4720 a SE55 w TC58?**

O: Porównanie silników:

| Cecha | SE4720 | SE55 |
|-------|--------|------|
| Celownik | Zielona dioda LED | Zielony laser (7× lepiej widoczny) |
| Zasięg | Do 60 cm | 5.6 cm do 12.2 m |
| Zastosowanie | Standard, kurierzy | Magazyn, duże odległości |
| Sensor | Megapikselowy | 4 MP (możliwość robienia zdjęć) |
| Technologia | PRZM Intelligent Imaging | IntelliFocus™ z autofokusem |

**P: Skaner TC58 skanuje wolno. Co zrobić?**

O: Rozwiązania:
1. Zaktualizuj firmware do najnowszej wersji
2. Wyczyść cache aplikacji skanujących
3. Zamknij aplikacje w tle
4. Sprawdź czy nie ma konfliktów softwarowych
5. Rekalibruj skaner
6. Zweryfikuj tryb skanowania (1D/2D/QR)

### Problemy z ładowaniem

**P: TC58 nie ładuje się w stacji dokującej. Co sprawdzić?**

O: Troubleshooting stacji dokującej:

| Problem | Przyczyna | Rozwiązanie |
|---------|-----------|-------------|
| Nie ładuje | Źle osadzone | Osadź ponownie, sprawdź kontakt pogo pins |
| LED nie świeci | Problem z zasilaniem | Sprawdź kabel AC i DC |
| Przerywane ładowanie | Brudne styki | Wyczyść pogo piny alkoholem izopropylowym |
| Bateria nierozpoznana | Niekompatybilna bateria | Użyj oryginalnych baterii Zebra |

**P: Jakie stacje dokujące są kompatybilne z TC58?**

O: Kompatybilne stacje:
- **CRD-NGTC5-2SC1B** - 1-slot Charge Only ShareCradle
- **CRD-NGTC5-2SE1B** - 1-slot USB/Charging Cradle
- **CRD-NGTC5-5SC5D** - 5-slot Charge Only Cradle
- **CRD-NGTC5-5SC4B** - 5-slot z ładowarką 4 baterii zapasowych
- **CRD-TC58-WCVC-01** - Vehicle Cradle z bezprzewodowym ładowaniem

### Problemy z przyciskami

**P: Boczne przyciski skanowania TC58 nie działają.**

O: Rozwiązanie:
1. Sprawdź mapowanie przycisków w Settings
2. Zweryfikuj konfigurację aplikacji skanującej
3. Przetestuj z inną aplikacją
4. Wykonaj soft reset
5. Sprawdź czy nie ma fizycznych uszkodzeń
6. Sprawdź czy przycisk nie został przemapowany na inną funkcję

**P: Jak wejść w Recovery Mode na TC58?**

O: Dokładna procedura:
1. Wyłącz całkowicie urządzenie
2. Naciśnij i przytrzymaj przycisk **Power**
3. Trzymając Power, naciśnij i przytrzymaj przycisk **PTT** (lewy bok)
4. Kontynuuj trzymanie PTT aż urządzenie zawibruje
5. Pojawi się menu **System Recovery**
6. Nawiguj przyciskami Volume Up/Down, wybieraj przyciskiem Power

### Problemy z siecią komórkową

**P: TC58 nie łączy się z siecią 4G/5G. Co robić?**

O: Troubleshooting:
1. Sprawdź czy karta SIM jest prawidłowo zainstalowana
2. Zweryfikuj ustawienia APN u operatora
3. Włącz dane mobilne w ustawieniach
4. Sprawdź zasięg sieci w danej lokalizacji
5. Włącz roaming jeśli potrzebny
6. Zrestartuj urządzenie

**P: Jakie są ustawienia APN dla polskich operatorów?**

O: Konfiguracja APN dla Polski:

**Orange:**
- APN: internet
- MCC: 260, MNC: 03
- APN type: default,supl

**Play:**
- APN: internet
- MCC: 260, MNC: 06
- APN type: default,supl

**T-Mobile:**
- APN: internet
- MCC: 260, MNC: 02
- APN type: default,supl

**Plus:**
- APN: plus
- MCC: 260, MNC: 01
- APN type: default,supl

Ścieżka: Settings > Network & internet > Mobile network > Access Point Names

**P: Karta SIM nie jest wykrywana w TC58.**

O: Rozwiązania:
1. Wyjmij i ponownie włóż kartę SIM
2. Wyczyść styki karty SIM
3. Sprawdź kartę w innym urządzeniu
4. Sprawdź czy slot SIM nie jest uszkodzony
5. Skontaktuj się z operatorem w celu weryfikacji aktywacji

### Problemy z GPS

**P: GPS w TC58 nie znajduje lokalizacji. Jak naprawić?**

O: Rozwiązanie:
1. Włącz Location w Settings
2. Nadaj uprawnienia lokalizacji aplikacjom
3. Wyjdź na zewnątrz z widokiem na niebo
4. Poczekaj na cold start (może trwać kilka minut)
5. Włącz Wi-Fi i dane mobilne dla a-GPS

TC58 obsługuje: GPS, GLONASS, Galileo, Beidou, QZSS oraz Dual-Band GNSS (L1+L5) dla lepszej dokładności.

**P: GPS TC58 ma problemy z dokładnością podczas jazdy samochodem.**

O: GPS drift w środowisku miejskim (multipath) jest normalny. Zalecenia:
- Włącz wszystkie systemy GNSS
- Używaj a-GPS z połączeniem danych
- Aplikacje transportowe zoptymalizowane dla Zebra lepiej radzą sobie z fuzją sensorów

---

## PYTANIA I ODPOWIEDZI - PROBLEMY SOFTWAROWE

### DataWedge

**P: Jak włączyć i skonfigurować DataWedge na TC58?**

O: Konfiguracja DataWedge:
1. Przesuń w górę z ekranu głównego
2. Otwórz aplikację **DataWedge**
3. Menu (☰) > **Settings**
4. Zaznacz **DataWedge enabled**
5. Utwórz nowy profil: Menu > **New Profile**
6. Skojarz z aplikacją: Associated Apps > New app/activity
7. Włącz **Barcode Input** i żądany **Output**

**P: DataWedge skanuje, ale dane nie są wysyłane do aplikacji.**

O: Sprawdź:
1. Czy profil jest prawidłowo skojarzony z aplikacją
2. Czy output plugin (Keystroke/Intent/IP) jest włączony
3. Utwórz dedykowany profil dla swojej aplikacji
4. Włącz "Send Enter Key" w Basic Data Formatting jeśli wymagane

**P: Jakie błędy DataWedge mogą wystąpić na TC58?**

O: Najczęstsze kody błędów DataWedge:

| Kod błędu | Znaczenie |
|-----------|-----------|
| DATAWEDGE_DISABLED | DataWedge jest wyłączony |
| PROFILE_NOT_FOUND | Profil nie istnieje |
| SCANNER_ENABLE_FAILED | Nie udało się włączyć skanera |
| PLUGIN_BUNDLE_INVALID | Nieprawidłowe parametry pluginu |
| APP_ALREADY_ASSOCIATED | Aplikacja już skojarzona z innym profilem |

### Aktualizacje systemu

**P: Jak sprawdzić wersję firmware i LifeGuard na TC58?**

O: Ścieżka: Settings > About Phone > Build Number
Sprawdź również:
- Android Version
- Security Patch Level (poziom łatki LifeGuard)
- Firmware Version

**P: Jak zaktualizować TC58 do najnowszej wersji Android?**

O: Metody aktualizacji:

**OTA (Over-the-Air):**
Settings > System > System updates

**Ręczna (Recovery Mode):**
1. Pobierz pakiet aktualizacji z zebra.com
2. Skopiuj na kartę microSD
3. Wejdź w Recovery Mode
4. Wybierz "Apply upgrade from SD card"

**Wymagania upgrade:**
- A11 → A14: Wymagany najpierw A11 BSP 11-21-27.00-RG-U00-STD lub nowszy
- A13 → A14: Wymagany najpierw A13 BSP 13-39-18 lub nowszy

**P: Znane problemy z Android 13 na TC58?**

O: Rozwiązane problemy:
- SPR-52252: Problem z audio podczas połączeń komórkowych
- SPR-54787: Tłumienie audio VoIP w pierwszych 10 sekundach
- SPR-54873/53237: Urządzenia tylko wykonywały połączenia alarmowe (problem z wykrywaniem SIM)
- SPR-56213/54982: Pętla bootowania po aktywacji eSIM

Wszystkie te problemy zostały naprawione w najnowszych aktualizacjach LifeGuard.

### Konfiguracja WiFi

**P: Jak skonfigurować WiFi Enterprise (802.1x) na TC58?**

O: Konfiguracja EAP-PEAP/MSCHAPv2:
1. Settings > Wi-Fi > Add network
2. Security: **WPA2-Enterprise** lub **WPA3-Enterprise**
3. EAP method: **PEAP**
4. Phase 2: **MSCHAPV2**
5. CA certificate: Wybierz lub "Don't validate"
6. Identity: nazwa użytkownika
7. Password: hasło

**P: TC58 ma problemy z roamingiem WiFi. Jak to naprawić?**

O: Konfiguracja roamingu (via StageNow Wi-Fi Manager):
- Włącz **802.11r (Fast Transition)** dla szybszego roamingu
- Włącz **ScanAssist** - monitorowanie sąsiednich AP
- Włącz **Pre-Authentication** dla 802.1x
- Użyj **AggregatedFT** dla ulepszonego 802.11r

### Bluetooth i drukarki

**P: Jak sparować TC58 z drukarką mobilną Zebra (ZQ320, ZQ520, ZQ630)?**

O: Procedura parowania:
1. Na drukarce: przytrzymaj przycisk Feed aż ikona BT zacznie migać
2. Na TC58: Settings > Connected devices > Pair new device
3. Wybierz drukarkę z listy (np. "ZQ630_XXXX")
4. Zaakceptuj parowanie na drukarce (jeśli wymagane)
5. Drukarka pojawi się w sparowanych urządzeniach

Alternatywnie użyj aplikacji **Zebra Printer Setup Utility** z Google Play.

**P: Drukarka Bluetooth pokazuje "offline" mimo sparowania z TC58.**

O: Troubleshooting:
1. Zrestartuj Bluetooth (wyłącz/włącz)
2. Zapomnij urządzenie i sparuj ponownie
3. Wyczyść cache Bluetooth: Settings > Apps > Bluetooth > Storage > Clear cache
4. Sprawdź czy drukarka jest w trybie discoverable
5. Zaktualizuj firmware drukarki

### Rejestracja MDM

**P: Jak zarejestrować TC58 w SOTI MobiControl?**

O: Metoda przez StageNow:
1. Utwórz profil StageNow: Enroll in an MDM > Select SOTI
2. Pobierz APK MobiControl agent
3. Skonfiguruj URL serwera i dane rejestracji
4. Wygeneruj barkod, zeskanuj urządzeniem
5. Zaakceptuj rejestrację, zakończ setup

**P: Jak zarejestrować TC58 w Microsoft Intune?**

O: Via StageNow:
1. Utwórz profil: Enroll in an MDM
2. Pobierz APK Company Portal
3. Ustaw:
   - Package Name: com.microsoft.windowsintune.companyportal
   - Class Name: com.microsoft.windowsintune.companyportal.views.SplashActivity
4. Zeskanuj barkod StageNow

**P: Jak wykonać Android Enterprise enrollment przez QR code?**

O: Procedura:
1. Wykonaj factory reset urządzenia
2. Na ekranie Welcome dotknij ekranu 6 razy
3. Zeskanuj QR code z konsoli EMM
4. Urządzenie automatycznie się skonfiguruje

### Procedury resetowania

**P: Jak wykonać Factory Reset na TC58?**

O: **Przez ustawienia:**
1. Settings > System > Reset options
2. Erase all data (factory reset)
3. Potwierdź dwukrotnie
4. Wprowadź PIN/wzór jeśli wymagane

**Przez Recovery Mode:**
1. Wejdź w Recovery Mode (Power + PTT)
2. Wybierz "Wipe data/factory reset"
3. Potwierdź przyciskiem Power

**Co usuwa Factory Reset:**
- Wszystkie dane użytkownika w /data
- Dane w /enterprise
- Zawartość pamięci wewnętrznej
- Urządzenie wraca do ostatnio zainstalowanego systemu

**P: Jaka jest różnica między Factory Reset a Enterprise Reset?**

O: **Enterprise Reset zachowuje:**
- Partycję /enterprise
- Zainstalowane certyfikaty
- Konfiguracje staging
- Zawartość dedykowanej partycji SD

Enterprise Reset pobierz z zebra.com i zastosuj przez Recovery Mode.

**P: Jakie są kombinacje klawiszy do resetowania TC58?**

O: Podsumowanie kombinacji:

| Akcja | Kombinacja klawiszy |
|-------|---------------------|
| Soft Reset | Przytrzymaj Power > Restart |
| Hard Reset | Przytrzymaj Power 20+ sekund |
| Recovery Mode | Power on > Przytrzymaj PTT aż wibracja |
| Factory Reset (klawisze) | Recovery Mode > Wipe data/factory reset |
| Bootloader | Przytrzymaj Volume Down + Power |

---

## KODY BŁĘDÓW I DIAGNOSTYKA

### Wskaźniki LED TC58

**Dioda ładowania/powiadomień (górna część urządzenia):**

| Stan LED | Kolor/Wzór | Znaczenie |
|----------|------------|-----------|
| Migająca | Bursztynowa | Ładowanie w toku |
| Stała | Zielona | W pełni naładowane (100%) |
| Migająca przemiennie | Bursztyn/Zielony | Ładowanie, ale bateria kończy żywotność |
| Stała | Czerwona | Temperatura za niska/wysoka do ładowania |
| Migająca co 4 sek. | Czerwona | Bateria wymaga wymiany |
| Dwie diody migają | Różne | Krytycznie niski poziom baterii |

**Dioda skanowania:**
- **Czerwony wzór + kropka**: SE4720 aktywne skanowanie
- **Zielony dash-dot-dash**: SE55 wzór celownika
- **Zielona LED + dźwięk**: Kod odczytany pomyślnie

### Błędy sieciowe (Device Diagnostic Tool)

| Wynik testu | Znaczenie |
|-------------|-----------|
| WiFi MAC Address: Invalid | Awaria radia WiFi |
| Network Test: Not Connected | Brak połączenia sieciowego |
| WWAN Voice Out of Service | Sieć komórkowa niezarejestrowana |
| WWAN Data Disconnected | Dane mobilne niedostępne |
| SIM State: Absent | Brak karty SIM |

### Narzędzia diagnostyczne

**Device Diagnostic Tool (DDT):**
Preinstalowane na TC58. Dostępne testy:
- Battery Test (zdrowie, napięcie, temperatura)
- Scanner Test (dekodowanie kodów)
- Button Test (przyciski fizyczne)
- Touch Screen Test (responsywność dotyku)
- WiFi Test (MAC, sygnał, BSSID)
- Bluetooth Test (radio)
- WWAN Test (SIM, sygnał)
- Audio Test (mikrofon, głośnik)
- Camera Test (tylna kamera)

**RxLogger - zbieranie logów:**
1. Otwórz aplikację RxLogger
2. Dotknij **Start**
3. Skonfiguruj moduły w Settings
4. Logi zapisywane w: /storage/sdcard0/RxLogger

Backup via ADB:
```
adb shell am broadcast -a com.symbol.rxlogger.intent.action.BACKUP_NOW
```

---

## PROCEDURY SERWISOWE

### Sprawdzanie numeru seryjnego

**Metoda 1 - Software:**
Settings > About Phone > Serial Number

**Metoda 2 - Fizyczna etykieta:**
W przegrodzie na baterię (zdejmij baterię)

### Sprawdzanie IMEI (modele WWAN)

**Metoda 1 - Dialer:**
Otwórz telefon, wpisz: *#06#

**Metoda 2 - Settings:**
Settings > About Phone > IMEI

### Sprawdzanie gwarancji

1. Wejdź na: https://www.zebra.com/us/en/support-downloads/request-repair.html
2. Kliknij **Warranty Lookup**
3. Wprowadź numer seryjny urządzenia
4. Sprawdź daty rozpoczęcia/zakończenia gwarancji i umowy OneCare

### Procedury czyszczenia

**Ogólne zasady:**
- Zawsze wyłącz urządzenie przed czyszczeniem
- Nigdy nie spryskuj płynów bezpośrednio na urządzenie
- Używaj zwilżonych chusteczek lub wilgotnej ściereczki
- Pozwól wyschnąć przed użyciem

**Ekran:**
1. Użyj miękkiej ściereczki z mikrofibry
2. Lekko zwilż zatwierdzonym środkiem
3. Delikatnie przetrzyj - nie szoruj
4. Natychmiast osusz czystą ściereczką

**Okienko skanera:**
1. Przetrzyj chusteczką do optyki
2. W razie potrzeby użyj alkoholu izopropylowego
3. Czyść regularnie dla optymalnej wydajności

**Pogo piny:**
1. Zanurz wacik w alkoholu izopropylowym (70%)
2. Delikatnie przetrzyj styki (minimum 3 razy)
3. Usuń resztki waty
4. Pozwól całkowicie wyschnąć

**Zatwierdzone środki czyszczące:**
- Alkohol izopropylowy (70%)
- Gotowe chusteczki alkoholowe
- Roztwór łagodnego mydła
- Produkty czyszczące zatwierdzone przez Zebra

**UNIKAJ:**
- Produktów z wybielaczem
- Środków ściernych
- Acetonu
- Środków na bazie amoniaku

### Wymiana baterii

**Usuwanie baterii:**
1. Jeśli przymocowany pasek na rękę - najpierw zdejmij
2. Zlokalizuj zatrzaski drzwiczek baterii z tyłu
3. **Ściśnij oba zatrzaski do wewnątrz**
4. **Podnieś** aby wyjąć baterię

**Instalacja baterii:**
1. Upewnij się że komora jest czysta
2. **NIE umieszczaj naklejek w komorze baterii**
3. Włóż baterię ze stykami wyrównanymi
4. Dociśnij aż kliknie na miejsce
5. Zatrzaski zamkną się automatycznie

**Pierwsza aktywacja baterii:**
1. Włóż baterię do urządzenia
2. Podłącz do ładowarki
3. Ładuj aż zielona LED pozostanie zapalona
4. Urządzenie włączy się automatycznie po podłączeniu zasilania

---

## AKCESORIA I KOMPATYBILNOŚĆ

### Stacje dokujące

| Numer części | Opis | Funkcje |
|--------------|------|---------|
| CRD-NGTC5-2SC1B | 1-slot ShareCradle | Ładuje urządzenie + baterię zapasową |
| CRD-NGTC5-2SE1B | 1-slot USB/Charging | Ładowanie + komunikacja USB |
| CRD-NGTC5-5SC5D | 5-slot Charge Only | Ładuje do 5 urządzeń |
| CRD-NGTC5-5SC4B | 5-slot + 4-slot Battery | 4 urządzenia + 4 baterie zapasowe |

### Ładowarki baterii

| Numer części | Opis |
|--------------|------|
| SAC-NGTC5TC7-4SCHG | 4-slot Spare Battery Charger (TC53/TC58/TC73/TC78) |

### Uchwyty samochodowe (WAŻNE DLA KURIERÓW)

| Numer części | Opis | Wymagania |
|--------------|------|-----------|
| CRD-TC58-WCVC-01 | Wireless Charging Vehicle Cradle | Wymaga: etui SG-NGTC5EXO1-01, bateria bezprzewodowa BTRY-NGTC5TC7-44MAWC-01 |

**Opcje zasilania w pojeździe:**
- CHG-AUTO-CLA1-01 - Kabel z gniazdka zapalniczki
- CHG-AUTO-HWIRE1-01 - Kabel na stałe podłączony

**RAM Mounts i ProClip** również oferują uchwyty samochodowe z ładowaniem dla TC53/TC58.

### Akcesoria ochronne

| Numer części | Opis |
|--------------|------|
| SG-NGTC5EXO1-01 | Rugged Boot (etui ochronne) - zwiększa odporność na upadki do 1.8m |
| SG-NGTC5TC7-HLSTR-01 | Kabura miękka |
| SG-NGTC5TC7-HDSTP-01 | Pasek na rękę (pojedynczy) |
| SG-NGTC5TC7-HDSTP-03 | Pasek na rękę (3-pack) |
| TRG-NGTC5-ELEC-01 | Trigger Handle (uchwyt pistoletowy) - wymaga Rugged Boot |
| SG-NGTC5TC7-SCRN-03 | Folie ochronne na ekran (3-pack) |

### Kompatybilne drukarki mobilne

| Model | Szerokość wydruku | Przeznaczenie |
|-------|-------------------|---------------|
| ZQ320 Plus | 2"/3" | Paragony, niski obieg |
| ZQ511/ZQ521 | 3" | Średni/wysoki obieg |
| ZQ610/ZQ620 Plus | 2" | Wysoki obieg |
| ZQ630 Plus | 4" | Etykiety, magazyn |

### Skanery pierścieniowe

| Model | Kompatybilność z TC58 |
|-------|----------------------|
| RS5100 | Pełna - przez Bluetooth lub USB-C adapter |
| RS6100 | Pełna - przez Bluetooth lub USB-C adapter |

Adapter: **CBL-RS5X6-ADPTC-01** - RS5100/RS6100 Corded Adapter z USB-C dla TC53/TC58

### Kompatybilność wsteczna akcesoriów

**TC52/TC57 → TC58:**
- Multi-slot ShareCradles: ✅ Tak (użyj adapterów CRDCUP-NGTC5ENB-01)
- Ładowarki baterii zapasowych: ⚠️ Nie (inna konstrukcja baterii)
- Zasilacze: ✅ Tak

**TC53 ↔ TC58:**
Pełna kompatybilność - wszystkie akcesoria są współdzielone:
- Wszystkie stacje dokujące
- Rugged boot
- Trigger handle
- Paski na rękę
- Kabury
- Baterie
- Ładowarki baterii

---

## SPECYFIKA PRACY KURIERSKIEJ

### Problemy z pracą na zewnątrz

**P: TC58 wyłącza się w upalne dni w samochodzie kurierskim.**

O: TC58 wyłącza się przy temperaturze 58°C. Zalecenia:
- Nie zostawiaj urządzenia na słońcu w samochodzie
- Używaj uchwytu samochodowego z cyrkulacją powietrza
- Ładowanie spowalnia powyżej 45°C, zatrzymuje się powyżej 50°C

**P: TC58 ma problemy w mroźne dni (poniżej 0°C).**

O: TC58 działa do -20°C, ale:
- Ładowanie nie działa poniżej 0°C
- Pojemność baterii tymczasowo spada w zimnie
- Reakcja LCD może być wolniejsza
- Włącz tryb rękawiczek dla ekranu dotykowego

**P: Czy TC58 można używać w deszczu?**

O: Tak, TC58 ma klasę IP68 (zanurzenie 1.5m/30 min) i IP65 (strumienie wody). Jednak:
- Wodoodporność zmniejsza się z czasem
- Unikaj kontaktu z mydłem, rozpuszczalnikami
- Tylko świeża woda jest bezpieczna
- Zawsze upewnij się że drzwiczki dostępowe są szczelnie zamknięte

### Szybkie rozładowywanie baterii przy skanowaniu

**P: Bateria TC58 rozładowuje się bardzo szybko podczas intensywnego skanowania.**

O: Rekomendacje dla kurierów:
1. Noś baterię zapasową (użyj Hot Swap jeśli Premium SKU)
2. Używaj baterii rozszerzonej 7000 mAh (BTRY-NGTC5TC7-66MA-01)
3. Zmniejsz jasność ekranu
4. Wyłącz GPS gdy nie jest potrzebny
5. Zamykaj nieużywane aplikacje
6. Używaj uchwytu samochodowego z ładowaniem

### Problemy z GPS podczas jazdy

**P: GPS TC58 pokazuje nieprawidłową pozycję podczas dostawy.**

O: GPS drift jest normalny w środowiskach miejskich. Rozwiązania:
- Aplikacje kurierskie zoptymalizowane dla Zebra lepiej radzą sobie z fuzją sensorów
- Włącz wszystkie systemy GNSS (GPS, GLONASS, Galileo, Beidou)
- Włącz a-GPS (wymaga danych mobilnych)
- Dual-Band GNSS (L1+L5) w TC58 zapewnia lepszą dokładność

### Hot swap baterii w terenie

**P: Jak szybko wymienić baterię TC58 bez restartu podczas dostawy?**

O: Procedura Hot Swap (tylko Premium SKU):
1. Dotknij Power > Battery Swap
2. **CZEKAJ aż czerwona LED całkowicie zgaśnie** (około 30 sekund)
3. Wyjmij starą baterię
4. Włóż nową baterię w ciągu 60 sekund
5. Urządzenie automatycznie wznowi pracę

Dla Standard SKU: Warm Swap (2-minutowe okno)

---

## ZNANE PROBLEMY I BUGI

### Zgłoszone problemy przez użytkowników (2023-2024)

**Problemy ze skanerem:**
- Skaner przestaje działać, wymaga częstych restartów
- Skaner skanuje sąsiedni kod zamiast celowanego
- Nieprawidłowe skany przy szybkim skanowaniu

**Workaround:** Przejdź na ekran główny, potem wróć do aplikacji - często rozwiązuje problem

**Problemy z aplikacjami:**
- Aplikacje losowo pokazują puste ekrany
- Urządzenie zawiesza się i wymaga restartu
- Awarie systemu przy dużym obciążeniu

**Problemy z RFID:**
- Częste rozłączenia RFID podczas pracy
- Trudności z użyciem RFID przy niestabilnym WiFi

**Problemy z ekranem:**
- Zbyt czuły ekran - rejestruje zbliżony kciuk jako dotyk
- Dotknięcie nie jest rejestrowane na małych elementach UI

### Rozwiązane błędy w aktualizacjach LifeGuard

| SPR | Opis | Status |
|-----|------|--------|
| SPR-51430 | TC58 restartuje się w niektórych lokalizacjach O2 UK | Rozwiązany |
| SPR-54787 | Tłumienie audio VoIP/Cellular w pierwszych 10 sek. | Rozwiązany |
| SPR-51331 | Skaner pozostaje DISABLED po suspend/resume | Rozwiązany |
| SPR-51244/51525 | DataWedge ustawiane jako klawiatura główna | Rozwiązany |
| SPR-54873/53237 | Tylko połączenia alarmowe (problem SIM) | Rozwiązany |
| SPR-56213/54982 | Pętla bootowania po aktywacji eSIM | Rozwiązany |

**Zalecenie:** Zawsze aktualizuj do najnowszej wersji LifeGuard aby mieć naprawione wszystkie błędy.

### Aktualna wersja firmware (Grudzień 2024)

- **Android 13**: 13-45-23.00-TN-U00-STD-ATH-04 (Security Bulletin wrzesień 2025)
- **Android 14**: 14-28-03.00-UN-U00-STD-ATH-04 (Security Bulletin czerwiec 2025)

---

## STATUS PRODUKTU I WSPARCIE

### Status TC58

**Aktualny status: AKTYWNY (Currently Selling)**
- TC58 jest obecną generacją terminala WWAN w serii TC5x
- Wydany w 2022 jako następca TC57
- Brak ogłoszonej daty EOL (End of Life)

### Wsparcie Android

- Fabryczny: Android 11
- Aktualnie obsługiwane: Android 11, 13, 14
- Przyszłe aktualizacje: Android 16 (potwierdzone)

### Informacje o poprzednikach (TC52/TC57)

- **TC52 Last Sale Date**: 31 października 2024
- **TC52 Service Discontinuation**: 31 grudnia 2028
- **TC51/TC56 End-of-life Service**: 30 lipca 2025

### Gwarancja

**Gwarancja standardowa:**
- Okres: 1 rok od daty wysyłki
- Pokrycie: Wady materiałowe i wykonania
- NIE obejmuje: Przypadkowe uszkodzenia

**Zebra OneCare Essential:**
- Opcje 3-letnie lub 5-letnie
- Obejmuje uszkodzenia przypadkowe i normalne zużycie
- 3-dniowy czas naprawy (od przybycia do centrum)
- Priorytetowe wsparcie telefoniczne (8x5)
- Dostęp do aktualizacji software i bezpieczeństwa

**Jak zgłosić gwarancję:**
1. Skontaktuj się z Zebra Support przez email, chat lub telefon
2. Zainicjuj zgłoszenie naprawy przez portal Zebra Support
3. Wymagany numer seryjny urządzenia

---

## KONTAKT I ZASOBY

### Strony wsparcia

- **TC58 Support Page**: https://www.zebra.com/us/en/support-downloads/mobile-computers/handheld/tc58.html
- **Repair Portal**: https://www.zebra.com/us/en/support-downloads/request-repair.html
- **TechDocs**: https://techdocs.zebra.com
- **Zebra Support Community**: https://supportcommunity.zebra.com

### Dokumentacja techniczna

- TC53/TC58 Product Reference Guide (docs.zebra.com)
- TC53/TC58 Quick Start Guide
- DataWedge Documentation: https://techdocs.zebra.com/datawedge/
- Device Diagnostic Tool: https://techdocs.zebra.com/ddt/
- RxLogger: https://techdocs.zebra.com/rxlogger/

---

*Dokumentacja przygotowana dla serwiszebra.pl - grudzień 2024. Baza wiedzy do szkolenia chatbota AI dla polskiego portalu serwisowego obsługującego firmy kurierskie (DHL, InPost, DPD, GLS).*