// app/api/pets/[id]/route.tsx
import { NextResponse } from "next/server";
import { PetRepository, PetCodeRepository } from "@/repos/index";
import { cookies } from "next/headers";

interface UpdateBody {
  code: string;
  name?: string;
  image?: string;
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const options = {
    cookies: await cookies()
  }

  try {
    const { id } = await params;
    const { code, ...updates } = (await req.json()) as UpdateBody;
    if (!code) {
      return NextResponse.json({ error: "Código requerido." }, { status: 400 });
    }

    // 1) Validar código
    const codeData = await PetCodeRepository.find(code, options);
    if (!codeData) {
      return NextResponse.json({ error: "Código inválido." }, { status: 401 });
    }
    if (new Date(codeData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Código expirado." },
        { status: 410 }
      );
    }
    if (codeData.pet_id !== id) {
      return NextResponse.json(
        { error: "Código no corresponde a esta mascota." },
        { status: 403 }
      );
    }

    // 2) Actualizar pet
    await PetRepository.updateById(id, updates, options);
    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}