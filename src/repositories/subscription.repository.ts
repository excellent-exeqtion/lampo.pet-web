// src/repositories/subscription.repository.ts
import { dbClient } from '@/lib/auth';
import { CreateSubscriptionType, SubscriptionType } from '@/types/index';
import { RepositoryOptions } from '@/types/lib';

export default class SubscriptionRepository {
    /**
     * Crea una suscripción en estado pending
     */
    static async create(params: CreateSubscriptionType, options: RepositoryOptions): Promise<SubscriptionType | null> {
        const { data, error } = await dbClient(options)
            .from('subscriptions')
            .insert([{
                user_id: params.ownerId,
                plan_version_id: params.planVersionId,
                cycle: params.cycle,
                status: params.planVersionId == parseInt(process.env.FREE_PLAN ?? "0") ? 'active' : 'pending',
                price_at_purchase: params.priceAtPurchase,
                discount_applied: params.discountApplied
            }])
            .select()

        if (error) throw error;
        if (!data || data.length === 0) return null;
        return data[0];
    }

    /**
     * Obtiene la suscripción activa de un owner
     */
    static async getActiveByOwner(ownerId: string, options: RepositoryOptions): Promise<SubscriptionType | null> {
        const { data, error } = await dbClient(options)
            .from('subscriptions')
            .select(
                `*,
                plans_versions (
                    plans (
                        slug
                    )
                )`)
            .eq('user_id', ownerId)
            .eq('status', 'active')

            console.log('subscriptions', data)
        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }
        if (!data || data.length === 0) return null;
        return data[0];
    }

    /**
     * Lista todas las suscripciones de un owner
     */
    static async getByOwner(ownerId: string, options: RepositoryOptions): Promise<SubscriptionType[] | null> {
        const { data, error } = await dbClient(options)
            .from('subscriptions')
            .select('*')
            .eq('user_id', ownerId)
            .order('started_at', { ascending: false })

        if (error) throw error
        if (!data || data.length === 0) return null;
        return data
    }

    /**
     * Actualiza el estado y fechas de una suscripción
     */
    static async updateStatus(params: {
        subscriptionId: number
        status: 'active' | 'canceled' | 'expired'
        externalId?: string
        expiresAt?: string
    }, options: RepositoryOptions): Promise<SubscriptionType | null> {
        const { data, error } = await dbClient(options)
            .from('subscriptions')
            .update({
                status: params.status,
                external_id: params.externalId,
                expires_at: params.expiresAt,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.subscriptionId)
            .select()

        if (error) throw error

        if (!data || data.length === 0) return null;
        return data[0]
    }
}
