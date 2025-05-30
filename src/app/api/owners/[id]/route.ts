// src/app/api/owners/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OwnerRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await context.params;
            if (!id) {
                throw new QueryParamError(`Falta parámetro OwnerId`);
            }

            const ownerData = await OwnerRepository.findById(id);
            if (!ownerData) {
                throw new RepositoryError(`Owner no encontrado: ${id}`);
            }
            return NextResponse.json(ownerData);
        }
    );
}
