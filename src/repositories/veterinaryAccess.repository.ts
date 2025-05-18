// app/repos/veterinaryAccess.repository.ts
import { supabase } from "@/lib/client/supabase";
import { VeterinaryAccess } from "../types";

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
  static async findByCode(
    code: string
  ): Promise<VeterinaryAccess | null> {
    const { data, error } = await supabase
      .from("veterinary_accesses")
      .select("*")
      .eq("code", code)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
