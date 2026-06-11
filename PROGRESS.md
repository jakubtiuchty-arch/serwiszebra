# PROGRESS — serwis-zebry.pl

Checkpoint postępu prac. Najnowszy wpis na górze. Po każdym etapie/buildzie dopisz: co zrobione, pliki, commit, TODO.

---

## 2026-06-11 — integracja Jarltech (3. dystrybutor) — admin + fallback /sklep

- `lib/jarltech.ts` — port z takmy (OAuth2 client credentials, PN→ID mapping cache 24h, item price/stock/incoming-stock równolegle, concurrency 4, cache 1h). Klucze JARLTECH_* dodane do `.env.local` — **DODAĆ TEŻ NA VERCEL!**
- Admin `/api/admin/parts-catalog/check-stock`: trzecie równoległe źródło; `app/admin/katalog`: wiersz „Jarltech" (teal) + hint z dostawami przychodzącymi (ETA) i ostrzeżeniem o cenie pakietowej (priceQuantity).
- `/api/shop/product-stock`: fallback dostępności z Jarltecha TYLKO gdy Ingram total=0 i in_delivery=0; zwraca `jarltech_stock/incoming/eta`, BEZ ceny (ceny sklepu zostają z Ingrama).
- `RealTimeStock.tsx`: „Na zamówienie — wysyłka 4-7 dni (X szt. u dostawcy)" lub „Dostępny wkrótce (dostawa do dystrybutora: data)". ŚWIADOMA DECYZJA: jarltech_stock NIE odblokowuje koszyka (onStockLoaded dostaje 0) — sprzedaż z magazynu Jarltecha wymaga decyzji o procesie zamówień.
- Test live: P1058930-009 → Jarltech 485 szt. + 819 w dostawie ETA 2026-06-26, 392,05 EUR = 1 667,39 zł (kurs NBP 4,253). Build EXIT=0.
- **AKTUALIZACJA (model takma)**: user potwierdził model Magazyn PL/EU — `/api/shop/product-stock` odpytuje RÓWNOLEGLE Ingram+BlueStar+Jarltech przy każdej karcie (cache 1h per lib): `stock_pl`=Ingram lokalny (24h), `stock_de`=Ingram DE+BlueStar+Jarltech (EU, 2-3 dni), `total_stock`=PL+EU → **koszyk odblokowany dla stanów EU** (u nich zamawiamy). `RealTimeStock`: kropki jak w takmie („Magazyn PL: X szt. — wysyłka 24h" / „Magazyn EU: X szt. — wysyłka 2-3 dni"), plus „Dostępny wkrótce (ETA)" z incoming Jarltecha. Ceny nadal TYLKO z Ingrama. Test: P1058930-009 → PL 3 szt. + EU 1412 szt. Build EXIT=0.
- TODO: env JARLTECH_* na Vercel (bez tego magazyn EU = sam BlueStar+IngramDE).
- **Auto-load stock w /admin/katalog**: po wczytaniu listy części stany 3 dystrybutorów dociągają się same paczkami po 10 PN (limit API), sekwencyjnie, z generation guardem (zmiana strony/filtra przerywa). Wiersze wypełniają się progresywnie (~9 s/paczka na zimno, cache 1h → instant przy powrocie). Przycisk „Sprawdź stock" został jako ręczny refresh pojedynczego wiersza. Build EXIT=0.

## 2026-06-11 — SEO podkategorie głowic: rozbudowa thin content, audyt 63/63 PASS

