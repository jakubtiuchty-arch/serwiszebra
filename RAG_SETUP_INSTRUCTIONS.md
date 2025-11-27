# 🚀 Instrukcje Uruchomienia RAG dla Manuali Zebra

System RAG (Retrieval Augmented Generation) został zaimplementowany! Teraz AI czat może odpowiadać na pytania używając wiedzy z manuali ZD421 i ZD621.

## 📋 Co zostało zrobione?

✅ Zainstalowane biblioteki (OpenAI, pdf-parse, langchain)
✅ Utworzony endpoint do uploadowania PDF (`/api/upload-manual`)
✅ Zmodyfikowany czat AI aby używał RAG (`/api/chat`)
✅ Stworzony interfejs do uploadowania manuali (`/app/admin/upload-manual`)
✅ Przygotowany SQL do konfiguracji Supabase Vector Store

## 🔧 Kroki do Uruchomienia

### 1️⃣ Dodaj Klucz API OpenAI

Otwórz plik `.env.local` i dodaj:

```env
OPENAI_API_KEY=sk-proj-twoj-klucz-api
```

**Gdzie wziąć klucz?**
- Wejdź na: https://platform.openai.com/api-keys
- Kliknij "Create new secret key"
- Skopiuj klucz (zaczyna się od `sk-proj-`)
- **WAŻNE:** Model `text-embedding-3-small` jest bardzo tani (~$0.02 za 1M tokenów)

### 2️⃣ Skonfiguruj Supabase Vector Store

1. Wejdź na dashboard Supabase: https://supabase.com/dashboard
2. Wybierz swój projekt (fivrcnshzylqdquuhkeu)
3. Przejdź do **SQL Editor** (ikona bazy danych w menu)
4. Otwórz plik `supabase-setup.sql` (w głównym katalogu projektu)
5. Skopiuj CAŁĄ zawartość pliku
6. Wklej do SQL Editor w Supabase
7. Kliknij **"Run"** (▶️)
8. Poczekaj aż zobaczysz "Success. No rows returned"

**Co ten SQL robi?**
- Włącza rozszerzenie `pgvector` (vector database)
- Tworzy tabelę `manuals_documents` do przechowywania fragmentów PDF
- Tworzy indeksy dla szybkiego wyszukiwania podobieństw
- Tworzy funkcję `match_documents()` do wyszukiwania RAG

### 3️⃣ Zbuduj i Uruchom Projekt

```bash
npm run build
npm run dev
```

### 4️⃣ Upload Manuali ZD421 i ZD621

1. Pobierz manuele PDF:
   - ZD421: https://www.zebra.com/us/en/support-downloads/printers/desktop/zd421.html
   - ZD621: https://www.zebra.com/us/en/support-downloads/printers/desktop/zd621.html

2. Wejdź na: http://localhost:3000/admin/upload-manual

3. Upload ZD421:
   - Nazwa: `ZD421_Manual`
   - Plik: ZD421.pdf
   - Kliknij "Wgraj Manual"
   - Poczekaj (~1-2 min, zależnie od wielkości PDF)

4. Upload ZD621:
   - Nazwa: `ZD621_Manual`
   - Plik: ZD621.pdf
   - Kliknij "Wgraj Manual"
   - Poczekaj (~1-2 min)

### 5️⃣ Testowanie

1. Wejdź na stronę główną: http://localhost:3000
2. Otwórz AI czat
3. Zadaj pytanie, np:
   - "Jak zresetować drukarkę ZD421?"
   - "Co robić gdy ZD621 nie wykrywa taśmy?"
   - "Jak skalibrować sensor w ZD421?"

**W konsoli (terminal) zobaczysz:**
```
🔍 Szukam w bazie wiedzy dla: Jak zresetować drukarkę ZD421?
✅ Znaleziono kontekst z bazy wiedzy
```

AI teraz będzie odpowiadać używając konkretnych informacji z manuali!

## 📊 Jak to działa pod maską?

```
Użytkownik: "Drukarka ZD421 nie wykrywa taśmy"
      ↓
1. System tworzy embedding (wektor) z pytania
      ↓
2. Wyszukuje 5 najbardziej podobnych fragmentów z manuali
   (używając cosine similarity)
      ↓
3. Dodaje znalezione fragmenty do kontekstu AI
      ↓
4. Claude odpowiada używając wiedzy z manuali
      ↓
AI: "Zgodnie z manualem ZD421, strona 45..."
```

