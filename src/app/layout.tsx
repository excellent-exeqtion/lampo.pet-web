// app/layout.tsx
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Bubbles, SideBar, Loading } from "@/components/index";
import { LoginPage } from "@/pages/index";

import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "@/styles/tooltip";

import { useSession as useRawSession } from "../hooks/useSession";
import { signOut } from "../services/authService";
import { PetRepository } from "@/repos/pet.repository";
import { AppSession } from "@/types/lib/index";
import { PetCodeType, PetType, VeterinaryAccessType } from "@/types/index";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AppContextType } from "@/context/AppContextType";
import { geistMono, geistSans } from "@/styles/geist";
import { usePathname, useRouter } from "next/navigation";
import { isOwner, isVetWithoutUserSession } from "@/services/roleService";
import { Empty } from "../data";

const AppContext = createContext<AppContextType>({
  isMobile: false,
  session: { db: null! },
  logout: async () => { },
  selectedPet: Empty.Pet(),
  storedPet: Empty.Pet(),
  setStoredPet: () => { },
  storedVetAccess: null,
  setStoredVetAccess: () => { },
  storedPetCode: null,
  setStoredPetCode: () => { },
  storedOwnerPets: null,
  setStoredOwnerPets: () => { }
});

export const useAppContext = () => useContext(AppContext);

export default function RootLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();
  const isVetRoute = pathname?.startsWith("/pages/vet/");

  const rawSession = useRawSession(); // undefined | null | Session

  // Hydration detection
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Mapear rawSession a AppSession
  const [appSession, setAppSession] = useState<AppSession | null | undefined>(undefined);
  useEffect(() => {
    if (rawSession === undefined) setAppSession(undefined);
    else if (rawSession === null) setAppSession(null);
    else setAppSession({ db: rawSession });
  }, [rawSession]);

  const [isMobile, setIsMobile] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetType>(Empty.Pet());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showChangePetModal, setShowChangePetModal] = useState(false);
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showEditPetModal, setShowEditPetModal] = useState(false);

  // LocalStorage abstraction via hook
  const ownerId = appSession?.db.user?.id;
  const [storedPet, setStoredPet] = useLocalStorage<PetType>(
    `selectedPet`,
    Empty.Pet()
  );

  const [storedOwnerPets, setStoredOwnerPets] = useLocalStorage<PetType[] | null>(
    `ownerPets-${ownerId}`,
    null
  );

  const [storedVetAccess, setStoredVetAccess] = useLocalStorage<VeterinaryAccessType | null>(
    `vetAccess`,
    null
  );

  const [storedPetCode, setStoredPetCode] = useLocalStorage<PetCodeType | null>(
    `petCode`,
    null
  );
 // REVISAR POR QUE SE ESTA LLAMANDO TANTO ESTE USE EFFECT
  // Cargar selectedPet usando PetRepository y storedPetId
  useEffect(() => {
    if (!isVetWithoutUserSession(appSession, storedVetAccess)) {
      if (!hydrated || !appSession || !ownerId) return;
    }
    let isMounted = true;
    (async () => {
      try {
        let pets: PetType[] | null = [];
        if (isVetWithoutUserSession(appSession, storedVetAccess)) {

          if (storedPet && !selectedPet) {
            const petFound = await PetRepository.findById(storedPet?.id ?? "");
            setSelectedPet(petFound);
          }

          setStoredOwnerPets(null);
          return null;
        };

        if (isOwner(appSession)) {
          // Obtener lista de mascotas (desde storage o API)
          pets = storedOwnerPets ?? await PetRepository.findByOwnerId(ownerId ?? "");
          if (storedOwnerPets == null) {
            setStoredOwnerPets(pets);
          }
        }

        // Determinar ID a seleccionar: preferir el almacenado, si no existe usar la primera mascota
        let initial_pet = null;
        if (pets != undefined && pets != null && pets?.length > 0) initial_pet = pets[0];
        const idToSelect = storedPet ?? initial_pet;

        // Actualizar storage solo si es necesario
        if (idToSelect && idToSelect !== storedPet) {
          setStoredPet(idToSelect);
        }
        // Encontrar la mascota correspondiente
        const pet = pets?.find(p => p.id === idToSelect?.id) ?? null;
        // Actualizar estado solo si cambia
        if (isMounted && pet && pet.id !== selectedPet?.id) {
          setSelectedPet(pet);
        }
      } catch (err) {
        console.error("Error loading pets:", err);
      }
    })();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSession, ownerId, storedPet, storedOwnerPets, selectedPet]);


  // Nuevo handleLogout: fuerza recarga completa
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      if (ownerId) {
        setStoredPet(null);
        setStoredOwnerPets(null);
        setStoredVetAccess(null);
      }
      setSelectedPet(Empty.Pet());
      // Redirigir y recargar para asegurar estado limpio
      window.location.href = "/";
    }
  };

  // Detección de viewport
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 767);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cargando estado de sesión
  if (appSession === undefined) {
    return (
      <html lang="en" data-theme="light">
        <head><title>Lampo</title></head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <style>{tooltipStyles}</style>
          <Loading />
        </body>
      </html>
    );
  }

  // Si NO estamos autenticados y NO es ruta de vet, mostramos LoginPage
  if (appSession === null && !isVetRoute) {
    return (
      <html lang="en" data-theme="light">
        <head><title>Lampo</title></head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <style>{tooltipStyles}</style>
          <LoginPage />
        </body>
      </html>
    );
  }

  const isVetUser = isVetWithoutUserSession(appSession, storedVetAccess);

  // 3) Si es usuario veterinario Y visita una ruta que NO es de vets…
  if (isVetUser && !isVetRoute) {
    // por ejemplo, redirigirlo a su panel de vets
    router.replace("/pages/vet/access");
    return null;
  }

  // Autenticado
  const cols = isMobile ? "1fr" : "300px 1fr";

  return (
    <html lang="en" data-theme="light">
      <head><title>Lampo</title></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <AppContext.Provider
          value={{
            isMobile,
            session: appSession,
            logout: handleLogout,
            selectedPet,
            storedPet,
            setStoredPet,
            storedVetAccess,
            setStoredVetAccess,
            storedPetCode,
            setStoredPetCode,
            storedOwnerPets,
            setStoredOwnerPets,
          }}
        >
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
      </body>
    </html>
  );
}
