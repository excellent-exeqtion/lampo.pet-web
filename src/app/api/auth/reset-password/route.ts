// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/services/authService';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { z } from 'zod';
import { LogInType } from '@/types/lib';

const ResetSchema = z.object({
    email: z.string().email()
});

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling('POST', req, ResetSchema, async ({ email }: LogInType) => {
        const { data, error } = await resetPassword(email);
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, message: 'Correo de recuperación enviado', data });
    });
}
