# TAKMA GA4 — co JEST, czego NIE MA, lista zmian

**Property**: takma.com.pl/ GA4 - ExactMetrics (359306315)
**Status zmian**: brak zmian od marca 2026 (zmiany były tylko na serwis-zebry.pl)
**Audyt**: live, 10 maja 2026

---

## ✅ Co JEST (działa OK)

| Element | Status | Szczegóły |
|---|---|---|
| **Property GA4** | ✅ Active | Stream ID 4756899378, traffic w ciągu 48h |
| **Google Ads** | ✅ Connected | TAKMA TADEUSZ TIUCHTY (342-193-1664), od 08.2023 |
| **Retention** | ✅ 14 miesięcy | Maximum dla GA4 |
| **purchase event** | ✅ Działa | 4 events / 2 users w 28 dni |
| **strona_kontakt event** | ✅ Działa | 243 events / 192 users w 28 dni |
| **Standard events** | ✅ Działa | page_view, view_item, view_cart, add_to_cart, begin_checkout, generate_lead, form_start (ExactMetrics) |
| **Custom dimensions** | ✅ 12 zmiennych | Z ExactMetrics WordPress plugin |
| **Audiences** | ✅ 6 list | All Users, Wszyscy 30/60/180/360, Purchasers |
| **Microsite referral tracking** | ✅ Widać | zebrazt411.pl / referral, chatgpt.com / referral |

---

## ❌ Czego NIE MA / co BROKEN

### KRYTYCZNE (do natychmiastowej naprawy):

**1. 6 broken key events** (te same od marca — żadnej zmiany!)

| Event | Status | Co powinno śledzić |
|---|---|---|
| `klik_mail` | ❌ Nie wykryto danych | Kliknięcia w adresy email na stronie |
| `klik_tel` | ❌ Nie wykryto danych | Kliknięcia w numery telefonów (mobile mostly) |
| `mailto` | ❌ Nie wykryto danych | `<a href="mailto:...">` clicks (duplikat klik_mail?) |
| `podstrona_kontakt` | ❌ Nie wykryto danych | Wizyty podstron kontaktowych |
| `tel` | ❌ Nie wykryto danych | `<a href="tel:...">` clicks (duplikat klik_tel?) |
| `wyslanie_formularza` | ❌ Nie wykryto danych | Form submit (po form_start) |

**Skutek**: brak danych o **realnych konwersjach B2B przez telefon/mail**. Jedyne mierzone leady to `generate_lead` (16/m-c). Realnie pewnie 50-150 leadów/m-c jest niemierzonych przez phone/email.

### WYSOKIE (do naprawy w 1-2 tyg):

**2. Currency USD zamiast PLN**

- Raporty pokazują `$2 140.49` zamiast PLN
- Wymaga zmiany w **Admin → Strumienie danych → Edytuj → Ustawienia szczegółowe → Waluta sprawozdawcza**

**3. Brak połączenia z Google Search Console**

- GSC NOT connected do GA4 TAKMA (serwis-zebry MA, TAKMA NIE)
- Brak raportu queries / position / CTR z Google
- Wymaga: **Admin → Połączenia usług → Search Console → Połącz**

**4. Brak Google Signals**

- Brak danych demograficznych (płeć, wiek, zainteresowania)
- Brak remarketing cross-device
- Wymaga: **Admin → Zbieranie danych → Włącz Google Signals**

### ŚREDNIE (do naprawy w 1 mies):

**5. Duplikat strony "Serwis i naprawa drukarek etykiet"**

Top pages pokazują DWA rekordy:
- "Serwis i naprawa drukarek etykiet... | TAKMA": 377 views, **39.2% bounce**
- "Serwis i naprawa drukarek etykiet... | TAKMA | TAKMA" (2x TAKMA w title): 160 views, **48.9% bounce**

Wygląda jak duplikat lub błąd title tag. Sprawdzić w CMS i scal/redirect.

**6. Brak BigQuery Export**

