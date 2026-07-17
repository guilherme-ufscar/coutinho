#!/bin/sh
# Rotina de backup do Postgres — roda dentro do container `backup` (cron simples via loop + sleep,
# ou disparado externamente por cron do host). Mantém os últimos 14 dumps.
set -eu

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILE="$BACKUP_DIR/couthealth_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" | gzip > "$FILE"

echo "[backup] criado $FILE"

# Mantém apenas os 14 mais recentes
ls -1t "$BACKUP_DIR"/couthealth_*.sql.gz 2>/dev/null | tail -n +15 | xargs -r rm --
