// src/context/AppContext.tsx

import { StorageProvider } from "./StorageProvider";
import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { SessionProvider } from "./SessionProvider";
import { RoleProvider } from "./RoleProvider";
import { VetProvider } from "./VetContext";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UIProvider>
        <StorageProvider>
          <RoleProvider>
            <OwnerSessionProvider>
              <VetProvider>
                {children}
              </VetProvider>
            </OwnerSessionProvider>
          </RoleProvider>
        </StorageProvider>
      </UIProvider>
    </SessionProvider>
  );
}
