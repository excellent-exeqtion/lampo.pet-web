// app/api/basic-data/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BasicDataRepository } from '@/repos/index'
import { getWithErrorHandling } from '@/services/apiService';

export async function GET(
    req: NextRequest,
    { params }: { params: { petId: string } }
) {
    return getWithErrorHandling(
        req,
        async () => {
            const { petId } = params;
            const data = await BasicDataRepository.findByPetId(petId)
            return NextResponse.json(data);
        });
}
