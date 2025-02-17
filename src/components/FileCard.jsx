import React from 'react'
import { FaDownload } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage } from "react-icons/fa6";

// Importar el contexto
import { useFiles } from '../contexts/FilesProvider';
import { useApp } from '../contexts/AppProvider';

const FileCard = ({ fileName }) => {
    const { downloadFile, deleteFile } = useFiles();
    const { fileTypes } = useApp();

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
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
            <div className="flex items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
                {
                    fileTypes.images.includes(fileName.split('.').pop()) ? (
                        <FaFileImage className='text-4xl text-blue-500' />
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
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
        </div>
    )
}

export default FileCard
