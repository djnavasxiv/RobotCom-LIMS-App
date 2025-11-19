@echo off
REM RobotComLab LIMS - VcXsrv Installation Helper for Windows
REM This helps download and install VcXsrv for WSL2 Electron support

echo.
echo ========================================
echo RobotComLab LIMS - VcXsrv Setup Helper
echo ========================================
echo.
echo This will help you download and install VcXsrv
echo (required to display Electron from Ubuntu WSL2 on Windows)
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Note: Some features work better with admin privileges
    echo Consider right-clicking and selecting "Run as administrator"
    echo.
)

echo.
echo Step 1: Opening VcXsrv download page in your browser...
echo.
echo VcXsrv GitHub: https://github.com/ArcticaProject/VcXsrv-Windows
echo.

REM Try to open URL with default browser
start https://github.com/ArcticaProject/VcXsrv-Windows

echo Please download the latest VcXsrv release (ending in .exe)
echo.
echo After download:
echo  1. Run the installer
echo  2. Use default settings during installation
echo  3. After installation, look for XLaunch in Start Menu
echo.
echo Once installed, keep XLaunch running in the background
echo whenever you want to use Electron from Ubuntu WSL2.
echo.
pause
