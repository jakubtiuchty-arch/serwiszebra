# PROGRESS — serwis-zebry.pl

Checkpoint postępu prac. Najnowszy wpis na górze. Po każdym etapie/buildzie dopisz: co zrobione, pliki, commit, TODO.

---

## 2026-07-23 — Moduł WYPOŻYCZENIA (koniec papierowych kartek serwisantów)

- **Zakładka /admin/wypozyczenia** (sidebar → Serwis): lista (nr WYP-YYYYMMDDHHmm, klient+kontakt, sprzęt, S/N, termin zwrotu +14 dni, status, podpisany protokół), filtry/szukajka, modal dodawania (S/N z „nieczytelny"), modal potwierdzenia zwrotu/usunięcia (bez systemowego confirm), przycisk „Zwrócono".
- **Protokół wypożyczenia**: auto-otwiera się po dodaniu (`/api/admin/rentals/[id]/print`), logo TAKMA, warunki+podpisy+stopka przyklejone do dołu A4 (`position:fixed` w @media print), `@page margin:0` usuwa nagłówki przeglądarki. Podpisany skan → spinacz → prywatny bucket `rental-docs` (podgląd przez signed URL).
- **Automaty (cron rentals-check, 6:00 UTC)**: po 14 dniach mail „odbierz sprzęt" na serwis@takma.com.pl + ładny mail do klienta o zwrot; bez odznaczenia „Zwrócono" — przypomnienie na serwis@ po 7 dniach od wezwania i dalej co 7 dni. Statusy: active → return_requested → returned.
- **WAŻNE — RLS pułapka**: `createServiceClient()` (lib/supabase/server) z cookies wysyła token ZALOGOWANEGO usera, nie service role → „new row violates RLS". Dodany `createPureServiceClient()` (bez cookies, bez generyka Database — typy sprzed tabeli rentals). 
- **Lokalny klucz Resend NIE wysyła z serwis-zebry.pl** (403 not authorized) — maile testować na produkcji; kod zweryfikowany (cron 1 returnRequest, 0 errors).
- Tabela: `supabase-rentals.sql` (uruchomione w Supabase 23.07). Sidebar zagęszczony (bez scrolla).
- TODO: test maili na prodzie (backdate rekord + cron z CRON_SECRET), potem usunąć rekord testowy.

## 2026-07-22 (po południu) — Dostawa na wydruku/proformie + wymagany S/N z opcją „nieczytelny"

- **Fix rozbieżności kwot (ZAM-20260722083114: lista 215,70 vs wydruk 190,70)**: dostawa (25 zł brutto) siedzi w `total_netto/total_brutto`, ale nie jest pozycją w `items` — wydruk zamówienia i **proforma sklepu** liczyły sumy z samych pozycji. Teraz sumy z bazy + wiersz „Dostawa (kurier)" wyliczany jako różnica (`print/route.ts`, `shop/orders/[id]/proforma/route.ts`). Odbiór osobisty (różnica 0) = bez zmian.
- **S/N wymagany w obu formularzach zgłoszenia** (serwis-zebry `components/RepairForm.tsx` + takma `RepairForm.tsx`, commit w repo takma): pole obowiązkowe + checkbox „nieczytelny lub zatarty" → zapisuje `NIECZYTELNY` (zamiast „Brak" w adminie). Walidacja też w API obu repo (zod min(1)). Powód: zgłoszenie #202607221020 bez S/N przez formularz takmy (pole było opcjonalne).
- TODO: —

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

