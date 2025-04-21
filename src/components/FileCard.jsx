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

// Importar los componentes
import FileInfoModal from '../modals/FileInfoModal';

const FileCard = ({ file, showModal }) => {
    console.log("FileCard ->",file);
    const { user } = useAuth();
    console.log("User ->",user);
    const { downloadFile, deleteFile } = useFiles();
    const { fileTypes, setSelectedFile, setVisibleNav, setVisibleToolbar, tema } = useApp();
    const { getQR, createQRFile } = useQR();
    const isDark = tema === THEMES.DARK;
    const [showFileInfo, setShowFileInfo] = useState(false);

    const handleFileInfoModal = () => {
        setShowFileInfo(!showFileInfo);
        setVisibleNav(!showFileInfo);
        setVisibleToolbar(!showFileInfo);
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
        setVisibleNav(false);
        setVisibleToolbar(false);
        setSelectedFile({
            filename: file.filename,
            url: file.url
        });
        setTimeout(() => {
            showModal();
        }, 250);
    };

    const handleCreateQR = async () => {
        const confirm = window.confirm(`¿Crear QR para ${file.filename}?`);
        if (confirm) {
            await createQRFile(file.filename);
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
                    className={`flex text-white p-2 rounded-lg transition duration-300 cursor-pointer ${file.qr_code ? 'hidden' : 'bg-blue-500 hover:bg-blue-600'}`}
                    title={`Crear QR para ${file.filename}`}
                    data-tooltip-id='createQRLabel'
                    data-tooltip-content={`${file.qr_code ? `QR ya creado para ${file.filename}` : `Crear QR para ${file.filename}`}`}
                    onClick={handleCreateQR}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <QrCode className='text-xl' />
                    </span>
                </button>

                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Descargar ${file.filename}`}
                    data-tooltip-id='downloadLabel'
                    data-tooltip-content={`Descargar ${file.filename}`}
                    onClick={handleDownload}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                    </span>
                </button>

                <button
                    className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 cursor-pointer"
                    title={`Eliminar ${file.filename}`}
                    data-tooltip-id='deleteLabel'
                    data-tooltip-content={`Eliminar ${file.filename}`}
                    onClick={handleDelete}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <MdDeleteForever className='text-xl' />
                    </span>
                </button>

                <button
                    className="flex bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition duration-300 cursor-pointer"
                    title={`Ver información de ${file.filename}`}
                    data-tooltip-id='infoFileLabel'
                    data-tooltip-content={`Ver información de ${file.filename}`}
                    onClick={handleFileInfoModal}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaInfo className='text-xl' />
                    </span>
                </button>
            </div>
            {
                showFileInfo && (
                    <FileInfoModal
                        file={file}
                        handleModal={handleFileInfoModal}
                    />
                )
            }
            <ReactTooltip id='viewLabel' place='top' />
            <ReactTooltip id='createQRLabel' place='top' />
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
            <ReactTooltip id='infoFileLabel' place='top' />
        </div>
    )
}

export default FileCard
