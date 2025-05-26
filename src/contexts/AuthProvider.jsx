import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useApp } from './AppProvider';
import { useAxios } from '@hooks/useAxios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request } = useAxios(); // ¡aquí la magia!
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : {};
    });
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
            setUser(response.user);
            localStorage.setItem('isAuth', "true");
            localStorage.setItem('user', JSON.stringify(response.user));
            navigate('/dashboard/');
        }
        setLoading(false);
    };

    const register = async (data) => {
        setLoading(true);
        // Enviar la solicitud de registro
        const response = await request({
            method: 'post',
            url: '/register',
            payload: data,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);

        const success = response ? true : false;
        return success;
    }

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
        localStorage.removeItem('isAuth');
        localStorage.removeItem('user');
        setUser({});
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

        if (response) {
            setUser(response);
        }

        setLoading(false);
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
        const passData = {
            current_password: data.password,
            new_password: data.newPassword,
            confirm_password: data.confirmPassword
        };
        const response = await request({
            method: 'put',
            url: '/profile/update_password',
            payload: passData,
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

    const verifyEmail = async (token) => {
        setLoading(true);
        const response = await request({
            method: 'post',
            url: `/verify-email/${token}`,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            handleNotificacion('success', response.msg, 5000);
        }
        setLoading(false);

        const success = response ? true : false;
        return success;
    };

    useEffect(() => {
        // Actualiza el localStorage con el usuario actual
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const contextValue = useMemo(() => {
        // Verifica si el usuario está autenticado
        const isAuthenticated = Object.keys(user).length !== 0 || localStorage.getItem('isAuth') === "true";

        return{
        user,
        loading,
        isAuthenticated,
        setUser,
        login,
        register,
        verifyEmail,
        logout,
        profile,
        updateProfile,
        updatePassword,
        uploadAvatar
    }}, [user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);