-- Agrega columnas a la tabla de veterinarios para almacenar el resultado de la validación
ALTER TABLE public.veterinarians
ADD COLUMN is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN validated_first_name TEXT,
ADD COLUMN validated_last_name TEXT;

-- Agrega las mismas columnas a la tabla de accesos temporales
ALTER TABLE public.veterinary_accesses
ADD COLUMN is_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN validated_first_name TEXT,
ADD COLUMN validated_last_name TEXT;