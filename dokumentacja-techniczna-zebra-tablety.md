# Dokumentacja techniczna tabletów Zebra dla serwisu naprawczego

**Najważniejsze ustalenie: szczegółowe manuele serwisowe z procedurami demontażu NIE są publicznie dostępne — wymagają certyfikacji Zebra PartnerConnect.** Jednak obszerna dokumentacja techniczna istnieje poprzez oficjalne źródła Zebra, w tym Product Reference Guides z procedurami wymiany baterii, przewodniki po akcesoriach ze specyfikacjami doków oraz zgłoszenia FCC zawierające zdjęcia wewnętrznych komponentów.

---

## Realia dostępu do dokumentacji dla serwisów

Profesjonalne serwisy naprawcze stykają się z wielopoziomowym systemem dokumentacji. Zebra udostępnia publicznie Product Reference Guides, Quick Start Guides, arkusze specyfikacji i przewodniki po akcesoriach — obejmują one komponenty wymienialne przez użytkownika: baterie, karty SIM, expansion backs. Jednak **pełne procedury demontażu, listy FRU (Field Replaceable Unit), schematy diagnostyczne i schematy na poziomie komponentów wymagają członkostwa w Zebra PartnerConnect** lub statusu Autoryzowanego Serwisu.

Najcenniejszym publicznie dostępnym zasobem naprawczym są **zgłoszenia FCC**, które zawierają wysokorozdzielcze zdjęcia wnętrza pokazujące układy PCB, rozmieszczenie anten i komponenty. Wszystkie zgłoszenia FCC tabletów Zebra są dostępne przez fccid.io używając kodu producenta **UZ7**. Nie istnieją teardowny iFixit ani niezależne przewodniki naprawcze dla żadnego modelu tabletu Zebra.

---

## Zebra XSlate L10 (Xplore XSLATE L10)

Platforma L10, pierwotnie opracowana przez Xplore Technologies przed przejęciem przez Zebra, występuje w kilku wariantach: L10ax (aktualny Intel 11. gen), legacy L10 Windows (Pentium/Core i5/i7) oraz L10 Android (Snapdragon 660).

### Dokumentacja podstawowa

| Dokument | Link do pobrania |
|----------|------------------|
| L10ax Windows 11 Product Reference Guide | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/l10ax-windows-11-prg-en.pdf |
| L10ax Windows 10 Product Reference Guide | https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/tablets/l10ax/l10ax-windows-10-prg-en.pdf |
| L10 Android User Guide | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/l10-android-10-ug-en.pdf |
| L10 Tablet Accessory Guide | https://www.zebra.com/content/dam/zebra_dam/en/guide/configuration-and-accessories/xplore-l10-tablet-platform-guide-accessory-en-us.pdf |
| XSlate L10 Spec Sheet | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/xslate-l10-tablet-spec-sheet-en-us.pdf |

### Specyfikacje baterii

| Typ | Numer części | Pojemność | Cechy |
|-----|-------------|----------|-------|
| Bateria standardowa | **450148** | 36 Wh (Li-Ion, 3.87V) | Hot-swap, wskaźnik LED, ~2.75h ładowania |
| Bateria rozszerzona | **450149** | 98 Wh (Li-Ion) | Wymaga uchwytu kickstand, do 27h pracy |

L10 posiada wbudowaną baterię mostkową umożliwiającą hot-swap podczas wymiany baterii bez wyłączania urządzenia.

### Specyfikacje stacji dokujących

**Office Dock (Nr kat. 300154 / CRD-L10-OFF01):** HDMI, VGA, 2× USB 3.0, 2× USB 2.0, słuchawki/mikrofon, Gigabit Ethernet. Zasilacz: **450165** (120W, 19V, wtyk 5.5×2.5mm).

**Konfiguracje Vehicle Dock:**
- **300139**: Sama koleba (pasywna/bez zasilania)
- **300140**: Moduł xDIM G3 + adapter zapalniczki
- **300142**: Pełny dock + xDIM + adapter zapalniczki
- **300144**: Pełny dock + RF Pass-Through + xDIM + adapter zapalniczki

Wejście vehicle dock: 12-15 VDC nominalnie. Przetwornica DC/DC **450083** (9-60V) lub **450084** (50-150V) wymagana dla pojazdów o wyższym napięciu.

### Zgłoszenia FCC ze zdjęciami wnętrza

