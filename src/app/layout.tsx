// app/layout.tsx
"use client";
import React from "react";
import "./globals.css";
import "@picocss/pico";
import { tooltipStyles } from "@/styles/tooltip";
import { geistMono, geistSans } from "@/styles/geist";
import { ClientAppProvider } from "@/components/index";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head><title>Lampo</title></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <style>{tooltipStyles}</style>
        <ClientAppProvider>
          <div className="container grid" style={{ minHeight: "100vh", marginLeft: '2%' }}>
            {children}
          </div>
        </ClientAppProvider>
      </body>
    </html>
  );
}