// app/data/context.tsx
import { PetCodeType, PetType, VeterinaryAccessType } from "@/types/index";
import { AppSession, DisplayPageType } from "@/types/lib";

export interface AppContextType {
  session: AppSession | null;
  didMountRef: DisplayPageType[];
  logout: () => object;
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