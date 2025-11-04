#!/bin/bash
# Script to execute SQL queries on Supabase using supabase-cli

cd "$(dirname "$0")"

# The migration file
MIGRATION_FILE="./migrations/fix_schema_20251021.sql"

echo "🔄 Applying database schema fixes..."
echo "Migration file: $MIGRATION_FILE"
echo ""

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Get Supabase credentials from .env.local
if [ -f ".env.local" ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Apply migrations using supabase db push
echo "📤 Pushing migrations to database..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database schema fixes completed successfully!"
else
    echo "❌ Failed to apply migrations"
    exit 1
fi
