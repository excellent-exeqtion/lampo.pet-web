// src/context/AppContext.tsx

import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { PlanProvider } from "./PlanProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { StorageProvider } from "@/context/StorageProvider";
import { RoleProvider } from "@/context/RoleProvider";
import { VetProvider } from "@/context/VetContext";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
      <SessionProvider>
        <StorageProvider>
          <RoleProvider>
            <VetProvider>
              <UIProvider>
                <PlanProvider>
                  <OwnerSessionProvider>
                    {children}
                  </OwnerSessionProvider>
                </PlanProvider>
              </UIProvider>
            </VetProvider>
          </RoleProvider>
        </StorageProvider>
      </SessionProvider>
  );
}
