-- Agregamos las columnas para el color y el tipo de pelaje:
ALTER TABLE public.basic_data
ADD COLUMN coat_type TEXT,
ADD COLUMN color TEXT;
