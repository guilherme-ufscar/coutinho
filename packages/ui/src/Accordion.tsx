"use client";
import { useState, type ReactNode } from "react";

export interface AccordionItem {
  question: string;
  answer: ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            style={{
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--r-md)",
              background: "var(--bg-card)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--sp-4)",
                padding: "var(--sp-4) var(--sp-6)",
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "var(--fs-body-lg)",
                fontWeight: 600,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {item.question}
              <span
                aria-hidden
                style={{
                  color: "var(--accent)",
                  transform: open ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform var(--motion-fast)",
                  fontSize: "1.25rem",
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>
            {open && (
              <div
                style={{
                  padding: "0 var(--sp-6) var(--sp-4)",
                  color: "var(--text-secondary)",
                  fontSize: "var(--fs-body-sm)",
                  lineHeight: 1.6,
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
