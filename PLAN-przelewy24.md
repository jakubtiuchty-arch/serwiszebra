# Plan migracji płatności sklepu: Stripe → Przelewy24 (P24)

> Cel: porzucone koszyki (60+) na Stripe. Takma przeszła na własne konto P24 —
> niższe prowizje + natywny polski UX (BLIK / pay-by-link bez pośrednika Stripe).
> Źródło wzorca: repo `takma` (NIE modyfikować). Tu: warstwa danych = Supabase
> (nie Prisma jak w takmie), więc logika P24 przenoszona 1:1, a DB adaptowana.

Data analizy: 2026-06-13.

---

## 1. Jak działa P24 w takmie (wzorzec)

Klasyczne **API 3.2** (md5/CRC, BEZ REST — konto takmy ma wyłączone REST, a
klasyczne działa na samym kluczu CRC). Pliki:

- `src/lib/p24.ts` (130 lin.) — **czysta logika, zero zależności od DB/Prisma**:
  `p24Register()` (trnRegister → token → redirectUrl), `parseP24Notification()`,
  `p24VerifyNotificationSign()` (md5 CRC), `p24Verify()` (trnVerify — OBOWIĄZKOWE,
  bez tego środki nie są rozliczane), `p24Configured()`.
- `src/actions/checkout.ts` — server action: createOrder(PENDING_PAYMENT) →
  p24Register → zwraca redirectUrl; zapisuje `p24SessionId = order.id`.
- `src/app/api/p24/webhook/route.ts` — urlStatus: (1) weryfikacja podpisu,
  (2) dopasowanie po `p24SessionId` + kontrola kwoty, (3) `p24Verify`,
  (4) PAID + maile, **idempotentnie** (P24 ponawia notyfikacje).
- `src/app/api/p24/status/route.ts` — polling dla strony potwierdzenia
  (gdy klient wróci zanim dotrze webhook). Dopasowanie po order+sid.

Przepływ: trnRegister → redirect na `/trnRequest/{token}` → klient płaci →
P24 POST-uje na urlStatus → my wołamy trnVerify → PAID.

Parametry: `p24_time_limit=30` min, `p24_wait_for_result=1`, `p24_api_version=3.2`,
kwota w **GROSZACH** (integer), waluta PLN.

Env (takma, konto **352235**, domena www.takma.com.pl):
`P24_MERCHANT_ID`, `P24_POS_ID` (=merchant), `P24_CRC`, `P24_API_KEY` (nieużywany
w 3.2), opcjonalnie `P24_SANDBOX=true`.

---

## 2. Jak działa sklep serwiszebry dziś (Stripe)

Zamówienia w **Supabase, tabela `shop_orders`** (items jako JSON). Przepływ:

1. `app/sklep/zamowienie/page.tsx` → POST `/api/orders` → INSERT `shop_orders`
   (`order_number`, `status='new'`, `items`, `email`, `total_brutto`,
   `payment_status = paymentMethod==='stripe' ? 'pending' : null`) → zwraca `orderId`.
2. Jeśli `paymentMethod==='stripe'` → POST `/api/shop/create-checkout` `{orderId}`
   → Stripe Checkout Session (`payment_method_types: ['card','blik','p24']`!) →
   zapis `stripe_session_id`, `payment_status='processing'` → zwraca `session.url`
   → `clearCart()` + redirect.
3. Sukces: `/sklep/zamowienie/sukces?session_id=...` → poll `/api/shop/verify/[session_id]`
   → `stripe.checkout.sessions.retrieve` → jeśli paid: `payment_status='succeeded'`,
   `status='confirmed'`, `paid_at`, `stripe_payment_id`.
4. Webhook `/api/webhooks/stripe` `checkout.session.completed` → gdy
   `metadata.shop_order_id` → update shop_orders + **Baselinker** + maile.
5. Anulowanie: `/sklep/zamowienie/anulowano?order_id=...`.

UWAGA: Stripe w serwiszebrze obsługuje TEŻ **naprawy** (`/api/repairs/.../checkout`,
`RepairPaymentModal`, webhook handleRepairPayment). To OSOBNY flow — zostaje na
Stripe (to nie problem porzuconych koszyków).

