@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0verify.ps1"
set "verifyExitCode=%ERRORLEVEL%"
echo.
pause
exit /b %verifyExitCode%
