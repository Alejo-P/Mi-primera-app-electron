import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Importamos el contexto
import { useApp } from './AppProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

    // Iniciar sesión
    const login = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/login`, data);
            setTokens(response.data);
            handleNotificacion('success', 'Sesión iniciada correctamente', 5000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error?.response?.data?.message || error.message, 5000);
        }
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        handleNotificacion('success', 'Sesión cerrada correctamente', 5000);
    };

    // Obtener perfil del usuario
    const profile = async () => {
        try {
            const response = await axios.get(`${URL_BACKEND}/profile`, {
                headers: {
                    Authorization: `Bearer ${tokens?.access_token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error?.response?.data?.message || error.message, 5000);
        }
    };

    // Refrescar token de acceso
    const refreshToken = async () => {
        try {
            const response = await axios.post(`${URL_BACKEND}/refresh`, {
                refresh_token: tokens?.refresh_token
            });
            setTokens(response.data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error?.response?.data?.message || error.message, 5000);
        }
    };

    // Verificar si el token de acceso no ha expirado
    const isTokenValid = () => {
        return tokens?.expires_in > Math.floor(Date.now() / 1000);
    };

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        profile,
        refreshToken
    }), [user, tokens]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>  useContext(AuthContext);