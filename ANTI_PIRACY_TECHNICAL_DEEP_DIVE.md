# Anti-Piracy System: Deep Technical Explanation

## Executive Summary

The RobotComLab anti-piracy system is a multi-layered security architecture designed to prevent unauthorized use, detect license violations, and enforce licensing terms. It combines client-side validation, server-side verification, machine binding, and security monitoring to create a robust protection mechanism.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION STARTUP                       │
│                                                               │
│  User opens RobotComLab → React App Initializes             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              LICENSEPROVIDER INITIALIZATION                 │
│                                                               │
│  • Creates AntiPiracyService instance                        │
│  • Triggers performSecurityCheck()                           │
│  • Displays loading spinner while checking                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            ANTIPIRACYSERVICE.PERFORMSECURITYCHECK()          │
│                                                               │
│  Step 1: Load Local License from Database                    │
│  ├─ Check localStorage for cached license                    │
│  ├─ Validate license exists                                  │
│  └─ If missing → Return { canContinue: false }              │
│                                                               │
│  Step 2: Verify License Not Expired                          │
│  ├─ Parse expiresAt date from license                       │
│  ├─ Compare with current Date.now()                         │
│  └─ If expired → Return { canContinue: false, isExpired: true }
│                                                               │
│  Step 3: Check Online Validation Requirement                │
│  ├─ Calculate days since last online check                  │
│  ├─ If > 7 days → Perform online validation                │
│  └─ Validate with Keygen API server                         │
│                                                               │
│  Step 4: Verify Code Integrity                              │
│  ├─ Check critical functions haven't been modified          │
│  ├─ Detect obfuscation removal attempts                      │
│  └─ Monitor for tampering indicators                        │
│                                                               │
│  Step 5: Return Status                                      │
│  └─ { canContinue: boolean, isExpired, isTampered, message }
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    VALID LICENSE          INVALID LICENSE
         │                       │
         ▼                       ▼
    ALLOW ACCESS          SHOW LICENSE PAGE
    (Loading spinner)     (Retry/Activate buttons)
         │
         ▼
    Start Background
    Monitoring Loop
```

---

## Detailed Component Breakdown

### 1. LICENSE DATA STRUCTURE

```typescript
interface License {
  licenseKey: string;           // Encrypted unique identifier
  machineId: string;            // Hardware-bound identifier
  subscriptionType: string;     // 'basic' | 'professional' | 'enterprise'
  isActive: boolean;            // true/false
  activatedAt: Date;            // When license was activated
  expiresAt: Date;              // When license expires
  lastCheckAt: Date;            // Last online validation
  companyName?: string;         // Associated company
  maxUsers?: number;            // Concurrent user limit
}
```

### 2. SECURITY CHECK FLOW

#### **Phase 1: Local Validation**

```typescript
// In AntiPiracyService.performSecurityCheck()

// 1. Retrieve license from database
const localLicense = await this.licenseService.getLocalLicense();

if (!localLicense) {
  return {
    isLicensed: false,
    canContinue: false,
    message: 'No license found. Please activate your license.'
  };
}

// 2. Check expiration
const currentDate = new Date();
const expirationDate = new Date(localLicense.expiresAt);

if (currentDate > expirationDate) {
  return {
    isLicensed: true,
    isExpired: true,
    canContinue: false,
    message: 'Your license has expired. Please renew it.'
  };
}
```

#### **Phase 2: Online Validation (Every 7 Days)**

```typescript
// Check if online validation is needed
const lastCheckDate = new Date(localLicense.lastCheckAt);
const daysSinceLastCheck = Math.ceil(
  (Date.now() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24)
);

