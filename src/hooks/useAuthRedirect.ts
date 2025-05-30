// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStorageContext } from "@/context/StorageProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { useRoleContext } from "@/context/RoleProvider";

export default function useAuthRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const session = useSessionContext();                      // undefined | null | AppSession
    const { storedVetAccess } = useStorageContext();
    const { isVetWithoutUserSession } = useRoleContext();

    useEffect(() => {
        // 1) Espera a que la sesión esté cargada
        if (session === undefined) return;

        // 2) Detectores de ruta
        const isLoginRoute = pathname === "/login" || pathname.endsWith("/login");
        const isVetRoute = pathname.startsWith("/vet-access");
        const isRoot = pathname === "/";

        // 3) Redirigir a /login sólo desde la raíz si no hay sesión
        if (session === null && isRoot) {
            router.replace("/login");
            return;
        }

        // 4) Redirigir a vet-access si es vet-user
        if (isVetWithoutUserSession && !isVetRoute && !isLoginRoute) {
            router.replace("/vet-access");
            return;
        }

        // 5) Redirigir a /login desde otras rutas si no hay sesión
        if (session === null && !isLoginRoute && !isVetRoute && !isRoot) {
            router.replace("/login");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, storedVetAccess, pathname, router]);
}