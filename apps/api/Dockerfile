FROM node:20-alpine AS base
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/config/package.json packages/config/package.json
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY packages/config packages/config
COPY apps/api apps/api
RUN npm run build -w apps/api

FROM node:20-alpine AS run
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
EXPOSE 3000
WORKDIR /repo/apps/api
CMD ["node", "dist/main.js"]
