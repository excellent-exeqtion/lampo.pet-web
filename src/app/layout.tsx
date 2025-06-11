// app/layout.tsx
"use client";
import React from "react";
import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "@/styles/tooltip";
import { geistMono, geistSans } from "@/styles/geist";
import { ClientAppProvider } from "../components";
import { usePathname } from "next/navigation";
import { SessionProvider } from "@/context/SessionProvider";
import '../lib/i18n';
import { StorageProvider } from "@/context/StorageProvider";
import { RoleProvider } from "@/context/RoleProvider";
import { VetProvider } from "@/context/VetContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noClientAppProviderRoutes = ["/", "/login", "/vet-access", "/pages/auth/verify"];
  const shouldUseClientAppProvider = !noClientAppProviderRoutes.includes(pathname);
  

  return (
    <html lang="es" data-theme="light" className="no-select">
      <head>
        <title>Lampo</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <SessionProvider>
          <StorageProvider>
            <RoleProvider>
              <VetProvider>
                {shouldUseClientAppProvider ? (
                  <ClientAppProvider>
                    {children}
                  </ClientAppProvider>
                ) : (
                  <>
                    {children}
                  </>
                )}

              </VetProvider>
            </RoleProvider>
          </StorageProvider>
        </SessionProvider>
      </body>
    </html >
  );
}