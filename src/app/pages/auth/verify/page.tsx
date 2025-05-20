// app/pages/auth/verify/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, setSession } from "@/services/authService";

export default function VerifyEmail() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get("access_token");
    const refresh_token = url.searchParams.get("refresh_token");
    const type = url.searchParams.get("type");

    if (access_token && refresh_token && type === "signup") {
      setSession({ access_token, refresh_token })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then(({ error }: any) => {
          if (error) {
            console.error("Error al establecer sesión:", error.message);
            router.replace("/login");
            return;
          }
          router.replace("/owners/register");
        });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      getSession().then(({ data: { session } }: any) => {
        if (session) {
          router.replace("/owners/register");
        } else {
          router.replace("/login");
        }
      });
    }
  }, [router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: '500px' }}>
      <h1>Verificando tu correo…</h1>
      <p>Por favor espera un momento.</p>
    </div>
  );
}
