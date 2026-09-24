@echo off
cd /d "%~dp0"
echo ===================================================
echo   Deploying Firebase Security Rules...
echo   (Firestore & Realtime Database)
echo ===================================================
call firebase deploy --only firestore:rules,database
echo.
pause
