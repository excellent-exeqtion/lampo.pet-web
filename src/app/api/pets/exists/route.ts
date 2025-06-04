// src/app/api/pets/exists/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PetRepository } from "@/repos/index";
import { getRequiredQueryParam, getWithErrorHandling } from "@/services/apiService";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const options = {
    cookies: await cookies()
  }

  return getWithErrorHandling(req, async () => {
    const id = getRequiredQueryParam(req, "id");

    const exists = await PetRepository.existsById(id, options);
    return NextResponse.json({ success: true, exists });
  });
}
