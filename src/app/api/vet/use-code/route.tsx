// app/api/vet/use-code/route.ts
import { NextResponse } from "next/server";
import { PetCodeRepository, VeterinaryAccessRepository } from "@/repos/index";

export async function POST(req: Request) {
  try {
    const {
      code,
      firstName,
      lastName,
      registration,
      clinicName,
      city,
    } = await req.json();

    // 1) Obtener y validar código
    const data = await PetCodeRepository.find(code);
    if (!data) {
      return NextResponse.json({ error: "Código inválido" }, { status: 404 });
    }
    const now = new Date().toISOString();
    if (data.used) {
      return NextResponse.json({ error: "Código ya utilizado" }, { status: 410 });
    }
    if (data.expires_at < now) {
      return NextResponse.json({ error: "Código expirado" }, { status: 410 });
    }

    // 2) Marcar como usado
    await PetCodeRepository.markUsed(code);

    // 3) Registrar acceso veterinario
    const vetAccess = await VeterinaryAccessRepository.create({
      pet_id: data.pet_id,
      pet_code_id: data.id,
      vet_first_name: firstName,
      vet_last_name: lastName,
      professional_registration: registration,
      clinic_name: clinicName,
      city,
    });

    // 4) Devolver petId
    return NextResponse.json({ success: true, pet_id: data.pet_id, pet_code: data.id, vet_access: vetAccess.id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
