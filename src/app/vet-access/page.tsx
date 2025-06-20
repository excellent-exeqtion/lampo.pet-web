// app/vet-access/page.tsx
"use client";
import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import VeterinaryModal from "@/components/modals/VeterinaryModal";
import { useSearchParams, useRouter } from "next/navigation";
import { useRoleContext } from "@/context/RoleProvider";
import { VeterinarianPetCodeModal } from "@/components/index";

function VetAccessContent() {
  const [showVetModal, setShowVetModal] = useState(false);
  const [showVetCodeModal, setShowVetCodeModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isVetWithSession } = useRoleContext();

  const codeFromUrl = searchParams.get("code");

  useEffect(() => {
    if (isVetWithSession) {
      if (codeFromUrl) {
        setShowVetCodeModal(true);
      } else {
        router.replace("/pages/home");
      }
      return;
    }

    if (!isVetWithSession && codeFromUrl) {
      setShowVetModal(true);
    }
  }, [codeFromUrl, isVetWithSession, router]);

  if (isVetWithSession) {
    return (
      <>
        {showVetCodeModal && (
          <VeterinarianPetCodeModal
            initialCode={codeFromUrl || undefined}
            setShowVetPetCodeModal={setShowVetCodeModal}
          />
        )}
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
        <button className="contrast" onClick={() => setShowVetModal(true)}>
          Ingresar sin registrarse
        </button>

        <Link href="/vet-access/register" className="primary">
          Registrarme como veterinario
        </Link>

        <p style={{ textAlign: "center", padding: 0 }}>
          ¿Ya tienes cuenta?
          <Link href="/login" className="primary" style={{marginLeft: '1rem'}}>
            Iniciar sesión
          </Link>
        </p>
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

export default function VetAccessPage() {
  return (
    <Suspense fallback={<div>Cargando acceso veterinario...</div>}>
      <VetAccessContent />
    </Suspense>
  );
}
