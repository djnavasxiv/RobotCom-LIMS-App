#!/usr/bin/env pwsh
# Run this from Windows PowerShell to build RobotComLab installer

Write-Host "`nBuilding RobotComLab Installer..." -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Step 1: Install dependencies in the app folder
Write-Host "[1/3] Installing dependencies..." -ForegroundColor Yellow
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && pnpm install --no-frozen-lockfile 2>&1 | tail -20"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 2: Build the Electron app
Write-Host "`n[2/3] Building Electron app..." -ForegroundColor Yellow
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && npm run build"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Package the Windows installer
Write-Host "`n[3/3] Creating Windows installer..." -ForegroundColor Yellow
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && npm run package:win"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Installer creation failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ SUCCESS! Installer created!" -ForegroundColor Green
Write-Host "`nYour installer files are at:" -ForegroundColor Green
Write-Host "\\wsl.localhost\Ubuntu-24.04\home\djnavasv\RobotCom-LIMS-App\packages\robotcom-lims\release\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor Green
Write-Host "  • RobotComLab-Setup-1.0.0.exe (Standard installer)" -ForegroundColor White
Write-Host "  • RobotComLab-1.0.0.exe (Portable version)" -ForegroundColor White
Write-Host "`nYou can now share these .exe files with your team!" -ForegroundColor Green