| Model | Link do zgłoszenia FCC |
|-------|------------------------|
| L10ax Windows | https://fccid.io/UZ7-RTL10C0 |
| L10 Android | https://fccid.io/UZ7RTL10B1 |

---

## Zebra ET40 i ET45 - tablety enterprise

ET40 (tylko Wi-Fi) i ET45 (Wi-Fi + 5G) to tablety Android dostępne w konfiguracjach 8" i 10". Oba mają tę samą obudowę i ekosystem akcesoriów, różnią się tylko łącznością komórkową.

### Dokumentacja podstawowa

| Dokument | Link do pobrania |
|----------|------------------|
| ET40/45 Product Reference Guide | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/et40-45-prg-en.pdf |
| ET40/45 Quick Start Guide | https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/tablets/et4x/et40-45-qsg-en.pdf |
| ET40/45 Accessories Guide | https://www.zebra.com/content/dam/zebra_dam/en/guide/configuration-and-accessories/et40-et45-guide-accessory-en-us.pdf |
| ET40/45 Spec Sheet | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/et40-et45-spec-sheet-en-us.pdf |

### Specyfikacje baterii

| Typ | Numer części | Pojemność | Czas ładowania |
|-----|-------------|----------|----------------|
| Bateria wewnętrzna 8" | **BTRY-ET4X-8IN1-01** | 6 100 mAh / 23.6 Wh (3.87V) | ~3h do 80% |
| Bateria wewnętrzna 10" | **BTRY-ET4X-10IN1-01** | 7 600 mAh / 29.41 Wh (3.87V) | ~4h do 80% |
| PowerPack zewnętrzny | **BTRY-ET5X-PRPK2-01** | 3 400 mAh / 25.84 Wh (7.6V) | Hot-swap |

PowerPack wymaga Expansion Back: **ZBK-ET4X-8BTRYBK1-01** (8") lub **ZBK-ET4X-10BTRYBK1-01** (10").

### Stacje dokujące i ładowarki

| Numer części | Opis | Wymagane zasilanie |
|-------------|------|-------------------|
| **CRD-ET4X-1SCHRG1-01** | Stacja ładująca 1-slot | PWR-BGA12V50W0WW + CBL-DC-388A1-01 |
| **CRD-ET4X-4SCHRG1-01** | Stacja ładująca 4-slot | PWR-BGA12V108W0WW + CBL-DC-382A1-01 |
| **CRD-ET4X-1SNWS-01** | Workstation Connect Cradle | HDMI, Ethernet, 4× USB-A, jack słuchawkowy |

### Zgłoszenia FCC ze zdjęciami wnętrza

| Model | Link do zgłoszenia FCC |
|-------|------------------------|
| ET40 8" | https://fccid.io/UZ7ET40AA |
| ET40 10" | https://fccid.io/UZ7ET40AB |
| ET45 warianty | https://fccid.io/UZ7ET45BA |

---

## Zebra ET60 i ET65 - tablety rugged

ET60 (Wi-Fi) i ET65 (Wi-Fi + 5G) wprowadzone w czerwcu 2023 z procesorami Qualcomm QCS6490 i Android 13. Warianty Windows (ET60W/ET65W) używają procesorów Intel Core Ultra.

### Dokumentacja podstawowa

| Dokument | Link do pobrania |
|----------|------------------|
| ET6x Product Reference Guide | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/et6x-prg-en.pdf |
| ET6x Accessories Guide | https://www.zebra.com/content/dam/zebra_dam/en/guide/configuration-and-accessories/et6x-series-guide-accessory-en-us.pdf |
| **Vehicle Dock Installation Guide** ⭐ | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/accessory/et6x-vehicle-dock-ig-en.pdf |
| ET60/65 Spec Sheet | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/et60-et65-spec-sheet-en-us.pdf |

⭐ Vehicle Dock Installation Guide (MN-004780-02EN) jest szczególnie wartościowy dla serwisów — zawiera szczegółowe specyfikacje techniczne i wymagania zasilania.

### Specyfikacje baterii

| Typ | Numer części | Pojemność | Temp. pracy |
|-----|-------------|----------|-------------|
| Bateria standardowa | **BTRY-ET6XA-9AH-01** | 9.3 Ah / 36 Wh | -20°C do 55°C |
| Bateria rozszerzona | **BTRY-ET6XA-18AH-01** | 18.7 Ah / 72 Wh | -30°C do 55°C |
| Windows standardowa | **BTRY-ET6XW-5AH-01** | 36 Wh | — |

