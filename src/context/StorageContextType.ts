// src/context/StorageContextType.ts
import { BasicDataType, ConditionDataType, LabTestDataType, MedicineDataType, OwnerDataType, PetCodeType, PetType, SurgeryDataType, VaccineDataType, VeterinaryAccessType } from "@/types/index";
import { Empty } from "../data";

export interface StorageContextType {
    resetPet: () => void;
    storedPet: PetType;
    setStoredPet: (value: PetType) => void;
    storedBasicData: BasicDataType;
    setStoredBasicData: (value: BasicDataType) => void;
    storedOwnerData: OwnerDataType;
    setStoredOwnerData: (value: OwnerDataType) => void;
    storedVetAccess: VeterinaryAccessType;
    setStoredVetAccess: (value: VeterinaryAccessType) => void;
    storedPetCode: PetCodeType;
    setStoredPetCode: (value: PetCodeType) => void;
    storedOwnerPets: PetType[];
    setStoredOwnerPets: (value: PetType[]) => void;
    storedVaccineData: VaccineDataType[],
    setStoredVaccineData: (value: VaccineDataType[]) => void,
    storedConditionData: ConditionDataType[],
    setStoredConditionData: (value: ConditionDataType[]) => void,
    storedLabTestData: LabTestDataType[],
    setStoredLabTestData: (value: LabTestDataType[]) => void,
    storedMedicineData: MedicineDataType[],
    setStoredMedicineData: (value: MedicineDataType[]) => void,
    storedSurgeryData: SurgeryDataType[],
    setStoredSurgeryData: (value: SurgeryDataType[]) => void,
}

export function emptyStorage() {
    return {
        resetPet: () => {},
        storedPet: Empty.Pet(),
        setStoredPet: () => { },
        storedBasicData: Empty.BasicData(),
        setStoredBasicData: () => { },
        storedOwnerData: Empty.OwnerData(),
        setStoredOwnerData: () => { },
        storedVetAccess: Empty.VetAccess(),
        setStoredVetAccess: () => { },
        storedPetCode: Empty.PetCode(),
        setStoredPetCode: () => { },
        storedOwnerPets: [],
        setStoredOwnerPets: () => { },
        storedVaccineData: [],
        setStoredVaccineData: () => { },
        storedConditionData: [],
        setStoredConditionData: () => { },
        storedLabTestData: [],
        setStoredLabTestData: () => { },
        storedMedicineData: [],
        setStoredMedicineData: () => { },
        storedSurgeryData: [],
        setStoredSurgeryData: () => { }
    }
}