// src/app/api/vet-access/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PetCodeRepository, PetRepository, VeterinaryAccessRepository } from "@/repos/index";
import { getRequiredQueryParam, getWithErrorHandling } from "@/services/apiService";

export async function GET(req: NextRequest) {
  return getWithErrorHandling(req, async () => {
    const code = getRequiredQueryParam(req, "code");

    // 1. Validar código
    const codeRecord = await PetCodeRepository.find(code);
    if (!codeRecord) {
      return NextResponse.json({ success: false, message: "Código inválido." }, { status: 404 });
    }

    // 2. Validar expiración
    if (new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: "Código expirado." }, { status: 403 });
    }

    // 3. Buscar mascota
    const pet = await PetRepository.findById(codeRecord.pet_id);
    if (!pet) {
      return NextResponse.json({ success: false, message: "Mascota no encontrada." }, { status: 404 });
    }

    // 4. Buscar acceso del veterinario (si existe)
    const vetAccess = await VeterinaryAccessRepository.findByCodeAndByPetId(code, pet.id);

    return NextResponse.json({
      success: true,
      pet,
      codeRecord,
      vetAccess
    });
  });
}
