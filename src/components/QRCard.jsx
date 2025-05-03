import React from 'react'
import { FaDownload } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importar el contexto
import { useAuth } from '../contexts/AuthProvider';
import { useQR } from '../contexts/QRProvider';
import { useFiles } from '../contexts/FilesProvider';

const QRCard = ({ QRInfo, isDark = false }) => {
    const { user } = useAuth();
    const { downloadQR , deleteQR } = useQR();
    const { setFileList } = useFiles();
    
    const handleDownload = async () => {
        const confirm = window.confirm(`¿Descargar ${QRInfo.filename}?`);
        if (confirm) {
            await downloadQR(QRInfo.filename);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm(`¿Eliminar ${QRInfo.filename}?`);
        if (confirm) {
            const success = await deleteQR(QRInfo.filename);
            if (success) {
                setFileList((prev) => prev.map((f) => {
                    if (f.filename === QRInfo.attached_file?.filename) {
                        return { ...f, qr_code: null };
                    }
                    return f;
                }));
            }
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center p-4 border rounded-lg
            shadow-[0_6px_15px_rgba(0,0,0,0.7)] transition-all duration-300
            ${isDark ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
        `}>
            <img 
                alt='QR Code'
                className='w-64 h-64 rounded-lg border border-gray-300'
                src={QRInfo.url}
            />
            <p className="mt-4 w-full text-lg text-center text-blue-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {QRInfo.filename}
            </p>
            <p className="mt-2 w-full text-sm text-center text-gray-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                Creado el {new Date(QRInfo.created_at).toLocaleString()}
            </p>
            <p className={`mt-2 w-full text-sm text-center overflow-hidden whitespace-nowrap overflow-ellipsis
                ${user?.id === QRInfo.created_by?.id ? 'text-blue-500 font-bold' : 'text-gray-500 font-semibold'}    
            `}>
                Creado por {
                    QRInfo.created_by?.id === user?.id ? 'Tú' : QRInfo.created_by?.name
                } <span
                    className={`${user?.role !== "admin" ? 'hidden' : ''}`}
                >
                    ({QRInfo.created_by?.role})
                </span>
            </p>
            <div className='flex justify-center mt-4 space-x-4 gap-3'>
                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Descargar ${QRInfo.filename}`}
                    data-tooltip-id='downloadLabel'
                    data-tooltip-content={`Descargar ${QRInfo.filename}`}
                    onClick={handleDownload}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                    </span>
                </button>
                <button
                    className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
                    title={`Eliminar ${QRInfo.filename}`}
                    data-tooltip-id='deleteLabel'
                    data-tooltip-content={`Eliminar ${QRInfo.filename}`}
                    onClick={handleDelete}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <MdDeleteForever className='text-xl' />
                    </span>
                </button>
            </div>
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
        </div>
    )
}

export default QRCard
