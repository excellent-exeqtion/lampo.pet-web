// src/components/forms/consultation/sections/IdentitySection.tsx
import React from 'react';
import type { CreateConsultationPayload } from '@/types/index';

interface IdentitySectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function IdentitySection({ formData, handleChange }: IdentitySectionProps) {
    return (
        <fieldset>
            <legend>1. Identificación de la Institución e Historia Clínica</legend>
            <div className="grid">
                <label htmlFor="institution_name">
                    Nombre de la Institución
                    <input
                        type="text"
                        id="institution_name"
                        name="institution_name" // Campo nuevo, añadir a CreateConsultationPayload y tabla
                        value={formData.institution_name || ''}
                        onChange={handleChange}
                        placeholder="Ej: Clínica Veterinaria XYZ"
                    />
                </label>
            </div>
            <div className="grid">
                <label htmlFor="hc_number">
                    HC # (Número Consecutivo)
                    <input
                        type="text"
                        id="hc_number"
                        name="hc_number" // Campo nuevo
                        value={formData.hc_number || ''}
                        onChange={handleChange}
                    />
                </label>
            </div>
            <div className="grid">
                <label htmlFor="consultation_date">
                    Fecha
                    <input
                        type="date"
                        id="consultation_date"
                        name="consultation_date"
                        value={formData.consultation_date || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label htmlFor="consultation_time">
                    Hora
                    <input
                        type="time"
                        id="consultation_time"
                        name="consultation_time" // Campo nuevo
                        value={formData.consultation_time || ''}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
        </fieldset>
    );
}