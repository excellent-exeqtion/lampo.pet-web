// app/repos/veterinaryAccess.repository.ts
import { supabase } from "@/lib/client/supabase";
import { VeterinaryAccess } from "../types";
import { PetCodeRepository } from "./petCode.repository";

export class VeterinaryAccessRepository {
    /** Registra un nuevo acceso de veterinario */
    static async create(access: Omit<
        VeterinaryAccess,
        "id" | "created_at"
    >): Promise<VeterinaryAccess> {
        const { data, error } = await supabase
            .from("veterinary_accesses")
            .insert(access)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    /** Obtiene datos de acceso por código (para validaciones o historial) */
    static async findByCodeAndByPetId(
        code: string,
        pet_id: string
    ): Promise<VeterinaryAccess | null> {
        try {
            const petCode = await PetCodeRepository.find(code);
            if (!petCode) return null;
            const { data, error } = await supabase
                .from("veterinary_accesses")
                .select("*")
                .eq("pet_code_id", petCode.id)
                .eq("pet_id", pet_id)


            if (error) throw new Error(error.message);
            if (!data || data.length === 0) return null;
            return data[0];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (errCode: any) {
            if (errCode) throw new Error(errCode.message);
            return null;
        }

    }
}
