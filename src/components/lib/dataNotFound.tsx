// components/DataNotFound.tsx
import React from "react";
import { FaInbox } from "react-icons/fa";

export interface DataNotFoundProps {
  message: string;
}

export default function DataNotFound({ message }: DataNotFoundProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        backgroundColor: "#F3F4F6",
        borderRadius: "0.5rem",
        color: "#6B7280",
        textAlign: "center",
        maxWidth: "400px",
        margin: "2rem auto",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <FaInbox
        size={48}
        style={{ marginBottom: "1rem", color: "#D1D5DB" }}
      />
      <p style={{ fontSize: "1.25rem", lineHeight: "1.5" }}>
        {message}
      </p>
    </div>
  );
}
