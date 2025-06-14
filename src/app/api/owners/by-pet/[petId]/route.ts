// src/app/api/owners/by-pét/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OwnerRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ petId: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { petId } = await context.params;
            if (!petId) {
                throw new QueryParamError(`Falta parámetro PetId`);
            }

            const ownerData = await OwnerRepository.findByPetId(petId, options);
            if (!ownerData) {
                throw new RepositoryError(`Owner no encontrado para el petId: ${petId}`);
            }
            return NextResponse.json(ownerData);
        }
    );
}
