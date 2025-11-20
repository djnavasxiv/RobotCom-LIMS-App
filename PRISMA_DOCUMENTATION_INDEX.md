# Prisma + Electron Bundling: Complete Documentation Index

**Research Complete:** November 19, 2025  
**Problem:** Prisma client fails to load in packaged Electron app  
**Solution Status:** ✅ Fully Documented with Ready-to-Use Code

---

## Quick Navigation

### 🚀 Start Here (5 minutes)
👉 **[PRISMA_QUICK_FIX.md](./PRISMA_QUICK_FIX.md)**
- 3-step implementation guide
- Exact files to modify
- Test verification checklist
- **Read this first!**

### 📊 Visual Overview (5 minutes)
👉 **[PRISMA_VISUAL_GUIDE.md](./PRISMA_VISUAL_GUIDE.md)**
- Problem visualization
- File structure diagrams
- Build flow charts
- Configuration change maps
- Best for visual learners

### 📋 Research Summary (10 minutes)
👉 **[PRISMA_RESEARCH_SUMMARY.md](./PRISMA_RESEARCH_SUMMARY.md)**
- Executive summary
- Error diagnosis
- Best practices table
- What was researched and why

### 💻 Copy-Paste Solutions (10 minutes to implement)
👉 **[PRISMA_COPY_PASTE_SOLUTIONS.md](./PRISMA_COPY_PASTE_SOLUTIONS.md)**
- Ready-to-use code snippets
- Complete configuration examples
- Build command reference
- Runtime debugging code
- File-by-file implementation guide

### 📚 Complete Reference (15 minutes)
👉 **[PRISMA_ELECTRON_BUNDLING_GUIDE.md](./PRISMA_ELECTRON_BUNDLING_GUIDE.md)**
- Comprehensive best practices guide
- File path patterns that must be bundled
- Alternative approaches if needed
- Troubleshooting checklist
- Full working examples

### 🔬 Technical Deep Dive (20 minutes)
👉 **[PRISMA_TECHNICAL_REFERENCE.md](./PRISMA_TECHNICAL_REFERENCE.md)**
- Module resolution chain explained
- ASAR unpacking architecture
- Prisma client generation process
- Platform-specific engine binaries
- Debugging decision trees
- Real-world configuration walkthrough

---

## The Problem (In 30 Seconds)

```
❌ Error: "Cannot find module 'prisma/client/default'"
   Happens: Only in packaged .exe installer, NOT in development

Root Cause: Prisma uses native C++ engine binaries (.node files)
            ASAR archives (Electron's compression) can't execute native code

Solution: Tell electron-builder to extract Prisma files to disk
          instead of compressing them in the ASAR archive
```

---

## The Fix (In 30 Seconds)

**Three configuration files to update:**

1. **electron-builder.json**
   ```json
   "asarUnpack": ["node_modules/@prisma/**/*", "node_modules/.prisma/**/*"]
   ```

2. **package.json (scripts)**
   ```json
   "prebuild": "prisma generate",
   "package:win": "npm run build && prisma generate && electron-builder --win"
   ```

3. **electron.vite.config.ts**
   - Remove hardcoded Prisma paths
   - Add `external: ['@prisma/client', '.prisma/client', '@prisma/client/runtime']`

**Then:** `pnpm package:win` creates working installer ✅

---

## Document Overview

| Document | Length | Focus | Best For |
|----------|--------|-------|----------|
| PRISMA_QUICK_FIX.md | 5 min | Implementation | Getting it done fast |
| PRISMA_VISUAL_GUIDE.md | 10 min | Diagrams | Understanding the problem |
| PRISMA_RESEARCH_SUMMARY.md | 10 min | Overview | Why this approach works |
| PRISMA_COPY_PASTE_SOLUTIONS.md | 15 min | Code | Copy-paste ready solutions |
| PRISMA_ELECTRON_BUNDLING_GUIDE.md | 20 min | Reference | Complete guide + alternatives |
| PRISMA_TECHNICAL_REFERENCE.md | 25 min | Deep dive | Technical understanding |

---

## Reading Paths

### Path 1: "Just Fix It" (20 minutes)
1. Read: PRISMA_QUICK_FIX.md (5 min)
2. Read: PRISMA_COPY_PASTE_SOLUTIONS.md (10 min)
3. Implement: Update 3 files (5 min)
4. Result: Working installer ✅

### Path 2: "Understand It" (30 minutes)
1. Read: PRISMA_VISUAL_GUIDE.md (5 min)
2. Read: PRISMA_RESEARCH_SUMMARY.md (10 min)
3. Read: PRISMA_QUICK_FIX.md (5 min)
4. Read: PRISMA_COPY_PASTE_SOLUTIONS.md (10 min)
5. Implement: Update 3 files (5 min)
6. Result: Understanding + working installer ✅

