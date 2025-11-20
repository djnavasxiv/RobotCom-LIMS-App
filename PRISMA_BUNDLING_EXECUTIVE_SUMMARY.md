# PRISMA + ELECTRON BUNDLING: EXECUTIVE SUMMARY

## Problem Statement
Your Electron app fails with **"Cannot find module 'prisma/client/default'"** when packaged as a `.exe` installer, despite working fine in development.

---

## Root Cause Analysis

### Why It Fails in Packaged App (Not in Development)

```
Development:
  node_modules/@prisma/client/ → index.js
                ↓
  node_modules/.prisma/client/ → libquery_engine-windows.dll.node (native binary)
                ↓
  ✅ Loads from disk → Executes successfully

Packaged (Current):
  app.asar (compressed archive) → Contains @prisma/client
                ↓
  Tries to load native binary from compressed archive
                ↓
  ❌ Cannot execute native code from ASAR → ERROR
```

### The Core Issue
Prisma includes native C++ engine binaries (`.node` files) that **must execute from disk**. Electron's ASAR packaging format is a compressed archive that **cannot execute native binaries**. The solution is to tell electron-builder to extract Prisma files outside the archive.

---

## Solution Summary

### 3 Configuration Changes Required

| File | Change | Reason |
|------|--------|--------|
| `electron-builder.json` | Add `asarUnpack` field | Extract native binaries to disk |
| `package.json` | Add build hooks | Ensure Prisma client regenerated before packaging |
| `electron.vite.config.ts` | Remove hardcoded paths | Simplify and make version-agnostic |

### Quick Implementation
```bash
# Time to implement: 10-15 minutes
# Files to modify: 3
# Lines of code: ~20 lines total

1. electron-builder.json: Add asarUnpack array (4 lines)
2. package.json: Add 2 script hooks (3 lines)
3. electron.vite.config.ts: Remove hardcoded paths (8 lines)

Then: pnpm package:win
Result: ✅ Working .exe installer
```

---

## Key Configuration Pieces

### electron-builder.json
```json
{
  "asarUnpack": [
    "node_modules/@prisma/**/*",
    "node_modules/.prisma/**/*"
  ]
}
```
**What this does:** Tells electron-builder to extract Prisma files outside the compressed ASAR archive, making them available on disk where the native binary can execute.

### package.json (scripts)
```json
{
  "prebuild": "prisma generate",
  "package:win": "npm run build && prisma generate && electron-builder --win"
}
```
**What this does:** Ensures Prisma client is regenerated before packaging, so bundled client matches your dependencies.

### electron.vite.config.ts
```typescript
build: {
  rollupOptions: {
    external: [
      '@prisma/client',
      '.prisma/client',
      '@prisma/client/runtime'
    ]
  }
}
```
**What this does:** Marks Prisma as external modules and lets Node.js resolve them naturally (removes version-specific hardcoding).

---

## Build Process (Corrected)

```
Before fix:
  pnpm package:win
    → electron-builder
    → Bundles ASAR
    → ❌ Prisma files inside compressed archive
    → ❌ Engine binary can't execute

After fix:
  pnpm package:win
    → npm run prepackage hook
    → pnpm build (compile TS)
    → prisma generate (refresh client)
    → electron-builder
    → Bundles ASAR
    → Unpacks @prisma/** and .prisma/** to .asar.unpacked/
    → Engine binary available on disk
    → ✅ Prisma loads successfully
```

---

## File Structure in Packaged App

### Before Fix (Broken)
```
Program Files\RobotComLab\
└── resources\
    └── app.asar (compressed archive)
        └── node_modules\.prisma\client\
            └── libquery_engine-windows.dll.node ❌ IN ARCHIVE (can't execute)
```

### After Fix (Working)
```
Program Files\RobotComLab\
├── resources\
│   ├── app.asar (compressed archive)
│   │   └── (most files here)
│   │
│   └── app.asar.unpacked\ (extracted files)
│       └── node_modules\
│           └── .prisma\client\
│               └── libquery_engine-windows.dll.node ✅ ON DISK (can execute)
```

---

## Why Each Fix Works

| Fix | Problem | Solution | Why It Works |
|-----|---------|----------|-------------|
| **asarUnpack** | Native binary in compressed archive | Extract to disk | Native code needs file system access |
| **prebuild hook** | Stale Prisma client | Regenerate before package | Ensures version matches node_modules |
| **Simplified config** | Hardcoded version paths break | Dynamic resolution | Works with any Prisma version |

---

## Implementation Steps

```
1. Update electron-builder.json (1 minute)
   └─ Add asarUnpack with Prisma paths

2. Update package.json scripts (2 minutes)
   └─ Add prebuild and prepackage hooks

3. Simplify electron.vite.config.ts (1 minute)
   └─ Remove hardcoded pnpm paths

4. Clean and rebuild (5 minutes)
   └─ rm -rf out dist release
   └─ pnpm build && pnpm prisma:generate

5. Package (5 minutes)
   └─ pnpm package:win

6. Test (5 minutes)
   └─ ./release/RobotComLab-Setup-*.exe

TOTAL: 20 minutes
```

---

## Verification Checklist

After implementing, verify:

