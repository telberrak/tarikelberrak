#!/usr/bin/env bash
# One-time (safe to re-run): creates the `portfolio` role and database inside Mizan's PostgreSQL,
# using the password in /srv/tarikelberrak/.env. Flyway then creates the schema when the backend
# first starts. Run on the server as the deploy user:
#   bash /srv/tarikelberrak/init-db.sh
set -euo pipefail

env_file="${PORTFOLIO_ENV_FILE:-/srv/tarikelberrak/.env}"
mizan_dir="${MIZAN_DIR:-/srv/mizan}"

# Values in .env are single-quoted.
password="$(sed -n 's/^PORTFOLIO_DB_PASSWORD=//p' "$env_file" | tr -d "'\"")"
[ -n "$password" ] || { echo "PORTFOLIO_DB_PASSWORD is missing in $env_file" >&2; exit 1; }
case "$password" in *[!A-Za-z0-9]*) echo "Use letters and digits only (e.g. openssl rand -hex 24)." >&2; exit 1 ;; esac

psql() { docker compose --project-directory "$mizan_dir" exec -T postgres psql -U mizan -d postgres -v ON_ERROR_STOP=1 "$@"; }

psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'portfolio') THEN
    CREATE ROLE portfolio LOGIN PASSWORD '$password';
  ELSE
    ALTER ROLE portfolio PASSWORD '$password';
  END IF;
END
\$\$;
SQL

if ! psql -tAc "SELECT 1 FROM pg_database WHERE datname = 'portfolio'" | grep -q 1; then
  psql -c "CREATE DATABASE portfolio OWNER portfolio"
fi
echo "portfolio database and role are ready."
