// lib/auth/supabase/tokenClient.ts
import { RepositoryOptions } from "@/types/lib";
import { Cookies } from "@/utils/index";
import { createClient } from "@supabase/supabase-js";

export function getClientWithToken(options: RepositoryOptions) {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        (options.cookies && !Cookies.isVetAccessFromCookie(options.cookies)) ? {
            global: { headers: { Authorization: `Bearer ${Cookies.getAccessTokenFromCookie(options.cookies)}` } }
        } : {}
    );
}