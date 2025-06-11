-- migrations/20250529_create_veterinarians.sql

create table if not exists veterinarians (
  vet_id uuid primary key,
  first_name text not null,
  first_last_name text not null,
  second_last_name text not null,
  identification text not null,
  email text not null,
  registration text not null,
  clinic_name text not null,
  city text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- (Opcional) Trigger para actualizar updated_at en cada modificación
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_veterinarians_updated_at on veterinarians;
create trigger trg_veterinarians_updated_at
  before update on veterinarians
  for each row execute function set_updated_at();
