// src/app/api/plans/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repos/index";
import { withValidationAndErrorHandling } from "@/services/apiService";
import { CreateSubscriptionType } from "@/types/index";
import { cookies } from "next/headers";
import { SubscriptionInsertSchema } from "@/schemas/validationSchemas";

export async function POST(req: NextRequest) {
  const options = {
    cookies: await cookies()
  }

  return withValidationAndErrorHandling("POST", req, SubscriptionInsertSchema, async (data: CreateSubscriptionType) => {
    const result = await SubscriptionRepository.create(data, options);
    return NextResponse.json({ success: true, subscription: result });
  });
}
