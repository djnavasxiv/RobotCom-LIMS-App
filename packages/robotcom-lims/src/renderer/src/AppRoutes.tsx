import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './presentation/components/layout/MainLayout';
import ProtectedRoute from './presentation/components/auth/ProtectedRoute';
import LoginPage from './presentation/pages/Auth/LoginPage';
import Dashboard from './presentation/pages/Dashboard';
import Patients from './presentation/pages/Patients/Patients';
import Tests from './presentation/pages/Tests/Tests';
import Billing from './presentation/pages/Billing/Billing';
import Commissions from './presentation/pages/Commissions/Commissions';
import Inventory from './presentation/pages/Inventory/Inventory';
import Settings from './presentation/pages/Settings/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/tests" element={<Tests />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/commissions" element={<Commissions />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
