// src/repositories/condition.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { ConditionDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class ConditionRepository implements FormRepository<ConditionDataType> {
    async createAll(conditions: ConditionDataType[]) {
        const { data, error } = await supabase
            .from('conditions')
            .upsert(conditions, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string): Promise<ConditionDataType[] | null> {
        const { data, error } = await supabase.from('conditions').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string) {
        try {
            const currentTimestamp = new Date().toISOString();
            await supabase.from('conditions').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}
