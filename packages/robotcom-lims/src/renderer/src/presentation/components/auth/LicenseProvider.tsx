import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

interface LicenseContextType {
  isLicenseValid: boolean;
  licenseInfo: any;
  checkLicense: () => Promise<void>;
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
  const [isLicenseValid, setIsLicenseValid] = useState(true); // Default to true for development
  const [licenseInfo, setLicenseInfo] = useState(null);

  const checkLicense = async () => {
    try {
      // Check license via IPC with the main process
      if (window.electronAPI?.license) {
        const result = await window.electronAPI.license.validate();
        setIsLicenseValid(result.isValid);
        setLicenseInfo(result.info);
      } else {
        // Fallback for development without license check
        setIsLicenseValid(true);
      }
    } catch (error) {
      console.error('License check failed:', error);
      setIsLicenseValid(false);
    }
  };

  useEffect(() => {
    checkLicense();
  }, []);

  const value = {
    isLicenseValid,
    licenseInfo,
    checkLicense
  };

  if (!isLicenseValid) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>License Required</h1>
        <p>Please activate your license to use this application.</p>
      </div>
    );
  }

  return (
    <LicenseContext.Provider value={value}>
      {children}
    </LicenseContext.Provider>
  );
};

export default LicenseProvider;
