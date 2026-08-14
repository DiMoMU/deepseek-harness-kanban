@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Restart
set "installExitCode=%ERRORLEVEL%"
echo.
pause
exit /b %installExitCode%
