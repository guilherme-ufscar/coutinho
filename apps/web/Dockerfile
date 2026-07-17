FROM node:20-alpine AS base
WORKDIR /repo
COPY package.json package-lock.json* ./
COPY packages/ui/package.json packages/ui/package.json
COPY packages/config/package.json packages/config/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm install --workspaces --include-workspace-root --ignore-scripts

FROM base AS build
COPY packages/ui packages/ui
COPY packages/config packages/config
COPY apps/web apps/web
RUN npm run build -w apps/web

FROM nginx:alpine AS run
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
