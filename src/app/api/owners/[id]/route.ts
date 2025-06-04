// src/app/api/owners/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OwnerRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await context.params;
            if (!id) {
                throw new QueryParamError(`Falta parámetro OwnerId`);
            }

            const ownerData = await OwnerRepository.findById(id, options);
            if (!ownerData) {
                throw new RepositoryError(`Owner no encontrado: ${id}`);
            }
            return NextResponse.json(ownerData);
        }
    );
}
