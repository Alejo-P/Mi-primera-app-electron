import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 5000, // Tiempo de espera de 5 segundos
});

// Interceptor de respuesta
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        // Copiar los errores en el portapapeles
        navigator.clipboard.writeText(JSON.stringify(error.response?.data, null, 2)).then(() => {
            console.log('Error copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar el error al portapapeles', err);
        });

        if (error.response?.data?.detail === "Usuario inactivo"){
            // Peticion POST para cerrar sesión
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
            // Redirigir a la página de inicio o a la página de login
            localStorage.removeItem('isAuth'); // Limpiar el estado de autenticación
            console.warn('Usuario inactivo, redirigiendo a la página de inicio');
            window.location.href = '/'; // o usar navigate si estás dentro de React
            return Promise.reject(error);
        }

        // Si ya intentamos refrescar, no lo volvemos a hacer
        if ((error.response?.data?.detail === "Token faltante" || error.response?.data?.detail === "Token inválido o expirado") && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/refresh`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                });

                // Volver a intentar la petición
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Falló el refresh: redirigir a login o cerrar sesión y limpiar las cookies
                console.error('Error al refrescar el token', refreshError);
                // Aquí puedes limpiar las cookies si es necesario
                localStorage.removeItem('isAuth');
                localStorage.removeItem('user');
                window.location.href = '/'; // o usar navigate si estás dentro de React
                return Promise.reject(refreshError);
            }
        }

        if (error.code === 'ECONNABORTED') {
            console.warn('⏱️ La solicitud se canceló por timeout.');
            // Acá también podés notificar visualmente
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;