@echo off
rem DSH 会话看板一键安装 - 双击入口
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1" -Restart
echo.
pause
