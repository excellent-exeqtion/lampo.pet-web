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

const AppContext = createContext<AppContextType>({
  isMobile: false,
  session: null,
  logout: async () => {},
  selectedPet: null,
  setSelectedPet: () => {},
});

export function useAppContext() {
  return useContext(AppContext);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const rawSession = useRawSession(); // Session | null | undefined

  // Mapear a AppSession
  let appSession: AppSession | null | undefined;
  if (rawSession === undefined) {
    appSession = undefined;
  } else if (rawSession === null) {
    appSession = null;
  } else {
    appSession = { db: rawSession };
  }

  // Estados UI
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleLogout = async () => {
    await signOut();
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