- `/sklep/glowice/drukarki-biurkowe`: 717→1121 słów; `/drukarki-przemyslowe`: 844→1324 słowa.
- Zmiany w `app/sklep/[...slug]/page.tsx`: tabele PN generowane z bazy na obu podstronach (zamiast hardcode), CollectionPage schema dla podkategorii, FAQ 2/3→5 pytań z dynamicznymi cenami, nowe H3 (wymiana bez narzędzi ZD, docisk ZT, szerokość 104/168 mm, wymiana czy nowa drukarka), title/desc dopasowane do 50-60/140-160.
- Naprawione błędy merytoryczne: FAQ przemysłowe „1000-3500 zł" (realnie do 5 682 zł — ZT411 600 DPI); twierdzenie „głowice d i t takie same" (ZD421d=P1112640-019 vs ZD421t=-218, potwierdzone w bazie); PN ZT620 -015/-016 zweryfikowane w DB.
- FAQ przestylowane z border-l-4 na border-slate-200 rounded-xl (zasada anty-slop).
- Audyt rozszerzony na 3 strony (`scripts/seo-audit-category.ts`, config PAGES per strona, frazy modelowe, C2 liczy minimum per strona z ItemList): **63/63 PASS**. Build EXIT=0.
- Frazy modelowe pokryte: głowica zd421, głowica gk420 (biurkowe); głowica zt411, głowica zt610 (przemysłowe).
- TODO: commit+push po potwierdzeniu; potem GSC Request indexing wszystkich 3 stron.

## 2026-06-11 — repo przeniesione poza iCloud: ~/projects/serwiszebra

- Rsync z Pulpitu (1,6 GB), weryfikacja: md5 plików zgodne, `git fsck` czysty, commit `8826d9c`, `npm run build` EXIT=0, dev na 3002 z nowej ścieżki.
- **OD TERAZ PRACUJEMY W `~/projects/serwiszebra/`.** Kopia na `~/Desktop/serwiszebra/` = przestarzały backup do skasowania przez usera.
- Powód: iCloud (dysk 84%) zrzucał pliki → fantomowe błędy TS, SIGBUS w gicie, odrzucone pushe. Szczegóły w memory `project_icloud-repo-hazard`.
- TODO: skasować kopię z Pulpitu po kilku dniach; przenieść też `~/Documents/ezdrp-next` (to samo ryzyko).

## 2026-06-11 — SEO /sklep/glowice: pętla zakończona, 23/23 PASS + czysty build

- Dokończona praca przerwana padem internetu: Faza 3 (pętla audyt→popraw→build).
- **Audyt `scripts/seo-audit-category.ts`: 23/23 PASS (100%)**, build produkcyjny EXIT=0.
- Zmiany (niezacommitowane): `app/sklep/[...slug]/page.tsx` (dynamiczne title/meta z realnym min. ceny 422 zł, ItemList z sku/price/availability z bazy, CollectionPage schema, tabela PN generowana z 41 produktów z bazy zamiast 15 hardcodowanych wierszy, sekcja „Głowica termiczna czy termotransferowa?"), `components/shop/ShopSubheader.tsx` (aria-label Breadcrumb), `components/Footer.tsx` (alt BLIK), fix TS2802 w skrypcie audytu.
- **WAŻNE — root cause awarii builda**: repo na Pulpicie = iCloud Drive; przy 84% zajętości dysku macOS zrzuca pliki (dataless), tsc czyta je jako puste → fantomowe błędy typów (TS2306 „not a module", zod „bez" z.string itp.) i zwis builda na 0% CPU przy braku internetu. Fix: materializacja źródeł (`git ls-files | xargs cat`), `rm -rf node_modules && npm ci`, usunięcie stale `tsconfig.tsbuildinfo`. Rozważyć przeniesienie repo poza iCloud.
- WYSŁANE: commit `8826d9c` na main (push po walce z iCloud: SIGBUS przy commicie, odrzucony pack, duplikat konfliktowy `obiekt 2` w .git/objects — usunięty, fsck czysty).
- TODO: GSC Request indexing po deployu (/sklep/glowice + podkategorie); GSC/GA4 niepodpięte pod MCP (dane zastępczo z Ahrefs); obserwacja rankingów.

## 2026-06-11 — start checkpointów

- Założony plik PROGRESS.md (zasada: checkpoint po każdym etapie/buildzie).
- Stan repo: ostatni commit `e2fd9ed` — ChatAI: needsRAG dla wszystkich serii z bazy manuali (ZQ/ZC/ZXP/LI/LS/CS/GX/ET/WT).
- Kontekst: ChatAI + RAG działa (gpt-5.5 + pgvector, 144 PDF zaingestowane 2026-06-10).
- TODO znane: endpointy `upload-manual` i `test-rag` nadal bez auth.
- Brak zadania w toku — czekam na następne polecenie.