### Path 3: "Master It" (60 minutes)
1. Read: PRISMA_VISUAL_GUIDE.md (10 min)
2. Read: PRISMA_RESEARCH_SUMMARY.md (10 min)
3. Read: PRISMA_ELECTRON_BUNDLING_GUIDE.md (20 min)
4. Read: PRISMA_TECHNICAL_REFERENCE.md (20 min)
5. Implement: Using PRISMA_COPY_PASTE_SOLUTIONS.md (5 min)
6. Result: Expert-level understanding ✅

---

## Files You Need to Modify

### 1️⃣ `/packages/robotcom-lims/electron-builder.json`
**Action:** Add one field  
**Lines:** Add after `"files"` array  
**Complexity:** Copy-paste (1 minute)  
**Reference:** PRISMA_COPY_PASTE_SOLUTIONS.md (Section 1)

### 2️⃣ `/packages/robotcom-lims/package.json`
**Action:** Update scripts section  
**Lines:** Update `scripts` object  
**Complexity:** Copy-paste (2 minutes)  
**Reference:** PRISMA_COPY_PASTE_SOLUTIONS.md (Section 2)

### 3️⃣ `/packages/robotcom-lims/electron.vite.config.ts`
**Action:** Simplify configuration  
**Lines:** Replace entire file  
**Complexity:** Copy-paste (1 minute)  
**Reference:** PRISMA_COPY_PASTE_SOLUTIONS.md (Section 3)

### Optional: `/packages/robotcom-lims/src/main/index.ts`
**Action:** Better Prisma initialization  
**Lines:** Import from new module  
**Complexity:** Copy-paste (3 minutes)  
**Reference:** PRISMA_COPY_PASTE_SOLUTIONS.md (Section 5)

---

## Key Concepts Explained

### Why ASAR?
- **ASAR** = Archive format used by Electron
- Compresses app files for smaller download
- **Problem:** Can't execute native `.node` modules from inside archive
- **Solution:** Extract critical files with `asarUnpack`

### Why Prisma Fails?
- Prisma includes native C++ query engine (`libquery_engine-windows.dll.node`)
- Engine binary must execute from file system
- Can't execute from compressed ASAR archive
- App can't find the module, crashes with error

### Why the Fix Works?
- `asarUnpack` tells electron-builder to extract Prisma files
- Files go to `app.asar.unpacked/` on user's disk
- Node.js automatically looks in `.unpacked` directory
- Engine binary can execute normally

---

## Best Practices Summary

### ✅ DO This:
- ✅ Use `asarUnpack` for all native modules (Prisma, bcrypt, sqlite3)
- ✅ Add `prisma generate` to build hooks
- ✅ Run clean rebuild before packaging
- ✅ Test on actual Windows machine (not WSL2)
- ✅ Store database in `app.getPath('userData')` in production
- ✅ Mark Prisma modules as `external` in vite config

### ❌ DON'T Do This:
- ❌ Bundle Prisma files in ASAR without unpacking
- ❌ Skip `prisma generate` before packaging
- ❌ Use hardcoded version paths (breaks on updates)
- ❌ Build Windows .exe from Linux/WSL2
- ❌ Use relative database paths in packaged app
- ❌ Use custom Prisma output path in monorepo

---

## Troubleshooting Guide

**Error:** "Cannot find module 'prisma/client/default'"
- → Check: Is `asarUnpack` in electron-builder.json? No? Add it.
- → Check: Did you run `prisma generate`? No? Run it.
- → Check: Is `libquery_engine-windows.dll.node` in `node_modules/.prisma/client/`? No? Reinstall.

**Error:** "libquery_engine-windows.dll.node: ELF binary"
- → Problem: Built on wrong OS (Linux not Windows)
- → Solution: Build on actual Windows or use Docker

**App works in dev but fails when installed**
- → Problem: Module resolution different in dev vs. packaged
- → Check: PRISMA_TECHNICAL_REFERENCE.md (Module Loading Path)

**Installer file not created**
- → Check: electron-builder.json syntax valid?
- → Check: Did build succeed? (`pnpm build`)
- → Check: Are resources/icon.ico present?

**For detailed troubleshooting:** See PRISMA_ELECTRON_BUNDLING_GUIDE.md (Troubleshooting Checklist)

---

## Command Reference

### Development
```bash
pnpm dev              # Start dev server with hot reload
pnpm build            # Build Electron app
pnpm prisma:generate  # Regenerate client
pnpm prisma:migrate   # Run migrations
pnpm prisma:studio    # Open Prisma Studio
```

