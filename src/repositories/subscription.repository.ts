// src/repositories/subscription.repository.ts
import { supabase } from '@/lib/client/supabase';
import { CreateSubscriptionType, SubscriptionType } from '@/types/index';


export default class SubscriptionRepository {
    /**
     * Crea una suscripción en estado pending
     */
    static async create(params: CreateSubscriptionType): Promise<SubscriptionType | null> {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert([{
                owner_id: params.ownerId,
                plan_version_id: params.planVersionId,
                cycle: params.cycle,
                status: 'pending',
                price_at_purchase: params.priceAtPurchase,
                discount_applied: params.discountApplied
            }])
            .select()

        if (error) throw error
        if (!data || data.length === 0) return null;
        return data[0];
    }

    /**
     * Obtiene la suscripción activa de un owner
     */
    static async getActiveByOwner(ownerId: string): Promise<SubscriptionType | null> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('owner_id', ownerId)
            .eq('status', 'active')

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
    static async getByOwner(ownerId: string): Promise<SubscriptionType[] | null> {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('owner_id', ownerId)
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
    }): Promise<SubscriptionType | null> {
        const { data, error } = await supabase
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
