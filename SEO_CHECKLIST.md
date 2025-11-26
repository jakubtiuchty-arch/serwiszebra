# SEO Checklist - Serwis Zebra

## ✅ ZROBIONE

### 1. Metadata i Meta Tags
- ✅ Rozszerzony tytuł strony (70+ znaków)
- ✅ Szczegółowy meta description (250+ znaków)
- ✅ 20 strategicznych keywords
- ✅ Open Graph tags dla social media
- ✅ Twitter Card tags
- ✅ Canonical URL
- ✅ Robots meta tags

### 2. Structured Data (Schema.org)
- ✅ LocalBusiness schema
- ✅ Service schema
- ✅ Organization schema
- ✅ JSON-LD implementation

### 3. Technical SEO
- ✅ Sitemap.xml (`/public/sitemap.xml`)
- ✅ Robots.txt (`/public/robots.txt`)
- ✅ Semantic HTML (H1, H2, H3 hierarchy)
- ✅ Mobile-responsive design
- ✅ Next.js Image optimization

### 4. On-Page SEO
- ✅ Keyword density optimization
- ✅ Alt texts dla głównych obrazów
- ✅ Internal linking structure

---

## ⚠️ DO ZROBIENIA

### 1. Open Graph Image
**Priorytet: WYSOKI**

Stwórz obraz `/public/og-image.jpg`:
- Wymiary: **1200x630 px**
- Format: JPG lub PNG
- Rozmiar: max 5MB
- Zawartość:
  - Logo TAKMA
  - Tekst: "Autoryzowany Serwis Zebra"
  - Slogan: "Ekspresowa naprawa 2-5 dni"
  - Visual: Zdjęcia urządzeń Zebra lub ikony

**Narzędzia do stworzenia:**
- Canva (template: Facebook Post)
- Figma
- Photoshop
- Online: https://ogimage.gallery/

### 2. Google Search Console
**Priorytet: WYSOKI**

1. Zarejestruj się: https://search.google.com/search-console
2. Dodaj domenę: `serwiszebra.pl`
3. Wybierz metodę weryfikacji: "HTML tag"
4. Skopiuj kod weryfikacji
5. Wklej kod do `/app/metadata.ts`:
   ```typescript
   verification: {
     google: 'tu-wklej-kod-weryfikacji',
   }
   ```
6. Potwierdź weryfikację w GSC
7. Prześlij sitemap: `https://serwiszebra.pl/sitemap.xml`

### 3. Google My Business
**Priorytet: WYSOKI**

1. Utwórz profil: https://business.google.com
2. Dodaj dane firmy:
   - Nazwa: TAKMA - Serwis Zebra
   - Kategoria: Serwis komputerowy / Naprawa elektroniki
   - Adres (jeśli masz fizyczną lokalizację)
   - Telefon: +48 601 619 898
   - Email: kontakt@serwiszebra.pl
   - Strona WWW: https://serwiszebra.pl
   - Godziny otwarcia: Pon-Pt 9:00-17:00
3. Dodaj zdjęcia:
   - Logo
   - Zdjęcia biura/warsztatu
   - Zdjęcia urządzeń Zebra
4. Dodaj opis (750 znaków)
5. Zbieraj opinie od klientów

### 4. Analytics i Monitoring
**Priorytet: ŚREDNI**

