// lib/repositories/pet.repository.ts
import { supabase } from "@/lib/db/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { Pet } from ".";


export class PetRepository {
  /** Busca la mascota por ID */
  static async findById(id: string): Promise<Pet | null> {
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
    updates: Partial<Pick<Pet, "image" | "name">>
  ): Promise<void> {
    const { error } = await supabase
      .from("pets")
      .update(updates)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }

  /** Busca la mascota del owner autenticado */
  static async findByOwnerId(ownerId: string): Promise<Pick<Pet, "pet_id"> | null> {
    const { data, error }: {data: Pet | null, error: PostgrestError | null } = await supabase
      .from("pets")
      .select("id")
      .eq("owner_id", ownerId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
}
