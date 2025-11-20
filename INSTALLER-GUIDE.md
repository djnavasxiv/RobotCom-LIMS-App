# RobotComLab Installer Guide

## Building the Installer

### Prerequisites
- Node.js 16+ and npm/pnpm installed
- On Windows: NSIS installer builder (included with electron-builder)
- Git for version control

### Quick Start - Windows

#### Option 1: Using Batch Script (Easiest)
```cmd
cd packages/robotcom-lims
build-installer.bat
```

#### Option 2: Manual Command
```cmd
cd packages/robotcom-lims
npm run prisma:generate
npm run build
npm run package:win
```

### Quick Start - macOS/Linux

#### Using Bash Script
```bash
cd packages/robotcom-lims
chmod +x build-installer.sh
./build-installer.sh
```

#### Manual Commands
```bash
cd packages/robotcom-lims
npm run prisma:generate
npm run build
npm run package:win
```

## Installer Outputs

After building, you'll find installers in: `packages/robotcom-lims/release/`

### Files Generated:
- **RobotComLab-Setup-1.0.0.exe** - Standard installer (recommended)
- **RobotComLab-1.0.0.exe** - Portable version (no installation needed)

## Distribution

### Sharing the Installer

1. **Via Email**
   - Attach the .exe file (typically 100-200 MB)
   - Include version number in email subject
   - Provide installation instructions below

2. **Via Cloud Storage**
   ```
   Google Drive: Recommended for reliability
   OneDrive: Good alternative
   Dropbox: Works well
   WeTransfer: For temporary sharing
   ```

3. **Via File Server**
   ```
   Create a shared network folder: \\server\software\robotcomlab\
   Keep multiple versions for rollback
   Maintain a changelog
   ```

4. **Via Website**
   ```
   Host on company website with:
   - Download button
   - Release notes
   - Changelog
   - System requirements
   ```

## Installation Instructions for End Users

### For IT Administrators

**System Requirements:**
- Windows 7 SP1 or later
- 4 GB RAM minimum (8 GB recommended)
- 500 MB disk space
- .NET Framework 4.5+ (usually pre-installed)
- SQLite3 (bundled with app)

**Network Requirements:**
- For database sync: Network connectivity optional
- For email notifications: Internet access required
- For updates: Internet access recommended

**Installation Steps:**
1. Download `RobotComLab-Setup-1.0.0.exe`
2. Right-click and select "Run as Administrator"
3. Click "Yes" on UAC prompt
4. Follow installer wizard:
   - Accept license agreement
   - Choose installation directory (default: `C:\Program Files\RobotComLab`)
   - Choose to create Desktop shortcut
   - Choose to create Start Menu shortcut
   - Click Install
5. Wait for installation to complete
6. Click Finish
7. App will launch automatically
8. Configure database and user accounts on first launch

**Alternative: Portable Version**
1. Download `RobotComLab-1.0.0.exe`
2. Copy to desired location (USB drive, network drive, etc.)
3. Run directly - no installation needed
4. Create shortcuts manually if desired

**Uninstallation:**
- Windows Settings > Apps > Apps & Features > RobotComLab > Uninstall
- Or: Control Panel > Programs > Programs and Features > RobotComLab > Remove
- Or: Run installer again and select "Uninstall"

### For Individual Users

**Quick Install:**
1. Download the installer
2. Double-click to install
3. Shortcuts appear on Desktop and Start Menu
4. Launch from Desktop shortcut

**First Launch:**
- App opens to login page
- Administrator creates initial user accounts
- Users can then log in and start using the app

## Version Management

### Versioning Scheme
```
Format: MAJOR.MINOR.PATCH
Example: 1.0.0

Rules:
- MAJOR: Breaking changes, new features
- MINOR: New features, non-breaking
- PATCH: Bug fixes, security patches
```

### Updating the Version
```bash
# In packages/robotcom-lims/package.json
{
  "version": "1.0.1"  // Update this
}
```

### Build New Version
```bash
# Update version in package.json
# Commit changes to git
git add package.json
git commit -m "Bump version to 1.0.1"
git tag v1.0.1

# Build installer
npm run prisma:generate
npm run build
npm run package:win

# Release notes should be added to changelog
```

## Installer Features

### What's Included:
✓ Application executable
✓ SQLite database engine
✓ All dependencies bundled
✓ Support for multiple users
✓ Automatic desktop shortcut
✓ Start Menu entry
✓ Uninstall program
✓ Auto-update framework ready

