import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, TextField } from "@couthealth/ui";
import { authApi, ApiError, API_URL } from "../lib/api";
import { useAuth } from "../lib/auth";
import { postAuthPath } from "../lib/redirect";
import { AuthLayout } from "./AuthLayout";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await authApi.login({ email, password });
      setSession(res.user, res.tokens.accessToken, res.tokens.refreshToken);
      navigate(postAuthPath(location.search));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Entrar" subtitle="Continue seu acompanhamento.">
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
        <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {error && <p style={{ color: "var(--danger)", fontSize: "var(--fs-body-sm)", margin: 0 }}>{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </Button>
        <Button variant="secondary" href={`${API_URL}/auth/google`}>
          Continuar com Google
        </Button>
      </form>
      <p style={{ textAlign: "center", fontSize: "var(--fs-body-sm)", color: "var(--text-secondary)", margin: 0 }}>
        Ainda não tem conta? <Link to="/criar-conta" style={{ color: "var(--accent)" }}>Criar conta</Link>
      </p>
    </AuthLayout>
  );
}
