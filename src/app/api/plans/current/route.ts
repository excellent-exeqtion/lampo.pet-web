// src/app/api/plans/current/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PlanRepository } from "@/repos/index";
import { getWithErrorHandling } from "@/services/apiService";

export async function GET(req: NextRequest) {
  return getWithErrorHandling(req, async () => {
    const plans = await PlanRepository.getAllCurrent();
    return NextResponse.json({ success: true, plans });
  });
}
