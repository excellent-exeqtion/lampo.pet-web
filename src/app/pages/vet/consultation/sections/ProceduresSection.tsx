// src/components/forms/consultation/sections/ProceduresSection.tsx
import React from 'react';
import type { ConsultationProcedureType } from '@/types/index'; // Usaremos el tipo base
import { FaPlus, FaTrash } from 'react-icons/fa';

// El tipo para el formulario interno, sin los campos generados por BD
type ProcedureFormItem = Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>;

interface ProceduresSectionProps {
    procedures: ProcedureFormItem[];
    onChange: (updatedProcedures: ProcedureFormItem[]) => void;
}

export function ProceduresSection({ procedures, onChange }: ProceduresSectionProps) {
    const addProcedure = () => {
        onChange([...procedures, { procedure_name: '', description: '' }]);
    };

    const removeProcedure = (index: number) => {
        const updated = procedures.filter((_, i) => i !== index);
        onChange(updated);
    };

    const handleProcedureChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const updated = procedures.map((proc, i) =>
            i === index ? { ...proc, [name]: value } : proc
        );
        onChange(updated);
    };

    return (
        <fieldset>
            <legend>Procedimientos Realizados en Consulta</legend>
            {procedures.map((proc, index) => (
                <div key={index} className="grid" style={{ alignItems: 'flex-end', marginBottom: '1rem', border: '1px solid var(--primary-inverse)', padding: '1rem', borderRadius: '4px' }}>
                    <label htmlFor={`procedure_name_${index}`}>
                        Nombre del Procedimiento
                        <input
                            type="text"
                            id={`procedure_name_${index}`}
                            name="procedure_name"
                            value={proc.procedure_name}
                            onChange={(e) => handleProcedureChange(index, e)}
                            placeholder="Ej: Limpieza de oídos"
                            required
                        />
                    </label>
                    <label htmlFor={`procedure_description_${index}`} className="pico-col-span-2"> {/* Ocupa más espacio si es necesario */}
                        Descripción/Notas
                        <textarea
                            id={`procedure_description_${index}`}
                            name="description"
                            value={proc.description || ''}
                            onChange={(e) => handleProcedureChange(index, e)}
                            rows={2}
                        />
                    </label>
                    <button
                        type="button"
                        onClick={() => removeProcedure(index)}
                        className="secondary outline"
                        style={{ maxWidth: 'fit-content', marginBottom: '0.5rem' }} // PicoCSS a veces necesita ajustes para botones pequeños
                        aria-label="Eliminar procedimiento"
                    >
                        <FaTrash />
                    </button>
                </div>
            ))}
            <button type="button" onClick={addProcedure} className="outline">
                <FaPlus style={{ marginRight: '0.5rem' }} /> Agregar Procedimiento
            </button>
        </fieldset>
    );
}