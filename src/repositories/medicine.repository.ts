// src/repositories/medicine.repository.ts
import { supabase } from '@/lib/client/supabase';
import type { MedicineDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class MedicineRepository implements FormRepository<MedicineDataType> {
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
        const { data, error } = await supabase.from('medicines').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string) {
        try {
            const currentTimestamp = new Date().toISOString();
            await supabase.from('medicines').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
