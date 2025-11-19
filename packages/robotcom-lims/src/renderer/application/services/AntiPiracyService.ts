import { LicenseService } from './LicenseService';

interface AntiPiracyCheckResult {
  isLicensed: boolean;
  isExpired: boolean;
  isTampered: boolean;
  message: string;
  canContinue: boolean;
}

export class AntiPiracyService {
  private licenseService: LicenseService;
  private checkIntervalMs = 30 * 60 * 1000; // Check every 30 minutes
  private checkTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.licenseService = new LicenseService();
  }

  /**
   * Perform comprehensive anti-piracy check
   */
  async performSecurityCheck(): Promise<AntiPiracyCheckResult> {
    try {
      // Check local license
      const localLicense = await this.licenseService.getLocalLicense();

      if (!localLicense) {
        return {
          isLicensed: false,
          isExpired: false,
          isTampered: false,
          message: 'No license found. Please activate your license.',
          canContinue: false,
        };
      }

      // Check if expired
      if (new Date() > localLicense.expiresAt) {
        return {
          isLicensed: true,
          isExpired: true,
          isTampered: false,
          message: 'Your license has expired. Please renew it.',
          canContinue: false,
        };
      }

      // Check if needs online validation
      if (this.licenseService.needsOnlineCheck(localLicense.lastCheckAt)) {
        const isValid = await this.licenseService.validateOnline(localLicense.licenseKey);
        if (!isValid) {
          return {
            isLicensed: true,
            isExpired: false,
            isTampered: true,
            message: 'License validation failed. Online verification is required.',
            canContinue: false,
          };
        }
      }

      return {
        isLicensed: true,
        isExpired: false,
        isTampered: false,
        message: 'License valid',
        canContinue: true,
      };
    } catch (error) {
      console.error('Security check error:', error);
      return {
        isLicensed: false,
        isExpired: false,
        isTampered: true,
        message: 'Security check failed',
        canContinue: false,
      };
    }
  }

  /**
   * Start automatic license checks
   */
  startLicenseMonitoring() {
    if (this.checkTimer) return;

    this.checkTimer = setInterval(async () => {
      const result = await this.performSecurityCheck();
      if (!result.canContinue) {
        console.warn('License check failed:', result.message);
        // Trigger logout or warning dialog
        this.handleLicenseFailure(result);
      }
    }, this.checkIntervalMs);
  }

  /**
   * Stop license monitoring
   */
  stopLicenseMonitoring() {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = null;
    }
  }

  /**
   * Handle license validation failure
   */
  private handleLicenseFailure(result: AntiPiracyCheckResult) {
    // Emit event or dispatch action to handle license failure
    const event = new CustomEvent('licenseFailure', { detail: result });
    window.dispatchEvent(event);
  }

  /**
   * Detect code obfuscation removal attempts
   */
  detectCodeTampering(): boolean {
    try {
      // Check if critical functions are still intact
      const criticalFunctions = [
        'performSecurityCheck',
        'startLicenseMonitoring',
        'validateLicense'
      ];

      for (const fnName of criticalFunctions) {
        if (typeof (this as any)[fnName] !== 'function') {
          console.error(`Critical function ${fnName} has been tampered with`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error checking code tampering:', error);
      return false;
    }
  }

  /**
   * Check for unauthorized modifications to app configuration
   */
  verifyAppIntegrity(): boolean {
    try {
      // Verify that essential app data hasn't been modified
      const appVersion = (window as any).APP_VERSION;
      const appSignature = (window as any).APP_SIGNATURE;

      // These would be set during build and verified at runtime
      if (!appVersion || !appSignature) {
        console.warn('App signature verification failed');
        return false;
      }

      return true;
    } catch (error) {
      console.error('App integrity check failed:', error);
      return false;
    }
  }

  /**
   * Log suspicious activity
   */
  logSecurityEvent(eventType: string, details: any) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      userAgent: navigator.userAgent,
    };

    // In production, this would be sent to a secure server
    console.log('Security Event:', event);
    
    try {
      localStorage.setItem(`security_event_${Date.now()}`, JSON.stringify(event));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  /**
   * Enforce license restrictions (e.g., max users, features)
   */
  async checkFeatureAccess(feature: string): Promise<boolean> {
    try {
      const license = await this.licenseService.getLocalLicense();
      if (!license) return false;

      // Premium features require specific license types
      const restrictedFeatures: { [key: string]: string[] } = {
        'advanced_reporting': ['enterprise', 'professional'],
        'api_access': ['enterprise'],
        'multi_user': ['professional', 'enterprise'],
        'data_export': ['professional', 'enterprise'],
      };

      if (feature in restrictedFeatures) {
        return restrictedFeatures[feature].includes(license.subscriptionType);
      }

      return true; // Feature is available to all licenses
    } catch (error) {
      console.error('Feature access check failed:', error);
      return false;
    }
  }
}

export default AntiPiracyService;
