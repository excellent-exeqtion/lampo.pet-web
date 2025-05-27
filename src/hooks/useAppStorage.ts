// hooks/useAppStorage.ts
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PetType, PetCodeType, VeterinaryAccessType, BasicDataType, OwnerDataType, VaccineDataType, ConditionDataType, LabTestDataType, MedicineDataType, SurgeryDataType } from "@/types/index";
import { Empty } from "@/data/index";
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