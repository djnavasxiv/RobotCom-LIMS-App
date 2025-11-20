# ⚠️  Building Windows Installer on WSL

## The Problem

Creating a Windows .exe installer from WSL requires **Wine** (Windows compatibility layer), which:
- Has conflicting package dependencies on Ubuntu 24.04
- Is complex to install and configure properly
- Is much slower than native Windows builds

## The Solution: Build on Windows

You MUST build the Windows installer on **actual Windows**, not from WSL.

###  Step 1: Open Windows PowerShell

- Press `Win + X`
- Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
- Or search for "PowerShell" in Start Menu

### Step 2: Run the Build Command

```powershell
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && npm install && npm run build && npm run package:win"
```

This command:
- Launches WSL from PowerShell
- Runs the full build pipeline
- Creates the Windows installer `.exe` file
- Returns to PowerShell when complete

**Duration:** ~10-15 minutes depending on system speed

### Step 3: Find Your Installer

After the build completes successfully, your files are in:

```
\\wsl.localhost\Ubuntu-24.04\home\djnavasv\RobotCom-LIMS-App\packages\robotcom-lims\release\
```

Files created:
- `RobotComLab-Setup-1.0.0.exe` - **Standard installer** (recommended) (~130 MB)
- `RobotComLab-1.0.0.exe` - **Portable version** (~130 MB, no install needed)

### Step 4: Share the Installer

Copy the `.exe` file and share with your team:
- Via email attachment
- Via cloud storage (Google Drive, OneDrive, Dropbox)
- Via network file server
- Via download page on your website

Users can then run the installer to install RobotComLab!

## Why This Limitation Exists

- **NSIS** (the installer builder) is Windows-only technology
- On Linux, it requires **Wine** to emulate Windows
- Wine on Ubuntu 24.04 has 32-bit compatibility issues
- The cleanest solution is to build on native Windows

## Alternative (Not Recommended)

If you absolutely must build from WSL, you could:
1. Install Wine 64-bit only (multilib=false)
2. Configure NSIS to work with Wine 64-bit
3. Accept slower build times

This is complex and error-prone - **building on Windows is much simpler**.

---

**TL;DR:** Open PowerShell on Windows, run the WSL build command, get your .exe file!
