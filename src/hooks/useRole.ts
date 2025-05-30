// src/hooks/useRole.ts
import { useMemo } from "react";
import { useStorageContext } from "@/context/StorageProvider";
import { useSessionContext } from "@/context/SessionProvider";

export function useRole() {
    const session = useSessionContext();
    const storage = useStorageContext();

    const isOwner = useMemo(
        () => session?.db?.user?.user_metadata?.role === "owner",
        [session]
    );

    const isVetWithSession = useMemo(
        () => session?.db?.user?.user_metadata?.role === "veterinarian",
        [session]
    );

    const hasVetAccessWithoutSession = useMemo(
        () => !session && storage.storedVetAccess?.id !== "",
        [session, storage.storedVetAccess]
    );

    const isVetWithUserSession = useMemo(
        () => storage.storedVetAccess?.id !== "" && isOwner,
        [storage.storedVetAccess, isOwner]
    );

    const isVetWithoutUserSession = useMemo(
        () =>
            (isVetWithSession || hasVetAccessWithoutSession) &&
            !isVetWithUserSession,
        [isVetWithSession, hasVetAccessWithoutSession, isVetWithUserSession]
    );

    const isVet = useMemo(
        () =>
            isVetWithSession ||
            isVetWithoutUserSession ||
            isVetWithUserSession,
        [isVetWithSession, isVetWithoutUserSession, isVetWithUserSession]
    );

    return {
        isOwner,
        isVet,
        isVetWithSession,
        isVetWithoutSession: hasVetAccessWithoutSession,
        isVetWithUserSession,
        isVetWithoutUserSession,
    } as const;
}
