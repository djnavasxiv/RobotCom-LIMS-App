import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import LicenseProvider from './presentation/components/auth/LicenseProvider';
import ErrorBoundary from './presentation/components/ErrorBoundary';
import ProfileBadge from '../presentation/components/ProfileBadge';
import LoggerService from './application/services/LoggerService';

function App(): JSX.Element {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        LoggerService.error(
          'Application Error Caught',
          error,
          'App'
        );
      }}
    >
      <BrowserRouter>
        <LicenseProvider>
          <ProfileBadge />
          <AppRoutes />
        </LicenseProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
