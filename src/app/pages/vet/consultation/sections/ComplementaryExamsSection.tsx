// src/components/forms/consultation/sections/ComplementaryExamsSection.tsx
import React, { useRef } from 'react';
import type { CreateConsultationPayload } from '@/types/index';
import { FaPaperclip, FaTrash } from 'react-icons/fa';

interface ComplementaryExamsSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    stagedFiles: File[];
    onAddFiles: (files: File[]) => void;
    onRemoveFile: (index: number) => void;
}

export function ComplementaryExamsSection({
    formData,
    handleChange,
    stagedFiles,
    onAddFiles,
    onRemoveFile,
}: ComplementaryExamsSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            onAddFiles(newFiles);
            // Reseteamos el input para permitir seleccionar el mismo archivo de nuevo si se elimina
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <fieldset>
            <legend>7. Exámenes Complementarios y Resultados</legend>
            <label htmlFor="complementary_exams_summary">
                Resumen de Exámenes Realizados / Hallazgos Principales (texto)
                <textarea
                    id="complementary_exams_summary"
                    name="complementary_exams_summary"
                    value={formData.complementary_exams_summary || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Ej: Hemograma: Leucocitosis leve. Radiografía abdominal: Sin hallazgos significativos."
                />
            </label>

            <div>
                <h6 style={{ marginTop: '1rem' }}>Archivos Adjuntos (se guardarán al finalizar):</h6>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*,application/pdf"
                />
                <button type="button" onClick={triggerFileInput} className="outline">
                    <FaPaperclip style={{ marginRight: '0.5rem' }} /> Seleccionar Archivos
                </button>

                {stagedFiles.length > 0 && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9em' }}>
                        <p>Archivos en espera para subir:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {stagedFiles.map((file, index) => (
                                <li key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.5rem',
                                    border: '1px solid var(--primary-inverse)',
                                    borderRadius: '4px',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span>{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveFile(index)}
                                        aria-label={`Eliminar ${file.name}`}
                                        className="secondary outline"
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: 'var(--pico-color-red-500)',
                                            padding: '0.25rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </fieldset>
    );
}