// src/repositories/vaccine.repository.ts
import { dbClient } from '@/lib/auth';
import type { VaccineDataType } from '@/types/index';
import { FormRepository, RepositoryOptions } from '@/types/lib';

export default class VaccineRepository implements FormRepository<VaccineDataType> {
    async createAll(vaccines: VaccineDataType[], options: RepositoryOptions) {
        const { data, error } = await dbClient(options)
            .from('vaccines')
            .upsert(vaccines, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string, options: RepositoryOptions): Promise<VaccineDataType[] | null> {
        const { data, error } = await dbClient(options).from('vaccines').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string, options: RepositoryOptions) {
        try {
            const currentTimestamp = new Date().toISOString();
            await dbClient(options).from('vaccines').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
