"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React, { useState, useEffect, createContext, useContext } from "react";
import "@picocss/pico";
import SidebarModule from "./components/modals/side-bar";
import BubblesModule from "./components/modals/bubbles";
import { tooltipStyles } from "./css/tooltip";
import { menuData } from "./data/petdata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const IsMobileContext = createContext(false);
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const menuItems = menuData;

  const mascotas = ["Camus", "Toby", "Luna"];
  const [selectedPet, setSelectedPet] = useState(mascotas[0]);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 767);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Layout
  const containerStyle = isMobile
    ? { gridTemplateColumns: "1fr" }
    : { gridTemplateColumns: "250px 1fr" };

  return (
    <html lang="en" data-theme="ligth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>

        <IsMobileContext.Provider value={isMobile}>
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
              isMobile={isMobile}
              selectedPet={selectedPet}
              setSelectedPet={setSelectedPet}
              mascotas={mascotas}
              menuItems={menuItems}
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

            {/* Router Module */}
            <div style={{ padding: "1rem" }}>
              {children}
            </div>
          </div >
        </IsMobileContext.Provider>
      </body>
    </html >
  );
}

export const useIsMobile = () => useContext(IsMobileContext);