#!/bin/bash

# RobotComLab LIMS - Electron Development Launcher
# Optimized for WSL2, SSH, and native Linux

set -e

echo "🚀 RobotComLab LIMS - Electron Development"
echo "=========================================="
echo ""

# Detect environment
if grep -qi microsoft /proc/version 2>/dev/null; then
    echo "📦 WSL2 Environment Detected"
    IS_WSL=true
else
    IS_WSL=false
fi

# Check for display
if [ -z "$DISPLAY" ]; then
    if [ "$IS_WSL" = true ]; then
        echo "⚠️  No DISPLAY set on WSL2"
        echo ""
        echo "To use Electron on WSL2:"
        echo "1. Install X server on Windows (e.g., VcXsrv, Xming)"
        echo "2. Add to ~/.bashrc or ~/.zshrc:"
        echo "   export DISPLAY=\$(grep -m 1 nameserver /etc/resolv.conf | awk '{print \$2}'):0"
        echo "3. Restart terminal and try again"
        echo ""
        echo "Alternative: Use web version instead"
        echo "   npm run dev:web"
        exit 1
    else
        echo "❌ Error: No DISPLAY environment variable set"
        echo ""
        echo "Solutions:"
        echo "1. If using SSH: ssh -X user@host (X11 forwarding)"
        echo "2. If using WSL2: Install X server on Windows and set DISPLAY"
        echo "3. If headless: use 'npm run dev:web' instead"
        exit 1
    fi
fi

echo "✓ Display: $DISPLAY"

# Check if display is accessible
if [ "$IS_WSL" = true ]; then
    # For WSL2, try to connect to Windows X server
    echo "Attempting to connect to X server on Windows..."
    if timeout 2 bash -c "xset q 2>/dev/null" &>/dev/null; then
        echo "✓ X server is accessible"
    else
        echo "⚠️  Cannot reach X server at $DISPLAY"
        echo ""
        echo "Make sure:"
        echo "1. X server is running on Windows"
        echo "2. Firewall allows connections"
        echo "3. DISPLAY variable is correct"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    # For native Linux
    if [ -S "/tmp/.X11-unix/0" ]; then
        echo "✓ X11 socket found"
    fi
fi

# Set electron flags for better compatibility
export ELECTRON_DISABLE_SANDBOX=1
export ELECTRON_ENABLE_LOGGING=1

# For WSL2, forward localhost if needed
if [ "$IS_WSL" = true ]; then
    export ELECTRON_FORCE_WINDOW_MENU_BAR=1
fi

echo "Starting Electron app..."
echo ""

cd "$(dirname "$0")"
npm run dev:app "$@"
