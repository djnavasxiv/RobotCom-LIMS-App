# Prisma + Electron Bundling: Research Summary

**Date:** November 19, 2025  
**Status:** ✅ Complete Research & Solutions Provided

---

## Executive Summary

Your Electron app fails to load Prisma when packaged because:

1. **Native binaries can't execute from ASAR archives**
   - Prisma uses native `.node` modules (compiled C++ engines)
   - ASAR is a compressed archive format that doesn't support executing native code
   - **Fix:** Configure electron-builder to unpack Prisma files

2. **Prisma client might not regenerate before packaging**
   - If `prisma generate` doesn't run at the right time, the bundled client is stale
   - **Fix:** Add `prisma generate` as a pre-build hook

3. **Module resolution fails due to hardcoded version paths**
   - Your electron.vite.config.ts has pnpm-specific paths that break when Prisma updates
   - **Fix:** Remove hardcoded paths and let Node.js resolve naturally

---

## Quick Implementation (3 Files to Edit)

### File 1: `/packages/robotcom-lims/electron-builder.json`
**Add this field:**
```json
{
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```

### File 2: `/packages/robotcom-lims/package.json` (scripts section)
**Update these scripts:**
```json
{
  "prebuild": "prisma generate",
  "package:win": "npm run build && prisma generate && electron-builder --win"
}
```

### File 3: `/packages/robotcom-lims/electron.vite.config.ts`
**Replace entire file with simplified version** (see PRISMA_COPY_PASTE_SOLUTIONS.md)

---

## Best Practices Identified

### ✅ DO This:
- ✅ Use `asarUnpack` in electron-builder for native modules
- ✅ Run `prisma generate` before packaging
- ✅ Include full `node_modules/**/*` in files array
- ✅ Use `app.isPackaged` to detect runtime environment
- ✅ Store database in `app.getPath('userData')` in production
- ✅ Test on actual Windows machine or VM for Windows builds

### ❌ DON'T Do This:
- ❌ Hardcode pnpm paths in Vite config (breaks on updates)
- ❌ Use relative database paths in packaged app
- ❌ Bundle Prisma files in ASAR without unpacking
- ❌ Skip `prisma generate` in build process
- ❌ Build Windows installer from WSL2/Linux (use actual Windows)
- ❌ Use custom Prisma output path in monorepo (use default)

---

## File Path Patterns for Bundling

**These must be included in electron-builder:**
```
node_modules/@prisma/client/**/*
  └── All Prisma client code and types

node_modules/.prisma/client/**/*
  ├── libquery_engine-windows.dll.node      ← CRITICAL on Windows
  ├── index.js
  ├── schema.prisma
  └── index.d.ts

node_modules/@prisma/engines/**/*          ← Fallback engine location
```

**Pattern in electron-builder.json:**
```json
{
  "files": [
    "out/**/*",              // Your compiled app
    "node_modules/**/*",     // All dependencies
    "package.json"           // App manifest
  ],
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```

---

## Build Process (Correct Flow)

```bash
Step 1: pnpm install
  └─ Installs @prisma/client and prisma
  └─ Downloads Windows engine binary for your target

Step 2: pnpm build
  └─ Compiles TypeScript to out/main, out/preload, out/renderer
  └─ Must happen BEFORE prisma generate for fresh client

Step 3: pnpm prisma:generate
  └─ Creates/updates node_modules/.prisma/client/
  └─ Includes platform-specific engine binary

Step 4: pnpm package:win
  └─ electron-builder copies files:
     - out/** (compiled app)
     - node_modules/** (all deps)
     - Unpacks @prisma/** and .prisma/** outside ASAR
  └─ Creates release/RobotComLab-Setup-*.exe
```

**Automated with hooks:**
```json
{
  "prebuild": "prisma generate",           // Before each build
  "prepackage": "npm run build && prisma generate",  // Before package
  "package:win": "npm run prepackage && electron-builder --win"
}
```

---

## Error Diagnosis

### "Cannot find module 'prisma/client/default'"
**Root cause:** ASAR archives can't load native `.node` modules

**Diagnosis:**
1. Check if `.prisma/client/libquery_engine-*.node` exists? → **No** = regenerate
2. Check if it's in bundled files? → **No** = add asarUnpack
3. Check if unpacked directory exists? → **No** = electron-builder issue

**Fix:**
1. Add `asarUnpack` to electron-builder.json
2. Run `prisma generate`
3. Rebuild with `pnpm package:win`

### "libquery_engine-windows.dll.node: ELF binary"
**Root cause:** Built on wrong OS (Linux instead of Windows)

**Diagnosis:**
```bash
file node_modules/.prisma/client/libquery_engine-*.node
# Should show: PE 64-bit executable
# Shows: ELF binary = Wrong OS
```

**Fix:**
```bash
# Build on Windows OR
pnpm remove @prisma/client prisma
pnpm install --build-from-source
pnpm prisma:generate
```

---

## Documentation Files Created

### 1. **PRISMA_QUICK_FIX.md** (5 min read)
   - 3-step implementation
   - Exact files to edit
   - Test verification checklist

### 2. **PRISMA_ELECTRON_BUNDLING_GUIDE.md** (15 min read)
   - Complete reference guide
   - All best practices
   - Troubleshooting table
   - Code examples

