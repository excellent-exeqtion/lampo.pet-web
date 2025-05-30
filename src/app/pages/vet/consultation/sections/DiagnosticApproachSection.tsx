// src/components/forms/consultation/sections/DiagnosticApproachSection.tsx
import React from 'react';
import type { CreateConsultationPayload } from '@/types/index';

interface DiagnosticApproachSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function DiagnosticApproachSection({ formData, handleChange }: DiagnosticApproachSectionProps) {
    return (
        <fieldset>
            <legend>6. Abordaje Diagnóstico</legend>
            <label htmlFor="problem_list">
                Lista de Problemas
                <textarea
                    id="problem_list"
                    name="problem_list"
                    value={formData.problem_list || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej: 1. Vómito agudo, 2. Letargia, 3. Deshidratación leve"
                />
            </label>
            <label htmlFor="master_problem_list">
                Lista Maestra (Problema Principal)
                <textarea
                    id="master_problem_list"
                    name="master_problem_list"
                    value={formData.master_problem_list || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Ej: Síndrome gastrointestinal agudo"
                />
            </label>
            <label htmlFor="differential_diagnoses">
                Diagnósticos Diferenciales
                <textarea
                    id="differential_diagnoses"
                    name="differential_diagnoses"
                    value={formData.differential_diagnoses || ''}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ej: 1. Gastroenteritis viral, 2. Cuerpo extraño, 3. Indiscreción alimentaria, 4. Pancreatitis"
                />
            </label>
        </fieldset>
    );
}