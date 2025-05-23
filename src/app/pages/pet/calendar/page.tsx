// app/calendar/page.tsx (server component)
"use client";
import { Title } from "@/components/index";
import React from "react";
import { FaCalendar } from "react-icons/fa";

export default function CalendarPage() {
    return (
        <div style={{ width: "100%" }}>
            {<Title icon={<FaCalendar />} title="Próximos eventos programados" />}
            <section style={{ width: "100%", marginBottom: "2rem" }}>
                {/* <input type="date" value="2025-01-01" /> */}
            </section>

            <section>
                <h3>Datos de contacto</h3>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(120px, auto))",
                        gap: "0.5rem",
                        alignItems: "center",
                        marginBottom: "1rem",
                        fontSize: "0.8rem"
                    }}
                >
                    <select>
                        <option>Last 12 months</option>
                        <option>Last 6 months</option>
                    </select>
                    <input type="date" defaultValue="2020-08-01" />
                    <span style={{ textAlign: "center" }}>a</span>
                    <input type="date" defaultValue="2020-07-07" />
                    <select>
                        <option>Previous period</option>
                    </select>
                    <select>
                        <option>Monthly</option>
                    </select>
                    <button>Edit charts</button>
                </div>
            </section>
        </div>
    );
}