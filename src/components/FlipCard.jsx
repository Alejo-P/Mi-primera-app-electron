// @ts-check
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TiInfoLarge } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";
import { TiArrowRightThick } from "react-icons/ti";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { FaFileLines, FaFileImage, FaDownload } from "react-icons/fa6";
import { QrCode } from 'lucide-react';

import { useFiles } from '@contexts/FilesProvider';
import { useApp } from '@contexts/AppProvider';
import { useQR } from '@contexts/QRProvider';
import { useAuth } from '@contexts/AuthProvider';
import { ROLES } from '@constants/roles';

const FlipCard = ({
    file,
    handleOnClick,
    isDark = false,
}) => {
    const { downloadFile, deleteFile, setFileList } = useFiles();
    const { fileTypes, convertUnit } = useApp();
    const { createQRFile, loadingQRs, downloadQR, deleteQR } = useQR();
    const [flipped, setFlipped] = useState(false);
    const { user } = useAuth();

    const handleFlip = () => setFlipped(!flipped);

    const handleClick = (e) => {
        e.stopPropagation();
        handleOnClick && handleOnClick(file);
    };

    const handleDownload = async () => {
        if (window.confirm(`¿Descargar ${file.filename}?`)) {
            if (file.file_type === "qr_code") {
                const success = await downloadQR(file.filename);
                if (success) {
                    setFileList((prev) => prev.map((f) => {
                        if (f.filename === file.attached_file?.filename) {
                            return { ...f, qr_code: null };
                        }
                        return f;
                    }));
                }
            } else {
                const success = await downloadFile(file.filename);
                if (success) {
                    setFileList((prev) => prev.filter((f) => f.filename !== file.filename));
                }
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Eliminar ${file.filename}?`)) {
            if (file.file_type === "qr_code") {
                const success = await deleteQR(file.filename);
                if (success) {
                    setFileList((prev) => prev.map((f) => {
                        if (f.filename === file.attached_file?.filename) {
                            return { ...f, qr_code: null };
                        }
                        return f;
                    }));
                }
            } else {
                const success = await deleteFile(file.filename);
                if (success) {
                    setFileList((prev) => prev.filter((f) => f.filename !== file.filename));
                }
            }
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
        <div className="w-full max-w-xs h-80 perspective-1000 mx-auto">
            <motion.div
                className="relative w-full h-full rounded-lg shadow-[0_6px_15px_rgba(0,0,0,0.7)]"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
            >
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFlip();
                    }}
                    className={`absolute bottom-0 right-0 z-20 p-1 rounded-br-lg rounded-tl-3xl shadow-lg border-2
                        flex items-center justify-center
                        transition-all duration-300 hover:scale-95
                        ${flipped ? 
                            isDark ? 'bg-gray-800 text-white border-gray-300'
                            :   'bg-gray-400 text-gray-900 border-gray-700'
                            :   isDark ? 'bg-gray-700 text-white border-gray-300'
                            :   'bg-gray-300 text-gray-900 border-gray-700'
                        }
                    `}
                    title="Voltear tarjeta"
                    data-tooltip-id="infoFileLabel"
                    data-tooltip-content={`${flipped ? 'Volver' : 'Ver información del recurso'}`}
                >
                    {flipped ? <TiArrowRightThick className="text-2xl" /> : <TiInfoLarge className="text-2xl" />}
                </button>

                {/* Front */}
                <motion.div
                    className={`absolute w-full h-full rounded-lg shadow-lg p-4 flex flex-col items-center justify-start gap-4
                        ${isDark ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-900 border border-gray-300'}
                    `}
                    style={{
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <div
                        className={`w-full h-40 border rounded-lg flex items-center justify-center overflow-hidden transition-all duration-300
                            ${handleOnClick ? 'cursor-pointer hover:scale-95' : ''}
                            ${fileTypes.images.includes(file.filename.split('.').pop()) ? 'border-gray-300' : 'border-gray-200'}
                        `}
                        data-tooltip-id="viewLabel"
                        data-tooltip-content={`Ver ${file.filename}`}
                        onClick={handleClick}
                    >
                        {
                            fileTypes.images.includes(file.filename.split('.').pop()) ? (
                                file.url ? (
                                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                                ) : <FaFileImage className="text-5xl text-blue-500" />
                            ) : <FaFileLines className="text-5xl text-blue-500" />
                        }
                    </div>
                    <p className="text-center text-blue-500 font-semibold text-base truncate w-full" data-tooltip-id='filename' data-tooltip-content={file.filename}>{file.filename}</p>
                    <div className="flex justify-center mt-4 space-x-4 gap-3">
                        {/* Botones frontales */}
                        {
                            (file.file_type !==  "qr_code" && !file.qr_code) && (
                                <button
                                    className={`flex text-white p-2 rounded-lg transition duration-300
                                        ${loadingQRs ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
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
                            )
                        }

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
                                    : 'bg-red-500 hover:bg-red-600 hover:scale-95'
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
                </motion.div>

                {/* Back */}
                <motion.div
                    className={`absolute w-full h-full rounded-lg shadow-lg p-4 flex flex-col items-center justify-center gap-4
                        ${isDark ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 text-gray-700 border border-gray-300'}
                    `}
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <h2 className="text-xl md:text-2xl text-center font-bold w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                        Info del recurso
                    </h2>
                    <h2 className="text-center text-blue-500 font-semibold text-base truncate w-full" data-tooltip-id='filename' data-tooltip-content={file.filename}>
                        {file.filename}
                    </h2>
                    {
                        file.file_size && (
                            <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                                Tamaño: {convertUnit(file.file_size)}
                            </p>
                        )
                    }
                    {
                        file.file_type && (
                            <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                                Tipo: {
                                    file.file_type === 'qr_code' ? 'Código QR' :
                                    fileTypes.images.includes(file.filename.split('.').pop()) ? 'Imagen' :
                                    fileTypes.documents.includes(file.filename.split('.').pop()) ? 'Documento' :
                                    file.file_type
                                }
                            </p>
                        )
                    }
                    {
                        (file?.uploaded_at || file?.created_at) && (
                            <p className="mt-2 w-full text-sm text-center 'font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                                {file?.uploaded_at ? 'Subido el' : 'Creado el'} {new Date(file?.uploaded_at || file?.created_at).toLocaleString()}
                            </p>
                        )
                    }
                    {
                        (Object.keys(file?.uploaded_by || {}).length !== 0 || Object.keys(file?.created_by || {}).length !== 0) && (
                            <p className={`mt-2 w-full text-sm text-center overflow-hidden whitespace-nowrap overflow-ellipsis
                                ${(user?.id === file?.uploaded_by?.id || user?.id === file?.created_by?.id) ? 'text-blue-500 font-bold' :  'font-semibold'}    
                            `}>
                                {file?.uploaded_by ? 'Subido por' : 'Creado por'} {
                                    (user?.id === file?.uploaded_by?.id || user?.id === file?.created_by?.id) ? 'Tú' :
                                    file?.uploaded_by?.name || file?.created_by?.name
                                } <span
                                    className={`${!(user?.roles?.includes(ROLES.ADMIN)) ? 'hidden' : ''}`}
                                >
                                    ({
                                        file?.uploaded_by?.roles && (
                                            file.uploaded_by?.roles?.map((role, index) => {
                                                return (
                                                    <span key={index} className="font-semibold italic">
                                                        {index === 0 ? role : `, ${role}`}
                                                    </span>
                                                )
                                            })
                                        )
                                    }
                                    {
                                        file?.created_by?.roles && (
                                            file.created_by?.roles?.map((role, index) => {
                                                return (
                                                    <span key={index} className="font-semibold italic">
                                                        {index === 0 ? role : `, ${role}`}
                                                    </span>
                                                )
                                            })
                                        )
                                    })
                                </span>
                            </p>
                        )
                    }
                </motion.div>
            </motion.div>

            {/* Tooltips */}
            <ReactTooltip id='viewLabel' place='top' />
            <ReactTooltip id='createQRLabel' place='top' />
            <ReactTooltip id='downloadLabel' place='top' />
            <ReactTooltip id='deleteLabel' place='top' />
            <ReactTooltip id='infoFileLabel' place='top' />
            <ReactTooltip id='filename' place='bottom' />
        </div>
    );
};

export default FlipCard;
