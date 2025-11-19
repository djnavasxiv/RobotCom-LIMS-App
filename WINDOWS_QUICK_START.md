# Windows Quick Start Guide

## Overview

RobotComLab LIMS can be run in two ways on Windows:

1. **Desktop Application** (Recommended) - Full native Windows app with Electron
2. **Web Browser** - Access through your web browser

---

## Prerequisites

**Required:**
- Windows 10 or later
- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)

**Verify Installation:**
```cmd
node --version
npm --version
```

---

## Quick Start - Desktop App

### Option 1: Double-Click (Easiest)

1. Navigate to the project folder
2. Double-click **`start-app.cmd`**
3. Wait for the application to launch
4. The RobotComLab LIMS window will open automatically

**That's it!** The app will:
- Check for dependencies
- Install them if needed
- Launch the Electron desktop application
- Show the login screen

### Option 2: Command Line

```cmd
npm run dev:app
```

---

## Quick Start - Web Version

### Option 1: Double-Click (Easiest)

1. Navigate to the project folder
2. Double-click **`start-web.cmd`**
3. A command window will open showing:
   ```
   ➜ Local: http://localhost:5173/
   ```
4. Open your web browser and go to: **http://localhost:5173/**

### Option 2: Command Line

```cmd
npm run dev:web
```

Then open your browser to: **http://localhost:5173/**

---

## Application Features

Both versions include:
- ✅ Patient management
- ✅ Sample tracking
- ✅ Lab test modules (V. BACTER, V. HECES, V. HEMATIC, etc.)
- ✅ Result entry system
- ✅ Invoice generation
- ✅ Dashboard with analytics
- ✅ Database integration with Prisma

---

## Usage Guide

### After Launching

#### Login Screen
- The app requires login
- Default test credentials will work (see database setup)
- In development mode, license checks are bypassed

#### Main Dashboard
- Click menu items to navigate
- "PANEL DE CONTROL" - View dashboard
- "MUESTRAS" - Sample management
- "RESULTADOS" - Enter test results
- "FACTURAS" - Invoice management

#### Test Modules
Four main test module categories:
1. **V. BACTER** - Bacteriology tests
2. **V. HECES** - Stool analysis
3. **V. HEMATIC** - Hematology tests
4. **Other tests** - Chemistry, Serology, etc.

---

## Command Reference

### Run Desktop App (Electron)
```cmd
npm run dev:app
```
- Opens native Windows application
- Full feature access
- Best for production use

### Run Web Server
```cmd
npm run dev:web
```
- Browser-based interface
- Access at http://localhost:5173/
- Lightweight, good for testing

### Run Headless Backend
```cmd
npm run dev:app:headless
```
- Electron backend without UI window
- Good for server testing

### Build for Production
```cmd
npm run build:app
```
- Creates production build
- Output in `out/` directory
- Ready for distribution

---

## Troubleshooting

### "Node.js is not installed"
**Solution:** Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Choose the LTS version
- Add to PATH during installation
- Restart your terminal

### "Port 5173 is already in use"
**Solution:** Kill the existing process or use a different port
```cmd
# Option 1: Kill the existing process
taskkill /F /IM node.exe

# Option 2: The app will automatically try 5174, 5175, etc.
```

### "npm: command not found"
**Solution:** npm comes with Node.js
- Reinstall Node.js
- Make sure PATH is configured correctly
- Restart your terminal after installation

### "Cannot find module" errors
**Solution:** Install dependencies
```cmd
npm install
```

### Application crashes on startup
**Solution:** Clear cache and reinstall
```cmd
# Delete cache and build artifacts
rmdir /s /q node_modules
rmdir /s /q out

# Reinstall
npm install
npm run build:app

# Then run
npm run dev:app
```

---

## Development Workflow

### File Structure
```
RobotCom-LIMS-App/
├── packages/
│   ├── robotcom-lims/          # Main Electron app
│   │   ├── src/
│   │   │   ├── main/           # Electron main process
│   │   │   ├── preload/        # Preload scripts
│   │   │   └── renderer/       # React UI
│   │   └── prisma/             # Database
│   └── website/                # Marketing website
├── start-app.cmd               # Launch desktop app
├── start-web.cmd               # Launch web server
└── package.json                # Dependencies

```

### Edit Source Code
1. Source files are in `packages/robotcom-lims/src/`
2. Changes auto-reload in running app
3. Modify:
   - **UI**: `src/renderer/src/App.tsx`
   - **Backend**: `src/main/index.ts`
   - **Database**: `prisma/schema.prisma`

### Database
- SQLite database stored locally
- Schema in `prisma/schema.prisma`
- Run migrations: `npm run prisma:migrate`
- View data: `npm run prisma:studio`

---

## Production Build

### Create Production Build
```cmd
npm run build:app
```

### What Gets Created
- `out/main/index.js` - Electron main process
- `out/renderer/` - Web assets
- `out/preload/index.js` - Security preload script

### Distribution
To distribute the app:
1. Run `npm run build:app`
2. Use electron-builder: `npm run package:win`
3. Creates Windows installer (.exe)
4. Distribute to users

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `F12` | Open DevTools (in dev mode) |
| `Ctrl+R` | Reload application |
| `Ctrl+Shift+I` | Developer Tools |
| `Alt+F4` | Close application |

---

## Environment Variables

If you need to configure the app:

**Set environment variable (Windows):**
```cmd
set NODE_ENV=development
npm run dev:app
```

**Common Variables:**
- `NODE_ENV` - Set to `development` or `production`
- `DISPLAY` - Not needed on Windows
- `HEADLESS` - Set to `1` for headless mode

---

## Support & Documentation

For more information, see:
- `DEVELOPER_MODE_GUIDE.md` - Developer features
- `HEADLESS_DEVELOPMENT.md` - Advanced configurations
- `ISSUES_FIXED_REPORT.md` - Technical details
- `ANTI_PIRACY_GUIDE.md` - Security features

---

## Notes

- The application uses SQLite database (file-based)
- Database file is created automatically on first run
- All data is stored locally
- Network features available for remote access

---

**Last Updated:** November 18, 2025
**Version:** Development
**Status:** Ready for Windows Installation