Ładowarka baterii: **SAC-ET6X-2SCHG-01** (2-slot). Obie baterie obsługują **True Hot Swap** dzięki wewnętrznemu superkondensatorowi.

### Specyfikacje Vehicle Dock

| Numer części | Konfiguracja |
|-------------|--------------|
| **CRD-ET6X-VEHDK-CON-01** | 2× USB-A, RS-232, IP66, podgrzewane piny pogo |
| **CRD-ET6X-VEHDK-PTA-01** | Jak wyżej + 3× antenna pass-through (GPS, Wi-Fi, WWAN) |

Zasilacze pojazdowe: **PS1370** (24-90 VDC), **450083** (9-60 VDC), **450084** (50-150 VDC).

### Zgłoszenia FCC ze zdjęciami wnętrza

| Model | Link do zgłoszenia FCC |
|-------|------------------------|
| ET60 Android | https://fccid.io/UZ7ET60AW |
| ET65 Android | https://fccid.io/UZ7ET65AW |
| ET60W Windows | https://fccid.io/UZ7ET60WW |
| ET65W Windows | https://fccid.io/UZ7ET65WW |

### Opcje dokowania firm trzecich

**Seria Havis DS-ZEB-500** dla tabletów ET6x:
- DS-ZEB-501: Standardowe I/O (USB, 12V DC)
- DS-ZEB-504: Zaawansowane I/O (USB, Serial, Ethernet)
- DS-ZEB-504-3: Zaawansowane I/O + 3× antenna pass-through

---

## Zebra ET80 i ET85 - tablety Windows

ET80 (Wi-Fi) i ET85 (Wi-Fi + 5G/LTE) to 12" tablety Windows rugged 2-in-1 z procesorami Intel Core i5/i7, zaprojektowane dla służb publicznych, serwisu terenowego i produkcji.

### Dokumentacja podstawowa

| Dokument | Link do pobrania |
|----------|------------------|
| ET80/85 Product Reference Guide (78 stron) ⭐ | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/product/et80-et85-prg-en.pdf |
| ET8x Accessories Guide | https://www.zebra.com/content/dam/zebra_dam/en/guide/configuration-and-accessories/et8x-series-guide-accessory-en-us.pdf |
| Dock Installation Guide | https://www.zebra.com/content/dam/support-dam/en/documentation/unrestricted/guide/accessory/et80-et85-dock-ig-en.pdf |
| ET80/85 Spec Sheet | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/et80-et85-spec-sheet-en-us.pdf |

⭐ Product Reference Guide zawiera procedury troubleshootingu dla cold boot, problemów z ładowaniem, łączności bezprzewodowej, kalibracji dotyku i problemów z dokiem.

### Specyfikacje baterii

| Typ | Numer części | Pojemność | Cechy |
|-----|-------------|----------|-------|
| Bateria wewnętrzna | **BTRY-ET8X-12IN1-01** | 5 180 mAh / 39.27 Wh (7.7V) | ~3h pełne ładowanie, 11h pracy |
| Power Pack (Hot-Swap) | **BTRY-ET8X-PRPK1-01** | 3 400 mAh / 25.8 Wh (7.6V) | Wymaga Expansion Back |

Ładowarka baterii: **SAC-ET5X-4PPK1-01** (4-slot). Hot-swap wymaga Expansion Back **ZBK-ET5X-10RH1-01** lub **ZBK-ET8X-SMARTCARD-01**.

### Ekosystem stacji dokujących

| Numer części | Typ | Kluczowe cechy |
|-------------|-----|----------------|
| **CRD-ET8X-VEHDK1-01** | Vehicle Dock | 2× USB 2.0, 2× USB 3.0, 3× Ethernet, IP65, E-Mark 12V |
| **CRD-ET8X-PWRDK1-01** | Power Dock | Tylko ładowanie, IP65, mocowanie VESA |
| **CRD-ET8X-OFFDK1-01** | Office Dock | USB, Ethernet, HDMI, stojak biurkowy |

**Moduły rozszerzające do doków:**
- **CRD-ET8X-M-7PEM1-01**: 7-portowy (2× USB 2.0, 2× USB 3.0, 3× Ethernet)
- **CRD-ET8X-M-PTA1-01**: Pass-Through Antenna (WWAN, GPS, WLAN)
- **CRD-ET8X-M-FAN1-01**: Moduł aktywnego chłodzenia

