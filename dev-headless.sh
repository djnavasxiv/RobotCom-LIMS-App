#!/bin/bash

# RobotComLab LIMS - Headless Development Server
# This script runs the development server in headless mode
# Useful for remote development or CI/CD environments

set -e

echo "🚀 RobotComLab LIMS - Headless Development Server"
echo "=================================================="
echo ""

# Check if DISPLAY is set
if [ -z "$DISPLAY" ] && [ -z "$WAYLAND_DISPLAY" ]; then
    echo "⚠️  No X11 or Wayland display detected"
    echo ""
    echo "Options:"
    echo "1. Run in headless mode (app runs without window)"
    echo "   npm run dev:app"
    echo ""
    echo "2. Use SSH X11 forwarding (if connecting remotely)"
    echo "   ssh -X user@host"
    echo ""
    echo "3. Use VNC or other remote display solution"
    echo ""
    echo "4. Install and use Xvfb (virtual display)"
    echo "   sudo apt-get install xvfb"
    echo "   export DISPLAY=:99"
    echo "   Xvfb :99 &"
    echo "   npm run dev:app"
    echo ""
    echo "Running in headless mode now..."
    echo ""
fi

# Set headless environment variable for the app
export HEADLESS=1

# Run the development server
cd "$(dirname "$0")"
npm run dev:app "$@"
