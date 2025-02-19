import React, { useEffect, useState } from 'react'
import { HiHome } from "react-icons/hi";
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { HiOutlineRefresh } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useFiles } from '../contexts/FilesProvider';

// Importamos los componentes
import FileCard from '../components/FileCard';
import ViewFilesModal from '../modals/ViewFilesModal';
import LoadingCard from '../components/LoadingCard';

const FilesPage = () => {
    const { selectedFile } = useApp();
    const { fileList, getFiles, deleteAllFiles, loadingFiles } = useFiles();
    const [showModal, setShowModal] = useState(false);

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

            <div className="relative overflow-x-auto shadow-lg sm:rounded-lg m-3 p-3 bg-white w-full">
                <h2 className="text-2xl text-center text-slate-800 font-bold">
                    Archivos subidos
                </h2>
                {
                    loadingFiles ? (
                        <LoadingCard />
                    ) : fileList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
            </div>
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
            
            {
                showModal && <ViewFilesModal fileInfo={selectedFile} />
            }
            {
                !loadingFiles && (
                    <>
                        <Link
                            to="/dashboard/"
                            className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center text-center justify-center rounded-lg shadow-[0_0_15px_4px_rgba(130,129,129,0.7)] hover:shadow-[0_0_25px_6px_rgba(130,129,129,1)] hover:scale-110 transition-transform duration-300 animate-all mb-4"
                            title="Ir a inicio"
                            data-tooltip-id="homeLabel"
                            data-tooltip-content="Ir a inicio"
                        >
                            <HiHome className='text-2xl' />
                        </Link>
                        <ReactTooltip id='homeLabel' place='top' />
                    </>
                )
            }
        </>
    )
}

export default FilesPage
