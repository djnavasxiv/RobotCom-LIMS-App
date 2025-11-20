# RobotComLab Installation Wizard

## What the Installer Includes

When users run `RobotComLab-Setup-1.0.0.exe`, they'll see a professional 5-step installation wizard:

### Step 1: Welcome Screen
- Welcome message
- Product name and version
- "Next" button to continue
- Option to read release notes

### Step 2: License Agreement
- Full software license
- Accept/Decline options
- Must accept to continue

### Step 3: Installation Directory
- Default: `C:\Program Files\RobotComLab`
- Users can choose custom directory
- Browse button to select folder
- Shows required disk space

### Step 4: Start Menu Shortcuts
- Choose Start Menu folder name
- Default: "RobotComLab"
- Option to skip Start Menu creation
- Users can customize location

### Step 5: Install Files
- Progress bar showing installation status
- File-by-file extraction and setup
- Real-time progress updates
- Handles errors gracefully

### Step 6: Finish Screen
- "Installation Complete" message
- Option to launch app immediately
- Show README/release notes option
- "Finish" button to close wizard

## What Gets Installed

After completing the wizard, users will have:

✅ **Program Files**
```
C:\Program Files\RobotComLab\
├── RobotComLab.exe (main application)
├── resources\
│   └── icon.png
├── node_modules\ (all dependencies)
└── other required files
```

✅ **Start Menu Shortcuts**
```
Start Menu\
├── RobotComLab (launches app)
└── Uninstall (removes app)
```

✅ **Desktop Shortcut**
```
Desktop\
└── RobotComLab (launches app)
```

✅ **Windows Registry Entries**
- App info for Control Panel > Programs and Features
- Uninstall information
- File associations

## Uninstallation

Users can uninstall by:

1. **From Start Menu:**
   - Start > RobotComLab > Uninstall

2. **From Control Panel:**
   - Control Panel > Programs > Programs and Features
   - Select "RobotComLab"
   - Click "Uninstall"

3. **From Desktop:**
   - Right-click on desktop shortcut and delete (shortcut only, not app)
   - Then use Control Panel method above

### Uninstall Wizard
The uninstaller also shows a wizard:
- "Are you sure?" confirmation
- Files are removed from disk
- Registry entries are cleaned up
- Windows is notified of removal
- Option to keep user data (database)

## Customization Options

### For Developers

Edit `package.json` under the `"nsis"` section to customize:

```json
"nsis": {
  "oneClick": false,                    // Multi-step wizard (not one-click)
  "allowToChangeInstallationDirectory": true,  // Let users choose install folder
  "createDesktopShortcut": true,        // Auto-create desktop shortcut
  "createStartMenuShortcut": true,      // Auto-create Start Menu folder
  "shortcutName": "RobotComLab",        // Shortcut label
  "installerIcon": "resources/icon.png", // Icon in installer
  "installerHeaderIcon": "resources/icon.png", // Header icon
  "language": ["en_US"],                // Languages
  "differentialPackage": true,          // Enable smart updates
  "deleteAppDataOnUninstall": false     // Keep database on uninstall
}
```

### Professional Touches

The installer includes:
✓ Branded icon and images
✓ Multi-language support (add languages to config)
✓ Progress indicators
✓ Error handling and rollback
✓ Registry integration
✓ Start Menu organization
✓ Desktop shortcuts
✓ Professional wizard UI
✓ Windows SmartScreen compatible
✓ 64-bit Windows support

## First Run Experience

After installation, when users launch RobotComLab:

1. App opens to login screen
2. Administrator creates user accounts
3. Users log in with credentials
4. App is ready to use
5. Database is stored in `%APPDATA%\RobotComLab\`

## System Requirements Displayed

The installer will verify:
- Windows 7 SP1 or later (64-bit)
- 4 GB RAM minimum
- 500 MB free disk space
- .NET Framework 4.5+ (usually pre-installed)

## Tips for End Users

### Before Installation
- Close all programs
- Ensure 500 MB free space
- Administrator account required

### During Installation
- Don't interrupt the process
- Wait for all files to copy
- Allow Windows to add to registry

### After Installation
- Shortcuts appear automatically
- Database created on first run
- Configure in Settings menu
- Create user accounts in Admin panel

## Troubleshooting

If users encounter issues during installation:

1. **"Access Denied"** → Run as Administrator
2. **"Disk Full"** → Free up space, retry
3. **"Windows Protected Your PC"** → Click "Run Anyway"
4. **"Installation Failed"** → Retry or contact support

## Building New Versions

To create a new installer version:

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. From Windows PowerShell:
   ```powershell
   wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && ./build-installer.sh"
   ```

3. New installer created at:
   ```
   release\RobotComLab-Setup-1.0.1.exe
   ```

4. Share with users via email or download page

## Distribution

### For Email Distribution
- Attach `RobotComLab-Setup-1.0.0.exe` (100-200 MB)
- Include installation instructions
- Mention system requirements

### For Web Download
- Host file on web server
- Include version number in filename
- Provide checksum for verification
- Add release notes

### For Network Deployment
- Copy to network share: `\\server\software\RobotComLab\`
- Create installation script for IT
- Document in deployment guide

---

The installation wizard provides a professional, user-friendly experience that looks like a native Windows application.
