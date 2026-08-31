---
name: karta-produktu
description: Budowa karty produktu urządzenia w sklepie serwis-zebry.pl — kompletna checklista wypracowana na dziesięciu kartach klasy biurkowej (ZD220–ZD621). Używać przy KAŻDYM nowym urządzeniu: drukarki, terminale, skanery, tablety.
---

# Karta produktu urządzenia — wzorzec (klasa biurkowa, sierpień 2026)

Jedna karta = jeden wariant modelu (ZD421t osobno od ZD421d — inna technologia,
inna fraza, inny klient). Numery katalogowe są wyborem WEWNĄTRZ karty, nie osobnymi
adresami. Wszystko poniżej wykonać w całości; kolejność sprawdzona na dziesięciu kartach.

## 0. Kolejność wdrożenia (nauczka z ZD230t)

1. Zdjęcia, treść, sitemapy → **do repo**.
2. Wpis do bazy z `is_active: false`.
3. `npm run build` + weryfikacja na `next start -p 3003`.
4. Commit i push.
5. **Dopiero po deployu** `is_active: true`.

Odwrotna kolejność daje kartę żywą na produkcji z pustą galerią: baza jest wspólna
dla prod i dev, więc produkt włączony przed deployem pokazuje zdjęcia, których na
serwerze jeszcze nie ma.

## 1. Numery katalogowe — WERYFIKOWAĆ, nie zgadywać

Nie wyprowadzać PN-ów z wzorca innego modelu. Sprawdzić każdy:

```
curl -s "https://www.serwis-zebry.pl/api/shop/product-stock?sku=PN" | python3 -m json.tool
```

`found: true` plus cena = numer istnieje u dystrybutora. Pułapki, które to wyłapało:
kod Wi-Fi w ZD411 to `EW02`, a w ZD421 `EX02`; wersje z ekranem w ZD621 to `ZD6A1…`,
nie `ZD6A0…`. **`scripts/check-ingram-stock.mjs` jest martwy** — endpoint Ingrama
oddaje dziś HTML zamiast XML.

## 2. Dane produktu (Supabase `products`)

- `product_type='drukarka'`, `slug='zebra-<model>'`, `device_model` z literą wariantu
- `sku` = PN najtańszej wersji; `price`/`price_brutto` = fallback (cron nadpisze)
- `attributes.klasa` = slug klasy z `lib/printer-classes.ts`
- `attributes.variants[]` = `{ pn, dpi, label, cechy }`, gdzie `cechy` to osie widoczne
  w tabeli: `Rozdzielczość`, `Łączność`, `Wyposażenie`, `Panel`, `Kolor`
- **Cecha, którą ma KAŻDY wariant, musi mieć wartość w każdym** — kolumna „Kolor"
  z kreskami przy czarnych wersjach i nazwą tylko przy białej była błędem; czarne
  dostają wprost `Kolor: Czarna`. Kreska zostaje tylko tam, gdzie oznacza brak dodatku
  (odklejak, gilotyna).
- **Wartości `Łączność` muszą pokrywać się z opcjami filtra** (`USB`, `Ethernet`, `Wi-Fi`) —
  wpis „USB, Ethernet, RS-232" nie trafi w żaden chip i kafelek zniknie z listy
- `image_urls` = 2–3 zdjęcia z repo takma (`public/images/products`, TYLKO odczyt),
  przekonwertowane `cwebp -q 90` do `public/sklep_photo/urzadzenia/<model>_N.webp`.
  Pierwsze zdjęcie = główne (galeria otwiera się na nim)
- `meta_title` ≤ 64 zn.: „Drukarka etykiet Zebra <MODEL> — cena i dostępność | Serwis Zebra"
- `meta_description` 160–185 zn., bez sztywnych cen

## 3. Treść karty (`lib/device-content.tsx` → `TRESC_KART[slug]`)

Wpis zawiera: `rekomendowanyPn`, `zdjecieGlowne`, `wSkrocie`, `zweryfikowano`,
`poradniki`, `opis`, `osie`, `faqNaglowek`, `faq`, `spec`.

