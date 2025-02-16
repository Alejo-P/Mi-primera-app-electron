import React, { useEffect, useState } from 'react'
import { FaDownload } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";

const QRCard = ({ QRName, QRImage }) => {
    console.log(QRName, QRImage);
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg bg-gray-100">
            {/* <!-- Aquí se insertarán los QRs --> */}
            <img 
                alt='QR Code'
                className='w-64 h-64 rounded-lg border border-gray-300'
                src={QRImage}
            />
            <p className="mt-4 w-48 text-lg text-center text-blue-500 font-semibold overflow-hidden whitespace-nowrap overflow-ellipsis">
                {QRName}
            </p>
            <div className='flex justify-center mt-4 space-x-4'>
                <button
                    className="flex bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                    title="Descargar"
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <FaDownload className='text-xl' />
                        <p className="font-bold">Descargar</p>
                    </span>
                </button>
                <button
                    className="flex bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    title="Eliminar"
                >
                    <span className="text-white flex text-center items-center space-x-2">
                        <MdDeleteForever className='text-xl' />
                        <p className="font-bold">Eliminar</p>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default QRCard
