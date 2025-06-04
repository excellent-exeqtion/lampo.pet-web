// src/components/DataNotFound.tsx
import React from "react";
import { FaInbox } from "react-icons/fa";

interface DataNotFoundProps {
  message: string;
}

export default function DataNotFoundComponent({ message }: DataNotFoundProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "var(--pico--primary)",
        borderRadius: "0.5rem",
        color: "var(--primary-lightgray)",
        textAlign: "center",
        maxWidth: "400px",
        margin: "2rem auto",
        boxShadow: "0 2px 8px var(--primary-lighttransparent)",
      }}
    >
      <FaInbox
        size={48}
        style={{ marginBottom: "1rem", color: "var(--primary-skin)" }}
      />
      <p style={{ fontSize: "1.25rem", lineHeight: "1.5" }}>
        {message}
      </p>
    </div>
  );
}
