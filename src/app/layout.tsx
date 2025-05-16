"use client";
import React, { useState, useEffect, createContext, useContext } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";
import SidebarModule from "./components/layout/side-bar";
import BubblesModule from "./components/modals/bubbles";
import { tooltipStyles } from "./css/tooltip";
import LoginPage from "./pages/login/page";
import "./globals.css";
import "@picocss/pico";
import { AppContextType } from "./data/context";
import { Pet } from "./data";
import { LibComponents } from "./lib/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create context with default fallback (logout no-op)
const AppContext = createContext<AppContextType>({ isMobile: false, logout: async () => { }, selectedPet: null, setSelectedPet: () => null });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Auth session state
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  useEffect(() => {
    // Detect mobile viewport
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);

    // Fetch initial session
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    })();

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      listener.subscription.unsubscribe();
    };
  }, []);

  // While loading session
  if (session === undefined) {
    return (
      <html lang="en" data-theme="light">
        <head>
          <title>Lampo</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <style>{tooltipStyles}</style>
          <LibComponents.Loading />
        </body>
      </html>
    );
  }

  // If not authenticated, show login page
  if (!session) {
    return (
      <html lang="en" data-theme="light">
        <head>
          <title>Lampo</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <style>{tooltipStyles}</style>
          <LoginPage />
        </body>
      </html>
    );
  }


  // Layout for authenticated users
  const containerStyle = isMobile
    ? { gridTemplateColumns: "1fr" }
    : { gridTemplateColumns: "250px 1fr" };

  return (
    <html lang="en" data-theme="light">
      <head>
        <title>Lampo</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>

        <AppContext.Provider value={{ isMobile, session, logout, selectedPet, setSelectedPet }}>
          <div
            className="container grid"
            style={{
              ...containerStyle,
              minHeight: "100vh",
              transition: "grid-template-columns 0.3s ease",
              backgroundColor: "#F9FAFB",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
            }}
          >
            {/* Sidebar Desktop */}
            <SidebarModule
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
            />

            {/* Floating Bubbles */}
            <BubblesModule
              setShowCodeModal={setShowCodeModal}
              showCodeModal={showCodeModal}
              setShowVetModal={setShowVetModal}
              showVetModal={showVetModal}
              setShowFeedbackModal={setShowFeedbackModal}
              showFeedbackModal={showFeedbackModal}
            />

            {/* Main Content */}
            <div style={{ padding: "1rem" }}>
              {children}
            </div>
          </div>
        </AppContext.Provider>
      </body>
    </html>
  );
}

// Custom hook for context
export const useAppContext = () => useContext(AppContext);
