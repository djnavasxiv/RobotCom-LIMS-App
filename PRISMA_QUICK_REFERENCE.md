# PRISMA ELECTRON BUNDLING: QUICK REFERENCE CARD

## The Problem (1 sentence)
Prisma's native engine binary can't execute from Electron's compressed ASAR archive.

## The Solution (1 line per file)
1. **electron-builder.json**: Add `asarUnpack` for Prisma paths
2. **package.json**: Add `prebuild` and `prepackage` hooks  
3. **electron.vite.config.ts**: Remove hardcoded paths, mark Prisma as external

---

## 3 Files to Edit

### 1. electron-builder.json
**Add this field after "files":**
```json
"asarUnpack": [
  "node_modules/@prisma/**/*",
  "node_modules/.prisma/**/*"
]
```

### 2. package.json (scripts section)
**Add/update these scripts:**
```json
"prebuild": "prisma generate",
"prepackage": "npm run build && prisma generate",
"package:win": "npm run prepackage && electron-builder --win"
```

### 3. electron.vite.config.ts
**Replace with this (simplified):**
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

---

## Build & Test Commands

```bash
# Clean build (recommended)
rm -rf out dist release
pnpm build
pnpm prisma:generate
pnpm package:win

# Quick test
./packages/robotcom-lims/release/RobotComLab-Setup-*.exe
```

---

## Verification Checklist

- [ ] `node_modules/.prisma/client/libquery_engine-windows.dll.node` exists
- [ ] `npm ls @prisma/client` shows installed version
- [ ] `pnpm build` succeeds
- [ ] `pnpm prisma:generate` succeeds
- [ ] `pnpm package:win` creates `.exe` file
- [ ] `./release/RobotComLab-Setup-*.exe` runs without errors
- [ ] App launches and database works

---

## Why This Works

```
Without fix:
  Engine binary inside compressed ASAR → Can't execute → ❌ ERROR

With fix:
  Engine binary extracted to disk (.asar.unpacked/) → Can execute → ✅ SUCCESS
```

---

## Time Estimate
- Read this card: 2 minutes
- Edit 3 files: 5 minutes
- Clean rebuild: 5 minutes
- Package: 5 minutes
- Test: 5 minutes
- **TOTAL: 22 minutes**

---

## Documentation Files
- **Start here:** PRISMA_QUICK_FIX.md (5 min)
- **Code ready:** PRISMA_COPY_PASTE_SOLUTIONS.md (copy-paste)
- **Visual:** PRISMA_VISUAL_GUIDE.md (diagrams)
- **Complete:** PRISMA_ELECTRON_BUNDLING_GUIDE.md (reference)
- **Technical:** PRISMA_TECHNICAL_REFERENCE.md (deep dive)
- **Index:** PRISMA_DOCUMENTATION_INDEX.md (navigation)

---

## Common Issues

| Issue | Fix |
|-------|-----|
| "Cannot find module 'prisma/client'" | Add `asarUnpack` to electron-builder.json |
| "libquery_engine: ELF binary" | Built on wrong OS (Linux not Windows) |
| App works in dev, fails in package | Missing `asarUnpack` config |
| Installer file not created | Check syntax in electron-builder.json |
| Old Prisma version bundled | Run `pnpm prisma:generate` before package |

---

## Key Points to Remember

✅ **ASAR** = Compressed archive format (can't execute native code)  
✅ **asarUnpack** = Extract these files to disk  
✅ **prebuild** = Regenerate Prisma before build  
✅ **.node files** = Native binaries (need disk access)  
✅ **Version matching** = Prisma client must match @prisma/client package  

---

## Success Indicator

After implementation:
- `packages/robotcom-lims/dist/app.asar.unpacked/node_modules/.prisma/client/libquery_engine-windows.dll.node` exists ✅
- Installer runs and app loads successfully ✅
- Database queries work in packaged app ✅

---

## Need More Details?

| Aspect | Read |
|--------|------|
| Quick steps | PRISMA_QUICK_FIX.md |
| Why it works | PRISMA_VISUAL_GUIDE.md |
| Code examples | PRISMA_COPY_PASTE_SOLUTIONS.md |
| All options | PRISMA_ELECTRON_BUNDLING_GUIDE.md |
| Deep technical | PRISMA_TECHNICAL_REFERENCE.md |
| Navigation | PRISMA_DOCUMENTATION_INDEX.md |

---

**Status: Ready to Implement** ✅  
**Files Created: 7 comprehensive guides**  
**Implementation Time: 15-20 minutes**
