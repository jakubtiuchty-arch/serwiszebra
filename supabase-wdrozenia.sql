-- Kanał wdrożeniowy — zgłoszenia zmian na serwis-zebry.pl od zespołu serwisu.
-- Uruchom w Supabase SQL Editor.
--
-- Przebieg: serwisant opisuje, co ma się zmienić na stronie → mail leci do
-- wdrażającego. Po wdrożeniu zaznaczany jest checkbox → mail wraca do serwisu,
-- a zgłoszenie znika z listy otwartych i ląduje w archiwum.

create table if not exists deployment_requests (
  id uuid primary key default gen_random_uuid(),

  title text not null,                                -- krótko, o co chodzi
  description text,                                   -- szczegóły, opcjonalne
  page_url text,                                      -- gdzie na stronie, opcjonalne

  -- Kto zgłosił (dane kopiowane, żeby lista czytała się bez joinów)
  created_by uuid,
  author_name text,
  author_email text,

  -- open = do zrobienia, done = wdrożone i zarchiwizowane
  status text not null default 'open' check (status in ('open', 'done')),

  done_at timestamptz,
  done_by uuid,
  done_by_name text,
  done_note text,                                     -- co dokładnie zostało wdrożone

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lista otwartych zgłoszeń to najczęstsze zapytanie
create index if not exists deployment_requests_status_idx
  on deployment_requests (status, created_at desc);

-- RLS włączone bez polityk = dostęp wyłącznie przez service role (API panelu)
alter table deployment_requests enable row level security;
