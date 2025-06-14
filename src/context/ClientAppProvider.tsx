// components/layout/ClientAppProvider.tsx
"use client";
import React from "react";
import { Bubbles, Loading, SideBar } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { usePathname } from "next/navigation";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useSessionContext } from "./SessionProvider";

interface Props {
    children: React.ReactNode;
}

export default function ClientAppProvider({ children }: Props) {
    useAuthRedirect();

    const { isMobile, isDesktop } = useDeviceDetect(); 
    const { isLoading: isSessionLoading } = useSessionContext();
    const pathname = usePathname();

    // 2. Determinar si la ruta actual es una ruta pública/especial que no usa el layout principal.
    const isAuthRoute = pathname === "/login" ||
        pathname.startsWith("/auth/callback") ||
        pathname.startsWith("/landing") ||
        pathname.startsWith("/pages/auth/verify") ||
        pathname.startsWith("/vet-access/register") ||
        pathname.startsWith("/_not-found");

    if (isSessionLoading) {
        return <Loading />; // Loader fullscreen o centrado
    }

    if (isAuthRoute) {
        return (
            <>
                {children}
            </>
        );
    }

    const gridCols = isMobile ? "1fr" : "300px 1fr";


    return (
        <>
            <div
                className="container grid"
                style={{
                    gridTemplateColumns: gridCols,
                    minHeight: "100vh",
                    transition: "grid-template-columns 0.3s ease",
                    backgroundColor: "var(--primary-inverse)",
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
        </>
    );
}
