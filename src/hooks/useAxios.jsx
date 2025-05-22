// Este hook personalizado se encarga de realizar peticiones HTTP utilizando axios y maneja la notificación de errores y éxitos a través del contexto de la aplicación.
import axiosInstance from '@api/axiosInstance';
import { useApp } from '@contexts/AppProvider';

export const useAxios = () => {
    const { handleNotificacion } = useApp(); // Importa la función de notificación del contexto de la aplicación

    const request = async ({
        method,
        url,
        payload = null,
        config = {},
        notify = {
            success: true,
            error: true
        }
    }) => {
        try {
            const response = await axiosInstance({
                method,
                url,
                data: payload,
                ...config
            });

            console.log('useAxios.jsx: response', response); // Log the response data

            if (notify.success) {
                handleNotificacion('success', response.data.msg, 4000);
            }
            return response.data; // Devuelve la respuesta de la API
        } catch (err) {
            console.error(err);
            const type = err?.code === 'ECONNABORTED' ? 'timeout' : 'error';
            const message =
                err.code === 'ECONNABORTED'
                    ? 'Tiempo de espera agotado, intentelo nuevamente'
                    : err?.response?.data?.detail || 'Error inesperado';

            if (notify.error) {
                handleNotificacion(type, message, 5000);
            }
            return null; // Devuelve null si hay un error
        }
    };

    return { request };
};