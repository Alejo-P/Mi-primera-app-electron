import React, { useState } from 'react'
import { FaDownload, FaInfo } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage } from "react-icons/fa6";
import { QrCode } from 'lucide-react';

// Importar las constantes
import { THEMES } from '../constants/temas';

// Importar el contexto
import { useAuth } from '../contexts/AuthProvider'; 
import { useFiles } from '../contexts/FilesProvider';
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

const FileCard = ({ file, showModal, showFileInfo, isDark = false }) => {
    const { downloadFile, deleteFile, setFileList } = useFiles();
    const { fileTypes, setSelectedFile } = useApp();
    const { getQR, createQRFile, loadingQRs } = useQR();
    const [flipped, setFlipped] = useState(false);

    const toggleFlip = () => {
        setFlipped(!flipped);
      };

    const handleFileInfoModal = () => {
        setSelectedFile(file);
        showFileInfo(!showFileInfo);
    };

    const handleDownload = async () => {
        const confirm = window.confirm(`¿Descargar ${file.filename}?`);
        if (confirm) {
            await downloadFile(file.filename);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm(`¿Eliminar ${file.filename}?`);
        if (confirm) {
            await deleteFile(file.filename);
            await getQR();
        }
    };

    const handleClick = async () => {
        setSelectedFile(file);
        showModal();
    };

    const handleCreateQR = async () => {
        const confirm = window.confirm(`¿Crear QR para ${file.filename}?`);
        if (confirm) {
            const success = await createQRFile(file.filename);
            if (success) {
                setFileList((prev) => prev.map((f) => {
                    if (f.filename === file.filename) {
                        return { ...f, qr_code: true };
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
            <div
                className="w-full h-48 rounded-lg border border-gray-300 hover:scale-95 hover:bg-gray-400 transition-all duration-300 flex items-center justify-center"
                style={{
                    cursor: 'pointer'
                }}
                onClick={handleClick}
                data-tooltip-id='viewLabel'
                data-tooltip-content={`Ver ${file.filename}`}
            >
                {
                    fileTypes.images.includes(file.filename.split('.').pop()) ? (
                        /* Si el archivo es una imagen, mostrar la imagen */
                        file.url ? (
                            <img
                                alt={file.filename}
                                className='w-full h-full object-cover rounded-lg'
                                src={file.url}
                            />
                        ) : (
                            <FaFileImage
                                className='text-4xl text-blue-500'
                                style={{
                                    objectFit: 'cover'
                                }}
                                onClick={handleClick}
                            />
                        )
                    ) : (
                        <FaFileLines
                            className='text-4xl text-blue-500'
                            style={{
                                objectFit: 'cover'
                            }}
                            onClick={handleClick}
                        />
                    )
                }
            </div>
            <p className="mt-4 w-full text-lg text-center text-blue-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {file.filename}
            </p>
            <div className='flex justify-center mt-4 space-x-4 gap-3'>
                <button
                    className={`flex text-white p-2 rounded-lg transition duration-300
                        ${file.qr_code ? 'hidden'
                            : loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                            : isDark ? 'bg-green-600 hover:bg-green-700 hover:scale-95'
                            : 'bg-green-400 hover:bg-green-500 hover:scale-95'
                        }
                    `}
                    title={`Crear QR para ${file.filename}`}
                    data-tooltip-id='createQRLabel'
                    data-tooltip-content={`${file.qr_code ? `QR ya creado para ${file.filename}` : `Crear QR para ${file.filename}`}`}
                    onClick={handleCreateQR}
                    disabled={loadingQRs || file.qr_code}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <QrCode className='text-xl' />
                    </span>
                </button>

                <button
                    className={`flex text-white p-2 rounded-lg transition duration-300
                        ${loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                            : isDark ? 'bg-blue-600 hover:bg-blue-700 hover:scale-95'
                            : 'bg-blue-400 hover:bg-blue-500 hover:scale-95'
                        }
                    `}
                    title={`Descargar ${file.filename}`}
                    data-tooltip-id='downloadLabel'
                    data-tooltip-content={`Descargar ${file.filename}`}
                    onClick={handleDownload}
                    disabled={loadingQRs}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                    </span>
                </button>

                <button
                    className={`flex text-white p-2 rounded-lg transition duration-300
                        ${loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                            : isDark ? 'bg-red-600 hover:bg-red-700 hover:scale-95'
                            : 'bg-red-400 hover:bg-red-500 hover:scale-95'
                        }
                    `}
                    title={`Eliminar ${file.filename}`}
                    data-tooltip-id='deleteLabel'
                    data-tooltip-content={`Eliminar ${file.filename}`}
                    onClick={handleDelete}
                    disabled={loadingQRs}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <MdDeleteForever className='text-xl' />
                    </span>
                </button>

                <button
                    className={`flex text-white p-2 rounded-lg transition duration-300
                        ${loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                            : isDark ? 'bg-gray-600 hover:bg-gray-700 hover:scale-95'
                            : 'bg-gray-400 hover:bg-gray-500 hover:scale-95'
                        }
                    `}
                    title={`Ver información de ${file.filename}`}
                    data-tooltip-id='infoFileLabel'
                    data-tooltip-content={`Ver información de ${file.filename}`}
                    onClick={handleFileInfoModal}
                    disabled={loadingQRs}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaInfo className='text-xl' />
                    </span>
                </button>
            </div>
            <ReactTooltip id='viewLabel' place='top' />
            <ReactTooltip id='createQRLabel' place='top' />
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
            <ReactTooltip id='infoFileLabel' place='top' />
        </div>
    )
}

export default FileCard