## 2026-07-31 — Moduł POCZTA (Faza 1) — zbudowany, czeka na SQL + env
- Skrzynka serwis@takma.com.pl (cyber_folks, mail.takma.com.pl) w panelu admina: `/admin/poczta`.
- IMAP pull co 5 min (cron `/api/cron/mail-sync`, baseline bez importu historii), wątkowanie po Message-ID/References + fallback email+temat, heurystyka spamu/automatów.
- Szkice AI (gpt-5.5) z kontekstem napraw i zamówień klienta (lookup po email); człowiek zatwierdza — wysyłka SMTP z serwis@takma.com.pl + kopia do Wysłanych (IMAP APPEND).
- Nowe pliki: `supabase-poczta.sql`, `lib/mail/{imap,smtp,draft}.ts`, `app/api/cron/mail-sync/`, `app/api/admin/poczta/**`, `app/admin/poczta/page.tsx`; deps: imapflow, mailparser, nodemailer.
- Dostęp: admin + superadmin (`REGULAR_ADMIN_ALLOWED_SECTIONS` + nav „Poczta").
- TODO użytkownika: (1) uruchomić `supabase-poczta.sql` w Supabase SQL Editor, (2) dodać env `MAIL_PASSWORD` w Vercel (nie widzę go w serwiszebra_prod!) i `.env.local`, (3) commit+push po potwierdzeniu.
- tsc czysty; dev na :3002.

## 2026-07-31 — Moduł POCZTA: podpis + powiadomienia (LIVE)
- Moduł działa na prodzie (test przeszedł: mail → wątek → szkic AI → panel).
- Podpis firmowy 1:1 (K. Wójcik, Dział Techniczny, logo TAKMA inline CID) doklejany przy wysyłce — commit `232ef8b`.
- Powiadomienia: badge licznika w nav admina + mail Resend do jakub.tiuchty@/wojcik@/zuchnicki@takma.com.pl — commit `12f1d20`.
- Env: MAIL_IMAP_PASSWORD w serwiszebra_prod (Preview+Production). Zbędna kopia w starym projekcie `serwiszebra` do usunięcia.

## 2026-07-31 — Poczta: awaria duplikatów NAPRAWIONA (root cause: Next Data Cache)
- Objaw: dziesiątki pustych wątków-duplikatów (nowy co przebieg crona, 5 min).
- Root cause: Vercel/Next Data Cache cache'ował GET-y REST-a Supabase po URL-u — cron czytał zamrożone last_uid=7748 (baza: 7752) i re-fetchował stare maile, a dedupe po Message-ID dostawał zakeszowaną pustą odpowiedź → insert padał na 23505, pusty wątek zostawał.
- Fix: `lib/mail/supabase.ts` — getMailSupabase() z fetch `cache:'no-store'` we wszystkich route'ach poczty (commit `8d6f2a6`) + hardening: błąd dedupe = pomiń, samonaprawa pustych wątków (commit `9dbd2a2`).
- Sprzątnięte 91 pustych wątków; po fixie 2× trigger = fetched:0, baza stabilna (4 wątki / 6 wiadomości).
- UWAGA na przyszłość: ten sam hazard może dotyczyć INNYCH cronów czytających Supabase na Vercelu (stałe URL-e zapytań!).

## 2026-08-04 — Reset hasła NAPRAWIONY (własny flow token_hash)
- Zgłoszenie: klient #202607031226 (S. Czerw, MC330L, status wycena) nie mógł się zalogować; `recovery_sent_at` 23.07 dowodzi, że próbował resetu i utknął.
- Root cause: `resetPasswordForEmail` + PKCE (`@supabase/ssr`) — link z maila działa TYLKO w przeglądarce, w której proszono o reset (code_verifier w cookies); dodatkowo jednorazowy token potrafi zużyć firmowy skaner linków (klient ma pocztę firmową pw-hmp.pl). `/nowe-haslo` nie pokazywała błędu do momentu submitu.
- Fix: własny flow — `/api/auth/reset-password` (generateLink recovery server-side, mail przez Resend serwis@serwis-zebry.pl, zawsze success=true — bez enumeracji kont) → link `/nowe-haslo?token_hash=...` → token zużywany dopiero przy zapisie hasła (`verifyOtp` na submit): działa na dowolnym urządzeniu, odporny na skanery. `/nowe-haslo` bez tokenu i sesji od razu pokazuje „Link nieprawidłowy" + CTA nowego linku. Nowa funkcja `sendPasswordResetEmail` w lib/email.ts.
- Test e2e na koncie jednorazowym: generateLink → verifyOtp czystym klientem anon → updateUser → login nowym hasłem OK → reuse tokenu odrzucony. tsc EXIT=0, build EXIT=0, dev na :3002.
- TODO: commit+push po potwierdzeniu; po deployu poprosić klienta o ponowny reset (albo zadzwonić: 600 469 724).

## 2026-08-06 — Wypożyczenia: przypomnienie o podpisanym protokole (do sprawdzenia)
- Problem: klienci nie odsyłają podpisanego protokołu wypożyczenia (spinacz w /admin/wypozyczenia pusty).
- Fix: cron `rentals-check` (codziennie 6:00) krok 0 — wypożyczenia `active`/`return_requested` z `signed_document_path IS NULL` i wiekiem >= 3 dni dostają JEDNORAZOWY mail przypomnienia (`protocol_reminder_sent_at` blokuje powtórki).
- Mail `sendRentalProtocolReminderEmail`: czerwony pasek alertu „WYMAGANE DZIAŁANIE / PROSZĘ O PRZESŁANIE PODPISANEGO PROTOKOŁU WYPOŻYCZENIA", czerwona ramka, instrukcja 3 kroków (podpisz→zdjęcie→odpowiedz na maila); `replyTo: serwis@takma.com.pl` → odpowiedź klienta z załącznikiem ląduje w module Poczta (/admin/poczta).
- Podgląd wysłany na jakub.tiuchty@gmail.com (dane przykładowe WYP-2026-0042; prod key Resend z Vercela, lokalny nie ma domeny serwis-zebry.pl).
- SQL do uruchomienia przez usera: `alter table rentals add column if not exists protocol_reminder_sent_at timestamptz;` (dopisane w supabase-rentals.sql).
- tsc EXIT=0, build EXIT=0, dev na :3002. NIEZACOMMITOWANE — czeka na akceptację designu maila.

## 2026-08-06 — Protokoły wypożyczeń: zaakceptowane + pierwsza wysyłka
- Design maila zaakceptowany (header samo logo TAKMA, nadawca „TAKMA", bcc: jakub.tiuchty@takma.com.pl + serwis@takma.com.pl). Commit `c085f6f` (razem z naprawą resetu hasła), push na main.
- Wysłane ręcznie (prod key Resend): WYP-202607290824 (Boyarski, TC501G) i WYP-202607281409 (Stachurski, TC27).
- CZEKA NA USERA: SQL w Supabase (ALTER + backfill dwóch wysłanych — bez tego cron 6:00 wyśle im duplikaty). Ciesielski (WYP-202607290903) celowo pominięty — po dodaniu kolumny cron wyśle mu automatycznie następnego dnia o 6:00.

## 2026-08-06 — Protokoły wypożyczeń: LIVE
- User uruchomił SQL (kolumna + backfill zweryfikowane przez REST: Boyarski i Stachurski oznaczeni 11:22). Fix nadawcy „TAKMA", Reply-To serwis@takma.com.pl (odpowiedzi → moduł Poczta), „urządzenie" zamiast „urządzenie zastępcze" (commit `7734807`).
- Cron aktywny: jutro 6:00 przypomnienie dostanie Ciesielski (WYP-202607290903); Ceranowski po 3 dniach od wypożyczenia.

## 2026-08-07 — Banner Printhead Protection Program na kartach głowic
- Nowy `components/shop/PrintheadProgramBanner.tsx` (ciemny box, akcent Zebra #A8F000, rozwijane „Na jakich warunkach" przez `<details>` — bez 'use client'). Pokazuje realną cenę brutto tej głowicy jako kontrast dla „za kolejną możesz nie płacić".
- Podpięty w `app/sklep/[...slug]/page.tsx` tylko dla `product_type === 'glowica'`, między boksem z ceną a Specyfikacją. CTA → `takma.com.pl/promocje/zebra-glowice-bez-kosztow`.
- Zweryfikowane na :3002 — renderuje się raz w DOM (drugie trafienie w HTML to payload RSC), na kartach wałków się nie pojawia. tsc EXIT=0.
- NIEZACOMMITOWANE — czeka na ocenę wizualną usera.
- Kontekst z bulletinu resellerskiego (Zebra Confidential): program trwa 1.01–31.12.2026, wymaga numeru seryjnego drukarki i utylizacji starych głowic, Zebra ma prawo audytu (kara 2000 USD/voucher). Poufne dane NIE trafiają na strony.

## 2026-08-08 — Ikony topbara wygenerowane w Higgsfield + porządki na karcie produktu
- 4 ikony 3D (gpt_image_2, jednolity styl navy+stal): `public/icons/icon-{doswiadczenie,naprawy,szybkosc,gwarancja}.png` — 96×96 PNG z alfą (tło zdjęte floodfillem z 4 rogów, `-trim`), wyświetlane w 16 px (było 12 px lucide w 3 różnych kolorach = slop).
- Podmienione w DWÓCH miejscach: `components/Header.tsx` (podstrony: medal/klucz+check/stoper) i `app/page.tsx` (strona główna ma własną kopię topbara: medal/klucz+check/tarcza). Usunięte martwe importy lucide (Calendar, ThumbsUp, Zap, Shield).
- Box „W skrócie" (AEO/Speakable): zdjęty `border-l-4 border-blue-500 bg-blue-50` → biała karta `border-gray-200 rounded-xl`; PRZENIESIONY z góry strony (był przed H1!) pod Specyfikację, przed Opis. Klasa `.quick-answer` zachowana — wskazuje na nią schema Speakable.
- Z banera głowic usunięta nota „Program prowadzi TAKMA — właściciel tego serwisu".
- tsc EXIT=0, zweryfikowane na :3002. NIEZACOMMITOWANE.
- ZOSTAJE: 7 innych boksów z `border-l-4` (3 strony serwisowe, /sterowniki, /sklep, blockquote bloga, PolishManualContent) — czeka na decyzję usera.

## 2026-08-09 — Ikony topbara: przejście na SVG (poprawka)
- Wersja rastrowa 3D była nieczytelna w małym rozmiarze (ciemne plamy). Nowa seria w Higgsfield: płaskie jednobarwne glify → wektoryzacja `potrace` (brew install potrace, librsvg do podglądu) → `components/TrustIcons.tsx` z inline SVG i `fill="currentColor"`.
- Zalety: ostre w każdej skali, jeden kolor `#1e3a5f` zamiast 3 różnych, zero requestów HTTP (~8 KB w bundlu), rozmiar 14 px (`w-3.5`).
- Stare PNG-i i katalog `public/icons/` usunięte jako martwe.
- Podmienione w `components/Header.tsx` (3 ikony) i `app/page.tsx` (3, w tym tarcza). tsc EXIT=0, zweryfikowane renderem w docelowych 14 px.

## 2026-08-09 — Pasek zaufania: rezygnacja z ikon na rzecz typografii
- Decyzja usera po dwóch nieudanych podejściach graficznych (3D raster → SVG z potrace): w pasku 24 px z tekstem 12 px KAŻDA ikona jest plamką. Rozwiązanie: zero grafiki.
- Nowy układ: blok wyśrodkowany (`justify-center`, było `justify-between` z `absolute left-1/2` na środkowym), kropki `·` w gray-300 jako separatory, kluczowe frazy `font-semibold text-[#1e3a5f]` („25 lat", „Tysiące", „Maksymalnie skrócony" / „gwarancyjny i pogwarancyjny"), reszta gray-600.
- Treść trzech punktów bez zmian. Zmienione w `components/Header.tsx` i `app/page.tsx`.
- Usunięte jako martwe: `components/TrustIcons.tsx`, `public/icons/`, importy lucide. tsc EXIT=0.

## 2026-08-10 — GMC: naprawa 404 (49 produktów) + włączenie konwersji w Ads
- **404 / feed GMC**: 7 odrzuconych ofert (głowice ZE511/ZE521/ZE500-4) to był bug routingu, nie danych. Dwie przyczyny:
  1. `lib/shop-categories.ts` — brak kategorii `print-engine` w sekcji głowic. Dodana NA KOŃCU (kolejność decyduje o dopasowaniu: „140Xi4 / ZE500-6" ma dalej trafiać do 140Xi4).
  2. `middleware.ts` — ma WŁASNĄ, skróconą mapę `MODEL_TO_CATEGORY` (26 modeli); dla nieznanych zwracał null → 404. Dodany fallback do `getProductUrl()` (mapa skrócona ma pierwszeństwo, żeby nie ruszyć zaindeksowanych URL-i) + usunięty przedwczesny `return null` blokujący typy `zasilacz`/`konwerter`.
- Efekt: feed = 88 ofert, **0 linków fallbackowych**; **49/49** wcześniej martwych URL-i → 200. Regresji brak (ZT410 nadal na starej ścieżce `…/zt411/…`).
- **Konwersje w Ads**: akcje importu GA4 dla serwis-zebry JUŻ istniały (8 szt.), ale wszystkie **HIDDEN** = nic nie zbierały. Włączone 4: purchase, repair_form_submit, phone_click, email_click. Świadomie jako WTÓRNE (`includeInConversionsMetric=false`) — inaczej zaburzyłyby kolumnę „Konwersje" w kampaniach takma.com.pl.
- Kampania Shopping `24115745022` nadal WSTRZYMANA — czeka na decyzję o starcie.
- NIEZACOMMITOWANE (user prosił, by nie pushować).

## 2026-08-13 — Poczta: auto-archiwizacja o 17:00
- Nowy cron `/api/cron/mail-archive`: o 17:00 czasu polskiego wątki `new`/`drafted` → `archived`; rano zakładka Odebrane czysta. Harmonogram Vercel `0 15,16 * * *` (UTC) + guard godziny Europe/Warsaw w kodzie (DST-proof); `?force=1` do ręcznego testu.
- Bezpieczne: mail-sync przywraca zarchiwizowany wątek do skrzynki przy nowym mailu klienta (status wraca na `new`, potwierdzone w kodzie linia ~247).
- Guard przetestowany lokalnie (skipped poza 17:00). Build EXIT=0, dev :3002. Czeka na commit+push.

## 2026-08-17 — ChatAI: analiza tygodnia + naprawa pre-filtra i RAG
- **Analiza logów 10–17.08** (37 par pytanie/odpowiedź, 13 sesji, 11 IP): CTA „Wyślij do serwisu" pokazało się **3×** (23% sesji, zawsze przez `[SERIOUS_ISSUE]`), RAG sięgnął do instrukcji **7/37 = 19%** (33 fragmenty: ZD421 20, ZT411 5, ZC300 5, MC3300 3). Śr. odpowiedź 8,7 s. Zero ocen 👍/👎. Dominujący temat: czujnik nośnika / kalibracja (4 z 13 sesji).
- **Konwersje**: 2 zgłoszenia w `repair_requests` pochodzą z chatu (ZT411 12.08, ZD421 13.08 — Zamorski, wycena 648,55 zł). Obie **bez wyświetlonego CTA** — klienci sami znaleźli formularz. Wszystkie 3 sesje z CTA dały zero zgłoszeń.
- **FIX 1 — pre-filtr off-topic ucinał rozmowy w połowie.** `isZebraRelated()` patrzył tylko na ostatnią wiadomość i przepuszczał wyłącznie teksty <50 zn. lub ze słowem-kluczem; 10.08 realny klient dostał „jestem asystentem wyłącznie od Zebra" w 1 ms na „robiłem to i nie przesuwało w ogóle". Teraz filtr **tematyczny** działa tylko na PIERWSZĄ wiadomość klienta (`userTurns <= 1`); anty-manipulacja (`isManipulationAttempt`, wydzielona funkcja) leci przy każdej.
- Przy okazji zawężone wzorce, które kasowały normalne rozmowy serwisowe: `prawo` (→ „przesuń w prawo") na prawnik/kancelari/prawo pracy, `losow` (→ „losowo się zawiesza") na losowanie/wylosuj, `przepis` (→ „przepisałem ustawienia") na „przepis na", usunięte `kuchni` (gastronomia to klient).
- **FIX 2 — RAG był ślepy na kontekst rozmowy.** `searchManuals(lastUserMessage)` dostawał samo „Nadal" / „nie" → 0 trafień; wszystkie 7 trafień tygodnia to dokładnie te wiadomości, w których nazwa modelu padła w bieżącej frazie. Dodane: `buildRagQuery()` (kotwica = pierwsza wiadomość z opisem problemu + ostatnie wypowiedzi ≥15 zn. + bieżąca, max 600 zn.) i `detectModelsInConversation()` (model zapamiętany z całej rozmowy, wygrywa najświeższa wzmianka) przekazywany do `searchManuals(query, modelsHint)`. `saveChatLog.detected_model` zapisuje teraz model z rozmowy, nie z jednej frazy. `translateToEnglish` max_tokens 200→400.
- **Test na żywym :3002, 6 przypadków — wszystkie OK**: 2× follow-up bez słowa-klucza przepuszczony (i od razu RAG: ZD421_Manual sim 0,59; ZT411_Manual 0,56), 2× off-topic/jailbreak nadal odrzucany w ~20 ms, 2× „Nadal"/„dalej nic" z modelem podanym 4 i 8 wiadomości wcześniej → MC3300_Manual (0,57) i ZT411_Manual (0,60). Wiersze testowe skasowane z `chat_logs`.
- **Pomiar na realnym ruchu tygodnia**: kontekst modelu dostępny dla **22% → 43%** wiadomości (8/37 → 16/37).
- ZNANE OGRANICZENIE (nietknięte): `detectPrinterModel` nie zna serii **ZP** (ZP450 — 9-turowa rozmowa 17.08 bez ani jednego fragmentu), gubi zapis z myślnikiem („tc-27") i odwrócony („zebra 411 zt"). To sufit dla FIX 2.
- FIX 4 (gubione wpisy w `chat_logs` — ≥3 sesje zaczynają się w środku rozmowy) — czeka na pomysł usera.
- tsc EXIT=0, build EXIT=0, dev :3002. NIEZACOMMITOWANE.

## 2026-08-17 — ChatAI cd.: rozpoznawanie modeli zsynchronizowane z bazą RAG
- **Lista modeli przepisana pod 120 manuali z `manuals_documents`** (`ZEBRA_MODELS`, 152 wpisy). Doszły całe rodziny, których wykrywanie nie znało mimo instrukcji w bazie: **ET40/45/60/65/80/85, EM45, HC20/25/50/55, L10, FR55, QLN220/230/420, MC3450, MC9200, ZC510, ZC10L, ZD411, ZD611D/R/T, ZQ210/220/310PLUS/320PLUS, ZXP-y, warianty DS3608/DS3678**. Poprawione błędy: `zt200`→`zt220`, `zd610`→`zd611`. Dołożone modele bez manuala (dla statystyk i `detected_model`): **seria ZP (450/500/505/550)**, GK888, starsze GX/ZD.
- **Normalizacja zapisu** (`normalizeModelText`): „tc-27", „TC 27", „ZD.421" → sklejane; „zebra 411 zt" → „zt411" (odwrócona kolejność). Obie formy padły w realnym ruchu tygodnia i przechodziły bez wykrycia.
- **Granice dopasowania**: zamiast `includes` regex `(?<![a-z0-9])model(?![0-9])` — „zpl100" nie jest już tabletem L10, a „mc3300" nie jest MC33.
- **Odzyskiwanie modelu z wypowiedzi AI**: gdy klient nie napisał modelu w żadnej swojej wiadomości (odpisał „D" na „ZD421d czy t?", albo jego tura zaginęła w logach), bierzemy model z wiadomości asystenta — ale TYLKO gdy wskazuje jedno urządzenie (`isSingleDevice`), żeby nie złapać wyliczanki z „podaj model, np. TC52 / ZD421 / …".
- **Bug przy okazji**: `needsRAG` sprawdzał regex `/tc\d|zd\d|…/` na SUROWYM tekście — „tc-27" nie pasowało, więc RAG był pomijany („blog wystarczy") na rzecz nietrafionego wpisu o KC401. Teraz `needsRAG = !blogFound || conversationModels.length > 0`.
- **Testy**: 17/17 przypadków jednostkowych na `detectPrinterModel` (wyciągniętym żywcem ze źródła) + 9/9 end-to-end na :3002 — w tym „Zebra tc-27" → `TC27_Manual` 0,56 i „D" → `ZD421_Manual` 0,64 (model z wypowiedzi AI), a wyliczanka modeli w pytaniu AI poprawnie NIE staje się podpowiedzią. Wiersze testowe skasowane z `chat_logs`.
- **Efekt na realnym ruchu 10–17.08**: model rozpoznany dla **22% → 78%** wiadomości (8/37 → 29/37). Z tego realnie z manualem w bazie ~54% — **ZT410 i ZP450 nie mają instrukcji w RAG** (do rozważenia ingestia; ZT410 to częsty model w zgłoszeniach).
- tsc EXIT=0, build EXIT=0, dev :3002. NIEZACOMMITOWANE.

## 2026-08-17 — Prefill formularza z rozmowy AI + lejek CTA (3 etapy)
**Etap 1 — odblokowanie formularza (`components/RepairForm.tsx`, `app/api/repair-request/route.ts`)**
- `isZebraDevice` odrzucał **własne modele Zebry**: ZP450/ZP505, HC20/25/50/55, EM45, FR55 (brak prefiksów `zp`, `hc`, `em`, `fr`, `ws` na liście). Klient z ZP450 — ten sam, który 17.08 przeszedł 9 tur diagnostyki — dostałby „Serwisujemy tylko urządzenia marki Zebra". Prefiksy dodane.
- `company` i `nip` (wymagane) sprawdzane teraz w kroku 1, a nie dopiero przy wysyłce w kroku 5.
- Zgody RODO i regulaminu były walidowane WYŁĄCZNIE w przeglądarce i nigdzie nie zapisywane → lecą w `FormData`, są w zod API i w bazie (`privacy_consent`, `terms_consent`, `consents_at`).
- `repair_number` dostał 2-cyfrowy sufiks (było `YYYYMMDDHHmm` — dwa zgłoszenia z tej samej minuty miały ten sam numer). Kolumna to `varchar(12)`, więc **do czasu migracji kod sam wraca do 12-znakowego numeru** (fallback na błąd `22001`, w obu endpointach).

**Etap 2 — prefill (`buildRepairPrefill` w `app/api/chat/route.ts`, `lib/repair-prefill.ts`)**
- Gdy odpowiedź kończy się skierowaniem do serwisu (`ctaWillShow`, warunek lustrzany do `shouldShowFormButton`), gpt-4o-mini wyciąga z rozmowy: `deviceType`, `deviceModel`, `serialNumber`, `isWarranty`, `urgency` i **opis usterki z listą tego, co już sprawdzono**. Leci w bloku `__CITATIONS__` jako `repairPrefill`.
- Danych kontaktowych i adresu ŚWIADOMIE nie ruszamy — tam wygrywa autouzupełnianie przeglądarki i walidacja (kod `^\d{2}-\d{3}$`, NIP 10 cyfr), a klient w środku awarii pisze „niewidzi", „atykieta pustawyszla".
- `deviceModel` bierzemy z własnej detekcji albo z ekstrakcji, ale tylko gdy przechodzi `detectPrinterModel` — do formularza nie trafi śmieć, który on odrzuci. Opis <20 zn. → brak prefilla (formularz wymaga min. 20).
- Przekazanie: `CustomEvent('serwis:repair-prefill')` przez `lib/repair-prefill.ts` (czat i formularz są na tej samej stronie, ale bez wspólnego kontekstu). Formularz pokazuje baner „Uzupełniliśmy N pól…" i znacznik „z rozmowy" przy każdym podstawionym polu.

**Etap 3 — pomiar (`app/api/chat-logs/cta/route.ts`, `supabase-chat-cta-events.sql`)**
- Lejek `shown → clicked → prefill_applied → form_submitted` w tabeli `chat_cta_events` + widok `chat_cta_funnel`. Do tej pory liczbę wyświetleń CTA trzeba było odtwarzać z logiki komponentu. `form_submitted` niesie `repairId` i listę podstawionych pól. Telemetria nigdy nie blokuje UI — brak tabeli = HTTP 200 `skipped`.

**Testy (zapisane w `scripts/test-chat-prefill-{unit,contract,e2e}.mjs`) — 89/89**
- Jednostkowe 48/48: `isZebraDevice` (21 modeli przyjętych, 6 marek konkurencji odrzuconych), regresja `detectPrinterModel` 17/17, `buildRagQuery`. Kluczowy: **wszystkie 154 modele z listy czatu przechodzą walidację formularza** — prefill nie może zostać odrzucony.
- Kontrakt 16/16 (literały, których tsc nie sprawdza): pola prefilla backend ↔ biblioteka ↔ formularz, znaczniki przy wszystkich polach, zgodność enumów, nazwa zdarzenia w jednym miejscu, zdarzenia CTA ↔ lista endpointu, walidacja kroków.
- E2E 25/25 na żywym :3002: prefill z rozmowy o ZP450 (opis 355 zn., model przechodzi walidację), pytanie o specyfikację BEZ prefilla, 4 zdarzenia CTA + odrzucenie nieznanego, zgłoszenie z ZP450 przyjęte (przed zmianą niemożliwe), zły kod pocztowy i za krótki opis nadal odrzucane. Dane testowe posprzątane (2 zgłoszenia, 2 konta auth, profile, logi).
- E2E wyłapał realny błąd w trakcie: sufiks numeru przepełniał `varchar(12)` → stąd fallback.

**DO URUCHOMIENIA PRZEZ USERA (bez tego działają fallbacki, nic się nie psuje):**
1. `supabase-repair-consents.sql` — kolumny zgód + `repair_number` na `VARCHAR(20)`
2. `supabase-chat-cta-events.sql` — tabela lejka + widok
Po migracji warto puścić `node scripts/test-chat-prefill-e2e.mjs` — testy same wykryją, że fallbacki już nie są potrzebne.

- tsc EXIT=0, build EXIT=0, dev :3002. NIEZACOMMITOWANE.

## 2026-08-17 — Migracje uruchomione, testy po migracji: 92/92
- User wykonał `supabase-repair-consents.sql` i `supabase-chat-cta-events.sql` (RLS włączone przy tworzeniu tabeli — service role je omija, więc zapis telemetrii działa).
- **Bug wyłapany przez e2e po migracji**: zgody wchodziły jako `false` mimo wysłania `'true'` — dodałem je do zod i do bazy, ale NIE do wyciągania z `FormData` w `app/api/repair-request/route.ts` (obiekt `data` budowany polami `formData.get(...)`). Dopisane `privacyConsent`/`termsConsent` → `privacy=true terms=true` potwierdzone w bazie.
- Potwierdzone po migracji: numery zgłoszeń RÓŻNE mimo tej samej minuty (`20260817133764` vs `20260817133792`), format 14 znaków, zdarzenia CTA faktycznie zapisywane (nie `skipped`), `consents_at` ustawiany.
- **Sonda RLS**: odczyt `chat_cta_events` kluczem anon → 0 wierszy, zapis → 401 `42501`. ALE widok `chat_cta_funnel` jest czytelny dla anon (widoki działają z uprawnieniami właściciela, RLS tabeli ich nie ogranicza). DO WYKONANIA: `REVOKE ALL ON chat_cta_funnel FROM anon, authenticated;` — same liczniki dzienne, ale to metryki biznesowe.
- Wyniki: jednostkowe 48/48, kontrakt 16/16, e2e 28/28. tsc EXIT=0, build EXIT=0, dev :3002. NIEZACOMMITOWANE.

## 2026-08-17 — Test przeglądarkowy (Playwright) + jedna komenda na wszystko
- User poprosił, żeby test klikany zastąpić automatem: „ja bym miał tylko wynik". Playwright był już w `node_modules`.
- **`scripts/test-chat-prefill-browser.mjs`** — headless Chrome, pełna droga klienta: 3 tury rozmowy o ZP450 → pojawia się CTA → klik → baner „Uzupełniliśmy 5 pól" → przejście kreatora (walidacja kroku 1 z NIP-em) → sprawdzenie podstawionych wartości NA WŁAŚCIWYCH KROKACH → adres, zgody, wysyłka → weryfikacja wiersza w Supabase i kompletu 4 zdarzeń w `chat_cta_events`. **25/25.**
- Pułapka przy pisaniu testu: formularz to kreator — pola kroków 2 i 3 NIE ISTNIEJĄ w DOM, dopóki się na nie nie przejdzie. Pierwszy przebieg dał 7 fałszywych błędów (puste wartości), choć aplikacja działała poprawnie.
- Potwierdzone w przeglądarce: opis od AI (393 zn.) trafia do bazy bez zmian, `isWarranty='nie'` wyciągnięte z „gwarancja juz minela", numer z sufiksem, zgody `true`, `form_submitted` wiąże `repairId` z sesją czatu.
- **Bezpiecznik**: test odmawia startu poza localhost bez `--i-know-its-production` — na produkcji wysłałby maile do klienta i na jakub.tiuchty@takma.com.pl + handlowy@takma.com.pl. Lokalnie Resend odrzuca wysyłkę (403, klucz deweloperski nie ma domeny serwis-zebry.pl) — potwierdzone w logach.
- **`scripts/test-chat.mjs`** — jedna komenda odpalająca 4 zestawy i drukująca werdykt: **117 sprawdzeń, ~70 s**. `--fast` pomija przeglądarkę (~30 s). Sam sprawdza, czy dev server stoi na :3002.
- Wszystkie zestawy sprzątają po sobie: zgłoszenia, konta auth, profile, logi czatu, zdarzenia CTA.
- DO WYKONANIA (z poprzedniego wpisu, wciąż otwarte): `REVOKE ALL ON chat_cta_funnel FROM anon, authenticated;`
- NIEZACOMMITOWANE.

## 2026-08-17 — Przepisany wpis o dyrektywie EU RED (porównanie z artykułem Zebry)
- Serwisanci zgłosili, że artykuł Zebry (support.zebra.com/pl/article/000033879) jest lepszy od naszego `/blog/zebra-wymaga-hasla-dyrektywa-red-konfiguracja`. Mieli rację — różnica była merytoryczna, nie stylistyczna. Artykuł Zebry to SPA, `WebFetch` dostaje samą skorupę; treść pobrana Playwrightem (`waitUntil: domcontentloaded` + 8 s, `networkidle` się nie doczekuje).
- **Błędy w naszym wpisie**: (1) sprzeczna instrukcja — krok 3 kazał szukać „Security Setup Wizard" w Printer Setup Utilities, krok 6 zakładał gotowy skrypt; kreator jest na `zebra.com/asr`, a dla Windows potrzebny **Zebra Nucleus Connector w wersji EMEA**. (2) lista modeli: brakowało ZD888, ZT111, ZT211, ZT231 i **modułów drukujących ZE511/ZE521**, były nadmiarowe ZT220/ZT230, ZQ bez „Plus", ZQ520 zamiast ZQ521. (3) niepotwierdzone „drukarki bez WiFi/BT nie wymagają konfiguracji" — kryterium to sprzedaż w EMEA po 1.08.2025 + Link-OS 7.4.2+. (4) „zapomniane hasło = reset fabryczny" — nieprawda, jest tryb wycofania z eksploatacji.
- **Czego brakowało, a jest najważniejsze**: kody odpowiedzi drukarki (status 0/100/101), polecenie **~PMa** (decommission, `a` = numer seryjny) lub Toolbox → dwuklik „Tryb chroniony", ostrzeżenie o **portach TCP/IP Raw 9100/9200/9300** i zgodzie na aktualizacje firmware przez EMM/MDM (to najczęstsza przyczyna zgłoszeń „skonfigurowałem i nie drukuje z ERP"), metody alternatywne (dublowanie USB od Link-OS 7.6, ZDesigner, ZDownloader, Toolbox, macOS/Linux).
- Wpis przepisany w miejscu (URL bez zmian): 8669 → 11989 zn., nowa sekcja „Zanim zaczniesz" PRZED krokami, tabela kodów, sekcja „Status 100 albo 101 — co dalej", sekcja flotowa, przepisane FAQ i troubleshooting. Usunięte twierdzenie o 14 znakach hasła (nieweryfikowalne) i o drukarkach bez radia. `readingTime` 10→13, `updatedAt: '2026-08-17'`, poprawione tagi i keywords, excerpt i metaDescription zgodne z nową treścią (metaTitle bez zmian).
- Fakty przepisane własnymi słowami jako wiedza serwisowa — bez powoływania się na dokumenty producenta.
- Weryfikacja renderu na :3002: HTTP 200, 4 tabele, 16 nagłówków H2; obecne `zebra.com/asr`, Nucleus Connector, ZE511/ZE521, 9100, ~PMa, status 100; zero trafień na „Security Setup Wizard", „14 znaków", ZT220, ZQ520, „bez modułów WiFi". tsc EXIT=0.
- NIEZACOMMITOWANE — wpis blogowy czeka na akceptację usera przed pushem.

## 2026-08-17 — Nowy wpis: Zebra Nucleus (materiał do rozmowy z klientem, nie pod SEO)
- **Decyzja świadomie wbrew danym SEO.** Ahrefs: „zebra nucleus" i „zebra nucleus connector" = 0 wyszukań w PL (40 globalnie); słowo „nucleus" w polskim Google to anatomia, implanty Cochlear, Roon i Revit. User: wpis ma być linkiem, który handlowiec podaje klientowi w rozmowie — po polsku, bo nie ma takiego materiału.
- **Korekta wcześniejszej diagnozy**: Nucleus to nie narzędzie do konfiguracji RED, tylko platforma **UEM w chmurze** — jedna konsola do drukarek, skanerów i terminali Android. „Nucleus Connector" to tylko łącznik windowsowy używany przy trybie chronionym. Wpis to rozróżnienie tłumaczy, bo sami się na tym potknęliśmy.
- Nowy wpis `/blog/zebra-nucleus-zarzadzanie-flota-urzadzen` (9257 zn., 15 sekcji, 2 tabele): problem trzech osobnych narzędzi, czym jest platforma, co widać na pulpicie (zarejestrowane/obecność/stan), funkcje, **model freemium** (podstawa za darmo, płatne: zdalna konfiguracja „no touch", aktualizacje, rozszerzona kontrola), kto skorzysta (IT / kierownik operacyjny / pracownik), związek z EU RED i **kolejność wdrożenia** (najpierw zabezpieczenia z przełącznikiem firmware, potem rejestracja), sekcja „kiedy się NIE opłaca", jak zacząć, FAQ, CTA.
- Cross-linking wpięty w obie strony: RED → Nucleus (1 link), Nucleus → RED (2 linki).
- Fakty przepisane własnymi słowami, bez powoływania się na materiały producenta. Bez zmyślonych cen (model licencyjny opisany jakościowo).
- **HERO DO ZROBIENIA**: tymczasowo `coverImage: '/drukarki-zebra-dyrektywa-red.jpeg'` (pożyczony z wpisu o RED). Docelowo własny, w stylu komiksowo-wektorowym jak reszta bloga serwis-zebry.
- Render :3002 sprawdzony Playwrightem: oba wpisy 200, tytuły poprawne, listing bloga 200. tsc EXIT=0.
- NIEZACOMMITOWANE — czeka na akceptację usera (wpisy blogowe nie idą na prod bez zgody).

## 2026-08-17 — Nucleus: poprawki tekstu + własny hero
- Usunięte „Wyjaśniamy po polsku" (excerpt), „Poniżej po polsku:" (lead) i „po polsku" z metaTitle — wypełniacz, który nic nie wnosi czytelnikowi. W treści 0 wystąpień.
- **Hero wygenerowany w Higgsfield, model `gpt_image_2`, 2 warianty 16:9.** Wybrany wariant 1 (wariant 2 odrzucony — zaśmiecony pseudo-tekst na pulpicie). Prompt w stylu bloga serwis-zebry: komiksowo-wektorowy splash, halftone, fiolet/magenta + pomarańczowe chmury + cyjanowe błyskawice, akcenty limonkowe #A8F000 (kolor Zebry), chmurowa konsola w środku, wiązki do drukarki przemysłowej, biurkowej, skanera z czerwoną wiązką i terminala Android. ZERO tekstu w obrazie.
- Upscale `bytedance_image_upscale` do 2K → 3856×2160, przeskalowane do **2752×1541** (jak inne okładki bloga), zapis `public/zebra-nucleus-zarzadzanie-flota.jpeg`, 1,3 MB. Dodany `coverImageAlt`.
- Render sprawdzony Playwrightem: HTTP 200, hero na stronie, tytuł i lead poprawne. tsc EXIT=0. NIEZACOMMITOWANE.

## 2026-08-17 — Hero Nucleus PRZEROBIONY: urządzenia 1:1 z prawdziwych renderów
- **BŁĄD, który popełniłem**: pierwszy hero wygenerowałem z samego opisu tekstowego → model ZMYŚLIŁ urządzenia. Dla autoryzowanego serwisu Zebry to kompromitacja. Zasada zapisana w pamięci: `feedback_never-invent-device-images` — każde urządzenie na grafice MUSI być 1:1 z prawdziwego renderu, tylko technika rysunku jest komiksowo-wektorowa.
- Poprawny workflow (do powtarzania): znajdź prawdziwe rendery → `media_upload` + `media_confirm` do Higgsfield → `generate_image` z `medias[{role:'image'}]` i promptem, który KAŻE zachować sylwetkę, proporcje, panel sterowania i podział kolorów → porównaj wynik z referencją.
- Użyte rendery: `takma/public/images/products/zt411_1_s.png`, `zd421t_1.png`, `zebra-ds3608-xr.png` + `serwiszebra/public/TC501/Zebra TC501_1.jpeg`.
- `gpt_image_2`, 16:9, resolution 2k, quality high, 2 warianty. Wybrany wariant B (lepsze rozstawienie, wszystkie 4 urządzenia czytelne, większa czytelna chmura-pulpit). Zapis 2752×1556, 1,4 MB.
- Weryfikacja: ZT411 ma poprawną bryłę, ekran dotykowy z niebieskim kafelkiem i przyciski PAUSE/FEED/CANCEL; ZD421t żółty zatrzask po lewej i panel górny; DS3608-XR limonkowa górna obudowa z okienkiem skanera; TC501 czarna bryła z zielonymi przyciskami bocznymi i tą samą tapetą. Render :3002 OK.
- NIEZACOMMITOWANE.

## 2026-08-17 — Hero Nucleus v3: dopasowany do poziomu reszty bloga
- User: pierwsza wersja z referencjami była wierna, ale „bardzo słaba" — statyczny diagram zamiast okładki. Po obejrzeniu listingu bloga widać wzorzec, którego wcześniej nie odtworzyłem.
- **Cechy stylu okładek serwis-zebry (do powtarzania)**: urządzenia jako bohater, duże, w dynamicznych przechyłach, wychodzące poza kadr; wir/tunel energii z liniami zbieżnymi; ŚWIATŁO DZIELONE — ognisty pomarańcz z jednej strony, lodowaty cyjan z drugiej; błyskawice oplatające sprzęt; lecące odłamki: śruby, zębatki, fragmenty płytek PCB, odpryski szkła; półprzezroczyste niebieskie szkice wireframe urządzeń w tle; halftone i gruby tusz, ale z realną głębią i 3D.
- Wygenerowane 2 warianty `gpt_image_2` 2k/high z tymi samymi 4 referencjami. Wybrany B (głębszy tunel, większe urządzenia, mocniejsze światło dzielone). Zapis `public/zebra-nucleus-flota-urzadzen-v3.jpeg`, 2752×1556, 1,5 MB.
- Zmiana nazwy pliku przy każdej wersji (v2 → v3) jako cache-busting — podmiana pod tą samą nazwą zostawiała userowi starą grafikę w przeglądarce; wyczyszczony też `.next/cache/images`.
- NIEZACOMMITOWANE.

## 2026-08-17 — Hero Nucleus FINAL: treść obrazu dopasowana do tematu
- User: wersja „wybuchowa" była efektowna, ale „co to ma wspólnego z Nucleusem?". Słusznie — pogoniłem za stylem i zgubiłem przekaz. Odłamki, pęknięte szkło i rozpad to język wpisów o USTERKACH; Nucleus to dokładnie odwrotność: porządek i kontrola.
- **Wniosek na przyszłość**: styl okładek serwis-zebry ma dwa warianty. (a) TROUBLESHOOTING — wir, rozpad, lecące części, iskry. (b) ZARZĄDZANIE/PORADNIK — ten sam poziom energii i to samo światło dzielone, ale kompozycja uporządkowana: element centralny + urządzenia wokół + widoczne połączenia. Dobierać wariant do KATEGORII wpisu.
- Finalna grafika: wielka chmura-konsola w centrum z czytelnym pulpitem (kafelki statusu, wykresy słupkowe, donuty, paski postępu — kształty abstrakcyjne, bez tekstu), cztery urządzenia wokół, każde z węzłem połączenia i wiązką do chmury, pierścienie orbit na podłożu, siatka heksagonalna, niebieskie widma wireframe w tle, światło dzielone pomarańcz/cyjan.
- `public/zebra-nucleus-konsola-flota.jpeg`, 2752×1556, 1,2 MB. Poprzednie wersje (v2, v3) usunięte. Urządzenia nadal 1:1 z renderów ZT411/ZD421t/DS3608-XR/TC501.
- NIEZACOMMITOWANE.

## 2026-08-17 — Hero Nucleus: czyszczenie tła i wiązki skanera
- Uwagi usera: (1) niebieskie szkice wireframe urządzeń w tle są niepotrzebne — i dodatkowo były ZMYŚLONE, więc łamały zasadę o urządzeniach 1:1; (2) czerwona wiązka skanera do usunięcia.
- Zamiast losować kompozycję od nowa: wgrałem zatwierdzoną grafikę jako referencję do `gpt_image_2` i zleciłem EDYCJĘ z jawnym „zachowaj wszystko poza tymi dwoma elementami". Kompozycja, urządzenia, chmura-pulpit, wiązki, pierścienie i światło dzielone zachowane 1:1.
- Finalny plik `public/zebra-nucleus-konsola-floty.jpeg`, 2752×1556, 1,0 MB. Poprzednie wersje usunięte.
- **Wniosek**: przy drobnych poprawkach grafiki edytować istniejący obraz jako referencję, nie generować od zera — inaczej traci się zaakceptowaną kompozycję i zaczyna od nowa cały cykl uwag.
- NIEZACOMMITOWANE.

## 2026-08-17 — Hero Nucleus: ZŁAPANY właściwy styl bloga (wersja finalna)
- User pokazał okładkę ZT510 jako wzorzec „mega". Kluczowa różnica, której wcześniej nie widziałem: te grafiki są **RYSOWANE** (kreska, cel-shading, halftone, cross-hatching), a moje były fotorealistycznymi renderami wklejonymi na tło. To zdradzało wszystko.
- **Pełna receptura stylu okładek serwis-zebry** (do powtarzania):
  1. technika: ilustracja komiksowa, widoczna kreska, płaskie cieniowanie, gruby halftone — NIE fotorealizm, NIE render 3D
  2. paleta: oszczędna — czerń i szarości + DWA akcenty (tu limonka #A8F000 i cyjan); bez fioletu/magenty
  3. kompozycja: tunel z koncentrycznych pierścieni rysowanych kreską, bohater w centrum
  4. dwie duże błyskawice ramujące kadr po skosie z górnych rogów, każda w innym akcencie
  5. wokół unoszą się elementy tematyczne: przy usterkach zębatki/śruby/odłamki, przy zarządzaniu świecące panele schematów i kafelki pulpitu
  6. urządzenia 1:1 z renderów, ale przerysowane w tej samej technice
- Prompt musi JAWNIE zakazywać fotorealizmu, inaczej gpt_image_2 przy referencjach fotograficznych domyślnie robi render.
- Finalny plik `public/zebra-nucleus-jedna-konsola.jpeg`, 2752×1556, 1,5 MB. Poprzednie wersje usunięte.
- NIEZACOMMITOWANE.

## 2026-08-18 — Nucleus: adres konsoli w sekcji „Jak zacząć"
- Dodany link do konsoli w kroku 1. **Linkujemy na `https://www.nucleus.zebra.com`, NIE na `/login`** — `/login` zwraca serwerowo 404 (SPA renderuje się dopiero po stronie klienta), a korzeń oddaje 200 i sam przekierowuje na ekran logowania.
- Znalezione przy weryfikacji i dopisane do wpisu: ekran logowania ma opcję **„Continue As Guest"** — konfiguracja urządzeń bez zakładania konta. Tego nie było w materiałach źródłowych.
- tsc EXIT=0, link zweryfikowany na renderze :3002.

## 2026-08-18 — Nucleus: uzupełnienie z battle card (bez treści poufnych)
- Źródło: `nucleus-software-battle-card-rgb-en-us.pdf` — **Zebra Confidential, do użytku wewnętrznego partnerów PartnerConnect**. Zgodnie z zasadą z KC401 do wpisu NIE trafiły: tabela porównawcza z konkurencją (SATO, Honeywell, Samsung Knox, Datalogic), skrypty obsługi obiekcji ani persony sprzedażowe. Test na renderze potwierdza brak tych nazw w treści.
- Dodane fakty produktowe (publiczne, wysokiej wartości dla czytelnika):
  - **nowa sekcja „Co Nucleus zastępuje"** z tabelą: PPME (drukarki), DNA Cloud (terminale Android), 123Scan (skanery) → jedna konsola. To najmocniejszy punkt dla naszych klientów, bo dziś realnie używają PPME i 123Scan.
  - inwentarz na poziomie **całej firmy i pojedynczej lokalizacji** (wcześniej tylko „cała flota")
  - aktualizacje **OTA** wprost nazwane
  - ramka o rozwoju platformy w cyklu miesięcznym — uczciwe zastrzeżenie, żeby opis się nie zestarzał
  - FAQ: doprecyzowanie roli obok MDM (systemy MDM ogarniają terminale, słabo drukarki i skanery) + nowe pytanie „Używamy PPME i 123Scan — co z tym?"
  - uwaga o skanerach: dotąd konfigurowane pojedynczo, firmy nie miały ich ewidencji
- Poprawka redakcyjna: „przedostatnia z listy" → wprost „zarządzanie licencjami" (po dodaniu wiersza do tabeli odwołanie pozycyjne przestało się zgadzać).
- Treść 12 110 zn., 3 tabele, 16 sekcji. tsc EXIT=0, render :3002 OK.

## 2026-08-18 — Baner głowic: naprawione martwe CTA
- **Diagnoza**: przycisk „Sprawdź kwalifikację" prowadził na `takma.com.pl/promocje/zebra-glowice-bez-kosztow` → **404**. Strona istnieje tylko w repo takma na gałęzi `claude/takma-frontend-build-RrM9E` (51 commitów przed main); na `origin/main` nie ma katalogu `app/promocje`, preview `takma-neon.vercel.app` też 404. Baner wisiał na produkcji od 7.08 i każdy lead z niego przepadał. Sam markup banera był poprawny.
- **Poprawka (bez ruszania repo takma)**: CTA kieruje na własny formularz `/kontakt?temat=glowice`, w tej samej domenie.
  - `app/kontakt/page.tsx`: stała `CONTACT_TOPICS` + `useEffect` czytający `?temat=` z `window.location.search` (celowo nie `useSearchParams` — nie wymusza granicy Suspense). Ustawia temat i szkielet wiadomości: modele i numery seryjne drukarek, używane etykiety i taśmy, szacunkowe roczne zużycie — czyli dokładnie to, czego potrzeba do kwalifikacji.
  - nowa opcja w liście tematów: „Program bezpłatnych wymian głowic" (trafia też do `trackFormSubmit`, więc będzie widać w analityce)
  - `PrintheadProgramBanner.tsx`: `<a>` → `<Link>` (nawigacja po stronie klienta), komentarz z powodem i docelowym adresem
- Test e2e w przeglądarce: karta głowicy 140Xi4 → CTA (`/kontakt?temat=glowice`) → formularz z tematem „Program bezpłatnych wymian głowic" i wiadomością 205 zn. Przejście działa.
- Formularz wysyła przez `mailto:` na serwis@takma.com.pl, więc zgłoszenie ląduje w module Poczta.
- DO ZROBIENIA PÓŹNIEJ: po wdrożeniu gałęzi takmy przywrócić `PROGRAM_URL` na `https://www.takma.com.pl/promocje/zebra-glowice-bez-kosztow`.

## 2026-08-18 — Baner głowic: CTA otwiera modal zamiast przenosić na kontakt
- Uwaga usera (UX): klient jest na karcie, na której właśnie widzi cenę głowicy — wyrywanie go na `/kontakt` gubi kontekst. Formularz ma się otwierać na miejscu.
- **`components/shop/PrintheadProgramCta.tsx`** (nowy, `'use client'`): przycisk + modal z formularzem. Escape i klik w tło zamykają, `overflow:hidden` na body, focus na pierwszym polu, `role="dialog"` + `aria-modal` + `aria-labelledby`, animacja framer-motion jak w `RegistrationLightbox`. Nagłówek modala w stylu banera (czerń + limonkowa pigułka), formularz na białym tle.
- Pola: firma, osoba, e-mail, telefon, modele i numery seryjne drukarek, roczne zużycie. Do zgłoszenia doklejany jest **kontekst karty** — nazwa produktu, model drukarki, cena brutto i adres strony — więc handlowiec wie, na co klient patrzył.
- **`app/api/program-glowice/route.ts`** (nowy): walidacja zod, mail przez Resend na serwis@takma.com.pl z `replyTo` klienta (odpowiedź wraca do niego, wątek działa w module Poczta).
- **Błąd wyłapany w testach**: Resend NIE rzuca wyjątkiem przy odrzuceniu — błąd siedzi w polu `error` odpowiedzi. Pierwsza wersja zwracała 200 mimo nieudanej wysyłki, czyli klient widziałby „wysłane", a zgłoszenie by przepadło (ten sam typ błędu co martwe CTA). Teraz sprawdzamy `error` i zwracamy 502 z numerem telefonu w komunikacie.
- `PrintheadProgramBanner` zostaje komponentem serwerowym, dostał nowy prop `productName`; kliencki jest tylko CTA.
- Testy w przeglądarce: przycisk otwiera modal bez zmiany strony, Escape zamyka, payload niesie `140Xi4 / 2674.16 zł / adres karty`, ekran sukcesu po wysyłce, a przy odrzuceniu wysyłki modal pokazuje czerwony komunikat z numerem telefonu. API: 400 przy złych danych, 502 przy nieudanej wysyłce.
- Prefill `/kontakt?temat=glowice` z poprzedniego kroku zostaje w kodzie jako alternatywna droga (temat jest też w liście formularza), ale baner już z niego nie korzysta.
- tsc EXIT=0, build EXIT=0, dev :3002.

## 2026-08-18 — Baner głowic: poprawiona obietnica w treści
- User zakwestionował zdanie „Najpierw liczymy, czy program Ci się opłaca". Słusznie — my sprawdzamy KWALIFIKACJĘ (czy roczne zużycie sięga progu Zebry, ok. równowartości 5 000 EUR w cenach katalogowych), a nie opłacalność u klienta; do tego trzeba by znać jego obecne ceny i to, czym drukuje.
- Ryzyko było realne: program wymaga drukowania wyłącznie na oryginalnych materiałach Zebry kupowanych u nas, więc firma używająca tańszych zamienników po przejściu zapłaci za materiały WIĘCEJ. Obietnica „policzymy, czy Ci się opłaca" mogła wrócić do nas z rachunkiem.
- Modal: „Sprawdzamy, czy Twoje zużycie materiałów sięga progu wymaganego przez Zebrę, i wracamy z odpowiedzią."
- Baner (rozwijane warunki): usunięte „więc niczym nie ryzykujesz" — pusta obietnica, która przemilczała zobowiązanie opisane punkt wyżej. Jest: „kwalifikację sprawdzamy, zanim zgłosimy firmę u producenta".
- **Zasada na przyszłość**: w treściach sprzedażowych obiecywać wyłącznie czynność, którą naprawdę wykonujemy. „Sprawdzimy X" zamiast „policzymy, czy Ci się opłaca".
- tsc EXIT=0, treść zweryfikowana na renderze.

## 2026-08-18 — Dzienny raport ChatAI: nowy szablon maila z pełnymi rozmowami
- Uwagi usera: mail był nieczytelny i nie zawierał tego, co najważniejsze — treści rozmów.
- **Przyczyna rozjazdu**: poprzedni szablon używał CSS grid i klas w `<style>`. Klienty pocztowe (Gmail) tego nie renderują, więc siatka statystyk rozpadała się na listę. Nowy szablon: układ na tabelach, style inline, zero klas.
- **Nowy plik `lib/email/chat-report.ts`** — szablon wydzielony z routingu. Nagłówek w firmowym navy `#1e3a5f` (bez gradientu), pasek 4 liczb (rozmów / pytań / z instrukcją / do serwisu), potem KAŻDA ROZMOWA osobno.
- Rozmowy grupowane po `session_id`, w kolejności chronologicznej. Każda tura: wiadomość klienta w niebieskiej bańce i pełna odpowiedź asystenta w białej karcie. Markdown z odpowiedzi (pogrubienia, akapity) zamieniany na HTML, znaczniki `[SERIOUS_ISSUE]`/`[INFO_ONLY]` i blok `__CITATIONS__` wycinane — klient ich nie widział, więc w raporcie też nie powinny być.
- Etykiety przy turach: użyta instrukcja (nazwa manuala), skierowanie do serwisu, ocena 👍/👎. W nagłówku rozmowy godzina, liczba pytań i wykryte modele.
- `?data=YYYY-MM-DD` odtwarza raport z dowolnego dnia, `?dry=1` zwraca HTML zamiast wysyłać — podgląd bez zaśmiecania skrzynki.
- Wersja „brak rozmów" też przerobiona: zamiast „Żaden użytkownik nie skorzystał" jest informacja, co to znaczy i kiedy warto się zaniepokoić.
- Stopka mówi „każdego wieczoru", a nie konkretną godzinę — cron chodzi w UTC (`0 19 * * *`), więc zimą to 20:00, latem 21:00.
- Podgląd zweryfikowany zrzutami dla dnia z rozmowami (2 rozmowy, 10 pytań) i dnia pustego. tsc EXIT=0, build EXIT=0.

## 2026-08-18 — Newsletter 1/3: oferta etykiet dobranych do modelu klienta
- Analiza bazy pod mailing: **232 zgłoszenia, 186 unikalnych adresów, 189 firm** (od 5.01.2026). Drukarki 108, terminale 62, tablety 19, skanery 18. Objawy: jakość wydruku 55, ekran/dotyk 44, bateria 37, nie włącza się 24. **195 napraw płatnych, 37 gwarancyjnych** — klienci przyzwyczajeni płacić.
- Plan trzech maili (kolejność ustalona z userem — zaczynamy od etykiet, nie od głowic): (1) etykiety dobrane do modelu + rolka na test, (2) baterie do terminali z rabatem progowym, (3) program bezpłatnych głowic — bo warunkiem programu jest kupowanie materiałów u nas, więc mail 1 buduje grunt pod mail 3.
- **Personalizacja z danych, które klient sam nam dał**: `repair_requests.device_model`. 98 unikalnych odbiorców z drukarkami, top modele: ZD421 (17), GK420t (10), GK420d (8), ZT411 (7), ZT230 (6).
- **`lib/email/newsletter-etykiety.ts`**: szablon + `recommendMaterials()` dobierający materiał po modelu — drukarki z literą „d" dostają etykiety termiczne Z-Perform 1000D, pozostałe termotransferowe Z-Perform 1000T plus taśmę woskową 2300. `labelOfferSubject()` wstawia model w temat maila.
- Argument sprzedażowy oparty na NASZYCH danych: „z 232 napraw 55 dotyczyło jakości wydruku", plus realny zakres cen głowic z naszego sklepu (466–6 815 zł). Mówimy z pozycji serwisu, który ten sprzęt naprawiał.
- Grafika nagłówkowa: Higgsfield `gpt_image_2` z referencją prawdziwego renderu ZD421t (żółty zatrzask, panel górny, drzwiczki nośnika zgodne 1:1), studyjna scena z rolkami etykiet, akcent limonkowy, wolne miejsce po prawej. `public/newsletter/etykiety-hero.jpeg`, 1280×724, 98 KB. **Zero emoji i ikon w mailu.**
- Układ na tabelach ze stylami inline (jak raport ChatAI), stopka z wypisaniem.
- CTA `/kontakt?temat=etykiety` — presety tematów uogólnione z jednego `if` na mapę `CONTACT_TOPICS`, doszedł temat „Bezpłatna rolka etykiet do testu" (pyta o model, rozmiar, gilzę i adres). Oba tematy przetestowane na :3002.
- **DO USTALENIA PRZEZ USERA**: wysokość rabatu (w podglądzie 15%), termin ważności oferty, ile rolek rozdajemy. Do zbudowania: strona wypisu `/wypisz` i zgoda marketingowa w bazie.
- tsc EXIT=0, build EXIT=0. NIEZACOMMITOWANE.

## 2026-08-19 — Newsletter 1/3: przerobiony na wzorzec z katalog-it-lasy
- User odrzucił pierwszą wersję („typowy AI slop") i pokazał wzorzec: mailing serwisowy z katalog-it-lasy. **Receptura tamtego układu**: biała belka z logo u góry, pełnowymiarowy kolorowy pas z nagłówkiem (mała limonkowa etykieta nad wielkim białym tytułem), wąski pasek akcentowy z jednym zdaniem, jasna treść z tekstem WYJUSTOWANYM, wyróżniona ramka z kluczową liczbą, wyśrodkowany przycisk, sekcje z numerowanymi wierszami rozdzielonymi liniami, **ciemny blok reklamowy innego urządzenia na dole**, ciemna stopka z logo, telefonem i linkami.
- **Rabaty wzięte z prawdziwej promocji** w repo takma (`src/data/promotions.ts`, slug `zebra-materialy-eksploatacyjne`), nie wymyślone: do −15% na maks. 3 kartony materiałów NA KAŻDĄ drukarkę, przy termotransferze dodatkowo do 3 kartonów taśm (razem 6). Wystarczy numer seryjny, wycena w 1 dzień roboczy, oferta do 31.12.2026 (`ZEBRA_ZIPSHIP.endDate` w `promos.ts`).
- Logo TAKMA w belce górnej (`takma_logo_1.png`) i w stopce (`takma_logo_white.png`) — oba są już na produkcji, więc działają w mailu przed deployem.
- **Blok reklamowy na dole**: „GK420 i GX420 powoli kończą służbę" → Zebra ZD621 jako następca. Uzasadnione danymi z naszej bazy — GK420t (10) i GK420d (8) to razem 18 sztuk, druga najliczniejsza rodzina po ZD421.
- Grafika bloku: Higgsfield `gpt_image_2` z referencją prawdziwego renderu ZD621t (`takma/public/images/products/zd621t_lcd_1_s.png`) — atmosferyczna, ciemne tło z limonkową poświatą i smugami światła, jak Pospay we wzorcu. `public/newsletter/zd621-promo.jpeg`, 700×700, 68 KB.
- Zero emoji i ikon w całym mailu. Numeracja kroków w kółkach zamiast ikon.
- Podgląd wysłany na jakub.tiuchty@gmail.com (klucz lokalny Resend jest ograniczony — brak domen serwis-zebry.pl i takma.com.pl, więc nadawcą jest piaskownica `onboarding@resend.dev`, a odbiorcą tylko właściciel konta).
- NIEZACOMMITOWANE.

## 2026-08-19 — Newsletter 1/3: blok dobierany do modelu + kontrakt serwisowy
- User: właścicielowi ZD421 nie opowiadamy o końcu życia GK420. Blok na dole dobiera się teraz do sprzętu — `promoBlockFor()` + `isLegacyPrinter()`: serie GK, GX, GC, TLP, LP, ZT220/230, ZD220/230 dostają propozycję wymiany na ZD621, wszystkie nowsze — kontrakt serwisowy.
- **Wycena kontraktu — analiza przed decyzją.** Kontrakt Zebry `Z1AE-ZD4X1-3C0` (OneCare Essential, 3 lata, Comprehensive) kosztuje nas 71,71 EUR = **309,71 zł netto** (NBP 4,3189 z 18.08). ALE w nazwie SKU jest „Purchased within 30 days of Device" — można go dokupić tylko do świeżo kupionego urządzenia, więc dla naszej bazy odpada. Stąd własny kontrakt.
- Anchor cenowy z naszych danych: 170 wycenionych napraw, mediana wszystkich 820 zł, **drukarki biurkowe mediana 622 zł** (zakres 168–1774). Głowica ZD421: 203 dpi 597,78 zł brutto (486 netto), 300 dpi 1269,10 (1032 netto).
- **Odrzucony wariant „z głowicą za +100 zł"**: głowica to część ZUŻYWALNA, nie awaria losowa. Próg opłacalności przy 100 zł premii to 20% wykorzystania dla 203 dpi i 10% dla 300 dpi, a w naszej bazie już 15% napraw drukarek dotyczyło głowicy — plus selekcja negatywna. Wybrana wersja: **jeden kontrakt 599 zł netto + stały rabat 40% na głowicę i części**.
- Zakres w mailu: odbiór kurierem i odesłanie, diagnostyka i robocizna bez dopłat, naprawa w 48 h roboczych, urządzenie zastępcze, przegląd z czyszczeniem raz w roku, części 40% taniej. **DO DECYZJI USERA**: czy ograniczyć liczbę napraw w roku i czy 48 h to bezpieczna obietnica przy spiętrzeniu zgłoszeń.
- Grafika bloku kontraktowego: Higgsfield `gpt_image_2` z referencją renderu ZD421t, narzędzia serwisowe w tle, ta sama rodzina wizualna co ZD621. `public/newsletter/kontrakt-serwisowy.jpeg`, 700×700, 67 KB.
- Poprawki po uwagach: usunięty żargon „superkalandrowany" i „permanentny klej", pasek akcentowy „Potrzebny tylko numer seryjny drukarki" zamiast kalki, **ciemny blok oddzielony od białej karty** (zaokrąglenia + 18 px odstępu na tle strony) tak jak we wzorcu z katalog-it-lasy.
- Nowy temat formularza `?temat=kontrakt` (model, numer seryjny, liczba urządzeń) — presety w `CONTACT_TOPICS` obsługują już głowice, etykiety i kontrakt.
- **Uwaga techniczna**: pierwsza wysyłka podglądu miała pustą grafikę — podstawiłem surowy PNG 5,4 MB, a Gmail nie pobiera tak dużych plików przez proxy. Do maili zawsze zoptymalizowany JPEG (~70 KB).
- tsc EXIT=0. NIEZACOMMITOWANE.
- **Zdjęcie na pełną szerokość bloku** (uwaga usera): przy układzie dwukolumnowym powiększenie obrazu ścisnęło tekst (łamane nagłówki i punkty). Rozwiązanie: kwadrat przycięty do 16:9 wokół urządzenia i wstawiony pełną szerokością nad tekstem — drukarka 640 px zamiast 270, a lista ma całą szerokość. Przypis 12 → 9 px i przeredagowany na „Urządzenie zastępcze udostępniamy w miarę dostępności sprzętu w naszej wypożyczalni".
- **Powrót do układu dwukolumnowego** (uwaga usera: „ma być tak jak było"), zdjęcie tylko trochę większe — ostatecznie 270 px, tekst 52% / obraz 48%.
- **Rozróżnienie „d" vs „t" u odbiorcy**: następcą GK/GX jest ZD421 (nie ZD621). `promoBlockFor()` dostaje trzy sloty grafik (`successorThermal`, `successorTransfer`, `contract`) i po `isDirectThermal(model)` podstawia właściwy wariant: GK420d/GX420d → **ZD421d** (druk termiczny, bez taśmy), GK420t/GX430t → **ZD421t** (termotransfer z taśmą). Opis i link do karty produktu też się przełączają.
- Nowe grafiki: `public/newsletter/zd421d-nastepca.jpeg` (34 KB) i `zd421t-nastepca.jpeg` (33 KB), 652×652, Higgsfield `gpt_image_2` z referencjami prawdziwych renderów `zd421d_1_s.png` / `zd421t_1_s.png`, krawędzie wtopione w `#0a0a0a`. `zd621-promo.jpeg` usunięty.
- Podglądy trzech wariantów (GK420d → ZD421d, GX430t → ZD421t, ZD421t → kontrakt) wysłane na jakub.tiuchty@gmail.com. tsc EXIT=0. NIEZACOMMITOWANE.
- **Materiały: wybór zamiast dyktowania** (uwaga usera: nie wiemy, na czym klient drukuje). Sekcja „Co dobraliśmy do …" z jedną narzuconą pozycją zastąpiona sekcją **„Co pasuje do …" z dwoma boksami obok siebie** — ekonomiczny i mocniejszy wariant do jego technologii druku. Termiczne: **Z-Perform 1000D** vs **Z-Select 2000D**. Termotransfer: **Z-Perform 1000T + 2300 Wax** vs **Z-Select 2000T + 3200 Wax-Resin**. Nazwy i cechy wzięte z `takma/src/data/thermal-label-series.ts`, `transfer-label-series.ts`, `transfer-ribbon-series.ts` — nie wymyślone.
- Pod boksami akapit „Rabat obejmuje oba warianty… przepisz numer katalogowy z kartonu albo z tulei rolki" (rozbraja niepewność klienta) i linijka o materiałach spoza dwójki (PolyPro 4000D, Z-Ultimate 3000T, linerless).
- Boksy jako `<td width="50%">` z `height:100%` — flexbox i grid nie działają w poczcie. Teksty punktów skrócone do jednej linii, żeby oba boksy kończyły się na tej samej wysokości.
- Poprawiona linijka we wstępie: „wiemy, na czym powinien drukować" → „wiemy, jakich materiałów potrzebuje".
- tsc EXIT=0. Podglądy wysłane ponownie. NIEZACOMMITOWANE.
- **CTA w każdym boksie serii** (uwaga usera: sama informacja nie zostaje w głowie klienta). Każdy boks ma teraz dwa wejścia: nazwa serii linkuje do landingu na takma.com.pl, a pod punktami jest przycisk „Wybieram 1000D" / „Wybieram ten zestaw" → `/kontakt?temat=materialy&seria=<nazwa>`. W wariancie termotransferowym nazwa rozbita na dwa linki (etykieta + taśma), każdy do swojej serii.
- Linki serii sprawdzone curl-em, wszystkie 200: `/etykiety-termiczne-zebra/serie/{z-perform-1000d,z-select-2000d}`, `/etykiety-termotransferowe-zebra/papierowe/serie/{z-perform-1000t,z-select-2000t}`, `/tasmy-termotransferowe/serie/{2300-wax,3200-wax-resin}`.
- **Nowy temat formularza `materialy`** (rabat na materiały: model, numer seryjny, rozmiar etykiety, liczba kartonów) — dotychczasowy `etykiety` to bezpłatna rolka do testu i nie pasował do tej wysyłki. Formularz czyta też `?seria=` i dokleja „Wybrana seria: …" do wiadomości; wejście sanityzowane do liter, cyfr, spacji, `+ - – .`, maks. 60 znaków (regexp bez flagi `u`, bo target to es5).
- Usunięty ogólny przycisk „Odbierz rabat" znad boksów — trzy granatowe przyciski jeden pod drugim konkurowały ze sobą. Została linijka z terminem oferty, a ścieżkę dla niezdecydowanych przejął link „Napisz, dobierzemy →" pod boksami.
- tsc EXIT=0. Podglądy wysłane. NIEZACOMMITOWANE.
- **Korekta: przyciski w boksach prowadzą do sklepu, nie do formularza.** „Zobacz 1000D →" / „Zobacz etykiety 2000T →" idą na landingi serii na takma.com.pl. Nazwa serii w nagłówku boksu dalej linkuje tam samo (w termotransferze osobno etykieta i taśma).
- Wrócił główny przycisk „Odbierz rabat" → `/kontakt?temat=materialy` — to jedyna ścieżka po numer seryjny, bez niej mail nie miałby konwersji. Żeby nie konkurował z przyciskami serii, jest wypełniony granatem, a przyciski serii mają biały środek i granatowy obrys.
- Obsługa `?seria=` w formularzu zostaje (przydatna, gdy wrócimy do wariantu „wybieram tę serię"), ale mailing z niej teraz nie korzysta.
- **Rozbicie białej płachty** (uwaga usera: wszystko zlewa się w jedno). Mail miał trzy sekcje jedna pod drugą na tym samym białym tle. Teraz: (1) treść na białym, (2) **karta oferty** — rabat, limit i przycisk „Odbierz rabat" w jednej ramce zamiast trzech osobnych wierszy, (3) **szary pas `#eef2f7`** z liniami u góry i dołu pod „Co pasuje do …" — białe boksy serii odcinają się od tła, (4) „Jak skorzystać" znów na białym, (5) ciemny blok reklamowy. Rytm biały → karta → szary → biały → ciemny.
- Nagłówki sekcji dostały nadtytuły („Materiały do wyboru", „Trzy kroki") i wzrosły do 20 px — wcześniej trzy H2 tej samej wagi zlewały się z tekstem.
- **Usunięte justowanie** we wszystkich akapitach. W kolumnie 584 px justowanie robi rzeki i szarą plamę — teraz wyrównanie do lewej.
- Skrócone teksty: powitanie rozbite na dwa akapity, akapit o limicie kartonów wciągnięty do karty oferty jako jedna linijka, wstęp do boksów z trzech zdań do jednego („Nie wiesz, czego używasz teraz? Przepisz numer katalogowy…").
- tsc EXIT=0. Podglądy wysłane. NIEZACOMMITOWANE.
- **Hero jako osobna karta.** Belka z logo + granatowy pas + limonkowy pasek tworzą teraz zamkniętą kartę (pasek limonkowy ma zaokrąglony dół), po nim 18 px przerwy na tle strony, a treść zaczyna się nową kartą z zaokrąglonym górnym rogiem — dokładnie tak, jak oddzielony jest ciemny blok reklamowy na dole.
- **Pas „Serwisujemy dla" z logotypami klientów** (Lasy Państwowe, Poczta Polska, Orlen, Żabka, SFD) na końcu białej karty, nad ciemnym blokiem, oddzielony cienką linią. Pliki to te same `/logo_*.png` co w zakomentowanej sekcji na stronie głównej — wszystkie odpowiadają 200 z produkcji, więc działają w mailu bez deployu. Żabka wymaga URL-encode (`logo_%C5%BCabka.png`).
- Logotypy w kolorze i na białym tle: `logo_poczta.png` nie ma przezroczystości, a filtr `grayscale` z wersji na stronie w poczcie nie działa. Wysokości wyrównane ręcznie (44/30/30/26/28 px), szerokości z proporcji oryginałów.
- **Pas „Serwisujemy dla" usunięty**, a w belce z logo tekst „Autoryzowany serwis i partner Zebra Technologies" zastąpiony dwiema odznakami Zebry: `premier-partner-1.png` (Premier Business Partner) i `repair_specialist.png` (Premier Solution Partner — Printer Repair Specialist). Oba pliki są już na produkcji (200), więc działają bez deployu. Wysokość 56 px — przy 47 px napisy na odznakach były nieczytelne.
- **Odznaki wyrównane wielkością.** Wcześniej miały równą wysokość PLIKU, a nie odznaki — `premier-partner-1.png` ma treść na 96% wysokości kadru, `repair_specialist.png` tylko na 86%, więc druga wyglądała na mniejszą. Zmierzone bboxy alfa (517×328 i 308×238) i przeliczone wymiary tak, żeby sama odznaka miała 58 px w obu: 97×60 i 77×68. Teraz góry i doły się pokrywają, a napis ZEBRA jest tej samej wielkości.
- **Ekspozycja ceny kontraktu (psychologia sprzedaży).** Cena była na dole, drobna, po przypisie z gwiazdką — czyli w najgorszym możliwym miejscu. Teraz siedzi tuż pod nazwą produktu, PRZED listą zakresu, w wydzielonym panelu (`#141a0c`, obramowanie `#3f5a12`), kwota limonkowa 32 px. Zastosowane techniki:
  - **Kotwiczenie na koszcie alternatywy, nie na zerze** — nad ceną: „Mediana naprawy drukarki biurkowej u nas: 455 zł netto. Dwie w ciągu trzech lat to już ponad 900 zł". Liczba policzona na żywo z bazy: 50 wycenionych napraw drukarek biurkowych, mediana **560,50 zł brutto** = 455,69 netto (potwierdzenie, że `estimated_price` jest brutto: minimum w zbiorze = 166,05 zł, czyli udokumentowana opłata za rezygnację). Nie ma przekreślonej fikcyjnej ceny — kotwica jest prawdziwa i nasza.
  - **Rozbicie na mniejszą jednostkę** — „W przeliczeniu 16,64 zł miesięcznie" (599 ÷ 36).
  - **Wyłączność zamiast presji czasu** — we wstępie: „Zebra sprzedaje swój pakiet opieki tylko w pierwszych 30 dniach od zakupu urządzenia — nasz wykupisz w dowolnym momencie". Fakt z SKU `Z1AE-ZD4X1-3C0` („Purchased within 30 days of Device"), więc bez ściemy.
  - **Mocne CTA zamiast linku** — „Zamów kontrakt →" jako limonkowy przycisk (wcześniej szary tekst „Zobacz szczegóły"). Blok następcy dostał to samo potraktowanie: „Zobacz ZD421d →".
  - ŚWIADOMIE NIE użyte: obietnica nieograniczonej liczby napraw (limit wciąż nierozstrzygnięty) i sztuczna presja czasowa.
- tsc EXIT=0. Podglądy wysłane. NIEZACOMMITOWANE.
- **Drukarka w bloku kontraktu większa o 20%** — nie przez powiększenie ramki (kolumna tekstu straciłaby ~50 px i punkty by się łamały), tylko przez ciaśniejszy kadr: `public/newsletter/kontrakt-serwisowy.jpeg` przycięty do 543×543 wokół środka i przeskalowany z powrotem do 652×652, krawędzie ponownie wtopione w `#0a0a0a`. Narzędzia serwisowe zostały w kadrze. Grafiki następców (ZD421d/ZD421t) mają urządzenie już wystarczająco duże — bez zmian.

## 2026-08-19 — Kontrakt serwisowy jako produkt do kupienia online
- User: CTA z newslettera prowadziło do formularza kontaktowego; ma prowadzić do karty produktu z koszykiem i płatnością, z miejscem na numer seryjny.
- Decyzje usera: (1) osobna karta `/kontrakt-serwisowy` poza katalogiem części, (2) brak dostawy 25 zł dla zamówień z samymi usługami, (3) numer seryjny wymagany osobno dla KAŻDEJ sztuki.
- **Model danych**: kontrakt to zwykły wiersz w `products` (`product_type='kontrakt'`, slug `kontrakt-serwisowy-3-lata`, 599 netto / 736,77 brutto, SKU `KTR-3Y`). Listingi katalogu filtrują po pięciu typach części, więc nie pojawia się w sklepie; `getProductUrl()` dostał wyjątek kierujący typ `kontrakt` na `/kontrakt-serwisowy`. Feed Google Merchant ma whitelistę typów, więc usługa do niego nie trafia.
- **Koszyk**: `CartItem` rozszerzony o `productId`, `is_service`, `serial_number`, `contract_device_model`, `fixed_quantity`. Klucz pozycji to `${productId}:${S/N}` — dwie sztuki tego samego produktu z różnymi numerami seryjnymi muszą być osobnymi wierszami (dotychczas `addItem` deduplikował po samym `id` i podbijał ilość).
- **Dostawa**: `hasPhysicalItems` w checkoucie; zamówienie z samymi usługami ma dostawę 0 i nagłówek „Adres firmy" zamiast „Adres dostawy". Dodany filtr w `/api/furgonetka/orders` — bez niego opłacone zamówienie na sam kontrakt trafiłoby do feedu i Furgonetka zamówiłaby kuriera po pustą paczkę.
- **Numer seryjny w całym łańcuchu**: panel zakupu → koszyk → checkout → `shop_orders.items` (JSONB, bez migracji) → panel admina, pro forma, wydruk i oba maile o zamówieniu.
- **Rejestr kontraktów**: nowa tabela `service_contracts` (jeden wiersz na urządzenie, numer `KTR-YYYYMMDD-XXXX`, indeks po `upper(serial_number)`). Wiersze powstają przy złożeniu zamówienia ze statusem `pending` (żeby nie zgubić numeru przy porzuconej płatności), a webhook P24 przestawia je na `active` i ustawia daty start/koniec (+3 lata). Logika w `lib/service-contracts.ts`, SQL w `supabase-service-contracts.sql`.
- **Test e2e na localhost:3002** (Playwright): walidacja pustego S/N blokuje ✓, S/N zapisywany wielkimi literami ✓, dwa urządzenia jako osobne pozycje ✓, duplikat numeru odrzucony ✓, koszyk 1198 zł netto ✓, checkout „Dostawa — nie dotyczy" i 1473,54 zł brutto ✓. Testowe `POST /api/orders` potwierdziło, że `serialNumber` i `deviceModel` trafiają do `shop_orders.items` — zamówienie testowe usunięte z bazy.
- Produkt wstawiony do produkcyjnej bazy (id `d53a979c-0bea-442c-ac07-80384e6f5482`). **PENDING: user musi wykonać CREATE TABLE `service_contracts`** — do tego czasu zamówienia przechodzą normalnie, tylko rejestr kontraktów się nie zapisuje (błąd łapany, zamówienie nietknięte — potwierdzone w logach).
- CTA w newsletterze przepięte z `/kontakt?temat=kontrakt` na `/kontrakt-serwisowy`. Strona dodana do sitemapy. Build ✓, tsc EXIT=0. NIEZACOMMITOWANE.

## 2026-08-20 — Panel: zgłoszenie z nową wiadomością wskakuje na górę listy
- Prośba serwisantów: gdy klient napisze na czacie, jego karta naprawy ma pojechać na samą górę `/admin`, a po przeczytaniu wrócić na swoje miejsce.
- Okazało się, że połowa mechanizmu już była: `repair_messages` ma `sender_type` (`user`/`admin`) i `is_read`, `ChatBox` PATCH-uje `/messages/read` przy wejściu na kartę, jest badge z licznikiem i subskrypcja realtime na `repair_messages`. **Brakowało wyłącznie sortowania** — lista renderowała dokładnie to, co zwrócił API (`created_at DESC`), a subskrypcja odświeżała tylko licznik.
- `/api/admin/repairs`: jedno zapytanie agregujące nieprzeczytane wiadomości od klientów dla całej listy → `unread_count` i `last_customer_message_at` na każdym zgłoszeniu. Przy okazji **znika 244 osobnych requestów** — lista strzelała po `/messages/unread` raz na zgłoszenie przy każdym otwarciu panelu.
- `app/admin/page.tsx`: `sortedRepairs` (useMemo) — nieprzeczytane na górze wg czasu ostatniej wiadomości, reszta bez zmian po `created_at DESC`. Użyte w obu widokach (karty mobile + tabela desktop). Realtime dokłada `lastMessageAt` z payloadu, więc karta wskakuje na górę na żywo, bez odświeżania strony.
- Podświetlenie wiersza/karty na niebiesko przy nieprzeczytanych — inaczej nie wiadomo, dlaczego zgłoszenie sprzed pół roku nagle jest pierwsze.
- Test na prawdziwych danych (244 zgłoszenia, symulacja komparatora): zgłoszenie z pozycji **244 → 1** po wiadomości od klienta i **1 → 244** po oznaczeniu jako przeczytane. Realne zgłoszenie z 2 nieprzeczytanymi (Chlebda) przeskoczyło z pozycji 2 na 1. Build ✓, tsc EXIT=0. NIEZACOMMITOWANE.

## 2026-08-20 — Przyjęcie zgłoszenia w biurze („z palca")
- Serwisanci: klient przychodzi do biura z urządzeniem, a zgłoszenie da się dotąd założyć wyłącznie przez formularz klienta.
- Decyzje usera: status od razu **`odebrane`**, mail do klienta **zawsze**, **e-mail nieobowiązkowy** (wymagany telefon). Rozstrzygnięcie sprzeczności: mail leci, o ile jest dokąd — bez adresu nie ma czego wysyłać.
- **`POST /api/admin/repairs/nowe`** — `requireAdminServer` + zod, numer w tym samym formacie co zgłoszenia ze strony (YYYYMMDDHHmm + 2 cyfry) z zapasem na starą kolumnę varchar(12) (`22001`). Zapis ze statusem `nowe`, `source: 'biuro'`.
- Status `odebrane` ustawia zaraz po zapisie **panel**, wołając istniejące `PATCH /api/admin/repairs/[id]/status`. Dzięki temu potwierdzenie przyjęcia z PDF-em i wpis do historii statusów powstają dokładnie tak jak przy przesyłce kurierskiej — zero duplikowania tamtej logiki.
- Auto-rejestracja konta klienta skopiowana ze ścieżki publicznej (konto + hasło w mailu potwierdzającym), bo bez konta klient nie otworzy karty naprawy z linku.
- **Niespodzianka ze schematu**: `repair_requests.email` jest **NOT NULL**, więc „e-mail nieobowiązkowy" nie mógł zapisać `null`. Rozwiązanie: adres-zaślepka w zarezerwowanej domenie `.invalid` (RFC 2606) — `brak-{numer}@serwis-zebry.invalid`. Nigdy nie istnieje, więc nic tam nie poleci i nie wygenerujemy odbić psujących reputację domeny. `lib/email-utils.ts` (`canReceiveEmail`) rozpoznaje zaślepkę; wpięte w trasę zmiany statusu (żadnych prób wysyłki) i w kartę zgłoszenia (zamiast adresu „brak adresu — kontakt telefoniczny").
- UI: `components/admin/WalkInRepairModal.tsx` — jeden ekran zamiast kreatora (klient stoi przy ladzie), sekcje Klient / Urządzenie / Usterka, checkbox „Nieczytelny" przy numerze seryjnym, notatka wewnętrzna, wymagane potwierdzenie zgód klienta. Przycisk „Przyjęcie w biurze" w nagłówku `/admin`, po zapisie przenosi na kartę zgłoszenia.
- Bez zmian w `middleware.ts` — modal siedzi na `/admin`, a ta ścieżka jest już dozwolona dla zwykłych adminów.
- Testy: pełny payload wstawiony i usunięty z produkcyjnej bazy (schemat przyjmuje komplet pól, `source='biuro'`, zgody, zaślepka maila) ✓, endpoint bez sesji admina zwraca 401 ✓, build ✓, tsc EXIT=0. Nie klikałem w panelu — brak konta admina. NIEZACOMMITOWANE.

## 2026-08-21 — Naprawa: zgłoszenie wskakiwało na górę i po sekundzie znikało
- Zgłoszenie #20260818101261 (Przewoźny, West Trading): dwie wiadomości od klienta, obie `is_read=true`, choć nikt nie odpisał. Karta pokazała się na górze listy na sekundę i spadła.
- **Przyczyna, potwierdzona osią czasu z bazy, nie hipotezą**: historia statusów pokazuje pracę serwisanta nad tym zgłoszeniem o 06:35 i 06:52 (dwa razy „wycena"), klient zaakceptował cenę o 06:51:30, a wiadomości przyszły o 06:58:06 i 06:58:53. Karta naprawy była więc wciąż otwarta w zakładce serwisanta. `ChatBox` ma subskrypcję realtime i po każdym INSERT bezwarunkowo wołał `PATCH /messages/read` — zakładka w tle „przeczytała" wiadomość w sekundzie, w której ta przyszła.
- **Fix w `components/chat/ChatBox.tsx`**: PATCH tylko gdy `document.visibilityState === 'visible'` i `document.hasFocus()`, plus nasłuch `visibilitychange` i `focus`, żeby oznaczyć przy powrocie do zakładki. Dodatkowo warunek `hasIncomingUnread` — wcześniej PATCH leciał przy każdej zmianie tablicy wiadomości, także gdy nie było czego oznaczać.
- Dwie wiadomości z tego zgłoszenia przywrócone w bazie jako nieprzeczytane, żeby wróciło na górę listy.
- Build ✓, tsc EXIT=0. Nie klikane w panelu (brak konta admina) — do sprawdzenia po deployu: karta otwarta w tle nie powinna już kasować powiadomienia.

## 2026-08-21 — Kanał wdrożeniowy w panelu
- Zespół serwisu potrzebuje miejsca, w którym zapisuje zmiany do wprowadzenia na serwis-zebry.pl. Przebieg: serwisant pisze → mail na jakub.tiuchty@takma.com.pl; wdrażający zaznacza checkbox → mail na serwis@takma.com.pl i zgłoszenie ląduje w archiwum.
- **Tabela `deployment_requests`** (`supabase-wdrozenia.sql`): tytuł, szczegóły, opcjonalny adres strony, dane zgłaszającego kopiowane z profilu, `status` open/done, `done_at`/`done_by_name`/`done_note`. RLS bez polityk — dostęp tylko przez service role.
- **API**: `GET/POST /api/admin/wdrozenia` (lista wg statusu + nowe zgłoszenie z mailem), `PATCH /api/admin/wdrozenia/[id]` (zamknięcie/cofnięcie). Mail o wdrożeniu leci **tylko przy przejściu open → done**, żeby ponowne kliknięcie nie zasypywało skrzynki serwisu tym samym powiadomieniem. Błąd wysyłki nie wywraca zapisu.
- **Uprawnienia**: strona widoczna dla zwykłych adminów i superadminów (dopisana do `REGULAR_ADMIN_ALLOWED_PATHS` w `middleware.ts` **oraz** `REGULAR_ADMIN_ALLOWED_SECTIONS` w `lib/admin-config.ts` — obie listy trzeba trzymać zsynchronizowane). **Checkbox „wykonano" zarezerwowany dla superadmina** — zespół zgłasza i widzi status, ale nie odhacza cudzej pracy. Do zmiany jednym warunkiem, gdyby serwisanci mieli sami zamykać.
- UI: zakładki „Do zrobienia" / „Archiwum", modal zgłoszenia, w archiwum przycisk cofnięcia (bez maila). Wpis w sidebarze pod Pocztą.
- Maile w `lib/email/deployment.ts`, nadawca `system@serwis-zebry.pl` (ta sama domena co reszta powiadomień systemowych).
- Build ✓, tsc EXIT=0, API bez sesji zwraca 401, `/admin/wdrozenia` przekierowuje na logowanie. **PENDING: wykonać `supabase-wdrozenia.sql`** — bez tabeli strona pokaże pustą listę, a zapis zwróci błąd.

## 2026-08-21 — SQL wykonany, testy obu tabel na produkcji
- User uruchomił `supabase-service-contracts.sql` i `supabase-wdrozenia.sql`.
- **Bug złapany od razu przy pierwszym teście**: `createPendingContracts` dostawał klienta Supabase z trasy `/api/orders`, a tę wywołuje NIEZALOGOWANY klient sklepu — czyli klucz anon. `service_contracts` ma RLS bez polityk, więc zapis leciał w `new row violates row-level security policy`. Zamówienie przechodziło (błąd łapany), ale kontrakt nie powstawał — czyli po opłaceniu nie byłoby wiadomo, jakie urządzenie jest objęte.
- Fix: `lib/service-contracts.ts` tworzy własnego klienta service-role zamiast przyjmować go z zewnątrz (obie funkcje). Parametr `supabase` usunięty z sygnatur, poprawione wywołania w `/api/orders` i w webhooku P24. Dzięki temu ta klasa błędu nie wróci przy kolejnym wywołaniu z kontekstu anonimowego.
- **Test e2e kontraktów** (prawdziwe `POST /api/orders` na localhost, dwa kontrakty w jednym zamówieniu): 2 wiersze `pending` z numerami `KTR-20260821-...`, poprawne modele i numery seryjne ✓; symulacja webhooka → `active`, od 2026-08-21 do **2029-08-21** ✓; zamówienie i kontrakty testowe usunięte ✓.
- **Test kanału wdrożeniowego**: zapis zgłoszenia (treść wielolinijkowa), zamknięcie z `done_by_name` i `done_at`, podział na zakładki po statusie ✓, wiersz testowy usunięty ✓.
- Build ✓, tsc EXIT=0.

## 2026-08-21 — Notatka wewnętrzna serwisu na karcie zgłoszenia
- Serwisanci chcieli miejsce na „wykonane prace" widoczne tylko dla nich — klient nie zawsze musi wiedzieć, co było robione, a dla warsztatu to wiedza, która przydaje się przy kolejnej naprawie tego samego modelu.
- Nowa kolumna `repair_requests.internal_notes` (`supabase-internal-notes.sql`), osobna trasa `PATCH /api/admin/repairs/[id]/internal-notes`, box na dole LEWEJ kolumny karty zgłoszenia (bursztynowa ramka z kłódką, żeby nie mylić się z „Diagnoza i wykonane prace", które klient widzi).
- **Kluczowe zabezpieczenie**: samo nierenderowanie pola u klienta nic by nie dało. Trasy `GET /api/repairs/[id]` i `GET /api/repairs` pobierają zgłoszenie przez `select('*')` i odsyłają cały wiersz — notatka byłaby w payloadzie JSON i do odczytania w narzędziach przeglądarki. `lib/repair-internal.ts` (`stripInternalNotes`, `stripInternalNotesFromList`) wycina pole wszędzie, gdzie odbiorcą nie jest admin.
- Sprawdzone pozostałe drogi wycieku: raport serwisowy PDF składa się z jawnie wypisanych pól (`issue_description`, `service_notes`) — notatka tam nie wejdzie; maile też używają konkretnych pól. Świadomie NIE dopisujemy wpisu do `repair_status_history` przy zapisie notatki, bo historię klient ogląda u siebie.
- Testy: kolumna zapisuje i czyta ✓, `stripInternalNotes` usuwa pole, zostawia `service_notes` i nie mutuje oryginału ✓, lista też czysta ✓, notatka testowa wyczyszczona z bazy ✓. Build ✓, tsc EXIT=0.

## 2026-08-24 — Klient nie widział szczegółów wyceny (#20260819130124)
- Dane w bazie były poprawne: `final_price` 3680, `price_notes` z opisem uszkodzeń. Problem był wyłącznie w renderowaniu panelu klienta.
- **Przyczyna**: karta „Wycena" (jedyne miejsce na desktopie renderujące `price_notes`) ma warunek `!(status === 'wycena' && !price_accepted_at)` — jest **celowo ukrywana dokładnie wtedy, gdy wycena czeka na akceptację**, z komentarzem „wtedy jest w box Akcje". Tyle że desktopowy box „Wymagana akcja" pokazywał samą kwotę w przycisku i nigdy nie renderował `price_notes`. Efekt: klient przy decyzji o 3680 zł widział kwotę bez uzasadnienia. Wersja mobilna pokazywała opis, ale przycięty `line-clamp-2`.
- Fix: desktopowy box „Wymagana akcja" dostał podsumowanie wyceny (kwota + pełne szczegóły) nad przyciskami; na mobile zdjęty `line-clamp-2` — przy decyzji o kwocie klient ma widzieć całe uzasadnienie, nie dwie linijki.
- Build ✓, tsc EXIT=0.

## 2026-08-25 — Anulowanie kuriera z panelu (BL Paczka)
- Klient wycofał zgłoszenie #20260825102017 po zamówieniu kuriera. W panelu nie było jak tego odwołać — integracja wołała tylko `createOrderV2.json`, `getOrders.json` i `getWaybillTracking.json`.
- **Rozpoznanie API bez dokumentacji** (jest za logowaniem): próba endpointów z fikcyjnym numerem wykazała, że `cancelOrder.json` istnieje (zwraca JSON), a reszta kandydatów oddaje HTML. Formatu zapytania nie dało się odgadnąć — komunikat „Brak paczki w systemie z podanym id" jest ten sam dla każdego wariantu, także dla pustego. Rozwiązanie: pobrana wtyczka WooCommerce BL Paczki z wordpress.org, `OrderApiRepository::cancelOrder` pokazuje, że **id musi siedzieć w obiekcie `Order`** — płaskie `id` endpoint ignoruje.
- Drugie odkrycie: `cancelled` to flaga tekstowa, po anulowaniu przyjmuje **'2'**, nie '1'. Pierwsza wersja weryfikacji sprawdzała '1' i zgłosiłaby porażkę mimo udanego anulowania.
- **`POST /api/admin/repairs/[id]/cancel-courier`**: szuka zlecenia po numerze listu w oknie 60 dni (bo w bazie mamy list, a BL Paczka anuluje po swoim `Order.id`), anuluje, po czym **weryfikuje stan u przewoźnika** — samo `success` nie wystarcza, bo pusty przejazd kuriera bywa płatny i nie wolno fałszywie zameldować anulowania. Dane kuriera w zgłoszeniu czyścimy dopiero po potwierdzeniu.
- Przyciski „Anuluj kuriera" przy obu blokach przesyłek (odbiór od klienta i wysyłka do klienta) w karcie zgłoszenia, z potwierdzeniem przed wysłaniem.
- Zlecenie 23188695 (list 1049692365133U, podjazd 27.08) **anulowane i potwierdzone**, dane w zgłoszeniu wyczyszczone, wpis w historii dodany.
- Build ✓, tsc EXIT=0.

## 2026-08-25 — Analityka serwisu: urządzenia, usterki, klienci, napływ
- Prośba: (1) 5 najczęściej serwisowanych urządzeń, (2) co najczęściej naprawiamy, (3) który klient serwisuje najwięcej, (4) średnia dzienna i miesięczna liczba zgłoszeń.
- Punkt 1 był już częściowo w panelu („Top 10 modeli") — dołożone wyróżnione pięć pierwszych miejsc jako kafelki, bo o to pytali serwisanci; pełna dziesiątka zostaje niżej.
- **Kategorie usterek wyprowadzone z prawdziwych opisów, nie wymyślone.** Najpierw policzone najczęstsze słowa w 255 opisach klientów, potem na tej podstawie osiem kategorii i iteracyjne dopracowanie wzorców: 23% → 16% → **11% w „Inne"**. Wyłapane po drodze realne przypadki: literówka „KALBRACJI", „brak wiązki lasera", „nie odpala", „po wymianie kalki", hałasujący wentylator, „drukuje połowę etykiety". Reszta w „Inne" to opisy typu „proszę o przegląd" albo wpisy-śmieci — dalej nie da się uczciwie.
- Zgłoszenie wpada do PIERWSZEJ pasującej kategorii, więc kategorie sumują się do liczby zgłoszeń i żadna naprawa nie jest liczona dwa razy.
- Rozkład na dziś: zasilanie i akumulator 24%, głowica i jakość wydruku 21%, nośnik/kalibracja 15%, ekran i dotyk 13%, skanowanie 7%.
- Klienci grupowani po znormalizowanej nazwie firmy (wielkość liter, podwójne spacje), z obrotem z zamkniętych napraw. Czoło: Zadbano S.A. (10), Spinel Trade (5).
- Napływ liczony przez dni, które realnie minęły od najstarszego zgłoszenia w okresie — dzielenie przez pełne 365 dni zaniżałoby średnią przy krótszej historii. Dziś: 255 zgłoszeń przez 232 dni → **1,1 dziennie, 33,5 miesięcznie**. Podstawa wyliczenia widoczna pod liczbą.
- Build ✓, tsc EXIT=0.
- **Ranking modeli pokazywał pisownię, nie urządzenia.** User zauważył, że „Zasilanie i akumulator 30" nie ma odpowiednika w top 10 modeli. Liczby były spójne (kategorie sumują się do wszystkich zgłoszeń, modele rozsypują się na długi ogon), ale przy okazji wyszedł prawdziwy błąd: 142 zgłoszenia miały **100 różnych zapisów modelu**, 80 z nich jednorazowych. GK420 rozpadało się na cztery pozycje („GK420t", „Gk420t", „ZEBRA GK 420T", „ZEBRA GK420t") i wypadało z czołówki.
- Fix: grupowanie po tokenie modelu (litery + cyfry + końcówka, z pierwszego członu przed przecinkiem), wyświetlany najczęstszy zapis w grupie plus licznik „+N zapisu". Warianty „d" i „t" zostają osobno — to realnie inne urządzenia. Po złączeniu: 78 grup zamiast 100 zapisów, na czele **GK420t 9** (było 6) i ZD421 8 (było 7), top 10 pokrywa 52 zamiast 41 zgłoszeń.
- Pod wykresem usterek dopisane wyjaśnienie, dlaczego obu wykresów nie da się zestawiać wprost.
- Usunięty wykres „Obrót miesięczny" z zakładki Przegląd — słupki renderowały się jako płaskie kreski niezależnie od kwoty (1771 zł wyglądało jak 32 744 zł). Te same dane zostają w czytelnej tabeli w zakładce Obrót szczegółowy.
- **Sprawdzenie mobile (nie na oko, tylko pomiarem).** Tymczasowa strona z tym samym markupem i danymi, screenshoty przez Playwright przy 360/390/430/768/1280 px. Wyszły dwa realne błędy: tabela klientów rozpychała dokument do **581 px przy oknie 390** (poziomy scroll — winna długa nazwa firmy w komórce), a etykiety wykresów ucinały się („Zasilanie i aku…", „+3 za…"), czego na telefonie nie da się podejrzeć, bo nie ma kursora.
- Fix: tabela klientów zamieniona na listę z zawijaniem nazwy; etykiety wykresów lądują NAD paskiem poniżej breakpointu `sm`, a od `sm` wracają do układu w jednym wierszu. Po poprawce: brak poziomego scrolla i zero uciętych etykiet na wszystkich pięciu szerokościach. Strona testowa usunięta.

## 2026-08-25 — Sprzedaż urządzeń na serwis-zebry.pl: karta ZD421t + kategoria
- Pytanie usera: czy robić kartę na każdy numer katalogowy, jak zebrasklep. **Analiza z Ahrefs rozstrzygnęła to danymi:**
  - zebrasklep.pl: DR 6, 153 frazy, **2287 ruchu/mies.** vs serwis-zebry.pl: DR 17, 74 frazy, 509 ruchu. Nisza nie jest bramkowana autorytetem.
  - Ich trzy karty ZD421 zachowują się różnie: jedna 130 ruchu na „zebra zd421" (800 wol.), druga 127 na SAM numer katalogowy (100 wol., poz. 1), trzecia **zero**. Karty PN to loteria.
  - SERP na `zd4a042-30em00ez`: dziesięć sklepów z PN w URL-u, ruch mają pozycje 1–3 (Ceneo 112), a **od czwartej w dół zero — łącznie z morele.net (DR 75)**.
  - **Kluczowe odkrycie: `/instrukcje/zebra-zd421t` już jest na 9. pozycji na „zebra zd421t"** — wyżej niż karta zebrasklepu (7). Mamy gotowy przyczółek.
- Decyzja: **jedna karta na wariant modelu**, numery katalogowe jako wybór wewnątrz karty + w danych strukturalnych (`ProductGroup` / `hasVariant` z `mpn`), żeby łapać long tail bez rozdrabniania mocy na dziewięć słabych adresów.
- Skorygowane wcześniejsze ostrzeżenie o kanibalizacji z takmą: między RÓŻNYMI domenami to dużo słabszy efekt niż w obrębie jednej. Realne ryzyko to zduplikowana treść — dlatego opis na serwis-zebry pisany z pozycji serwisu („co wiemy o tym modelu z warsztatu", z medianą naprawy 455 zł netto z naszych danych), a nie kopia z takmy.
- Utrzymanie okazało się tańsze, niż zakładałem: `/api/shop/product-stock` w serwis-zebry ciągnie **live ceny i stany z Ingrama, Jarltecha i BlueStara** — ta sama maszyneria co w takmie, działa po SKU, więc urządzenia obsługuje bez zmian.
- **Nowa gałąź `/sklep/drukarki-etykiet`** jako statyczny segment — ma pierwszeństwo przed `[...slug]` obsługującym części, więc czterosegmentowy routing katalogu części zostaje nietknięty (zweryfikowane: `/sklep/glowice` dalej 200).
- `DevicePurchasePanel`: wybór PN → osobne zapytanie o cenę i stan dla tego numeru, osobna pozycja w koszyku (`variant_pn`).
- Link z instrukcji do karty (mapa `SPRZEDAWANE_MODELE`, żeby nie linkować w pustkę) — to strona z pozycją 9 przekazuje moc nowej karcie.
- Testy: karta 200, cena live **1678,19 zł netto** pobrana z Ingrama (baza miała 1648,81 — potwierdza, że live ma sens), „Dostępny", sześć wariantów PN, link do instrukcji obecny, mobile 390 px bez poziomego scrolla, katalog części nietknięty. Build ✓, tsc EXIT=0.
- Produkt w bazie: `zebra-zd421t`, id `00d64652-ff55-4aa7-9b78-5c50c93da8f6`, `product_type='drukarka'`.
- **Poprawki po przeglądzie karty ZD421t:**
  - Zdjęcia z repo takma (`zd421t_1/2/3`), przekonwertowane PNG → WebP: **1,1 MB → 100 KB**. Galeria z miniaturami, pierwsze zdjęcie ładowane priorytetowo.
  - Usunięta sekcja „Numery katalogowe" pod opisem — te same PN-y są w wyborze wersji obok, dublowanie bez wartości.
  - **Przepisany opis.** Poprzednia wersja otwierała się zdaniem „ZD421t jest jednym z najczęściej serwisowanych przez nas urządzeń", czyli na karcie sprzedażowej informowała, że sprzęt często się psuje — argument PRZECIW zakupowi. Teraz: „Do czego się nadaje" (gdzie stoi, dlaczego druk z taśmą trwalszy, wymiana rolki bez narzędzi) i „Którą wersję wybrać" (203 vs 300 dpi, USB vs Ethernet vs Wi-Fi) — językiem klienta, bez żargonu.
- **Karta przebudowana na wzorzec kart części** (uwaga usera). Wcześniej miała własny układ — duża galeria po lewej i przyklejony panel po prawej — czyli wyglądała jak wklejka z innego sklepu. Teraz 1:1 wzorzec z `/sklep/[...slug]`: `ShopSubheader` z okruszkami i koszykiem, `max-w-5xl`, zdjęcie w białej ramce `md:w-80 lg:w-96` z miniaturami pod spodem, po prawej biała karta z nazwą, linią „PN:", ceną netto i brutto, stanem magazynowym z kolorową kropką („Magazyn EU: 1456 szt. — wysyłka 2-3 dni") i **limonkowym przyciskiem `#A8F000` „Do koszyka"** ze stepperem ilości. Sekcje niżej w tej samej stylistyce, ze „Specyfikacją" z ikoną i tabelą wiersz-po-wierszu.
- Wybór wersji wpięty w panel jako siatka 2×3 kafelków (nie lista radiobuttonów), więc mieści się nad ceną i nie rozpycha karty. Po zmianie wersji zmienia się PN w nagłówku, cena i stan.
- Osobny `DeviceGallery` usunięty — zdjęcia obsługuje panel, tak jak `figure` na kartach części.
- „Dostępne wersje" wróciły na dół jako tabela w stylu specyfikacji — tym razem świadomie, dla łapania zapytań o konkretny PN w treści strony (wcześniej dublowały listę radiobuttonów tuż obok, teraz są w innym miejscu i innej formie).
- **Wybór wariantu przeniesiony z panelu do tabeli „Dostępne warianty"** (wzorzec z takma.com.pl). Kafelki w panelu ukrywały to, co przy tym produkcie jest najważniejsze — różnice CEN między wersjami sięgają 700 zł, a widać było tylko jedną naraz. Tabela: Part Number, Rozdzielczość, Ethernet, Wi-Fi, Cena netto, Magazyn (z kropką PL/EU), Status (pigułka) i „+ Koszyk" w każdym wierszu, plus rozwijacz „Pokaż niedostępne warianty (N)".
- Ceny i stany pobierane per PN równolegle dla wszystkich wariantów; niedostępne schowane pod rozwijaczem. Panel na górze pokazuje teraz „od {najtańsza} zł netto" i kieruje kotwicą do tabeli.
- Zweryfikowane na żywych danych: 5 z 6 wariantów dostępnych, ceny od 1678,19 do 2365,72 zł netto — potwierdza sens rozbicia cen per wariant zamiast jednej ceny „od".

## 2026-08-25 — Karta ZD421t dopracowana na podstawie badań UX
- Research: Baymard (25 rund testów, 4400 sesji, 30 tys. ocenionych kart), Stanford Web Credibility (Fogg, 2684 uczestników), Gartner B2B, metaanaliza porzuceń koszyka (50 badań), EAA/WCAG 2.1 AA, badania o paraliżu wyboru (Iyengar & Lepper + metaanaliza Scheibehenne).
- **Wdrożone luki, każda z podpartą liczbą:**
  - **Termin dostawy jako DATA** („u Ciebie do piątku 28 sierpnia") zamiast „wysyłka 2-3 dni" — 41% sklepów podaje szybkość zamiast daty. `lib/delivery-date.ts` liczy w dniach roboczych: magazyn PL → następny dzień roboczy (po 14:00 kolejny), EU → 3 dni robocze.
  - **Koszt dostawy na karcie** — szuka go 64% użytkowników, 43% sklepów nie pokazuje. Extra koszty to przyczyna nr 1 porzuceń (39%).
  - **Polityka zwrotów** z linkiem do §16 — 60% szuka jej na karcie, 15% porzuca zamówienie przez jej brak. Sformułowanie ZGODNE Z REGULAMINEM: prawo odstąpienia dotyczy konsumentów i przedsiębiorców na prawach konsumenta, więc nie obiecujemy zwrotu każdej firmie.
  - **Gwarancja realizowana u nas** — trust seals działają najmocniej przy drogich koszykach i mniej doświadczonych kupujących, a to nasz przypadek.
  - **„Najczęściej wybierana"** przy najtańszym wariancie — przeciwwaga dla paraliżu wyboru. Metaanaliza Scheibehenne pokazuje, że efekt jest silny dokładnie tam, gdzie opcje są porównywalne, stawka wysoka, a kupujący bez wiedzy eksperckiej — czyli sześć wariantów ZD421t różniących się o ~700 zł.
  - **Wymiary 206 × 280 × 179 mm** i prędkość druku w specyfikacji — 42% użytkowników próbuje ocenić rozmiar ze zdjęcia.
- **Dostępność (EAA obowiązuje od 28.06.2025)**: `scope="col"` na wszystkich 8 nagłówkach tabeli, `aria-live` przy dodaniu do koszyka, wszystkie obrazy z alt, jeden H1, zero przycisków bez nazwy. Zweryfikowane automatem.
- **Świadomie NIE wdrożone**: sztuczna presja („ostatnie sztuki") — przy stanie 1456 szt. byłaby kłamstwem, a UOKiK w 2025 nałożył ponad 1,15 mld zł kar i buduje narzędzia AI do wykrywania dark patterns (75,7% badanych polskich stron ma co najmniej jeden). Wishlisty — 21% jej używa, ale nie przy jednorazowym zakupie drukarki. Opinii produktowych — nie mamy prawdziwych.

## 2026-08-26 — SEO karty ZD421t vs konkurencja z czołówki SERP
- **Analiza pozycji 1–7 dla „zebra zd421t"**: bcmarket (DR 28, poz. 1) — nisza „dla szkół", opis ~350 słów, schema, brak FAQ; strefadrukarek (DR 36, poz. 3) — **~2100 słów**, H2/H3, 7 zdjęć, opinie, linki do własnych poradników, raty; ceneo (DR 82, poz. 4); gento (DR **0**, poz. 6) jedną kartą „opcje do wyboru"; zebrasklep (DR 6, poz. 7). Autorytet domeny nie decyduje — decyduje dopasowanie strony do zapytania.
- **Najważniejsze odkrycie: SERP na „zebra zd421t" ma MIESZANĄ intencję.** Na pozycji 2 stoi strona wsparcia technicznego zebra.com, a Google pokazuje pytania „Jakie sterowniki są potrzebne", „Jak skonfigurować", „Jak skalibrować". To tłumaczy, dlaczego nasza `/instrukcje/zebra-zd421t` jest tam na 9. miejscu, a większość sklepów wypada niżej — one odpowiadają tylko na połowę zapytania.
- Wdrożone: **sekcja FAQ odpowiadająca dokładnie na te pytania** (sterowniki, kalibracja, diody, różnica t vs d, projektowanie etykiet), każda z linkiem do NASZEGO poradnika — mamy je wszystkie napisane, czego nie ma żaden sklep w czołówce. Do tego **FAQPage schema** i **BreadcrumbList schema**.
- Treść urosła z **479 do 703 słów** bez lania wody (konkurent z poz. 3 ma ~2100 — jest zapas na dalszą rozbudowę).
- Title przepisany na język SERP-u: „Zebra ZD421t 203/300 dpi — drukarka etykiet od 1 678 zł netto" (61 zn.). Meta description bez zdania o awaryjności, z wysyłką 24 h i autoryzowanym serwisem.
- Pięć nowych linków wewnętrznych do poradników — działają w obie strony: wzmacniają kartę i poradniki.

## 2026-08-26 — Faza 1 katalogu akcesoriów: rodzina ZD411 / ZD421 / ZD621
- **Punkt wyjścia z analizy danych**: żadna strona `/sklep/` nie jest w top 20 serwisu wg ruchu — cały ruch (~500 wizyt/mies.) idzie na `/sterowniki`, `/instrukcje/*` i poradniki. Frazy typu „części do drukarek zebra", „głowica drukująca zebra", „wałek dociskowy zebra" mają w Ahrefs **0 wyszukiwań w PL**. Wniosek: katalogu nie rozbudowujemy pod SEO, tylko podpinamy pod ruch, który już mamy.
- **Luka wobec takmy**: 314 pozycji akcesoriów u nich vs 122 u nas; kategorie, w których mieliśmy **zero**: gilotyny (16), dyspensery (18), moduły łączności (18), nawijaki (4).
- **Dodane 11 produktów** (skrypt `scripts/dodaj-akcesoria-zd4xx.mjs`, idempotentny — ponowne uruchomienie aktualizuje zamiast dublować): gilotyny ZD421t/ZD621t, dyspensery ZD421t/ZD621t/ZD421d+ZD621d, moduły Ethernet/RS-232/Wi-Fi+BT, moduły baterii t i d oraz samo ogniwo. Opisy pisane z perspektywy warsztatu (kiedy się opłaca, co się psuje), nie przepisane z takmy — inna intencja, brak kanibalizacji.
- **Trzy nowe typy w `lib/shop-categories.ts`**: `gilotyna` → `/sklep/gilotyny`, `dyspenser` → `/sklep/dyspensery`, `modul` → `/sklep/moduly-lacznosci`; do `akumulator` doszła kategoria „drukarki biurkowe" (ZD421/ZD621). Sitemap i `/sklep` biorą je automatycznie. Poprawka przy okazji: `typeLabel` w metadanych brał się z drabinki ifów i dla nieznanego typu wypisywał „Akumulatory" — teraz `productType.namePlural`.
- **Cena z magazynu EU (`app/api/shop/product-stock`)**: gdy Ingram nie zwraca ceny, karta pokazywała **0 zł**. Dołożony fallback — cena z BlueStara/Jarltecha w euro × kurs NBP × marża, z pominięciem Jarltecha, gdy `priceQuantity > 1` (jego `unit_price` bywa ceną pakietu). Kurs wyjęty do `lib/nbp.ts`. Odpowiedź niesie teraz `price_source: ingram | eu | none`.
- **Zabezpieczenie, które wyszło z testów**: fallback zaczął zapisywać do bazy ceny przeliczone z euro (o ~3% wyższe) w miejsce cen Ingrama. Zapis z ceny EU jest teraz blokowany dla towarów, które Ingram kiedykolwiek wycenił (`attributes.ingram_price_with_margin`). 12 rozjechanych rekordów przywrócone.
- **Ingram był 26.08 niedostępny przez większość prac** (`429`, potem `Internal Server Error`, na końcu `HTTP 503 — IM24portal`). Po jego powrocie sprawdzone: **Ingram ma w katalogu WSZYSTKIE 11 akcesoriów**, indeksowane własnym numerem z prefiksem ZB (`ZBP1112640-230` itd.). Wcześniejszy wniosek „Ingram ich nie ma" był błędny — brał się z odpytywania przy leżącym API, a potem z sondy pytającej surowym numerem producenta, bez rozwinięcia formatów.
- **Ceny mimo to zostają bez zmian** — BlueStar jest przy każdym z tych 11 numerów minimalnie tańszy od Ingrama (np. gilotyna: 545,05 zł vs 555,53 zł; bateria: 1 297,72 zł vs 1 312,34 zł), więc `selectPurchasePrice` i tak wybiera jego. Zmienia się tylko uzasadnienie fallbacku: to nie łatka na brak w katalogu Ingrama, lecz zabezpieczenie na czas jego awarii.
- **Cross-sell `components/shop/DeviceAccessories.tsx`** w dwóch miejscach:
  - **karta drukarki** — „Do tej drukarki": wyposażenie dodatkowe + części eksploatacyjne;
  - **`/instrukcje/{model}`** — „Części i akcesoria do Zebry X" z odnośnikiem do zgłoszenia naprawy. To najlepiej rankujące strony w serwisie (ZD421t poz. 2, ZT230 poz. 1), a czyta je ktoś, kto ma to urządzenie w ręku.
- **Dopasowanie po `device_model`, nie po `compatible_models`** (`lib/device-accessories.ts`) — to drugie pole bywa w bazie wpisane szeroko (głowica ZD421d ma na liście ZD421t), a pomyłka termik/termotransfer kończy się zwrotem. Token bez litery („ZD421" w zasilaczu „ZD411 / ZD421 / ZD621") = część wspólna dla obu wersji. Zweryfikowane: ZD421t dostaje warianty t, ZD421d warianty d.
- **Przełącznik 203/300 dpi** przy częściach eksploatacyjnych — do wersji 300 dpi pasuje wyłącznie głowica 300 dpi, a różnica w cenie to dwukrotność (485 vs 988 zł).
- **Feed Google Merchant** rozszerzony o trzy nowe typy: 88 → 99 pozycji.
- Poprawione dane: zasilacze P1079903-026 i P1117258-012 miały w bazie zdjęcie **innego** produktu (P1080383-704). **Zostaje do zrobienia**: P1025950-042 (GK420/GT800/ZD410) nadal ma cudze zdjęcie — nie ma poprawnego pliku ani u nas, ani na takmie.

## 2026-08-26 — Ceny i stany z crona zamiast na żywo (wzorzec z takmy)
- **Powód**: sklep pytał API trzech dystrybutorów przy KAŻDYM renderze. Karta ZD421t to 1 panel + 6 wariantów + 11 akcesoriów = **18 zapytań na odsłonę**, każde do Ingrama (rozwijany w 3 formaty), BlueStara i Jarltecha. Lista kategorii z 54 głowicami — jeszcze więcej. Stąd `429 Too Many Requests` od Ingrama, a przy jego awarii (`503 IM24portal`) karty pokazywały zera.
- **Sprawdzone, jak działa takma** (repo tylko do odczytu, nic tam nie zmieniane): crony `jarltech-sync` 5:00 i `stock-sync` 6:00 **i 13:00**, paczki po 10 PN z przerwą 2 s, `Promise.allSettled`, wynik scalany do tabeli `StockCache`, front czyta wyłącznie cache z limitem 24 h.
- **Przeniesione do serwis-zebry:**
  - `supabase-stock-cache.sql` — tabele `stock_cache` i `stock_sync_log`, RLS bez polityk (tylko service role). **DO URUCHOMIENIA w Supabase.**
  - `app/api/cron/stock-sync/route.ts` — trzej dystrybutorzy, paczki po 10, `allSettled`, kolejka „najpierw bez ceny, potem najdawniej odświeżane", przerwanie 20 s przed `maxDuration` z zapisem logu, `?limit=N` do ręcznego testu. Zbiera SKU produktów **oraz** numery wariantów urządzeń z `attributes.variants`.
  - `lib/price-selection.ts` — bezpiecznik cenowy.
  - `vercel.json` — cron 6:00 i 13:00.
  - `/api/shop/product-stock` czyta `stock_cache` (ważność 24 h); do dystrybutorów schodzi tylko przy braku wpisu lub przeterminowaniu i **zapisuje wynik z powrotem** (write-through). Kształt odpowiedzi bez zmian, więc 8 komponentów działa bez przeróbek; doszły pola `cached`, `availability`, `delivery_text`, a `price_source` nazywa teraz konkretnego dystrybutora zamiast ogólnego „eu".
- **Poprawka wobec oryginału z takmy** (u nich zostaje jak było): stara reguła porównywała Ingrama z **najtańszym** źródłem, więc jedno źródło z ceną pakietu przegłosowywało dwa zgodne — przy 24 / 2 / 23,10 zł uznawała za błędnego Ingrama i wybierała **2 zł, czyli 1/12 kosztu**. Teraz przy trzech źródłach odnosimy każde do **mediany** (odporna na jednego wariata), przy dwóch bierzemy tańsze i zgłaszamy do przejrzenia, bo orzec się nie da.
- **Drugi bezpiecznik, historyczny**: spadek ceny zakupu o ponad 60% wobec poprzedniego przebiegu jest odrzucany, zostaje poprzednia cena, numer trafia do `stock_sync_log.suspect_prices`. To dokładnie scenariusz taśm z czerwca (03300GS08407: 0,85 zł przy koszcie 2 EUR).
- **Testy**: `npx tsx scripts/test-price-selection.ts` — 9 przypadków z realnych wpadek (błąd pakietowy w obie strony, tablet Ingrama za 164 922 zł, sam magazyn EU, brak cen), wszystkie przechodzą.
- Sprawdzone, że **kolejność wdrożenia nie ma znaczenia**: bez tabeli `stock_cache` odczyt zwraca pustkę i strona po cichu schodzi na ścieżkę live, tak jak dotąd.
- `sync-ingram` (katalog CSV, co 6 h) zostaje bez zmian — pisze do `products.price`, czyli do wartości pokazywanej w SSR zanim dojdą dane z cache. Po ustabilizowaniu `stock-sync` można go wygasić.

## 2026-08-26 — Wdrożenie audytu SEO/UX karty ZD421t
Źródło: `~/Documents/Codex/2026-08-26/ma/outputs/zd421t-audyt-seo-ux-ui.md`. Wdrożone P0 w całości + trzy pozycje z P1.

**P0 — naprawy zgodności, bez testów A/B**
- **Ceny i stany podawane serwerowo** (`lib/stock-server.ts`, czyta `stock_cache`). Wcześniej karta dociągała je dopiero JavaScriptem, więc w początkowym HTML-u i w danych strukturalnych nie było ani ceny, ani dostępności. To jest bezpośredni zysk z przeniesienia crona ze stock-sync.
- **`ProductGroup` przepisany**: każdy wariant ma `url` (`?pn=`), `additionalProperty` z rozdzielczością i łącznością, `image`, a `Offer` — realną `price`, `availability` liczoną ze stanu, `priceValidUntil`, `shippingDetails` (25 zł) i `hasMerchantReturnPolicy` (14 dni, §16). **Gdy ceny nie znamy, oferta jest pomijana** zamiast deklarować puste `InStock` — rozjazd z tym, co widzi klient, jest gorszy niż brak rich resultu.
- **`variesBy` usunięte.** Realne osie różnicy to DPI i łączność, a Google obsługuje w tym polu zamkniętą listę właściwości, w której ich nie ma. Poprzednia wartość `model` niczego nie opisywała.
- **Adresowalne stany wariantów**: `?pn=ZD4A043-30EW02EZ` otwiera kartę z tym numerem w panelu zakupu, wyróżnionym wierszem tabeli i CTA „Przejdź do zakupu". Canonical zawsze wskazuje czysty adres karty, więc indeks się nie mnoży.
  - **Poprawka po zgłoszeniu**: wariant wskazany w adresie wpadał do grupy „na zamówienie" i był chowany pod rozwijaczem, więc wyróżnienia nie było widać. Teraz pokazujemy go ZAWSZE, niezależnie od stanu, z etykietą „wybrana wersja" i niebieską obwódką. Rozwijacz liczy tylko pozostałe niedostępne, żeby po rozwinięciu dało się listę zwinąć z powrotem.
  - Wyróżnienie oznaczamy atrybutem `data-wariant-wybrany`, nie `id` — ten sam wariant istnieje jednocześnie w karcie mobilnej i w wierszu tabeli, a dwa elementy z tym samym `id` to niepoprawny HTML (zweryfikowane: 0 duplikatów `id` na stronie). Przewijanie do wariantu wybiera ten z dwóch, który jest w danym momencie widoczny.
  - **Druga poprawka po zgłoszeniu — brakowało czym ten stan wywołać.** Parametr `?pn=` był adresowalny dla Google, ale człowiek musiałby wpisać go ręcznie w pasku adresu; na stronie nie było żadnego elementu, który by taki link tworzył. Nowy `components/shop/DeviceBuyBlock.tsx` spina panel zakupu z tabelą wokół wspólnego wyboru: **kliknięcie wiersza (lub karty na telefonie) wybiera wersję**, panel od razu pokazuje jej cenę, termin i PN, a adres dopisuje się sam przez `history.replaceState` — bez przeładowania, bo dane wszystkich wariantów są już na stronie. Ponowne kliknięcie zdejmuje wybór i wraca do widoku „od X zł".
  - Dostępność: w każdym wierszu radio z `aria-label`, więc wybór działa też z klawiatury; `stopPropagation` na przycisku koszyka, żeby zakup nie zmieniał wyboru.
  - Zweryfikowane w przeglądarce: klik → `?pn=ZD4A043-30EE00EZ`, panel 1 643,63 zł → 2 316,96 zł, etykieta „wybrana wersja", radio zaznaczone, CTA „Przejdź do zakupu"; drugi klik czyści adres; klik w „Koszyk" nie rusza wyboru. Mobile tak samo, dokument nadal 390 px.
- **`og:image` i `twitter:card`**; meta description skrócony 195 → 164 zn.
- **Cele dotykowe 44 px** we wszystkich przyciskach sekcji wariantów (zmierzone: 6× 44 px). WCAG wymaga 24 px, ale to za mało na kciuk.

**P1 — największy wpływ na decyzję**
- **Osobny układ mobilny wariantów.** Tabela miała ~929 px przy ekranie 390 px; teraz poniżej `sm` każdy wariant to karta z kompletem danych (PN, dpi, Ethernet, Wi-Fi, magazyn, cena, status) i pełnym przyciskiem. Zmierzone: dokument 390 px, zero przewijania w bok, tabela ukryta, 5 kart. Benchmark Baymarda: przeciętne lub gorsze doświadczenia rosną z 52% na desktopie do 62% na mobile, więc samo zwężenie tabeli nie wystarcza.
- **Akcesoria przeniesione POD poradnik doboru.** Kolejność sekcji: wybór PN → do czego się nadaje → którą wersję wybrać → akcesoria → FAQ → specyfikacja.
- **Druga kotwica cenowa**: obok ceny „od" pokazujemy cenę wersji najczęściej wybieranej. Sama najniższa cena myli kupującego, który potrzebuje Ethernetu albo Wi-Fi — najtańsza wersja ich nie ma.
- **Wariant na zamówienie nie kończy ścieżki** — po rozwinięciu dochodzi zdanie z linkiem do kontaktu i obietnicą sprawdzenia terminu u dystrybutora.

**ZALEŻNOŚĆ**: oferty w schema pojawią się dopiero po uruchomieniu `supabase-stock-cache.sql` i pierwszym przebiegu `/api/cron/stock-sync`. Do tego czasu karta działa normalnie (ceny dociągane w przeglądarce), ale `Offer` jest świadomie pomijana.

**Z audytu NIE wdrożone, świadomie**
- Dodanie urządzeń do feedu Merchant Center — dziś feed obejmuje tylko części, więc rozjazdu nie ma; osobne konto GMC dla serwis-zebry i tak jest pending.
- Sekcja „co jest w pudełku" i karta katalogowa — wymagają potwierdzonych danych o zawartości zestawu, a tych nie zmyślam.
- Galeria portów, skali i zakładania taśmy — potrzebne nowe zdjęcia.
- Zweryfikowane opinie i wdrożenia — nie mamy jeszcze materiału.

## 2026-08-26 — Poziome przewijanie: trzy osobne przyczyny
Zgłoszenie dotyczyło paska przewijania pod tabelą wariantów. Pomiary wykazały trzy niezależne źródła, w tym dwa istniejące od dawna na KAŻDEJ stronie serwisu.

1. **Tabela wariantów** miała 1011 px przy kontenerze 990 px — niezależnie od szerokości okna, bo artykuł jest `max-w-5xl`. Największym winowajcą była pierwsza kolumna (319 px), rozepchana plakietką stojącą w jednej linii z numerem katalogowym. Naprawione: plakietka pod numerem, osiem kolumn zredukowane do sześciu (Ethernet + Wi-Fi → „Łączność", Magazyn + Status → „Dostępność", „Rozdzielczość" → „DPI"), nagłówki bez `uppercase tracking-wider`. Wynik: **990 px w kontenerze 990 px, bez przewijania**.
2. **Nagłówek** — dwanaście linków nawigacji ma łącznie 821 px, a z logo (368 px) nie mieszczą się w wierszu poniżej 1280 px. Efekt: poziomy pasek na całym serwisie w zakresie 768–1180 px. Naprawione: pełna nawigacja od `xl`, poniżej hamburger (wcześniej `md`). Zmiana w `components/Header.tsx` **i** w zdublowanym nagłówku wewnątrz `app/page.tsx`.
3. **Paginacja bloga** — „← Poprzednia" + pięć numerów + „Następna →" to 415 px przy telefonie 390 px. Naprawione: `flex-wrap`.
Przy okazji: ozdobny napis „SERWIS ZEBRA" (1798 px) w stopce i na stronie głównej dostał `overflow-hidden` na kontenerze.

**Wniosek metodyczny, ważniejszy od samych poprawek**: pomiary Playwrightem na serwerze deweloperskim są niewiarygodne. Next generuje CSS na żądanie — po zimnym starcie serwowany arkusz miał 40 KB i **nie zawierał nawet reguły `.hidden`**, więc oba układy tabeli renderowały się naraz, a wideo na stronie głównej wystawało poza ekran. Ten sam zestaw testów dawał raz 0 błędów, raz 10. Arkusz produkcyjny ma 125 KB. **Pomiary layoutu robić wyłącznie na `next build` + `next start`** (u nas na porcie 3003, żeby nie ruszać deva).

Weryfikacja na buildzie produkcyjnym: 7 stron × 7 szerokości (360–1440) → **0 przypadków poziomego przewijania**. Karta ZD421t: przy 390 px tabela ukryta i 5 kart wariantów, przy 1280 px tabela 990 px i karty ukryte.

## 2026-08-26 — stock_cache uruchomiony na produkcyjnych danych
SQL wykonany przez użytkownika, cron przepuszczony.

- **Pełny przebieg: 135/135 numerów, 135 z danymi, 0 błędów, 142 s** (mieści się w `maxDuration 300`). Ceny: BlueStar 111, Ingram 22, Jarltech 2. Dostępność: 101 dostępnych, 4 w dostawie, 31 niedostępnych. Magazyn PL ma 24 pozycje, w drodze 90.
- **Odczyt karty schodzi do bazy** — `/api/shop/product-stock` odpowiada w ~0,09-0,13 s z `cached: true`, zamiast czekać na trzech dystrybutorów.
- **Dane strukturalne kompletne**: sześć wariantów ZD421t ma realne ceny brutto, `url`, dostawę i politykę zwrotów, a wariant bez stanu (`ZD4A043-30EW02EZ`) dostaje **`OutOfStock`** zamiast doklejonego `InStock` — dokładnie to, czego wymagał audyt.

**Dwie poprawki wymuszone pierwszym przebiegiem:**
1. **Ingram zwracał `429` na obie paczki** i wypadał z zestawienia. To on jest JEDYNYM źródłem stanu magazynu PL, więc bez niego cały sklep pokazywałby „wysyłka 2-3 dni" zamiast 24 h. Dodane ponawianie (3 próby, odczekanie 8 s × numer próby) i odstęp między paczkami podniesiony z 2 s na 5 s. Po zmianie: 20/20 znalezionych, zero błędów dystrybutorów.
2. **Kontrakt serwisowy (`KTR-3Y`) trafiał do synchronizacji** — usługa nie ma numeru u żadnego dystrybutora, więc zawsze kończyła się wpisem „Brak danych". Typy `kontrakt` i `usluga` wykluczone z puli.

**Nowy parametr `?pn=A,B,C`** — punktowe odświeżenie wskazanych numerów (np. po zmianie ceny u dystrybutora) bez przepuszczania całej puli. Obok istniejącego `?limit=N`.

## 2026-08-26 — Przyciski kontaktu pod panelem zakupu (karta urządzenia)
- Pod ramką panelu (nie w niej — zakup to jedna ścieżka, pytanie druga) doszły: **„Zapytaj o produkt"** zawsze oraz **„Zadzwoń: 601 619 898"** tylko poniżej `sm`, bo na desktopie `tel:` przeważnie nic nie robi. Oba 48 px wysokości, oba z zdarzeniami do GA (`trackCTAClick`, `trackPhoneClick`).
- **Zapytanie niesie kontekst**: `/kontakt?temat=urzadzenie&model=…&pn=…`, gdzie `pn` to **aktualnie wybrany wariant**, nie domyślny. Formularz wypełnia się sam, handlowiec dostaje model i numer katalogowy bez przepisywania przez klienta. Nowy temat `Pytanie o urządzenie` dodany do presetów i do listy `<select>`.
- **Dwa błędy złapane w trakcie weryfikacji, oba moje:**
  1. Ustawiałem temat na `„Pytanie o urządzenie — <model>"`, a temat to `<select>` z zamkniętą listą — wartość spoza niej zostawiała pole PUSTE, a jest `required`, więc formularz nie dałby się wysłać. Model przeniesiony do treści, temat trzyma się listy opcji.
  2. Dane urządzenia doklejały się na końcu wiadomości, czyli pod „Pytanie:", przez co linia na pytanie klienta wisiała w powietrzu. Wstawione zaraz po powitaniu rozbijały z kolei zdanie „Dzień dobry, mam pytanie o…". Ostatecznie idą osobnym akapitem między zdaniem wprowadzającym a listą pytań (`wstawKontekst`).
- Sprawdzone na buildzie produkcyjnym: telefon widoczny tylko na 390 px, „Zapytaj" na wszystkich; stary temat `?temat=glowice` bez regresji; 4 strony × 6 szerokości → 0 poziomego przewijania.

## 2026-08-26 — „Zapytaj o produkt" jako modal na karcie
Zamiast przenoszenia na `/kontakt`: klient pyta w chwili wahania, patrząc na cenę i wybrany wariant. Przerzucenie na osobną stronę kosztuje ten kontekst i część ludzi nie wraca.

- `components/shop/DeviceEnquiryModal.tsx` + `app/api/device-enquiry/route.ts` (Resend, wzorzec z `program-glowice`). Mail idzie na serwis@takma.com.pl z `replyTo` klienta i **wybranym numerem katalogowym w temacie** — handlowiec wie, o którą z sześciu wersji chodzi, bez dopytywania.
- **Mobile potraktowany jako osobny układ, nie zwężony desktop:**
  - arkusz wysuwany od dołu (`items-end`) z uchwytem — kciuk sięga dołu ekranu, nie środka;
  - `max-h-[92dvh]`, nie `vh` — przy `vh` klawiatura zasłania dół formularza bez możliwości dojścia;
  - **przycisk wysyłki przyklejony do dołu arkusza** (`sticky bottom-0`, na desktopie `static`). Zmierzone przed zmianą: treść 747 px w oknie 611 px na iPhonie 13, więc „Wyślij pytanie" wypadał poza ekran. Po zmianie widoczny od razu na iPhone SE (568 px), iPhone 13 (664 px) i Pixel 7 (839 px);
  - pola 16 px czcionki — przy mniejszej iOS sam przybliża stronę przy wejściu w input;
  - link „Wolisz zadzwonić?" w środku modala, tylko poniżej `sm`.
- **Dostępność**: `role="dialog"`, `aria-modal`, `aria-labelledby`, Escape, blokada scrolla tła, fokus na pierwsze pole przy otwarciu i powrót na przycisk przy zamknięciu, pułapka fokusu w obie strony.
- **Błąd złapany pomiarem**: pułapka fokusu nie działała — `querySelectorAll` zwracał też link „zadzwoń", ukryty na desktopie przez `sm:hidden`, i to on był „ostatni w kolejce". Warunek zawinięcia nigdy nie zachodził, fokus uciekał poza modal **8 razy na 12 Tabów**. Po filtrze `offsetParent !== null`: 0/14 Tabów i 0/8 Shift+Tabów poza modalem, na desktopie i na telefonie.
- Walidacja endpointu po polsku również dla pustego żądania (Zod dla brakującego pola daje komunikat angielski — ciało domykane pustymi ciągami przed `parse`).
- Preset `?temat=urzadzenie` w `/kontakt` zostaje — działa jako zapasowa droga i dla linków z zewnątrz.

## 2026-08-26 — BŁĄD: panel pokazywał numer jednego wariantu z ceną innego
Zgłoszone przez użytkownika: karta pokazywała `ZD4A042-30EM00EZ` za 2229,65 zł i 3 szt., podczas gdy to dane wersji Wi-Fi `ZD4A042-30EW02EZ`. Prawidłowo EM00EZ to 1642,41 zł i 1536 szt.

**Przyczyna**: `DevicePurchasePanel` trzymał odpowiedź z `/api/shop/product-stock` w stanie `live` bez informacji, KTÓREGO numeru dotyczy. Po kliknięciu innego wariantu `pn` się zmieniał, ale stary `live` przeżywał i miał pierwszeństwo przed danymi serwerowymi — do czasu, aż wróci nowa odpowiedź. Gdyby zapytanie padło, rozjazd zostawałby na stałe. To samo dotyczyło odpowiedzi wracających w innej kolejności, niż zostały wysłane.

**Poprawka**: dane live trzymane razem z numerem (`{ pn, dane }`) i używane tylko wtedy, gdy `live.pn === pn`. Tabela wariantów była odporna, bo trzyma mapę kluczowaną numerem.

**Weryfikacja** — szybkie przełączanie tam i z powrotem, cena w panelu vs cena w tabeli: 4/4 ZGODNE (2229,65 / 1642,41 / 2315,24 / 1642,41).

**Przy okazji rozbicie stanu EU dla ZD4A042-30EM00EZ**, bo pytanie brzmiało „czemu 3 szt., skoro Jarltech ma 441": BlueStar 906 + Jarltech 441 + Ingram DE 189 = **1536**. Karta sumuje trzech dystrybutorów, więc pokazuje więcej niż każdy z osobna — 441 z Jarltecha jest w środku.

## 2026-08-26 — Porządki na karcie ZD421t (uwagi użytkownika)
- **Usunięta sekcja „Do czego się nadaje"**.
- **Nowa sekcja „Dokumentacja i wsparcie"** zamiast luźnego przycisku doklejonego do opisu: instrukcja po polsku, sterowniki, poradnik pierwszego uruchomienia, telefon do technika. Kupujący sprzęt techniczny sprawdza przed zakupem, czy dostanie wsparcie, a instrukcje i sterowniki to nasze najlepiej rankujące strony — link stąd wzmacnia je w obie strony.
- **„Do tej drukarki" → „Akcesoria"**, bez zdania wprowadzającego. Przy „Częściach eksploatacyjnych" został sam nagłówek.
- **Kafelek akcesorium**: przycisk „Do koszyka" dosunięty do prawej krawędzi (`justify-between`, 13 px od krawędzi na każdej szerokości), powiększony do `px-3 py-2`.
- **Naprawione brakujące zdjęcia**: 64 ze 131 produktów nie ma `image_url` w bazie. Karty części od dawna wyliczają ścieżkę z modelu i rozdzielczości (`getProductFallbackImage`), ale blok akcesoriów brał `image_url` wprost z zapytania i zostawiał pustą ramkę. Teraz stosuje ten sam fallback; gdy i on nie trafi, zamiast pustego pola jest ikona — pusta ramka wygląda jak błąd ładowania.
- **Kolejność sekcji zależna od kontekstu** (to była otwarta wątpliwość użytkownika):
  - **karta produktu → Akcesoria, potem Części eksploatacyjne.** Klient kupuje NOWĄ drukarkę; istotne jest wyposażenie dobierane przy zakupie (gilotyna, odklejak, moduł sieciowy), a głowica będzie potrzebna dopiero za rok. Nagłówek sekcji brzmi „Akcesoria", więc lista części nad nim byłaby niespójna.
  - **strona instrukcji → Części eksploatacyjne, potem Akcesoria.** Ten czytelnik ma urządzenie od dawna i zwykle coś w nim nie działa.
- **Ostrzeżenie o rozdzielczości wróciło** (decyzja użytkownika): „Głowica i wałek muszą mieć tę samą rozdzielczość co drukarka — części 203 i 300 dpi nie są wymienne". Jako jedna linia `text-xs` pod przełącznikiem dpi, wyłącznie gdy model ma obie rozdzielczości. Przełącznik pokazuje, ŻE wybór istnieje, ale nie mówi, czym grozi pomyłka — głowica 300 dpi to 988 zł i do drukarki 203 dpi nie pasuje.

## 2026-08-26 — Drugie przypomnienie o opinii (gotowe, WYŁĄCZONE)
`app/api/cron/review-reminder/route.ts` + `lib/review-notes.ts` + `supabase-review-reminder.sql` (SQL wykonany). **Cron celowo NIE dodany do `vercel.json`** — nic nie wysyła do decyzji użytkownika.

**Założenie**: drugi mail nie powtarza prośby, tylko pyta „Czy {model} pracuje bez zarzutu?". Powody: powtórzona prośba czyta się jak spam; pytanie o stan sprzętu łapie niezadowolonych ZANIM napiszą publicznie; konkret (model + zakres prac z notatki serwisowej) przypomina sprawę, której po dwóch tygodniach nikt nie kojarzy. Dwoje drzwi w treści — „coś nie tak → odpisz" / „działa → jedno zdanie". Podpis imienny, bez gradientów i emoji, zakończone „to ostatnia wiadomość w tej sprawie".

**Okno**: 10–35 dni od pierwszego maila. Jedno przypomnienie na zgłoszenie.

**Zakres prac** bierzemy z `service_notes`, ale tylko gdy po oczyszczeniu (usunięcie „+kurier", „, części") ma ≥12 znaków I zawiera nazwę czynności. „Drobny element" i „wg ustaleń" są pomijane — notatki są pisane dla nas, nie dla klienta. Notatki i tak są klientowi pokazywane w panelu (`/panel/naprawa/[id]`), więc cytat w mailu niczego nowego nie ujawnia.

**Trzy błędy złapane podglądem `?dry=1` — wszystkie w tym samym filtrze, wszystkie CICHE:**
1. `sender_type = 'customer'` — w tej tabeli klient to `user` (411 wiadomości `user`, 325 `admin`, zero `customer`).
2. Kolumna to `repair_request_id`, nie `repair_id`. Zapytanie zwracało błąd 400, a ja destrukturyzowałem tylko `data` → `null` → filtr nie wykluczał NIKOGO. Teraz sprawdzamy `error` i **przerywamy przebieg**: filtr, który milcząco nie działa, jest gorszy niż jego brak.
3. Po naprawieniu dwóch powyższych filtr wykluczał 20 z 41 — za ostro. Pisanie na czacie w trakcie naprawy to norma (pytanie o wycenę). Liczy się wyłącznie rozmowa **po** pierwszym mailu. Po zawężeniu: 1 pominięty, 40 do wysyłki.

**Znalezione przy okazji, do osobnej poprawki**: kolumna `shipped_at` nie jest wypełniana ani razu (0 na 195 napraw). Pierwszy cron liczy „3 dni po wysyłce" od `updated_at`, czyli od ostatniej edycji rekordu — każde dopisanie notatki przesuwa okno.

## 2026-08-26 — Przypomnienie o opinii: iteracje po uwagach użytkownika
1. **Szablon przeprojektowany na podstawie researchu**, nie skopiowany z newslettera (uwaga użytkownika: newsletter 1:1 nie pasuje do prośby o opinię). Zebrane badania: Bazaarvoice (jedna kolumna wygrywa, konkurujące sekcje zabijają konwersję), WordStream (jedno CTA ≈ +371% kliknięć), odwrotna zależność długości i konwersji, rama „pomagasz innym firmom" > „pomagasz nam", wzorzec gwiazdek Trustpilot/Yotpo, temat <41 znaków, dosyłka daje ~+50% opinii, okno 7–14 dni po odbiorze (nasze ~13. dnia — w punkt; pierwszy mail po 2–3 dniach jest wg badań ZA wcześnie). Efekt: `lib/email/przypomnienie-opinia.ts` — belka z logo i odznakami + limonkowa linia, list ~114 słów, klikalne 5 gwiazdek (złoto Google) + limonkowy przycisk do TEGO SAMEGO celu, zero innych linków, przechwycenie niezadowolonych PRZED gwiazdkami, stopka jednolinijkowa.
2. **Imiona usunięte** („Dzień dobry, Dominik" za poufałe — decyzja użytkownika). Pole `imie` wycięte z interfejsu szablonu, nie tylko z wywołań.
3. **Literówka „Wymian wentylatora"** — poszła do testówki żywcem z notatki serwisowej. Rozwiązanie u źródła: `lib/review-notes.ts` NIE cytuje wolnego tekstu; rozpoznaje czynności (~38 wzorców odpornych na odmiany i literówki) i składa opis z kanonicznych nazw. Nie rozpoznane → akapit pomijany. Wykluczenia: „rezygnacja", „nie stwierdzono", „odesłano bez naprawy", wyceny. Test na 161 realnych notatkach: 72% rozpoznanych, nierozpoznane to głównie wpisy, które NIE powinny iść do klienta. „Wymian wentylatora" → „wymiana wentylatora".
- Testówki [TEST 4–6] wysłane na jakub.tiuchty@gmail.com (lokalny klucz Resend jest deweloperski — nadaje tylko z onboarding@resend.dev na adres właściciela; produkcyjny w Vercelu nada z serwis@serwis-zebry.pl). Cron nadal NIE dodany do vercel.json — czeka na akceptację.

## 2026-08-26 — Przypomnienie o opinii: dopięcie przed wysyłką
- Kolejne poprawki z akceptacji użytkownika: pełna nazwa urządzenia (`lib/device-name.ts`: typ+marka+model, „tablet Zebra L10"; marka tylko dla rozpoznanych serii — CipherLab/Brother/Godex/… nie dostają „Zebra"); zdanie o gwarancji USUNIĘTE (nie dajemy 12 mies. gwarancji na naprawę — UWAGA: `/jak-to-dziala` linia 246 nadal ją obiecuje, zgłoszone, czeka na decyzję); podpis w trzech linijkach (Krzysztof Wójcik / Serwis Takma / tel.); nadawca „Krzysztof Wójcik — Serwis Takma".
- **Deduplikacja po adresie**: trzech klientów miało po dwa zgłoszenia w oknie (Konieczny/INPROX ×2, Gołębiewski ×2, Jakubczak ×2) i dostałoby dwa identyczne maile tego samego dnia. Jeden adres = jedna wiadomość; wszystkie zgłoszenia adresu oznaczane jako obsłużone. 41 wierszy → 38 adresatów.
- **Wykluczenie tych, co już ocenili**: automatycznie się NIE DA — Places API zwraca maks. 5 opinii „wg trafności". Przy okazji ustalone, że link w mailu (g.page) prowadzi na wizytówkę „TAKMA — Autoryzowany Serwis Zebra" (4,6★, 11 opinii), INNĄ niż GBP_PLACE_ID w panelu takmy (3,7★, 13 opinii) — czyli opinie klientów serwisu lądują na właściwej wizytówce serwisowej. Żadne z 5 widocznych nazwisk nie pasuje do listy adresatów. Wykluczenia ręczne: user poda nazwiska → `review_reminder_sent=true` przed pierwszym przebiegiem.
- **Cron dodany do vercel.json: codziennie 10:00.** Zacznie wysyłać po deployu — pierwszego dnia pójdzie cała zaległa pula (38 minus wykluczenia), potem pojedynczo, gdy kolejne naprawy wejdą w okno 10–35 dni.

## 2026-08-26 wieczór — deploy całości + weryfikacja produkcji przed jutrzejszymi cronami
Wypchnięte na main i zweryfikowane na żywo (wszystko zielone):
- 16 kluczowych tras → 200 (hub, 4 klasy, karta z ?pn=, części, instrukcje, sitemap).
- `product-stock` odpowiada z cache (1610,73 zł, PL 12), merchant-feed 200.
- Oba nowe crony zarejestrowane w Vercelu i zabezpieczone (401 bez sekretu).
- Logi runtime bez błędów; JSON-LD parsuje się, ProductGroup 6/6 ofert.
- Grafiki i wideo klas na produkcji (200).
- **Dry-run z produkcyjnym CRON_SECRET**: review-reminder → 38 kandydatów, 38 do wysłania, 0 pominiętych; stock-sync (limit=3) → 3 zapisane, zero błędów dystrybutorów.
Jutro: 6:00 stock-sync (pełna pula), 10:00 review-reminder (38 maili z serwis@serwis-zebry.pl) + request-review (pierwsze prośby) równolegle — zbiory rozłączne. Ostatni deploy: serwiszebraprod-ojznjttp2.

## 2026-08-26 (wieczór) — karta ZD421t: dymki, formularz, kotwice
- Tabela wariantów: dymki „?" przy DPI i Łączności (desktop + karty mobilne), wyjaśnienia po ludzku.
- Modal „Zapytaj o produkt": pola Firma i NIP (opcjonalne, zgodnie z wytycznymi formularzy B2B — wymagany NIP odstrasza), mikrocopy „Z NIP-em od razu przygotujemy ofertę"; API device-enquiry przyjmuje i pokazuje oba pola w mailu.
- Pasek kotwic sekcji (#warianty/#opis/#akcesoria/#faq/#specyfikacja/#dokumentacja) pod okruszkami + scroll-mt na sekcjach — pod skróty „Przejdź do sekcji" w Google.
- Panel zakupu: „Dostawa kurierem 25 zł" bez dopisku o stawce; usunięte „sprzęt nie jedzie do producenta".
- meta_title ZD421t w bazie: „Drukarka etykiet Zebra ZD421t — ceny 6 wersji | Serwis Zebra" (bez sztywnej ceny, fraza z przodu, 60 znaków).
- Opis produktu przepisany do rejestru formalnego (wcześniejszy commit 406a8f2).
- TODO jutro: pierwsze żywe crony — stock-sync 6:00, review-reminder 10:00.

## 2026-08-27 (wieczór) — skill karty produktu + karta ZD421d
- `.claude/skills/karta-produktu/SKILL.md` — pełna checklista budowy karty (dane, treść, schema, sitemapy, weryfikacja).
- Treść kart wydzielona do `lib/device-content.tsx` (TRESC_KART per slug): opis, wersje, FAQ, spec, zdjęcie główne, rekomendowany PN; page.tsx renderuje z konfiguracji.
- Karta ZD421d: 6 wariantów (ZD4A042/43-D0…), opis formalny (3 akapity, link do ZD421t), FAQ 5 pytań (kurierskie/bez taśmy/sterowniki/kalibracja/diody), spec z danych takmy, zdjęcia zd421d_{1,2,3}.webp; wpis w bazie; sitemap + sitemap-images. Konkurencja z 1. strony (strefadrukarek, 123drukuj, bcmarket…) to spec-dumpy — różnicowanie głosem serwisu.
- Plakietka „najczęściej wybierana" w tabeli przepięta ze sztywnego PN na prop.

## 2026-08-27 (noc) — karta ZD220d + adaptacyjne kolumny wariantów
- Karta ZD220d: 2 warianty (ZD22042-D0EG00EZ / D1EG00EZ — z odklejakiem i bez), opis z uczciwymi granicami modelu (tylko USB, brak MCS → link do ZD421d), FAQ 5 pytań (kalibracja przez FEED przy starcie — INNA niż ZD421!), spec z danych zweryfikowanych u producenta (220×176×151 mm, 1,1 kg — opis w takmie miał błędne wymiary).
- `lib/device-content.tsx`: `rozdzielczosci`/`lacznosci` → elastyczne `osie[]` (ZD220d ma jedną oś: wyposażenie).
- `DeviceVariantsTable`: kolumny adaptacyjne — pokazywane tylko te, które faktycznie różnicują warianty; gdy to za mało, dochodzi kolumna „Wersja". Szerokości liczone z wag. Analogicznie karty mobilne.
- Sitemap + sitemap-images + SPRZEDAWANE_MODELE (most z instrukcji).

## 2026-08-27 (noc, cd.) — karta ZD220t
- Karta ZD220t: 2 warianty (ZD22042-T0EG00EZ / T1EG00EZ), najtańsza termotransferowa Zebry; opis z granicami modelu (taśma tylko 74 m na wałku 0,5" → częsta wymiana, USB bez rozbudowy) i linkiem do ZD421t.
- FAQ pod AEO: różnica t/d, jakie taśmy pasują (74 m, 33,8–109,2 mm, wax/wax-resin/resin), kurierskie, kalibracja FEED przy starcie, diody.
- Dane zweryfikowane u producenta i w SERP: 267 × 197 × 191 mm, 1,7 kg (inne niż ZD220d — wersja z taśmą jest większa).
- Kafelek produktu: CTA dosunięte do dołu (mt-auto) — kafelek z jednym rzędem chipów miał przycisk wyżej.

## 2026-08-28 — karta ZD230d
- Piąta karta urządzenia: 6 wariantów na trzech osiach (łączność USB/Ethernet/Wi-Fi, wyposażenie standard/odklejak/gilotyna, obudowa czarna/biała). Tabela adaptacyjna sama dobrała kolumny: Łączność + Wersja (bez DPI — jednolite 203).
- Dane zweryfikowane u źródła: szerokość druku 104 mm (opis w takmie mówił 108), etykiety 25,4–112 mm; wymiary POMINIĘTE — takma podaje wymiary ZD220d, sklepy inne, brak pewnego źródła.
- Głowica P1115689: device_model poprawiony na „ZD220d / ZD230d" (potwierdzone u dystrybutorów) — wcześniej karta ZD230d nie pokazywała głowicy.
- Link z /sterowniki podmieniony na ZD230d (zamiast ZD220t) — strona ma poz. 2 na „zebra zd421 sterowniki".

## 2026-08-30 — filtr wariantów na /sklep/drukarki-etykiet/biurkowe
- Diagnoza przed kodem: kategoria ma **5 modeli, ale 22 warianty** (PN-y), a pozostałe klasy są w bazie puste. Filtr nad pięcioma kafelkami nic nie daje — filtrujemy więc WARIANTY, a kafelek modelu pokazuje, ile jego wersji przeszło („pasują 3 z 6 wersji").
- `components/shop/KatalogDrukarek.tsx` (client): grupy Rodzaj druku / Rozdzielczość / Łączność / Wyposażenie / Dostępność. Wewnątrz grupy „albo", między grupami „i". Przy każdym chipie licznik trafień; kombinacja bez wyników → chip wygaszony i nieklikalny (bez ślepych zaułków). Stan pusty ma własny komunikat i przycisk powrotu.
- Rodzaj druku bierzemy z ostatniej litery modelu (ZD421t/ZD421d) — warianty jej nie powtarzają. Ceny i dostępność per wariant z cache stanów, z fallbackiem do ceny modelu.
- Gdy filtr zawęzi model do jednej wersji, kafelek linkuje prosto do niej (`?pn=`), a CTA zmienia się na „Zobacz tę wersję".
- SEO: `generateMetadata` daje `noindex, follow` każdej kombinacji z filtrem, canonical zawsze na czysty adres kategorii. Stan filtra zapisujemy przez `history.replaceState`, nie `router.replace` — strona jest force-dynamic, więc nawigacja oznaczałaby ponowne odpytanie serwera o te same dane.
- Mobile: panel startuje zwinięty (pięć rzędów chipów spychało produkty pod ekran), na desktopie zawsze otwarty.
- Przy okazji usunięte „Parametry z kart katalogowych Zebry" pod tabelą — nie powołujemy się na dokumenty producenta.
- Test: `node scripts/test-filtr-wariantow.mjs` (na buildzie, port 3003) — 13 sprawdzeń, wszystkie zielone; osobno zweryfikowane wejście z gotowego adresu `?dpi=300&lacznosc=Wi-Fi` i nagłówki robots/canonical.
- **Poprawka tego samego dnia (uwaga użytkownika)**: filtry przeniesione do lewego sidebara — tak, jak klient zna to z każdego sklepu. Chipy zamienione na checkboxy w kolumnie (`aside`, sticky na desktopie), siatka produktów przeszła na 2/3 kolumny. Nad wynikami licznik i pigułki wybranych filtrów z „×" — na telefonie kolumna startuje zwinięta, więc to jedyne miejsce, gdzie widać i można cofnąć wybór. Test rozszerzony do 19 sprawdzeń (m.in. zwinięcie na telefonie i pigułki).

## 2026-08-30 — karta ZD230t (szósta karta urządzenia)
- Wpis w bazie: 6 wariantów na trzech osiach — łączność (USB / Ethernet / Wi-Fi z Bluetoothem), wyposażenie (standard / odklejak / gilotyna), obudowa (czarna / biała). Wszystkie PN-y **zweryfikowane u dystrybutorów** przez `/api/shop/product-stock` przed wpisaniem (`found: true` + cena): ZD23042-30EG00EZ, -30EC00EZ, -30ED02EZ, -31EG00EZ, -32EG00EZ, ZD23W42-30EC00EZ. Rekomendowany wariant to Ethernet — bywa w tej samej cenie co USB.
- **Skrypt `scripts/check-ingram-stock.mjs` jest martwy**: endpoint `pl.ingrammicro.eu/_api/` oddaje dziś stronę HTML, nie XML. Do weryfikacji numerów katalogowych używać produkcyjnego `/api/shop/product-stock?sku=`.
- Dane techniczne potwierdzone u producenta (tech-specs ZD230): do 152 mm/s, 203 dpi, druk 104 mm, media 25,4–112 mm, rolka do 127 mm, 128 MB Flash + 128 MB SDRAM, wymiary wersji termotransferowej 267 × 197 × 191 mm. **Kluczowa różnica wobec ZD220t: taśmy 300 m na wałku calowym (proporcja 1:4) obok 74 m na 0,5 cala** — to główny argument sprzedażowy i oś opisu. Waga POMINIĘTA: producent podaje jedną liczbę (1,1 kg) dla obu wersji, a dla termotransferowej jest ona zaniżona.
- Treść w `lib/device-content.tsx`: opis 3 akapity (rejestr formalny), osie Łączność + Wyposażenie, FAQ 5 pytań — w tym policzalne „Ile etykiet wystarczy z taśmy 300 m" (ok. 2000 etykiet 150 mm), linki do ZD220t, ZD230d i ZD421t jako rozgraniczenie modeli.
- Zdjęcia: 3 rendery z repo takma → `public/sklep_photo/urzadzenia/zd230t_{1,2,3}.webp`. Producent stosuje dla serii wspólne rendery z napisem „ZD220" na panelu — tak samo jest na karcie ZD230d, więc zostawione dla spójności.
- Akcesoria dopasowały się same: głowica P1115690, wałek P1080383-703, zasilacz P1080383-704. Nazwa głowicy poprawiona na „ZD220t / ZD230t", żeby na karcie ZD230t nie stało „do drukarki ZD220t". **Do zrobienia przy okazji**: ta sama poprawka nazwy dla P1115689 (karta ZD230d).
- Checklist skilla wykonany: sitemap.ts, sitemap-images.xml (3 zdjęcia), `SPRZEDAWANE_MODELE` (instrukcja `/instrukcje/zd230t` istnieje i pokazuje baner „Zobacz w sklepie").
- Weryfikacja na buildzie: karta 200, 6 PN-ów w HTML z cenami z serwera, JSON-LD parsuje się w całości (ProductGroup 6/6 z ofertami, FAQPage 5, WebPage, BreadcrumbList), zero poziomego scrolla na 1440 i 390 px, kafelek w kategorii z chipami i ceną.
- Test filtra przepisany na asercje **wyliczane z tego, co pokazuje strona** (licznik przy chipie zapowiada wynik filtra) — dorzucenie kolejnego modelu nie wymaga już poprawiania liczb w teście. 16 sprawdzeń, zielone przy 28 wersjach w 6 modelach.
- **PO DEPLOYU**: odpalić `stock-sync` z CRON_SECRET dla nowych PN-ów, żeby zasilić cache.
- **Poprawka po uwadze użytkownika**: kolumna „Kolor" w tabeli wariantów pokazywała kreskę przy czarnych wersjach i nazwę tylko przy białej. Kolor to cecha, którą każdy wariant ma — więc czarne dostały wprost `Kolor: Czarna` (w bazie, dla ZD230t i ZD230d; modele bez wersji kolorystycznych pominięte, żeby nie dokładać kolumny, która niczego nie różnicuje). Kreska zostaje przy „Wyposażeniu", gdzie oznacza brak dodatku (odklejaka/gilotyny).

## 2026-08-30 — karta ZD621d (siódma karta urządzenia)
- Szczyt klasy biurkowej w wersji termicznej. Sześć wariantów na trzech czystych osiach: rozdzielczość (203/300 dpi) × łączność (Ethernet / Wi-Fi z Bluetoothem) × panel (diody / ekran dotykowy 4,3"). PN-y zweryfikowane u dystrybutorów: ZD6A042-D0EF00EZ, ZD6A043-D0EF00EZ, ZD6A042-D0EL02EZ, ZD6A043-D0EL02EZ, ZD6A142-D0EF00EZ, ZD6A143-D0EF00EZ (ZD6A1… = wersja z ekranem).
- Dane od producenta (tech-specs ZD621): 203 dpi → do 203 mm/s, 300 dpi → do 152 mm/s; druk 104 mm; nośniki 15–108 mm (ZD621d, węższe niż ZD621t); 512 MB Flash + 256 MB SDRAM; Ethernet 10/100, RS-232, USB i USB Host w standardzie; Wi-Fi 6 z BT 5.3 fabrycznie lub doinstalowane; wymiary wersji termicznej 220 × 177 × 151 mm, 1,6 kg; zegar RTC.
- **Wyróżnik wobec ZD230d**: gilotynę i odklejak w serii ZD621 montuje się także PO zakupie (field installable), a nie tylko fabrycznie — to argument, którego nie ma żadna tańsza seria, i osobne pytanie w FAQ.
- Kolejność wdrożenia poprawiona po wpadce z ZD230t: produkt wpisany do bazy jako `is_active=false`, włączony dopiero razem z deployem zdjęć.
- Weryfikacja na buildzie: 200, sześć PN-ów z cenami z serwera (1950,14–2891,85 zł), trzy zdjęcia, JSON-LD w komplecie (ProductGroup 6, FAQPage 5, WebPage, BreadcrumbList), zero poziomego scrolla na 1440 i 390 px, kafelek w kategorii biurkowej.

## 2026-08-30 — karty produktów pod cytowanie przez modele językowe (GEO)
Punkt wyjścia z wytycznych GEO: modele cytują **samodzielne fragmenty** (optymalnie 130–170 słów), premiują konkretne liczby, świeżość i wskazane źródło, a nie wykonują JavaScriptu. Nasze karty miały prozę i tabele, ale nie miały ani bloku gotowego do cytowania, ani jednej daty.
- **Blok „W skrócie" na każdej z 7 kart** (`wSkrocie` w `lib/device-content.tsx`): 5–6 zdań, każde broni się bez reszty strony i zawiera nazwę modelu z liczbą. Nie streszcza opisu — mówi to, o co pytają: technologia druku, rozdzielczość i prędkość, materiały, granice modelu, następstwo po starszej serii.
- **Data weryfikacji danych** (`zweryfikowano`) — widoczna pod specyfikacją („Dane techniczne sprawdzone u producenta w sierpniu 2026 przez TAKMA — autoryzowany serwis Zebra Technologies") i jako `dateModified` w schemacie WebPage. Przy sprzęcie, którego parametry sklepy przepisują od siebie z błędami, źródło i data są tym, co odróżnia kartę wartą zacytowania.
- **Specyfikacja podana maszynowo**: tabela trafia do `additionalProperty` w ProductGroup (10–16 parametrów per karta), więc pytanie o prędkość druku ma odpowiedź w atrybucie, a nie w zdaniu do sparsowania.
- **llms.txt uzupełniony o drukarki** — plik opisywał wyłącznie części zamienne, więc model czytający go nie wiedział, że sprzedajemy urządzenia. Doszła sekcja z siedmioma kartami, jednozdaniowym opisem każdej, wskazaniem `/api/llm-feed` i regułami doboru („d" vs „t", 203 vs 300 dpi, kiedy wyjść poza klasę biurkową). Przy okazji naprawiona sprzeczność: plik obiecywał 12 miesięcy gwarancji, karty 24 — teraz rozdzielone (24 mies. na drukarki, 12 na części).
- Stan zastany był lepszy, niż się spodziewałem: robots.txt wpuszcza GPTBot, ClaudeBot, PerplexityBot i OAI-SearchBot, `/api/llm-feed` żyje i zawiera wszystkie warianty, treść renderuje się serwerowo. Braki dotyczyły wyłącznie warstwy treści.

## 2026-08-30 — karta ZD621t (ósma karta urządzenia)
- Termotransferowa wersja szczytu klasy biurkowej, od razu w nowym standardzie GEO (blok „W skrócie", data weryfikacji, parametry w schemacie). Sześć wariantów na tych samych trzech osiach co ZD621d: 203/300 dpi × Ethernet/Wi-Fi × diody/ekran dotykowy. PN-y sprawdzone u dystrybutorów: ZD6A042-30EF00EZ, ZD6A043-30EF00EZ, ZD6A042-30EL02EZ, ZD6A043-30EL02EZ, ZD6A142-30EF00EZ, ZD6A143-30EF00EZ (człon „30" = termotransfer, „ZD6A1" = wersja z ekranem).
- Dane od producenta: taśmy 300 m na wałku calowym i 74 m na wałku 0,5 cala (33,8–109,2 mm), proporcja 4:1 dla nawoju 300 m; **nośniki do 118 mm — najszersze w całej biurkowej serii ZD** (ZD621d przyjmuje 108, ZD421t 112); wymiary wersji termotransferowej 267 × 202 × 192 mm i 2,5 kg wobec 220 × 177 × 151 mm i 1,6 kg w wersji termicznej.
- Osobne pytanie w FAQ o mylącą parę liczb: nośnik do 118 mm, ale szerokość druku 104 mm — reszta to margines podłoża.
- Zdjęcia z takmy: front z panelem diodowym, wersja z ekranem dotykowym i wersja z gilotyną, czyli galeria pokazuje trzy realne konfiguracje zamiast trzech ujęć tego samego.
- Wpis do bazy jako `is_active=false`, aktywacja razem z deployem. Weryfikacja na buildzie: 200, sześć PN-ów z cenami (2140,59–3130,52 zł), JSON-LD w komplecie (ProductGroup 6 wariantów i 17 parametrów, FAQPage 5), zero poziomego scrolla, kafelek w kategorii, test filtra zielony przy 8 modelach.
- llms.txt uzupełniony o ZD621t.
- Zdjęcie główne ZD621d i ZD621t przestawione na ujęcie 3/4 (drugie w galerii) — zmiana w trzech miejscach naraz, żeby nie rozjechały się ze sobą: `zdjecieGlowne` w `device-content` (og:image, schema, primaryImageOfPage), kolejność `image_urls` w bazie (galeria otwiera się na pierwszym) i kolejność w `sitemap-images.xml`. UWAGA: dla ZD621t to render wersji z ekranem dotykowym, a domyślnie wybrany wariant ma panel diodowy.
- Tabela wariantów: wersje bez stanu magazynowego lądują na końcu (uwaga użytkownika). Sortowanie stabilne — w obrębie grupy „dostępne" i „na zamówienie" zostaje kolejność z bazy, bo ta niesie logikę modelu (rosnąca rozdzielczość, potem wyposażenie); sortowanie po cenie by ją rozbiło. Dotyczy obu układów: tabeli na desktopie i kart na telefonie.

## 2026-08-31 — karta ZD411d + poprawka sortowania wariantów
- **Dziewiąta karta: ZD411d — jedyna dwucalowa w ofercie.** Sześć wariantów na dwóch osiach (203/300 dpi × USB/Ethernet/Wi-Fi), PN-y sprawdzone u dystrybutorów: ZD4A022/023-D0EM00EZ, -D0EE00EZ, -D0EW02EZ (uwaga: kod Wi-Fi to tu `EW02`, nie `EX02` jak w ZD421d).
- Dane od producenta: **szerokość druku 56 mm przy 203 dpi i 54 mm przy 300 dpi**, nośniki 6,4–60 mm, prędkość 152 / 102 mm/s, 512 MB Flash + 256 MB SDRAM, RTC, wymiary 220 × 115 × 151 mm, waga 1,0 kg. Ethernet, RS-232 i Wi-Fi 6 to moduły montowane także po zakupie.
- Cała treść zbudowana wokół jednej rzeczy: **ta drukarka NIE wydrukuje etykiety kurierskiej 100 × 150 mm**. Fakt jest w „W skrócie", w drugim akapicie opisu i jako pierwsze pytanie FAQ, z linkiem do ZD421d — to najczęstsza pomyłka przy zakupie dwucalówki.
- **Poprawka sortowania z poprzedniej tury**: kryterium `total > 0` było błędne, bo `total` obejmuje towar w drodze. ZD4A023-D0EE00EZ ma `stockPL: 0, stockEU: 0, total: 280` („W dostawie") i przez to stał wśród dostępnych. Teraz trzy poziomy: na półce (PL albo EU) → w dostawie → nie ma nigdzie.
- **Znalezione przy okazji, do decyzji**: przy takim wariancie kolumna mówi „Na zamówienie", a przycisk pokazuje „Koszyk" — kolumna patrzy na `stockPL/stockEU`, przycisk na `total`. Albo kolumna powinna mówić „W dostawie", albo przycisk „Powiadom"; obecny stan jest niespójny wobec klienta.
- **Rozjazd „Na zamówienie" vs „Koszyk" naprawiony u źródła (decyzja użytkownika).** Jedno kryterium `naStanie()` — czy wersja leży na półce (PL albo EU) — steruje teraz przyciskiem, badge'em i sortowaniem. Wersja bez stanu dostaje „Powiadom", nie koszyk.
- **Towar w drodze pokazywany wprost.** `in_delivery` z danych dystrybutora było już w `stock_cache` i w `StanSerwerowy`, ale nigdzie nie docierało do widoku. Przeprowadzone przez `StanWariantu` → panel zakupu („W dostawie: 280 szt. — napisz, potwierdzimy termin") i tabelę wariantów („W dostawie: 280"). Trzeci stan zamiast dwóch: na półce → w dostawie → nie ma nigdzie.
- **Schema poprawiona przy okazji**: `dostepnoscSchema` dawało `InStock` przy `totalStock > 0`, czyli obiecywało wysyłkę towaru, którego u dystrybutora fizycznie nie ma. Teraz InStock tylko z magazynu, `BackOrder` dla towaru w drodze, `OutOfStock` dla reszty — rozjazd deklarowanej dostępności z faktyczną to prosta droga do zawieszenia oferty w Merchant Center.
- Dymek przy kolumnie „Dostępność" opisuje teraz wszystkie cztery stany, nie dwa: PL, EU, „W dostawie" (magazyny puste, towar jedzie do dystrybutora — termin potwierdzamy) i „Na zamówienie" (nie ma nigdzie, sprowadzamy pod zamówienie).
- Dymek przy kolumnie „Dostępność" opisuje teraz wszystkie cztery stany, nie dwa: PL, EU, „W dostawie" (magazyny puste, towar jedzie do dystrybutora — termin potwierdzamy) i „Na zamówienie" (nie ma nigdzie, sprowadzamy pod zamówienie).
- Dymek dostępności przepisany z akapitu na listę (uwaga użytkownika: „ściana tekstu"). Nagłówek „Liczba sztuk gotowych do wysyłki:" i cztery wiersze z pogrubionym terminem — PL, EU, W dostawie, Na zamówienie. Wiersze zrobione spanami z `block`, bo dymek renderuje się wewnątrz `span` i `div` łamałby poprawność HTML. Szerokość 256 → 300 px (nadal mieści się na 390 px), a `aria-label` przycisku poprawiony z „Co oznaczają PL i EU?" na „Co oznaczają stany dostępności?" — stany są teraz cztery.
- **Wszystkie dymki na kartach urządzeń przepisane na ten sam format** (uwaga użytkownika: ściana tekstu była nie tylko przy dostępności). Jedna struktura `Wyjasnienie { wstep, pozycje[] }` i wspólny renderer `TrescPodpowiedzi` obsługują teraz Rozdzielczość, Łączność, Dostępność oraz dwie kolumny, które dymka nie miały wcale: Panel (diody / ekran dotykowy) i Wyposażenie (standard / odklejak / gilotyna). Zasada: zdanie wprowadzające, potem wiersz na każdą wartość z pogrubionym terminem — dokładnie te wartości, które klient widzi w tabeli.
- Myślnik jest w tych wierszach separatorem, więc zniknął z samych opisów („Ethernet — kabel sieciowy — drukarka widoczna…" gubiło granicę); w treści zostały przecinki i średniki.

## 2026-08-31 — karta ZD411t (dziesiąta, komplet biurkowych)
- Ostatnia biurkowa drukarka Zebry w ofercie — po niej klasa jest kompletna: ZD220d/t, ZD230d/t, ZD411d/t, ZD421d/t, ZD621d/t.
- Sześć wariantów (203/300 dpi × USB/Ethernet/Wi-Fi), PN-y sprawdzone u dystrybutorów: ZD4A022/023-T0EM00EZ, -T0EE00EZ, -T0EW02EZ.
- Dane od producenta: druk 56 mm (203 dpi) i 54 mm (300 dpi), nośniki 6,4–60 mm, **taśmy WYŁĄCZNIE 74-metrowe na wałku 0,5 cala, szerokość 33–58 mm** (300-metrowe rolki z ZD421t się tu nie mieszczą), proporcja 1:1, wymiary 243 × 139 × 169 mm, 1,6 kg — o 600 g więcej i wyraźnie większa od termicznej ZD411d.
- FAQ zawiera policzalne „ile etykiet z taśmy" (74 m ≈ 1480 etykiet 50 mm) i to samo ostrzeżenie co przy ZD411d: nie wydrukuje etykiety kurierskiej 100 × 150 mm.

## 2026-08-31 — strona kategorii /sklep/drukarki-etykiet/biurkowe pod LLM-y
Fraza „biurkowe drukarki etykiet Zebra" jest głównym wejściem do tej kategorii, a treść opisywała stan sprzed pięciu kart — mówiła o „jedynej dwucalowej ZD411" i nie linkowała do wersji „t" większości serii.
- **Blok „Biurkowe drukarki etykiet Zebra — w skrócie"** na czele treści: siedem zdań, każde samodzielne i z liczbą (ile modeli i serii, co znaczy „d" i „t", które drukują 104 mm a które 56, prędkości per seria, kiedy 300 dpi, łączność per seria, wspólne parametry i gwarancja). To materiał wprost do zacytowania przez asystenta pytanego „jaką biurkową drukarkę Zebra wybrać".
- **Tabela porównawcza przepisana na dane** (`POROWNANIE`) — pięć serii, każda z linkami do obu kart (d/t), doszły kolumny szerokości druku i taśmy. Wcześniej była wpisana ręcznie w JSX i nie dało się jej utrzymać przy dziesięciu modelach.
- **FAQ kategorii + FAQPage schema** — pięć pytań, które padają na infolinii: która nadaje się do etykiet kurierskich (każda poza ZD411), czym różni się „d" od „t", kiedy 300 dpi, która ma Ethernet w standardzie (ZD621), ile etykiet dziennie wytrzyma klasa biurkowa. Odpowiedź zaczyna się od rozstrzygnięcia, nie od wstępu.
- Sekcje serii zaktualizowane o wersje „t" i różnice, które wyszły przy budowie kart: taśma 74 vs 300 m w ZD220t/ZD230t, wąskie taśmy 33–58 mm w ZD411t, nośniki do 118 mm w ZD621t, montaż gilotyny po zakupie w ZD621.
- llms.txt: informacja, że oferta obejmuje KOMPLET biurkowych Zebry, oraz link do tabeli porównawczej jako punktu wejścia.
- Weryfikacja: ItemList 10 pozycji, FAQPage 5 pytań, BreadcrumbList, dziesięć kart linkowanych z treści, zero poziomego scrolla na 1440 i 390 px, test filtra zielony.

## 2026-08-31 — baner materiałów eksploatacyjnych na kartach urządzeń
- Nowy `components/shop/BanerMaterialow.tsx` między częściami zamiennymi a FAQ: klient, który wybrał już wersję, następnym pytaniem pyta o etykiety.
- Wariant zależy od technologii druku, czytanej z ostatniej litery modelu: **„d" → jeden szeroki kafel** z etykietami termicznymi (takma.com.pl/etykiety-termiczne-zebra), **„t" → dwa kafle** — taśmy (/tasmy-termotransferowe) i etykiety termotransferowe (/etykiety-termotransferowe-zebra), bo druk z taśmy zużywa dwa materiały naraz.
- Grafiki wygenerowane w Higgsfieldzie (gpt_image_2) z kafelkiem klasy `/klasy/biurkowe.jpg` jako referencją stylu — ten sam komiksowo-wektorowy rysunek z halftone, ciepłym światłem i limonkowym akcentem. Bohaterem kadru są materiały, nie urządzenie: żadnej drukarki w kadrze, więc nie ma ryzyka zmyślonego sprzętu. Pliki w `public/materialy/` (1200 px, webp).
- Linki wychodzą na takma.com.pl w nowej karcie — klient jest w trakcie wyboru numeru katalogowego i nie ma go z niego wyrzucać. Wszystkie trzy adresy sprawdzone (200).
- Opisy mówią, co realnie różnicuje wybór (rodzaj taśmy decyduje o odporności nadruku; etykieta musi pasować do taśmy, nie tylko do drukarki), zamiast ogólników o jakości.
- Filtr „Rodzaj druku": etykiety zmienione na „Termiczna" i „Termotransferowa" — nazwy technologii są tym, czego klient szuka w opisach i u konkurencji, a „bez taśmy" opisywało skutek, nie kategorię.
- **Sekcja „Gdy coś nie działa"** (pomysł użytkownika) — po uwadze przeniesiona z listy linków w dokumentacji do OSOBNEJ sekcji z kafelkami wpisów: okładka, tytuł i czas czytania jak na blogu, tylko w mniejszym formacie, po trzy na kartę. W `TRESC_KART` trzymamy same slugi; tytuł, okładkę i czas czytania bierze `getPostBySlug` z `lib/blog`, więc karta nie ma własnej kopii tytułu, która rozjechałaby się po redakcji wpisu. Tytuł na kafelku skracany (bez „[2026]" i powtarzanego „drukarki Zebra") — pełne brzmienie jest pisane pod wyniki wyszukiwania i zajmowało cztery linijki. Dobór wg serii — dedykowana diagnostyka tam, gdzie ją napisaliśmy (ZD220 dla serii ZD220/ZD230, ZD420-ZD421 dla ZD421, ZD620-ZD621 dla ZD621; ZD411 dostaje ogólne „dziesięć najczęstszych awarii", bo dedykowanego wpisu nie ma), plus dwa problemy, z którymi klienci dzwonią najczęściej: blady wydruk i czyszczenie głowicy. Wszystkie adresy sprawdzone (200), żaden nie dubluje linków z FAQ tej samej karty.
- Panel filtrów stracił nagłówek „Dobierz wersję": na desktopie kolumna mówi sama za siebie nazwami grup, na telefonie zostaje pasek „Filtry" z ikoną suwaków, licznikiem wybranych i strzałką — tam panel startuje zwinięty i musi być za co kliknąć. Test filtra zaktualizowany (mobilny przycisk po `aria-label`, nie po tekście).
- Nazwy grup filtra („RODZAJ DRUKU", „ROZDZIELCZOŚĆ") przyklejały się do górnej krawędzi sekcji. Przyczyna: `legend` jest pozycjonowana przez przeglądarkę poza flow paddingu fieldsetu, więc `pt-4` jej nie dotyczyło; `float-left` wracał ją do flow, ale rozbijał układ opcji. Ostatecznie `fieldset`/`legend` zastąpione przez `div role="group"` z `aria-labelledby` — dla czytnika ekranu grupa nazywa się tak samo, a odstępy da się ustawić: 16 px nad nazwą, 8 px pod nią. Test filtra szuka grup po roli, nie po `fieldset`.
