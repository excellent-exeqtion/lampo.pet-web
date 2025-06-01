create table public.pets (
  id            varchar(4)                           not null
                   constraint pets_pk
                     primary key,
  -- enforce format like A001, B123, etc.
  constraint pets_id_format
    check (id ~ '^[A-Za-z]\d{3}$'),

  owner_id      uuid                                 not null
                   references auth.users (id)
                     on delete cascade,

  name          text                                 not null,
  species       text,
  breed         text,
  birth_date    date,

  created_at    timestamp with time zone default now()  not null,
  updated_at    timestamp with time zone default now()  not null
);

-- trigger to auto-update updated_at on row modification
create function update_updated_at_column()
  returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trigger_update_pets_updated_at
  before update
  on public.pets
  for each row
  execute procedure update_updated_at_column();