# Deployment Guide

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended)
- **Database**: SQLite 3.0+
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

## Environment Setup

### Development Environment

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/RobotCom-LIMS-App.git
cd RobotCom-LIMS-App
```

2. **Install Dependencies**
```bash
npm install -g pnpm
pnpm install
```

3. **Configure Environment**
```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

4. **Database Setup**
```bash
cd packages/robotcom-lims
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

5. **Start Development Server**
```bash
npm run dev
```

### Production Environment

1. **Install Production Dependencies**
```bash
pnpm install --production
```

2. **Build Application**
```bash
npm run build
```

3. **Verify Build**
```bash
ls -la out/
# out/main/index.js - Electron main process
# out/preload/index.js - Preload script
# out/renderer/ - React application
```

## Installation

### Windows

1. **Download Installer**
   - Download `robotcom-lims-1.0.0.exe` from releases

2. **Run Installer**
   - Double-click the `.exe` file
   - Follow installation wizard
   - Choose installation directory
   - Create desktop shortcut (optional)

3. **Configure on First Launch**
   - Set up database location
   - Create admin account
   - Configure lab details

### macOS

1. **Download DMG**
   - Download `robotcom-lims-1.0.0.dmg` from releases

2. **Mount and Install**
   ```bash
   hdiutil mount robotcom-lims-1.0.0.dmg
   cp -r /Volumes/RobotComLab/RobotComLab.app /Applications/
   hdiutil unmount /Volumes/RobotComLab
   ```

3. **Verify Installation**
   - Application should appear in Launchpad
   - Or use Spotlight (⌘+Space) to launch

### Linux

1. **Download AppImage**
   ```bash
   wget https://releases.robotcom.com/robotcom-lims-1.0.0.AppImage
   chmod +x robotcom-lims-1.0.0.AppImage
   ```

2. **Run Application**
   ```bash
   ./robotcom-lims-1.0.0.AppImage
   ```

3. **Create Desktop Entry** (optional)
   ```bash
   ./robotcom-lims-1.0.0.AppImage --appimage-extract
   cp squashfs-root/robotcom-lims.desktop ~/.local/share/applications/
   ```

## Configuration

### Database Configuration

Create/modify `.env` file in project root:

```env
# Database
DATABASE_URL="file:./dev.db"
# or for production
DATABASE_URL="file:/var/lib/robotcom-lims/app.db"

# Server
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Security
JWT_SECRET="your-secret-key-here"
JWT_EXPIRY="24h"

# Features
ENABLE_BACKUP=true
BACKUP_FREQUENCY="daily"
```

### Electron Configuration

`electron.vite.config.ts`:

```typescript
export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      emptyOutDir: true,
    },
  },
  preload: {
    build: {
      outDir: 'out/preload',
      emptyOutDir: true,
    },
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'out/renderer',
      emptyOutDir: true,
    },
  },
})
```

## System Requirements

### Minimum

| Component | Requirement |
|-----------|------------|
| **OS** | Windows 10, macOS 10.15, Ubuntu 20.04 |
| **CPU** | Intel i5 or equivalent |
| **RAM** | 4 GB |
| **Storage** | 500 MB |
| **Display** | 1024x768 resolution |

### Recommended

| Component | Requirement |
|-----------|------------|
| **OS** | Windows 11, macOS 12+, Ubuntu 22.04 |
| **CPU** | Intel i7 or better |
| **RAM** | 8 GB+ |
| **Storage** | 2 GB SSD |
| **Display** | 1920x1080 or higher |
| **Network** | 10 Mbps internet |

## Database Management

### Backup

**Automatic Backup**:
```bash
npm run backup:create
```

**Manual Backup**:
```bash
cp prisma/dev.db backups/dev.db.$(date +%Y%m%d_%H%M%S)
```

**Restore**:
```bash
cp backups/dev.db.20240115_103000 prisma/dev.db
```

### Migration

**Create Migration**:
```bash
npm run prisma:migrate -- --name add_new_column
```

**Apply Migrations**:
```bash
npm run prisma:migrate
```

**Rollback**:
```bash
npm run prisma:migrate:rollback
```

## Updating Application

### From Release

1. **Download New Version**
   - Visit https://github.com/.../releases
   - Download new installer for your OS

2. **Uninstall Old Version**
   - Windows: Control Panel → Uninstall
   - macOS: Drag app to Trash
   - Linux: `./old-version --uninstall`

3. **Install New Version**
   - Run new installer
   - Follow installation wizard

4. **Data Migration**
   - Old data automatically migrated
   - Backup created before update

### Manual Update

```bash
# 1. Backup current database
npm run backup:create

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
pnpm install

# 4. Run migrations
npm run prisma:migrate

# 5. Rebuild
npm run build

# 6. Restart application
npm run dev
```

## Troubleshooting

### Application Won't Start

**Error**: "Application can't be opened"

**Windows Solution**:
```bash
# Re-register installer
msiexec /fa robotcom-lims-1.0.0.msi
```

**macOS Solution**:
```bash
# Allow app to run
xattr -d com.apple.quarantine /Applications/RobotComLab.app
```

**Linux Solution**:
```bash
./robotcom-lims-1.0.0.AppImage --no-sandbox
```

### Database Errors

**Error**: "Database locked"

**Solution**:
```bash
# Close all instances
killall robotcom-lims

