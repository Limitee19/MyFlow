@echo off
echo ========================================
echo MyFlow - Setup Helper
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo [ERROR] File .env tidak ditemukan!
    echo.
    echo Silakan copy .env.example ke .env terlebih dahulu:
    echo   copy .env.example .env
    echo.
    echo Lalu edit .env dan isi:
    echo   - DATABASE_URL
    echo   - NEXTAUTH_SECRET
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking .env file...
findstr /C:"IBJXmXwTpO5iZqzA8VePqRPrWpeMkjUUUyeegvvwyTM=" .env >nul
if %errorlevel% equ 0 (
    echo [WARNING] NEXTAUTH_SECRET masih default!
    echo.
    echo Silakan generate secret key dulu:
    echo   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    echo.
    echo Lalu update di file .env
    echo.
    pause
    exit /b 1
)

findstr /C:"postgresql://neondb_owner:npg_RGLWbzwOiC89@ep-icy-mode-a1l82wbv-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" .env >nul
if %errorlevel% equ 0 (
    echo [WARNING] DATABASE_URL masih default!
    echo.
    echo Silakan setup database dulu (Neon/Supabase/Local)
    echo Lalu update DATABASE_URL di file .env
    echo.
    pause
    exit /b 1
)

echo [OK] .env sudah dikonfigurasi
echo.

echo [2/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install gagal!
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

echo [3/4] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate gagal!
    pause
    exit /b 1
)
echo [OK] Prisma Client generated
echo.

echo [4/4] Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [ERROR] Migration gagal!
    echo.
    echo Kemungkinan penyebab:
    echo - DATABASE_URL salah
    echo - Database tidak bisa diakses
    echo - Koneksi internet bermasalah
    echo.
    pause
    exit /b 1
)
echo [OK] Database migrated
echo.

echo ========================================
echo Setup SELESAI! ^_^
echo ========================================
echo.
echo Jalankan development server dengan:
echo   npm run dev
echo.
echo Lalu buka browser: http://localhost:3000
echo.
pause
