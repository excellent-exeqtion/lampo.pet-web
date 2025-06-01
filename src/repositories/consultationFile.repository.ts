// src/repos/consultationFile.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { ConsultationFileType } from '@/types/index';

const CONSULTATION_FILES_BUCKET = 'consultation-files'; // Define tu bucket

export default class ConsultationFileRepository {
    static async uploadAndCreateRecord(
        consultationId: string,
        petId: string, // Necesario para la ruta del archivo
        file: File,
        uploadedByUserId?: string | null
    ): Promise<{ data: ConsultationFileType | null; error: Error | null }> {
        const fileName = `${file.name}`; // Podrías añadir un timestamp o UUID para unicidad
        const filePath = `${petId}/${consultationId}/${fileName}`;

        try {
            // 1. Subir archivo a Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(CONSULTATION_FILES_BUCKET)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Crear registro en la tabla consultation_files
            const fileRecord: Omit<ConsultationFileType, 'id' | 'created_at'> = {
                consultation_id: consultationId,
                file_name: fileName,
                file_path: filePath,
                file_type: file.type,
                file_size_bytes: file.size,
                uploaded_by_user_id: uploadedByUserId || undefined,
            };

            const { data: dbData, error: dbError } = await supabase
                .from('consultation_files')
                .insert(fileRecord)
                .select()
                .single();

            if (dbError) {
                // Si falla la inserción en BD, intentar eliminar el archivo de Storage (rollback)
                await supabase.storage.from(CONSULTATION_FILES_BUCKET).remove([filePath]);
                throw dbError;
            }

            return { data: dbData, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationFileRepository.uploadAndCreateRecord:', error);
            return { data: null, error };
        }
    }

    static async findByConsultationId(consultationId: string): Promise<{ data: ConsultationFileType[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('consultation_files')
                .select('*')
                .eq('consultation_id', consultationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationFileRepository.findByConsultationId:', error);
            return { data: null, error };
        }
    }

    static async delete(fileId: string): Promise<{ error: Error | null }> {
        try {
            // 1. Obtener el path del archivo para eliminarlo de Storage
            const { data: fileRecord, error: findError } = await supabase
                .from('consultation_files')
                .select('file_path')
                .eq('id', fileId)
                .single();

            if (findError) throw findError;
            if (!fileRecord) throw new Error('File record not found for deletion.');

            // 2. Eliminar de la base de datos
            const { error: dbDeleteError } = await supabase
                .from('consultation_files')
                .delete()
                .eq('id', fileId);

            if (dbDeleteError) throw dbDeleteError;

            // 3. Eliminar de Supabase Storage
            const { error: storageDeleteError } = await supabase.storage
                .from(CONSULTATION_FILES_BUCKET)
                .remove([fileRecord.file_path]);

            // Incluso si la eliminación de storage falla, el registro en BD ya se fue.
            // Podrías loggear el error de storage.
            if (storageDeleteError) {
                console.warn('Failed to delete file from storage, but DB record removed:', storageDeleteError);
            }

            return { error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationFileRepository.delete:', error);
            return { error };
        }
    }

    /**
     * Genera una URL firmada para descargar un archivo.
     * La URL tiene un tiempo de expiración.
     */
    static async getSignedUrl(filePath: string, expiresInSeconds = 3600): Promise<{ signedURL: string | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .storage
                .from(CONSULTATION_FILES_BUCKET)
                .createSignedUrl(filePath, expiresInSeconds);

            if (error) throw error;
            return { signedURL: data?.signedUrl || null, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error creating signed URL:', error);
            return { signedURL: null, error };
        }
    }
}