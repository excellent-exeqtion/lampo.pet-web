// app/components/modals/side-bar.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
    FaBars,
    FaTimes
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from "@/app/layout";
import { menuData, PetsData } from '@/data/petdata';
import { LibComponents } from "@/lib/components";

export default function SidebarModule({
    menuOpen,
    setMenuOpen
}: {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { isMobile, logout, session, selectedPet, setSelectedPet } = useAppContext();

    const menuItems = menuData;

    const ownersPets = PetsData.filter(x => x.owner_id == session?.db?.user.id);

    if(ownersPets.length == 0){
        return (<LibComponents.Loading />);
    }

    const petDropdown = () => {
        if (ownersPets.length == 1) {
            return (
                <p>{ownersPets[0].name}</p>
            );
        }
        else {
            return (
                <select
                    value={selectedPet?.id}
                    onChange={(e) => setSelectedPet(ownersPets.filter(x => x.id == e.target.value)[0])}
                    style={{ border: 'none', paddingLeft: '0' }}
                    className="pet-dropdown"
                >
                    {ownersPets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {pet.name}
                        </option>
                    ))}
                </select>
            );
        }
    }

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
                        <Image
                            src={selectedPet?.image ?? '/pets/pet.png'}
                            alt="profile"
                            width={80}
                            height={80}
                            style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }}
                        />
                        {petDropdown()}
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(({ label, icon, url }) => (
                                <li key={label} style={{ marginBottom: "0.5rem" }}>
                                    <Link href={url} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {icon} {label}
                                    </Link>
                                </li>
                            ))}
                            <li><button onClick={logout}>Cerrar sesión</button></li>
                        </ul>
                    </nav>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
                        <Image src="/others/google-play-badge-logo.svg" alt="Google Play" width={120} height={40} />
                        <Image src="/others/download-on-the-app-store-apple-logo.svg" alt="App Store" width={120} height={40} />
                    </div>
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
                        <Image
                            src={selectedPet?.image ?? '/pets/pet.png'}
                            alt="profile"
                            width={80}
                            height={80}
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>{selectedPet?.name}</span>
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
                        {menuItems.map(({ label, icon, url }) => (
                            <li key={label} style={{ marginBottom: "0.5rem" }}>
                                <Link href={url} style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                                    {icon} {label}
                                </Link>
                            </li>
                        ))}
                        <li><button onClick={logout}>Cerrar sesión</button></li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
