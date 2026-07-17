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
- **Fase 1 (Stitch)**: o Stitch MCP (`@_davideast/stitch-mcp` proxy) segue `✔ Connected` no `claude mcp list`, mas suas ferramentas (`create_project`, `generate_screen_from_text` etc.) não aparecem no `ToolSearch` desta sessão — MCPs adicionados no meio de uma sessão do Claude Code só carregam ferramentas após reiniciar. Sem reinício disponível, a Fase 1 é **pulada como etapa isolada**: as telas são implementadas direto em código a partir do Prompt Base/Design DNA (§7) e dos prompts por tela (§9) de `design-stitch.md`, usados como especificação textual em vez de mockup gerado. Retomar a geração real no Stitch em uma sessão futura é possível a qualquer momento (chave e conexão já configuradas).
- **Validação Playwright da Fase 0**: parcial. Playwright MCP foi instalado no meio desta sessão do Claude Code; o cliente MCP só carrega ferramentas de servidores novos após reiniciar a sessão, então `browser_navigate`/`browser_take_screenshot` etc. não ficaram disponíveis neste turno. `claude-in-chrome` também indisponível (extensão do Chrome não conectada no ambiente). Validação da Fase 0 foi feita via `curl` (status HTTP 200 + payload correto nos 3 domínios). Repetir a validação visual completa (screenshots, console) na próxima fase com UI, quando um dos dois caminhos estiver disponível.

## Fase 2 — Landing (3 variantes)

- **`NEXT_PUBLIC_APP_URL`**: Next.js inlina variáveis `NEXT_PUBLIC_*` no momento do **build**, não do runtime. Passado como `build.args` no `docker-compose.yml` (derivado de `APP_DOMAIN`) em vez de `environment:`, senão o CTA "Criar conta" ficaria hardcoded para `app.localhost` mesmo em produção.
- **Botões de CTA como `<a>`** (não `onClick`): o componente `Button` do design system virou polimórfico (`href` → `<a>`, senão `<button>`) para que as 3 landings continuem Server Components (SEO/performance) — só as seções interativas (`PlansSection` com toggle de período, `FaqSection` com accordion) são Client Components isoladas.
- **`VariantSwitcher`**: navegação flutuante temporária (`/`, `/v2`, `/v3`) nas 3 landings, só para o cliente comparar as direções antes de escolher uma — remover depois da escolha (DoD da Fase 2 no `escopo.md`).
- **Validação Playwright/browser da Fase 2**: mesmo bloqueio da Fase 0 (ferramentas do Playwright MCP não carregadas nesta sessão; `claude-in-chrome` sem extensão conectada). Validação feita via `curl` (status HTTP das 3 rotas) + `next build` sem erros de tipo/lint. Screenshots desktop/mobile pendentes — repetir assim que um caminho de browser real estiver disponível.
