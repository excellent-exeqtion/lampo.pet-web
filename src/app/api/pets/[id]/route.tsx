// app/api/pets/[id]/route.tsx
import { NextResponse } from "next/server";
import { PetRepository } from "@/repos/pet.repository";

interface UpdateBody {
    code: string;
    name?: string;
    image?: string;
}
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = (await req.json()) as UpdateBody;

    // 2) Actualizar pet
    const pet = await PetRepository.updateById(id, updates);
    return NextResponse.json({ success: true, data: pet });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Error interno" },
      { status: 500 }
    );
  }
}