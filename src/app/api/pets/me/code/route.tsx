// app/api/pets/me/code/route.ts
import { NextResponse } from "next/server";
import { supabase }    from "lib/supabaseClient";
import { generateCode } from "lib/codeGenerator";

export async function POST() {

    console.log(process.env.TESTING_TOKEN)
  // 1. Obtener usuario autenticado (ajusta según tu auth)
  const { data } = await supabase.auth.getUser(process.env.TESTING_TOKEN); 
  if (!data.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // 2. Buscar la mascota de ese dueño (ajusta si hay varias)
  const { data: pet, error: errPet } = await supabase
    .from("pets")
    .select("id")
    .eq("owner_id", data.user.id)
    .single();
  if (errPet || !pet) return NextResponse.json({ error: "Mascota no encontrada" }, { status: 404 });

  // 3. Invalidar códigos anteriores
  await supabase
    .from("pet_codes")
    .update({ used: true })
    .eq("pet_id", pet.id)
    .is("used", false);

  // 4. Generar nuevo código
  const code = generateCode();
  const ttlMinutes = parseInt(process.env.CODE_EXPIRE_AT!);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();

  const { error: errInsert } = await supabase
    .from("pet_codes")
    .insert({ pet_id: pet.id, code, expires_at: expiresAt });

  if (errInsert) return NextResponse.json({ error: errInsert.message }, { status: 500 });

  // 5. Devolver el código
  return NextResponse.json({ code });
}
