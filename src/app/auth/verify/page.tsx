// app/pages/auth/verify/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth";
import { Loading } from "@/components/index";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState("Verificando tu correo… Por favor espera.");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    //const type = searchParams.get("type"); // ej. 'signup', 'recovery', 'magiclink'
    const error_description = searchParams.get("error_description");

    if (error_description) {
      setMessage(`Error: ${error_description}`);
      setIsLoading(false);
      setTimeout(() => router.replace("/login"), 5000);
      return;
    }

    const handleSessionFromURL = async () => {
      if (access_token && refresh_token) {
        try {
          await authClient.setSession({ access_token, refresh_token });
          router.replace("/pages/owner/register");
        } catch (err) {
          console.error("Error al establecer sesión desde URL:", err);
          setMessage("Hubo un problema al verificar tu sesión. Serás redirigido al login.");
          setTimeout(() => router.replace("/login"), 3000);
        } finally {
          setIsLoading(false);
        }
      } else {
        checkExistingSession();
      }
    };

    const checkExistingSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session) {
          router.replace("/pages/owner/register");
        } else {
          setMessage("No se pudo verificar la sesión. Es posible que el enlace haya expirado o ya haya sido utilizado. Serás redirigido al login.");
          setTimeout(() => router.replace("/login"), 5000);
        }
      } catch (err) {
        console.error("Error al verificar sesión existente:", err);
        setMessage("Error al verificar tu estado. Serás redirigido al login.");
        setTimeout(() => router.replace("/login"), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: authListener } = authClient.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setIsLoading(false);
          router.replace("/pages/owner/register");
          authListener?.unsubscribe();
        } else if (event === "INITIAL_SESSION") {
          authListener?.unsubscribe();
          handleSessionFromURL();
        } else if (event === 'USER_UPDATED' && session) {
          setIsLoading(false);
          router.replace("/");
          authListener?.unsubscribe();
        }
      }
    );

    const fallbackTimer = setTimeout(() => {
      if (isLoading) {
        authListener?.unsubscribe();
        console.log("Fallback: onAuthStateChange no capturó SIGNED_IN por hash, intentando con query params.");
        handleSessionFromURL();
      }
    }, 1500); // Esperar 1.5 segundos

    return () => {
      authListener?.unsubscribe();
      clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, searchParams]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: '500px', margin: 'auto' }}>
      <h1>Verificación</h1>
      <p>{message}</p>
      {!isLoading && <button onClick={() => router.push('/login')}>Ir a Iniciar Sesión</button>}
    </div>
  );
}