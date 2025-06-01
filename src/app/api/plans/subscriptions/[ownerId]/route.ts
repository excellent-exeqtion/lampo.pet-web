// src/app/api/plans/subscription/[ownerId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repos/index";
import { getWithErrorHandling } from "@/services/apiService";

export async function GET(req: NextRequest, { params }: { params: Promise<{ ownerId: string }> }) {
    return getWithErrorHandling(req, async () => {
        const { ownerId } = await params;
        const subscription = await SubscriptionRepository.getActiveByOwner(ownerId);
        return NextResponse.json({ success: true, data: subscription });
    });
}
