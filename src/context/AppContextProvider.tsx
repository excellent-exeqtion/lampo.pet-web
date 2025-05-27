// src/context/AppContext.tsx
import { SessionProvider } from "./SessionProvider";
import { PetStorageProvider } from "./PetStorageProvider";
import { UIProvider } from "./UIProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PetStorageProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </PetStorageProvider>
    </SessionProvider>
  );
}
