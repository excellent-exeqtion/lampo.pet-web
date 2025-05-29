// components/layout/ClientAppProvider.tsx
"use client";
import React from "react";
import { AppContextProvider } from "@/context/AppContextProvider";
import { Bubbles, SideBar } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { isVetWithoutUserSession } from "@/utils/roles";
import LoadingComponent from "@/components/lib/loading";
import { usePathname } from "next/navigation";
import { usePetStorage } from "./PetStorageProvider";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useSessionContext } from "./SessionProvider";

interface Props {
    children: React.ReactNode;
}

export default function ClientAppProvider({ children }: Props) {
    useAuthRedirect();

    const { isMobile, isDesktop } = useDeviceDetect();
    const session = useSessionContext();                      // undefined | null | AppSession
    const { storedVetAccess } = usePetStorage();
    const pathname = usePathname();

    const isLoginRoute = pathname === "/login" || pathname.endsWith("/login");
    const isVetRoute = pathname.startsWith("/vet-access");

    // No envolver con sidebar en login o vet-access
    if (isLoginRoute || isVetRoute) {
        return <>{children}</>;
    }

    // Mostrar loader mientras carga la sesión
    if (session === undefined) {
        return <LoadingComponent />;
    }

    // Si no hay sesión, bloquear render hasta redirect
    if (session === null) {
        return null;
    }

    // Si es vet-user con sesión y no está en vet-access, bloquear hasta redirect
    const isVetUserNow = isVetWithoutUserSession(session, storedVetAccess);
    if (isVetUserNow) {
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
