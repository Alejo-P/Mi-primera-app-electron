import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import { useAxios } from '@hooks/useAxios';
import { useApp } from '@contexts/AppProvider';

const QrDevAccess = ({ port = 3000 }) => {
    // Detecta IP local usando la IP del host (solo en LAN, no externo)
    const [ip, setIp] = useState('');
    const { request } = useAxios();
    const { handleNotificacion } = useApp();

    React.useEffect(() => {
        const fetchIP = async () => {
            try {
                const res = await fetch('https://api.ipify.org?format=json');
                const data = await res.json();
                setIp(data.ip);
                handleNotificacion('success', 'IP local obtenida', 4000);
            } catch (err) {
                console.error("Error al obtener la IP:", err);
                handleNotificacion('error', 'Error al obtener la IP local', 5000);
            }
        };
        fetchIP();
    }, []);

    const url = `http://${ip}:${port}`;

    return (
        <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white shadow-md text-gray-800">
            <p className="mb-2 font-semibold">Escaneá desde tu celu 📱</p>
            {ip ? (
                <>
                    <QRCodeSVG value={url} size={200} />
                    <p className="mt-2 text-sm text-center">{url}</p>
                </>
            ) : (
                <p className="text-sm">Obteniendo IP local...</p>
            )}
        </div>
    );
};

export default QrDevAccess;
