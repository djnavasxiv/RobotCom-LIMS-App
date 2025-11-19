#!/bin/bash

# RobotComLab LIMS - WSL2 to Windows Electron Bridge
# Automatically configures Ubuntu WSL2 to display Electron on Windows

set -e

echo "🚀 RobotComLab LIMS - Electron Setup for Windows"
echo "=================================================="
echo ""
echo "This script will configure your Ubuntu WSL2 to:"
echo "  1. Find your Windows host automatically"
echo "  2. Connect to VcXsrv X server on Windows"
echo "  3. Run Electron and display it on Windows"
echo ""

# Step 1: Get Windows host IP
WINDOWS_HOST=$(grep nameserver /etc/resolv.conf | awk 'NR==1 {print $2}')

if [ -z "$WINDOWS_HOST" ]; then
    echo "❌ Error: Could not determine Windows host IP"
    exit 1
fi

echo "✓ Windows Host IP: $WINDOWS_HOST"
echo ""

# Step 2: Configure DISPLAY and environment
echo "Configuring environment variables..."
echo ""

# Check if already in bashrc
if grep -q "DISPLAY=.*:0" ~/.bashrc; then
    echo "⚠️  DISPLAY already configured in ~/.bashrc"
else
    echo "Adding DISPLAY configuration to ~/.bashrc..."
    cat >> ~/.bashrc << 'EOF'

# WSL2 Electron Display Configuration
# Connects to Windows VcXsrv X server
export DISPLAY=$(grep nameserver /etc/resolv.conf | awk '{print $2}'):0.0
export LIBGL_ALWAYS_INDIRECT=1
EOF
    echo "✓ Added to ~/.bashrc"
fi

echo ""
echo "========================================================"
echo "✅ WSL2 Configuration Complete!"
echo "========================================================"
echo ""
echo "Next Steps:"
echo ""
echo "1️⃣  On Windows, install and run VcXsrv:"
echo "   Download: https://github.com/ArcticaProject/VcXsrv-Windows"
echo "   • Install the latest version"
echo "   • Run XLaunch (start from All Programs)"
echo "   • Use default settings (Multiple windows, display 0)"
echo "   • ✅ Click Finish (server runs in background)"
echo ""
echo "2️⃣  In this Ubuntu terminal, reload the config:"
echo "   source ~/.bashrc"
echo ""
echo "3️⃣  Start the Electron app:"
echo "   npm run dev:app"
echo ""
echo "   OR use the launcher script:"
echo "   ./start-electron.sh"
echo ""
echo "========================================================"
echo ""
echo "⚠️  IMPORTANT: VcXsrv must be running on Windows!"
echo ""
echo "After installing VcXsrv on Windows:"
echo "  1. Find 'XLaunch' in Start Menu"
echo "  2. Run it (each session)"
echo "  3. Keep it running while using Electron"
echo ""
echo "Windows will show: 'X Server' running in system tray"
echo ""
