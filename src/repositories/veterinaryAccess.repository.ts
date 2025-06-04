// src/repositories/veterinaryAccess.repository.ts
import { dbClient } from "@/lib/auth";
import { RepositoryOptions } from "@/types/lib";
import { VeterinaryAccessType } from "../types";
import PetCodeRepository from "./petCode.repository";

export default class VeterinaryAccessRepository {
    /** Registra un nuevo acceso de veterinario */
    static async create(access: Omit<
        VeterinaryAccessType,
        "id" | "created_at"
    >, options: RepositoryOptions): Promise<VeterinaryAccessType> {
        const { data, error } = await dbClient(options)
            .from("veterinary_accesses")
            .insert(access)
            .select("*")
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    /** Obtiene datos de acceso por código (para validaciones o historial) */
    static async findByCodeAndByPetId(
        code: string,
        pet_id: string, 
        options: RepositoryOptions
    ): Promise<VeterinaryAccessType | null> {
        try {
            const petCode = await PetCodeRepository.find(code, options);
            if (!petCode) return null;
            const { data, error } = await dbClient(options)
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
