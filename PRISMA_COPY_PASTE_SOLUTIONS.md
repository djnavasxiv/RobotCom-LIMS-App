# Prisma Electron: Copy-Paste Solutions

All code below is production-ready and can be directly applied to your project.

---

## 1. electron-builder.json - Complete Configuration

**File:** `/packages/robotcom-lims/electron-builder.json`

**Replace entire file with:**

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

**What changed:**
- ✅ Added `"asarUnpack"` array with Prisma paths
- All other settings remain the same

---

## 2. package.json Scripts - Update Section

**File:** `/packages/robotcom-lims/package.json`

**In the `"scripts"` section, add/update these entries:**

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

**What changed:**
- ✅ Added `"prebuild": "prisma generate"`
- ✅ Added `"prepackage": "npm run build && prisma generate"`
- ✅ Updated `"package:win"` to run prepackage first
- All other scripts remain unchanged

---

## 3. electron.vite.config.ts - Simplified Version

**File:** `/packages/robotcom-lims/electron.vite.config.ts`

**Replace entire file with:**

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

**What changed:**
- ✅ Removed hardcoded pnpm path aliases (they break with version updates)
- ✅ Added `@prisma/client/runtime` to external modules
- ✅ Simplified alias resolution
- ✅ Let Node.js handle natural module resolution

---

## 4. Safe Prisma Initialization - Main Process

**File:** `/packages/robotcom-lims/src/main/prisma-init.ts` (NEW FILE)

**Create this new file:**

```typescript
import { app } from 'electron'
import path from 'path'
import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null

/**
 * Get the database file path
 * In development: uses project directory
 * In packaged app: uses app user data directory
 */
export function getDatabasePath(): string {
  const isPackaged = app.isPackaged

  if (isPackaged) {
    // Production: store in user data directory
    // C:\Users\{User}\AppData\Local\RobotComLab\ on Windows
    // ~/Library/Application Support/RobotComLab/ on macOS
    // ~/.RobotComLab/ on Linux
    return path.join(app.getPath('userData'), 'database.db')
  } else {
    // Development: use project directory
    return path.join(process.cwd(), 'packages/robotcom-lims/prisma/dev.db')
  }
}

/**
 * Initialize Prisma Client
 * Can be called multiple times - returns same instance
 */
export function initializePrisma(): PrismaClient {
  if (prismaInstance) {
    return prismaInstance
  }

  const databaseUrl = `file:${getDatabasePath()}`

  console.log(`[Prisma] Initializing with database: ${databaseUrl}`)

  prismaInstance = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    // Log queries in debug mode
    log: process.env.DEBUG === 'true' ? ['query', 'error', 'warn'] : ['error']
  })

  console.log('[Prisma] ✅ Client initialized successfully')

  return prismaInstance
}

/**
 * Get the Prisma Client instance
 * Must call initializePrisma() first
 */
export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    throw new Error(
      '[Prisma] Not initialized. Call initializePrisma() first.'
    )
  }
  return prismaInstance
}

/**
 * Cleanup Prisma connection
 * Call when app is closing
 */
export async function disconnectPrisma(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect()
    console.log('[Prisma] ✅ Disconnected')
    prismaInstance = null
  }
}
```

---

## 5. Update Main Index - Integrate Initialization

**File:** `/packages/robotcom-lims/src/main/index.ts`

**At the TOP, replace the Prisma import:**

```typescript
// REMOVE THIS:
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// REPLACE WITH THIS:
import { initializePrisma, getPrisma, disconnectPrisma } from './prisma-init'
```

**In the `app.whenReady()` block, add initialization:**

```typescript
app.whenReady().then(async () => {
  // Initialize Prisma BEFORE creating window
  initializePrisma()

  createWindow()

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://updates.robotcomlab.com'
  })
  autoUpdater.checkForUpdatesAndNotify()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
```

**In IPC handlers, replace `prisma` with `getPrisma()`:**

```typescript
// BEFORE:
// const result = await (prisma[model as keyof typeof prisma] as any)[method](...args)

// AFTER:
const result = await (getPrisma()[model as keyof typeof getPrisma()] as any)[method](...args)
```

**At the end of the file, add cleanup:**

```typescript
app.on('before-quit', async () => {
  await disconnectPrisma()
})

app.on('window-all-closed', async () => {
  await disconnectPrisma()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})
```

---

## 6. Build and Package Commands

Run these from `/packages/robotcom-lims/` directory:

### Clean Build (from scratch)
```bash
# Clear previous builds
rm -rf out dist release node_modules .pnpm-store pnpm-lock.yaml

# Fresh install
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Verify engine binary exists
ls node_modules/.prisma/client/libquery_engine-windows.dll.node

# Build Electron app
pnpm build

# Package into installer
pnpm package:win
```

### Quick Rebuild (keeping dependencies)
```bash
# Clear builds only
rm -rf out dist release

# Regenerate Prisma client
pnpm prisma:generate

# Build and package
pnpm package:win
```

### Development with Hot Reload
```bash
pnpm dev
```

---

## 7. Verification Scripts

