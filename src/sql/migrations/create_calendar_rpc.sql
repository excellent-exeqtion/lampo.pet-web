-- migrations/create_calendar_rpc.sql
CREATE OR REPLACE FUNCTION get_calendar_events_for_owner(p_owner_id UUID)
RETURNS TABLE(
    event_id TEXT,
    title TEXT,
    event_date DATE,
    event_type TEXT,
    pet_name TEXT,
    pet_id TEXT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    -- 1. Cumpleaños de las mascotas
    SELECT
        p.id || '-birthday-' || to_char(p.birth_date, 'MMDD'),
        'Cumpleaños de ' || p.name,
        make_date(extract(year from current_date)::integer, extract(month from p.birth_date)::integer, extract(day from p.birth_date)::integer) AS event_date,
        'birthday' AS event_type,
        p.name,
        p.id,
        '¡Feliz cumpleaños!' AS description
    FROM
        pets p
    WHERE
        p.owner_id = p_owner_id AND p.birth_date IS NOT NULL

    UNION ALL

    -- 2. Próximas Consultas
    SELECT
        c.id::TEXT,
        'Próxima consulta: ' || COALESCE(c.next_consultation_reason, 'Control'),
        c.next_consultation_date,
        'consultation' AS event_type,
        p.name,
        p.id,
        c.next_consultation_reason
    FROM
        consultations c
    JOIN
        pets p ON c.pet_id = p.id
    WHERE
        p.owner_id = p_owner_id AND c.next_consultation_date IS NOT NULL AND c.next_consultation_date >= current_date

    UNION ALL

    -- 3. Próximas Vacunas
    SELECT
        v.id::TEXT,
        'Próxima vacuna: ' || v.name,
        v.next_dose_date,
        'vaccine' AS event_type,
        p.name,
        p.id,
        'Frecuencia: ' || COALESCE(v.frequency, 'N/A')
    FROM
        vaccines v
    JOIN
        pets p ON v.pet_id = p.id
    WHERE
        p.owner_id = p_owner_id AND v.next_dose_date IS NOT NULL AND v.next_dose_date >= current_date

    UNION ALL

    -- 4. Próximos Tratamientos (Antipulgas, Desparasitación, etc.)
    SELECT
        pt.id::TEXT,
        'Próximo tratamiento: ' || initcap(replace(pt.type::TEXT, '_', ' ')),
        pt.next_dose_date,
        'treatment' AS event_type,
        p.name,
        p.id,
        COALESCE(pt.product_name, '') || ' - ' || COALESCE(pt.notes, '')
    FROM
        pet_treatments pt
    JOIN
        pets p ON pt.pet_id = p.id
    WHERE
        p.owner_id = p_owner_id AND pt.next_dose_date IS NOT NULL AND pt.next_dose_date >= current_date

    UNION ALL

    -- 5. Próximos Exámenes de Laboratorio
    SELECT
        lt.id::TEXT,
        'Próximo examen: ' || lt.name,
        lt.next_test_date,
        'lab_test' AS event_type,
        p.name,
        p.id,
        'Tipo: ' || lt.type
    FROM
        lab_tests lt
    JOIN
        pets p ON lt.pet_id = p.id
    WHERE
        p.owner_id = p_owner_id AND lt.next_test_date IS NOT NULL AND lt.next_test_date >= current_date;
END;
$$ LANGUAGE plpgsql;

-- Otorga permisos para que los usuarios autenticados puedan llamar a esta función
GRANT EXECUTE ON FUNCTION get_calendar_events_for_owner(UUID) TO authenticated;