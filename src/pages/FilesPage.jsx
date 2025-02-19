import React, { useEffect, useState } from 'react'
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiOutlineRefresh } from 'react-icons/hi';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useFiles } from '../contexts/FilesProvider';

// Importamos los componentes
import FileCard from '../components/FileCard';
import ViewFilesModal from '../modals/ViewFilesModal';
import LoadingCard from '../components/LoadingCard';
import NavActions from '../components/NavActions';

const FilesPage = () => {
    const { selectedFile, tema, setVisibleNav } = useApp();
    const { fileList, getFiles, deleteAllFiles, loadingFiles } = useFiles();
    const [showModal, setShowModal] = useState(false);
    const isDark = tema === 'oscuro';

    const handleModal = () => {
        setShowModal(!showModal);
    };

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

    useEffect(() => {
        
        if (fileList.length === 0) {
            handleFetchFiles();
        }
    }, []);

    return (
        <>
            <div className={`overflow-x-auto shadow-lg p-3 sm:rounded-lg w-full
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300
            `}>
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
                                    <FileCard key={index} fileName={file.filename} fileImage={file.url} showModal={handleModal}/>
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
            </div>
            {
                showModal && <ViewFilesModal fileInfo={selectedFile} handleModal={handleModal} />
            }
            {
                !showModal && (
                    <NavActions>
                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            title="Actualizar lista"
                            data-tooltip-id="RefreshLabel"
                            data-tooltip-content="Actualizar la lista de archivos"
                        >
                            <span className="text-3xl">
                                <HiOutlineRefresh className='text-2xl'/>
                            </span>
                        </button>
                        <ReactTooltip id="RefreshLabel" place="top" effect="solid" className='text-white bg-white text-sm'/>
                    </NavActions>
                )
            }
        </>
    )
}

export default FilesPage
