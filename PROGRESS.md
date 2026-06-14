# PROGRESS — serwis-zebry.pl

Checkpoint postępu prac. Najnowszy wpis na górze. Po każdym etapie/buildzie dopisz: co zrobione, pliki, commit, TODO.

---

## 2026-06-14 — ChatAI samodoskonalenie: KROK 2 — „czarna skrzynka" (diagnoza RAG)

- **Cel**: przy 👎 wiedzieć DLACZEGO (3 powody: brak instrukcji / złe wyszukiwanie / zły styl). Dotąd log miał tylko `rag_context_found` (boolean).
- **Migracja** `supabase-chat-blackbox.sql`: `detected_model TEXT`, `rag_sources JSONB` (`[{manual,page,sim}]`). Najlepsze dopasowanie → istniejąca `rag_similarity_score`. **MUSI być w Supabase PRZED pushem** (inaczej insert logu pada na nieznanych kolumnach → brak logowania).
- **Kod** `app/api/chat/route.ts`: `searchManuals` zwraca `sources` (manual/page/sim z `match_documents`); call site łapie do `ragSources`; `saveChatLog` zapisuje `rag_sources` + `rag_similarity_score=top` + `detected_model` (`detectPrinterModel(lastUserMessage).join(',')`). Off-topic call: pola opcjonalne (null).
- **Stan**: tsc czysto, build EXIT=0, dev 3002 /→200. CZEKA na: user uruchomi SQL → commit+push.
- **Następne**: KROK 3 = widok „złe odpowiedzi z ostatniego tygodnia" (👎 + czarna skrzynka w jednym miejscu) → potem golden set + tuning retrievalu.

---

## 2026-06-14 — FIX: „Wyślij do serwisu" pokazywał się mimo rozwiązanego problemu

