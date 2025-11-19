#!/bin/bash

# RobotComLab LIMS - Smart Development Runner
# Runs Electron if X server is available, otherwise falls back to headless web mode

set -e

echo "🚀 RobotComLab LIMS - Development Server"
echo "==========================================="
echo ""

# Check if DISPLAY is set and X server is accessible
if [ -n "$DISPLAY" ]; then
  echo "✓ X server detected at DISPLAY=$DISPLAY"
  echo ""
  echo "Starting Electron app..."
  cd "$(dirname "$0")"
  npm run dev:app
else
  echo "⚠ No X server available (DISPLAY not set)"
  echo ""
  echo "Falling back to web-only mode (http://localhost:5173)"
  echo ""
  cd "$(dirname "$0")"
  npm run dev:app:headless
fi
