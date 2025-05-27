// app/api/basic-data/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BasicDataRepository } from '@/repos/index'
import { getWithErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { BasicDataTypeSchema } from '@/schemas/validationSchemas';
import { BasicDataType } from '@/types/index';

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

export async function POST(req: NextRequest) {
    return withValidationAndErrorHandling(
        'POST',
        req,
        BasicDataTypeSchema,
        async (basicData) => {
            const { data, error } = await BasicDataRepository.upsert(basicData as BasicDataType)
            if (error) {
                return NextResponse.json(
                    { success: false, message: error.message },
                    { status: 500 }
                )
            }
            return NextResponse.json(data, { status: 201 })
        }
    )
}