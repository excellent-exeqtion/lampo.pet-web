"use client";
import React, { useState, useEffect } from "react";
import "@picocss/pico";
import {
  FaHome,
  FaUser,
  FaSyringe,
  FaCut,
  FaPills,
  FaCloudSun,
  FaFlask,
  FaRocket,
  FaCog,
  FaShareAlt,
  FaBars,
  FaTimes,
  FaCommentDots,
  FaUserMd
} from "react-icons/fa";

// Datos básicos y de contacto
const basicDataItems = [
  { label: "Tipo de mascota", value: "Gato" },
  { label: "Género", value: "Macho" },
  { label: "Peso", value: "5.5 KG" },
  { label: "Raza", value: "Mestizo" },
  { label: "Alergias", value: "No" },
  { label: "Condición de peso", value: "Normal" },
  { label: "Tamaño", value: "Mediano" },
  { label: "Vive con otros", value: "No" },
  { label: "Comida principal", value: "Taste the Wild" },
];

const contactItems = [
  { label: "Nombre del contacto", value: "Andrés Aulestia" },
  { label: "Teléfono", value: "+57 3146061490" },
  { label: "Dirección", value: "Cra. 74 #152b-70 Torre 3 Apto. 1704" },
  { label: "Ciudad", value: "Bogotá" },
  { label: "País", value: "Colombia" },
  { label: "Email", value: "a.aulestia@exe.com.co" },
  { label: "Última vacuna", value: "Parvigen (2024-07-25)" },
  { label: "Castrado", value: "Sí (2023-12-02)" },
  { label: "Antipulgas", value: "Sí (2023-12-15)" },
  { label: "¿Usa medicina?", value: "No" },
  { label: "Condición especial", value: "No" },
];

export default function LampoDashboard() {
  const menuItems = [
    { label: "Inicio", icon: <FaHome /> },
    { label: "Datos básicos", icon: <FaUser /> },
    { label: "Vacunas", icon: <FaSyringe /> },
    { label: "Cirugías", icon: <FaCut /> },
    { label: "Medicinas", icon: <FaPills /> },
    { label: "Condiciones atm.", icon: <FaCloudSun /> },
    { label: "Lab. de exámenes", icon: <FaFlask /> },
    { label: "Mejora tu plan", icon: <FaRocket /> },
    { label: "Configuraciones", icon: <FaCog /> },
  ];

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
      {!isMobile && (
        <aside
          style={{
            width: "250px",
            display: "flex",
            flexDirection: "column",
            paddingTop: "1rem",
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ padding: "0 1rem 1rem" }}>
            <img
              src={'/pets/camus.png'}
              alt="profile"
              style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }}
            />
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="pet-dropdown"
              style={{ width: "100%" }}
            >
              {mascotas.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <nav style={{ padding: "0 1rem" }}>
            <ul>
              {menuItems.map(({ label, icon }) => (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Header Mobile */}
      {isMobile && (
        <header
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img
              src={'/pets/camus.png'}
              alt="profile"
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            />
            <span style={{ fontSize: "1rem", fontWeight: "600" }}>{selectedPet}</span>
          </div>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}
            aria-label="Menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </header>
      )}

      {/* Mobile Nav */}
      {isMobile && menuOpen && (
        <nav
          style={{
            position: "fixed",
            top: "3.5rem",
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 999,
          }}
        >
          <ul style={{ listStyle: "none", margin: 0, padding: "0.5rem 1rem" }}>
            {menuItems.map(({ label, icon }) => (
              <li key={label} style={{ marginBottom: "0.5rem" }}>
                <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {icon} {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Floating Bubbles */}
      {/* Feedback Bubble */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "1rem",
          backgroundColor: "#10B981",
          border: "none",
          borderRadius: "50%",
          padding: "0.75rem",
          color: "#ffffff",
          fontSize: "1.25rem",
          cursor: "pointer",
          zIndex: 1500,
        }}
        aria-label="Feedback"
      >
        <FaCommentDots />
      </button>

      {/* Vet Bubble */}
      <button
        onClick={() => setShowVetModal(true)}
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "4rem",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          padding: "0.75rem",
          color: "#333333",
          fontSize: "1.25rem",
          cursor: "pointer",
          zIndex: 1500,
        }}
        aria-label="Veterinario"
      >
        <FaUserMd />
      </button>

      {/* Code Bubble */}
      <button
        onClick={() => setShowCodeModal(true)}
        style={{
          position: "fixed",
          right: "1rem",
          bottom: "7rem",
          backgroundColor: "#ffffff",
          border: "1px solid #ccc",
          borderRadius: "50%",
          padding: "0.75rem",
          color: "#007BFF",
          fontSize: "1.25rem",
          cursor: "pointer",
          zIndex: 1500,
        }}
        aria-label="Código"
      >
        <FaShareAlt />
      </button>

      {/* Modals */}
      {showFeedbackModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
            <button onClick={() => setShowFeedbackModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>
              <FaTimes />
            </button>
            <h2>Queremos leerte</h2>
            <p>Cuéntanos tu experiencia con Lampo o sobre tu mascota.</p>
            <textarea style={{ width: "100%", minHeight: "4rem", padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #ccc", marginTop: "0.75rem" }} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <button style={{ flex: 1 }}>Enviar</button>
              <button style={{ flex: 1 }}>Anónimo</button>
            </div>
          </div>
        </div>
      )}

      {showVetModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
            <button onClick={() => setShowVetModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>
              <FaTimes />
            </button>
            <article style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <h4 style={{ marginBottom: "0.5rem" }}>Soy médico veterinario</h4>
              <p style={{ flexGrow: 1, marginBottom: "0.5rem" }}>Aquí puedes revisar el historial completo, modificarlo y agregar entradas a la historia de la mascota</p>
              <button style={{ width: "100%" }}>IR</button>
            </article>
          </div>
        </div>
      )}

      {showCodeModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "1rem", padding: "2rem", width: "90%", maxWidth: "400px", position: "relative" }}>
            <button onClick={() => setShowCodeModal(false)} style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>
              <FaTimes />
            </button>
            <div>
              <p><strong>Código único de tu mascota</strong></p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {"A001".split("").map((char, idx) => (
                  <span key={idx} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem", color: "#007BFF", fontWeight: "bold" }}>
                    {char}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem" }}>Este código es único para cada mascota. Compártelo con tu médico veterinario para brindarle acceso al historial.</p>
              <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <FaShareAlt size={20} /> Comparte Lampo con tu médico veterinario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem" }}>
        {/* Datos básicos en tres columnas */}
        <section style={{ marginBottom: "2rem" }}>
          <h3>Datos básicos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {basicDataItems.map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,xtypeerror)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{value}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Datos de contacto en dos columnas */}
        <section>
          <h3>Datos de contacto</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {contactItems.map(({ label, value }) => (
              <div key={label} style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "0.75rem", color: "#6B7280", margin: 0 }}>{label}</p>
                <p style={{ fontSize: "1rem", margin: "0.25rem 0 0 0" }}>{value}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
