# Headless Development Guide

## Overview

RobotComLab LIMS can be run in **headless mode** - without a GUI window. This is useful for:
- Remote development (SSH sessions)
- CI/CD pipelines
- Server environments without X11/Wayland
- Running multiple instances
- Terminal-based development workflows

---

## Two Headless Options

### Option 1: Browser-Only Dev Server (Recommended for Headless)

Access the app through a web browser instead of Electron window.

```bash
npm run dev:web
```

**Advantages:**
- No X11 required
- No Electron overhead
- Perfect for remote SSH development
- Can access from any machine on your network
- Access via: `http://localhost:5173`

**Access remotely via SSH:**
```bash
# From your local machine
ssh -L 5173:localhost:5173 user@remote-host
# Then visit: http://localhost:5173
```

---

### Option 2: Headless Electron (Skips Window Creation)

Electron runs in the background without creating a window.

```bash
npm run dev:app:headless
```

**Advantages:**
- Uses Electron backend
- API server still available
- Good for testing Electron features without UI
- Can still connect to web UI if needed

**Note:** Electron still requires some display configuration. This mode:
- Skips the window creation
- Runs the IPC/API server
- Disables hardware acceleration

---

## Quick Start Guide

### For Remote Development (SSH)

**Best approach:** Use the web dev server

```bash
# On remote server
npm run dev:web

# On your local machine  
ssh -L 5173:localhost:5173 user@remote-host
# Open browser: http://localhost:5173
```

### For Local Headless (No Display)

**Preferred method:** Use the web dev server

```bash
npm run dev:web
# Access via: http://localhost:5173
```

### For Docker/Container Environments

The web dev server works best in containers:

```dockerfile
FROM node:18

WORKDIR /app
COPY . .

RUN npm install
EXPOSE 5173

CMD ["npm", "run", "dev:web"]
```

Then access via: `http://container-ip:5173`

---

## Environment Variables

### For Headless Electron Mode

```bash
# Skip window creation
HEADLESS=1 npm run dev:app:headless

# Or use the script
npm run dev:app:headless
```

### For Web Dev Server

```bash
# Standard Vite env vars work
VITE_DEV_SERVER_URL=http://localhost:5173 npm run dev:web
```

---

## Troubleshooting

### "Can't connect to localhost:5173"

**If using SSH port forwarding:**
```bash
# Make sure you're using -L flag
ssh -L 5173:localhost:5173 user@host

# If still not working, try binding to all interfaces
npm run dev:web -- --host 0.0.0.0
```

### "App not responding"

- Check that the dev server is actually running
- Look for the "Local: http://localhost:5173" message
- Check your network/firewall settings

### "Electron window won't open"

- If you need the Electron window, you need X11 or Wayland
- Use the web dev server instead: `npm run dev:web`
- Or set up SSH X11 forwarding: `ssh -X user@host`

---

## Available Commands

```bash
# GUI Development (requires display)
npm run dev:app

# Headless Electron (no GUI window)
npm run dev:app:headless

# Web-only Dev Server (recommended for headless)
npm run dev:web

# Production Build
npm run build:app

# Website Development
npm run dev:web
```

---

## Feature Support by Mode

| Feature | GUI App | Headless App | Web Server |
|---------|---------|--------------|------------|
| Full UI | ✅ | ❌ | ✅ |
| Electron IPC | ✅ | ✅ | ❌ |
| Database Access | ✅ | ✅ | ✅ |
| Hot Reload | ✅ | ✅ | ✅ |
| Remote Access | ❌ | ❌ | ✅ |
| No X11 Required | ❌ | ❌ | ✅ |

---

## Performance Notes

### Headless Electron Mode
- Lower CPU usage without rendering UI
- Good for CI/CD testing
- Can still access IPC handlers
- Use for automated testing

### Web Server Mode
- Lightest weight
- Best for remote development
- No Electron overhead
- Fastest startup

### Full GUI Mode
- Full feature access
- Best for desktop development
- Requires display server
- More resource intensive

---

## Examples

### Example 1: Remote Development via SSH

```bash
# On remote server
ssh remote-server
cd RobotCom-LIMS-App
npm install
npm run dev:web

# On your local machine (in another terminal)
ssh -L 5173:localhost:5173 remote-server
# Open browser: http://localhost:5173
```

### Example 2: Docker Container

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev:web"]
```

Run with:
```bash
docker run -p 5173:5173 robotcom-lims
# Access: http://localhost:5173
```

### Example 3: CI/CD Pipeline

```yaml
# GitHub Actions example
- name: Install dependencies
  run: npm install

- name: Run Electron headless for tests
  run: npm run dev:app:headless &
  
- name: Wait and run tests
  run: sleep 3 && npm test
```

---

## When to Use Each Mode

- **`npm run dev:app`** - You have a display and want the native desktop app
- **`npm run dev:app:headless`** - Testing Electron features without UI, CI/CD pipelines
- **`npm run dev:web`** - Remote development, Docker, containers, no X11 available

---

## Related Documentation

- See `DEVELOPER_MODE_GUIDE.md` for developer mode authentication bypass
- See `ISSUES_FIXED_REPORT.md` for details on the fixes applied
- See `ANTI_PIRACY_GUIDE.md` for security features

---

**Last Updated:** November 18, 2025  
**Related Scripts:** `dev-server.js`, `dev-headless.sh`
