// app/api/pets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { BasicDataRepository } from '@/repos/index';
import { BasicDataType } from '@/types/index';
import { BasicDataTypeSchema } from '@/schemas/validationSchemas';

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
