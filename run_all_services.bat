@echo off
TITLE Smart Closet AI - Runner
echo Launching Backend and Frontend in separate windows...

start "Smart Closet - Backend" cmd /c run_backend.bat
start "Smart Closet - Frontend" cmd /c run_frontend.bat

echo Both services are starting. Please wait for them to finish installation.
pause
