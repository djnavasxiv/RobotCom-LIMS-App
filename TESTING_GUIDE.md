# RobotComLIMS - Testing Guide

## Quick Start

### 1. Start the Development Server
```bash
cd packages/robotcom-lims
npm run dev
```

### 2. Default Test Credentials
| Account | Username | Password | Role | Purpose |
|---------|----------|----------|------|---------|
| Admin | `admin` | `password` | admin | Full access, database management |
| Technician | `tecnico` | `password` | technician | Laboratory test entry |

### 3. Access the Application
```
http://localhost:5173
```

---

## Testing Checklist

### Authentication (Login/Logout)
- [ ] Open application → auto-redirected to `/login` (expected)
- [ ] Enter credentials: `admin` / `password`
- [ ] Click **Ingresar** button
- [ ] Verify redirect to `/dashboard` after 2-3 seconds
- [ ] Check user profile in top-right corner shows "Admin User"
- [ ] Click profile → Logout
- [ ] Verify redirect back to `/login`

### Navigation
- [ ] **Top Menu:** User profile, settings icon, logout visible
- [ ] **Icon Toolbar:** 14 buttons visible (Orden, Tipo, Coagula, ELISA, etc.)
- [ ] **Click each button:** Verify navigation to correct test module
- [ ] **Back button:** Browser back navigates correctly
- [ ] **Sidebar (if present):** All modules listed

### Test Modules (Click Each to Verify Form Loads)
1. [ ] **Orden Examen** - Order entry form
2. [ ] **Química Sanguínea** - Blood chemistry form
3. [ ] **Hematología** - Hematology form
4. [ ] **Orina General** - Urinalysis form
5. [ ] **Heces** - Stool analysis form
6. [ ] **Bacteriología** - Bacteriology form
7. [ ] **Espermiograma** - Semen analysis form
8. [ ] **Inmunología** - Immunology form
9. [ ] **Hormonas** - Hormones form
10. [ ] **Embarazo** - Pregnancy test form
11. [ ] **Tipo Sangre** - Blood typing form
12. [ ] **Coagulación** - Coagulation form
13. [ ] **ELISA** - ELISA test form
14. [ ] **Cronómetro** - Timer utility

### Management Modules
- [ ] **Pacientes** - View list of 5 patients (Juan, María, Carlos, Ana, Luis)
- [ ] **Órdenes** - View test orders
- [ ] **Muestras** - View 5 samples (S-001 to S-005)
- [ ] **Resultados** - View 4 test results
- [ ] **Facturación** - View 3 invoices (INV-001, INV-002, INV-003)
- [ ] **Comisiones** - View doctor commissions
- [ ] **Inventario** - View 5 inventory items

### Settings & Development
- [ ] Click **Configuración** (Settings)
- [ ] Verify 4 tabs: Lab, License, Backup, **Desarrollo**
- [ ] Click **Desarrollo** tab
- [ ] Click **Reiniciar BD** button
- [ ] Verify confirmation dialog appears with warning
- [ ] Click **Cancelar** to cancel
- [ ] Click **Reiniciar BD** again and confirm
- [ ] Verify success message appears
- [ ] Wait 2-3 seconds for auto-refresh
- [ ] Verify page reloads with fresh data (if viewing tables)

### Form Inputs & Validation
- [ ] **Text fields:** Can type and clear
- [ ] **Select dropdowns:** Show options, can select
- [ ] **Date pickers:** Calendar opens, can select dates
- [ ] **Radio buttons:** Can select options
- [ ] **Checkboxes:** Can check/uncheck
- [ ] **Required fields:** Show validation error when empty and submit
- [ ] **Submit buttons:** Disable/enable based on form state

### Database Verification (SQLite)
```bash
# Connect to database
sqlite3 packages/robotcom-lims/prisma/dev.db

# Verify test data
sqlite> SELECT COUNT(*) as users FROM User;  -- Should show 2
sqlite> SELECT COUNT(*) as patients FROM Patient;  -- Should show 5
sqlite> SELECT COUNT(*) as tests FROM Test;  -- Should show 24
sqlite> SELECT COUNT(*) as samples FROM Sample;  -- Should show 5
sqlite> SELECT username, role FROM User;  -- Should show admin, tecnico
sqlite> .quit
```

### Build Verification
```bash
cd packages/robotcom-lims
npm run build

# Expected output:
# ✓ Main process: 1 module, 8.31 kB
# ✓ Preload: 1 module, 1.45 kB  
# ✓ Renderer: 12,291 modules, 2,107.20 kB
# ✓ ZERO ERRORS, ZERO WARNINGS
```

---

## Common Test Workflows

### Workflow 1: Complete Test Order Entry
1. Login as **tecnico** (technician)
2. Navigate to **Orden Examen**
3. Fill out:
   - Select Patient: "Juan Pérez"
   - Select Test: "Química Sanguínea"
   - Enter Sample ID: "S-001"
   - Click **Guardar**
