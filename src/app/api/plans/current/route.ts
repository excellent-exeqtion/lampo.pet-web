// src/app/api/plans/current/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PlanRepository } from "@/repos/index";
import { getWithErrorHandling } from "@/services/apiService";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const options = {
    cookies: await cookies()
  }

  return getWithErrorHandling(req, async () => {
    const plans = await PlanRepository.getAllCurrent(options);
    return NextResponse.json({ success: true, plans });
  });
}
