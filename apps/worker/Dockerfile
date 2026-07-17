FROM node:20-alpine AS base
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY apps/worker/package.json apps/worker/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY packages/config packages/config
COPY apps/worker apps/worker
RUN npm run build -w apps/worker

FROM node:20-alpine AS run
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/worker/dist ./apps/worker/dist
COPY --from=build /repo/apps/worker/package.json ./apps/worker/package.json
WORKDIR /repo/apps/worker
CMD ["node", "dist/index.js"]
