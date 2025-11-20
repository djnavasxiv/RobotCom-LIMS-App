# Quick Installer Build Guide

## TL;DR - Build Installer in 2 Minutes

### Windows (Easiest)
```bash
cd packages/robotcom-lims
build-installer.bat
```
✓ Installers will be in `release/` folder
✓ Share the `.exe` file with users

### macOS/Linux
```bash
cd packages/robotcom-lims
chmod +x build-installer.sh
./build-installer.sh
```
✓ Installers will be in `release/` folder

### Manual Build (All Platforms)
```bash
cd packages/robotcom-lims
npm run prisma:generate
npm run build
npm run package:win
```

---

## After Building

### Files Created:
```
release/
├── RobotComLab-Setup-1.0.0.exe  ← Standard Installer (Choose this!)
├── RobotComLab-1.0.0.exe        ← Portable (No install needed)
└── builder-effective-config.yaml
```

### Share the Installer:
1. **Email:** Attach `RobotComLab-Setup-1.0.0.exe`
2. **Cloud:** Upload to Google Drive, OneDrive, or Dropbox
3. **Network:** Copy to shared network folder

---

## What Users Do

1. Download the `.exe` file
2. Double-click to install
3. Click "Yes" on Windows warning
4. Follow the installer steps
5. App launches automatically
6. Done! ✓

---

## Features

✓ Native Windows app (no "Electron" visible)
✓ Desktop shortcut created
✓ Start Menu entry added
✓ Can uninstall via Control Panel
✓ Portable version available
✓ User profile shown in app corner

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Windows says "App unsafe" | Click "More info" → "Run anyway" |
| Installation takes forever | Check disk space (need 500MB+) |
| App won't start | Run installer again, choose Repair |
| Can't find installer | Check `packages/robotcom-lims/release/` |

---

## Version Updates

To build a new version:

1. Update `package.json` version: `"version": "1.0.1"`
2. Commit: `git commit -am "Bump to 1.0.1"`
3. Run: `build-installer.bat` (or `.sh`)
4. New installer created with new version

---

**Next Step:** Build installer and test installation!

```bash
cd packages/robotcom-lims
build-installer.bat
```

Then run the generated `.exe` to test.
