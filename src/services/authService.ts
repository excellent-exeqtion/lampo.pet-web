// src/services/authService.ts
import { StorageContextType } from "@/hooks/useAppStorage";
import { authClient } from '@/lib/auth';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleLogout = async (storage: StorageContextType, router: AppRouterInstance): Promise<void> => {
  try {
    storage.resetSession();
    await authClient.signOut();
  } catch (error) {
    console.error("Error during sign out in authService:", error);
  } finally {
    router.replace("/login");
    router.refresh();
  }
};