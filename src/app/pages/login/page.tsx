// app/pages/login/page.tsx
"use client";
import React, { FormEvent, useState } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { signIn, ownerSignUp, resetPassword } from "../../../services/authService";
import type { OwnerDataType } from "@/types/index";
import { OwnerRepository } from "@/repos/owner.repository";
import PlanSelection from "./components/PlanSelection";

export default function LoginPage() {
  const router = useRouter();

  // Estados comunes
  const [email, setEmail] = useState("");
  const [ownerId, setOwnerId] = useState<string | undefined>("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados adicionales para registro
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerDataType>>({
    name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    email: ""
  });

  // Control para mostrar minibosquejo de selección de plan
  const [showPlanSelection, setShowPlanSelection] = useState(false);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegistering) {
      // 1) Crear cuenta en Supabase (envía correo de confirmación)
      const { error: signUpError, data } = await ownerSignUp(email, password);
      if (signUpError) {
        console.log('error:', signUpError);
        setError("Ocurrio un error al registrar el usuario.");
        setLoading(false);
        return;
      }

      // 2) Guardar datos del owner en tu tabla ‘owners’ y manejar errores
      const userId = data?.user?.id;
      setOwnerId(userId);
      if (userId) {
        const { error: ownerError } = await OwnerRepository.create({
          ...(ownerInfo as OwnerDataType),
          owner_id: userId,
          email: email
        });
        if (ownerError) {
          setError(ownerError.message);
          setLoading(false);
          return;
        }
      }

      // 3) Mostrar selección de plan
      setShowPlanSelection(true);
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

  const goToVetPage = () => {
    router.replace("/pages/vet/access");
  }

  // 4) Si ya registró, mostrar bosquejo de planes
  if (showPlanSelection) {
    return <PlanSelection onSelect={(planId) => console.log("Plan elegido:", planId)} ownerId={ownerId} />;
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
          maxWidth: "550px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image src="/logo.png" alt="Lampo" width={150} height={48} style={{ marginBottom: '10px' }} />
          <h1>{isRegistering ? "Regístrate" : "Inicia sesión"}</h1>
        </div>

        {/* Campos comunes */}
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* Campos extra sólo en registro */}
        {isRegistering && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label htmlFor="name">
              Nombre
              <input
                id="name"
                type="text"
                autoComplete="given-name"
                value={ownerInfo.name || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, name: e.target.value })}
                required
              />
            </label>

            <label htmlFor="lastname">
              Apellido
              <input
                id="lastname"
                type="text"
                autoComplete="family-name"
                value={ownerInfo.last_name || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, last_name: e.target.value })}
                required
              />
            </label>

            <label htmlFor="phone">
              Teléfono
              <input
                id="phone"
                type="tel"
                autoComplete="phone"
                value={ownerInfo.phone || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, phone: e.target.value })}
                required
              />
            </label>

            <label htmlFor="address">
              Dirección
              <input
                id="address"
                type="text"
                autoComplete="address-line1"
                value={ownerInfo.address || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, address: e.target.value })}
                required
              />
            </label>

            <label htmlFor="city">
              Ciudad
              <input
                id="city"
                type="text"
                autoComplete="address-level2"
                value={ownerInfo.city || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, city: e.target.value })}
                required
              />
            </label>

            <label htmlFor="country">
              País
              <input
                id="country"
                type="text"
                autoComplete="country-name"
                value={ownerInfo.country || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, country: e.target.value })}
                required
              />
            </label>

          </div>
        )}

        <label htmlFor="password">
          Contraseña
          <input
            id="password"
            type="password"
            autoComplete={isRegistering ? 'new-password' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

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
        {!isRegistering &&
          <p style={{ textAlign: "center", marginTop: "1rem" }}>

            <button
              type="button"
              onClick={() => goToVetPage()}
              style={{
                background: "none",
                border: "none",
                color: "#3B82F6",
                cursor: "pointer",
                marginLeft: "0.25rem",
              }}
            >
              Soy médico veterinario sin registro
            </button>
          </p>
        }
      </form>
    </main>
  );
}