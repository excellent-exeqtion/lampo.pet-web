// app/data/context.tsx
import { PetCodeType, PetType, VeterinaryAccessType } from "@/types/index";
import { AppSession } from "@/types/lib";

export interface AppContextType {
  isMobile: boolean;
  session: AppSession | null;
  logout: () => object;
  selectedPet: PetType;
  storedPet: PetType;
  setStoredPet: (value: PetType) => void;
  storedVetAccess: VeterinaryAccessType | null;
  setStoredVetAccess: (value: VeterinaryAccessType | null) => void;
  storedPetCode: PetCodeType | null;
  setStoredPetCode: (value: PetCodeType | null) => void;
  storedOwnerPets: PetType[] | null;
  setStoredOwnerPets: (value: PetType[] | null) => void;
}