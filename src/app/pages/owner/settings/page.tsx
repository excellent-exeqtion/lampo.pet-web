// app/settings/page.tsx (client component)

"use client";
import { Title } from "@/components/index";
import { useAppContext } from "@/components/layout/ClientAppProvider";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { putFetch } from "@/services/apiService";
import type { OwnerDataType } from "@/types/index";
import React, { FormEvent, useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";

export default function SettingsPage() {
  const { isMobile } = useDeviceDetect();
  const { session } = useAppContext();
  const userId = session?.db?.user.id;
  const userEmail = session?.db?.user.email;

  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerDataType>>({
    name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    email: ""
  });

  const [loadLoading, setLoadLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formFailed, setFormFailed] = useState(false);

  useEffect(() => {
    if (!session || !userId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/owner?userId=${encodeURIComponent(userId)}`);
        const json = await res.json();
        if (res.ok) {
          setOwnerInfo(json.owner);
        } else {
          console.error("Error al obtener owner:", json.error);
          setError("No se pudo cargar la información del dueño.");
          setFormFailed(true);
        }
      } catch (err) {
        console.error("Fetch owner error:", err);
        setError("Error de red al cargar datos.");
        setFormFailed(true);
      }
      finally {
        setLoadLoading(false);
      }
    };

    fetchData();
  }, [userId, session]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId) {
      setError("Usuario no identificado.");
      setFormFailed(true);
      return;
    }

    try {
      if (userEmail) {
        const payload: OwnerDataType = {
          owner_id: userId,
          name: ownerInfo.name || "",
          last_name: ownerInfo.last_name || "",
          phone: ownerInfo.phone || "",
          address: ownerInfo.address || "",
          city: ownerInfo.city || "",
          country: ownerInfo.country || "",
          email: userEmail
        };

        const res = await putFetch('/api/owner', payload);
        const json = await res.json();

        if (res.ok) {
          setError("Datos actualizados correctamente.");
          setFormFailed(false);
        } else {
          console.error("API error:", json.error);
          setError(json.error || "Error al guardar los cambios.");
          setFormFailed(true);
        }
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Error de red al guardar cambios.");
      setFormFailed(true);
    }
  };

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      <section style={{ marginBottom: "2rem" }}>
        <Title icon={<FaCog />} title="Configuración del dueño" />
        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gap: "1rem" }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label htmlFor="name">
              Nombre
              <input
                id="name"
                type="text"
                autoComplete="given-name"
                disabled={loadLoading}
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
                disabled={loadLoading}
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
                autoComplete="tel"
                disabled={loadLoading}
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
                disabled={loadLoading}
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
                disabled={loadLoading}
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
                disabled={loadLoading}
                autoComplete="country-name"
                value={ownerInfo.country || ""}
                onChange={e => setOwnerInfo({ ...ownerInfo, country: e.target.value })}
                required
              />
            </label>
          </div>

          <button type="submit">
            Guardar cambios
          </button>

          {error && (
            <p style={{ color: formFailed ? "red" : "green" }}>{error}</p>
          )}
        </form>
      </section>
    </main>
  );
}
