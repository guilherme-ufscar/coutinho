# CoutHealth — Progresso

Status por fase (ver `escopo.md` §11 para DoD completo).

| Fase | Descrição | Status |
|---|---|---|
| 0 | Fundação (monorepo, docker-compose, design tokens) | 🚧 Em andamento |
| 1 | Design no Stitch | ⚠️ Pulada (tool indisponível nesta sessão — telas codadas direto dos tokens) |
| 2 | Landing (3 variantes) | ✅ Concluída |
| 3 | Auth + Planos + Pagamento | ✅ Concluída |
| 4 | Onboarding (anamnese) | ✅ Concluída |
| 5 | Painel do profissional | ✅ Concluída |
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

## Fase 2 — Landing (3 variantes) — ✅ Concluída (2026-07-17)

- [x] Landing A — Cinematográfica dark (`/`)
- [x] Landing B — Clínica premium / Oura-like (`/v2`)
- [x] Landing C — Editorial clara + amarelo (`/v3`)
- [x] Mesmas seções/copy PT nas 3 (hero → como funciona → diferenciais → depoimentos → planos com toggle de período → FAQ → CTA → rodapé)
- [x] SEO básico: metadata por rota, `robots.ts`, `sitemap.ts`
- [x] `next build` sem erros de tipo, todas as rotas 200 via curl (`/`, `/v2`, `/v3`, `/politica-de-privacidade`, `/termos-de-uso`, `/robots.txt`, `/sitemap.xml`)
- [~] Validação visual completa (Playwright/browser: screenshots desktop+mobile, console) — pendente pelo mesmo motivo da Fase 0 (ver `DECISIONS.md`)
- [x] Commit + push

## Fase 3 — Auth + Planos + Pagamento — ✅ Concluída (2026-07-17)

- [x] Schema Prisma completo (escopo.md §5) — todo o modelo de domínio, migration `init` aplicada
- [x] Auth: cadastro e-mail/senha (argon2), login, refresh, `/auth/me`, Google OAuth (placeholder sem crash sem chave real)
- [x] Planos (GET /plans), Cupons (POST /coupons/validate), seeds (3 planos, cupom BEMVINDO10, admin)
- [x] `PaymentProvider`: adapter Mock (aprova automático em dev) + adapter Asaas (chamada real, falha explícita sem chave)
- [x] Checkout ativa assinatura automaticamente quando aprovado (`ACTIVE`, `currentPeriodEnd` calculado por período)
- [x] Front: `/criar-conta`, `/entrar`, `/auth/callback` (Google), `/planos`, `/checkout` — SPA com `AuthProvider`/`ProtectedRoute`/RBAC
- [x] **DoD**: e2e completo validado via curl through Caddy real — cadastro → login → checkout → assinatura `ACTIVE` no Postgres
- [x] `docker-entrypoint.sh` roda `prisma migrate deploy` + seed automaticamente no boot do container `api`
- [~] Validação visual/Playwright — mesmo bloqueio das fases anteriores (ver `DECISIONS.md`)
- [x] Commit + push

## Fase 4 — Onboarding (anamnese única) — ✅ Concluída (2026-07-17)

- [x] Backend: `AnamnesisModule` (GET/PATCH rascunho, POST submit), schema já cobria todos os campos do escopo.md §7.1
- [x] "Responder depois": cada PATCH reagenda um lembrete (BullMQ, 24h) via `RemindersQueueService`; submit cancela o lembrete
- [x] Worker processa o job e cria uma `Notification` real caso a anamnese ainda esteja em rascunho (confirmado sem erros nos logs)
- [x] `AssessmentsModule` mínimo (POST/GET) para a "avaliação física inicial" da última etapa — reaproveitado pela Fase 7
- [x] Front: wizard de 9 etapas (`/anamnese`) data-driven, com anel de continuidade como barra de progresso, retomada automática do `currentStep`, bloqueio de edição após envio
- [x] **DoD**: e2e via curl — preencher etapa 0 → "responder depois" → retomar (GET confirma `currentStep`) → preencher até o fim → criar avaliação física → enviar (`status=ENVIADA`) → confirmar que edição pós-envio é bloqueada (400)
- [x] Commit + push

## Fase 5 — Painel do profissional — ✅ Concluída (2026-07-17)

- [x] `ProfessionalGuard` (JWT + role) protegendo todas as rotas `/admin/*`
- [x] `GET /admin/clients` (lista + status da anamnese) e `GET /admin/clients/:id` (detalhe completo)
- [x] Bancos de Alimentos e Exercícios (CRUD, leitura pública / escrita restrita ao profissional)
- [x] Biblioteca (receitas/artigos/vídeos/materiais) com fluxo de publicação
- [x] Mensagens internas (thread por cliente, bidirecional)
- [x] Montagem e publicação de plano alimentar e treino — publicar cria `Notification` (`PLANO_PUBLICADO` / `TREINO_ATUALIZADO`)
- [x] Seeds: 52 alimentos e 53 exercícios (nomes reais, valores nutricionais aproximados — placeholder editável)
- [x] Front: `/admin` (lista), `/admin/clientes/:id` (anamnese + builder de plano/treino + mensagens), `/admin/alimentos`, `/admin/exercicios`, `/admin/biblioteca`
- [x] **DoD**: e2e via curl — login admin → lista clientes → monta e publica plano+treino → `Notification` confirmada no Postgres para o cliente certo → mensagens bidirecionais → RBAC bloqueia cliente em rota de admin (403)
- [x] Commit + push

## Pendências / bloqueios conhecidos

- `STITCH_API_KEY` compartilhada em texto puro no chat — pedir para o usuário rotacionar.
- Validação visual/Playwright real da Fase 0 pendente (ver acima) — repetir assim que o MCP recarregar ou a extensão do Chrome conectar.
- Preços, gateway de pagamento definitivo, fonte Luxora (licença .woff2), teleconsulta, push FCM, VPS/DNS: usando defaults do `escopo.md` §13.0 até confirmação (ver `DECISIONS.md`).
