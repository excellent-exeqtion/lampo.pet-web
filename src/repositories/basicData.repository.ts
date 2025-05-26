// src/repositories/basicData.repository.ts
import { supabase } from '@/lib/client/supabase';
import type { BasicDataType } from '@/types/index';

export default class BasicDataRepository {
  static async upsert(basicData: BasicDataType) {
    const { data, error } = await supabase.from('basic_data')
      .upsert(basicData, { onConflict: 'pet_id' })
      .select();

    if (error) console.error('Upsert failed:', error);
    else console.log('Upserted rows:', data);
    return { data, error };
  }

  static async findByPetId(pet_id: string): Promise<BasicDataType | null> {
    const { data, error } = await supabase.from('basic_data').select('*').eq('pet_id', pet_id);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    return data[0];
  }

  static async update(data: BasicDataType) {
    return supabase.from('basic_data').update(data).eq('pet_id', data.pet_id);
  }
}
