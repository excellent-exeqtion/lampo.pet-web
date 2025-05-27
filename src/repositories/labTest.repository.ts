// src/repositories/labTest.repository.ts
import { supabase } from '@/lib/client/supabase';
import type { LabTestDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class LabTestRepository implements FormRepository<LabTestDataType> {
    async createAll(tests: LabTestDataType[]) {
        const { data, error } = await supabase
            .from('lab_tests')
            .upsert(tests, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string): Promise<LabTestDataType[] | null> {
        const { data, error } = await supabase.from('lab_tests').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string) {
        try {
            const currentTimestamp = new Date().toISOString();
            await supabase.from('lab_tests').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
