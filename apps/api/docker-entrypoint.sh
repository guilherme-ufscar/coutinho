#!/bin/sh
set -e
npm run prisma:migrate:deploy
npm run prisma:seed || true
exec node dist/main.js
