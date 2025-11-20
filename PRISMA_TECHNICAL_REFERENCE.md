# Prisma + Electron: Technical Deep Dive

## Module Resolution Chain

When you import `@prisma/client`, here's what happens:

### Development (Working ✅)
```
require('@prisma/client')
  ↓
node_modules/@prisma/client/index.js (entry point)
  ↓
node_modules/@prisma/client/runtime/index.js (loads Prisma engine)
  ↓
node_modules/.prisma/client/libquery_engine-windows.dll.node (NATIVE BINARY)
  ↓
✅ Executes successfully
```

### Production Without Fix (Broken ❌)
```
App.exe starts
  ↓
Resources bundled as ASAR archive
  ↓
Electron tries to require('@prisma/client')
  ↓
ASAR file-system loads node_modules/@prisma/client/index.js
  ↓
Tries to load libquery_engine-windows.dll.node FROM INSIDE ASAR
  ↓
❌ ASAR can't execute native binaries
❌ Error: Cannot find module 'prisma/client/default'
```

### Production With Fix (Working ✅)
```
App.exe starts
  ↓
Resources in ASAR, but Prisma files EXTRACTED to disk
  ↓
Electron tries to require('@prisma/client')
  ↓
Node.js loads @prisma/client from disk (outside ASAR)
  ↓
Loads libquery_engine-windows.dll.node from disk location
  ↓
Native binary executes successfully
  ↓
✅ Prisma queries work
```

---

## ASAR Unpacking Explained

### What is ASAR?
- **ASAR** = Electron Archive format
- Like ZIP: combines many files into one efficient archive
- **Problem:** Can't execute native `.node` modules from inside archive
- **Solution:** Tell electron-builder to extract Prisma files before packaging

### Configuration
```json
{
  "asarUnpack": [
    "node_modules/@prisma/**/*",      // Extracts all @prisma/* packages
    "node_modules/.prisma/**/*"       // Extracts generated client
  ]
}
```

### Result in Packaged App
```
C:\Users\User\AppData\Local\Programs\RobotComLab\
├── resources/
│   └── app.asar                              (ASAR archive - compressed)
│       ├── out/main.js
│       ├── out/preload.js
│       └── (other JS files)
│
└── resources/app.asar.unpacked/              (EXTRACTED FILES)
    └── node_modules/
        ├── @prisma/
        │   └── client/
        │       ├── index.js
        │       └── runtime/
        └── .prisma/
            └── client/
                ├── index.js
                └── libquery_engine-windows.dll.node  ← CAN EXECUTE
```

Node.js automatically resolves from the `.unpacked` directory.

---

## Prisma Client Generation

### What `prisma generate` Does

```bash
$ prisma generate
```

1. **Reads** `prisma/schema.prisma`
2. **Generates** `.prisma/client/` directory with:
   - `index.js` - Main client entry point
   - `index.d.ts` - TypeScript types
   - `schema.prisma` - Copy of your schema
   - Platform-specific engine binaries:
     - `libquery_engine-windows.dll.node` (Windows x64)
     - `libquery_engine-darwin-arm64.dylib.node` (macOS ARM)
     - `libquery_engine-debian-openssl-1.1.x.so.node` (Linux)

3. **Output location** depends on your config:

```prisma
# Default (recommended)
generator client {
  provider = "prisma-client-js"
}
# Generates to: node_modules/.prisma/client/

# Custom output (your current setup)
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma-client"
}
# Generates to: src/generated/prisma-client/
```

### Version Compatibility
- **Must match**: `@prisma/client` version in package.json
- **Must have**: Engine binary for your target platform
- **Problem:** If versions mismatch, engine binary is wrong architecture/OS

```bash
# Verify compatibility
$ npm ls @prisma/client
robotcom-lims@1.0.0
└── @prisma/client@5.7.0

# Check engine
$ file node_modules/.prisma/client/libquery_engine-windows.dll.node
# PE 64-bit executable (good)
# PE 32-bit executable (bad - mismatch)
# ELF (bad - wrong OS)
```

---

## File Inclusion Strategy

### Minimum Required Files for Production

```
out/
├── main/
│   ├── index.js              ← Main process entry
│   └── services/
│       └── *.js
│
└── preload/
    └── index.js              ← Preload script

node_modules/
├── @prisma/
│   └── client/               ← MUST INCLUDE
│       ├── index.js
│       ├── runtime/
│       └── *.d.ts
│
├── .prisma/
│   └── client/               ← MUST INCLUDE
│       ├── index.js
│       ├── libquery_engine-windows.dll.node  ← ENGINE BINARY
│       └── schema.prisma
│
├── react/                    ← Must include
├── react-dom/                ← Must include
├── (all other dependencies)
│
└── (other modules your app uses)

package.json                 ← MUST INCLUDE
```

