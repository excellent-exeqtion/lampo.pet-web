// app/api/owners/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { OwnerRepository } from '@/repos/index';
import type { OwnerDataType } from '@/types/index';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { OwnerDataTypeSchema } from '@/schemas/validationSchemas';
import { RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

// PUT /api/owner : crea o actualiza datos del dueño
export async function PUT(request: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    try {
        const payload: OwnerDataType = await request.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ownerId = (payload as any).owner_id;
        if (!ownerId) {
            return NextResponse.json({ error: 'El campo owner_id es requerido' }, { status: 400 });
        }

        const existing = await OwnerRepository.findById(ownerId, options);
        if (existing) {
            await OwnerRepository.update(payload, options);
        } else {
            await OwnerRepository.create(payload, options);
        }

        const saved = await OwnerRepository.findById(ownerId, options);
        return NextResponse.json({ owner: saved });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error upserting owner:', error);
        return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    return withValidationAndErrorHandling(
        'POST',
        req,
        OwnerDataTypeSchema,
        async (ownerData: OwnerDataType) => {
            try {
                const { data, error } = await OwnerRepository.create(ownerData, options);
                if (error) {
                    throw new RepositoryError(`Error creating record: ${JSON.stringify(ownerData)}`);
                }
                return NextResponse.json(data, { status: 201 });
            }
            catch {
                throw new RepositoryError("Error creating record");
            }
        }
    )
}