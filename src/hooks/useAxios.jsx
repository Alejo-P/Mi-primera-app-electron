// Este hook personalizado se encarga de realizar peticiones HTTP utilizando axios y maneja la notificación de errores y éxitos a través del contexto de la aplicación.
import axiosInstance from '../api/axiosInstance';
import { useApp } from '../contexts/AppProvider';

export const useAxios = () => {
    const { handleNotificacion } = useApp(); // Importa la función de notificación del contexto de la aplicación
    let data = null; // Variable para almacenar la respuesta de la API
    let error = null; // Variable para almacenar el error de la API

    const request = async ({ method, url, payload = null, config = {}, notify = true }) => {
        try {
            const response = await axiosInstance({
                method,
                url,
                data: payload,
                ...config
            });

            console.log('useAxios.jsx: response', response); // Log the response data

            data = response.data; // Almacena la respuesta en la variable data
            error = null; // Resetea el error si la respuesta es exitosa

            if (notify) {
                handleNotificacion('success', data.msg, 4000);
            }
            return data; // Devuelve la respuesta de la API
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.detail || 'Error inesperado';
            error = message; // Almacena el error en la variable error
            data = null; // Resetea la respuesta si hay un error

            if (notify) {
                handleNotificacion('error', message, 5000);
            }
            return null; // Devuelve null si hay un error
        }
    };

    return { error, data, request };
};