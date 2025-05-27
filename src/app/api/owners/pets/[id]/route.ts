// src/app/api/owners/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PetRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await params;
            try {
                const data = await PetRepository.findByOwnerId(id);
                return NextResponse.json(data);
            }
            catch {
                throw new RepositoryError("Error getting pets");
            }
        });
}
