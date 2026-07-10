# Sklepy etykiety-termiczne.pl + etykiety-termotransferowe.pl — strategia v2

**Data**: 13 maja 2026
**Zmiana**: kontekst zaktualizowany — to **2 pełne sklepy e-commerce** (nie microsites), z Google Ads + Google Shopping od dnia 1, na bazie istniejącego doświadczenia TAKMA w sprzedaży etykiet.

---

## Krótka odpowiedź — TAK, 2 sklepy mają sens

Przy paid acquisition + Google Shopping zmienia się cała ekonomia decyzji:

| Argument | Dlaczego 2 sklepy są teraz OK |
|---|---|
| **Paid acquisition od dnia 1** | SEO authority (DR, backlinki) staje się drugorzędne. Google Ads i Shopping płacą za pozycję — DR jest mniej istotne. Można konkurować z Allegro head-to-head w Shopping carousel. |
| **EMD = trust signal w paid** | `etykiety-termiczne.pl` w wynikach Google Ads ma wyższy Quality Score (1:1 keyword:domain match) → niższe CPC w długim okresie |
| **Niezależne Google Merchant feeds** | Każdy sklep = osobny feed, osobna kategoria, osobna optymalizacja CPC per produkt |
| **B2B procurement type-in** | Zaopatrzeniowiec szukający "etykiet termotransferowych" często wpisuje domenę bezpośrednio. EMD wygrywa |
| **Brand specialization signal** | Specjalista > generalista dla B2B procurement. "Sklep tylko z etykietami termotransferowymi" brzmi pewniej niż "sklep z wszystkim" |
| **Dwa audytoria, dwa messaging** | Termiczne = magazyn/logistyka/krótki termin. Termotransferowe = przemysł/farmacja/długi termin. Różne value props, różne audiences, różne kreacje reklamowe |
| **TAKMA ma doświadczenie** | Sprzedaż etykiet codziennie = znacie się na rozmiarach, gramaturach, klejach, taśmach. Operations są przewidywalne. |

---

## ALE — 3 krytyczne decyzje przed startem

### 1. Shared backend czy 2 niezależne stacky?

To jest najważniejsza decyzja techniczna.

**Opcja A — Shared backend (REKOMENDOWANA)**:
- Magazyn / WMS / ERP / fulfillment / payments / księgowość = **jedna instancja TAKMA**
- 2 frontendy (Next.js / sklep) ciągną z tego samego API
- Stoki, ceny, faktury, wysyłki = jedno źródło prawdy
- Klient widzi 2 różne brand experience, ale operationally to jeden organizm

**Argumenty za**:
- 1× księgowość, 1× magazyn, 1× zespół obsługi klienta
- Klient B2B kupujący na obu (a będzie kupował!) ma ten sam VAT, te same warunki, te same numery zamówień w systemie
- Łatwy cross-sell ("kup taśmę do drukarki" na termiczne → "dorzucamy etykiety termotransferowe" w drugim sklepie)
- Refresh stocku / pricing / promocje = 1 miejsce do edycji

**Opcja B — 2 niezależne stacky**:
- Każdy sklep ma własny backend, własny magazyn, własną księgowość
- Spójność wizualna brand'u (klient nie widzi "tej samej kasy")
- Pełna autonomia (możesz w przyszłości sprzedać 1 ze sklepów osobno)

**Argumenty przeciw**:
- 2× wszystko = 2× pracy operacyjnej
- Trudne cross-sell (klient kupuje na 2 różnych kontach)
- Faktury B2B muszą być wystawiane przez 1 podmiot prawny i tak (no chyba że stworzysz drugi PKD)

**Moja rekomendacja**: **Opcja A — shared backend, 2 frontendy**.

Jeśli TAKMA już sprzedaje etykiety w istniejącym sklepie — wykorzystaj ten sam Magento/PrestaShop/custom/Shopify i postaw 2 osobne instancje frontendu, które ciągną API. To Multistore architecture — standard w branży.

### 2. Cena domeny vs cena ruchu — czy domeny są wolne?

Sprawdź teraz:
- `etykiety-termiczne.pl` — czy wolna i ile na rynku wtórnym?
- `etykiety-termotransferowe.pl` — czy wolna?
- Alternatywy zapasowe: `etykietytermiczne.pl`, `etykietytermotransferowe.pl` (bez myślnika), `etykietki-termiczne.pl`

**Maksymalna sensowna cena**: 5 000-10 000 zł za każdą jeśli na wtórnym rynku — odbije się w 6-12 miesięcy z Google Shopping jeśli ROAS > 4.

Jeśli ktoś żąda > 10-20k zł — pomiń tę domenę, weź alternatywę.

### 3. Tracking i atrybucja przy 2 sklepach

To pułapka, którą wielu pomija. Klient klika reklamę Google Ads na "etykiety termiczne" → trafia na `etykiety-termiczne.pl` → ale ostatecznie kupuje też taśmę z `etykiety-termotransferowe.pl`. Czy to się przypisze do tej samej konwersji? Domyślnie: **nie**.

