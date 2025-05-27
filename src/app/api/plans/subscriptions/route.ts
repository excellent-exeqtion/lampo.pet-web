import { NextRequest, NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repos/index";
import { withValidationAndErrorHandling } from "@/services/apiService";
import { z } from "zod";
import { CreateSubscriptionType } from "@/types/index";

const SubscriptionSchema = z.object({
  ownerId: z.string(),
  planVersionId: z.string(),
  cycle: z.enum(["monthly", "annual"]),
  priceAtPurchase: z.number(),
  discountApplied: z.number()
});

export async function POST(req: NextRequest) {
  return withValidationAndErrorHandling("POST", req, SubscriptionSchema, async (data: CreateSubscriptionType) => {
    const result = await SubscriptionRepository.create(data);
    return NextResponse.json({ success: true, subscription: result });
  });
}
