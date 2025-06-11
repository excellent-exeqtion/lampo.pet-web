// RUTA: src/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { useRoleContext } from "@/context/RoleProvider";

// ----- Lógica de rutas permitidas para Vet sin sesión (sincronizada con el middleware) -----
const VET_GUEST_ALLOWED_PATHS = [
    '/pages/pet/basic-data',
    '/pages/pet/vaccines',
    '/pages/pet/surgeries',
    '/pages/pet/medicines',
    '/pages/pet/conditions',
    '/pages/pet/lab-tests',
];

function isVetGuestAllowedPath(pathname: string, petId: string): boolean {
    if (VET_GUEST_ALLOWED_PATHS.includes(pathname)) {
        return true;
    }
    const consultationMatch = pathname.match(/^\/pages\/pet\/consultations\/([^/]+)/);
    if (consultationMatch && consultationMatch[1] === petId) {
        return true;
    }
    const newConsultationMatch = pathname.match(/^\/pages\/vet\/consultation\/([^/]+)/);
    if (newConsultationMatch && newConsultationMatch[1] === petId) {
        return true;
    }
    return false;
}
// ----- Fin de la lógica de rutas -----


export default function useAuthRedirect() {
    const router = useRouter();
    const pathname = usePathname();
    const { db: session, isLoading: isSessionLoading } = useSessionContext();
    const { storedVetAccess } = useStorageContext();
    const { isVetWithoutUserSession } = useRoleContext();

    useEffect(() => {
        // 1. No hacer nada mientras la sesión está cargando
        if (isSessionLoading) {
            return;
        }

        // 2. Lógica de redirección si HAY una sesión de usuario
        if (session) {
            if (pathname === "/login") {
                router.replace("/pages/home");
            }
            return; // Si hay sesión, el resto de la lógica no aplica
        }

        // 3. Lógica de redirección si NO HAY sesión de usuario
        // 3.1. Verificar si es un veterinario invitado (acceso por código)
        if (isVetWithoutUserSession) {
            const petId = storedVetAccess?.pet_id;
            // Si el veterinario tiene un petId de acceso y la ruta está permitida, no hacemos nada.
            if (petId && isVetGuestAllowedPath(pathname, petId)) {
                return;
            }

            // Si está en la página de acceso de veterinario, tampoco hacemos nada.
            if (pathname.startsWith('/vet-access')) {
                return;
            }

            // Para cualquier otra ruta no permitida, lo redirigimos a la página de acceso.
            router.replace('/vet-access');
            return;
        }

        // 3.2. Si es un usuario anónimo normal (no es un vet invitado)
        const isGenerallyPublicRoute =
            pathname === "/" ||
            pathname === "/login" ||
            pathname.startsWith("/vet-access") ||
            pathname.startsWith("/pages/auth/verify") ||
            pathname.startsWith("/auth/callback");

        if (!isGenerallyPublicRoute) {
            console.log('send to login from useAuthRedirect')
            router.replace("/login");
        }

    }, [session, isSessionLoading, pathname, router, storedVetAccess, isVetWithoutUserSession]);
}