4. Navigate to **Química Sanguínea**
5. Select the newly created order
6. Enter test values (or see defaults)
7. Click **Guardar Resultados**
8. Navigate to **Facturación**
9. Create invoice from the test order
10. Verify data flow through system

### Workflow 2: Database Reset & Reseed
1. Login as **admin**
2. Navigate to **Configuración** (Settings)
3. Click **Desarrollo** tab
4. Click **Reiniciar BD** button
5. Verify confirmation dialog
6. Click confirm button
7. Wait for success message
8. Page auto-refreshes
9. Navigate to **Pacientes**
10. Verify 5 fresh patients are loaded

### Workflow 3: User Authentication Flow
1. Close application completely
2. Open application again
3. Should be at `/login` (localStorage cleared if app reset)
4. Enter credentials: `admin` / `password`
5. Should authenticate and redirect to `/dashboard`
6. Refresh page (F5)
7. Should remain authenticated (localStorage restores session)
8. Click logout
9. Should redirect to `/login`
10. Page refresh should show `/login` (session cleared)

### Workflow 4: Permission Testing (If roles implemented)
1. Login as **admin**
2. Verify access to all modules
3. Verify **Desarrollo** tab in Settings visible
4. Logout
5. Login as **tecnico**
6. Verify access to test entry modules
7. Verify **Desarrollo** tab NOT visible (may be dev-mode only)

---

## Performance Benchmarks

### Expected Performance
- **Initial load:** < 3 seconds
- **Page navigation:** < 500ms
- **Form submission:** < 1 second
- **Database query:** < 100ms
- **Build time:** ~90 seconds

### Testing Performance
```bash
# Check build time
time npm run build

# Check bundle size
du -sh out/renderer/assets/

# Check module count
npm run build 2>&1 | grep "modules transformed"
```

---

## Troubleshooting

### Issue: "Authentication failed" or redirects to login
**Solution:**
1. Database may not be seeded
2. Run: `npm run prisma:seed`
3. Verify test users exist:
   ```bash
   sqlite3 prisma/dev.db "SELECT username FROM User;"
   ```
4. If no users, database was reset. Click **Reiniciar BD** in Settings > Desarrollo

### Issue: Forms not showing or modules not loading
**Solution:**
1. Check build completed successfully: `npm run build`
2. Check console (F12) for errors
3. Verify all test modules are in `src/renderer/src/presentation/components/TestModules/`
4. Verify routes in `src/renderer/src/AppRoutes.tsx`
5. Restart dev server: `npm run dev`

### Issue: Database connection error
**Solution:**
1. Verify database file exists: `ls -la prisma/dev.db`
2. If missing, create new: `npm run prisma:generate`
3. Run migrations: `npm run prisma:migrate`
4. Seed data: `npm run prisma:seed`

### Issue: Button text shows as "GUARD" instead of "GUARDAR"
**Solution:**
1. Already fixed in `src/renderer/src/presentation/components/common/ModalFooters.tsx`
2. If still showing old text:
   - Clear browser cache (Ctrl+Shift+Delete)
   - Restart dev server
   - Hard refresh (Ctrl+F5)

---

## Testing Report Template

### Test Session: _______________
**Date:** _______________
**Tester:** _______________
**Build Version:** _______________

### Results Summary
- [ ] Authentication: PASS / FAIL
- [ ] Navigation: PASS / FAIL
- [ ] Forms: PASS / FAIL
- [ ] Database: PASS / FAIL
- [ ] Build: PASS / FAIL
- [ ] Performance: PASS / FAIL

### Issues Found
```
1. [DESCRIPTION]
   Status: OPEN / CLOSED
   Severity: CRITICAL / MAJOR / MINOR
   
2. [DESCRIPTION]
   Status: OPEN / CLOSED
   Severity: CRITICAL / MAJOR / MINOR
```

### Overall Status
- [ ] READY FOR PRODUCTION
- [ ] NEEDS MORE TESTING
- [ ] REQUIRES FIXES

**Notes:** ___________________________________

---

## Running Tests

### Unit Tests (if configured)
```bash
npm run test
```

### Integration Tests (if configured)
```bash
npm run test:integration
```

### E2E Tests (if configured)
```bash
npm run test:e2e
```

---

## Logs & Debugging

### Check Application Logs
```bash
# Development console
npm run dev  # Logs appear in terminal

# Browser console
Press F12 → Console tab
```

### Enable Debug Mode (if available)
```bash
DEBUG=* npm run dev
```

### Database Logs
```bash
# Export database schema
sqlite3 prisma/dev.db ".schema"

# Export all data
sqlite3 prisma/dev.db ".dump" > database_backup.sql
```

---

**Testing Guide Version:** 1.0
**Last Updated:** November 18, 2024
**Status:** Complete and Ready for Testing

