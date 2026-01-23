-- Reakcje pod wpisami blogowymi (agregaty + ślady głosów)
create table if not exists blog_reactions (
  slug text primary key,
  upvotes integer not null default 0,
  downvotes integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists blog_reaction_votes (
  id uuid primary key default gen_random_uuid(),
  slug text not null references blog_reactions(slug) on delete cascade,
  fingerprint text not null, -- losowy identyfikator w ciasteczku (bez danych osobowych)
  vote text not null check (vote in ('up','down')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, fingerprint)
);

create index if not exists blog_reaction_votes_slug_idx on blog_reaction_votes(slug);
