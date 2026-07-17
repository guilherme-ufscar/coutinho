#!/bin/sh
# Loop simples de backup diário (evita depender de cron dentro do container).
# Roda o dump uma vez ao subir e depois a cada 24h.
set -eu

while true; do
  /usr/local/bin/backup-postgres.sh
  sleep 86400
done
