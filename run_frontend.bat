@echo off
TITLE Smart Closet AI - Web Frontend
echo ========================================
echo   Setting up Smart Closet AI Frontend
echo ========================================

cd frontend

if not exist "node_modules" (
    echo [1/2] Installing Dependencies (This may take a minute)...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

echo [2/2] Starting Development Server...
echo ========================================
echo   Starting Vite at 127.0.0.1:5173
echo ========================================
call npm run dev
pause
