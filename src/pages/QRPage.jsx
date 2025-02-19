import React, { useEffect, useState } from 'react'
import { HiHome } from "react-icons/hi";
import { MdDeleteSweep, MdAdd } from "react-icons/md";
import { Link } from 'react-router-dom';

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

    useEffect(() => {
        if (qrList.length === 0) {
            getQRs();
        }

    }, []); // Se ejecuta cada vez que qrList cambia
    return (
        <>
            <div className="relative overflow-x-auto shadow-lg sm:rounded-lg m-3 p-3 bg-white w-full">
                <h2 className="text-2xl text-center text-slate-800 font-bold">
                    QRs generados
                </h2>

                {
                    loadingQRs ? (
                        <LoadingCard />
                    ) : qrList.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
                
            </div>
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

                        <Link
                            to="/dashboard/"
                            className="fixed bottom-6 left-6 bg-blue-500 text-white w-14 h-14 flex items-center justify-center rounded-lg shadow-[0_0_15px_4px_rgba(59,130,246,0.7)] hover:shadow-[0_0_25px_6px_rgba(59,130,246,1)] hover:scale-110 transition-transform duration-300 animate-all"
                            title="Regresar al inicio"
                        >
                            <span className="text-3xl">
                                <HiHome className="text-2xl"/>
                            </span>
                        </Link>
                    </>
                )
            }

        </>
    )
}

export default QRPage
