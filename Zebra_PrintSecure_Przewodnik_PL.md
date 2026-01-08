# Zebra PrintSecure – Kompletny przewodnik po zabezpieczeniach drukarek przemysłowych

**Jak zabezpieczyć drukarki etykiet Zebra w środowisku korporacyjnym? Kompleksowy poradnik administratora IT dotyczący funkcji bezpieczeństwa PrintSecure, trybu chronionego (Protected Mode), szyfrowania TLS i zgodności z dyrektywą EU RED.**

---

## Wprowadzenie do zabezpieczeń drukarek Zebra

W dzisiejszym środowisku korporacyjnym **bezpieczeństwo urządzeń końcowych** staje się priorytetem dla każdego działu IT. Drukarki etykiet termicznych i termotransferowych, choć często pomijane w strategiach cyberbezpieczeństwa, stanowią potencjalny wektor ataku w infrastrukturze sieciowej przedsiębiorstwa. Firma **Zebra Technologies** odpowiada na te wyzwania, oferując zaawansowany system zabezpieczeń **PrintSecure** dla drukarek z platformą **Link-OS**.

**PrintSecure** to kompleksowe rozwiązanie umożliwiające administratorom IT pełną kontrolę nad konfiguracją bezpieczeństwa drukarek przemysłowych, mobilnych i biurkowych. System obejmuje zarządzanie usługami sieciowymi, szyfrowanie komunikacji, uwierzytelnianie użytkowników oraz ochronę firmware'u przed nieautoryzowanymi modyfikacjami.

---

## Model CIA – fundament bezpieczeństwa drukarek przemysłowych

Administrowanie drukarkami Zebra w kontekście bezpieczeństwa opiera się na sprawdzonym modelu **CIA (Confidentiality, Integrity, Availability)**, który stanowi podstawę każdej strategii cyberbezpieczeństwa w przedsiębiorstwie.

### Poufność (Confidentiality)

**Poufność danych** w kontekście drukarek etykiet oznacza zapewnienie, że informacje przesyłane do drukarki są dostępne wyłącznie dla autoryzowanych użytkowników i systemów. Drukarki Zebra realizują ten cel poprzez:

- **Szyfrowanie komunikacji TLS/SSL** – zabezpieczenie transmisji danych między komputerem a drukarką
- **Uwierzytelnianie użytkowników** – kontrola dostępu do panelu administracyjnego i stron WWW drukarki
- **Protokoły HTTPS i IPPS** – szyfrowane alternatywy dla HTTP i IPP
- **Zabezpieczenia Bluetooth** – tryby parowania i minimalne poziomy bezpieczeństwa

### Integralność (Integrity)

**Integralność danych** gwarantuje, że informacje przechowywane i przetwarzane przez drukarkę nie zostały zmodyfikowane przez nieautoryzowane podmioty. Mechanizmy zapewniające integralność obejmują:

- **Podpisy cyfrowe firmware'u** – weryfikacja autentyczności aktualizacji oprogramowania
- **Tryb chroniony (Protected Mode)** – blokada krytycznych ustawień przed nieautoryzowanymi zmianami
- **Kontrola dostępu** – ograniczenie możliwości modyfikacji konfiguracji
- **Sumy kontrolne i hashe kryptograficzne** – walidacja plików i danych

### Dostępność (Availability)

**Dostępność zasobów** oznacza zapewnienie ciągłości działania drukarek, gdy są potrzebne w procesach biznesowych. Zebra PrintSecure wspiera dostępność poprzez:

- **Zdalne zarządzanie flotą** – szybka reakcja na problemy i aktualizacje
- **Monitorowanie stanu urządzeń** – alerty i logi systemowe (syslog)
- **Redundancja połączeń** – obsługa wielu interfejsów komunikacyjnych
- **Ochrona przed atakami DoS** – ograniczenie nieużywanych usług

---

## 10 najlepszych praktyk bezpieczeństwa drukarek Zebra

Wdrożenie PrintSecure powinno być oparte na sprawdzonych praktykach branżowych. Poniżej przedstawiamy **10 kluczowych zasad** zabezpieczania drukarek przemysłowych:

### 1. Planuj bezpieczeństwo od początku

Zanim nowe drukarki trafią do sieci produkcyjnej, przygotuj **politykę bezpieczeństwa** określającą wymagane ustawienia, hasła i certyfikaty. Konfiguracja zabezpieczeń powinna być elementem standardowego procesu wdrożenia urządzeń.

