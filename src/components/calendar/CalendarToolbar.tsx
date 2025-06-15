// src/components/calendar/CalendarToolbar.tsx
import React from 'react';
import { ToolbarProps, Navigate } from 'react-big-calendar';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { CalendarEventType } from "@/types/index";

export default function CalendarToolbar(toolbar: ToolbarProps<CalendarEventType>) {
    const goToBack = () => toolbar.onNavigate(Navigate.PREVIOUS);
    const goToNext = () => toolbar.onNavigate(Navigate.NEXT);
    const goToCurrent = () => toolbar.onNavigate(Navigate.TODAY);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={goToBack} className="secondary outline"><FaChevronLeft /></button>
                <button onClick={goToCurrent}>Hoy</button>
                <button onClick={goToNext} className="secondary outline"><FaChevronRight /></button>
            </div>
            <h3 style={{ margin: 0 }}>{toolbar.label}</h3>
            <div>
                {/* Aquí podrían ir los selectores de vista */}
            </div>
        </div>
    );
}
