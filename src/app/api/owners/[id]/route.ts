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

            try {
                const ownerData = await OwnerRepository.findById(id);
                if (!ownerData) {
                    throw new RepositoryError(`Owner no encontrado: ${id}`);
                }
                return NextResponse.json(ownerData);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                throw new RepositoryError(`Error fetching owner: ${error.message}`);
            }
        }
    );
}