### 2. Używaj szyfrowanych połączeń

Zawsze preferuj **połączenia szyfrowane** – HTTPS zamiast HTTP, IPPS zamiast IPP, TLS zamiast surowych połączeń TCP. Unikaj podłączania drukarek bezpośrednio do internetu – używaj zapór ogniowych i sieci wewnętrznych.

### 3. Rotuj hasła i poświadczenia

Planuj **regularną rotację haseł** administratora, kluczy dostępu i certyfikatów. Im dłużej hasło pozostaje niezmienione, tym większe ryzyko jego kompromitacji.

### 4. Wyłącz nieużywane usługi

Domyślne ustawienia drukarek często obejmują włączone usługi, które nie są potrzebne w danym środowisku. **Wyłącz FTP, Telnet, HTTP** i inne usługi, jeśli nie są wykorzystywane – zmniejsza to powierzchnię ataku.

### 5. Wykorzystaj zdalne zarządzanie

Narzędzia takie jak **Zebra Printer Profile Manager Enterprise** umożliwiają masowe aktualizacje konfiguracji bezpieczeństwa na całej flocie drukarek. Im szybciej wdrożysz aktualizacje, tym krócej urządzenia pozostają podatne na znane zagrożenia.

### 6. Ogranicz ujawnianie informacji

Nie informuj niepotrzebnie o planowanych aktualizacjach i zmianach konfiguracji. Ogranicz dostęp do informacji o infrastrukturze drukarek do osób, które jej potrzebują.

### 7. Monitoruj zaginione urządzenia

Jeśli drukarka została skradziona lub zgubiona, **natychmiast cofnij jej poświadczenia** – hasła, certyfikaty i dostępy. Urządzenie może zostać wykorzystane do nieautoryzowanego dostępu do sieci korporacyjnej.

### 8. Wybieraj urządzenia z długim wsparciem

Drukarki Zebra z platformą **Link-OS** otrzymują regularne aktualizacje bezpieczeństwa przez wiele lat. Przy wyborze urządzeń weryfikuj, czy producent zapewnia długoterminowe wsparcie i aktualizacje firmware'u.

### 9. Planuj wycofanie urządzeń

Przed utylizacją lub sprzedażą drukarki przeprowadź **proces decommissioning** – usuń wszystkie dane konfiguracyjne, certyfikaty, hasła i wrażliwe informacje z pamięci urządzenia.

### 10. Stosuj model CIA na każdym etapie

Podczas całego cyklu życia drukarki – od wdrożenia, przez eksploatację, aż po wycofanie – uwzględniaj aspekty poufności, integralności i dostępności.

---

## Tryb chroniony (Protected Mode) – klucz do bezpieczeństwa

**Protected Mode** to fundamentalna funkcja bezpieczeństwa drukarek Zebra Link-OS, która blokuje możliwość nieautoryzowanych zmian krytycznych ustawień. Po włączeniu trybu chronionego modyfikacja zabezpieczonych parametrów wymaga uwierzytelnienia administratora.

### Jak działa Protected Mode?

Interakcja z trybem chronionym odbywa się poprzez **komendy JSON** zawierające dane uwierzytelniające i typ operacji. Format podstawowej komendy wygląda następująco:

```json
{}{
  "protect":{
    "authentication":{
      "username":"admin",
      "password":"<hasło>",
      "type":"basic"
    },
    "operation":"<typ operacji>",
    "<dane operacji>"
  }
}
```

### Ustawianie hasła administratora

Aby włączyć tryb chroniony po raz pierwszy, należy ustawić hasło administratora. Hasło musi mieć **od 14 do 128 znaków** i zawierać wyłącznie drukowalne znaki ASCII (0x20-0x7E):

```json
{}{
  "protect":{   
    "authentication":{
      "username":"admin",
      "password":"",
      "type":"basic"
    },
    "operation":"setup",
    "setup":{
      "username":"admin",
      "password":"<nowe_hasło_min_14_znaków>"
    }
  }
}
```

### Weryfikacja stanu trybu chronionego

Aby sprawdzić, czy drukarka jest w trybie chronionym, użyj komendy SGD:

```
! U1 getvar "device.protected_mode"
```

Drukarka odpowie wartością `"on"` lub `"off"`.

