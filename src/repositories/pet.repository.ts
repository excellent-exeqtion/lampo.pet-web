// lib/repositories/pet.repository.ts
import { supabase } from "@/lib/client/supabase";
import { PetType } from "@/types/index";

export class PetRepository {
static async create(data: PetType) {
    return supabase.from('pets').insert(data);
  }

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

  /** Verifica que el usuario loggeado y la mascota seleccionada se encuentren en la base de datos  */
  static async findByOwnerIdAndPetId(ownerId: string, pet_id: string): Promise<{ id: string } | null> {
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

  /** Retorna la primera mascota del owner, o null */
  static async findByOwnerId(ownerId: string): Promise<PetType[] | null> {
    const { data, error } = await supabase
      .from("pets")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    // Devolvemos la primera mascota (puedes adaptar si quieres soportar varias)
    return data;
  }
}
