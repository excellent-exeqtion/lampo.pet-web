// src/components/consultations/ConsultationDetailView.tsx
"use client";
import React, { useRef, useState, useCallback } from 'react';
import { ConsultationType, ConsultationFileType } from '@/types/index';
import { Dates } from '@/utils/index';
import { FaPaperclip, FaTrash, FaDownload, FaSpinner, FaPlusCircle } from 'react-icons/fa';

interface ConsultationDetailViewProps {
    consultation: ConsultationType;
    currentUserId: string | null;
    onFileAdded: () => void;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES_ARRAY = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp', 'image/gif'];

// Helper para verificar si un valor se considera "con datos"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hasValue = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (typeof value === 'number' && isNaN(value)) return false; // Aunque los nulls numéricos ya se filtran
    return true;
};


export default function ConsultationDetailView({ consultation, currentUserId, onFileAdded }: ConsultationDetailViewProps) {
    const [showAddFile, setShowAddFile] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    // ... (resto del estado y handlers como antes: isUploading, uploadError, fileInputRef, canEditOrAddFiles, handleFileSelect, handleUploadFile, handleDownloadFile, handleDeleteFile)
    const canEditOrAddFiles = consultation.veterinarian_id === currentUserId ||
        (consultation.veterinary_access_id && currentUserId && consultation.veterinarian_id === null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > MAX_FILE_SIZE_BYTES) {
                setUploadError(`El archivo excede ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`);
                setFileToUpload(null);
                return;
            }
            if (!ALLOWED_FILE_TYPES_ARRAY.includes(file.type)) {
                setUploadError(`Tipo de archivo no permitido. Permitidos: ${ALLOWED_FILE_TYPES_ARRAY.join(', ')}`);
                setFileToUpload(null);
                return;
            }
            setFileToUpload(file);
            setUploadError(null);
        }
    };

    const handleUploadFile = async () => {
        if (!fileToUpload || !canEditOrAddFiles) return;
        setIsUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('petId', consultation.pet_id);
        try {
            const response = await fetch(`/api/consultations/${consultation.id}/files`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Error al subir el archivo.');
            }
            alert('Archivo subido exitosamente!');
            setFileToUpload(null);
            setShowAddFile(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            onFileAdded();
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Error desconocido.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadFile = useCallback(async (file: ConsultationFileType) => {
        try {
            const response = await fetch(`/api/consultations/${consultation.id}//files/${file.id}`);
            const result = await response.json();
            if (response.ok && result.success && result.downloadUrl) {
                window.open(result.downloadUrl, '_blank');
            } else {
                throw new Error(result.message || "No se pudo obtener la URL de descarga.");
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error al descargar archivo.");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleDeleteFile = async (fileId: string) => {
        if (!confirm("¿Está seguro de que desea eliminar este archivo? Esta acción no se puede deshacer.")) return;
        try {
            const response = await fetch(`/api/consultations/${consultation.id}//files/${fileId}`, { method: 'DELETE' });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Error eliminando archivo.");
            }
            alert("Archivo eliminado.");
            onFileAdded();
        } catch (err) {
            alert(err instanceof Error ? err.message : "No se pudo eliminar el archivo.");
        }
    };


    const renderField = (label: string, value: string | number | boolean | null | undefined, isTextArea = false) => {
        if (!hasValue(value)) return null; // Usar el helper hasValue
        const displayValue = typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value;
        return (
            <div style={{ marginBottom: '0.8rem', paddingBottom: '0.5rem', borderBottom: '1px dotted var(--primary-inverse)' }}>
                <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.9em' }}>{label}:</strong>
                {isTextArea ? (
                    <p style={{ whiteSpace: 'pre-wrap', margin: '0.25rem 0 0 0' }}>{displayValue}</p>
                ) : (
                    <span style={{ display: 'block', margin: '0.25rem 0 0 0' }}>{displayValue}</span>
                )}
            </div>
        );
    };

    // --- Funciones para determinar si una sección tiene datos ---
    const anamnesisFields = [
        consultation.current_diet, consultation.previous_illnesses, consultation.previous_surgeries,
        consultation.vaccination_history, consultation.last_deworming_product, consultation.recent_treatments,
        consultation.recent_travels, consultation.animal_behavior_owner_description,
        consultation.lives_with_other_animals_details, consultation.sterilized_status, consultation.birth_count
    ];
    const showAnamnesisSection = hasValue(consultation.reason_for_consultation) || anamnesisFields.some(hasValue);

    const physicalExamGeneralFields = [
        consultation.body_condition_score, consultation.temperature_celsius, consultation.heart_rate_bpm,
        consultation.respiratory_rate_rpm, consultation.capillary_refill_time_sec, consultation.pulse_description,
        consultation.mucous_membranes_description, consultation.hydration_percentage_description,
        consultation.sense_organs_description
    ];
    const physicalExamSystemsFields = [
        consultation.skin_and_coat_description, consultation.lymph_nodes_description,
        consultation.digestive_system_findings, consultation.respiratory_system_findings,
        consultation.endocrine_system_findings, consultation.musculoskeletal_system_findings,
        consultation.nervous_system_findings, consultation.urinary_system_findings,
        consultation.reproductive_system_findings, consultation.rectal_palpation_findings,
        consultation.other_physical_findings
    ];
    const showPhysicalExamSection = physicalExamGeneralFields.some(hasValue) || physicalExamSystemsFields.some(hasValue);

    const diagnosticApproachFields = [
        consultation.problem_list, consultation.master_problem_list, consultation.differential_diagnoses
    ];
    const showDiagnosticApproachSection = diagnosticApproachFields.some(hasValue);

    const diagnosisPlanFields = [
        consultation.definitive_diagnosis, consultation.therapeutic_plan, // Presumptive es obligatorio
        consultation.prognosis, consultation.evolution_notes
    ];
    const showDiagnosisPlanSection = hasValue(consultation.presumptive_diagnosis) || hasValue(consultation.therapeutic_plan) || diagnosisPlanFields.some(hasValue);

    const observationsFields = [
        consultation.general_observations, consultation.signature_confirmation
    ];
    const showObservationsSection = observationsFields.some(hasValue);


    return (
        <article className="pico-paper" style={{ padding: '1.5rem', fontSize: '0.95rem' }}>
            {/* Sección de Identificación (siempre visible o con sus propias comprobaciones) */}
            <div className="grid">
                {renderField("Fecha", Dates.format(consultation.consultation_date))}
                {renderField("Hora", consultation.consultation_time)}
            </div>
            <div className="grid">
                {renderField("HC #", consultation.hc_number)}
                {renderField("Institución", consultation.institution_name)}
            </div>
            {(hasValue(consultation.hc_number) || hasValue(consultation.institution_name) || hasValue(consultation.consultation_time)) && <hr />}


            {showAnamnesisSection && (
                <>
                    <h4>Anamnesis</h4>
                    {renderField("Motivo de Consulta", consultation.reason_for_consultation, true)}
                    {renderField("Dieta Actual", consultation.current_diet, true)}
                    {renderField("Enfermedades Previas", consultation.previous_illnesses, true)}
                    {renderField("Cirugías Previas", consultation.previous_surgeries, true)}
                    {renderField("Esquema Vacunal (Resumen)", consultation.vaccination_history, true)}
                    {renderField("Última Desparasitación y Producto", consultation.last_deworming_product)}
                    {renderField("Tratamientos Recientes", consultation.recent_treatments, true)}
                    {renderField("Viajes Recientes", consultation.recent_travels, true)}
                    {renderField("Comportamiento del Animal (descripción del propietario)", consultation.animal_behavior_owner_description, true)}
                    {renderField("Convive con otros animales (detalles)", consultation.lives_with_other_animals_details)}
                    {renderField("Esterilizado", consultation.sterilized_status)}
                    {renderField("N° de Partos", consultation.birth_count)}
                    <hr />
                </>
            )}

            {showPhysicalExamSection && (
                <>
                    <h4>Examen Físico</h4>
                    {physicalExamGeneralFields.some(hasValue) && <h5>General</h5>}
                    {renderField("Condición Corporal (1-5)", consultation.body_condition_score)}
                    {renderField("Temperatura (°C)", consultation.temperature_celsius)}
                    {renderField("Frecuencia Cardíaca (lpm)", consultation.heart_rate_bpm)}
                    {renderField("Frecuencia Respiratoria (rpm)", consultation.respiratory_rate_rpm)}
                    {renderField("TRPC/TLLC (seg)", consultation.capillary_refill_time_sec)}
                    {renderField("Pulso (descripción)", consultation.pulse_description)}
                    {renderField("Mucosas (descripción)", consultation.mucous_membranes_description)}
                    {renderField("Hidratación (descripción)", consultation.hydration_percentage_description)}
                    {renderField("Órganos de los Sentidos (descripción)", consultation.sense_organs_description, true)}

                    {physicalExamSystemsFields.some(hasValue) && <h5 style={{ marginTop: '1rem' }}>Por Sistemas</h5>}
                    {renderField("Piel y Pelaje", consultation.skin_and_coat_description, true)}
                    {renderField("Ganglios Linfáticos", consultation.lymph_nodes_description, true)}
                    {renderField("Sistema Digestivo", consultation.digestive_system_findings, true)}
                    {renderField("Sistema Respiratorio", consultation.respiratory_system_findings, true)}
                    {renderField("Sistema Endocrino", consultation.endocrine_system_findings, true)}
                    {renderField("Sistema Músculo Esquelético", consultation.musculoskeletal_system_findings, true)}
                    {renderField("Sistema Nervioso", consultation.nervous_system_findings, true)}
                    {renderField("Sistema Urinario", consultation.urinary_system_findings, true)}
                    {renderField("Sistema Reproductivo", consultation.reproductive_system_findings, true)}
                    {renderField("Palpación Rectal", consultation.rectal_palpation_findings, true)}
                    {renderField("Otros Hallazgos Físicos", consultation.other_physical_findings, true)}
                    <hr />
                </>
            )}

            {consultation.procedures && consultation.procedures.length > 0 && (
                <>
                    <h4>Procedimientos Realizados en Consulta</h4>
                    {/* ... (código de lista de procedimientos sin cambios) ... */}
                    <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                        {consultation.procedures.map(proc => (
                            <li key={proc.id} style={{ marginBottom: '0.5rem' }}>
                                <strong>{proc.procedure_name}</strong>
                                {proc.description && <p style={{ fontSize: '0.9em', margin: '0.2em 0 0.5em 1em', color: 'var(--muted-color)' }}>{proc.description}</p>}
                            </li>
                        ))}
                    </ul>
                    <hr />
                </>
            )}

            {consultation.medications && consultation.medications.length > 0 && (
                <>
                    <h4>Medicamentos Administrados/Prescritos en Consulta</h4>
                    {/* ... (código de lista de medicamentos sin cambios) ... */}
                    <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                        {consultation.medications.map(med => (
                            <li key={med.id} style={{ marginBottom: '0.5rem' }}>
                                <strong>{med.medication_name}</strong>: {med.dosage} / {med.frequency}
                                {med.duration_days && <span> por {med.duration_days} día(s)</span>}
                                {med.notes && <p style={{ fontSize: '0.9em', margin: '0.2em 0 0.5em 1em', color: 'var(--muted-color)' }}>{med.notes}</p>}
                            </li>
                        ))}
                    </ul>
                    <hr />
                </>
            )}

            {showDiagnosticApproachSection && (
                <>
                    <h4>Abordaje Diagnóstico</h4>
                    {renderField("Lista de Problemas", consultation.problem_list, true)}
                    {renderField("Lista Maestra (Problema Principal)", consultation.master_problem_list, true)}
                    {renderField("Diagnósticos Diferenciales", consultation.differential_diagnoses, true)}
                    <hr />
                </>
            )}

            {/* Sección de Exámenes Complementarios y Archivos */}
            {(hasValue(consultation.complementary_exams_summary) || (consultation.files && consultation.files.length > 0) || canEditOrAddFiles) && (
                <>
                    <h4>Exámenes Complementarios</h4>
                    {renderField("Resumen de Exámenes / Hallazgos Principales", consultation.complementary_exams_summary, true)}

                    {consultation.files && consultation.files.length > 0 && (
                        // ... (código de lista de archivos sin cambios) ...
                        <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                            <h5>Archivos Adjuntos:</h5>
                            {consultation.files.map(file => (
                                <div key={file.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.2rem', borderBottom: '1px solid var(--primary-inverse)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}><FaPaperclip style={{ marginRight: '0.5rem', color: 'var(--muted-color)' }} /> {file.file_name} <small style={{ marginLeft: '0.5rem', color: 'var(--muted-font-color)' }}>({(file.file_size_bytes || 0 / 1024).toFixed(1)}KB)</small></span>
                                    <div>
                                        <button onClick={() => handleDownloadFile(file)} className="outline secondary pico-button-small" aria-label="Descargar" title="Descargar" style={{ marginRight: '0.5rem', padding: '0.3rem 0.6rem' }}>
                                            <FaDownload />
                                        </button>
                                        {canEditOrAddFiles && (
                                            <button onClick={() => handleDeleteFile(file.id)} className="outline contrast pico-button-small" aria-label="Eliminar" title="Eliminar" style={{ padding: '0.3rem 0.6rem' }}>
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {canEditOrAddFiles && (
                        // ... (código para añadir archivo sin cambios) ...
                        <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                            <button type="button" onClick={() => setShowAddFile(prev => !prev)} className="outline pico-button-small">
                                {showAddFile ? 'Cancelar subida' : <><FaPlusCircle style={{ marginRight: '0.5rem' }} /> Adjuntar Nuevo Archivo</>}
                            </button>
                            {showAddFile && (
                                <div style={{ marginTop: '1rem', border: '1px dashed var(--primary)', padding: '1rem', borderRadius: 'var(--pico-border-radius)' }}>
                                    <label htmlFor="file-upload-detail">Seleccionar archivo:</label>
                                    <input id="file-upload-detail" type="file" ref={fileInputRef} onChange={handleFileSelect} accept={ALLOWED_FILE_TYPES_ARRAY.join(',')} />
                                    {fileToUpload && <p style={{ marginTop: '0.5rem', fontSize: '0.85em' }}>Seleccionado: {fileToUpload.name}</p>}
                                    {uploadError && <p className="text-error" style={{ marginTop: '0.5rem' }}>{uploadError}</p>}
                                    <button
                                        onClick={handleUploadFile}
                                        disabled={!fileToUpload || isUploading}
                                        aria-busy={isUploading}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {isUploading ? <><FaSpinner className="animate-spin" /> Subiendo...</> : "Confirmar y Subir Archivo"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <hr />
                </>
            )}


            {showDiagnosisPlanSection && (
                <>
                    <h4>Diagnóstico y Plan</h4>
                    {renderField("Diagnóstico Presuntivo Justificado", consultation.presumptive_diagnosis, true)}
                    {renderField("Diagnóstico Definitivo", consultation.definitive_diagnosis, true)}
                    {renderField("Plan Terapéutico", consultation.therapeutic_plan, true)}
                    {renderField("Pronóstico", consultation.prognosis, true)}
                    {renderField("Evolución", consultation.evolution_notes, true)}
                    <hr />
                </>
            )}

            {showObservationsSection && (
                <>
                    <h4>Observaciones Finales y Profesional</h4>
                    {renderField("Observaciones Generales / Anexos (descripción)", consultation.general_observations, true)}
                    {renderField("Confirmación/Firma Profesional", consultation.signature_confirmation)}
                    {/* {renderField("Veterinario Tratante ID", consultation.veterinarian_id || consultation.veterinary_access_id)} */}
                </>
            )}
        </article>
    );
}