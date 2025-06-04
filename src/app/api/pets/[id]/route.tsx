// app/api/pets/[id]/route.ts (resumiendo lo anterior)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PetRepository } from "@/repos/index";
import { getWithErrorHandling, withValidationAndErrorHandling } from "@/services/apiService";
import { PetType } from "@/types/index";
import { RepositoryError } from "@/types/lib";
import { cookies } from "next/headers";

const updatePetSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const options = {
    cookies: await cookies()
  }

  return getWithErrorHandling(
    req,
    async () => {
      const { id } = await params;
      const pets = await PetRepository.findById(id, options)
      return NextResponse.json(pets, { status: 200 })
    });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const options = {
    cookies: await cookies()
  }

  return withValidationAndErrorHandling(
    "PATCH",
    req,
    updatePetSchema,
    async (updates) => {
      const { id } = await params;
      const updated = await PetRepository.updateById(id, updates as Partial<PetType>, options);
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Mascota no encontrada" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, message: "Actualizado correctamente" },
        { status: 200 }
      );
    }
  );
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const options = {
    cookies: await cookies()
  }

  return getWithErrorHandling(req, async () => {
    const { id } = await params;
    const deleted = await PetRepository.deleteById(id, options);
    if (!deleted) {
      throw new RepositoryError("Mascota no encontrada");
    }
    return NextResponse.json(
      { success: true, message: "Eliminado correctamente" },
      { status: 200 }
    );
  });
}