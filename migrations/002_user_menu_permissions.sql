create table if not exists public.user_menu_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  menu_key text not null,
  is_allowed boolean not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, menu_key)
);

create trigger trg_user_menu_permissions_updated
before update on public.user_menu_permissions
for each row execute procedure public.set_updated_at();

alter table public.user_menu_permissions enable row level security;

create policy "user menu permissions admin read"
on public.user_menu_permissions
for select
using (exists (
  select 1 from public.users u
  where u.id = auth.uid() and u.role = 'Admin'
));

create policy "user menu permissions admin write"
on public.user_menu_permissions
for all
using (exists (
  select 1 from public.users u
  where u.id = auth.uid() and u.role = 'Admin'
))
with check (exists (
  select 1 from public.users u
  where u.id = auth.uid() and u.role = 'Admin'
));