# Clear WAL files
rm prisma/*.db-wal
rm prisma/*.db-shm

# Restart
./robotcom-lims
```

**Error**: "Migration failed"

**Solution**:
```bash
# Reset to clean state (caution: deletes data)
npm run prisma:migrate:reset

# Or inspect database
npm run prisma:studio
```

### Performance Issues

**Solution**: Clear cache and optimize database
```bash
# Clear Electron cache
rm -rf ~/.robotcom-lims

# Optimize database
npm run prisma:db:optimize

# Check logs
cat ~/.robotcom-lims/logs/app.log
```

### Permission Denied

**Windows**: Run as Administrator
```cmd
runas /user:Administrator "robotcom-lims.exe"
```

**macOS/Linux**: Check permissions
```bash
chmod +x /opt/robotcom-lims/robotcom-lims
sudo chown -R $USER:$USER ~/.robotcom-lims
```

## Security Hardening

### Network Security

```bash
# Enable HTTPS (production)
ENABLE_TLS=true
TLS_CERT=/etc/robotcom-lims/cert.pem
TLS_KEY=/etc/robotcom-lims/key.pem
```

### Data Security

1. **Enable Encryption**
   ```bash
   DATABASE_ENCRYPTION=true
   ENCRYPTION_KEY="your-encryption-key"
   ```

2. **Configure Backups**
   ```bash
   BACKUP_ENCRYPTION=true
   BACKUP_RETENTION_DAYS=90
   ```

3. **Set Permissions**
   ```bash
   # Database file
   chmod 600 prisma/dev.db
   
   # Application directory
   chmod 755 /opt/robotcom-lims
   ```

### Access Control

1. **User Roles**
   - Admin: Full access
   - Manager: Can manage users and reports
   - Technician: Can enter results
   - Viewer: Read-only access

2. **Two-Factor Authentication** (Enterprise)
   ```bash
   ENABLE_2FA=true
   2FA_PROVIDER=google_authenticator
   ```

## Monitoring

### Logs

**Application Logs**:
```bash
# Linux/macOS
tail -f ~/.robotcom-lims/logs/app.log

# Windows
Get-Content "$env:APPDATA\robotcom-lims\logs\app.log" -Tail 50
```

**Error Logs**:
```bash
cat ~/.robotcom-lims/logs/error.log
```

### Health Check

```bash
# Test database connection
npm run db:check

# Test API
curl http://localhost:3000/api/health

# Expected response
{
  "status": "healthy",
  "database": "ok",
  "uptime": 3600000
}
```

## Backup & Disaster Recovery

### Automated Backups

```bash
# Enable daily backups
BACKUP_ENABLED=true
BACKUP_SCHEDULE="0 2 * * *"  # 2 AM daily
BACKUP_LOCATION="/backups"
BACKUP_RETENTION="30"         # Keep 30 days
```

### Manual Backup

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/robotcom-lims"
DB_FILE="$HOME/.robotcom-lims/app.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"
cp "$DB_FILE" "$BACKUP_DIR/app.db.$TIMESTAMP"
tar -czf "$BACKUP_DIR/robotcom-lims-$TIMESTAMP.tar.gz" ~/.robotcom-lims/
```

### Recovery

```bash
# Restore from backup
cp /backups/robotcom-lims/app.db.20240115_020000 ~/.robotcom-lims/app.db

# Verify integrity
npm run db:check

# Restart application
killall robotcom-lims
./robotcom-lims
```

## Support & Troubleshooting

### Getting Help

1. **Check Documentation**
   - README.md
   - This deployment guide
   - API.md for integration issues

2. **Check Logs**
   - Application logs in ~/.robotcom-lims/logs/
   - Browser console (F12)
   - Error messages with timestamp

3. **Contact Support**
   - support@robotcom.com
   - Include:
     - OS and version
     - Application version
     - Error logs
     - Steps to reproduce

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| App crashes on startup | Check logs, verify database permissions |
| Slow performance | Check disk space, optimize database |
| Can't connect to database | Verify DATABASE_URL, check file permissions |
| Login not working | Clear browser cache, check user credentials |
| Reports not generating | Check disk space, verify permissions |

## Maintenance Schedule

### Daily
- Monitor application logs
- Check disk space
- Verify backups completed

### Weekly
- Review security logs
- Check for updates
- Test backup restoration

### Monthly
- Update dependencies
- Run security scans
- Optimize database
- Review performance metrics

### Quarterly
- Security audit
- Performance tuning
- Data cleanup
- Documentation updates

## Release Notes

### Version 1.0.0 (2024-01-15)
- Initial release
- Full patient management
- Sample tracking
- Test ordering
- Billing system
- Reporting features

### Known Issues
- None at this time

### Upgrading from Previous Versions
- See individual version release notes
- All data automatically migrated
- Backup recommended before upgrade
