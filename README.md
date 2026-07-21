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

Tudo concentrado em um único domínio, roteado por caminho (ver `infra/caddy/Caddyfile`):

- Landing: https://localhost
- App: https://localhost/app · Admin: https://localhost/admin
- API: https://localhost/api/health

Certificado é gerado automaticamente pelo Caddy (`local_certs`) para `localhost` — o navegador pode pedir para confiar no certificado local na primeira vez.

Em produção basta apontar o DNS de `couthealth.com.br` pro VPS e setar `DOMAIN=couthealth.com.br` no `.env` (hostname puro, sem `http://`/`https://`) — não existem mais subdomínios `app.` / `api.` a configurar.

## Desenvolvimento sem Docker

```bash
npm install
npm run dev:landing   # http://localhost:3100
npm run dev:web       # http://localhost:3200
npm run dev:api       # http://localhost:3000
npm run dev:worker
```
