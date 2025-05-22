import { supabase } from '@/lib/client/supabase';
import type { LabTestDataType } from '@/types/index';

export default class LabTestRepository {
    static async create(test: LabTestDataType) {
        return supabase.from('lab_tests').insert(test);
    }

    static async createAll(tests: LabTestDataType[]) {
        const { data, error } = await supabase
            .from('lab_tests')
            .upsert(tests, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    static async findByParentId(parent_id: string): Promise<LabTestDataType[] | null> {
        const { data, error } = await supabase.from('lab_tests').select('*').eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    static async update(test: LabTestDataType) {
        return supabase.from('lab_tests').update(test).eq('id', test.id);
    }

    static async delete(id: string) {
        await supabase.from('lab_tests').delete().eq('id', id);
    }
}