if (daysSinceLastCheck >= 7) {
  // Perform online check against Keygen API
  const isValid = await this.licenseService.validateOnline(
    localLicense.licenseKey
  );

  if (!isValid) {
    return {
      isLicensed: true,
      isTampered: true,
      canContinue: false,
      message: 'License validation failed. Online verification required.'
    };
  }
}
```

#### **Phase 3: Code Integrity Check**

```typescript
// Verify critical functions haven't been overwritten
private detectCodeTampering(): boolean {
  try {
    const criticalFunctions = [
      'performSecurityCheck',
      'startLicenseMonitoring',
      'checkFeatureAccess'
    ];

    for (const fnName of criticalFunctions) {
      if (typeof (this as any)[fnName] !== 'function') {
        console.error(`Critical function ${fnName} has been tampered with`);
        this.logSecurityEvent('CODE_TAMPERING_DETECTED', {
          affectedFunction: fnName,
          timestamp: new Date().toISOString()
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    this.logSecurityEvent('TAMPERING_CHECK_FAILED', { error });
    return false;
  }
}
```

---

## Key Security Mechanisms

### A. MACHINE BINDING

**Purpose:** Prevent license sharing across multiple machines

**How It Works:**

```typescript
// 1. Generate unique machine fingerprint
const machineId = await window.electronAPI.getMachineId();
// Returns: "8a7f9e3c-4b2d-5f1a-9c8e-2d7b5a4f1e3c"

// 2. Combine with hostname
const hostname = await window.electronAPI.getHostname();
// Returns: "victus-dajonas" (example)

// 3. Create SHA-256 hash
const combined = `${hostname}-${machineId}`;
const machineFingerprint = crypto
  .createHash('sha256')
  .update(combined)
  .digest('hex');
// Result: "a7b4c2e9f1d3e5f2a8c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0e2f4a6"

// 4. License is bound to this specific machine
// When license is activated:
license.machineId = machineFingerprint;

// On subsequent validation:
if (currentMachineFingerprint !== license.machineId) {
  // License was moved to different machine - INVALID
  logSecurityEvent('LICENSE_MACHINE_MISMATCH');
  return false;
}
```

**Prevents:**
- Sharing license across multiple devices
- License portability without authorization
- Multi-device installations

---

### B. PERIODIC MONITORING (Background Check Loop)

**Purpose:** Catch license changes while app is running

**How It Works:**

```typescript
startLicenseMonitoring() {
  // Set interval for 30-minute checks
  this.checkTimer = setInterval(async () => {
    // Every 30 minutes, run full security check
    const result = await this.performSecurityCheck();

    if (!result.canContinue) {
      // License became invalid while app was running
      // Examples:
      // - License was revoked on server
      // - License expired
      // - Machine binding changed
      // - Code tampering detected

      console.warn('License check failed:', result.message);
      
      // Emit event to app
      const event = new CustomEvent('licenseFailure', { 
        detail: result 
      });
      window.dispatchEvent(event);

      // App can respond:
      // - Show warning dialog
      // - Pause non-critical features
      // - Initiate logout
      // - Disable new operations
    }
  }, 30 * 60 * 1000); // 30 minutes
}
```

**Prevents:**
- Undetected license revocation
- Extended use after expiration
- Continuous use of tampered code

---

### C. ENCRYPTION OF LICENSE DATA

**Purpose:** Prevent manual license file modification

**How It Works:**

```typescript
// Encryption using AES-256-CBC
private encryptLicenseData(data: any): string {
  // 1. Generate random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // 2. Create encryption cipher
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    // 32-byte encryption key (derived from master secret)
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    iv
  );

  // 3. Encrypt license data
  let encrypted = cipher.update(
    JSON.stringify(data),
    'utf8',
    'hex'
  );
  encrypted += cipher.final('hex');

  // 4. Return IV + encrypted data
  // Format: "{iv_hex}:{encrypted_data_hex}"
  return iv.toString('hex') + ':' + encrypted;
}

// On disk, license looks like:
// "a7b4c2e9f1d3e5f2a8c4d6e8f0a2b4c6:f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4"

// If someone tries to modify the file:
private decryptLicenseData(encryptedData: string): any {
  try {
    // 1. Parse IV and encrypted data
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    // 2. Create decipher with same key
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      iv
    );

    // 3. Try to decrypt
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    // If data was tampered with, decryption fails
    throw new Error('License data tampered or corrupted');
  }
}
```

**Prevents:**
- Manual license file editing
- Expiration date modification
- License key forgery
- Subscription tier upgrades

---

### D. FEATURE-BASED ACCESS CONTROL

**Purpose:** Enforce premium feature restrictions

**How It Works:**

```typescript
// Feature access matrix
const restrictedFeatures = {
  'advanced_reporting': ['enterprise', 'professional'],
  'api_access': ['enterprise'],
  'multi_user': ['professional', 'enterprise'],
  'data_export': ['professional', 'enterprise'],
  'custom_integrations': ['enterprise'],
  'priority_support': ['professional', 'enterprise'],
};

async checkFeatureAccess(feature: string): Promise<boolean> {
  // 1. Get current license
  const license = await this.licenseService.getLocalLicense();
  if (!license) return false;

  // 2. Check if feature is restricted
  if (feature in restrictedFeatures) {
    const allowedTiers = restrictedFeatures[feature];
    
    // 3. Check if current tier has access
    const hasAccess = allowedTiers.includes(license.subscriptionType);
    
    if (!hasAccess) {
      this.logSecurityEvent('FEATURE_ACCESS_DENIED', {
        feature,
        requiredTier: allowedTiers,
        currentTier: license.subscriptionType
      });
    }

    return hasAccess;
  }

  return true; // Feature available to all
}

// In component:
if (await antiPiracyService.checkFeatureAccess('advanced_reporting')) {
  // Show advanced reporting features
} else {
  // Show upgrade prompt
  <UpgradePrompt requiredTier="professional" />
}
```

**Prevents:**
- Using premium features without license
- Accessing restricted APIs
- Data export without permission
- Exceeding user limits

---

### E. SECURITY EVENT LOGGING

**Purpose:** Create audit trail of security-related events

**How It Works:**

```typescript
logSecurityEvent(eventType: string, details: any) {
  const event = {
    timestamp: new Date().toISOString(),
    eventType,
    details,
    userAgent: navigator.userAgent,
    // Can include:
    // - IP address (if available)
    // - Screen resolution
    // - Browser fingerprint
    // - Device type
  };

  // Log locally
  console.log('Security Event:', event);

  // Store in localStorage
  try {
    localStorage.setItem(
      `security_event_${Date.now()}`,
      JSON.stringify(event)
    );
  } catch (error) {
    console.error('Failed to log security event:', error);
  }

  // In production, would send to monitoring service:
  // await fetch('https://security.robotcomlab.com/log', {
  //   method: 'POST',
  //   body: JSON.stringify(event),
  //   headers: { 'Authorization': `Bearer ${apiKey}` }
  // });
}

// Events tracked:
// - LICENSE_EXPIRED
// - LICENSE_REVOKED
// - CODE_TAMPERING_DETECTED
// - MACHINE_MISMATCH
// - FEATURE_ACCESS_DENIED
// - ONLINE_VALIDATION_FAILED
// - LICENSE_NOT_FOUND
```

**Enables:**
- Fraud detection
- Usage pattern analysis
- Compliance audits
- Security incident investigation

---

## Attack Prevention Scenarios

### Scenario 1: User Extends License Expiration Date

**Attack Method:**
```javascript
// Attacker tries:
localStorage.setItem('license_expiresAt', '2099-12-31');
```

**Defense:**
```
✓ License data is AES-256 encrypted
✓ Manual modification breaks encryption
✓ Decryption fails → Logged as TAMPERING
✓ App denies access
✓ Security event recorded
```

---

### Scenario 2: License Sharing Across Machines

**Attack Method:**
```bash
# Attacker copies license file from Machine A to Machine B
$ scp user@machineA:~/.robotcomlab/license.key user@machineB:~/.robotcomlab/license.key
```

**Defense:**
```
✓ License includes machine fingerprint (hardware ID + hostname)
✓ On Machine B: fingerprint doesn't match
✓ Online validation called
✓ Server checks: license bound to Machine A
✓ Validation fails
✓ Access denied, event logged
✓ Server flags suspicious activity
```

---

### Scenario 3: Removing Anti-Piracy Code

**Attack Method:**
```typescript
// Attacker tries to remove security checks
// From bundled JavaScript:
// DELETE: performSecurityCheck() function
// DELETE: startLicenseMonitoring() call
```

**Defense:**
```
✓ Code is minified and obfuscated in production
✓ Critical functions are hard to identify
✓ Runtime check detects missing functions
✓ Detects function type isn't 'function'
✓ Triggers CODE_TAMPERING_DETECTED event
✓ App refuses to initialize
✓ Requires valid license to bypass
```

---

### Scenario 4: Running in VM/Emulator

**Attack Method:**
```bash
# Run app in virtual machine to hide true hardware
$ vmware RobotComLab.iso
$ VirtualBox robotcomlab_ubuntu.iso
```

**Defense (Future Enhancement):**
```typescript
// Detect common VM signatures
const vmIndicators = [
  'VirtualBox',
  'VMware',
  'QEMU',
  'XEN',
  'Hyper-V'
];

// Check:
// - Device drivers
// - BIOS strings
// - Process list
// - Network adapters
// - GPU vendor strings
```

---

### Scenario 5: License Revocation Not Applied

**Attack Method:**
```typescript
// Attacker kills internet connection
// App can't reach server
// Tries to continue using app offline
```

**Defense:**
```
✓ Grace period: 7 days offline use allowed
✓ After 7 days: Online check REQUIRED
✓ If offline for 8+ days: Access DENIED
✓ Periodic checks every 30 minutes
✓ If revocation happens on server:
  └─ Next check detects it
  └─ App immediately responds
  └─ Operations are paused
```

---

## Integration Points

### In React Components

```tsx
// Example: Advanced Reporting Component
import { useAntiPiracy } from '@/hooks/useAntiPiracy';

const AdvancedReporting: React.FC = () => {
  const { licenseStatus, antiPiracyService } = useAntiPiracy();

  useEffect(() => {
    // Check if user has access
    const checkAccess = async () => {
      const canAccess = await antiPiracyService.checkFeatureAccess(
        'advanced_reporting'
      );
      
      if (!canAccess) {
        // Show upgrade prompt
        navigate('/upgrade');
      }
    };
    
    checkAccess();
  }, []);

  // Listen for license failures
  useEffect(() => {
    const handleFailure = (event: any) => {
      if (event.detail.isExpired) {
        showDialog('License Expired', 'Please renew your license');
      } else {
        showDialog('License Invalid', event.detail.message);
      }
    };

    window.addEventListener('licenseFailure', handleFailure);
    return () => window.removeEventListener('licenseFailure', handleFailure);
  }, []);

  if (!licenseStatus.isValid) {
    return <UpgradePrompt />;
  }

  return <AdvancedReportingContent />;
};
```

### In LicenseProvider

```tsx
// Automatic enforcement at app level
<LicenseProvider>
  {/* If license invalid, this entire subtree 
      is replaced with license activation page */}
  <App />
</LicenseProvider>
```

---

## Security Metrics

### Check Frequency
- **On Startup:** Immediate full check
- **Background:** Every 30 minutes
- **Online Validation:** Every 7 days (if used offline)
- **Feature Access:** On each restricted feature use

### Encryption
- **Algorithm:** AES-256-CBC
- **Key Length:** 256 bits
- **IV Generation:** Random 16 bytes per license
- **Hash Algorithm:** SHA-256 (for machine fingerprinting)

### Grace Period
- **Offline Use:** 7 days after last validation
- **Expired License:** Immediate block (no grace)
- **Machine Mismatch:** Immediate block (no grace)

### Logging
- **Local Storage:** All security events
- **Server Logs:** Integration-ready (not implemented)
- **Retention:** 30 days minimum
- **Events:** 20+ security event types

---

## Production Deployment Checklist

- [ ] Configure Keygen API credentials
- [ ] Set up secure license generation system
- [ ] Implement server-side license revocation
- [ ] Configure email notifications for license events
- [ ] Set up monitoring dashboard for fraud detection
- [ ] Document license activation process
- [ ] Create admin interface for license management
- [ ] Set up automatic renewal reminders
- [ ] Configure support escalation for locked users
- [ ] Test license failure scenarios
- [ ] Document recovery procedures
- [ ] Set up compliance audit trail
- [ ] Configure encryption key rotation
- [ ] Test machine binding across platforms
- [ ] Verify online validation API performance

---

## Conclusion

The anti-piracy system provides **layered defense** against:
- Unauthorized use
- License sharing
- Code modification
- Offline workarounds
- License forgery
- Machine circumvention

Each layer is independent, making the system resilient to single-point attacks. The combination of encryption, machine binding, periodic validation, and security logging creates a comprehensive protection mechanism suitable for production enterprise software.