```
✅ Prisma is installed
   $ npm ls @prisma/client
   
✅ Engine binary exists
   $ file node_modules/.prisma/client/libquery_engine-windows.dll.node
   $ Should show: PE 64-bit executable

✅ Configuration files updated
   $ grep "asarUnpack" packages/robotcom-lims/electron-builder.json
   $ grep "prebuild" packages/robotcom-lims/package.json

✅ Clean build succeeds
   $ pnpm build && pnpm prisma:generate

✅ Installer created
   $ ls packages/robotcom-lims/release/*.exe

✅ App runs from installer
   $ ./packages/robotcom-lims/release/RobotComLab-Setup-*.exe
   └─ App launches
   └─ Database operations work
```

---

## Documentation Provided

Created 6 comprehensive guides:

| Guide | Length | Purpose |
|-------|--------|---------|
| **PRISMA_QUICK_FIX.md** | 5 min | Quick implementation steps |
| **PRISMA_VISUAL_GUIDE.md** | 10 min | Diagrams and visualizations |
| **PRISMA_RESEARCH_SUMMARY.md** | 10 min | Research findings |
| **PRISMA_COPY_PASTE_SOLUTIONS.md** | 15 min | Ready-to-use code |
| **PRISMA_ELECTRON_BUNDLING_GUIDE.md** | 20 min | Complete reference |
| **PRISMA_TECHNICAL_REFERENCE.md** | 25 min | Technical deep dive |

**Quick start:** Read PRISMA_QUICK_FIX.md, then implement using PRISMA_COPY_PASTE_SOLUTIONS.md

---

## Success Criteria

✅ **Success:** After following the 3-step fix:
- electron-builder.json includes `asarUnpack` field
- package.json includes `prebuild` and `prepackage` hooks
- electron.vite.config.ts simplified (no hardcoded paths)
- Clean build executes: `pnpm build && pnpm prisma:generate`
- Installer packages: `pnpm package:win`
- Installer runs: `./release/RobotComLab-Setup-*.exe`
- App launches and database operations work

---

## Key Insights

### What's Actually Happening
```
ASAR Archive (Electron standard):
  • Compresses app files for efficiency
  • Can't execute native binaries
  • Works fine for JS/TypeScript

Prisma's Native Engine:
  • C++ compiled binary (.node file)
  • Needs file system access
  • Must be on disk, not in archive

The Conflict:
  • App tries to load Prisma from ASAR
  • ASAR can't execute native binary
  • Module loading fails

The Fix:
  • Tell electron-builder to extract Prisma files
  • Files go to .asar.unpacked/ on disk
  • Node.js looks in both ASAR and .unpacked
  • Native binary loads from disk
  • Success!
```

### Why This Wasn't Obvious
- Error message says "Cannot find module" (sounds like file not found)
- Actually it's "Cannot execute native module" (different problem)
- Error only appears in packaged app, not development
- Root cause requires understanding ASAR + native modules interaction

---

## Best Practices Applied

### ✅ DO This:
- Use `asarUnpack` for all native modules (Prisma, bcrypt, sqlite3, etc.)
- Run `prisma generate` as part of build process
- Store database in `app.getPath('userData')` for production
- Test packaging on actual Windows (not just dev environment)

### ❌ DON'T Do This:
- Bundle Prisma in ASAR without unpacking
- Skip regenerating Prisma before packaging
- Use hardcoded version paths in build config
- Build Windows installer from Linux/WSL2

---

## Alternative Approaches (If Needed)

If the primary solution doesn't work:

1. **Dynamic module loading** - Load Prisma at runtime with try/catch
2. **Custom output path** - Move Prisma to a more accessible location
3. **Fallback resolution** - Implement alternative module resolution logic
4. **Separate process** - Run Prisma in worker thread

(See PRISMA_ELECTRON_BUNDLING_GUIDE.md for details on each approach)

---

## Next Action Items

1. **Review documentation** (pick a guide from the 6 provided)
2. **Apply the 3 configuration changes** (see PRISMA_QUICK_FIX.md)
3. **Test with clean build** (10 minutes)
4. **Package and verify** (5 minutes)
5. **Deploy with confidence** ✅

---

## Questions?

| Question | Answer In |
|----------|-----------|
| How do I start? | PRISMA_QUICK_FIX.md |
| Show me code examples | PRISMA_COPY_PASTE_SOLUTIONS.md |
| Why does this work? | PRISMA_TECHNICAL_REFERENCE.md |
| What are all options? | PRISMA_ELECTRON_BUNDLING_GUIDE.md |
| Can you show diagrams? | PRISMA_VISUAL_GUIDE.md |
| What went wrong? | PRISMA_ELECTRON_BUNDLING_GUIDE.md (Troubleshooting) |

---

## Summary

**Problem:** Prisma fails in packaged Electron app due to ASAR archive architecture  
**Solution:** Configure electron-builder to unpack Prisma files + add build hooks  
**Complexity:** Low (3 simple configuration changes)  
**Time to implement:** 15-20 minutes  
**Time to validate:** 5-10 minutes  
**Result:** ✅ Production-ready Electron installer with Prisma ORM

---

**Status: Ready to Implement** ✅

All documentation, code examples, and configuration templates have been created and are ready for use.

