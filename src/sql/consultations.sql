-- 1. Tabla Principal de Consultas
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id varchar(4) NOT NULL REFERENCES pets(id) ON DELETE CASCADE, -- Si se borra la mascota, se borran sus consultas
    veterinarian_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Quién hizo la consulta (si es usuario vet)
    veterinary_access_id UUID REFERENCES veterinary_accesses(id) ON DELETE SET NULL, -- Si se usó código de acceso
    
    consultation_date DATE NOT NULL,
    consultation_time TIME WITHOUT TIME ZONE,
    hc_number TEXT,
    institution_name TEXT,

    -- Anamnesis
    reason_for_consultation TEXT NOT NULL,
    current_diet TEXT,
    previous_illnesses TEXT,
    previous_surgeries TEXT,
    vaccination_history TEXT,
    last_deworming_product TEXT,
    recent_treatments TEXT,
    recent_travels TEXT,
    animal_behavior_owner_description TEXT,
    lives_with_other_animals_details TEXT,
    sterilized_status TEXT CHECK (sterilized_status IN ('yes', 'no', 'unknown')),
    birth_count INTEGER,

    -- Examen Físico General
    body_condition_score NUMERIC(2,1), -- ej: 3.5
    temperature_celsius NUMERIC(4,1), -- ej: 38.5
    heart_rate_bpm INTEGER,
    respiratory_rate_rpm INTEGER,
    capillary_refill_time_sec NUMERIC(3,1),
    pulse_description TEXT,
    mucous_membranes_description TEXT,
    hydration_percentage_description TEXT,
    sense_organs_description TEXT,

    -- Examen Físico por Sistemas
    skin_and_coat_description TEXT,
    lymph_nodes_description TEXT,
    digestive_system_findings TEXT,
    respiratory_system_findings TEXT,
    endocrine_system_findings TEXT,
    musculoskeletal_system_findings TEXT,
    nervous_system_findings TEXT,
    urinary_system_findings TEXT,
    reproductive_system_findings TEXT,
    rectal_palpation_findings TEXT,
    other_physical_findings TEXT,

    -- Abordaje Diagnóstico
    problem_list TEXT,
    master_problem_list TEXT,
    differential_diagnoses TEXT,

    -- Exámenes Complementarios (Resumen textual)
    complementary_exams_summary TEXT,

    -- Diagnóstico y Plan
    presumptive_diagnosis TEXT NOT NULL,
    definitive_diagnosis TEXT,
    therapeutic_plan TEXT NOT NULL,
    prognosis TEXT,
    evolution_notes TEXT,
    general_observations TEXT,
    signature_confirmation TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT check_vet_responsible CHECK (veterinarian_id IS NOT NULL OR veterinary_access_id IS NOT NULL)
);

-- Trigger para actualizar 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultations_modtime
    BEFORE UPDATE ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Índices
CREATE INDEX idx_consultations_pet_id ON consultations(pet_id);
CREATE INDEX idx_consultations_veterinarian_id ON consultations(veterinarian_id);
CREATE INDEX idx_consultations_veterinary_access_id ON consultations(veterinary_access_id);


-- 2. Tabla de Procedimientos de Consulta
CREATE TABLE consultation_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    procedure_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_consultation_procedures_consultation_id ON consultation_procedures(consultation_id);


-- 3. Tabla de Medicamentos de Consulta
CREATE TABLE consultation_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    duration_days INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_consultation_medications_consultation_id ON consultation_medications(consultation_id);


-- 4. Tabla de Archivos Adjuntos de Consulta
CREATE TABLE consultation_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE, -- Ruta en Supabase Storage, ej: 'pet_uuid/consultation_uuid/filename.pdf'
    file_type TEXT, -- MIME type
    file_size_bytes BIGINT,
    uploaded_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_consultation_files_consultation_id ON consultation_files(consultation_id);

-- Asegúrate de crear un BUCKET en Supabase Storage para los archivos, por ejemplo, 'consultation-files'
-- y configura sus políticas. Generalmente, el bucket es privado y se accede mediante URLs firmadas.

