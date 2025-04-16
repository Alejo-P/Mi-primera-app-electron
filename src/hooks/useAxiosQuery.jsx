import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { useApp } from '../contexts/AppProvider';

export const useAxiosQuery = ({ queryKey, url, enabled = true, notify = true, select }) => {
    const { handleNotificacion } = useApp();

    const fetchData = async () => {
        const response = await axiosInstance.get(url);
        return response.data;
    };

    return useQuery({
        queryKey,
        queryFn: fetchData,
        enabled,
        select,
        onError: (error) => {
            const msg = error?.response?.data?.detail || 'Error inesperado';
            if (notify) handleNotificacion('error', msg, 5000);
        },
    });
};
