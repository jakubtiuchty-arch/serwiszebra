-- Awarie czatu AI: pytania klientów, na które asystent nie odpowiedział (błąd OpenAI).
--
-- Po co: 14–21.10.2026 na koncie OpenAI skończyły się środki. Każde pytanie kończyło się
-- błędem 429, a nieudane pytania nie trafiały do chat_logs — wieczorny raport przez tydzień
-- pokazywał „brak rozmów” i nikt nie wiedział, że czat nie działa.
--
-- Tabela służy do dwóch rzeczy:
--   1. alarm mailowy przy braku środków / odrzuconym kluczu API — od razu przy pierwszym
--      nieudanym pytaniu, kolejny najwcześniej po 3 godzinach (kolumna mail_wyslany),
--   2. wieczorny raport — liczba pytań bez odpowiedzi z danego dnia.
--
-- Osobna tabela zamiast wierszy w chat_logs: chat_logs czyta panel analityki, czujka jakości
-- i egzamin czatu — nieudane pytania bez odpowiedzi zaburzałyby ich statystyki.

create table if not exists public.chat_awarie (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rodzaj text not null check (rodzaj in ('brak_srodkow', 'klucz_api', 'inny')),
  session_id text,
  user_message text,
  szczegoly text,
  mail_wyslany boolean not null default false
);

create index if not exists chat_awarie_created_at_idx on public.chat_awarie (created_at desc);

-- Dostęp wyłącznie kluczem serwisowym (API czatu, crony) — bez polityk dla anon/authenticated.
alter table public.chat_awarie enable row level security;
