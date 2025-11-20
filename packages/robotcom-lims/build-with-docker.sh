#!/bin/bash
# Build RobotComLab Windows installer using Docker
# This runs electron-builder with Wine support in a Docker container

echo "🐳 Building RobotComLab Installer with Docker..."
echo "=================================================="
echo ""

PROJECT_DIR="/home/djnavasv/RobotCom-LIMS-App"
APP_DIR="${PROJECT_DIR}/packages/robotcom-lims"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker daemon is running
if ! docker ps &> /dev/null; then
    echo "❌ Docker daemon is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is ready"
echo ""

# Run the build in Docker
echo "Starting Docker build container..."
docker run --rm \
  --env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS|APPVEYOR_|CSC_|_TOKEN|_KEY|AWS_|STRIP|BUILD_') \
  -v ${PROJECT_DIR}:/project \
  -v ~/.cache/electron:/root/.cache/electron \
  -v ~/.cache/electron-builder:/root/.cache/electron-builder \
  electronuserland/builder:wine \
  /bin/bash -c "cd /project/packages/robotcom-lims && pnpm install --ignore-scripts && pnpm run build && pnpm run package:win"

BUILD_EXIT=$?

# Clean up wine cache
rm -rf ~/.cache/electron-builder/wine 2>/dev/null

if [ $BUILD_EXIT -eq 0 ]; then
    echo ""
    echo "✅ SUCCESS! Installer created!"
    echo ""
    echo "Your installer files are at:"
    echo "  ${APP_DIR}/release/"
    echo ""
    echo "Files created:"
    ls -lh ${APP_DIR}/release/*.exe 2>/dev/null || echo "  (checking...)"
    echo ""
    echo "You can now share these .exe files with your team!"
else
    echo ""
    echo "❌ Build failed with exit code $BUILD_EXIT"
    exit 1
fi
