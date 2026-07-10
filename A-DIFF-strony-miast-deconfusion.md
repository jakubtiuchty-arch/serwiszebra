# A) Diff dla `app/serwis-zebra/[miasto]/page.tsx`

**Cel**: usunąć dosłowną frazę „serwis drukarek zebra" / „naprawa drukarek zebra" z content stron lokalnych, żeby Google **przestał wybierać** strony lokalne dla query „serwis drukarek zebra" i przekierowywał te impressions na `/serwis-drukarek-zebra` (hub).

**Co zachowujemy**: lokalne keywords typu „serwis Zebra warszawa", „naprawa Zebra kraków" — bo to wzmacnia local SEO bez kanibalizacji huba.

---

## Zmiana 1 — heroText Zielonej Góry (linia 250)

**Obecnie:**
```ts
'zielona-gora': {
  ...
  heroText: 'Profesjonalny serwis drukarek Zebra dla firm z Zielonej Góry i okolic',
  ...
},
```

**Zmień na:**
```ts
'zielona-gora': {
  ...
  heroText: 'Profesjonalny serwis Zebra dla firm z Zielonej Góry i okolic',
  ...
},
```

(Inne miasta mają już "serwis urządzeń Zebra" — Zielona Góra była anomalia.)

---

## Zmiana 2 — extraKeywords array (linie 274-284)

**Obecnie:**
```ts
const extraKeywords: Record<string, string[]> = {
  'gdansk': ['serwis zebra gdynia', 'serwis zebra sopot', 'serwis zebra trójmiasto', 'naprawa drukarek zebra trójmiasto'],
  'katowice': ['serwis zebra śląsk', 'serwis zebra gliwice', 'serwis zebra zabrze', 'naprawa drukarek zebra górny śląsk'],
  'lodz': ['serwis zebra pabianice', 'serwis zebra zgierz', 'naprawa drukarek zebra łódzkie'],
  'bydgoszcz': ['serwis zebra toruń', 'serwis zebra inowrocław', 'naprawa drukarek zebra kujawsko-pomorskie'],
  'torun': ['serwis zebra bydgoszcz', 'serwis zebra włocławek', 'naprawa drukarek zebra kujawsko-pomorskie'],
  'rzeszow': ['serwis zebra dolina lotnicza', 'serwis zebra przemyśl', 'naprawa drukarek zebra podkarpacie'],
  'szczecin': ['serwis zebra świnoujście', 'serwis zebra stargard', 'naprawa drukarek zebra pomorze zachodnie'],
  'zielona-gora': ['serwis drukarek zebra zielona góra', 'serwis zebra gorzów wielkopolski', 'naprawa drukarek zebra lubuskie', 'serwis zebra lubuskie'],
}
```

**Zmień na** (zamiana „drukarek zebra" → „Zebra"):
```ts
const extraKeywords: Record<string, string[]> = {
  'gdansk': ['serwis zebra gdynia', 'serwis zebra sopot', 'serwis zebra trójmiasto', 'naprawa zebra trójmiasto'],
  'katowice': ['serwis zebra śląsk', 'serwis zebra gliwice', 'serwis zebra zabrze', 'naprawa zebra górny śląsk'],
  'lodz': ['serwis zebra pabianice', 'serwis zebra zgierz', 'naprawa zebra łódzkie'],
  'bydgoszcz': ['serwis zebra toruń', 'serwis zebra inowrocław', 'naprawa zebra kujawsko-pomorskie'],
  'torun': ['serwis zebra bydgoszcz', 'serwis zebra włocławek', 'naprawa zebra kujawsko-pomorskie'],
  'rzeszow': ['serwis zebra dolina lotnicza', 'serwis zebra przemyśl', 'naprawa zebra podkarpacie'],
  'szczecin': ['serwis zebra świnoujście', 'serwis zebra stargard', 'naprawa zebra pomorze zachodnie'],
  'zielona-gora': ['serwis zebra zielona góra', 'serwis zebra gorzów wielkopolski', 'naprawa zebra lubuskie', 'serwis zebra lubuskie'],
}
```

---

## Zmiana 3 — keywords array (linie 289-296)

**Obecnie:**
```ts
keywords: [
  `serwis zebra ${city.name.toLowerCase()}`,
  `naprawa drukarek zebra ${city.name.toLowerCase()}`,
  `naprawa terminali zebra ${city.name.toLowerCase()}`,
  `serwis drukarek etykiet ${city.name.toLowerCase()}`,
  `autoryzowany serwis zebra ${city.name.toLowerCase()}`,
  ...(extraKeywords[params.miasto] || []),
],
```

**Zmień na:**
```ts
keywords: [
  `serwis zebra ${city.name.toLowerCase()}`,
  `naprawa zebra ${city.name.toLowerCase()}`,
  `naprawa terminali zebra ${city.name.toLowerCase()}`,
  `naprawa skanerów zebra ${city.name.toLowerCase()}`,
  `autoryzowany serwis zebra ${city.name.toLowerCase()}`,
  ...(extraKeywords[params.miasto] || []),
],
```

(Drop „naprawa drukarek zebra X" i „serwis drukarek etykiet X" → zastąp „naprawa zebra X" i „naprawa skanerów zebra X". Pozostają keywords brand+city, dropujemy keyword który konkuruje z hubem.)

---

## Zmiana 4 — Intro paragraph (linia 565)

