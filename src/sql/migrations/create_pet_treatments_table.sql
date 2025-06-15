-- migrations/create_pet_treatments_table.sql

-- Crear un ENUM para los tipos de tratamiento para mayor consistencia
CREATE TYPE treatment_type AS ENUM (
    'antipulgas',
    'desparasitacion',
    'bano_medicado',
    'corte_unas'
);

-- Crear la tabla para registrar tratamientos recurrentes
CREATE TABLE public.pet_treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id VARCHAR(4) NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    type treatment_type NOT NULL,
    product_name TEXT, -- Opcional, para antipulgas/desparasitantes
    date DATE NOT NULL,
    frequency TEXT, -- ej: 'Mensual', 'Cada 3 meses', 'Anual'
    next_dose_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para actualizar 'updated_at'
CREATE TRIGGER update_pet_treatments_modtime
    BEFORE UPDATE ON public.pet_treatments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_pet_treatments_pet_id ON public.pet_treatments(pet_id);
CREATE INDEX idx_pet_treatments_next_dose_date ON public.pet_treatments(next_dose_date);

-- Políticas de seguridad a nivel de fila (RLS)
ALTER TABLE public.pet_treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage treatments for their own pets"
    ON public.pet_treatments
    FOR ALL
    USING (pet_id IN (
        SELECT id FROM public.pets WHERE owner_id = auth.uid()
    ));

CREATE POLICY "Vets can view treatments for pets they have access to"
    ON public.pet_treatments
    FOR SELECT
    USING (
        (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'veterinarian'
    );