// lib/auth/index.ts
import { SupabaseAuthClient } from "./supabase/authClient";
//import { createServerClient as SupabaseServerClient } from "./supabase/serverClient"; // Usar el cliente de servidor real
import { updateSession as SupabaseUpdateSession } from "./supabase/middleware"; // Usar el middleware real
import { NextRequest, NextResponse } from "next/server"; // NextResponse añadido
import { getClientWithToken as getSupabaseClientWithToken } from "./supabase/tokenClient";
import { createServerClient as createSupabaseServerClient } from "./supabase/serverClient";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RepositoryOptions } from "@/types/lib";

export type SignInResponse = { data?: { session: AuthSession; user: AuthUser } | null; error?: AuthError | null };
export type SignUpResponse = { data: { user: AuthUser | null, /* session?: AuthSession | null */ }; error: AuthError | null }; // session es opcional en signup
export type ResetPasswordResponse = { data: object | null; error: AuthError | null };
export type ServerSession = { data: { session: AuthSession; }; error: null; } | { data: { session: null; }; error: AuthError; } | { data: { session: null; }; error: null; };
export type AuthUserResponse = { data: { user: AuthUser; }; error: null; } | { data: { user: null; }; error: AuthError; };
export type AuthSession = { access_token: string; refresh_token: string; expires_in: number; expires_at?: number; token_type: string; user: AuthUser }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthUser = { id: string; aud: string; user_metadata: { [key: string]: any }; confirmation_sent_at?: string; recovery_sent_at?: string; email_change_sent_at?: string; new_email?: string; new_phone?: string; invited_at?: string; action_link?: string; email?: string; phone?: string; created_at: string; confirmed_at?: string; email_confirmed_at?: string; phone_confirmed_at?: string; last_sign_in_at?: string; role?: string; updated_at?: string; is_anonymous?: boolean; is_sso_user?: boolean; };
export type AuthError = { name: string; message: string; stack?: string; code: string | undefined; status: number | undefined; details?: string; hint?: string; }


export interface BrowserAuthClient {
    getSession(): Promise<AuthSession | null>;
    onAuthStateChange(
        cb: (event: string, session: AuthSession | null) => void
    ): { data: { unsubscribe: () => void } };
    signIn(email: string, password: string): Promise<SignInResponse>;
    signOut(): Promise<void>;
    resetPassword(email: string): Promise<ResetPasswordResponse>;
    signUp(email: string, password: string, role: string): Promise<SignUpResponse>;
    setSession(session: { access_token: string; refresh_token: string; }): Promise<void>;
    inviteUser(email: string): Promise<void>;
}

export interface ServerAuthClient {
    getSession(): Promise<ServerSession>;
    getUser(jwt?: string): Promise<AuthUserResponse>;
}

const authClientImpl = new SupabaseAuthClient();
export { authClientImpl as authClient };

const createAuthServerClient = async (cookieStore: ReadonlyRequestCookies): Promise<ServerAuthClient> => {
    const serverSupabaseClient = await createSupabaseServerClient(cookieStore);
    return serverSupabaseClient;
};
export { createAuthServerClient as createServerClient };

const updateSessionImpl = async (req: NextRequest): Promise<NextResponse> => {
    return SupabaseUpdateSession(req);
}
export { updateSessionImpl as updateSession };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbClientImpl = (options: RepositoryOptions): any => {
    const supabaseClient = getSupabaseClientWithToken(options);
    return supabaseClient;
};;

export { dbClientImpl as dbClient };