import type { ReactNode } from "react";
import { ContinuityRing } from "@couthealth/ui";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--sp-6)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--bg-card)",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--r-lg)",
          padding: "var(--sp-8)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-6)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sp-4)", textAlign: "center" }}>
          <ContinuityRing progress={0.4} size={56} />
          <div>
            <h1 className="display" style={{ fontSize: "var(--fs-title-lg)", margin: 0 }}>
              {title}
            </h1>
            {subtitle && <p style={{ color: "var(--text-secondary)", fontSize: "var(--fs-body-sm)", margin: "8px 0 0" }}>{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
