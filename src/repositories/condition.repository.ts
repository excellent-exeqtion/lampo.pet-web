import { supabase } from '@/lib/client/supabase';
import type { ConditionDataType } from '@/types/index';

export class ConditionRepository {
    static async create(condition: ConditionDataType) {
        return supabase.from('conditions').insert(condition);
    }

    static async createAll(conditions: ConditionDataType[]) {
        const { data, error } = await supabase
            .from('conditions')
            .upsert(conditions, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
    }

    static async findByPet(pet_id: string): Promise<ConditionDataType[] | null> {
        const { data, error } = await supabase.from('conditions').select('*').eq('pet_id', pet_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(condition: ConditionDataType) {
        return supabase.from('conditions').update(condition).eq('id', condition.id);
    }

    static async delete(id: string) {
        return supabase.from('conditions').delete().eq('id', id);
    }
}
