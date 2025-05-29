// app/pages/owner/settings/page.tsx

"use client";
import { Title } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { getFetch, putFetch } from "@/app/api";
import type { OwnerDataType, PetType } from "@/types/index";
import React, { FormEvent, useEffect, useState } from "react";
import { FaCog, FaExclamationTriangle } from "react-icons/fa";
import { usePetStorage } from "@/context/PetStorageProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { Empty } from "@/data/index";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { isMobile } = useDeviceDetect();
  const router = useRouter();
  const session = useSessionContext();
  const storage = usePetStorage();
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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  // asumo que en tu contexto tienes la mascota seleccionada:
  const pet: PetType | null = storage.storedPet;

  const [loadLoading, setLoadLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formFailed, setFormFailed] = useState(false);

  useEffect(() => {
    if (!session || !userId) return;

    const fetchData = async () => {
      try {
        if (!storage.storedOwnerData.owner_id) {
          const res = await getFetch(`/api/owners/${encodeURIComponent(userId)}`);
          const json = await res.json();
          if (res.ok) {
            console.log(json);
            storage.setStoredOwnerData(json);
            setOwnerInfo(json);
          } else {
            console.error("Error al obtener owner:", json.error);
            setError("No se pudo cargar la información del dueño.");
            setFormFailed(true);
          }
        }
        else {
          setOwnerInfo(storage.storedOwnerData);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const res = await putFetch('/api/owners', undefined, payload);
        const json = await res.json();

        if (res.ok) {
          setError("Datos actualizados correctamente.");
          console.log(payload);
          storage.setStoredOwnerData(payload);
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

  const handleDelete = async () => {
    if (!pet) return;
    const res = await fetch(`/api/pets/${encodeURIComponent(pet.id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      // actualizar lista en el contexto
      storage.setStoredOwnerPets(
        storage.storedOwnerPets.filter((p) => p.id !== pet.id)
      );
      storage.setStoredPet(Empty.Pet());
      router.replace("/");
    } else {
      console.error("Error al eliminar mascota");
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


      {/* ——— Sección Danger Zone para eliminar mascota ——— */}
      {pet && (
        <section
          style={{
            marginTop: "3rem",
            padding: "1rem",
            border: "1px solid #d73a49",
            borderRadius: "6px",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#d73a49",
            }}
          >
            <FaExclamationTriangle /> Danger Zone
          </h3>
          <p>Eliminar permanentemente la mascota seleccionada.</p>
          <button
            type="button"
            style={{
              backgroundColor: "#d73a49",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={() => setShowDeleteModal(true)}
          >
            Eliminar mascota
          </button>
        </section>
      )}

      {/* ——— Modal de confirmación ——— */}
      {showDeleteModal && pet && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "6px",
              width: "90%",
              maxWidth: "400px",
            }}
          >
            <h2>Confirmar eliminación</h2>
            <p>
              Escribe el nombre de la mascota{" "}
              <strong>{pet.name}</strong> para confirmar:
            </p>
            <input
              type="text"
              placeholder="Nombre de la mascota"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.5rem",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={confirmText !== pet.name}
                style={{
                  backgroundColor: "#d73a49",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    confirmText === pet.name ? "pointer" : "not-allowed",
                  opacity: confirmText === pet.name ? 1 : 0.6,
                }}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
