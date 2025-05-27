// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/services/authService";
import { withErrorHandling } from "@/services/apiService";

export async function GET(req: NextRequest) {
    return withErrorHandling("GET", req, async () => {
        const { data, error } = await getSession();
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        return NextResponse.json({ success: true, session: data.session });
    });
}
