#!/bin/bash

# RobotComLab Installer Build Script
# This script builds the Electron app and creates an NSIS installer for Windows

set -e

echo "🔨 Building RobotComLab Installer..."
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "${BLUE}Step 1: Cleaning previous builds...${NC}"
rm -rf out/
rm -rf release/

# Step 2: Install Prisma client
echo -e "${BLUE}Step 2: Generating Prisma client...${NC}"
npm run prisma:generate

# Step 3: Build the Electron app
echo -e "${BLUE}Step 3: Building Electron app...${NC}"
npm run build

# Step 4: Package as installer
echo -e "${BLUE}Step 4: Creating NSIS installer...${NC}"
npm run package:win

# Step 5: Success message
echo -e "${GREEN}✓ Installer build completed successfully!${NC}"
echo ""
echo -e "${GREEN}📦 Installer location: ./release/${NC}"
echo ""
echo "The installer files are ready to distribute:"
ls -lah release/*.exe 2>/dev/null || echo "Installer not found - there may have been an error"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Share the .exe file with end users"
echo "2. Users can run the installer to install RobotComLab"
echo "3. Desktop shortcut and Start Menu entry will be created automatically"
