// src/lib/auth/index.ts
import type { AuthChangeEvent, AuthError, Session as SupabaseSession, User } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "./supabase";

export type SignInResponse = { data?: { session: AuthSession; user: User } | null; error?: AuthError | null };
export type SignUpResponse = { data: { user: User | null }; error: AuthError | null };
export type ResetPasswordResponse = { data: object | null; error: AuthError | null };
export type AuthSession = SupabaseSession;
export type AuthClientError = AuthError;
export type AuthClientChangeEvent = AuthChangeEvent;
// o incluso podrías saltarte el alias y usar SupabaseSession directamente

export interface AuthClient {
    getSession(): Promise<AuthSession | null>;
    onAuthStateChange(
        cb: (event: AuthClientChangeEvent | undefined, session: AuthSession | null) => void
    ): { unsubscribe(): void };
    signIn(email: string, password: string): Promise<SignInResponse>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<ResetPasswordResponse>;
    signUp(email: string, password: string, role: string): Promise<SignUpResponse>;
    setSession(session: { access_token: string; refresh_token: string;}): void;
}

export const authClientImpl = new SupabaseAuthClient();
export { authClientImpl as authClient };

