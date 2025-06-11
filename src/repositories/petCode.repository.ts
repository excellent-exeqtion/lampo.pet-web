// src/repositories/petCode.repository.ts
import { createBrowserClient, dbClient } from "@/lib/auth";
import { PetCodeType } from "@/types/index";
import { RepositoryOptions } from "@/types/lib";
import { Random } from "@/utils/index";

export default class PetCodeRepository {
  /** Busca un código activo */
  static async find(code: string, options: RepositoryOptions | undefined = undefined): Promise<PetCodeType | null> {
    //TODO: Review  removal of .overrideTypes<PetCodeType[], { merge: false }>();
    const { data, error } = await (options? dbClient(options): createBrowserClient())
      .from("pet_codes")
      .select("*")
      .eq("code", code);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;
    return data[0];
  }

  /** Invalida (marca used=true) todos los códigos previos de una mascota */
  static async invalidateAll(petId: string, options: RepositoryOptions): Promise<void> {
    const { error } = await dbClient(options)
      .from("pet_codes")
      .delete()
      .eq("pet_id", petId);
    if (error) throw new Error(error.message);
  }

  /** Genera e inserta un nuevo código, devolviéndolo */
  static async create(
    petId: string,
    ttlMinutes: number, 
    options: RepositoryOptions
  ): Promise<string> {
    const code = Random.generateCode();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();
    const { error } = await dbClient(options)
      .from("pet_codes")
      .insert({ pet_id: petId, code, expires_at: expiresAt });
    if (error) throw new Error(error.message);
    return code;
  }

  /** Marca un código como usado */
  static async markUsed(code: string): Promise<void> {
    const { error } = await createBrowserClient()
      .from("pet_codes")
      .update({ used: true })
      .eq("code", code);
    if (error) throw new Error(error.message);
  }
}
