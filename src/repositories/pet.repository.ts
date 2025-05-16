// lib/repositories/pet.repository.ts
import { supabase } from "@/lib/client/supabase";
import { PetType } from "@/types/index";

export class PetRepository {
  /** Busca la mascota por ID */
  static async findById(id: string): Promise<PetType | null> {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  /** Actualiza campos de la mascota */
  static async updateById(
    id: string,
    updates: Partial<Pick<PetType, "image" | "name">>
  ): Promise<void> {
    const { error } = await supabase
      .from("pets")
      .update(updates)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  /** Retorna la primera mascota del owner, o null */
  static async findByOwnerId(ownerId: string, pet_id: string): Promise<{ id: string } | null> {
    const { data, error } = await supabase
      .from("pets")
      .select("id")
      .eq("owner_id", ownerId)
      .eq("id", pet_id);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    // Devolvemos la primera mascota (puedes adaptar si quieres soportar varias)
    return data[0];
  }

  static async getPetsForUser(owner_id: string): Promise<PetType[]> {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", owner_id);

    if (error) throw error;
    return data as PetType[];
  }
}
