// src/app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// Importa el helper de Next.js, no uses req.cookies
import { cookies } from "next/headers";

export async function GET() {
  // Cookies es una función que devuelve ReadonlyRequestCookies
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, session });
}