### 3. **PRISMA_TECHNICAL_REFERENCE.md** (20 min read)
   - Deep technical dive
   - Module resolution chain
   - ASAR architecture explained
   - Debugging decision tree

### 4. **PRISMA_COPY_PASTE_SOLUTIONS.md** (10 min to implement)
   - Ready-to-use code snippets
   - All configuration examples
   - Build command reference
   - Verification scripts

---

## Key Configuration Examples

### electron-builder.json (Critical Field)
```json
{
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```

### package.json (Build Hooks)
```json
{
  "prebuild": "prisma generate",
  "prepackage": "npm run build && prisma generate",
  "package:win": "npm run prepackage && electron-builder --win"
}
```

### electron.vite.config.ts (External Module Declaration)
```typescript
{
  build: {
    rollupOptions: {
      external: [
        '@prisma/client',
        '.prisma/client',
        '@prisma/client/runtime'
      ]
    }
  }
}
```

### Safe Prisma Initialization
```typescript
import { app } from 'electron'
import path from 'path'

export function getDatabasePath(): string {
  if (app.isPackaged) {
    return path.join(app.getPath('userData'), 'database.db')
  } else {
    return path.join(process.cwd(), 'packages/robotcom-lims/prisma/dev.db')
  }
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${getDatabasePath()}`
    }
  }
})
```

---

## Why This Problem Occurs

### Standard Node.js Module Loading
- Modules are pure JavaScript
- Can be bundled in ASAR archives
- Work fine when compressed

### Prisma's Approach
- Uses **native C++ query engine** (libquery_engine-*.node)
- Native binaries must be executable on disk
- **Cannot run from ASAR archive** (compressed file)
- **Solution:** Extract before execution

### Electron-Builder's Role
- Creates ASAR archive for efficiency
- Provides `asarUnpack` config to extract critical files
- electron-builder extracts unpacked files to `.asar.unpacked/`
- Node.js looks in both locations automatically

---

## Validation Checklist

After implementation, verify:

- [ ] `electron-builder.json` has `asarUnpack` field
- [ ] Package.json has `prebuild` script
- [ ] `package:win` script includes prepackage hook
- [ ] `node_modules/.prisma/client/libquery_engine-windows.dll.node` exists
- [ ] `npm ls @prisma/client` shows installed version
- [ ] Clean rebuild succeeds: `rm -rf out && pnpm build && pnpm package:win`
- [ ] Installer file created: `release/RobotComLab-Setup-*.exe`
- [ ] Installer runs without errors
- [ ] App launches and connects to database

---

## Next Steps

1. **Read PRISMA_QUICK_FIX.md** (5 minutes)
   - Get overview of 3-step solution

2. **Apply fixes** (10-15 minutes)
   - Edit 3 configuration files
   - Create new prisma-init.ts file

3. **Verify setup** (5 minutes)
   - Run clean build
   - Check file existence
   - Test installer

4. **Reference guides available** if issues arise:
   - PRISMA_ELECTRON_BUNDLING_GUIDE.md - Comprehensive reference
   - PRISMA_TECHNICAL_REFERENCE.md - Deep dive explanations
   - PRISMA_COPY_PASTE_SOLUTIONS.md - Code examples

---

## Critical Insights

### Why Dev Works But Packaged Fails
| Aspect | Development | Packaged |
|--------|-------------|----------|
| Module location | Direct node_modules folder | ASAR archive or .asar.unpacked |
| Native binary access | Disk file system (native) | Archive format (cannot execute native) |
| Path resolution | Standard Node.js | Custom ASAR paths |
| Regeneration timing | On demand | Once during build |

### Why asarUnpack is Essential
```
Without asarUnpack:
  .asar (compressed)
    └─ node_modules/.prisma/client/
       └─ libquery_engine-windows.dll.node ← CANNOT EXECUTE (in archive)

With asarUnpack:
  .asar (compressed)
    └─ node_modules/ (most packages)
  
  .asar.unpacked (extracted)
    └─ node_modules/@prisma/**
       └─ node_modules/.prisma/client/
          └─ libquery_engine-windows.dll.node ← CAN EXECUTE (on disk)
```

### Why prebuild is Essential
- Ensures client matches installed @prisma/client version
- Platform-specific engine binary matches build machine
- No stale cache issues

---

## References

### Official Documentation
- **Prisma ORM Docs:** https://www.prisma.io/docs/
- **Electron Builder Docs:** https://www.electron.build/
- **Electron Native Modules:** https://www.electronjs.org/docs/tutorial/using-native-node-modules

### Related Technologies
- **ASAR Format:** Archive format used by Electron for app resources
- **Native Node.js Modules:** C++ addons that require native compilation
- **sqlite3:** Database module used by your app (also native)

---

## Support Resources

All documentation created covers:

1. **Quick Implementation** - Get it working in 5 minutes
2. **Complete Reference** - All options and configurations
3. **Technical Understanding** - Why it works this way
4. **Copy-Paste Code** - Ready-to-use solutions
5. **Troubleshooting** - Decision trees for common issues

---

**Created:** November 19, 2025  
**Status:** ✅ Research Complete - Ready to Implement  
**Complexity:** Medium (straightforward configuration changes)  
**Implementation Time:** 10-15 minutes  
**Testing Time:** 5-10 minutes (clean build required)

