# Quick Fix: Prisma Bundling for Your Electron App

## Your Current Status
- ✅ Using electron-builder for packaging
- ✅ Prisma installed and working in development
- ❌ Error after installation: "Cannot find module 'prisma/client/default'"
- ❌ Missing Prisma engine binaries in packaged app

---

## 3-Step Fix

### Step 1: Update `electron-builder.json`

**Current (INCOMPLETE):**
```json
{
  "files": [
    "out/**/*",
    "node_modules/**/*",
    "package.json"
  ]
}
```

**Should be (ADD asarUnpack):**
```json
{
  "files": [
    "out/**/*",
    "node_modules/**/*",
    "package.json"
  ],
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```

**Why:** The ASAR (archive) format can't execute native `.node` binaries. This unpacks Prisma's engine binaries so they can load properly.

---

### Step 2: Update build scripts in `package.json`

**In `packages/robotcom-lims/package.json`, modify scripts:**

```json
{
  "scripts": {
    "prebuild": "prisma generate",
    "build": "electron-vite build",
    "prepackage": "npm run build && prisma generate",
    "package:win": "npm run prepackage && electron-builder --win"
  }
}
```

**Why:** Ensures Prisma client is freshly generated before packaging, matching your node_modules state.

---

### Step 3: Simplify `electron.vite.config.ts`

**Current (with hardcoded paths):**
```typescript
resolve: {
  alias: {
    '@prisma/client': resolve(__dirname, '../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client'),
    '.prisma/client': resolve(__dirname, '../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client')
  }
}
```

**Should be (version-agnostic):**
```typescript
build: {
  rollupOptions: {
    external: ['@prisma/client', '.prisma/client', '@prisma/client/runtime']
  }
}
```

Remove the alias block - let Node.js resolve normally.

---

## The Files You Need to Update

### File 1: `/packages/robotcom-lims/electron-builder.json`

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

---

### File 2: Update scripts in `/packages/robotcom-lims/package.json`

**Just update the `scripts` section:**

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

**Changes:**
- Added `"prebuild": "prisma generate"`
- Added `"prepackage": "npm run build && prisma generate"`
- Changed `"package:win"` to run prepackage first

---

### File 3: Simplify `/packages/robotcom-lims/electron.vite.config.ts`

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
          '@prisma/client/runtime'
        ]
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

**Changes:**
- Removed hardcoded pnpm path aliases
- Added `@prisma/client/runtime` to externals
- Let Node.js resolve Prisma naturally

---

## Test the Fix

```bash
# 1. Clean previous build
rm -rf packages/robotcom-lims/out packages/robotcom-lims/dist packages/robotcom-lims/release

# 2. Install and generate
cd packages/robotcom-lims
pnpm install
pnpm prisma:generate

# 3. Build
pnpm build

# 4. Verify Prisma files are present
ls -la node_modules/.prisma/client/
# Should show: index.js, schema.prisma, libquery_engine-windows.dll.node

# 5. Package
pnpm package:win

# 6. Verify packaged app includes Prisma
cd dist/app
ls -la node_modules/.prisma/client/
# Should show same files as step 4

# 7. Test installer
cd ../..
./release/RobotComLab-Setup-*.exe
```

---

## Why This Works

| Problem | Solution | Result |
|---------|----------|--------|
| Native binaries in ASAR | `asarUnpack` extracts them | `.node` files load correctly |
| Stale Prisma client | `prebuild` + `prepackage` regenerate | Version matches your node_modules |
| Version-specific paths break | Removed hardcoded paths | Works with any Prisma version |
| Missing modules during install | Include `node_modules` in files | All deps available to packaged app |

---

## Common Verification Commands

```bash
# Verify Prisma is in development
npm ls @prisma/client

# Check engine binary exists
file node_modules/.prisma/client/libquery_engine-windows.dll.node

# Verify schema is present
cat node_modules/.prisma/client/schema.prisma

# After packaging, verify in dist
ls packages/robotcom-lims/dist/app/node_modules/@prisma/client/
ls packages/robotcom-lims/dist/app/node_modules/.prisma/client/
```

---

## If Issues Persist

### 1. Force Clean Rebuild
```bash
rm -rf node_modules .pnpm-store pnpm-lock.yaml
pnpm install
pnpm run build
pnpm run package:win
```

### 2. Verify Windows Architecture
```bash
# Should be PE 64-bit
file packages/robotcom-lims/node_modules/.prisma/client/libquery_engine-windows.dll.node

# If 32-bit or missing, your Prisma install is corrupted
pnpm remove @prisma/client prisma
pnpm add -D prisma @prisma/client
pnpm prisma:generate
```

### 3. Debug at Runtime
In `src/main/index.ts`, add logging:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn']
})

console.log('Prisma loaded from:', require.resolve('@prisma/client'))
console.log('Engine at:', require.resolve('@prisma/client/runtime'))
```

---

## Summary

**These 3 files need changes:**
1. ✅ `electron-builder.json` - Add `asarUnpack`
2. ✅ `package.json` - Add build hooks + update package:win
3. ✅ `electron.vite.config.ts` - Simplify external resolution

**Total time to implement: 5 minutes**

**Recommended next test: `pnpm run package:win` from `packages/robotcom-lims/`**

