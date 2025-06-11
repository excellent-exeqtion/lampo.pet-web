// src/context/AppContext.tsx

import { UIProvider } from "./UIProvider";
import { OwnerSessionProvider } from "./OwnerSessionProvider";
import { PlanProvider } from "./PlanProvider";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <PlanProvider>
        <OwnerSessionProvider>
            {children}
        </OwnerSessionProvider>
      </PlanProvider>
    </UIProvider>
  );
}
