---
name: karta-produktu
description: Budowa karty produktu urządzenia w sklepie serwis-zebry.pl — kompletna checklista wypracowana na ZD421t. Używać przy KAŻDYM nowym urządzeniu (drukarki, potem skanery/terminale).
---

# Karta produktu urządzenia — wzorzec (ZD421t, sierpień 2026)

Jedna karta = jeden wariant modelu (ZD421t osobno od ZD421d — inna technologia,
inna fraza, inny klient). Wszystko poniżej wykonać W CAŁOŚCI; kolejność sprawdzona.

## 1. Dane produktu (Supabase `products`)

- `product_type='drukarka'`, `is_active=true`, `slug='zebra-<model>'` (bez „drukarka" w slugu)
- `name` = „Drukarka etykiet Zebra <MODEL>", `device_model` = np. „ZD421d" (wariant z literą!)
- `sku` = PN najtańszej wersji; `price`/`price_brutto` = fallback (żywe ceny nadpisze cron)
- `attributes.klasa` = slug klasy z `lib/printer-classes.ts` (biurkowe/mobilne/…)
- `attributes.variants[]` = `{ pn, label, dpi, lacznosc }` — label „203 dpi, USB + Ethernet",
  lacznosc jako lista „USB, Bluetooth, Wi-Fi" (tabela filtruje po `includes`)
- `image_urls` = 3 zdjęcia `/sklep_photo/urzadzenia/<model>_{1,2,3}.webp` (1200×1200,
  render producenta; źródło: repo takma `public/images/products` — TYLKO odczyt!)
- `meta_title` = „Drukarka etykiet Zebra <MODEL> — cena i dostępność | Serwis Zebra"
  (≤63 zn., fraza z przodu, marka na końcu, ZERO sztywnych cen — dezaktualizują się)
- `meta_description` ~160–185 zn.: technologia, 203/300 dpi, wersje łączności,
  „ceny i stany na żywo, wysyłka 24 h, gwarancja w autoryzowanym serwisie"

## 2. Treść karty (`lib/device-content.ts` → `TRESC_KART[slug]`)

Cała treść per model siedzi w konfiguracji, NIE w page.tsx. Wpis zawiera:
`rekomendowanyPn`, `zdjecieGlowne`, `opis[]`, `wersje`, `faq[]`, `spec[]`.

**Opis (3 akapity, rejestr FORMALNY — język umowy, nie notatki; zero mowy potocznej):**
1. Co to jest i dla kogo — pozycjonowanie, technologia druku i jej konsekwencja
   (trwałość/koszt), typowe zastosowania, czyj następca.
2. Parametry przełożone na korzyści: dpi, prędkość, szerokość druku
   (104 mm = pełny format kurierski 100×150), media, automatyczna kalibracja.
3. Integracja: złącza standardowe, moduły łączności bez wymiany urządzenia,
   ZPL II/EPL = zgodność z szablonami i systemami, migracja ze starszego modelu.
- Fakty z repo takma przepisane WŁASNYMI słowami (anty-duplikacja z takma.com.pl
  i wytyczne: nigdy nie cytować „karta katalogowa podaje")
- Konkurencja z 1. strony Google to spec-dumpy — różnicować głosem serwisu
  (co się psuje, czego unikać, kiedy wybrać inny model + link wewnętrzny do niego)

**„Którą wersję wybrać"**: dwie karty (Rozdzielczość / Łączność), termin po lewej
(w-16), opis po prawej — do skanowania, nie zdania.

**FAQ (AEO)**: 5 pytań z frazami głosowymi („Jak…", „Czym różni się…", „Co oznacza…"),
odpowiedź 2–3 zdania wprost + link do ISTNIEJĄCEGO wpisu na blogu. FAQPage schema
generuje się z tej samej tablicy.

**Spec**: tabela ~10 wierszy z twardymi danymi (z takmy), wiersz „Stan: Nowy,
oryginalny" na zielono, „Gwarancja: 24 miesiące".

## 3. Strona (`app/sklep/drukarki-etykiet/[slug]/page.tsx`) — co dostaje karta

- Pasek kotwic sekcji: #warianty #opis #akcesoria #faq #specyfikacja #dokumentacja
  (sekcje mają `scroll-mt-24`)
- DeviceBuyBlock: JEDEN wspólny fetch stanów dla panelu i tabeli (nigdy osobne!),
  `stanyPoczatkowe` z `pobierzStany` (serwerowo — ceny są w pierwszym HTML-u)
- Tabela wariantów: klik wybiera wersję (`?pn=` w adresie, history.replaceState),
  dymki „?" przy DPI/Łączności/Dostępności, stałe szerokości kolumn,
  wybrany wariant ZAWSZE widoczny (także zerowy stan), plakietka „najczęściej wybierana"
- Akcesoria: dopasowują się same po `device_model` (`pasujeDoModelu` — rodzina ZD421
  łapie oba warianty, „ZD421t" tylko t). Sprawdzić, czy części d/t są w bazie!
- Brak stanu akcesorium → przycisk „Powiadom" (stock_alerts), nie martwy koszyk

## 4. Schema (SEO/AEO)

- ProductGroup + hasVariant[] z realnymi cenami BRUTTO z cache; oferta TYLKO gdy
  cena > 0; availability z faktycznego stanu (nigdy sztywne InStock)
- Offer: shippingDetails (25 zł, deliveryTime wg magazynu PL/EU),
  hasMerchantReturnPolicy (14 dni, ReturnShippingFees + returnShippingFeesAmount 25 zł)
- WebPage.primaryImageOfPage = render urządzenia (Google potrafi wziąć na miniaturę
  zdjęcie akcesorium — nazwy części zawierają model!)
- FAQPage + BreadcrumbList
- `ZDJECIE_GLOWNE` na sztywno per slug (og:image, schema, primaryImageOfPage)

## 5. Po dodaniu karty — checklist

1. `app/sitemap.ts` — wpis karty (priority 0.9)
2. `public/sitemap-images.xml` — zdjęcia urządzenia przypisane do adresu karty
3. Strona klasy (biurkowe itd.) czyta produkty z bazy — kafelek pojawi się sam;
   sprawdzić chipy i cenę na kafelku
4. Cron stock-sync sam zbiera PN-y wariantów z `products` — po deployu odpalić
   ręcznie `?pn=<PN1>,<PN2>,…` z CRON_SECRET, żeby od razu zasilić cache
5. Build (`rm -rf .next && npm run build`) + weryfikacja na `next start -p 3003`
   (dev NIE nadaje się do pomiarów layoutu), Playwright: brak scrolla poziomego,
   JSON-LD parsuje się, ceny w HTML-u z serwera
6. Commit + push dopiero po weryfikacji; dev wraca na port 3002

## Antywzorce (z historii projektu)

- ZERO sztywnych cen w treści/meta (żywe ceny z cache; `priceFrom` takmy bywa stary)
- Nie pisać „na takmie/w PDF"; nie wymieniać materiałów spoza rynku PL (Z-Xtreme…)
- Badge'e dostępności binarne: Dostępny / Niedostępny
- Boxy bez kolorowych left-borderów; bez pigułek nad H1
- Opis NIE potoczny („zakładasz", „staje przy stanowisku" — zakazane)
