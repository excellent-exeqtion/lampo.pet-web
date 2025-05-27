// src/app/api/auth/sign-out/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/services/authService';
import { withErrorHandling } from '@/services/apiService';

export async function POST(req: NextRequest) {
    return withErrorHandling('POST', req, async () => {
        await signOut();
        return NextResponse.json({ success: true, message: 'Sesión cerrada correctamente' });
    });
}
