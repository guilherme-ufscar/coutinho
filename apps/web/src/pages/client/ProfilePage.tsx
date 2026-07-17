import { Button, Card } from "@couthealth/ui";
import { useAuth } from "../../lib/auth";
import { ClientLayout } from "./ClientLayout";

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <ClientLayout>
      <h1 className="display" style={{ fontSize: "var(--fs-display-sm)", marginBottom: "var(--sp-6)" }}>
        Perfil
      </h1>

      <Card style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>Nome</p>
          <p style={{ margin: "4px 0 0" }}>{user?.name}</p>
        </div>
        <div>
          <p style={{ color: "var(--text-tertiary)", fontSize: "var(--fs-caption)", margin: 0 }}>E-mail</p>
          <p style={{ margin: "4px 0 0" }}>{user?.email}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          Sair
        </Button>
      </Card>
    </ClientLayout>
  );
}
