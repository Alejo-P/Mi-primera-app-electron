import React, { useEffect } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { IoClose } from "react-icons/io5";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

// Importamos los componentes
import NavActions from '../components/NavActions';

const ViewFilesModal = ({ fileInfo, handleModal }) => {
    const { fileTypes, setVisibleNav, visibleNav, tema } = useApp();
    const isDark = tema === 'oscuro';

    const ReloadNav = () => {
        setVisibleNav(false);
        setTimeout(() => {
            setVisibleNav(true);
        }, 200);
    };

    const handleClose = async () => {
        ReloadNav();
        setTimeout(() => {
            handleModal();
        }, 200);
    };

    useEffect(() => {
        ReloadNav();
    }, []);

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn`}>
            <div className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                relative flex flex-col items-center max-h-screen overflow-auto`
            }>
                <h2 className="text-xl md:text-2xl text-center font-bold">
                    {fileInfo.filename}
                </h2>

                {
                    fileTypes.documents.includes(fileInfo.filename.split('.').pop()) ? (
                        <iframe
                            id="pdfViewer"
                            className="w-full h-[300px] md:h-[400px] lg:h-[500px] mt-4"
                            src={fileInfo.url}
                        ></iframe>
                    ) : (
                        <img
                            id="imageViewer"
                            className={`w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl
                                h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[500px] mt-4 border-3 p-3 rounded-lg shadow-lg
                                ${isDark ? 'border-gray-700' : 'border-gray-300'}
                            `}
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
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-red-600 text-white' : 'bg-red-400 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            data-tooltip-id='closeLabel'
                            data-tooltip-content='Cerrar el modal'
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
