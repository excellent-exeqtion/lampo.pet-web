// app/layout.tsx
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

import SidebarModule from "./components/layout/side-bar";
import BubblesModule from "./components/modals/bubbles";
import LoginPage from "./pages/login/page";
import { LibComponents } from "@/lib/components";

import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "./css/tooltip";

import { useSession as useRawSession } from "@/hooks/useSession";
import {signOut} from "@/lib/db/services/authService";
import { PetRepository } from "./lib/db/repositories/pet.repository";
import { AppSession } from "./lib/db/types/session";
import { Pet } from "./lib/db/repositories";
import { useLocalStorage } from "./lib/db/hooks/useLocalStorage";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Contexto de la app
type LayoutContext = {
  isMobile: boolean;
  session: AppSession;
  logout: () => Promise<void>;
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet | null) => void;
};

const AppContext = createContext<LayoutContext>({
  isMobile: false,
  session: { db: null! },
  logout: async () => {},
  selectedPet: null,
  setSelectedPet: () => {},
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
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // LocalStorage abstraction via hook
  const userId = appSession?.db.user?.id;
  const [storedPetId, setStoredPetId] = useLocalStorage<string | null>(
  `selectedPet-${userId}`,
  null,
  { secret: process.env.NEXT_PUBLIC_STORAGE_SECRET! }
);


  // Cargar selectedPet usando PetRepository y storedPetId
  useEffect(() => {
    if (!hydrated || !appSession || !userId) return;
    let isMounted = true;
    (async () => {
      try {
        const pets = await PetRepository.getPetsForUser(userId);
        const petToSelect = pets.find(p => p.id === storedPetId) ?? pets[0] ?? null;
        if (isMounted) setSelectedPet(petToSelect);
      } catch (err) {
        console.error("Error loading pets:", err);
      }
    })();
    return () => { isMounted = false; };
  }, [hydrated, appSession, userId, storedPetId]);

  // Persistir selección en storage
  useEffect(() => {
    if (!userId || selectedPet === null) return;
    setStoredPetId(selectedPet.id);
  }, [selectedPet, userId, setStoredPetId]);

  const handleLogout = async () => {
    await signOut();
    if (userId) setStoredPetId(null);
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
