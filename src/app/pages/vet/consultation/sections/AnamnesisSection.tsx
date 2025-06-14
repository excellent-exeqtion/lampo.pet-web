// src/components/forms/consultation/sections/AnamnesisSection.tsx
import React from 'react';
import type { CreateConsultationPayload, BasicDataType } from '@/types/index';

interface AnamnesisSectionProps {
    formData: Partial<CreateConsultationPayload>;
    basicData: BasicDataType | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleNumericChange: (name: keyof CreateConsultationPayload, value: string) => void;
}

export function AnamnesisSection({ formData, basicData, handleChange, handleNumericChange }: AnamnesisSectionProps) {
    const isFemale = basicData?.gender === 'Hembra';

    return (
        <fieldset>
            <legend>4. Anamnesis</legend>
            <label htmlFor="current_diet">Dieta Actual<textarea id="current_diet" name="current_diet" value={formData.current_diet || ''} onChange={handleChange} rows={2} /></label>
            <div className="grid">
                <label htmlFor="previous_illnesses">Enfermedades Previas<textarea id="previous_illnesses" name="previous_illnesses" value={formData.previous_illnesses || ''} onChange={handleChange} rows={2} /></label>
                <label htmlFor="previous_surgeries">Cirugías Previas<textarea id="previous_surgeries" name="previous_surgeries" value={formData.previous_surgeries || ''} onChange={handleChange} rows={2} /></label>
            </div>
            <div className="grid">
                <label htmlFor="vaccination_history">Esquema Vacunal (Resumen)<textarea id="vaccination_history" name="vaccination_history" value={formData.vaccination_history || ''} onChange={handleChange} placeholder="Ej: Completo según edad, última revacunación Diciembre 2023" rows={2} /></label>
                <label htmlFor="last_deworming_product">Última Desparasitación y Producto<input type="text" id="last_deworming_product" name="last_deworming_product" value={formData.last_deworming_product || ''} onChange={handleChange} placeholder="Ej: Drontal Plus, hace 2 meses" /></label>
            </div>
            <label htmlFor="recent_treatments">Tratamientos Recientes<textarea id="recent_treatments" name="recent_treatments" value={formData.recent_treatments || ''} onChange={handleChange} rows={2} /></label>
            <div className="grid">
                <label htmlFor="recent_travels">Viajes Recientes<input type="text" id="recent_travels" name="recent_travels" value={formData.recent_travels || ''} onChange={handleChange} placeholder="Ej: Finca en Clima Cálido hace 1 semana" /></label>
                <label htmlFor="lives_with_other_animals_details">¿Vive con otros animales? ¿Cuáles?<input type="text" id="lives_with_other_animals_details" name="lives_with_other_animals_details" value={formData.lives_with_other_animals_details || ''} onChange={handleChange} placeholder="Ej: Sí, un gato y un perro." /></label>
            </div>
            <div className="grid">
                <label>Esterilizado
                    <select name="sterilized_status" value={formData.sterilized_status || ""} onChange={handleChange}>
                        <option value="" disabled>Seleccionar...</option>
                        <option value="yes">Sí</option>
                        <option value="no">No</option>
                        <option value="unknown">No se sabe</option>
                    </select>
                </label>
                {isFemale && (
                    <label htmlFor="birth_count">N° de Partos
                        <input type="number" id="birth_count" name="birth_count" value={formData.birth_count === undefined || formData.birth_count === null ? '' : formData.birth_count} onChange={(e) => handleNumericChange('birth_count', e.target.value)} min="0" />
                    </label>
                )}
            </div>
            <label htmlFor="animal_behavior_owner_description">Comportamiento del Animal (según propietario)<textarea id="animal_behavior_owner_description" name="animal_behavior_owner_description" value={formData.animal_behavior_owner_description || ''} onChange={handleChange} rows={3} /></label>
            <label htmlFor="reason_for_consultation">Motivo de Consulta (según propietario)<textarea id="reason_for_consultation" name="reason_for_consultation" value={formData.reason_for_consultation || ''} onChange={handleChange} rows={3} required /></label>
        </fieldset>
    );
}