### Modyfikacja ustawień w trybie chronionym

Po włączeniu Protected Mode, zmiana zabezpieczonych ustawień wymaga użycia operacji `set` z uwierzytelnieniem:

```json
{}{
  "protect":{
    "authentication":{
      "username":"admin",
      "password":"<hasło>",
      "type":"basic"
    },
    "operation":"set",
    "set":{
      "ip.ftp.enable":"off",
      "ip.http.enable":"off"
    }
  }
}
```

### Lista ustawień chronionych

Tryb Protected Mode chroni następujące kategorie ustawień:

| Kategoria | Przykładowe ustawienia |
|-----------|------------------------|
| **Usługi sieciowe** | FTP, HTTP, HTTPS, LPD, SNMP, Telnet, TCP, UDP |
| **Komunikacja bezprzewodowa** | Wi-Fi, Bluetooth, wykrywalność BT |
| **Bezpieczeństwo** | Hasła, certyfikaty, poziomy bezpieczeństwa |
| **Firmware** | Kontrola aktualizacji oprogramowania |
| **Interfejs użytkownika** | Hasło do panelu, blokady menu |

---

## Advanced Security Mode (ASM) i zgodność z EU RED

Od wersji **Link-OS 7.4.2** firma Zebra wprowadza **Advanced Security Mode (ASM)** – tryb "bezpieczny domyślnie", który automatycznie włącza Protected Mode i wyłącza większość usług sieciowych.

### Wymagania dyrektywy EU RED

Drukarki sprzedawane w **Unii Europejskiej od 1 sierpnia 2025 roku** muszą spełniać wymagania **dyrektywy EU RED (Radio Equipment Directive)** dotyczące cyberbezpieczeństwa urządzeń radiowych. W odpowiedzi na te wymagania, drukarki Zebra w regionie EMEA są fabrycznie konfigurowane w trybie Advanced Security Mode.

### Domyślne ustawienia ASM

W trybie Advanced Security Mode następujące usługi są **domyślnie wyłączone**:

| Ustawienie SGD | Domyślna wartość | Opis |
|----------------|------------------|------|
| `device.allow_firmware_downloads` | no | Blokada aktualizacji firmware |
| `ip.ftp.enable` | off | Wyłączony FTP |
| `ip.http.enable` | off | Wyłączony HTTP |
| `ip.https.enable` | off | Wyłączony HTTPS |
| `ip.lpd.enable` | off | Wyłączony LPD |
| `ip.snmp.enable` | off | Wyłączony SNMP |
| `ip.tcp.enable` | off | Wyłączony surowy TCP |
| `ip.udp.enable` | off | Wyłączony UDP |
| `wlan.enable` | off | Wyłączone Wi-Fi |
| `usb.mirror.enable` | off | Wyłączone USB Mirror |
| `zbi.enable` | off | Wyłączony interpreter ZBI |

### Usługi włączone w ASM

Następujące usługi pozostają **włączone** dla umożliwienia podstawowej konfiguracji:

| Ustawienie SGD | Wartość | Opis |
|----------------|---------|------|
| `bluetooth.enable` | on | Bluetooth do parowania i konfiguracji |
| `internal_wired.enable` | on | Interfejs Ethernet |
| `ip.discovery.enable` | on | Wykrywanie drukarki w sieci |
| `ip.ipp.enable` | on | Szyfrowany protokół druku (IPPS) |
| `ip.tls.enable` | on | Szyfrowana komunikacja TLS |

---

## Zarządzanie usługami sieciowymi

Kluczowym elementem zabezpieczania drukarek Zebra jest **kontrola usług sieciowych**. Każda włączona usługa zwiększa powierzchnię ataku, dlatego zaleca się wyłączenie wszystkich nieużywanych protokołów.

### HTTP i HTTPS

**HTTP** (port 80) zapewnia dostęp do wbudowanych stron WWW drukarki. **HTTPS** (port 443) oferuje szyfrowaną wersję tego samego dostępu.

```
! U1 setvar "ip.http.enable" "off"
! U1 setvar "ip.https.enable" "on"
```

> **Uwaga:** Od Link-OS 7.4.2 drukarka automatycznie generuje samopodpisany certyfikat dla HTTPS, jeśli nie zainstalowano certyfikatu użytkownika.

### FTP

