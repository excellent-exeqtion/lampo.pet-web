// src/repositories/pet.repository.ts
import { dbClient } from "@/lib/auth";
import { PetType } from "@/types/index";
import { RepositoryOptions } from "@/types/lib";

export default class PetRepository {
  static async upsert(pet: PetType, options: RepositoryOptions) {
    const { data, error } = await dbClient(options).from('pets')
      .upsert(pet, { onConflict: 'id' })
      .select();

    if (error) console.error('Upsert failed:', error);
    else console.log('Upserted rows:', data);
    return { data, error };
  }

  /** Busca la mascota por ID */
  static async findById(id: string, options: RepositoryOptions): Promise<PetType> {
    const { data, error } = await dbClient(options)
      .from("pets")
      .select("*")
      .eq("deleted", false)
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
  /** Busca la mascota por ID */
  static async existsById(id: string, options: RepositoryOptions): Promise<boolean> {
    const { data, error } = await dbClient(options)
      .from("pets")
      .select("*", { count: 'exact', head: true })
      .eq("deleted", false)
      .eq("id", id);
    if (error) throw new Error(error.message);
    return data != null;
  }

  /** Actualiza campos de la mascota */
  static async updateById(
    id: string,
    updates: Partial<Pick<PetType, "image" | "name">>, 
    options: RepositoryOptions
  ): Promise<boolean> {
    const { data, error } = await dbClient(options)
      .from("pets")
      .update(updates)
      .eq("id", id);
    if (error) throw new Error(error.message);
    if (!data) return false;
    return true;
  }

  /** Verifica que el usuario loggeado y la mascota seleccionada se encuentren en la base de datos  */
  static async findByOwnerIdAndPetId(ownerId: string, pet_id: string, options: RepositoryOptions): Promise<{ id: string } | null> {
    const { data, error } = await dbClient(options)
      .from("pets")
      .select("id")
      .eq("deleted", false)
      .eq("owner_id", ownerId)
      .eq("id", pet_id);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return null;

    // Devolvemos la primera mascota (puedes adaptar si quieres soportar varias)
    return data[0];
  }

  /** Retorna la primera mascota del owner, o null */
  static async findByOwnerId(ownerId: string, options: RepositoryOptions): Promise<PetType[]> {
    const { data, error } = await dbClient(options)
      .from("pets")
      .select("*")
      .eq("deleted", false)
      .eq("owner_id", ownerId);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return [];

    // Devolvemos la primera mascota (puedes adaptar si quieres soportar varias)
    return data ?? [];
  }

  /**
   * Marca una mascota como eliminada (soft delete).
   * @param id ID de la mascota a borrar
   * @returns true si la operación no falló
   */
  static async deleteById(id: string, options: RepositoryOptions): Promise<boolean> {
    const now = new Date().toISOString();
    try {
      const { error } = await dbClient(options)
        .from("pets")
        .update({ deleted: true, deleted_at: now })
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar mascota:", error);
        throw new Error(error.message);
      }
      return true;
    }
    catch {
      return false;
    }
  }
}