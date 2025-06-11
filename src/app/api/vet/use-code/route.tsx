// app/api/vet/use-code/route.ts
import { NextResponse } from "next/server";
import { PetCodeRepository, VeterinaryAccessRepository } from "@/repos/index";

export async function POST(req: Request) {

  try {
    const {
      code,
      firstName,
      firstLastName,
      secondLastName,
      identification,
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
      vet_first_last_name: firstLastName,
      vet_second_last_name: secondLastName,
      identification: identification,
      professional_registration: registration,
      clinic_name: clinicName,
      city,
    });

    // 4) Devolver petId
    const response = NextResponse.json({ success: true, pet_id: data.pet_id, pet_code: data.id, vet_access: vetAccess.id });

    // Establecemos una cookie con el acceso temporal
    response.cookies.set('lampo-vet-access', JSON.stringify({ petId: data.pet_id }), {
      path: '/',
      httpOnly: true, // La cookie no es accesible desde JS en el cliente
      sameSite: 'lax',
      maxAge: 3600, // La sesión temporal dura 1 hora
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}