### electron-builder File Patterns

| Pattern | Matches | Purpose |
|---------|---------|---------|
| `out/**/*` | All compiled source | Your compiled TS/JS |
| `node_modules/**/*` | All dependencies | Everything installed |
| `.prisma/**/*` | Generator output | Prisma client code |
| `@prisma/**/*` | Prisma packages | Client + types |
| `package.json` | Root manifest | Tells Electron what to load |

### What NOT to Include (electron-builder auto-excludes)

```
node_modules/
├── .bin/                  ← Executable scripts (auto-excluded)
├── .pnpm/                 ← PNPM internals (auto-excluded)
├── prisma/                ← CLI tool (auto-excluded if specified)
└── typescript/            ← Dev dependency (not bundled with dependencies)
```

**Why:** Reduces installer size. These aren't needed in production.

---

## Build Process Flow

### Current (Without Hooks)
```
1. npm run build
   ↓
   electron-vite build (outputs to out/)
   ↓
   ❌ Prisma client might be stale or missing
   
2. npm run package:win
   ↓
   electron-builder packages what's in out/ + node_modules/
   ↓
   ❌ If Prisma client wasn't regenerated, wrong version bundled
```

### With Build Hooks (Recommended)
```
1. npm run package:win
   ↓
   runs prepackage hook: npm run build && prisma generate
   ↓
   electron-vite build (outputs to out/)
   ↓
   prisma generate (ensures fresh client)
   ↓
   
2. electron-builder runs
   ↓
   Bundles fresh out/ + fresh .prisma/client/
   ✅ Versions guaranteed to match
```

---

## Database Path Resolution

Your app can run in two modes:

### Development Mode
```typescript
process.env.NODE_ENV === 'development'
// Database: project_root/packages/robotcom-lims/prisma/dev.db
```

### Packaged Mode
```typescript
app.isPackaged === true
// Database: C:\Users\{User}\AppData\Local\{AppName}\database.db
// Or on macOS: ~/Library/Application Support/{AppName}/database.db
// Or on Linux: ~/.{AppName}/database.db
```

**Your .env file resolves:**
```env
DATABASE_URL="file:./prisma/dev.db"

# In dev: works (relative to pwd)
# In packaged: BREAKS (file system path)
```

**Solution:** Use app.getPath() in code:

```typescript
import { app } from 'electron'
import path from 'path'

export function getDatabasePath() {
  if (app.isPackaged) {
    // Packaged: use user data directory
    return path.join(app.getPath('userData'), 'database.db')
  } else {
    // Development: use project directory
    return path.join(process.cwd(), 'packages/robotcom-lims/prisma/dev.db')
  }
}

// In PrismaClient initialization:
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${getDatabasePath()}`
    }
  }
})
```

---

## Platform-Specific Engine Binaries

Prisma ships platform-specific query engines:

### Windows x64 (Your Target)
```
libquery_engine-windows.dll.node
- Size: ~80 MB
- Format: PE 64-bit DLL
- Can ONLY run on Windows x64
```

### macOS
```
libquery_engine-darwin.dylib.node      # Intel Macs
libquery_engine-darwin-arm64.dylib.node # Apple Silicon
- Size: ~70 MB each
- Format: Mach-O binary
```

### Linux
```
libquery_engine-debian-openssl-1.1.x.so.node    # Debian/Ubuntu
libquery_engine-centos-openssl-1.0.x.so.node    # CentOS/RHEL
- Format: ELF binary
```

### Build Implications
- If building on Windows: gets Windows binary
- If building on macOS: gets macOS binary
- If building on Linux (WSL2): gets Linux binary ❌

**For Windows installer, you MUST:**
```bash
# On actual Windows OR
docker run --rm -v $(pwd):/workspace node:18-windows
# OR
wsl --exec pnpm run package:win  # WSL can build for Windows
```

---

## Debugging Module Loading

### Add Logging to Track Module Resolution

```typescript
// src/main/index.ts

import { PrismaClient } from '@prisma/client'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

console.log('=== Prisma Debug Info ===')
try {
  const prismaPath = require.resolve('@prisma/client')
  console.log('✅ @prisma/client resolved to:', prismaPath)
} catch (error) {
  console.error('❌ @prisma/client not found:', error.message)
}

try {
  const enginePath = require.resolve('@prisma/client/runtime')
  console.log('✅ Engine runtime at:', enginePath)
} catch (error) {
  console.error('❌ Engine runtime not found:', error.message)
}

try {
  const schemaPath = require.resolve('.prisma/client')
  console.log('✅ .prisma/client at:', schemaPath)
} catch (error) {
  console.error('❌ .prisma/client not found:', error.message)
}

// Check file system
import fs from 'fs'
const nodeModules = path.join(process.resourcesPath, 'app/node_modules')
const prismaDir = path.join(nodeModules, '@prisma/client')

