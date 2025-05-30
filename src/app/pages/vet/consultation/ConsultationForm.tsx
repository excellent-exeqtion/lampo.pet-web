// src/components/forms/consultation/ConsultationForm.tsx
import React, { useState } from 'react';
import type { PetType, CreateConsultationPayload, ConsultationProcedureType, ConsultationMedicationType, ConsultationFileType } from '@/types/index';

import { useStorageContext } from '@/context/StorageProvider';
import { useVetContext } from '@/context/VetContext';
import { IdentitySection, OwnerPetSection, AnamnesisSection, PhysicalExamSection, ProceduresSection, MedicationsSection, DiagnosticApproachSection, ComplementaryExamsSection, DiagnosisPlanSection, ObservationsSignatureSection } from './sections';

interface ConsultationFormProps {
    pet: PetType;
    onSubmit: (formData: CreateConsultationPayload) => Promise<void>;
    isSubmitting: boolean;
    // initialData?: Partial<CreateConsultationPayload>; // Para editar en el futuro
}

export function ConsultationForm({ pet, onSubmit, isSubmitting }: ConsultationFormProps) {
    const { storedOwnerData } = useStorageContext(); // Para mostrar datos del dueño
    const { vet: veterinarianProfessionalData } = useVetContext(); // Para mostrar datos del vet

    const [formData, setFormData] = useState<Partial<CreateConsultationPayload>>(() => {
        const today = new Date();
        return {
            consultation_date: today.toISOString().split('T')[0], // Fecha de hoy por defecto
            consultation_time: today.toTimeString().split(' ')[0].substring(0, 5), // Hora actual por defecto
            // Valores iniciales para procedimientos y medicamentos como arrays vacíos
            procedures: [],
            medications: [],
        };
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [uploadedFiles, setUploadedFiles] = useState<ConsultationFileType[]>([]); // Para manejar archivos subidos

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        section?: keyof CreateConsultationPayload // Para campos anidados si es necesario
    ) => {
        const { name, value, type } = e.target;

        let processedValue: string | number | boolean = value;
        if (type === 'checkbox') {
            processedValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            processedValue = parseFloat(value);
            if (isNaN(processedValue)) processedValue = ''; // Evitar NaN en el estado
        }

        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...(prev[section] as object || {}),
                    [name]: processedValue,
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }
    };

    const handleNumericChange = (name: keyof CreateConsultationPayload, value: string) => {
        const numValue = value === '' ? null : parseFloat(value); // Permitir campo vacío o convertir a número
        setFormData(prev => ({
            ...prev,
            [name]: numValue === null || isNaN(numValue as number) ? undefined : numValue,
        }));
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí podrías añadir validación del lado del cliente antes de enviar
        // Aunque la validación principal estará en el backend con Zod.

        // Asegurarse de que los campos numéricos vacíos se envíen como null o undefined
        const cleanedFormData = { ...formData };
        (Object.keys(cleanedFormData) as Array<keyof CreateConsultationPayload>).forEach(key => {
            if (typeof cleanedFormData[key] === 'number' && isNaN(cleanedFormData[key] as number)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (cleanedFormData as any)[key] = undefined;
            }
        });

        // TODO: Integrar los archivos subidos.
        // Si la subida se hace ANTES de enviar este formulario, aquí deberías tener
        // las URLs o IDs de los archivos para incluirlos en el payload.
        // Si la subida es DESPUÉS, esta función onSubmit solo enviaría los datos textuales,
        // y la página `ConsultationPage` orquestaría la subida de archivos después.
        // Por ahora, asumimos que `CreateConsultationPayload` no lleva directamente los `File` objects.

        onSubmit(cleanedFormData as CreateConsultationPayload);
    };

    // Handlers para procedimientos y medicamentos
    const handleProceduresChange = (updatedProcedures: Array<Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, procedures: updatedProcedures }));
    };

    const handleMedicationsChange = (updatedMedications: Array<Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>>) => {
        setFormData(prev => ({ ...prev, medications: updatedMedications }));
    };

    const handleFilesUpdate = (newFiles: ConsultationFileType[]) => {
        setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);
        // Aquí podrías también actualizar formData si necesitas referenciar los archivos
        // en el payload principal de la consulta, aunque es más común asociarlos por ID.
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-8 pico-form" style={{ marginTop: '2rem' }}>
            {/* 
                Pasar handleChange, formData y pet a cada sección.
                Algunas secciones podrían necesitar datos adicionales como ownerData.
            */}
            <IdentitySection formData={formData} handleChange={handleChange} />
            <OwnerPetSection owner={storedOwnerData} pet={pet} /> {/* Datos de solo lectura */}
            <AnamnesisSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} />
            <PhysicalExamSection formData={formData} handleChange={handleChange} handleNumericChange={handleNumericChange} />

            <ProceduresSection
                procedures={formData.procedures || []}
                onChange={handleProceduresChange}
            />
            <MedicationsSection
                medications={formData.medications || []}
                onChange={handleMedicationsChange}
            />

            <DiagnosticApproachSection formData={formData} handleChange={handleChange} />

            <ComplementaryExamsSection
                petId={pet.id} // Necesario para la subida de archivos
                consultationId={""} // Se necesitará el ID de la consulta si se suben archivos *después* de crearla.
                // O se suben a un ID temporal y se asocian luego.
                // Por ahora, el componente de subida será independiente.
                onFilesUpdate={handleFilesUpdate} // Para que el form sepa de los archivos
                formData={formData}
                handleChange={handleChange}
            />

            <DiagnosisPlanSection formData={formData} handleChange={handleChange} />
            <ObservationsSignatureSection
                formData={formData}
                handleChange={handleChange}
                professionalName={veterinarianProfessionalData ? `${veterinarianProfessionalData.first_name} ${veterinarianProfessionalData.last_name}` : "N/A"}
                professionalRegistration={veterinarianProfessionalData?.registration || "N/A"}
            />

            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                {isSubmitting ? 'Guardando Consulta...' : 'Guardar Consulta'}
            </button>
        </form>
    );
}