import React from 'react'
import { FaFileLines, FaFileImage } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { IoWarning } from "react-icons/io5";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { useApp } from '@contexts/AppProvider';

const FileBarCard = ({ file, handleDeleteFile, loadingFiles = false, isDark}) => {
    const { convertUnit, fileTypes } = useApp();

    const handleFileDelete = (filename) => {
        if (!handleDeleteFile) return;
        // Confirmación antes de eliminar el archivo
        if (window.confirm(`¿Estás seguro de que deseas eliminar el archivo ${filename}?`)) {
            // Llamada a la función de eliminación del archivo
            handleDeleteFile && handleDeleteFile();
        }
    }

    return (
        <div
            className={`mb-2 w-full flex items-center justify-between transition-all duration-300
                ${isDark ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900 border-gray-300'
                }
                border-2 rounded-lg p-2
            `}
        >
            <div className="flex items-center gap-2 mr-2">
                {
                    fileTypes.images.includes(file.name.split('.').pop()) ? 
                    <FaFileImage className="text-2xl" />
                    : <FaFileLines className="text-2xl" />
                }
            </div>
            <div className='flex-1 overflow-hidden text-start text-ellipsis whitespace-nowrap'>
                <p>{file.name}</p>
            </div>
            <div className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <p>({convertUnit(file.size)})</p>
            </div>
            {!(file.pending || file.uploading || file.uploaded || file.error) && (<button
                type="button"
                onClick={() => handleFileDelete(file.name)}
                className={`text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer`}
                title="Eliminar archivo"
                data-tooltip-id="deleteFileLabel"
                data-tooltip-content={`Eliminar archivo ${file.name}`}
            >
                <MdDeleteForever className='text-2xl' />
            </button>)}
            {file.pending && (
                <CgSpinnerTwoAlt className={`text-2xl animate-spin ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
            {file.uploading && (
                <CgSpinnerTwoAlt className={`text-2xl animate-spin ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
            )}
            {file.uploaded && (
                <IoMdCheckmark className={`text-2xl text-green-500`} />
            )}
            {file.error && (
                <IoWarning className={`text-2xl text-red-500`} />
            )}
            <ReactTooltip
                id="deleteFileLabel"
                place="top"
                effect="solid"
                className={`bg-gray-800 text-white ${isDark ? 'dark' : ''}`}
                delayShow={500}
            />
        </div>
    )
}

export default FileBarCard
