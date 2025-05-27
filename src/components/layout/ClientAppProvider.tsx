// components/ClientAppProvider.tsx
"use client";
import React, { useState, useEffect, useMemo, createContext, useContext } from "react";
import { useSession as useRawSession } from "@/hooks/useSession";
import { useAppStorage } from "@/hooks/useAppStorage";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/services/authService";
import { PetRepository } from "@/repos/index";
import { AppSession } from "@/types/lib";
import { isOwner, isVetWithoutUserSession } from "@/services/roleService";
import { Empty } from "@/data/index";
import { Bubbles, Loading, SideBar } from "@/components/index";
import { LoginPage } from "@/pages/index";
import { AppContextType } from "@/context/AppContextType";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { emptyStorage } from "@/context/StorageContextType";

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
    const { isMobile } = useDeviceDetect();

    const [menuOpen, setMenuOpen] = useState(false);
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
                    const pets = await PetRepository.findByOwnerId(ownerId);
                    storageContext.setStoredOwnerPets(pets);
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
        await signOut();
        storageContext.setStoredPet(Empty.Pet());
        storageContext.setStoredOwnerPets([]);
        storageContext.setStoredVetAccess(Empty.VetAccess());
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
                <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} setShowEditPetModal={setShowEditPetModal} />
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
                <main style={{ padding: "1rem" }}>{children}</main>
            </div>
        </AppContext.Provider>
    );
}