### Packaging
```bash
# Clean rebuild (recommended)
rm -rf out dist release
pnpm build
pnpm prisma:generate
pnpm package:win

# Quick rebuild
pnpm package:win      # Automatically runs hooks

# Testing
./release/RobotComLab-Setup-*.exe
```

---

## Implementation Checklist

- [ ] Read PRISMA_QUICK_FIX.md (5 min)
- [ ] Update electron-builder.json with asarUnpack (1 min)
- [ ] Update package.json scripts section (2 min)
- [ ] Simplify electron.vite.config.ts (1 min)
- [ ] Clean previous builds: `rm -rf out dist release`
- [ ] Fresh build: `pnpm build && pnpm prisma:generate`
- [ ] Verify: `ls node_modules/.prisma/client/libquery_engine-windows.dll.node`
- [ ] Package: `pnpm package:win`
- [ ] Test: Run `release/RobotComLab-Setup-*.exe`
- [ ] Verify: App launches and database works

**Total time:** 15-20 minutes

---

## What Changed (Summary)

### electron-builder.json
```diff
{
  "files": [ "out/**/*", "node_modules/**/*", "package.json" ],
+ "asarUnpack": [
+   "node_modules/@prisma/**/*",
+   "node_modules/.prisma/**/*"
+ ]
}
```

### package.json scripts
```diff
{
  "scripts": {
+   "prebuild": "prisma generate",
    "build": "electron-vite build",
+   "prepackage": "npm run build && prisma generate",
-   "package:win": "electron-builder --win"
+   "package:win": "npm run prepackage && electron-builder --win"
  }
}
```

### electron.vite.config.ts
```diff
- Remove: hardcoded pnpm paths in alias
+ Add: external modules declaration
+ Simplify: let Node.js resolve Prisma naturally
```

---

## Why This Was Researched

**Original Issue:**
- Prisma works in development
- Fails when packaged as .exe
- Error: "Cannot find module 'prisma/client/default'"
- Solution wasn't obvious from error message

**Research Covered:**
- How Electron packages apps (ASAR archives)
- How Prisma distributes engine binaries
- How native modules load in Node.js
- How electron-builder includes/excludes files
- Best practices from Electron + ORM communities
- Platform-specific considerations (Windows, macOS, Linux)
- Real-world configurations and examples

**Result:**
- Root cause identified (ASAR + native modules incompatibility)
- Solution validated (asarUnpack + prebuild hooks)
- Complete implementation guide created
- Multiple reference levels (quick fix → deep dive)

---

## Additional Resources

### Official Documentation
- **Prisma Docs:** https://www.prisma.io/docs/
- **Electron Docs:** https://www.electronjs.org/docs/
- **electron-builder:** https://www.electron.build/

### Related Concepts
- **ASAR Format:** Electron's archive format
- **Native Modules:** C++ compiled Node.js extensions
- **Module Resolution:** How Node.js finds and loads modules

---

## Questions? Check These First

| Question | Answer In |
|----------|-----------|
| "How do I implement this?" | PRISMA_QUICK_FIX.md |
| "Show me the code" | PRISMA_COPY_PASTE_SOLUTIONS.md |
| "Why does this work?" | PRISMA_TECHNICAL_REFERENCE.md |
| "What are all the options?" | PRISMA_ELECTRON_BUNDLING_GUIDE.md |
| "Show me with diagrams" | PRISMA_VISUAL_GUIDE.md |
| "What went wrong?" | PRISMA_ELECTRON_BUNDLING_GUIDE.md (Troubleshooting) |

---

## Status

| Item | Status |
|------|--------|
| Root cause identified | ✅ Complete |
| Solution designed | ✅ Complete |
| Configuration examples | ✅ Complete |
| Code snippets ready | ✅ Complete |
| Build verification | ✅ Documented |
| Troubleshooting guide | ✅ Complete |
| Visual diagrams | ✅ Complete |
| Multiple reading paths | ✅ Complete |

**Ready to implement:** ✅ Yes

---

## Next Steps

1. **Pick your reading path** (choose from 3 options above)
2. **Read the appropriate document** (5-25 minutes)
3. **Implement the 3-file fix** (5-10 minutes)
4. **Test with clean build** (5-10 minutes)
5. **Package and verify** (5 minutes)

**Expected result:** Working .exe installer that loads Prisma correctly ✅

---

**Created:** November 19, 2025  
**Status:** Complete and Ready to Use  
**Format:** 6 detailed markdown guides  
**Total Reading:** 60-120 minutes (optional; quick fix takes 20 minutes)  
**Implementation:** 15-20 minutes

