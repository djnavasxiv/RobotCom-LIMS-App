# Building the Windows Installer on Windows

Because you're using WSL, the Electron Builder tools require Windows tooling (Wine) to properly build .exe files. The easiest solution is to build on Windows PowerShell directly.

## Solution 1: Build on Windows PowerShell (Recommended)

### Prerequisites
- Windows 10/11
- Node.js 16+ and pnpm
- PowerShell (built-in)

### Steps

1. **Open Windows PowerShell** (not WSL)
   - Press `Win + X` and select "Windows PowerShell (Admin)"
   - Or search for "PowerShell" in Start Menu

2. **Navigate to project folder**
   ```powershell
   cd C:\path\to\RobotCom-LIMS-App\packages\robotcom-lims
   # For example:
   cd "C:\Users\YourUsername\RobotCom-LIMS-App\packages\robotcom-lims"
   ```

3. **Run the build script**
   ```powershell
   .\build-installer.bat
   ```

4. **Wait for completion** (5-10 minutes)

5. **Find your installer**
   ```
   release\RobotComLab-Setup-1.0.0.exe
   release\RobotComLab-1.0.0.exe (portable)
   ```

## Solution 2: Install Wine in WSL (Advanced)

If you prefer to stay in WSL, install Wine:

```bash
sudo apt update
sudo apt install wine wine32 wine64 -y
cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims
./build-installer.sh
```

This is more complex and slower than Solution 1.

## What's the Issue?

Electron Builder creates Windows .exe files using special Windows build tools. When running on Linux (even via WSL), it requires Wine (a Windows compatibility layer) which can be complicated to set up.

Building directly on Windows PowerShell uses native Windows APIs and is much faster and simpler.

## Next Steps After Building

1. Locate the .exe files in `release/` folder
2. Share `RobotComLab-Setup-1.0.0.exe` with your team
3. Users can run it to install the app
4. For portable version, just share `RobotComLab-1.0.0.exe`

See `INSTALLER-GUIDE.md` for distribution and installation instructions.
