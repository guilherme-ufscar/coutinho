import { useId, type InputHTMLAttributes } from "react";

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, style, ...props }: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-2)" }}>
      <label htmlFor={fieldId} style={{ fontSize: "var(--fs-body-sm)", fontWeight: 600, color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        id={fieldId}
        {...props}
        aria-invalid={!!error}
        style={{
          background: "var(--bg-surface)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border-hairline)"}`,
          borderRadius: "var(--r-md)",
          padding: "12px 16px",
          color: "var(--text-primary)",
          fontFamily: "var(--font-body)",
          fontSize: "var(--fs-body-lg)",
          outline: "none",
          ...style,
        }}
      />
      {error && <span style={{ color: "var(--danger)", fontSize: "var(--fs-caption)" }}>{error}</span>}
    </div>
  );
}
