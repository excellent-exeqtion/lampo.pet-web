"use client";
import React, { useState, useEffect } from "react";
import "@picocss/pico";
import BasicDataModule from "./basic-data";
import PetCodeModule from "./pet-code";
import VeterinaryModule from "./veterinary";
import FeedbackModule from "./feedback";
import { basicDataMock, contactMock, menuData } from "../data/petdata";
import { tooltipStyles } from "../css/tooltip";
import BubblesModule from "./bubbles";
import SidebarModule from "./side-bar";

// Datos básicos y de contacto
const basicDataItems = basicDataMock;
const contactItems = contactMock;

export default function LampoDashboard() {
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
    <React.Fragment>
      {/* Tooltip Styles */}
      <style>{tooltipStyles}</style>

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
        <SidebarModule setShowFeedbackModal={setShowFeedbackModal} setShowVetModal={setShowVetModal} setShowCodeModal={setShowCodeModal} isMobile={isMobile} selectedPet={selectedPet} setSelectedPet={setSelectedPet} mascotas={mascotas} menuItems={menuItems} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Floating Bubbles */}
        <BubblesModule setShowCodeModal={setShowCodeModal} setShowVetModal={setShowVetModal} setShowFeedbackModal={setShowFeedbackModal} />

        {/* Modals */}
        {showFeedbackModal && (
          <FeedbackModule setShowFeedbackModal={setShowFeedbackModal} />
        )}

        {showVetModal && (
          <VeterinaryModule setShowVetModal={setShowVetModal} />
        )}

        {showCodeModal && (
          <PetCodeModule setShowCodeModal={setShowCodeModal} />
        )}


        <BasicDataModule isMobile={isMobile} basicDataItems={basicDataItems} contactItems={contactItems} />
      </div>
    </React.Fragment>
  );
}

