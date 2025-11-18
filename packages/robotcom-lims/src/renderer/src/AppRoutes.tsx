import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './presentation/components/layout/MainLayout';
import ProtectedRoute from './presentation/components/auth/ProtectedRoute';
import LoginPage from './presentation/pages/Auth/LoginPage';
import SignupPage from './presentation/pages/Auth/SignupPage';
import Dashboard from './presentation/pages/Dashboard';
import OrderEntry from './presentation/pages/OrderEntry';
import { OrderHistory } from './presentation/pages/OrderHistory';
import { TestResultsEntry } from './presentation/pages/TestResultsEntry';
import { TestResultFormPage } from './presentation/pages/TestResultFormPage';
import Patients from './presentation/pages/Patients/Patients';
import Tests from './presentation/pages/Tests/Tests';
import Billing from './presentation/pages/Billing/Billing';
import Commissions from './presentation/pages/Commissions/Commissions';
import Inventory from './presentation/pages/Inventory/Inventory';
import Samples from './presentation/pages/Samples/Samples';
import Settings from './presentation/pages/Settings/Settings';
import Company from './presentation/pages/Company/Company';

// Test Modules
import { OrdenExamen } from './presentation/components/TestModules';
import { QuimicaSanguinea } from './presentation/components/TestModules';
import { Hematologia } from './presentation/components/TestModules';
import { GeneralOrina } from './presentation/components/TestModules';
import { Heces } from './presentation/components/TestModules';
import { Bacteriologia } from './presentation/components/TestModules';
import { Espermiograma } from './presentation/components/TestModules';
import { Inmunologia } from './presentation/components/TestModules';
import { Hormonas } from './presentation/components/TestModules';
import { Embarazo } from './presentation/components/TestModules';
import { TipoSangre } from './presentation/components/TestModules';
import { Coagulacion } from './presentation/components/TestModules';
import { ELISA } from './presentation/components/TestModules';
import { Diversos } from './presentation/components/TestModules';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
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
        path="/order-entry"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrderEntry />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/order-history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrderHistory />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/test-results"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TestResultsEntry />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/test-results/:testType/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TestResultFormPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Test Modules Routes */}
      <Route
        path="/test-order"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrdenExamen />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/chemistry"
        element={
          <ProtectedRoute>
            <MainLayout>
              <QuimicaSanguinea />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/hematology"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Hematologia />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/urinalysis"
        element={
          <ProtectedRoute>
            <MainLayout>
              <GeneralOrina />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/stool"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Heces />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/bacteriology"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Bacteriologia />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/semen"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Espermiograma />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/immunology"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Inmunologia />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/hormones"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Hormonas />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/pregnancy"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Embarazo />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/blood-type"
        element={
          <ProtectedRoute>
            <MainLayout>
              <TipoSangre />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/coagulation"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Coagulacion />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/elisa"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ELISA />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tests/miscellaneous"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Diversos />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/company"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Company />
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
        path="/samples"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Samples />
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
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
