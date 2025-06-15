// src/components/calendar/CalendarEvent.tsx
import React from 'react';
import { FaBirthdayCake, FaSyringe, FaStethoscope, FaFlask, FaPaw } from 'react-icons/fa';
import { CalendarEventType } from "@/types/index";

interface CustomEventProps {
    event: CalendarEventType;
}

const eventIcons: Record<CalendarEventType['event_type'], React.ReactNode> = {
    birthday: <FaBirthdayCake />,
    consultation: <FaStethoscope />,
    vaccine: <FaSyringe />,
    lab_test: <FaFlask />,
    treatment: <FaPaw />,
};

export default function CalendarEvent({ event }: CustomEventProps) {
    return (
        <div style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center', gap: '0.5em' }}>
            <span style={{ color: 'var(--pico-primary)' }}>{eventIcons[event.event_type]}</span>
            <span>
                <strong>{event.pet_name}:</strong> {event.title}
            </span>
        </div>
    );
}
