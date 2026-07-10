# Plan ataku: "serwis drukarek zebra" → TOP 1

## Stan obecny (2026-05-09)

**SERP "serwis drukarek zebra"**:

| Pos | URL | DR | Stan |
|---|---|---|---|
| **1** | **serwis-zebra.pl/** | 23 | Konkurent z **EMD** (Exact Match Domain — bez „y"!) |
| 2 | youtube.com (video) | 99 | Video, nie tradycyjny competitor |
| 3, 3, 3 | (Ahrefs nie zwraca) | — | Low quality lub brak danych |
| 4 | premiumcolor.pl | — | Drobny gracz |
| 8.69 (GSC) | **serwis-zebry.pl/serwis-zebra/poznan** | — | ⚠️ Google wybiera lokalną stronę zamiast hub! |

**Strona /serwis-drukarek-zebra**: 383 backlinki z **2 refdomains** (głównie takma.com.pl boilerplate), tylko 1 keyword tracked w Ahrefs.

## Diagnoza w 1 zdaniu

Strona ma **idealny on-page** (H1 exact match, title, schema, FAQ, 30 internal links) ale **Google nie kojarzy jej z głównym keywordem** bo (a) konkurent ma EMD, (b) brakuje external backlinks z exact anchor, (c) Google wybiera lokalną stronę zamiast top hub.

## 5 ruchów żeby wskoczyć na poz 1 (priorytet od najwyższego)

### Ruch 1 — External backlinki z anchor "serwis drukarek zebra" (KRYTYCZNE, 4-6 tyg do efektu)

To jest **bottleneck**. Konkurent serwis-zebra.pl wygrywa bo Google ma EMD signal — my musimy to przebić **świeżymi external linkami z exact anchor**.

**Cel**: 5-8 quality backlinków z różnych domen, każdy z anchorem zawierającym „serwis drukarek zebra".

Ścieżki:
- **Następne sponsored content (LinkHouse/WhitePress)**: zamów 3-5 nowych guest postów na stronach branżowych (logistyka, magazyny, retail). Anchor każdy inny:
  - „serwis drukarek zebra" (exact)
  - „autoryzowany serwis drukarek Zebra" 
  - „naprawa drukarek Zebra" (variation)
  - „serwis Zebra Technologies" (brand)
- **Branżowe portale**: e-produkcja (już masz), logistyka.pl (już masz!), magazyn-online.pl, retailmarketing.pl
- **Linki z takma.com.pl** — zmień jeden contextual link (z homepage lub /drukarki-etykiet-zebra) na **„serwis drukarek Zebra"** zamiast obecnych anchorów

**Już masz**:
- ✅ trans.info (DR 71) — anchor sprawdź
- ✅ logistyka.net.pl (DR 54) — anchor sprawdź
- ✅ cyfrowyodkrywca.pl (DR 49) — anchor: „terminali Zebra"
- ✅ e-produkcja.pl (DR ?) — anchor: „autoryzowany serwis Zebra"

Brakuje: **kilku z exact anchorem „serwis drukarek zebra"**. To jest najważniejsze.

### Ruch 2 — Wzmocnij internal linking z exact anchor (1 dzień pracy)

W kodzie obecnie:
- **91 blog postów**: 30 ma link do `/serwis-drukarek-zebra` (33% pokrycie)
- **17 stron lokalnych** /serwis-zebra/[miasto]: 6 linków (brak na każdej)
- **Inne service hubs** (terminali, skanerów, tabletów): nieznane

**Akcje**:

A) **Każda strona lokalna** /serwis-zebra/[miasto] ma 1 link `/serwis-drukarek-zebra` (już jest 1 contextual + 1 breadcrumb). Dodać 1-2 dodatkowe z różnymi anchorami:

```tsx
// W app/serwis-zebra/[miasto]/page.tsx, w sekcji "Naprawiamy":
<Link href="/serwis-drukarek-zebra" className="...">
  Serwis drukarek Zebra w {miasto}
</Link>
```

B) **Pozostałe ~61 blog postów** (które nie mają jeszcze linka) — dodać link kontekstowy do `/serwis-drukarek-zebra` jeśli temat dotyczy drukarek (pewnie 30-40 z nich). Anchor warianty:
- „autoryzowany serwis drukarek Zebra"
- „serwis drukarek Zebra"
- „profesjonalna naprawa drukarek Zebra"

C) **Homepage** — sprawdź czy z homepage (UR najwyższy w domenie) jest **prominent link** do `/serwis-drukarek-zebra` w hero/CTA z anchor exact match.

### Ruch 3 — Pomoc Google wybrać właściwą stronę zamiast lokalnej Poznań (kanibalizacja!)

GSC pokazuje że dla query „serwis drukarek zebra" Google wybiera `/serwis-zebra/poznan` (lokalna) zamiast `/serwis-drukarek-zebra` (top hub). To **klasyczna kanibalizacja**.

**Powód**: strona poznańska ma frase „serwis drukarek zebra" w content (introText) i Google interpretuje ją jako bardziej topical match.

**Akcja A**: Z stron lokalnych usunąć dosłowną frazę „serwis drukarek zebra" jako H1/H2/exact phrase. Zamiast tego użyć:
- „Serwis Zebra w Poznaniu" (focus na miasto)
- „Naprawa urządzeń Zebra — Poznań i okolice"

**Akcja B**: Wzmocnić canonical hint przez **rel="canonical"** wewnątrz blog postów które są mocno o drukarkach — jako primary canonical link wskazać na `/serwis-drukarek-zebra` (przez markdown link z keyword).

**Akcja C**: GSC URL Inspection dla `/serwis-drukarek-zebra` → **Request Indexing**. Wymusi Google'a na refresh — może przeskoczyć z poz 8 na 4-5.

### Ruch 4 — Content depth i keyword density (3 godz)

Sprawdź obecną treść strony (już bogatej). Ale Google preferuje **2 000-3 000 słów dla service pages**.

**Jeśli strona ma <1500 słów**, dodać sekcje (które nie są jeszcze):

- **„Dlaczego nasz serwis drukarek Zebra jest najlepszy w Polsce"** (200 słów) — keyword density boost
- **„Cennik napraw drukarek Zebra wg modelu"** (300 słów + tabela) — match dla query „cennik serwis drukarek zebra"
- **„Czas realizacji naprawy"** — match dla „ile trwa serwis drukarek zebra"
- **„Gdzie odebrać po naprawie"** + lista miast — wzmacnia local relevance

**Keyword density**: „serwis drukarek zebra" + variations powinny pojawić się **5-10 razy** naturalne w content (nie keyword stuffing). Sprawdź obecne wystąpienia — jeśli mniej, dodać.

### Ruch 5 — Schema markup boost (30 min)

Strona już ma `Service` + `FAQPage` + `BreadcrumbList`. Dodać:

A) **`AggregateRating`** w Service schema:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "ratingCount": "127",
  "bestRating": "5"
}
```

B) **Rozszerzyć `serviceType`** o exact phrase:
```json
"serviceType": [
  "Serwis drukarek Zebra",
  "Naprawa drukarek etykiet Zebra",
  "Wymiana głowic Zebra",
  ...
]
```

C) **Dodać `Offer` w Service** dla cennika:
```json
"offers": {
  "@type": "Offer",
  "name": "Cennik napraw drukarek Zebra",
  "url": "https://www.serwis-zebry.pl/blog/cennik-naprawy-drukarki-zebra-koszty-serwisu"
}
```

To zwiększa szansę na rich result w SERP (gwiazdki, rating) → wyższy CTR → boost ranking.

---

## Mierzenie efektów

**Po 7 dniach** (od deploy):
- GSC URL Inspection dla `/serwis-drukarek-zebra` — czy strona ma wszystkie wzmocnione internal links zindeksowane
- Sprawdź pozycję dla „serwis drukarek zebra" w GSC (powinna iść z 8.69 do 5-7)

**Po 4 tygodniach**:
- Ahrefs zauważy nowe external backlinki
- Pozycja powinna być w **TOP 5**
- Liczba organic keywords dla strony powinna wzrosnąć z 1 do 10+

**Po 8-12 tygodniach** (po link buildingu):
- Cel: **TOP 1-3** dla „serwis drukarek zebra"
- Wyprzedzić serwis-zebra.pl mimo ich EMD

## Priorytet wykonania

| # | Ruch | Czas | Kiedy efekt |
|---|---|---|---|
| 1 | External backlinki (3-5 guest posts) | tydzień + 4-6 tyg waiting | TOP 5 |
| 2 | Internal linking boost (kod) | 1 dzień | tydzień |
| 3 | Fix kanibalizacji (lokalne strony) | 4 godz | 2 tyg |
| 4 | Content depth | 3 godz | 4 tyg |
| 5 | Schema boost | 30 min | 2 tyg |

**Najpilniejsze: #1 + #2 + #3 równolegle**.

## Co JEST a co BRAKUJE w obecnym repo

**Mamy ✅**:
- H1 exact match: „Serwis Drukarek Zebra – Etykiet, Kart Plastikowych, Mobilnych"
- Title meta: „Serwis Drukarek Zebra – Naprawa Wszystkich Modeli | TAKMA"  
- Description: krótki ale OK
- 13 FAQ z FAQPage schema
- Service schema z LocalBusiness provider
- BreadcrumbList schema
- 14 cluster article links
- 30 internal links z blog
- 6 linków ze stron lokalnych

**Brakuje ❌**:
- Exact anchor „serwis drukarek zebra" w external backlinkach (najpilniejsze!)
- AggregateRating w schema
- Cennik tabela bezpośrednio na stronie (jest tylko link do blog post)
- Linki z stron lokalnych z exact anchor (jest „Serwis Drukarek Zebra" jako link nav, ale brak in-content)
- Linki z innych 4 service hubs (cross-link dla equity flow)

---

## Konkretne TODO

### Ten tydzień (kod):

1. **Zamów 3 sponsored content** (LinkHouse/WhitePress) na branżowych portalach z anchor:
   - „serwis drukarek Zebra" (exact)
   - „autoryzowany serwis drukarek Zebra"
   - „profesjonalny serwis drukarek Zebra"

2. **W kodzie** — zmień title/H1 stron lokalnych żeby NIE rywalizowały o „serwis drukarek zebra":
   ```diff
   - title: 'Serwis drukarek zebra Poznań | TAKMA'
   + title: 'Serwis Zebra w Poznaniu — drukarki, terminale, skanery | TAKMA'
   ```
   To **deconfusuje** Google które URL match dla głównej query.

3. **Dodaj contextual links** z 60 blog postów (które nie mają) do `/serwis-drukarek-zebra`. Mogę wygenerować skrypt który automatycznie wstawi (np. po 1 zdaniu w stopce każdego posta o drukarce).

### Następne 2 tygodnie:

4. **Dodaj AggregateRating** + 5 nowych odpowiedzi FAQ na schemę.

5. **Rozszerz content** strony /serwis-drukarek-zebra o sekcje cennika i procesu odbioru.

6. **Request Indexing** w GSC dla wszystkich zmienionych URL.

### 4-6 tygodni czekanie:

7. Backlinki się indeksują, Google reprocesuje, pozycja idzie z 8 do TOP 5 → TOP 3 → TOP 1.

Po publikacji każdego guest posta — Request Indexing też tam (zewnętrznie nie kontrolujemy, ale właściciel strony może to zrobić w GSC).
