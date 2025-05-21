import { supabase } from '@/lib/client/supabase';
import type { VaccineDataType } from '@/types/index';

export class VaccineRepository {
    static async create(vaccine: VaccineDataType) {
        return supabase.from('vaccines').insert(vaccine);
    }

    static async createAll(vaccines: VaccineDataType[]) {
        const { data, error } = await supabase
            .from('vaccines')
            .upsert(vaccines, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    static async findByPet(pet_id: string): Promise<VaccineDataType[] | null> {
        const { data, error } = await supabase.from('vaccines').select('*').eq('pet_id', pet_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(vaccine: VaccineDataType) {
        return supabase.from('vaccines').update(vaccine).eq('id', vaccine.id);
    }

    static async delete(id: string) {
        return supabase.from('vaccines').delete().eq('id', id);
    }
}
