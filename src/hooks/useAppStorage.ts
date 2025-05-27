// hooks/useAppStorage.ts
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PetType, PetCodeType, VeterinaryAccessType, BasicDataType, OwnerDataType, VaccineDataType, ConditionDataType, LabTestDataType, MedicineDataType, SurgeryDataType } from "@/types/index";
import { Empty } from "@/data/index";
import { StorageContextType } from "@/context/StorageContextType";

export function useAppStorage() {
  const [storedPet, setStoredPet] = useLocalStorage<PetType>(
    "selectedPet",
    Empty.Pet()
  );

  const [storedBasicData, setStoredBasicData] = useLocalStorage<BasicDataType>(
    "petBasicData",
    Empty.BasicData()
  );

  const [storedOwnerData, setStoredOwnerData] = useLocalStorage<OwnerDataType>(
    "petOwnerData",
    Empty.OwnerData()
  );

  const [storedOwnerPets, setStoredOwnerPets] = useLocalStorage<PetType[]>(
    "ownerPets",
    []
  );

  const [storedVaccineData, setStoredVaccineData] = useLocalStorage<VaccineDataType[]>(
    "petVaccineData",
    []
  );

  const [storedConditionData, setStoredConditionData] = useLocalStorage<ConditionDataType[]>(
    "petConditionData",
    []
  );
  
  const [storedLabTestData, setStoredLabTestData] = useLocalStorage<LabTestDataType[]>(
    "petLabTestData",
    []
  );
  
  const [storedMedicineData, setStoredMedicineData] = useLocalStorage<MedicineDataType[]>(
    "petMedicineData",
    []
  );
  
  const [storedSurgeryData, setStoredSurgeryData] = useLocalStorage<SurgeryDataType[]>(
    "petSurgeryData",
    []
  );

  const [storedVetAccess, setStoredVetAccess] = useLocalStorage<VeterinaryAccessType>(
    "vetAccess",
    Empty.VetAccess()
  );

  const [storedPetCode, setStoredPetCode] = useLocalStorage<PetCodeType>(
    "petCode",
    Empty.PetCode()
  );

  const resetPet = () => {
    setStoredBasicData(Empty.BasicData());
    setStoredConditionData([]);
    setStoredLabTestData([]);
    setStoredMedicineData([]);
    setStoredSurgeryData([]);
    setStoredVaccineData([]);
  }

  return {
    resetPet,
    storedPet,
    setStoredPet,
    storedBasicData,
    setStoredBasicData,
    storedOwnerData, 
    setStoredOwnerData,
    storedOwnerPets,
    setStoredOwnerPets,
    storedVaccineData,
    setStoredVaccineData,
    storedConditionData,
    setStoredConditionData,
    storedLabTestData,
    setStoredLabTestData,
    storedMedicineData,
    setStoredMedicineData,
    storedSurgeryData,
    setStoredSurgeryData,
    storedVetAccess,
    setStoredVetAccess,
    storedPetCode,
    setStoredPetCode,
  } as StorageContextType;
}