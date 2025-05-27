// src/context/AppContextType.tsx
import { AppSession } from "@/types/lib";
import { StorageContextType } from "./StorageContextType";

export interface AppContextType {
  session: AppSession | null;
  logout: () => object;
  storageContext: StorageContextType;
  showEditPetModal: boolean;
}