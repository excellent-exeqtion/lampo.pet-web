// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePetStorage } from "@/context/PetStorageProvider";
import { isVetWithoutUserSession } from "@/utils/roles";
import { useSessionContext } from "@/context/SessionProvider";

export default function useAuthRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const session = useSessionContext();                      // undefined | null | AppSession
    const { storedVetAccess } = usePetStorage();

    useEffect(() => {
        // 1) Espera a que la sesión esté cargada
        if (session === undefined) return;

        // 2) Detectores de ruta
        const isLoginRoute = pathname === "/login" || pathname.endsWith("/login");
        const isVetRoute = pathname.startsWith("/vet-access");
        const isRoot = pathname === "/";

        const isVetUser = isVetWithoutUserSession(session, storedVetAccess);

        // 3) Redirigir a /login sólo desde la raíz si no hay sesión
        if (session === null && isRoot) {
            router.replace("/login");
            return;
        }

        // 4) Redirigir a vet-access si es vet-user
        if (isVetUser && !isVetRoute && !isLoginRoute) {
            router.replace("/vet-access");
            return;
        }

        // 5) Redirigir a /login desde otras rutas si no hay sesión
        if (session === null && !isLoginRoute && !isVetRoute && !isRoot) {
            router.replace("/login");
        }
    }, [session, storedVetAccess, pathname, router]);
}