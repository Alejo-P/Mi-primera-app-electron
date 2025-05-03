import React, { useEffect, useState } from 'react'
import { MdDeleteSweep } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { HiOutlineRefresh } from 'react-icons/hi';

// Importamos las constantes
import { THEMES } from '../constants/temas';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';
import { useFiles } from '../contexts/FilesProvider';

// Importamos los componentes
import QRCard from '../components/QRCard';
import LoadingCard from '../components/LoadingCard';
import CreateQRModal from '../modals/CreateQRModal';

const QRPage = () => {
    const { tema, setVisibleNav, setNavActionsItems } = useApp();
    const { qrList, getQRs, deleteAllQRs, loadingQRs} = useQR();
    const { setFileList } = useFiles();
    const [showModal, setShowModal] = useState(false);
    const [QRInfo, setQRInfo] = useState([]);
    const isDark = tema === THEMES.DARK;

    const handleModal = () => {
        setShowModal(!showModal);
    };

    const handleFetchQRs = async () => {
        setVisibleNav(false);
        await getQRs();
        setVisibleNav(true);
    };

    const handleRefresh = async () => {
        await handleFetchQRs();
    };

    const handleDeleteAll = async () => {
        const confirm = window.confirm(`¿Eliminar todos los QRs?`);
        if (confirm) {
            const success = await deleteAllQRs();
            await getQRs();
            if (success) {
                setFileList((prev) => {
                    return prev.map((f) => {
                        return { ...f, qr_code: null };
                    });
                })
            }
        }
    };

    useEffect(() => {
        if (!showModal) {
            const acciones = [
                {
                    key: 'crear',
                    element: (
                        <button
                            onClick={handleModal}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            title="Crear un QR a partir de texto"
                            data-tooltip-id="QRLabel"
                            data-tooltip-content="Crear un código QR a partir de un texto"
                        >
                            <IoMdAdd className="text-2xl" />
                        </button>
                    )
                },
                {
                    key: 'refrescar',
                    element: (
                        <button
                            onClick={handleRefresh}
                            className={`p-2 rounded-lg transition-all duration-300
                                ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-900 hover:bg-gray-400'} 
                                hover:scale-95 shadow-lg hover:shadow-xl`}
                            title="Actualizar lista"
                            data-tooltip-id="RefreshLabel"
                            data-tooltip-content="Actualizar la lista de QRs"
                        >
                            <HiOutlineRefresh className="text-2xl" />
                        </button>
                    )
                }
            ];
            setNavActionsItems(acciones);
        }
    }, [showModal, isDark]); // Se ejecuta cuando cambia el estado del modal o el tema    

    useEffect(() => {
        if (qrList.length === 0) {
            handleFetchQRs();
        }

    }, []); // Se ejecuta cada vez que qrList cambia
    return (
        <>
            <h2 className="text-2xl text-center font-bold">
                QRs generados
            </h2>
            {
                loadingQRs ? (
                    <LoadingCard />
                ) : qrList.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {
                            qrList.map((qr, index) => (
                                <QRCard key={index} QRInfo={qr} isDark={isDark} />
                            ))
                        }
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-gray-400">
                        <p className="text-center font-bold italic">
                            No hay QRs generados
                        </p>
                    </div>
                )
            }
            {
                (qrList.length > 0 && !loadingQRs) && (
                    <div className="flex justify-center">
                        <button
                            className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            title="Eliminar todos"
                            onClick={handleDeleteAll}
                            data-tooltip-id='deleteAllLabel'
                            data-tooltip-content='Eliminar todos los QRs generados'
                        >
                            <span className="text-white flex text-center items-center space-x-2">
                                {/* <!-- Imagen con trazos blancos--> */}
                                <MdDeleteSweep className='text-xl' />
                                <p className="font-bold">Eliminar todos</p>
                            </span>
                        </button>
                        <ReactTooltip id="deleteAllLabel" place="top" effect="solid" className='text-white bg-white text-sm'/>
                    </div>
                )
            }
            { showModal && <CreateQRModal handleModal={handleModal} />}
        </>
    )
}

export default QRPage