console.log('\n=== File System Check ===')
console.log('Node modules path:', nodeModules)
console.log('@prisma/client exists?', fs.existsSync(prismaDir))
console.log('Contents:', fs.readdirSync(prismaDir).slice(0, 10))

const engineDir = path.join(nodeModules, '.prisma/client')
console.log('\n.prisma/client exists?', fs.existsSync(engineDir))
console.log('Contents:', fs.readdirSync(engineDir).slice(0, 10))
```

### Output Analysis
```
✅ All paths resolve → Configuration is correct
❌ One or more fails → Check electron-builder files array

Missing .prisma/client → Not included in bundled files
Missing @prisma/client → Version mismatch or corrupted install
```

---

## Size Optimization

The full install will be ~200-300 MB due to:
- Electron framework: ~150 MB
- Prisma + dependencies: ~100 MB
- Your app code: ~10 MB
- Native modules (bcrypt, sqlite3): ~20 MB

**To reduce installer size:**

1. **Use NSIS compression**
```json
{
  "nsis": {
    "compressionLevel": 9
  }
}
```

2. **Exclude unnecessary dev dependencies**
```json
{
  "pnpm": {
    "onlyBuiltDependencies": [
      "bcrypt",
      "sqlite3",
      "prisma"
    ]
  }
}
```

3. **Use portable target instead of NSIS** (already in your config)
```json
{
  "target": ["portable"]  // Single executable, no installer overhead
}
```

---

## Troubleshooting Decision Tree

```
Error: "Cannot find module 'prisma/client/default'"
│
├─ App works in development?
│  ├─ YES → Module resolution issue in packaged app
│  │    └─ Check: electron-builder files array includes .prisma/client?
│  │        └─ Add asarUnpack if using ASAR
│  │
│  └─ NO → Prisma not installed correctly
│       └─ Run: pnpm install && prisma generate
│
├─ .prisma/client directory exists?
│  ├─ NO → Prisma never generated
│  │    └─ Run: pnpm prisma generate
│  │
│  └─ YES → Check permissions / version
│       └─ Verify: npm ls @prisma/client
│
├─ Engine binary for your platform?
│  ├─ NO → Built on wrong OS
│  │    └─ Rebuild on correct platform or use docker
│  │
│  └─ YES → Binary in packaged app?
│       └─ Verify in dist/app/node_modules/.prisma/client/
│
└─ ASAR unpacking enabled?
   ├─ NO → Enable asarUnpack in electron-builder.json
   │
   └─ YES → Check file locations in packaged app
        └─ ls /path/to/app.asar.unpacked/node_modules/.prisma/client/
```

---

## Real-World Example: Your Configuration

### Your Current Setup
```
prisma/
├── schema.prisma              ← Defines database structure
└── dev.db                     ← SQLite database file

src/main/
├── index.ts                   ← Imports PrismaClient
└── services/
    └── *.ts                   ← Use prisma instance

src/generated/
└── prisma-client/             ← Custom output location
    ├── index.js
    └── runtime/
```

### After Applying Fix
```
Out (compiled)
├── main/
└── preload/

dist/app.asar (ASAR archive)
├── out/
└── node_modules/ (most things)

dist/app.asar.unpacked/ (EXTRACTED)
└── node_modules/
    ├── @prisma/client/       ← Extracted (can execute)
    └── .prisma/client/       ← Extracted (can execute)
        └── libquery_engine-windows.dll.node ← EXECUTES HERE

Release/
└── RobotComLab-Setup-1.0.0.exe
```

### Initialization Flow
```
User runs RobotComLab-Setup-1.0.0.exe
  ↓
Extracts to: C:\Program Files\RobotComLab\
  ↓
Launches main process (out/main/index.js)
  ↓
Requires @prisma/client
  ↓
Node.js loads from: app.asar.unpacked/node_modules/@prisma/client/
  ↓
Loads engine from: app.asar.unpacked/node_modules/.prisma/client/libquery_engine-windows.dll.node
  ↓
Connects to database at: C:\Users\{User}\AppData\Local\RobotComLab\database.db
  ↓
✅ App runs successfully
```

---

## References & Documentation

### Official Guides
1. **Prisma SQLite Guide**
   - https://www.prisma.io/docs/orm/overview/databases/sqlite

2. **Prisma Troubleshooting**
   - https://www.prisma.io/docs/orm/reference/error-reference

3. **electron-builder Configuration**
   - https://www.electron.build/configuration/configuration

4. **Electron Native Modules**
   - https://www.electronjs.org/docs/tutorial/using-native-node-modules

### Related Issues
- Prisma + Electron in monorepo requires careful output configuration
- ASAR unpacking necessary for all native modules (bcrypt, sqlite3, prisma)
- Database file paths differ between dev and production

