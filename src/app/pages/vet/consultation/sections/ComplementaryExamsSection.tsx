// src/components/forms/consultation/sections/ComplementaryExamsSection.tsx
import React, { useState, useRef } from 'react';
import type { CreateConsultationPayload, ConsultationFileType } from '@/types/index';
import { FaUpload, FaPaperclip, FaSpinner } from 'react-icons/fa';
import { FileUploadItem } from '../FileUploadItem';

interface ComplementaryExamsSectionProps {
    petId: string; // Necesario para la ruta de subida de archivos
    consultationId: string; // Será vacío inicialmente, se usa si se edita o se sube post-creación
    formData: Partial<CreateConsultationPayload>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onFilesUpdate: (newFiles: ConsultationFileType[]) => void; // Para notificar al form padre
}

export function ComplementaryExamsSection({
    petId,
    consultationId, // Puede ser un ID temporal o se actualiza post-guardado
    formData,
    handleChange,
    onFilesUpdate,
}: ComplementaryExamsSectionProps) {
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean[]>([]); // Para rastrear estado de subida por archivo
    const [uploadedServerFiles, setUploadedServerFiles] = useState<ConsultationFileType[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setLocalFiles(prev => [...prev, ...newFiles]);
            setUploading(prev => [...prev, ...newFiles.map(() => false)]); // Inicializar estado de subida
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Simulación de subida. En una app real, llamarías a tu API.
    const handleUploadFile = async (file: File, index: number) => {
        if (!consultationId && !confirm("El ID de consulta aún no está disponible. ¿Desea subir el archivo ahora? Se asociará una vez guarde la consulta.")) {
            // O podrías bloquear la subida hasta tener consultationId
            // return;
        }
        setUploading(prev => prev.map((u, i) => i === index ? true : u));
        setUploadError(null);

        const formDataApi = new FormData();
        formDataApi.append('file', file);
        formDataApi.append('petId', petId);
        // Si tuvieras un consultationId ya, lo enviarías aquí:
        // formDataApi.append('consultationId', consultationId);


        try {
            // Si no hay consultationId real aún, podrías subir a una "staging area"
            // o simplemente no crear el registro en `consultation_files` hasta después.
            // Por ahora, simularemos que la API puede manejarlo o que se requiere `consultationId`.
            // La API `/api/consultations/[consultationId]/files` espera un `consultationId` en la URL.
            // Esto implica que el `consultationId` debe existir.

            // Para este ejemplo, asumiremos que el `consultationId` es necesario.
            // En un flujo real, podrías:
            // 1. Guardar la consulta -> obtener ID -> luego permitir subir archivos.
            // 2. Subir archivos a un ID temporal/staging -> guardar consulta -> asociar archivos.

            // Si `consultationId` es una cadena vacía, la API fallará.
            // Esto es un punto a mejorar en el flujo general de la aplicación.
            if (!consultationId) {
                throw new Error("Se requiere un ID de consulta para subir archivos. Guarde la consulta primero.");
            }


            const response = await fetch(`/api/consultations/${consultationId}/files`, {
                method: 'POST',
                body: formDataApi,
                // No set Content-Type, el browser lo hace por FormData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || `Error subiendo ${file.name}`);
            }

            setUploadedServerFiles(prev => [...prev, result.file as ConsultationFileType]);
            onFilesUpdate([result.file as ConsultationFileType]); // Notificar al padre
            setLocalFiles(prev => prev.filter((_, i) => i !== index)); // Remover de la lista local si tuvo éxito

        } catch (err) {
            console.error("Upload error:", err);
            setUploadError(err instanceof Error ? err.message : "Error desconocido.");
        } finally {
            setUploading(prev => prev.map((u, i) => i === index ? false : u));
        }
    };

    const removeUploadedFile = async (fileToRemove: ConsultationFileType) => {
        if (!fileToRemove.id) return;
        // Lógica para llamar a la API DELETE /api/consultations/files/[fileId]
        try {
            const response = await fetch(`/api/consultations/${consultationId}/files/${fileToRemove.id}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Error eliminando archivo del servidor.");
            }
            setUploadedServerFiles(prev => prev.filter(f => f.id !== fileToRemove.id));
            onFilesUpdate(uploadedServerFiles.filter(f => f.id !== fileToRemove.id)); // Notificar al padre
        } catch (err) {
            console.error("Error deleting file:", err);
            alert(err instanceof Error ? err.message : "No se pudo eliminar el archivo.");
        }
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
                <h6 style={{ marginTop: '1rem' }}>Archivos Adjuntos:</h6>
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

                {uploadError && <p className="text-error" style={{ marginTop: '0.5rem' }}>{uploadError}</p>}

                {/* Lista de archivos locales pendientes de subir */}
                {localFiles.length > 0 && (
                    <div style={{ marginTop: '1rem', border: '1px dashed var(--primary-lightgray)', padding: '1rem' }}>
                        <p>Archivos listos para subir:</p>
                        <ul>
                            {localFiles.map((file, index) => (
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                                    <button
                                        type="button"
                                        onClick={() => handleUploadFile(file, index)}
                                        disabled={uploading[index]}
                                        className="secondary outline"
                                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                                    >
                                        {uploading[index] ? <FaSpinner className="animate-spin" /> : <FaUpload />} Subir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Lista de archivos ya subidos al servidor */}
                {uploadedServerFiles.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                        <p>Archivos adjuntados:</p>
                        {uploadedServerFiles.map(file => (
                            <FileUploadItem key={file.id} file={file} onDelete={() => removeUploadedFile(file)} />
                        ))}
                    </div>
                )}
            </div>
        </fieldset>
    );
}