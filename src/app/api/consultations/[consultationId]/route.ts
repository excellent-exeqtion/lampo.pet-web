// src/app/api/consultations/[consultationId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConsultationRepository } from '@/repos/index';
import { getWithErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';

// GET /api/consultations/{consultationId} : Obtener una consulta específica
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

            const { data, error } = await ConsultationRepository.findById(consultationId);

            if (error) {
                throw new RepositoryError(`Error obteniendo consulta ${consultationId}: ${error.message}`);
            }
            if (!data) {
                return NextResponse.json({ success: false, message: `Consulta ${consultationId} no encontrada` }, { status: 404 });
            }
            return NextResponse.json({ success: true, consultation: data });
        }
    );
}

// TODO: PATCH /api/consultations/{consultationId} : Actualizar una consulta (más complejo)
// export async function PATCH(req: NextRequest, { params }: { params: { consultationId: string } }) { ... }

// TODO: DELETE /api/consultations/{consultationId} : Eliminar una consulta (considerar RLS)
// export async function DELETE(req: NextRequest, { params }: { params: { consultationId: string } }) { ... }