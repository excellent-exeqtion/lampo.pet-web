// app/vet-access/register/page.tsx
"use client";
import React, { FormEvent, useState } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/lib/modal";
import { postFetch } from "@/app/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function VetRegisterPage() {
  const router = useRouter();

  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registration, setRegistration] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (![firstName, lastName, registration, clinicName, city, email, password].every(Boolean)) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      // 1) Crear cuenta en auth
      const signUpRes = await postFetch("/api/auth/sign-up", undefined, { email, password, role: 'veterinarian' });
      const signUpJson = await signUpRes.json();
      if (!signUpRes.ok || !signUpJson.success) {
        setError("Error al registrar la cuenta.");
        return;
      }

      const vetId = signUpJson.user?.id;
      if (vetId) {
        // 2) Guardar perfil de veterinario
        const profileRes = await postFetch("/api/vet", undefined, {
          vet_id: vetId,
          first_name: firstName,
          last_name: lastName,
          registration,
          clinic_name: clinicName,
          city,
          email
        });
        if (!profileRes.ok) {
          setError("Error creando perfil de veterinario.");
          return;
        }
      }

      // 3) Mostrar modal de confirmación de correo
      setShowConfirmModal(true);

    } catch {
      setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  // Modal de “Confirma tu correo”
  if (showConfirmModal) {
    return (
      <ModalComponent
        title="Confirma tu correo"
        description={`Te hemos enviado un correo de verificación a ${email}. Por favor revisa tu bandeja (y carpeta de spam) y haz clic en el enlace.`}
        setShowModal={setShowConfirmModal}
      >
        <button
          className="contrast"
          onClick={() => router.push("/")}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Ya confirmé, continuar
        </button>
      </ModalComponent>
    );
  }

  // Formulario de registro
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: '2rem' }}>
      <h1>Registro Veterinario</h1>
      <form onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "550px",
        }}>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            Nombre
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </label>
          <label>
            Apellido
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Registro profesional
            <input
              type="text"
              value={registration}
              onChange={e => setRegistration(e.target.value)}
              required
            />
          </label>
          <label>
            Clínica / Laboratorio
            <input
              type="text"
              value={clinicName}
              onChange={e => setClinicName(e.target.value)}
              required
            />
          </label>
          <label>
            Ciudad
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label style={{ position: 'relative' }}>
          Contraseña
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {showPassword ? <FaEyeSlash size={23} color={'#000'} style={{ marginTop: '16px' }} /> : <FaEye size={23} color={'#000'} style={{ marginTop: '16px' }} />}
          </button>
        </label>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </main>
  );
}
