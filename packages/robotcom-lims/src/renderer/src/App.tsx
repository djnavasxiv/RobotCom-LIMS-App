import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import LicenseProvider from './presentation/components/auth/LicenseProvider';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <LicenseProvider>
        <AppRoutes />
      </LicenseProvider>
    </BrowserRouter>
  );
}

export default App;
