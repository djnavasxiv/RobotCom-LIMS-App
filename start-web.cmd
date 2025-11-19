@echo off
REM RobotComLab LIMS - Windows Web Server Launcher
REM This batch file launches the application in browser mode (no Electron window)

echo.
echo ========================================
echo RobotComLab LIMS - Web Version
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

REM Start the web dev server
echo Starting RobotComLab LIMS web server...
echo.
echo The application will be available at:
echo   http://localhost:5173/
echo.
echo To stop the server, press Ctrl+C
echo.

call npm run dev:web

if errorlevel 1 (
    echo.
    echo Error: Failed to start the web server
    pause
    exit /b 1
)

pause
