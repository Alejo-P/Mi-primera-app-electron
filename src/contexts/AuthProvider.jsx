import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from './AppProvider';
import { useAxios } from '../hooks/useAxios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request, loading } = useAxios(); // ¡aquí la magia!
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (data) => {
        console.log('AuthProvider.jsx: Iniciando sesión...');
        const response = await request({
            method: 'post',
            url: '/login',
            payload: data
        });

        if (response) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            handleNotificacion('success', 'Sesión iniciada correctamente', 5000);
            navigate('/dashboard/');
        }
    };

    const logout = async () => {
        const response = await request({
            method: 'post',
            url: '/logout',
            notify: false // ya notificamos después nosotros
        });

        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');

        if (response?.msg) {
            handleNotificacion('success', response.msg, 5000);
        }
    };

    const profile = async () => {
        const response = await request({
            method: 'get',
            url: '/profile',
            notify: false
        });

        if (response) {
            setUser(response);
        } else {
            await refreshToken();
        }
    };

    const refreshToken = async () => {
        const response = await request({
            method: 'post',
            url: '/refresh',
            notify: false
        });

        if (response) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            handleNotificacion('success', 'Token de acceso actualizado', 5000);
        } else {
            // Si el refresh falla, probablemente sea necesario cerrar sesión
            logout();
        }
    };

    const addRole = async (role, user_id) => {
        const response = await request({
            method: 'post',
            url: '/add_role',
            payload: {
                role_name: role,
                user_id: user_id
            },
            notify: false
        });

        if (response) {
            handleNotificacion('success', 'Rol añadido correctamente', 5000);
        } else {
            handleNotificacion('error', 'Error al añadir el rol', 5000);
        }
    }

    const removeRole = async (role, user_id) => {
        const response = await request({
            method: 'delete',
            url: '/remove_role',
            payload: {
                role_name: role,
                user_id: user_id
            },
            notify: false
        });

        if (response) {
            handleNotificacion('success', 'Rol eliminado correctamente', 5000);
        } else {
            handleNotificacion('error', 'Error al eliminar el rol', 5000);
        }
    }

    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        profile,
        refreshToken,
        addRole,
        removeRole,
    }), [user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);