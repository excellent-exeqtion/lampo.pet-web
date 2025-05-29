// app/pages/auth/verify/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFetch, postFetch } from "@/app/api";

export default function VerifyEmail() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get("access_token");
    const refresh_token = url.searchParams.get("refresh_token");
    const type = url.searchParams.get("type");

    const trySetSession = async () => {
      try {
        const response = await postFetch("/api/auth/set-session", undefined, { access_token, refresh_token });
        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error("Error al establecer sesión:", result.message);
          router.replace("/login");
          return;
        }

        router.replace("/owners/register");
      } catch (err) {
        console.error("Error de red al establecer sesión:", err);
        router.replace("/login");
      }
    };

    const checkSession = async () => {
      try {
        const response = await getFetch("/api/auth/session");
        const result = await response.json();

        if (response.ok && result.success && result.session) {
          router.replace("/owners/register");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Error al verificar sesión:", err);
        router.replace("/login");
      }
    };

    if (access_token && refresh_token && type === "signup") {
      trySetSession();
    } else {
      checkSession();
    }
  }, [router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: '500px' }}>
      <h1>Verificando tu correo…</h1>
      <p>Por favor espera un momento.</p>
    </div>
  );
}