**Rozwiązanie**:
- **Wspólny GA4 property** dla obu sklepów (cross-domain tracking)
- **Wspólny Google Merchant Center** z 2 osobnymi feedami
- **Wspólny Google Ads account** z 2 osobnymi kampaniami
- **Wspólny pixel CRM** (np. RudderStack, Segment, GTM customDimension `customer_id`)

To wymaga 1 dodatkowego tygodnia setupu na początku — ale uniknie ślepoty atrybucyjnej za 6 miesięcy.

---

## Strategia paid — Google Ads + Shopping framework

### Faza 1 (miesiąc 1-2): Search Ads na head terms

**Budżet startowy**: 3 000-5 000 zł / m-c per sklep = 6 000-10 000 zł łącznie

**Struktura kampanii dla etykiety-termiczne.pl**:

| Kampania | Keywords | Match type | Initial bid | Cel |
|---|---|---|---|---|
| Brand + EMD | "etykiety termiczne" | Phrase + Exact | 3-5 zł | TOP 1-2 w paid |
| Long-tail | "etykiety termiczne 100x150", "...50x25", "...rolka" | Phrase | 2-3 zł | TOP 3 |
| Branded products | "etykiety zebra termiczne" | Phrase | 4-6 zł | TOP 2 |
| Use case | "etykiety do paczkomatów", "etykiety wysyłkowe" | Phrase | 2-4 zł | TOP 5 |

**ROAS target początkowy**: 4 (każde 1 zł wydane → 4 zł obrotu). B2B etykiety mają zwykle marżę 20-35%, więc ROAS 4 = ~25% margin = break-even przy zakupach repeat.

**Struktura kampanii dla etykiety-termotransferowe.pl**: analogiczna, z CPC 60 zł sygnał wyższych stawek (CPC max bid 4-7 zł), ale i wyższych marż w niszowych produktach (laminowane, asset tags).

### Faza 2 (miesiąc 2-4): Google Shopping

To jest **gdzie wygrywasz z Allegro**. Allegro w Shopping carousel jest zwykłym merchantem — Twój sklep z lepszą fotografią, opisem i precyzyjnym tytułem może go przebić.

**Best practices feed**:
- Tytuły 70-100 znaków, **z konkretnym rozmiarem** ("Etykiety termiczne 100×150 mm — rolka 500 szt., klej permanentny, do paczkomatów")
- Kategorie GMC: `Office Supplies > Office Equipment > Labels & Stickers`
- **GTIN/EAN** każdego produktu (jeśli nie masz — ustaw `identifier_exists: false`, ale GMC karze za to)
- **Cena z VAT** + dostawa + dostępność magazynowa
- Zdjęcia: każdy rozmiar = własne zdjęcie z linijką dla skali
- Atrybut `custom_label_0` = "stock_level" (np. high/low) — używaj do bidding

**Budżet Shopping**: 5 000-15 000 zł / m-c na obu sklepach łącznie (start z 5k, skaluj na ROAS).

### Faza 3 (miesiąc 3+): Remarketing + Audiences

Po 90 dniach masz lookalike-able audience:
- Klient kupujący termiczne → reklama termotransferowe (cross-sell)
- Cart abandonment → remarketing email + display
- High-LTV customer → reklama wysokomarżowych produktów (drukarki etykiet!)

---

## Strategia SEO — równolegle (compound growth)

Paid daje natychmiastową konwersję. SEO daje compound — w 12 miesięcy jest tańszy niż paid per click.

**Co robić od dnia 1 (zero extra effort, by-product)**:

1. **Strona główna każdego sklepu** = pillar page
   - Termiczne: "Etykiety termiczne — kompletny przewodnik + sklep" (~1500-2500 słów)
   - Termotransferowe: tak samo + sekcja taśmy
2. **Strony kategorii produktowych z deep content** (200-400 słów na każdej kategorii)
3. **Strony produktowe z structured data** (schema.org Product, AggregateRating, Offer)
4. **Blog z 10-15 postami w pierwszych 6 miesiącach**:
   - "Etykiety termiczne vs termotransferowe — kiedy która?"
   - "Jakie etykiety do paczkomatów InPost / DPD / DHL?"
   - "Etykiety termotransferowe do farmacji — wymagania GS1"
   - "Jak dobrać taśmę żywicową, woskową, mix?"
   - "Etykiety na rolce — jaki rdzeń wybrać?"
   - "Etykiety laboratoryjne odporne na alkohol"
   - "Etykiety mrożone — co kupić?"

**Cel SEO**: do miesiąca 12 mieć **30-50% ruchu organic** (vs 70% paid teraz). To zmienia ekonomię biznesu z "musimy płacić $ za każdą sprzedaż" na "30% sprzedaży to zysk z organic".

---

## Konkurencja: kogo realnie pokonujesz

Już ustalone (z Ahrefs SERP):

