FROM node:20-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY apps/worker/package.json apps/worker/package.json
# Sem --ignore-scripts: o Prisma precisa rodar seus scripts de setup (mesmo motivo do apps/api).
RUN npm install --workspaces --include-workspace-root

FROM base AS build
COPY packages/config packages/config
COPY apps/worker apps/worker
RUN npm run prisma:generate -w apps/worker
RUN npm run build -w apps/worker

FROM node:20-alpine AS run
RUN apk add --no-cache openssl
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/worker/node_modules ./apps/worker/node_modules
COPY --from=build /repo/apps/worker/dist ./apps/worker/dist
COPY --from=build /repo/apps/worker/package.json ./apps/worker/package.json
WORKDIR /repo/apps/worker
CMD ["node", "dist/index.js"]
