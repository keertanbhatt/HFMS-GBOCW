import { Navigate } from 'react-router-dom';
import { homePathForRole } from '../constants/roles';
import { useAuth } from '../hooks/useAuth.jsx';

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to={homePathForRole(user?.role)} replace />;
  }
  return children;
}

export function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={homePathForRole(user?.role)} replace />;
  }
  return children;
}
