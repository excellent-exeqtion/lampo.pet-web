// src/app/api/validar-matricula/route.ts

import { NextRequest, NextResponse } from 'next/server';
import ComvezcolRepository from '@/repos/comvezcol.repository'; // Importa el nuevo repositorio

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { matricula } = body as { matricula?: string };

        if (!matricula || typeof matricula !== 'string') {
            return NextResponse.json({ message: 'El campo "matricula" es requerido.' }, { status: 400 });
        }

        // Llama al método del repositorio
        const { data, error } = await ComvezcolRepository.validate(matricula);

        if (error) {
            // El repositorio ya nos da el mensaje y el status adecuado
            return NextResponse.json({ message: error.message }, { status: error.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (e) {
        // Captura errores inesperados que no sean del repositorio
        console.error("Error inesperado en el handler:", e);
        return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }
}