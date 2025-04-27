"use client";
import React, { useState } from "react";
import "@picocss/pico";
import { FaHome, FaUser, FaSyringe, FaCut, FaPills, FaCloudSun, FaFlask, FaRocket, FaCog, FaShareAlt } from "react-icons/fa";
import BasicDataModule, { BasicData, ContactData } from "./basic-data";

export default function LampoDashboard() {
  const [menuOpen, setMenuOpen] = useState(true);

  const menuItems = [
    { label: "Inicio", icon: <FaHome /> },
    { label: "Datos básicos", icon: <FaUser /> },
    { label: "Vacunas", icon: <FaSyringe /> },
    { label: "Cirugías", icon: <FaCut /> },
    { label: "Medicinas", icon: <FaPills /> },
    { label: "Condiciones atmosféricas", icon: <FaCloudSun /> },
    { label: "Exámenes de laboratorio", icon: <FaFlask /> },
    { label: "Mejora tu plan", icon: <FaRocket /> },
    { label: "Configuraciones", icon: <FaCog /> },
  ];

  const mascotas = ["Camus", "Toby", "Luna"];
  const [selectedPet, setSelectedPet] = useState(mascotas[0]);
  const basicData: BasicData = {
    petType: "Gato",
    gender: "Macho",
    weight: "5.5 KG",
    breed: "Mestizo",
    allergies: "No",
    weightCondition: "Normal",
    size: "Mediano",
    livesWithOthers: "No",
    mainFood: "Taste the wild",
  };

  const contact: ContactData = {
    contactName: "Andrés Aulestia",
    phone: "+57 3146061490",
    address: "Cra. 74 #152b-70 Torre 3 Apto. 1704",
    city: "Bogotá",
    country: "Colombia",
    email: "a.aulestia@exe.com.co",
    lastVaccine: "Parvigen",
    lastVaccineDate: "2024-07-25",
    castrated: "Sí",
    castrationDate: "2023-12-02",
    antiFleas: "Sí",
    antiFleasDate: "2023-12-15",
    usesMedicine: "No",
    specialCondition: "No"
  };

  return (
    <div
      className="container grid"
      style={{
        gridTemplateColumns: menuOpen ? "250px 1fr" : "100px 1fr",
        minHeight: "100vh",
        transition: "grid-template-columns 0.3s ease",
        backgroundColor: "#F9FAFB",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          overflow: "hidden",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: menuOpen ? "flex-start" : "center",
          paddingTop: "1rem",
          fontSize: "0.9rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: menuOpen ? "1rem" : 0, width: "100%", marginBottom: "1rem" }}>
          <img
            src={'/pets/camus.png'}
            alt="profile"
            style={{ borderRadius: "9999px", cursor: "pointer", width: "80px", height: "80px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            onClick={() => setMenuOpen(!menuOpen)}
          />
          {menuOpen && (
            <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)} style={{ border: 'none', paddingLeft: '0' }} className="pet-dropdown">
              {mascotas.map((nombre, idx) => (
                <option key={idx} value={nombre}>{nombre}</option>
              ))}
            </select>
          )}
        </div>

        {menuOpen && (
          <nav style={{ paddingLeft: "1rem", paddingRight: "1rem", width: "100%" }}>
            <ul>
              {menuItems.map(({ label, icon }) => (
                <li key={label}>
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem", transition: "background 0.3s", padding: "0.5rem", borderRadius: "0.5rem" }}>
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "2rem" }}>
              <p><strong>Código único de tu mascota</strong></p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {"A001".split("").map((char, idx) => (
                  <span key={idx} style={{ padding: "0.5rem", backgroundColor: "#93C5FD", borderRadius: "0.5rem", color: "#1E3A8A", fontWeight: "bold" }}>{char}</span>
                ))}
              </div>
              <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>Este código es único para cada mascota. Compártelo con tu médico veterinario para brindarle acceso al historial.</p>
              <button style={{ width: "100%", backgroundColor: "#10B981", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", borderRadius: "0.5rem", padding: "0.75rem", transition: "background 0.3s" }}>
                <FaShareAlt size={20} /> Comparte Lampo
              </button>
            </div>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ padding: "2rem", fontSize: "0.9rem" }}>
        <BasicDataModule data={basicData} contact={contact} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end", marginTop: "2rem" }}>
          <section
            style={{
              width: "260px",
              fontSize: "0.75rem",
              backgroundColor: "#d0d8e8",
              borderRadius: "1rem",
              padding: "0.75rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease"
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1rem", marginBottom: "0.5rem" }}>Queremos leerte</h2>
            <p style={{ margin: 0, marginBottom: "0.75rem" }}>Cuéntanos tu experiencia con Lampo o sobre tu mascota.</p>
            <textarea
              style={{
                width: "100%",
                minHeight: "4rem",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                marginBottom: "0.75rem",
                fontSize: "0.8rem"
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button style={{ flex: 1 }}>Enviar cuenta</button>
              <button style={{ flex: 1 }}>Anónimo</button>
            </div>
          </section>

          <section
            style={{
              width: "260px",
              fontSize: "0.75rem",
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              padding: "0.75rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease"
            }}
          >
            <h4 style={{ marginBottom: "0.5rem" }}>Soy médico veterinario</h4>
            <p style={{ marginBottom: "0.5rem" }}>Aquí puedes revisar y actualizar la historia clínica de tu mascota.</p>
            <button style={{ width: "100%", color: "#ffffff", borderRadius: "0.5rem" }}>IR</button>
          </section>
        </div>
      </main>
    </div>
  );
}
