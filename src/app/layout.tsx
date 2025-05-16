// app/layout.tsx
"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

import SidebarModule from "./components/layout/side-bar";
import BubblesModule from "./components/modals/bubbles";
import LoginPage from "./pages/login/page";

import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "./css/tooltip";
import type { AppContextType } from "./data/context";
import type { Pet } from "./data";

import { getSession, onAuthStateChange, signOut } from "@/lib/db/services/authService";
import { LibComponents } from "./lib/components";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const AppContext = createContext<AppContextType>({
  isMobile: false,
  session: null,
  logout: async () => {},
  selectedPet: null,
  setSelectedPet: () => {},
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // undefined = cargando, null = no auth, Session = auth
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    // Detectar mobile
    const onResize = () => setIsMobile(window.innerWidth <= 767);
    onResize();
    window.addEventListener("resize", onResize);

    // Cargar sesión inicial
    (async () => {
      const { data } = await getSession();
      setSession(data.session);
    })();

    // Suscribirse a cambios de auth; TS infiere bien el tipo de `subscription`
    const subscription = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      subscription.unsubscribe();
    };
  }, []);

  if (session === undefined) {
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

  if (!session) {
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

  const cols = isMobile ? "1fr" : "250px 1fr";

  return (
    <html lang="en" data-theme="light">
      <head><title>Lampo</title></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <AppContext.Provider
          value={{
            isMobile,
            session,
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

export const useAppContext = () => useContext(AppContext);