**Obecnie:**
```tsx
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
  {city.introText} Jesteśmy częścią ogólnopolskiego{' '}
  <Link href="/serwis-drukarek-zebra" className="text-blue-700 font-semibold hover:underline">
    serwisu drukarek Zebra
  </Link>{' '}
  z 25-letnim doświadczeniem. Specjalizujemy się w naprawie urządzeń Zebra Technologies – drukarki etykiet, terminale mobilne, skanery kodów.
</p>
```

**Zmień na:**
```tsx
<p className="text-sm sm:text-base text-gray-700 leading-relaxed">
  {city.introText} Jesteśmy częścią ogólnopolskiego{' '}
  <Link href="/serwis-drukarek-zebra" className="text-blue-700 font-semibold hover:underline">
    autoryzowanego serwisu Zebra
  </Link>{' '}
  z 25-letnim doświadczeniem. Specjalizujemy się w naprawie urządzeń Zebra Technologies – drukarki etykiet, terminale mobilne, skanery kodów.
</p>
```

(Anchor zmienia się z „serwisu drukarek Zebra" na „autoryzowanego serwisu Zebra" — Google przestaje uważać tę stronę lokalną jako exact match dla query „serwis drukarek zebra". URL `/serwis-drukarek-zebra` zostaje, więc hub dalej odbiera link equity.)

---

## Zmiana 5 — H3 i sekcja drukarek (linie 582-588)

**Obecnie:**
```tsx
<h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Naprawa drukarek etykiet Zebra</h3>
<p>
  Oferujemy <strong>naprawę drukarek etykiet Zebra</strong> wszystkich serii – od popularnych modeli desktop 
  (ZD420, ZD620, GK420) przez wydajne drukarki przemysłowe (ZT410, ZT610), po mobilne (ZQ520, ZQ630). 
  Najczęściej wykonywane usługi to wymiana głowic drukujących, naprawa mechanizmów podawania etykiet, 
  czyszczenie sensorów i kalibracja parametrów wydruku. Więcej informacji o{' '}
  <Link href="/serwis-drukarek-zebra" className="text-blue-600 hover:underline">serwisie drukarek Zebra</Link>.
</p>
```

**Zmień na:**
```tsx
<h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
  Naprawa Zebra w {city.nameLocative} — drukarki etykiet
</h3>
<p>
  W ramach lokalnego serwisu w {city.nameLocative} naprawiamy <strong>drukarki etykiet Zebra</strong> wszystkich serii – 
  od popularnych modeli desktop (ZD420, ZD620, GK420) przez wydajne drukarki przemysłowe (ZT410, ZT610), po mobilne (ZQ520, ZQ630). 
  Najczęściej wykonywane usługi to wymiana głowic drukujących, naprawa mechanizmów podawania etykiet, 
  czyszczenie sensorów i kalibracja parametrów wydruku. Pełną ofertę usług naprawczych dla drukarek znajdziesz w{' '}
  <Link href="/serwis-drukarek-zebra" className="text-blue-600 hover:underline">centralnym katalogu napraw Zebra</Link>.
</p>
```

(H3 fokus na MIASTO + Zebra. Anchor linka zmieniony z „serwisie drukarek Zebra" na „centralnym katalogu napraw Zebra" — variation, ale wciąż wzmacnia hub bez kanibalizacji exact phrase.)

---

## Co zostaje w spokoju

- **H1** „Serwis Zebra {city.name} – Naprawa Drukarek, Terminali i Skanerów" ✅
- **metaTitle** „Serwis Zebra Warszawa – Naprawa, Kurier 24h" ✅
- **metaDescription** wszystkie ✅ (już bez exact phrase „serwis drukarek zebra")
- **Breadcrumb schema** — link do `/serwis-drukarek-zebra` jako position 2 ✅
- **Wszystkie nav linki** ✅

---

## Po deploy

1. **Request Indexing w GSC** dla każdego z 17 URL stron lokalnych:
   ```
   https://www.serwis-zebry.pl/serwis-zebra/warszawa
   https://www.serwis-zebry.pl/serwis-zebra/krakow
   ... (17 łącznie)
   ```
   To przyspieszy reprocessing przez Google.

2. **Plus Request Indexing dla huba**:
   ```
   https://www.serwis-zebry.pl/serwis-drukarek-zebra
   ```

## Oczekiwany efekt (1-3 tygodnie)

- Google przestaje wskazywać strony lokalne dla query „serwis drukarek zebra"
- Cały traffic z 95 imp/90d (GSC) idzie na `/serwis-drukarek-zebra`
- Pozycja huba z 8.69 → **5-6** (chwilowy boost)
- Strony lokalne **nie tracą** rankingu na local queries („serwis zebra warszawa") — bo te keywords zostają

Po dodaniu external linków (Plan C) — pozycja huba pójdzie do TOP 3 w 4-6 tyg.

---

## Komenda do testowania

Po wdrożeniu zmian — sanity check:

```bash
# Sprawdź czy "serwis drukarek zebra" exact phrase NIE występuje w content lokalnym
grep -rE "serwis drukarek zebra|naprawa drukarek zebra" app/serwis-zebra/\[miasto\]/page.tsx | grep -v "// keep" | grep -v "/serwis-drukarek-zebra"

# Powinno zwrócić 0 wyników (poza linkami w hrefach)
```
