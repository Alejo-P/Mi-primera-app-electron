import React from 'react'
import { TiInfoLarge } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';

// Importamos el contexto
import { useApp } from '../contexts/AppProvider';

const NotFound = () => {
    const { tema } = useApp();
    const isDark = tema === 'oscuro';
    const navigate = useNavigate();

    const handleNavvigate = () => {
        navigate('/dashboard/');
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn`}>
            <div
                className={`p-6 rounded-lg shadow-lg w-3/5 min-w-[525px] max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl
                    ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                    relative flex flex-col items-center max-h-screen overflow-auto`
                }
            >
                <TiInfoLarge className="text-5xl text-blue-500" />
                <h2 className="text-xl md:text-2xl text-center font-bold">
                    Página no encontrada
                </h2>
                <p className="text-center mt-2">
                    La página que buscas no existe. Por favor, verifica la URL.
                </p>
                <button
                    onClick={handleNavvigate}
                    className={`mt-4 px-4 py-2 rounded-lg text-white font-bold
                        ${isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'}
                    `}
                >
                    Volver
                </button>
            </div>
        </div>
    )
}

export default NotFound
