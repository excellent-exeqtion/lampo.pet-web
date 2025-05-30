// src/app/api/consultations/[consultationId]/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConsultationFileRepository } from '@/repos/index';
import { getWithErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf', 'image/webp', 'image/gif'];

// POST /api/consultations/{consultationId}/files : Subir un archivo a una consulta
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ consultationId: string }> }
) {
    return getWithErrorHandling(req, async () => {
        const { consultationId } = await params;
        if (!consultationId) {
            return NextResponse.json({ success: false, message: 'consultationId es requerido' }, { status: 400 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const petId = formData.get('petId') as string | null; // Necesario para la ruta del archivo

        if (!file) {
            return NextResponse.json({ success: false, message: 'Archivo no proporcionado' }, { status: 400 });
        }
        if (!petId) {
            return NextResponse.json({ success: false, message: 'petId no proporcionado en el FormData' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ success: false, message: `El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / (1024 * 1024)}MB` }, { status: 413 });
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return NextResponse.json({ success: false, message: `Tipo de archivo no permitido. Permitidos: ${ALLOWED_FILE_TYPES.join(', ')}` }, { status: 415 });
        }
        
        const supabase = createServerComponentClient({ cookies });
        const { data: { user } } = await supabase.auth.getUser();
        const uploadedByUserId = user?.id;

        const { data, error } = await ConsultationFileRepository.uploadAndCreateRecord(
            consultationId,
            petId,
            file,
            uploadedByUserId
        );

        if (error || !data) {
            throw new RepositoryError(`Error subiendo archivo: ${error?.message || 'No data returned'}`);
        }
        return NextResponse.json({ success: true, file: data }, { status: 201 });
    });
}

// GET /api/consultations/{consultationId}/files : Listar archivos de una consulta
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ consultationId: string }> }
) {
    return getWithErrorHandling(
        req,
        async () => {
            const { consultationId } = await params;
            if (!consultationId) {
                return NextResponse.json({ success: false, message: 'consultationId es requerido' }, { status: 400 });
            }

            const { data, error } = await ConsultationFileRepository.findByConsultationId(consultationId);

            if (error) {
                throw new RepositoryError(`Error obteniendo archivos para consulta ${consultationId}: ${error.message}`);
            }
            return NextResponse.json({ success: true, files: data || [] });
        }
    );
}