// src/components/forms/consultation/ConsultationForm.tsx
import React, { useState } from 'react';
import type { PetType, CreateConsultationPayload, ConsultationProcedureType, ConsultationMedicationType, ConsultationFileType } from '@/types/index';
// import { Empty } from '@/data/index'; // Ya no se usa directamente aquí para inicializar

import { IdentitySection } from './sections/IdentitySection';
import { OwnerPetSection } from './sections/OwnerPetSection';
import { AnamnesisSection } from './sections/AnamnesisSection';
import { PhysicalExamSection } from './sections/PhysicalExamSection';
import { DiagnosticApproachSection } from './sections/DiagnosticApproachSection';
import { ComplementaryExamsSection } from './sections/ComplementaryExamsSection';
import { DiagnosisPlanSection } from './sections/DiagnosisPlanSection';
import { ProceduresSection } from './sections/ProceduresSection';
import { MedicationsSection } from './sections/MedicationsSection';
import { ObservationsSignatureSection } from './sections/ObservationsSignatureSection';
import { useStorageContext } from '@/context/StorageProvider';
import { useVetContext } from '@/context/VetContext';

interface ConsultationFormProps {
    pet: PetType;
    onSubmit: (formData: CreateConsultationPayload) => Promise<void>;
    isSubmitting: boolean;
}

