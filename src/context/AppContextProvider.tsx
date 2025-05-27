// src/context/AppContext.tsx
import { SessionProvider } from "./SessionProvider";
import { PetStorageProvider } from "./PetStorageProvider";
import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <PetStorageProvider>
        <OwnerSessionProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </OwnerSessionProvider>
      </PetStorageProvider>
    </SessionProvider>
  );
}
