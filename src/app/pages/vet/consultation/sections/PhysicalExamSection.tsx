// src/components/forms/consultation/sections/PhysicalExamSection.tsx
import React from 'react';
import type { CreateConsultationPayload } from '@/types/index';

interface PhysicalExamSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleNumericChange: (name: keyof CreateConsultationPayload, value: string) => void;
}

export function PhysicalExamSection({ formData, handleChange, handleNumericChange }: PhysicalExamSectionProps) {
    return (
        <fieldset>
            <legend>5. Examen Físico General</legend>
            
            {/* Sub-sección: Constantes Fisiológicas y Estado General */}
            <div className="grid">
                <label htmlFor="body_condition_score">
                    Condición Corporal (1-5)
                    <input
                        type="number"
                        id="body_condition_score"
                        name="body_condition_score"
                        value={formData.body_condition_score === undefined || formData.body_condition_score === null ? '' : formData.body_condition_score}
                        onChange={(e) => handleNumericChange('body_condition_score', e.target.value)}
                        min="1" max="5" step="0.5"
                        placeholder="Ej: 3"
                    />
                </label>
                <label htmlFor="temperature_celsius">
                    T (°C)
                    <input
                        type="number"
                        id="temperature_celsius"
                        name="temperature_celsius"
                        value={formData.temperature_celsius === undefined || formData.temperature_celsius === null ? '' : formData.temperature_celsius}
                        onChange={(e) => handleNumericChange('temperature_celsius', e.target.value)}
                        step="0.1"
                        placeholder="Ej: 38.5"
                    />
                </label>
            </div>
            <div className="grid">
                 <label htmlFor="heart_rate_bpm">
                    FC (L/min)
                    <input
                        type="number"
                        id="heart_rate_bpm"
                        name="heart_rate_bpm"
                        value={formData.heart_rate_bpm === undefined || formData.heart_rate_bpm === null ? '' : formData.heart_rate_bpm}
                        onChange={(e) => handleNumericChange('heart_rate_bpm', e.target.value)}
                        min="0"
                        placeholder="Ej: 120"
                    />
                </label>
                <label htmlFor="respiratory_rate_rpm">
                    FR (R/min)
                    <input
                        type="number"
                        id="respiratory_rate_rpm"
                        name="respiratory_rate_rpm"
                        value={formData.respiratory_rate_rpm === undefined || formData.respiratory_rate_rpm === null ? '' : formData.respiratory_rate_rpm}
                        onChange={(e) => handleNumericChange('respiratory_rate_rpm', e.target.value)}
                        min="0"
                        placeholder="Ej: 20"
                    />
                </label>
            </div>
            <div className="grid">
                <label htmlFor="capillary_refill_time_sec">
                    TRPC (seg) / TLLC (seg)
                    <input
                        type="number"
                        id="capillary_refill_time_sec"
                        name="capillary_refill_time_sec"
                        value={formData.capillary_refill_time_sec === undefined || formData.capillary_refill_time_sec === null ? '' : formData.capillary_refill_time_sec}
                        onChange={(e) => handleNumericChange('capillary_refill_time_sec', e.target.value)}
                        min="0" step="0.1"
                        placeholder="Ej: 1.5"
                    />
                </label>
                <label htmlFor="pulse_description"> {/* Nuevo campo para descripción del pulso */}
                    Pulso (descripción)
                    <input
                        type="text"
                        id="pulse_description"
                        name="pulse_description"
                        value={formData.pulse_description || ''}
                        onChange={handleChange}
                        placeholder="Ej: Fuerte, rítmico"
                    />
                </label>
            </div>
            <div className="grid">
                <label htmlFor="mucous_membranes_description">
                    Mucosas
                    <input
                        type="text"
                        id="mucous_membranes_description"
                        name="mucous_membranes_description"
                        value={formData.mucous_membranes_description || ''}
                        onChange={handleChange}
                        placeholder="Ej: Rosadas, húmedas"
                    />
                </label>
                <label htmlFor="hydration_percentage_description"> {/* Cambiado para ser descripción */}
                    Porcentaje Deshidratación (descripción)
                    <input
                        type="text"
                        id="hydration_percentage_description"
                        name="hydration_percentage_description" // Renombrar en types/schema
                        value={formData.hydration_percentage_description || ''}
                        onChange={handleChange}
                        placeholder="Ej: 5% estimado, leve"
                    />
                </label>
            </div>
             <label htmlFor="sense_organs_description">
                Órganos de los Sentidos (general)
                <textarea
                    id="sense_organs_description"
                    name="sense_organs_description"
                    value={formData.sense_organs_description || ''}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Observaciones generales sobre ojos, oídos, nariz..."
                />
            </label>
            
            {/* Sub-sección: Examen por Sistemas */}
            <h6 style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>Examen por Sistemas:</h6>
            <label htmlFor="skin_and_coat_description">
                Piel y Pelaje
                <textarea id="skin_and_coat_description" name="skin_and_coat_description" value={formData.skin_and_coat_description || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="lymph_nodes_description">
                Ganglios Linfáticos
                <textarea id="lymph_nodes_description" name="lymph_nodes_description" value={formData.lymph_nodes_description || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="digestive_system_findings">
                Sistema Digestivo
                <textarea id="digestive_system_findings" name="digestive_system_findings" value={formData.digestive_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="respiratory_system_findings">
                Sistema Respiratorio
                <textarea id="respiratory_system_findings" name="respiratory_system_findings" value={formData.respiratory_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="endocrine_system_findings">
                Sistema Endocrino
                <textarea id="endocrine_system_findings" name="endocrine_system_findings" value={formData.endocrine_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="musculoskeletal_system_findings">
                Sistema Músculo Esquelético
                <textarea id="musculoskeletal_system_findings" name="musculoskeletal_system_findings" value={formData.musculoskeletal_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="nervous_system_findings">
                Sistema Nervioso
                <textarea id="nervous_system_findings" name="nervous_system_findings" value={formData.nervous_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="urinary_system_findings">
                Sistema Urinario
                <textarea id="urinary_system_findings" name="urinary_system_findings" value={formData.urinary_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="reproductive_system_findings">
                Sistema Reproductivo
                <textarea id="reproductive_system_findings" name="reproductive_system_findings" value={formData.reproductive_system_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="rectal_palpation_findings">
                Palpación Rectal (si aplica)
                <textarea id="rectal_palpation_findings" name="rectal_palpation_findings" value={formData.rectal_palpation_findings || ''} onChange={handleChange} rows={2} />
            </label>
            <label htmlFor="other_physical_findings">
                Otros Hallazgos Físicos
                <textarea id="other_physical_findings" name="other_physical_findings" value={formData.other_physical_findings || ''} onChange={handleChange} rows={2} />
            </label>
        </fieldset>
    );
}