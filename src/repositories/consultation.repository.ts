// src/repos/consultation.repository.ts
import { dbClient } from '@/lib/auth';
import type { ConsultationType, CreateConsultationPayload } from '@/types/index';
import { RepositoryOptions } from '@/types/lib';

export default class ConsultationRepository {
    static async create(payload: CreateConsultationPayload, options: RepositoryOptions): Promise<{ data: ConsultationType | null; error: Error | null }> {
        // Separar los campos principales para el JSONB y los arrays
        const {
            pet_id,
            veterinarian_id,
            veterinary_access_id,
            procedures,
            medications,
            ...consultation_data_fields
        } = payload;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mainConsultDataForRPC: { [key: string]: any } = {};
        const typeFields = [ // Lista de campos definidos en consultation_input_type
            'p_consultation_date', 'p_consultation_time', 'p_hc_number', 'p_institution_name',
            'p_reason_for_consultation', 'p_current_diet', 'p_previous_illnesses', 'p_previous_surgeries',
            'p_vaccination_history', 'p_last_deworming_product', 'p_recent_treatments', 'p_recent_travels',
            'p_animal_behavior_owner_description', 'p_lives_with_other_animals_details',
            'p_sterilized_status', 'p_birth_count', 'p_body_condition_score', 'p_temperature_celsius',
            'p_heart_rate_bpm', 'p_respiratory_rate_rpm', 'p_capillary_refill_time_sec', 'p_pulse_description',
            'p_mucous_membranes_description', 'p_hydration_percentage_description', 'p_sense_organs_description',
            'p_skin_and_coat_description', 'p_lymph_nodes_description', 'p_digestive_system_findings',
            'p_respiratory_system_findings', 'p_endocrine_system_findings', 'p_musculoskeletal_system_findings',
            'p_nervous_system_findings', 'p_urinary_system_findings', 'p_reproductive_system_findings',
            'p_rectal_palpation_findings', 'p_other_physical_findings', 'p_problem_list',
            'p_master_problem_list', 'p_differential_diagnoses', 'p_complementary_exams_summary',
            'p_presumptive_diagnosis', 'p_definitive_diagnosis', 'p_therapeutic_plan', 'p_prognosis',
            'p_evolution_notes', 'p_general_observations', 'p_signature_confirmation'
        ];

        for (const key of typeFields) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const value = (consultation_data_fields as any)[key.replace('p_', '')];
            if (value === undefined || value === '') {
                if (['p_birth_count', 'p_body_condition_score', 'p_temperature_celsius', /* otros numéricos/fecha */].includes(key) && value === '') {
                    mainConsultDataForRPC[key] = null;
                } else if (value === undefined) {
                    mainConsultDataForRPC[key] = null;
                } else {
                    mainConsultDataForRPC[key] = value;
                }
            } else {
                mainConsultDataForRPC[key] = value;
            }
        }

        const proceduresForRPC = procedures?.map(p => ({
            procedure_name: p.procedure_name,
            description: p.description ?? null
        })) || [];

        const medicationsForRPC = medications?.map(m => ({
            medication_name: m.medication_name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration_days: m.duration_days ?? null,
            notes: m.notes ?? null
        })) || [];

        const rpcParams = {
            p_pet_id: pet_id,
            p_veterinarian_id: veterinarian_id || null,
            p_veterinary_access_id: veterinary_access_id || null,
            p_consultation_main_data: mainConsultDataForRPC,
            p_procedures: proceduresForRPC,
            p_medications: medicationsForRPC
        };

        try {
            const { data, error } = await dbClient(options).rpc('insert_consultation_with_type', rpcParams);

            if (error) throw error;

            return { data: data as ConsultationType, error: null };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationRepository.create (RPC call):', error);
            return { data: null, error: new Error(error.message || 'RPC call to insert_consultation_with_type failed') };
        }
    }

    // ... (los métodos findByPetId y findById no cambian) ...
    static async findByPetId(petId: string, options: RepositoryOptions): Promise<{ data: ConsultationType[] | null; error: Error | null }> {
        try {
            const { data, error } = await dbClient(options)
                .from('consultations')
                .select(`
                *,
                procedures:consultation_procedures(*),
                medications:consultation_medications(*),
                files:consultation_files(*)
            `)
                .eq('pet_id', petId)
                .order('consultation_date', { ascending: false, nullsFirst: false })
                .order('consultation_time', { ascending: false, nullsFirst: false });


            if (error) throw error;
            return { data, error: null };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationRepository.findByPetId:', error);
            return { data: null, error };
        }
    }

    static async findById(consultationId: string, options: RepositoryOptions): Promise<{ data: ConsultationType | null; error: Error | null }> {
        try {
            const { data, error } = await dbClient(options)
                .from('consultations')
                .select(`
                *,
                procedures:consultation_procedures(*),
                medications:consultation_medications(*),
                files:consultation_files(*)
            `)
                .eq('id', consultationId)
                .single();

            if (error) throw error;
            return { data, error: null };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error in ConsultationRepository.findById:', error);
            return { data: null, error };
        }
    }
}