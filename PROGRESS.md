# PROGRESS — serwis-zebry.pl

Checkpoint postępu prac. Najnowszy wpis na górze. Po każdym etapie/buildzie dopisz: co zrobione, pliki, commit, TODO.

---

## 2026-07-22 — Odrzucenie wyceny przez webhook Stripe + nr płatności dla księgowości

- **Nowy flow odrzucenia wyceny** (panel klienta): klik „Opłać diagnostykę 166,05 zł" → NAJPIERW anulowanie (`cancel` z flagą `rejectQuote`: status `anulowane`, `final_price=166.05`, `price_notes` z odrzuconą wyceną) → potem płatność Stripe → potwierdzenie WYŁĄCZNIE webhookiem (`handleDiagnosticFeePayment`: `payment_status=succeeded`+`paid_at`, status zostaje `anulowane`, historia, mail do admina „odeślij urządzenie"). Box Wycena w adminie: 166,05 po odrzuceniu → zielone ZAPŁACONO z datą po webhoosku.
- **Bugfix**: webhook `charge.succeeded` traktował diagnostykę jak płatność za naprawę (ustawiłby `w_naprawie` + maile „rozpoczynamy naprawę") — teraz rozgałęzienie po `metadata.is_diagnostic_fee` + bezpiecznik w `handleRepairPayment` (nie rusza anulowanych). `stripe_payment_id` zapisywany też dla diagnostyki; przerwana płatność do dokończenia z widoku anulowanego zgłoszenia.
- **Księgowość**: box Wycena/Płatność w adminie pokazuje „Nr płatności Stripe" (`pi_…`) z linkiem do dashboardu; opis płatności w Stripe z numerem zgłoszenia `#202607…` (zamiast prefiksu UUID) + `repair_number` w metadata (create-payment-intent i checkout).
- Pliki: `app/api/repairs/[id]/{cancel,create-payment-intent,checkout}/route.ts`, `app/api/webhooks/stripe/route.ts`, `app/panel/naprawa/[id]/page.tsx`, `app/admin/zgloszenie/[id]/page.tsx`, `lib/email.ts` (`sendDiagnosticFeePaidAdminEmail`). tsc czysty.
- Kontekst: zgłoszenie #202607150954 (klient bez konta — naprawione ręcznie 21.07 + port auto-rejestracji do repo takma, osobny commit tam).
- TODO: test na prodzie z prawdziwym webhookiem; ew. mail do klienta po opłaceniu diagnostyki; darmowe anulowanie nadal bez przycisku w UI (martwy modal).

---

## 2026-06-16 — Skanery: PRZEBUDOWA do „bazy wiedzy" z pełnych PDF (w toku)

- **Powód**: pierwsza wersja (z RAG) bywała zbyt płytka. User dał **pełne PDF (PRG + User Guide)** w `/Users/jakubtiuchty/Desktop/Manuale /Skanery/`. Wzorzec = DS9308 (9 sekcji, pełne tabele).
- **Metoda**: `pdftotext "<pdf>" /tmp/prg/<m>.txt` → `awk 'NR>250'` (pomiń TOC) → grep rozdziałów: Configurations, Beeper Definitions, Decode Ranges, Known Harmful/Approved Cleaners, Troubleshooting, Technical Specifications. Pisz wpis → splice Pythonem (replace zakres linii) → tsc → curl 200 → commit.
- **⚠️ KLUCZOWE ODKRYCIE**: lista środków czyszczących **różni się per model**! DS2208 PRG: dopuszczone = **woda utleniona + mydło**, a **70% IPA jest SZKODLIWY**. DS9308: dopuszczony 70% IPA. **Zawsze czytaj „Approved Cleaners" z PRG danego modelu — nie zakładaj IPA!** (Wcześniejsze wersje DS2208/2278/4608/8108 z IPA = do poprawy.)
- **Środki per model (potwierdzone z PRG)**: DS2208/DS2278 = woda utleniona + mydło (IPA 70% SZKODLIWY); DS4608/DS4678 = IPA 70% OK + wersja healthcare (wybielacz 10%/H₂O₂ 3%/chusteczki Clorox); DS9308 = IPA 70% OK. **Każdy kolejny model: czytaj „Approved Cleaners" z jego PRG.**
- **UKOŃCZONE 18/18** ✅. Z pełnych PRG (Desktop): DS9308, DS2208, DS2278, DS4608, DS4678, DS8108, DS8178, DS3608, DS3678, LS2208, LS1203, LI2208, LI4278, DS9908. Z RAG + weryfikacja środków z PRG: CS3000, CS4070, CS6080. Bez PRG na dysku (wersja z RAG, czyszczenie generyczne 70% IPA — do ewentualnej weryfikacji gdy pojawi się PRG): **DS8208/DS8288**.
- **Macierz czyszczenia (zweryfikowana per model)**: DS2208/2278 = woda utleniona+mydło (IPA szkodliwy); DS3608/3678 = IPA+chusteczki (bleach szkodliwy, toleruje płyny przemysłowe DOT4/ATF); DS4608/4678/DS8108/8178/CS6080 = IPA + healthcare (wybielacz 10%/H₂O₂ 3%); DS9308/DS9908/LI2208/LI4278 = IPA; LS2208/LS1203/CS3000/CS4070 = **amoniak/woda na okno** (lasery + stare companiony).
- **Weryfikacja końcowa**: 39/39 SKU → strona 200; macierz czyszczenia spójna (skrypt Python sprawdzający per wpis).
- **Procedura splice** (gdyby wracać): `python3` replace zakresu linii (start `grep -n "'<key>': {"`, koniec = start następnego wpisu). Źródła PDF: `/Users/jakubtiuchty/Desktop/Manuale /Skanery/`, ekstrakcja `pdftotext`.

---

## 2026-06-15 — Polskie instrukcje SKANERÓW (pierwsza wersja z RAG — zastępowana)

- **Cel**: skanery nie miały instrukcji PL (były tylko drukarki/terminale/tablet). 1 instrukcja na **rodzinę**, warianty SKU routowane do rodziny.
- **Źródło faktów (zero zmyślania)**: RAG `manuals_documents` (`metadata.source_file` = oficjalne PDF Zebry: quickstart+userguide per rodzina) + `DS3608_DS3678_dane_techniczne_serwisowe.md`. Helper `_rag-extract.mjs` już usunięty.
- **Routing**: `lib/polish-manuals.ts` → `resolvePolishKey()` w `getPolishManual`/`hasPolishManual`: alias map (ds8288→ds8208, ds9908r→ds9908, ls1203hd→ls1203) + odcięcie sufiksu optyki (sr|hp|hd|xr|er|dpa|dpx|dpe|dp|kd|xd).
- **Zrobione: 18/18 rodzin** = DS3608, DS3678, DS2208, DS2278, DS4608, DS4678, DS8108, DS8178, DS8208(+DS8288), DS9308, DS9908(+DS9908R), LI2208, LI4278, LS2208, LS1203(+LS1203HD), CS6080, CS4070, CS3000.
- **Weryfikacja**: tsc EXIT=0; **39/39 SKU skanerów z bazy `manuals` → strona PL 200**. Każda rodzina osobny commit.
- **Efekt uboczny**: baner lejka (poprzedni wpis) pojawia się teraz także na instrukcjach skanerów (mapowanie prefiksu DS/LI/LS/CS → kategoria `skanery-kodow-kreskowych-zebra` było już gotowe).

---

## 2026-06-15 — Lejek (TOFU→MOFU/BOFU): mosty z instrukcji do części + cross-domain do takma

- **Strategia**: blog/instrukcje/sterowniki = najmocniejszy ruch (TOFU). serwis-zebry rankuje na „Zebra TC22" (poz. 5), takma.com.pl (sprzedaż) na 2. stronie → przekierowujemy złapany ruch do konwersji. Dwa wyważone banery pod instrukcją.
- **`components/FunnelBanners.tsx`** (nowy): per-model config `MODELS`. Baner 1 (główny, biała karta): „Twój {model} wymaga części lub naprawy?" → części (serwis-zebry /sklep) + formularz serwisowy. Baner 2 (drugorzędny, slate-50, jeden link): zakup nowego na takma — deep-link `takma.com.pl/produkt/{slug}?utm_source=serwis-zebry&utm_medium=instrukcja&utm_campaign={model}`, **dofollow** (`rel="noopener"`, ten sam właściciel → przekazuje moc). EOL → linkuj do następcy.
- **Wpięte** w `app/instrukcje/[model]/instrukcja-po-polsku/page.tsx` po treści. Gated configiem — **start: TC22** (`zebra-tc22`, inProduction, części→/sklep/akumulatory/terminale). Inne modele bez banerów do czasu dodania do MODELS.
- **Stan**: tsc czysto, build EXIT=0. TC22 renderuje banery (link części→200, takma z UTM), ZD421 nie. Do commitu+pusha. **TODO**: rozszerzać `MODELS` o kolejne popularne modele (ZT411, ZD421, TC52…) + EOL z następcami; rozważyć ten sam most na `[model]/page.tsx` i blogu.

---

## 2026-06-14 — SEO: kontent kategorii Konwertery DPI + karty produktów (pętla, audyt 214/214)

- **Research (Ahrefs+GSC, projekt serwis-zebry 9640672)**: „konwerter dpi" (vol 150, KD 0) = PUŁAPKA intencji (darmowe online konwertery DPI zdjęć — related: online/za darmo/zdjęć). Realna intencja z GSC = **model+DPI**: „zt410 300 dpi", „zebra zt411 dpi settings" (poz. 3.6), „zebra 600 dpi". Target konwerterów = „zmiana rozdzielczości drukarki Zebra", „konwersja 203 na 300 DPI", model-specific — NIE generyczne „konwerter dpi".
- **Kontent kategorii** `/sklep/konwertery` (blok w `[...slug]/page.tsx`, slugPath===1): intro + „203 czy 300 DPI" + tabela PN (z bazy: Urządzenie/Kierunek/PN/Cena/Dostępność) + lista modeli + 5×FAQ + FAQPage schema + CollectionPage (collectionPagesMap + warunek). Zmienne `konwerterMin/MaxPrice`. Metadata branch skrócony do 140–160 zn.
- **Karty produktów**: `PRODUCT_TYPE_FAQ['konwerter']` (4 Q&A na stronach produktów) + przepisane 13 opisów (description/description_long/meta) z frazami zmiana rozdzielczości/kierunek/kalibracja (live w PROD DB).
- **Audyt**: `/sklep/konwertery` dodane do `seo-audit-category.ts` (mainPhrase „konwertery dpi do drukarek zebra", frazy zmiana rozdzielczości/konwersja 203 na 300/zestaw konwersji dpi/203 dpi/300 dpi/zt411, requireClaimInMeta). **Wynik: 21/21, łącznie 214/214 PASS — 100%**, bez regresji.
- **Stan**: tsc czysto, build EXIT=0. Wypchnięte.
- **Domknięcie (drugi increment)**: `/sklep/konwertery/drukarki-przemyslowe` (slugPath===2) — dedykowany branch metadanych (title/meta/OG+image) + blok kontentu (intro + tabela PN zawężona do ZT + lista „kiedy zmienić DPI" + 3×FAQ + FAQPage). Tabela używa prefiltrowanego `products` (tylko ZT, ZE pod /print-engine). Dodane do audytu. **Wynik: 21/21, łącznie 235/235 PASS — 100%**.

---

## 2026-06-14 — Sklep: KONWERTERY jako osobna kategoria + zdjęcia

- **Zdjęcie konwertera**: `konwerter.jpg` → `public/sklep_photo/`, ustawione jako `image_url` dla wszystkich 13 konwerterów. **Alt per-konwerter** automatyczny — front renderuje alt z `product.name` (brak kolumny `image_alt`; nazwy są unikalne), linie 1044/235/243.
- **Nowe głowice (14: 13 + swap)**: `image_url` ustawione na obraz generyczny `glowica-203dpi-...-zd421t.png` (fallback per-model generował ścieżki bez pliku dla ZE/multi-model/300-600dpi → puste). Teraz spójne z istniejącymi.
- **Osobna kategoria `/sklep/konwertery`**: `product_type` konwerterów zmieniony glowica→**konwerter** (13). Nowy blok w `lib/shop-categories.ts` (id:'konwerter', slug:'konwertery', drzewko: przemysłowe ZT + print engine ZE). `[...slug]/page.tsx`: HERO_IMAGES['konwerter'] (reużyte hero głowic), branch metadanych `/sklep/konwertery` (od minPrice), typeLabel. Render przez ShopCategoryClient (grid). heroImage warunkowy = brak crasha.
- **Stan**: tsc czysto, build EXIT=0. /sklep/konwertery→200 (treść), konwertery zniknęły z /sklep/glowice, /sklep listuje „Konwertery". **DB już na PROD** → kod MUSI być wypchnięty (inaczej konwertery osierocone na prodzie). Hero konwerterów = na razie reużyte z głowic (TODO: dedykowane jeśli trzeba).

---

## 2026-06-14 — Sklep: brakujące głowice przemysłowe + konwertery DPI (z print-head-guide)

- **Źródło**: `print-head-guide-accessories-en-us.pdf` (katalog Zebra, 2 tabele: aktualne + EOL). Porównane z bazą (było 41 głowic, 0 konwerterów).
- **Live-check dystrybucji** przez `/api/admin/parts-catalog/check-stock` (Ingram/BlueStar/Jarltech): wszystkie 27 PN istnieją w dystrybucji (18 od ręki, 9 na zamówienie).
- **`scripts/seed-glowice-konwertery.mjs`** (NOWY, lokalny): pobiera live ceny/stany, purchase=Ingram (źródło crona) lub najtańszy BS/Jarltech (+stock_source), price=×1,10. Wgrał **13 głowic + 13 konwerterów** (product_type='glowica', konwertery resolution_dpi=null, nazwa „Zestaw konwersji DPI"). Głowice dodane: ZE511/ZE521 (203/300/600+rotated), 140Xi4/170Xi4 300, 105SLPlus, 110Xi4, ZE500-4. Konwertery: ZT111/211/231, ZT411/421 (5 kierunków), ZE511/ZE521, ZT210/220/230.
- **SWAP**: ZT111 203 `P1123335-012` (0 szt, przestarzały PN) → `P1123335-056` (105 szt) — PATCH istniejącego wiersza, **slug zachowany** (`glowica-203-dpi-zebra-zt111`), nazwa→ZT111/211/231.
- **Stan**: 67 aktywnych głowic, /sklep/glowice→200. Wszystko w PROD DB (live). Na zamówienie (stock 0, pokażą „Niedostępny", cron podbije): głowice P1112750-011, P1053360-018/-019; konwertery P1123335-054, P1112750-014/-015/-017/-018, P1037974-006.
- **TODO/uwaga**: konwertery siedzą w kategorii głowic — do rozważenia osobna pod-kategoria „Konwertery DPI" (drzewko+hero) jeśli ma być wyróżniona. Seed script niezacommitowany (czeka na decyzję).

---

## 2026-06-14 — ChatAI: KROK 6 — HEARTBEAT (cotygodniowy automat na mail)

- **Cel**: zautomatyzować część WYKRYWANIA pętli (decyzje/naprawy zostają ręczne). Cron raz w tygodniu → mail.
- **`lib/chat-exam.ts`**: współdzielona logika egzaminu — importuje `scripts/chat-exam-questions.json` (jedno źródło pytań), `runExam()` z guardem + pulą współbieżności 4 (mieści się w limicie cron). Eksport `loadManualNames`.
- **`app/api/cron/chat-heartbeat/route.ts`** (`maxDuration=300`): auth CRON_SECRET (Bearer); okno 7 dni; statystyki (rozmowy, 👍/👎, złe oceny admina, RAG-miss); **luki pokrycia** (modele z `detected_model` bez manuala → lista do dograniania); najgorsze odpowiedzi tygodnia; egzamin RAG + **flaga regresji** (próg 90%); mail HTML przez Resend. `?dry=1` = podgląd JSON bez wysyłki. Jeśli egzamin padnie (timeout) → mail i tak wychodzi ze statystykami (graceful).
- **`vercel.json`**: cron `/api/cron/chat-heartbeat` w `0 7 * * 1` (pon. 7:00).
- **Mail**: `HEARTBEAT_EMAIL` env, fallback `jakub.tiuchty@takma.com.pl` (jak dzienny chat-report).
- **Test lokalny (`?dry=1`)**: 100% egz., 31 rozmów/7d, 22 RAG-miss, 0 luk, regresja=nie. Mail lokalnie 403 (klucz Resend nieautoryzowany dla domeny — na PROD OK, jak chat-report).
- **Uwaga PROD**: `maxDuration=300` wymaga planu Pro (są już crony długie → prawdopodobnie OK). detected_model dopiero od dziś → luki pokrycia zaczną się pojawiać dla NOWYCH rozmów.
- **Stan**: tsc czysto. Do build+commit+push.

---

## 2026-06-14 — ChatAI: KROK 5 — rozszerzony detectPrinterModel + guard → trafność 87% → 100%

- **`app/api/chat/route.ts`**:
  - `detectPrinterModel`: dodane LP2824/TLP2824, GX430(D/T), ZC350, TC58 oraz cała rodzina skanerów DS/LS/LI/CS (warianty dłuższe przed bazowymi = priorytet).
  - `searchManuals` przebudowany na bezpieczny: (1) dokładny filtr `${model}_Manual` @0.4 → (2) ten sam manual @0.3 (odzyskuje borderline z WŁAŚCIWEGO manuala) → (3) global @0.4 z **GUARDEM**: zostaw tylko manuale pasujące do wykrytego modelu; jeśli żaden → found=false (NIE podawaj cudzego manuala). Brak modelu = global jak dawniej.
- **Egzamin v3: 100% (30/30)**, 0 zły_manual, 0 brak_manuala. DS2208/MC3300 reset, GX430T, LP2824 — naprawione. 4× serwis poprawnie poza zakresem.
- `scripts/chat-exam.mjs` zsynchronizowany z produkcją (lista modeli + guard), results.md = baseline 100%.
- Postęp całości: 70% → 87% (dograne manuale) → 100% (wykrywanie + guard).
- **Stan**: tsc czysto, build EXIT=0. Do commitu+pusha. Guard chroni też na przyszłość przed „instrukcją złego urządzenia".

---

## 2026-06-14 — ChatAI: dograne 7 brakujących manuali → trafność 70% → 87%

- **Pliki od usera** (Desktop/serwiszebra): GK420d, GK420t, GX420T+GX430T, lp2824, tc52(en), tc57(en), zxp3. Wgrane do bucketa Storage `manuals` + zaindeksowane.
- **UWAGA**: oryginalny `scripts/ingest-manuals.mjs` (bucket→DB) przy ponownym uruchomieniu re-procesuje pliki uznane za „częściowe" (ryzyko re-embed 38k/duplikaty) — NIE używać do dokładania pojedynczych. Zamiast tego nowy `scripts/ingest-new-manuals.mjs` = celowany, delete-by-manual_name + insert, dokładne strony (result.pages), pdf-parse v2 API (`new PDFParse({data}).getText()`). Bezpieczny, nie dotyka 144 istniejących.
- **Nazwy**: GK420D_Manual, GK420T_Manual, GX420T_Manual, GX430T_Manual, LP2824_Manual, TC52_Manual, TC57_Manual, ZXP3_Manual (171–373 chunków każdy). Poszły do PROD DB → chat już z nich korzysta bez deployu.
- **Egzamin v2: 87% (26/30)**, BRAK MANUALA 7→0. Zostały 4 „zły manual" = mylenie bliźniaków przez braki w `detectPrinterModel`: LP2824 (lista ma lp2844), GX430T (brak), DS2208/skanery (brak DS/LS/LI), MC3300 (jest, ale filtr 0.4 pusty→fallback).
- **Następne**: KROK 5 = rozszerzyć `detectPrinterModel` (LP2824, GX430T, DS/LS/LI/CS…) → naprawi 3/4; guard „nie podawaj cudzego manuala gdy fallback zwraca inny model" → naprawi MC3300 + bezpieczeństwo.

---

## 2026-06-14 — ChatAI samodoskonalenie: KROK 4 — egzamin RAG (golden set) + KLUCZOWE wnioski

- **Co**: `scripts/chat-exam.mjs` + `scripts/chat-exam-questions.json` (34 pytania) + `scripts/chat-exam-results.md`. Replikuje ścieżkę RAG chatu (detectPrinterModel→tłumaczenie→embedding→match_documents próg 0.4 z filtrem+fallback), dodatkowo próg 0.2. Klasyfikuje: ok / luka_wyszukiwania / temat_nieznaleziony / zly_manual / brak_manuala / serwis.
- **WAŻNE odkrycie**: `manuals_documents` ma **38 971 chunków / 111 manuali** (wcześniejsze „2" to limit 1000 wierszy Supabase przy select). Pełna lista w results.md.
- **WYNIK: 70% trafności** (21/30 pytań instrukcyjnych). **0 luk wyszukiwania** → dla modeli które MAMY, RAG i chunking działają dobrze (moja hipoteza o naiwnym chunkingu = NIEtrafiona).
- **Prawdziwe problemy**:
  1. **BRAK MANUALA (7)**: GK420d/t, GX430t, TC52, TC57, LP2824, ZXP3 — częste modele, nie mamy PDF. ZŁA RZECZ: przy braku własnego manuala RAG zwraca CUDZY (GK420d→ZD411 61%, TC52→TC701 51%, LP2824→ZT230 60%) → chat może doradzać z instrukcji złego urządzenia.
  2. **ZŁY MANUAL (2)**: DS2208→LS2208 (bo skanery DS/LS/LI NIE są w detectPrinterModel → brak filtra→sibling wygrywa), MC3300 factory reset→MC9200 (filtr 0.4 pusty→fallback).
- **Nowy roadmap** (po egzaminie): (a) dograć 7 brakujących manuali, (b) dodać skanery DS/LS/LI/CS do detectPrinterModel, (c) guard: gdy fallback zwraca manual ≠ wykryty model → nie podawaj jako pewnego źródła.
- **Stan**: skrypty + raport (nie dotykają builda). Do commitu. Baseline trafności = 70%.

---

## 2026-06-14 — ChatAI samodoskonalenie: KROK 3 — widok „Złe odpowiedzi" + auto-diagnoza

- **Cel**: jedno miejsce na cotygodniowy przegląd wpadek; każda z automatyczną diagnozą wg 3 powodów + czarną skrzynką.
- **Endpoint** `app/api/chat-logs/problems/route.ts`: logi z ostatnich N dni gdzie 👎 użytkownika LUB ocena admina ≤2 LUB brak RAG (pomija `pre-filter-rejected`). Auto-diagnoza: `brak_wiedzy` (RAG pusty), `slabe_dopasowanie` (top sim <0.5), `zla_odpowiedz` (dobry kontekst, zła odpowiedź). Sort: siła sygnału (👎>admin>RAG-miss) → najsłabsze dopasowanie. Param `signal`=all|rated|norag, `days`=1..90. Zwraca też summary (liczniki per powód).
- **Strona** `app/admin/zle-odpowiedzi/page.tsx`: karty podsumowania (łapki w dół + 3 powody), zakładki czasu (7/30/90) i sygnału (Wszystkie/Ocenione źle/Brak instrukcji), lista z modelem, sygnałem, diagnozą, „💡 co naprawić", rozmową i czarną skrzynką (manual·sim%). `/admin/*` ma middleware (307 do logowania) — spójne z resztą.
- **Uwaga**: historyczne logi sprzed czarnej skrzynki nie mają `rag_sources` → lądują jako `brak_wiedzy`. Dla NOWYCH odpowiedzi 3 powody się rozróżnią. Zakładka `rated`=0 teraz (👎 dopiero zaczęły płynąć), `norag`=100 (braki widać od razu).
- **Stan**: tsc czysto, build EXIT=0, route'y zarejestrowane. BEZ migracji SQL. Do commitu+pusha.
- **Następne**: KROK 4 = egzamin dla chata (golden set realnych Q&A z 👎) + sędzia → potem tuning retrievalu (naiwny chunking 1000/200 = największa słabość) i dograć brakujące manuale z zakładki „Brak instrukcji".

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
