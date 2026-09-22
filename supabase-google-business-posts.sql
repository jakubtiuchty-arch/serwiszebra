-- Run once in the Serwis Zebra Supabase project before enabling the cron.
create table if not exists public.google_business_post_runs (
  week_key date primary key,
  status text not null check (status in ('started', 'failed', 'processing', 'live')),
  topic text,
  summary text,
  image_url text,
  google_post_name text,
  google_state text,
  error text,
  created_at timestamptz not null default now()
);

alter table public.google_business_post_runs enable row level security;
-- No anon/authenticated policies: only the server-side service role can access it.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gbp-post-images', 'gbp-post-images', true, 10000000, array['image/jpeg'])
on conflict (id) do nothing;

-- This bucket contains only illustrations intended for public Google posts.
create policy "Public read of GBP post illustrations"
on storage.objects for select to public
using (bucket_id = 'gbp-post-images');
