# Prisma + Electron: Visual Implementation Guide

## Problem Visualization

### Why It Works in Development But Not When Installed

```
DEVELOPMENT ENVIRONMENT
═══════════════════════════════════════════════════════════════

  Your Computer
  ├── node_modules/
  │   ├── @prisma/client/
  │   │   └── index.js ─────────────┐
  │   ├── .prisma/client/           │
  │   │   ├── index.js              │
  │   │   └── libquery_engine-windows.dll.node ✅ CAN LOAD
  │   └── (other packages)          │
  │                                 │
  ├── package.json                  │
  └── src/main/index.ts             │
      └── import { PrismaClient } from '@prisma/client' ──┘

  Result: ✅ APP WORKS


PACKAGED APPLICATION (CURRENT PROBLEM)
═════════════════════════════════════════════════════════════

  User's Computer
  └── Program Files\RobotComLab\
      ├── RobotComLab.exe ─────────────┐
      └── resources\                   │
          └── app.asar (COMPRESSED)    │
              ├── out/main.js          │
              └── node_modules/        │
                  ├── @prisma/client/  │
                  └── .prisma/client/  │
                      └── libquery_engine-windows.dll.node ❌ CANNOT LOAD FROM ARCHIVE

  Result: ❌ ERROR "Cannot find module 'prisma/client/default'"


PACKAGED APPLICATION (WITH FIX)
═════════════════════════════════════════════════════════════

  User's Computer
  └── Program Files\RobotComLab\
      ├── RobotComLab.exe ─────────────┐
      ├── resources\                   │ Reads from compressed archive
      │   ├── app.asar (COMPRESSED)    │ (app code)
      │   │   ├── out/main.js          │
      │   │   └── node_modules/ (most) │
      │   │                            │
      │   └── app.asar.unpacked/       ├─ Reads from DISK
      │       └── node_modules/        │ (can execute native binaries)
      │           ├── @prisma/client/  │
      │           └── .prisma/client/  │
      │               └── libquery_engine-windows.dll.node ✅ CAN LOAD FROM DISK
      │
      └── (other app files)

  Result: ✅ APP WORKS
```

---

## File Structure: Before and After Fix

### Current Structure (Broken)
```
packages/robotcom-lims/
├── electron-builder.json          ← INCOMPLETE
│   └── "files": [ "out/**/*", "node_modules/**/*", ... ]
│       └─ Missing: asarUnpack
│
├── package.json
│   └── "scripts":
│       └─ Missing: prebuild, prepackage hooks
│
├── electron.vite.config.ts        ← HAS HARDCODED PATHS
│   └── alias: {
│       '@prisma/client': '/path/to/.pnpm/@prisma+client@5.22.0...'  ❌
│   }
│
├── src/main/index.ts
│   └── const prisma = new PrismaClient()  ← Works but not robust
│
└── node_modules/
    ├── @prisma/client/
    └── .prisma/client/
        └── libquery_engine-windows.dll.node
```

### Fixed Structure
```
packages/robotcom-lims/
├── electron-builder.json          ← UPDATED
│   └── "files": [ "out/**/*", "node_modules/**/*", ... ]
│       "asarUnpack": [            ✅ ADDED
│           "node_modules/@prisma/**/*",
│           "node_modules/.prisma/**/*"
│       ]
│
├── package.json                   ← UPDATED
│   └── "scripts":
│       "prebuild": "prisma generate"  ✅ ADDED
│       "prepackage": "npm run build && prisma generate"  ✅ ADDED
│       "package:win": "npm run prepackage && ..."  ✅ UPDATED
│
├── electron.vite.config.ts        ← SIMPLIFIED
│   └── build: {
│       rollupOptions: {
│           external: [
│               '@prisma/client',
│               '.prisma/client',
│               '@prisma/client/runtime'
│           ]  ✅ CLEANED UP (no hardcoded paths)
│       }
│   }
│
├── src/main/
│   ├── index.ts                   ← UPDATED (uses safe init)
│   └── prisma-init.ts             ← NEW FILE (safe initialization)
│
└── node_modules/
    ├── @prisma/client/
    └── .prisma/client/
        └── libquery_engine-windows.dll.node
```

---

## Build Flow Diagram

### Current Flow (Without Hooks) - BROKEN
```
1. npm run package:win
        ↓
2. electron-builder --win
        ↓
   └─ Copies: out/ + node_modules/
   └─ Bundles into ASAR
   └─ ❌ Prisma client might be stale
   └─ ❌ Engine binary not extracted
        ↓
3. release/RobotComLab-Setup-*.exe
        ↓
4. User installs and runs
        ↓
   ❌ Cannot load Prisma
   ❌ "Cannot find module 'prisma/client/default'"
```

