// app/data/context.tsx
import { Session } from "@supabase/supabase-js";
import { Pet } from ".";
import { Dispatch, SetStateAction } from "react";

export interface AppContextType {
  isMobile: boolean;
  session?: Session | null;
  logout: () => object;
  selectedPet?: Pet | null;
  setSelectedPet: Dispatch<SetStateAction<Pet | null>>
}