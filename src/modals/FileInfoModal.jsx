import React, { useState, useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";

// Importamos las constantes
import { THEMES } from '@constants/temas';
import { ROLES } from '@constants/roles';

// Importamos el contexto
import { useApp } from '@contexts/AppProvider';
import { useAuth } from '@contexts/AuthProvider';

const FileInfoModal = ({ file, handleModal }) => {
    const {convertUnit, tema, setNavActionsItems } = useApp();
    const { user } = useAuth();
    const isDark = tema === THEMES.DARK;

    const handleClose = async () => {
        setTimeout(() => {
            handleModal();
        }, 200);
    };

    useEffect(() => {
        const acciones = [
            {
                key: 'cerrar',
                element: (
                    <button
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Cerrar"
                        data-tooltip-id="closeLabel"
                        data-tooltip-content="Cerrar ventana de información del archivo"
                        onClick={handleClose}
                    >
                        <IoClose className="text-2xl" />
                    </button>
                )
            }
        ];
        setNavActionsItems(acciones);
        return () => {
            setNavActionsItems([]);
        }
    }, [isDark]); // Se ejecuta cuando cambia el tema

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn z-40`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className="text-xl md:text-2xl text-center font-bold w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
                    {file.filename}
                </h2>
                <p className="mt-2 w-full text-sm text-center text-gray-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                    Tamaño: {convertUnit(file.file_size)}
                </p>
                <p className="mt-2 w-full text-sm text-center text-gray-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                    Tipo: {file.file_type.split('.').pop()}
                </p>
                <p className="mt-2 w-full text-sm text-center text-gray-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                    Subido en {new Date(file.uploaded_at).toLocaleString()}
                </p>
                <p className={`mt-2 w-full text-sm text-center overflow-hidden whitespace-nowrap overflow-ellipsis
                    ${user?.id === file.uploaded_by?.id ? 'text-blue-500 font-bold' : 'text-gray-500 font-semibold'}    
                `}>
                    Subido por {
                        file.uploaded_by?.id === user?.id ? 'Tú' : file.uploaded_by?.name
                    } <span
                        className={`${!(user?.roles.includes(ROLES.ADMIN)) ? 'hidden' : ''}`}
                    >
                        ({file.uploaded_by?.roles?.map((role, index) => {
                            return (
                                <span key={index} className="text-gray-500 font-semibold">
                                    {index === 0 ? role : `, ${role}`}
                                </span>
                            )
                        }
                        )})
                    </span>
                </p>
            </div>
        </div>
    )
}

export default FileInfoModal