### Security Features:
✓ Code signing ready (requires certificate)
✓ User account isolation
✓ File permissions management
✓ Secure database encryption
✓ HTTPS support for web components

## Troubleshooting

### Installation Issues

**"Windows protected your PC"**
- This is a SmartScreen warning for unsigned apps
- Click "More info" then "Run anyway"
- To avoid: Sign installer with code certificate

**"Access denied" error**
- Try running as Administrator
- Check folder permissions
- Ensure C: drive has space

**"Missing .NET Framework"**
- Download from: https://www.microsoft.com/net/download
- Most Windows 10/11 have it pre-installed
- Ask IT to install if unavailable

### Runtime Issues

**App won't start**
1. Check Windows Event Viewer for errors
2. Try reinstalling
3. Delete %APPDATA%\RobotComLab and restart

**Database errors**
1. Ensure database file isn't corrupted
2. Backup and restore from backup
3. Contact support with error message

**No network access**
- Check firewall settings
- Ensure app has network permissions
- Check antivirus settings

## Admin Deployment

### Mass Deployment (Active Directory)

**Using Group Policy:**
1. Place installer on network share
2. Create Group Policy to run installer
3. Deploy to computers via GPO
4. Log off/on to trigger installation

**Using SCCM/Intune:**
1. Convert .exe to .msi format (optional)
2. Create deployment package
3. Deploy through SCCM/Intune
4. Track installation status

**Using Batch/PowerShell Script:**
```powershell
# Deploy installer to all computers
$installer = "\\server\share\RobotComLab-Setup-1.0.0.exe"
$arguments = "/S"  # Silent install
Start-Process -FilePath $installer -ArgumentList $arguments -Wait
```

### Silent Installation

**Command line:**
```cmd
RobotComLab-Setup-1.0.0.exe /S /D=C:\Program Files\RobotComLab
```

**Parameters:**
- `/S` - Silent mode (no prompts)
- `/D=` - Installation directory
- `/NCRC` - Skip CRC check (faster)

### Remote Installation

**Using PSExec:**
```cmd
psexec \\computername -u domain\admin -p password ^
  "\\server\share\RobotComLab-Setup-1.0.0.exe" /S
```

## Rollback Procedures

### Keeping Previous Versions

```bash
# After building installer
# Rename with version
mv release/RobotComLab-Setup-1.0.0.exe \
   archive/RobotComLab-Setup-1.0.0.exe

# Keep multiple versions
archive/
├── RobotComLab-Setup-0.9.5.exe
├── RobotComLab-Setup-1.0.0.exe
├── RobotComLab-Setup-1.0.1.exe
└── CHANGELOG.md
```

### Downgrade Instructions

1. Uninstall current version
2. Run previous version installer
3. Keep database (option during uninstall)
4. Restore from backup if needed

## Auto-Update Configuration

The app is configured for auto-updates. To enable:

1. Set up update server (S3, GitHub Releases, etc.)
2. Update URL in `package.json`:
```json
"publish": [{
  "provider": "generic",
  "url": "https://your-update-server.com"
}]
```

3. Upload release notes as `latest.yml`:
```yaml
version: 1.0.1
files:
  - url: RobotComLab-Setup-1.0.1.exe
    size: 125000000
    sha512: abc123...
releaseDate: '2024-01-15'
```

## Support & Troubleshooting

### Getting Help
- Check logs in: `%APPDATA%\RobotComLab\logs\`
- Review error messages carefully
- Provide detailed system info:
  - Windows version
  - App version
  - Steps to reproduce
  - Screenshot if applicable

### Reporting Issues
Include in bug report:
1. Error message (exact text)
2. Error code if shown
3. Windows version
4. App version
5. What you were doing
6. Steps to reproduce
7. Log files (if available)

## Advanced Configuration

### Database Location
```
Default: %APPDATA%\RobotComLab\data.db
Custom: Edit config file after installation
```

### Settings File
```
Location: %APPDATA%\RobotComLab\config.json
Edit to customize:
- Theme preferences
- Default values
- UI settings
```

### Environment Variables
```
ROBOTCOM_DB_PATH - Custom database path
ROBOTCOM_LOG_LEVEL - Logging verbosity
ROBOTCOM_OFFLINE_MODE - Disable network features
```

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Created by:** RobotComLab Team
