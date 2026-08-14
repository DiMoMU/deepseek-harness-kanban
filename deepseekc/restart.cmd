@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0restart.ps1"
set "restartExitCode=%ERRORLEVEL%"
echo.
pause
exit /b %restartExitCode%
