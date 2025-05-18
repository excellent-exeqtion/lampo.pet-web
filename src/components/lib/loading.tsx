// components/Loading.tsx
import React from "react";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="loading-container">
      <FaSpinner className="spinner" size={48} />
      <p>Cargando...</p>

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          color: #6b7280; /* gris secundario */
        }
        .spinner {
          color: #3b82f6; /* azul primario */
          margin-bottom: 1rem;
          animation: spin 1s linear infinite;
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
