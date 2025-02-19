import React, { useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

// Importamos los componentes
import NavActions from '../components/NavActions';

const ViewFilesModal = ({ fileInfo, handleModal }) => {
    const { fileTypes, setVisibleNav, visibleNav } = useApp();

    const ReloadNav = () => {
        setVisibleNav(false);
        setTimeout(() => {
            setVisibleNav(true);
        }, 250);
    };

    const handleClose = async () => {
        ReloadNav();
        setTimeout(() => {
            handleModal();
        }, 250);
    };

    useEffect(() => {
        ReloadNav();
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 relative overflow-hidden flex flex-col items-center" id="modalContent">
            <h2 className="text-2xl text-center text-slate-800 font-bold">
                {fileInfo.filename}
            </h2>

            {
                fileTypes.documents.includes(fileInfo.filename.split('.').pop()) ? (
                    <iframe
                        id="pdfViewer"
                        className="w-full h-[500px] mt-4"
                        src={fileInfo.url}
                    ></iframe>
                ) : (
                    <img
                        id="imageViewer"
                        className="w-auto h-4/5 md:h-[400px] mt-4 border-3 p-3 rounded-lg border-gray-300"
                        src={fileInfo.url}
                        alt="Imagen"
                    />
                )
            }
        </div>
        {
            visibleNav && (
                <NavActions>
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg shadow-md transition-all duration-300"
                        data-tooltip-id='closeLabel'
                        data-tooltip-content='Cerrar'
                    >
                        <span className="text-3xl">
                            <IoClose className='text-2xl'/>
                        </span>
                    </button>
                    <ReactTooltip id='closeLabel' place="top" effect="solid" className='text-white bg-white text-sm' />
                </NavActions>
            )
        }
    </div>
    )
}

export default ViewFilesModal
