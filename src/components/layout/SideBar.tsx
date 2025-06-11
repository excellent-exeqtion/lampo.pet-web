// app/components/layout/SideBar.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
    FaBars,
    FaCalendar,
    FaCloudSun,
    FaCog,
    FaCut,
    FaFlask,
    FaHome,
    FaPills,
    FaPowerOff,
    //TODO: actualizar para menu de actualizar plan
    //FaRocket,
    FaSyringe,
    FaUser
} from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import { MenuType } from "@/types/lib";
import { v4 } from 'uuid';
import { useRouter } from "next/navigation";
import { FaPencil, FaUserDoctor } from "react-icons/fa6";
import { Empty } from "@/data/index";
import { CircularImage } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { useUI } from "@/context/UIProvider";
import { useStorageContext } from "@/context/StorageProvider";
import { handleLogout } from "@/services/authService";
import { useSessionContext } from "@/context/SessionProvider";
import { useRoleContext } from "@/context/RoleProvider";
import { FaPlusCircle } from 'react-icons/fa';

export default function SideBar() {
    const { isMobile, isTablet, isDesktop } = useDeviceDetect();
    const { db: session, isLoading: isLoadingSession } = useSessionContext();
    const storage = useStorageContext();
    const [menuItems, setMenuItems] = useState<MenuType[]>([]);
    const router = useRouter();
    const { setShowEditPetModal } = useUI();
    const { isOwner, isVet, isVetWithSession } = useRoleContext();

    const menuData = (show: boolean): MenuType[] => [
        { label: "Inicio", icon: <FaHome />, url: "/pages/home", show: isOwner || isVetWithSession },
        { label: "Calendario", icon: <FaCalendar />, url: "/pages/owner/calendar", show: isOwner },
        { label: "Datos básicos", icon: <FaUser />, url: "/pages/pet/basic-data", show },
        { label: "Consultas veterinarias", icon: <FaUserDoctor />, url: `/pages/pet/consultations/${storage.storedPet.id}`, show },
        { label: "Vacunas", icon: <FaSyringe />, url: "/pages/pet/vaccines", show },
        { label: "Cirugías", icon: <FaCut />, url: "/pages/pet/surgeries", show },
        { label: "Medicinas", icon: <FaPills />, url: "/pages/pet/medicines", show },
        { label: "Condiciones especiales", icon: <FaCloudSun />, url: "/pages/pet/conditions", show },
        { label: "Lab. de exámenes", icon: <FaFlask />, url: "/pages/pet/lab-tests", show },
        //TODO: modal para actualizar el plan
        //{ label: "Mejora tu plan", icon: <FaRocket />, url: "/pages/owner/upgrade", show: isOwner },
        { label: "Configuración", icon: <FaCog />, url: "/pages/owner/settings", show: isOwner },
        { label: "Configuración", icon: <FaCog />, url: "/pages/vet/settings", show: isVetWithSession },
        { label: 'Editar Mascota', icon: <FaPencil />, url: "", showModal: setShowEditPetModal, show: isOwner && show },
        { label: "Agregar Consulta", icon: <FaPlusCircle />, url: `/pages/vet/consultation/${storage.storedPet.id}`, show: isVet && show },
    ];
    useEffect(() => {
        const menu = menuData(storage.storedPet.id != "");
        setMenuItems(menu);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storage.storedPet, storage.storedOwnerPets, session, storage.storedVetAccess, setShowEditPetModal, isVetWithSession]);

    const goToLogin = () => {
        storage.setStoredVetAccess(Empty.VetAccess());
        router.push("/login");
    }

    if (menuItems.filter(m => m.show).length == 0 || isLoadingSession) {
        return <></>;
    }

    function item({ label, icon, url, show, showModal }: MenuType) {
        if (!show) {
            return <div key={v4()}></div>;
        }
        else if (showModal) {
            return (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                    <a onClick={() => showModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {icon} {label}
                    </a>
                </li>
            );
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
                        backgroundColor: "var(--primary-inverse)",
                        boxShadow: "0 4px 12px var(--primary-lighttransparent)",
                    }}
                >
                    <div style={{ padding: "0 1rem 1rem", display: 'flex', alignItems: 'center' }}>
                        <CircularImage
                            src={storage.storedPet.image || "/pets/pet.jpg"}
                            width={80}
                        />
                        <p style={{ marginLeft: '20px' }}>
                            <b>{storage.storedPet.name ?? 'Nombre de tu mascota'}</b>
                        </p>
                    </div>
                    <nav style={{ padding: "0 1rem" }}>
                        <ul>
                            {menuItems.map(item)}
                            {session && <li><a style={{ background: "none", border: "none", color: 'var(--primary-red)' }} onClick={() => handleLogout(storage, router)}> <FaPowerOff style={{ marginRight: '1rem' }} />Cerrar sesión</a></li>}
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
                        backgroundColor: "var(--primary-inverse)",
                        boxShadow: "2px 0 8px var(--primary-lighttransparent)",
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
                        <CircularImage src={storage.storedPet.image || "/pets/pet.jpg"} width={50} borderSize="2px" />
                        <span style={{ fontSize: "1rem", textAlign: "center", padding: "0 4px" }}><b>{storage.storedPet.name}</b></span>
                    </div>

                    {/* Íconos con tooltip */}
                    {menuItems.filter(m => m.show).map(({ label, icon, url, showModal }) => {
                        const content = (
                            <div className="tooltip-container" style={{ fontSize: "1.75rem", cursor: "pointer" }}>
                                {icon}
                                <span className="tooltip-text tooltip-right">{label}</span>
                            </div>
                        );

                        if (showModal) {
                            return (
                                <button
                                    key={label}
                                    onClick={() => showModal(true)}
                                    style={{ background: "none", border: "none", color: 'var(--pico-primary)', padding: '0' }}
                                >
                                    {content}
                                </button>
                            );
                        } else {
                            return (
                                <Link
                                    key={label}
                                    href={url}
                                    style={{ display: "flex", justifyContent: "center", alignItems: "center", color: 'var(--pico-primary)' }}
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
                                onClick={session ? () => handleLogout(storage, router) : goToLogin}
                                style={{ background: "none", border: "none", fontSize: "1.75rem", color: 'var(--primary-red)' }}
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
