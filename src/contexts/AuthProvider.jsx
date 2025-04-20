import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from './AppProvider';
import { useAxios } from '../hooks/useAxios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request } = useAxios(); // ¡aquí la magia!
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async (data) => {
        const response = await request({
            method: 'post',
            url: '/login',
            payload: data,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            //handleNotificacion('success', response.msg, 5000);
            navigate('/dashboard/');
        }
    };

    const logout = async () => {
        const response = await request({
            method: 'post',
            url: '/logout',
            notify: {
                success: true,
                error: true
            }
        });

        setUser(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const profile = async () => {
        const response = await request({
            method: 'get',
            url: '/profile',
            notify: {
                success: false,
                error: true
            }
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
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            localStorage.setItem('access_token', response.access_token);
            localStorage.setItem('refresh_token', response.refresh_token);
            handleNotificacion('success', 'Token de acceso actualizado', 5000);
        } else {
            // Si el refresh falla, probablemente sea necesario cerrar sesión
            setUser(null);
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
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', 'Rol añadido correctamente', 5000);
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
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', 'Rol eliminado correctamente', 5000);
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