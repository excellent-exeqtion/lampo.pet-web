// app/pages/owner/settings/page.tsx

"use client";
import { CountryCodeInput, Loading, Title } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import { getFetch, putFetch } from "@/app/api";
import type { OwnerDataType, PetType } from "@/types/index";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { FaCog, FaExclamationTriangle } from "react-icons/fa";
import { useStorageContext } from "@/context/StorageProvider";
import { useSessionContext } from "@/context/SessionProvider";
import { Empty } from "@/data/index";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Country, City } from 'country-state-city';
import type { ICountry, ICity } from 'country-state-city';
import { v4 as uuidv4 } from 'uuid';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const MapPicker = dynamic(() => import('@/components/forms/MapPicker'), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>
});

export default function SettingsPage() {
  const { isMobile } = useDeviceDetect();
  const router = useRouter();
  const session = useSessionContext();
  const storage = useStorageContext();
  const userId = session?.db?.user.id;
  const userEmail = session?.db?.user.email;

  const BOGOTA_COORDS = { lat: 4.60971, lng: -74.08175 };

  const [ownerInfo, setOwnerInfo] = useState<Partial<OwnerDataType>>({
    name: "",
    last_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    email: ""
  });
  const [phone, setPhone] = useState<string | undefined>();
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  // asumo que en tu contexto tienes la mascota seleccionada:
  const pet: PetType | null = storage.storedPet;

  const prevAddressRef = useRef<string | undefined>('');

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
            storage.setStoredOwnerData(json);
            setOwnerInfo(json);
            const phoneNumber = parsePhoneNumberFromString(json.phone || '');
            setPhone(phoneNumber ? phoneNumber.formatInternational() : json.phone);
            setPhone(json.phone || undefined);
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

  // Cargar listas de países y ciudades
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (ownerInfo.country) {
      setCities(City.getCitiesOfCountry(ownerInfo.country) || []);
    }
  }, [ownerInfo.country]);

  // Geocodificación (Dirección -> Coordenadas)
  useEffect(() => {
    if (loadLoading || !ownerInfo.address) return;

    if (ownerInfo.address === prevAddressRef.current) {
      return;
    }
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

    prevAddressRef.current = ownerInfo.address;
    return () => clearTimeout(handler);
  }, [ownerInfo.address, loadLoading]);

  // Geocodificación Inversa (Coordenadas -> Ciudad/País)
  useEffect(() => {
    if (!ownerInfo.latitude || !ownerInfo.longitude) return;
    const fetchLocationData = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${ownerInfo.latitude}&lon=${ownerInfo.longitude}&format=json&accept-language=es`);
        const data = await response.json();
        if (data && data.address) {
          const countryCode = data.address.country_code.toUpperCase();
          const cityName = data.address.city || data.address.town || data.address.village;
          setOwnerInfo(prev => ({ ...prev, country: countryCode, city: cityName }));
        }
      } catch (e) {
        console.error("Error de geocodificación inversa:", e);
      }
    };
    const timer = setTimeout(fetchLocationData, 500);
    return () => clearTimeout(timer);
  }, [ownerInfo.latitude, ownerInfo.longitude]);

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
          phone: phone!,
          address: ownerInfo.address || "",
          latitude: ownerInfo.latitude,
          longitude: ownerInfo.longitude,
          city: ownerInfo.city || "",
          country: ownerInfo.country || "",
          email: userEmail
        };

        const res = await putFetch('/api/owners', undefined, payload);
        const json = await res.json();

        if (res.ok) {
          setError("Datos actualizados correctamente.");
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
      storage.resetPet();
      storage.setStoredPet(Empty.Pet());
      router.replace("/pages/home");
    } else {
      console.error("Error al eliminar mascota");
    }
  };

  return (
    <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
      <section style={{ marginBottom: "2rem" }}>
        <Title icon={<FaCog />} title="Configuración del dueño" />
        {loadLoading ? <Loading /> : (
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
            </div>

            {/* Fila 2: País y Ciudad */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label htmlFor="country">
                País
                <select id="country" value={ownerInfo.country || ''} onChange={e => setOwnerInfo({ ...ownerInfo, city: '', country: e.target.value })} required>
                  <option value="" disabled>Selecciona...</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
              </label>
              <label htmlFor="city">
                Ciudad
                <input list="cities-list" id="city" type="text" value={ownerInfo.city || ""} onChange={e => setOwnerInfo({ ...ownerInfo, city: e.target.value })} required disabled={!ownerInfo.country} />
                <datalist id="cities-list">
                  {cities.map(c => <option key={uuidv4()} value={c.name} />)}
                </datalist>
              </label>
            </div>

            {/* Fila 3: Teléfono y Dirección */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label htmlFor="phone">
                Teléfono
                <CountryCodeInput value={phone} onChange={setPhone} />
              </label>
              <label htmlFor="address">
                Dirección
                <input id="address" type="text" value={ownerInfo.address || ""} onChange={e => setOwnerInfo({ ...ownerInfo, address: e.target.value })} required />
              </label>
            </div>

            {/* Fila 4: Mapa */}
            <div>
              <label>Ubicación en el mapa</label>
              <small style={{ display: 'block', marginBottom: '0.5rem' }}>Haz clic o arrastra el marcador para ajustar la ubicación.</small>
              <MapPicker
                coords={{ lat: ownerInfo.latitude || BOGOTA_COORDS.lat, lng: ownerInfo.longitude || BOGOTA_COORDS.lng }}
                onCoordsChange={({ lat, lng }) => setOwnerInfo(prev => ({ ...prev, latitude: lat, longitude: lng }))}
              />
            </div>

            <button type="submit" disabled={loadLoading}>
              Guardar cambios
            </button>

            {error && (
              <p style={{ color: formFailed ? "var(--primary-red)" : "var(--primary-green)" }}>{error}</p>
            )}
          </form>
        )}
      </section>

      {/* ——— Sección Danger Zone para eliminar mascota ——— */}
      {pet && storage.storedPet.id && (
        <section
          style={{
            marginTop: "3rem",
            padding: "1rem",
            border: "1px solid var(--primary-red)",
            borderRadius: "6px",
          }}
        >
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--primary-red)",
            }}
          >
            <FaExclamationTriangle /> Zona de peligro
          </h3>
          <p>Eliminar permanentemente la mascota seleccionada.</p>
          <button
            type="button"
            style={{
              backgroundColor: "var(--primary-red)",
              color: "var(--primary-inverse)",
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
            backgroundColor: "var(--primary-darkertransparent)",
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
                border: "1px solid var(--primary-lightgray)",
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
                  backgroundColor: "var(--primary-red)",
                  color: "var(--primary-inverse)",
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
