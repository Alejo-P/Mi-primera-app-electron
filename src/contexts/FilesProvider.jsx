import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';

// Importamos el contexto
import { useAxios } from '../hooks/useAxios';
import { useApp } from './AppProvider';
import { useQR } from './QRProvider';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request, loading, error } = useAxios(); // ¡aquí la magia!
    const { getQRs } = useQR();
    const [fileList, setFileList] = useState([]);
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

    // 1. Obtener contenido de un archivo individual
    const getFile = async (name) => {
        try {
            const response = await request({
                method: 'get',
                url: `/file/${name}`,
                notify: false,
            });

            return response;
        } catch (error) {
            console.error(error);
            handleNotificacion('error', `Error al cargar el archivo ${name}`, 5000);
            return null;
        }
    };

    // 2. Obtener lista de nombres de archivos
    const getFiles = async () => {
        const response = await request({
            method: 'get',
            url: '/files',
            notify: false,
        });
        if (response) {
            let data = [];
            data = await Promise.all(
                response.files.map(async (file) => {
                    const { file:fileData } = await getFile(file);
                    return { ...fileData };
                })
            );
            setFileList(data);
            
        } else {
            handleNotificacion('error', error, 5000);
        }
    };

    // Subir un archivo
    const uploadFile = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/upload`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            handleNotificacion('success', response.data.msg, 5000);
            getFiles();
        } catch (error) {
            console.error(error);
            handleNotificacion('error',  error, 5000);
        }
    }

    // Descargar un archivo por su nombre
    const downloadFile = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/download/file/${name}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            handleNotificacion('error',  error, 5000);
        }
    };

    // Eliminar un archivo por su nombre
    const deleteFile = async (name) => {
        try {
            const response = await axios.delete(`${URL_BACKEND}/delete/file/${name}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            setFileList((prev) => prev.filter((file) => file.filename !== name));
            setQRList((prev) => prev.filter((qr) => qr.filename !== name));
            handleNotificacion('success', response.data.msg, 5000);
            setTimeout(() => {
                getQRs();
            }, 2000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error',  error, 5000);
        }
    };

    // Eliminar todos los archivos
    const deleteAllFiles = async () => {
        try {
            const response = await axios.delete(`${URL_BACKEND}/delete/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
            setFileList([]);
            handleNotificacion('success', response.data.msg, 5000);
            setTimeout(() => {
                getQRs();
            }, 2000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        }
    };

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        fileList,
        uploadFile,
        getFiles,
        getFile,
        downloadFile,
        deleteFile,
        deleteAllFiles,
        loading
    }), [fileList, loading]);

    return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>;
}

export const useFiles = () => useContext(FilesContext);