import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import AntiPiracyService from '../../../../application/services/AntiPiracyService';

interface LicenseContextType {
  isLicenseValid: boolean;
  licenseInfo: any;
  checkLicense: () => Promise<void>;
  licenseStatus: {
    isValid: boolean;
    isExpired: boolean;
    message: string;
  };
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export const useLicense = () => {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within LicenseProvider');
  }
  return context;
};

interface LicenseProviderProps {
  children: ReactNode;
}

const LicenseProvider: React.FC<LicenseProviderProps> = ({ children }) => {
  const [isLicenseValid, setIsLicenseValid] = useState(true);
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [licenseStatus, setLicenseStatus] = useState({
    isValid: true,
    isExpired: false,
    message: '',
  });
  const [antiPiracyService] = useState(() => new AntiPiracyService());

  // Developer mode bypass - check for development environment or localStorage flag
  const isDeveloperMode = (): boolean => {
    // Check if running in development environment
    if (process.env.NODE_ENV === 'development') return true;
    
    // Check if developer flag is set in localStorage
    const devFlag = localStorage.getItem('ROBOTCOM_DEV_MODE');
    if (devFlag === 'true') return true;
    
    // Check if running in Electron with dev tools enabled
    if ((window as any).__DEV__ === true) return true;
    
    return false;
  };

  const checkLicense = async () => {
    try {
      setIsChecking(true);

      // If in developer mode, skip license checks
      if (isDeveloperMode()) {
        console.log('🔧 Developer mode enabled - skipping license validation');
        setIsLicenseValid(true);
        setLicenseStatus({
          isValid: true,
          isExpired: false,
          message: 'Developer mode - license checks disabled',
        });
        setIsChecking(false);
        return;
      }

      // Perform anti-piracy check
      const result = await antiPiracyService.performSecurityCheck();

      setLicenseStatus({
        isValid: result.canContinue,
        isExpired: result.isExpired,
        message: result.message,
      });

      if (result.canContinue) {
        // Also check with Electron API if available
        if (window.electronAPI?.validateLicense) {
          const electronResult = await window.electronAPI.validateLicense();
          setIsLicenseValid(electronResult);
        } else {
          setIsLicenseValid(true); // Development mode
        }
      } else {
        setIsLicenseValid(false);
      }
    } catch (error) {
      console.error('License check failed:', error);
      // In development mode, don't block on license check errors
      if (isDeveloperMode()) {
        setIsLicenseValid(true);
        setLicenseStatus({
          isValid: true,
          isExpired: false,
          message: 'Developer mode - license error ignored',
        });
      } else {
        setIsLicenseValid(false);
        setLicenseStatus({
          isValid: false,
          isExpired: false,
          message: 'License validation error',
        });
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkLicense();
    
    // Start license monitoring
    antiPiracyService.startLicenseMonitoring();

    return () => {
      antiPiracyService.stopLicenseMonitoring();
    };
  }, [antiPiracyService]);

  const value = {
    isLicenseValid,
    licenseInfo,
    checkLicense,
    licenseStatus,
  };

  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isLicenseValid) {
    return (
      <Box sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Box sx={{ maxWidth: '500px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h4" sx={{ mb: 2, color: '#d32f2f' }}>
            License Required
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {licenseStatus.message || 'Please activate your license to use this application.'}
          </Alert>
          <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
            {licenseStatus.isExpired 
              ? 'Your license has expired. Please renew it to continue using RobotComLab.'
              : 'Your application license is invalid or missing. Please contact support to activate your license.'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={checkLicense}
            >
              Retry
            </Button>
            <Button 
              variant="outlined"
              href="https://robotcomlab.com/activate"
              target="_blank"
            >
              Activate License
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
};

export default LicenseProvider;
