// src/repositories/labTest.repository.ts
import { dbClient } from '@/lib/auth';
import type { LabTestDataType } from '@/types/index';
import { FormRepository, RepositoryOptions } from '@/types/lib';

export default class LabTestRepository implements FormRepository<LabTestDataType> {
    async createAll(tests: LabTestDataType[], options: RepositoryOptions) {
        const { data, error } = await dbClient(options)
            .from('lab_tests')
            .upsert(tests, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string, options: RepositoryOptions): Promise<LabTestDataType[] | null> {
        const { data, error } = await dbClient(options).from('lab_tests').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string, options: RepositoryOptions) {
        try {
            const currentTimestamp = new Date().toISOString();
            await dbClient(options).from('lab_tests').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
