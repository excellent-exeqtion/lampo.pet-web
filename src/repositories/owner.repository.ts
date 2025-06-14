// src/repositories/owner.repository.ts
import { createBrowserClient, dbClient } from '@/lib/auth';
import type { OwnerDataType } from '@/types/index';
import { RepositoryOptions } from '@/types/lib';

export default class OwnerRepository {
    static async create(owner: OwnerDataType) {
        return createBrowserClient().from('owners').insert(owner);
    }

    static async findById(owner_id: string, options: RepositoryOptions): Promise<OwnerDataType | null> {
        if (owner_id == undefined) {
            return null;
        }
        const { data, error } = await dbClient(options).from('owners').select('*').eq('owner_id', owner_id);
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) return null;
        return data[0];
    }

    static async findByPetId(pet_id: string, options: RepositoryOptions): Promise<OwnerDataType | null> {
        if (!pet_id) return null;
        // Join: pets → owners
        const { data, error } = await dbClient(options)
            .from('pets')
            .select('owner_id, owners:owner_id(*)')
            .eq('id', pet_id);

        if (error) throw new Error(error.message);
        if (!data || data.length === 0 || !data[0].owners) return null;
        return data[0].owners as OwnerDataType;
    }

    static async update(owner: OwnerDataType, options: RepositoryOptions) {
        return dbClient(options).from('owners').update(owner).eq('owner_id', owner.owner_id);
    }

    static async delete(owner_id: string, options: RepositoryOptions) {
        return dbClient(options).from('owners').delete().eq('owner_id', owner_id);
    }
}
