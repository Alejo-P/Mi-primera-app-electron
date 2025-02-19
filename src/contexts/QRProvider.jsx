import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

const QRContext = createContext();

export const QRProvider = ({ children }) => {
    const [qrList, setQRList] = useState([]);
    const [loadingQRs, setLoadingQRs] = useState(false);
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

    // Obtener un QR por su nombre
    const getQR = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/qr/${name}`);
            return response.data;
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar el QR', 5000);
            return null;
        }
    };

    // Obtener todos los QRs
    const getQRs = async () => {
        setLoadingQRs(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/qrs`);
            let data = [];

            if (response.data?.files.length === 0) {
                handleNotificacion('info', 'No hay QRs generados', 5000);
            } else {
                data = await Promise.all(
                    response.data.files.map(async (qr) => {
                        const source = await getQR(qr);
                        return { ...source };
                    })
                );
                handleNotificacion('success', 'QRs cargados correctamente', 5000);
            }

            setQRList(data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar los QRs', 5000);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Eliminar un QR por su nombre
    const deleteQR = async (name) => {
        setLoadingQRs(true);
        try {
            const response = await axios.delete(`${URL_BACKEND}/qr/${name}`);
            console.log(response);
            getQRs();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Eliminar todos los QRs
    const deleteAllQRs = async () => {
        setLoadingQRs(true);
        try {
            const response = await axios.delete(`${URL_BACKEND}/qrs`);
            console.log(response);
            getQRs();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Crear un QR a partir de un texto
    const createQR = async (text, name, icon) => {
        setLoadingQRs(true);
        try {
            const formData = new FormData();
            formData.append('text', text);

            if (name) {
                formData.append('name', name);
            }

            if (icon) {
                formData.append('icon', icon);
            }

            const response = await axios.post(`${URL_BACKEND}/qr`, formData);
            console.log(response);
            getQRs();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Crear un QR a partir de un archivo
    const createQRFile = async (fileName) => {
        setLoadingQRs(true);
        try {
            const response = await axios.post(`${URL_BACKEND}/qr/file/${fileName}`);
            console.log(response);
            getQRs();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    const downloadQR = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/download/qr/${name}`, {
                responseType: 'blob',
            });
    
            // Crear un objeto URL para el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            
            // Crear un elemento <a> temporal
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}`);
            document.body.appendChild(link);
    
            // Simular clic para descargar
            link.click();
    
            // Eliminar el <a> del DOM después de la descarga
            document.body.removeChild(link);
            
            // Revocar el objeto URL para liberar memoria
            window.URL.revokeObjectURL(url);
    
            handleNotificacion('success', 'QR descargado correctamente', 5000);
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al descargar el QR', 5000);
        }
    };    

    const contextValue = useMemo(() => ({
        qrList,
        getQRs,
        getQR,
        deleteQR,
        deleteAllQRs,
        createQR,
        createQRFile,
        downloadQR,
        loadingQRs,
        notificacion
    }), [qrList, loadingQRs, notificacion]);

    return <QRContext.Provider value={contextValue}>{children}</QRContext.Provider>;
};

export const useQR = () => useContext(QRContext);