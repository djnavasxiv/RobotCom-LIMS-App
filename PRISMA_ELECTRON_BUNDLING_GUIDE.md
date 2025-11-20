# Prisma Client Bundling in Electron Apps - Complete Guide

## Problem Summary
The error "Cannot find module 'prisma/client/default'" occurs when:
1. App runs fine in development (modules resolved correctly)
2. After packaging as `.exe` installer, Prisma client cannot be found
3. Generated `.prisma` files and engine binaries are missing from the packaged app

---

## Root Causes

### 1. **Missing Prisma Generated Files**
Prisma generates platform-specific engine binaries that must be included:
- `.prisma/client/` - Generated Prisma client code
- Engine binary (`libquery_engine-windows.dll.node` for Windows)
- Query engine files
- Schema.prisma location reference

### 2. **Incorrect electron-builder Configuration**
The `files` array in `electron-builder.json` doesn't include Prisma artifacts.

### 3. **Wrong Prisma Output Path**
If using custom Prisma output, it may not be where electron-builder expects it.

### 4. **Missing Build Step**
Prisma client isn't generated before bundling happens.

---

## Best Practices - Implementation

### ✅ SOLUTION 1: Update electron-builder.json (Recommended)

Your current `electron-builder.json` **must be updated** to include all Prisma files:

```json
{
  "appId": "com.robotcom.lims",
  "productName": "RobotComLab",
  "directories": {
    "output": "release",
    "buildResources": "resources"
  },
  "files": [
    "out/**/*",
    "node_modules/**/*",
    "package.json",
    "!node_modules/*/{CHANGELOG.md,README.md,README.rst,readme.markdown,readme.md,readme.txt,readme,license,LICENSE,license.txt,LICENSE.txt,AUTHORS,HISTORY,History.md,CONTRIBUTORS,CONTRIBUTING.md,INSTALL,INSTALL.md,History.rst,Changes.rst,changelog.md,Changes.md,copyright,COPYING,COPYRIGHT.txt,license.md,License.md,Notice,LICENSE.GPL,LICENSE.LGPL,LICENSE.BSD,license.php,*.md}"
  ],
  "extraMetadata": {
    "build": {
      "asarUnpack": [
        "node_modules/@prisma/client/runtime/**/*",
        "node_modules/.prisma/client/**/*"
      ]
    }
  },
  "win": {
    "target": [
      {
        "target": "nsis",
        "arch": ["x64"]
      },
      {
        "target": "portable",
        "arch": ["x64"]
      }
    ],
    "icon": "resources/icon.ico",
    "artifactName": "${productName}-Setup-${version}.${ext}",
    "certificateFile": null,
    "certificatePassword": null,
    "signingHashAlgorithms": null,
    "sign": null,
    "signAndEditExecutable": false
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "RobotComLab",
    "installerIcon": "resources/icon.ico",
    "uninstallerIcon": "resources/icon.ico",
    "installerHeaderIcon": "resources/icon.ico",
    "language": "1033",
    "differentialPackage": true,
    "deleteAppDataOnUninstall": false
  }
}
```

**Key Changes:**
- `"extraMetadata.build.asarUnpack"` - Unpacks Prisma binaries outside ASAR to avoid loading issues
- Uses `node_modules` pattern to include all Prisma dependencies

---

### ✅ SOLUTION 2: Update package.json Build Configuration

Add/update the `build` field in your **robotcom-lims/package.json**:

```json
{
  "build": {
    "appId": "com.robotcom.lims",
    "productName": "RobotComLab",
    "publish": [
      {
        "provider": "generic",
        "url": "https://your-update-server.com"
      }
    ],
    "directories": {
      "output": "release",
      "buildResources": "resources"
    },
    "files": [
      "out/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "extraMetadata": {
      "build": {
        "asarUnpack": [
          "node_modules/@prisma/client/runtime/**/*",
          "node_modules/.prisma/client/**/*"
        ]
      }
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ],
      "icon": "resources/icon.ico",
      "artifactName": "${productName}-Setup-${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "RobotComLab",
      "installerIcon": "resources/icon.ico",
      "uninstallerIcon": "resources/icon.ico",
      "installerHeaderIcon": "resources/icon.ico",
      "language": "1033",
      "differentialPackage": true,
      "deleteAppDataOnUninstall": false
    }
  }
}
```

---

### ✅ SOLUTION 3: Fix electron.vite.config.ts

Your current config has hardcoded paths. Update it to be more robust:

```typescript
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: [
          '@prisma/client',
          '.prisma/client',
          '.prisma/client/index-browser',
          '@prisma/client/runtime'
        ]
      },
      // Ensure proper module resolution
      commonjsOptions: {
        include: [/node_modules/]
      }
    },
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```

