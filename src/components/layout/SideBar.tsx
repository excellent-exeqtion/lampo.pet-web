// app/components/modals/side-bar.tsx
"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    FaBars,
    FaCloudSun,
    FaCog,
    FaCut,
    FaEdit,
    FaFlask,
    FaHome,
    FaPills,
    FaRocket,
    FaSyringe,
    FaTimes,
    FaUser
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { useAppContext } from "@/app/layout";
import { AppSession, MenuType } from "@/types/lib";
import { v4 } from 'uuid';
import { useRouter } from "next/navigation";
import { VeterinaryAccessType } from "@/types/index";
import { isOwner, isVet } from "@/services/roleService";

export default function SideBar({
    menuOpen,
    setMenuOpen
}: {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { isMobile, logout, selectedPet, session, storedVetAccess, setStoredVetAccess, storedPetCode, storedPet } = useAppContext();
    const router = useRouter();
    const [name, setName] = useState(selectedPet?.name);
    const [image, setImage] = useState(selectedPet?.image);

    useEffect(() => {
        setName(storedPet?.name);
        setImage(storedPet?.image);
    }, [storedPet?.name, storedPet?.image]);

    const menuData = (show: boolean, session: AppSession | null | undefined, vetAccess: VeterinaryAccessType | null): MenuType[] => [
        { label: "Inicio", icon: <FaHome />, url: "/", show: isOwner(session) },
        { label: "Datos básicos", icon: <FaUser />, url: "/pages/pet/basic-data", show },
        { label: "Vacunas", icon: <FaSyringe />, url: "/pages/pet/vaccines", show },
        { label: "Cirugías", icon: <FaCut />, url: "/pages/pet/surgeries", show },
        { label: "Medicinas", icon: <FaPills />, url: "/pages/pet/medicines", show },
        { label: "Condiciones especiales", icon: <FaCloudSun />, url: "/pages/pet/conditions", show },
        { label: "Lab. de exámenes", icon: <FaFlask />, url: "/pages/pet/lab-tests", show },
        { label: "Mejora tu plan", icon: <FaRocket />, url: "/pages/owner/upgrade", show: isOwner(session) },
        { label: "Configuraciones", icon: <FaCog />, url: "/pages/owner/settings", show: isOwner(session) },
        { label: "Agregar Consulta", icon: <FaCog />, url: "/pages/vet/diagnostic", show: isVet(session, vetAccess) }
    ];

    const menuItems = menuData(selectedPet != null, session, storedVetAccess);

    if (storedPetCode) {
        menuItems.push({ label: 'Editar Mascota', icon: <FaEdit />, url: `/pages/vet/${storedPetCode.code}`, show: isVet(session, storedVetAccess) });
    }

    const goToLogin = () => {
        setStoredVetAccess(null);
        router.push("/pages/login");
    }

    function item({ label, icon, url, show }: MenuType) {
        if (!show) {
            return <div key={v4()}></div>;
        }
        else {
            return (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                    <Link href={url} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {icon} {label}
                    </Link>
                </li>
            );
        }
    }

    return (
        <React.Fragment>
            {!isMobile && (
                <aside
                    style={{
                        width: "300px",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: "1rem",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                >
                    <div style={{ padding: "0 1rem 1rem", display: 'flex', alignItems: 'center' }}>
                        <Image
                            src={image ?? '/pets/pet.png'}
                            alt="profile"
                            width={80}
                            height={80}
                            style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }}
                        />
                        <p style={{ marginLeft: '20px' }}><b>{name ?? 'Nombre de tu mascota'}</b></p>
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(({ label, icon, url, show }) => item({ label, icon, url, show }))}
                            {session && <li><button onClick={logout}>Cerrar sesión</button></li>}
                            {!session && <li><button onClick={goToLogin}>Iniciar sesión</button></li>}
                        </ul>
                    </nav>
                    <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
                        <Image src="/others/google-play-badge-logo.svg" alt="Google Play" width={120} height={100} />
                        <Image src="/others/download-on-the-app-store-apple-logo.svg" alt="App Store" width={120} height={100} />
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
                            src={image ?? '/pets/pet.png'}
                            alt="profile"
                            width={80}
                            height={80}
                            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                        />
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>{name}</span>
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
                        {session && <li><button onClick={logout}>Cerrar sesión</button></li>}
                        {!session && <li><button onClick={goToLogin}>Iniciar sesión</button></li>}
                    </ul>
                </nav>
            )}
        </React.Fragment>
    );
}