### Fixed Flow (With Hooks) - WORKING
```
1. npm run package:win
        ↓
2. npm run prepackage (hook)
        ├─ npm run build
        │   └─ electron-vite build → compiles to out/
        │
        └─ prisma generate
            └─ Regenerates .prisma/client/ (fresh, matched)
        ↓
3. electron-builder --win
        ├─ Copies: out/ (fresh) + node_modules/ (fresh)
        ├─ Bundles most to ASAR
        ├─ Extracts @prisma/** and .prisma/** to .asar.unpacked/
        ├─ Creates release/RobotComLab-Setup-*.exe
        ↓
4. User installs and runs
        ├─ Program Files\RobotComLab\
        ├─ Contains app.asar + app.asar.unpacked/
        ├─ Node.js loads @prisma from .asar.unpacked
        ├─ Engine binary .node file executes from disk
        ↓
✅ App works perfectly
```

---

## Configuration Changes Visual Map

### electron-builder.json
```
{
  "appId": "com.robotcom.lims",
  "productName": "RobotComLab",
  "directories": { "output": "release", "buildResources": "resources" },
  "files": [
    "out/**/*",              ← Your compiled app
    "node_modules/**/*",     ← All dependencies
    "package.json"           ← App config
  ],
  
  "asarUnpack": [            ← ✅ NEW: Extract Prisma files
    "node_modules/@prisma/**/*",     ← @prisma/client package
    "node_modules/.prisma/**/*"      ← Generated client + engine
  ],
  
  "win": { ... },
  "nsis": { ... }
}
```

### package.json Scripts
```
{
  "scripts": {
    "dev": "electron-vite dev",                                    (unchanged)
    
    "prebuild": "prisma generate",                                 ✅ NEW
    "build": "electron-vite build",                               (unchanged)
    
    "prepackage": "npm run build && prisma generate",             ✅ NEW
    "package:win": "npm run prepackage && electron-builder --win" ✅ UPDATED
                   └─ Runs prepackage hook automatically
  }
}
```

### electron.vite.config.ts
```typescript
// BEFORE (broken)
resolve: {
  alias: {
    '@prisma/client': resolve(__dirname, 
      '../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma/client'),
    '.prisma/client': resolve(__dirname,
      '../../node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client')
    // ❌ Hardcoded paths break when Prisma updates
  }
}

// AFTER (fixed)
build: {
  rollupOptions: {
    external: [
      '@prisma/client',
      '.prisma/client',
      '@prisma/client/runtime'
      // ✅ Let Node.js resolve naturally
    ]
  }
}
```

---

## Module Loading Path Comparison

### Development Module Resolution
```
require('@prisma/client')
        ↓
Standard Node.js resolution:
  1. Check node_modules/@prisma/client/ ✅ Found
  2. Load @prisma/client/index.js
  3. Load @prisma/client/runtime/index.js
  4. Load .prisma/client/libquery_engine-windows.dll.node
        ↓
✅ Executes native binary from disk
```

### Production (Without Fix) Module Resolution
```
require('@prisma/client')
        ↓
ASAR resolution:
  1. Check app.asar/node_modules/@prisma/client/ ✅ Found (in archive)
  2. Load @prisma/client/index.js (from archive)
  3. Load @prisma/client/runtime/index.js (from archive)
  4. Try to load .prisma/client/libquery_engine-windows.dll.node
        ↓
❌ CANNOT execute native binary from compressed archive
❌ Error: Cannot find module 'prisma/client/default'
```

### Production (With Fix) Module Resolution
```
require('@prisma/client')
        ↓
Smart ASAR resolution:
  1. Check app.asar/node_modules/@prisma/client/ ✅ Found
  2. Load @prisma/client/index.js (from archive)
  3. Load @prisma/client/runtime/index.js (from archive)
  4. Try to load .prisma/client/libquery_engine-windows.dll.node
  5. Not in archive, check app.asar.unpacked/ ✅ Found!
  6. Load from app.asar.unpacked/node_modules/.prisma/client/libquery_engine-windows.dll.node
        ↓
✅ Executes native binary from disk
```

---

## What Goes Where in Packaged App

### Installation Directory Structure (Windows)
```
C:\Program Files\RobotComLab\
│
├── RobotComLab.exe
│   └─ Electron executable (starts app)
│
├── resources\
│   ├── app.asar
│   │   ├── package.json
│   │   ├── out/
│   │   │   ├── main/
│   │   │   │   ├── index.js
│   │   │   │   └── services/
│   │   │   ├── preload/
│   │   │   │   └── index.js
│   │   │   └── renderer/
│   │   │       └── index.html
│   │   │
│   │   └── node_modules/ (compressed - no native modules)
│   │       ├── react/
│   │       ├── react-dom/
│   │       ├── zustand/
│   │       └── (other JS-only packages)
│   │
│   └── app.asar.unpacked/ ✅ Extracted native modules
│       └── node_modules/
│           ├── @prisma/
│           │   └── client/
│           │       ├── index.js
│           │       ├── runtime/
│           │       └── *.d.ts
│           │
│           ├── .prisma/
│           │   └── client/
│           │       ├── index.js
│           │       ├── schema.prisma
│           │       └── libquery_engine-windows.dll.node ✅ Can execute
│           │
│           ├── bcrypt/ (native module)
│           └── sqlite3/ (native module)
│
├── icon.ico
└── (other resources)

Database file (created at first run):
C:\Users\{Username}\AppData\Local\RobotComLab\database.db
```

