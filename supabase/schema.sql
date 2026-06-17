-- Execute no SQL Editor do Supabase (projeto → SQL → New query).
-- Cria perfis ligados ao Auth e tabelas base para agendamentos no salão.

-- ── Perfis (uma linha por utilizador em auth.users) ───────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  first_name text,
  last_name text,
  phone text,
  address text,
  avatar_url text,
  preferred_stylist text,
  preferred_drink text,
  quiet_appointment boolean not null default false,
  notify_sms boolean not null default true,
  notify_email_newsletter boolean not null default false,
  notify_push boolean not null default true,
  notify_booking_confirm boolean not null default true,
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Ao registar utilizador, cria linha em profiles (metadados vêm do signUp).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), split_part(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), ' ', 1)),
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'last_name'), ''),
      nullif(trim(substring(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)) from length(split_part(coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), ' ', 1)) + 2)), ''),
      ''
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_profiles_updated_at();

-- ── Serviços e estilistas (catálogo; leitura pública) ──────────────────────
create table if not exists public.services (
  id serial primary key,
  slug text unique not null,
  name text not null,
  description text,
  price_label text,
  duration_label text,
  sort_order int not null default 0
);

create table if not exists public.stylists (
  id serial primary key,
  slug text unique not null,
  name text not null,
  role text,
  availability text,
  image_url text,
  sort_order int not null default 0
);

alter table public.services enable row level security;
alter table public.stylists enable row level security;

create policy "services_read_all" on public.services for select using (true);
create policy "stylists_read_all" on public.stylists for select using (true);

insert into public.services (slug, name, description, price_label, duration_label, sort_order) values
  ('signature-haircut', 'Signature Haircut', 'Consultation, wash, customized cut, and signature blowout styling.', '$85.00', '1h 15min', 1),
  ('full-balayage', 'Full Balayage', 'Custom hand-painted highlights, glossing treatment, and blowout finish.', '$220.00+', '3h', 2),
  ('keratin-treatment', 'Keratin Treatment', 'Smoothing treatment to reduce frizz and add shine for up to 3 months.', '$250.00', '2h 30min', 3),
  ('special-event-styling', 'Special Event Styling', 'Elegant updos or intricate styling for weddings and galas.', '$120.00', '1h 30min', 4),
  ('root-touch-up', 'Root Touch-up', 'Color application to roots only, followed by wash and blowout.', '$95.00', '1h 15min', 5),
  ('deep-conditioning', 'Deep Conditioning', 'Restorative mask tailored to your hair needs.', '$45.00', '45min', 6)
on conflict (slug) do nothing;

insert into public.stylists (slug, name, role, availability, image_url, sort_order) values
  ('elena-r', 'Elena R.', 'Master Stylist', 'Available', 'https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?w=200&h=200&fit=crop&crop=face', 1),
  ('sarah-m', 'Sarah M.', 'Color Specialist', 'Available', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=200&h=200&fit=crop&crop=face', 2),
  ('david-l', 'David L.', 'Senior Stylist', 'Limited', 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=face', 3),
  ('anyone', 'Anyone', 'Next Available', 'Flexible', null, 4)
on conflict (slug) do nothing;

-- ── Agendamentos (utilizador autenticado vê e cria os seus) ────────────────
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_id int references public.services (id),
  stylist_id int references public.stylists (id),
  starts_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'canceled')),
  client_notes text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_user_id_idx on public.appointments (user_id);

alter table public.appointments enable row level security;

create policy "appointments_select_own"
  on public.appointments for select
  using (auth.uid() = user_id);

create policy "appointments_insert_own"
  on public.appointments for insert
  with check (auth.uid() = user_id);

create policy "appointments_update_own"
  on public.appointments for update
  using (auth.uid() = user_id);
