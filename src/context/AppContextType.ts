// app/data/context.tsx
import { PetType } from "@/types/index";
import { AppSession } from "@/types/lib";

export interface AppContextType {
  isMobile: boolean;
  session?: AppSession | null;
  logout: () => object;
  selectedPet?: PetType | null;
  setStoredPetId: (value: string | null) => void
  ownerPets?: PetType[] | null;
}