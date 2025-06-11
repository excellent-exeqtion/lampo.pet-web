// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    // Creamos una respuesta para poder manipular las cookies
    const response = NextResponse.json({ success: true, message: 'Logout successful' });

    // Eliminamos la cookie de acceso de veterinario
    response.cookies.delete('lampo-vet-access');

    return response;
}