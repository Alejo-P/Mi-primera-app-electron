import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Importamos el contexto
import { useApp } from './AppProvider';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
    const access_token = localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')).access_token : null;
    const refresh_token = localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')).refresh_token : null;

    // Iniciar sesión
    const login = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/login`, data);
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
        }
    };

    // Refrescar token de acceso
    const refreshToken = async () => {
        try {
            const response = await axios.post(`${URL_BACKEND}/refresh`, {
                refresh_token: refresh_token,
            });
            localStorage.setItem('tokens', JSON.stringify(response.data));
            handleNotificacion('success', 'Token de acceso actualizado', 5000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    useEffect(() => {
        const storedTokens = localStorage.getItem('tokens');
        if (storedTokens) {
            const tokens = JSON.parse(storedTokens);
            if (tokens.access_token) {
                profile();
            }
        }
    }, []);

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        user,
        login,
        logout,
        profile,
        refreshToken
    }), [user]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>  useContext(AuthContext);