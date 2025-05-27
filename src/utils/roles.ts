// src/utils/role.ts
import { AppSession } from "@/types/lib";
import { VeterinaryAccessType } from "../types";

export function isVet(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccessType): boolean {
    return isVetWithSession(appSession) || isVetWithoutSession(appSession, vetAccess) || isVetWithUserSession(appSession, vetAccess);
}

export function isVetWithoutUserSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccessType): boolean {
    return (isVetWithSession(appSession) || isVetWithoutSession(appSession, vetAccess)) && !isVetWithUserSession(appSession, vetAccess) ;
}

export function isVetWithSession(appSession: AppSession | null | undefined): boolean {
    return appSession?.db?.user?.user_metadata?.role === "veterinarian";
}

export function isVetWithoutSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccessType): boolean {
    return (appSession == null || appSession == undefined) && vetAccess.id != "";
}

export function isVetWithUserSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccessType): boolean {
    return vetAccess.id != "" && isOwner(appSession);
}

export function isOwner(appSession: AppSession | null | undefined) {
    return appSession?.db?.user?.user_metadata?.role === "owner";
}
