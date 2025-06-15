// src/repos/calendar.repository.ts
import { dbClient } from '@/lib/auth';
import { CalendarEventType } from '@/types/index';
import { RepositoryOptions } from '@/types/lib';

export default class CalendarRepository {
    /**
     * Llama a la función RPC de Supabase para obtener todos los eventos del calendario
     * para un dueño específico.
     * @param ownerId - El UUID del dueño.
     * @param options - Opciones del repositorio, incluyendo cookies para la autenticación.
     * @returns Una promesa que resuelve a un array de eventos del calendario.
     */
    static async getEventsByOwnerId(ownerId: string, options: RepositoryOptions): Promise<CalendarEventType[]> {
        if (!ownerId) {
            console.warn("getEventsByOwnerId llamado sin ownerId.");
            return [];
        }

        try {
            const { data, error } = await dbClient(options).rpc('get_calendar_events_for_owner', {
                p_owner_id: ownerId
            });

            if (error) {
                console.error('Error fetching calendar events from RPC:', error);
                throw new Error(error.message);
            }

            return data || [];
        } catch (error) {
            console.error('Exception in CalendarRepository.getEventsByOwnerId:', error);
            throw error;
        }
    }
}