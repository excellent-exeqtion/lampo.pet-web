// src/context/AppContext.tsx

import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { VetProvider } from "./VetContext";
import { RoleProvider } from "./RoleProvider";
import { StorageProvider } from "./StorageProvider";
import { PlanProvider } from "./PlanProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <StorageProvider>
      <RoleProvider>
        <UIProvider>
          <PlanProvider>
            <OwnerSessionProvider>
              <VetProvider>
                {children}
              </VetProvider>
            </OwnerSessionProvider>
          </PlanProvider>
        </UIProvider>
      </RoleProvider>
    </StorageProvider>
  );
}
