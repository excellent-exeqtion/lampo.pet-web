// app/vet-access/page.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import VeterinaryModal from "@/components/modals/VeterinaryModal";

export default function VetAccessPage() {
  const [showVetModal, setShowVetModal] = useState(false);

  return (
    <main className="container" style={{ padding: "2rem", maxWidth: 600 }}>
      <h1>Acceso Veterinario</h1>
      <p>
        Introduce el código de la mascota que te haya facilitado el dueño para
        ver su historial y agregar nuevas entradas.
      </p>

      <div
        className="grid"
        style={{ gridTemplateColumns: "1fr", gap: "1rem", margin: "2rem 0" }}
      >
        {/* Botón para acceder sin registrarse */}
        <button
          className="contrast"
          onClick={() => setShowVetModal(true)}
        >
          Ingresar sin registrarse
        </button>

        {/* Enlace a registro de veterinario (implementa esta ruta si lo deseas) */}
        <Link href="/vet-register" className="primary">
          Registrarme como veterinario
        </Link>
      </div>

      {/**  
       * Reutilizamos el componente VeterinaryModal para capturar datos
       * y hacer el POST a VeterinaryAccessRepository.create  
       */}
      {showVetModal && (
        <VeterinaryModal setShowVetModal={setShowVetModal} />
      )}
    </main>
  );
}
