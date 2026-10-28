#!/usr/bin/env bash
# Applies stub + migrations + seed + tests to a throwaway Postgres database.
# Needs a reachable Postgres: set PGHOST, PGUSER, PGPASSWORD (or use a local socket). Not for Supabase hosted projects.
set -euo pipefail
cd "$(dirname "$0")/.."
DB=mr_shop_test
dropdb --if-exists "$DB"
createdb "$DB"
trap 'dropdb --if-exists "$DB"' EXIT
run() { psql -v ON_ERROR_STOP=1 -q -d "$DB" -f "$1"; }
run tests/db/supabase_stub.sql
for f in supabase/migrations/*.sql; do run "$f"; done
run supabase/seed.sql
run tests/db/rls.test.sql
