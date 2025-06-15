// src/app/api/calendar/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getWithErrorHandling, getRequiredQueryParam } from '@/services/apiService';
import { CalendarRepository } from '@/repos/index';
import { RepositoryError } from '@/types/lib';
import { cookies } from 'next/headers';

// GET /api/calendar/events?ownerId=...
export async function GET(req: NextRequest) {
    const options = {
        cookies: await cookies()
    };

    return getWithErrorHandling(
        req,
        async () => {
            const ownerId = getRequiredQueryParam(req, 'ownerId');

            try {
                const events = await CalendarRepository.getEventsByOwnerId(ownerId, options);
                return NextResponse.json({ success: true, events });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Error desconocido al obtener eventos del calendario";
                console.error(`Repository error for owner ${ownerId}:`, errorMessage);
                throw new RepositoryError(errorMessage);
            }
        }
    );
}