- **Bug (żywy na PRODZIE, stara logika)**: CTA „Wyślij do serwisu" wyskakiwał przy `messageCount >= 6` niezależnie od tego, czy problem rozwiązany. Klient naprawiał sprzęt → chat i tak namawiał na wysyłkę.
- **Fix**: backend (`api/chat/route.ts`) dokłada do metadanych `__CITATIONS__` flagę `resolved: problemResolved` (ta sama logika, co dokleja „Więcej poradników"). Front (`AIChatBox.tsx`) parsuje `resolved`, dodaje `problemResolved` (flaga LUB obecność blogLinks jako fallback) i warunek `!problemResolved` do `shouldShowFormButton`.
- **Stan**: tsc czysto, dev 3002 /→200. Do wypchnięcia na prod (bug jest live). TODO usera: test lokalny ścieżki rozwiązanej vs nierozwiązanej + push.

---

## 2026-06-14 — ChatAI samodoskonalenie: KROK 1 — przyciski 👍/👎 (sygnał od użytkownika)

- **Powód**: start budowy pętli uczenia chata. Pierwszy klocek = zbieranie oceny użytkownika końcowego (dotąd była tylko ocena admina). Plan całości omówiony w czacie (flywheel + 3 powody złych odpowiedzi: brak instrukcji / złe wyszukiwanie / zły styl).
- **Migracja SQL** `supabase-chat-feedback.sql` — nowe kolumny w `chat_logs`: `user_rating SMALLINT` (1=👍, -1=👎), `user_feedback_at`. Osobne od review admina (`quality_rating`/`is_correct`), żeby się nie nadpisywały. **MUSI być uruchomiona w Supabase SQL editor zanim oceny zaczną się zapisywać.**
- **Backend** `app/api/chat/route.ts`: `logId = crypto.randomUUID()` generowany z góry, wpisywany do logu (`saveChatLog` dostał pole `id`), zawsze odsyłany na front w bloku `__CITATIONS__` (wcześniej blok leciał tylko gdy były citations). Drugie wywołanie saveChatLog (off-topic) też dostało `id`.
- **Nowy endpoint** `app/api/chat-logs/feedback/route.ts` — POST `{logId, rating:'up'|'down'}` → update `user_rating`+`user_feedback_at` (service-role). Walidacja: 400 na brak pól.
- **Front** `components/AIChatBox.tsx`: typ Message + `logId`/`feedback`; parsowanie `logId` ze strumienia; handler `sendFeedback` (optymistyczny update + fetch); helper `renderFeedback` (👍/👎 lub podziękowanie po ocenie) wpięty w OBA widoki (zwinięty + pełny). Ikony ThumbsUp/ThumbsDown z lucide.
- **Stan**: `tsc --noEmit` czysto, dev 3002, `/`→200, feedback endpoint waliduje (400). **TODO usera**: uruchomić `supabase-chat-feedback.sql` w Supabase, potem przetestować chat + commit/push.
- **Następne kroki pętli** (po zebraniu sygnału): KROK 2 = logowanie CO RAG zwrócił (similarity per chunk) + wykryty model; potem golden set + sędzia (gate); potem tuning retrievalu (naiwny chunking 1000/200 zn. = największa słabość); numery stron w manualach są ZMYŚLONE (estymowane z chunk_index) — do naprawy przy ingescie.

---

## 2026-06-13 — Przelewy24 (P24) zamiast Stripe w sklepie — KOD SANDBOX GOTOWY

- **Powód**: 60+ porzuconych koszyków na Stripe; takma przeszła na własne P24 (niższe prowizje, natywny PL UX). Analiza + plan w `PLAN-przelewy24.md`.
- **Wzorzec**: takma `src/lib/p24.ts` (klasyczne API 3.2, md5/CRC, bez REST) — czysta logika, przeniesiona 1:1. takma=Prisma, serwiszebra=Supabase `shop_orders`.
- **Bez migracji DDL**: `sessionId = shop_orders.id` (uuid) → webhook match po `id`; id transakcji P24 w reużytej kolumnie `stripe_payment_id`.
- **Nowe pliki**: `lib/p24.ts`, `app/api/shop/p24/{create,webhook,status}/route.ts`. **Zmiany**: `sklep/zamowienie/page.tsx` (online 'stripe'→'p24', endpoint `/api/shop/p24/create`, etykiety Przelewy24), `sklep/zamowienie/sukces/page.tsx` (powrót `?order=&sid=` → polling p24/status; ścieżka Stripe `session_id` zachowana), `api/orders` (payment_status pending dla 'p24'), `.env.local` (P24_SANDBOX=true + puste klucze).
- **Stan**: build EXIT=0, 3 route'y zarejestrowane, smoke-test OK (create→503 bez kluczy, status→paid:false). NAPRAWY zostają na Stripe (osobny flow, nie ruszane).
- **REST v1 zamiast klasycznego (2026-06-13 wieczór)**: pierwszy test usera → P24 „Błąd 400 Nieprawidłowe żądanie". Diagnoza: użyłem klasycznego API 3.2 (md5) za takmą, ale to działa tylko na starym koncie takmy (352235); świeże konta wymagają **REST API v1** (JSON, SHA-384, Basic auth posId:apiKey). `lib/p24.ts` przepisane na REST; webhook parsuje JSON; dochodzi `P24_API_KEY` (klucz REST, ≠ CRC). `scripts/p24-diag.mjs` testuje oba transporty.
- **Tryb symulacji** `P24_SIMULATE=true` w `api/shop/p24/create` — test logiki aplikacji bez konta P24 (oznacza paid + redirect na sukces). **ZWERYFIKOWANE E2E**: utwórz zamówienie → create(simulate) → status paid:true. Cała ścieżka app-side działa. Flaga domyślnie OFF, usunięta z .env.
- **✅ TEST E2E SANDBOX PRZESZEDŁ (2026-06-13)**: sandbox P24 to osobna rejestracja (sandbox.przelewy24.pl). Klucze: Klucz do CRC→P24_CRC, Klucz do raportów→P24_API_KEY (Basic auth REST), ID sprzedawcy 402592→MERCHANT_ID/POS_ID. Diag potwierdził REST register→token→bramka (302→sandbox-go, HTTP 200, zero 400). User zapłacił realnie przez tunel **ngrok** (NEXT_PUBLIC_URL=ngrok url dla webhooka): koszyk→P24→płatność→webhook (sign SHA-384 OK)→trnVerify→`succeeded`/`confirmed`/paid_at + p24OrderId w stripe_payment_id + mail. **Webhook log: „Order ... PAID".**
- **Konto PRODUKCYJNE**: user założył NOWE konto P24 dla serwis-zebry.pl — **czeka na aktywację**. Po aktywacji: P24_SANDBOX=false + klucze prod na Vercelu, NEXT_PUBLIC_URL=https://www.serwis-zebry.pl.
- **Bugfix UX**: „TWÓJ KOSZYK JEST PUSTY" migało przed redirectem (clearCart przed window.location). Fix: clearCart przeniesiony z zamowienie/page do sukces/page (apply()) — koszyk czyszczony DOPIERO po udanej płatności (bonus: porzucony koszyk zachowany).
- **STAN: integracja kompletna i przetestowana. Czeka na aktywację konta prod + przełączenie env (sandbox→prod).** Tunel ngrok i NEXT_PUBLIC_URL=ngrok są TYMCZASOWE (do testów) — przed prod usunąć/zmienić.

## 2026-06-12 — NOWA KATEGORIA /sklep/zasilacze (14 produktów), audyt 193/193

- **Analiza parts_catalog** (868 unikalnych PN, 30 kategorii): plan rozbudowy sklepu — Tier 1: zasilacze✓, obcinarki, dyspensery/obieracze, prowadnice mediów (~97 PN Prod); Tier 2: sensory, wrzeciona, pasy; NIE: płyty główne, obudowy, RFID. Frazy generyczne 0 vol (greenfield, ruch przez strony produktów po PN).
- **Zasiew**: `scripts/seed-zasilacze.mjs` — 14 PN (Production) z cenami zakupu Ingram ×1,10 (jak cron sync-ingram, który przejmie aktualizację), opisy PL, meta, compatible_models. Dostępne od ręki: P1117258-012 (22), P1105147-012 (3), P1105147-024 (1); reszta stock 0 (BlueStar ma część — magazyn EU pokaże live).
- **Rejestracja**: shop-categories.ts (zasilacz/zasilacze, desktop+industrial z modelami), ikona Zap, genderPrefix, typeLabel, kategoria w schema produktu, CollectionPage, metadata main z dynamiczną ceną (od 553 zł = min DOSTĘPNEGO; wyłącznik 82 zł ma stock 0), sekcja SEO (zewn. vs wewn., tabela PN z bazy, diagnostyka, FAQ 5 + schema).
- **ZDJĘCIA (Bing po PN, ręczna weryfikacja wizualna)**: 7/14 czystych: P1037974-019 (wyłącznik), P1037974-065, P1058930-032, P1077233, P1105147-024, P1117258-012, P1123335-022. ODRZUCONE śmieci: zderzak samochodu (kolizja nazwy!), pudełko z obcym PN, watermarki TEBRRONIX/RD, generyczne duplikaty. **BRAK 7**: P1007560, P1025950-042, P1037974-043, P1058930-033, P1083320-043, P1105147-012, P1123335-023.
- Lekcja: Bing serwuje losowy feed przy braku wyników (filtr: PN w URL źródła) + UA „Chrome" dostaje lazy-load bez murl (krótki UA działa).
- Audyt: 10 stron, **193/193 PASS**. Build EXIT=0.
- **KOREKTA kompatybilności (user spostrzegł)**: pełne opisy z parts_catalog (poprzedni odczyt był ucięty) — P1117258-012 pasuje też do ZD611d/t/R; P1025950-042 = GK420d/t + GT800 + ZD410d (GX420 NIE — mój błąd, usunięty); P1083320-043 = ZT600 Series → ZT510/ZT610/ZT620; P1007560 ma ograniczenie numerów seryjnych Xi4 (dodane do opisu). Seed poprawiony + upsert, shop-categories zaktualizowane. Audyt 193/193, build EXIT=0.
- **+6 zasilaczy ZEWNĘTRZNYCH z oferty takmy (user wskazał)**: P1080383-704 (ZD220/230), P1079903-026 (ZD411/421/621 — bestseller: Ingram 52+BS 175+Jarltech 41), P1031365-042 (AC ZQ5xx/ZQ6xx, 856 szt.), P1031359 (samochodowy ZQ, 824), PWR-BGA12V50W0WW i -108W0WW (stacje dokujące TC22/27; BRAK w Ingramie → stock seedowany z BlueStara, oznaczony w attributes.stock_source, cron NIE nadpisze bo `continue` przy notFound). Zdjęcia 6/6 z takma/public (kanwa 800×800). Razem 20 produktów, 13/20 ze zdjęciem. Min dostępnego spadło na 173 zł (title sam się zaktualizował). shop-categories: +zd220, +mobile (ZQ), +terminals (stacje). Audyt 193/193, build EXIT=0.
- **Poprawki UX po przeglądzie usera**: (1) wspólne zdjęcie P1080383-704 na WSZYSTKICH 4 kartach /zasilacze/drukarki-biurkowe (photoOverride w seedzie; alty per produkt z nazw — automatyczne); (2) wszystkie 13 zdjęć: crop białych marginesów + upscale do 740px (cap ×2,2) — wypełnienie kadru 78-92% (thumbnail() nie powiększa — trzeba resize!); (3) P1031365-042: płaskie ujęcie 3,5:1 zamienione na kwadratowe z sieci (weryfikacja wizualna); (4) drzewko mobilnych zasilaczy: po wyjaśnieniu usera ZOSTAJE jeden zbiorczy węzeł ZQ (2 produkty = AC+samochodowy do tych samych drukarek); nazwy zmienione na seryjne („Zasilacz AC do drukarek z serii ZQ", „Zasilacz samochodowy do drukarek z serii ZQ"), pełne listy modeli w description/meta_description pod long-tail „zasilacz do ZQxxx". UWAGA cache: optymalizator Next trzyma warianty w .next/cache/images — po podmianie pliku rm -rf .next + hard refresh przeglądarki.
- **Porządki w zasilaczach terminalowych (user wytknął bełkot „do drukarki Zebra Stacje")**: nazwy seryjne („Zasilacz sieciowy 50W do stacji dokujących terminali Zebra", „...108W do stacji wielogniazdowych...") + kompatybilność z takmy: stacje dla TC22/TC27/MC3300x/MC3400/MC3450/MC9400/MC9450 (pełna lista w desc pod long-tail). **+21. produkt**: PWR-BGA15V45W-UC2-WW Zasilacz USB-C 45W do tabletów ET60/ET65 (foto z takmy; BS 264 szt.). Drzewko: node „Stacje TC22/TC27, MC3xxx, MC9xxx" + nowa podkategoria Tablety (ET60/ET65). Tabela kategorii: nagłówek „Urządzenie" (nie „Model drukarki"), kolumna Rodzaj ze splitu ' do '. Audyt 193/193, build EXIT=0.
- **Hero kategorii — pełnowymiarowa grafika (Higgsfield), v2 po feedbacku**: hero `/sklep/[...slug]` miał pusty prawy obszar. Finalny koncept (user): grafika FULL-BLEED jako tło hero, BEZ drukarki, sam render zasilacza po PRAWEJ, lewa strona ciemna pod tekst. Higgsfield nano_banana_pro, 21:9 2k, count=2, ~4 kredyty (saldo ~1133). Wybrany wariant A: czarna kostka zasilacza + eksplodujące podzespoły (zielona PCB, kondensatory, transformator) po prawej, lewa 1/3 ciemny negative space, błyskawice+raster Ben-Day jak blog. Plik `public/sklep_photo/hero/zasilacze.jpeg` (1920×815, 357KB).
  - Implementacja: `<Image fill object-cover object-right>` jako tło sekcji + overlay `bg-gradient-to-r from-slate-950 from-20% via-slate-900/55 via-50% to-transparent to-72%` (zanik przy 72% → render w pełni jasny). Tekst WARUNKOWY: gdy heroImage → białe; gdy brak → stary jasny gradient + ciemny tekst. min-h-[240px]/md:280px. Mapa `HERO_IMAGES` per productType.id.
  - **Kadrowanie (po iteracji z userem)**: obraz 21:9 nie pasuje do niskiego hero (~6,5:1) → composite Python do banera 2470×380 (6,5:1 = proporcja hero @1920): podmiot skalowany do 109% wys. (+40% przez 2× „jeszcze 20%"), DOSUNIĘTY do prawej (x=W-new_w, margines 0), feather lewej krawędzi 170px (brak szwu), object-right (na węższych ekranach przycina lewą ciemną stronę, nie podmiot). Recepta `banner()` reużywalna.
- **Hero dla wszystkich 4 kategorii (głowice/wałki/akumulatory/zasilacze)**: Higgsfield nano_banana_pro 21:9 2k. Głowica = belka głowicy termicznej (pasek elementów grzewczych, FFC). Wałek = wałek gumowy + koła zębate/łożyska (wariant 2/2 czystszy). Akumulator = matowy blok baterii + złote styki + ogniwa 18650 + BMS (REGEN — pierwsze 2 warianty wychodziły jak ekran terminala; dodano „matte, NO screen, power-tool battery brick"). Pliki `public/sklep_photo/hero/{glowice,walki,akumulatory,zasilacze}.jpeg` (~110KB każdy). Wpięte w HERO_IMAGES. Audyt 193/193, build EXIT=0. ~24 kredyty łącznie (saldo ~1112).
- **Bonus grammar fix (z heroImage)**: `categoryGenitive` w pageSubtitle miało tylko 2 wpisy → „do drukarki biurkowe"; dodane biurkowe/przemysłowe/stacje/tablety → poprawne dopełniacze na wszystkich podkategoriach.
- **Wałek hero v2 — IMAGE-TO-IMAGE z realnego zdjęcia**: pierwszy render wałka wyszedł jak 2 grube cylindry/silnik (user wytknął). Fix: upload realnego zdjęcia produktu P1037974-028.png (smukły wałek, koło zębate, kołnierze) do Higgsfield (media_upload PUT→media_confirm), generacja nano_banana_pro z `medias:[{role:image}]` → poprawna geometria w stylu komiksowym. **WZORZEC**: dla części o specyficznym kształcie używać realnego zdjęcia jako referencji i2i, nie samego promptu.
- **Fix szwu w banner()**: image-to-image wałka miał jaśniejsze tło niż sztywne (0,6,20) → widoczny pionowy szew na styku z wypełnieniem. Fix: `banner()` próbkuje kolor tła z lewego-górnego rogu ŹRÓDŁA (crop 5,5,150,150 avg) zamiast hardcode + feather poszerzony 170→300px. Wszystkie 4 hero przebudowane tym kodem (głowica bg 1,3,20 / akum 0,3,12 / zasilacz 0,6,20 / wałek 8,11,22). Recepta w razie kolejnych części.
- **Bonus grammar fix**: `categoryGenitive` w generowaniu pageSubtitle miało tylko 'Terminale'+'Drukarki mobilne' → „Zasilacze do drukarki biurkowe Zebra" (błąd). Dodane: biurkowe/przemysłowe/stacje/tablety → „...do drukarek biurkowych Zebra". Naprawia podtytuł na WSZYSTKICH podkategoriach. Audyt 193/193, build EXIT=0.
- UWAGA cache: po podmianie hero potrzebny hard refresh przeglądarki + (na dev) rm -rf .next bo optymalizator obrazków Next cache'uje warianty.
- TODO: commit+push po potwierdzeniu; hero dla głowic/wałków/akumulatorów (po akceptacji); zdjęcia 7 brakujących PN zasilaczy; kolejne kategorie Tier 1 (obcinarki ~28 PN).

## 2026-06-12 — SEO /sklep/akumulatory (3 strony): wzorzec zastosowany, audyt 174/174

- Strony: main + /terminale (11 produktów TC/MC) + /drukarki-mobilne (5 ZQ); tablety ET tylko na main (19).
- **Naprawione dane**: meta „Od 78 zł" liczone z produktu stock=0 (ZQ220) → dynamicznie od 205 zł (realne min. dostępnego); tabela main zawierała TC501/TC701 `BTRY-TC5X-46MA1-01` SPOZA bazy, brakowało 3 baterii ET60/ET65; FAQ terminale podawało „Freezer 300-450 zł" (realnie BTRY-MC93-FRZ-01 = 609 zł) → ceny dynamiczne min-max.
- Usunięte niezweryfikowalne twierdzenie „BTRY-NGTC5TC7 pasuje do TC52/TC72" (kompatybilność wsteczna — brak potwierdzenia, prawdopodobnie fałsz).
- Tabele hybrydowe: wiersze z bazy (PN/cena/dostępność live) + `BATTERY_SPECS` lookup po SKU (typ/mAh — dane stałe producenta); main grupowana (Terminale/Drukarki/Tablety przez `batteryGroup()`); import Fragment dodany.
- Metadata podkategorii dedykowane (było generic za krótkie): terminale 57 zn., mobilne 50 zn., + og:image (BTRY-MC93-STN / BTRY-MPP-34MA1).
- **Globalne ujednolicenie FAQ**: 30× `border-l-4 border-{blue,red,green}-500 pl-4` → `border border-slate-200 rounded-xl p-4` (też stare FAQ głowic main). Quick-answer box na kartach produktów (1×) zostawiony — osobna decyzja.
- Audyt: 9 stron (głowice+wałki+akumulatory), **174/174 PASS**. Build EXIT=0.
- WYSŁANE: commit `636cafc` na main. TODO: GSC Request indexing 3 stron akumulatorów po deployu.

## 2026-06-12 — SEO /sklep/walki-dociskowe (3 strony): wzorzec głowic zastosowany, audyt 118/118

- **Dane** (`seo-data/walki.json`): „wałek dociskowy" 315/mies. KD 0, ale SERP o OBCEJ intencji (wałki dekarskie/malarskie — Leroy, Castorama, YATO) → celujemy w long-tail kwalifikowany: „wałki dociskowe do drukarek", frazy modelowe (wałek zt411/zd421), „platen roller" (10/mies.).
- **Naprawione PN (7 z 9 wierszy hardcodowanej tabeli było błędnych!)**: ZT610 wałek to P1083320-032 (tabela podawała P1083347-005 = głowica ZT510 203dpi!), ZT620→-033 (było -006 = głowica ZT510 300dpi), ZT230→P1037974-028 (było -003), ZT510→P1083347-012 (było -018), ZD510-HC→P1100266-008 (było P1112640-017), ZD220/230→P1080383-700/-703 d/t (było -417), ZD421/621→4 osobne wałki d/t×203/300 (było „wspólny P1112640-016", którego NIE MA w bazie).
- **Fix merytoryczny FAQ**: „wałek nie zależy od DPI" prawdziwe TYLKO dla przemysłowych ZT; w biurkowych ZD osobne PN dla 203/300 DPI ORAZ wersji d/t. FAQ „ZD411 pasuje do ZD421" usunięte (nie mamy wałka ZD411); nowe: ZD421d vs t, ZD421↔ZD621 (wspólne tylko w wersjach d).
- Tabele PN generowane z bazy na 3 stronach (kolumna DPI: „wszystkie" gdy NULL), ceny dynamiczne (min dostępnego 73 zł, max 536), CollectionPage schema (mapa rozszerzona o wałki), title/desc w limitach (50/58/55 + 149/149/146), FAQ przestylowane na border-slate-200.
- Audyt rozszerzony: PAGES z `productType` (glowica|walek), fetch per typ. **ŁĄCZNIE 118/118 PASS** (6 stron). Build EXIT=0 (po fixie TS2802: Array.from zamiast spread Set).
- Słowa: main 1027, biurkowe 812, przemysłowe 712 (krótszy listing — 6 produktów/podstronę).
- WYSŁANE: commit `1c17890` na main. TODO: GSC Request indexing 3 stron wałków po deployu.

## 2026-06-11 — integracja Jarltech (3. dystrybutor) — admin + fallback /sklep

- `lib/jarltech.ts` — port z takmy (OAuth2 client credentials, PN→ID mapping cache 24h, item price/stock/incoming-stock równolegle, concurrency 4, cache 1h). Klucze JARLTECH_* dodane do `.env.local` — **DODAĆ TEŻ NA VERCEL!**
- Admin `/api/admin/parts-catalog/check-stock`: trzecie równoległe źródło; `app/admin/katalog`: wiersz „Jarltech" (teal) + hint z dostawami przychodzącymi (ETA) i ostrzeżeniem o cenie pakietowej (priceQuantity).
- `/api/shop/product-stock`: fallback dostępności z Jarltecha TYLKO gdy Ingram total=0 i in_delivery=0; zwraca `jarltech_stock/incoming/eta`, BEZ ceny (ceny sklepu zostają z Ingrama).
- `RealTimeStock.tsx`: „Na zamówienie — wysyłka 4-7 dni (X szt. u dostawcy)" lub „Dostępny wkrótce (dostawa do dystrybutora: data)". ŚWIADOMA DECYZJA: jarltech_stock NIE odblokowuje koszyka (onStockLoaded dostaje 0) — sprzedaż z magazynu Jarltecha wymaga decyzji o procesie zamówień.
- Test live: P1058930-009 → Jarltech 485 szt. + 819 w dostawie ETA 2026-06-26, 392,05 EUR = 1 667,39 zł (kurs NBP 4,253). Build EXIT=0.
- **AKTUALIZACJA (model takma)**: user potwierdził model Magazyn PL/EU — `/api/shop/product-stock` odpytuje RÓWNOLEGLE Ingram+BlueStar+Jarltech przy każdej karcie (cache 1h per lib): `stock_pl`=Ingram lokalny (24h), `stock_de`=Ingram DE+BlueStar+Jarltech (EU, 2-3 dni), `total_stock`=PL+EU → **koszyk odblokowany dla stanów EU** (u nich zamawiamy). `RealTimeStock`: kropki jak w takmie („Magazyn PL: X szt. — wysyłka 24h" / „Magazyn EU: X szt. — wysyłka 2-3 dni"), plus „Dostępny wkrótce (ETA)" z incoming Jarltecha. Ceny nadal TYLKO z Ingrama. Test: P1058930-009 → PL 3 szt. + EU 1412 szt. Build EXIT=0.
- DONE: env JARLTECH_* dodane na Vercel (serwiszebra_prod; Production przez CLI, Preview+Dev przez REST API — CLI 54 ma buga `--yes` przy preview). Redeploy + weryfikacja na produkcji 2026-06-11: P1058930-009 → PL 3 + EU 875, jarltech_eta obecne. Commity: `8b4e4f4` (SEO podkategorie), `ec81dcc` (Jarltech+PL/EU+auto-load).
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
