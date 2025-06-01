// src/repos/consultationProcedure.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { ConsultationProcedureType } from '@/types/index';

export default class ConsultationProcedureRepository {
    static async createAll(
        consultationId: string,
        procedures: Omit<ConsultationProcedureType, 'id' | 'consultation_id' | 'created_at'>[]
    ): Promise<{ data: ConsultationProcedureType[] | null; error: Error | null }> {
        const proceduresToInsert = procedures.map(proc => ({
            ...proc,
            consultation_id: consultationId,
        }));

        try {
            const { data, error } = await supabase
                .from('consultation_procedures')
                .insert(proceduresToInsert)
                .select();

            if (error) throw error;
            return { data, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationProcedureRepository.createAll:', error);
            return { data: null, error };
        }
    }

    static async findByConsultationId(consultationId: string): Promise<{ data: ConsultationProcedureType[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('consultation_procedures')
                .select('*')
                .eq('consultation_id', consultationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationProcedureRepository.findByConsultationId:', error);
            return { data: null, error };
        }
    }

    static async delete(procedureId: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase
                .from('consultation_procedures')
                .delete()
                .eq('id', procedureId);

            if (error) throw error;
            return { error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationProcedureRepository.delete:', error);
            return { error };
        }
    }
}