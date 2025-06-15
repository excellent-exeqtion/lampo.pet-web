/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/usePetProfileProgress.ts
import { useStorageContext } from "@/context/StorageProvider";
import { PetStep } from "@/types/index";
import { useMemo } from "react";
import { Empty } from "@/data/index";

export function usePetProfileProgress() {
    const {
        storedPet,
        storedBasicData,
        storedVaccineData,
        storedMedicineData,
        storedLabTestData,
        storedConditionData,
        storedSurgeryData,
    } = useStorageContext();

    const progress = useMemo(() => {
        // Función para verificar si un paso está completo (tiene al menos un registro)
        const isStepComplete = (step: PetStep): boolean => {
            switch (step) {
                case PetStep.BasicData:
                    // Consideramos completo si tiene al menos tipo, género y peso.
                    return !!(storedBasicData.pet_type && storedBasicData.gender && storedBasicData.weight !== '0 Kg');
                case PetStep.Vaccines:
                    return (storedVaccineData?.length ?? 0) > 0;
                case PetStep.Medicines:
                    return (storedMedicineData?.length ?? 0) > 0;
                case PetStep.LabTests:
                    return (storedLabTestData?.length ?? 0) > 0;
                case PetStep.Conditions:
                    return (storedConditionData?.length ?? 0) > 0;
                case PetStep.Surgeries:
                    return (storedSurgeryData?.length ?? 0) > 0;
                default:
                    return false;
            }
        };

        // Función para verificar si el perfil principal de la mascota ha sido editado
        const isProfileEdited = (): boolean => {
            if (!storedPet.id) return false;

            // Condición 1: El nombre ha sido cambiado del valor por defecto (si hubiera) o simplemente no está vacío.
            const nameIsSet = !!storedPet.name;

            // Condición 2: La imagen no es la de por defecto.
            const imageIsSet = !!storedPet.image && !storedPet.image.includes('/pets/pet.jpg');

            // Condición 3: La fecha de nacimiento está definida.
            const birthDateIsSet = !!storedPet.birth_date;

            // Condición 4: Los datos básicos no son los iniciales vacíos.
            // Comparamos el objeto actual con un objeto vacío del mismo tipo.
            const emptyBasicData = Empty.BasicData();
            // Eliminamos pet_id para la comparación, ya que siempre estará presente si se ha guardado.
            const { pet_id: _, ...relevantBasicData } = storedBasicData;
            const { pet_id: __, ...emptyRelevantData } = emptyBasicData;
            const basicDataIsEdited = JSON.stringify(relevantBasicData) !== JSON.stringify(emptyRelevantData);

            return nameIsSet || imageIsSet || birthDateIsSet || basicDataIsEdited;
        };

        return {
            petCreated: !!storedPet.id, // Para saber si hay una mascota seleccionada
            profileEdited: isProfileEdited(), // Nuevo flag para saber si se ha editado
            basicData: isStepComplete(PetStep.BasicData),
            vaccines: isStepComplete(PetStep.Vaccines),
            medicines: isStepComplete(PetStep.Medicines),
            labTests: isStepComplete(PetStep.LabTests),
            conditions: isStepComplete(PetStep.Conditions),
            surgeries: isStepComplete(PetStep.Surgeries),
        };
    }, [storedPet, storedBasicData, storedVaccineData, storedMedicineData, storedLabTestData, storedConditionData, storedSurgeryData]);

    return progress;
}