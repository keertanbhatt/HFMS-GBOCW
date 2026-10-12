import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROLES } from './constants/roles';
import { AuthProvider } from './hooks/useAuth.jsx';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import ShramSevaFormPage from './pages/ShramSevaFormPage';
import ShramSevaAdminDashboard from './pages/ShramSevaAdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/shram-seva"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <ShramSevaAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <SchemesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes/:id"
            element={
              <ProtectedRoute roles={[ROLES.ADMIN, ROLES.ACCOUNTANT]}>
                <SchemeDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shram-seva"
            element={
              <ProtectedRoute roles={[ROLES.SHRAM_SEVA_KENDRA]}>
                <ShramSevaFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
