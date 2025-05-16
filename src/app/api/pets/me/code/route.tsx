// app/api/pets/me/code/route.ts
import { NextResponse } from "next/server";
import { PetRepository } from "@/repos/pet.repository";
import { PetCodeRepository } from "@/repos/petCode.repository";

export async function POST(req: Request) {
  try {
    const { owner_id, pet_id } = await req.json();

    // 1) Mascota del owner
    const pet = await PetRepository.findByOwnerId(owner_id, pet_id);
    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // 2) Invalida códigos anteriores
    await PetCodeRepository.invalidateAll(pet_id);

    // 3) Crea nuevo código
    const ttl = parseInt(process.env.CODE_EXPIRE_AT!);
    const code = await PetCodeRepository.create(pet_id, ttl);

    return NextResponse.json({ code });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const msg = err.message.includes("No autorizado")
      ? { error: "No autorizado" }
      : { error: err.message || "Error interno" };
    const status = msg.error === "No autorizado" ? 401 : 500;
    return NextResponse.json(msg, { status });
  }
}
