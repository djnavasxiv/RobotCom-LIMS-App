#!/bin/bash
# Fix for Prisma client module resolution
# Copies generated Prisma client to expected location in node_modules

GENERATED_CLIENT="packages/robotcom-lims/src/generated/prisma-client"
TARGET_CLIENT="node_modules/.prisma/client"

if [ -d "$GENERATED_CLIENT" ]; then
  mkdir -p "$TARGET_CLIENT"
  cp -r "$GENERATED_CLIENT"/* "$TARGET_CLIENT/"
  echo "✅ Copied Prisma client to $TARGET_CLIENT"
else
  echo "⚠️  Generated Prisma client not found at $GENERATED_CLIENT"
fi
