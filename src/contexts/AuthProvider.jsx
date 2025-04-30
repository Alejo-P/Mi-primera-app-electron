import { createContext, useContext, useState, useMemo } from 'react';
import Cookies from 'js-cookie';
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
        setLoading(true);
        // Enviar la solicitud de inicio de sesión
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
            //handleNotificacion('success', response.msg, 5000);
            navigate('/dashboard/');
        }
        setLoading(false);
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

        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }
        // Eliminar los tokens de las cookies
        Cookies.remove('csrf_access_token');
        Cookies.remove('csrf_refresh_token');
        setUser(null);
        navigate('/');
    };

    const profile = async () => {
        setLoading(true);
        const response = await request({
            method: 'get',
            url: '/profile',
            notify: {
                success: false,
                error: true
            }
        });

        setLoading(false);
        if (response) {
            setUser(response);
        } else {
            await refreshToken();
        }
    };

    const updateProfile = async (data) => {
        setLoading(true);
        const response = await request({
            method: 'put',
            url: '/profile',
            payload: data,
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', response.msg, 5000);
            setUser(response.user);
        }
        setLoading(false);
    };

    const updatePassword = async (data) => {
        setLoading(true);
        const response = await request({
            method: 'put',
            url: '/profile/update_password',
            payload: data,
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);
    };

    const uploadAvatar = async (formData) => {
        setLoading(true);
        const response = await request({
            method: 'put',
            url: '/profile/upload_avatar',
            payload: formData,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            },
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', 'Avatar actualizado correctamente', 5000);
            setUser({ ...user, avatar: response.avatar });
        }
        setLoading(false);
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
            const updatedUser = { ...user };
            if (!updatedUser.roles) {
                updatedUser.roles = [];
            }
            updatedUser.roles.push(role);
            setUser(updatedUser);
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
            const updatedUser = { ...user };
            updatedUser.roles = updatedUser.roles.filter(r => r !== role);
            setUser(updatedUser);
        }
    }

    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        profile,
        updateProfile,
        updatePassword,
        uploadAvatar,
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