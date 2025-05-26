// app/api/owner/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { OwnerRepository } from '@/repos/index';
import type { OwnerDataType } from '@/types/index';

// GET /api/owner?userId=... : obtiene datos del dueño
export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
        return NextResponse.json({ error: 'Falta parámetro userId' }, { status: 400 });
    }

    try {
        const ownerData = await OwnerRepository.findById(userId);
        if (!ownerData) {
            return NextResponse.json({ error: 'Owner no encontrado' }, { status: 404 });
        }
        return NextResponse.json({ owner: ownerData });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching owner:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/owner : crea o actualiza datos del dueño
export async function PUT(request: NextRequest) {
    try {
        const payload: OwnerDataType = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ownerId = (payload as any).owner_id;
        if (!ownerId) {
            return NextResponse.json({ error: 'El campo owner_id es requerido' }, { status: 400 });
        }

        const existing = await OwnerRepository.findById(ownerId);
        if (existing) {
            await OwnerRepository.update(payload);
        } else {
            await OwnerRepository.create(payload);
        }

        const saved = await OwnerRepository.findById(ownerId);
        return NextResponse.json({ owner: saved });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error upserting owner:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}
