-- Crear entidad para registrar accesos de veterinarios
create table if not exists veterinary_accesses (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  pet_code_id uuid not null references pet_codes(id),
  vet_first_name text not null,
  vet_last_name text not null,
  professional_registration text not null,
  clinic_name text not null,
  city text not null,
  created_at timestamp with time zone default now()
);

-- Índice para optimizar búsquedas por código
create index if not exists idx_vet_accesses_code on veterinary_accesses(code);