// src/app/pages/owner/calendar/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, EventProps } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSessionContext } from '@/context/SessionProvider';
import { getFetch } from '@/app/api';
import { CalendarEventType } from "@/types/index";
import { Loading, Title, DataNotFound } from '@/components/index';
import { FaCalendarAlt } from 'react-icons/fa';
import CalendarEvent from '@/components/calendar/CalendarEvent';
import CalendarToolbar from '@/components/calendar/CalendarToolbar';

// Configurar moment en español
moment.locale('es');
const localizer = momentLocalizer(moment);

const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: (total: number) => `+ Ver más (${total})`,
};

export default function CalendarPage() {
    const { db: session } = useSessionContext();
    const [events, setEvents] = useState<CalendarEventType[]>([]); // Usamos el nuevo tipo aquí
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await getFetch(`/api/calendar/events?ownerId=${session.user.id}`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Error al cargar los eventos.");
                }

                // Mapeamos los datos para que sean compatibles con react-big-calendar
                const formattedEvents: CalendarEventType[] = data.events.map((event: CalendarEventType) => ({
                    ...event,
                    start: new Date(event.event_date),
                    end: new Date(event.event_date),
                    allDay: true,
                }));

                setEvents(formattedEvents);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [session]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div style={{ height: '85vh', width: '100%' }}>
            <Title icon={<FaCalendarAlt />} title="Calendario de Mascotas" />
            {error && <DataNotFound message={error} />}

            {!error && (
                <Calendar<CalendarEventType>
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    messages={messages}
                    eventPropGetter={() => ({
                        style: {
                            backgroundColor: 'var(--primary-skin)',
                            color: 'var(--pico-primary-darker)',
                            borderRadius: '4px',
                            border: 'none',
                        },
                    })}
                    components={{
                        event: (props: EventProps<CalendarEventType>) => <CalendarEvent event={props.event} />,
                        toolbar: CalendarToolbar,
                    }}
                />

            )}
        </div>
    );
}