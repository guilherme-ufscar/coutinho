import { useEffect, useState } from "react";
import { Button, TextField } from "@couthealth/ui";
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
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Mensagens
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "var(--sp-6)", maxHeight: 480, overflow: "auto" }}>
        {messages.map((m) => {
          const mine = m.senderId === user?.id;
          return (
            <div key={m.id} style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "70%" }}>
              <div
                style={{
                  background: mine ? "var(--accent)" : "var(--bg-card)",
                  color: mine ? "var(--ink-900)" : "var(--text-primary)",
                  padding: "10px 14px",
                  borderRadius: "var(--r-md)",
                  fontSize: "var(--fs-body-sm)",
                }}
              >
                {m.body}
              </div>
              <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: "4px 4px 0" }}>{m.sender.name}</p>
            </div>
          );
        })}
        {messages.length === 0 && <p style={{ color: "var(--text-secondary)" }}>Nenhuma mensagem ainda. Envie a primeira!</p>}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <TextField label="" placeholder="Escrever mensagem…" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <Button onClick={send}>Enviar</Button>
      </div>
    </ClientLayout>
  );
}
