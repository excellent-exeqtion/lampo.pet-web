import { useSessionContext } from "@/context/SessionProvider";
import { useStorageContext } from "@/context/StorageProvider";

export function useRole() {
  const { db: session } = useSessionContext();
  const { storedVetAccess } = useStorageContext();

  const isOwner = session?.user.user_metadata.role === "owner";
  const isVetWithSession = session?.user.user_metadata.role === "veterinarian";
  const hasVetAccessWithoutSession = !session && Boolean(storedVetAccess?.id);
  const isVetWithUserSession = Boolean(storedVetAccess?.id) && isOwner;
  const isVetWithoutUserSession =
    (isVetWithSession || hasVetAccessWithoutSession) && !isVetWithUserSession;
  const isVet =
    isVetWithSession || 
    isVetWithoutUserSession || 
    isVetWithUserSession;

  return {
    isOwner,
    isVet,
    isVetWithSession,
    isVetWithoutSession: hasVetAccessWithoutSession,
    isVetWithUserSession,
    isVetWithoutUserSession,
  } as const;
}
