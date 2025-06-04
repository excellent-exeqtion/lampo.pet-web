// src/app/api/veterinarians/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import VeterinarianRepository from '@/repos/veterinarian.repository';
import { getWithErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const { id } = await context.params;
            if (!id) {
                throw new QueryParamError('Falta parámetro VeterinarianId');
            }

            const vetData = await VeterinarianRepository.findById(id, options);
            if (!vetData) {
                throw new RepositoryError(`Veterinario no encontrado: ${id}`);
            }
            return NextResponse.json(vetData);
        }
    );
}
