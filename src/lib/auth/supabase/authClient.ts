// lib/auth/supabase/authClient.ts
import type { AuthClient, AuthSession, SignInResponse, SignUpResponse, ResetPasswordResponse } from ".."; // Asegúrate que la ruta a index.ts sea correcta
import type { AuthChangeEvent, User } from "@supabase/supabase-js";
import { supabase } from "./browserClient"; // Importa la instancia ÚNICA del browserClient

export class SupabaseAuthClient implements AuthClient {
    // No necesitamos las propiedades this.browser o this.server aquí,
    // ya que usaremos directamente la instancia 'supabase' importada para operaciones de cliente.

    async getSession(): Promise<AuthSession | null> {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error getting session:", error);
            return null;
        }
        return data.session;
    }

    onAuthStateChange(
        cb: (event: AuthChangeEvent, session: AuthSession | null) => void
    ): { data: { unsubscribe(): void } } {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            // El 'event' de Supabase puede ser diferente al 'AuthClientChangeEvent' si lo definiste distinto.
            // Asumimos que son compatibles o que AuthChangeEvent es un alias de Supabase['AuthChangeEvent']
            cb(event as AuthChangeEvent, session as AuthSession | null);
        });
        return { data: { unsubscribe: () => subscription.unsubscribe() } };
    }

    async signIn(email: string, password: string): Promise<SignInResponse> {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return { error };
        }
        // Aseguramos que la estructura de retorno coincida con SignInResponse
        return {
            data: data ? { session: data.session as AuthSession, user: data.user as User } : null,
        };
    }

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
            // Podrías decidir lanzar el error o manejarlo aquí
        }
    }

    async resetPassword(email: string): Promise<ResetPasswordResponse> {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            // redirectTo: 'tu-url-de-reset-password-si-es-diferente-a-la-configurada-en-supabase'
        });
        return { data, error };
    }

    async signUp(email: string, password: string, role = 'owner'): Promise<SignUpResponse> {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role },
                // emailRedirectTo: 'tu-url-de-verificacion-de-email-si-es-diferente'
            },
        });
        // Aseguramos que la estructura de retorno coincida con SignUpResponse
        return {
            data: data ? { user: data.user as User | null, /* session: data.session as AuthSession | null */ } : { user: null },
            error,
        };
    }

    async setSession(session: { access_token: string; refresh_token: string }): Promise<void> {
        const { error } = await supabase.auth.setSession(session);
        if (error) {
            console.error("Error setting session:", error);
            // Podrías decidir lanzar el error o manejarlo aquí
        }
    }
}