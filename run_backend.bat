@echo off
TITLE Smart Closet AI - Backend Server
echo ========================================
echo   Setting up Smart Closet AI Backend
echo ========================================

cd backend

if not exist "venv" (
    echo [1/3] Creating Virtual Environment...
    python -m venv venv
) else (
    echo [1/3] Virtual Environment already exists.
)

echo [2/3] Activating Environment...
call venv\Scripts\activate

echo [3/3] Installing/Updating Dependencies...
pip install -r requirements.txt

echo ========================================
echo   Starting FastAPI Server at 127.0.0.1:8000
echo ========================================
uvicorn app.main:app --reload
pause
