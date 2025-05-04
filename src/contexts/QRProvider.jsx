import { createContext, useContext, useState, useMemo } from 'react';

// Importamos el contexto
import { useAxios } from '../hooks/useAxios';
import { useApp } from './AppProvider';

const QRContext = createContext();

export const QRProvider = ({ children }) => {
    const { handleNotificacion } = useApp();
    const { request } = useAxios(); // ¡aquí la magia!
    const [qrList, setQRList] = useState([]);
    const [loadingQRs, setLoadingQRs] = useState(false);

    // Obtener un QR por su nombre
    const getQR = async (name) => {
        const response = await request({
            method: 'get',
            url: `/qr/${name}`,
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

    // Obtener todos los QRs
    const getQRs = async () => {
        setLoadingQRs(true);
        setQRList([]);
        const response = await request({
            method: 'get',
            url: '/qrs',
            notify: {
                success: false,
                error: true
            },
        });
        if (response) {
            let data = [];
            if (response.files.length === 0) {
                handleNotificacion('info', response.msg, 5000);
            } else {
                data = await Promise.all(
                    response.files.map(async (qr) => {
                        const source = await getQR(qr);
                        return { ...source };
                    })
                );
            }
            setQRList(data);
        }
        setLoadingQRs(false);
    };

    // Eliminar un QR por su nombre
    const deleteQR = async (name) => {
        if (!name) {
            handleNotificacion('error', 'No se ha seleccionado ningún QR', 5000);
            return false;
        }
        const response = await request({
            method: 'delete',
            url: `/qr/${name}`,
            notify: {
                success: false,
                error: true
            }
        });
        
        if (response) {
            console.log('deleteQR', response);
            setQRList((prev) => prev.filter((qr) => qr.filename !== name));
            handleNotificacion('success', response.msg, 5000);
        }

        const status = response ? true : false;
        return status;
    };

    // Eliminar todos los QRs
    const deleteAllQRs = async () => {
        const confirm = window.confirm(`¿Eliminar todos los QRs?`);
        if (!confirm) return;

        const response = await request({
            method: 'delete',
            url: '/qrs',
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            console.log('deleteAllQRs', response);
            setQRList([]);
            handleNotificacion('success', response.msg, 5000);
        }

        const status = response ? true : false;
        return status;
    };

    // Crear un QR a partir de un texto
    const createQR = async (data) => {
        if (!data?.QRtext) {
            handleNotificacion('error', 'No se ha ingresado ningún texto', 5000);
            return;
        }
        setLoadingQRs(true);
        
        const dataForm = new FormData();
        dataForm.append('text', data.QRtext);
        if (data?.QRname) {
            dataForm.append('name', data.QRname);
        }
        if (data?.QRicon) {
            dataForm.append('icon', data.QRicon);
        }

        const response = await request({
            method: 'post',
            url: '/qr',
            payload: dataForm,
            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
            notify: {
                success: false,
                error: true
            }
        });

        if (response) {
            console.log('createQR', response);
            handleNotificacion('success', response.msg, 5000);
            getQRs();
        }
        setLoadingQRs(false);

        const status = response ? true : false;
        return status;
    };

    // Crear un QR a partir de un archivo
    const createQRFile = async (fileName) => {
        if (!fileName) {
            handleNotificacion('error', 'No se ha seleccionado ningún archivo', 5000);
            return false;
        }
        setLoadingQRs(true);
        const response = await request({
            method: 'post',
            url: `/qr/file/${fileName}`,
            notify: {
                success: false,
                error: true
            },
        });
        if (response) {
            console.log('createQRFile', response);
            handleNotificacion('success', response.msg, 5000);
            getQRs();
        }
        setLoadingQRs(false);
        const status = response ? true : false;
        return status;
    };

    const downloadQR = async (name) => {
        if (!name) {
            handleNotificacion('error', 'No se ha seleccionado ningún QR', 5000);
            return;
        }

        const response = await request({
            method: 'get',
            url: `/download/qr/${name}`,
            notify: {
                success: false,
                error: true
            },
            config: {
                responseType: 'blob'
            }
        });

        if (response) {
            console.log('downloadQR', response);
            // Crear un objeto URL para el archivo
            const url = window.URL.createObjectURL(new Blob([response]));
            
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
        }

        // try {
        //     const response = await axios.get(`${URL_BACKEND}/download/qr/${name}`, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem('access_token')}`,                },
        //         responseType: 'blob',
        //     });
    
        //     // Crear un objeto URL para el archivo
        //     const url = window.URL.createObjectURL(new Blob([response.data]));
            
        //     // Crear un elemento <a> temporal
        //     const link = document.createElement('a');
        //     link.href = url;
        //     link.setAttribute('download', `${name}`);
        //     document.body.appendChild(link);
    
        //     // Simular clic para descargar
        //     link.click();
    
        //     // Eliminar el <a> del DOM después de la descarga
        //     document.body.removeChild(link);
            
        //     // Revocar el objeto URL para liberar memoria
        //     window.URL.revokeObjectURL(url);
        // } catch (error) {
        //     console.error(error);
        //     handleNotificacion('error',  error, 5000);
        // }
    };    

    const contextValue = useMemo(() => ({
        qrList,
        setQRList,
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