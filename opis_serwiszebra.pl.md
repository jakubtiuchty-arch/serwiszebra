# 🦓 SERWISZEBRA.PL - Opis Portalu

**Portal serwisowy dla urządzeń Zebra Technologies**  
**Właściciel:** TAKMA  
**URL:** https://serwiszebra.pl

---

## 📋 Ogólny Opis

SerwisZebra.pl to profesjonalny portal serwisowy specjalizujący się w naprawie urządzeń Zebra Technologies. Portal łączy tradycyjne usługi serwisowe z nowoczesnymi technologiami: sztuczną inteligencją (ChatAI), systemem RAG (Retrieval Augmented Generation) opartym na manualach Zebra, oraz rozbudowaną bazą wiedzy w formie bloga technicznego.

Portal obsługuje pełen cykl naprawy:
1. **Diagnostyka online** - ChatAI prowadzi klienta przez diagnostykę krok po kroku
2. **Zgłoszenie naprawy** - formularz online z automatycznym utworzeniem konta
3. **Odbiór kurierem** - bezpłatny odbiór w 24h z całej Polski
4. **Śledzenie naprawy** - panel klienta z aktualizacjami w czasie rzeczywistym
5. **Płatność online** - Stripe, Przelewy24, BLIK
6. **Sklep z częściami** - materiały eksploatacyjne i akcesoria

---

## 🛠️ Stack Technologiczny

### Frontend
- **Next.js 14.2.5** - App Router, SSR/SSG
- **React 18** - komponenty funkcyjne
- **TypeScript 5** - typowanie statyczne
- **Tailwind CSS 3.4** - stylowanie utility-first
- **Framer Motion 11** - animacje
- **Lucide React** - ikony

### Backend
- **Next.js API Routes** - serverless functions
- **Supabase** - baza danych PostgreSQL + auth
- **Stripe** - płatności
- **Resend** - wysyłka e-maili
- **Google Gemini** - model AI dla ChatAI
- **OpenAI GPT-3.5** - tłumaczenia PL→EN dla RAG
- **Google Vertex AI Discovery Engine** - RAG z manualami Zebra

### Integracje
- **Furgonetka API** - zamawianie kurierów
- **BaseLinker** - synchronizacja zamówień
- **Vercel Analytics** - analityka

---

## 📁 Struktura Aplikacji

### Strony publiczne
```
/                    - Strona główna z ChatAI i formularzem zgłoszenia
/blog               - Baza wiedzy (46 artykułów)
/blog/[slug]        - Pojedynczy artykuł
/sklep              - Sklep z częściami
/sklep/[slug]       - Strona produktu
/kontakt            - Dane kontaktowe
/o-nas              - O firmie TAKMA
/regulamin          - Regulamin
/polityka-prywatnosci - RODO
```

### Panel klienta
```
/logowanie          - Logowanie
/rejestracja        - Rejestracja
/panel              - Dashboard użytkownika
/panel/naprawa/[id] - Szczegóły naprawy z komunikatorem
/panel/profil       - Profil i dane
/panel/zamowienia   - Historia zamówień
```

### Panel administracyjny
```
/admin              - Dashboard admina
/admin/zgloszenie/[id] - Zarządzanie naprawą
/admin/zamowienia   - Zamówienia ze sklepu
/admin/produkty     - Zarządzanie produktami
/admin/uzytkownicy  - Zarządzanie użytkownikami
/admin/chat-logs    - Logi rozmów ChatAI
/admin/chat-analytics - Analityka AI
```

---

## 🤖 ChatAI - Asystent Diagnostyczny

### Funkcje
- **Interaktywna diagnostyka krok po kroku** - prowadzi klienta przez rozwiązywanie problemu
- **Wykrywanie typu urządzenia** - automatycznie rozpoznaje model i kategorię
- **RAG z manualami Zebra** - odpowiedzi oparte na oficjalnej dokumentacji
- **Integracja z blogiem** - wyszukuje relevantne artykuły
- **Kody kreskowe w chacie** - dla konfiguracji skanerów wyświetla skanowalnych kody
- **Wykrywanie poważnych usterek** - automatyczne przekierowanie do serwisu
- **Cennik kontekstowy** - podaje orientacyjne ceny dla konkretnych modeli

### Modele AI
- **Google Gemini 2.0 Flash** - główny model konwersacyjny
- **OpenAI GPT-3.5-turbo** - tłumaczenie zapytań na angielski dla RAG

