-- migrations/update_rls_policies.sql

-- 1. Crear una función segura para verificar si el usuario actual es un veterinario.
CREATE OR REPLACE FUNCTION is_veterinarian()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT raw_user_meta_data->>'role'
        FROM auth.users
        WHERE id = auth.uid()
    ) = 'veterinarian';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Eliminar las políticas antiguas que causan el error en `consultations`.
DROP POLICY IF EXISTS "Veterinarians can view consultations they are linked to" ON public.consultations;
DROP POLICY IF EXISTS "Authenticated veterinarians can insert consultations" ON public.consultations;
DROP POLICY IF EXISTS "Veterinarians can update consultations they created" ON public.consultations;

-- 3. Crear las nuevas políticas para `consultations` usando la función segura.
CREATE POLICY "Veterinarians can view consultations they are linked to"
    ON public.consultations FOR SELECT
    USING (veterinarian_has_access_to_consultation(id));

CREATE POLICY "Veterinarians can insert consultations"
    ON public.consultations FOR INSERT
    WITH CHECK (
        is_veterinarian() AND
        (
            veterinarian_id = auth.uid() OR veterinary_access_id IS NOT NULL
        )
    );

CREATE POLICY "Veterinarians can update consultations they created"
    ON public.consultations FOR UPDATE
    USING (is_veterinarian() AND veterinarian_id = auth.uid())
    WITH CHECK (veterinarian_id = auth.uid());


-- 4. Corregir la política en `pet_treatments` que también tiene este problema.
DROP POLICY IF EXISTS "Vets can view treatments for pets they have access to" ON public.pet_treatments;

CREATE POLICY "Vets can view treatments for pets they have access to"
    ON public.pet_treatments
    FOR SELECT
    USING (is_veterinarian());

-- 5. (Opcional pero recomendado) Corregir la función `veterinarian_has_access_to_consultation` para que también use la nueva función.
CREATE OR REPLACE FUNCTION veterinarian_has_access_to_consultation(p_consultation_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM consultations c
        WHERE c.id = p_consultation_id
          AND is_veterinarian() -- Usamos la función segura aquí
          AND (c.veterinarian_id = auth.uid() OR c.veterinary_access_id IS NOT NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;