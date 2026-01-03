#!/bin/bash
# Script to resolve failed Prisma migration
# Usage: DATABASE_URL="your-railway-database-url" ./resolve-failed-migration.sh

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "To get your DATABASE_URL:"
  echo "1. Go to Railway dashboard"
  echo "2. Click on your PostgreSQL service"
  echo "3. Click 'Variables' tab"
  echo "4. Copy the DATABASE_URL value"
  echo ""
  echo "Then run:"
  echo "  DATABASE_URL='your-url-here' ./resolve-failed-migration.sh"
  exit 1
fi

echo "Resolving failed migration..."
npx prisma migrate resolve --rolled-back 20250101000000_add_better_auth_schema

if [ $? -eq 0 ]; then
  echo "✓ Successfully resolved failed migration!"
  echo "You can now redeploy your server on Railway."
else
  echo "✗ Failed to resolve migration. Check the error above."
  exit 1
fi

