// src/lib/auth/server.ts
// Este archivo contiene únicamente exportaciones seguras para usar en el entorno del servidor (Middleware, API Routes).

import { createServerClient as supabaseCreateServerClient, type CookieOptions } from '@supabase/ssr';
import { updateSession as supabaseUpdateSession } from "./supabase/middleware";
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { NextRequest, NextResponse } from "next/server";

// Re-exportamos la función para crear un cliente de servidor
export async function createServerClient(cookieStore: ReadonlyRequestCookies) {
    return supabaseCreateServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set(name, value, options);
                    } catch (error) {
                        console.error(`SSR Error (Route Handler/Middleware): Failed to set cookie ${name}`, error);
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set(name, '', options);
                    } catch (error) {
                        console.error(`SSR Error (Route Handler/Middleware): Failed to remove cookie ${name}`, error);
                    }
                },
            }
        }
    );
}

// Re-exportamos la función de middleware
export async function updateSession(request: NextRequest): Promise<NextResponse> {
    return supabaseUpdateSession(request);
}