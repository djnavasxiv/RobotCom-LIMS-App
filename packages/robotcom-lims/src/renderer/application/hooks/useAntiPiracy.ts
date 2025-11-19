import { useEffect, useState } from 'react';
import AntiPiracyService from '../services/AntiPiracyService';

interface LicenseStatus {
  isValid: boolean;
  isExpired: boolean;
  message: string;
  lastChecked: Date | null;
}

export const useAntiPiracy = () => {
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>({
    isValid: true,
    isExpired: false,
    message: '',
    lastChecked: null,
  });
  const [antiPiracyService] = useState(() => new AntiPiracyService());

  useEffect(() => {
    // Perform initial security check
    const checkLicense = async () => {
      const result = await antiPiracyService.performSecurityCheck();
      setLicenseStatus({
        isValid: result.canContinue,
        isExpired: result.isExpired,
        message: result.message,
        lastChecked: new Date(),
      });

      if (!result.canContinue) {
        // Show warning or redirect
        console.warn('License check failed:', result.message);
      }
    };

    checkLicense();

    // Start monitoring
    antiPiracyService.startLicenseMonitoring();

    // Listen for license failure events
    const handleLicenseFailure = (event: any) => {
      setLicenseStatus({
        isValid: false,
        isExpired: event.detail.isExpired,
        message: event.detail.message,
        lastChecked: new Date(),
      });
    };

    window.addEventListener('licenseFailure', handleLicenseFailure);

    return () => {
      antiPiracyService.stopLicenseMonitoring();
      window.removeEventListener('licenseFailure', handleLicenseFailure);
    };
  }, [antiPiracyService]);

  return { licenseStatus, antiPiracyService };
};

export default useAntiPiracy;
