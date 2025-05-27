// src/app/api/auth/sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/services/authService';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { z } from 'zod';
import { LogInType } from '@/types/lib';

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling('POST', req, SignInSchema, async ({ email, password }: LogInType) => {
        const { data, error } = await signIn(email, password!);
        if (error) {
            return NextResponse.json({ success: false, message: error.message }, { status: 401 });
        }
        return NextResponse.json({ success: true, session: data.session, user: data.user });
    });
}