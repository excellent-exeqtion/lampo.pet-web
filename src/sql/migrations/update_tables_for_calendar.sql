-- migrations/update_tables_for_calendar.sql

-- Añadir campos de seguimiento a la tabla de consultas
ALTER TABLE public.consultations
ADD COLUMN next_consultation_date DATE,
ADD COLUMN next_consultation_reason TEXT;

-- Añadir campos de seguimiento a la tabla de vacunas
ALTER TABLE public.vaccines
ADD COLUMN frequency TEXT,
ADD COLUMN next_dose_date DATE;

-- Añadir campo de seguimiento a la tabla de exámenes de laboratorio
ALTER TABLE public.lab_tests
ADD COLUMN next_test_date DATE;