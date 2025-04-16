import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { useApp } from '../contexts/AppProvider';

export const useAxiosMutation = ({
    method = 'post', // 'post' | 'put' | 'delete'
    url,
    notify = true,
    invalidateKeys = [], // array de claves para invalidar caché después de mutar
}) => {
    const queryClient = useQueryClient();
    const { handleNotificacion } = useApp();

    const mutationFn = async (payload) => {
        const response = await axiosInstance({
            method,
            url,
            data: payload,
        });
        return response.data;
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, __, context) => {
            if (notify) {
                handleNotificacion('success', 'Operación exitosa', 3000);
            }
            invalidateKeys.forEach((key) => {
                queryClient.invalidateQueries({ queryKey: key });
            });
        },
        onError: (error) => {
            const msg = error?.response?.data?.detail || 'Error inesperado';
            if (notify) handleNotificacion('error', msg, 5000);
        },
    });
};
