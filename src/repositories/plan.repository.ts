// src/repositories/plan.repository.ts
import { PlanVersionType } from '../types/index';
import { dbClient } from '@/lib/auth';
import { RepositoryOptions } from '@/types/lib';

export default class PlanRepository {
  /**
   * Trae todas las versiones vigentes (effective_to IS NULL)
   */
  static async getAllCurrent(options: RepositoryOptions): Promise<PlanVersionType[]> {
    const { data, error } = await dbClient(options)
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
      .is('effective_to', null)

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
  static async getBySlug(slug: string, options: RepositoryOptions): Promise<PlanVersionType | null> {
    //TODO: Review  .overrideTypes<PlanVersionType[], { merge: false }>()
    const { data, error } = await dbClient(options)
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
      .is('effective_to', null)
      .eq('plans.slug', slug)

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
  static async getVersions(planId: number, options: RepositoryOptions): Promise<PlanVersionType[]> {
    const { data, error } = await dbClient(options)
      .from('plans_versions')
      .select('*')
      .eq('plan_id', planId)
      .order('version', { ascending: false })

    if (error) throw error
    return data
  }
}
