import React, { useEffect, useState } from 'react'
import { MdDeleteSweep, MdAdd } from "react-icons/md";

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';
import { useQR } from '../contexts/QRProvider';

// Importamos los componentes
import QRCard from '../components/QRCard';
import LoadingCard from '../components/LoadingCard';

const QRPage = () => {
    const { tema } = useApp();
    const { qrList, getQRs, getQR, deleteAllQRs, loadingQRs } = useQR();
    const [QRInfo, setQRInfo] = useState([]);
    const isDark = tema === 'oscuro';

    useEffect(() => {
        if (qrList.length === 0) {
            getQRs();
        }

    }, []); // Se ejecuta cada vez que qrList cambia
    return (
        <>
            <div className={`overflow-x-auto shadow-lg p-3 sm:rounded-lg w-full
                ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300
            `}>
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
                                    <QRCard key={index} QRName={qr.filename} QRImage={qr.url} />
                                ))
                            }
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-4">
                            <p className="text-center text-gray-500 font-bold italic">
                                No hay QRs generados
                            </p>
                        </div>
                    )
                }
                {
                    qrList.length > 0 && (
                        <div className="flex justify-center">
                            <button
                                className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                title="Eliminar todos"
                            >
                                <span className="text-white flex text-center items-center space-x-2">
                                    {/* <!-- Imagen con trazos blancos--> */}
                                    <MdDeleteSweep className='text-xl' />
                                    <p className="font-bold">Eliminar todos</p>
                                </span>
                            </button>
                        </div>
                    )
                }
            </div>
            
            {/* <!-- Modal para la creacion de un QR mediante texto--> */}

            {
                !loadingQRs && (
                    <>
                        <div className="fixed bottom-6 right-6 flex flex-col items-center align-center">
                            <button
                                href="javascript:openModal()"
                                className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-lg shadow-[0_0_15px_4px_rgba(59,130,246,0.7)] hover:shadow-[0_0_25px_6px_rgba(59,130,246,1)] hover:scale-110 transition-transform duration-300 animate-all"
                                title="Crear un QR a partir de texto"
                            >
                                <span className="text-3xl">
                                    <MdAdd className="text-2xl"/>
                                </span>
                            </button>
                        </div>
                    </>
                )
            }

        </>
    )
}

export default QRPage
