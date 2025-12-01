// Blog data structure and utilities

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: {
    name: string
    role: string
  }
  publishedAt: string
  updatedAt?: string
  readingTime: number // w minutach
  deviceType: 'drukarki' | 'terminale' | 'skanery' | 'tablety' | 'inne'
  category: 'poradniki' | 'troubleshooting' | 'porownania' | 'aktualnosci'
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

// Typy urządzeń (główna nawigacja)
export const DEVICE_TYPES = {
  drukarki: {
    name: 'Drukarki',
    description: 'Drukarki etykiet i kart plastikowych',
    icon: 'Printer'
  },
  terminale: {
    name: 'Terminale',
    description: 'Terminale mobilne i stacjonarne',
    icon: 'Smartphone'
  },
  skanery: {
    name: 'Skanery',
    description: 'Skanery kodów kreskowych',
    icon: 'ScanLine'
  },
  tablety: {
    name: 'Tablety',
    description: 'Tablety przemysłowe Zebra',
    icon: 'Tablet'
  },
  inne: {
    name: 'Inne',
    description: 'Akcesoria i pozostałe urządzenia',
    icon: 'Package'
  }
}

// Kategorie treści (typ artykułu)
export const BLOG_CATEGORIES = {
  poradniki: {
    name: 'Poradniki',
    description: 'Praktyczne przewodniki krok po kroku',
    color: 'blue'
  },
  troubleshooting: {
    name: 'Rozwiązywanie problemów',
    description: 'Diagnoza i naprawa typowych usterek',
    color: 'red'
  },
  porownania: {
    name: 'Porównania',
    description: 'Zestawienia modeli i funkcji',
    color: 'purple'
  },
  aktualnosci: {
    name: 'Aktualności',
    description: 'Nowości ze świata Zebra',
    color: 'green'
  }
}

