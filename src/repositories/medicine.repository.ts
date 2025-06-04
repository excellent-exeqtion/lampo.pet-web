// src/repositories/medicine.repository.ts
import { dbClient } from '@/lib/auth';
import type { MedicineDataType } from '@/types/index';
import { FormRepository, RepositoryOptions } from '@/types/lib';

export default class MedicineRepository implements FormRepository<MedicineDataType> {
    async createAll(medicines: MedicineDataType[], options: RepositoryOptions) {
        const { data, error } = await dbClient(options)
            .from('medicines')
            .upsert(medicines, { onConflict: 'id' })
            .select();

        if (error) console.error('Upsert failed:', error);
        else console.log('Upserted rows:', data);
        return { data, error };
    }

    async findByParentId(parent_id: string, options: RepositoryOptions): Promise<MedicineDataType[] | null> {
        const { data, error } = await dbClient(options).from('medicines').select('*').eq('deleted', false).eq('pet_id', parent_id);
        if (error) throw new Error(error.message);
        if (!data) return null;
        return data;
    }

    async delete(id: string, options: RepositoryOptions) {
        try {
            const currentTimestamp = new Date().toISOString();
            await dbClient(options).from('medicines').update({ deleted: true, deleted_at: currentTimestamp }).eq('id', id);
            return true;
        }
        catch {
            return false;
        }
    }
}
