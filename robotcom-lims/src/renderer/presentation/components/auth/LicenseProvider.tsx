import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../application/state/authStore';
import { LicenseService } from '../../application/services/LicenseService';
import { License } from '../../domain/entities/License';
import { CircularProgress, Box } from '@mui/material';
import ActivationPage from '../../presentation/pages/Auth/ActivationPage';

interface LicenseProviderProps {
  children: React.ReactNode;
}

const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const [license, setLicense] = useState<License | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const licenseService = new LicenseService();

  useEffect(() => {
    const checkLicense = async () => {
      const localLicense = await licenseService.getLocalLicense();
      if (localLicense) {
        if (licenseService.needsOnlineCheck(localLicense.lastCheckAt)) {
          const isValid = await licenseService.validateOnline(localLicense.licenseKey);
          if (isValid) {
            localLicense.touch();
            await (licenseService as any).licenseRepository.save(localLicense);
            setLicense(localLicense);
          } else {
            // Handle invalid license, grace period, etc.
            setLicense(null);
          }
        } else {
          setLicense(localLicense);
        }
      } else {
        setLicense(null);
      }
      setIsLoading(false);
    };

    checkLicense();
  }, []);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  // A simple check for now. A real implementation would be more robust.
  if (license && license.isActive) {
    return <>{children}</>;
  } else {
    return <ActivationPage onActivationSuccess={() => window.location.reload()} />;
  }
};

export default LicenseProvider;
