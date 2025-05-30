// src/services/authService.ts
import { StorageContextType } from "@/hooks/useAppStorage";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthClientChangeEvent, AuthClientError, AuthSession, SignInResponse, SignUpResponse, authClient } from '@/lib/auth';

export const signIn = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  const { data, error } = await authClient.signIn(email, password);
  if (data) {
    setSession(data.session);
  }
  return { data, error };
};

export const ownerSignUp = async (
  email: string,
  password: string,
  role: string = 'owner'
): Promise<SignUpResponse> => {
  return authClient.signUp(email, password, role);
};

export const resetPassword = async (
  email: string
): Promise<{ data: object | null; error: AuthClientError | null }> => {
  return authClient.resetPassword(email);
};
export const signOut = () => authClient.signOut();

export const getSession = () => authClient.getSession();

export const onAuthStateChange = (
  cb: (event: AuthClientChangeEvent, session: AuthSession | null) => void
) => authClient.onAuthStateChange(cb);

export const setSession = (session: {
  access_token: string;
  refresh_token: string;
}) => authClient.setSession(session);

export const handleLogout = async (storage: StorageContextType, router: AppRouterInstance) => {
  /*try {
    const response = await fetch("/api/auth/sign-out", { method: "POST" });
    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Error cerrando sesión:", result.message || "Unknown error");
    }
  } catch (err) {
    console.error("Error en logout:", err);
  }*/
  await authClient.signOut();
  storage.resetSession();
  router.replace("/login");
};