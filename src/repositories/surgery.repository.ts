import { supabase } from '@/lib/client/supabase';
import type { SurgeryDataType } from '@/types/index';

export class SurgeryRepository {
    static async create(surgery: SurgeryDataType) {
        return supabase.from('surgeries').insert(surgery);
    }

    static async findByPet(pet_id: string): Promise<SurgeryDataType[] | null> {
        const { data, error } = await supabase.from('surgeries').select('*').eq('pet_id', pet_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(surgery: SurgeryDataType) {
        return supabase.from('surgeries').update(surgery).eq('id', surgery.id);
    }

    static async delete(id: string) {
        return supabase.from('surgeries').delete().eq('id', id);
    }
}
