@echo off
rem DSH 重启（安装/卸载后使用） - 双击入口
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0restart.ps1"
echo.
pause
