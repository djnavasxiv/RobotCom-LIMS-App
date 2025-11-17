import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './presentation/components/layout/MainLayout';
import ProtectedRoute from './presentation/components/auth/ProtectedRoute';
import LoginPage from './presentation/pages/Auth/LoginPage';
import SignupPage from './presentation/pages/Auth/SignupPage';
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
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/patients"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Patients />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tests"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Tests />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Billing />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/commissions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Commissions />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Inventory />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Settings />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
