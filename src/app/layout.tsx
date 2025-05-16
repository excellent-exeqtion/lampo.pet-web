// app/layout.tsx
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import type { AppSession } from "@/lib/db/types/session";
import type { AppContextType } from "./data";

import SidebarModule from "./components/layout/side-bar";
import BubblesModule from "./components/modals/bubbles";
import LoginPage from "./pages/login/page";
import { LibComponents } from "@/lib/components";

import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "./css/tooltip";

// Hooks y servicios de autenticación
import { useSession as useRawSession } from "@/hooks/useSession";
import { signOut } from "@/lib/db/services/authService";
import { geistMono, geistSans } from "./css/geist";
import { Pet } from "./lib/db/repositories";
import { PetRepository } from "@/lib/db/repositories/pet.repository";

const AppContext = createContext<AppContextType>({
  isMobile: false,
  session: null,
  logout: async () => { },
  selectedPet: null,
  setSelectedPet: () => { },
});

export function useAppContext() {
  return useContext(AppContext);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const rawSession = useRawSession(); // Session | null | undefined

  // Hydration detection
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Mapear a AppSession
  const [appSession, setAppSession] = useState<AppSession | null | undefined>(undefined);
  useEffect(() => {
    if (rawSession === undefined) setAppSession(undefined);
    else if (rawSession === null) setAppSession(null);
    else setAppSession({ db: rawSession });
  }, [rawSession]);

  // Estados UI
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Cargar selectedPet inicial usando PetRepository y persistencia
  useEffect(() => {
    // Solo ejecutar en cliente y con sesión válida
    if (!hydrated || !appSession || !appSession.db.user?.id) return;
    const userId = appSession.db.user.id;
    const storageKey = `selectedPet-${userId}`;
    let isMounted = true;
    (async () => {
      try {
        const pets = await PetRepository.getPetsForUser(userId);
        // Recuperar selección previa
        const storedId = window.localStorage.getItem(storageKey);
        const petFromStorage = pets.find(p => p.id === storedId) || null;
        const initialPet = petFromStorage ?? (pets.length > 0 ? pets[0] : null);
        if (isMounted) setSelectedPet(initialPet);
      } catch (err) {
        console.error("Error loading pets:", err);
      }
    })();
    return () => { isMounted = false; };
  }, [hydrated, appSession]);

  // Persistir selección en localStorage
  useEffect(() => {
    if (!appSession || !appSession.db.user?.id || !selectedPet) return;
    const userId = appSession.db.user.id;
    const storageKey = `selectedPet-${userId}`;
    try {
      console.log(selectedPet);
      window.localStorage.setItem(storageKey, selectedPet.id);

    } catch { }
  }, [selectedPet, appSession]);

  const handleLogout = async () => {
    await signOut();
    if (appSession?.db.user?.id) {
      window.localStorage.removeItem(`selectedPet-${appSession.db.user.id}`);
    }
    setSelectedPet(null);
    router.push("/");
  };

  useEffect(() => {

    const onResize = () => setIsMobile(window.innerWidth <= 767);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Estado de carga de sesión
  if (appSession === undefined) {
    return (
      <html lang="en" data-theme="light">
        <head><title>Lampo</title></head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <style>{tooltipStyles}</style>
          <LibComponents.Loading />
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

  // Usuario autenticado
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
            <SidebarModule menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <BubblesModule
              setShowCodeModal={setShowCodeModal}
              showCodeModal={showCodeModal}
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