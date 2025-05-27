// app/layout.tsx
"use client";
import React from "react";
import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "@/styles/tooltip";
import { geistMono, geistSans } from "@/styles/geist";
import ClientAppProvider from "@/context/ClientAppProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="light">
      <head>
        <title>Lampo</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <ClientAppProvider>{children}</ClientAppProvider>
      </body>
    </html>
  );
}
