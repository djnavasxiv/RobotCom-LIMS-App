# Building Windows Installer with Docker

The proper way to build Windows installers on Linux is to use Docker with the `electronuserland/builder:wine` image, which provides a complete Windows build environment with Wine pre-configured.

## Prerequisites

You need **Docker** installed and running:

### Option 1: Docker Desktop for Windows (Recommended)
- **Download:** https://www.docker.com/products/docker-desktop
- Includes WSL2 integration
- Works seamlessly with your WSL Ubuntu installation
- Takes ~10 minutes to install

### Option 2: Docker in WSL
- Already have WSL? Install Docker in Ubuntu:
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  sudo usermod -aG docker $USER
  newgrp docker
  ```

## Building the Installer

### From WSL Bash:
```bash
cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims
chmod +x build-with-docker.sh
./build-with-docker.sh
```

### From Windows PowerShell:
```powershell
wsl -e bash -c "cd /home/djnavasv/RobotCom-LIMS-App/packages/robotcom-lims && chmod +x build-with-docker.sh && ./build-with-docker.sh"
```

### Or run the PowerShell script directly:
```powershell
powershell -ExecutionPolicy Bypass -File "\\wsl.localhost\Ubuntu-24.04\home\djnavasv\RobotCom-LIMS-App\packages\robotcom-lims\build-with-docker.ps1"
```

## What Happens

1. **Docker Container Starts** - electronuserland/builder:wine image downloads (~1.5 GB first time)
2. **Dependencies Install** - pnpm installs all Node.js dependencies
3. **App Builds** - Electron-vite builds the React app and Electron main process
4. **Installer Creates** - NSIS uses Wine to create the Windows .exe installer
5. **Container Stops** - Docker cleans up automatically

**Total Time:** 15-30 minutes (first run slower due to Docker image download)

## Output Files

After successful build, you'll have:

```
release/
├── RobotComLab-Setup-1.0.0.exe     (Standard installer with wizard) ✅
├── RobotComLab-1.0.0.exe           (Portable version)
└── builder-effective-config.yaml   (Build configuration)
```

## Sharing the Installer

Copy the `.exe` files and share with your team:

**Via Email:**
- Attach `RobotComLab-Setup-1.0.0.exe`
- Include installation instructions from INSTALLER-WIZARD.md

**Via Cloud Storage:**
- Google Drive
- OneDrive
- Dropbox

**Via File Server:**
```
\\server\software\RobotComLab\RobotComLab-Setup-1.0.0.exe
```

**Via Website:**
- Host on company intranet or public download page
- Include version number and release notes

## Troubleshooting

### Docker not found
```
❌ Docker is not available in WSL!
```
**Solution:** Install Docker Desktop for Windows or Docker in WSL (see Prerequisites above)

### Out of disk space
```
❌ Docker: no space left on device
```
**Solution:** Free up ~5 GB and try again

### Build timeout
- Docker image is large (~1.5 GB)
- First build takes longer
- Subsequent builds are faster (image cached)

### Wine cache issues
```bash
rm -rf ~/.cache/electron-builder/wine
./build-with-docker.sh
```

## How It Works

The Docker build process:

1. **Mounts** your project into the Docker container
2. **Installs** Node.js dependencies in the container
3. **Builds** the Electron app
4. **Uses Wine** inside the container to run NSIS (Windows installer creator)
5. **Outputs** the .exe files to your host machine

This is the same method used by electron-builder's official CI/CD pipelines (Travis CI, GitHub Actions, etc.)

## Caching for Faster Rebuilds

Docker caches:
- `~/.cache/electron/` - Downloaded Electron binaries
- `~/.cache/electron-builder/` - Build tools (NSIS, etc.)

These are reused on subsequent builds, making rebuilds much faster (~5-10 minutes).

## Building New Versions

To build a new version:

1. Update version in `package.json`:
   ```json
   "version": "1.0.1"
   ```

2. Commit changes:
   ```bash
   git add package.json
   git commit -m "Bump version to 1.0.1"
   ```

3. Build the installer:
   ```bash
   ./build-with-docker.sh
   ```

4. New files:
   ```
   release/RobotComLab-Setup-1.0.1.exe
   release/RobotComLab-1.0.1.exe
   ```

## Advanced: Building without Docker

If you absolutely cannot use Docker, you have two options:

1. **Build on macOS** - electron-builder doesn't need Wine on macOS
2. **Build on Windows** - native Windows tools, no Wine needed

But Docker is the most reliable and reproducible approach.

---

**Next Steps:**
1. Install Docker if you haven't already
2. Run the build script
3. Share the .exe files with your team
4. Update version and rebuild for new releases
