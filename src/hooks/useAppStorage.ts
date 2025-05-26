// hooks/useAppStorage.ts
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PetType, PetCodeType, VeterinaryAccessType } from "@/types/index";
import { Empty } from "@/data/index";

export function useAppStorage() {
  const [storedPet, setStoredPet] = useLocalStorage<PetType>(
    "selectedPet",
    Empty.Pet()
  );

  const [storedOwnerPets, setStoredOwnerPets] = useLocalStorage<PetType[]>(
    "ownerPets",
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

  return {
    storedPet,
    setStoredPet,
    storedOwnerPets,
    setStoredOwnerPets,
    storedVetAccess,
    setStoredVetAccess,
    storedPetCode,
    setStoredPetCode,
  };
}