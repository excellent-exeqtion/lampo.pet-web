import { supabase } from '@/lib/client/supabase';
import type { SurgeryDataType } from '@/types/index';

export class SurgeryRepository {
    static async create(surgery: SurgeryDataType) {
        return supabase.from('surgeries').insert(surgery);
    }

    static async createAll(surgeries: SurgeryDataType[]) {
        const { data, error } = await supabase
            .from('surgeries')
            .upsert(surgeries, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    static async findByParentId(parent_id: string): Promise<SurgeryDataType[] | null> {
        const { data, error } = await supabase.from('surgeries').select('*').eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(surgery: SurgeryDataType) {
        return supabase.from('surgeries').update(surgery).eq('id', surgery.id);
    }

    static async delete(id: string) {
        await supabase.from('surgeries').delete().eq('id', id);
    }
}
