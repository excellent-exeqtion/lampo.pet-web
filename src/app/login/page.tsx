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
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { CountryCodeInput } from "@/components/index";
import { Country, City } from 'country-state-city';
import type { ICountry, ICity } from 'country-state-city';
import { v4 as uuidv4 } from 'uuid';

// Importamos el MapPicker de forma dinámica
const MapPicker = dynamic(() => import('@/components/forms/MapPicker'), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>
});

export default function LoginPage() {

  const BOGOTA_COORDS = { lat: 4.60971, lng: -74.08175 };

  const router = useRouter();
  const { db: session, setSession } = useSessionContext();
  const { t: translate } = useTranslation('errors');

  const t = (error?: string): string => {
    const errorMsg = error ?? "";
    return translate(errorMsg, { defaultValue: translate('default') })
  }

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
    city: "Bogotá",
    country: "CO",
    email: "", // Se llenará desde el campo de email común
    latitude: BOGOTA_COORDS.lat,
    longitude: BOGOTA_COORDS.lng,
  });

  const [phone, setPhone] = useState<string | undefined>("+57");
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Cargar lista de países al montar
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Actualizar lista de ciudades cuando cambia el país
  useEffect(() => {
    if (ownerInfo.country) {
      setCities(City.getCitiesOfCountry(ownerInfo.country) || []);
    }
  }, [ownerInfo.country]);

  useEffect(() => {
    if (!ownerInfo.address) return;

    const handler = setTimeout(async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ownerInfo.address || '')}&format=json&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          setOwnerInfo(prev => ({ ...prev, latitude: parseFloat(lat), longitude: parseFloat(lon) }));
        }
      } catch (e) {
        console.error("Error de geocodificación:", e);
      }
    }, 1000); // Debounce de 1 segundo para no hacer llamadas en cada tecleo

    return () => clearTimeout(handler);
  }, [ownerInfo.address]);

  // Geocodificación Inversa (Coordenadas -> Ciudad/País)
  useEffect(() => {
    if (!ownerInfo.latitude || !ownerInfo.longitude) return;
    const fetchLocationData = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ownerInfo.latitude}&lon=${ownerInfo.longitude}&format=json&accept-language=es`);
        const data = await response.json();
        if (data && data.address) {
          const countryCode = data.address.country_code.toUpperCase();
          setOwnerInfo(prev => ({ ...prev, country: countryCode }));

          const cityName = data.address.city || data.address.town || data.address.village;
          if (cityName) {
            setOwnerInfo(prev => ({ ...prev, city: cityName  }));
          }
        }
      } catch (e) {
        console.error("Error de geocodificación inversa:", e);
      }
    };
    fetchLocationData();
  }, [ownerInfo.latitude, ownerInfo.longitude]);

  // Redirigir si ya hay sesión
  useEffect(() => {
    if (session) {
      router.replace("/pages/home"); // O a la página de dashboard
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
          setError(t(signUpError?.message) || "Error al registrar el usuario. Inténtalo de nuevo.");
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
              phone: phone,
              email
            }),
          });
          if (!response.ok) {
            console.log('response', response);
            const errorData = await response.json();
            setError(t(errorData.message) || "Error creando el perfil del dueño.");
            // Considerar un rollback o manejo de error si el perfil no se crea después del auth.
            setLoading(false);
            return;
          }
        }
        if (signUpData.user && !signUpData.user.email_confirmed_at) {
          setShowConfirmModal(true);
        } else if (signUpData.user?.email_confirmed_at) {
          router.push('/pages/owner/register');
        }

      } else {
        // Inicio de sesión
        const { data: signInData, error: signInError } = await authClient.signIn(email, password);

        if (signInError || !signInData?.session) {
          setError(t(signInError?.message) || "Email o contraseña incorrectos.");
          setLoading(false);
          return;
        }
        setSession(signInData.session);

        router.replace('/pages/home');
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
    router.replace("/vet-access"); // Usar router.push
  }

  const handleModalContinue = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    const currentSession = await authClient.getSession();
    if (currentSession) {
      router.push("/pages/owner/register");
    } else {
      setInfoMessage("Si ya confirmaste tu correo, intenta iniciar sesión.");
    }
    setLoading(false);
  }

  if (showConfirmModal) {
    return (
      <ModalComponent
        title="Confirma tu correo"
        description={`Te hemos enviado un correo de verificación a ${email}. Por favor revisa tu bandeja (y carpeta de spam) y haz clic en el enlace.`}
        setShowModal={setShowConfirmModal}
        hideClose={true}
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

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--primary-ligthgray)",
        padding: "1rem",
      }}
    >
      <article
        style={{
          background: "var(--primary-inverse)",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px var(--primary-lighttransparent)",
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
            <>
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
                  <CountryCodeInput value={phone} onChange={setPhone} />
                </label>
                <label htmlFor="country">
                  País
                  <select id="country" value={ownerInfo.country || ''} onChange={e => setOwnerInfo({ ...ownerInfo, country: e.target.value })} required>
                    <option value="" disabled>Selecciona...</option>
                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                  </select>
                </label>

                {/* Fila 3 */}
                <label htmlFor="city">
                  Ciudad
                  <input list="cities-list" id="city" type="text" value={ownerInfo.city || ""} onChange={e => setOwnerInfo({ ...ownerInfo, city: e.target.value })} required disabled={!ownerInfo.country} />
                  <datalist id="cities-list">
                    {cities.map(c => <option key={uuidv4()} value={c.name} />)}
                  </datalist>
                </label>
                <label htmlFor="address">
                  Dirección
                  <input id="address" type="text" value={ownerInfo.address || ""} onChange={e => setOwnerInfo({ ...ownerInfo, address: e.target.value })} required />
                </label>
              </div>

              {/* Mapa */}
              <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <small>Haz clic en el mapa o arrastra el marcador para ajustar tu ubicación.</small>
                <MapPicker
                  coords={{ lat: ownerInfo.latitude!, lng: ownerInfo.longitude! }}
                  onCoordsChange={({ lat, lng }) => setOwnerInfo(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                />
              </div>
            </>
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
                right: '0.5rem',
                top: 'calc(50% + 8px)',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                color: 'var(--primary-darkgray)'
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
            <button type="button" onClick={handleResetPassword} className="contrast" disabled={loading} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--pico-primary)" }}>
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        )}

        <p style={{ textAlign: "center", padding: 0 }}>
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); setInfoMessage(""); }} disabled={loading} style={{ background: "none", border: "none", color: "var(--pico-primary)", cursor: "pointer", marginLeft: "0.25rem", textDecoration: "underline", padding: 0 }}>
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>

        {!isRegistering && (
          <p style={{ textAlign: "center", padding: 0 }}>
            <button type="button" onClick={goToVetPage} disabled={loading} style={{ background: "none", border: "none", color: "var(--pico-primary)", cursor: "pointer", textDecoration: "underline", padding: 0 }}>
              Soy médico veterinario sin registro
            </button>
          </p>
        )}
      </article>
    </main >
  );
}