**FTP** (port 21) umożliwia transfer plików do drukarki. Jeśli nie używasz FTP do aktualizacji lub przesyłania formatów etykiet, wyłącz tę usługę:

```
! U1 setvar "ip.ftp.enable" "off"
```

### Telnet

**Telnet** (port 23) zapewnia zdalny dostęp do interpretera poleceń drukarki. Ze względu na brak szyfrowania, **zawsze należy wyłączyć Telnet** w środowisku produkcyjnym:

```
! U1 setvar "ip.telnet.enable" "off"
```

### SNMP

**SNMP** (Simple Network Management Protocol) umożliwia monitorowanie i zarządzanie drukarką przez systemy NMS. Jeśli nie używasz SNMP, wyłącz tę usługę:

```
! U1 setvar "ip.snmp.enable" "off"
```

### LPD

**LPD** (Line Printer Daemon, port 515) to protokół drukowania używany głównie w środowiskach Unix/Linux i macOS:

```
! U1 setvar "ip.lpd.enable" "off"
```

### Surowe porty TCP/UDP

Drukarki Zebra obsługują komunikację przez surowe porty **TCP** (domyślnie 9100) i **UDP**. Jeśli używasz szyfrowanych protokołów, możesz wyłączyć te porty:

```
! U1 setvar "ip.tcp.enable" "off"
! U1 setvar "ip.udp.enable" "off"
```

---

## Zabezpieczenia komunikacji Bluetooth

Drukarki Zebra z modułem Bluetooth oferują zaawansowane opcje bezpieczeństwa komunikacji bezprzewodowej.

### Wykrywalność Bluetooth

Od **Link-OS 6** wykrywalność Bluetooth jest **domyślnie wyłączona**. Aby sparować nowe urządzenie, użytkownik musi przytrzymać przycisk FEED przez 5 sekund lub włączyć wykrywalność programowo:

```
! U1 setvar "bluetooth.discoverable" "on"
```

### Tryby bezpieczeństwa Bluetooth

Drukarka obsługuje różne poziomy bezpieczeństwa Bluetooth:

```
! U1 setvar "bluetooth.minimum_security_mode" "3"
```

| Poziom | Opis |
|--------|------|
| 1 | Brak zabezpieczeń (niezalecany) |
| 2 | Zabezpieczenie na poziomie usługi |
| 3 | Zabezpieczenie na poziomie łącza (zalecany) |
| 4 | Tryb Secure Simple Pairing |

### Tryb kontrolera Bluetooth

Dla drukarek obsługujących Bluetooth Classic i Bluetooth Low Energy (BLE):

```
! U1 setvar "bluetooth.le.controller_mode" "both"
! U1 setvar "bluetooth.le.controller_mode" "le"
! U1 setvar "bluetooth.le.controller_mode" "classic"
```

---

## Szyfrowanie TLS i zarządzanie certyfikatami

**Transport Layer Security (TLS)** zapewnia szyfrowaną komunikację między komputerem a drukarką. Od Link-OS 5 drukarki Zebra w pełni obsługują TLS z użytkowniskimi certyfikatami.

### Porty TLS

| Port | Przeznaczenie |
|------|---------------|
| 9143 | TLS Raw (parser języka drukarki) |
| 9243 | TLS JSON (konfiguracja JSON) |

### Pliki certyfikatów TLS

Aby skonfigurować własne certyfikaty TLS, należy przesłać następujące pliki:

| Nazwa pliku | Zawartość |
|-------------|-----------|
| `TLSRAW_CERT.NRD` | Certyfikat drukarki |
| `TLSRAW_KEY.NRD` | Klucz prywatny (nieszyfrowany) |
| `TLSRAW_CA.NRD` | Łańcuch certyfikatów CA |

### Generowanie CSR (Certificate Signing Request)

Drukarka może wygenerować żądanie podpisania certyfikatu:

```json
{}{
  "file.cert.generate_csr":{
    "service":"TLSRAW",
    "common_name":"printer.firma.pl",
    "organization":"Firma Sp. z o.o.",
    "country":"PL",
    "key_algorithm":"RSA",
    "key_size":2048
  }
}
```

### Obsługiwane szyfry TLS

Link-OS 7.4.2 obsługuje następujące bezpieczne szyfry:

