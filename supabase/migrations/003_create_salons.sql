-- ============================================================
-- Migration 003 — salons table
-- Executar após 001 (schema base) e 002 (extend profiles).
-- ============================================================

create table if not exists public.salons (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  name        text not null,
  slug        text unique,
  address     text,
  phone       text,
  description text,
  logo_url    text,
  status      text not null default 'open' check (status in ('open', 'closed', 'busy')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_salons_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists salons_set_updated_at on public.salons;
create trigger salons_set_updated_at
  before update on public.salons
  for each row execute function public.set_salons_updated_at();

-- RLS
alter table public.salons enable row level security;

create policy "salons_public_read"
  on public.salons for select using (true);

create policy "salons_owner_all"
  on public.salons for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
