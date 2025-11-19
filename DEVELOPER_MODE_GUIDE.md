# Developer Mode Guide for RobotComLab LIMS

## Overview

The RobotComLab LIMS application now includes a **developer mode** that allows developers to access and test the application without license validation blocking them.

## Why This Matters

When developing locally, you don't want license validation checks to block your access. Developer mode:
- **Skips all license validation checks** during development
- **Automatically enabled** when `NODE_ENV=development`
- **Gracefully handles errors** instead of blocking the app
- **Allows full feature access** without a valid license

## How Developer Mode Works

The LicenseProvider component checks for developer mode in three ways (in order of priority):

### 1. Environment Variable (Primary)
```bash
NODE_ENV=development npm run dev:app
```
**Status**: ✅ Automatically set by `npm run dev:app`

### 2. localStorage Flag (Manual Override)
You can manually enable developer mode from the browser console:
```javascript
// In browser DevTools console
localStorage.setItem('ROBOTCOM_DEV_MODE', 'true');
```

### 3. Electron Dev Flag (Automatic)
When Electron loads the dev server, it sets:
```javascript
window.__DEV__ = true;
```
**Status**: ✅ Automatically set by Electron main process

## What Gets Skipped in Developer Mode

When developer mode is active:

1. **License Existence Check** ✓ Skipped
2. **License Expiration Check** ✓ Skipped
3. **Online Validation** ✓ Skipped
4. **License Errors** ✓ Not blocking (gracefully ignored)

The app will log:
```
🔧 Developer mode enabled - skipping license validation
```

## Verification

When you run the app in development:

1. **Open Electron**: `npm run dev:app`
2. **Check DevTools Console**: Look for the 🔧 message
3. **You should see**: 
   - No license errors
   - Full app access
   - All features available

## For Production

When you build for production (`npm run build:app`):

- Developer mode is **automatically disabled**
- `NODE_ENV=production` (no bypass)
- **Full license validation required**
- All security checks are enforced

## Related Files

### Files Modified:
- `src/renderer/src/presentation/components/auth/LicenseProvider.tsx`
  - Added `isDeveloperMode()` function
  - Added dev mode checks before validation
  - Added error handling for dev mode

- `src/main/index.ts`
  - Added console logging for dev mode confirmation
  - Enhanced window creation process

### License System Files:
- `src/application/services/AntiPiracyService.ts` - Core security checks
- `src/application/services/LicenseService.ts` - License validation logic
- `src/renderer/src/presentation/components/auth/ProtectedRoute.tsx` - Route protection

## Security Note

⚠️ **Developer mode is only active in development builds**

- **Development**: License checks skipped automatically
- **Production**: All security enforced
- The production build will NOT have `NODE_ENV=development`
- Users cannot bypass security with `localStorage` hacks in production

## Troubleshooting

### "Still seeing license errors?"

1. Make sure you're running with: `npm run dev:app`
2. Check DevTools console for the 🔧 message
3. If not there, try clearing cache:
   ```bash
   rm -rf out/
   npm run dev:app
   ```

### "Want to test license validation?"

1. Stop the dev server (Ctrl+C)
2. Manually set `localStorage.setItem('ROBOTCOM_DEV_MODE', 'false');`
3. Run again to see license validation flow

## Summary

| Scenario | License Required | Works |
|----------|-----------------|-------|
| Development (`npm run dev:app`) | ❌ No | ✅ Yes |
| Production build | ✅ Yes | ✅ Yes (with valid license) |
| Manual localStorage override | Depends on flag | ✅ Configurable |
| Browser-only testing | ✅ Yes | ✅ Yes (if no Electron) |

---

**Last Updated**: November 18, 2025  
**Related Commit**: `f25202c` - Enable developer mode for Electron app
