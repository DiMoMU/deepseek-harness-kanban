@echo off
rem DSH 会话看板卸载（恢复原界面） - 双击入口
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall.ps1" -Restart
echo.
pause