## 🎯 Zalety tego rozwiązania

✅ **Precyzyjne odpowiedzi** - AI ma dostęp do całych manuali (200+ stron)
✅ **Cytowanie źródeł** - AI może powiedzieć "zgodnie z manualem ZD421, strona X"
✅ **Łatwa aktualizacja** - po prostu wgraj nowy PDF
✅ **Skalowalność** - możesz dodać więcej modeli (ZD420, ZT411, itd.)
✅ **Niska cena** - embeddingi kosztują ~$0.02 za 1M tokenów

## 💰 Szacunkowe Koszty

**Jednorazowo (upload manuali):**
- Manual 200 stron = ~100,000 tokenów
- 2 manuele = ~200,000 tokenów
- Koszt: ~$0.004 (mniej niż 1 grosz!)

**Miesięcznie (użytkowanie):**
- 1000 pytań x 5 wyszukań = 5000 embeddingów
- ~5000 tokenów
- Koszt: ~$0.0001 (praktycznie darmowe!)

**Główny koszt:** Claude API (ale to już masz)

## 🔧 Konfiguracja Zaawansowana

### Zmiana liczby wyszukanych fragmentów

W pliku `/app/api/chat/route.ts`, linia 35-38:

```typescript
const { data, error } = await supabase.rpc('match_documents', {
  query_embedding: queryEmbedding,
  match_threshold: 0.7,    // Minimalne podobieństwo (0-1)
  match_count: 5,          // Zmień na 10 dla więcej kontekstu
})
```

### Filtrowanie po konkretnym manuale

Jeśli chcesz szukać TYLKO w ZD421:

```typescript
const { data, error } = await supabase.rpc('match_documents', {
  query_embedding: queryEmbedding,
  match_threshold: 0.7,
  match_count: 5,
  filter_manual: 'ZD421_Manual', // Opcjonalny filtr
})
```

## 📝 Dodawanie Kolejnych Manuali

1. Wejdź na `/admin/upload-manual`
2. Wybierz PDF
3. Nazwa: `NazwaModelu_Manual` (np. `ZD420_Manual`, `ZT411_Manual`)
4. Kliknij "Wgraj Manual"
5. Gotowe! AI automatycznie zacznie używać nowego manuala

## 🐛 Troubleshooting

### Problem: "OpenAI API error"
**Rozwiązanie:** Sprawdź czy klucz API w `.env.local` jest poprawny i czy masz środki na koncie OpenAI

### Problem: "Supabase RPC error: function match_documents does not exist"
**Rozwiązanie:** Uruchom SQL z pliku `supabase-setup.sql` w Supabase SQL Editor

### Problem: "pgvector extension not found"
**Rozwiązanie:** W Supabase SQL Editor wykonaj: `create extension if not exists vector;`

### Problem: AI nie używa wiedzy z manuali
**Rozwiązanie:**
1. Sprawdź w konsoli czy są logi: `🔍 Szukam w bazie wiedzy...`
2. Sprawdź w Supabase Table Editor czy tabela `manuals_documents` ma dane
3. Spróbuj zadać bardziej konkretne pytanie (np. "Jak reset ZD421" zamiast "Problem z drukarką")

## 📚 Następne Kroki

Możesz teraz:
1. Dodać więcej manuali (ZD420, ZT411, MC3300, TC21, itd.)
2. Stworzyć kategorie problemów (mechaniczne, elektryczne, software)
3. Dodać metadata do chunków (sekcja manuala, typ problemu)
4. Zaimplementować cache dla często zadawanych pytań
5. Dodać panel admina do zarządzania manualami

## ✅ Status Implementacji

- [x] Instalacja bibliotek
- [x] Konfiguracja Supabase Vector Store
- [x] Endpoint do uploadowania PDF
- [x] Przetwarzanie PDF na chunki
- [x] Tworzenie embeddings
- [x] Modyfikacja czata AI (RAG)
- [x] Interfejs do uploadowania
- [ ] Upload manuali ZD421 i ZD621 (Twój krok!)
- [ ] Dodanie klucza OpenAI (Twój krok!)

## 🎉 Gotowe!

Po wykonaniu kroków 1-4, Twój AI czat będzie ekspertem od drukarek Zebra ZD421 i ZD621! 🦓
