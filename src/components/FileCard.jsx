import React from 'react'
import { FaDownload, FaEye } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage } from "react-icons/fa6";

// Importar el contexto
import { useFiles } from '../contexts/FilesProvider';
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

const FileCard = ({ fileName, fileImage, showModal }) => {
    const { downloadFile, deleteFile } = useFiles();
    const { fileTypes, setSelectedFile } = useApp();
    const { getQR, createQR } = useQR();

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
        setSelectedFile({
            filename: fileName,
            url: fileImage
        });
        showModal();
    };

    const handleCreateQR = async () => {};

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
            <div className="w-48 h-48 rounded-lg border border-gray-300 flex items-center justify-center">
                {
                    fileTypes.images.includes(fileName.split('.').pop()) ? (
                        /* Si el archivo es una imagen, mostrar la imagen */
                        fileImage ? (
                            <img alt={fileName} className='w-full h-full object-cover rounded-lg' src={fileImage} />
                        ) : (
                            <FaFileImage className='text-4xl text-blue-500' />
                        )
                    ) : (
                        <FaFileLines className='text-4xl text-blue-500' />
                    )
                }
            </div>
            <p className="mt-4 w-48 text-lg text-center text-blue-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {fileName}
            </p>
            <div className='flex justify-center mt-4 space-x-4'>
                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 cursor-pointer"
                    title={`Ver ${fileName}`}
                    data-tooltip-id='viewLabel'
                    data-tooltip-content={`Ver ${fileName}`}
                    onClick={handleClick}
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaEye className='text-xl' />
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
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
        </div>
    )
}

export default FileCard
