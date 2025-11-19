# Anti-Piracy Implementation Guide

## Overview

RobotComLab LIMS now includes comprehensive anti-piracy measures to protect intellectual property and ensure proper licensing compliance.

---

## Components Implemented

### 1. **AntiPiracyService**
Location: `src/renderer/application/services/AntiPiracyService.ts`

**Features:**
- Periodic license validation (every 30 minutes by default)
- License expiration checking
- Code tampering detection
- Application integrity verification
- Security event logging
- Feature-based access control

**Key Methods:**
```typescript
performSecurityCheck()        // Comprehensive license validation
startLicenseMonitoring()      // Begin periodic checks
stopLicenseMonitoring()       // Stop monitoring
checkFeatureAccess(feature)   // Verify feature permissions
logSecurityEvent(type, data)  // Log suspicious activity
```

### 2. **LicenseService** (Enhanced)
Location: `src/renderer/application/services/LicenseService.ts`

**Features:**
- License key generation and validation
- Machine binding verification
- Online license validation via Keygen API
- Local license persistence
- Grace period handling (7 days)

**Integration Points:**
- Electron IPC for machine ID retrieval
- localStorage for license caching
- Network requests for online validation

### 3. **useAntiPiracy Hook**
Location: `src/renderer/application/hooks/useAntiPiracy.ts`

**Usage in Components:**
```tsx
const { licenseStatus, antiPiracyService } = useAntiPiracy();

if (!licenseStatus.isValid) {
  // Show license warning
}
```

### 4. **Enhanced LicenseProvider**
Location: `src/renderer/src/presentation/components/auth/LicenseProvider.tsx`

**Features:**
- Automatic license validation on app startup
- Beautiful license failure UI
- Retry mechanism
- Integration with AntiPiracyService
- Feature access context

---

## How It Works

### Application Startup Flow

```
1. App loads → LicenseProvider initializes
2. LicenseProvider calls AntiPiracyService.performSecurityCheck()
3. Check validates:
   - Local license existence
   - License expiration date
   - Online validation (if grace period expired)
   - Code integrity
4. Result:
   - ✓ Valid → App continues normally
   - ✗ Invalid → License required page shown
```

### Periodic Monitoring

```
Every 30 minutes:
1. AntiPiracyService runs background check
2. Validates license status
3. If check fails → Emit 'licenseFailure' event
4. App can respond (warning dialog, logout, etc.)
```

### Feature Access Control

Premium features can be restricted to specific license types:

```typescript
const canUseAdvancedReporting = await antiPiracyService.checkFeatureAccess('advanced_reporting');
// Returns: false for basic license, true for professional/enterprise
```

---

## License Types

### Available Subscription Tiers

| Feature | Basic | Professional | Enterprise |
|---------|-------|--------------|------------|
| Core LIMS | ✓ | ✓ | ✓ |
| Patient Management | ✓ | ✓ | ✓ |
| Test Modules | ✓ | ✓ | ✓ |
| Multi-User Support | ✗ | ✓ | ✓ |
| Advanced Reporting | ✗ | ✓ | ✓ |
| API Access | ✗ | ✗ | ✓ |
| Data Export | ✗ | ✓ | ✓ |
| Custom Integrations | ✗ | ✗ | ✓ |

---

## Security Features

### 1. **Code Tampering Detection**
- Monitors critical function integrity
- Detects removed obfuscation
- Logs suspicious modifications

### 2. **Machine Binding**
- Licenses bound to specific hardware
- Uses hostname + machine ID
- Prevents license sharing

### 3. **Expiration Enforcement**
- Hard stop on expired licenses
- 7-day grace period for offline use
- Clear expiry notifications

### 4. **Online Validation**
- Validates with Keygen API every 7 days
- Catches revoked licenses
- Detects license reuse

### 5. **Security Logging**
- Records all security events
- Logs suspicious activity
- Stored in localStorage for audit trails

---

## Configuration

### Environment Variables

```bash
# .env file
VITE_LICENSE_CHECK_INTERVAL=1800000  # 30 minutes in ms
VITE_GRACE_PERIOD_DAYS=7
VITE_KEYGEN_ACCOUNT_ID=<your-account-id>
VITE_KEYGEN_API_URL=https://api.keygen.sh/v1
```

### License Service Constants

```typescript
private readonly GRACE_PERIOD_DAYS = 7;
private readonly checkIntervalMs = 30 * 60 * 1000; // 30 minutes
```

---

## Testing

### Test License Scenarios

1. **Valid License:**
   ```bash
   # Use valid license key in development
   localStorage.setItem('license', 'valid-key-here');
   ```

2. **Expired License:**
   ```bash
   # Create license with past expiry date
   const expired = createLicenseWithDate(new Date(2024, 0, 1));
   ```

3. **No License:**
   ```bash
   # Clear license to test failure page
   localStorage.removeItem('license');
   ```

---

## Development Mode

For development without license enforcement:

```typescript
// In LicenseProvider
if (process.env.NODE_ENV === 'development') {
  setIsLicenseValid(true); // Skip checks in dev
}
```

---

## Deployment Checklist

- [ ] Update Keygen account ID in environment variables
- [ ] Configure license server endpoint
- [ ] Set proper grace period for your use case
- [ ] Test license validation with real keys
- [ ] Configure error reporting for failed checks
- [ ] Set up automatic license renewal reminders
- [ ] Document license activation process for users
- [ ] Create license management admin interface
- [ ] Set up audit logging for license events
- [ ] Test license migration for updates

---

## License Management API

### Generating Licenses

```bash
curl -X POST https://api.keygen.sh/v1/accounts/{id}/licenses \
  -H "Authorization: Bearer {api-key}" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "type": "licenses",
      "attributes": {
        "key": "generated-key",
        "expiry": "2026-01-01T00:00:00Z"
      },
      "relationships": {
        "product": { "data": { "type": "products", "id": "{product-id}" } }
      }
    }
  }'
```

### Validating Licenses

```bash
curl -X POST https://api.keygen.sh/v1/accounts/{id}/licenses/actions/validate-key \
  -H "Content-Type: application/json" \
  -d '{
    "meta": {
      "key": "license-key-to-validate",
      "scope": { "fingerprint": "machine-id" }
    }
  }'
```

---

## Troubleshooting

### License Won't Validate

1. Check machine ID matches (use `electronAPI.getMachineId()`)
2. Verify internet connection for online validation
3. Check license hasn't expired
4. Clear browser cache and localStorage
5. Restart application

### Persistent Validation Failures

1. Check server logs for API errors
2. Verify Keygen account configuration
3. Check firewall/proxy isn't blocking API calls
4. Review security event logs in localStorage

### Users Locked Out

1. Use admin override to temporarily unlock
2. Verify license server is operational
3. Check user's internet connectivity
4. Provide manual license activation option

---

## Future Enhancements

- [ ] Hardware fingerprinting improvements
- [ ] Blockchain-based license verification
- [ ] AI-powered fraud detection
- [ ] Usage tracking and analytics
- [ ] Automatic license renewal reminders
- [ ] Volume licensing support
- [ ] License pool management
- [ ] Advanced audit dashboard

---

## Support

For license-related issues:
- Email: license@robotcomlab.com
- Documentation: https://docs.robotcomlab.com/licensing
- API Documentation: https://api.keygen.sh/docs
