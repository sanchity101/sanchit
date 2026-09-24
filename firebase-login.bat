@echo off
cd /d "%~dp0"
echo ===================================================
echo   Logging in to Firebase CLI with your account...
echo ===================================================
call firebase login
echo.
echo ===================================================
echo   Your Authorized Firebase Account and Projects:
echo ===================================================
call firebase login:list
call firebase projects:list
echo.
pause
