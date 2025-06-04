// app/api/basic-data/[petId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { BasicDataRepository } from '@/repos/index'
import { getWithErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { BasicDataTypeSchema } from '@/schemas/validationSchemas';
import { BasicDataType } from '@/types/index';
import { RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ petId: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { petId } = await params;
            const data = await BasicDataRepository.findByPetId(petId, options);
    console.log('findByPetId data', data);
            return NextResponse.json(data);
        });
}

export async function POST(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    return withValidationAndErrorHandling(
        'POST',
        req,
        BasicDataTypeSchema,
        async (basicData) => {
            try {
                const { data, error } = await BasicDataRepository.upsert(basicData as BasicDataType, options);
                if (error) {
                    return NextResponse.json(
                        { success: false, message: `Error upserting record: ${error.message}` },
                        { status: 500 }
                    )
                }
                return NextResponse.json(data, { status: 201 });
            }
            catch {
                throw new RepositoryError("Error upserting record");
            }
        }
    )
}