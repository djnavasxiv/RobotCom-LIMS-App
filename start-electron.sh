#!/bin/bash

# RobotComLab LIMS - Ubuntu WSL2 Electron Launcher
# Works with Ubuntu on Windows Subsystem for Linux 2

set -e

echo "🚀 RobotComLab LIMS - Electron Development (Ubuntu WSL2)"
echo "========================================================"
echo ""

# Get the Windows host IP for X11 connections
WINDOWS_HOST_IP=$(grep -m 1 nameserver /etc/resolv.conf 2>/dev/null | awk '{print $2}')

if [ -z "$WINDOWS_HOST_IP" ]; then
    echo "❌ Error: Could not determine Windows host IP"
    echo ""
    echo "This script requires Ubuntu on WSL2"
    echo ""
    echo "Troubleshooting:"
    echo "1. Verify you're running: uname -a (should contain WSL)"
    echo "2. Check: grep nameserver /etc/resolv.conf"
    echo "3. If no output, you may not be on WSL2"
    exit 1
fi

echo "✓ Detected Windows host: $WINDOWS_HOST_IP"
echo ""

# Set DISPLAY for Windows X server or WSL2 native support
export DISPLAY="${WINDOWS_HOST_IP}:0.0"
export LIBGL_ALWAYS_INDIRECT=1

echo "Configuration:"
echo "  DISPLAY=$DISPLAY"
echo "  LIBGL_ALWAYS_INDIRECT=1"
echo ""

# Disable sandbox for WSL2
export ELECTRON_DISABLE_SANDBOX=1

echo "Checking for X server availability..."
echo "(This may take a few seconds...)"
echo ""

# Try to contact the X server (with timeout)
if timeout 2 xset q >/dev/null 2>&1; then
    echo "✓ X server is reachable at $DISPLAY"
elif timeout 2 bash -c "echo '' | nc -zv ${WINDOWS_HOST_IP} 6000" >/dev/null 2>&1; then
    echo "✓ X server port 6000 is open at $WINDOWS_HOST_IP"
else
    echo "⚠️  Cannot reach X server at $DISPLAY"
    echo ""
    echo "To use Electron on Ubuntu WSL2, you need an X server on Windows:"
    echo ""
    echo "Option 1: Install VcXsrv (Recommended)"
    echo "  1. Download: https://github.com/ArcticaProject/VcXsrv-Windows"
    echo "  2. Install and run on Windows"
    echo "  3. Keep it running while using the app"
    echo ""
    echo "Option 2: Install Xming"
    echo "  1. Download: https://sourceforge.net/projects/xming/"
    echo "  2. Install and run on Windows"
    echo ""
    echo "Option 3: Use the web version instead"
    echo "  npm run dev:web"
    echo ""
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "Starting Electron app..."
echo ""

cd "$(dirname "$0")"
npm run dev:app "$@"
