@echo off
REM Script to execute SQL queries on Supabase using psql

setlocal enabledelayedexpansion

REM Supabase credentials
set SUPABASE_URL=https://ndenqikcogzrkrjnlvns.supabase.co
set DB_HOST=ndenqikcogzrkrjnlvns.supabase.co
set DB_NAME=postgres
set DB_USER=postgres
set DB_PASSWORD=

echo ========================================
echo Applying Database Schema Fixes
echo ========================================
echo.

REM Try to connect and execute SQL
REM Note: You need to set DB_PASSWORD as an environment variable first

echo.
echo 🔄 To execute migrations, use Supabase Dashboard:
echo 1. Go to: https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/sql/new
echo 2. Paste the SQL from: migrations/fix_schema_20251021.sql
echo 3. Click "RUN"
echo.
echo Or use psql command line:
echo   psql postgresql://postgres:[PASSWORD]@ndenqikcogzrkrjnlvns.supabase.co:5432/postgres -f migrations/fix_schema_20251021.sql
echo.
