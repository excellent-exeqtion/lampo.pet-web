// app/components/modals/side-bar.tsx
"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    FaBars,
    FaCloudSun,
    FaCog,
    FaCut,
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
import { FaPencil } from "react-icons/fa6";
import { Empty } from "@/data/index";
import { CircularImage } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";

export default function SideBar({
    menuOpen,
    setMenuOpen,
    setShowEditPetModal
}: {
    menuOpen: boolean;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    setShowEditPetModal: Dispatch<SetStateAction<boolean>>;
}) {
    const { isMobile } = useDeviceDetect()
    const { logout, storedPet, session, storedVetAccess, setStoredVetAccess } = useAppContext();
    const [menuItems, setMenuItems] = useState<MenuType[]>([]);
    const router = useRouter();

    const menuData = (show: boolean, session: AppSession | null | undefined, vetAccess: VeterinaryAccessType): MenuType[] => [
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
    useEffect(() => {
        const menu = menuData(storedPet.id != "", session, storedVetAccess);

        if (storedPet) {
            menu.push({ label: 'Editar Mascota', icon: <FaPencil />, url: "", showModal: setShowEditPetModal, show: isOwner(session) });
        }
        setMenuItems(menu);
    }, [storedPet, session, storedVetAccess, setShowEditPetModal]);

    const goToLogin = () => {
        setStoredVetAccess(Empty.VetAccess());
        router.push("/pages/login");
    }

    function item({ label, icon, url, show, showModal }: MenuType) {
        if (showModal) {
            return (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                    <a onClick={() => showModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {icon} {label}
                    </a>
                </li>
            );
        }
        else if (!show) {
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
        <>
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
                        <CircularImage
                            src={storedPet.image || "/pets/pet.png"}
                            width={80} />
                        <p style={{ marginLeft: '20px' }}><b>{storedPet.name ?? 'Nombre de tu mascota'}</b></p>
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(({ label, icon, url, show, showModal }) => item({ label, icon, url, show, showModal }))}
                            {session && <li><button onClick={logout}>Cerrar sesión</button></li>}
                            {!session && <li><button onClick={goToLogin}>Iniciar sesión</button></li>}
                        </ul>
                    </nav>
                    <div style={{ display: "flow", justifyContent: "space-around", marginTop: "1rem" }}>
                        <Image
                            loading={"lazy"}
                            src="/others/play-store.png" alt="Google Play"
                            width="120" height="100" style={{ width: "220px", height: "auto" }} />
                        <br />
                        <br />
                        <Image
                            loading={"lazy"}
                            src="/others/app-store.png" alt="App Store"
                            width="120" height="100" style={{ width: "220px", height: "auto" }} />
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
                        <CircularImage
                            src={storedPet.image || "/pets/pet.png"}
                            width={60} borderSize="3px" />
                        <span style={{ fontSize: "1rem", fontWeight: "600" }}>{storedPet.name}</span>
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
                        {menuItems.map(({ label, icon, url, show, showModal }) => item({ label, icon, url, show, showModal }))}
                        {session && <li><button onClick={logout}>Cerrar sesión</button></li>}
                        {!session && <li><button onClick={goToLogin}>Iniciar sesión</button></li>}
                    </ul>
                </nav>
            )}
        </>
    );
}
