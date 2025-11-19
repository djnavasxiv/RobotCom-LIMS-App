@echo off
REM RobotComLab LIMS - Windows Application Launcher
REM This batch file launches the Electron desktop application

echo.
echo ========================================
echo RobotComLab LIMS - Starting...
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed
    pause
    exit /b 1
)

REM Navigate to the project directory
cd /d "%~dp0"

REM Check if node_modules exists, if not run install
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if dependencies are installed in the package
if not exist "packages\robotcom-lims\node_modules" (
    echo Installing package dependencies...
    call npm install
)

REM Start the Electron app
echo Starting RobotComLab LIMS application...
echo.

call npm run dev:app

if errorlevel 1 (
    echo.
    echo Error: Failed to start the application
    pause
    exit /b 1
)

pause
