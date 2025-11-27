-- Włącz rozszerzenie pgvector do przechowywania embeddings
create extension if not exists vector;

-- Tabela do przechowywania dokumentów z manuali
create table if not exists manuals_documents (
  id uuid primary key default gen_random_uuid(),
  manual_name text not null, -- np. "ZD421_Manual", "ZD621_Manual"
  content text not null, -- tekst z fragmentu PDF
  page_number integer, -- numer strony w PDF
  embedding vector(1536), -- embedding OpenAI (1536 wymiarów)
  metadata jsonb, -- dodatkowe dane (np. sekcja, typ problemu)
  created_at timestamp with time zone default now()
);

-- Indeks dla similarity search (HNSW jest szybszy niż IVFFlat dla wektorów)
create index if not exists manuals_documents_embedding_idx
  on manuals_documents
  using hnsw (embedding vector_cosine_ops);

-- Indeks dla wyszukiwania po nazwie manuala
create index if not exists manuals_documents_manual_name_idx
  on manuals_documents (manual_name);

-- Funkcja do wyszukiwania podobnych dokumentów
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float default 0.7,
  match_count int default 5,
  filter_manual text default null
)
returns table (
  id uuid,
  manual_name text,
  content text,
  page_number integer,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    manuals_documents.id,
    manuals_documents.manual_name,
    manuals_documents.content,
    manuals_documents.page_number,
    manuals_documents.metadata,
    1 - (manuals_documents.embedding <=> query_embedding) as similarity
  from manuals_documents
  where
    (filter_manual is null or manuals_documents.manual_name = filter_manual)
    and 1 - (manuals_documents.embedding <=> query_embedding) > match_threshold
  order by manuals_documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