### Flow rozmowy
1. Klient opisuje problem
2. AI identyfikuje urządzenie i kategorię
3. AI przeszukuje blog i RAG (manuele)
4. AI prowadzi diagnostykę krok po kroku (jeden krok → pytanie → odpowiedź → następny krok)
5. Jeśli problem rozwiązany → link do artykułu jako bonus
6. Jeśli wymaga serwisu → tag [SERIOUS_ISSUE] → button "Wyślij do serwisu"

---

## 📚 Blog / Baza Wiedzy

### Statystyki
- **46 artykułów** technicznych
- **6 kategorii** głównych
- **4 podkategorie** drukarek

### Kategorie
1. **Drukarki** (14 artykułów)
   - Podkategorie: Etykiet, Kart, Opasek, Mobilne
2. **Terminale** (12 artykułów)
3. **Skanery** (10 artykułów)
4. **Tablety** (6 artykułów)
5. **TC58 Kurier** (5 artykułów) - dedykowana seria dla kurierów

### Przykładowe artykuły
- Drukarka Zebra nie drukuje - 7 najczęstszych przyczyn i jak je naprawić
- Kody błędów drukarek kart Zebra – kompletna lista z rozwiązaniami
- Jak skonfigurować skaner Zebra kodami kreskowymi – Enter, Tab, sufiksy
- Terminal Zebra nie włącza się lub zawiesza na logo - poradnik Fastboot
- Porównanie drukarek kart Zebra – ZC100 vs ZC300 vs ZXP7 vs ZXP9
- Drukarka Zebra nie drukuje w zimnych warunkach – "Head Cold"

### Funkcje SEO
- Meta title, description, keywords dla każdego artykułu
- Schema.org: TechArticle, FAQPage, BreadcrumbList, HowTo
- Zoptymalizowane obrazy (AVIF/WebP, lazy loading)
- Anchor links do sekcji

---

## 🛒 Sklep

### Funkcje
- Katalog produktów z filtrowaniem
- Koszyk (Zustand state management)
- Checkout z płatnością Stripe
- Generowanie proform
- Integracja z BaseLinker
- System zwrotów

### Kategorie produktów
- Głowice drukujące
- Wałki dociskowe
- Baterie
- Materiały eksploatacyjne (etykiety, taśmy)
- Akcesoria

---

## 📊 Panel Admina

### Zarządzanie naprawami
- Lista zgłoszeń z filtrami statusu
- Szczegóły naprawy z timeline
- Wycena i akceptacja ceny
- Zamawianie kurierów (Furgonetka)
- Śledzenie przesyłek
- Komunikator z klientem
- Generowanie faktur/proform

### Statusy naprawy
1. `new` - Nowe zgłoszenie
2. `courier_ordered` - Kurier zamówiony
3. `in_transit` - W transporcie do serwisu
4. `received` - Otrzymano w serwisie
5. `diagnosing` - Diagnostyka
6. `waiting_for_approval` - Oczekuje na akceptację wyceny
7. `approved` - Wycena zaakceptowana
8. `in_repair` - W naprawie
9. `completed` - Naprawa zakończona
10. `shipped_back` - Wysłano do klienta
11. `delivered` - Dostarczono

### Analityka ChatAI
- Logi wszystkich rozmów
- Statystyki: liczba rozmów, czas odpowiedzi, skuteczność RAG
- Oceny klientów (thumbs up/down)
- Eksport danych

---

## 🔐 Autentykacja i Role

### Supabase Auth
- Logowanie email/hasło
- Rejestracja z/bez zamówienia
- Row Level Security (RLS)

### Role użytkowników
- `user` - klient (domyślnie)
- `admin` - administrator

---

## 💳 Płatności

### Stripe
- Payment Intents API
- Checkout Sessions
- Webhooks dla potwierdzenia płatności
- Obsługa Przelewy24, BLIK, karty

### Flow płatności naprawy
1. Admin ustala cenę
2. Klient akceptuje wycenę
3. Klient płaci online
4. Webhook potwierdza płatność
5. Status zmienia się na "approved"

---

## 📧 Powiadomienia Email

### Resend
- Potwierdzenie zgłoszenia
- Aktualizacje statusu
- Wycena gotowa do akceptacji
- Naprawa zakończona

