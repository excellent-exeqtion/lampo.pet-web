-- --------------------------------------------------
-- 2. Master de Planes
-- --------------------------------------------------
create table if not exists public.plans (
  id    serial      primary key,
  slug  text        not null unique    -- por ej: 'free','standard','advanced','lifetime'
);

-- --------------------------------------------------
-- 3. Versiones de Planes
-- --------------------------------------------------
create table if not exists public.plans_versions (
  id             serial      primary key,
  plan_id        integer     not null
    references public.plans(id) on delete cascade,
  version        integer     not null,
  title          text        not null,
  description    text,
  price_month    integer     not null,   -- en dolares
  price_year     integer     not null,
  discount_month integer     not null default 0,   -- % de descuento mensual aplicado
  discount_year  integer     not null default 0,   -- % de descuento anual aplicado
  features       jsonb       not null,   -- lista de strings o { text, badge }
  effective_from timestamptz default now(),
  effective_to   timestamptz
);

-- índice para evitar versiones duplicadas
create unique index if not exists idx_plans_versions_unique
  on public.plans_versions(plan_id, version);

-- --------------------------------------------------
-- 4. Suscripciones de Owners a PlanVersions
-- --------------------------------------------------
create table if not exists public.subscriptions (
  id                  serial      primary key,
  owner_id            uuid        not null
    references public.owners(owner_id) on delete cascade,
  plan_version_id     integer     not null
    references public.plans_versions(id) on delete restrict,
  cycle               text        not null
    check (cycle in ('monthly','annual')),
  status              text        not null
    check (status in ('pending','active','canceled','expired')),
  external_id         text,       -- id de transacción en Bold
  price_at_purchase   integer     not null,   -- snapshot del precio al momento
  discount_applied    integer     not null default 0,
  started_at          timestamptz default now(),
  expires_at          timestamptz,
  updated_at          timestamptz default now()
);

-- --------------------------------------------------
-- 5. Opcional: RLS para que cada owner solo vea sus suscripciones
-- --------------------------------------------------
alter table public.subscriptions
  enable row level security;

create policy "Owners can view own subscriptions"
  on public.subscriptions for select
  using ( owner_id = auth.uid() );

create policy "Owners can insert subscriptions"
  on public.subscriptions for insert
  with check ( owner_id = auth.uid() );

create policy "Owners can update own subscriptions"
  on public.subscriptions for update
  using ( owner_id = auth.uid() )
  with check ( owner_id = auth.uid() );
  
  
  -- --------------------------------------------------
-- 6. Inserción de datos iniciales en public.plans y public.plans_versions
-- --------------------------------------------------

-- 1. Insertar los slugs maestros en public.plans
INSERT INTO public.plans (slug)
VALUES
  ('free'),
  ('standard'),
  ('advanced'),
  ('lifetime');

-- 2. Insertar la versión 1 de cada plan en public.plans_versions

-- 2.1 Plan gratuito
INSERT INTO public.plans_versions (
  plan_id,
  version,
  title,
  description,
  price_month,
  price_year,
  discount_month,
  discount_year,
  features
)
VALUES (
  (SELECT id FROM public.plans WHERE slug = 'free'),
  1,
  'Modelo Gratuito',
  'Para personas nuevas y con necesidades básicas de gestión de Historias clínicas para tu mascota',
  0,
  0,
  0,
  0,
  '[
    {"text":"1 perfil de mascota"},
    {"text":"Carga de examenes hasta 500MB"},
    {"text":"Información de contacto"},
    {"text":"Acceso a la APP"},
    {"text":"Plataforma de gestión para tu VET"},
    {"text":"Seguridad de doble factor"}
  ]'::jsonb
);

-- 2.2 Plan estándar
INSERT INTO public.plans_versions (
  plan_id,
  version,
  title,
  description,
  price_month,
  price_year,
  discount_month,
  discount_year,
  features
)
VALUES (
  (SELECT id FROM public.plans WHERE slug = 'standard'),
  1,
  'Modelo estándar',
  'Especial para quienes tienen más de una mascota y quieren utilizar todos nuestros servicios.',
  500,    -- $5.00 USD en centavos
  5400,   -- $54.00 USD en centavos
  0,
  10,     -- 10% de descuento
  '[
    {"text":"Todas las funciones del plan gratuito"},
    {"text":"Perfiles de 3 mascotas"},
    {"text":"Carga de examenes sin límites"},
    {"text":"Función de pérdida de mascota"},
    {"text":"Múltiples sesiones activas en la app"},
    {"text":"Soporte personalizado"},
    {"text":"Plan de recomendados"},
    {"text":"Descargas de copias de historial"},
    {"text":"Lectura en múltiples idiomas","badge":"Pronto"}
  ]'::jsonb
);

-- 2.3 Plan avanzado
INSERT INTO public.plans_versions (
  plan_id,
  version,
  title,
  description,
  price_month,
  price_year,
  discount_month,
  discount_year,
  features
)
VALUES (
  (SELECT id FROM public.plans WHERE slug = 'advanced'),
  1,
  'Modelo avanzado',
  'Diseñado para quien tiene más de una mascota y quiere agregar collares a la suscripción.',
  900,    -- $9.00 USD en centavos
  8640,   -- $86.40 USD en centavos
  0,
  20,     -- 20% de descuento
  '[
    {"text":"Todas las funciones del plan gratuito"},
    {"text":"Todas las funciones del plan estándar"},
    {"text":"Perfiles de mascotas ilimitados"},
    {"text":"Plan de recomendados plus"},
    {"text":"Hasta 5 Tags información"},
    {"text":"IA de pre-diagnóstico","badge":"Coming Soon"},
    {"text":"Sistema de alertas","badge":"Coming Soon"}
  ]'::jsonb
);

-- 2.4 Plan vitalicio
INSERT INTO public.plans_versions (
  plan_id,
  version,
  title,
  description,
  price_month,
  price_year,
  discount_month,
  discount_year,
  features
)
VALUES (
  (SELECT id FROM public.plans WHERE slug = 'lifetime'),
  1,
  'Vitalicio',
  'OFERTA ÚNICA POR TIEMPO LIMITADO SOLO VÁLIDO PARA LOS PRIMEROS 1000 USUARIOS',
  15000,  -- $150.00 USD en centavos
  15000,  -- $150.00 USD en centavos
  0,
  0,
  '[
    {"text":"Todas las funciones del plan gratuito"},
    {"text":"Todas las funciones del plan estándar"},
    {"text":"Todas las funciones del plan avanzado"},
    {"text":"Hasta 10 Tags información"},
    {"text":"Acceso a nuestra versión Beta"},
    {"text":"Recibes nuevas funcionalidades antes"},
    {"text":"Descuentos únicos en LAMPO"},
    {"text":"Ingreso a nuestro plan fundadores"}
  ]'::jsonb
);
