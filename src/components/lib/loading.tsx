// src/components/lib/loading.tsx
"use client";
import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function LoadingComponent() {
  return (
    <div className="loading-container">
      <FaSpinner
        size={48}
        style={{
          color: "var(--pico-primary)",
          marginBottom: "1rem",
          animation: "spin 1s linear infinite"
        }}
      />
      <p>Cargando...</p>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          color: var(--primary-lightgray);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        p {
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}