- Bez surowych danych długoterminowych
- Wymaga: **Admin → BigQuery Linki → Połącz**

**7. Lejek e-commerce drop-off**

- add_payment_info: 30 → purchase: 4 = **13.3% completion**
- 26 osób doszło do płatności i porzuciło
- Audit checkout flow (PayU/Przelewy24, BLIK, Apple Pay?)

**8. Lejek lead-gen drop-off**

- form_start: 211 → generate_lead: 16 = **7.58% completion**
- 195 osób zaczęło formularz i nie wysłało
- CRO formularza: less fields, mobile-first, trust signals

---

## 🎯 Plan działania — co konkretnie zrobić

### KROK 1: Napraw 6 broken events (1-2h dev/GTM)

**Lokalizacja w GA4**: Admin → Wyświetlanie danych → **Zdarzenia** (już tam byliśmy)

**Co zrobić**:

A) **Sprawdzić w GTM (Google Tag Manager)** czy są skonfigurowane tagi dla:
- Click trigger na `a[href^="mailto:"]` → fire event `klik_mail` lub `mailto`
- Click trigger na `a[href^="tel:"]` → fire event `klik_tel` lub `tel`
- Page View trigger na `Page Path equals /kontakt` → fire event `podstrona_kontakt`
- Form Submission trigger → fire event `wyslanie_formularza`

B) **Jeśli tagi NIE istnieją**:
- Utworzyć je w GTM
- Test DebugView
- Wdrożyć Container Version
- Czekać 24h na pełną integrację

C) **Jeśli tagi ISTNIEJĄ ale nie działają**:
- Sprawdź czy Trigger Conditions są poprawne
- Sprawdź `gtag('event', 'klik_tel', {...})` syntax
- Sprawdź czy Container jest opublikowany (nie tylko draft)

### KROK 2: Sugerowane uproszczenie 8 → 4 events

Wygląda na duplikaty:
- `klik_mail` = `mailto` (oba dla email clicks)
- `klik_tel` = `tel` (oba dla phone clicks)
- `podstrona_kontakt` vs `strona_kontakt` (page view kontakt page)

**Sugerowana czystka**:

| Zostawić | Usunąć | Powód |
|---|---|---|
| `klik_mail` | `mailto` | mailto = url protocol, klik_mail = nazwa eventu intuicyjniejsza |
| `klik_tel` | `tel` | tel = protocol, klik_tel = łatwiej w GA4 reports |
| `strona_kontakt` ✅ działa | `podstrona_kontakt` | strona_kontakt już działa, drugi to duplikat |
| `wyslanie_formularza` | — | Zostawić, krytyczne |
| `purchase` ✅ | — | Zostawić |

**Finalna lista 5 key events** (po cleanup):
1. ✅ purchase (działa)
2. ✅ strona_kontakt (działa)
3. ⚠️ klik_mail (do naprawy)
4. ⚠️ klik_tel (do naprawy)
5. ⚠️ wyslanie_formularza (do naprawy)

### KROK 3: Currency USD → PLN (5 min)

1. **Admin** (lewy dół) → **Strumienie danych**
2. Kliknij na strumień **TAKMA** (4756899378)
3. **Skonfiguruj ustawienia tagu**
4. **Pokaż wszystko (n)** → **Włącz odpowiednie funkcje**
5. Lub: **Ustawienia szczegółowe** → **Waluta** → zmień na PLN

### KROK 4: Podłącz Google Search Console (10 min)

1. **Admin** → **Połączenia usług** → **Search Console**
2. Kliknij **Połącz**
3. Wybierz **takma.com.pl** (musi być Twoja własność w GSC)
4. Wybierz strumień GA4 i strumień GSC
5. Zaznacz "Web stream" i kliknij **Wyślij**

**Po podłączeniu** — w GA4 pojawi się sekcja **Reports → Search Console** z queries/CTR/positions z Google.

### KROK 5: Włącz Google Signals (5 min)

