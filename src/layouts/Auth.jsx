import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthProvider';

const Auth = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/dashboard/" /> : <Outlet />;
};

export default Auth;