--- POLÍTICAS RLS (Row Level Security) ---

-- Habilitar RLS para cada tabla
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_files ENABLE ROW LEVEL SECURITY;

-- Función auxiliar para verificar si el usuario actual es el dueño de la mascota asociada a una consulta
CREATE OR REPLACE FUNCTION is_pet_owner(p_consultation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_owner BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM consultations c
        JOIN pets p ON c.pet_id = p.id
        WHERE c.id = p_consultation_id AND p.owner_id = auth.uid()
    ) INTO is_owner;
    RETURN is_owner;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- SECURITY DEFINER es importante para que pueda acceder a tablas necesarias

-- Función auxiliar para verificar si el veterinario actual creó la consulta o tiene acceso a través de veterinary_access
CREATE OR REPLACE FUNCTION veterinarian_has_access_to_consultation(p_consultation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM consultations c
        WHERE c.id = p_consultation_id
          AND (
            c.veterinarian_id = auth.uid() -- Vet creó la consulta
            OR EXISTS ( -- Vet tiene un acceso activo para esta mascota (más complejo, simplificado aquí)
                SELECT 1
                FROM veterinary_accesses va
                WHERE va.id = c.veterinary_access_id
                  AND va.pet_id = c.pet_id
                  -- AND va.expires_at > NOW() -- (Si los códigos de acceso tienen expiración y el vet_access se liga al usuario)
                  -- Esta parte es más compleja si el acceso es por código y no por sesión de veterinario.
                  -- Si veterinary_access_id es solo una referencia al código usado, la validación del código
                  -- debe ocurrir en la capa de API antes de la inserción/actualización.
                  -- Para RLS de SELECT, podría ser suficiente si la API ya validó.
            )
          )
    ) INTO has_access;
    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para 'consultations'
CREATE POLICY "Owners can view their pets consultations"
    ON consultations FOR SELECT
    USING (is_pet_owner(id));

CREATE POLICY "Veterinarians can view consultations they are linked to"
    ON consultations FOR SELECT
    USING (veterinarian_has_access_to_consultation(id));

