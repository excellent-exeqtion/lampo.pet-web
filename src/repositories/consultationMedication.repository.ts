// src/repos/consultationMedication.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { ConsultationMedicationType } from '@/types/index';

export default class ConsultationMedicationRepository {
    static async createAll(
        consultationId: string,
        medications: Omit<ConsultationMedicationType, 'id' | 'consultation_id' | 'created_at'>[]
    ): Promise<{ data: ConsultationMedicationType[] | null; error: Error | null }> {
        const medicationsToInsert = medications.map(med => ({
            ...med,
            consultation_id: consultationId,
        }));

        try {
            const { data, error } = await supabase
                .from('consultation_medications')
                .insert(medicationsToInsert)
                .select();

            if (error) throw error;
            return { data, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationMedicationRepository.createAll:', error);
            return { data: null, error };
        }
    }

    static async findByConsultationId(consultationId: string): Promise<{ data: ConsultationMedicationType[] | null; error: Error | null }> {
        try {
            const { data, error } = await supabase
                .from('consultation_medications')
                .select('*')
                .eq('consultation_id', consultationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationMedicationRepository.findByConsultationId:', error);
            return { data: null, error };
        }
    }
     static async delete(medicationId: string): Promise<{ error: Error | null }> {
        try {
            const { error } = await supabase
                .from('consultation_medications')
                .delete()
                .eq('id', medicationId);

            if (error) throw error;
            return { error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationMedicationRepository.delete:', error);
            return { error };
        }
    }
}