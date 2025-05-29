// src/context/AppContext.tsx

import { PetStorageProvider } from "./PetStorageProvider";
import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { SessionProvider } from "./SessionProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UIProvider>
        <PetStorageProvider>
          <OwnerSessionProvider>
            {children}
          </OwnerSessionProvider>
        </PetStorageProvider>
      </UIProvider>
    </SessionProvider>
  );
}
