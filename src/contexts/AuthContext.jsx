import { createContext, useContext, useState, useMemo } from 'react';
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

    // Iniciar sesión
    const login = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/login`, data);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            handleNotificacion('success', 'Sesión iniciada correctamente', 5000);
            navigate('/dashboard/');
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    // Cerrar sesión
    const logout = async () => {
        try {
            const response = await axios.post(`${URL_BACKEND}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    "Content-Type": "application/json",
                }
            });
            setUser(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/login');
            handleNotificacion('success', response.data.msg, 5000);
        } catch (error) {       
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    // Obtener perfil del usuario
    const profile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
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
                refresh_token: localStorage.getItem('refresh_token'),
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    "Content-Type": "application/json",
                }
            }); 
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            handleNotificacion('success', 'Token de acceso actualizado', 5000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

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