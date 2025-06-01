// hooks/useAppStorage.ts
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PetType, PetCodeType, VeterinaryAccessType, BasicDataType, OwnerDataType, VaccineDataType, ConditionDataType, LabTestDataType, MedicineDataType, SurgeryDataType, VeterinarianType, PlanType } from "@/types/index";
import { Empty } from "@/data/index";
export interface StorageContextType {
  resetSession: () => void;
  resetPet: () => void;
  storedPet: PetType;
  setStoredPet: (value: PetType) => void;
  storedBasicData: BasicDataType;
  setStoredBasicData: (value: BasicDataType) => void;
  storedOwnerData: OwnerDataType;
  setStoredOwnerData: (value: OwnerDataType) => void;
  storedVetData: VeterinarianType;
  setStoredVetData: (value: VeterinarianType) => void;
  storedVetAccess: VeterinaryAccessType;
  setStoredVetAccess: (value: VeterinaryAccessType) => void;
  storedPetCode: PetCodeType;
  setStoredPetCode: (value: PetCodeType) => void;
  storedOwnerPets: PetType[];
  setStoredOwnerPets: (value: PetType[]) => void;
  storedVaccineData: VaccineDataType[],
  setStoredVaccineData: (value: VaccineDataType[] | null) => void,
  storedConditionData: ConditionDataType[],
  setStoredConditionData: (value: ConditionDataType[] | null) => void,
  storedLabTestData: LabTestDataType[],
  setStoredLabTestData: (value: LabTestDataType[] | null) => void,
  storedMedicineData: MedicineDataType[],
  setStoredMedicineData: (value: MedicineDataType[] | null) => void,
  storedSurgeryData: SurgeryDataType[],
  setStoredSurgeryData: (value: SurgeryDataType[] | null) => void,
  storedPlanData: PlanType,
  setStoredPlanData: (value: PlanType | null) => void,
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

  const [storedVaccineData, setStoredVaccineData] = useLocalStorage<VaccineDataType[] | null>(
    "petVaccineData",
    null
  );

  const [storedConditionData, setStoredConditionData] = useLocalStorage<ConditionDataType[] | null>(
    "petConditionData",
    null
  );

  const [storedLabTestData, setStoredLabTestData] = useLocalStorage<LabTestDataType[] | null>(
    "petLabTestData",
    null
  );

  const [storedMedicineData, setStoredMedicineData] = useLocalStorage<MedicineDataType[] | null>(
    "petMedicineData",
    null
  );

  const [storedSurgeryData, setStoredSurgeryData] = useLocalStorage<SurgeryDataType[] | null>(
    "petSurgeryData",
    null
  );

  const [storedVetAccess, setStoredVetAccess] = useLocalStorage<VeterinaryAccessType>(
    "vetAccess",
    Empty.VetAccess()
  );

  const [storedPetCode, setStoredPetCode] = useLocalStorage<PetCodeType>(
    "petCode",
    Empty.PetCode()
  );

  const [storedVetData, setStoredVetData] = useLocalStorage<VeterinarianType>(
    "vetData",
    Empty.VetData()
  );

  const [storedPlanData, setStoredPlanData] = useLocalStorage<PlanType | null>(
    "planType",
    null
  );

  const resetPet = () => {
    setStoredBasicData(Empty.BasicData());
    setStoredConditionData(null);
    setStoredLabTestData(null);
    setStoredMedicineData(null);
    setStoredSurgeryData(null);
    setStoredVaccineData(null);
  }

  const resetSession = () => {
    resetPet();
    setStoredPetCode(Empty.PetCode());
    setStoredVetAccess(Empty.VetAccess());
    setStoredOwnerData(Empty.OwnerData());
    setStoredOwnerPets([]);
    setStoredPet(Empty.Pet());
  }

  return {
    resetSession,
    resetPet,
    storedPet,
    setStoredPet,
    storedBasicData,
    setStoredBasicData,
    storedOwnerData,
    setStoredOwnerData,
    storedVetData,
    setStoredVetData,
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
    storedPlanData, 
    setStoredPlanData
  } as StorageContextType;
}