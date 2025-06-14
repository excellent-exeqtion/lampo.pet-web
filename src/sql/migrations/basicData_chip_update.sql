-- Agregamos la columna opcional para el número de chip
ALTER TABLE public.basic_data
ADD COLUMN chip_number TEXT;