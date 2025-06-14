// src/components/forms/consultation/sections/ComplementaryExamsSection.tsx
import React, { useState, useRef, Dispatch, SetStateAction } from 'react';
import type { CreateConsultationPayload } from '@/types/index';
import { FaPaperclip } from 'react-icons/fa';

interface ComplementaryExamsSectionProps {
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    setStagedFiles: Dispatch<SetStateAction<File[]>>;
}

export function ComplementaryExamsSection({
    formData,
    handleChange,
    setStagedFiles,
}: ComplementaryExamsSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localFileNames, setLocalFileNames] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setStagedFiles(prev => [...prev, ...newFiles]);
            setLocalFileNames(prev => [...prev, ...newFiles.map(f => f.name)]);
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
                {localFileNames.length > 0 && (
                    <div style={{ marginTop: '1rem', fontSize: '0.9em' }}>
                        <p>Archivos en espera:</p>
                        <ul>
                            {localFileNames.map((name, index) => <li key={index}>{name}</li>)}
                        </ul>
                    </div>
                )}
            </div>
        </fieldset>
    );
}