**`wSkrocie` (5–6 zdań)** — blok cytowalny przez modele językowe. Każde zdanie broni się
bez reszty strony, zawiera nazwę modelu i liczbę, i NIE powtarza zdań z `opis`. Kolejność:
czym jest → rozdzielczość i prędkość → materiały → granica modelu → następstwo po starszej
serii. Tu ma stać ostrzeżenie, które ratuje zakup („ZD411 nie wydrukuje etykiety
kurierskiej 100 × 150 mm").

**`zweryfikowano`** — data sprawdzenia danych u producenta (ISO). Widoczna pod
specyfikacją i jako `dateModified` w schemacie.

**`poradniki`** — 3 slugi wpisów z bloga do sekcji „Gdy coś nie działa": dedykowana
diagnostyka serii, jeśli istnieje, plus blady wydruk i czyszczenie głowicy. Slugi, nie
gotowe linki — tytuł i okładkę bierze `getPostBySlug`. Sprawdzić, czy nie dublują FAQ.

**`opis` (3 akapity, rejestr formalny)**: pozycjonowanie i technologia → parametry
przełożone na korzyści → integracja i GRANICE modelu z linkiem do właściwszego sprzętu.
Fakty przepisane własnymi słowami (anty-duplikacja z takma.com.pl), nigdy „karta
katalogowa podaje".

**`osie`** — po jednej karcie na oś różnicującą warianty; termin po lewej, opis po prawej.

**`faq` (5 pytań)**: frazy głosowe, odpowiedź zaczyna się od rozstrzygnięcia, każde z
linkiem do ISTNIEJĄCEGO wpisu (sprawdzić 200). Dobre pytanie zawiera liczbę policzalną
(„74 m taśmy ≈ 1480 etykiet 50 mm").

**`spec`** — 10–17 wierszy z danymi POTWIERDZONYMI u producenta (tech-specs PDF przez
`pdftotext -layout`). Czego nie da się potwierdzić, tego nie ma: waga ZD230t pominięta,
bo producent podaje jedną liczbę dla obu wersji.

## 4. Co karta dostaje automatycznie

Blok „W skrócie", data weryfikacji, `additionalProperty` w ProductGroup, baner materiałów
eksploatacyjnych (wersja „d" → etykiety termiczne; „t" → taśmy + etykiety), sekcja
poradników i pasek kotwic — wszystko renderuje `[slug]/page.tsx` z konfiguracji.
Rodzaj druku czytany z ostatniej litery `device_model`.

## 5. Schema (SEO/AEO)

ProductGroup + hasVariant z cenami BRUTTO z cache, `additionalProperty` ze `spec`,
FAQPage, BreadcrumbList, WebPage z `primaryImageOfPage` i `dateModified`.
**Dostępność**: `InStock` tylko gdy `stockPL > 0 || stockEU > 0`; towar w drodze
(`inDelivery`) to `BackOrder`, nie InStock — inaczej obiecujemy wysyłkę czegoś,
czego u dystrybutora nie ma, a to droga do zawieszenia oferty w Merchant Center.

## 6. Po dodaniu karty — checklist

1. `app/sitemap.ts` (priority 0.9)
2. `app/instrukcje/[model]/page.tsx` → `SPRZEDAWANE_MODELE` — most z rankującej instrukcji
3. `public/sitemap-images.xml` — zdjęcia w kolejności galerii
4. `public/llms.txt` — model w sekcji klasy, jednym zdaniem z parametrami
5. Strona klasy: kafelek pojawia się sam, ale **treść kategorii trzeba dopisać** —
   sekcje serii, wiersz w tabeli porównawczej, blok „w skrócie", FAQ kategorii
6. Cron `stock-sync` sam zbiera PN-y; po deployu odpalić ręcznie, żeby zasilić cache
7. Weryfikacja na buildzie (`next start -p 3003`, NIE dev): 200, wszystkie PN-y w HTML
   z cenami z serwera, JSON-LD parsuje się w całości, zero poziomego scrolla na 1440
   i 390 px, `node scripts/test-filtr-wariantow.mjs` zielony
8. Commit i push, potem `is_active: true` i sprawdzenie produkcji

## Antywzorce (z historii projektu)

- ZERO sztywnych cen w treści i meta
- Nie pisać „na takmie", „w PDF", „karta katalogowa"; nie wymieniać materiałów spoza
  rynku PL (Z-Xtreme…)
- Opis NIE potoczny („zakładasz", „staje przy stanowisku")
- Boxy bez kolorowych left-borderów, bez pigułek nad H1
- Nie zgadywać, jaki sprzęt naprawiał klient / co jest na renderze — sprawdzić
- Prettier bez configu repo przeformatuje cały plik (podwójne cudzysłowy, średniki)
  i zaśmieci diff — nie uruchamiać go na `lib/device-content.tsx`
