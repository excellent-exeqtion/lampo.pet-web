// repos/plan.repository.ts
import { supabase } from '@/lib/client/supabase';
import { PlanVersionType } from '../types/index';

export class PlanRepository {
  /**
   * Trae todas las versiones vigentes (effective_to IS NULL)
   */
  static async getAllCurrent(): Promise<PlanVersionType[]> {
    const { data, error } = await supabase
      .from('plans_versions')
      .select(`
        id,
        plan_id,
        version,
        title,
        description,
        price_month,
        price_year,
        discount_month,
        discount_year,
        features,
        effective_from,
        effective_to,
        plans (
          slug
        )
      `)
      .eq('effective_to', null)

    if (error) throw error
    // Mapear para llevar slug al root
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => ({
      ...row,
      slug: row.plans.slug
    }))
  }

  /**
   * Busca la versión actual de un plan por su slug
   */
  static async getBySlug(slug: string): Promise<PlanVersionType | null> {
    const { data, error } = await supabase
      .from('plans_versions')
      .select(`
        id,
        plan_id,
        version,
        title,
        description,
        price_month,
        price_year,
        discount_month,
        discount_year,
        features,
        effective_from,
        effective_to,
        plans (
          slug
        )
      `)
      .eq('effective_to', null)
      .eq('plans.slug', slug)
      .overrideTypes<PlanVersionType[], { merge: false }>()

    if (error) {
      if (error.code === 'PGRST116') return null // sin datos
      throw error
    }

    return {
      ...data[0],
      slug: data[0].plans.slug
    }
  }

  /**
   * Trae todas las versiones históricas de un plan
   */
  static async getVersions(planId: number): Promise<PlanVersionType[]> {
    const { data, error } = await supabase
      .from('plans_versions')
      .select('*')
      .eq('plan_id', planId)
      .order('version', { ascending: false })

    if (error) throw error
    return data
  }
}
