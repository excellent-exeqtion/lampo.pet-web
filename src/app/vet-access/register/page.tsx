// app/vet-access/register/page.tsx
"use client";
import React, { FormEvent, useEffect, useState } from "react";
import "@picocss/pico";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/lib/modal";
import { postFetch } from "@/app/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authClient } from "@/lib/auth";
import Link from "next/link";
import { Country, City } from 'country-state-city';
import type { ICountry, ICity } from 'country-state-city';
import { v4 as uuidv4 } from 'uuid';

export default function VetRegisterPage() {
  const router = useRouter();

  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [firstLastName, setFirstLastName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [identification, setIdentification] = useState("");
  const [registration, setRegistration] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("Bogotá");
  const [country, setCountry] = useState("CO");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);


  // Cargar lista de países al montar
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Actualizar lista de ciudades cuando cambia el país
  useEffect(() => {
    if (country) {
      setCities(City.getCitiesOfCountry(country) || []);
    }
  }, [country]);

  // Estados UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (![firstName, firstLastName, secondLastName, identification, registration, clinicName, city, email, password].every(Boolean)) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      // 1) Crear cuenta en auth
      const { data: { user } } = await authClient.signUp(email, password, 'veterinarian');
      const vetId = user?.id;
      /*
      const signUpRes = await postFetch("/api/auth/sign-up", undefined, { email, password, role: 'veterinarian' });
      const signUpJson = await signUpRes.json();
      if (!signUpRes.ok || !signUpJson.success) {
        setError("Error al registrar la cuenta.");
        return;
      }
      const vetId = signUpJson.user?.id;*/
      if (vetId) {
        // 2) Guardar perfil de veterinario
        const profileRes = await postFetch("/api/vet", undefined, {
          vet_id: vetId,
          first_name: firstName,
          first_last_name: firstLastName,
          second_last_name: secondLastName,
          identification: identification,
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
          onClick={() => router.push("/login")}
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
          background: "var(--primary-inverse)",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 8px var(--primary-lighttransparent)",
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
            Primer Apellido
            <input
              type="text"
              value={firstLastName}
              onChange={e => setFirstLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Segundo Apellido
            <input
              type="text"
              value={secondLastName}
              onChange={e => setSecondLastName(e.target.value)}
              required
            />
          </label>
          <label>
            Identificación
            <input
              type="text"
              value={identification}
              onChange={e => setIdentification(e.target.value)}
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
          <label htmlFor="country">
            País
            <select id="country" value={country} onChange={e => setCountry(e.target.value)} required>
              <option value="" disabled>Selecciona...</option>
              {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>
          </label>

          {/* Fila 3 */}
          <label htmlFor="city">
            Ciudad
            <input list="cities-list" id="city" type="text" value={city || ""} onChange={e => setCity(e.target.value)} required disabled={!country} />
            <datalist id="cities-list">
              {cities.map(c => <option key={uuidv4()} value={c.name} />)}
            </datalist>
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
            {showPassword ? <FaEyeSlash size={23} color={'var(--pico-contrast)'} style={{ marginTop: '16px' }} /> : <FaEye size={23} color={'var(--pico-contrast)'} style={{ marginTop: '16px' }} />}
          </button>
        </label>

        {error && <p style={{ color: "var(--primary-red)", marginTop: "0.5rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", marginTop: "1rem" }}
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>

        <Link href="/login" className="primary">
          Iniciar sesión
        </Link>
      </form>
    </main>
  );
}