---

## The Three-File Fix at a Glance

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: electron-builder.json                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "asarUnpack": [                                        │
│    "node_modules/@prisma/**/*",                         │
│    "node_modules/.prisma/**/*"                          │
│  ]                                                      │
│                                                         │
│  ✅ Tells electron-builder to extract Prisma files     │
│  ✅ Engine binaries (.node files) go to disk            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 2: package.json (scripts section)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  "prebuild": "prisma generate",                         │
│  "prepackage": "npm run build && prisma generate",      │
│  "package:win": "npm run prepackage && electron-builder"│
│                                                         │
│  ✅ prebuild: Generates client before each build        │
│  ✅ prepackage: Fresh client before packaging           │
│  ✅ package:win: Automatically runs prepackage          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 3: electron.vite.config.ts                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  build: {                                               │
│    rollupOptions: {                                     │
│      external: [                                        │
│        '@prisma/client',                                │
│        '.prisma/client',                                │
│        '@prisma/client/runtime'                         │
│      ]                                                  │
│    }                                                    │
│  }                                                      │
│                                                         │
│  ✅ Remove hardcoded paths                              │
│  ✅ Mark Prisma modules as external                     │
│  ✅ Let Node.js resolve naturally                       │
└─────────────────────────────────────────────────────────┘
```

---

## Verification Checklist (Visual)

```
After applying fix, verify:

┌─────────────────────────────────────────┐
│ Step 1: Dependency Verification         │
├─────────────────────────────────────────┤
│ $ npm ls @prisma/client                 │
│ ✅ Should show installed version        │
│                                         │
│ $ file node_modules/.prisma/client/     │
│    libquery_engine-windows.dll.node     │
│ ✅ Should show: PE 64-bit executable    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Step 2: Build Verification              │
├─────────────────────────────────────────┤
│ $ pnpm build                            │
│ ✅ Compiles without errors              │
│                                         │
│ $ ls out/main/index.js                  │
│ ✅ Compiled output exists               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Step 3: Prisma Generation               │
├─────────────────────────────────────────┤
│ $ pnpm prisma:generate                  │
│ ✅ Runs without errors                  │
│                                         │
│ $ ls node_modules/.prisma/client/       │
│ ✅ Generated files exist                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Step 4: Packaging                       │
├─────────────────────────────────────────┤
│ $ pnpm package:win                      │
│ ✅ Creates installer file               │
│                                         │
│ $ ls release/*.exe                      │
│ ✅ Installer exists                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Step 5: Installer Verification          │
├─────────────────────────────────────────┤
│ $ ./release/RobotComLab-Setup-*.exe    │
│ ✅ Runs without errors                  │
│ ✅ App launches successfully            │
│ ✅ Database operations work             │
└─────────────────────────────────────────┘
```

---

## Why Each Fix Works

```
┌──────────────────────────────────────────────────────────────────┐
│ asarUnpack: Fixes "Cannot execute native binary in archive"     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Without:  .asar (archive)                                        │
│            └─ libquery_engine.dll.node ❌ Cannot execute        │
│                                                                  │
│ With:     .asar.unpacked/ (disk)                                 │
│            └─ libquery_engine.dll.node ✅ Can execute            │
│                                                                  │
│ Why: Archives are compressed and can't execute native binaries  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ prebuild hook: Fixes "Version mismatch" issues                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Without: Build TS → Package (old client)                        │
│          └─ Prisma client might not match node_modules          │
│                                                                  │
│ With:    Build TS → Generate client → Package                   │
│          └─ Prisma client always fresh and matched              │
│                                                                  │
│ Why: Ensures client matches installed @prisma/client version    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ Simplified config: Fixes "Hardcoded path breaks" issues         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Before: alias: {'@prisma/client': '/.../@prisma+client@5.22...'} │
│         └─ Breaks when Prisma updates from 5.22 → 5.23          │
│                                                                  │
│ After:  external: ['@prisma/client', ...]                       │
│         └─ Works with any Prisma version                        │
│                                                                  │
│ Why: Dynamic paths resolve better than hardcoded versions       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Time Estimate

```
┌──────────────────────────────────────────────┐
│ Task                    Time      Difficulty │
├──────────────────────────────────────────────┤
│ Read this guide         5 min     Easy       │
│ Apply 3 file fixes      10 min    Easy       │
│ Test build              5 min     Easy       │
│ Create installer        5 min     Easy       │
│ Test installer          5 min     Medium     │
├──────────────────────────────────────────────┤
│ TOTAL                   30 min    Easy       │
└──────────────────────────────────────────────┘
```

---

**Next:** Read `PRISMA_QUICK_FIX.md` for step-by-step implementation!

