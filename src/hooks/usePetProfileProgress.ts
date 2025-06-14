// src/hooks/usePetProfileProgress.ts
import { useStorageContext } from "@/context/StorageProvider";
import { PetStep } from "@/types/index";
import { useMemo } from "react";

export function usePetProfileProgress() {
    const {
        storedBasicData,
        storedVaccineData,
        storedMedicineData,
        storedLabTestData,
        storedConditionData,
        storedSurgeryData,
    } = useStorageContext();

    const progress = useMemo(() => {
        const isComplete = (step: PetStep): boolean => {
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

        return {
            basicData: isComplete(PetStep.BasicData),
            vaccines: isComplete(PetStep.Vaccines),
            medicines: isComplete(PetStep.Medicines),
            labTests: isComplete(PetStep.LabTests),
            conditions: isComplete(PetStep.Conditions),
            surgeries: isComplete(PetStep.Surgeries),
        };
    }, [storedBasicData, storedVaccineData, storedMedicineData, storedLabTestData, storedConditionData, storedSurgeryData]);

    return progress;
}