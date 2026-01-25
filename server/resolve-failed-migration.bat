@echo off
REM Script to resolve failed Prisma migration on Windows
REM Usage: set DATABASE_URL=your-railway-database-url && resolve-failed-migration.bat

if "%DATABASE_URL%"=="" (
  echo ERROR: DATABASE_URL environment variable is not set
  echo.
  echo To get your DATABASE_URL:
  echo 1. Go to Railway dashboard
  echo 2. Click on your PostgreSQL service
  echo 3. Click 'Variables' tab
  echo 4. Copy the DATABASE_URL value
  echo.
  echo Then run:
  echo   set DATABASE_URL=your-url-here
  echo   resolve-failed-migration.bat
  exit /b 1
)

echo Resolving failed migration...
call npx prisma migrate resolve --rolled-back 20250101000000_add_better_auth_schema

if %ERRORLEVEL% EQU 0 (
  echo Successfully resolved failed migration!
  echo You can now redeploy your server on Railway.
) else (
  echo Failed to resolve migration. Check the error above.
  exit /b 1
)



