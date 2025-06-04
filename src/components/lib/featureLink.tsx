// src/components/lib/field.tsx
import Link from "next/link";
import React from "react";

interface FeatureLinkProps {
  icon: React.ReactNode;
  href: string;
  title: string;
  desc: string;
  click?: () => void;
}

export default function FeatureLink({ icon, href, title, desc, click }: FeatureLinkProps) {
  return (
    <li style={{ marginBottom: "1.2rem" }}>
      <Link
        href={click ? '' : href}
        className="contrast"
        onClick={click}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          textDecoration: "none",
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "var(--primary-inverse)",
          boxShadow: "0 1px 6px var(--primary-lighttransparent)",
          transition: "background 0.2s",
        }}
      >
        <span style={{ fontSize: 28, minWidth: 40 }}>{icon}</span>
        <span>
          <strong>{title}</strong>
          <br />
          <span style={{ fontSize: "0.98rem", color: "var(--primary-darkgray)" }}>{desc}</span>
        </span>
      </Link>
    </li>
  );
}