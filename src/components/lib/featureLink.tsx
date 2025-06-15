// src/components/lib/featureLink.tsx
import Link from "next/link";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface FeatureLinkProps {
  icon: React.ReactNode;
  href: string;
  title: string;
  desc: string;
  click?: () => void;
  isDone?: boolean;
}

export default function FeatureLink({ icon, href, title, desc, click, isDone = false }: FeatureLinkProps) {
  return (
    <li style={{ marginBottom: "1.2rem", position: 'relative' }}>
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
          borderLeft: isDone ? '5px solid var(--primary-green)' : '5px solid transparent'
        }}
      >
        {isDone && (
          <FaCheckCircle style={{ color: 'var(--primary-green)', position: 'absolute', top: '0.5rem', right: '0.5rem' }} />
        )}
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