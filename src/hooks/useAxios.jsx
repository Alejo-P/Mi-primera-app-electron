import { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useApp } from '../contexts/AppProvider';

export const useAxios = () => {
    const { handleNotificacion } = useApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const request = async ({ method, url, payload = null, config = {}, notify = true }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance({
                method,
                url,
                data: payload,
                ...config
            });

            setData(response.data);

            if (notify) {
                handleNotificacion('success', 'Operación exitosa', 4000);
            }

            return response.data;
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.detail || 'Error inesperado';

            if (notify) {
                handleNotificacion('error', message, 5000);
            }

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, request };
};