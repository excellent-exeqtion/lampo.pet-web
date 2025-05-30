// src/components/forms/consultation/sections/ObservationsSignatureSection.tsx
import React from 'react';
import type { CreateConsultationPayload } from '@/types/index';

interface ObservationsSignatureSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    professionalName: string;
    professionalRegistration: string;
}

export function ObservationsSignatureSection({
    formData,
    handleChange,
    professionalName,
    professionalRegistration
}: ObservationsSignatureSectionProps) {
    return (
        <fieldset>
            <legend>9. Observaciones y Profesional</legend>
            <label htmlFor="general_observations">
                Observaciones Adicionales / Anexos (descripción)
                <textarea
                    id="general_observations"
                    name="general_observations"
                    value={formData.general_observations || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Consentimientos informados, recomendaciones de egreso, etc."
                />
            </label>

            <div className="grid">
                <label>
                    Nombre MV o MVZ Tratante
                    <input type="text" value={professionalName} readOnly disabled />
                </label>
                <label>
                    Matrícula Profesional
                    <input type="text" value={professionalRegistration} readOnly disabled />
                </label>
            </div>
            <label>
                Firma (Digital o constancia)
                {/* Este campo es complejo de implementar digitalmente sin herramientas específicas.
                    Podría ser un campo de texto donde el vet confirma su responsabilidad. */}
                <input
                    type="text"
                    name="signature_confirmation" // Nuevo campo
                    value={formData.signature_confirmation || ""}
                    onChange={handleChange}
                    placeholder="Confirmo la veracidad de esta consulta bajo mi matrícula profesional."
                />
            </label>
        </fieldset>
    );
}