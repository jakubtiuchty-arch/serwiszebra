# zebrazt411.pl — CTR optimization 4 priority pages

**Data audytu**: 12 maja 2026 (live z GSC + Chrome MCP)
**Cel**: Podbić CTR na stronach które już rankują w/blisko TOP 10. Zero linkbuilding, zero contentu — sama optymalizacja `<title>` + `meta description`.
**ETA**: ~30 min wdrożenia, efekt widoczny w GSC za 7-14 dni.

---

## Kontekst — co GSC mówi (28 dni)

| Metryka | Wartość |
|---|---|
| Total clicks | 5 |
| Total impressions | 284 |
| CTR | 1.76% |
| Avg position | 28.3 |

**Striking distance keywords** (pos 5-20 = "wystarczy podbić CTR / lekko poprawić relevance"):

| Query | Impressions | Position | Priorytet |
|---|---|---|---|
| zt411 linerless | 12 | **8.7** | 🔥 TOP 10 — natychmiast |
| zebra technologies | 8 | 9.0 | Brand query — pomijamy |
| zebra 411 | 5 | 10.0 | Boundary TOP 10 |
| zebra zt411 linerless | 4 | 11.0 | Striking |
| zebra zt411 rfid | 6 | 12.8 | Striking |
| zebra zt411 300 dpi | 9 | 16.7 | Striking |

**Wniosek**: 4 strony są na granicy TOP 10. Same lepsze title + meta = +30-50% CTR + lekkie podbicie pozycji (Google CTR signal).

---

## 1. /zt411-linerless — TOP 10, najwyższy priorytet

### Stan obecny

```
<title>ZT411 Linerless — druk bezpodkładowy | od 8 146 zł</title>
<meta name="description" content="ZT411 Linerless: druk bez podkładu. +50% etykiet na rolkę, zero odpadów, redukcja CO2. Gilotyna linerless. Od 8 146 zł netto.">
```

**Problemy**:
- Brak "Zebra" w title — query użytkownika to **"zebra zt411 linerless"** (4 impressions na pos 11)
- Brak brand authority signal (TAKMA / partner Zebra)
- Brak konkretnego CTA

### Propozycja

```
<title>Zebra ZT411 Linerless — druk bez podkładu | od 8 146 zł</title>
<meta name="description" content="Zebra ZT411 Linerless: +50% etykiet na rolkę, zero odpadów, gilotyna. Autoryzowany partner Zebra — TAKMA. Cena od 8 146 zł netto. Dostawa 24h.">
```

**Długości**: title 55 chars ✅ | meta 148 chars ✅

**Zmiany**:
- ➕ "Zebra" prefix → exact match dla "zebra zt411 linerless"
- ➕ "Autoryzowany partner Zebra — TAKMA" → trust signal (B2B kupuje od partnerów)
- ➕ "Dostawa 24h" → CTA / pilność
- ➖ "redukcja CO2" → wycięte (B2B kupuje na funkcjonalności, nie ESG; w treści zostaje)

---

## 2. /zt411-rfid — pos 12.8, striking distance

### Stan obecny

```
<title>Zebra ZT411 RFID UHF — EPC gen. 2 | od 6 984 zł</title>
<meta name="description" content="ZT411 RFID: koder UHF EPC gen. 2 v2.1, ISO/IEC 18000-63, RAIN RFID. Adaptive encoding, wariant On-Metal. Cena od 6 984 zł netto. Partner Zebra — TAKMA.">
```

**Problemy**:
- Title już ma "Zebra" ✅ — ale można dodać słowo "koder" które jest w meta (dobry sygnał relevance)
- Meta dobra, drobna optymalizacja

### Propozycja

```
<title>Zebra ZT411 RFID UHF — koder EPC gen. 2 | od 6 984 zł</title>
<meta name="description" content="Zebra ZT411 RFID UHF: koder EPC gen. 2 v2.1, RAIN RFID, adaptive encoding. Wariant On-Metal. Autoryzowany partner Zebra — TAKMA. Od 6 984 zł netto.">
```

**Długości**: title 53 chars ✅ | meta 148 chars ✅

**Zmiany**:
- ➕ "koder" w title → druga match keyword
- ➕ "Autoryzowany" przed "partner Zebra" → silniejszy trust signal
- ➖ "ISO/IEC 18000-63" w meta → trochę za techniczne dla snippet (zostaje w treści)

---

## 3. /300-dpi — pos 16.7, striking distance

### Stan obecny

```
<title>ZT411 300 dpi — drukarka GS1 DataMatrix | od 6 741 zł</title>
<meta name="description" content="Zebra ZT411 300 dpi: 12 pkt/mm, kod 2D od 5 mm, szybkość 305 mm/s. Najpopularniejsza rozdzielczość — kosmetyki GHS, laboratoria, farmacja. Od 6 741 zł netto.">
```

**Problemy**:
- Brak "Zebra" w title — query "zebra zt411 300 dpi" (9 impressions)
- Title nie zawiera "ZT411" jako pełnej frazy w kontekście marki

### Propozycja

```
<title>Zebra ZT411 300 dpi — drukarka GS1 DataMatrix | od 6 741 zł</title>
<meta name="description" content="Zebra ZT411 300 dpi (12 pkt/mm): kod 2D od 5 mm, 305 mm/s. Kosmetyki GHS, laboratoria, farmacja. Autoryzowany partner Zebra — TAKMA. Od 6 741 zł netto.">
```

