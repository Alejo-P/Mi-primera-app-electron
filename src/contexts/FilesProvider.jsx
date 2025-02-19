import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Importamos el contexto
import { useApp } from './AppProvider';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const [fileList, setFileList] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

    // Obtener un archivo por su nombre
    const getFile = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/file/${name}`);
            return response.data;
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar el archivo', 5000);
            return null;
        }
    };

    // Obtener todos los archivos
    const getFiles = async () => {
        setLoadingFiles(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/files`);
            let data = [];

            if (response.data?.files.length === 0) {
                handleNotificacion('info', 'No hay archivos cargados', 5000);
            } else {
                data = await Promise.all(
                    response.data.files.map(async (file) => {
                        const source = await getFile(file);
                        return { ...source };
                    })
                );
            }
            setFileList(data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar los archivos', 5000);
        } finally {
            setLoadingFiles(false);
        }
    };

    // Subir un archivo
    const uploadFile = async (data) => {
        try {
            const response = await axios.post(`${URL_BACKEND}/upload`, data);
            handleNotificacion('success', 'Archivo subido correctamente', 5000);
            getFiles();
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al subir el archivo', 5000);
        }
    }

    // Descargar un archivo por su nombre
    const downloadFile = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/download/file/${name}`, {
                responseType: 'blob',
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
            handleNotificacion('error', 'Error al descargar el archivo', 5000);
        }
    };

    // Eliminar un archivo por su nombre
    const deleteFile = async (name) => {
        try {
            await axios.delete(`${URL_BACKEND}/delete/file/${name}`);
            handleNotificacion('success', 'Archivo eliminado correctamente', 5000);
            getFiles();
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al eliminar el archivo', 5000);
        }
    };

    // Eliminar todos los archivos
    const deleteAllFiles = async () => {
        try {
            await axios.delete(`${URL_BACKEND}/delete/all`);
            handleNotificacion('success', 'Archivos eliminados correctamente', 5000);
            getFiles();
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al eliminar los archivos', 5000);
        }
    };

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({ fileList, uploadFile, getFiles, getFile, downloadFile, deleteFile, deleteAllFiles, loadingFiles }), [fileList, loadingFiles]);

    return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>;
}

export const useFiles = () => useContext(FilesContext);