### Check Prisma in Development
```bash
# From /packages/robotcom-lims/
npm ls @prisma/client

# Should output:
# robotcom-lims@1.0.0
# └── @prisma/client@5.7.0
```

### Check Engine Binary
```bash
# From /packages/robotcom-lims/
file node_modules/.prisma/client/libquery_engine-windows.dll.node

# Should output something like:
# PE 32-bit executable (x86) Intel 80386, for Windows
# OR
# PE 64-bit executable (x86-64) Sections: 8...
```

### Verify Prisma in Packaged App
```bash
# After building, check compiled output:
ls packages/robotcom-lims/out/main/index.js

# Check if Prisma is in node_modules
ls packages/robotcom-lims/node_modules/@prisma/client/index.js
ls packages/robotcom-lims/node_modules/.prisma/client/

# After packaging, check in dist:
ls packages/robotcom-lims/dist/app/node_modules/.prisma/client/libquery_engine-windows.dll.node
```

---

## 8. Runtime Debugging

### Add to src/main/index.ts for troubleshooting:

```typescript
import { createRequire } from 'module'

// After importing Prisma init
const require = createRequire(import.meta.url)

function debugPrismaSetup() {
  console.log('\n=== Prisma Debug Information ===')

  try {
    const prismaPath = require.resolve('@prisma/client')
    console.log('✅ @prisma/client:', prismaPath)
  } catch (e) {
    console.error('❌ @prisma/client not found')
  }

  try {
    const enginePath = require.resolve('@prisma/client/runtime')
    console.log('✅ Engine runtime:', enginePath)
  } catch (e) {
    console.error('❌ Engine runtime not found')
  }

  try {
    const clientPath = require.resolve('.prisma/client')
    console.log('✅ .prisma/client:', clientPath)
  } catch (e) {
    console.error('❌ .prisma/client not found')
  }

  console.log(`Packaged: ${app.isPackaged}`)
  console.log(`Database: ${getDatabasePath()}`)
  console.log('================================\n')
}

// Call this in app.whenReady()
app.whenReady().then(async () => {
  if (process.env.DEBUG === 'true') {
    debugPrismaSetup()
  }
  initializePrisma()
  // ... rest of code
})
```

Run with:
```bash
DEBUG=true npm start
```

---

## 9. Full Working Example: Updated main/index.ts Structure

Here's what your main file should look like overall (simplified):

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { autoUpdater } from 'electron-updater'
import * as bcrypt from 'bcrypt'
import { initializePrisma, getPrisma, disconnectPrisma } from './prisma-init'
import { emailService } from './services/EmailService'

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
    icon: join(__dirname, '../../resources/icon.png'),
  })

  mainWindow.removeMenu()

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  // Initialize Prisma first
  initializePrisma()

  createWindow()

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://updates.robotcomlab.com'
  })
  autoUpdater.checkForUpdatesAndNotify()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', async () => {
  await disconnectPrisma()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await disconnectPrisma()
})

// IPC Handlers
ipcMain.handle('db:query', async (_event, model, method, ...args) => {
  try {
    const prisma = getPrisma()

    if (model === 'user' && method === 'validatePassword') {
      const [username, password] = args
      const user = await prisma.user.findUnique({ where: { username } })
      if (!user) {
        return { success: true, data: { isValid: false } }
      }
      const isValid = await bcrypt.compare(password, user.password)
      return { success: true, data: { isValid } }
    }

    const result = await (prisma[model as keyof typeof prisma] as any)[method](...args)
    return { success: true, data: result }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { success: false, error: errorMessage }
  }
})

// ... rest of your handlers ...
```

---

## 10. Installation Test Checklist

After creating the installer, test with this checklist:

```bash
# 1. Create installer
cd packages/robotcom-lims
pnpm package:win

# 2. Verify installer file exists
ls -lh release/*.exe

# 3. Test on clean Windows machine OR in VM:
#    - Run installer
#    - Check files installed in Program Files
#    - Launch application
#    - Test database operations
#    - Check logs in console (Dev Tools if enabled)

# 4. Check installed files
C:\Program Files\RobotComLab\
  ├── RobotComLab.exe
  ├── resources\
  │   ├── app.asar
  │   └── app.asar.unpacked\
  │       └── node_modules\.prisma\client\
  │           └── libquery_engine-windows.dll.node

# 5. If it fails, check:
#    - Does .asar.unpacked exist?
#    - Are Prisma files there?
#    - Does engine binary exist?
#    - Are you running as Administrator?
```

---

## Summary

| File | Change | Reason |
|------|--------|--------|
| `electron-builder.json` | Add `asarUnpack` | Extract native binaries |
| `package.json` scripts | Add `prebuild`, `prepackage` | Ensure fresh Prisma client |
| `electron.vite.config.ts` | Remove hardcoded paths | Simplify module resolution |
| `src/main/prisma-init.ts` | NEW: Safe initialization | Proper path handling dev/prod |
| `src/main/index.ts` | Use new initialization | Cleanup on app quit |

**Total implementation time: 10-15 minutes**

