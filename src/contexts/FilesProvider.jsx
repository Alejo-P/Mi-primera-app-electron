import { createContext, useContext, useState, useMemo } from 'react';

// Importamos el contexto
import { useAxios } from '@hooks/useAxios';
import { useApp } from './AppProvider';
import { useQR } from './QRProvider';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request } = useAxios(); // ¡aquí la magia!
    const { setQRList } = useQR();
    const [fileList, setFileList] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);

    // 1. Obtener contenido de un archivo individual
    const getFile = async (name) => {
        const response = await request({
            method: 'get',
            url: `/file/${name}`,
            notify: {
                success: false,
                error: true
            }
        });
        
        if (response) {
            return response;
        }
        return null;
    };

    // 2. Obtener lista de nombres de archivos
    const getFiles = async () => {
        setLoadingFiles(true);
        setFileList([]);
        const response = await request({
            method: 'get',
            url: '/files',
            notify: {
                success: false,
                error: true
            },
        });
        if (response) {
            let data = [];
            if (response.files.length === 0) {
                handleNotificacion('warning', response.msg, 5000);
            } else {
                // Si hay archivos, obtenemos su contenido
                data = await Promise.all(
                    response.files.map(async (file) => {
                        const { file:fileData } = await getFile(file);
                        return { ...fileData };
                    })
                );
                setFileList(data);
            }
        }
        setLoadingFiles(false);
    };

    // Subir un archivo
    const uploadFile = async (data) => {
        if (!data) {
            handleNotificacion('error', 'No se ha seleccionado ningún archivo', 5000);
            return;
        }
        setLoadingFiles(true);
        const response = await request({
            method: 'post',
            url: '/upload',
            payload: data,
            notify: {
                success: true,
                error: true
            }
        });

        if (response) {
            setFileList((prev) => [...prev, response.file]);
        }
        setLoadingFiles(false);

        const status = response ? true : false;
        return status;
    }

    // Descargar un archivo por su nombre
    const downloadFile = async (name) => {
        if (!name) {
            handleNotificacion('error', 'No se ha seleccionado ningún archivo', 5000);
            return;
        }

        const response = await request({
            method: 'get',
            url: `/download/file/${name}`,
            notify: {
                success: false,
                error: true
            },
            config: {
                responseType: 'blob',
            }
        });

        if (response) {
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url); // Limpiar el objeto URL después de descargar
        }
    };

    // Eliminar un archivo por su nombre
    const deleteFile = async (name) => {
        if (!name) {
            handleNotificacion('error', 'No se ha seleccionado ningún archivo', 5000);
            return;
        }
        const response = await request({
            method: 'delete',
            url: `/delete/file/${name}`,
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            setFileList((prev) => prev.filter((file) => file.filename !== name));
            setQRList((prev) => prev.filter((qr) => qr?.attached_file?.filename !== name));
            handleNotificacion('success', response.msg, 5000);
        }
    };

    // Eliminar todos los archivos
    const deleteAllFiles = async () => {
        const confirm = window.confirm(`¿Eliminar todos los archivos?`);
        if (!confirm) return;

        const response = await request({
            method: 'delete',
            url: '/delete/all',
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            setFileList([]);
            // Eliminar de la lista de QR aquellos que dependian de los archivos eliminados
            setQRList((prev) => prev.filter((qr) => !qr.attached_file));
            handleNotificacion('success', response.msg, 5000);
        }

        const status = response ? true : false;
        return status;
    };

    // Memoriza el valor del contexto para evitar renders innecesarios
    const contextValue = useMemo(() => ({
        fileList,
        setFileList,
        uploadFile,
        getFiles,
        getFile,
        downloadFile,
        deleteFile,
        deleteAllFiles,
        loadingFiles
    }), [fileList, loadingFiles]);

    return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>;
}

export const useFiles = () => {
    const context = useContext(FilesContext);
    if (!context) {
        throw new Error('useFiles must be used within a FilesProvider');
    }
    return context;
};