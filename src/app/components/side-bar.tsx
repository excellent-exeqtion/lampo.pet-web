"use client";
import React, { Dispatch, SetStateAction, JSX } from "react";
import {
    FaBars,
    FaTimes
} from "react-icons/fa";

export default function SidebarModule({
    isMobile,
    selectedPet,
    setSelectedPet,
    mascotas,
    menuItems,
    menuOpen,
    setMenuOpen
}: {
    isMobile: boolean;
    selectedPet: string;
    setSelectedPet: Dispatch<SetStateAction<string>>;
    mascotas: string[];
    menuItems: { label: string; icon: JSX.Element }[];
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div>
            {!isMobile && (
                <aside
                    style={{
                        width: "250px",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: "1rem",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ padding: "0 1rem 1rem" }}>
                        <img 
                            src={'/pets/camus.png'}
                            alt="profile"
                            style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }}
                        />
                        <select
                            value={selectedPet}
                            onChange={(e) => setSelectedPet(e.target.value)}
                            style={{ border: 'none', paddingLeft: '0' }}
                            className="pet-dropdown"
                        >
                            {mascotas.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(({ label, icon }) => (
                                <li key={label} style={{ marginBottom: "0.5rem" }}>
                                    <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {icon} {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            )}

            {/* Header Mobile */}
            {isMobile && (
                <header
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.5rem 1rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        zIndex: 1000
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <img
                            src={'/pets/camus.png'}
                            alt="profile"
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>{selectedPet}</span>
                    </div>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
                    >
                        {menuOpen ? <FaTimes fill="black" /> : <FaBars fill="black" />}
                    </button>
                </header>
            )}

            {/* Mobile Nav */}
            {isMobile && menuOpen && (
                <nav
                    style={{
                        position: "fixed",
                        top: "3.5rem",
                        left: 0,
                        right: 0,
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        maxHeight: "calc(100vh - 3.5rem)",
                        overflowY: "auto",
                        zIndex: 999,
                    }}
                >
                    <ul style={{ listStyle: "none", margin: 0, padding: "0.5rem 1rem" }}>
                        {menuItems.map(({ label, icon }) => (
                            <li key={label} style={{ marginBottom: "0.5rem" }}>
                                <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                                    {icon} {label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </div>
    );
}
