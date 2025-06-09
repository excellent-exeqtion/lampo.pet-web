// lib/auth/supabase/authClient.ts
import type { BrowserAuthClient, AuthSession, SignInResponse, SignUpResponse, ResetPasswordResponse, AuthUser } from "..";
import { createBrowserClient } from "./browserClient";

export class SupabaseAuthClient implements BrowserAuthClient {
    async getSession(): Promise<AuthSession | null> {
        const { data, error } = await createBrowserClient().auth.getSession();
        if (error) {
            console.error("Error getting session:", error);
            return null;
        }
        return data.session;
    }

    onAuthStateChange(
        cb: (event: string, session: AuthSession | null) => void
    ): { data: { unsubscribe(): void } } {
        const { data: { subscription } } = createBrowserClient().auth.onAuthStateChange((event, session) => {
            cb(event, session as AuthSession | null);
        });
        return { data: { unsubscribe: () => subscription.unsubscribe() } };
    }

    async signIn(email: string, password: string): Promise<SignInResponse> {
        const { data, error } = await createBrowserClient().auth.signInWithPassword({ email, password });
        if (error) {
            return { error };
        }
        return {
            data: data ? { session: data.session as AuthSession, user: data.user as AuthUser } : null,
        };
    }

    async signOut(): Promise<void> {
        const { error } = await createBrowserClient().auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
        }
    }

    async resetPassword(email: string): Promise<ResetPasswordResponse> {
        const { data, error } = await createBrowserClient().auth.resetPasswordForEmail(email, {
            // TODO: redirectTo: 'tu-url-de-reset-password-si-es-diferente-a-la-configurada-en-supabase'
        });
        return { data, error };
    }

    async signUp(email: string, password: string, role = 'owner'): Promise<SignUpResponse> {
        const { data, error } = await createBrowserClient().auth.signUp({
            email,
            password,
            options: {
                data: { role }
            },
        });
        return {
            data: data ? { user: data.user as AuthUser | null } : { user: null },
            error,
        };
    }

    async setSession(session: { access_token: string; refresh_token: string }): Promise<void> {
        const { error } = await createBrowserClient().auth.setSession(session);
        if (error) {
            console.error("Error setting session:", error);
        }
    }

    async inviteUser(email: string): Promise<void> {
        await createBrowserClient().auth.admin.inviteUserByEmail(email)
    }
}