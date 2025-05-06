import React, { useEffect, useState } from 'react'
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiOutlineRefresh } from 'react-icons/hi';
import { LuFileSearch2,LuFileUser } from "react-icons/lu";
import { FaBars, FaTimes } from 'react-icons/fa';

// Importamos las constantes
import { THEMES } from '@constants/temas';
import { ROLES } from '@constants/roles';

// Importamos el contexto
import { useAuth } from '@contexts/AuthProvider';
import { useApp } from '@contexts/AppProvider';
import { useFiles } from '@contexts/FilesProvider';

// Importamos los componentes
import ViewFilesModal from '@modals/ViewFilesModal';
import LoadingCard from '@components/LoadingCard';
import FlipCard from '@components/FlipCard';

const FilesPage = () => {
    const { user } = useAuth();
    const { selectedFile, setSelectedFile, tema, setVisibleNav, visibleToolbar, setNavActionsItems } = useApp();
    const { fileList, getFiles, deleteAllFiles, loadingFiles } = useFiles();
    const [showModal, setShowModal] = useState(false);
    const [inputSearch, setFileInput] = useState({
        fileSearch: '',
        userSearch: ''
    });
    const [sidebarOpen, setSidebarOpen] = useState(false);
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
            await getFiles();
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
    
        if (!showModal) {
            // Solo muestra las acciones si no hay modales abiertos
            setNavActionsItems(acciones);
        }
    }, [showModal, isDark]); // Se actualiza cuando cambia el tema o el modal    

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
                    <div className={`grid items-center justify-center flex-1 text-gray-400 transition-all duration-300`}>
                        <p className="text-center font-bold italic">No hay archivos subidos</p>
                    </div>
                )
            }
            {
                (fileList.length > 0 && !loadingFiles) && (
                    <div className="flex justify-center">
                        <button
                            className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            title="Eliminar todos"
                            onClick={handleDeleteAll}
                            data-tooltip-id="deleteAllLabel"
                            data-tooltip-content="Eliminar todos los archivos"
                        >
                            <MdDeleteSweep className="text-2xl" />
                            <p className="font-bold">Eliminar todos</p>
                        </button>
                        <ReactTooltip id="deleteAllLabel" place="top" effect="solid" />
                    </div>
                )
            }
            {
                showModal && <ViewFilesModal fileInfo={selectedFile} handleModal={handleModal} />
            }
            {
                (visibleToolbar && user?.roles.includes(ROLES.ADMIN)) && (
                    <>
                        {/* Sidebar de navegación */}
                        <div className={`fixed top-10 right-0 h-[calc(100%-40px)] shadow-lg transition-all duration-300 rounded-tl-xl rounded-bl-xl
                            ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                            ${sidebarOpen ? 'w-64 p-4' : 'w-12 p-2 bg-transparent'}
                        `}>
                            <button
                                className="mb-4 text-xl transition-all duration-300"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                {sidebarOpen ? <FaTimes /> : <FaBars />}
                            </button>

                            <div
                                className={`flex items-center justify-between mb-4 transition-all duration-300 border-b-2 border-gray-300 pb-4
                                    ${sidebarOpen ? 'opacity-100' : 'opacity-0'}
                                `}
                            >
                                <div className={`flex flex-col gap-4 ${sidebarOpen ? 'block' : 'hidden'} transition-all duration-300`}>
                                    {[
                                        { icon: <LuFileSearch2 className="text-2xl" />, placeholder: "Buscar archivo", title: "Buscar archivo", name: "fileSearch" },
                                        { icon: <LuFileUser className="text-2xl" />, placeholder: "Buscar por usuario", title: "Buscar por usuario", name: "userSearch" },
                                    ].map((item, index) => (
                                        <div key={index} className={`relative group transition-all duration-300
                                            ${inputSearch[item.name] !== "" ? 'w-full   ' : 'w-12 hover:w-full'}
                                        `}>
                                            <input
                                                type="text"
                                                id={item.name}
                                                name={item.name}
                                                className={`
                                                    w-full p-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                                                    ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900'}
                                                    transition-all duration-300
                                                `}
                                                value={inputSearch[item.name]}
                                                onChange={handleChangeInput}
                                                placeholder={item.placeholder}
                                                title={item.title}
                                            />
                                            <div className="absolute top-2 left-3 text-white group-hover:text-gray-500 transition-all duration-300 text-center">
                                                {item.icon}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </>
                )
            }
        </>
    )
}

export default FilesPage
