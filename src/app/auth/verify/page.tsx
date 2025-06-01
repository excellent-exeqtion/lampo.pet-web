// app/pages/auth/verify/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth"; // Importar authClient directamente
import LoadingComponent from "@/components/lib/loading"; // Un componente de carga

export default function VerifyEmailPage() { // Renombrado para claridad
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para leer query params en App Router

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
      setTimeout(() => router.replace("/login"), 5000); // Redirigir al login después de un error
      return;
    }

    const handleSessionFromURL = async () => {
      if (access_token && refresh_token) {
        try {
          // Llama directamente a authClient.setSession o a tu wrapper en authService
          await authClient.setSession({ access_token, refresh_token });
          // Después de setSession, Supabase JS SDK debería actualizar su estado interno.
          // onAuthStateChange debería dispararse.
          // Redirigir a la página post-verificación/login
          router.replace("/pages/owner/register"); // O al dashboard principal
        } catch (err) {
          console.error("Error al establecer sesión desde URL:", err);
          setMessage("Hubo un problema al verificar tu sesión. Serás redirigido al login.");
          setTimeout(() => router.replace("/login"), 3000);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Si no hay tokens en la URL, podría ser una visita directa o un error.
        // Intentar obtener la sesión actual para ver si ya está autenticado.
        checkExistingSession();
      }
    };

    const checkExistingSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session) {
          // Ya hay una sesión, quizás el usuario ya verificó y volvió.
          // No es necesario llamar a setAuthSession si getAuthSession ya la devuelve.
          router.replace("/pages/owner/register"); // O al dashboard
        } else {
          // No hay tokens en URL y no hay sesión activa
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

    // Flujo principal:
    // Supabase Auth Helpers y onAuthStateChange deberían manejar la sesión
    // automáticamente cuando el usuario es redirigido de vuelta a la app
    // después de hacer clic en el enlace de verificación, si los tokens están en el hash (#)
    // y no en los query params (?).
    // Si los tokens SÍ vienen como query params (access_token, refresh_token),
    // entonces la lógica de handleSessionFromURL es necesaria.

    // Supabase por defecto ahora usa fragmentos (#) para los tokens de recuperación de sesión.
    // El SDK de Supabase JS (browserClient) debería detectar estos fragmentos automáticamente
    // al cargar la página y disparar onAuthStateChange.

    // Verificamos si hay un evento de 'SIGNED_IN' pendiente debido a un hash.
    // Si no, procedemos con la lógica de query params.
    const { data: authListener } = authClient.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setIsLoading(false);
          // La sesión se estableció por el SDK a través del hash.
          router.replace("/pages/owner/register"); // O al dashboard
          authListener?.unsubscribe(); // Limpiar el listener una vez usado
        } else if (event === "INITIAL_SESSION") {
          // Si hay una sesión inicial pero no fue por SIGNED_IN (hash),
          // puede que los tokens vengan por query params.
          authListener?.unsubscribe(); // Ya no necesitamos este listener específico.
          handleSessionFromURL();
        } else if (event === 'USER_UPDATED' && session) {
          // Podría ser el caso después de un reset de contraseña exitoso
          setIsLoading(false);
          router.replace("/"); // O al dashboard
          authListener?.unsubscribe();
        }
      }
    );

    // Si después de un breve tiempo no hubo evento SIGNED_IN (por hash),
    // y no estamos ya manejando query_params, procedemos con query_params.
    // Esto es un fallback por si el listener no captura el hash a tiempo.
    const fallbackTimer = setTimeout(() => {
      if (isLoading) { // Solo si todavía estamos cargando (el listener no resolvió)
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
  }, [router, searchParams]); // searchParams como dependencia

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center", maxWidth: '500px', margin: 'auto' }}>
      <h1>Verificación</h1>
      <p>{message}</p>
      {!isLoading && <button onClick={() => router.push('/login')}>Ir a Iniciar Sesión</button>}
    </div>
  );
}