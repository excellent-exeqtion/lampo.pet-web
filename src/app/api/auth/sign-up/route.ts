// src/app/api/auth/sign-up/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ownerSignUp } from '@/services/authService';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { z } from 'zod';
import { LogInType } from '@/types/lib';

const SignUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['owner', 'veterinarian']).optional().nullable()
});

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling('POST', req, SignUpSchema, async ({ email, password, role }: LogInType) => {
        const { data, error } = await ownerSignUp(email, password!, role ?? 'owner');
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, user: data.user });
    });
}
