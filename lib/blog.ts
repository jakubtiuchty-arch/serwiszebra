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
  category: 'poradniki' | 'troubleshooting' | 'porownania' | 'aktualnosci'
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

// Kategorie bloga
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
    coverImage: '/blog/zebra-nie-drukuje.jpg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-11-30',
    readingTime: 8,
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

**Koszt wymiany głowicy w naszym serwisie: 300-550 zł** (w zależności od modelu)

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

✅ **Bezpłatną diagnozę** problemu  
✅ **Darmowy odbiór kurierem** z całej Polski  
✅ **Gwarancję na naprawę** 12 miesięcy  
✅ **Oryginalne części** Zebra  

[**Wyślij zgłoszenie →**](/formularz)

---

## FAQ - Najczęściej zadawane pytania

### Ile kosztuje naprawa drukarki Zebra?
Ceny napraw zaczynają się od 80 zł za czyszczenie mechanizmu. Wymiana głowicy to koszt 300-550 zł w zależności od modelu. Dokładną wycenę otrzymasz po bezpłatnej diagnozie.

### Jak długo trwa naprawa?
Standardowa naprawa trwa 3-5 dni roboczych. Oferujemy również tryb express (1-2 dni) za dodatkową opłatą.

### Czy mogę samodzielnie wymienić głowicę?
Tak, ale wymaga to odpowiednich narzędzi i wiedzy. Nieprawidłowy montaż może uszkodzić drukarkę. Zalecamy skorzystanie z profesjonalnego serwisu.

### Moja drukarka jest w gwarancji - co robić?
Skontaktuj się z nami - jako autoryzowany serwis Zebra obsługujemy również naprawy gwarancyjne.
`
  },
  {
    slug: 'jak-wyczyscic-glowice-drukarki-zebra',
    title: 'Jak wyczyścić głowicę drukującą w drukarkach Zebra - poradnik krok po kroku',
    excerpt: 'Regularne czyszczenie głowicy drukującej wydłuża jej żywotność i poprawia jakość wydruku. Zobacz jak prawidłowo czyścić głowicę w drukarkach Zebra.',
    coverImage: '/blog/czyszczenie-glowicy.jpg',
    author: {
      name: 'Zespół Serwis Zebra',
      role: 'Certyfikowani technicy Zebra'
    },
    publishedAt: '2025-11-30',
    readingTime: 6,
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

**Potrzebujesz wymiany głowicy? [Skontaktuj się z nami →](/formularz)**
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

// Funkcja do pobierania artykułów po kategorii
export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter(post => post.category === category)
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

