// app/pages/login/page.tsx
"use client";
import React, { FormEvent, useState } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { signIn, signUp, resetPassword } from "../../../services/authService";
import type { OwnerDataType } from "@/types/index";
import { OwnerRepository } from "@/repos/owner.repository";
import PlanSelection from "./components/PlanSelection";

export default function LoginPage() {
  const router = useRouter();

  // Estados comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados adicionales para registro
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerDataType>>({
    // Ajusta estos campos según tu definición real de OwnerDataType
    name: "",
    phone: "",
    address: "",
  });

  // Control para mostrar minibosquejo de selección de plan
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegistering) {
      // 1) Crear cuenta en Supabase (envía correo de confirmación)
      const { error: signUpError, data } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // 2) Guardar datos del owner en tu tabla ‘owners’
        const userId = data?.user?.id;
        if (userId) {
          await OwnerRepository.create({
            // spread de ownerInfo, casteado a OwnerDataType
            ...(ownerInfo as OwnerDataType),
            owner_id: userId,
          });
        }
        // 3) Mostrar selección de plan
        setShowPlanSelection(true);
      }
    } else {
      // Login normal
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push("/");
      }
    }

    setLoading(false);
  };

  const handleReset = async () => {
    setError("");
    if (!email) {
      setError("Ingresa tu correo para restablecer la contraseña.");
      return;
    }
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError(resetError.message);
    } else {
      setError("Revisa tu correo para restablecer la contraseña.");
    }
  };

  // 4) Si ya registró, mostrar bosquejo de planes
  if (showPlanSelection) {
    return <PlanSelection onSelect={(planId) => console.log("Plan elegido:", planId)} />;
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#F9FAFB",
      }}
    >
      <form
        onSubmit={handleAuth}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image src="/logo.svg" alt="Lampo" width={48} height={48} />
          <h1>{isRegistering ? "Regístrate" : "Inicia sesión"}</h1>
        </div>

        {/* Campos comunes */}
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="password">
          Contraseña
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {/* Campos extra sólo en registro */}
        {isRegistering && (
          <>
            <label htmlFor="name">
              Nombre
              <input
                id="name"
                type="text"
                value={ownerInfo.name || ""}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, name: e.target.value })
                }
                required
              />
            </label>

            <label htmlFor="phone">
              Teléfono
              <input
                id="phone"
                type="tel"
                value={ownerInfo.phone || ""}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, phone: e.target.value })
                }
                required
              />
            </label>

            <label htmlFor="address">
              Dirección
              <input
                id="address"
                type="text"
                value={ownerInfo.address || ""}
                onChange={(e) =>
                  setOwnerInfo({ ...ownerInfo, address: e.target.value })
                }
                required
              />
            </label>
          </>
        )}

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading
            ? isRegistering
              ? "Creando..."
              : "Accediendo..."
            : isRegistering
            ? "Registrarse"
            : "Entrar"}
        </button>

        {!isRegistering && (
          <p style={{ textAlign: "right", marginTop: "0.5rem" }}>
            <button
              type="button"
              onClick={handleReset}
              className="contrast"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "rgb(55, 60, 68)",
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{
              background: "none",
              border: "none",
              color: "#3B82F6",
              cursor: "pointer",
              marginLeft: "0.25rem",
            }}
          >
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </form>
    </main>
  );
}