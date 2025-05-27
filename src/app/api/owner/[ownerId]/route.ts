// src/app/api/owners/[ownerId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OwnerRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';

export async function GET(
    req: NextRequest,
    context: { params: { ownerId: string } }
) {
    return getWithErrorHandling(
        req,
        async () => {
            const { ownerId } = context.params;
            const data = await OwnerRepository.findById(ownerId)
            return NextResponse.json(data);
        });
}
