import { createContext, useContext, useState, useMemo } from 'react';
import axios from 'axios';

// Importamos el contexto
import { useApp } from './AppProvider';

const QRContext = createContext();

export const QRProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const [qrList, setQRList] = useState([]);
    const [loadingQRs, setLoadingQRs] = useState(false);
    const URL_BACKEND = import.meta.env.VITE_BACKEND_URL;
    const access_token = localStorage.getItem('tokens') ? JSON.parse(localStorage.getItem('tokens')).access_token : null;

    // Obtener un QR por su nombre
    const getQR = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/qr/${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            console.log(response);
            return response.data;
        } catch (error) {
            console.error(error);
            handleNotificacion('error', 'Error al cargar el QR ' + name, 5000);
            return null;
        }
    };

    // Obtener todos los QRs
    const getQRs = async () => {
        setLoadingQRs(true);
        setQRList([]);
        try {
            const response = await axios.get(`${URL_BACKEND}/qrs`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
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
            }
            setQRList(data);
            console.log("Lista de QRs", data);
        } catch (error) {
            console.error(error);
            handleNotificacion('error',  error, 5000);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Eliminar un QR por su nombre
    const deleteQR = async (name) => {
        setLoadingQRs(true);
        try {
            const response = await axios.delete(`${URL_BACKEND}/qr/${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            console.log(response);
            setQRList((prev) => prev.filter((qr) => qr.filename !== name));
            handleNotificacion('success', response.data.message, 5000);
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
            const response = await axios.delete(`${URL_BACKEND}/qrs`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            console.log(response);
            setQRList([]);
            handleNotificacion('success', response.data.message, 5000);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Crear un QR a partir de un texto
    const createQR = async (data) => {
        setLoadingQRs(true);
        try {
            const formData = new FormData();
            formData.append('text', data.QRtext);

            if (data?.QRname) {
                formData.append('name', data.QRname);
            }

            if (data?.QRicon) {
                formData.append('icon', data.QRicon);
            }

            const response = await axios.post(`${URL_BACKEND}/qr`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            handleNotificacion('success', response.data.message, 5000);
            getQRs();
        } catch (error) {
            console.error(error);
            handleNotificacion('error', error, 5000);
        } finally {
            setLoadingQRs(false);
        }
    };

    // Crear un QR a partir de un archivo
    const createQRFile = async (fileName) => {
        setLoadingQRs(true);
        try {
            const response = await axios.post(`${URL_BACKEND}/qr/file/${fileName}`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            });
            handleNotificacion('success', response.data.message, 5000);
            getQRs();
        } catch (error) {
            console.error(error);
            handleNotificacion('error',  error, 5000);
        } finally {
            setLoadingQRs(false);
        }
    };

    const downloadQR = async (name) => {
        try {
            const response = await axios.get(`${URL_BACKEND}/download/qr/${name}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
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
            handleNotificacion('error',  error, 5000);
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
        loadingQRs
    }), [qrList, loadingQRs]);

    return <QRContext.Provider value={contextValue}>{children}</QRContext.Provider>;
};

export const useQR = () => useContext(QRContext);