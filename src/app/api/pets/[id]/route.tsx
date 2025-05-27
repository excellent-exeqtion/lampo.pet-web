// app/api/pets/[id]/route.ts (resumiendo lo anterior)
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PetRepository } from "@/repos/index";
import { ApiParams } from "@/types/lib";
import { getWithErrorHandling, withValidationAndErrorHandling } from "@/services/apiService";
import { PetType } from "@/types/index";

const updatePetSchema = z.object({
  name: z.string().optional(),
  image: z.string().url().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return getWithErrorHandling(
    req,
    async () => {
      const { id } = params;
      const pets = await PetRepository.findById(id)
      return NextResponse.json(pets, { status: 200 })
    });
}

export async function PATCH(req: NextRequest, { params }: ApiParams) {
  return withValidationAndErrorHandling(
    "PATCH",
    req,
    updatePetSchema,
    async (updates) => {
      const updated = await PetRepository.updateById(params.id, updates as Partial<PetType>);
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
