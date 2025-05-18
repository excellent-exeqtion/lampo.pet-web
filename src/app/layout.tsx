// app/layout.tsx
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
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
  setSelectedPet: () => { },
  ownerPets: null
});

export const useAppContext = () => useContext(AppContext);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
        const pets = storedOwnersPets ?? await PetRepository.findByOwnerId(ownerId);
        if (storedOwnersPets == null) setStoredOwnersPets(pets);
        const petToSelect = pets?.find(p => p.id === storedPetId) ?? null;
        if (isMounted) setSelectedPet(petToSelect);
      } catch (err) {
        console.error("Error loading pets:", err);
      }
    })();
    return () => { isMounted = false; };
  }, [hydrated, appSession, ownerId, storedPetId, storedOwnersPets, setStoredOwnersPets]);

  // Persistir selección en storage
  useEffect(() => {
    if (!ownerId || selectedPet === null) return;
    setStoredPetId(selectedPet.id);
  }, [selectedPet, ownerId, setStoredPetId]);

  const handleLogout = async () => {
    await signOut();
    if (ownerId) {
      setStoredPetId(null);
      setStoredOwnersPets(null);
    }
    setSelectedPet(null);
    router.push("/");
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
  const cols = isMobile ? "1fr" : "250px 1fr";

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
            setSelectedPet,
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
