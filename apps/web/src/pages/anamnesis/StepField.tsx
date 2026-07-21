import type { FieldConfig } from "./steps";

interface Props {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--bg-base)",
  border: "1px solid var(--border-hairline)",
  borderRadius: "var(--r-md)",
  padding: "0 16px",
  height: 44,
  color: "var(--text-primary)",
  fontFamily: "var(--font-body)",
  fontSize: "var(--fs-body-lg)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

export function StepField({ field, value, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
      <label style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>{field.label}</label>

      {field.type === "textarea" && (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ ...inputStyle, height: "auto", padding: "12px 16px", resize: "vertical", fontFamily: "var(--font-body)" }}
        />
      )}

      {(field.type === "text" || field.type === "date") && (
        <input
          type={field.type}
          value={field.type === "date" ? String(value ?? "").slice(0, 10) : (value as string) ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={(value as number) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
          style={inputStyle}
        />
      )}

      {field.type === "select" && (
        <select value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value || undefined)} style={inputStyle}>
          <option value="">Selecione…</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "boolean" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { v: true, label: "Sim" },
            { v: false, label: "Não" },
          ].map((opt) => {
            const active = value === opt.v;
            return (
              <button
                key={String(opt.v)}
                type="button"
                onClick={() => onChange(opt.v)}
                style={{
                  height: 48,
                  borderRadius: "var(--r-md)",
                  border: `1px solid ${active ? "var(--accent)" : "var(--border-hairline)"}`,
                  background: active ? "rgba(247,190,0,0.1)" : "var(--bg-base)",
                  color: active ? "var(--accent)" : "var(--text-primary)",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
