// app/settings/page.tsx (server component)
"use client";
import { useAppContext } from "@/app/layout";
import { Title } from "@/components/index";
import { useDeviceDetect } from "@/hooks/useDeviceDetect";
import React, { FormEvent, useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";

export default function SettingsPage() {
    const { isMobile } = useDeviceDetect();
    const { selectedPet, setStoredPet, storedPet } = useAppContext();

    const [name, setName] = useState(selectedPet.name);
    const [image, setImage] = useState(selectedPet.image || "/pets/pet.png");
    const [alert, setAlert] = useState<string | null>(null);
    const [formFailed, setFormFailed] = useState(false);

    useEffect(() => {
        setName(storedPet.name);
        setImage(storedPet.image ?? "");
    }, [storedPet.name, storedPet.image]);

    if (selectedPet == null || selectedPet == undefined) {
        return <div></div>;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const res = await fetch(
            `${process.env.PROTOCOL}://${process.env.VERCEL_URL}/api/pets/${selectedPet.id}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image }),
            }
        );

        // ← usar res.ok para determinar éxito
        const success = res.ok;
        setFormFailed(!success);

        if (success) {
            setStoredPet({ ...selectedPet, name: name ?? "", image });
            setAlert("Datos actualizados correctamente.");
        } else {
            const json = await res.json();
            setAlert(json.error || "Error al actualizar.");
        }
    };

    return (
        <main style={{ padding: isMobile ? "4rem 1rem 2rem" : "2rem", fontSize: "0.9rem", marginTop: isMobile ? "3.5rem" : "0" }}>
            <section style={{ marginBottom: "2rem" }}>
                {<Title icon={<FaCog />} title="Configuración de la mascota" />}
                <form
                    onSubmit={handleSubmit}
                    style={{ maxWidth: 400, display: "grid", gap: "1rem" }}
                >
                    <label>
                        Nombre
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Imagen
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </label>

                    <button type="submit">
                        Guardar cambios
                    </button>

                    {alert && (
                        // ← solo basar color en formFailed
                        <p style={{ color: formFailed ? "red" : "green" }}>{alert}</p>
                    )}
                </form>
            </section>
            <section style={{ marginBottom: "2rem" }}>
                {<Title icon={<FaCog />} title="Configuración del dueño" />}
            </section>
        </main>

    );
}