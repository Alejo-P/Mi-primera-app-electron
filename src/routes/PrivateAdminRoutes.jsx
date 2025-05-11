import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthProvider';
import { ROLES } from '@constants/roles';

const PrivateAdminRoles = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user.roles?.includes(ROLES.ADMIN);

  return isAuthenticated
    ? isAdmin
      ? <Outlet />
      : <Navigate to="/dashboard/" />
    : <Navigate to="/" />;
};

export default PrivateAdminRoles;
