// src/repositories/condition.repository.ts
import { dbClient } from '@/lib/auth';
import type { ConditionDataType } from '@/types/index';
import { FormRepository, RepositoryOptions } from '@/types/lib';

export default class ConditionRepository implements FormRepository<ConditionDataType> {
    async createAll(conditions: ConditionDataType[], options: RepositoryOptions) {
        const { data, error } = await dbClient(options)
            .from('conditions')
            .upsert(conditions, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string, options: RepositoryOptions): Promise<ConditionDataType[] | null> {
        const { data, error } = await dbClient(options).from('conditions').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string, options: RepositoryOptions) {
        try {
            const currentTimestamp = new Date().toISOString();
            await dbClient(options).from('conditions').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }
}
