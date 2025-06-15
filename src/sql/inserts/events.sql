-- Inserts de prueba para el calendario para la mascota V349

-- 1. Próxima consulta de control (derivada de una consulta pasada)
INSERT INTO public.consultations (
    id, pet_id, veterinarian_id, consultation_date, reason_for_consultation, presumptive_diagnosis, therapeutic_plan, 
    next_consultation_date, next_consultation_reason
) VALUES (
    gen_random_uuid(), 'V349', '8933eed8-daea-4e6c-b4db-44906b9f44f9', '2024-05-10', 
    'Chequeo general anual', 'Paciente sano', 'Continuar con dieta actual y ejercicio.',
    (current_date + interval '15 days'), 'Control post-tratamiento'
);

-- 2. Próxima dosis de una vacuna
INSERT INTO public.vaccines (
    id, pet_id, name, date, batch, brand, 
    frequency, next_dose_date
) VALUES (
    gen_random_uuid(), 'V349', 'Rabia', '2024-01-20', 'RAB-XX-01', 'Rabisin', 
    'Anual', (current_date + interval '30 days')
);

-- 3. Próximo examen de laboratorio de seguimiento
INSERT INTO public.lab_tests (
    id, pet_id, name, type, date, result, 
    next_test_date
) VALUES (
    gen_random_uuid(), 'V349', 'Perfil Hepático', 'Sangre', '2024-06-01', 'Ligeramente elevado', 
    (current_date + interval '45 days')
);

-- 4. Próximos tratamientos recurrentes
-- Antipulgas
INSERT INTO public.pet_treatments (
    id, pet_id, type, product_name, date, frequency, next_dose_date
) VALUES (
    gen_random_uuid(), 'V349', 'antipulgas', 'Bravecto', (current_date - interval '2 months'), 'Cada 3 meses', (current_date + interval '1 month')
);

-- Desparasitación
INSERT INTO public.pet_treatments (
    id, pet_id, type, product_name, date, frequency, next_dose_date
) VALUES (
    gen_random_uuid(), 'V349', 'desparasitacion', 'Drontal', (current_date - interval '1 month'), 'Mensual', (current_date + interval '2 days')
);

-- 5. Cumpleaños (Esto no requiere un INSERT, ya que la función RPC lo calcula del campo birth_date en la tabla pets)
-- Asegúrate de que la mascota 'V349' tenga un 'birth_date' en la tabla 'pets'. Si no lo tiene, puedes añadirlo así:
-- UPDATE public.pets SET birth_date = '2022-07-15' WHERE id = 'V349';