// src/app/api/plans/subscription/[ownerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repos/index";
import { getWithErrorHandling } from "@/services/apiService";
import { cookies } from "next/headers";

export async function GET(req: NextRequest, { params }: { params: Promise<{ ownerId: string }> }) {
    const options = {
        cookies: await cookies()
    }

  return getWithErrorHandling(req, async () => {
    const { ownerId } = await params;
    const subscription = await SubscriptionRepository.getActiveByOwner(ownerId, options);
    return NextResponse.json({ success: true, data: subscription });
  });
}
