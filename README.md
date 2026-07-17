# CoutHealth

Plataforma digital de acompanhamento contínuo em saúde (nutrição + treino) — landing, área do cliente e painel administrativo.

Ver `escopo.md` (requisitos/arquitetura) e `design-stitch.md` (design system) na raiz — fonte da verdade do projeto. Progresso em `PROGRESS.md`, decisões autônomas em `DECISIONS.md`.

## Estrutura

```
apps/landing   Next.js — site institucional (3 variantes em /, /v2, /v3)
apps/web       React SPA (Vite) — área do cliente (/app) + admin (/admin)
apps/api       NestJS — API
apps/worker    BullMQ — filas/lembretes
packages/ui    Design system: tokens + componentes
packages/config eslint/tsconfig compartilhados
infra          docker-compose, Caddyfile, backup
```

## Rodando localmente

```bash
cp .env.example .env   # ajuste os segredos
docker compose up --build
```

- Landing: https://localhost
- App/Admin: https://app.localhost
- API: https://api.localhost/health

Certificados são gerados automaticamente pelo Caddy (`local_certs`) para os domínios `*.localhost` — o navegador pode pedir para confiar no certificado local na primeira vez.

## Desenvolvimento sem Docker

```bash
npm install
npm run dev:landing   # http://localhost:3100
npm run dev:web       # http://localhost:3200
npm run dev:api       # http://localhost:3000
npm run dev:worker
```
