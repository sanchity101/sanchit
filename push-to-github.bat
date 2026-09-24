@echo off
cd /d "%~dp0"
echo ===================================================
echo             Push Ctis-Project to GitHub
echo ===================================================
echo.
echo Choose which remote repository to push to:
echo   [1] Push to origin (nishikasawant475/Ctis-Project)
echo   [2] Push to sanchit (sanchity101/sanchit)
echo   [3] Push to BOTH repositories
echo.
set /p choice="Enter your choice (1, 2, or 3) [Default: 1]: "

if "%choice%"=="2" goto push_sanchit
if "%choice%"=="3" goto push_both
goto push_origin

:push_origin
echo.
echo Pushing to origin (nishikasawant475/Ctis-Project)...
git push -u origin main
goto end

:push_sanchit
echo.
echo Pushing to sanchit (sanchity101/sanchit)...
git push -u sanchit main
goto end

:push_both
echo.
echo Pushing to origin (nishikasawant475/Ctis-Project)...
git push -u origin main
echo.
echo Pushing to sanchit (sanchity101/sanchit)...
git push -u sanchit main
goto end

:end
echo.
if %errorlevel% neq 0 (
    echo ===================================================
    echo   NOTE: If GitHub asks for sign-in, use the browser
    echo   window that popped up, or enter your GitHub PAT.
    echo ===================================================
) else (
    echo ===================================================
    echo   Successfully pushed to GitHub!
    echo ===================================================
)
echo.
pause
