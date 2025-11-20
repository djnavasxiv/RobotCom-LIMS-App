@echo off
REM RobotComLab Installer Build Script for Windows
REM This script builds the Electron app and creates an NSIS installer

setlocal enabledelayedexpansion

echo.
echo Building RobotComLab Installer...
echo ====================================
echo.

REM Step 1: Clean previous builds
echo [Step 1/4] Cleaning previous builds...
rmdir /s /q out 2>nul
rmdir /s /q release 2>nul

REM Step 2: Generate Prisma client
echo [Step 2/4] Generating Prisma client...
call npm run prisma:generate
if errorlevel 1 (
    echo Error: Prisma generation failed
    exit /b 1
)

REM Step 3: Build the Electron app
echo [Step 3/4] Building Electron app...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    exit /b 1
)

REM Step 4: Package as installer
echo [Step 4/4] Creating NSIS installer...
call npm run package:win
if errorlevel 1 (
    echo Error: Installer packaging failed
    exit /b 1
)

REM Success
echo.
echo [SUCCESS] Installer build completed successfully!
echo.
echo Installer location: .\release\
echo.
dir release\*.exe
echo.
echo Next steps:
echo 1. Share the .exe file with end users
echo 2. Users can run the installer to install RobotComLab
echo 3. Desktop shortcut and Start Menu entry will be created automatically
echo.
pause