export function ConsultationForm({ pet, onSubmit, isSubmitting }: ConsultationFormProps) {
    const { storedOwnerData } = useStorageContext();
    const { vet: veterinarianProfessionalData } = useVetContext();

    const [formData, setFormData] = useState<Partial<CreateConsultationPayload>>(() => {
        const today = new Date();
        const initialFormData: Partial<CreateConsultationPayload> = {
            consultation_date: today.toISOString().split('T')[0],
            consultation_time: today.toTimeString().split(' ')[0].substring(0, 5),
            procedures: [],
            medications: [],
            // Inicializar otros campos como null o string vacío según corresponda
            // para evitar que sean 'undefined' si el componente de sección espera un valor controlado.
            institution_name: '',
            hc_number: '',
            reason_for_consultation: '', // Campo requerido
            current_diet: '',
            // ... (inicializa todos los demás campos que usan los componentes de sección)
            presumptive_diagnosis: '', // Campo requerido
            therapeutic_plan: '',    // Campo requerido
            // ...etc.
        };
        // Inicializar todos los campos esperados por las secciones para evitar errores de "uncontrolled to controlled"
        const allExpectedFields: Array<keyof CreateConsultationPayload> = [
            'institution_name', 'hc_number', 'consultation_date', 'consultation_time',
            'reason_for_consultation', 'current_diet', 'previous_illnesses', 'previous_surgeries',
            'vaccination_history', 'last_deworming_product', 'recent_treatments', 'recent_travels',
            'animal_behavior_owner_description', 'lives_with_other_animals_details', 'sterilized_status',
            'birth_count', 'body_condition_score', 'temperature_celsius', 'heart_rate_bpm',
            'respiratory_rate_rpm', 'capillary_refill_time_sec', 'pulse_description',
            'mucous_membranes_description', 'hydration_percentage_description', 'sense_organs_description',
            'skin_and_coat_description', 'lymph_nodes_description', 'digestive_system_findings',
            'respiratory_system_findings', 'endocrine_system_findings', 'musculoskeletal_system_findings',
            'nervous_system_findings', 'urinary_system_findings', 'reproductive_system_findings',
            'rectal_palpation_findings', 'other_physical_findings', 'problem_list',
            'master_problem_list', 'differential_diagnoses', 'complementary_exams_summary',
            'presumptive_diagnosis', 'definitive_diagnosis', 'therapeutic_plan', 'prognosis',
            'evolution_notes', 'general_observations', 'signature_confirmation'
        ];

        allExpectedFields.forEach(field => {
            if (!(field in initialFormData)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (initialFormData as any)[field] = null; // o '' según el tipo esperado por el input
            }
        });
        return initialFormData;
    });

    const [uploadedFiles, setUploadedFiles] = useState<ConsultationFileType[]>([]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | boolean | null = value;

        if (type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            if (value === '') {
                processedValue = null; // Enviar null si el campo numérico está vacío
            } else {
                const num = parseFloat(value);
                processedValue = isNaN(num) ? null : num; // null si no es un número válido
            }
        }
        // Para inputs de fecha y tiempo, el valor ya es un string en el formato correcto

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleNumericChange = (name: keyof CreateConsultationPayload, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        setFormData(prev => ({
            ...prev,
            [name]: numValue === null || isNaN(numValue as number) ? null : numValue,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalPayload = { ...formData };
        // Asegurarse de que los campos requeridos tengan valor
        if (!finalPayload.reason_for_consultation || !finalPayload.presumptive_diagnosis || !finalPayload.therapeutic_plan) {
            alert("Por favor, complete todos los campos obligatorios: Motivo de Consulta, Diagnóstico Presuntivo y Plan Terapéutico.");
            return;
        }
        onSubmit(finalPayload as CreateConsultationPayload);
    };

    const handleProceduresChange = (updatedProcedures: Array<Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, procedures: updatedProcedures }));
    };

    const handleMedicationsChange = (updatedMedications: Array<Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, medications: updatedMedications }));
    };

    const handleFilesUpdate = (newFiles: ConsultationFileType[]) => {
        // Esta función podría no ser necesaria si los archivos se manejan enteramente
        // dentro de ComplementaryExamsSection hasta el momento del submit general,
        // o si la subida ocurre después de crear la consulta.
        // Por ahora, actualizamos un estado local si es necesario.
        setUploadedFiles(prevFiles => {
            const updated = [...prevFiles];
            newFiles.forEach(nf => {
                if (!updated.find(ef => ef.id === nf.id)) {
                    updated.push(nf);
                }
            });
            return updated;
        });
    };

    const handleToggleSection = (event: React.MouseEvent<HTMLElement>, sectionName: string) => {
        event.preventDefault(); // Prevenir el toggle nativo del <details>
        setOpenSection(prevOpenSection =>
            prevOpenSection === sectionName ? null : sectionName
        );
    };

    // Para controlar qué sección está abierta por defecto (opcional)
    const [openSection, setOpenSection] = useState<string | null>('identity'); // Abre la primera por defecto

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pico-form" style={{ marginTop: '2rem' }}>

            <details open={openSection === 'identity'}>
                <summary
                    role="button"
                    className="secondary outline"
                    onClick={(e) => handleToggleSection(e, 'identity')}
                >
                    1. Identificación
                </summary>
                {openSection === 'identity' && ( // Renderizar contenido solo si está abierto
                    <IdentitySection formData={formData} handleChange={handleChange} />
                )}
            </details>

            <details open={openSection === 'ownerPet'}>
                <summary
                    role="button"
                    className="secondary outline"
                    onClick={(e) => handleToggleSection(e, 'ownerPet')}
                >
                    2. Datos Propietario y Reseña Mascota
                </summary>
                {openSection === 'ownerPet' && (
                    <OwnerPetSection owner={storedOwnerData} pet={pet} />
                )}
            </details>

            {/* Repetir el patrón para todas las demás secciones */}
            {/* Ejemplo para Anamnesis: */}
            <details open={openSection === 'anamnesis'}>
                <summary
                    role="button"
                    className="secondary outline"
                    onClick={(e) => handleToggleSection(e, 'anamnesis')}
                >
                    3. Anamnesis
                </summary>
                {openSection === 'anamnesis' && (
                    <AnamnesisSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} />
                )}
            </details>


            <details open={openSection === 'physicalExam'}>
                <summary
                    role="button"
                    className="secondary outline"
                    onClick={(e) => handleToggleSection(e, 'physicalExam')}
                >
                    4. Exámenes físicos
                </summary>
                <PhysicalExamSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} />
            </details>

            <details open={openSection === 'procedures'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'procedures')}>
                    5. Procedimientos en Consulta
                </summary>
                {openSection === 'procedures' && (
                    <ProceduresSection procedures={formData.procedures || []} onChange={handleProceduresChange} />
                )}
            </details>

            <details open={openSection === 'medications'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'medications')}>
                    6. Medicamentos en Consulta
                </summary>
                {openSection === 'medications' && (
                    <MedicationsSection medications={formData.medications || []} onChange={handleMedicationsChange} />
                )}
            </details>

            <details open={openSection === 'diagnosticApproach'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'diagnosticApproach')}>
                    7. Abordaje Diagnóstico
                </summary>
                {openSection === 'diagnosticApproach' && (
                    <DiagnosticApproachSection formData={formData} handleChange={handleChange} />
                )}
            </details>

            <details open={openSection === 'complementaryExams'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'complementaryExams')}>
                    8. Exámenes Complementarios
                </summary>
                {openSection === 'complementaryExams' && (
                    <ComplementaryExamsSection
                        petId={pet.id}
                        consultationId={""}
                        formData={formData}
                        handleChange={handleChange}
                        onFilesUpdate={handleFilesUpdate} />
                )}
                {uploadedFiles.length > 0 && (
                    <p>Archivos adjuntos: {uploadedFiles.length}</p>
                )}
            </details>

            <details open={openSection === 'diagnosisPlan'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'diagnosisPlan')}>
                    9. Diagnóstico y Plan
                </summary>
                {openSection === 'diagnosisPlan' && (
                    <DiagnosisPlanSection formData={formData} handleChange={handleChange} />
                )}
            </details>

            <details open={openSection === 'observations'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'observations')}>
                    10. Observaciones y Profesional
                </summary>
                {openSection === 'observations' && (
                    <ObservationsSignatureSection
                        formData={formData}
                        handleChange={handleChange}
                        professionalName={veterinarianProfessionalData ? `${veterinarianProfessionalData.first_name} ${veterinarianProfessionalData.last_name}` : "N/A"}
                        professionalRegistration={veterinarianProfessionalData?.registration || "N/A"}
                    />
                )}
            </details>


            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} style={{ marginTop: '1.5rem' }}>
                {isSubmitting ? 'Guardando Consulta...' : 'Guardar Consulta'}
            </button>
        </form>
    );
}