import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
    const [fileList, setFileList] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [notificacion, setNotificacion] = useState(null);
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;

    // Muestra una notificación temporalmente
    const handleNotificacion = (type, content, timeout = 3000) => {
        setNotificacion({ 
            type,
            content,
            onClose: () => setNotificacion(null),
            duration: timeout
        });
    };

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
                handleNotificacion('success', 'Archivos cargados correctamente', 5000);
            }

            setFileList(data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar los archivos', 5000);
        } finally {
            setLoadingFiles(false);
        }
    };

    // Descargar un archivo por su nombre
    const downloadFile = async (name) => {};

    // Eliminar un archivo por su nombre
    const deleteFile = async (name) => {};

    // Eliminar todos los archivos
    const deleteAllFiles = async () => {};

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({ fileList, getFiles, getFile, downloadFile, deleteFile, deleteAllFiles, notificacion, handleNotificacion, loadingFiles }), [fileList, notificacion]);

    return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>;
}

export const useFiles = () => useContext(FilesContext);