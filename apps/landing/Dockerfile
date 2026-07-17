FROM node:20-alpine AS base
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
COPY apps/landing/package.json apps/landing/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY packages/ui packages/ui
COPY packages/config packages/config
COPY apps/landing apps/landing
RUN npm run build -w apps/landing

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/landing/.next/standalone ./
COPY --from=build /repo/apps/landing/.next/static ./apps/landing/.next/static
COPY --from=build /repo/apps/landing/public ./apps/landing/public
EXPOSE 3100
ENV PORT=3100
ENV HOSTNAME=0.0.0.0
CMD ["node", "apps/landing/server.js"]
