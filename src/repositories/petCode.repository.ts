// lib/repositories/petCode.repository.ts

import { supabase } from "@/lib/client/supabase";
import { PetCodeType } from "@/types/index";
import { Random } from "@/utils/index";


export class PetCodeRepository {
  /** Busca un código activo */
  static async find(code: string): Promise<PetCodeType | null> {
    const { data, error } = await supabase
      .from("pet_codes")
      .select("*")
      .eq("code", code)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  /** Invalida (marca used=true) todos los códigos previos de una mascota */
  static async invalidateAll(petId: string): Promise<void> {
    const { error } = await supabase
      .from("pet_codes")
      .update({ used: true })
      .eq("pet_id", petId)
      .is("used", false);
    if (error) throw new Error(error.message);
  }

  /** Genera e inserta un nuevo código, devolviéndolo */
  static async create(
    petId: string,
    ttlMinutes: number
  ): Promise<string> {
    const code = Random.generateCode();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();
    const { error } = await supabase
      .from("pet_codes")
      .insert({ pet_id: petId, code, expires_at: expiresAt });
    if (error) throw new Error(error.message);
    return code;
  }

  /** Marca un código como usado */
  static async markUsed(code: string): Promise<void> {
    const { error } = await supabase
      .from("pet_codes")
      .update({ used: true })
      .eq("code", code);
    if (error) throw new Error(error.message);
  }
}
