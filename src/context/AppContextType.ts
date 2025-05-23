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
  storedVetAccess: VeterinaryAccessType;
  setStoredVetAccess: (value: VeterinaryAccessType) => void;
  storedPetCode: PetCodeType;
  setStoredPetCode: (value: PetCodeType) => void;
  storedOwnerPets: PetType[];
  setStoredOwnerPets: (value: PetType[]) => void;
  showEditPetModal: boolean;
}