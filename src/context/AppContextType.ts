// app/data/context.tsx
import { PetType } from "@/types/index";
import { AppSession } from "@/types/lib";
import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  isMobile: boolean;
  session?: AppSession | null;
  logout: () => object;
  selectedPet?: PetType | null;
  setSelectedPet: Dispatch<SetStateAction<PetType | null>>
  ownerPets?: PetType[] | null;
}