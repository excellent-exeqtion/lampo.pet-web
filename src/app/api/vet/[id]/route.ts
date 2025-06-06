// src/app/api/vet/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import VeterinarianRepository from '@/repos/veterinarian.repository';
import { getWithErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { QueryParamError, RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";
import { VeterinarianType } from '@/types/index';
import { VeterinarianTypeSchema } from '@/schemas/validationSchemas';
import { createServerClient } from '@/lib/auth';

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


export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const options = {
        cookies: await cookies()
    }
    const serverClient = await createServerClient(options.cookies);

    return withValidationAndErrorHandling(
        'PUT',
        req,
        VeterinarianTypeSchema, // Usamos el schema existente para validar el payload completo
        async (vetData: VeterinarianType) => {
            const { id } = await context.params;

            // Verificación de seguridad: el usuario logueado solo puede modificar su propio perfil.
            const { data: { user } } = await serverClient.getUser();
            if (!user || user.id !== id) {
                return NextResponse.json({ success: false, message: 'No autorizado para modificar este perfil.' }, { status: 403 });
            }

            // Aseguramos que el vet_id del payload sea el correcto
            vetData.vet_id = id;

            try {
                const { error } = await VeterinarianRepository.update(vetData, options);

                if (error) {
                    throw new RepositoryError(`Error actualizando veterinario: ${error.message}`);
                }

                // Devolvemos el objeto actualizado para que el frontend pueda usarlo
                return NextResponse.json({ success: true, veterinarian: vetData }, { status: 200 });

            } catch (err) {
                if (err instanceof Error) {
                    throw new RepositoryError(err.message);
                }
                throw new RepositoryError('Error desconocido al actualizar el veterinario');
            }
        }
    );
}