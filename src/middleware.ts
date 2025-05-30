// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// 1) Importa la nueva función
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    // 2) Usa createMiddlewareClient
    const supabase = createMiddlewareClient({ req, res });

    // Ahora supabase.auth.getSession() leerá la cookie correcta
    const {
        data: { session },
    } = await supabase.auth.getSession();

    // Ejemplo de protección de ruta:
    if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return res;
}
