// src/components/PrivateRoute.jsx
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = () => {
  const csrf_access_token = Cookies.get('csrf_access_token');

  return csrf_access_token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
