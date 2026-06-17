-- Executar no SQL Editor do Supabase após o schema base.
-- Estende public.profiles para definições da aplicação e política de INSERT.

alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists preferred_stylist text;
alter table public.profiles add column if not exists preferred_drink text;
alter table public.profiles add column if not exists quiet_appointment boolean not null default false;
alter table public.profiles add column if not exists notify_sms boolean not null default true;
alter table public.profiles add column if not exists notify_email_newsletter boolean not null default false;
alter table public.profiles add column if not exists notify_push boolean not null default true;
alter table public.profiles add column if not exists notify_booking_confirm boolean not null default true;
alter table public.profiles add column if not exists two_factor_enabled boolean not null default false;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  fn text;
  ln text;
  fulln text;
begin
  fulln := coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1));
  fn := coalesce(nullif(trim(new.raw_user_meta_data->>'first_name'), ''), split_part(fulln, ' ', 1));
  ln := coalesce(nullif(trim(new.raw_user_meta_data->>'last_name'), ''), nullif(trim(substring(fulln from length(fn) + 2)), ''), '');
  insert into public.profiles (id, full_name, first_name, last_name)
  values (new.id, fulln, fn, ln)
  on conflict (id) do nothing;
  return new;
end;
$$;
