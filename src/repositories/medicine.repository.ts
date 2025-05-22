import { supabase } from '@/lib/client/supabase';
import type { MedicineDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class MedicineRepository implements FormRepository<MedicineDataType> {
    static async create(medicine: MedicineDataType) {
        return supabase.from('medicines').insert(medicine);
    }

    async createAll(medicines: MedicineDataType[]) {
        const { data, error } = await supabase
            .from('medicines')
            .upsert(medicines, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string): Promise<MedicineDataType[] | null> {
        const { data, error } = await supabase.from('medicines').select('*').eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(medicine: MedicineDataType) {
        return supabase.from('medicines').update(medicine).eq('id', medicine.id);
    }

    async delete(id: string) {
        await supabase.from('medicines').delete().eq('id', id);
    }
}
