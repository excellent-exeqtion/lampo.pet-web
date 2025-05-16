import { supabase } from '@/lib/client/supabase';
import type { MedicineDataType } from '@/types/index';

export class MedicineRepository {
    static async create(medicine: MedicineDataType) {
        return supabase.from('medicines').insert(medicine);
    }

    static async findByPet(pet_id: string): Promise<MedicineDataType[] | null> {
        const { data, error } = await supabase.from('medicines').select('*').eq('pet_id', pet_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(medicine: MedicineDataType) {
        return supabase.from('medicines').update(medicine).eq('id', medicine.id);
    }

    static async delete(id: string) {
        return supabase.from('medicines').delete().eq('id', id);
    }
}
