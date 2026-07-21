import { useEffect, useState } from "react";
import { messagesApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function MessagesPage() {
  const { accessToken, user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  function load() {
    if (!accessToken) return;
    messagesApi.mine(accessToken).then((r) => setMessages(r.messages));
  }

  useEffect(load, [accessToken]);

  async function send() {
    if (!accessToken || !text.trim()) return;
    await messagesApi.send(text, accessToken);
    setText("");
    load();
  }

  return (
    <ClientLayout title="Mensagens">
      <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 76px - var(--sp-8) * 2)", maxWidth: 820 }}>
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", gap: 16, padding: "var(--sp-2) 0" }}>
          {messages.map((m) => {
            const mine = m.senderId === user?.id;
            return (
              <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "60%" }}>
                {!mine && (
                  <div style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600, marginBottom: 6 }}>{m.sender.name}</div>
                )}
                <div
                  style={{
                    background: mine ? "var(--ink-600)" : "var(--bg-surface)",
                    borderLeft: mine ? undefined : "3px solid var(--accent)",
                    color: "var(--text-primary)",
                    padding: "14px 18px",
                    borderRadius: mine ? "12px 0 12px 12px" : "0 12px 12px 12px",
                    fontSize: "0.9375rem",
                  }}
                >
                  {m.body}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhuma mensagem ainda. Envie a primeira!</p>}
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "var(--sp-4) 0", borderTop: "1px solid var(--border-hairline)" }}>
          <input
            placeholder="Escrever mensagem..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            style={{
              flex: 1,
              height: 48,
              background: "var(--bg-surface)",
              border: "1px solid var(--border-hairline)",
              borderRadius: "var(--r-full)",
              color: "var(--text-primary)",
              padding: "0 20px",
              fontSize: "0.9375rem",
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            onClick={send}
            style={{
              height: 48,
              padding: "0 24px",
              borderRadius: "var(--r-full)",
              border: "none",
              background: "var(--accent-grad, var(--accent))",
              color: "var(--text-on-accent)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Enviar
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--text-tertiary)", margin: "8px 0 0" }}>
          Respondemos em até 24h.
        </p>
      </div>
    </ClientLayout>
  );
}