- `ECDHE-ECDSA-AES256-GCM-SHA384`
- `ECDHE-ECDSA-AES128-GCM-SHA256`
- `ECDHE-RSA-AES256-GCM-SHA384`
- `ECDHE-RSA-AES128-GCM-SHA256`
- `AES256-GCM-SHA384`
- `AES128-GCM-SHA256`

### Weryfikacja połączenia TLS

Aby przetestować połączenie TLS z drukarką, użyj OpenSSL:

```bash
echo "~WC" | openssl s_client -connect 192.168.1.100:9143 -quiet
```

---

## Ochrona firmware'u drukarki

**Aktualizacje firmware'u** mogą stanowić wektor ataku, jeśli nie są odpowiednio zabezpieczone. PrintSecure oferuje mechanizmy kontroli pobierania i instalacji oprogramowania.

### Blokada aktualizacji firmware

Aby zablokować możliwość aktualizacji firmware'u:

```
! U1 setvar "device.allow_firmware_downloads" "no"
```

> **Uwaga:** Po zablokowaniu tej opcji aktualizacje nie będą możliwe. Aby wykonać jednorazową aktualizację, użyj operacji `allow-next-firmware-download`.

### Jednorazowa autoryzacja aktualizacji

W trybie chronionym, aby autoryzować pojedynczą aktualizację firmware'u:

```json
{}{
  "protect":{
    "authentication":{
      "username":"admin",
      "password":"<hasło>",
      "type":"basic"
    },
    "operation":"allow-next-firmware-download"
  }
}
```

### Weryfikacja wersji firmware

Sprawdzenie aktualnej wersji oprogramowania drukarki:

```
! U1 getvar "appl.name"
```

---

## Zabezpieczenia interfejsu użytkownika

Drukarki z wyświetlaczem LCD lub kolorowym ekranem dotykowym oferują dodatkowe opcje zabezpieczeń panelu operatora.

### Hasło do panelu (PIN)

Ustaw PIN chroniący dostęp do menu drukarki:

```
! U1 setvar "display.password.level" "selected"
! U1 setvar "display.password.current" "1234"
```

| Poziom | Opis |
|--------|------|
| `none` | Brak hasła |
| `selected` | Hasło do wybranych menu |
| `all` | Hasło do wszystkich menu |

### Hasło do stron WWW

Zmiana hasła administratora dla wbudowanych stron WWW:

```json
{}{
  "protect":{
    "authentication":{
      "username":"admin",
      "password":"<aktualne_hasło>",
      "type":"basic"
    },
    "operation":"set",
    "set":{
      "ip.http.admin_password":"<nowe_hasło>"
    }
  }
}
```

> **Uwaga:** Domyślna nazwa użytkownika to `admin`. Można ją zmienić komendą `ip.http.admin_name`.

---

## Logowanie i audyt bezpieczeństwa

Monitorowanie aktywności drukarek jest kluczowe dla wykrywania potencjalnych incydentów bezpieczeństwa.

### Syslog

Włączenie lokalnego logowania zdarzeń:

```
! U1 setvar "device.syslog.enable" "on"
! U1 setvar "device.syslog.log_max_file_size" "1000000"
```

### Eksport logów

```
! U1 setvar "device.syslog.save_local_file" "E:syslog.txt"
```

### Zdalne logowanie

Drukarki mogą wysyłać logi do zdalnego serwera syslog:

```
! U1 setvar "device.syslog.server" "192.168.1.50"
! U1 setvar "device.syslog.port" "514"
```

---

## Wdrożenie zabezpieczeń – krok po kroku

### Krok 1: Inwentaryzacja (Census)

Zidentyfikuj wszystkie drukarki w organizacji:
- Model i wersja firmware
- Typ platformy (Link-OS / ZebraLink)
- Zainstalowane opcje komunikacyjne
- Aktualne ustawienia zabezpieczeń

### Krok 2: Analiza wymagań (Consider)

Określ, które funkcje są niezbędne:
- Jakie protokoły drukowania są używane?
- Czy potrzebny jest dostęp WWW?
- Jakie interfejsy komunikacyjne są wykorzystywane?
- Jakie są wymagania regulacyjne (EU RED, RODO)?

### Krok 3: Konfiguracja (Configure)

Przygotuj skrypty konfiguracyjne lub użyj Zebra Printer Profile Manager:
- Ustaw hasła administratora
- Wyłącz nieużywane usługi
- Skonfiguruj szyfrowanie
- Włącz tryb chroniony

