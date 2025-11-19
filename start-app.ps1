#!/usr/bin/env pwsh
# RobotComLab LIMS - Windows PowerShell Application Launcher
# Run with: powershell -ExecutionPolicy Bypass -File .\start-app.ps1

Write-Host ""
Write-Host "========================================"
Write-Host "RobotComLab LIMS - Starting..."
Write-Host "========================================"
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion detected"
} catch {
    Write-Host "✗ Error: Node.js is not installed or not in PATH"
    Write-Host "Please install Node.js from https://nodejs.org/"
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion detected"
} catch {
    Write-Host "✗ Error: npm is not installed"
    Read-Host "Press Enter to exit"
    exit 1
}

# Set the location to the script directory
Set-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "Installing dependencies (this may take a minute)..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Error: Failed to install dependencies"
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✓ Dependencies installed"
}

# Check if package dependencies are installed
if (-not (Test-Path "packages\robotcom-lims\node_modules")) {
    Write-Host ""
    Write-Host "Installing package dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Error: Failed to install package dependencies"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start the Electron app
Write-Host ""
Write-Host "Starting RobotComLab LIMS application..."
Write-Host "The application window should open in a moment..."
Write-Host ""

npm run dev:app

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Error: Failed to start the application"
    Read-Host "Press Enter to exit"
    exit 1
}
