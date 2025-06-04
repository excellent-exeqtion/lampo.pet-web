// src/repositories/basicData.repository.ts
import { dbClient } from '@/lib/auth';
import type { BasicDataType } from '@/types/index';
import { RepositoryOptions } from '@/types/lib';

export default class BasicDataRepository {
  static async upsert(basicData: BasicDataType, options: RepositoryOptions) {
    const { data, error } = await dbClient(options).from('basic_data')
      .upsert(basicData, { onConflict: 'pet_id' })
      .select();

    if (error) console.error('Upsert failed:', error);
    else console.log('Upserted rows:', data);
    return { data, error };
  }

  static async findByPetId(pet_id: string, options: RepositoryOptions): Promise<BasicDataType | null> {
    const { data, error } = await dbClient(options).from('basic_data').select('*').eq('pet_id', pet_id);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    return data[0];
  }

  static async update(data: BasicDataType, options: RepositoryOptions) {
    return dbClient(options).from('basic_data').update(data).eq('pet_id', data.pet_id);
  }
}
