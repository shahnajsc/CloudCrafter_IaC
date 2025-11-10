#!/bin/sh
set -e

echo "Starting CloudCrafter backend initialization..."

# Database readiness checking

# If DATABASE_URL not set, build it from AWS-style env vars
if [ -z "$DATABASE_URL" ]; then
  echo "Building DATABASE_URL from DB_* environment variables..."
  export DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
fi

echo "Using DATABASE_URL=$DATABASE_URL"

# Wait for database to be reachable
DB_HOST=$(echo "$DATABASE_URL" | sed -E 's/.*@([^:/]+).*/\1/')
echo "Waiting for database at $DB_HOST:$DB_PORT..."

until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for database..."
  sleep 3
done

echo "Database is up."

# Prisma Client generation
npx prisma generate
echo "Prisma client generated."

# DB migration
npx prisma migrate deploy
echo "DB migration done."

# Data seeding
npm run db:seed || echo "Seed failed or already applied — continuing."
echo "Data seeding done."

# Starting backend
exec node dist/src/app.js
echo "Backend running."
