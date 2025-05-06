// @ts-check
import React, { useState } from 'react';
import { TiInfoLarge } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { TiArrowRightThick } from "react-icons/ti";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage, FaDownload } from "react-icons/fa6";
import { QrCode } from 'lucide-react';

import { useFiles } from '../contexts/FilesProvider';
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';
import { useAuth } from '../contexts/AuthProvider';
import { ROLES } from '../constants/roles';

const FlipCard = ({ file, showModal, showFileInfo, isDark = false }) => {
    const { downloadFile, deleteFile, setFileList } = useFiles();
    const { fileTypes, setSelectedFile, convertUnit } = useApp();
    const { getQR, createQRFile, loadingQRs } = useQR();
    const [flipped, setFlipped] = useState(false);
    const { user } = useAuth();

    const handleFlip = () => setFlipped(!flipped);

    const handleClick = () => {
        setSelectedFile(file);
        showModal();
    };

    const handleFileInfoModal = () => {
        setSelectedFile(file);
        showFileInfo(true);
    };

    const handleDownload = async () => {
        if (window.confirm(`¿Descargar ${file.filename}?`)) {
            await downloadFile(file.filename);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Eliminar ${file.filename}?`)) {
            await deleteFile(file.filename);
            await getQR();
        }
    };

    const handleCreateQR = async () => {
        if (window.confirm(`¿Crear QR para ${file.filename}?`)) {
            const success = await createQRFile(file.filename);
            if (success) {
                setFileList((prev) =>
                    prev.map((f) => f.filename === file.filename ? { ...f, qr_code: true } : f)
                );
            }
        }
    };

    return (
        <div className={`w-72 h-80 [perspective:1000px] m-4 `}>
            <div className={`relative w-full h-full rounded-lg transition-transform duration-500 ${flipped ? '[transform:rotateY(180deg)]' : ''} [transform-style:preserve-3d] shadow-[0_6px_15px_rgba(0,0,0,0.7)]`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFlip();
                    }}
                    className={`absolute top-72 right-0 z-20 p-1 rounded-br-lg rounded-tl-3xl shadow-lg
                        flex items-center justify-center
                        transition-all duration-300 hover:scale-95
                        ${flipped ? 
                            isDark ? 'bg-gray-800 text-white'
                            :   'bg-gray-400 text-gray-900'
                            :   isDark ? 'bg-gray-700 text-white'
                            :   'bg-gray-300 text-gray-900'
                        }
                    `}
                    title="Voltear tarjeta"
                    data-tooltip-id="infoFileLabel"
                    data-tooltip-content={`${flipped ? 'Volver' : 'Ver información del recurso'}`}
                >
                    {flipped ? <TiArrowRightThick className="text-2xl" /> : <TiInfoLarge className="text-2xl" />}
                </button>

                {/* Front */}
                <div className={`absolute w-full h-full rounded-lg shadow-lg p-4 flex flex-col items-center justify-start gap-4
                    ${isDark ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-900 border border-gray-300'}
                    [backface-visibility:hidden]
                `}>
                    <div
                        className="w-full h-40 border rounded-lg flex items-center justify-center overflow-hidden hover:scale-95 transition-all duration-300"
                        data-tooltip-id="viewLabel"
                        data-tooltip-content={`Ver ${file.filename}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClick();
                        }}
                    >
                        {
                            fileTypes.images.includes(file.filename.split('.').pop()) ? (
                                file.url ? (
                                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                                ) : <FaFileImage className="text-5xl text-blue-500" />
                            ) : <FaFileLines className="text-5xl text-blue-500" />
                        }
                    </div>
                    <p className="text-center text-blue-500 font-semibold text-base truncate w-full">{file.filename}</p>
                    <div className="flex justify-center mt-4 space-x-4 gap-3">
                        {/* Botones frontales */}
                        <button
                            className={`flex text-white p-2 rounded-lg transition duration-300
                                ${file.qr_code ? 'hidden'
                                    : loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                                    : isDark ? 'bg-green-600 hover:bg-green-700 hover:scale-95'
                                    : 'bg-green-400 hover:bg-green-500 hover:scale-95'
                                }
                            `}
                            disabled={loadingQRs || file.qr_code}
                            title="Crear QR"
                            data-tooltip-id="createQRLabel"
                            data-tooltip-content={`Crear QR para ${file.filename}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCreateQR();
                            }}
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
                            disabled={loadingQRs}
                            title="Descargar"
                            data-tooltip-id="downloadLabel"
                            data-tooltip-content={`Descargar ${file.filename}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload();
                            }}
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
                    </div>
                </div>

                {/* Back */}
                <div className={`absolute w-full h-full rounded-lg shadow-lg p-4 flex flex-col items-center justify-center gap-4
                    ${isDark ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-300'}
                    [transform:rotateY(180deg)] [backface-visibility:hidden]
                `}>
                    <h2 className="text-xl md:text-2xl text-center font-bold w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                        Info del recurso
                    </h2>
                    <h2 className="text-center text-blue-500 font-semibold text-base truncate w-full">
                        {file.filename}
                    </h2>
                    <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                        Tamaño: {convertUnit(file.file_size)}
                    </p>
                    <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                        Tipo: {file.file_type.split('.').pop()}
                    </p>
                    <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                        Subido en {new Date(file.uploaded_at).toLocaleString()}
                    </p>
                    <p className={`mt-2 w-full text-sm text-center overflow-hidden whitespace-nowrap overflow-ellipsis
                        ${user?.id === file.uploaded_by?.id ? 'text-blue-500 font-bold' :  'font-semibold'}    
                    `}>
                        Subido por {
                            file.uploaded_by?.id === user?.id ? 'Tú' : file.uploaded_by?.name
                        } <span
                            className={`${!(user?.roles.includes(ROLES.ADMIN)) ? 'hidden' : ''}`}
                        >
                            ({file.uploaded_by?.roles?.map((role, index) => {
                                return (
                                    <span key={index} className="font-semibold italic">
                                        {index === 0 ? role : `, ${role}`}
                                    </span>
                                )
                            }
                            )})
                        </span>
                    </p>
                </div>
            </div>

            {/* Tooltips */}
            <ReactTooltip id='viewLabel' place='top' />
            <ReactTooltip id='createQRLabel' place='top' />
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
            <ReactTooltip id='infoFileLabel' place='top' />
        </div>
    );
};

export default FlipCard;
