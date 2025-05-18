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
import { PetType } from "@/types/index";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AppContextType } from "@/context/AppContextType";
import { geistMono, geistSans } from "@/styles/geist";

const AppContext = createContext<AppContextType>({
  isMobile: false,
  session: { db: null! },
  logout: async () => { },
  selectedPet: null,
  setStoredPetId: () => { },
  ownerPets: null
});

export const useAppContext = () => useContext(AppContext);

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
  const [selectedPet, setSelectedPet] = useState<PetType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showChangePetModal, setShowChangePetModal] = useState(false);

  // LocalStorage abstraction via hook
  const ownerId = appSession?.db.user?.id;
  const [storedPetId, setStoredPetId] = useLocalStorage<string | null>(
    `selectedPet-${ownerId}`,
    null
  );
  const [storedOwnersPets, setStoredOwnersPets] = useLocalStorage<PetType[] | null>(
    `ownersPets-${ownerId}`,
    null
  );

  // Cargar selectedPet usando PetRepository y storedPetId
  useEffect(() => {
    if (!hydrated || !appSession || !ownerId) return;
    let isMounted = true;
    (async () => {
      try {
        // Obtener lista de mascotas (desde storage o API)
        const pets = storedOwnersPets ?? await PetRepository.findByOwnerId(ownerId);
        if (storedOwnersPets == null) {
          setStoredOwnersPets(pets);
        }
        // Determinar ID a seleccionar: preferir el almacenado, si no existe usar la primera mascota
        let initial_id = null;
        if (pets != undefined && pets != null && pets?.length > 0) initial_id = pets[0].id;
        const idToSelect = storedPetId ?? initial_id;

        // Actualizar storage solo si es necesario
        if (idToSelect && idToSelect !== storedPetId) {
          setStoredPetId(idToSelect);
        }
        // Encontrar la mascota correspondiente
        const pet = pets?.find(p => p.id === idToSelect) ?? null;
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
  }, [hydrated, appSession, ownerId, storedPetId, storedOwnersPets, selectedPet]);


  // Nuevo handleLogout: fuerza recarga completa
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      if (ownerId) {
        setStoredPetId(null);
        setStoredOwnersPets(null);
      }
      setSelectedPet(null);
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

  // No autenticado
  if (appSession === null) {
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
            setStoredPetId,
            ownerPets: storedOwnersPets
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
              margin: '2%'
            }}
          >
            <SideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Bubbles
              setShowCodeModal={setShowCodeModal}
              showCodeModal={showCodeModal}
              setShowChangePetModal={setShowChangePetModal}
              showChangePetModal={showChangePetModal}
              setShowVetModal={setShowVetModal}
              showVetModal={showVetModal}
              setShowFeedbackModal={setShowFeedbackModal}
              showFeedbackModal={showFeedbackModal}
            />
            <main style={{ padding: "1rem" }}>{children}</main>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}
