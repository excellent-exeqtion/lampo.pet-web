// app/layout.tsx
"use client";
import React from "react";
import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "@/styles/tooltip";
import { geistMono, geistSans } from "@/styles/geist";
import { usePathname } from "next/navigation";
import { AppContextProvider } from "@/context/AppContextProvider";
import ClientAppProvider from "@/context/ClientAppProvider";
import dynamic from 'next/dynamic'

const I18nInit = dynamic(
  () => import('../components/i18n'),
  { ssr: false }
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noClientAppProviderRoutes = ["/", "/login", "/vet-access", "/vet-access/register", "/pages/auth/verify", "_not-found"];
  const shouldUseClientAppProvider = !noClientAppProviderRoutes.includes(pathname);

  return (
    <html lang="es" data-theme="light" className="no-select">
      <head>
        <title>Lampo</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <I18nInit />
        <AppContextProvider>
          {shouldUseClientAppProvider ? (
            <ClientAppProvider>
              {children}
            </ClientAppProvider>
          ) : (
            <>
              {children}
            </>
          )}
        </AppContextProvider>
      </body>
    </html >
  );
}