### Krok 4: Weryfikacja (Confirm)

Potwierdź poprawność konfiguracji:
- Wydrukuj raport konfiguracji
- Sprawdź stan trybu chronionego
- Przetestuj połączenia szyfrowane
- Zweryfikuj blokadę nieautoryzowanych zmian

---

## Narzędzia do zarządzania bezpieczeństwem drukarek Zebra

### Zebra Printer Profile Manager Enterprise

**PPME** umożliwia centralne zarządzanie konfiguracją całej floty drukarek:
- Tworzenie profili bezpieczeństwa
- Masowe wdrażanie ustawień
- Monitorowanie stanu urządzeń
- Aktualizacje firmware

### Zebra Setup Utilities

Bezpłatne narzędzie do konfiguracji pojedynczych drukarek:
- Konfiguracja sieci
- Ustawienia druku
- Aktualizacje firmware
- Diagnostyka

### Link-OS SDK

Zestaw narzędzi deweloperskich do integracji z systemami korporacyjnymi:
- API do zarządzania drukarkami
- Biblioteki dla różnych platform
- Przykłady kodu

---

## Podsumowanie

**Zebra PrintSecure** to kompleksowe rozwiązanie zabezpieczające drukarki przemysłowe przed współczesnymi zagrożeniami cyberbezpieczeństwa. Kluczowe elementy systemu obejmują:

- **Tryb chroniony (Protected Mode)** – blokada nieautoryzowanych zmian konfiguracji
- **Zarządzanie usługami** – kontrola nad protokołami sieciowymi i komunikacyjnymi
- **Szyfrowanie TLS** – bezpieczna transmisja danych
- **Zgodność z EU RED** – spełnienie wymagań regulacyjnych UE
- **Logowanie i audyt** – monitorowanie aktywności urządzeń

Wdrożenie zabezpieczeń PrintSecure wymaga systematycznego podejścia: inwentaryzacji urządzeń, analizy wymagań, konfiguracji ustawień i weryfikacji poprawności. Regularne aktualizacje firmware'u i rotacja poświadczeń zapewniają długoterminowe bezpieczeństwo floty drukarek.

Dla organizacji działających w Unii Europejskiej szczególnie istotna jest zgodność z **dyrektywą EU RED**, która od sierpnia 2025 roku wymaga odpowiednich zabezpieczeń cyberbezpieczeństwa w urządzeniach radiowych, w tym drukarkach z modułami Wi-Fi i Bluetooth.

---

## Słownik terminów

| Termin | Definicja |
|--------|-----------|
| **ASM** | Advanced Security Mode – tryb bezpieczny domyślnie |
| **CIA** | Model bezpieczeństwa: Confidentiality, Integrity, Availability |
| **CSR** | Certificate Signing Request – żądanie podpisania certyfikatu |
| **EU RED** | European Union Radio Equipment Directive |
| **IPPS** | Internet Printing Protocol Secure (szyfrowany IPP) |
| **Link-OS** | Platforma oprogramowania drukarek Zebra |
| **Protected Mode** | Tryb chroniony blokujący nieautoryzowane zmiany |
| **SGD** | Set-Get-Do – format komend konfiguracyjnych Zebra |
| **TLS** | Transport Layer Security – protokół szyfrowania |
| **ZPL** | Zebra Programming Language – język programowania drukarek |

---

## Przydatne linki

- [Dokumentacja Zebra TechDocs](https://techdocs.zebra.com)
- [Zebra Support](https://www.zebra.com/support)
- [Zebra PrintSecure Resources](https://www.zebra.com/printsecure)

---

*Artykuł opracowany na podstawie oficjalnej dokumentacji Zebra Technologies – PrintSecure Printer Administration Guide.*

**Słowa kluczowe:** Zebra PrintSecure, zabezpieczenia drukarek przemysłowych, Protected Mode Zebra, Link-OS security, szyfrowanie TLS drukarki, EU RED compliance, cyberbezpieczeństwo drukarek etykiet, konfiguracja bezpieczeństwa Zebra, zarządzanie flotą drukarek, certyfikaty TLS drukarka, HTTPS drukarka Zebra, Bluetooth security printer, wyłączanie usług drukarki, hasło administratora Zebra, firmware protection, audyt bezpieczeństwa drukarek

---

*Data publikacji: Styczeń 2025*
