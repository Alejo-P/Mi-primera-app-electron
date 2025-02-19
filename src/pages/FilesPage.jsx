import React, { useEffect, useState } from 'react'
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { HiOutlineRefresh } from 'react-icons/hi';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useFiles } from '../contexts/FilesProvider';

// Importamos los componentes
import FileCard from '../components/FileCard';
import ViewFilesModal from '../modals/ViewFilesModal';
import LoadingCard from '../components/LoadingCard';

const FilesPage = () => {
    const { selectedFile, tema } = useApp();
    const { fileList, getFiles, deleteAllFiles, loadingFiles } = useFiles();
    const [showModal, setShowModal] = useState(false);
    const isDark = tema === 'oscuro';

    const handleModal = () => {
        setShowModal(!showModal);
    };

    const handleRefresh = () => {
        getFiles();
    };

    useEffect(() => {
        if (fileList.length === 0) {
            getFiles();
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
                        <div className="flex items-center justify-center">
                            <p className="text-lg text-gray-500">No hay archivos subidos</p>
                        </div>
                    )
                }
                {
                    fileList.length > 0 && (
                        <div className="flex justify-center">
                            <button
                                className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                title="Eliminar todos"
                                onClick={deleteAllFiles}
                            >
                                <MdDeleteSweep className="text-2xl" />
                                <p className="font-bold">Eliminar todos</p>
                            </button>
                        </div>
                    )
                }
            </div>
            {
                showModal && <ViewFilesModal fileInfo={selectedFile} />
            }
        </>
    )
}

export default FilesPage
