// src/app/api/auth/sign-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setSession, signIn } from '@/services/authService';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { z } from 'zod';
import { LogInType } from '@/types/lib';

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling('POST', req, SignInSchema, async ({ email, password }: LogInType) => {
        // signIn lanza si hay error, y retorna la Session directamente
        const { data } = await signIn(email, password!);
        if (data) {
            // Persistimos la sesión en cookies HTTP-only
            await setSession(data.session);
            // Respondemos con la sesión (o con session.user si quieres exponer solo al usuario)
            return NextResponse.json({ success: true, session: data.session });
        }
        return NextResponse.json({ success: false });
    });
}
