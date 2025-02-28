import React from 'react'
import { FaDownload } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importar el contexto
import { useQR } from '../contexts/QRProvider';

const QRCard = ({ QRName, QRImage }) => {
    const { downloadQR , deleteQR } = useQR();
    
    const handleDownload = async () => {
        const confirm = window.confirm(`¿Descargar ${QRName}?`);
        if (confirm) {
            await downloadQR(QRName);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm(`¿Eliminar ${QRName}?`);
        if (confirm) {
            await deleteQR(QRName);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
            <img 
                alt='QR Code'
                className='w-64 h-64 rounded-lg border border-gray-300'
                src={QRImage}
            />
            <p className="mt-4 w-48 text-lg text-center text-blue-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {QRName}
            </p>
            <div className='flex justify-center mt-4 space-x-4 gap-3'>
                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Descargar ${QRName}`}
                    data-tooltip-id='downloadLabel'
                    data-tooltip-content={`Descargar ${QRName}`}
                    onClick={handleDownload}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                    </span>
                </button>
                <button
                    className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
                    title={`Eliminar ${QRName}`}
                    data-tooltip-id='deleteLabel'
                    data-tooltip-content={`Eliminar ${QRName}`}
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
