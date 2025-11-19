# Running RobotComLab LIMS on WSL2

## Current Situation

You're running on **WSL2 (Windows Subsystem for Linux 2)** as detected from your system.

WSL2 doesn't have a built-in display server, so Electron cannot open a window without additional setup.

---

## Option 1: Use Web Browser (Recommended) ⭐

**Simplest and fastest solution** - no additional setup needed:

```bash
npm run dev:web
```

Then open in your Windows browser: **http://localhost:5173/**

**Advantages:**
- ✅ No additional software needed
- ✅ Works immediately
- ✅ Full feature access
- ✅ Great for development
- ✅ No display server required

---

## Option 2: Install X Server on Windows (Advanced)

If you specifically need the Electron desktop window:

### Step 1: Install X Server on Windows

Download and install one of:
- **VcXsrv** (Recommended) - [GitHub](https://github.com/ArcticaProject/VcXsrv-Windows)
- **Xming** - [sourceforge](https://sourceforge.net/projects/xming/)

### Step 2: Start X Server on Windows

**For VcXsrv:**
1. Launch VcXsrv
2. Configure with default settings
3. Leave it running

**For Xming:**
1. Launch Xming
2. Leave it running in taskbar

### Step 3: Set DISPLAY in WSL2

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# WSL2 X server connection
export DISPLAY=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}'):0
export LIBGL_ALWAYS_INDIRECT=1
```

Then:
```bash
source ~/.bashrc  # or ~/.zshrc
```

### Step 4: Run Electron App

```bash
npm run dev:app
```

The Electron window should open on your Windows display!

---

## Option 3: Use Remote SSH X11 Forwarding

If accessing from a remote machine:

```bash
ssh -X user@wsl-host
npm run dev:app
```

---

## Troubleshooting WSL2 + X Server

### "Cannot connect to display"

**Solution:**
```bash
# Verify DISPLAY is set
echo $DISPLAY

# Should show something like: 10.255.255.254:0
```

### "X server not running on Windows"

**Solution:**
- Start VcXsrv or Xming on Windows first
- Make sure it's running before trying to launch the app

### "Connection refused"

**Solution:**
- X server on Windows may need to allow connections from WSL2
- Check X server firewall settings
- Try restarting the X server

### "DISPLAY is empty"

**Solution:**
```bash
# Manually set it
export DISPLAY=$(grep -m 1 nameserver /etc/resolv.conf | awk '{print $2}'):0

# Then try again
npm run dev:app
```

---

## My Recommendation

**For WSL2 Development, use:**

```bash
npm run dev:web
```

- ✅ Works immediately, no setup
- ✅ Full feature access
- ✅ Perfect for development
- ✅ Open in Windows browser: `http://localhost:5173/`
- ✅ No compatibility issues

---

## All Available Commands

```bash
# Web Version (WSL2 Recommended) ⭐
npm run dev:web
# Access at: http://localhost:5173/

# Electron App (requires X server on Windows)
npm run dev:app

# Headless Electron Backend
npm run dev:app:headless

# Production Build
npm run build:app
```

---

## WSL2 Information

Your current WSL2 setup:
- User: `djnavasv`
- Host Gateway IP: `10.255.255.254`
- Windows Host Connection: X server must listen on `10.255.255.254:0`

---

## Next Steps

### Immediate: Use Web Version ✅
```bash
npm run dev:web
# Open: http://localhost:5173/
```

### Optional: Set up X Server
1. Install VcXsrv on Windows
2. Add DISPLAY export to ~/.bashrc
3. Run `npm run dev:app`

---

**Recommended:** Start with `npm run dev:web` - it gives you full app access immediately without any additional setup!

---

**Last Updated:** November 18, 2025  
**Environment:** WSL2
