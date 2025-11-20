#!/usr/bin/env pwsh
# Build RobotComLab Windows installer using Docker from Windows
# This uses WSL2's Docker integration

Write-Host "`n🐳 Building RobotComLab Installer with Docker..." -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

$ProjectDir = "/home/djnavasv/RobotCom-LIMS-App"
$AppDir = "$ProjectDir/packages/robotcom-lims"

# Check if docker is available via wsl
Write-Host "Checking Docker availability..." -ForegroundColor Yellow
$dockerCheck = wsl -e bash -c "docker --version 2>&1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not available in WSL!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Install Docker Desktop for Windows (includes WSL2 integration)" -ForegroundColor White
    Write-Host "2. Or run: wsl --install -d Ubuntu-24.04" -ForegroundColor White
    exit 1
}

Write-Host "✓ Docker is ready ($dockerCheck)" -ForegroundColor Green
Write-Host ""

# Run the build using WSL's Docker
Write-Host "Starting Docker build container..." -ForegroundColor Yellow
Write-Host ""

wsl -e bash -c @"
cd $AppDir && \
docker run --rm \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
  -v $ProjectDir:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  /bin/bash -c "cd /project/packages/robotcom-lims && pnpm install --ignore-scripts && pnpm run build && pnpm run package:win"
"@

$buildExit = $LASTEXITCODE

# Clean up
wsl -e bash -c "rm -rf ~/.cache/electron-builder/wine 2>/dev/null"

if ($buildExit -eq 0) {
    Write-Host ""
    Write-Host "✅ SUCCESS! Installer created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your installer files are at:" -ForegroundColor Green
    Write-Host "\\wsl.localhost\Ubuntu-24.04\home\djnavasv\RobotCom-LIMS-App\packages\robotcom-lims\release\" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Files created:" -ForegroundColor Green
    Write-Host "  • RobotComLab-Setup-1.0.0.exe (Standard installer)" -ForegroundColor White
    Write-Host "  • RobotComLab-1.0.0.exe (Portable version)" -ForegroundColor White
    Write-Host ""
    Write-Host "You can now share these .exe files with your team!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Build failed with exit code $buildExit" -ForegroundColor Red
    exit 1
}
