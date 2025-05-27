// components/ClientAppProvider.tsx
"use client";
import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { useSession as useRawSession } from "@/hooks/useSession";
import { useAppStorage } from "@/hooks/useAppStorage";
import { usePathname, useRouter } from "next/navigation";
import { ApiError, AppSession } from "@/types/lib";
import { isOwner, isVetWithoutUserSession } from "@/utils/roles";
import { Empty } from "@/data/index";
import { Bubbles, Loading, SideBar } from "@/components/index";
import { LoginPage } from "@/pages/index";
import { AppContextType } from "@/context/AppContextType";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { emptyStorage } from "@/context/StorageContextType";
import { getFetch } from "@/app/api";
import { PetType } from "@/types/index";

const AppContext = createContext<AppContextType>({
    session: { db: null! },
    logout: async () => { },
    storageContext: emptyStorage(),
    showEditPetModal: false
});

interface ClientAppProviderProps {
    children: React.ReactNode;
}

export const useAppContext = () => useContext(AppContext);

export default function ClientAppProvider({ children }: ClientAppProviderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const isVetRoute = pathname?.startsWith("/pages/vet/");
    const { isMobile, isDesktop } = useDeviceDetect();

    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showVetModal, setShowVetModal] = useState(false);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showChangePetModal, setShowChangePetModal] = useState(false);
    const [showAddPetModal, setShowAddPetModal] = useState(false);
    const [showEditPetModal, setShowEditPetModal] = useState(false);
    const rawSession = useRawSession();
    const [appSession, setAppSession] = useState<AppSession | null | undefined>(undefined);

    useEffect(() => {
        if (rawSession === undefined) setAppSession(undefined);
        else if (rawSession === null) setAppSession(null);
        else setAppSession({ db: rawSession });
    }, [rawSession]);

    const storageContext = useAppStorage();

    const ownerId = appSession?.db.user?.id;

    useEffect(() => {
        if (!appSession || !ownerId) return;
        (async () => {
            if (isOwner(appSession)) {
                if (storageContext.storedOwnerPets.length === 0) {
                    const response = await getFetch(`/api/owners/pets/${ownerId}`);
                    if (!response.ok) throw new ApiError(`Fallo al obtener las mascotas del dueño: ${ownerId}`);
                    const data = await response.json();
                    storageContext.setStoredOwnerPets(data as PetType[]);
                }
            }

            let initialPet = Empty.Pet();
            if (storageContext.storedOwnerPets.length > 0) initialPet = storageContext.storedOwnerPets[0];
            if (storageContext.storedPet.id) initialPet = storageContext.storedPet;
            if (JSON.stringify(initialPet) !== JSON.stringify(storageContext.storedPet)) {
                storageContext.setStoredPet(initialPet);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appSession, ownerId]);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/sign-out", { method: "POST" });
            const result = await response.json();

            if (!response.ok || !result.success) {
                console.error("Error cerrando sesión:", result.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error en logout:", err);
        }

        // Limpieza local después del logout
        storageContext.setStoredPet(Empty.Pet());
        storageContext.setStoredOwnerPets([]);
        storageContext.setStoredVetAccess(Empty.VetAccess());

        // Redirección
        window.location.href = "/";
    };


    const contextValue: AppContextType = useMemo(() => ({
        session: appSession,
        logout: handleLogout,
        storageContext,
        showEditPetModal: false,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    } as AppContextType), [appSession, storageContext]);


    if (appSession === undefined) {
        return <Loading />;
    }
    if (appSession === null && !isVetRoute) {
        return <LoginPage />;
    }
    const isVetUser = isVetWithoutUserSession(appSession, storageContext.storedVetAccess);
    if (isVetUser && !isVetRoute) {
        router.replace("/pages/vet/access");
        return null;
    }

    const cols = isMobile ? "1fr" : "300px 1fr";

    return (
        <AppContext.Provider value={contextValue}>
            <div
                className="container grid"
                style={{
                    gridTemplateColumns: cols,
                    minHeight: "100vh",
                    transition: "grid-template-columns 0.3s ease",
                    backgroundColor: "#F9FAFB",
                    fontFamily: "'Inter', sans-serif",
                    marginLeft: '2%'
                }}
            >
                <SideBar setShowEditPetModal={setShowEditPetModal} />
                <Bubbles
                    setShowCodeModal={setShowCodeModal}
                    showCodeModal={showCodeModal}
                    setShowChangePetModal={setShowChangePetModal}
                    showChangePetModal={showChangePetModal}
                    setShowVetModal={setShowVetModal}
                    showVetModal={showVetModal}
                    setShowFeedbackModal={setShowFeedbackModal}
                    showFeedbackModal={showFeedbackModal}
                    showAddPetModal={showAddPetModal}
                    setShowAddPetModal={setShowAddPetModal}
                    showEditPetModal={showEditPetModal}
                    setShowEditPetModal={setShowEditPetModal}
                />
                <main style={{ padding: "3rem", marginLeft: isMobile ? '1rem' : (isDesktop ? '5rem' : '2rem'), width: isMobile ? '100%' : (isDesktop ? '107%' : '247%') }}>{children}</main>
            </div>
        </AppContext.Provider>
    );
}