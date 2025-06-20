// src/app/api/consultations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/repos/index';
import { getRequiredQueryParam, getWithErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { CreateConsultationPayloadSchema } from '@/schemas/validationSchemas';
import type { CreateConsultationPayload } from '@/types/index';
import { RepositoryError } from '@/types/lib';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/auth';

// POST /api/consultations : Crear una nueva consulta
export async function POST(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    const serverClient = await createServerClient(options.cookies);

    return withValidationAndErrorHandling(
        'POST',
        req,
        CreateConsultationPayloadSchema,
        async (payload: CreateConsultationPayload) => {
            const { data: { session }, error: sessionError } = await serverClient.getSession();

            if (sessionError) {
                console.error("Error obteniendo sesión en API:", sessionError);
                return NextResponse.json({ success: false, message: 'Error de autenticación al obtener sesión.' }, { status: 401 });
            }

            if (!payload.veterinarian_id && !payload.veterinary_access_id) {
                if (session?.user?.user_metadata?.role === 'veterinarian') {
                    payload.veterinarian_id = session.user.id;
                } else {
                    console.warn("Intento de crear consulta sin vet_id o vet_access_id, y sin sesión de veterinario.");
                    return NextResponse.json(
                        { success: false, message: 'Se requiere veterinarian_id o veterinary_access_id válido.' },
                        { status: 403 }
                    );
                }
            }

            // *** LA CORRECCIÓN CLAVE ESTÁ AQUÍ ***
            // Desestructuramos la respuesta del repositorio correctamente.
            const { data: consultation, error } = await ConsultationRepository.create(payload, options);

            // Verificamos tanto el error como si los datos son nulos.
            if (error || !consultation) {
                console.error(`Error creando consulta desde API: ${error?.message || 'No data returned'}`);
                throw new RepositoryError(`Error creando consulta: ${error?.message || 'No data returned'}`);
            }

            const {data, error: errorGet } = await ConsultationRepository.findByPetId(payload.pet_id, options);

            // Verificamos tanto el error como si los datos son nulos.
            if (errorGet || !data) {
                console.error(`Error trayendo la ultima consulta creada desde API: ${errorGet?.message || 'No data returned'}`);
                throw new RepositoryError(`Error trayendo la ultima consulta creada: ${errorGet?.message || 'No data returned'}`);
            }

            // Enviamos el objeto 'consultation' limpio en la respuesta.
            return NextResponse.json({ success: true, consultation: data[0] }, { status: 201 });
        }
    );
}

// GET /api/consultations?petId=mascota123 : Listar consultas de una mascota
export async function GET(req: NextRequest) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(
        req,
        async () => {
            const petId = getRequiredQueryParam(req, 'petId');
            const { data: consultations, error } = await ConsultationRepository.findByPetId(petId, options);

            if (error) {
                throw new RepositoryError(`Error obteniendo consultas para la mascota ${petId}: ${error.message}`);
            }
            return NextResponse.json({ success: true, consultations: consultations || [] });
        }
    );
}