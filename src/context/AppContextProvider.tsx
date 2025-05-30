// src/context/AppContext.tsx

import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { VetProvider } from "./VetContext";
import { RoleProvider } from "./RoleProvider";
import { SessionProvider } from "./SessionProvider";
import { StorageProvider } from "./StorageProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StorageProvider>
        <RoleProvider>
          <UIProvider>
            <OwnerSessionProvider>
              <VetProvider>
                {children}
              </VetProvider>
            </OwnerSessionProvider>
          </UIProvider>
        </RoleProvider>
      </StorageProvider>
    </SessionProvider>
  );
}
