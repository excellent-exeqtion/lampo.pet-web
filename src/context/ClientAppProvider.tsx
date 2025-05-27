// components/layout/ClientAppProvider.tsx
"use client";
import React from "react";
import { AppContextProvider } from "@/context/AppContextProvider";
import { Bubbles, SideBar } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { isVetWithoutUserSession } from "@/utils/roles";
import LoadingComponent from "@/components/lib/loading";
import { LoginPage } from "@/app/pages";
import { usePathname, useRouter } from "next/navigation";
import { useSessionContext } from "./SessionProvider";
import { usePetStorage } from "./PetStorageProvider";

interface Props {
    children: React.ReactNode;
}

export default function ClientAppProvider({ children }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { isMobile, isDesktop } = useDeviceDetect();
    const session = useSessionContext();
    const storage = usePetStorage();

    const isVetRoute = pathname.startsWith("/pages/vet");

    // 🔒 Control de acceso
    if (session === undefined) {
        return <LoadingComponent />;
    }

    if (session === null && !isVetRoute) {
        return <LoginPage />;
    }

    const isVetUser = isVetWithoutUserSession(session, storage.storedVetAccess);
    if (isVetUser && !isVetRoute) {
        router.replace("/pages/vet/access");
        return null;
    }

    const gridCols = isMobile ? "1fr" : "300px 1fr";

    return (
        <AppContextProvider>
            <div
                className="container grid"
                style={{
                    gridTemplateColumns: gridCols,
                    minHeight: "100vh",
                    transition: "grid-template-columns 0.3s ease",
                    backgroundColor: "#F9FAFB",
                    fontFamily: "'Inter', sans-serif",
                    marginLeft: '2%',
                }}
            >
                <SideBar />
                <Bubbles />
                <main
                    style={{
                        padding: "3rem",
                        marginLeft: isMobile ? "1rem" : isDesktop ? "5rem" : "2rem",
                        width: isMobile ? "100%" : isDesktop ? "107%" : "247%",
                    }}
                >
                    {children}
                </main>
            </div>
        </AppContextProvider>
    );
}
