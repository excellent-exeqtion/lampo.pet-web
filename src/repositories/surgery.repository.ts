// src/repositories/surgery.repository.ts
import { supabase } from '@/lib/client/supabase';
import type { SurgeryDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class SurgeryRepository implements FormRepository<SurgeryDataType> {
    async createAll(surgeries: SurgeryDataType[]) {
        const { data, error } = await supabase
            .from('surgeries')
            .upsert(surgeries, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string): Promise<SurgeryDataType[] | null> {
        const { data, error } = await supabase.from('surgeries').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string) {
        try {
            const currentTimestamp = new Date().toISOString();
            await supabase.from('surgeries').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