Kolumny `shop_orders` istotne: `id`, `order_number`, `items`(JSON), `email`,
`total_brutto` (PLN, decimal — w create-checkout liczone `priceBrutto*100` na grosze),
`payment_status`, `stripe_session_id`, `stripe_payment_id`, `paid_at`, `status`,
`updated_at`.

---

## 3. Różnice do pokonania

| | takma | serwiszebra |
|---|---|---|
| DB | Prisma/Postgres, model `Order` | Supabase, tabela `shop_orders` |
| Status enum | `OrderStatus.PAID` | string `payment_status`/`status` |
| Kwota | grosze (integer) | `total_brutto` PLN decimal → ×100 |
| ID sesji | `p24SessionId` (cuid) | dodać `p24_session_id` (= order.id/uuid) |
| Maile/Baselinker | lib/email | istniejące w webhooku Stripe — reużyć |

`lib/p24.ts` jest DB-agnostyczne → **kopiujemy prawie verbatim**. Reszta to
adaptacja warstwy danych (Prisma→Supabase) + podpięcie istniejących maili/Baselinkera.

---

## 4. FAZA 0 — konto P24 (BLOKER, po stronie usera)

Konto takmy (352235) jest zarejestrowane na domenę **takma.com.pl** — P24 wiąże
sklep z domeną i urlStatus musi być na zarejestrowanej domenie. **Nie da się
reużyć 1:1 dla serwis-zebry.pl.** Opcje:
- **A (zalecane):** dodać serwis-zebry.pl jako **drugi sklep/POS** pod tym samym
  Partnerem P24 (jeśli ta sama firma — Scanter/TAKMA). Osobny POS_ID + CRC,
  wspólne rozliczenia. Szybsze niż nowe konto.
- **B:** nowe konto P24 dla serwis-zebry.pl (jeśli inny podmiot/rachunek).

Potrzebne na koniec: `P24_MERCHANT_ID`, `P24_POS_ID`, `P24_CRC` dla serwis-zebry.pl
oraz w panelu P24 zarejestrowany **urlStatus = https://www.serwis-zebry.pl/api/shop/p24/webhook**.
Do testów: konto **sandbox** (`P24_SANDBOX=true`, sandbox.przelewy24.pl).

---

## 5. FAZA 1 — port kodu (po uzyskaniu kluczy)

1. **`lib/p24.ts`** — kopia z takmy verbatim (czysta, crypto+fetch). +env.
2. **Migracja Supabase**: `ALTER TABLE shop_orders ADD COLUMN p24_session_id text,
   ADD COLUMN p24_order_id text;` (+ ewentualnie index na p24_session_id).
3. **`app/api/shop/p24/create/route.ts`** (zastępuje create-checkout dla sklepu):
   load shop_orders → `p24Register({ sessionId: order.id, amount: Math.round(order.total_brutto*100),
   description: 'Zamówienie {order_number} — serwis-zebry.pl', email, urlReturn:
   /sklep/zamowienie/sukces?order={number}&sid={id}, urlStatus: /api/shop/p24/webhook })`
   → zapis `p24_session_id`, `payment_status='processing'` → zwraca `redirectUrl`.
4. **`app/api/shop/p24/webhook/route.ts`** (urlStatus): parse → verify sign →
   match `shop_orders` po `p24_session_id` → kontrola kwoty (=total_brutto*100) →
   `p24Verify` → update `payment_status='succeeded'`, `status='confirmed'`, `paid_at`,
   `p24_order_id` → Baselinker + maile (idempotentnie: jeśli już 'succeeded' → return).
5. **`app/api/shop/p24/status/route.ts`**: poll po `order_number` + `p24_session_id`.
6. **`app/sklep/zamowienie/page.tsx`**: gałąź płatności online → POST
   `/api/shop/p24/create` zamiast create-checkout; etykieta „Przelewy24 (BLIK,
   przelew, karta)".
7. **Strona sukcesu** `/sklep/zamowienie/sukces`: P24 wraca na urlReturn z
   `?order=&sid=` (nie `session_id`). Poll `/api/shop/p24/status` aż PAID
   (webhook bywa wolniejszy niż powrót klienta).

## 6. FAZA 2 — maile + Baselinker
Reużyć `sendOrderConfirmationEmail` / `sendNewOrderNotificationEmail` i wysyłkę do
Baselinkera (jak w webhooku Stripe `checkout.session.completed` dla shop_order).

