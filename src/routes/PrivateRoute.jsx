import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthProvider';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
