// app/api/vet/use-code/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/auth/supabaseClient";

export async function POST(req: Request) {
  const { code } = await req.json();

  // 1. Buscar el código activo
  const { data, error } = await supabase
    .from("pet_codes")
    .select("pet_id, used, expires_at")
    .eq("code", code)
    .single();

  if (error || !data)
    return NextResponse.json({ error: "Código inválido" }, { status: 404 });

  const now = new Date().toISOString();
  if (data.used)
    return NextResponse.json({ error: "Código ya utilizado" }, { status: 410 });
  if (data.expires_at < now)
    return NextResponse.json({ error: "Código expirado" }, { status: 410 });

  // 2. Marcar como usado (para un solo uso)
  const { error: errUpdate } = await supabase
    .from("pet_codes")
    .update({ used: true })
    .eq("code", code);

  if (errUpdate)
    return NextResponse.json({ error: errUpdate.message }, { status: 500 });

  // 3. Devolver el pet_id para cargar el formulario de edición
  return NextResponse.json({ success: true, petId: data.pet_id });
}
