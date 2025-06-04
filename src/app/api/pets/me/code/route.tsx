// app/api/pets/me/code/route.ts
import { NextResponse } from "next/server";
import { PetRepository, PetCodeRepository } from "@/repos/index";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const options = {
    cookies: await cookies()
  }

  try {
    const { owner_id, pet_id } = await req.json();

    // 1) Mascota del owner
    const pet = await PetRepository.findByOwnerIdAndPetId(owner_id, pet_id, options);
    if (!pet) {
      return NextResponse.json(
        { error: "Mascota no encontrada" },
        { status: 404 }
      );
    }

    // 2) Invalida códigos anteriores
    await PetCodeRepository.invalidateAll(pet_id, options);

    // 3) Crea nuevo código
    const ttl = parseInt(process.env.CODE_EXPIRE_AT!);
    const code = await PetCodeRepository.create(pet_id, ttl, options);

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