1. **Admin** → **Zbieranie danych**
2. **Zbieranie sygnałów Google** → kliknij **Skonfiguruj**
3. Włącz wszystkie zainteresowania (Age, Gender, Interests)
4. Potwierdź zgodę z polityką prywatności

**Po włączeniu** — w GA4 raportach pojawi się sekcja **Atrybuty użytkownika → Demografia** z wieku, płci, zainteresowań.

### KROK 6: Audit checkout flow (30 min)

W trybie incognito otwórz takma.com.pl i:

1. Dodaj do koszyka **Zebra ZD230d** (cena ~640 zł)
2. Wypełnij checkout do końca (NIE zatwierdzaj)
3. Sprawdź w GA4 → DebugView czy lecą:
   - `add_to_cart`
   - `begin_checkout`
   - `add_payment_info`
4. Sprawdź gdzie dokładnie urywa się proces:
   - Czy `purchase` strzela po success?
   - Czy redirect z PayU/Przelewy24 wraca na success page?
   - Czy success page ma GTM trigger?

### KROK 7: Audit duplikat strony Serwis (15 min)

1. Sprawdź **canonical URL** w `<head>` strony /serwis (lub jej różnymi URL-ami)
2. Sprawdź czy są dwa różne URL-e:
   - `/serwis-i-naprawa-drukarek-etykiet`
   - `/serwis-i-naprawa-drukarek-etykiet/` (z trailing slash)
   - `/serwis-i-naprawa-drukarek-etykiet?...` (z query params)
3. Jeśli są — **301 redirect** wszystkich na jeden kanoniczny URL
4. Sprawdź **meta title** — czy nie ma duplikatu "TAKMA | TAKMA"

---

## 📊 Stan po wprowadzeniu wszystkich zmian

| Element | Przed | Po |
|---|---|---|
| Key events działające | 2/8 | **5/5** (po cleanup) |
| Real lead volume (tel + mail + form) | nieznane | **mierzone** |
| Currency | USD | **PLN** |
| GSC integration | brak | **podłączone** |
| Google Signals | wyłączone | **włączone** |
| Demographics data | brak | **dostępne** |
| Search queries | brak | **dostępne w GA4** |
| Lejek konwersji | broken | **mierzony end-to-end** |

---

## ⏱️ Estymacja czasu wdrożenia

| Krok | Czas | Wymaga |
|---|---|---|
| 1. Napraw 6 broken events | **1-2h** | GTM admin + dev |
| 2. Cleanup (8→5 events) | **15 min** | GA4 admin |
| 3. Currency USD→PLN | **5 min** | GA4 admin |
| 4. Podłącz GSC | **10 min** | GA4 + GSC admin |
| 5. Włącz Google Signals | **5 min** | GA4 admin |
| 6. Audit checkout flow | **30 min** | testing |
| 7. Audit duplikat Serwis | **15 min** | CMS + testing |
| **TOTAL** | **~3h** | mieszane |

3 godziny pracy — i TAKMA dostaje **kompletną pomiarówkę** na poziomie serwis-zebry.

---

## 📋 Checklist wykonania

- [ ] **GTM**: skonfigurować/poprawić 6 broken events
- [ ] **GA4**: cleanup 8→5 key events (usunąć duplikaty)
- [ ] **GA4 Stream**: zmienić walutę USD → PLN
- [ ] **GA4 Połączenia**: podłączyć Search Console (takma.com.pl)
- [ ] **GA4 Data Collection**: włączyć Google Signals
- [ ] **CMS/UX**: audit checkout flow (drop-off 13.3% add_payment → purchase)
- [ ] **CMS**: scal duplikat strony Serwis (39.2% vs 48.9% bounce)
- [ ] **Po 7 dniach** (17 maja): sprawdzić Realtime + Reports → Events czy nowe eventy lecą
- [ ] **Po 14 dniach** (24 maja): nowy audyt z **pełnymi danymi** lead-gen B2B
