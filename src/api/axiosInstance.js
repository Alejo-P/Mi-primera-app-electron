import axios from 'axios';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // 👈 ESTA LÍNEA es CLAVE
});

axiosInstance.interceptors.request.use(
    config => {
        // Obtener el token de acceso de las cookies
        const csrf_access_token = Cookies.get('csrf_access_token');

        // Agregar el token de acceso a las cabeceras de la solicitud
        if (csrf_access_token) {
            config.headers['X-CSRF-Token'] = csrf_access_token;
        } else {
            console.warn('No se encontró csrf_access_token en cookies');
        }
        return config;
    }
)

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        console.log('axiosInstance.js: error', error); // Log the error response
        console.log('axiosInstance.js: originalRequest', originalRequest); // Log the original request
        // Copiar los errores en el portapapeles
        navigator.clipboard.writeText(JSON.stringify(error.response?.data, null, 2)).then(() => {
            console.log('Error copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el error al portapapeles', err);
        });

        // Si ya intentamos refrescar, no lo volvemos a hacer
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const csrf_refresh_token = Cookies.get('csrf_refresh_token');
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrf_refresh_token,
                    },
                    withCredentials: true, // Asegúrate de que esto esté habilitado para enviar cookies
                });

                // Volver a intentar la petición
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Falló el refresh: redirigir a login o cerrar sesión y limpiar las cookies
                console.error('Error al refrescar el token', refreshError);
                // Aquí puedes limpiar las cookies si es necesario
                Cookies.remove('csrf_access_token');
                Cookies.remove('csrf_refresh_token');
                window.location.href = '/login'; // o usar navigate si estás dentro de React
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;