---

## 🚚 Logistyka

### Furgonetka API
- Zamawianie kurierów DPD, InPost, DHL
- Automatyczne trackowanie
- Webhook dla aktualizacji statusu

### BaseLinker
- Synchronizacja zamówień ze sklepu
- Aktualizacja statusów wysyłki

---

## 📈 SEO

### Wdrożone
- ✅ Metadata (title, description, keywords, OpenGraph, Twitter Cards)
- ✅ Schema.org (LocalBusiness, Service, FAQPage, TechArticle, HowTo, BreadcrumbList)
- ✅ robots.txt
- ✅ sitemap.xml (statyczny)
- ✅ Optymalizacja obrazów (next/image)
- ✅ 46 artykułów blogowych

### Do wdrożenia (wg strategia_seo_2.md)
- ❌ Podstrony urządzeń (/drukarki/, /terminale/, /skanery/)
- ❌ Podstrony miast (Local SEO)
- ❌ Dynamiczny sitemap
- ❌ Landing pages dla modeli
- ❌ Video poradniki

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Sticky header z nawigacją
- Hamburger menu na mobile
- Touch-friendly UI

---

## 🔧 Serwisowane Urządzenia

### Drukarki etykiet
- Desktop: GK420d/t, ZD220, ZD420, ZD421, ZD620, ZD621
- Przemysłowe: ZT230, ZT231, ZT410, ZT411, ZT420, ZT421, ZT510, ZT610, ZT620
- Mobilne: ZQ510, ZQ520, ZQ610, ZQ620, ZQ630
- RFID: ZD500R, ZT411R, ZT421R

### Drukarki kart
- Entry: ZC100, ZC300, ZC350
- High-end: ZXP7, ZXP9

### Terminale mobilne
- Touch: TC21, TC26, TC52, TC57, TC58, TC72, TC77
- Keyboard: MC2200, MC2700, MC3300, MC9300
- Wearable: WT6000

### Skanery
- Ręczne: DS2208, DS4608, DS8108, DS8178
- Prezentacyjne: DS9208, DS9908
- Przemysłowe: LS2208, LI2208, LI4278
- Bezprzewodowe: CS4070, CS6080

### Tablety
- ET40, ET45, ET50, ET55, L10, XBOOK

---

## 📞 Kontakt

- **Telefon:** +48 601 619 898
- **Email:** kontakt@serwiszebra.pl
- **Godziny:** Pon-Pt 9:00-17:00

---

## 📊 Cennik Orientacyjny

### Drukarki Desktop (GK420, ZD220, ZD420)
- Wymiana głowicy: 250-530 zł
- Wymiana wałka: 150-250 zł
- Czyszczenie mechanizmu: 150-300 zł

### Drukarki Przemysłowe (ZT230, ZT410, ZT510)
- Wymiana głowicy: 580-2499 zł
- Wymiana wałka: 200-450 zł
- Czyszczenie mechanizmu: 200-450 zł

### Drukarki Kart (ZC100, ZC300, ZXP)
- Wymiana głowicy: 800-2500 zł
- Naprawa modułu kodowania: 400-1200 zł
- Czyszczenie + konserwacja: 200-450 zł

### Terminale (TC21, TC52, MC33)
- Wymiana wyświetlacza: 600-1200 zł
- Naprawa modułu skanującego: 500-1100 zł
- Wymiana baterii: 150-450 zł

### Skanery
- Naprawa modułu skanującego: 300-800 zł
- Wymiana okna skanera: 100-300 zł
- Czyszczenie optyki: 89-150 zł

---

## 📁 Pliki Konfiguracyjne

| Plik | Opis |
|------|------|
| `lib/blog.ts` | Wszystkie artykuły bloga (~13500 linii) |
| `app/api/chat/route.ts` | Logika ChatAI (~1050 linii) |
| `components/AIChatBox.tsx` | UI ChatAI |
| `app/metadata.ts` | Globalne SEO metadata |
| `public/robots.txt` | Konfiguracja crawlerów |
| `public/sitemap.xml` | Mapa strony |

---

## 🚀 Deployment

- **Hosting:** Vercel
- **Baza danych:** Supabase (PostgreSQL)
- **Pliki statyczne:** Vercel Edge Network
- **CI/CD:** Git push → Vercel auto-deploy

---

*Ostatnia aktualizacja: 10.12.2024*

