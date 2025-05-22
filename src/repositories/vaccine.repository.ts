import { supabase } from '@/lib/client/supabase';
import type { VaccineDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class VaccineRepository implements FormRepository<VaccineDataType> {
    static async create(vaccine: VaccineDataType) {
        return supabase.from('vaccines').insert(vaccine);
    }

    async createAll(vaccines: VaccineDataType[]) {
        const { data, error } = await supabase
            .from('vaccines')
            .upsert(vaccines, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string): Promise<VaccineDataType[] | null> {
        const { data, error } = await supabase.from('vaccines').select('*').eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(vaccine: VaccineDataType) {
        return supabase.from('vaccines').update(vaccine).eq('id', vaccine.id);
    }

    async delete(id: string) {
        await supabase.from('vaccines').delete().eq('id', id);
    }
}
