@echo off
echo Starting CloudVault Local Server...
powershell.exe -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8000
pause
