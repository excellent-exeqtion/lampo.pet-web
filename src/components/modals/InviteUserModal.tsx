import React, { useState } from "react";
import ModalComponent from "@/components/lib/modal";
import { useUI } from "@/context/UIProvider";
import { authClient } from "@/lib/auth";

export default function InviteUserModal() {
    const { setShowInviteUserModal } = useUI();
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError("Por favor ingresa un correo válido.");
            return;
        }

        setLoading(true);

        try {
            await authClient.inviteUser(email);
            setSuccess(true);
            setEmail("");
        } catch {
            setError("Hubo un error al enviar la invitación. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalComponent
            title="Invita a un amigo"
            description="Ingresa el correo de la persona que quieres invitar a Lampo."
            setShowModal={setShowInviteUserModal}
            hideClose={false}
        >
            {success ? (
                <div style={{ textAlign: "center", color: "var(--primary-green)", margin: "1rem 0" }}>
                    ¡Invitación enviada exitosamente!
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            padding: "0.75rem",
                            borderRadius: "4px",
                            border: "1px solid var(--primary-lightgray)",
                            fontSize: "1rem"
                        }}
                        autoFocus
                    />
                    {error && <span style={{ color: "var(--pico-primary)", fontSize: "0.95rem" }}>{error}</span>}
                    <button
                        type="submit"
                        className="contrast"
                        style={{ width: "100%", marginTop: "0.5rem" }}
                        aria-busy={loading}
                        disabled={loading}
                    >
                        {loading ? "Enviando..." : "Enviar invitación"}
                    </button>
                </form>
            )}
        </ModalComponent>
    );
}