Wszystkie doki przyjmują wejście 12-14 VDC, zużycie 60W. Zasilanie pojazdowe: **450143** (12V CLA), **450019** (12-32V CLA), **450083** (9-60V DC/DC), **450084** (50-150V DC/DC).

### Komponenty wymienialne przez użytkownika

Product Reference Guide potwierdza, że można wymienić bez certyfikacji serwisowej:
- Bateria główna (dostępna pod klapką baterii)
- Power Pack (wymaga Expansion Back)
- nano-SIM (tylko ET85, pod baterią)
- SSD (dostępny pod tylną pokrywą)
- Expansion Backs (śruby T6 Torx, moment 14 N-cm)

### Zgłoszenia FCC ze zdjęciami wnętrza

| Model | Link do zgłoszenia FCC |
|-------|------------------------|
| ET80 | https://fccid.io/UZ7-ET80A |
| ET85 LTE | https://fccid.io/UZ7-ET85B |
| ET85 5G | https://fccid.io/UZ7-ET85C |

### Dokowanie firm trzecich

**Seria Havis DS-ZEB-401:** 3× USB 3.1, USB-C, Ethernet, powered serial. DS-ZEB-401-3 dodaje potrójne antenna pass-through. Certyfikat MIL-STD 810H.

---

## Tabela zasilaczy (cross-reference)

Te zasilacze są używane w wielu liniach tabletów:

| Numer części | Wyjście | Zastosowanie |
|-------------|---------|--------------|
| **PWR-BGA12V50W0WW** | 12V/4.16A (50W) | Stacje 1-slot, ładowarki baterii |
| **PWR-BGA12V108W0WW** | 12V/9A (108W) | Stacje 4-slot |
| **PWR-BGA15V45W-UC2-WW** | 14V (45W) | Vehicle dock ET6x |
| **450083** | 9-60V wej → 13.2V wyj | Przetwornica DC/DC wózki widłowe |
| **450084** | 50-150V wej → 13.2V wyj | Przetwornica wysokonapięciowa |
| **450143** | 12V CLA | Adapter zapalniczki samochodowej |

Kable sieciowe AC wg regionu: **450040** (US), **450041** (UK), **450042** (EU), **450047** (AU/NZ).

---

## Dostęp do zastrzeżonej dokumentacji serwisowej

Dla pełnych manuali serwisowych, list FRU i procedur demontażu, serwisy naprawcze muszą uzyskać:

**Program Zebra PartnerConnect**: Aplikuj przez https://www.zebra.com/us/en/partners — zapewnia dostęp do dokumentacji technicznej, zamawiania części i procedur naprawczych. Wymaga weryfikacji firmy i certyfikacji szkoleniowej.

**Portal napraw Zebra**: https://www.zebra.com/us/en/support-downloads/request-repair.html — zgłaszanie napraw, sprawdzanie uprawnień, dostęp do przewodników naprawczych dla partnerów.

**Autoryzowani dostawcy usług**: Skontaktuj się z **Peak Technologies** (peaktech.com) lub innymi certyfikowanymi przez Zebra centrami naprawczymi w sprawie partnerstwa lub usług depot repair.

**Zdjęcia wewnętrzne FCC** pozostają najlepszym publicznie dostępnym zasobem do zrozumienia układów wewnętrznych komponentów. Wszystkie zgłoszenia można przeszukiwać na https://fccid.io/UZ7

---

## Podsumowanie dla serwisu

Ta kompilacja dokumentacji zapewnia serwisom naprawczym numery części baterii, specyfikacje dokowania i bezpośrednie linki do PDF-ów dla wszystkich siedmiu modeli tabletów Zebra. 

**Najcenniejsze dokumenty:**
1. **ET6x Vehicle Dock Installation Guide** — najszczegółowsza publicznie dostępna dokumentacja techniczna
2. **ET80/85 Product Reference Guide** — 78 stron z procedurami troubleshootingu
3. **Zgłoszenia FCC** — zdjęcia wnętrza dla wszystkich modeli

Dla napraw na poziomie komponentów, zdjęcia wewnętrzne FCC zapewniają kluczowe odniesienie wizualne, podczas gdy pełne procedury serwisowe wymagają certyfikacji Zebra Partner. Zestandaryzowany ekosystem zasilaczy w różnych liniach tabletów upraszcza zarządzanie magazynem dla operacji naprawczych wielu modeli.