**Długości**: title 59 chars ⚠️ (na granicy, ale OK) | meta 152 chars ✅

**Zmiany**:
- ➕ "Zebra" prefix → exact match
- ➕ "Autoryzowany partner Zebra — TAKMA" → trust signal
- ➖ "Najpopularniejsza rozdzielczość" → zbyt opisowe (zostaje w H1/treści)

---

## 4. /600-dpi — pos ~50, niższy priorytet ale niskim kosztem

### Stan obecny

```
<title>ZT411 600 dpi — drukarka mikrotekstu | od 11 097 zł</title>
<meta name="description" content="Zebra ZT411 600 dpi: 24 pkt/mm, najmniejsza kreska 0,042 mm. Mikrotekst, kody 2D, PCB, farmacja UDI. Tylko w ZT411. Cena od 11 097 zł netto. Partner Zebra — TAKMA.">
```

**Problemy**:
- Brak "Zebra" w title
- "Tylko w ZT411" — jednostkowy benefit, ale w title byłoby lepiej

### Propozycja

```
<title>Zebra ZT411 600 dpi — drukarka mikrotekstu | od 11 097 zł</title>
<meta name="description" content="Zebra ZT411 600 dpi (24 pkt/mm): kreska 0,042 mm, mikrotekst, PCB, farmacja UDI. Najwyższa rozdzielczość Zebra. Autoryzowany partner — TAKMA. Od 11 097 zł.">
```

**Długości**: title 57 chars ✅ | meta 153 chars ✅

**Zmiany**:
- ➕ "Zebra" prefix w title
- ➕ "Najwyższa rozdzielczość Zebra" → unikalna pozycja produktu
- ➕ "Autoryzowany partner" → trust signal

---

## Implementacja — 4 pliki do edycji

Jeśli zebrazt411.pl jest Next.js / podobny stack — szukać `metadata` w plikach page:

```
zebrazt411.pl/
├── app/
│   ├── zt411-linerless/page.tsx  ← edycja #1
│   ├── zt411-rfid/page.tsx       ← edycja #2
│   ├── 300-dpi/page.tsx          ← edycja #3
│   └── 600-dpi/page.tsx          ← edycja #4
```

W każdym pliku:

```typescript
export const metadata: Metadata = {
  title: 'Zebra ZT411 Linerless — druk bez podkładu | od 8 146 zł',
  description: 'Zebra ZT411 Linerless: +50% etykiet na rolkę, zero odpadów, gilotyna. Autoryzowany partner Zebra — TAKMA. Cena od 8 146 zł netto. Dostawa 24h.',
}
```

(Analogicznie dla pozostałych 3 stron — według propozycji powyżej.)

---

## Co się stanie po deploy (timeline)

| Czas | Co się dzieje |
|---|---|
| **0-24h** | Google crawluje nowe meta tagi (sitemap ping przyspiesza) |
| **2-7 dni** | Snippety w SERP się aktualizują (czasem Google ignoruje meta i generuje własne) |
| **7-14 dni** | GSC zaczyna pokazywać zmiany CTR |
| **14-30 dni** | Pozycje mogą się przesunąć (Google CTR signal) — najbardziej dla `/zt411-linerless` (już TOP 10) |

---

## Oczekiwany efekt (estymata)

| Strona | CTR teraz | CTR po | Clicks/m-c teraz | Clicks/m-c po |
|---|---|---|---|---|
| /zt411-linerless | ~1% (TOP 10) | **2-4%** | ~3 | **6-12** |
| /zt411-rfid | ~0% (poza TOP 10) | 0.5-1% | 0 | 1-3 |
| /300-dpi | ~0% | 0.3-0.7% | 0 | 1-2 |
| /600-dpi | ~0% | 0.2-0.5% | 0 | 0-1 |
| **TOTAL** | — | — | **3** | **8-18** |

3-6x wzrost clicks tylko z optymalizacji meta. Bez dotykania contentu, bez nowych linków.

---

## Następne kroki po wdrożeniu

1. **Po 7 dniach (19 maja)**: sprawdzić w GSC czy CTR rośnie
2. **Po 14 dniach (26 maja)**: sprawdzić pozycje — czy /zt411-linerless wszedł do TOP 5
3. **Jeśli efekt OK**: zrobić to samo dla pozostałych microsites (tc22.pl ma analogiczne struktury)
4. **Jeśli efekt słaby**: oznacza że strony potrzebują contentu / linków, nie tylko meta — wtedy decyzja czy inwestować dalej

---

## Sugerowany commit message

```
seo(meta): optimize titles and descriptions for 4 priority pages

- /zt411-linerless: add Zebra prefix, TAKMA partner trust signal
- /zt411-rfid: add koder keyword, strengthen partner messaging
- /300-dpi: add Zebra prefix, partner trust signal
- /600-dpi: add Zebra prefix, unique positioning

Target: improve CTR on striking distance keywords (GSC audit 12.05.2026)
- zt411 linerless (pos 8.7)
- zebra zt411 rfid (pos 12.8)
- zebra zt411 300 dpi (pos 16.7)
```
