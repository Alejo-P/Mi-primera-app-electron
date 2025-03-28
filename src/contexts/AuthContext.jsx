import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Importamos el contexto
import { useApp } from './AppProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
    const [tokens, setTokens] = useState(() => {
        const storedTokens = localStorage.getItem('tokens');
        return storedTokens ? JSON.parse(storedTokens) : null;
    });
    const access_token = tokens?.access_token;
    const refresh_token = tokens?.refresh_token;

    // Iniciar sesión
    const login = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/login`, data);
            setTokens(response.data);
            localStorage.setItem('tokens', JSON.stringify(response.data));
            handleNotificacion('success', 'Sesión iniciada correctamente', 5000);
            navigate('/dashboard/');
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    // Cerrar sesión
    const logout = () => {
        setUser(null);
        localStorage.removeItem('tokens');
        navigate('/login');
        handleNotificacion('success', 'Sesión cerrada correctamente', 5000);
    };

    // Obtener perfil del usuario
    const profile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/profile`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        } finally {
            setLoading(false);
        }
    };

    // Refrescar token
    const refreshToken = async () => {
        try {
            const response = await axios.post(`${URL_BACKEND}/refresh`, {
                refresh_token: refresh_token,
            });
            setTokens(response.data); // Actualiza el estado con los nuevos tokens
            localStorage.setItem('tokens', JSON.stringify(response.data));
            handleNotificacion('success', 'Token de acceso actualizado', 5000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    // useEffect(() => {
    //     const storedTokens = localStorage.getItem('tokens');
    //     if (storedTokens) {
    //         const tokens = JSON.parse(storedTokens);
    //         if (tokens.access_token) {
    //             profile();
    //         }
    //     }
    // }, []);

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        user,
        loading,
        login,
        logout,
        profile,
        refreshToken
    }), [user, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>  useContext(AuthContext);