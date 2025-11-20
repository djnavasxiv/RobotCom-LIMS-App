@echo off
REM Run from Windows PowerShell ONLY
REM This script builds the RobotComLab Windows installer

echo.
echo Building RobotComLab Installer...
echo ====================================
echo.

REM Run the build pipeline via WSL
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App && pnpm install --frozen-lockfile=false"

if errorlevel 1 (
    echo Error: pnpm install failed
    pause
    exit /b 1
)

wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && npm run build"

if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)

wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && npm run package:win"

if errorlevel 1 (
    echo Error: Packaging failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Installer build completed!
echo.
echo Installer location:
echo \\wsl.localhost\Ubuntu-24.04\home\djnavasv\RobotCom-LIMS-App\packages\robotcom-lims\release\
echo.
pause