// Wszystkie artykuły bloga
export const blogPosts: BlogPost[] = [
  {
    slug: 'drukarka-zebra-nie-drukuje-przyczyny-rozwiazania',
    title: 'Drukarka Zebra nie drukuje - 7 najczęstszych przyczyn i jak je naprawić',
    excerpt: 'Twoja drukarka Zebra przestała drukować? Poznaj 7 najczęstszych przyczyn tego problemu i dowiedz się, jak je samodzielnie zdiagnozować i naprawić.',
    coverImage: '/blog/zebra-nie-drukuje.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-11-30',
    readingTime: 8,
    deviceType: 'drukarki',
    category: 'troubleshooting',
    tags: ['drukarka zebra', 'nie drukuje', 'troubleshooting', 'naprawa'],
    seo: {
      metaTitle: 'Drukarka Zebra nie drukuje - 7 przyczyn i rozwiązania | Serwis Zebra',
      metaDescription: 'Drukarka Zebra nie drukuje? Poznaj 7 najczęstszych przyczyn: problemy z głowicą, ribbon, kalibracją, sterownikami. Poradnik krok po kroku od certyfikowanych techników.',
      keywords: ['drukarka zebra nie drukuje', 'naprawa drukarki zebra', 'problemy z drukarką zebra', 'serwis zebra']
    },
    content: `
## Dlaczego drukarka Zebra nie drukuje?

Drukarki etykiet Zebra to niezawodne urządzenia przemysłowe, ale jak każdy sprzęt, mogą czasem sprawiać problemy. Jeśli Twoja drukarka Zebra przestała drukować, nie panikuj - w większości przypadków przyczyna jest prosta do zdiagnozowania i naprawienia.

W tym artykule przedstawiamy **7 najczęstszych przyczyn** problemów z drukowaniem i pokazujemy, jak je rozwiązać.

---

## 1. Problemy z zasilaniem i połączeniem

### Objawy:
- Drukarka nie reaguje na polecenia
- Diody nie świecą się lub migają nieprawidłowo
- Brak komunikacji z komputerem

### Rozwiązanie:
1. Sprawdź, czy kabel zasilający jest prawidłowo podłączony
2. Upewnij się, że gniazdko elektryczne działa
3. Sprawdź kabel USB/Ethernet - wymień na nowy, jeśli jest uszkodzony
4. Zrestartuj drukarkę (wyłącz na 30 sekund, włącz ponownie)

> **💡 Wskazówka:** Drukarki Zebra serii ZD wymagają zasilacza o odpowiedniej mocy. Używanie nieoryginalnego zasilacza może powodować problemy.

---

## 2. Nieprawidłowo załadowany ribbon (taśma barwiąca)

### Objawy:
- Wydruk jest blady lub niewidoczny
- Drukarka sygnalizuje błąd ribbonu
- Etykiety wychodzą puste

### Rozwiązanie:
1. Otwórz pokrywę drukarki
2. Sprawdź, czy ribbon jest załadowany **stroną barwiącą do dołu**
3. Upewnij się, że ribbon przechodzi przez głowicę drukującą
4. Sprawdź, czy ribbon nie jest skończony lub zerwany

### Jak sprawdzić orientację ribbonu?
Przyłóż kawałek białej kartki do ribbonu i przetrzyj palcem. Strona, która zostawia ślad, powinna być skierowana **do etykiety**.

---

## 3. Problemy z kalibracją sensora

### Objawy:
- Drukarka drukuje na niewłaściwym miejscu
- Etykiety są przesunięte
- Drukarka "szuka" początku etykiety

### Rozwiązanie:
1. Wykonaj **auto-kalibrację** (przytrzymaj przycisk FEED przez 5 sekund)
2. Wyczyść sensor gap/black mark sprężonym powietrzem
3. Sprawdź, czy etykiety są prawidłowo załadowane

### Kalibracja ręczna w Zebra Setup Utilities:
\`\`\`
1. Otwórz Zebra Setup Utilities
2. Wybierz drukarkę → Open Printer Tools
3. Action → Calibrate Media
\`\`\`

---

## 4. Zużyta lub uszkodzona głowica drukująca

### Objawy:
- Pionowe białe linie na wydruku
- Nierównomierny wydruk
- Blady wydruk mimo nowego ribbonu

### Rozwiązanie:
1. **Wyczyść głowicę** alkoholem izopropylowym (IPA 99%)
2. Użyj specjalnych kart czyszczących Zebra
3. Sprawdź żywotność głowicy w ustawieniach drukarki

> **⚠️ Uwaga:** Jeśli czyszczenie nie pomaga, głowica może wymagać wymiany. Jest to część eksploatacyjna o żywotności 1-3 milionów cm wydruku.

**Koszt wymiany głowicy w naszym serwisie: 450-2400 zł** (w zależności od modelu)

---

## 5. Problemy ze sterownikami

### Objawy:
- Drukarka jest widoczna, ale nie drukuje
- Błędy w kolejce wydruku
- Nieprawidłowy format wydruku

### Rozwiązanie:
1. Pobierz najnowsze sterowniki ze strony [zebra.com/drivers](https://www.zebra.com/drivers)
2. Odinstaluj stare sterowniki
3. Zainstaluj nowe sterowniki i zrestartuj komputer
4. Ustaw drukarkę jako domyślną

---

## 6. Niewłaściwe ustawienia formatu etykiety

### Objawy:
- Wydruk jest obcięty
- Puste etykiety między wydrukami
- Tekst wychodzi poza etykietę

### Rozwiązanie:
1. Zmierz dokładnie wymiary etykiety
2. W sterowniku drukarki ustaw prawidłowe wymiary
3. Skonfiguruj typ sensora (Gap/Black Mark/Continuous)
4. Wykonaj wydruk testowy

---

## 7. Problemy z aplikacją lub plikiem ZPL

### Objawy:
- Drukarka reaguje, ale etykieta jest pusta
- Błędny układ wydruku
- Drukarka nie rozumie komendy

### Rozwiązanie:
1. Wyślij testowy plik ZPL bezpośrednio do drukarki
2. Sprawdź, czy język programowania jest ustawiony na ZPL (nie EPL)
3. Zweryfikuj kod ZPL w narzędziu Zebra Designer

### Przykładowy testowy kod ZPL:
\`\`\`zpl
^XA
^FO50,50^ADN,36,20^FDTest wydruku^FS
^FO50,100^BY3^BCN,100,Y,N,N^FD123456789^FS
^XZ
\`\`\`

---

## Kiedy oddać drukarkę do serwisu?

Jeśli powyższe rozwiązania nie pomogły, problem może wymagać profesjonalnej diagnostyki. **Oddaj drukarkę do serwisu gdy:**

- Głowica drukująca jest fizycznie uszkodzona
- Mechanizm podawania etykiet nie działa prawidłowo
- Płyta główna sygnalizuje błędy
- Problem powraca mimo wielokrotnych prób naprawy

---

## Bezpłatna diagnoza w Serwis Zebra

Jako **autoryzowany partner serwisowy Zebra** oferujemy:

[CHECK] **Bezpłatna diagnoza** problemu*
[CHECK] **Odbiór kurierem** z całej Polski
[CHECK] **Gwarancja na naprawę** 12 miesięcy
[CHECK] **Oryginalne części** Zebra

*Diagnoza jest bezpłatna w przypadku zlecenia naprawy w naszym serwisie.

[**Wyślij zgłoszenie →**](/#formularz)

---

## FAQ - Najczęściej zadawane pytania

### Ile kosztuje naprawa drukarki Zebra?
Ceny napraw zaczynają się od 150 zł za czyszczenie mechanizmu. Wymiana głowicy to koszt 450-2400 zł w zależności od modelu. Dokładną wycenę otrzymasz po bezpłatnej diagnozie.

### Jak długo trwa naprawa?
Standardowa naprawa trwa 3-5 dni roboczych. Oferujemy również tryb express (1-2 dni) za dodatkową opłatą.

### Czy mogę samodzielnie wymienić głowicę?
Tak, ale wymaga to odpowiednich narzędzi i wiedzy. Nieprawidłowy montaż może uszkodzić drukarkę. Zalecamy skorzystanie z profesjonalnego serwisu.

### Moja drukarka jest na gwarancji - co robić?
Skontaktuj się z nami - jako autoryzowany serwis Zebra obsługujemy również naprawy gwarancyjne.
`
  },
  {
    slug: 'jak-wyczyscic-glowice-drukarki-zebra',
    title: 'Jak wyczyścić głowicę drukującą w drukarkach Zebra - poradnik krok po kroku',
    excerpt: 'Regularne czyszczenie głowicy drukującej wydłuża jej żywotność i poprawia jakość wydruku. Zobacz jak prawidłowo czyścić głowicę w drukarkach Zebra.',
    coverImage: '/blog/czyszczenie-glowicy.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-11-30',
    readingTime: 6,
    deviceType: 'drukarki',
    category: 'poradniki',
    tags: ['głowica drukująca', 'czyszczenie', 'konserwacja', 'poradnik'],
    seo: {
      metaTitle: 'Jak wyczyścić głowicę drukarki Zebra - poradnik | Serwis Zebra',
      metaDescription: 'Poradnik czyszczenia głowicy drukującej Zebra krok po kroku. Dowiedz się jak prawidłowo konserwować drukarkę etykiet i wydłużyć żywotność głowicy.',
      keywords: ['czyszczenie głowicy zebra', 'konserwacja drukarki zebra', 'jak czyścić głowicę']
    },
    content: `
## Dlaczego warto regularnie czyścić głowicę drukującą?

Głowica drukująca to najważniejszy element drukarki etykiet Zebra. Jej prawidłowa konserwacja:

- **Wydłuża żywotność** głowicy nawet 2-3 krotnie
- **Poprawia jakość** wydruku
- **Zapobiega** kosztownym naprawom
- **Oszczędza** ribbon i etykiety

---

## Jak często czyścić głowicę?

| Intensywność użytkowania | Częstotliwość czyszczenia |
|-------------------------|---------------------------|
| Lekkie (do 100 etykiet/dzień) | Co 2-4 tygodnie |
| Średnie (100-500 etykiet/dzień) | Co tydzień |
| Intensywne (500+ etykiet/dzień) | Codziennie lub co 2-3 dni |

---

## Czego potrzebujesz?

1. **Alkohol izopropylowy (IPA) 99%** - NIE używaj alkoholu z apteki (70%)
2. **Patyczki bawełniane** bez luźnych włókien lub specjalne patyczki Zebra
3. **Karty czyszczące** Zebra (opcjonalnie, ale zalecane)
4. **Sprężone powietrze** do usuwania kurzu

> **⚠️ Ważne:** Nigdy nie używaj ostrych narzędzi do czyszczenia głowicy!

---

## Czyszczenie krok po kroku

### Krok 1: Przygotowanie drukarki
1. **Wyłącz drukarkę** i odłącz od zasilania
2. Poczekaj **2-3 minuty** aż głowica ostygnie
3. Otwórz pokrywę drukarki
4. Wyjmij ribbon i etykiety

### Krok 2: Czyszczenie głowicy
1. Zwilż patyczek alkoholem IPA 99%
2. **Delikatnie przetrzyj** głowicę od jednego końca do drugiego
3. Wykonaj ruch **tylko w jednym kierunku** (nie tam i z powrotem!)
4. Powtórz z nowym patyczkiem aż będzie czysty

### Krok 3: Czyszczenie wałka dociskowego (platen roller)
1. Obróć wałek ręcznie
2. Przetrzyj całą powierzchnię zwilżonym patyczkiem
3. Usuń wszelkie pozostałości kleju i kurzu

### Krok 4: Czyszczenie sensorów
1. Zlokalizuj sensor gap/black mark
2. Delikatnie przedmuchaj sprężonym powietrzem
3. Przetrzyj suchym patyczkiem

### Krok 5: Montaż i test
1. Poczekaj **2-3 minuty** aż alkohol wyparuje
2. Załaduj ribbon i etykiety
3. Zamknij pokrywę
4. Włącz drukarkę i wykonaj wydruk testowy

---

## Użycie kart czyszczących Zebra

Karty czyszczące to najwygodniejsza metoda konserwacji:

1. Wyjmij ribbon i etykiety
2. Włóż kartę czyszczącą jak etykietę
3. Zamknij pokrywę
4. Naciśnij przycisk FEED 3-4 razy
5. Wyjmij kartę

---

## Czego NIE robić?

❌ Nie używaj alkoholu mniej niż 99%  
❌ Nie czyść gorącej głowicy  
❌ Nie używaj ostrych narzędzi  
❌ Nie dotykaj głowicy palcami  
❌ Nie używaj wody ani detergentów  

---

## Kiedy wymienić głowicę?

Nawet przy prawidłowej konserwacji głowica zużywa się. Oznaki konieczności wymiany:

- Pionowe białe linie na wydruku (mimo czyszczenia)
- Nierównomierny wydruk
- Widoczne rysy na powierzchni głowicy
- Przekroczony resurs (1-3 mln cm)

**Potrzebujesz wymiany głowicy? [Skontaktuj się z nami →](/#formularz)**
`
  },
  {
    slug: 'wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje',
    title: 'Wymiana głowicy drukującej Zebra - kiedy jest konieczna i ile kosztuje?',
    excerpt: 'Głowica drukująca to serce każdej drukarki etykiet. Dowiedz się, kiedy wymiana jest nieunikniona, jakie są koszty i czy warto to robić samodzielnie.',
    coverImage: '/blog/wymiana-glowicy.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-12-01',
    readingTime: 7,
    deviceType: 'drukarki',
    category: 'poradniki',
    tags: ['głowica drukująca', 'wymiana głowicy', 'koszt naprawy', 'drukarka zebra'],
    seo: {
      metaTitle: 'Wymiana głowicy drukującej Zebra - kiedy i ile kosztuje? | Serwis Zebra',
      metaDescription: 'Kiedy wymienić głowicę w drukarce Zebra? Poznaj objawy zużycia, koszty wymiany (450-2400 zł) i dowiedz się, czy warto robić to samodzielnie. Poradnik od certyfikowanych techników.',
      keywords: ['wymiana głowicy zebra', 'głowica drukująca zebra cena', 'koszt wymiany głowicy', 'głowica zebra zd420']
    },
    content: `
## Czym jest głowica drukująca i dlaczego jest tak ważna?

Głowica drukująca (printhead) to **najważniejszy element** każdej drukarki termicznej i termotransferowej. To właśnie ona odpowiada za przenoszenie obrazu na etykietę poprzez precyzyjne nagrzewanie punktów (pikseli).

Głowica składa się z tysięcy mikroskopijnych elementów grzejnych. W drukarce o rozdzielczości 203 DPI jest ich około 800, a przy 300 DPI - już ponad 1200!

---

## Objawy zużytej głowicy - kiedy wymiana jest konieczna?

### Objawy wymagające natychmiastowej wymiany:

[CHECK] **Pionowe białe linie** na całej długości wydruku
[CHECK] **Przerywany wydruk** w tych samych miejscach
[CHECK] **Widoczne rysy** lub uszkodzenia na powierzchni głowicy
[CHECK] **Brak reakcji** na czyszczenie - problemy nie ustępują

### Objawy ostrzegawcze (możliwa jeszcze naprawa):

- Lekko blady wydruk w niektórych miejscach
- Sporadyczne "pikselowanie" tekstu
- Nierówna jakość wydruku kodów kreskowych

> **💡 Wskazówka:** Jeśli czyszczenie głowicy alkoholem IPA 99% nie pomaga po 2-3 próbach, prawdopodobnie głowica wymaga wymiany.

---

## Żywotność głowicy - ile powinna wytrzymać?

| Typ drukarki | Żywotność głowicy | Czynniki wpływające |
|--------------|-------------------|---------------------|
| Desktop (ZD420, ZD621) | 1-2 mln cm | Jakość etykiet, ribbon |
| Przemysłowa (ZT411, ZT610) | 2-4 mln cm | Prędkość druku, temperatura |
| Mobilna (ZQ520) | 0.5-1 mln cm | Warunki pracy, kurz |

### Co skraca żywotność głowicy?

1. **Tanie etykiety** z szorstkimi powierzchniami
2. **Niewłaściwy ribbon** (źle dopasowany do etykiet)
3. **Brak regularnego czyszczenia**
4. **Zbyt wysoka temperatura** druku
5. **Kurz i zanieczyszczenia** w środowisku pracy

---

## Ile kosztuje wymiana głowicy?

### Cennik wymiany głowicy w Serwis Zebra:

| Model drukarki | Cena głowicy | Koszt wymiany | Razem |
|----------------|--------------|---------------|-------|
| ZD220, ZD230 | 200-280 zł | 50-80 zł | 250-360 zł |
| ZD420, ZD421 | 280-350 zł | 50-80 zł | 330-430 zł |
| ZD620, ZD621 | 350-450 zł | 50-80 zł | 400-530 zł |
| ZT230 | 400-500 zł | 80-100 zł | 480-600 zł |
| ZT411, ZT421 | 500-700 zł | 80-100 zł | 580-800 zł |
| ZT610, ZT620 | 700-1000 zł | 100-150 zł | 800-1150 zł |

*Ceny netto, orientacyjne. Dokładna wycena po diagnozie.*

### Co wpływa na cenę?

- **Rozdzielczość** głowicy (203 DPI vs 300 DPI vs 600 DPI)
- **Szerokość** druku (im szersza, tym droższa)
- **Dostępność** części (popularne modele taniej)

---

## Wymiana samodzielna vs serwis - co wybrać?

### Samodzielna wymiana:

**Zalety:**
- Szybkość (od ręki)
- Brak kosztów robocizny

**Wady:**
- Ryzyko uszkodzenia drukarki
- Brak gwarancji na montaż
- Konieczność zakupu narzędzi
- Ryzyko zakupu nieoryginalnej części

### Wymiana w autoryzowanym serwisie:

**Zalety:**
- Profesjonalny montaż
- Kalibracja po wymianie
- Gwarancja 12 miesięcy
- Oryginalne części Zebra
- Kompleksowy przegląd drukarki

**Wady:**
- Czas oczekiwania (2-5 dni)
- Koszt robocizny

> **⚠️ Uwaga:** Nieprawidłowy montaż głowicy może uszkodzić płytę główną drukarki! Koszt naprawy płyty to 500-1500 zł.

---

## Jak przedłużyć żywotność głowicy?

### 1. Regularne czyszczenie

- **Desktop**: co 1-2 tygodnie
- **Przemysłowe**: codziennie przy intensywnej pracy
- Używaj **tylko alkoholu IPA 99%**

### 2. Stosuj oryginalne materiały

- Etykiety z certyfikatem Zebra
- Ribbon dopasowany do etykiet (wax, wax-resin, resin)

### 3. Optymalizuj ustawienia

- Nie ustawiaj zbyt wysokiej temperatury (darkness)
- Dostosuj prędkość druku do materiału

### 4. Dbaj o środowisko pracy

- Minimalizuj kurz i zanieczyszczenia
- Temperatura 15-30°C, wilgotność 20-80%

---

## Czy warto kupować zamienniki?

### Oryginalna głowica Zebra:

[CHECK] Gwarancja producenta
[CHECK] Pełna kompatybilność
[CHECK] Dłuższa żywotność
[CHECK] Lepsza jakość wydruku

### Zamiennik (aftermarket):

- Cena niższa o 30-50%
- Brak gwarancji Zebra
- Możliwe problemy z jakością
- Ryzyko uszkodzenia drukarki

**Nasza rekomendacja:** Dla drukarek używanych w biznesie zawsze zalecamy **oryginalne głowice Zebra**. Oszczędność 100-200 zł nie rekompensuje ryzyka awarii i przestoju produkcji.

---

## Wymiana głowicy w Serwis Zebra

Jako **autoryzowany partner serwisowy Zebra** oferujemy:

[CHECK] **Bezpłatna diagnostyka** problemu*  
[CHECK] **Oryginalne głowice** Zebra
[CHECK] **Profesjonalny montaż** + kalibracja
[CHECK] **Gwarancja 12 miesięcy** na naprawę
[CHECK] **Odbiór kurierem** z całej Polski

*Diagnostyka bezpłatna w przypadku realizacji naprawy w naszym serwisie. W innym przypadku koszt diagnostyki wynosi 99 zł + VAT.

[**Wyślij drukarkę do wymiany głowicy →**](/#formularz)

---

## FAQ - Najczęściej zadawane pytania

### Czy mogę sam wymienić głowicę w drukarce Zebra?
Technicznie tak, ale nie zalecamy. Wymiana wymaga odpowiednich narzędzi, wiedzy i kalibracji. Nieprawidłowy montaż może uszkodzić płytę główną (koszt naprawy 500-1500 zł).

### Jak sprawdzić stan głowicy w drukarce Zebra?
W menu drukarki znajdziesz licznik "Head Life" lub "Odometer". Pokazuje on przebieg głowicy w centymetrach. Porównaj z zaleceniami producenta dla Twojego modelu.

### Czy wymiana głowicy naprawi białe pasy na wydruku?
W 90% przypadków tak. Białe pionowe pasy to najczęstszy objaw uszkodzonej głowicy. Przed wymianą warto jednak spróbować dokładnego czyszczenia.

### Ile trwa wymiana głowicy w serwisie?
Standardowa wymiana trwa 1-2 dni robocze od momentu dostarczenia drukarki. W trybie express możliwa realizacja w 24h (+50 zł).
`
  },
  {
    slug: 'zebra-gk420-czerwona-dioda-diagnostyka',
    title: 'Czerwona dioda w Zebra GK420d/GK420t - co oznacza i jak naprawić?',
    excerpt: 'Czerwona lampka w drukarce Zebra serii GK420 może oznaczać różne problemy. Poznaj wszystkie sekwencje mrugania i dowiedz się, jak je naprawić samodzielnie.',
    coverImage: '/blog/czerwona-dioda-gk.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-12-01',
    readingTime: 10,
    deviceType: 'drukarki',
    category: 'troubleshooting',
    tags: ['GK420d', 'GK420t', 'czerwona dioda', 'troubleshooting', 'diagnostyka'],
    seo: {
      metaTitle: 'Zebra GK420d czerwona dioda - co oznacza? Diagnostyka | Serwis Zebra',
      metaDescription: 'Czerwona dioda w Zebra GK420d/GK420t? Poznaj wszystkie sekwencje mrugania: ciągła, pulsująca, migająca. Instrukcja diagnostyki krok po kroku od certyfikowanych techników.',
      keywords: ['zebra gk420d czerwona dioda', 'gk420t lampka czerwona', 'zebra gk420 błąd', 'gk420d nie drukuje']
    },
    content: `
## Problem: Czerwona dioda w drukarce Zebra GK420

Drukarki Zebra serii GK (GK420d, GK420t, GX420d, GX420t) mają minimalistyczny interfejs - tylko **jeden przycisk** i **jedną diodę LED**. To sprawia, że interpretacja błędów może być trudna, bo drukarka "komunikuje się" poprzez różne sekwencje świecenia i mrugania.

W tym artykule wyjaśniamy wszystkie możliwe stany diody i jak naprawić każdy z problemów.

---

## Tabela szybkiej diagnostyki

| Stan diody | Co oznacza | Rozwiązanie |
|------------|------------|-------------|
| **Ciągła czerwona** | Głowica otwarta (Head Open) | Zamknij pokrywę drukarki |
| **Migająca czerwona** | Brak papieru (Media Out) | Załaduj nową rolkę etykiet |
| **Czerwona + żółta** | Przegrzanie głowicy | Wyłącz drukarkę na 15 min |
| **Szybkie miganie** | Błąd pamięci/firmware | Reset do ustawień fabrycznych |
| **2x mignięcie** | Błąd kalibracji | Wykonaj kalibrację Smart Cal |
| **Ciągła zielona** | Drukarka gotowa | Brak błędu ✓ |

---

## 1. Ciągła czerwona dioda - "Head Open"

### Przyczyna

Drukarka wykrywa, że pokrywa (głowica) jest otwarta. Jest to **najczęstszy błąd** w serii GK420.

### Rozwiązania

**Krok 1: Sprawdź pokrywę**
- Upewnij się, że pokrywa jest całkowicie zamknięta
- Powinno być słyszalne kliknięcie zatrzasku

**Krok 2: Sprawdź czujnik otwarcia**
- Znajdź mały mikrostyk (przełącznik) przy zawiasie głowicy
- Sprawdź, czy nie jest zabrudzony lub uszkodzony
- Delikatnie oczyść sprężonym powietrzem

**Krok 3: Sprawdź mechanizm zatrzasku**
- Zatrzask powinien pewnie trzymać głowicę
- Jeśli jest luźny - może być uszkodzony

> **💡 Wskazówka:** Jeśli pokrywa jest zamknięta, ale błąd nie znika - prawdopodobnie uszkodzony jest mikrostyk czujnika. To wymaga naprawy serwisowej.

---

## 2. Migająca czerwona dioda - "Media Out"

### Przyczyna

Drukarka nie wykrywa etykiet. Może to oznaczać:
- Brak papieru
- Źle załadowany papier
- Rozkalibrowany czujnik

### Rozwiązania

**Krok 1: Sprawdź rolkę etykiet**
- Czy jest papier na rolce?
- Czy etykiety są prawidłowo przeprowadzone przez prowadnice?

**Krok 2: Wykonaj kalibrację (Smart Calibration)**

To najważniejsza procedura dla serii GK420!

1. Upewnij się, że etykiety są załadowane
2. Wyłącz drukarkę
3. **Przytrzymaj przycisk Feed**
4. Włącz drukarkę trzymając przycisk
5. Gdy dioda mignie **2 razy** - puść przycisk
6. Drukarka wykalibruje czujnik automatycznie

**Krok 3: Sprawdź typ etykiet**

| Typ etykiet | Czujnik | Ustawienie |
|-------------|---------|------------|
| Z przerwami (gap) | Transmisyjny | Web Sensing |
| Ciągłe (continuous) | Refleksyjny | Mark Sensing |
| Z czarną linią | Refleksyjny | Mark Sensing |

> **⚠️ Uwaga:** Jeśli używasz etykiet transparentnych lub o nietypowej grubości, standardowa kalibracja może nie działać. W takim przypadku wymagana jest ręczna konfiguracja czujników.

---

## 3. Dioda czerwona + żółta - Przegrzanie

### Przyczyna

Głowica drukująca osiągnęła zbyt wysoką temperaturę. Drukarka automatycznie wstrzymuje pracę, aby chronić głowicę przed uszkodzeniem.

### Rozwiązania

**Krok 1: Wyłącz drukarkę**
- Odczekaj minimum **15-20 minut** na ostygnięcie

**Krok 2: Sprawdź warunki pracy**
- Temperatura otoczenia powinna wynosić 5-40°C
- Drukarka nie może stać przy grzejniku lub w nasłonecznionym miejscu

**Krok 3: Zmniejsz intensywność druku**
- Obniż ustawienie "Darkness" (zaczernienie) w sterowniku
- Zmniejsz prędkość druku
- Rób przerwy przy dużych wolumenach

**Krok 4: Sprawdź wentylację**
- Otwory wentylacyjne nie mogą być zasłonięte
- Usuń kurz z wnętrza drukarki

---

## 4. Szybkie miganie - Błąd pamięci lub firmware

### Przyczyna

Drukarka napotkała błąd systemowy. Może to być:
- Uszkodzony firmware
- Błąd pamięci (Out of Memory)
- Konflikt konfiguracji

### Rozwiązania

**Krok 1: Restart drukarki**
- Wyłącz, odczekaj 30 sekund, włącz

**Krok 2: Reset do ustawień fabrycznych**

1. Wyłącz drukarkę
2. **Przytrzymaj przycisk Feed**
3. Włącz drukarkę trzymając przycisk
4. Gdy dioda mignie **6 razy** - puść przycisk
5. Drukarka przywróci ustawienia domyślne

> **⚠️ Uwaga:** Po resecie konieczna będzie ponowna konfiguracja (prędkość, ciemność, typ etykiet).

**Krok 3: Aktualizacja firmware**
- Pobierz najnowszy firmware ze strony Zebra
- Wgraj przez Zebra Setup Utilities

---

## 5. Problemy z jakością wydruku przy czerwonej diodzie

Czasem drukarka pozornie działa (drukuje), ale jakość wydruku jest zła. To może wskazywać na problemy, które wkrótce spowodują czerwoną diodę.

### Blady wydruk

**Przyczyny:**
- Zbyt niska temperatura głowicy (Darkness)
- Zużyta głowica
- Niewłaściwy zasilacz (zamiennik)

**Rozwiązanie:**
1. Zwiększ "Darkness" w sterowniku (zalecane: 20-25)
2. Wyczyść głowicę alkoholem IPA 99%
3. Sprawdź, czy zasilacz to oryginał Zebra (20V)

### "Duchy" na etykiecie (podwójny obraz)

**Przyczyny:**
- Zużyty wałek dociskowy (Platen Roller)
- Zbyt wysoka temperatura

**Rozwiązanie:**
1. Sprawdź wałek - czy ma rowki, nacięcia?
2. Zmniejsz "Darkness"
3. Wymień wałek (80-150 zł w serwisie)

### Pionowe białe linie

**Przyczyna:** Uszkodzona głowica drukująca

**Rozwiązanie:**
1. Wyczyść głowicę
2. Jeśli nie pomoże - wymiana głowicy (250-400 zł)

---

## Sekwencje diody - pełna tabela diagnostyczna

| Sekwencja | Opis | Priorytet |
|-----------|------|-----------|
| Zielona ciągła | Gotowa do pracy | ✅ OK |
| Zielona pulsująca | Odbiera dane | ✅ OK |
| Żółta ciągła | Uruchamianie | ⏳ Czekaj |
| Czerwona ciągła | Head Open | 🔴 Napraw |
| Czerwona migająca | Media Out | 🔴 Napraw |
| Czerwona + żółta | Przegrzanie | 🟡 Czekaj |
| Szybkie miganie | Błąd krytyczny | 🔴 Reset |
| Brak świecenia | Brak zasilania | 🔴 Sprawdź kabel |

---

## Kiedy oddać drukarkę do serwisu?

Niektóre problemy wymagają interwencji profesjonalisty:

[CHECK] Czerwona dioda **mimo zamkniętej pokrywy** - uszkodzony czujnik
[CHECK] **Powtarzające się przegrzewanie** - problem z elektroniką
[CHECK] Błąd **nie znika po resecie** - uszkodzony firmware/płyta
[CHECK] **Białe pasy po czyszczeniu** - wymiana głowicy
[CHECK] **Zacięcia papieru** - zużyty mechanizm

---

## Bezpłatna diagnostyka w Serwis Zebra

Masz drukarkę GK420 z czerwoną diodą i nie wiesz co robić?

Jako **autoryzowany partner serwisowy Zebra** oferujemy:

[CHECK] **Bezpłatna diagnostyka** problemu*  
[CHECK] **Odbiór kurierem** z całej Polski
[CHECK] **Gwarancja 12 miesięcy** na naprawę
[CHECK] **Oryginalne części** Zebra

*Diagnostyka bezpłatna w przypadku realizacji naprawy w naszym serwisie. W innym przypadku koszt diagnostyki wynosi 99 zł + VAT.

[**Wyślij drukarkę do diagnozy →**](/#formularz)

---

## FAQ - Najczęściej zadawane pytania

### Dlaczego drukarka GK420 świeci na czerwono mimo zamkniętej pokrywy?
Prawdopodobnie uszkodzony jest mikrostyk czujnika otwarcia głowicy. To częsty problem w starszych drukarkach. Wymaga naprawy serwisowej (koszt ok. 100-200 zł).

### Jak wykonać kalibrację w GK420d?
Wyłącz drukarkę, przytrzymaj przycisk Feed, włącz drukarkę trzymając przycisk, puść gdy dioda mignie 2 razy. Drukarka automatycznie skalibruje czujniki.

### Czy mogę używać zamiennika zasilacza do GK420?
Nie zalecamy. Zasilacze zamienniki często mają niższą moc, co skutkuje bladym wydrukiem i przegrzewaniem. Oryginalny zasilacz Zebra to 20V/2.5A.

### Ile kosztuje naprawa GK420 z czerwoną diodą?
Zależy od przyczyny: wymiana czujnika 100-200 zł, wymiana głowicy 250-400 zł, naprawa płyty głównej 300-500 zł. Dokładna wycena po bezpłatnej diagnozie.

### Czy seria GK420 jest jeszcze wspierana?
Zebra oficjalnie zakończyła produkcję serii GK, ale jako autoryzowany serwis nadal naprawiamy te drukarki i mamy dostęp do części zamiennych.
`
  },
  {
    slug: 'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
    title: 'Blady wydruk w drukarce Zebra - 5 przyczyn i jak je naprawić',
    excerpt: 'Drukarka Zebra drukuje za jasno? Poznaj 5 najczęstszych przyczyn bladego wydruku i dowiedz się, jak je naprawić samodzielnie lub kiedy oddać do serwisu.',
    coverImage: '/blog/blady-wydruk.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-12-01',
    readingTime: 8,
    deviceType: 'drukarki',
    category: 'troubleshooting',
    tags: ['blady wydruk', 'jakość druku', 'troubleshooting', 'GK420', 'ZD420', 'darkness'],
    seo: {
      metaTitle: 'Blady wydruk w drukarce Zebra - 5 przyczyn i rozwiązania | Serwis Zebra',
      metaDescription: 'Drukarka Zebra drukuje za jasno? Poznaj 5 przyczyn bladego wydruku: zasilacz, wałek, ustawienia Darkness, głowica, ribbon. Instrukcja naprawy krok po kroku.',
      keywords: ['blady wydruk zebra', 'drukarka zebra drukuje za jasno', 'słaba jakość wydruku zebra', 'zebra darkness ustawienia']
    },
    content: `
## Problem: Blady wydruk w drukarce Zebra

Jednym z najczęstszych problemów zgłaszanych przez użytkowników drukarek Zebra jest **blady, nieczytelny wydruk**. Kody kreskowe nie skanują się poprawnie, tekst jest ledwo widoczny, a etykiety wyglądają jakby brakowało im "tuszu".

W tym artykule omówimy **5 najczęstszych przyczyn** tego problemu i pokażemy, jak je naprawić samodzielnie.

---

## Tabela szybkiej diagnostyki

| Objaw | Prawdopodobna przyczyna | Rozwiązanie |
|-------|-------------------------|-------------|
| Cały wydruk blady | Niskie Darkness | Zwiększ w sterowniku |
| Blady przy szybkim druku | Słaby zasilacz | Wymień na oryginalny |
| Blady + rozmazany | Zużyty wałek | Wymiana wałka |
| Blady + przerywany | Brudna głowica | Wyczyść IPA 99% |
| Blady tylko przy ribbon | Zły typ taśmy | Dopasuj ribbon do etykiet |

---

## 1. Niewłaściwy zasilacz (najczęstsza przyczyna!)

### Problem

Użytkownicy często wymieniają oryginalny zasilacz Zebra na **tańszy zamiennik**. To jeden z najczęstszych błędów!

Zasilacze zamienniki często mają:
- Niższą moc wyjściową
- Niestabilne napięcie
- Brak odpowiedniej ochrony

### Skutki

Głowica drukująca nie nagrzewa się wystarczająco, szczególnie przy:
- Wyższych prędkościach druku
- Druku dużych powierzchni czarnych
- Długich seriach etykiet

### Rozwiązanie

**Krok 1:** Sprawdź parametry zasilacza

| Model drukarki | Wymagany zasilacz |
|----------------|-------------------|
| GK420d/GK420t | 20V / 2.5A (50W) |
| ZD420/ZD421 | 24V / 2.5A (60W) |
| ZD620/ZD621 | 24V / 2.5A (60W) |
| ZT411/ZT421 | 24V / 4.17A (100W) |

**Krok 2:** Porównaj z etykietą na zasilaczu

**Krok 3:** Jeśli parametry się nie zgadzają - wymień na oryginalny zasilacz Zebra

> **💡 Pro tip:** Oryginalny zasilacz Zebra kosztuje ok. 150-250 zł. To niewielka inwestycja w porównaniu do kosztów uszkodzonej głowicy (450-2400 zł).

---

## 2. Zużyty wałek dociskowy (Platen Roller)

### Problem

Wałek dociskowy to gumowy element, który dociska etykietę do głowicy drukującej. Z czasem:
- Guma twardnieje i traci elastyczność
- Powierzchnia się ściera (zmniejsza średnica)
- Pojawiają się nacięcia od noża odcinającego

### Jak rozpoznać zużyty wałek?

[CHECK] Wydruk jest blady **i rozmazany** jednocześnie
[CHECK] Problem nasila się przy wąskich etykietach
[CHECK] Widoczne ślady zużycia na wałku (rowki, spłaszczenia)
[CHECK] Wałek jest twardy w dotyku (powinien być elastyczny)

### Rozwiązanie

**Samodzielna diagnoza:**
1. Otwórz pokrywę drukarki
2. Zlokalizuj wałek (czarny, gumowy cylinder pod głowicą)
3. Sprawdź czy:
   - Ma równą powierzchnię
   - Jest elastyczny (ugina się pod palcem)
   - Nie ma nacięć ani rowków

**Wymiana wałka:**
- Koszt części: 80-150 zł
- Koszt wymiany w serwisie: 150-290 zł
- Zalecana wymiana co 2-3 lata przy intensywnym użytkowaniu

> **⚠️ Uwaga:** Zużyty wałek może uszkodzić głowicę drukującą! Nierównomierny docisk powoduje szybsze zużycie elementów grzejnych.

---

## 3. Nieprawidłowe ustawienia sterownika (Darkness)

### Problem

Ustawienie **Darkness** (Zaczernienie/Temperatura) w sterowniku ZDesigner lub Seagull określa, jak mocno głowica nagrzewa powierzchnię druku. Zbyt niskie = blady wydruk.

### Rozwiązanie krok po kroku

**Windows - Sterownik ZDesigner:**

1. Otwórz **Panel sterowania** → **Urządzenia i drukarki**
2. Kliknij prawym na drukarkę Zebra → **Preferencje drukowania**
3. Zakładka **Opcje** lub **Options**
4. Znajdź suwak **Darkness** lub **Zaczernienie**
5. Zwiększ wartość (zalecane: 20-25 dla większości etykiet)
6. Kliknij **OK** i wydrukuj testową etykietę

**Bezpośrednio na drukarce (modele z wyświetlaczem):**

1. Wejdź w **Menu** → **Print** → **Darkness**
2. Zwiększ wartość o 2-3 jednostki
3. Wydrukuj etykietę testową (przytrzymaj przycisk Feed)

### Optymalna konfiguracja

| Typ etykiet | Darkness | Print Speed |
|-------------|----------|-------------|
| Papierowe termiczne | 18-22 | 4-6 ips |
| Papierowe termotransferowe | 20-25 | 3-5 ips |
| Syntetyczne (PP, PE) | 25-30 | 2-4 ips |
| Tekstylne | 28-32 | 2-3 ips |

> **💡 Pro tip:** Zmniejszenie prędkości druku (Print Speed) może poprawić jakość wydruku **bez zwiększania temperatury**. To oszczędza żywotność głowicy!

---

## 4. Brudna lub zużyta głowica drukująca

### Problem

Głowica drukująca składa się z tysięcy mikroskopijnych elementów grzejnych. Gdy są zabrudzone lub uszkodzone, wydruk jest blady lub przerywany.

### Objawy brudnej głowicy

- Blady wydruk w **niektórych miejscach** (nie całej etykiecie)
- Pionowe **cienkie linie** na wydruku
- Problem pojawił się **stopniowo**

### Objawy uszkodzonej głowicy

- Wyraźne **białe pionowe pasy** (całkowity brak wydruku)
- Czyszczenie **nie pomaga**
- Problem pojawił się **nagle**

### Czyszczenie głowicy

**Potrzebne materiały:**
- Alkohol izopropylowy (IPA) 99%
- Patyczki czyszczące lub bezpyłowa ściereczka

**Procedura:**
1. Wyłącz drukarkę i odczekaj 5 min (głowica jest gorąca!)
2. Otwórz pokrywę
3. Nasącz patyczek alkoholem IPA
4. Delikatnie przetrzyj linię grzejną (ciemny pasek na głowicy)
5. Ruch tylko w **jednym kierunku** (od lewej do prawej)
6. Powtórz 2-3 razy
7. Odczekaj 2 minuty na wyschnięcie
8. Zamknij pokrywę i włącz drukarkę

[X] **NIE używaj:** wody, acetonu, ostrych narzędzi, papieru ściernego
[CHECK] **Używaj tylko:** IPA 99%, dedykowanych patyczków Zebra

### Kiedy wymienić głowicę?

Jeśli po dokładnym czyszczeniu nadal są:
- Białe pionowe pasy
- Nierówna jakość druku
- Brak poprawy mimo zwiększenia Darkness

**Koszt wymiany głowicy:** 450-2400 zł (w zależności od modelu)

---

## 5. Niewłaściwy typ taśmy (ribbon)

### Problem (tylko drukarki termotransferowe!)

Drukarki termotransferowe (np. GK420**t**, ZD421**t**) wymagają taśmy barwiącej (ribbon). Użycie **złego typu** taśmy powoduje blady lub nietrwały wydruk.

### Typy taśm i ich zastosowanie

| Typ ribbon | Zastosowanie | Charakterystyka |
|------------|--------------|-----------------|
| **Wax** | Papier zwykły | Najtańszy, średnia trwałość |
| **Wax-Resin** | Papier powlekany | Dobra trwałość, odporność na ścieranie |
| **Resin** | Syntetyki (PP, PE, PET) | Najwyższa trwałość, odporność na chemikalia |

### Jak dobrać ribbon?

**Zasada:** Typ etykiety = typ ribbon

| Etykieta | Zalecany ribbon |
|----------|-----------------|
| Papier matowy | Wax |
| Papier błyszczący | Wax-Resin |
| Folia PP/PE | Resin |
| Tekstylia | Resin tekstylny |

### Sprawdzenie kierunku nawoju

Taśma musi być założona **stroną barwiącą do etykiety**. Prosty test:
1. Odwiń kawałek taśmy
2. Przyklej kawałek taśmy klejącej do każdej strony
3. Oderwij - strona, która zostawi ślad na taśmie klejącej, to strona barwiąca

> **⚠️ Uwaga:** Ribbon założony odwrotnie = brak wydruku lub bardzo blady wydruk!

---

## Podsumowanie - lista kontrolna

Gdy wydruk jest blady, sprawdź po kolei:

[CHECK] **Zasilacz** - czy to oryginalny Zebra o odpowiedniej mocy?
[CHECK] **Wałek** - czy nie jest zużyty/twardy?
[CHECK] **Darkness** - czy ustawienie nie jest za niskie?
[CHECK] **Głowica** - czy jest czysta?
[CHECK] **Ribbon** - czy typ pasuje do etykiet? (termotransfer)

---

## Kiedy oddać do serwisu?

Niektóre problemy wymagają profesjonalnej interwencji:

[CHECK] Wymiana zużytego wałka dociskowego
[CHECK] Wymiana uszkodzonej głowicy drukującej
[CHECK] Diagnostyka elektroniki (gdy zasilacz OK, ale problem pozostaje)
[CHECK] Kalibracja mechanizmu po wymianie części

---

## Bezpłatna diagnostyka w Serwis Zebra

Nie wiesz, co powoduje blady wydruk w Twojej drukarce?

Jako **autoryzowany partner serwisowy Zebra** oferujemy:

[CHECK] **Bezpłatna diagnostyka** problemu*
[CHECK] **Odbiór kurierem** z całej Polski
[CHECK] **Gwarancja 12 miesięcy** na naprawę
[CHECK] **Oryginalne części** Zebra

*Diagnostyka bezpłatna w przypadku zlecenia naprawy w naszym serwisie.

[**Wyślij drukarkę do diagnozy →**](/#formularz)

---

## FAQ - Najczęściej zadawane pytania

### Jakie ustawienie Darkness jest optymalne?
Dla większości etykiet papierowych zalecamy wartość 20-25. Dla syntetycznych może być potrzebne 25-30. Zacznij od niższej wartości i zwiększaj, aż uzyskasz satysfakcjonującą jakość.

### Czy mogę używać zamiennika zasilacza?
Nie zalecamy. Zasilacze zamienniki często mają niższą rzeczywistą moc, co skutkuje bladym wydrukiem i szybszym zużyciem głowicy. Oryginalny zasilacz to inwestycja w żywotność drukarki.

### Jak często czyścić głowicę?
Zalecamy czyszczenie po każdej wymianie rolki etykiet lub taśmy ribbon. Przy intensywnym użytkowaniu - minimum raz w tygodniu.

### Blady wydruk pojawił się nagle - co robić?
Nagłe pogorszenie jakości często wskazuje na uszkodzenie głowicy lub problem z ribbon. Sprawdź najpierw czy taśma jest prawidłowo założona i nie jest zerwana.

### Ile kosztuje naprawa bladego wydruku?
Zależy od przyczyny: czyszczenie mechanizmu 150-360 zł, wymiana wałka 150-290 zł, wymiana głowicy 450-2400 zł. Dokładną wycenę podamy po bezpłatnej diagnozie.
`
  },
  {
    slug: 'kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
    title: 'Kalibracja drukarki Zebra - kompletny poradnik krok po kroku',
    excerpt: 'Drukarka Zebra drukuje na niewłaściwym miejscu lub wypluwa puste etykiety? Prawdopodobnie potrzebuje kalibracji. Poznaj wszystkie metody kalibracji dla różnych modeli Zebra.',
    coverImage: '/blog/kalibracja.jpeg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-12-01',
    readingTime: 12,
    deviceType: 'drukarki',
    category: 'poradniki',
    tags: ['kalibracja', 'sensor', 'gap', 'black mark', 'etykiety', 'GK420', 'ZD420', 'ZT411'],
    seo: {
      metaTitle: 'Kalibracja drukarki Zebra - poradnik krok po kroku | Serwis Zebra',
      metaDescription: 'Jak skalibrować drukarkę Zebra? Kompletny poradnik kalibracji dla serii GK420, ZD420, ZD621, ZT411. Auto-kalibracja, kalibracja ręczna, rozwiązywanie problemów.',
      keywords: ['kalibracja drukarki zebra', 'kalibracja zebra gk420', 'smart calibration zebra', 'zebra sensor gap', 'kalibracja etykiet zebra']
    },
    content: `
## Czym jest kalibracja drukarki i dlaczego jest ważna?

Kalibracja to proces, podczas którego drukarka Zebra **uczy się rozpoznawać** używane etykiety. Drukarka musi wiedzieć:

- **Gdzie zaczyna się** każda etykieta
- **Gdzie kończy się** każda etykieta
- **Jaki jest typ** etykiet (z przerwami, ciągłe, z czarną linią)

Bez prawidłowej kalibracji drukarka nie wie, gdzie drukować, co skutkuje **przesuniętym wydrukiem**, **pustymi etykietami** lub **zatrzymaniem się** w środku rolki.

---

## Kiedy wykonać kalibrację?

Kalibrację należy wykonać zawsze gdy:

[CHECK] Zmieniasz **typ lub rozmiar** etykiet
[CHECK] Zakładasz **nową rolkę** (szczególnie od innego producenta)
[CHECK] Wydruk jest **przesunięty** względem etykiety
[CHECK] Drukarka **wypluwa puste** etykiety przed drukowaniem
[CHECK] Drukarka **"szuka"** początku etykiety (przesuwa papier tam i z powrotem)
[CHECK] Po **resecie** do ustawień fabrycznych
[CHECK] Po **wymianie** głowicy lub wałka

---

## Typy sensorów w drukarkach Zebra

Drukarki Zebra posiadają **dwa typy sensorów** do wykrywania etykiet. Wybór sensora zależy od rodzaju używanych etykiet:

### 1. Sensor transmisyjny (Gap Sensor)

| Właściwość | Opis |
|------------|------|
| **Działanie** | Światło przechodzi PRZEZ etykietę |
| **Wykrywa** | Przerwę między etykietami |
| **Etykiety** | Z przerwami (die-cut labels) |
| **Zastosowanie** | 90% zastosowań (standardowe etykiety) |

### 2. Sensor refleksyjny (Black Mark / Reflective)

| Właściwość | Opis |
|------------|------|
| **Działanie** | Światło ODBIJA się od etykiety |
| **Wykrywa** | Czarną linię na spodzie etykiety |
| **Etykiety** | Ciągłe z czarnym znacznikiem |
| **Zastosowanie** | Etykiety tekstylne, paragonowe |

> **💡 Wskazówka:** Jeśli nie wiesz, jaki masz typ etykiet - obejrzyj spód rolki. Jeśli są tam **czarne paski** - to etykiety z black mark. Jeśli nie - używaj sensora gap.

---

## Auto-kalibracja (Smart Calibration) - najszybsza metoda

Auto-kalibracja to najłatwiejszy sposób kalibracji drukarki Zebra. Drukarka sama wykryje typ i rozmiar etykiet.

### Seria GK/GX (GK420d, GK420t, GX420d, GX420t)

**Procedura Smart Calibration:**

1. Upewnij się, że etykiety są prawidłowo załadowane
2. **Wyłącz** drukarkę
3. **Przytrzymaj** przycisk FEED
4. **Włącz** drukarkę trzymając przycisk FEED
5. Obserwuj diodę statusu:
   - **1 mignięcie** - tryb konfiguracji (nie puszczaj!)
   - **2 mignięcia** - Smart Calibration ✓ **PUŚĆ TERAZ**
6. Drukarka wysunie kilka etykiet i skalibruje sensory

> **⚠️ Ważne:** Jeśli przytrzymasz przycisk za długo (powyżej 5-6 mignięć), drukarka wejdzie w tryb resetu do ustawień fabrycznych!

### Seria ZD (ZD420, ZD421, ZD620, ZD621)

**Procedura Auto-Calibration:**

**Metoda 1 - Przycisk FEED:**
1. Załaduj etykiety
2. Zamknij pokrywę drukarki
3. **Przytrzymaj** przycisk FEED przez **5-6 sekund**
4. Puść przycisk gdy drukarka zacznie wysuwać etykiety
5. Kalibracja zakończona gdy drukarka się zatrzyma

**Metoda 2 - Z poziomu menu (modele z wyświetlaczem):**
1. Wejdź w **Menu** → **Media Setup** → **Calibrate**
2. Wybierz **Auto Calibrate**
3. Drukarka wykona kalibrację automatycznie

### Seria przemysłowa ZT (ZT230, ZT411, ZT421, ZT610)

**Procedura z wyświetlacza:**

1. Naciśnij **Menu** (lub ikonę hamburgera ☰)
2. Przejdź do **Media** lub **Print** → **Label Setup**
3. Wybierz **Media Type**:
   - \`Gap/Notch\` - dla etykiet z przerwami
   - \`Continuous\` - dla etykiet ciągłych
   - \`Mark\` - dla etykiet z czarną linią
4. Wróć i wybierz **Calibrate**
5. Potwierdź rozpoczęcie kalibracji

---

## Kalibracja ręczna w Zebra Setup Utilities

Gdy auto-kalibracja nie działa (nietypowe etykiety, transparentne podłoże), użyj kalibracji ręcznej przez oprogramowanie.

### Wymagania

- Komputer z zainstalowanym **Zebra Setup Utilities** (do pobrania z zebra.com)
- Drukarka podłączona przez USB lub sieć

### Procedura krok po kroku

**Krok 1: Uruchom Zebra Setup Utilities**

1. Otwórz Zebra Setup Utilities
2. Wybierz swoją drukarkę z listy
3. Kliknij "Open Printer Tools"

**Krok 2: Przejdź do Media Settings**

1. Zakładka "Action"
2. Wybierz "Calibrate Media"
3. Kliknij "Send"

**Krok 3: Zaawansowana konfiguracja (opcjonalnie)**

Jeśli auto-kalibracja przez narzędzie nie pomaga:

1. Zakładka **"Printing"**
2. Ustaw ręcznie:
   - **Media Type** (Gap, Continuous, Mark)
   - **Label Length** (długość etykiety w mm)
   - **Label Width** (szerokość etykiety)
3. Wyślij ustawienia do drukarki

---

## Kalibracja pozycji sensora (drukarki przemysłowe)

W drukarkach przemysłowych (ZT230, ZT411, ZT610 i starszych Xi) **sensor jest ruchomy**. Można fizycznie przesuwać jego pozycję.

### Kiedy regulować pozycję sensora?

- Używasz **wąskich etykiet** (mniejszych niż połowa szerokości drukarki)
- Etykiety mają **przerwę/black mark nie na środku**
- Drukarka "nie widzi" etykiet mimo kalibracji

### Jak ustawić pozycję sensora?

1. Otwórz pokrywę drukarki
2. Znajdź sensor (zwykle żółta/zielona plastikowa część pod etykietami)
3. Poluzuj śrubę blokującą
4. Przesuń sensor tak, aby był **dokładnie nad przerwą** między etykietami (lub nad black mark)
5. Zablokuj śrubę
6. Wykonaj ponowną kalibrację

> **💡 Pro tip:** W serii ZT411/ZT421 sensor ma specjalny uchwyt ułatwiający przesuwanie. Wystarczy lekko unieść i przesunąć w lewo/prawo.

---

## Rozwiązywanie problemów z kalibracją

### Problem: Drukarka wypluwa puste etykiety po kalibracji

**Przyczyny:**
1. Źle wybrany typ sensora (Gap vs Mark)
2. Sensor zabrudzony kurzem
3. Etykiety z transparentnym podłożem

**Rozwiązanie:**
1. Sprawdź czy używasz właściwego typu sensora
2. Oczyść sensor sprężonym powietrzem
3. Dla transparentnych etykiet - użyj etykiet z black mark lub kalibracji ręcznej z podaniem dokładnych wymiarów

---

### Problem: Drukarka "szuka" etykiety przed każdym wydrukiem

**Przyczyny:**
1. Etykiety są za długie dla ustawień drukarki
2. Sensor nie jest wyrównany z przerwą
3. Parametr "Label Length" jest nieprawidłowy

**Rozwiązanie:**
1. Wykonaj ponowną auto-kalibrację
2. W ZPL sprawdź komendę \`^LL\` (Label Length)
3. Ustaw ręcznie długość etykiety w sterowniku

---

### Problem: Kalibracja się nie udaje - dioda mruga na czerwono

**Przyczyny:**
1. Etykiety załadowane nieprawidłowo
2. Sensor całkowicie zabrudzony
3. Uszkodzony sensor

**Rozwiązanie:**
1. Wyjmij i załaduj ponownie etykiety
2. Oczyść sensor alkoholem IPA 99%
3. Jeśli problem persystuje - wymiana sensora w serwisie (150-550 zł)

---

### Problem: Wydruk przesunięty mimo poprawnej kalibracji

**Przyczyny:**
1. Niewłaściwe marginesy w sterowniku
2. Źle ustawiona pozycja sensora (drukarki przemysłowe)
3. Problem z wałkiem dociskowym

**Rozwiązanie:**
1. Sprawdź ustawienia marginesów (Label Top, Left Position)
2. Wyreguluj fizyczną pozycję sensora
3. Sprawdź stan wałka - czy etykieta się nie ślizga

---

## Kody ZPL związane z kalibracją

Dla zaawansowanych użytkowników - komendy ZPL do konfiguracji mediów:

\`\`\`zpl
^XA
^MNY              ; Kalibracja mediów przy włączeniu
^LL800            ; Długość etykiety (w dots, 203dpi = 8 dots/mm)
^PW812            ; Szerokość druku (4 cale = 812 dots przy 203dpi)
^LH0,0            ; Pozycja home (0,0)
^XZ
\`\`\`

### Ważne komendy:

| Komenda | Opis | Przykład |
|---------|------|----------|
| \`^MN\` | Typ mediów | \`^MNY\` (Gap), \`^MNM\` (Mark), \`^MNN\` (Continuous) |
| \`^LL\` | Długość etykiety | \`^LL800\` (800 dots) |
| \`^PW\` | Szerokość druku | \`^PW812\` (4 cale) |
| \`^LT\` | Top offset | \`^LT30\` (przesunięcie 30 dots w dół) |
| \`~JC\` | Kalibracja | Wykonaj kalibrację |

---

## Tabela - metody kalibracji wg modelu

| Model | Auto-kalibracja | Kalibracja ręczna | Ruchomy sensor |
|-------|-----------------|-------------------|----------------|
| GK420d/t | FEED 2x mignięcia | Zebra Setup Utilities | ❌ Nie |
| GX420d/t | FEED 2x mignięcia | Zebra Setup Utilities | ❌ Nie |
| ZD420/421 | FEED 5 sek. | Menu + Utilities | ❌ Nie |
| ZD620/621 | FEED 5 sek. | Menu + Utilities | ❌ Nie |
| ZT230 | Menu → Calibrate | Menu + Utilities | ✅ Tak |
| ZT411/421 | Menu → Calibrate | Menu + Utilities | ✅ Tak |
| ZT610/620 | Menu → Calibrate | Menu + Utilities | ✅ Tak |

---

## Kiedy oddać do serwisu?

Niektóre problemy z kalibracją wymagają profesjonalnej interwencji:

[CHECK] Sensor **nie reaguje** na żadne etykiety
[CHECK] Kalibracja **zawsze się nie udaje** mimo różnych etykiet
[CHECK] **Uszkodzenie mechaniczne** sensora
[CHECK] **Błędy firmware** związane z kalibracją
[CHECK] Drukarka **przeskakuje etykiety** losowo

---

## Profesjonalna pomoc w Serwis Zebra

Masz problemy z kalibracją drukarki Zebra?

Jako **autoryzowany partner serwisowy Zebra** oferujemy:

[CHECK] **Bezpłatna diagnostyka** problemu*
[CHECK] **Odbiór kurierem** z całej Polski
[CHECK] **Gwarancja 12 miesięcy** na naprawę
[CHECK] **Kalibracja i konfiguracja** pod Twoje etykiety

**Cennik napraw sensorów:** 150-550 zł (w zależności od modelu)

*Diagnostyka bezpłatna w przypadku zlecenia naprawy w naszym serwisie.

[**Wyślij drukarkę do serwisu →**](/#formularz)

---

## FAQ - Najczęściej zadawane pytania

### Jak często trzeba kalibrować drukarkę Zebra?
Kalibrację wykonuj przy każdej zmianie typu lub rozmiaru etykiet. Jeśli używasz ciągle tych samych etykiet od tego samego producenta - kalibracja przy każdej nowej rolce nie jest konieczna, ale zalecana.

### Czy kalibracja kasuje ustawienia drukarki?
Nie, sama kalibracja mediów nie kasuje innych ustawień (prędkość, temperatura, sieć). Kalibracja uczy drukarkę tylko parametrów etykiet.

### Dlaczego drukarka nie rozpoznaje moich etykiet?
Najczęstsze przyczyny: transparentne podłoże (sensor tego nie widzi), bardzo cienkie etykiety, etykiety z nietypowym materiałem. Spróbuj kalibracji ręcznej z podaniem dokładnych wymiarów.

### Czy mogę używać etykiet bez przerw (continuous)?
Tak, ale musisz ustawić drukarkę w tryb "Continuous" i podać dokładną długość etykiety w sterowniku lub kodzie ZPL. Drukarka nie będzie szukać przerwy.

### Co zrobić gdy Smart Calibration nie działa?
1. Oczyść sensor sprężonym powietrzem
2. Spróbuj innego rodzaju etykiet (dla testu)
3. Wykonaj kalibrację przez Zebra Setup Utilities
4. Jeśli nadal nie działa - sensor może wymagać wymiany
`
  }
]