**Key Changes:**
- Removed hardcoded paths (they're version-specific and break easily)
- Added `@prisma/client/runtime` to externals
- Simplified alias resolution

---

### ✅ SOLUTION 4: Update Build Scripts in package.json

Add a pre-build step to ensure Prisma client is generated:

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "dev:headless": "DISPLAY='' ELECTRON_OZONE_PLATFORM_HINT=x11 electron-vite dev",
    "prebuild": "prisma generate",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "prepackage": "npm run build && prisma generate",
    "package": "electron-builder",
    "package:win": "npm run prepackage && electron-builder --win",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "node prisma/seed.js"
  }
}
```

**Why:**
- `prebuild` ensures Prisma client exists before build
- `prepackage` regenerates client with correct node_modules state before packaging

---

## Optional: Custom Prisma Output Path

Your schema uses a **custom output path**:
```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma-client"
}
```

This is **valid but requires additional bundling**. If you want to keep it, update electron-builder files array:

```json
{
  "files": [
    "out/**/*",
    "node_modules/**/*",
    "src/generated/prisma-client/**/*",
    "package.json"
  ]
}
```

**Recommendation:** Switch to default `.prisma/client` output in schema.prisma:

```prisma
generator client {
  provider = "prisma-client-js"
  // output   = "../src/generated/prisma-client"  # Remove this line
  // Uses default: node_modules/.prisma/client
}
```

Then simplify bundling configuration.

---

## File Path Patterns That Must Be Bundled

### For Windows Electron Apps:

```
node_modules/@prisma/client/
├── index.js
├── index.d.ts
├── package.json
├── runtime/
│   ├── index.js
│   ├── library.js
│   └── wasm.js
└── edge.js

node_modules/.prisma/client/
├── index.js
├── index.d.ts
├── index-browser.js
├── libquery_engine-windows.dll.node  # ← CRITICAL: Windows engine binary
└── schema.prisma

node_modules/@prisma/engines/
├── libquery_engine-windows.dll.node  # ← Fallback location
└── (other platform binaries)
```

### Exact electron-builder file patterns:

```json
"files": [
  "out/**/*",                                      // Compiled main/preload
  "node_modules/@prisma/**/*",                     // All Prisma packages
  "node_modules/.prisma/**/*",                     // Generated client
  "node_modules/@types/@prisma/**/*",              // TypeScript types
  "package.json"
]
```

---

## Troubleshooting Checklist

### ❌ Error: "Cannot find module 'prisma/client/default'"

**Check:**
1. ✅ Prisma generated in `node_modules/.prisma/client/`?
   ```bash
   ls node_modules/.prisma/client/
   # Should show: index.js, schema.prisma, libquery_engine-windows.dll.node, etc.
   ```

2. ✅ Engine binary exists for your OS?
   ```bash
   ls node_modules/.prisma/client/libquery_engine-*.node
   # Should show Windows/Linux/macOS variant
   ```

3. ✅ electron-builder includes these files?
   ```bash
   # After building, check:
   ls dist/app/node_modules/.prisma/client/
   ```

4. ✅ Correct Prisma version in package.json?
   ```bash
   npm ls @prisma/client
   # Should match your dev version
   ```

### ❌ Different Version in Development vs. Production

**Fix:**
```bash
# Clear and reinstall
rm -rf node_modules .pnpm-store pnpm-lock.yaml
pnpm install

# Regenerate
pnpm prisma:generate

# Build again
pnpm build
pnpm package:win
```

### ❌ "libquery_engine-windows.dll.node" not found

**Cause:** Binary wasn't bundled or wrong architecture (x64 vs x32)

**Fix:**
```bash
# Verify architecture
file node_modules/.prisma/client/libquery_engine-windows.dll.node
# Should show: PE 64-bit

