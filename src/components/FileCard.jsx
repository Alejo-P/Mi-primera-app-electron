import React from 'react'
import { FaDownload, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage } from "react-icons/fa6";
import { QrCode } from 'lucide-react';

// Importar el contexto
import { useFiles } from '../contexts/FilesProvider';
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

const FileCard = ({ fileName, fileImage, showModal }) => {
    const { downloadFile, deleteFile } = useFiles();
    const { fileTypes, setSelectedFile, setVisibleNav, tema } = useApp();
    const { getQR, createQRFile } = useQR();
    const isDark = tema === 'oscuro';

    const handleDownload = async () => {
        const confirm = window.confirm(`¿Descargar ${fileName}?`);
        if (confirm) {
            await downloadFile(fileName);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm(`¿Eliminar ${fileName}?`);
        if (confirm) {
            await deleteFile(fileName);
            await getQR();
        }
    };

    const handleClick = async () => {
        setVisibleNav(false);
        setSelectedFile({
            filename: fileName,
            url: fileImage
        });
        setTimeout(() => {
            showModal();
        }, 250);
    };

    const handleCreateQR = async () => {
        const confirm = window.confirm(`¿Crear QR para ${fileName}?`);
        if (confirm) {
            await createQRFile(fileName);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
            <div
                className="w-full h-48 rounded-lg border border-gray-300 hover:scale-95 hover:bg-gray-400 transition-all duration-300 flex items-center justify-center"
                style={{
                    cursor: 'pointer'
                }}
                onClick={handleClick}
                data-tooltip-id='viewLabel'
                data-tooltip-content={`Ver ${fileName}`}
            >
                {
                    fileTypes.images.includes(fileName.split('.').pop()) ? (
                        /* Si el archivo es una imagen, mostrar la imagen */
                        fileImage ? (
                            <img
                                alt={fileName}
                                className='w-full h-full object-cover rounded-lg'
                                src={fileImage}
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
                {fileName}
            </p>
            <div className='flex justify-center mt-4 space-x-4'>
                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Crear QR para ${fileName}`}
                    data-tooltip-id='createQRLabel'
                    data-tooltip-content={`Crear QR de descarga para ${fileName}`}
                    onClick={handleCreateQR}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <QrCode className='text-xl' />
                    </span>
                </button>

                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Descargar ${fileName}`}
                    data-tooltip-id='downloadLabel'
                    data-tooltip-content={`Descargar ${fileName}`}
                    onClick={handleDownload}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                    </span>
                </button>

                <button
                    className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
                    title={`Eliminar ${fileName}`}
                    data-tooltip-id='deleteLabel'
                    data-tooltip-content={`Eliminar ${fileName}`}
                    onClick={handleDelete}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <MdDeleteForever className='text-xl' />
                    </span>
                </button>
            </div>
            <ReactTooltip id='viewLabel' place='top' />
            <ReactTooltip id='createQRLabel' place='top' />
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
        </div>
    )
}

export default FileCard
