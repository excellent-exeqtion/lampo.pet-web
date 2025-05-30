// src/app/api/consultations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/repos/index';
import { getRequiredQueryParam, getWithErrorHandling, withValidationAndErrorHandling } from '@/services/apiService';
import { CreateConsultationPayloadSchema } from '@/schemas/validationSchemas';
import type { CreateConsultationPayload } from '@/types/index';
import { RepositoryError } from '@/types/lib';
import { type CookieOptions, createServerClient } from '@supabase/ssr'; // Importar createServerClient y CookieOptions
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

const supabase = (cookieStore: ReadonlyRequestCookies) => createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                // Cuando Supabase llama a esto en una Route Handler,
                // está indicando que una cookie necesita ser establecida en la RESPUESTA.
                // La instancia de `cookieStore` aquí puede ser usada para esto.
                try {
                    cookieStore.set(name, value, options); // Correcto para la respuesta
                    // O si la API de cookieStore requiere un objeto:
                    // cookieStore.set({ name, value, ...options });
                } catch (error) {
                    console.error(`SSR Error (Route Handler): Failed to set cookie ${name}`, error);
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    // Para eliminar, establece el valor a vacío y usa las opciones para expirar.
                    cookieStore.set(name, '', options); // Correcto para la respuesta
                    // O si la API de cookieStore requiere un objeto:
                    // cookieStore.set({ name, value: '', ...options });
                } catch (error) {
                    console.error(`SSR Error (Route Handler): Failed to remove cookie ${name}`, error);
                }
            },
        },
    }
);

// POST /api/consultations : Crear una nueva consulta
export async function POST(req: NextRequest) {

    const cookieStore = await cookies(); // De next/headers

    return withValidationAndErrorHandling(
        'POST',
        req,
        CreateConsultationPayloadSchema,
        async (payload: CreateConsultationPayload) => {
            const { data: { session }, error: sessionError } = await supabase(cookieStore).auth.getSession();

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

            const { data, error } = await ConsultationRepository.create(payload);
            if (error || !data) {
                console.error(`Error creando consulta desde API: ${error?.message || 'No data returned'}`);
                throw new RepositoryError(`Error creando consulta: ${error?.message || 'No data returned'}`);
            }
            return NextResponse.json({ success: true, consultation: data }, { status: 201 });
        }
    );
}

// GET /api/consultations?petId=mascota123 : Listar consultas de una mascota
export async function GET(req: NextRequest) {

    return getWithErrorHandling(
        req,
        async () => {
            // Ejemplo de protección de ruta GET:
            // const { data: { session } } = await supabase.auth.getSession();
            // if (!session) {
            //     return NextResponse.json({ success: false, message: 'No autenticado para ver consultas.' }, { status: 401 });
            // }

            const petId = getRequiredQueryParam(req, 'petId');
            const { data, error } = await ConsultationRepository.findByPetId(petId);

            if (error) {
                throw new RepositoryError(`Error obteniendo consultas para la mascota ${petId}: ${error.message}`);
            }
            return NextResponse.json({ success: true, consultations: data || [] });
        }
    );
}