// src/context/AppContext.tsx

import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { PlanProvider } from "./PlanProvider";
import { SessionProvider } from "@/context/SessionProvider";
import { StorageProvider } from "@/context/StorageProvider";
import { RoleProvider } from "@/context/RoleProvider";
import { VetProvider } from "@/context/VetContext";
import { I18nextProvider } from "./I18nProvider";
import i18n from "@/lib/i18n";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    
      <SessionProvider>
        <StorageProvider>
          <RoleProvider>
            <VetProvider>
              <UIProvider>
                <PlanProvider>
                  <OwnerSessionProvider>
                    <I18nextProvider i18n={i18n}/>
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
