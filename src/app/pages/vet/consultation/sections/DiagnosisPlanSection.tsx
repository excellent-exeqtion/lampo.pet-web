// src/components/forms/consultation/sections/DiagnosisPlanSection.tsx
import React from 'react';
import type { CreateConsultationPayload } from '@/types/index';

interface DiagnosisPlanSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function DiagnosisPlanSection({ formData, handleChange }: DiagnosisPlanSectionProps) {
    return (
        <fieldset>
            <legend>8. Diagnóstico y Plan</legend>
            <label htmlFor="presumptive_diagnosis">
                Diagnóstico Presuntivo Justificado
                <textarea
                    id="presumptive_diagnosis"
                    name="presumptive_diagnosis"
                    value={formData.presumptive_diagnosis || ''}
                    onChange={handleChange}
                    rows={3}
                    required
                    placeholder="Describa el diagnóstico presuntivo y la justificación basada en los hallazgos."
                />
            </label>
            <label htmlFor="definitive_diagnosis">
                Diagnóstico Definitivo (si se tiene)
                <textarea
                    id="definitive_diagnosis"
                    name="definitive_diagnosis"
                    value={formData.definitive_diagnosis || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </label>
            <label htmlFor="therapeutic_plan">
                Plan Terapéutico
                <textarea
                    id="therapeutic_plan"
                    name="therapeutic_plan"
                    value={formData.therapeutic_plan || ''}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Detallar el tratamiento, recomendaciones, próxima revisión, etc."
                />
            </label>
            <label htmlFor="prognosis">
                Pronóstico
                <textarea
                    id="prognosis"
                    name="prognosis"
                    value={formData.prognosis || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ej: Favorable, reservado, grave."
                />
            </label>
            <label htmlFor="evolution_notes">
                Evolución (Notas iniciales si aplica durante la consulta)
                <textarea
                    id="evolution_notes"
                    name="evolution_notes"
                    value={formData.evolution_notes || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </label>
        </fieldset>
    );
}