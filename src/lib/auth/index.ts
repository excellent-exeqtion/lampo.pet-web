// lib/auth/index.ts
import type { AuthChangeEvent, AuthError, Session as SupabaseSession, User } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "./supabase/authClient";
//import { createServerClient as SupabaseServerClient } from "./supabase/serverClient"; // Usar el cliente de servidor real
import { updateSession as SupabaseUpdateSession } from "./supabase/middleware"; // Usar el middleware real
import { NextRequest, NextResponse } from "next/server"; // NextResponse añadido

export type SignInResponse = { data?: { session: AuthSession; user: User } | null; error?: AuthError | null };
export type SignUpResponse = { data: { user: User | null, /* session?: AuthSession | null */ }; error: AuthError | null }; // session es opcional en signup
export type ResetPasswordResponse = { data: object | null; error: AuthError | null };
export type AuthSession = SupabaseSession;
export type AuthClientError = AuthError;
export type AuthClientChangeEvent = AuthChangeEvent; // Asumiendo que es el tipo de Supabase

export interface AuthClient {
    getSession(): Promise<AuthSession | null>;
    onAuthStateChange(
        cb: (event: AuthChangeEvent, session: AuthSession | null) => void // event puede ser AuthChangeEvent de supabase
    ): { data: { unsubscribe: () => void } };
    signIn(email: string, password: string): Promise<SignInResponse>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<ResetPasswordResponse>;
    signUp(email: string, password: string, role: string): Promise<SignUpResponse>;
    setSession(session: { access_token: string; refresh_token: string; }): Promise<void>;
}

const authClientImpl = new SupabaseAuthClient();
export { authClientImpl as authClient };
/*
// Este 'createClient' es para obtener el cliente de autenticación del SERVIDOR (para API Routes o Server Components)
// Lo renombré a createAuthServerClient para evitar confusión si en otro lado se crea un cliente de datos.
const createAuthServerClient = async () => {
    // createServerClient ya devuelve el cliente Supabase completo, accedemos a .auth
    const serverSupabaseClient = await SupabaseServerClient(); // Esta función ya está en serverClient.ts
    return serverSupabaseClient.auth;
};
export { createAuthServerClient as createClient }; // Exportar con el nombre que usabas si es necesario
*/
// Este 'updateSession' es el que se usa en el middleware
const updateSessionImpl = async (req: NextRequest): Promise<NextResponse> => { // Debe devolver NextResponse
    return SupabaseUpdateSession(req); // Esta función ya está en middleware.ts
}
export { updateSessionImpl as updateSession };