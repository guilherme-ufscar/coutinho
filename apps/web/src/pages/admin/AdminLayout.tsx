import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";

const links = [
  { to: "/admin", label: "Clientes", end: true },
  { to: "/admin/alimentos", label: "Banco de alimentos" },
  { to: "/admin/exercicios", label: "Banco de exercícios" },
  { to: "/admin/biblioteca", label: "Biblioteca" },
  { to: "/admin/notificacoes", label: "Notificações" },
  { to: "/admin/cupons", label: "Cupons" },
  { to: "/admin/assinaturas", label: "Planos & Assinaturas" },
  { to: "/admin/pagamentos", label: "Pagamentos" },
];

export function AdminLayout({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-base)" }}>
      <style>{`
        .admin-navitem { transition: background var(--motion-fast), color var(--motion-fast); }
        .admin-navitem:hover { background: var(--nav-hover); }
      `}</style>
      <aside
        style={{
          width: "var(--sidebar-w)",
          flexShrink: 0,
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-hairline)",
          padding: "var(--sp-6) 0",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-3)", padding: "0 var(--sp-6)" }}>
          <ContinuityRing progress={0.6} size={26} strokeWidth={3} />
          <span className="display" style={{ fontWeight: 700, fontSize: "1rem", color: "var(--accent)" }}>
            CoutHealth
          </span>
          <span style={{ fontSize: "0.6875rem", color: "var(--text-tertiary)", marginLeft: "auto", letterSpacing: "0.06em" }}>
            ADMIN
          </span>
        </div>
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="admin-navitem"
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-3)",
                padding: "12px var(--sp-6)",
                borderLeft: `3px solid ${isActive ? "var(--accent)" : "transparent"}`,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                fontSize: "var(--fs-body-sm)",
                textDecoration: "none",
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {title && (
          <header
            style={{
              height: "var(--header-h)",
              flexShrink: 0,
              borderBottom: "1px solid var(--border-hairline)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 var(--sp-8)",
              gap: "var(--sp-4)",
            }}
          >
            <h1 className="display" style={{ fontSize: "var(--fs-title-lg)", margin: 0 }}>
              {title}
            </h1>
            {actions && <div style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center" }}>{actions}</div>}
          </header>
        )}
        <main style={{ flex: 1, padding: "var(--sp-8)", overflow: "auto" }}>{children}</main>
      </div>
    </div>
  );
}
