// app/vet-access/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import VeterinaryModal from "@/components/modals/VeterinaryModal";
import { useSearchParams, useRouter } from "next/navigation";
import { useRoleContext } from "@/context/RoleProvider";
import { VeterinarianPetCodeModal } from "@/components/index";

export default function VetAccessPage() {
  const [showVetModal, setShowVetModal] = useState(false);
  const [showVetCodeModal, setShowVetCodeModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isVetWithSession } = useRoleContext();

  const codeFromUrl = searchParams.get('code');

  useEffect(() => {
    if (isVetWithSession) {
      if (codeFromUrl) {
        setShowVetCodeModal(true);
      } else {
        router.replace('/pages/home');
      }
      return;
    }

    if(!isVetWithSession && codeFromUrl){
      setShowVetModal(true);
    }
  }, [codeFromUrl, isVetWithSession, router]);

  if (isVetWithSession) {
    return (
      <>
        {showVetCodeModal && <VeterinarianPetCodeModal initialCode={codeFromUrl || undefined} setShowVetPetCodeModal={setShowVetCodeModal} />}
      </>
    );
  }

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
        <button
          className="contrast"
          onClick={() => setShowVetModal(true)}
        >
          Ingresar sin registrarse
        </button>

        <Link href="/vet-access/register" className="primary">
          Registrarme como veterinario
        </Link>

        <Link href="/login" className="primary">
          Iniciar sesión
        </Link>
      </div>

      {showVetModal && (
        <VeterinaryModal
          setShowModal={setShowVetModal}
          initialCode={codeFromUrl || undefined}
        />
      )}

    </main>
  );
}