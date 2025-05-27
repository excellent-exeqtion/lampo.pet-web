// src/app/api/owner/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OwnerRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';

export async function GET(
    req: NextRequest,
    context: { params: { ownerId: string } }
) {
    return getWithErrorHandling(
        req,
        async () => {

            const { ownerId } = context.params;
            if (!ownerId) {
                throw new QueryParamError(`Falta parámetro OwnerId`);
            }

            try {
                const ownerData = await OwnerRepository.findById(ownerId);
                if (!ownerData) {
                    throw new RepositoryError(`Owner no encontrado: ${ownerId}`);
                }
                return NextResponse.json({ owner: ownerData });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                throw new RepositoryError(`Error fetching owner: ${error.message}`);
            }
        }
    );
}
