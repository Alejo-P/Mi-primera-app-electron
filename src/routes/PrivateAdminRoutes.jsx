import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Importamos el contexto
import { useAuth } from '@contexts/AuthProvider'

// Importamos las constantes
import { ROLES } from '@constants/roles'

const PrivateAdminRoles = () => {
    const { user } = useAuth();
    const csrf_access_token = Cookies.get('csrf_access_token');
    const isAuthenticated = csrf_access_token ? true : false;
    const isAdmin = user && user.roles.some(role => role === ROLES.ADMIN) ? true : false;

    return (
        isAuthenticated ? (
            isAdmin ? (
                <Outlet />
            ) : (
                <Navigate to="/dashboard/" />
            )
        ) : (
            <Navigate to="/" />
        )
    );
}

export default PrivateAdminRoles
