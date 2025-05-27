// src/app/api/auth/set-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withValidationAndErrorHandling } from "@/services/apiService";
import { z } from "zod";
import { SetSesionType } from "@/types/lib";
import { setSession } from "@/services/authService";

const SessionSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
});

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling("POST", req, SessionSchema, async (data: SetSesionType) => {
        const { error } = await setSession(data);
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        return NextResponse.json({ success: true, message: "Sesión establecida" });
    });
}