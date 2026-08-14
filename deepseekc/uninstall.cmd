@echo off
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall.ps1" -Restart
set "uninstallExitCode=%ERRORLEVEL%"
echo.
pause
exit /b %uninstallExitCode%
