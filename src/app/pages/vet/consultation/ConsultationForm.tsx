// src/components/forms/consultation/ConsultationForm.tsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import type { PetType, CreateConsultationPayload, ConsultationProcedureType, ConsultationMedicationType, BasicDataType, OwnerDataType } from '@/types/index';
// ... (imports de secciones)
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

interface ConsultationFormProps {
    pet: PetType;
    owner: OwnerDataType | null;
    basicData: BasicDataType | null;
    onSubmit: (formData: CreateConsultationPayload) => Promise<void>;
    isSubmitting: boolean;
}

// Usamos forwardRef para exponer la función de subida de archivos
export const ConsultationForm = forwardRef(({ pet, owner, basicData, onSubmit, isSubmitting }: ConsultationFormProps, ref) => {
    const { storedVetAccess } = useStorageContext();

    const [formData, setFormData] = useState<Partial<CreateConsultationPayload>>(() => {
        const today = new Date();
        const initialFormData: Partial<CreateConsultationPayload> = {
            consultation_date: today.toISOString().split('T')[0],
            consultation_time: today.toTimeString().split(' ')[0].substring(0, 5),
            procedures: [],
            medications: [],
            institution_name: '',
            hc_number: '',
            reason_for_consultation: '',
            current_diet: '',
            presumptive_diagnosis: '',
            therapeutic_plan: '',
        };
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
                (initialFormData as any)[field] = null;
            }
        });
        return initialFormData;
    });

    const [stagedFiles, setStagedFiles] = useState<File[]>([]);

    useImperativeHandle(ref, () => ({
        async triggerFileUploads(consultationId: string) {
            if (stagedFiles.length === 0) return;

            const uploadPromises = stagedFiles.map(file => {
                const formDataApi = new FormData();
                formDataApi.append('file', file);
                formDataApi.append('petId', pet.id);
                return fetch(`/api/consultations/${consultationId}/files`, {
                    method: 'POST',
                    body: formDataApi,
                });
            });

            const results = await Promise.allSettled(uploadPromises);

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Error subiendo archivo ${stagedFiles[index].name}:`, result.reason);
                    // Aquí podrías notificar al usuario sobre los archivos que fallaron
                }
            });
            setStagedFiles([]); // Limpiar archivos en espera
        }
    }));


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let processedValue: string | number | boolean | null = value;

        if (type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            if (value === '') {
                processedValue = null;
            } else {
                const num = parseFloat(value);
                processedValue = isNaN(num) ? null : num;
            }
        }
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleNumericChange = (name: keyof CreateConsultationPayload, value: string) => {
        const numValue = value === '' ? null : parseFloat(value);
        setFormData(prev => ({
            ...prev,
            [name]: numValue === null || isNaN(numValue as number) ? null : numValue,
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const handleBasicDataChange = (field: keyof BasicDataType, value: any) => {
        // Esta función podría usarse si actualizamos `basicData` en tiempo real
        // Por simplicidad, el campo de peso lo manejará el `OwnerPetSection` directamente
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.reason_for_consultation || !formData.presumptive_diagnosis || !formData.therapeutic_plan) {
            alert("Por favor, complete todos los campos obligatorios: Motivo de Consulta, Diagnóstico Presuntivo y Plan Terapéutico.");
            return;
        }
        onSubmit(formData as CreateConsultationPayload);
    };

    const handleProceduresChange = (updatedProcedures: Array<Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, procedures: updatedProcedures }));
    };

    const handleMedicationsChange = (updatedMedications: Array<Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, medications: updatedMedications }));
    };

    const [openSection, setOpenSection] = useState<string | null>('identity');

    const handleToggleSection = (event: React.MouseEvent<HTMLElement>, sectionName: string) => {
        event.preventDefault();
        setOpenSection(prevOpenSection => prevOpenSection === sectionName ? null : sectionName);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pico-form" style={{ marginTop: '2rem' }}>
            <details open={openSection === 'identity'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'identity')}>1. Identificación</summary>
                {openSection === 'identity' && <IdentitySection vetData={storedVetAccess} formData={formData} handleChange={handleChange} />}
            </details>

            <details open={openSection === 'ownerPet'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'ownerPet')}>2. Datos Propietario y Reseña Mascota</summary>
                {openSection === 'ownerPet' && <OwnerPetSection owner={owner} pet={pet} basicPetData={basicData} onBasicDataChange={handleBasicDataChange} />}
            </details>

            <details open={openSection === 'anamnesis'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'anamnesis')}>3. Anamnesis</summary>
                {openSection === 'anamnesis' && <AnamnesisSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} basicData={basicData} />}
            </details>

            <details open={openSection === 'physicalExam'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'physicalExam')}>4. Exámenes físicos</summary>
                {openSection === 'physicalExam' && <PhysicalExamSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} />}
            </details>

            <details open={openSection === 'procedures'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'procedures')}>5. Procedimientos en Consulta</summary>
                {openSection === 'procedures' && <ProceduresSection procedures={formData.procedures || []} onChange={handleProceduresChange} />}
            </details>

            <details open={openSection === 'medications'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'medications')}>6. Medicamentos en Consulta</summary>
                {openSection === 'medications' && <MedicationsSection medications={formData.medications || []} onChange={handleMedicationsChange} />}
            </details>

            <details open={openSection === 'diagnosticApproach'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'diagnosticApproach')}>7. Abordaje Diagnóstico</summary>
                {openSection === 'diagnosticApproach' && <DiagnosticApproachSection formData={formData} handleChange={handleChange} />}
            </details>

            <details open={openSection === 'complementaryExams'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'complementaryExams')}>8. Exámenes Complementarios</summary>
                {openSection === 'complementaryExams' && <ComplementaryExamsSection formData={formData} handleChange={handleChange} setStagedFiles={setStagedFiles} />}
            </details>

            <details open={openSection === 'diagnosisPlan'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'diagnosisPlan')}>9. Diagnóstico y Plan</summary>
                {openSection === 'diagnosisPlan' && <DiagnosisPlanSection formData={formData} handleChange={handleChange} />}
            </details>

            <details open={openSection === 'observations'}>
                <summary role="button" className="secondary outline" onClick={(e) => handleToggleSection(e, 'observations')}>10. Observaciones y Profesional</summary>
                {openSection === 'observations' && <ObservationsSignatureSection formData={formData} handleChange={handleChange} vetData={storedVetAccess} />}
            </details>

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} style={{ marginTop: '1.5rem' }}>
                {isSubmitting ? 'Guardando...' : 'Guardar Consulta'}
            </button>
        </form>
    );
});

ConsultationForm.displayName = "ConsultationForm";