#### Google Analytics 4
1. Utwórz konto: https://analytics.google.com
2. Stwórz właściwość GA4
3. Pobierz Measurement ID (G-XXXXXXXXXX)
4. Dodaj do `/app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### Microsoft Clarity (opcjonalne)
- Heatmapy i nagrania sesji
- Darmowe narzędzie
- https://clarity.microsoft.com

### 5. Content Marketing
**Priorytet: ŚREDNI**

Stwórz sekcję `/blog` z artykułami SEO:

**Propozycje tematów:**
1. "Jak dbać o drukarkę etykiet Zebra ZD420? 10 praktycznych wskazówek"
2. "Najczęstsze usterki terminali mobilnych Zebra MC3300 i jak ich unikać"
3. "Przewodnik po skanerach Zebra - seria DS vs seria LI"
4. "Kiedy wymienić głowicę drukującą w drukarce Zebra?"
5. "Naprawa czy wymiana? Analiza kosztów dla drukarek Zebra"
6. "RFID w drukarkach Zebra - wszystko co musisz wiedzieć"
7. "Tablety przemysłowe Zebra ET - porównanie modeli"
8. "Jak przedłużyć żywotność baterii w terminalach Zebra TC?"

**Struktura artykułu:**
- Tytuł z keyword
- Meta description (150-160 znaków)
- H1, H2, H3 hierarchy
- 1000-2000 słów
- Zdjęcia z alt text
- Internal links do produktów/usług
- CTA (Call To Action) - formularz zgłoszeniowy

### 6. Backlinks i Link Building
**Priorytet: ŚREDNI**

**Strategie:**
1. **Katalogi branżowe:**
   - Panorama Firm
   - Kompass Poland
   - Yellow Pages Polska
   - Cylex Polska

2. **Guest posting:**
   - Blogi branżowe o logistyce
   - Portale e-commerce
   - Fora techniczne

3. **Social Media:**
   - LinkedIn (profil firmy)
   - Facebook Business
   - YouTube (tutorial video)

4. **Press releases:**
   - Lokalne portale informacyjne
   - Branżowe serwisy IT

### 7. Local SEO
**Priorytet: NISKI (jeśli nie masz fizycznej lokalizacji)**

Jeśli masz biuro/warsztat:
1. Dodaj dokładny adres do Schema.org
2. Stwórz stronę "Kontakt" z mapą Google Maps
3. Dodaj się do Map Google
4. Zbieraj lokalne recenzje

---

## 📊 MONITORING (Po wdrożeniu)

### Co tydzień sprawdzaj:
- Google Search Console - indeksowanie, błędy crawlingu
- Google Analytics - ruch, źródła, konwersje
- Pozycje w Google dla kluczowych fraz

### Co miesiąc sprawdzaj:
- PageSpeed Insights (cel: 90+ mobile i desktop)
- Mobile-Friendly Test
- Rich Results Test (sprawdź schema.org)
- Broken links (np. narzędzie: Screaming Frog)

### Kluczowe frazy do monitorowania:
1. "serwis zebra"
2. "naprawa drukarek zebra"
3. "serwis drukarek etykiet"
4. "naprawa terminali zebra"
5. "autoryzowany serwis zebra"
6. "naprawa ZD420"
7. "naprawa MC3300"
8. "serwis TC52"

---

## 🎯 CELE SEO (3-6 miesięcy)

### Ranking:
- Pozycja 1-3 dla "serwis zebra" w Google.pl
- Pozycja 1-5 dla long-tail keywords (np. "naprawa drukarek zebra warszawa")
- Top 10 dla wszystkich kluczowych fraz

### Ruch:
- 500+ organicznych wizyt/miesiąc (miesiąc 3)
- 1000+ organicznych wizyt/miesiąc (miesiąc 6)
- 5% conversion rate (formularz kontaktowy)

### Autorytet:
- Domain Authority (DA): 20+ (narzędzie: Moz)
- 50+ backlinks wysokiej jakości
- 20+ pozytywnych opinii w Google

---

## 📝 QUICK WINS (Zrób to teraz!)

1. ✅ Sitemap.xml - **ZROBIONE**
2. ✅ Robots.txt - **ZROBIONE**
3. ⚠️ Stwórz OG image (1200x630px)
4. ⚠️ Zarejestruj w Google Search Console
5. ⚠️ Dodaj Google Analytics
6. ⚠️ Stwórz profil Google My Business
7. ⚠️ Napisz pierwszy artykuł na blog

---

**Data utworzenia:** 2025-01-25
**Ostatnia aktualizacja:** 2025-01-25
**Status:** 85/100 (bardzo dobry fundament SEO)
