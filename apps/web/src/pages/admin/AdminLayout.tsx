import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";

const links = [
  { to: "/admin", label: "Clientes", end: true },
  { to: "/admin/alimentos", label: "Banco de alimentos" },
  { to: "/admin/exercicios", label: "Banco de exercícios" },
  { to: "/admin/biblioteca", label: "Biblioteca" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: "1px solid var(--border-hairline)",
          padding: "var(--sp-6) var(--sp-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)" }}>
          <ContinuityRing progress={0.6} size={32} strokeWidth={4} />
          <span className="display" style={{ fontWeight: 700 }}>CoutHealth</span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                padding: "10px 12px",
                borderRadius: "var(--r-md)",
                color: isActive ? "var(--text-on-accent)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-grad, var(--accent))" : "transparent",
                fontWeight: 600,
                fontSize: "var(--fs-body-sm)",
                textDecoration: "none",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "var(--sp-8)", overflow: "auto" }}>{children}</main>
    </div>
  );
}
