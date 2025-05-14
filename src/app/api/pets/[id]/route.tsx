// app/api/pets/[id]/route.tsx
import { NextResponse } from "next/server";
import { supabase }    from "lib/supabaseClient";

interface UpdateBody {
  code: string;
  name?: string;
  species?: string;
  breed?: string;
  birth_date?: string;  // ISO date string, p.ej. "2025-05-13"
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const petId = params.id;
  const { code, name, species, breed, birth_date } = (await req.json()) as UpdateBody;

  if (!code) {
    return NextResponse.json({ error: "Código requerido." }, { status: 400 });
  }

  // 1) Buscar el código en pet_codes
  const { data: codeData, error: codeErr } = await supabase
    .from("pet_codes")
    .select("pet_id, expires_at")
    .eq("code", code)
    .single();

  if (codeErr || !codeData) {
    return NextResponse.json(
      { error: "Código inválido." },
      { status: 401 }
    );
  }

  // 2) Verificar expiración
  const now = new Date();
  const expiresAt = new Date(codeData.expires_at);
  if (expiresAt < now) {
    return NextResponse.json(
      { error: "Código expirado. Pídele al dueño que genere uno nuevo." },
      { status: 410 }
    );
  }

  // 3) Verificar que el código pertenezca a esta mascota
  if (codeData.pet_id !== petId) {
    return NextResponse.json(
      { error: "Código no corresponde a esta mascota." },
      { status: 403 }
    );
  }

  // 4) Actualizar la mascota
  const updates: Record<string, any> = {};
  if (name !== undefined)       updates.name       = name;
  if (species !== undefined)    updates.species    = species;
  if (breed !== undefined)      updates.breed      = breed;
  if (birth_date !== undefined) updates.birth_date = birth_date;

  const { error: updateErr } = await supabase
    .from("pets")
    .update(updates)
    .eq("id", petId);

  if (updateErr) {
    return NextResponse.json(
      { error: updateErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, status: 200 });
}
