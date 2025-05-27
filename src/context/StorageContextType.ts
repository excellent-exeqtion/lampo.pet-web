// src/context/storageType.ts
import { Empty } from "../data";

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