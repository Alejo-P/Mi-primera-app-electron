import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Importamos el contexto App
import { useApp } from './AppProvider';

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

    // Obtener todos los QRs
    const getQRs = async () => {
        setLoadingQRs(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/qrs`);
            console.log(response);
            setQRList(response.files);

            if (response.files.length === 0) {
                handleNotificacion('info', 'No hay QRs generados', 5000);
            } else {
                handleNotificacion('success', 'QRs cargados correctamente', 5000);
            }
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar los QRs', 5000);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Obtener un QR por su nombre
    const getQR = async (name) => {
        setLoadingQRs(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/qr/${name}`);
            console.log(response);
            handleNotificacion('success', 'QR cargado correctamente', 5000);
            return response.data;
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar el QR', 5000);
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

    // Descargar un QR por su nombre
    const downloadQR = async (name) => {
        setLoadingQRs(true);
        try {
            const response = await axios.get(`${URL_BACKEND}/qr/download/${name}`);
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}.png`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    const contextValue = useMemo(() => ({
        qrList,
        getQRs,
        getQR,
        deleteQR,
        deleteAllQRs,
        createQR,
        downloadQR,
        loadingQRs,
        notificacion
    }), [qrList, loadingQRs, notificacion]);

    return <QRContext.Provider value={contextValue}>{children}</QRContext.Provider>;
};

export const useQR = () => useContext(QRContext);