// src/app/api/consultations/files/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConsultationFileRepository } from '@/repos/index';
import { getWithErrorHandling } from '@/services/apiService';
import { RepositoryError } from '@/types/lib';
import { cookies } from "next/headers";


// GET /api/consultations/files/{fileId}/download : Obtener URL firmada para descargar
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const options = {
        cookies: await cookies()
    }

    return getWithErrorHandling(req, async () => {
        const { fileId } = await params;
        if (!fileId) {
            return NextResponse.json({ success: false, message: 'fileId es requerido' }, { status: 400 });
        }

        // Primero, necesitamos el filePath del registro del archivo
        const { data: fileRecord, error: findError } = await ConsultationFileRepository.getFile(fileId, options);

        if (findError || !fileRecord) {
            throw new RepositoryError(`Archivo con ID ${fileId} no encontrado o error al buscarlo: ${findError?.message}`);
        }

        const { signedURL, error: urlError } = await ConsultationFileRepository.getSignedUrl(fileRecord.file_path, options);

        if (urlError || !signedURL) {
            throw new RepositoryError(`Error generando URL firmada para archivo ${fileId}: ${urlError?.message || 'No URL returned'}`);
        }
        // Opción 1: Devolver la URL para que el cliente la use
        return NextResponse.json({ success: true, downloadUrl: signedURL });

        // Opción 2: Redirigir directamente a la URL firmada (el cliente descargará el archivo)
        // return NextResponse.redirect(signedURL);
    });
}


// DELETE /api/consultations/files/{fileId} : Eliminar un archivo
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    const options = {
        cookies: await cookies()
    }
    
    return getWithErrorHandling(
        req,
        async () => {
            const { fileId } = await params;
            if (!fileId) {
                return NextResponse.json({ success: false, message: 'fileId es requerido' }, { status: 400 });
            }

            // Aquí deberías verificar permisos (RLS debería manejar esto también)
            // Por ejemplo, solo el veterinario que subió el archivo o el dueño de la mascota
            // pueden eliminarlo, o solo dentro de un tiempo límite.

            const { error } = await ConsultationFileRepository.delete(fileId, options);

            if (error) {
                throw new RepositoryError(`Error eliminando archivo ${fileId}: ${error.message}`);
            }
            return NextResponse.json({ success: true, message: 'Archivo eliminado correctamente' });
        }
    );
}