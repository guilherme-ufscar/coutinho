import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, TextField } from "@couthealth/ui";
import { authApi, ApiError, API_URL, SITE_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { postAuthPath } from "../lib/redirect";
import { AuthLayout } from "./AuthLayout";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!consent) {
      setError("É necessário aceitar o tratamento de dados para criar a conta.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authApi.register({ name, email, password, consent });
      setSession(res.user, res.tokens.accessToken, res.tokens.refreshToken);
      navigate(postAuthPath(location.search));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece seu ciclo de acompanhamento contínuo.">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <label style={{ display: "flex", gap: "var(--sp-2)", alignItems: "flex-start", fontSize: "var(--fs-caption)", color: "var(--text-secondary)" }}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
          <span>
            Autorizo o tratamento dos meus dados de saúde conforme a{" "}
            <a href={`${SITE_URL}/politica-de-privacidade`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Criando conta…" : "Criar conta"}
        </Button>
        <Button variant="secondary" href={`${API_URL}/auth/google`}>
          Continuar com Google
        </Button>
      </form>
      <p style={{ textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", margin: 0 }}>
        Já tem conta? <Link to="/entrar" style={{ color: "var(--accent)" }}>Entrar</Link>
      </p>
    </AuthLayout>
  );
}
