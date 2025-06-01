// src/app/api/plans/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repos/index";
import { withValidationAndErrorHandling } from "@/services/apiService";
import { z } from "zod";
import { CreateSubscriptionType } from "@/types/index";
import { Cookies } from "@/utils/index";

const SubscriptionSchema = z.object({
  ownerId: z.string(),
  planVersionId: z.string(),
  cycle: z.enum(["monthly", "annual"]),
  priceAtPurchase: z.number(),
  discountApplied: z.number()
});

export async function POST(req: NextRequest) {
  return withValidationAndErrorHandling("POST", req, SubscriptionSchema, async (data: CreateSubscriptionType) => {
    const accessToken = await Cookies.getAccessTokenFromCookie();
    const result = await SubscriptionRepository.create(data, accessToken);
    return NextResponse.json({ success: true, subscription: result });
  });
}
