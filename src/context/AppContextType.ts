// app/data/context.tsx
import { PetCodeType, PetType, VeterinaryAccess } from "@/types/index";
import { AppSession } from "@/types/lib";

export interface AppContextType {
  isMobile: boolean;
  session: AppSession | null;
  logout: () => object;
  selectedPet: PetType | null;
  storedPet: PetType | null;
  setStoredPet: (value: PetType | null) => void;
  storedVetAccess: VeterinaryAccess | null;
  setStoredVetAccess: (value: VeterinaryAccess | null) => void;
  storedPetCode: PetCodeType | null;
  setStoredPetCode: (value: PetCodeType | null) => void;
  storedOwnerPets: PetType[] | null;
  setStoredOwnerPets: (value: PetType[] | null) => void;
}