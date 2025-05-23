import { supabase } from '@/lib/client/supabase';
import type { LabTestDataType } from '@/types/index';
import { FormRepository } from '@/types/lib';

export default class LabTestRepository implements FormRepository<LabTestDataType> {
    static async create(test: LabTestDataType) {
        return supabase.from('lab_tests').insert(test);
    }

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
        const { data, error } = await supabase.from('lab_tests').select('*').eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(test: LabTestDataType) {
        return supabase.from('lab_tests').update(test).eq('id', test.id);
    }

    async delete(id: string) {
        await supabase.from('lab_tests').delete().eq('id', id);
    }
}
