@echo off
cd /d "%~dp0Ctis-Project-main"
echo ===================================================
echo   Deploying CloudVault to Vercel...
echo ===================================================
npx --yes vercel --prod
pause
