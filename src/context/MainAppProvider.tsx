// src/context/MainAppProvider.tsx

import ClientAppProvider from "./ClientAppProvider";
import { RoleProvider } from "./RoleProvider";
import { SessionProvider } from "./SessionProvider";
import { StorageProvider } from "./StorageProvider";

export function MainAppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <StorageProvider>
                <RoleProvider>
                    <ClientAppProvider>{children}</ClientAppProvider>
                </RoleProvider>
            </StorageProvider>
        </SessionProvider>
    );
}
