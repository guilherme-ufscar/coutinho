FROM node:20-alpine AS base
RUN apk add --no-cache python3 make g++ openssl
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY apps/api/package.json apps/api/package.json
# Sem --ignore-scripts: precisa rodar o build nativo do argon2 (node-gyp) e os scripts do Prisma.
# As permissões já foram aprovadas em package.json ("allowScripts") via `npm approve-scripts --all`.
RUN npm install --workspaces --include-workspace-root

FROM base AS build
COPY packages/config packages/config
COPY apps/api apps/api
RUN npm run prisma:generate -w apps/api
RUN npm run build -w apps/api

FROM node:20-alpine AS run
RUN apk add --no-cache openssl
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
# prisma (CLI) e tsx não ficam hoisted no node_modules raiz — copiar também o node_modules local.
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
COPY apps/api/docker-entrypoint.sh ./apps/api/docker-entrypoint.sh
RUN chmod +x ./apps/api/docker-entrypoint.sh
EXPOSE 3000
WORKDIR /repo/apps/api
ENTRYPOINT ["./docker-entrypoint.sh"]
