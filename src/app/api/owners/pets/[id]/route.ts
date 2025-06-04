// src/app/api/owners/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PetRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await params;
            try {
                const data = await PetRepository.findByOwnerId(id, options);
                return NextResponse.json(data);
            }
            catch {
                throw new RepositoryError("Error getting pets");
            }
        });
}