## 7. FAZA 3 — cutover
- Najpierw **sandbox** (P24_SANDBOX=true) end-to-end.
- Produkcja: przełączyć `paymentMethod` sklepu na P24. Stripe-shop zostawić chwilowo
  jako fallback (flaga) lub wygasić. Naprawy zostają na Stripe.
- Regulamin/polityka prywatności: dopisać Przelewy24 jako operatora płatności
  (takma już to ma — wzorzec w `src/app/regulamin/page.tsx`).
- Env P24_* dodać na **Vercel** (serwiszebra_prod), Production + Preview.

---

## 8. Pułapki (z doświadczenia takmy)
- `p24Verify` (trnVerify) jest **OBOWIĄZKOWE** — bez niego P24 nie rozlicza wpłaty.
- Kwota MUSI być w groszach (integer); `total_brutto` w serwiszebrze to PLN →
  ×100 z `Math.round`. **Zweryfikować jednostkę przed wdrożeniem.**
- urlStatus musi być na zarejestrowanej domenie produkcyjnej — nie zadziała na
  preview URL Vercela ani localhost (do testów: sandbox + ngrok/tunel albo deploy).
- Webhook idempotentny — P24 ponawia notyfikacje; maile/Baselinker raz.
- Podpisy: md5 z pól rozdzielonych `|` (rejestracja: sessionId|merchant|amount|PLN|crc;
  notyfikacja: sessionId|orderId|amount|currency|crc; verify: sessionId|orderId|amount|PLN|crc).
- `p24_wait_for_result=1` ogranicza stany „pending", ale wydłuża redirect
  (takma logowała 20-40 s — do obserwacji).

---

## STATUS WDROŻENIA (2026-06-13) — kod sandbox GOTOWY

Zaimplementowane (bez migracji DDL — `sessionId = shop_orders.id`, match webhooka po `id`):
- `lib/p24.ts` — port z takmy (czysta logika, API 3.2).
- `app/api/shop/p24/create/route.ts` — rejestracja transakcji (kwota = total_brutto×100 grosze), zwraca redirectUrl.
- `app/api/shop/p24/webhook/route.ts` — urlStatus: sign → match po id → kwota → p24Verify → 'succeeded'/'confirmed'/paid_at (idempotentnie, service-role).
- `app/api/shop/p24/status/route.ts` — polling dla strony sukcesu.
- `app/sklep/zamowienie/page.tsx` — metoda online `'stripe'`→`'p24'`, endpoint `/api/shop/p24/create`, etykiety „Przelewy24".
- `app/sklep/zamowienie/sukces/page.tsx` — obsługa powrotu P24 (`?order=&sid=` → polling p24/status) + zachowana ścieżka Stripe (`session_id`).
- `.env.local` — blok `P24_SANDBOX=true` + puste `P24_MERCHANT_ID/POS_ID/CRC` (do uzupełnienia).
- `stripe_payment_id` reużyte na id transakcji P24 (bez nowej kolumny).

### Co zostało po stronie usera, by przetestować sandbox:
1. Załóż konto **sandbox**: https://sandbox.przelewy24.pl/panel → odbierz `P24_MERCHANT_ID` (=POS_ID) i `P24_CRC` (klucz CRC z konfiguracji), wpisz do `.env.local`.
2. urlStatus wymaga **publicznej domeny** — sandbox nie woła localhost. Opcje:
   - deploy na Vercel preview/prod (dodaj P24_* w env Vercela) i tam testuj, albo
   - tunel (np. `cloudflared`/`ngrok`) na port 3002 i w panelu sandbox ustaw urlStatus na URL tunelu `/api/shop/p24/webhook`.
3. W panelu sandbox zarejestruj urlStatus oraz (jeśli wymaga) urlReturn.
4. Test E2E: koszyk → „Płatność online" → P24 sandbox (testowy BLIK/przelew) → powrót na /sukces → status 'succeeded'.

### Produkcja (po sandboxie):
- Konto produkcyjne P24 dla serwis-zebry.pl (Faza 0, opcja A/B powyżej) → P24_SANDBOX=false + klucze prod na Vercelu.
- Regulamin/polityka: dopisać Przelewy24 jako operatora (wzorzec w takma/regulamin).
- Opcjonalnie: dedykowane kolumny `p24_session_id`/`p24_order_id` zamiast reużycia stripe_payment_id.
- Naprawy zostają na Stripe.
