// src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider"; // Para storedVetAccess si es relevante aquí
import { useRoleContext } from "@/context/RoleProvider"; // Para la lógica de roles

export default function useAuthRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const { db: session, isLoading: isSessionLoading } = useSessionContext(); // Obtener isLoading
    const { storedVetAccess } = useStorageContext(); // Aunque su uso directo aquí podría disminuir
    const { isVetWithoutUserSession } = useRoleContext();

    useEffect(() => {
        // 1. No hacer nada si la sesión aún está cargando
        if (isSessionLoading) {
            return;
        }

        // 2. Definición de rutas especiales
        const isLoginRoute = pathname === "/login";
        const isLandingRoute = pathname === "/";
        const isVerifyAuthRoute = pathname.startsWith("/pages/auth/verify"); // Ruta de verificación de email
        const isCallbackAuthRoute = pathname.startsWith("/auth/callback"); // Ruta de callback de Supabase (OTP)
        const isPublicRoute = isLoginRoute || isVerifyAuthRoute || isCallbackAuthRoute; // Rutas que no requieren sesión
        const isVetAccessUIRoute = pathname.startsWith("/vet-access"); // Rutas UI para acceso veterinario sin cuenta

        if(isLandingRoute){
            console.log('landing')
            return;
        }
        // 3. Lógica de Redirección
        if (session) {
            // ----- HAY SESIÓN -----
            if (isLoginRoute) {
                router.replace("/pages/home");
                return;
            }

        } else {
            // ----- NO HAY SESIÓN -----
            if (isVetWithoutUserSession && !isVetAccessUIRoute && !isPublicRoute) {
                router.replace("/vet-access");
                return;
            }

            if (!isPublicRoute && !isVetAccessUIRoute) {
                router.replace("/login");
                return;
            }
        }

    }, [session, isSessionLoading, pathname, router, storedVetAccess, isVetWithoutUserSession]); // Añadir storedVetAccess e isVetWithoutUserSession si son cruciales para la lógica de redirección inmediata.
}