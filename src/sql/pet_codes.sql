-- Puedes ejecutarlo en el SQL editor de Supabase
create table public.pet_codes (
  id          uuid        default uuid_generate_v4() primary key,
  pet_id      varchar     not null references public.pets(id),
  code        varchar     not null unique,
  expires_at  timestamp   not null,
  used        boolean     not null default false,
  created_at  timestamp   not null default now()
);
