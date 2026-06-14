@echo off
TITLE Smart Closet AI - ALL IN ONE
COLOR 0B

echo ========================================
echo   SMART CLOSET AI - STARTUP SYSTEM
echo ========================================
echo.

echo [1/2] Starting Backend Server...
:: Using a more direct way to call Python from venv
start "Smart Closet BACKEND" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo [2/2] Starting Frontend App...
start "Smart Closet FRONTEND" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   SYSTEMS ARE LAUNCHING!
echo   1. Backend: http://127.0.0.1:8000 (API)
echo   2. Frontend: http://localhost:5173 (WEB)
echo ========================================
echo.
echo Closing this launcher in 5 seconds...
timeout /t 5
exit
