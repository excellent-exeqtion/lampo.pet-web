// app/pages/login/page.tsx
"use client";
import React, { FormEvent, useState } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type { OwnerDataType } from "@/types/index";
import PlanSelection from "./components/PlanSelection";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { postFetch } from "@/app/api";

export default function LoginPage() {
  const router = useRouter();

  // Estados comunes
  const [email, setEmail] = useState("");
  const [ownerId, setOwnerId] = useState<string | undefined>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      // 1) Registro vía API
      const signUpResponse = await postFetch("/api/auth/sign-up", undefined, { email, password });
      const signUpJson = await signUpResponse.json();

      if (!signUpResponse.ok || !signUpJson.success) {
        console.error("Signup error:", signUpJson);
        setError("Ocurrió un error al registrar el usuario.");
        setLoading(false);
        return;
      }

      const userId = signUpJson.user?.id;
      setOwnerId(userId);

      // 2) Guardar datos del owner
      if (userId) {
        const response = await postFetch('/api/owners', undefined, {
          ...(ownerInfo as OwnerDataType),
          owner_id: userId,
          email
        });
        if (!response.ok) {
          setError("Error creando al dueño de la mascota");
          setLoading(false);
          return;
        }
      }

      setShowConfirmModal(true);
    } else {
      // Inicio de sesión
      const loginResponse = await postFetch("/api/auth/sign-in", undefined, { email, password });
      const loginJson = await loginResponse.json();

      if (!loginResponse.ok || !loginJson.success) {
        setError(loginJson?.message || "Error iniciando sesión");
      } else {
        await postFetch("/api/auth/set-session", undefined, { access_token: loginJson.session.access_token, refresh_token: loginJson.session.refresh_token });
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

    const resetResponse = await postFetch("/api/auth/reset-password", undefined, { email });
    const resetJson = await resetResponse.json();

    if (!resetResponse.ok || !resetJson.success) {
      setError(resetJson?.message || "Error al enviar correo de recuperación.");
    } else {
      setError("Revisa tu correo para restablecer la contraseña.");
    }
  };

  const goToVetPage = () => {
    router.replace("/pages/vet/access");
  }

  // 4) Mostrar modal de “verifica tu correo”
  if (showConfirmModal) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "0.5rem",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h2>Confirma tu correo</h2>
          <p>
            Te hemos enviado un correo de verificación a <strong>{email}</strong>.{" "}
            <br />
            Por favor revisa tu bandeja (y carpeta de spam) y haz clic en el enlace.
          </p>
          <button
            onClick={() => {
              setShowConfirmModal(false);
              setShowPlanSelection(true);
            }}
            style={{ marginTop: "1rem", width: "100%" }}
          >
            Ya confirmé, continuar
          </button>
        </div>
      </div>
    );
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
          <Image loading={"lazy"} src="/logo.png" alt="Lampo" width="150" height="48" style={{ width: "auto", height: "auto", marginBottom: '10px' }} />
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

        <label htmlFor="password" style={{ position: 'relative' }}>
          Contraseña
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }} // espacio para el botón
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
          {loading
            ? isRegistering
              ? "Guardando..."
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