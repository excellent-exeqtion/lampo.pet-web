-- Agregamos la columna de fecha de nacimiento:
ALTER TABLE public.pets
ADD COLUMN birth_date   TIMESTAMP;