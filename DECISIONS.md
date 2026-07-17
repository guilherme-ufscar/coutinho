# CoutHealth — Decisões (log de suposições em execução autônoma)

> Registrado conforme `escopo.md` §13.0/§11.2 — toda ambiguidade resolvida com um default é anotada aqui.

## 2026-07-17 — Setup de ambiente (pré-Fase 0)

- **Stitch MCP**: o endpoint oficial direto (`https://stitch.googleapis.com/mcp`, header `X-Goog-Api-Key`) conecta, mas o cliente MCP local (Claude Code 2.1.212) falha ao resolver o schema de ferramentas (`$defs/ScreenInstance`). Trocado para o servidor comunitário `@_davideast/stitch-mcp` (modo `proxy`), autenticado via `STITCH_API_KEY` (sem gcloud). Decisão do usuário.
- **Playwright MCP**: instalado via `@playwright/mcp@latest` (stdio), conforme `playwright.dev/mcp/installation`.
- **REPO_GIT**: `https://github.com/guilherme-ufscar/coutinho` — repositório git local inicializado com esse remote.
- ⚠️ **Ação pendente do usuário**: rotacionar a `STITCH_API_KEY` compartilhada em texto puro no chat (Stitch → Profile → Settings → API key), por segurança — ela ficou registrada em `~/.claude.json` local (fora do repo) mas não deve continuar sendo a chave de produção.

## Fase 0 — Fundação

- **Gerenciador de pacotes**: npm workspaces (monorepo simples), em vez de pnpm/turborepo — reduz dependências externas de bootstrap; pode migrar para Turborepo em fase posterior se o build ficar lento.
- **Dev domains**: Caddy local usa `*.localhost` (ex.: `app.localhost`, `api.localhost`) em vez do domínio de produção, para HTTPS automático local sem precisar de DNS público. Produção usa `couthealth.com.br` / `app.couthealth.com.br` / `api.couthealth.com.br` via `.env`.
- **API NestJS na Fase 0**: sobe como esqueleto mínimo (health endpoint) — módulos de domínio completos entram nas fases 3+ conforme o roadmap.
- Demais defaults: ver `escopo.md` §13.0 (fonte Space Grotesk/Inter, PaymentProvider mock+Asaas, YouTube não listado, MinIO, papéis client/professional, etc.) — todos adotados sem alteração.
- **`.env` local**: `DOMAIN`/`APP_DOMAIN`/`API_DOMAIN` default para `*.localhost` (não os domínios de produção) para que o Caddy emita certificado interno automaticamente em dev. `.env.example` documenta a troca para produção.
- **Next.js standalone em Docker**: obrigatório setar `ENV HOSTNAME=0.0.0.0` no Dockerfile — o Docker define `HOSTNAME` automaticamente como o ID do container, e o `server.js` gerado pelo `output: "standalone"` usa `process.env.HOSTNAME` para bind, fazendo o healthcheck falhar silenciosamente (`connection refused` em 127.0.0.1) sem esse override.
- **Backup do Postgres**: trocado cron (`dcron`) por um loop `while true; do backup; sleep 86400; done` — `crond -f` falhava com `setpgid: Operation not permitted` dentro do container (sandboxing). Mais simples e portável para o MVP.
- **Validação Playwright da Fase 0**: parcial. Playwright MCP foi instalado no meio desta sessão do Claude Code; o cliente MCP só carrega ferramentas de servidores novos após reiniciar a sessão, então `browser_navigate`/`browser_take_screenshot` etc. não ficaram disponíveis neste turno. `claude-in-chrome` também indisponível (extensão do Chrome não conectada no ambiente). Validação da Fase 0 foi feita via `curl` (status HTTP 200 + payload correto nos 3 domínios). Repetir a validação visual completa (screenshots, console) na próxima fase com UI, quando um dos dois caminhos estiver disponível.
