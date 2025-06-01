// src/repositories/owner.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { OwnerDataType } from '@/types/index';

export default class OwnerRepository {
    static async create(owner: OwnerDataType) {
        return supabase.from('owners').insert(owner);
    }

    static async findById(owner_id: string): Promise<OwnerDataType | null> {
        if(owner_id == undefined){
            return null;
        }
        const { data, error } = await supabase.from('owners').select('*').eq('owner_id', owner_id);
        if (error) throw new Error(error.message);
        if (!data || data.length === 0) return null;
        return data[0];
    }

    static async update(owner: OwnerDataType) {
        return supabase.from('owners').update(owner).eq('owner_id', owner.owner_id);
    }

    static async delete(owner_id: string) {
        return supabase.from('owners').delete().eq('owner_id', owner_id);
    }
}
