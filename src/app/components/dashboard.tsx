"use client";
import React, { useState } from "react";
import "@picocss/pico";
import { FaHome, FaUser, FaSyringe, FaCut, FaPills, FaCloudSun, FaFlask, FaRocket, FaCog, FaShareAlt } from "react-icons/fa";

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

  return (
    <div
      className="container grid"
      style={{
        gridTemplateColumns: menuOpen ? "250px 1fr" : "100px 1fr",
        minHeight: "100vh",
        transition: "grid-template-columns 0.3s ease"
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
          fontSize: "0.9rem"
        }}
      >
        <div style={{ display: menuOpen ? 'flex' : 'block', alignItems: "center", gap: "1rem", paddingLeft: menuOpen ? "1rem" : 0, width: "100%", marginBottom: "1rem" }} onClick={() => setMenuOpen(!menuOpen)}>
          <img
            src={'https://excellent-exeqtion.github.io/lampo.pet-web/pets/camus.png'}
            alt="profile"
            style={{ borderRadius: "9999px", cursor: "pointer", width: "80px", height: "80px" }}
          />
          {(
            <select value={selectedPet} onChange={e => setSelectedPet(e.target.value)} style={{border: 'none', paddingLeft: '0'}} className="pet-dropdown">
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
                  <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {icon} {label}
                  </a>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "2rem" }}>
              <p><strong>Código único de tu mascota</strong></p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                {"A001".split("").map((char, idx) => (
                  <span key={idx} style={{ padding: "0.5rem", border: "1px solid #ccc", borderRadius: "0.25rem", color: "#007BFF", fontWeight: "bold" }}>{char}</span>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem" }}>Este código es único para cada mascota. Compártelo con tu médico veterinario para brindarle acceso al historial.</p>
              <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <FaShareAlt size={70} /> Comparte Lampo con tu médico veterinario
              </button>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
                <img src="https://excellent-exeqtion.github.io/lampo.pet-web/others/google-play-badge-logo.svg" alt="Google Play" style={{ height: "6rem" }} />
                <img src="https://excellent-exeqtion.github.io/lampo.pet-web/others/download-on-the-app-store-apple-logo.svg" alt="App Store" style={{ height: "6rem" }} />
              </div>
            </div>
          </nav>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ padding: "2rem", fontSize: "0.9rem" }}>
        <h2>Próximos eventos programados</h2>
        <section style={{ maxWidth: "320px", marginBottom: "2rem" }}>
          <input type="date" value="2025-01-01" />
        </section>

        <section>
          <h3>Datos de contacto</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, auto))",
              gap: "0.5rem",
              alignItems: "center",
              marginBottom: "1rem",
              fontSize: "0.8rem"
            }}
          >
            <select>
              <option>Last 12 months</option>
              <option>Last 6 months</option>
            </select>
            <input type="date" defaultValue="2020-08-01" />
            <span style={{ textAlign: "center" }}>a</span>
            <input type="date" defaultValue="2020-07-07" />
            <select>
              <option>Previous period</option>
            </select>
            <select>
              <option>Monthly</option>
            </select>
            <button>Edit charts</button>
          </div>
        </section>

        <aside style={{ position: "fixed", bottom: "2.5rem", right: "2rem", width: "320px", height: "200px", fontSize: "0.8rem" }}>
          <article style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Soy médico veterinario</h4>
            <p style={{ flexGrow: 1, marginBottom: "0.5rem" }}>Aquí puedes revisar el historial completo, modificarlo y agregar entradas a la historia de la mascota</p>
            <button style={{ width: "100%" }}>IR</button>
          </article>
        </aside>
      </main>
    </div>
  );
}