| Konkurent | Pozycja w SERP | DR | Org traffic | Co o nich wiemy |
|---|---|---|---|---|
| **strefadrukarek.pl** | #1-#2 oba head terms | 37 | 18 314 / m-c | Dominator. Drukarki + etykiety. Pełen sklep. |
| allegro.pl | #1 termiczne, #2 termotransferowe | 91 | (część) | Always-on. Komodytyzowany sklep. |
| t-pack.pl | #10 termotransferowe | 37 | (188 na ten KW) | Specjalista (long-tail dominacja) |
| bcmarket.pl | #10 termiczne | 26 | 76 | Direct B2B konkurent TAKMA |
| swiatetykiet.com | #3 oba | 2 | (~99 + ~36) | **DR 2 i ranking #3** — proof of concept |

**Twoja przewaga vs strefadrukarek.pl** (kluczowy do pokonania):
- TAKMA = autoryzowany partner Zebry → trust signal w B2B
- TAKMA = pełna obsługa serwisowa drukarek (mają serwis-zebry.pl) → cross-sell
- TAKMA = możliwość customowych druków etykiet z magazynu Tadeusza
- Specializowane sklepy (1 technologia = 1 expert) = niższa konkurencja per produkt

---

## Operational checklist — co musisz mieć przed pierwszym kliknięciem

### Sprzęt & infrastruktura

- [ ] Magazyn etykiet typowanych: rozmiary minimum (32×25, 38×25, 50×25, 58×40, 76×50, 100×60, 100×150)
- [ ] Gramatury: standardowe termiczne 60-90 g/m² + topcoated + polypro
- [ ] Klej: permanentny, usuwalny, freezer-grade
- [ ] Taśmy: wosk (Y), żywica (R), mix wax-resin (X) w typowych rozmiarach (74m, 110m, 300m × różne szerokości)
- [ ] Magazyn ribbons (kolory: czarny standard, custom kolory na zamówienie)
- [ ] Fulfillment <24h: kurier (DPD/InPost) + paczkomat
- [ ] Stock-level monitoring → feed Google Shopping (in-stock/out-of-stock)

### Tech & marketing

- [ ] 2× domeny zarejestrowane + SSL
- [ ] 2× sklepy (frontend) z shared backend API
- [ ] Wspólny GA4 + cross-domain tracking
- [ ] Wspólny Google Merchant Center
- [ ] Wspólny Google Ads account
- [ ] Wspólny CRM / customer DB
- [ ] Faktury B2B (PDF + EDI) z TAKMA jako podmiot prawny
- [ ] Polityka zwrotów + Regulamin sklepu
- [ ] Dane do GS1 (GTIN) per produkt

### Brand & content

- [ ] Logo + identyfikacja każdego sklepu (różna kolorystyka, ale spójna z TAKMA family)
- [ ] Pillar page każdego sklepu napisana (1500-2500 słów)
- [ ] 8-12 kategorii produktowych z opisem
- [ ] 50+ stron produktowych z zdjęciami + opisem
- [ ] 5+ blog postów w pierwszym miesiącu (na każdym sklepie)
- [ ] Schema.org structured data

---

## Timeline + budżet realistyczny

| Miesiąc | Co dzieje się | Wydatek | Spodziewany obrót |
|---|---|---|---|
| **M1** | Setup domen, frontendy, GMC, feeds. Pierwsze SKU. | 8-12k zł (setup) + 3k zł ads test | ~5-10k zł |
| **M2** | Pierwsze realne kampanie. Search + Shopping live. | 6-10k zł ads + 1-2k content | 20-40k zł |
| **M3** | Optymalizacja, A/B testy, więcej SKU. | 10-15k zł ads | 40-80k zł |
| **M4-M6** | Skalowanie, remarketing, organic ruch zaczyna pomagać | 15-25k zł ads | 80-150k zł / m-c |
| **M7-M12** | Organic ~30%, paid skalowane do zysku. Pierwsze repeat customers stabilizują biznes | 20-30k zł ads | 150-300k zł / m-c |

**Break-even**: realnie miesiąc 3-4 (ROAS na poziomie 4+ z paid, plus pierwszy organic).

**ROI 12-miesięczny**: przy budżecie 200-300k zł na 12 m-cy → obrót 1.5-3M zł → zysk netto 200-500k zł (przy marży 25-35%).

---

## 3 decyzje, których potrzebuję teraz

1. **Backend**: shared (multistore na istniejącym TAKMA-stack) czy 2 osobne? — **rekomenduję shared**
2. **Domeny**: sprawdzam dostępność `etykiety-termiczne.pl` + `etykiety-termotransferowe.pl` (zaraz spojrzę)
3. **Budżet startowy ads**: czy mamy 6-10k zł / m-c na pierwsze 2 miesiące testów?

---

## Następny krok

Jeśli OK na powyższe — zaplanuję:
1. **Architekturę frontend** (na bazie obecnego TAKMA stack — Next.js / Vercel)
2. **Feed product attributes** (kompletna mapa kolumn do GMC)
3. **Pełne kampanie Google Ads** (keywordy, copy, landing page recommendations)
4. **First 30 SKU per shop** (jakie konkretne rozmiary/gramatury mają być flagship)
5. **Content plan na M1** (pillar + 5 blog postów + 30 stron produktowych priorytet)

Dawaj — które z 3 decyzji potwierdzasz?
