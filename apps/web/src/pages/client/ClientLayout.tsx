import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { ContinuityRing } from "@couthealth/ui";

const links = [
  { to: "/app", label: "Início", end: true },
  { to: "/app/nutricao", label: "Nutrição" },
  { to: "/app/treino", label: "Treino" },
  { to: "/app/biblioteca", label: "Biblioteca" },
  { to: "/app/mensagens", label: "Mensagens" },
  { to: "/app/notificacoes", label: "Notificações" },
  { to: "/app/perfil", label: "Perfil" },
];

const navLinkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: "var(--r-md)",
  color: isActive ? "var(--text-on-accent)" : "var(--text-secondary)",
  background: isActive ? "var(--accent-grad, var(--accent))" : "transparent",
  fontWeight: 600,
  fontSize: "var(--fs-body-sm)",
  textDecoration: "none",
  textAlign: "center",
  whiteSpace: "nowrap",
});

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="client-shell" style={{ minHeight: "100vh", display: "flex" }}>
      <style>{`
        .client-shell { flex-direction: row; }
        .client-sidebar { display: flex; }
        .client-bottomnav { display: none; }
        @media (max-width: 720px) {
          .client-shell { flex-direction: column; }
          .client-sidebar { display: none; }
          .client-bottomnav {
            display: flex; position: fixed; bottom: 0; left: 0; right: 0;
            background: var(--bg-surface); border-top: 1px solid var(--border-hairline);
            padding: 8px; justify-content: space-around; z-index: 40; overflow-x: auto;
          }
          .client-main { padding-bottom: 84px !important; }
        }
      `}</style>

      <aside
        className="client-sidebar"
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: "1px solid var(--border-hairline)",
          padding: "var(--sp-6) var(--sp-4)",
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
            <NavLink key={link.to} to={link.to} end={link.end} style={navLinkStyle}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="client-main" style={{ flex: 1, padding: "var(--sp-8) var(--sp-6)" }}>
        {children}
      </main>

      <nav className="client-bottomnav">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} style={(state) => ({ ...navLinkStyle(state), fontSize: "var(--fs-caption)", padding: "6px 8px" })}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
