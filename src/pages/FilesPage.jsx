import React, { useEffect, useState } from 'react'
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiOutlineRefresh } from 'react-icons/hi';

// Importamos las constantes
import { THEMES } from '@constants/temas';
import { ROLES } from '@constants/roles';

// Importamos el contexto
import { useAuth } from '@contexts/AuthProvider';
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';
import { useQR } from '@contexts/QRProvider';

// Importamos los componentes
import ViewFilesModal from '@modals/ViewFilesModal';
import LoadingCard from '@components/LoadingCard';
import FlipCard from '@components/FlipCard';

const FilesPage = () => {
    const { user } = useAuth();
    const { selectedFile, setSelectedFile, tema, setVisibleNav, visibleToolbar, setNavActionsItems } = useApp();
    const { fileList, getFiles, deleteAllFiles, loadingFiles } = useFiles();
    const { setQRList } = useQR();
    const [showModal, setShowModal] = useState(false);
    const [inputSearch, setFileInput] = useState({
        fileSearch: '',
        userSearch: ''
    });
    const isDark = tema === THEMES.DARK;

    const handleClick = (file) => {
        setSelectedFile(file);
        handleModal();
    };

    const handleModal = () => {
        setShowModal(!showModal);
    }

    const handleFetchFiles = async () => {
        setVisibleNav(false);
        await getFiles();
        setVisibleNav(true);
    };

    const handleRefresh = async () => {
        await handleFetchFiles();
    };

    const handleDeleteAll = async () => {
        const confirm = window.confirm(`¿Eliminar todos los archivos?`);
        if (confirm) {
            await deleteAllFiles();
        }
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setFileInput({
            ...inputSearch,
            [name]: value
        });
    };

    useEffect(() => {
        const acciones = [
            // {
            //     key: 'crear',
            //     element: (
            //         <button
            //             onClick={handleModal}
            //             className={`p-2 rounded-lg transition-all duration-300
            //                 ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
            //                 hover:scale-95 shadow-lg hover:shadow-xl`}
            //             title="Crear un QR a partir de texto"
            //             data-tooltip-id="createQRLabel"
            //             data-tooltip-content="Crear un QR a partir de texto"
            //         >
            //             <span className="text-3xl">
            //                 <MdAdd className='text-2xl'/>
            //             </span>
            //         </button>
            //     )
            // },
            {
                key: 'refrescar',
                element: (
                    <button
                        onClick={handleRefresh}
                        className={`p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                            hover:scale-95 shadow-lg hover:shadow-xl`}
                        title="Actualizar lista"
                        data-tooltip-id="refreshLabel"
                        data-tooltip-content="Actualizar la lista de archivos"
                    >
                        <span className="text-3xl">
                            <HiOutlineRefresh className='text-2xl'/>
                        </span>
                    </button>
                )
            }
        ];

        const boton_borrar = {
            key: 'borrar_todos',
            element: (
                <div className="flex justify-center">
                    <button
                        className={`flex p-2 rounded-lg transition-all duration-300
                            ${isDark ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-red-500 text-gray-900 hover:bg-red-600'
                            }
                            hover:scale-95 shadow-lg hover:shadow-xl
                        `}
                        title="Eliminar todos"
                        onClick={handleDeleteAll}
                        data-tooltip-id="deleteAllLabel"
                        data-tooltip-content="Eliminar todos los archivos"
                    >
                        <MdDeleteSweep className="text-2xl" />
                    </button>
                    <ReactTooltip id="deleteAllLabel" place="top" effect="solid" />
                </div>
            )
        }
    
        if (!showModal) {
            // Solo muestra el boton de eliminar si hay archivos (antes del boton recargar)
            const refreshIndex = acciones.findIndex(a => a.key === 'refrescar');
            if (fileList.length > 0 && refreshIndex !== -1) {
                acciones.splice(refreshIndex, 0, boton_borrar);
            }

            // Solo muestra las acciones si no hay modales abiertos
            setNavActionsItems(acciones);
        }
    }, [showModal, isDark, fileList]); // Se actualiza cuando cambia el tema o el modal    

    useEffect(() => {
        if (fileList.length === 0) {
            handleFetchFiles();
        }
    }, []);

    return (
        <>
            <h2 className="text-2xl text-center font-bold">
                Archivos subidos
            </h2>
            {
                loadingFiles ? (
                    <LoadingCard />
                ) : fileList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {
                            fileList.map((file, index) => (
                                <FlipCard
                                    key={index}
                                    file={file}
                                    handleOnClick={handleClick}
                                    isDark={isDark}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-gray-400 h-full">
                        <p className="text-center font-bold italic">
                            No hay archivos subidos
                        </p>
                    </div>
                )
            }
            {
                showModal && <ViewFilesModal fileInfo={selectedFile} handleModal={handleModal} />
            }
        </>
    )
}

export default FilesPage
