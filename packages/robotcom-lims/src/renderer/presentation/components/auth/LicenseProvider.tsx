import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../application/state/authStore';
import { LicenseService } from '../../application/services/LicenseService';
import { License } from '../../domain/entities/License';
import { CircularProgress, Box, Typography } from '@mui/material';
import ActivationPage from '../../presentation/pages/Auth/ActivationPage';

interface LicenseProviderProps {
  children: React.ReactNode;
}

const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const [licenseStatus, setLicenseStatus] = useState<'VALID' | 'INVALID' | 'GRACE_PERIOD' | 'NONE'>('NONE');
  const [isLoading, setIsLoading] = useState(true);
  const [gracePeriodDays, setGracePeriodDays] = useState(0);
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
            setLicenseStatus('VALID');
          } else {
            // Handle invalid license, grace period, etc.
            if (localLicense.gracePeriodEnds && localLicense.gracePeriodEnds > new Date()) {
              setLicenseStatus('GRACE_PERIOD');
              const diffTime = Math.abs(localLicense.gracePeriodEnds.getTime() - new Date().getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              setGracePeriodDays(diffDays);
            } else {
              setLicenseStatus('INVALID');
            }
          }
        } else {
          setLicenseStatus('VALID');
        }
      } else {
        setLicenseStatus('NONE');
      }
      setIsLoading(false);
    };

    checkLicense();
  }, []);

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (licenseStatus === 'VALID') {
    return <>{children}</>;
  }

  if (licenseStatus === 'GRACE_PERIOD') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">La licencia no pudo ser validada</Typography>
        <Typography>El programa seguirá funcionando por {gracePeriodDays} días.</Typography>
        <Button onClick={() => setLicenseStatus('VALID')} variant="contained" sx={{mt: 2}}>Continuar</Button>
      </Box>
    );
  }

  return <ActivationPage onActivationSuccess={() => window.location.reload()} />;
};

export default LicenseProvider;
