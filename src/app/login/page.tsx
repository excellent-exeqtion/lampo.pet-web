// app/login/page.tsx
"use client";
import React, { FormEvent, useState, useEffect } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type { OwnerDataType } from "@/types/index";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalComponent from "@/components/lib/modal";
import { authClient } from "@/lib/auth";
import { useSessionContext } from "@/context/SessionProvider";

export default function LoginPage() {
  const router = useRouter();
  const { db: session, setSession } = useSessionContext();

  // Estados comunes
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState(""); // Para mensajes como "Revisa tu correo"
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Estados adicionales para registro
  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerDataType>>({
    name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    email: "" // Se llenará desde el campo de email común
  });

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (session) {
      router.replace("/"); // O a la página de dashboard
    }
  }, [session, router]);


  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");
    setLoading(true);

    try {
      if (isRegistering) {
        // 1) Registro vía authClient
        const { data: signUpData, error: signUpError } = await authClient.signUp(email, password, 'owner');

        if (signUpError || !signUpData?.user) {
          console.error("Signup error:", signUpError);
          setError(signUpError?.message || "Error al registrar el usuario. Inténtalo de nuevo.");
          setLoading(false);
          return;
        }

        const ownerId = signUpData.user.id;

        // 2) Guardar datos del owner (esto SÍ requiere tu API `api/owners`)
        if (ownerId) {
          // Usar fetch directamente o tu wrapper `postFetch` si aún lo tienes para otras APIs
          const response = await fetch('/api/owners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...ownerInfo,
              owner_id: ownerId,
              email // Asegúrate que el email del owner sea el mismo del auth
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || "Error creando el perfil del dueño.");
            // Considerar un rollback o manejo de error si el perfil no se crea después del auth.
            setLoading(false);
            return;
          }
        }
        // Si el registro en Supabase requiere confirmación por email, mostrar el modal.
        // Si no (auto-confirm está habilitado), Supabase podría devolver una sesión directamente.
        if (signUpData.user && !signUpData.user.email_confirmed_at) { // O si Supabase devuelve una sesión nula aquí
          setShowConfirmModal(true);
        } else if (signUpData.user?.email_confirmed_at) { // Auto-confirmado o ya confirmado
          // Supabase client JS debería manejar la sesión. Redirigir.
          router.push('/pages/owner/register'); // O al dashboard/ruta post-login
        }

      } else {
        // Inicio de sesión
        const { data: signInData, error: signInError } = await authClient.signIn(email, password);

        if (signInError || !signInData?.session) {
          console.error("LOGIN FAILED:", signInError);
          setError(signInError?.message || "Email o contraseña incorrectos.");
          setLoading(false);
          return;
        }
        setSession(signInData.session);

        router.replace('/');
      }
    } catch (err) {
      console.error("Auth CATCH block error:", err);
      setError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setError("");
    setInfoMessage("");
    if (!email) {
      setError("Ingresa tu correo para restablecer la contraseña.");
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await authClient.resetPassword(email);
      if (resetError) {
        setError(resetError.message || "Error al enviar el correo de recuperación.");
      } else {
        setInfoMessage("Revisa tu correo para restablecer la contraseña.");
      }
    } catch {
      setError("Ocurrió un error inesperado.");
    }
    setLoading(false);
  };

  const goToVetPage = () => {
    router.push("/vet-access"); // Usar router.push
  }

  const handleModalContinue = async () => {
    // Si el usuario hace clic en "Ya confirmé", intentamos obtener la sesión actual.
    // Si Supabase ya procesó la confirmación (el usuario hizo clic en el enlace del email),
    // debería haber una sesión.
    setShowConfirmModal(false);
    setLoading(true);
    // Podríamos intentar forzar un re-fetch de la sesión o simplemente redirigir
    // y dejar que useAuthRedirect maneje la lógica si la sesión existe.
    // router.refresh(); // Podría ayudar a que onAuthStateChange se dispare si hubo cambios

    // Si el usuario ya está logueado (quizás confirmó en otra pestaña y volvió)
    // o si la sesión se estableció de alguna manera.
    const currentSession = await authClient.getSession();
    if (currentSession) {
      router.push("/pages/owner/register"); // O al dashboard
    } else {
      // Si aún no hay sesión, puede que el usuario no haya confirmado realmente
      // o haya un retraso. Podríamos mostrar un mensaje o simplemente volver al login.
      // Por ahora, lo mantenemos simple, el usuario puede intentar loguearse.
      setInfoMessage("Si ya confirmaste tu correo, intenta iniciar sesión.");
    }
    setLoading(false);
  }

  if (showConfirmModal) {
    return (
      <ModalComponent
        title="Confirma tu correo"
        description={`Te hemos enviado un correo de verificación a ${email}. Por favor revisa tu bandeja (y carpeta de spam) y haz clic en el enlace.`}
        setShowModal={setShowConfirmModal} // Permite cerrar el modal
      >
        <button
          className="contrast"
          onClick={handleModalContinue}
          style={{ width: "100%", marginTop: "1rem" }}
          aria-busy={loading}
          disabled={loading}
        >
          {loading ? "Verificando..." : "Ya confirmé, continuar"}
        </button>
      </ModalComponent>
    );
  }

  // Renderizar el formulario de login/registro
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Asegurar que ocupe toda la altura
        background: "#F9FAFB",
        padding: "1rem", // Espacio por si el form es muy grande en móviles
      }}
    >
      <article // Cambiado de form a article para que PicoCSS no aplique estilos de form globales aquí si no queremos
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "550px",
        }}
      >
        <form onSubmit={handleAuth}> {/* Formulario interno */}
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <Image loading={"lazy"} src="/logo.png" alt="Lampo" width="150" height="48" style={{ width: "auto", height: "auto", marginBottom: '10px' }} />
            <h1>{isRegistering ? "Regístrate" : "Inicia sesión"}</h1>
          </div>

          {isRegistering && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              {/* Campos de OwnerInfo */}
              <label htmlFor="name">
                Nombre
                <input id="name" type="text" autoComplete="given-name" value={ownerInfo.name || ""} onChange={e => setOwnerInfo({ ...ownerInfo, name: e.target.value })} required />
              </label>
              <label htmlFor="lastname">
                Apellido
                <input id="lastname" type="text" autoComplete="family-name" value={ownerInfo.last_name || ""} onChange={e => setOwnerInfo({ ...ownerInfo, last_name: e.target.value })} required />
              </label>
              <label htmlFor="phone">
                Teléfono
                <input id="phone" type="tel" autoComplete="tel" value={ownerInfo.phone || ""} onChange={e => setOwnerInfo({ ...ownerInfo, phone: e.target.value })} required />
              </label>
              <label htmlFor="address">
                Dirección
                <input id="address" type="text" autoComplete="address-line1" value={ownerInfo.address || ""} onChange={e => setOwnerInfo({ ...ownerInfo, address: e.target.value })} required />
              </label>
              <label htmlFor="city">
                Ciudad
                <input id="city" type="text" autoComplete="address-level2" value={ownerInfo.city || ""} onChange={e => setOwnerInfo({ ...ownerInfo, city: e.target.value })} required />
              </label>
              <label htmlFor="country">
                País
                <input id="country" type="text" autoComplete="country-name" value={ownerInfo.country || ""} onChange={e => setOwnerInfo({ ...ownerInfo, country: e.target.value })} required />
              </label>
            </div>
          )}

          <label htmlFor="email">
            Email
            <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label htmlFor="password" style={{ position: 'relative', display: 'block', marginBottom: '1rem' }}>
            Contraseña
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: '3rem' }} // Espacio para el ícono
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{
                position: 'absolute',
                right: '0.5rem', // Ajuste para que no esté tan pegado al borde del input
                top: 'calc(50% + 8px)', // Ajustar para centrarlo verticalmente respecto al input
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: '#555' // Color del ícono
              }}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </label>

          {error && <p role="alert" style={{ color: "var(--pico-form-element-invalid-active-border-color, red)", marginTop: "0.5rem" }}>{error}</p>}
          {infoMessage && <p role="status" style={{ color: "var(--pico-primary)", marginTop: "0.5rem" }}>{infoMessage}</p>}


          <button type="submit" disabled={loading} aria-busy={loading} style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? (isRegistering ? "Registrando..." : "Accediendo...") : (isRegistering ? "Registrarse" : "Entrar")}
          </button>
        </form>

        {!isRegistering && (
          <p style={{ textAlign: "right", marginTop: "0.5rem" }}>
            <button type="button" onClick={handleResetPassword} className="contrast" disabled={loading} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--pico-primary-focus)" }}>
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); setInfoMessage(""); }} disabled={loading} style={{ background: "none", border: "none", color: "var(--pico-primary)", cursor: "pointer", marginLeft: "0.25rem", textDecoration: "underline" }}>
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>

        {!isRegistering && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            <button type="button" onClick={goToVetPage} disabled={loading} style={{ background: "none", border: "none", color: "var(--pico-primary)", cursor: "pointer", textDecoration: "underline" }}>
              Soy médico veterinario sin registro
            </button>
          </p>
        )}
      </article>
    </main>
  );
}