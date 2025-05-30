// src/components/forms/consultation/sections/MedicationsSection.tsx
import React from 'react';
import type { ConsultationMedicationType } from '@/types/index';
import { FaPlus, FaTrash } from 'react-icons/fa';

type MedicationFormItem = Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>;

interface MedicationsSectionProps {
    medications: MedicationFormItem[];
    onChange: (updatedMedications: MedicationFormItem[]) => void;
}

export function MedicationsSection({ medications, onChange }: MedicationsSectionProps) {
    const addMedication = () => {
        onChange([...medications, { medication_name: '', dosage: '', frequency: '', duration_days: null, notes: '' }]);
    };

    const removeMedication = (index: number) => {
        onChange(medications.filter((_, i) => i !== index));
    };

    const handleMedicationChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let processedValue: string | number | null = value;
        if (name === "duration_days") {
            processedValue = value === '' ? null : parseInt(value, 10);
            if (isNaN(processedValue as number)) processedValue = null;
        }

        onChange(
            medications.map((med, i) =>
                i === index ? { ...med, [name]: processedValue } : med
            )
        );
    };

    return (
        <fieldset>
            <legend>Medicamentos Administrados/Prescritos en Consulta</legend>
            {medications.map((med, index) => (
                <div key={index} style={{ border: '1px solid #e0e0e0', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <div className="grid">
                        <label htmlFor={`medication_name_${index}`}>
                            Nombre del Medicamento
                            <input
                                type="text"
                                id={`medication_name_${index}`}
                                name="medication_name"
                                value={med.medication_name}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                            />
                        </label>
                        <label htmlFor={`dosage_${index}`}>
                            Dosis
                            <input
                                type="text"
                                id={`dosage_${index}`}
                                name="dosage"
                                value={med.dosage}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                            />
                        </label>
                    </div>
                    <div className="grid">
                        <label htmlFor={`frequency_${index}`}>
                            Frecuencia
                            <input
                                type="text"
                                id={`frequency_${index}`}
                                name="frequency"
                                value={med.frequency}
                                onChange={(e) => handleMedicationChange(index, e)}
                                required
                            />
                        </label>
                        <label htmlFor={`duration_days_${index}`}>
                            Duración (días)
                            <input
                                type="number"
                                id={`duration_days_${index}`}
                                name="duration_days"
                                value={med.duration_days === null || med.duration_days === undefined ? '' : med.duration_days}
                                onChange={(e) => handleMedicationChange(index, e)}
                                min="0"
                            />
                        </label>
                    </div>
                    <label htmlFor={`medication_notes_${index}`}>
                        Notas Adicionales
                        <textarea
                            id={`medication_notes_${index}`}
                            name="notes"
                            value={med.notes || ''}
                            onChange={(e) => handleMedicationChange(index, e)}
                            rows={2}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="secondary outline"
                        style={{ marginTop: '0.5rem', maxWidth: 'fit-content' }}
                        aria-label="Eliminar medicamento"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            <button type="button" onClick={addMedication} className="outline">
                <FaPlus style={{ marginRight: '0.5rem' }} /> Agregar Medicamento
            </button>
        </fieldset>
    );
}