// src/app/api/veterinarians/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withValidationAndErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';
import type { VeterinarianType } from '@/types/index';
import { VeterinarianTypeSchema } from '@/schemas/validationSchemas';
import VeterinarianRepository from '@/repos/veterinarian.repository';
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const options = {
    cookies: await cookies()
  }

    return withValidationAndErrorHandling(
        'POST',
        req,
        VeterinarianTypeSchema,
        async (vetData: VeterinarianType) => {
            try {
                const { data, error } = await VeterinarianRepository.create(vetData, options);
                if (error) {
                    console.log(error);
                    throw new RepositoryError(
                        `Error creating veterinarian: ${JSON.stringify(vetData)}`
                    );
                }
                return NextResponse.json(data, { status: 201 });
            } catch (err) {
                console.log(err);
                throw new RepositoryError('Error creating veterinarian');
            }
        }
    );
}