# Verify in installer matches build command
# Use: electron-builder --win (not --win32)
```

### ❌ ASAR unpacking issues

**If using ASAR packaging:**

In `electron-builder.json`:
```json
{
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```

This extracts Prisma files outside ASAR because native modules can't load from archives.

---

## Build Flow (Correct Order)

```bash
# 1. Install dependencies
pnpm install

# 2. Generate Prisma client
pnpm prisma:generate

# 3. Build Electron app
pnpm build

# 4. Verify files are in dist
ls -la packages/robotcom-lims/out/

# 5. Package into installer
pnpm package:win

# 6. Test installer
./release/RobotComLab-Setup-*.exe
```

---

## Code Example: Safe Prisma Initialization in Main Process

In `src/main/index.ts`:

```typescript
import { app } from 'electron'
import { join } from 'path'
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient | null = null

// Get database path - works in both dev and packaged app
function getDatabasePath(): string {
  const isPackaged = app.isPackaged
  
  if (isPackaged) {
    // In production: use app data directory
    return join(app.getPath('userData'), 'database.db')
  } else {
    // In development: use project root
    return join(process.cwd(), 'packages/robotcom-lims/prisma/dev.db')
  }
}

// Initialize Prisma client
export function initializePrisma(): PrismaClient {
  if (prisma) {
    return prisma
  }

  const databaseUrl = `file:${getDatabasePath()}`
  
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    // Log for debugging (remove in production)
    log: process.env.DEBUG ? ['query', 'error', 'warn'] : ['error']
  })

  return prisma
}

// Call this in your app.whenReady()
app.whenReady().then(() => {
  initializePrisma()
  // ... rest of your code
})

// Cleanup on app quit
app.on('before-quit', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
})

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error('Prisma not initialized')
  }
  return prisma
}
```

---

## Recommended Configuration (Quick Implementation)

### Step 1: Update `packages/robotcom-lims/electron-builder.json`

```json
{
  "appId": "com.robotcom.lims",
  "productName": "RobotComLab",
  "directories": {
    "output": "release",
    "buildResources": "resources"
  },
  "files": [
    "out/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ],
  "win": {
    "target": [{"target": "nsis", "arch": ["x64"]}, {"target": "portable", "arch": ["x64"]}],
    "icon": "resources/icon.ico",
    "artifactName": "${productName}-Setup-${version}.${ext}"
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "RobotComLab",
    "installerIcon": "resources/icon.ico",
    "uninstallerIcon": "resources/icon.ico",
    "installerHeaderIcon": "resources/icon.ico",
    "language": "1033",
    "differentialPackage": true,
    "deleteAppDataOnUninstall": false
  }
}
```

### Step 2: Update `packages/robotcom-lims/package.json` scripts

Add these prebuild hooks:
```json
{
  "prebuild": "prisma generate",
  "prepackage": "npm run build && prisma generate",
  "package:win": "npm run prepackage && electron-builder --win"
}
```

### Step 3: Simplify `electron.vite.config.ts`

```typescript
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['@prisma/client', '.prisma/client', '@prisma/client/runtime']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
```

### Step 4: Verify Build

```bash
# From workspace root
pnpm --filter robotcom-lims prisma:generate
pnpm --filter robotcom-lims build
pnpm --filter robotcom-lims package:win

# Test
./packages/robotcom-lims/release/RobotComLab-Setup-1.0.0.exe
```

---

## Alternative Approach: Dynamic Module Loading

If problems persist, you can dynamically require Prisma at runtime:

```typescript
// src/main/services/DatabaseService.ts
let PrismaClient: any = null

export async function initializePrismaClient() {
  try {
    // Try standard import first
    const module = await import('@prisma/client')
    PrismaClient = module.PrismaClient
    return new PrismaClient()
  } catch (error) {
    console.error('Failed to load Prisma:', error)
    
    // Fallback: try alternative paths
    try {
      const module = require('@prisma/client')
      PrismaClient = module.PrismaClient
      return new PrismaClient()
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
      throw error
    }
  }
}
```

---

## Summary Table

| Aspect | Issue | Solution |
|--------|-------|----------|
| **Missing Binaries** | libquery_engine-*.node not bundled | Add `asarUnpack` in electron-builder.json |
| **Wrong Import Path** | 'prisma/client/default' not found | Ensure `.prisma/client` is in files array |
| **Version Mismatch** | Dev works, packaged fails | Add `prisma generate` as prebuild step |
| **Custom Output Path** | `src/generated/prisma-client` not found | Use default path or include explicitly |
| **ASAR Issues** | Native module loading fails | Enable `asarUnpack` for Prisma packages |
| **Database Path** | Wrong location in packaged app | Use `app.getPath('userData')` |

---

## Additional Resources

- **Prisma Electron Integration:** https://www.prisma.io/docs/orm/guide/setup-and-install/databases/sqlite
- **electron-builder:** https://www.electron.build/
- **Native Modules in Electron:** https://www.electronjs.org/docs/tutorial/using-native-node-modules

---

## Next Steps

1. **Apply the recommended configuration** from "Step 1-4" section above
2. **Test clean build:** `pnpm install && pnpm package:win`
3. **Verify bundled files** exist in `packages/robotcom-lims/dist/app/node_modules/.prisma/`
4. **Test installer** on a clean Windows machine
5. **Monitor app startup** with `console.log()` to verify Prisma initialization

