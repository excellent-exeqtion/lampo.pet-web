-- Agregamos las columnas para latitud, longitud y el código de país.
ALTER TABLE public.owners
ADD COLUMN latitude NUMERIC(9, 6),
ADD COLUMN longitude NUMERIC(9, 6);

-- Opcional pero recomendado: Se podría modificar la columna 'phone'
-- para indicar que ahora solo guarda el número local, no el código.
COMMENT ON COLUMN public.owners.phone IS 'Número de teléfono local sin el código de país.';