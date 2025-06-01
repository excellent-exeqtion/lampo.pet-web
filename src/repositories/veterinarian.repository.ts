// src/repositories/veterinarian.repository.ts
import { supabase } from '@/lib/auth/supabase/browserClient';
import type { VeterinarianType } from '@/types/index';

export default class VeterinarianRepository {
    /** Inserta un nuevo veterinario */
    static async create(vet: VeterinarianType) {
        return supabase.from('veterinarians').insert(vet);
    }

    /** Busca un veterinario por su ID */
    static async findById(vet_id: string): Promise<VeterinarianType | null> {
        if (!vet_id) return null;
        const { data, error } = await supabase
            .from('veterinarians')
            .select('*')
            .eq('vet_id', vet_id);
        if (error) throw new Error(error.message);
        return data && data.length > 0 ? data[0] : null;
    }

    /** Actualiza todos los campos de un veterinario */
    static async update(vet: VeterinarianType) {
        return supabase
            .from('veterinarians')
            .update(vet)
            .eq('vet_id', vet.vet_id);
    }

    /** Elimina un veterinario por su ID */
    static async delete(vet_id: string) {
        return supabase
            .from('veterinarians')
            .delete()
            .eq('vet_id', vet_id);
    }
}
