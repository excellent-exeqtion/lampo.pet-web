// src/lib/auth/supabase.ts
import {
    createServerComponentClient,
    createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import type { AuthClient, AuthSession } from "./index";
import type { AuthChangeEvent, AuthError, User } from "@supabase/supabase-js";

export class SupabaseAuthClient implements AuthClient {
    private browser = createClientComponentClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private server = (ctx: { cookies: any }) => createServerComponentClient({ cookies: ctx.cookies });

    async getSession(): Promise<AuthSession | null> {
        const { data } = await this.browser.auth.getSession();
        return data.session as AuthSession | null;
    }

    onAuthStateChange(
        cb: (event: AuthChangeEvent, session: AuthSession | null) => void
    ) {
        const {
            data: { subscription },
        } = this.browser.auth.onAuthStateChange((event, session) => {
            cb(event, session as AuthSession | null);
        });
        return { unsubscribe: () => subscription.unsubscribe() };
    }

    async signIn(email: string, password: string): Promise<{ data?: { session: AuthSession; user: User } | null; error?: AuthError | null }> {
        const { data, error } = await this.browser.auth.signInWithPassword({ email, password });
        if (error) {
            return {
                error: error
            }
        };
        return {
            data: {
                session: data.session as AuthSession,
                user: data.user as User
            }
        };
    }

    async signOut(): Promise<void> {
        await this.browser.auth.signOut();
    }

    async resetPassword(email: string): Promise<{ data: object | null; error: AuthError | null }> {
        return this.browser.auth.resetPasswordForEmail(email);
    };

    async signUp(
        email: string,
        password: string,
        role: string = 'owner'
    ): Promise<{ data: { user: User | null }; error: AuthError | null }> {
        return this.browser.auth.signUp({
            email, password,
            options: {
                data: { role: role }
            }
        });
    };

    async setSession(session: {
        access_token: string;
        refresh_token: string;
    }) {
        this.browser.auth.setSession(session);
    }
}
