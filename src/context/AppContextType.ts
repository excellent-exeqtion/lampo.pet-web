// app/data/context.tsx
import { Pet } from "../repositories";
import { AppSession } from "@/lib/db/types/session";
import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  isMobile: boolean;
  session?: AppSession | null;
  logout: () => object;
  selectedPet?: Pet | null;
  setSelectedPet: Dispatch<SetStateAction<Pet | null>>
}