// app/lib/db/services/authService.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/lib/db/supabaseClient";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export const getUser = async (token: string): Promise<User> => {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw new Error("No autorizado");
    return data.user;
}

export const signOut = () => supabase.auth.signOut();

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (cb: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(cb).data.subscription;

export function useSession() {
    const [session, setSession] = useState<Session | null | undefined>(undefined);

    useEffect(() => {
        (async () => {
            const { data } = await getSession();
            setSession(data.session);
        })();
        const sub = onAuthStateChange((_e, s) => setSession(s));
        return () => sub.unsubscribe();
    }, []);

    return session;
}
