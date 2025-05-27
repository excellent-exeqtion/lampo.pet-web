// src/app/api/pets/exists/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PetRepository } from "@/repos/index";
import { getRequiredQueryParam, getWithErrorHandling } from "@/services/apiService";

export async function GET(req: NextRequest) {
  return getWithErrorHandling(req, async () => {
    const id = getRequiredQueryParam(req, "id");

    const exists = await PetRepository.existsById(id);
    return NextResponse.json({ success: true, exists });
  });
}
