import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './presentation/components/layout/MainLayout';
import Dashboard from './presentation/pages/Dashboard';
import Patients from './presentation/pages/Patients/Patients';
import Tests from './presentation/pages/Tests/Tests';
import Billing from './presentation/pages/Billing/Billing';
import Inventory from './presentation/pages/Inventory/Inventory';
import Settings from './presentation/pages/Settings/Settings';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