CREATE POLICY "Authenticated veterinarians can insert consultations"
    ON consultations FOR INSERT
    WITH CHECK (
        (auth.role() = 'authenticated') AND
        (
            -- El ID del veterinario en el payload coincide con el usuario autenticado Y el rol del usuario es 'veterinarian'
            (veterinarian_id = auth.uid() AND (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'veterinarian')
            OR
            -- O se proporciona un veterinary_access_id válido (la validez del código en sí se manejaría en la API)
            (veterinary_access_id IS NOT NULL) -- La API debe validar que este access_id es legítimo para la mascota y el vet.
        )
    );
    
CREATE POLICY "Veterinarians can update consultations they created"
    ON consultations FOR UPDATE
    USING (veterinarian_id = auth.uid() AND (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'veterinarian')
    WITH CHECK (veterinarian_id = auth.uid()); -- No pueden cambiar el vet_id a otro

-- DELETE: Nadie puede eliminar directamente (según requerimiento)
CREATE POLICY "Consultations are protected from direct deletion"
    ON consultations FOR DELETE
    USING (false); -- O más restrictivo: TO none;

-- Políticas para 'consultation_procedures', 'consultation_medications'
-- Asumimos que si puedes ver/editar la consulta, puedes ver/editar sus detalles.
CREATE POLICY "Users can manage procedures of consultations they have access to"
    ON consultation_procedures FOR ALL
    USING (EXISTS (SELECT 1 FROM consultations WHERE id = consultation_id)); -- Re-evalúa RLS de la tabla 'consultations'

CREATE POLICY "Users can manage medications of consultations they have access to"
    ON consultation_medications FOR ALL
    USING (EXISTS (SELECT 1 FROM consultations WHERE id = consultation_id));

-- DELETE para procedures/medications: Solo si el veterinario que creó la consulta lo hace.
-- Esto podría ser más granular. Por ahora, si pueden actualizar la consulta, pueden borrar sub-items.
-- Podrías hacerla más restrictiva:
CREATE POLICY "Procedures can only be deleted by the creating veterinarian"
    ON consultation_procedures FOR DELETE
    USING (EXISTS (SELECT 1 FROM consultations c WHERE c.id = consultation_id AND c.veterinarian_id = auth.uid()));

CREATE POLICY "Medications can only be deleted by the creating veterinarian"
    ON consultation_medications FOR DELETE
    USING (EXISTS (SELECT 1 FROM consultations c WHERE c.id = consultation_id AND c.veterinarian_id = auth.uid()));


-- Políticas para 'consultation_files'
CREATE POLICY "Users can view files of consultations they have access to"
    ON consultation_files FOR SELECT
    USING (EXISTS (SELECT 1 FROM consultations WHERE id = consultation_id)); -- Re-evalúa RLS

CREATE POLICY "Authenticated users (vets) can upload files to consultations they have access to"
    ON consultation_files FOR INSERT
    WITH CHECK (
        (auth.role() = 'authenticated') AND
        (EXISTS (SELECT 1 FROM consultations WHERE id = consultation_id)) AND -- Implícitamente verifica acceso a consulta
        (uploaded_by_user_id = auth.uid()) -- Quien sube es el usuario actual
    );

CREATE POLICY "Users can delete files they uploaded"
    ON consultation_files FOR DELETE
    USING (uploaded_by_user_id = auth.uid());

-- Políticas de Supabase Storage para el bucket 'consultation-files' (Ejemplos conceptuales):
-- Estas se configuran en la UI de Supabase Storage, no directamente con SQL aquí.
-- 1. SELECT: Permitir a usuarios autenticados que tengan una RLS de SELECT en `consultation_files` para el `file_path` correspondiente.
   -- ( (bucket_id = 'consultation-files') AND (ROLE() = 'authenticated') AND (EXISTS (SELECT 1 FROM public.consultation_files WHERE consultation_files.file_path = storage.objectid((storage.objects.name)::text) AND auth.uid() = consultation_files.uploaded_by_user_id /* O reglas de acceso a la consulta */ )) )
-- 2. INSERT: Permitir a usuarios autenticados que puedan hacer INSERT en `consultation_files` y que `uploaded_by_user_id` sea su `auth.uid()`.
-- 3. UPDATE: Generalmente no se permite para evitar corrupción, se sube una nueva versión.
-- 4. DELETE: Permitir a usuarios autenticados que puedan hacer DELETE en `consultation_files` y que `uploaded_by_user_id` sea su `auth.uid()`.


GRANT REFERENCES (id) ON TABLE auth.users TO authenticated;

CREATE OR REPLACE FUNCTION create_consultation_secure(
    p_pet_id UUID,
    p_veterinarian_id UUID,
    p_reason TEXT
    -- ... otros parámetros ...
)
RETURNS UUID -- o el ID de la consulta creada
LANGUAGE plpgsql
SECURITY DEFINER -- ¡Importante!
-- SET search_path = public, auth; -- Asegura que los esquemas correctos estén en el path
AS $$
DECLARE
    new_consultation_id UUID;
BEGIN
    -- Aquí puedes añadir validaciones adicionales si es necesario,
    -- como verificar que p_veterinarian_id (si es auth.uid()) realmente es un veterinario.
    -- Esta validación es importante ya que la función se ejecuta con altos privilegios.

    INSERT INTO public.consultations (pet_id, veterinarian_id, reason_for_consultation /*, ...otros campos... */)
    VALUES (p_pet_id, p_veterinarian_id, p_reason /*, ...otros valores... */)
    RETURNING id INTO new_consultation_id;

    RETURN new_consultation_id;
END;
$$;

-- Luego, otorgas permiso de EXECUTE en esta función a los roles necesarios:
GRANT EXECUTE ON FUNCTION create_consultation_secure(UUID, UUID, TEXT) TO authenticated;

CREATE POLICY "Allow individual user access"
ON auth.users
FOR SELECT
USING (auth.uid() = id);

-- Tipo para los procedimientos que se pasarán como array
CREATE TYPE consultation_procedure_input AS (
    procedure_name TEXT,
    description TEXT
);

-- Tipo para los medicamentos que se pasarán como array
CREATE TYPE consultation_medication_input AS (
    medication_name TEXT,
    dosage TEXT,
    frequency TEXT,
    duration_days INTEGER,
    notes TEXT
);

CREATE TYPE consultation_input_type AS (
    p_consultation_date DATE,
    p_consultation_time TIME WITHOUT TIME ZONE,
    p_hc_number TEXT,
    p_institution_name TEXT,
    p_reason_for_consultation TEXT,
    p_current_diet TEXT,
    p_previous_illnesses TEXT,
    p_previous_surgeries TEXT,
    p_vaccination_history TEXT,
    p_last_deworming_product TEXT,
    p_recent_treatments TEXT,
    p_recent_travels TEXT,
    p_animal_behavior_owner_description TEXT,
    p_lives_with_other_animals_details TEXT,
    p_sterilized_status TEXT,
    p_birth_count INTEGER,
    p_body_condition_score NUMERIC,
    p_temperature_celsius NUMERIC,
    p_heart_rate_bpm INTEGER,
    p_respiratory_rate_rpm INTEGER,
    p_capillary_refill_time_sec NUMERIC,
    p_pulse_description TEXT,
    p_mucous_membranes_description TEXT,
    p_hydration_percentage_description TEXT,
    p_sense_organs_description TEXT,
    p_skin_and_coat_description TEXT,
    p_lymph_nodes_description TEXT,
    p_digestive_system_findings TEXT,
    p_respiratory_system_findings TEXT,
    p_endocrine_system_findings TEXT,
    p_musculoskeletal_system_findings TEXT,
    p_nervous_system_findings TEXT,
    p_urinary_system_findings TEXT,
    p_reproductive_system_findings TEXT,
    p_rectal_palpation_findings TEXT,
    p_other_physical_findings TEXT,
    p_problem_list TEXT,
    p_master_problem_list TEXT,
    p_differential_diagnoses TEXT,
    p_complementary_exams_summary TEXT,
    p_presumptive_diagnosis TEXT,
    p_definitive_diagnosis TEXT,
    p_therapeutic_plan TEXT,
    p_prognosis TEXT,
    p_evolution_notes TEXT,
    p_general_observations TEXT,
    p_signature_confirmation TEXT
);


-- Tipos para los inputs de arrays (si ya los tienes, no necesitas volver a crearlos)
-- CREATE TYPE consultation_procedure_input AS (...);
-- CREATE TYPE consultation_medication_input AS (...);

CREATE OR REPLACE FUNCTION insert_consultation_with_type(
    p_pet_id TEXT,
    p_veterinarian_id UUID, -- Puede ser NULL
    p_veterinary_access_id UUID, -- Puede ser NULL
    p_consultation_main_data consultation_input_type,
    p_procedures consultation_procedure_input[],
    p_medications consultation_medication_input[]
)
RETURNS JSON -- Devolvemos la consulta creada como JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_consultation_id UUID;
    full_consultation_json JSON;
    proc_input consultation_procedure_input;
    med_input consultation_medication_input;
BEGIN
    IF p_veterinarian_id IS NULL AND p_veterinary_access_id IS NULL THEN
        RAISE EXCEPTION 'Se requiere veterinarian_id o veterinary_access_id para crear una consulta.';
    END IF;

    INSERT INTO public.consultations (
        pet_id, veterinarian_id, veterinary_access_id,
        consultation_date, consultation_time, hc_number, institution_name,
        reason_for_consultation, current_diet, previous_illnesses, previous_surgeries,
        vaccination_history, last_deworming_product, recent_treatments, recent_travels,
        animal_behavior_owner_description, lives_with_other_animals_details,
        sterilized_status, birth_count, body_condition_score, temperature_celsius,
        heart_rate_bpm, respiratory_rate_rpm, capillary_refill_time_sec, pulse_description,
        mucous_membranes_description, hydration_percentage_description, sense_organs_description,
        skin_and_coat_description, lymph_nodes_description, digestive_system_findings,
        respiratory_system_findings, endocrine_system_findings, musculoskeletal_system_findings,
        nervous_system_findings, urinary_system_findings, reproductive_system_findings,
        rectal_palpation_findings, other_physical_findings, problem_list, master_problem_list,
        differential_diagnoses, complementary_exams_summary, presumptive_diagnosis,
        definitive_diagnosis, therapeutic_plan, prognosis, evolution_notes,
        general_observations, signature_confirmation
    ) VALUES (
        p_pet_id, p_veterinarian_id, p_veterinary_access_id,
        (p_consultation_main_data).p_consultation_date,
        (p_consultation_main_data).p_consultation_time,
        (p_consultation_main_data).p_hc_number,
        (p_consultation_main_data).p_institution_name,
        (p_consultation_main_data).p_reason_for_consultation,
        (p_consultation_main_data).p_current_diet,
        (p_consultation_main_data).p_previous_illnesses,
        (p_consultation_main_data).p_previous_surgeries,
        (p_consultation_main_data).p_vaccination_history,
        (p_consultation_main_data).p_last_deworming_product,
        (p_consultation_main_data).p_recent_treatments,
        (p_consultation_main_data).p_recent_travels,
        (p_consultation_main_data).p_animal_behavior_owner_description,
        (p_consultation_main_data).p_lives_with_other_animals_details,
        (p_consultation_main_data).p_sterilized_status,
        (p_consultation_main_data).p_birth_count,
        (p_consultation_main_data).p_body_condition_score,
        (p_consultation_main_data).p_temperature_celsius,
        (p_consultation_main_data).p_heart_rate_bpm,
        (p_consultation_main_data).p_respiratory_rate_rpm,
        (p_consultation_main_data).p_capillary_refill_time_sec,
        (p_consultation_main_data).p_pulse_description,
        (p_consultation_main_data).p_mucous_membranes_description,
        (p_consultation_main_data).p_hydration_percentage_description,
        (p_consultation_main_data).p_sense_organs_description,
        (p_consultation_main_data).p_skin_and_coat_description,
        (p_consultation_main_data).p_lymph_nodes_description,
        (p_consultation_main_data).p_digestive_system_findings,
        (p_consultation_main_data).p_respiratory_system_findings,
        (p_consultation_main_data).p_endocrine_system_findings,
        (p_consultation_main_data).p_musculoskeletal_system_findings,
        (p_consultation_main_data).p_nervous_system_findings,
        (p_consultation_main_data).p_urinary_system_findings,
        (p_consultation_main_data).p_reproductive_system_findings,
        (p_consultation_main_data).p_rectal_palpation_findings,
        (p_consultation_main_data).p_other_physical_findings,
        (p_consultation_main_data).p_problem_list,
        (p_consultation_main_data).p_master_problem_list,
        (p_consultation_main_data).p_differential_diagnoses,
        (p_consultation_main_data).p_complementary_exams_summary,
        (p_consultation_main_data).p_presumptive_diagnosis,
        (p_consultation_main_data).p_definitive_diagnosis,
        (p_consultation_main_data).p_therapeutic_plan,
        (p_consultation_main_data).p_prognosis,
        (p_consultation_main_data).p_evolution_notes,
        (p_consultation_main_data).p_general_observations,
        (p_consultation_main_data).p_signature_confirmation
    ) RETURNING id INTO new_consultation_id;

    IF p_procedures IS NOT NULL AND array_length(p_procedures, 1) > 0 THEN
        FOREACH proc_input IN ARRAY p_procedures LOOP
            INSERT INTO public.consultation_procedures (consultation_id, procedure_name, description)
            VALUES (new_consultation_id, proc_input.procedure_name, proc_input.description);
        END LOOP;
    END IF;

    IF p_medications IS NOT NULL AND array_length(p_medications, 1) > 0 THEN
        FOREACH med_input IN ARRAY p_medications LOOP
            INSERT INTO public.consultation_medications (consultation_id, medication_name, dosage, frequency, duration_days, notes)
            VALUES (new_consultation_id, med_input.medication_name, med_input.dosage, med_input.frequency, med_input.duration_days, med_input.notes);
        END LOOP;
    END IF;

    -- Devolver la consulta completa como JSON
    SELECT json_build_object(
        'id', c.id, 'pet_id', c.pet_id, 'veterinarian_id', c.veterinarian_id, 'veterinary_access_id', c.veterinary_access_id,
        'consultation_date', c.consultation_date, 'consultation_time', c.consultation_time, 'hc_number', c.hc_number, 'institution_name', c.institution_name,
        'reason_for_consultation', c.reason_for_consultation, 'current_diet', c.current_diet, 'previous_illnesses', c.previous_illnesses, 'previous_surgeries', c.previous_surgeries,
        'vaccination_history', c.vaccination_history, 'last_deworming_product', c.last_deworming_product, 'recent_treatments', c.recent_treatments, 'recent_travels', c.recent_travels,
        'animal_behavior_owner_description', c.animal_behavior_owner_description, 'lives_with_other_animals_details', c.lives_with_other_animals_details,
        'sterilized_status', c.sterilized_status, 'birth_count', c.birth_count, 'body_condition_score', c.body_condition_score, 'temperature_celsius', c.temperature_celsius,
        'heart_rate_bpm', c.heart_rate_bpm, 'respiratory_rate_rpm', c.respiratory_rate_rpm, 'capillary_refill_time_sec', c.capillary_refill_time_sec, 'pulse_description', c.pulse_description,
        'mucous_membranes_description', c.mucous_membranes_description, 'hydration_percentage_description', c.hydration_percentage_description, 'sense_organs_description', c.sense_organs_description,
        'skin_and_coat_description', c.skin_and_coat_description, 'lymph_nodes_description', c.lymph_nodes_description, 'digestive_system_findings', c.digestive_system_findings,
        'respiratory_system_findings', c.respiratory_system_findings, 'endocrine_system_findings', c.endocrine_system_findings, 'musculoskeletal_system_findings', c.musculoskeletal_system_findings,
        'nervous_system_findings', c.nervous_system_findings, 'urinary_system_findings', c.urinary_system_findings, 'reproductive_system_findings', c.reproductive_system_findings,
        'rectal_palpation_findings', c.rectal_palpation_findings, 'other_physical_findings', c.other_physical_findings, 'problem_list', c.problem_list, 'master_problem_list', c.master_problem_list,
        'differential_diagnoses', c.differential_diagnoses, 'complementary_exams_summary', c.complementary_exams_summary, 'presumptive_diagnosis', c.presumptive_diagnosis,
        'definitive_diagnosis', c.definitive_diagnosis, 'therapeutic_plan', c.therapeutic_plan, 'prognosis', c.prognosis, 'evolution_notes', c.evolution_notes,
        'general_observations', c.general_observations, 'signature_confirmation', c.signature_confirmation,
        'created_at', c.created_at, 'updated_at', c.updated_at,
        'procedures', (SELECT COALESCE(json_agg(cp), '[]'::json) FROM consultation_procedures cp WHERE cp.consultation_id = new_consultation_id),
        'medications', (SELECT COALESCE(json_agg(cm), '[]'::json) FROM consultation_medications cm WHERE cm.consultation_id = new_consultation_id),
        'files', '[]'::json
    )
    INTO full_consultation_json
    FROM consultations c
    WHERE c.id = new_consultation_id;

    RETURN full_consultation_json;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error en create_consultation_secure: %', SQLERRM;
        RAISE;
END;
$$;

GRANT EXECUTE ON FUNCTION insert_consultation_with_type(
	TEXT, -- p_pet_id
    UUID, -- p_veterinarian_id
    UUID, -- p_veterinary_access_id
    consultation_input_type, -- p_consultation_data
    consultation_procedure_input[], -- p_procedures
    consultation_medication_input[]  -- p_medications
) TO authenticated;