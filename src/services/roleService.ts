import { AppSession } from "@/types/lib";
import { VeterinaryAccess } from "../types";

export function isVet(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccess | null | undefined): boolean {
    return isVetWithSession(appSession) || isVetWithoutSession(appSession, vetAccess) || isVetWithUserSession(appSession, vetAccess);
}

export function isVetWithoutUserSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccess | null | undefined): boolean {
    return (isVetWithSession(appSession) || isVetWithoutSession(appSession, vetAccess)) && !isVetWithUserSession(appSession, vetAccess) ;
}

export function isVetWithSession(appSession: AppSession | null | undefined): boolean {
    return appSession?.db?.user?.user_metadata?.role === "veterinarian";
}

export function isVetWithoutSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccess | null | undefined): boolean {
    return (appSession == null || appSession == undefined) && (vetAccess != null && vetAccess != undefined);
}

export function isVetWithUserSession(appSession: AppSession | null | undefined, vetAccess: VeterinaryAccess | null | undefined): boolean {
    return (vetAccess != null && vetAccess != undefined) && isOwner(appSession);
}

export function isOwner(appSession: AppSession | null | undefined) {
    return appSession?.db?.user?.user_metadata?.role === "owner";
}
