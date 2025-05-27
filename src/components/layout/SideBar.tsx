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
    FaPowerOff,
    FaRocket,
    FaSyringe,
    FaTimes,
    FaUser
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { AppSession, MenuType } from "@/types/lib";
import { v4 } from 'uuid';
import { useRouter } from "next/navigation";
import { VeterinaryAccessType } from "@/types/index";
import { isOwner, isVet } from "@/services/roleService";
import { FaPencil } from "react-icons/fa6";
import { Empty } from "@/data/index";
import { CircularImage } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useAppContext } from "./ClientAppProvider";

export default function SideBar({
    setShowEditPetModal
}: {
    setShowEditPetModal: Dispatch<SetStateAction<boolean>>;
}) {
    const { isMobile, isTablet, isDesktop } = useDeviceDetect()
    const { logout, storageContext, session } = useAppContext();
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
        const menu = menuData(storageContext.storedPet.id != "", session, storageContext.storedVetAccess);

        if (storageContext.storedPet) {
            menu.push({ label: 'Editar Mascota', icon: <FaPencil />, url: "", showModal: setShowEditPetModal, show: isOwner(session) });
        }
        setMenuItems(menu);
    }, [storageContext.storedPet, session, storageContext.storedVetAccess, setShowEditPetModal]);

    const goToLogin = () => {
        storageContext.setStoredVetAccess(Empty.VetAccess());
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
            {/* Desktop Sidebar */}
            {isDesktop && (
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
                            src={storageContext.storedPet.image || "/pets/pet.jpg"}
                            width={80}
                        />
                        <p style={{ marginLeft: '20px' }}>
                            <b>{storageContext.storedPet.name ?? 'Nombre de tu mascota'}</b>
                        </p>
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(item)}
                            {session && <li><a style={{ background: "none", border: "none", color: '#d32f2f' }} onClick={logout}> <FaPowerOff style={{ marginRight: '1rem' }} />Cerrar sesión</a></li>}
                            {!session && <li><button onClick={goToLogin}>Iniciar sesión</button></li>}
                        </ul>
                    </nav>
                    <div style={{ display: "flow", justifyContent: "space-around", marginTop: "1rem" }}>
                        <Image src="/others/play-store.png" alt="Google Play" width="120" height="100" style={{ width: "220px", height: "auto" }} />
                        <br /><br />
                        <Image src="/others/app-store.png" alt="App Store" width="120" height="100" style={{ width: "220px", height: "auto" }} />
                    </div>
                </aside>
            )}

            {/* Mobile Sidebar */}
            {(isMobile || isTablet) && (
                <aside
                    style={{
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: "64px",
                        backgroundColor: "#ffffff",
                        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: "1rem",
                        gap: "1rem"
                    }}
                >
                    {/* Foto y nombre */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <CircularImage src={storageContext.storedPet.image || "/pets/pet.jpg"} width={50} borderSize="2px" />
                        <span style={{ fontSize: "1rem", textAlign: "center", padding: "0 4px" }}><b>{storageContext.storedPet.name}</b></span>
                    </div>

                    {/* Íconos con tooltip */}
                    {menuItems.filter(m => m.show).map(({ label, icon, url, showModal }) => {
                        const content = (
                            <div className="tooltip-container" style={{ fontSize: "1.75rem", cursor: "pointer" }}>
                                {icon}
                                <span className="tooltip-text">{label}</span>
                            </div>
                        );

                        if (showModal) {
                            return (
                                <button
                                    key={label}
                                    onClick={() => showModal(true)}
                                    style={{ background: "none", border: "none", color: '#02659a', padding: '0' }}
                                >
                                    {content}
                                </button>
                            );
                        } else {
                            return (
                                <Link
                                    key={label}
                                    href={url}
                                    style={{ display: "flex", justifyContent: "center", alignItems: "center", color: '#02659a' }}
                                >
                                    {content}
                                </Link>
                            );
                        }
                    })}

                    {/* Logout/Login */}
                    <div style={{ position: 'fixed', bottom: "0", marginBottom: "1rem" }}>
                        <div className="tooltip-container" style={{ cursor: "pointer" }}>
                            <button
                                onClick={session ? logout : goToLogin}
                                style={{ background: "none", border: "none", fontSize: "1.75rem", color: '#d32f2f' }}
                            >
                                {session ? <FaPowerOff /> : <FaBars />}
                            </button>
                            <span className="tooltip-text tooltip-right">{session ? "Cerrar sesión" : "Iniciar sesión"}</span>
                        </div>
                    </div>
                </aside>
            )}
        </>
    );
}