// Funkcja do pobierania artykułu po slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug)
}

// Funkcja do pobierania wszystkich artykułów
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

// Funkcja do pobierania artykułów po kategorii treści
export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter(post => post.category === category)
}

// Funkcja do pobierania artykułów po typie urządzenia
export function getPostsByDeviceType(deviceType: BlogPost['deviceType']): BlogPost[] {
  return blogPosts.filter(post => post.deviceType === deviceType)
}

// Funkcja do pobierania powiązanych artykułów
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug)
  if (!currentPost) return []
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit)
}

// Funkcja do wyszukiwania artykułów dla AI Chat
export function searchBlogForAI(query: string): {
  found: boolean
  posts: Array<{
    title: string
    slug: string
    excerpt: string
    relevantContent: string
  }>
} {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
  
  // Słowa kluczowe do ignorowania (stop words)
  const stopWords = ['jak', 'czy', 'jest', 'się', 'nie', 'ale', 'lub', 'oraz', 'dla', 'przy', 'moja', 'mój', 'moje']
  const meaningfulWords = queryWords.filter(w => !stopWords.includes(w))
  
  if (meaningfulWords.length === 0) {
    return { found: false, posts: [] }
  }
  
  // Scoring każdego artykułu
  const scoredPosts = blogPosts.map(post => {
    let score = 0
    const titleLower = post.title.toLowerCase()
    const excerptLower = post.excerpt.toLowerCase()
    const contentLower = post.content.toLowerCase()
    const tagsLower = post.tags.map(t => t.toLowerCase())
    
    for (const word of meaningfulWords) {
      // Tytuł - najwyższy priorytet
      if (titleLower.includes(word)) score += 10
      
      // Tagi - wysoki priorytet
      if (tagsLower.some(tag => tag.includes(word))) score += 8
      
      // Excerpt - średni priorytet
      if (excerptLower.includes(word)) score += 5
      
      // Content - niski priorytet
      if (contentLower.includes(word)) score += 2
    }
    
    // Bonus za dokładne frazy
    if (titleLower.includes(queryLower)) score += 20
    if (excerptLower.includes(queryLower)) score += 10
    
    // Znajdź najrelewantniejszy fragment (do 500 znaków)
    let relevantContent = ''
    if (score > 0) {
      // Szukaj fragmentu zawierającego słowa kluczowe
      const sentences = post.content.split(/[.!?]\s+/)
      for (const sentence of sentences) {
        const sentenceLower = sentence.toLowerCase()
        if (meaningfulWords.some(word => sentenceLower.includes(word))) {
          relevantContent += sentence.trim() + '. '
          if (relevantContent.length > 500) break
        }
      }
      // Fallback do excerpt
      if (!relevantContent) {
        relevantContent = post.excerpt
      }
    }
    
    return {
      post,
      score,
      relevantContent: relevantContent.slice(0, 600)
    }
  })
  
  // Filtruj i sortuj
  const relevantPosts = scoredPosts
    .filter(p => p.score >= 5) // Minimum próg relevancji
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) // Max 2 artykuły
  
  if (relevantPosts.length === 0) {
    return { found: false, posts: [] }
  }
  
  return {
    found: true,
    posts: relevantPosts.map(p => ({
      title: p.post.title,
      slug: p.post.slug,
      excerpt: p.post.excerpt,
      relevantContent: p.relevantContent
    }))
  }
}

