# Running RobotComLab LIMS Electron on Windows via WSL2

## What Was Fixed

The Electron app had a regression where it wouldn't launch at all. This was caused by code that attempted to detect "headless" mode and skip window creation. This broke Electron even when a display *should* have been available.

**Fix:** Reverted this problematic code (commit fd108f6). Now Electron will properly create and display windows when a valid X server is available.

## Current Status

❌ **Electron Version:** Requires X server on Windows (VcXsrv)  
`npm run dev` - Launches Electron app on Windows (requires setup below)

## Option 1: Run in Electron on Windows (Requires VcXsrv)

If you specifically need the Electron app running as a desktop window on your Windows desktop:

### Step 1: Install VcXsrv on Windows

1. Download VcXsrv from GitHub:
   - https://github.com/ArcticaProject/VcXsrv-Windows/releases
   - Download the latest `.exe` installer
   - Or run: `./install-vcxsrv.cmd` (batch file in root of this project)

2. Run the installer with default settings

3. After installation, find **XLaunch** in your Windows Start Menu

### Step 2: Configure WSL2 Environment

Run the setup script from Ubuntu terminal:

```bash
./setup-windows-electron.sh
```

This will:
- Add required environment variables to your ~/.bashrc
- Set DISPLAY to point to VcXsrv on Windows
- Configure Electron to work with WSL2

### Step 3: Start VcXsrv (Do This Every Session)

Before launching the app:

1. Open Windows Start Menu
2. Search for **XLaunch**
3. Click it to start VcXsrv
4. Use default settings, click through dialogs
5. Keep the XLaunch window open in background

The XLaunch window is small and usually just shows "VcXsrv: %display%"

### Step 4: Launch Electron App

From Ubuntu terminal:

```bash
cd packages/robotcom-lims
npm run dev
```

This will:
- Start the Electron app
- Display it as a window on your Windows desktop
- Open DevTools for development

You can close the terminal after the app launches - the app continues running.

## Troubleshooting

### "Missing X server or $DISPLAY"

This means VcXsrv is not running on Windows.

**Fix:**
1. Open Windows Start Menu
2. Search for **XLaunch**
3. Run it
4. Try `npm run dev` again

### DISPLAY variable issues

The setup script automatically configures this. If issues persist:

```bash
# Check your DISPLAY is set correctly
echo $DISPLAY

# Should show something like :0 or 10.x.x.x:0

# If blank, run the setup script again:
./setup-windows-electron.sh

# Then start a new terminal session for changes to take effect
```

### App window appears but is blank/black

This is usually a rendering issue. Try:

1. Close the app
2. Quit XLaunch on Windows
3. Start XLaunch again
4. Run `npm run dev` again

### "electron command not found"

Make sure you're in the right directory:

```bash
cd packages/robotcom-lims
npm run dev
```

## How It Works

- **WSL2**: This is Ubuntu running inside Windows as a lightweight VM
- **VcXsrv**: An X server running on Windows that accepts display connections
- **Electron**: The app running in Ubuntu sends its display to VcXsrv on Windows
- **Web version**: Bypass all of this and just use a browser

## Comparison

| Method | Setup | Performance | Features |
|--------|-------|-------------|----------|
| **Electron (npm run dev)** | VcXsrv install | Fast | All ✅ |

The app is built for Electron - this is the primary way to run it during development and in production.

## Development Tips

- You can rebuild the app without restarting:
  - Just save your code files
  - Vite detects changes and refreshes automatically
  - DevTools opens in Electron for debugging

- Keep XLaunch running in background while developing

- The web version (dev:web) requires no X server, only the terminal

- Build for distribution:
  ```bash
  npm run build
  npm run build:win  # Windows .exe installer
  ```

## Questions?

- Check the setup script: `./setup-windows-electron.sh`
- Check start scripts: `./start-electron.sh` (Linux) or `./start-app.cmd` (Windows)
- All scripts have detailed comments explaining what they do

## Next Steps

1. **Install VcXsrv:** Follow "Option 1" above starting with VcXsrv install
2. **Run setup script:** Execute `./setup-windows-electron.sh`
3. **Start VcXsrv:** Open Windows Start Menu, search for XLaunch, run it
4. **Launch app:** Run `npm run dev` from `packages/robotcom-lims/`

Once setup is complete, you can develop the app with hot-reload and DevTools.

---

**Last Updated:** November 2025  
**Build Status:** ✅ Clean (12,300 modules, 0 errors)  
**Tested On:** Ubuntu 20.04+ on WSL2 for Windows 10/11
