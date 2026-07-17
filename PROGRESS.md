# CoutHealth — Progresso

Status por fase (ver `escopo.md` §11 para DoD completo).

| Fase | Descrição | Status |
|---|---|---|
| 0 | Fundação (monorepo, docker-compose, design tokens) | 🚧 Em andamento |
| 1 | Design no Stitch | ⏳ Pendente |
| 2 | Landing (3 variantes) | ⏳ Pendente |
| 3 | Auth + Planos + Pagamento | ⏳ Pendente |
| 4 | Onboarding (anamnese) | ⏳ Pendente |
| 5 | Painel do profissional | ⏳ Pendente |
| 6 | Área do cliente | ⏳ Pendente |
| 7 | Evolução + Check-ins | ⏳ Pendente |
| 8 | Admin sem código | ⏳ Pendente |
| 9 | APK (Capacitor) | ⏳ Pendente |
| 10 | Hardening + LGPD + Go-live | ⏳ Pendente |

## Fase 0 — Fundação — ✅ Concluída (2026-07-17)

- [x] Estrutura de monorepo (`apps/*`, `packages/*`, `infra/*`)
- [x] `docker-compose` com Caddy, Postgres, Redis, MinIO, api, worker, landing, web, backup + healthchecks — todos `healthy`
- [x] Design tokens e componentes base (`packages/ui`: tokens.css/tokens.ts, Button, Card, ContinuityRing)
- [x] `docker compose up` sobe tudo; landing "hello" acessível por HTTPS local — validado via curl:
      `https://localhost/` → 200, `https://app.localhost/app` → 200, `https://api.localhost/health` → 200 (JSON)
- [~] Validação Playwright/browser — **parcial**: Playwright MCP conectado mas o cliente só carrega suas ferramentas após reiniciar a sessão do Claude Code (foi instalado no meio desta conversa); `claude-in-chrome` está com a extensão do Chrome desconectada neste ambiente. Validação funcional feita via `curl` (status HTTP + payload). Screenshots desktop/mobile e checagem de console ficam pendentes para a próxima sessão/fase com um desses dois caminhos disponível.
- [x] Commit + push

## Pendências / bloqueios conhecidos

- `STITCH_API_KEY` compartilhada em texto puro no chat — pedir para o usuário rotacionar.
- Validação visual/Playwright real da Fase 0 pendente (ver acima) — repetir assim que o MCP recarregar ou a extensão do Chrome conectar.
- Preços, gateway de pagamento definitivo, fonte Luxora (licença .woff2), teleconsulta, push FCM, VPS/DNS: usando defaults do `escopo.md` §13.0 até confirmação (ver `DECISIONS.md`).
